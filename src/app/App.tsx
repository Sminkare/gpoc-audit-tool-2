import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { DataManager } from './components/DataManager';
import { AuditChecklist } from './components/AuditChecklist';
import { ReportGenerator } from './components/ReportGenerator';
import { FileSpreadsheet, ClipboardCheck, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
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

  const getLatestUpdateDate = () => {
    if (data.length === 0) return 'N/A';
    
    const latestDateStr = data.reduce((latest, d) => {
      if (!latest) return d.lastUpdatedDate;
      const currentDate = new Date(d.lastUpdatedDate);
      const latestDate = new Date(latest);
      return currentDate > latestDate ? d.lastUpdatedDate : latest;
    }, data[0].lastUpdatedDate);
    
    return formatDate(latestDateStr);
  };

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
              <CardTitle className="text-sm font-medium">Last Update Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {getLatestUpdateDate()}
              </div>
              <p className="text-xs text-slate-600 mt-1">Most recent update</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data.filter(d => d.status === 'Pending').length}
              </div>
              <p className="text-xs text-slate-600 mt-1">Awaiting action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg Age</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.age, 0) / data.length) : 0}
              </div>
              <p className="text-xs text-slate-600 mt-1">Days old</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="data" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Data Manager</span>
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
