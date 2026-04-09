import { useMemo } from 'react';
import { DataRow } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface PerformanceMetricsProps {
  data: DataRow[];
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  // Calculate minutes between two dates
  const getMinutesDifference = (date1: string, date2: string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60);
  };

  // Check if first touch SLA was met (15 minutes)
  const calculateFirstTouchSLA = useMemo(() => {
    const results = data.map(ticket => {
      const minutesToFirstUpdate = getMinutesDifference(
        ticket.createDate,
        ticket.lastUpdatedConversationDate || ticket.lastUpdatedDate
      );
      return {
        ...ticket,
        firstTouchMinutes: minutesToFirstUpdate,
        firstTouchMet: minutesToFirstUpdate <= 15
      };
    });

    const totalTickets = results.length;
    const metSLA = results.filter(r => r.firstTouchMet).length;
    const breachedSLA = totalTickets - metSLA;
    const complianceRate = totalTickets > 0 ? ((metSLA / totalTickets) * 100).toFixed(1) : '0';

    return {
      results,
      totalTickets,
      metSLA,
      breachedSLA,
      complianceRate
    };
  }, [data]);

  // Calculate follow-up cadence compliance
  const calculateFollowUpCompliance = useMemo(() => {
    const now = new Date();
    const results = data.map(ticket => {
      const daysSinceLastUpdate = Math.floor(
        (now.getTime() - new Date(ticket.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      let expectedCadence = 0;
      let cadenceDescription = '';
      
      if (ticket.severity === 2) {
        expectedCadence = 0.25; // 4 times daily = every 6 hours = 0.25 days
        cadenceDescription = '4x daily';
      } else if (ticket.severity === 3) {
        expectedCadence = 1; // Every 24 hours
        cadenceDescription = 'Every 24hrs';
      } else {
        expectedCadence = 2; // Every 48 hours
        cadenceDescription = 'Every 48hrs';
      }

      const isCompliant = daysSinceLastUpdate <= expectedCadence;
      
      return {
        ...ticket,
        daysSinceLastUpdate,
        expectedCadence,
        cadenceDescription,
        isCompliant
      };
    });

    const totalTickets = results.length;
    const compliant = results.filter(r => r.isCompliant).length;
    const nonCompliant = totalTickets - compliant;
    const complianceRate = totalTickets > 0 ? ((compliant / totalTickets) * 100).toFixed(1) : '0';

    return {
      results,
      totalTickets,
      compliant,
      nonCompliant,
      complianceRate
    };
  }, [data]);

  // Severity breakdown for tickets over 48 hours
  const ticketsOver48Hours = useMemo(() => {
    const over48 = data.filter(d => d.age > 2);
    const bySeverity = {
      sev2: over48.filter(d => d.severity === 2).length,
      sev3: over48.filter(d => d.severity === 3).length,
      sev4: over48.filter(d => d.severity === 4).length,
      sev5: over48.filter(d => d.severity === 5).length,
    };
    
    return {
      total: over48.length,
      ...bySeverity,
      chartData: [
        { name: 'Sev 2', value: bySeverity.sev2, color: '#ef4444' },
        { name: 'Sev 3', value: bySeverity.sev3, color: '#f97316' },
        { name: 'Sev 4', value: bySeverity.sev4, color: '#eab308' },
        { name: 'Sev 5', value: bySeverity.sev5, color: '#94a3b8' },
      ].filter(item => item.value > 0)
    };
  }, [data]);

  // Resolved tickets tracking
  const resolvedMetrics = useMemo(() => {
    const resolvedStatuses = ['Resolved', 'Closed', 'Completed', 'Done'];
    const resolved = data.filter(d => 
      resolvedStatuses.some(status => 
        d.status.toLowerCase().includes(status.toLowerCase())
      )
    );
    
    const bySeverity = {
      sev2: resolved.filter(d => d.severity === 2).length,
      sev3: resolved.filter(d => d.severity === 3).length,
      sev4: resolved.filter(d => d.severity === 4).length,
      sev5: resolved.filter(d => d.severity === 5).length,
    };

    const totalTickets = data.length;
    const resolutionRate = totalTickets > 0 ? ((resolved.length / totalTickets) * 100).toFixed(1) : '0';

    // Calculate average resolution time
    const resolutionTimes = resolved.map(ticket => {
      const created = new Date(ticket.createDate);
      const updated = new Date(ticket.lastUpdatedDate);
      return (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
    });
    
    const avgResolutionTime = resolutionTimes.length > 0 
      ? (resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length).toFixed(1)
      : '0';

    return {
      total: resolved.length,
      bySeverity,
      resolutionRate,
      avgResolutionTime,
      chartData: [
        { name: 'Sev 2', value: bySeverity.sev2 },
        { name: 'Sev 3', value: bySeverity.sev3 },
        { name: 'Sev 4', value: bySeverity.sev4 },
        { name: 'Sev 5', value: bySeverity.sev5 },
      ]
    };
  }, [data]);

  // Priority queue breakdown
  const priorityQueueMetrics = useMemo(() => {
    const sev2FirstTouch = data.filter(d => d.severity === 2 && d.age < 1).length;
    const sev2FollowUp = data.filter(d => d.severity === 2 && d.age >= 1).length;
    const sev35FirstTouch = data.filter(d => d.severity >= 3 && d.age < 1).length;
    const sev35FollowUp = data.filter(d => d.severity >= 3 && d.age >= 1).length;

    return [
      { priority: 1, category: 'Sev 2 First Touches', count: sev2FirstTouch, color: 'bg-red-500' },
      { priority: 2, category: 'Sev 2 Follow-Ups', count: sev2FollowUp, color: 'bg-orange-500' },
      { priority: 3, category: 'Sev 3-5 First Touches', count: sev35FirstTouch, color: 'bg-yellow-500' },
      { priority: 4, category: 'Sev 3-5 Follow-Ups', count: sev35FollowUp, color: 'bg-blue-500' },
    ];
  }, [data]);

  return (
    <div className="space-y-6">
      {/* SLA Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              First Touch SLA (15 Minutes)
            </CardTitle>
            <CardDescription>Tickets actioned within 15 minutes of creation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{calculateFirstTouchSLA.complianceRate}%</div>
                <p className="text-sm text-slate-600 mt-1">Compliance Rate</p>
              </div>
              <div className={`p-4 rounded-full ${parseFloat(calculateFirstTouchSLA.complianceRate) >= 80 ? 'bg-green-100' : 'bg-red-100'}`}>
                {parseFloat(calculateFirstTouchSLA.complianceRate) >= 80 ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-2xl font-bold text-green-600">{calculateFirstTouchSLA.metSLA}</div>
                <p className="text-sm text-slate-600">Met SLA</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{calculateFirstTouchSLA.breachedSLA}</div>
                <p className="text-sm text-slate-600">Breached SLA</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Follow-Up Cadence Compliance
            </CardTitle>
            <CardDescription>Updates matching severity-based cadence requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{calculateFollowUpCompliance.complianceRate}%</div>
                <p className="text-sm text-slate-600 mt-1">Compliance Rate</p>
              </div>
              <div className={`p-4 rounded-full ${parseFloat(calculateFollowUpCompliance.complianceRate) >= 80 ? 'bg-green-100' : 'bg-red-100'}`}>
                {parseFloat(calculateFollowUpCompliance.complianceRate) >= 80 ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-2xl font-bold text-green-600">{calculateFollowUpCompliance.compliant}</div>
                <p className="text-sm text-slate-600">Compliant</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{calculateFollowUpCompliance.nonCompliant}</div>
                <p className="text-sm text-slate-600">Non-Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resolution Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Resolved</CardTitle>
            <CardDescription>Completed tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{resolvedMetrics.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{resolvedMetrics.resolutionRate}% resolution rate</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sev 2:</span>
                <span className="font-medium">{resolvedMetrics.bySeverity.sev2}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sev 3:</span>
                <span className="font-medium">{resolvedMetrics.bySeverity.sev3}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sev 4:</span>
                <span className="font-medium">{resolvedMetrics.bySeverity.sev4}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sev 5:</span>
                <span className="font-medium">{resolvedMetrics.bySeverity.sev5}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Resolution Time</CardTitle>
            <CardDescription>Days to resolve tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{resolvedMetrics.avgResolutionTime}</div>
            <p className="text-sm text-slate-600 mt-1">days average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Over 48 Hours</CardTitle>
            <CardDescription>Not actioned within SLA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{ticketsOver48Hours.total}</div>
            <div className="mt-4 space-y-2">
              {ticketsOver48Hours.sev2 > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Sev 2 (Critical):</span>
                  <Badge variant="destructive">{ticketsOver48Hours.sev2}</Badge>
                </div>
              )}
              {ticketsOver48Hours.sev3 > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Sev 3 (High):</span>
                  <Badge className="bg-orange-500">{ticketsOver48Hours.sev3}</Badge>
                </div>
              )}
              {ticketsOver48Hours.sev4 > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Sev 4 (Medium):</span>
                  <Badge className="bg-yellow-500">{ticketsOver48Hours.sev4}</Badge>
                </div>
              )}
              {ticketsOver48Hours.sev5 > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Sev 5 (Low):</span>
                  <Badge variant="outline">{ticketsOver48Hours.sev5}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Queue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Priority Queue</CardTitle>
          <CardDescription>Tickets organized by SIM queue priority</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="w-48">Visual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priorityQueueMetrics.map((item) => (
                <TableRow key={item.priority}>
                  <TableCell>
                    <Badge variant="outline">P{item.priority}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell className="text-right text-lg font-bold">{item.count}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-6 ${item.color} rounded`} style={{ width: `${Math.max(item.count * 10, 20)}px` }}></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resolution by Severity</CardTitle>
            <CardDescription>Breakdown of resolved tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolvedMetrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10b981" name="Resolved Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Over 48 Hours by Severity</CardTitle>
            <CardDescription>Distribution of aging tickets</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {ticketsOver48Hours.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ticketsOver48Hours.chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ticketsOver48Hours.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 py-12">
                No tickets over 48 hours
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SLA Breach Details */}
      <Card>
        <CardHeader>
          <CardTitle>Follow-Up Cadence Requirements</CardTitle>
          <CardDescription>Expected update frequency by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Required Cadence</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Compliant</TableHead>
                <TableHead className="text-right">Non-Compliant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><Badge variant="destructive">Sev 2</Badge></TableCell>
                <TableCell className="font-medium">4x Daily</TableCell>
                <TableCell className="text-sm text-slate-600">Every 6 hours during coverage</TableCell>
                <TableCell className="text-right text-green-600 font-bold">
                  {calculateFollowUpCompliance.results.filter(r => r.severity === 2 && r.isCompliant).length}
                </TableCell>
                <TableCell className="text-right text-red-600 font-bold">
                  {calculateFollowUpCompliance.results.filter(r => r.severity === 2 && !r.isCompliant).length}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge className="bg-orange-500">Sev 3</Badge></TableCell>
                <TableCell className="font-medium">Every 24 hours</TableCell>
                <TableCell className="text-sm text-slate-600">Once daily during business hours</TableCell>
                <TableCell className="text-right text-green-600 font-bold">
                  {calculateFollowUpCompliance.results.filter(r => r.severity === 3 && r.isCompliant).length}
                </TableCell>
                <TableCell className="text-right text-red-600 font-bold">
                  {calculateFollowUpCompliance.results.filter(r => r.severity === 3 && !r.isCompliant).length}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge className="bg-yellow-500">Sev 4/5</Badge></TableCell>
                <TableCell className="font-medium">Every 48 hours</TableCell>
                <TableCell className="text-sm text-slate-600">Every 2 days during business hours</TableCell>
                <TableCell className="text-right text-green-600 font-bold">
                  {calculateFollowUpCompliance.results.filter(r => r.severity >= 4 && r.isCompliant).length}
                </TableCell>
                <TableCell className="text-right text-red-600 font-bold">
                  {calculateFollowUpCompliance.results.filter(r => r.severity >= 4 && !r.isCompliant).length}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
