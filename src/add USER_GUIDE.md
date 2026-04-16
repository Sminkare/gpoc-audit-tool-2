# GPOC Services Audit Tool - User Guide

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [CSV Data Requirements](#csv-data-requirements)
4. [Data Manager Tab](#data-manager-tab)
5. [Audit Checklist Tab](#audit-checklist-tab)
6. [Reports Tab](#reports-tab)
7. [Performance Metrics Tab](#performance-metrics-tab)
8. [SLA Tracking Rules](#sla-tracking-rules)
9. [Common Workflows](#common-workflows)
10. [Tips & Best Practices](#tips--best-practices)

---

## Overview

The GPOC Services Audit Tool is a web-based application designed to process and analyze GSF (Global Service Fulfillment) ticketing data for compliance, performance tracking, and operational auditing.

### Key Features
- **CSV Import & Processing**: Load ticketing data from CSV exports
- **Data Filtering**: Multi-column filtering with visual indicators
- **Data Manipulation**: Copy, paste, delete, and edit capabilities
- **SLA Compliance Tracking**: Automated first touch and follow-up monitoring
- **Performance Analytics**: Resolution rates, response times, and priority metrics
- **Automated Reports**: Pivot tables and visualizations for stakeholder reporting

### Use Cases
- Daily ticket queue audits
- SLA compliance verification
- Team performance monitoring
- Priority escalation tracking
- Stakeholder reporting

---

## Getting Started

### Step 1: Access the Tool
Open the GPOC Services Audit Tool in your web browser. The tool runs entirely in-browser and requires no local installation.

### Step 2: Prepare Your Data
Export your GSF ticketing data as a CSV file with the required columns (see [CSV Data Requirements](#csv-data-requirements)).

### Step 3: Import Your Data
1. Navigate to the **Data Manager** tab
2. Click the **"Choose File"** button
3. Select your CSV file
4. The data will automatically load and display in the table

### Step 4: Begin Analysis
Use the filtering, sorting, and reporting features to analyze your data according to your audit requirements.

---

## CSV Data Requirements

### Required Columns
Your CSV file must include the following columns (exact header names):

| Column Name | Description | Example |
|-------------|-------------|---------|
| `IssueId` | Unique ticket identifier | `GPOC-12345` |
| `ShortId` | Short reference ID | `12345` |
| `Title` | Issue/ticket title | `Network connectivity issue` |
| `Status` | Current ticket status | `Open`, `In Progress`, `Resolved` |
| `Severity` | Priority level | `Sev 2`, `Sev 3`, `Sev 4`, `Sev 5` |
| `Age` | Days since ticket creation | `5` |
| `Item` | Service category | `Network`, `Compute`, `Storage` |
| `Assignee Group` | Team assigned | `Network Team`, `PM` |
| `Assignee Identity` | Individual assignee | `john.doe@company.com` |
| `Last Update Date` | Last modification timestamp | `2026-04-15 14:30` |

### Optional Columns
Additional columns will be imported and available for filtering and reporting.

### Data Format Notes
- **Dates**: Use ISO format (YYYY-MM-DD) or standard datetime format (YYYY-MM-DD HH:MM)
- **Severity**: Must include "Sev" prefix (Sev 2, Sev 3, etc.)
- **Status**: Common values include Open, In Progress, Resolved, Closed
- **PM Tickets**: For privacy, Assignee Identity values are automatically replaced with UUIDs when Assignee Group = "PM"

---

## Data Manager Tab

The Data Manager is your primary interface for importing, viewing, filtering, and manipulating ticket data.

### Importing Data

#### Initial Import
1. Click **"Choose File"** in the import section
2. Select your CSV file
3. Wait for the "Import successful" confirmation
4. Data appears in the table below

#### Refreshing Data
To reload with updated data:
1. Click **"Choose File"** again
2. Select the new CSV file
3. Previous data and filters are replaced

### Viewing Data

#### Table Features
- **Sortable Columns**: Click any column header to sort ascending/descending
- **Resizable Columns**: Drag column borders to adjust width
- **Row Selection**: Click checkboxes to select individual rows
- **Select All**: Use the header checkbox to select/deselect all visible rows

#### Data Display
- Severity values are color-coded:
  - **Sev 2**: Red badge
  - **Sev 3**: Orange badge
  - **Sev 4**: Yellow badge
  - **Sev 5**: Blue badge
- Status values show as colored badges
- Dates display in readable format with time if available

### Filtering Data

#### Applying Filters
1. Click the **filter icon** (⚲) next to any column header
2. A dropdown menu appears showing all unique values
3. Click checkboxes to select which values to show
4. Click **"Apply"** to activate the filter
5. Click **"Cancel"** to close without changes

#### Filter Indicators
- Columns with active filters show a **blue filter icon** (⚲)
- The filter button in the toolbar shows **"Active Filters: X"** when filters are applied

#### Managing Filters
- **Clear Single Filter**: Open the filter dropdown and click "Clear"
- **Clear All Filters**: Click the **"Clear All Filters"** button in the toolbar
- **Multiple Filters**: Apply filters to multiple columns simultaneously (AND logic)

### Manipulating Data

#### Selecting Rows
- **Single Selection**: Click the checkbox on any row
- **Multiple Selection**: Click multiple checkboxes
- **Select All**: Click the header checkbox
- **Deselect All**: Click the header checkbox again

#### Deleting Data
1. Select one or more rows using checkboxes
2. Click the **"Delete Selected"** button
3. Confirm the deletion in the popup dialog
4. Deleted rows are permanently removed from the current session

#### Copying Data
1. Select one or more rows
2. Click the **"Copy Selected"** button
3. Data is copied to clipboard in TSV format (paste into Excel/Google Sheets)

#### Editing Cells (if implemented)
1. Double-click any cell
2. Modify the value
3. Press Enter to save or Esc to cancel

### Summary Statistics

At the top of the Data Manager, you'll see real-time statistics:
- **Total Tickets**: Count of all imported tickets
- **Filtered Tickets**: Count currently visible after filters
- **Selected Tickets**: Count of checked rows

---

## Audit Checklist Tab

The Audit Checklist provides a structured workflow for conducting daily or periodic ticket audits.

### Using the Checklist

#### Standard Audit Items
The checklist includes pre-configured audit tasks:
1. ✓ Verify all Sev 2 tickets have been touched within 15 minutes
2. ✓ Check Sev 3 tickets for 4x daily updates
3. ✓ Confirm Sev 4/5 tickets updated per cadence requirements
4. ✓ Review priority queue for escalations
5. ✓ Validate assignee distribution across teams
6. ✓ Check for tickets exceeding age thresholds

#### Workflow
1. Review each checklist item
2. Click the checkbox when the audit step is complete
3. Add notes in the text field if needed
4. Progress is tracked at the top of the checklist

#### Custom Items (if implemented)
- Click **"Add Custom Item"** to create your own checklist tasks
- Custom items persist for the current session

### Audit Documentation
Use the checklist to:
- Ensure consistent audit procedures
- Track completion of required reviews
- Document findings for compliance records
- Onboard new team members to audit processes

---

## Reports Tab

The Reports tab provides automated pivot tables and visualizations for stakeholder reporting and trend analysis.

### Available Reports

#### 1. Tickets by Status
- **Type**: Bar chart
- **Shows**: Distribution of tickets across all status values
- **Use Case**: Quick overview of queue composition

#### 2. Tickets by Severity
- **Type**: Pie chart
- **Shows**: Percentage breakdown by severity level
- **Use Case**: Priority distribution analysis

#### 3. Tickets by Service Category (Item)
- **Type**: Bar chart
- **Shows**: Ticket volume by service area
- **Use Case**: Identifying high-volume service categories

#### 4. Tickets by Assignee Group
- **Type**: Horizontal bar chart
- **Shows**: Ticket distribution across teams
- **Use Case**: Workload balancing analysis

#### 5. Age Distribution
- **Type**: Histogram
- **Shows**: Ticket count by age buckets (0-7, 8-14, 15-30, 31+ days)
- **Use Case**: Aging ticket identification

#### 6. SLA Compliance
- **Type**: Status indicators + breach list
- **Shows**: First touch and follow-up SLA compliance rates
- **Use Case**: Performance tracking and escalation identification

### Using Reports

#### Refreshing Data
1. Make changes in the Data Manager (filters, deletions)
2. Return to the Reports tab
3. Click **"Refresh Pivot Tables"** button
4. All charts update to reflect current data

#### Exporting Reports (manual)
1. Take screenshots of charts for presentations
2. Copy data from the Data Manager for detailed spreadsheet analysis
3. Use browser print function for PDF export

### Dashboard Cards

At the top of the Reports tab, summary cards display:
- **Total Tickets**: Overall count
- **Open Tickets**: Active work items
- **Oldest Update**: Ticket with longest time since last update
- **Resolved Tickets**: Count with severity breakdown

---

## Performance Metrics Tab

The Performance Metrics tab tracks SLA compliance, response times, and operational KPIs.

### Key Metrics Displayed

#### SLA Compliance Section
- **First Touch Compliance**: Percentage of tickets touched within 15 minutes during coverage hours
- **Follow-up Compliance by Severity**: 
  - Sev 2: 4x daily (every 6 hours)
  - Sev 3: Every 24 hours
  - Sev 4/5: Every 48 hours
- **Overall Compliance Rate**: Weighted average across all SLA types

#### Response Time Analysis
- **Average First Touch Time**: Mean time to first response
- **Average Follow-up Time**: Mean time between updates
- **Percentile Breakdown**: 50th, 75th, 90th, 95th percentiles

#### Resolution Metrics
- **Resolution Rate by Severity**: Percentage closed per priority level
- **Average Resolution Time**: Mean time from open to resolved
- **Tickets by Age Bracket**: Distribution of open ticket ages

#### Priority Queue Status
- **Sev 2 Breaches**: Count of critical SLA violations
- **Sev 3 Breaches**: Count of high-priority violations
- **Escalation Candidates**: Tickets approaching SLA breach

### Visualizations

#### SLA Compliance Over Time (if implemented)
Line chart showing daily/weekly compliance trends

#### Resolution Time Distribution
Histogram showing resolution time patterns by severity

#### Team Performance Comparison
Bar chart comparing SLA compliance across assignee groups

### Using Performance Metrics

#### Daily Reviews
1. Check SLA compliance percentages
2. Review breach lists for immediate action
3. Monitor response time trends
4. Identify teams needing support

#### Weekly Analysis
1. Export metrics for management reporting
2. Compare week-over-week trends
3. Identify process improvement opportunities
4. Celebrate team successes

---

## SLA Tracking Rules

### First Touch SLA: 15 Minutes

**Applies To**: All tickets during coverage hours  
**Measurement**: Time from ticket creation to first update  
**Coverage Hours**: Typically 24/7 for critical services (configure as needed)

**Breach Conditions**:
- No update within 15 minutes of creation during coverage hours
- Initial assignment does not count as "touch" - requires substantive update

### Follow-up Cadence SLAs

#### Sev 2 (Critical): 4x Daily
- **Frequency**: Every 6 hours
- **Applies**: All Sev 2 tickets until resolved
- **Example**: Updates at 6am, 12pm, 6pm, 12am

#### Sev 3 (High): Daily
- **Frequency**: Every 24 hours
- **Applies**: All Sev 3 tickets until resolved
- **Example**: Update by same time each day

#### Sev 4/5 (Medium/Low): Every 48 Hours
- **Frequency**: Every 2 days
- **Applies**: All Sev 4 and Sev 5 tickets until resolved
- **Example**: Update every other day

### SLA Calculation Logic

**First Touch**:
```
Time to First Touch = Last Update Date - Creation Date
Compliant = Time to First Touch ≤ 15 minutes (during coverage)
```

**Follow-up Cadence**:
```
Time Since Last Update = Current Time - Last Update Date
Breached = Time Since Last Update > Required Cadence for Severity
```

### Exemptions & Special Cases

- **Weekend/Holiday Adjustments**: Configure coverage hours accordingly
- **Resolved Tickets**: SLA tracking stops at resolution
- **On Hold Status**: May pause SLA clock (configure as needed)
- **Customer Awaiting**: May pause SLA clock (configure as needed)

---

## Common Workflows

### Daily Ticket Audit

**Objective**: Ensure all tickets meet SLA requirements and no issues are stalled

1. **Import Latest Data**
   - Export fresh CSV from GSF ticketing system
   - Import to Data Manager tab

2. **Check SLA Breaches**
   - Go to Performance Metrics tab
   - Review "SLA Breaches" section
   - Note all breached tickets for immediate action

3. **Review Priority Queue**
   - Filter Data Manager for Status = "Open"
   - Sort by Severity (Sev 2 first)
   - Check Last Update Date for each Sev 2/3 ticket

4. **Aging Tickets**
   - Filter for Age > 30 days
   - Review with assignees for resolution blockers
   - Escalate if needed

5. **Complete Audit Checklist**
   - Go to Audit Checklist tab
   - Mark each item as complete
   - Add notes for any findings

6. **Generate Report**
   - Go to Reports tab
   - Click "Refresh Pivot Tables"
   - Screenshot key charts for daily standup

### Weekly Performance Review

**Objective**: Analyze trends and identify improvement opportunities

1. **Compile Weekly Data**
   - Import Monday through Friday CSV exports
   - Or use single end-of-week export

2. **Review Performance Metrics**
   - Go to Performance Metrics tab
   - Note overall SLA compliance percentage
   - Compare to previous week (manual tracking)

3. **Analyze Team Distribution**
   - Go to Reports tab
   - Review "Tickets by Assignee Group"
   - Identify overloaded teams

4. **Resolution Analysis**
   - Check "Resolution Rate by Severity"
   - Note any severity levels with low resolution rates
   - Investigate blockers

5. **Document Trends**
   - Copy key metrics to weekly report spreadsheet
   - Note improvements or concerns
   - Prepare action items for team meeting

### New Ticket Escalation

**Objective**: Quickly identify and escalate tickets needing immediate attention

1. **Filter for High Priority**
   - Data Manager tab
   - Filter Severity = "Sev 2"
   - Filter Status = "Open" or "In Progress"

2. **Check Update Recency**
   - Sort by Last Update Date (oldest first)
   - Review top 10 tickets

3. **Identify Breaches**
   - Note any with Last Update > 6 hours ago
   - These are SLA breached

4. **Escalate**
   - Copy selected rows (use Copy Selected button)
   - Paste into escalation email/Slack
   - Tag appropriate managers

5. **Track Resolution**
   - Re-import data after 1 hour
   - Verify escalated tickets have been updated

### End-of-Month Reporting

**Objective**: Generate comprehensive metrics for stakeholder review

1. **Import Full Month Data**
   - Export entire month from GSF system
   - Import to Data Manager

2. **Generate All Reports**
   - Reports tab → Refresh Pivot Tables
   - Screenshot each chart
   - Compile into presentation

3. **Calculate Key Metrics**
   - Performance Metrics tab
   - Note SLA compliance rates
   - Calculate month-over-month changes

4. **Trend Analysis**
   - Compare current month to previous months (manual tracking)
   - Note improvements in resolution times
   - Identify recurring problem categories

5. **Prepare Recommendations**
   - Based on data, suggest process improvements
   - Highlight team achievements
   - Propose staffing or training needs

---

## Tips & Best Practices

### Data Management

✅ **DO:**
- Import fresh data daily for accurate SLA tracking
- Keep CSV exports in a consistent format
- Use descriptive filenames with dates (e.g., `gsf_tickets_2026-04-15.csv`)
- Verify data import counts after loading

❌ **DON'T:**
- Modify CSV files manually before import (data corruption risk)
- Mix data from different time periods without clear labeling
- Delete rows without selecting carefully (no undo)

### Filtering & Analysis

✅ **DO:**
- Apply filters progressively (start broad, then narrow)
- Clear filters between different analyses to avoid confusion
- Use the "Active Filters" indicator to track current view
- Document your filter criteria for reproducible reports

❌ **DON'T:**
- Forget to clear filters before generating reports
- Apply too many filters at once (may hide important data)
- Assume filtered view represents full dataset

### SLA Tracking

✅ **DO:**
- Check SLA breaches multiple times daily (every 4-6 hours)
- Understand coverage hour definitions for your organization
- Escalate breaches immediately to assignees
- Track patterns in SLA breaches for root cause analysis

❌ **DON'T:**
- Wait until end of day to review SLA compliance
- Ignore "close calls" (tickets near SLA breach)
- Blame individuals without investigating systemic issues

### Reporting

✅ **DO:**
- Refresh pivot tables before taking screenshots
- Include date/time stamps on exported reports
- Provide context in reports (e.g., "Week of April 10-16")
- Highlight actionable insights, not just data

❌ **DON'T:**
- Share stale reports without refresh
- Present charts without explanation or recommendations
- Overwhelm stakeholders with too many metrics at once

### Performance Optimization

✅ **DO:**
- Import only necessary data (filter exports if possible)
- Close unused tabs when working with large datasets
- Use browser zoom if visual elements overlap

❌ **DON'T:**
- Keep multiple old CSV imports open simultaneously
- Import files with 10,000+ rows without testing first

### Audit Quality

✅ **DO:**
- Follow the Audit Checklist consistently every time
- Document exceptions or anomalies in notes
- Review with team members for accuracy
- Keep audit documentation for compliance records

❌ **DON'T:**
- Skip checklist items to save time
- Audit your own team's tickets without peer review
- Make assumptions without verifying data

---

## Troubleshooting

### Common Issues

**Issue**: CSV import fails or shows no data  
**Solution**: 
- Verify CSV has required columns with exact header names
- Check for special characters or encoding issues
- Ensure file is not corrupted or empty

**Issue**: Filters don't seem to work  
**Solution**: 
- Click "Apply" button in filter dropdown
- Clear browser cache and reload
- Check if "Active Filters" indicator shows applied filters

**Issue**: Performance Metrics show incorrect SLA calculations  
**Solution**: 
- Verify Last Update Date format is correct (YYYY-MM-DD HH:MM)
- Check that Severity values include "Sev" prefix
- Ensure current system time is accurate

**Issue**: Charts don't update in Reports tab  
**Solution**: 
- Click "Refresh Pivot Tables" button
- Return to Data Manager and verify data is loaded
- Reload the entire page if issue persists

**Issue**: Copy Selected doesn't work  
**Solution**: 
- Ensure rows are selected (checkboxes checked)
- Grant clipboard permissions when browser prompts
- Try copying to a text editor first to verify

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Select All Visible Rows | Ctrl+A (in table) |
| Copy Selected Data | Ctrl+C (after clicking Copy Selected) |
| Deselect All | Esc |
| Navigate Tabs | Ctrl+Tab / Ctrl+Shift+Tab |

---

## Data Privacy & Security

### Sensitive Data Handling

- **Assignee Identity**: Automatically anonymized for PM tickets using UUID replacement
- **PII Protection**: Avoid including customer personal information in CSV exports
- **Data Retention**: Tool does not store data permanently; refresh clears previous data
- **Browser Storage**: No data is saved between sessions unless you export manually

### Best Practices

1. Do not share screenshots containing assignee emails publicly
2. Use private channels when escalating breached tickets with assignee names
3. Follow your organization's data governance policies
4. Clear browser cache after sensitive audits if using shared computers

---

## Support & Feedback

### Getting Help

If you encounter issues not covered in this guide:
1. Check the [Troubleshooting](#troubleshooting) section
2. Contact your GPOC administrator or tool maintainer
3. Review your organization's internal documentation

### Suggesting Improvements

This tool can be enhanced based on user feedback. Consider suggesting:
- New filter options or report types
- Additional SLA rules or tracking metrics
- UI improvements for your workflow
- Integration with other systems

---

## Appendix

### Glossary

- **SLA**: Service Level Agreement - performance commitments for response and resolution
- **First Touch**: Initial substantive update to a ticket after creation
- **Follow-up Cadence**: Required frequency of updates based on severity
- **Pivot Table**: Automated summary report grouping data by categories
- **Coverage Hours**: Time periods when SLA tracking is active (e.g., 24/7 or business hours)
- **Breach**: Failure to meet SLA requirement (late first touch or overdue update)
- **GSF**: Global Service Fulfillment - ticketing system platform

### CSV Template

```csv
IssueId,ShortId,Title,Status,Severity,Age,Item,Assignee Group,Assignee Identity,Last Update Date
GPOC-12345,12345,Network connectivity issue,Open,Sev 2,5,Network,Network Team,john.doe@company.com,2026-04-15 14:30
GPOC-12346,12346,Storage capacity alert,In Progress,Sev 3,12,Storage,Storage Team,jane.smith@company.com,2026-04-14 09:15
GPOC-12347,12347,Performance optimization request,Resolved,Sev 4,45,Compute,Compute Team,bob.jones@company.com,2026-04-10 16:45
```

### Version History

- **v1.0** - Initial release with Data Manager, Audit Checklist, and Reports tabs
- **v2.0** - Added Performance Metrics tab with SLA tracking
- **v2.1** - Enhanced Assignee Identity privacy for PM tickets
- **v2.2** - Added severity breakdown in Resolved Tickets dashboard card

---

**Last Updated**: April 16, 2026  
**Document Version**: 2.2  
**Tool Version**: 2.2
