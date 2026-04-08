import { useState, useMemo, useRef } from 'react';
import { DataRow } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Filter, FilterX, Trash2, Copy, Upload, Download } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface DataManagerProps {
  data: DataRow[];
  setData: (data: DataRow[]) => void;
}

export function DataManager({ data, setData }: DataManagerProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedData, setCopiedData] = useState<DataRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesStatus = filterStatus === 'all' || row.status === filterStatus;
      const matchesSeverity = filterSeverity === 'all' || row.severity.toString() === filterSeverity;
      const matchesSearch =
        searchTerm === '' ||
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [data, filterStatus, filterSeverity, searchTerm]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(data.map(d => d.status))).sort();
  }, [data]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredData.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleClearFilters = () => {
    setFilterStatus('all');
    setFilterSeverity('all');
    setSearchTerm('');
    toast.success('All filters cleared');
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) {
      toast.error('No rows selected');
      return;
    }
    const newData = data.filter((row) => !selectedRows.has(row.id));
    setData(newData);
    setSelectedRows(new Set());
    toast.success(`Deleted ${selectedRows.size} rows`);
  };

  const handleCopySelected = () => {
    if (selectedRows.size === 0) {
      toast.error('No rows selected');
      return;
    }
    const copied = data.filter((row) => selectedRows.has(row.id));
    setCopiedData(copied);
    
    // Also copy to system clipboard as TSV
    const headers = ['ShortId', 'Title', 'Status', 'Severity', 'Age', 'Item'];
    const rows = copied.map(row => [
      row.shortId,
      row.title,
      row.status,
      row.severity,
      row.age,
      row.item
    ].join('\t'));
    const tsv = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(tsv);
    
    toast.success(`Copied ${copied.length} rows to clipboard`);
  };

  const handlePasteData = () => {
    if (copiedData.length === 0) {
      toast.error('No data in clipboard');
      return;
    }
    const newData = copiedData.map((row) => ({
      ...row,
      id: `${Date.now()}-${Math.random()}`,
    }));
    setData([...data, ...newData]);
    toast.success(`Pasted ${newData.length} rows`);
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const parseCSV = (text: string): DataRow[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return [];

    const rows: DataRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= 14) {
        rows.push({
          id: `imported-${i}-${Date.now()}`,
          issueId: values[0] || '',
          issueUrl: values[1] || '',
          severity: parseInt(values[2]) || 0,
          shortId: values[3] || '',
          title: values[4] || '',
          status: values[5] || '',
          assigneeIdentity: values[6] || '',
          assignedGroup: values[7] || '',
          createDate: values[8] || '',
          item: values[9] || '',
          lastUpdatedConversationDate: values[10] || '',
          type: values[11] || '',
          age: parseInt(values[12]) || 0,
          lastUpdatedDate: values[13] || '',
        });
      }
    }

    return rows;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const importedData = parseCSV(text);
      
      if (importedData.length > 0) {
        setData([...data, ...importedData]);
        toast.success(`Imported ${importedData.length} rows from CSV`);
      } else {
        toast.error('No valid data found in CSV file');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    const headers = [
      'IssueId', 'IssueUrl', 'Severity', 'ShortId', 'Title', 'Status',
      'AssigneeIdentity', 'AssignedGroup', 'CreateDate', 'Item',
      'LastUpdatedConversationDate', 'Type', 'Age', 'LastUpdatedDate'
    ];
    
    const csv = [
      headers.join(','),
      ...filteredData.map((row) => [
        row.issueId,
        row.issueUrl,
        row.severity,
        row.shortId,
        `"${row.title.replace(/"/g, '""')}"`,
        row.status,
        row.assigneeIdentity,
        row.assignedGroup,
        row.createDate,
        row.item,
        row.lastUpdatedConversationDate,
        row.type,
        row.age,
        row.lastUpdatedDate,
      ].join(',')),
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpoc-audit-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data exported successfully');
  };

  const getSeverityBadge = (severity: number) => {
    if (severity <= 2) return <Badge variant="destructive">{severity}</Badge>;
    if (severity <= 3) return <Badge className="bg-orange-500">{severity}</Badge>;
    return <Badge variant="outline">{severity}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Assigned': 'bg-blue-500',
      'Work In Progress': 'bg-purple-500',
      'Pending': 'bg-yellow-500',
      'Researching': 'bg-cyan-500',
    };
    
    const color = statusColors[status] || 'bg-slate-500';
    return <Badge className={`${color} text-white`}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Import, filter, and manage GPOC service data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="severity-filter">Severity</Label>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger id="severity-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="2">2 - Critical</SelectItem>
                <SelectItem value="3">3 - High</SelectItem>
                <SelectItem value="4">4 - Medium</SelectItem>
                <SelectItem value="5">5 - Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={handleClearFilters} className="w-full gap-2">
              <FilterX className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
          <div className="flex items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="default" 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleDeleteSelected}
            disabled={selectedRows.size === 0}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedRows.size})
          </Button>
          <Button
            variant="outline"
            onClick={handleCopySelected}
            disabled={selectedRows.size === 0}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Selected
          </Button>
          <Button
            variant="outline"
            onClick={handlePasteData}
            disabled={copiedData.length === 0}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Paste ({copiedData.length})
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2" disabled={data.length === 0}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Data Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ShortId</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Assignee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-12 w-12 text-slate-300" />
                        <div>
                          <p className="font-medium">No data imported</p>
                          <p className="text-sm mt-1">Click "Import CSV" to load your data file</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                      No data found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(row.id)}
                          onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{row.shortId}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={row.title}>{row.title}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell>{getSeverityBadge(row.severity)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.age}d</Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate" title={row.item}>
                        {row.item}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{row.assigneeIdentity}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="text-sm text-slate-600">
          Showing {filteredData.length} of {data.length} records
          {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
        </div>
      </CardContent>
    </Card>
  );
}
