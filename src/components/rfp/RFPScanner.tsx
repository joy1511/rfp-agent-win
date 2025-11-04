import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Play } from "lucide-react";

const mockRFPs = [
  {
    id: 1,
    title: 'Industrial Equipment Supply - Metro Rail Project',
    source: 'gov-procurement.com',
    dueDate: '2025-02-15',
    daysLeft: 28,
    status: 'new',
    value: '$2.5M',
  },
  {
    id: 2,
    title: 'Smart Manufacturing Solutions RFP',
    source: 'enterprise-bids.net',
    dueDate: '2025-02-28',
    daysLeft: 41,
    status: 'reviewed',
    value: '$1.8M',
  },
  {
    id: 3,
    title: 'Telecommunications Infrastructure Upgrade',
    source: 'telecom-rfps.io',
    dueDate: '2025-03-10',
    daysLeft: 51,
    status: 'selected',
    value: '$3.2M',
  },
];

const statusColors = {
  new: 'bg-primary',
  reviewed: 'bg-warning',
  selected: 'bg-success',
};

const RFPScanner = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">RFP Scanner</h2>
          <p className="text-muted-foreground">Opportunities identified for next 90 days</p>
        </div>
        <Button className="gap-2 bg-gradient-primary shadow-glow">
          <Play className="h-4 w-4" />
          Start New Scan
        </Button>
      </div>

      <div className="grid gap-4">
        {mockRFPs.map((rfp) => (
          <Card key={rfp.id} className="shadow-medium transition-all hover:shadow-glow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${statusColors[rfp.status as keyof typeof statusColors]} text-xs`}>
                      {rfp.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{rfp.value}</Badge>
                  </div>
                  <CardTitle className="text-xl">{rfp.title}</CardTitle>
                  <CardDescription className="mt-1">Source: {rfp.source}</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {rfp.dueDate}</span>
                  <Badge variant="secondary" className="ml-2">
                    {rfp.daysLeft} days left
                  </Badge>
                </div>
                <Button variant="default" size="sm">
                  Process RFP
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RFPScanner;
