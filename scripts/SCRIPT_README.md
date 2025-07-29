# Scripts Directory

This folder contains utility scripts to help with development and deployment.

## Available Scripts

### Setup Scripts
- `setup.sh` - Unix/Linux/macOS setup script
- `setup.bat` - Windows setup script

Both scripts will:
- Check Node.js installation and version
- Install npm dependencies
- Create .env file from template (if it doesn't exist)
- Create necessary directories
- Display next steps

### Usage

#### On Windows:
```cmd
scripts\setup.bat
```

#### On Unix/Linux/macOS:
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## Adding More Scripts

You can add more utility scripts here for:
- Database migrations
- Data seeding
- Testing automation
- Deployment helpers
- Build processes

### Naming Convention
- Use descriptive names
- Include file extensions (.sh, .bat, .js, .py)
- Add both Unix and Windows versions for cross-platform support
