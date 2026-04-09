import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { DataManager } from './components/DataManager';
import { AuditChecklist } from './components/AuditChecklist';
import { ReportGenerator } from './components/ReportGenerator';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { FileSpreadsheet, ClipboardCheck, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';

export interface DataRow {
  id: string;
  issueId: string;
  issueUrl: string;
  severity: number;
  shortId: string;
  title: string;
  status: string;
  assigneeIdentity: string;
  assignedGroup: string;
  createDate: string;
  item: string;
  lastUpdatedConversationDate: string;
  type: string;
  age: number;
  lastUpdatedDate: string;
}

function App() {
  const [data, setData] = useState<DataRow[]>([]);

  const [auditSteps, setAuditSteps] = useState([
    { id: '1', step: 'Clear all filters from data table', completed: false, category: 'preparation' },
    { id: '2', step: 'Import CSV data file', completed: false, category: 'preparation' },
    { id: '3', step: 'Review data for anomalies and inconsistencies', completed: false, category: 'review' },
    { id: '4', step: 'Filter by status and severity', completed: false, category: 'filtering' },
    { id: '5', step: 'Delete rows with incomplete or invalid data', completed: false, category: 'cleaning' },
    { id: '6', step: 'Copy filtered data to clipboard', completed: false, category: 'reporting' },
    { id: '7', step: 'Refresh pivot tables and reports', completed: false, category: 'reporting' },
    { id: '8', step: 'Update status summaries and metrics', completed: false, category: 'reporting' },
    { id: '9', step: 'Verify all calculations and aggregations', completed: false, category: 'verification' },
    { id: '10', step: 'Export final audit report', completed: false, category: 'export' },
  ]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getOldestUpdateDate = () => {
    if (data.length === 0) return 'N/A';
    
    const oldestDateStr = data.reduce((oldest, d) => {
      if (!oldest) return d.lastUpdatedDate;
      const currentDate = new Date(d.lastUpdatedDate);
      const oldestDate = new Date(oldest);
      return currentDate < oldestDate ? d.lastUpdatedDate : oldest;
    }, data[0].lastUpdatedDate);
    
    return formatDate(oldestDateStr);
  };

  const getTicketsOver48Hours = () => {
    if (data.length === 0) return { total: 0, bySeverity: {} };
    
    const over48 = data.filter(d => d.age > 2);
    const bySeverity = {
      sev2: over48.filter(d => d.severity === 2).length,
      sev3: over48.filter(d => d.severity === 3).length,
      sev4: over48.filter(d => d.severity === 4).length,
      sev5: over48.filter(d => d.severity === 5).length,
    };
    
    return {
      total: over48.length,
      bySeverity
    };
  };

  const getResolvedMetrics = () => {
    if (data.length === 0) return { total: 0, rate: '0' };
    
    const resolvedStatuses = ['Resolved', 'Closed', 'Completed', 'Done'];
    const resolved = data.filter(d => 
      resolvedStatuses.some(status => 
        d.status.toLowerCase().includes(status.toLowerCase())
      )
    );
    
    const rate = ((resolved.length / data.length) * 100).toFixed(1);
    
    return {
      total: resolved.length,
      rate
    };
  };

  const ticketsOver48Hours = getTicketsOver48Hours();
  const resolvedMetrics = getResolvedMetrics();

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster />
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900">GPOC Services Audit Tool</h1>
          <p className="text-slate-600 mt-1">GSF Soft Services Data Management & Reporting</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.length}</div>
              <p className="text-xs text-slate-600 mt-1">Imported issues</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Oldest Update Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {getOldestUpdateDate()}
              </div>
              <p className="text-xs text-slate-600 mt-1">Oldest ticket not updated</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {resolvedMetrics.total}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {resolvedMetrics.rate}% rate
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Over 48 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {ticketsOver48Hours.total}
              </div>
              <div className="mt-2 space-y-1">
                {ticketsOver48Hours.bySeverity.sev2 > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Sev 2:</span>
                    <Badge variant="destructive" className="text-xs">
                      {ticketsOver48Hours.bySeverity.sev2}
                    </Badge>
                  </div>
                )}
                {ticketsOver48Hours.bySeverity.sev3 > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Sev 3:</span>
                    <Badge className="bg-orange-500 text-xs">
                      {ticketsOver48Hours.bySeverity.sev3}
                    </Badge>
                  </div>
                )}
                {ticketsOver48Hours.bySeverity.sev4 > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Sev 4:</span>
                    <Badge className="bg-yellow-500 text-xs">
                      {ticketsOver48Hours.bySeverity.sev4}
                    </Badge>
                  </div>
                )}
                {ticketsOver48Hours.bySeverity.sev5 > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Sev 5:</span>
                    <Badge variant="outline" className="text-xs">
                      {ticketsOver48Hours.bySeverity.sev5}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="data" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Data Manager</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Audit Checklist</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data">
            <DataManager data={data} setData={setData} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetrics data={data} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditChecklist auditSteps={auditSteps} setAuditSteps={setAuditSteps} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportGenerator data={data} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;

