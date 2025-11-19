# Udemy to Trello Exporter

A Tampermonkey userscript that exports Udemy course content to Trello as a single card with organized checklists for progress tracking.

## Features

- **One-Click Export**: Floating button (📤) on Udemy course pages
- **Structured Organization**: Each course section becomes a Trello checklist
- **Progress Tracking**: Individual lectures become checkable items
- **Course Metadata**: Includes course title and description in the Trello card

## Installation

1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) extension
2. Open Tampermonkey dashboard
3. Create new script and paste the content of `udemy-trello-exporter.user.js`
4. Save and enable the script

## Setup Required

The script will prompt you for three pieces of information each time you use it:

### Getting Trello Credentials

#### 1. Trello API Key and Token
1. Go to [Trello Developer API Keys](https://trello.com/app-key)
2. Log in with your Trello account
3. Copy your **API Key** (shown at the top)
4. Click "Generate a Token" to get your **API Token**
5. Authorize the token and copy the generated token string

#### 2. Trello List ID
1. Open your Trello board in a web browser
2. Navigate to the list where you want to add course cards
3. Click on any card in that list (or create a temporary card)
4. Look at the URL - it will look like: `https://trello.com/c/CARD_ID/card-name`
5. Add `.json` to the end: `https://trello.com/c/CARD_ID/card-name.json`
6. Open this URL in your browser
7. Find the `"idList"` field in the JSON - this is your List ID

**Alternative method for List ID:**
1. Open your Trello board
2. Right-click on the list title and select "Inspect Element"
3. Look for `data-list-id` attribute in the HTML

#### 3. Quick Setup Tips
- Keep your credentials handy - you'll need to enter them each time you export a course
- Consider using a dedicated Trello board for course tracking
- The API token has full access to your Trello account - keep it secure

## Usage

1. Navigate to any Udemy course page with the curriculum visible
2. Look for the blue 📤 button in the top-left corner
3. Click the button to extract course content
4. Confirm the export when prompted
5. Check your Trello board for the new card with checklists

## Output Structure

```
[Udemy] Course Title
├── Section 1 (Checklist)
│   ├── ☐ Lecture 1
│   ├── ☐ Lecture 2
│   └── ☐ Lecture 3
├── Section 2 (Checklist)
│   ├── ☐ Lecture 4
│   └── ☐ Lecture 5
└── ...
```

## Troubleshooting

- **"No course sections found"**: Make sure you're on the course curriculum page with sections expanded
- **API errors**: Verify your Trello credentials are correct and have proper permissions
- **Button not appearing**: Wait a few seconds for the page to fully load

## Security Note

This script contains hardcoded API credentials. For personal use only - never share the configured script publicly.

## Version

Current version: 1.0
