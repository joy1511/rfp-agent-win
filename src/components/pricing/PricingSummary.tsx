import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, Package } from "lucide-react";
import { getPricingSummary, type PricingSummary } from "@/lib/api";

const PricingSummary = () => {
  const [pricingData, setPricingData] = useState<PricingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await getPricingSummary();
        setPricingData(data);
      } catch (error) {
        console.error('Failed to fetch pricing summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Pricing Summary</h2>
            <p className="text-muted-foreground">Complete cost breakdown for RFP response</p>
          </div>
          <Button className="gap-2 bg-gradient-primary shadow-glow">
            <Download className="h-4 w-4" />
            Export Proposal
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading pricing data...</div>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Pricing Summary</h2>
            <p className="text-muted-foreground">Complete cost breakdown for RFP response</p>
          </div>
          <Button className="gap-2 bg-gradient-primary shadow-glow">
            <Download className="h-4 w-4" />
            Export Proposal
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">No pricing data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Pricing Summary</h2>
          <p className="text-muted-foreground">Complete cost breakdown for RFP response</p>
        </div>
        <Button className="gap-2 bg-gradient-primary shadow-glow">
          <Download className="h-4 w-4" />
          Export Proposal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-medium">
          <CardHeader>
            <CardDescription>Materials Cost</CardDescription>
            <CardTitle className="text-3xl">${(pricingData.materialCost / 1000).toFixed(1)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{pricingData.materialsBreakdown.length} line items</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardDescription>Services Cost</CardDescription>
            <CardTitle className="text-3xl">${(pricingData.serviceCost / 1000).toFixed(1)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{pricingData.servicesBreakdown.length} service items</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary shadow-glow">
          <CardHeader>
            <CardDescription>Total Proposal Value</CardDescription>
            <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
              ${(pricingData.totalProposalValue / 1000).toFixed(1)}K
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-success">Ready to Submit</Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Materials Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pricingData.materialsBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="flex-1">
                  <p className="font-medium">{item.item}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} × ${item.unitPrice.toLocaleString()}
                  </p>
                </div>
                <p className="text-lg font-bold">${item.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Services Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pricingData.servicesBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="flex-1">
                  <p className="font-medium">{item.item}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.hours} hours × ${item.rate}/hr
                  </p>
                </div>
                <p className="text-lg font-bold">${item.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSummary;
