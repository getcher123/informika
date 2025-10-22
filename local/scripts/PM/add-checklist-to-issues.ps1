<#
Adds a checklist to selected GitHub issues by appending/prepending Markdown
from an external UTF-8 file. Keeps script ASCII-only; Russian text lives in
the checklist file.

Usage examples:
  pwsh ./scripts/PM/add-checklist-to-issues.ps1 -Labels P1,chore \
       -ChecklistPath "$PSScriptRoot/checklists/onboarding.ru.md"

  pwsh ./scripts/PM/add-checklist-to-issues.ps1 -Issue 12,34 \
       -Append:$false -ChecklistPath "$PSScriptRoot/checklists/onboarding.ru.md"

Prereqs:
  - gh CLI installed and authed: gh auth login
  - Run from repo root or pass -Owner/-Repo
#>

param(
  [string]$Owner,
  [string]$Repo,
  [int[]]$Issue,
  [string[]]$Labels,
  [string]$Search,
  [string]$TitleLike,
  [string]$ChecklistPath = "$PSScriptRoot/checklists/onboarding.ru.md",
  [string]$Marker = "CHECKLIST:ONBOARDING",
  [switch]$Append = $true,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

# Ensure UTF-8 console encoding (Windows PowerShell 5.1)
try {
  [Console]::InputEncoding  = New-Object System.Text.UTF8Encoding($false)
  [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
} catch {}

function Get-GHRepoFromGit {
  try { $url = git config --get remote.origin.url 2>$null } catch { $url = $null }
  if (-not $url) { return $null }
  if ($url -match "github.com[:/](?<owner>[^/]+)/(?<repo>[^\.]+)(\.git)?$") {
    return "{0}/{1}" -f $Matches['owner'], $Matches['repo']
  }
  return $null
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI 'gh' not found. Install it and retry."
}
try { gh auth status | Out-Null } catch { Write-Warning "Not authenticated. Run 'gh auth login'." }

if (-not $Owner -or -not $Repo) {
  $slug = Get-GHRepoFromGit
  if ($slug) { $Owner, $Repo = $slug.Split('/') } else { throw "Cannot detect repo. Pass -Owner and -Repo." }
}
$GHREPO = "$Owner/$Repo"

if (-not (Test-Path -LiteralPath $ChecklistPath)) { throw "Checklist file not found: $ChecklistPath" }
$checklist = Get-Content -LiteralPath $ChecklistPath -Raw -Encoding UTF8

function Get-IssueList {
  if ($Issue) { return $Issue | Select-Object -Unique }
  $args = @('issue','list','-R', $GHREPO,'--json','number,title,url','-L','200','--state','all')
  if ($Labels) {
    # gh supports comma-separated labels in a single -l or multiple -l flags
    $args += @('-l', ($Labels -join ','))
  }
  if ($Search) { $args += @('--search', $Search) }
  $json = & gh @args
  if (-not $json) { return @() }
  $items = $json | ConvertFrom-Json
  if ($TitleLike) { $items = $items | Where-Object { $_.title -like "*${TitleLike}*" } }
  return @($items | ForEach-Object { [int]$_.number })
}

$numbers = Get-IssueList
if (-not $numbers -or $numbers.Count -eq 0) { Write-Host "No issues matched selection."; exit 0 }

Write-Host ("Repo: {0}; Issues: {1}" -f $GHREPO, ($numbers -join ',')) -ForegroundColor Cyan

foreach ($n in $numbers) {
  $body = & gh issue view -R $GHREPO $n --json body --jq '.body' 2>$null
  if ($body -and ($body -match [Regex]::Escape($Marker))) {
    Write-Host ("[#${n}] already has marker '{0}', skipping" -f $Marker) -ForegroundColor DarkGray
    continue
  }
  $newBody = if ($Append) { ($body + "`r`n`r`n" + $checklist) } else { ($checklist + "`r`n`r`n" + $body) }
  # Write to temp file as UTF-8 without BOM
  $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "gh-issue-${n}-body.md")
  [System.IO.File]::WriteAllText($tmp, $newBody, (New-Object System.Text.UTF8Encoding($false)))
  if ($DryRun) {
    Write-Host ("[#${n}] DRY-RUN would update body from {0} to {1} chars" -f ($body?.Length ?? 0), $newBody.Length)
  } else {
    & gh issue edit -R $GHREPO $n -F $tmp | Out-Null
    Write-Host ("[#${n}] checklist added") -ForegroundColor Green
  }
}

Write-Host "Done."

