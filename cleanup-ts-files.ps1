# Cleanup TypeScript files after conversion

Write-Host "Cleaning up TypeScript files..." -ForegroundColor Green

# Remove all .tsx and .ts files from src directory
$tsxFiles = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse
$tsFiles = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

Write-Host "Removing $($tsxFiles.Count) .tsx files and $($tsFiles.Count) .ts files" -ForegroundColor Cyan

foreach ($file in $tsxFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "Deleted: $($file.FullName)" -ForegroundColor Yellow
}

foreach ($file in $tsFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "Deleted: $($file.FullName)" -ForegroundColor Yellow
}

# Remove TypeScript config files
$tsConfigFiles = @(
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "vite.config.ts"
)

foreach ($configFile in $tsConfigFiles) {
    if (Test-Path $configFile) {
        Remove-Item $configFile -Force
        Write-Host "Deleted: $configFile" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
$totalDeleted = $tsxFiles.Count + $tsFiles.Count + $tsConfigFiles.Count
Write-Host "Total files deleted: $totalDeleted" -ForegroundColor Cyan
