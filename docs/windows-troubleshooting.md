# Windows Troubleshooting for CRA + Tailwind Projects

## "npm is not recognized"
1. Download and install the latest **Node.js LTS** release from [nodejs.org](https://nodejs.org/).
2. During installation, ensure **"Add to PATH"** (or "Automatically install the necessary tools") is checked so Windows can locate `node`, `npm`, and `npx` commands.
3. After installation, close and reopen PowerShell or Command Prompt to refresh the PATH.

## Verify Node.js Tooling Versions
Run the following commands in a new terminal to confirm everything is available:

```powershell
node -v
npm -v
npx -v
```

If any command fails, reinstall Node.js LTS and verify the PATH configuration again.

## Tailwind CSS v4 vs v3
Tailwind CSS v4 introduces a new engine and different configuration defaults, which are incompatible with existing Tailwind v3 tooling (like Create React App presets). To ensure you stay on Tailwind v3:

```powershell
npm uninstall tailwindcss
npm install -D tailwindcss@3 postcss autoprefixer
```

Re-running the install commands is safe and enforces the correct major version.

## Initialize Tailwind Config Files
Use `npx` to generate the standard Tailwind and PostCSS configuration files:

```powershell
npx tailwindcss@3 init -p
```

This creates `tailwind.config.js` and `postcss.config.js` in the project root. If the command fails, reinstall Node.js or Tailwind v3, then try again.

## Deleting `node_modules` on Windows
When you need to clear `node_modules`, use the command that matches your shell:

- **PowerShell**
  ```powershell
  Remove-Item -Recurse -Force node_modules
  ```
- **Command Prompt (CMD)**
  ```cmd
  rmdir /s /q node_modules
  ```

After removal, reinstall dependencies with `npm install`.
