# Script to simplify visual weight across all TSX files
# Reduces border radius, padding, and shadow values

$files = Get-ChildItem -Path "pages", "components" -Filter "*.tsx" -Recurse

$replacements = @{
    # Border Radius Simplifications
    'rounded-\[6rem\]'               = 'rounded-3xl'
    'rounded-\[4rem\]'               = 'rounded-2xl'
    'rounded-\[3\.5rem\]'            = 'rounded-2xl'
    'rounded-\[3rem\]'               = 'rounded-2xl'
    'rounded-\[2\.5rem\]'            = 'rounded-xl'
    'rounded-\[2rem\]'               = 'rounded-xl'
    'rounded-\[1\.8rem\]'            = 'rounded-xl'
    
    # Padding Simplifications (extreme cases)
    'p-24'                           = 'p-8'
    'p-16'                           = 'p-8'
    'p-12'                           = 'p-6'
    'p-10'                           = 'p-6'
    
    # Shadow Simplifications
    'shadow-2xl'                     = 'shadow-strong'
    'shadow-\[0_60px_100px_[^\]]+\]' = 'shadow-strong'
    'shadow-\[0_50px_150px_[^\]]+\]' = 'shadow-strong'
    'shadow-\[0_30px_70px_[^\]]+\]'  = 'shadow-strong'
    'shadow-\[0_20px_50px_[^\]]+\]'  = 'shadow-lg'
    'shadow-\[0_4px_20px_[^\]]+\]'   = 'shadow-soft'
}

$totalChanges = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        $content = $content -replace $pattern, $replacement
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalChanges++
        Write-Host "✓ Updated: $($file.Name) " -ForegroundColor Green
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Simplification Complete!" -ForegroundColor Green
Write-Host "Files modified: $totalChanges" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan
