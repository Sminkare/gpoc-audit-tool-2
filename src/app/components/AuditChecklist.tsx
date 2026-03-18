import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AuditStep {
  id: string;
  step: string;
  completed: boolean;
  category: string;
}

interface AuditChecklistProps {
  auditSteps: AuditStep[];
  setAuditSteps: (steps: AuditStep[]) => void;
}

export function AuditChecklist({ auditSteps, setAuditSteps }: AuditChecklistProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Steps' },
    { value: 'preparation', label: 'Preparation' },
    { value: 'review', label: 'Review' },
    { value: 'filtering', label: 'Filtering' },
    { value: 'cleaning', label: 'Data Cleaning' },
    { value: 'reporting', label: 'Reporting' },
    { value: 'verification', label: 'Verification' },
    { value: 'export', label: 'Export' },
  ];

  const filteredSteps = categoryFilter === 'all' 
    ? auditSteps 
    : auditSteps.filter(step => step.category === categoryFilter);

  const completedCount = auditSteps.filter((step) => step.completed).length;
  const totalCount = auditSteps.length;
  const progressPercent = (completedCount / totalCount) * 100;

  const handleToggleStep = (id: string) => {
    const newSteps = auditSteps.map((step) =>
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    setAuditSteps(newSteps);
    
    const step = auditSteps.find(s => s.id === id);
    if (step && !step.completed) {
      toast.success(`Completed: ${step.step}`);
    }
  };

  const handleResetChecklist = () => {
    const newSteps = auditSteps.map((step) => ({ ...step, completed: false }));
    setAuditSteps(newSteps);
    toast.success('Checklist reset');
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      preparation: 'bg-blue-500',
      review: 'bg-purple-500',
      filtering: 'bg-green-500',
      cleaning: 'bg-orange-500',
      reporting: 'bg-pink-500',
      verification: 'bg-yellow-500',
      export: 'bg-cyan-500',
    };
    return colors[category] || 'bg-slate-500';
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Audit Checklist</CardTitle>
                <CardDescription>
                  Follow these steps to complete the GPOC services audit
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetChecklist} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {filteredSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                    step.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Checkbox
                    id={`step-${step.id}`}
                    checked={step.completed}
                    onCheckedChange={() => handleToggleStep(step.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`step-${step.id}`}
                      className={`block cursor-pointer ${
                        step.completed ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      <span className="font-medium">Step {auditSteps.indexOf(step) + 1}:</span> {step.step}
                    </label>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 ${getCategoryColor(step.category)} text-white border-0`}
                    >
                      {getCategoryLabel(step.category)}
                    </Badge>
                  </div>
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300 mt-1" />
                  )}
                </div>
              ))}
              {filteredSteps.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No steps found in this category
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Track your audit completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{completedCount}/{totalCount}</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <p className="text-xs text-slate-600 mt-2">
                {progressPercent.toFixed(0)}% complete
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Steps by Category</h4>
              {categories.filter(c => c.value !== 'all').map((category) => {
                const categorySteps = auditSteps.filter(s => s.category === category.value);
                const categoryCompleted = categorySteps.filter(s => s.completed).length;
                const categoryTotal = categorySteps.length;
                
                if (categoryTotal === 0) return null;
                
                return (
                  <div key={category.value} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(category.value)}`} />
                        <span>{category.label}</span>
                      </div>
                      <span className="text-slate-600">
                        {categoryCompleted}/{categoryTotal}
                      </span>
                    </div>
                    <Progress 
                      value={(categoryCompleted / categoryTotal) * 100} 
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>

            {completedCount === totalCount && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Audit Complete!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  All audit steps have been completed successfully.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              Export Audit Log
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Print Checklist
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Email Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}