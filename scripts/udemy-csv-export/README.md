# Udemy to CSV Exporter

A Tampermonkey userscript that exports Udemy course content to a CSV file with sections and lectures for progress tracking.

## Features

- **One-Click Export**: Floating button (📊) on Udemy course pages
- **CSV Format**: Course, Section, Lecture, and Completed columns
- **Progress Tracking**: "Completed" column with FALSE values ready for manual updates
- **Auto-Expansion**: Automatically expands all course sections before export
- **Clean Filename**: Generates sanitized filename based on course title

## Installation

1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) extension
2. Open Tampermonkey dashboard
3. Create new script and paste the content of `udemy-csv-exporter.user.js`
4. Save and enable the script

## Usage

1. Navigate to any Udemy course page with the curriculum visible (e.g., [udemy.com/course/linear-algebra-course/](https://www.udemy.com/course/linear-algebra-course/))
2. Look for the green 📊 button in the top-left corner (positioned next to the Trello export button)
3. Click the button to start the export process
4. The script will automatically expand all sections
5. Confirm the export when prompted
6. CSV file will be automatically downloaded

## CSV Output Format

```csv
Course,Section,Lecture,Completed
"JavaScript Fundamentals","Introduction","Welcome to the Course",FALSE
"JavaScript Fundamentals","Introduction","Course Overview",FALSE
"JavaScript Fundamentals","Variables and Data Types","Understanding Variables",FALSE
"JavaScript Fundamentals","Variables and Data Types","Working with Strings",FALSE
```

## Progress Tracking

- Open the CSV file in Excel, Google Sheets, or any spreadsheet application
- Mark lectures as completed by changing FALSE to TRUE in the "Completed" column
- Use filters and formulas to track your progress

## Button Location

The CSV export button (📊) appears at position `top: 80px, left: 50px` to avoid conflicts with the Trello export button.

## Troubleshooting

- **"No course sections found"**: Make sure you're on the course curriculum page with sections visible
- **Button not appearing**: Wait a few seconds for the page to fully load
- **Download not starting**: Check if your browser is blocking downloads

## File Naming

The CSV file is automatically named based on the course title with special characters replaced by underscores (e.g., `javascript_fundamentals_course.csv`).

## Version

Current version: 1.0
