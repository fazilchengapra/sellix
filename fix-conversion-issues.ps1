# Find and fix all remaining TypeScript syntax in JavaScript files

Write-Host "Scanning for remaining TypeScript syntax..." -ForegroundColor Green

# Get all .jsx and .js files
$jsxFiles = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse
$jsFiles = Get-ChildItem -Path "src" -Filter "*.js" -Recurse
$allFiles = $jsxFiles + $jsFiles

Write-Host "Processing $($allFiles.Count) files" -ForegroundColor Cyan
$fixedCount = 0

foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove non-null assertions
    $content = $content -replace '!\.', '.'
    $content = $content -replace '!\)', ')'
    $content = $content -replace '!;', ';'
    $content = $content -replace '!\]', ']'
    
    # Remove 'as' type assertions
    $content = $content -replace '\s+as\s+\w+(\[\])?', ''
    $content = $content -replace '\s+as\s+const', ''
    
    # Fix any remaining type annotations in function parameters
    $content = $content -replace '\((\w+):\s*\w+(\[\])?\s*,', '($1,'
    $content = $content -replace '\((\w+):\s*\w+(\[\])?\)', '($1)'
    $content = $content -replace ',\s*(\w+):\s*\w+(\[\])?\)', ', $1)'
    
    # Remove return type annotations
    $content = $content -replace '\):\s*\w+(\[\])?(\s*=\u003e|\s*\{)', ')$2'
    $content = $content -replace '\):\s*Promise<[^>]+>(\s*=\u003e|\s*\{)', ')$1'
    $content = $content -replace '\):\s*void(\s*=\u003e|\s*\{)', ')$1'
    $content = $content -replace '\):\s*boolean(\s*=\u003e|\s*\{)', ')$1'
    $content = $content -replace '\):\s*string(\s*=\u003e|\s*\{)', ')$1'
    $content = $content -replace '\):\s*number(\s*=\u003e|\s*\{)', ')$1'
    
    # Remove generic type parameters
    $content = $content -replace '<[^>]+>', ''
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Yellow
        $fixedCount++
    }
}

Write-Host ""
Write-Host "Fix complete! Fixed $fixedCount files" -ForegroundColor Green
