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
  LineChart,
  Line,
} from "recharts";
import {
  RefreshCw,
  Download,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface ReportGeneratorProps {
  data: DataRow[];
}

export function ReportGenerator({
  data,
}: ReportGeneratorProps) {
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalRecords: data.length,
      statusSummary,
      severityDistribution,
      itemAnalysis,
      ageDistribution,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gpoc-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    toast.success("Report exported");
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
                variant="default"
                size="sm"
                onClick={handleExportReport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
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