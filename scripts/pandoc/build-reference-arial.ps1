$src = "C:\informika\scripts\pandoc\reference-default.docx"
$dst = "C:\informika\scripts\pandoc\reference-arial.docx"
$tmp = Join-Path $env:TEMP ("refdocx_" + [guid]::NewGuid().ToString())

New-Item -ItemType Directory -Path $tmp | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($src, $tmp)

$styles = Join-Path $tmp "word\styles.xml"
$xml = Get-Content -Raw -LiteralPath $styles
$xml = [regex]::Replace($xml, 'w:asciiTheme="[^"]+"', 'w:ascii="Arial"')
$xml = [regex]::Replace($xml, 'w:hAnsiTheme="[^"]+"', 'w:hAnsi="Arial"')
$xml = [regex]::Replace($xml, 'w:eastAsiaTheme="[^"]+"', 'w:eastAsia="Arial"')
$xml = [regex]::Replace($xml, 'w:cstheme="[^"]+"', 'w:cs="Arial"')
Set-Content -LiteralPath $styles -Value $xml -Encoding UTF8

if (Test-Path $dst) { Remove-Item -LiteralPath $dst -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($tmp, $dst)
Remove-Item -LiteralPath $tmp -Recurse -Force
