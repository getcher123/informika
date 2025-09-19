<#
Location: scripts/PM/create-issues-for-lead.ps1
Creates onboarding/release tasks for lead EVA99999999:
- Step 1–7 from root README.md
- Architecture review (docs/architecture.md)
- Adds each issue to Projects v2 #11 under user getcher123

Prereqs:
- gh CLI installed and authed: gh auth login
- Repo cloned locally and this script run from repo root
#>

param(
  [string]$Assignee = "EVA99999999",
  [int]$ProjectNumber = 11,
  [string]$ProjectOwner = "getcher123",
  [string]$ContentPath = "$PSScriptRoot/issues.ru.json"
)

# Force UTF-8 console encodings (Windows PowerShell 5.1 safety)
try {
  [Console]::InputEncoding  = New-Object System.Text.UTF8Encoding($false)
  [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
} catch {}

function Get-RepoSlug {
  $remote = git config --get remote.origin.url 2>$null
  if (-not $remote) { throw "Cannot detect git remote.origin.url. Run from repo root." }
  if ($remote -match 'github.com[:/](.+?)/(.+?)(?:\.git)?$') {
    return "$($Matches[1])/$($Matches[2])"
  }
  throw "Unsupported remote URL: $remote"
}

function New-IssueAndAddToProject {
  param(
    [Parameter(Mandatory)] [string]$Title,
    [Parameter(Mandatory)] [string]$Body,
    [string[]]$Labels = @('chore','onboarding')
  )
  $repo = Get-RepoSlug
  $args = @('issue','create','-R', $repo, '-t', $Title, '-b', $Body, '-a', $Assignee)
  if ($Labels -and $Labels.Count -gt 0) {
    $args += @('-l', ($Labels -join ','))
  }
  Write-Host "Creating: $Title"
  $url = & gh @args
  if (-not $url) { throw "Failed to create issue: $Title" }
  Write-Host " => $url"
  # Add to Projects v2 under user
  & gh project item-add $ProjectNumber --owner $ProjectOwner --url $url | Out-Null
  return $url
}

# Load issues from external JSON (UTF-8)
if (-not (Test-Path -LiteralPath $ContentPath)) {
  throw "Content file not found: $ContentPath"
}
$issues = Get-Content -LiteralPath $ContentPath -Raw -Encoding UTF8 | ConvertFrom-Json

foreach ($i in $issues) {
  New-IssueAndAddToProject -Title $i.title -Body $i.body -Labels $i.labels | Out-Null
}

Write-Host "All issues created and added to Projects v2 #$ProjectNumber (owner: $ProjectOwner)."
