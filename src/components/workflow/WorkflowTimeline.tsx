import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const workflowSteps = [
  {
    id: 1,
    name: 'RFP Identification',
    agent: 'Sales Agent',
    status: 'completed',
    timestamp: '2 mins ago',
    description: 'Found 3 RFPs due in next 90 days',
  },
  {
    id: 2,
    name: 'RFP Analysis',
    agent: 'Main Orchestrator',
    status: 'in-progress',
    timestamp: 'Now',
    description: 'Analyzing selected RFP requirements',
  },
  {
    id: 3,
    name: 'Product Matching',
    agent: 'Technical Agent',
    status: 'pending',
    timestamp: 'Waiting',
    description: 'Match OEM products to requirements',
  },
  {
    id: 4,
    name: 'Price Calculation',
    agent: 'Pricing Agent',
    status: 'pending',
    timestamp: 'Waiting',
    description: 'Calculate final pricing',
  },
];

const statusIcons = {
  completed: CheckCircle2,
  'in-progress': Clock,
  pending: Circle,
};

const statusColors = {
  completed: 'text-success',
  'in-progress': 'text-warning',
  pending: 'text-muted-foreground',
};

const WorkflowTimeline = () => {
  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle>Active Workflow</CardTitle>
        <CardDescription>Current RFP processing pipeline</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {workflowSteps.map((step, index) => {
            const Icon = statusIcons[step.status as keyof typeof statusIcons];
            const isLast = index === workflowSteps.length - 1;
            
            return (
              <div key={step.id} className="relative flex gap-4">
                {!isLast && (
                  <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
                )}
                
                <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-card ${
                  step.status === 'completed' ? 'border-success' :
                  step.status === 'in-progress' ? 'border-warning' :
                  'border-muted'
                }`}>
                  <Icon className={`h-5 w-5 ${statusColors[step.status as keyof typeof statusColors]}`} />
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{step.name}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs">
                        {step.agent}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{step.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowTimeline;
