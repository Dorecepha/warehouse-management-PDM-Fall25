Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Section {
    param([string]$Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Ensure-Command {
    param([string]$CommandName)
    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "Required command '$CommandName' was not found. Please install it and rerun this script."
    }
}

$projectRoot = Get-Location
if (-not (Test-Path (Join-Path $projectRoot 'package.json'))) {
    throw "package.json was not found in $projectRoot. Please run this script from the CRA frontend directory."
}

Write-Section 'Checking Node.js and npm availability'
Ensure-Command -CommandName 'node'
Ensure-Command -CommandName 'npm'

Write-Section 'Installing application dependencies'
$appDependencies = @(
    'react-router-dom',
    'axios',
    '@tanstack/react-query',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    'recharts'
)
if ($appDependencies.Count -gt 0) {
    npm install $appDependencies
}

Write-Section 'Installing development dependencies'
$devDependencies = @(
    'prettier',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-prettier'
)
if ($devDependencies.Count -gt 0) {
    npm install -D $devDependencies
}

Write-Section 'Ensuring Tailwind CSS v3 and related tooling'
try {
    npm uninstall tailwindcss 1>$null 2>$null
} catch {
    Write-Host 'No existing tailwindcss to uninstall or uninstall failed silently.'
}
npm install -D 'tailwindcss@3' postcss autoprefixer

Write-Section 'Creating common project directories'
$directories = @(
    'src/components/ui',
    'src/features/records',
    'src/pages',
    'src/lib',
    'src/hooks'
)
foreach ($dir in $directories) {
    $fullPath = Join-Path $projectRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
    }
}

Write-Section 'Generating configuration files'
$filesToCreate = @{
    '.eslintrc.json' = @'
{
  "extends": ["react-app", "react-app/jest", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
'@;
    '.prettierrc' = @'
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
'@;
    '.eslintignore' = @'
node_modules
build
'@;
    '.env.example' = "REACT_APP_API_BASE_URL=http://localhost:8080/api`n"
}

foreach ($file in $filesToCreate.GetEnumerator()) {
    $path = Join-Path $projectRoot $file.Key
    $content = $file.Value
    Set-Content -Path $path -Value $content -Encoding UTF8
}

Write-Section 'Initializing Tailwind configuration'
$tailwindConfigPath = Join-Path $projectRoot 'tailwind.config.js'
$postcssConfigPath = Join-Path $projectRoot 'postcss.config.js'
$tailwindInitSucceeded = $false
try {
    npx tailwindcss@3 init -p | Out-Null
    if ((Test-Path $tailwindConfigPath) -and (Test-Path $postcssConfigPath)) {
        $tailwindInitSucceeded = $true
    }
} catch {
    Write-Host 'npx initialization failed; falling back to manual config.' -ForegroundColor Yellow
}

if (-not $tailwindInitSucceeded) {
    $tailwindConfig = @'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
'@
    Set-Content -Path $tailwindConfigPath -Value $tailwindConfig -Encoding UTF8

    $postcssConfig = @'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
'@
    Set-Content -Path $postcssConfigPath -Value $postcssConfig -Encoding UTF8
}

Write-Section 'Ensuring Tailwind directives in src/index.css'
$indexCssPath = Join-Path $projectRoot 'src/index.css'
if (Test-Path $indexCssPath) {
    $cssContent = Get-Content -Path $indexCssPath -Raw
    $directives = "@tailwind base;", "@tailwind components;", "@tailwind utilities;"
    $missing = @()
    foreach ($directive in $directives) {
        if ($cssContent -notmatch [regex]::Escape($directive)) {
            $missing += $directive
        }
    }
    if ($missing.Count -gt 0) {
        $prefix = ($missing -join "`n") + "`n`n"
        $cssContent = $prefix + $cssContent.TrimStart()
    }
    Set-Content -Path $indexCssPath -Value $cssContent -Encoding UTF8
}

Write-Section 'Updating src/App.js with Tailwind baseline'
$appJsPath = Join-Path $projectRoot 'src/App.js'
if (Test-Path $appJsPath) {
    $existingContent = Get-Content -Path $appJsPath -Raw
    if ($existingContent -match 'Learn React' -or $existingContent -match 'Edit src/App.js') {
        $backupPath = "$appJsPath.bak"
        if (-not (Test-Path $backupPath)) {
            Copy-Item -Path $appJsPath -Destination $backupPath -Force
            Write-Host "Backed up existing App.js to $backupPath"
        }
    }
    $newAppContent = @'
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Warehouse Management</h1>
          <p className="mt-2 text-slate-600">Welcome! Start building your UI in src/components.</p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-800">Next steps</h2>
          <p className="mt-4 text-slate-600">
            Use React Router for navigation, manage data with React Query, and keep forms tidy with React Hook Form + Zod.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
'@
    Set-Content -Path $appJsPath -Value $newAppContent -Encoding UTF8
}

Write-Section 'Setup complete'
