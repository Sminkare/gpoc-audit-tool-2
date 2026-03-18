# GPOC Services Audit Tool

A comprehensive tool for auditing GSF (Global Service Fulfillment) ticketing/issue tracking data.

## Features

- **Data Manager**: Import CSV files, filter data, clean records
- **Audit Checklist**: Track workflow steps
- **Reports**: Automated pivot tables and visualizations

## AWS Amplify Deployment

### Quick Upload to GitHub

1. Download this project from Figma Make
2. Go to [github.com](https://github.com) and create a new repository
3. Upload all project files including:
   - `amplify.yml` (deployment configuration)
   - `index.html` (entry point)
   - `package.json` (dependencies)
   - All `src/` folders
   - `public/` folder with `_redirects` file

### Deploy to AWS Amplify

1. Log in to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. AWS will auto-detect the build settings from `amplify.yml`
5. Click "Save and deploy"
6. Wait for build to complete (5-10 minutes)
7. Your app will be live!

### Important Files

- **amplify.yml**: Build configuration for AWS
- **public/_redirects**: Handles client-side routing (fixes 404 errors)
- **index.html**: Main HTML entry point
- **src/main.tsx**: React application entry point

## Local Development

```bash
npm install
npm run dev
```

## Usage

1. Click "Import CSV" in the Data Manager tab
2. Select your CSV file (format should match documentSearch structure)
3. Use filters to analyze data
4. Check off audit steps in Audit Checklist tab
5. View reports and visualizations in Reports tab

## CSV Format

Expected columns:
- IssueId
- ShortId
- Title
- Status
- Severity
- Age
- Item (service category)
- Assignee
- CreateDate
- LastUpdatedDate
- And other tracking fields

## Support

For issues or questions, refer to the deployment guide in this README.
