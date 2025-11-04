import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, Package } from "lucide-react";

const pricingBreakdown = {
  materials: [
    { item: 'Cisco ISR 4451', quantity: 5, unitPrice: 12500, total: 62500 },
    { item: 'Cisco Catalyst 9300', quantity: 12, unitPrice: 8200, total: 98400 },
    { item: 'Palo Alto PA-5220', quantity: 3, unitPrice: 28000, total: 84000 },
  ],
  services: [
    { item: 'Installation & Configuration', hours: 120, rate: 150, total: 18000 },
    { item: 'Performance Testing', hours: 40, rate: 175, total: 7000 },
    { item: 'Acceptance Testing', hours: 32, rate: 175, total: 5600 },
  ],
};

const PricingSummary = () => {
  const materialsTotal = pricingBreakdown.materials.reduce((sum, item) => sum + item.total, 0);
  const servicesTotal = pricingBreakdown.services.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = materialsTotal + servicesTotal;

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
            <CardTitle className="text-3xl">${(materialsTotal / 1000).toFixed(1)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{pricingBreakdown.materials.length} line items</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardDescription>Services Cost</CardDescription>
            <CardTitle className="text-3xl">${(servicesTotal / 1000).toFixed(1)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{pricingBreakdown.services.length} service items</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary shadow-glow">
          <CardHeader>
            <CardDescription>Total Proposal Value</CardDescription>
            <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
              ${(grandTotal / 1000).toFixed(1)}K
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
            {pricingBreakdown.materials.map((item, index) => (
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
            {pricingBreakdown.services.map((item, index) => (
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
