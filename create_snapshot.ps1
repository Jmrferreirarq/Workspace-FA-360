$outputFile = "docs/PLATFORM_SNAPSHOT.md"

# Create docs directory if it doesn't exist
if (!(Test-Path "docs")) {
    New-Item -ItemType Directory -Force -Path "docs" | Out-Null
}

# Initialize the file (overwrite existing)
"# Platform Codebase Snapshot" | Out-File -FilePath $outputFile -Encoding utf8
"Generated on $(Get-Date)" | Out-File -FilePath $outputFile -Append -Encoding utf8
"" | Out-File -FilePath $outputFile -Append -Encoding utf8

# Get all relevant files with strict filtering
# Get-ChildItem -Recurse can be slow on node_modules, so we should try to avoid entering it if possible, 
# but ignoring it in post-process is easier to write reliably in a short script.
Write-Host "Scanning files..."
$files = Get-ChildItem -Path . -Recurse -Include *.ts, *.tsx, *.css, *.json, *.config.js, *.config.ts | 
Where-Object { 
    $_.FullName -notmatch '\\node_modules\\' -and 
    $_.FullName -notmatch '\\dist\\' -and 
    $_.FullName -notmatch '\\.git\\' -and 
    $_.FullName -notmatch 'package-lock.json' -and
    $_.FullName -notmatch '\\coverage\\'
}

$total = $files.Count
$current = 0

foreach ($file in $files) {
    $current++
    # Get relative path for cleaner headers
    $relativePath = Resolve-Path -Path $file.FullName -Relative
    
    # Progress indicator
    Write-Host "[$current/$total] Processing $relativePath"

    "## File: $relativePath" | Out-File -FilePath $outputFile -Append -Encoding utf8
    '```' | Out-File -FilePath $outputFile -Append -Encoding utf8
    Get-Content $file.FullName | Out-File -FilePath $outputFile -Append -Encoding utf8
    '```' | Out-File -FilePath $outputFile -Append -Encoding utf8
    "" | Out-File -FilePath $outputFile -Append -Encoding utf8
}

Write-Host "Snapshot creation complete: $outputFile"
