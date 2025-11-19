# Personal Tools

A collection of Chrome extensions and userscripts designed to automate recurring tasks and improve productivity. Some tools are published publicly on the Chrome Web Store, while others are personal utilities that run locally via Tampermonkey.

## Requirements

- **Chrome Browser** (or Chromium-based browser)
- **Tampermonkey Extension** - [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Node.js** (for development) - [Download](https://nodejs.org/)
- **Basic JavaScript knowledge** (for customization)

## How to Use These Scripts

### For Tampermonkey Scripts (Local Use)
1. Install Tampermonkey extension in your browser
2. Open Tampermonkey dashboard
3. Click "Create a new script"
4. Copy and paste the desired script from this repository
5. Save and enable the script
6. Navigate to the target website to see the script in action

### For Chrome Extensions (Packaged)
1. Download the extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your browser toolbar

## Available Scripts

*Scripts will be documented here as they are added to the repository*

## Visual Examples

*Screenshots and GIFs demonstrating script functionality will be added here*

## Security Notice

⚠️ **Important Security Information**

- These scripts are for personal use and educational purposes
- Always review code before installing any userscript
- Be cautious when running scripts on sensitive websites
- Some scripts may access page content and user interactions
- Never share scripts that contain personal credentials or sensitive data
- Test scripts in a safe environment before using on important sites

## Project Structure

```
personal-tools/
├── README.md
├── scripts/                  # Userscripts for Tampermonkey
│   ├── script-name/
│   │   ├── script.user.js
│   │   └── README.md
├── chrome-extensions/        # Packaged Chrome extensions
│   ├── extension-name/
│   │   ├── manifest.json
│   │   ├── popup.html
│   │   ├── content.js
│   │   └── README.md
├── shared/                   # Shared utilities and libraries
└── docs/                     # Additional documentation
```

## Development Guidelines

- Each script/extension should have its own folder with documentation
- Include clear comments in code
- Test thoroughly before committing
- Follow Chrome extension best practices for packaged extensions
- Use semantic versioning for releases

## Contributing

This is a personal repository, but suggestions and improvements are welcome via issues.

## License

This project is licensed under the MIT License. Individual scripts may have different licensing terms - check each script's documentation.

---

*Last updated: November 2025*