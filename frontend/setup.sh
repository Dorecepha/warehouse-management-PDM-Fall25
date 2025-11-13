#!/usr/bin/env bash
set -euo pipefail

print_section() {
  printf '\n=== %s ===\n' "$1"
}

ensure_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf 'Required command "%s" was not found. Please install it and rerun this script.\n' "$1" >&2
    exit 1
  fi
}

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

if [[ ! -f package.json ]]; then
  printf 'package.json was not found in %s. Please run this script from the CRA frontend directory.\n' "$SCRIPT_DIR" >&2
  exit 1
fi

print_section 'Checking Node.js and npm availability'
ensure_command node
ensure_command npm

print_section 'Installing application dependencies'
app_dependencies=(
  "react-router-dom"
  "axios"
  "@tanstack/react-query"
  "react-hook-form"
  "zod"
)
if ((${#app_dependencies[@]} > 0)); then
  npm install "${app_dependencies[@]}"
fi

print_section 'Installing development dependencies'
dev_dependencies=(
  "prettier"
  "eslint-config-prettier"
  "eslint-plugin-prettier"
)
if ((${#dev_dependencies[@]} > 0)); then
  npm install -D "${dev_dependencies[@]}"
fi

print_section 'Ensuring Tailwind CSS v3 and related tooling'
if npm uninstall tailwindcss >/dev/null 2>&1; then
  :
else
  printf 'No existing tailwindcss to uninstall or uninstall failed silently.\n'
fi
npm install -D "tailwindcss@3" postcss autoprefixer

print_section 'Creating common project directories'
directories=(
  "src/components/ui"
  "src/features/records"
  "src/pages"
  "src/lib"
  "src/hooks"
)
for dir in "${directories[@]}"; do
  mkdir -p "$dir"
done

print_section 'Generating configuration files'
cat <<'JSON' > .eslintrc.json
{
  "extends": ["react-app", "react-app/jest", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
JSON

cat <<'JSON' > .prettierrc
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
JSON

cat <<'TXT' > .eslintignore
node_modules
build
TXT

printf 'REACT_APP_API_BASE_URL=http://localhost:8080/api\n' > .env.example

print_section 'Initializing Tailwind configuration'
tailwind_init_success=false
if npx tailwindcss@3 init -p >/dev/null 2>&1; then
  if [[ -f tailwind.config.js && -f postcss.config.js ]]; then
    tailwind_init_success=true
  fi
else
  printf 'npx initialization failed; falling back to manual config.\n'
fi

if [[ $tailwind_init_success != true ]]; then
  cat <<'JS' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
JS

  cat <<'JS' > postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
JS
fi

print_section 'Ensuring Tailwind directives in src/index.css'
index_css_path="src/index.css"
if [[ -f $index_css_path ]]; then
  directives=("@tailwind base;" "@tailwind components;" "@tailwind utilities;")
  missing=()
  for directive in "${directives[@]}"; do
    if ! grep -Fq "$directive" "$index_css_path"; then
      missing+=("$directive")
    fi
  done
  if ((${#missing[@]} > 0)); then
    {
      printf '%s\n' "${missing[@]}"
      printf '\n'
      cat "$index_css_path"
    } > "$index_css_path.tmp"
    mv "$index_css_path.tmp" "$index_css_path"
  fi
fi

print_section 'Updating src/App.js with Tailwind baseline'
app_js_path="src/App.js"
if [[ -f $app_js_path ]]; then
  if grep -Eq 'Learn React|Edit src/App.js' "$app_js_path"; then
    backup_path="$app_js_path.bak"
    if [[ ! -f $backup_path ]]; then
      cp "$app_js_path" "$backup_path"
      printf 'Backed up existing App.js to %s\n' "$backup_path"
    fi
  fi
  cat <<'JSX' > "$app_js_path"
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
JSX
fi

print_section 'Setup complete'
