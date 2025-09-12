Param(
  [string]$Owner,
  [string]$Repo,
  [string]$Lead = "EVA99999999",
  [ValidateSet("pull","triage","push","maintain","admin")]
  [string]$LeadPermission = "maintain",
  [int]$Project,
  [string]$ProjectTitle = "Team Board",
  [switch]$NoSamples,
  [int]$ColumnsCount = 5,
  [switch]$AssignLeadToAll
)

$ErrorActionPreference = 'Stop'

function Invoke-GhJson {
  param([Parameter(Mandatory=$true)][string]$Command)
  try {
    $raw = Invoke-Expression $Command
    if (-not $raw) { return $null }
    return ($raw | ConvertFrom-Json)
  } catch { return $null }
}

# Получить сведения о системном поле Status и ID опции Backlog через GraphQL
function Get-ProjectStatusFieldInfo {
  param([Parameter(Mandatory=$true)][string]$ProjectId)

  $gql = @'
query($projectId:ID!) {
  node(id:$projectId) {
    ... on ProjectV2 {
      id
      fields(first:100) {
        nodes {
          __typename
          ... on ProjectV2SingleSelectField {
            id
            name
            options { id name }
          }
        }
      }
    }
  }
}
'@

  $raw = gh api graphql -f query="$gql" -F projectId=$ProjectId 2>$null
  if (-not $raw) { return $null }
  $data = $raw | ConvertFrom-Json
  if (-not $data) { return $null }

  $ss = $data.data.node.fields.nodes | Where-Object { $_.__typename -eq 'ProjectV2SingleSelectField' }
  $status = $ss | Where-Object { $_.name -eq 'Status' } | Select-Object -First 1
  if (-not $status) { return $null }

  $opt = $status.options | Where-Object { $_.name -in @('Backlog','To do','Todo','Ready') } | Select-Object -First 1
  if (-not $opt) { $opt = $status.options | Select-Object -First 1 }

  [pscustomobject]@{
    StatusFieldId   = $status.id
    BacklogOptionId = $opt.id
  }
}


function Get-GHRepoFromGit {
  try {
    $url = git config --get remote.origin.url 2>$null
  } catch { $url = $null }
  if (-not $url) { return $null }
  if ($url -match "github.com[:/](?<owner>[^/]+)/(?<repo>[^\.]+)(\.git)?$") {
    return "{0}/{1}" -f $Matches['owner'], $Matches['repo']
  }
  return $null
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI 'gh' not found. Install it (winget install --id GitHub.cli -e) and retry."
}

try { gh auth status | Out-Null } catch {
  Write-Warning "Not authenticated in gh. Run 'gh auth login' in this session."
}

if (-not $Owner -or -not $Repo) {
  $detected = Get-GHRepoFromGit
  if ($detected) {
    $Owner, $Repo = $detected.Split('/')
  } else {
    throw "Cannot detect repository. Pass -Owner and -Repo or set git remote.origin.url."
  }
}

$GHREPO = "$Owner/$Repo"
Write-Host "> Repo: $GHREPO" -ForegroundColor Cyan
Write-Host "> Lead: $Lead (permission=$LeadPermission)" -ForegroundColor Cyan

# 1) Включаем Issues
Write-Host "1) Enabling Issues..." -ForegroundColor Yellow
gh repo edit $GHREPO --enable-issues

# 2) Добавляем лида с заданными правами
Write-Host "2) Adding lead as collaborator..." -ForegroundColor Yellow
gh api -X PUT "repos/$GHREPO/collaborators/$Lead" -f permission=$LeadPermission | Out-Null

# 3) Метки (labels)
Write-Host "3) Creating base labels..." -ForegroundColor Yellow
  gh label create -R $GHREPO "bug"            --color D73A4A   --force
  gh label create -R $GHREPO "enhancement"    --color A2EEEF   --force
  gh label create -R $GHREPO "documentation"  --color 0075CA   --force
  gh label create -R $GHREPO "chore"          --color C5DEF5   --force
  gh label create -R $GHREPO "P0"             --color FF0000   --description "Critical" --force
  gh label create -R $GHREPO "P1"             --color FBCA04   --description "High"     --force
  gh label create -R $GHREPO "P2"             --color 0E8A16   --description "Normal"   --force

# 4) Создаём вехи (milestones) проекта
Write-Host "4) Creating project milestones..." -ForegroundColor Yellow
try { gh api -X POST "repos/$GHREPO/milestones" -f title="Phase 1 - MVP (Requests and Ideas)" -f due_on="2025-09-29T12:00:00Z" | Out-Null } catch { }
try { gh api -X POST "repos/$GHREPO/milestones" -f title="Phase 2 - Projects and Collaboration" -f due_on="2025-10-20T12:00:00Z" | Out-Null } catch { }
try { gh api -X POST "repos/$GHREPO/milestones" -f title="Phase 3 - Events, Analytics, Notifications" -f due_on="2025-11-14T12:00:00Z" | Out-Null } catch { }

# 5) Проект (v2) и поля/«колонки»
Write-Host "4) Creating/Selecting Project (v2) and fields..." -ForegroundColor Yellow
if ($Project) {
  $projNumber = $Project
} else {
  $projJson = Invoke-GhJson ("gh project create --owner `"$Owner`" --title `"$ProjectTitle`" --format json 2>`$null")
  if (-not $projJson) {
    Write-Warning "Could not create Project (v2). Trying to find existing '$ProjectTitle'..."
    $projListJson = Invoke-GhJson ("gh project list --owner `"$Owner`" --format json 2>`$null")
    if ($projListJson) {
      $existing = $projListJson | Where-Object { $_.title -eq $ProjectTitle } | Select-Object -First 1
      if ($existing) { $projNumber = $existing.number } else { $projNumber = $null }
    } else { $projNumber = $null }
  } else {
    $projNumber = $projJson.number
  }
}

if ($projNumber) {
  $canEditFields = $false
  $projView = Invoke-GhJson ("gh project view $projNumber --owner `"$Owner`" --format json")
  if ($projView) {
    $projId = $projView.id
    $fields = Invoke-GhJson ("gh project field-list $projNumber --owner `"$Owner`" --format json")
    if ($fields) {
      # Пользовательские поля (не системные)
      $priorityField = $fields | Where-Object { $_.name -eq 'Priority' }
      if (-not $priorityField) { try { gh project field-create $projNumber --owner $Owner --name "Priority" --data-type SINGLE_SELECT --single-select-options "P0,P1,P2" 2>$null | Out-Null } catch { } }
      $estimateField = $fields | Where-Object { $_.name -eq 'Estimate' }
      if (-not $estimateField) { try { gh project field-create $projNumber --owner $Owner --name "Estimate" --data-type NUMBER 2>$null | Out-Null } catch { } }
      # Дополнительное поле для колонок борда (пользовательское), чтобы пользователь мог переименовать опции
      $columnsField = $fields | Where-Object { $_.name -eq 'Columns' -or $_.name -eq 'Board Columns' } | Select-Object -First 1
      if (-not $columnsField -and $ColumnsCount -gt 0) {
        $opts = @()
        for ($i=1; $i -le $ColumnsCount; $i++) { $opts += "Column $i" }
        $optsList = ($opts -join ',')
        try { gh project field-create $projNumber --owner $Owner --name "Columns" --data-type SINGLE_SELECT --single-select-options "$optsList" 2>$null | Out-Null } catch { }
      }
    }

    # Получаем системный Status и ID опции Backlog через GraphQL
    $projMeta = Get-ProjectStatusFieldInfo -ProjectId $projId
    if ($projMeta) {
      $statusFieldId   = $projMeta.StatusFieldId
      $backlogOptionId = $projMeta.BacklogOptionId
      if ($statusFieldId -and $backlogOptionId) { $canEditFields = $true }
    } else {
      Write-Warning "Не удалось получить системное поле Status через GraphQL. Пропускаю авто-установку статуса."
      $canEditFields = $false
    }
  } else {
    Write-Warning "Cannot read/edit project fields (missing read:project or CLI support). Will only add items to project."
  }
}

# 5) Одна тестовая задача и добавление в доску
Write-Host "5) Creating a single sample issue..." -ForegroundColor Yellow
$i1Num = $null
if (-not $NoSamples) {
  # Avoid duplicates by checking existing issues by title
  $cmd1 = ('gh issue list -R "{0}" --search "\"Setup CI (PHP/Node linters)\" in:title" --json number,url -L 1 2>$null' -f $GHREPO)
  $check1 = Invoke-GhJson $cmd1
  if ($check1 -and $check1.Count -gt 0) {
    $i1Num = $check1[0].number
    Write-Host "   • Found existing: Setup CI (PHP/Node linters) #$i1Num" -ForegroundColor DarkGray
  } else {
    $i1Url = gh issue create -R $GHREPO -t "Setup CI (PHP/Node linters)" -b "Configure GitHub Actions: php-cs-fixer, phpstan, prettier, eslint, stylelint" -l "chore,P1"
    $i1Num = [int]($i1Url.Trim() -replace '.*/','')
  }
  # Назначаем лидера исполнителем на тестовую задачу (если это issue)
  if ($i1Num) {
    try { gh issue edit -R $GHREPO $i1Num --add-assignee $Lead | Out-Null } catch { Write-Warning "Assign lead failed for sample issue" }
  }
} else {
  Write-Host "   • Skipped (NoSamples)" -ForegroundColor DarkGray
}

if ($projNumber) {
  Write-Host "Adding sample issues to Project (v2)..." -ForegroundColor Yellow
  if ($i1Num) {
    try {
      $i1Add = gh project item-add $projNumber --owner $Owner --url "https://github.com/$GHREPO/issues/$i1Num" --format json | ConvertFrom-Json
      if ($canEditFields -and $i1Add -and $i1Add.id) { gh project item-edit --id $i1Add.id --project-id $projId --field-id $statusFieldId --single-select-option-id $backlogOptionId | Out-Null }
    } catch { Write-Warning "Skip sample issue #${i1Num}: $($_.Exception.Message)" }
  }

  # Optionally add all open issues to project and set Backlog
  Write-Host "Adding all open issues (up to 50) to Project..." -ForegroundColor Yellow
  $openIssues = Invoke-GhJson ("gh issue list -R `"$GHREPO`" -s open -L 50 --json number,url 2>`$null")
  foreach ($iss in $openIssues) {
    try {
      if ($AssignLeadToAll -and $iss.number) {
        try { gh issue edit -R $GHREPO $iss.number --add-assignee $Lead | Out-Null } catch { Write-Warning "Assign lead failed for #$($iss.number): $($_.Exception.Message)" }
      }
      $added = gh project item-add $projNumber --owner $Owner --url $iss.url --format json | ConvertFrom-Json
      if ($canEditFields -and $added -and $added.id) { gh project item-edit --id $added.id --project-id $projId --field-id $statusFieldId --single-select-option-id $backlogOptionId | Out-Null }
    } catch { Write-Warning "Skip issue #$($iss.number): $($_.Exception.Message)" }
  }
  if (-not $canEditFields) {
    Write-Warning "Status was not set automatically. Tip: in Project → Workflows, enable 'Item added' → set Status=Backlog."
  }
}

Write-Host "`nDone ✅"
Write-Host ("Repo: https://github.com/{0}" -f $GHREPO)
if ($projNumber) { Write-Host ("Project (v2): https://github.com/users/{0}/projects/{1}" -f $Owner, $projNumber) }
