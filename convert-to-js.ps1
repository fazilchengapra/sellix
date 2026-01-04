# TypeScript to JavaScript Conversion Script

# Get all .tsx and .ts files
$tsxFiles = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse
$tsFiles = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

Write-Host "Converting TypeScript files to JavaScript..." -ForegroundColor Green
Write-Host "Found $($tsxFiles.Count) .tsx files and $($tsFiles.Count) .ts files" -ForegroundColor Cyan

# Function to convert TypeScript to JavaScript
function Convert-TSToJS {
    param (
        [string]$FilePath,
        [string]$NewExtension
    )
    
    $content = Get-Content $FilePath -Raw
    $newPath = $FilePath -replace '\.(tsx|ts)$', $NewExtension
    
    # Remove TypeScript-specific syntax
    # Remove type imports
    $content = $content -replace "import\s+type\s+\{[^}]+\}\s+from\s+[^;]+;?\r?\n?", ""
    $content = $content -replace "import\s+\{([^}]*),\s*type\s+[^}]+\}\s+from", 'import {$1} from'
    $content = $content -replace "import\s+type\s+", "import "
    
    # Remove type annotations from imports
    $content = $content -replace ",\s*type\s+(\w+)", ""
    
    # Remove React.FC type annotations
    $content = $content -replace ":\s*React\.FC<[^>]+>", ""
    
    # Remove generic type parameters from useState, etc
    $content = $content -replace "useState<[^>]+>", "useState"
    $content = $content -replace "createContext<[^>]+>", "createContext"
    
    # Remove interface and type definitions
    $content = $content -replace "(?m)^(export\s+)?interface\s+\w+\s*\{[^}]*\}\r?\n?", ""
    $content = $content -replace "(?m)^(export\s+)?type\s+\w+\s*=\s*[^;]+;\r?\n?", ""
    
    # Remove type annotations from function parameters
    $content = $content -replace "\(([^:)]+):\s*[^)]+\)", '($1)'
    $content = $content -replace "async\s+\(([^:)]+):\s*[^)]+\)", 'async ($1)'
    
    # Remove return type annotations
    $content = $content -replace "\)\s*:\s*[^{=]+(\{|=>)", ')$1'
    
    # Remove type assertions and non-null assertions
    $content = $content -replace "\s+as\s+\w+", ""
    $content = $content -replace "!\.render", ".render"
    $content = $content -replace "!;", ";"
    
    # Remove Partial, Record, Omit types
    $content = $content -replace "Partial<[^>]+>", "{}"
    $content = $content -replace "Record<[^>]+>", "{}"
    $content = $content -replace "Omit<[^>]+>", "{}"
    
    # Update import extensions from .tsx to .jsx
    $content = $content -replace "from\s+(['""])(.*)\.tsx\1", 'from $1$2.jsx$1'
    $content = $content -replace "from\s+(['""])(.*)\.ts\1", 'from $1$2.js$1'
    
    # Write to new file
    Set-Content -Path $newPath -Value $content -NoNewline
    Write-Host "Converted: $FilePath -> $newPath" -ForegroundColor Yellow
}

# Convert all .tsx files to .jsx
foreach ($file in $tsxFiles) {
    Convert-TSToJS -FilePath $file.FullName -NewExtension ".jsx"
}

# Convert all .ts files to .js
foreach ($file in $tsFiles) {
    Convert-TSToJS -FilePath $file.FullName -NewExtension ".js"
}

Write-Host ""
Write-Host "Conversion complete!" -ForegroundColor Green
$totalConverted = $tsxFiles.Count + $tsFiles.Count
Write-Host "Total files converted: $totalConverted" -ForegroundColor Cyan
