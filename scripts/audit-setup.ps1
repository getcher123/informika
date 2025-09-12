Param(
  [string]$Owner,
  [string]$Repo,
  [int]$Project,
  [switch]$GraphQL
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

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI 'gh' not found. Install it (winget install --id GitHub.cli -e)."
}
try { gh auth status | Out-Null } catch { Write-Warning "Not authenticated in gh. Run 'gh auth login'." }

if (-not $Owner -or -not $Repo) {
  # try detect from git
  try {
    $url = git config --get remote.origin.url 2>$null
    if ($url -and $url -match "github.com[:/](?<owner>[^/]+)/(?<repo>[^\.]+)(\.git)?$") {
      if (-not $Owner) { $Owner = $Matches['owner'] }
      if (-not $Repo)  { $Repo  = $Matches['repo'] }
    }
  } catch {}
}
if (-not $Owner -or -not $Repo) { Write-Error "Pass -Owner and -Repo or run inside a git repo with GitHub remote." }

$GHREPO = "$Owner/$Repo"
Write-Host "> Auditing repository: $GHREPO" -ForegroundColor Cyan

# 1) Repo core flags / issues
Write-Host "\n[1/6] Repo / Issues settings" -ForegroundColor Yellow
$repoInfo = Invoke-GhJson ("gh api repos/$GHREPO")
if ($repoInfo) {
  [pscustomobject]@{
    repo            = $repoInfo.full_name
    private         = $repoInfo.private
    issues_enabled  = $repoInfo.has_issues
    archived        = $repoInfo.archived
    default_branch  = $repoInfo.default_branch
  } | Format-List
} else { Write-Warning "Cannot read repo info." }

Write-Host "\nLabels (top 20):" -ForegroundColor DarkCyan
try { gh label list -R $GHREPO | Select-Object -First 20 | ForEach-Object { $_ } } catch { Write-Warning "Cannot list labels." }

Write-Host "\nIssue templates (.github/ISSUE_TEMPLATE):" -ForegroundColor DarkCyan
$tmpl = Invoke-GhJson ("gh api repos/$GHREPO/contents/.github/ISSUE_TEMPLATE?ref=main")
if ($tmpl) { $tmpl | ForEach-Object { $_.name } } else { Write-Host "(none or branch not main)" }

# 2) Milestones
Write-Host "\n[2/6] Milestones" -ForegroundColor Yellow
$ms = Invoke-GhJson ("gh api repos/$GHREPO/milestones?state=all")
if ($ms) {
  $ms | Select-Object @{n='title';e={$_.title}}, @{n='due_on';e={$_.due_on}}, state, open_issues, closed_issues | Format-Table -AutoSize
} else { Write-Host "(no milestones)" }

# 3) Projects v2 list
Write-Host "\n[3/6] Projects v2 for owner: $Owner" -ForegroundColor Yellow
$plist = Invoke-GhJson ("gh project list --owner `"$Owner`" --format json")
if ($plist) {
  $plist | Select-Object number, title, state | Format-Table -AutoSize
  if (-not $Project) {
    $Project = ($plist | Sort-Object number -Descending | Select-Object -First 1).number
    Write-Host "Selected latest project #: $Project" -ForegroundColor DarkGray
  }
} else { Write-Host "(no projects or no access)" }

if ($Project) {
  # 4) Fields of the selected Project
  Write-Host "\n[4/6] Project fields (Project #$Project)" -ForegroundColor Yellow
  $fields = Invoke-GhJson ("gh project field-list $Project --owner `"$Owner`" --format json")
  if ($fields) {
    $fields | Select-Object @{n='name';e={$_.name}}, @{n='dataType';e={$_.dataType}} | Format-Table -AutoSize
    $columnsField = $fields | Where-Object { $_.name -eq 'Columns' -or $_.name -eq 'Board Columns' }
    if ($columnsField) { Write-Host "Columns field present: $($columnsField.name)" -ForegroundColor DarkGray } else { Write-Host "Columns field not found" -ForegroundColor DarkGray }
    $estimateField = $fields | Where-Object { $_.name -eq 'Estimate' }
    if ($estimateField) { Write-Host "Estimate field present" -ForegroundColor DarkGray } else { Write-Host "Estimate field not found" -ForegroundColor DarkGray }
    $dueField = $fields | Where-Object { $_.name -eq 'Due date' }
    if ($dueField) { Write-Host "Due date field present" -ForegroundColor DarkGray } else { Write-Host "Due date field not found" -ForegroundColor DarkGray }
  } else { Write-Host "(cannot read fields; need read:project)" }

  # 5) Items summary
  Write-Host "\n[5/6] Project items (first 20)" -ForegroundColor Yellow
  $itemsData = Invoke-GhJson ("gh project item-list $Project --owner `"$Owner`" --format json")
  if ($itemsData) {
    $items = $itemsData.items
    $items | Select-Object @{n='title';e={$_.title}}, @{n='type';e={$_.type}}, @{n='repo';e={$_.content.repository}}, @{n='number';e={$_.content.number}} | Select-Object -First 20 | Format-Table -AutoSize
    Write-Host ("Total items: {0}" -f $items.Count) -ForegroundColor DarkGray
  } else { Write-Host "(cannot list items)" }

  # 6) GraphQL Status options (optional)
  if ($GraphQL) {
    Write-Host "\n[6/6] GraphQL: Status options" -ForegroundColor Yellow
    $gql = @'
query($owner:String!, $number:Int!) {
  user(login:$owner) {
    projectV2(number:$number) {
      fields(first:50) {
        nodes {
          __typename
          ... on ProjectV2SingleSelectField { name options { name } }
        }
      }
    }
  }
}
'@
    # Pass GraphQL query via temp file to avoid quoting issues
    $tmp = [System.IO.Path]::GetTempFileName()
    try {
      Set-Content -LiteralPath $tmp -Value $gql -Encoding UTF8
      $resp = Invoke-GhJson ("gh api graphql -f query=@$tmp -F owner=$Owner -F number=$Project")
    } finally { try { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue } catch {} }
    if ($resp) {
      $nodes = $resp.data.user.projectV2.fields.nodes | Where-Object { $_.__typename -eq 'ProjectV2SingleSelectField' -and $_.name -eq 'Status' }
      if ($nodes) { $nodes.options | ForEach-Object { $_.name } } else { Write-Host "Status field not visible via GraphQL" }
    } else { Write-Host "(no GraphQL response)" }
  }
}

Write-Host "\nAudit complete." -ForegroundColor Green
