import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Search, Wrench, DollarSign, Activity } from "lucide-react";

const agents = [
  {
    id: 'main',
    name: 'Main Orchestrator',
    icon: Brain,
    status: 'active',
    description: 'Coordinates all agent activities',
    color: 'bg-gradient-primary',
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    icon: Search,
    status: 'scanning',
    description: 'Scanning RFP sources',
    color: 'bg-gradient-success',
  },
  {
    id: 'technical',
    name: 'Technical Agent',
    icon: Wrench,
    status: 'idle',
    description: 'Ready for product matching',
    color: 'bg-muted',
  },
  {
    id: 'pricing',
    name: 'Pricing Agent',
    icon: DollarSign,
    status: 'idle',
    description: 'Awaiting product data',
    color: 'bg-muted',
  },
];

const statusColors = {
  active: 'bg-success',
  scanning: 'bg-warning',
  idle: 'bg-muted-foreground',
};

const AgentOrchestrator = () => {
  return (
    <>
      {agents.map((agent) => {
        const Icon = agent.icon;
        return (
          <Card key={agent.id} className="relative overflow-hidden shadow-medium transition-all hover:shadow-glow">
            <div className={`absolute inset-x-0 top-0 h-1 ${agent.color}`} />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${agent.color}`}>
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${statusColors[agent.status as keyof typeof statusColors]} animate-pulse`} />
                  <Badge variant="secondary" className="text-xs">
                    {agent.status}
                  </Badge>
                </div>
              </div>
              <CardTitle className="mt-3 text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-xs">{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                <span>Active monitoring</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default AgentOrchestrator;
