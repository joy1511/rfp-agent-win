import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Play } from "lucide-react";
import { getRFPs, type RFP } from "@/lib/api";

interface RFPWithStatus extends RFP {
  status: 'new' | 'reviewed' | 'selected';
  value: string;
}

const statusColors = {
  new: 'bg-primary',
  reviewed: 'bg-warning',
  selected: 'bg-success',
};

interface RFPScannerProps {
  onRFPProcessed?: () => void;
}

const RFPScanner = ({ onRFPProcessed }: RFPScannerProps) => {
  const [rfps, setRfps] = useState<RFPWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRFPs = async () => {
      try {
        const data = await getRFPs();
        // Map backend data to include status and value for UI
        const rfpsWithStatus: RFPWithStatus[] = data.map((rfp, index) => ({
          ...rfp,
          status: index === 0 ? 'new' : index === 1 ? 'reviewed' : 'selected' as 'new' | 'reviewed' | 'selected',
          value: index === 0 ? '$2.5M' : index === 1 ? '$1.8M' : '$3.2M',
        }));
        setRfps(rfpsWithStatus);
      } catch (error) {
        console.error('Failed to fetch RFPs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRFPs();
  }, []);

  const handleProcessRFP = async (rfpId: number) => {
    try {
      // Fetch RFP details from backend
      const data = await getRFPs();
      const rfpDetails = data.find(rfp => rfp.id === rfpId);
      
      if (rfpDetails) {
        // Mark RFP as selected in UI
        setRfps(prevRfps => 
          prevRfps.map(rfp => 
            rfp.id === rfpId ? { ...rfp, status: 'selected' as const } : rfp
          )
        );
        
        // Trigger workflow progression (Main Agent orchestration)
        if (onRFPProcessed) {
          onRFPProcessed();
        }
      }
    } catch (error) {
      console.error('Failed to process RFP:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">RFP Scanner</h2>
            <p className="text-muted-foreground">Opportunities identified for next 90 days</p>
          </div>
          <Button 
            className="gap-2 bg-gradient-primary shadow-glow"
            onClick={() => alert( "Feature Coming Soon!")}
          >
            <Play className="h-4 w-4" />
            Start New Scan
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading RFPs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">RFP Scanner</h2>
          <p className="text-muted-foreground">Opportunities identified for next 90 days</p>
        </div>
        <Button 
          className="gap-2 bg-gradient-primary shadow-glow"
          onClick={() => alert( "Feature Coming Soon!")}
        >
          <Play className="h-4 w-4" />
          Start New Scan
        </Button>
      </div>

      <div className="grid gap-4">
        {rfps.map((rfp) => (
          <Card key={rfp.id} className="shadow-medium transition-all hover:shadow-glow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${statusColors[rfp.status]} text-xs`}>
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
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleProcessRFP(rfp.id)}
                >
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
