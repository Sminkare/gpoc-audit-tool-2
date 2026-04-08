import { useState, useMemo } from "react";
import { DataRow } from "../App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  RefreshCw,
  Download,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

interface ReportGeneratorProps {
  data: DataRow[];
}

export function ReportGenerator({
  data,
}: ReportGeneratorProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [emailAddress, setEmailAddress] = useState("");
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  // Pivot Table: Status Summary
  const statusSummary = useMemo(() => {
    const summary: {
      [key: string]: {
        count: number;
        avgAge: number;
        totalAge: number;
      };
    } = {};

    data.forEach((row) => {
      if (!summary[row.status]) {
        summary[row.status] = {
          count: 0,
          avgAge: 0,
          totalAge: 0,
        };
      }
      summary[row.status].count += 1;
      summary[row.status].totalAge += row.age;
    });

    Object.keys(summary).forEach((status) => {
      summary[status].avgAge =
        summary[status].totalAge / summary[status].count;
    });

    return Object.entries(summary).map(([status, stats]) => ({
      status,
      ...stats,
    }));
  }, [data, refreshKey]);

  // Pivot Table: Severity Distribution
  const severityDistribution = useMemo(() => {
    const distribution: { [key: number]: number } = {};

    data.forEach((row) => {
      distribution[row.severity] =
        (distribution[row.severity] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([severity, count]) => ({
        severity: parseInt(severity),
        count,
      }))
      .sort((a, b) => a.severity - b.severity);
  }, [data, refreshKey]);

  // Pivot Table: Item/Service Type Analysis
  const itemAnalysis = useMemo(() => {
    const analysis: {
      [key: string]: { count: number; avgAge: number };
    } = {};

    data.forEach((row) => {
      if (!analysis[row.item]) {
        analysis[row.item] = { count: 0, avgAge: 0 };
      }
      analysis[row.item].count += 1;
      analysis[row.item].avgAge += row.age;
    });

    Object.keys(analysis).forEach((item) => {
      analysis[item].avgAge =
        analysis[item].avgAge / analysis[item].count;
    });

    return Object.entries(analysis)
      .map(([item, stats]) => ({
        item,
        ...stats,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10
  }, [data, refreshKey]);

  // Age Distribution Over Time
  const ageDistribution = useMemo(() => {
    const buckets = {
      "0-7 days": 0,
      "8-14 days": 0,
      "15-30 days": 0,
      "31-60 days": 0,
      "60+ days": 0,
    };

    data.forEach((row) => {
      if (row.age <= 7) buckets["0-7 days"]++;
      else if (row.age <= 14) buckets["8-14 days"]++;
      else if (row.age <= 30) buckets["15-30 days"]++;
      else if (row.age <= 60) buckets["31-60 days"]++;
      else buckets["60+ days"]++;
    });

    return Object.entries(buckets).map(([range, count]) => ({
      range,
      count,
    }));
  }, [data, refreshKey]);

  const handleRefreshPivot = () => {
    setRefreshKey((prev) => prev + 1);
    toast.success("Pivot tables refreshed");
  };

  const generateHTMLReport = () => {
    const date = new Date().toLocaleDateString();
    const avgAge = Math.round(
      data.reduce((sum, d) => sum + d.age, 0) / data.length
    );
    const highPriority = data.filter((d) => d.severity <= 3).length;
    const activeWork = data.filter(
      (d) => d.status === "Work In Progress" || d.status === "Assigned"
    ).length;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GPOC Services Audit Report - ${date}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 40px auto;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #2563eb;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 10px;
    }
    h2 {
      color: #1e40af;
      margin-top: 30px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 8px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
    }
    .metric-card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #64748b;
      text-transform: uppercase;
    }
    .metric-value {
      font-size: 36px;
      font-weight: bold;
      color: #1e40af;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
    }
    th {
      background: #2563eb;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:hover {
      background: #f8fafc;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-critical {
      background: #fee2e2;
      color: #991b1b;
    }
    .badge-high {
      background: #fed7aa;
      color: #9a3412;
    }
    .badge-medium {
      background: #fef3c7;
      color: #92400e;
    }
    .badge-low {
      background: #dbeafe;
      color: #1e40af;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>GPOC Services Audit Report</h1>
  <p><strong>Generated:</strong> ${date}</p>
  
  <h2>Executive Summary</h2>
  <div class="summary-grid">
    <div class="metric-card">
      <h3>Total Issues</h3>
      <div class="metric-value">${data.length}</div>
    </div>
    <div class="metric-card">
      <h3>Active Work</h3>
      <div class="metric-value" style="color: #7c3aed;">${activeWork}</div>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">In Progress</p>
    </div>
    <div class="metric-card">
      <h3>Average Age</h3>
      <div class="metric-value" style="color: #0891b2;">${avgAge}</div>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Days</p>
    </div>
    <div class="metric-card">
      <h3>High Priority</h3>
      <div class="metric-value" style="color: #ea580c;">${highPriority}</div>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Critical/High Severity</p>
    </div>
  </div>

  <h2>Status Summary</h2>
  <table>
    <thead>
      <tr>
        <th>Status</th>
        <th>Count</th>
        <th>Average Age (days)</th>
        <th>Total Age</th>
      </tr>
    </thead>
    <tbody>
      ${statusSummary
        .map(
          (row) => `
      <tr>
        <td><strong>${row.status}</strong></td>
        <td>${row.count}</td>
        <td>${row.avgAge.toFixed(1)}</td>
        <td>${row.totalAge}</td>
      </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <h2>Severity Distribution</h2>
  <table>
    <thead>
      <tr>
        <th>Severity Level</th>
        <th>Count</th>
        <th>Percentage</th>
      </tr>
    </thead>
    <tbody>
      ${severityDistribution
        .map(
          (row) => `
      <tr>
        <td>
          <span class="badge ${
            row.severity <= 2
              ? "badge-critical"
              : row.severity === 3
              ? "badge-high"
              : row.severity === 4
              ? "badge-medium"
              : "badge-low"
          }">
            Level ${row.severity}
          </span>
        </td>
        <td>${row.count}</td>
        <td>${((row.count / data.length) * 100).toFixed(1)}%</td>
      </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <h2>Top 10 Service Items</h2>
  <table>
    <thead>
      <tr>
        <th>Service Item</th>
        <th>Count</th>
        <th>Average Age (days)</th>
      </tr>
    </thead>
    <tbody>
      ${itemAnalysis
        .map(
          (row) => `
      <tr>
        <td>${row.item}</td>
        <td>${row.count}</td>
        <td>${row.avgAge.toFixed(1)}</td>
      </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <h2>Age Distribution</h2>
  <table>
    <thead>
      <tr>
        <th>Age Range</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody>
      ${ageDistribution
        .map(
          (row) => `
      <tr>
        <td>${row.range}</td>
        <td>${row.count}</td>
      </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="footer">
    <p>GPOC Services Audit Tool • Generated on ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`;
  };

  const handleExportReport = () => {
    const htmlReport = generateHTMLReport();
    
    const blob = new Blob([htmlReport], {
      type: "text/html",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GPOC-Audit-Report-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    toast.success("Report exported as HTML - Open in browser to view");
  };

  const handleEmailReport = () => {
    if (!emailAddress) {
      toast.error("Please enter an email address");
      return;
    }

    const date = new Date().toLocaleDateString();
    const avgAge = Math.round(
      data.reduce((sum, d) => sum + d.age, 0) / data.length
    );
    const highPriority = data.filter((d) => d.severity <= 3).length;
    const activeWork = data.filter(
      (d) => d.status === "Work In Progress" || d.status === "Assigned"
    ).length;

    const emailSubject = encodeURIComponent(
      `GPOC Services Audit Report - ${date}`
    );
    
    const emailBody = encodeURIComponent(
      `GPOC Services Audit Report - ${date}\n\n` +
      `EXECUTIVE SUMMARY\n` +
      `==================\n` +
      `Total Issues: ${data.length}\n` +
      `Active Work (In Progress): ${activeWork}\n` +
      `Average Age: ${avgAge} days\n` +
      `High Priority Issues: ${highPriority}\n\n` +
      `STATUS SUMMARY\n` +
      `==============\n` +
      statusSummary
        .map(
          (row) =>
            `${row.status}: ${row.count} issues (Avg Age: ${row.avgAge.toFixed(1)} days)`
        )
        .join("\n") +
      `\n\n` +
      `SEVERITY DISTRIBUTION\n` +
      `=====================\n` +
      severityDistribution
        .map(
          (row) =>
            `Level ${row.severity}: ${row.count} (${((row.count / data.length) * 100).toFixed(1)}%)`
        )
        .join("\n") +
      `\n\n` +
      `TOP SERVICE ITEMS\n` +
      `=================\n` +
      itemAnalysis
        .map(
          (row) =>
            `${row.item}: ${row.count} issues (Avg Age: ${row.avgAge.toFixed(1)} days)`
        )
        .join("\n") +
      `\n\n---\nGenerated by GPOC Services Audit Tool\n${new Date().toLocaleString()}`
    );

    window.location.href = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;
    toast.success("Opening email client...");
    setShowEmailDialog(false);
  };

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-slate-500">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <p className="font-medium">
              No data available for reports
            </p>
            <p className="text-sm mt-1">
              Import CSV data to generate reports and analytics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>
                Automated pivot tables and data visualizations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshPivot}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Pivot Tables
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmailDialog(!showEmailDialog)}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Report
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleExportReport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
          
          {showEmailDialog && (
            <div className="mt-4 p-4 border rounded-lg bg-slate-50">
              <Label htmlFor="email-input" className="mb-2 block">
                Email Address
              </Label>
              <div className="flex gap-2">
                <Input
                  id="email-input"
                  type="email"
                  placeholder="recipient@example.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEmailReport();
                  }}
                />
                <Button onClick={handleEmailReport}>Send</Button>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                This will open your default email client with a formatted report
              </p>
            </div>
          )}
        </CardHeader>
      </Card>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="pivot">Pivot Tables</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Total Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Active Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {
                    data.filter(
                      (d) =>
                        d.status === "Work In Progress" ||
                        d.status === "Assigned",
                    ).length
                  }
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  In progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Average Age
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(
                    data.reduce((sum, d) => sum + d.age, 0) /
                      data.length,
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Days old
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  High Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {data.filter((d) => d.severity <= 3).length}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Critical/High severity
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pivot" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Status Summary</CardTitle>
                <CardDescription>
                  Aggregated statistics by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Avg Age</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusSummary.map((row) => (
                      <TableRow key={row.status}>
                        <TableCell>
                          <Badge variant="outline">
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          {row.count}
                        </TableCell>
                        <TableCell className="font-mono">
                          {row.avgAge.toFixed(1)}d
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
                <CardDescription>
                  Count by severity level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {severityDistribution.map((row) => (
                      <TableRow key={row.severity}>
                        <TableCell>
                          <Badge
                            variant={
                              row.severity <= 3
                                ? "destructive"
                                : "outline"
                            }
                          >
                            Level {row.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          {row.count}
                        </TableCell>
                        <TableCell>
                          {(
                            (row.count / data.length) *
                            100
                          ).toFixed(1)}
                          %
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Service Items</CardTitle>
              <CardDescription>
                Most common issue types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Item</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Avg Age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemAnalysis.map((row) => (
                    <TableRow key={row.item}>
                      <TableCell
                        className="font-medium max-w-md truncate"
                        title={row.item}
                      >
                        {row.item}
                      </TableCell>
                      <TableCell className="font-bold">
                        {row.count}
                      </TableCell>
                      <TableCell className="font-mono">
                        {row.avgAge.toFixed(1)}d
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>
                  Issues by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="status"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      name="Issue Count"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Severity Breakdown</CardTitle>
                <CardDescription>
                  Pie chart of severity levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityDistribution}
                      dataKey="count"
                      nameKey="severity"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) =>
                        `Level ${entry.severity}`
                      }
                    >
                      {severityDistribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
              <CardDescription>
                Issues grouped by age ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#10b981"
                    name="Issue Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Service Items</CardTitle>
              <CardDescription>
                Most frequent issue categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={itemAnalysis} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="item"
                    type="category"
                    width={200}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8b5cf6"
                    name="Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
