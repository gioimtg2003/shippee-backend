# Run application backend and web frontend

### 1. Install Node.js and pnpm

First, you need to install Node.js version 20 and pnpm version 9.7.1.

### Install Node.js

You can download Node.js from the official website: Node.js.

### Install pnpm

After installing Node.js, you can install pnpm using the following command:

```bash
npm install -g pnpm@9.7.1

```

_Note: npm pnpm cannot be loaded because running script is disabled |set execution policy._

```powershell
Select Start  -- All Programs Windows PowerShell version  Windows PowerShell.
Type-- Set-ExecutionPolicy RemoteSigned -- to set the policy to RemoteSigned.
Type Set--ExecutionPolicy Unrestricted --to set the policy to Unrestricted.
Type Get-ExecutionPolicy to verify the current settings for the execution policy.
Type Exit.
```

Link: https://www.youtube.com/watch?v=Jy0xbH8cMeM

### 2. Install Dependencies package

- Run the following command to install all dependencies:

```bash
pnpm install
```

### 3. Run application
