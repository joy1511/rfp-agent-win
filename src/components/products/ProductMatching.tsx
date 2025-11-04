import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, TrendingUp } from "lucide-react";

const mockProducts = [
  {
    rfpItem: 'Industrial Grade Router',
    topMatch: 'Cisco ISR 4451',
    matchScore: 94,
    alternatives: [
      { name: 'Juniper MX204', score: 89 },
      { name: 'HPE FlexNetwork', score: 85 },
    ],
  },
  {
    rfpItem: 'Network Switch 48-Port',
    topMatch: 'Cisco Catalyst 9300',
    matchScore: 96,
    alternatives: [
      { name: 'Arista 7050X', score: 91 },
      { name: 'Dell PowerSwitch', score: 87 },
    ],
  },
  {
    rfpItem: 'Firewall Appliance',
    topMatch: 'Palo Alto PA-5220',
    matchScore: 92,
    alternatives: [
      { name: 'Fortinet FortiGate 600E', score: 88 },
      { name: 'Check Point 6400', score: 84 },
    ],
  },
];

const ProductMatching = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Product Matching</h2>
          <p className="text-muted-foreground">AI-powered OEM product recommendations</p>
        </div>
        <Badge className="gap-1 bg-gradient-success text-base px-4 py-2">
          <CheckCircle2 className="h-4 w-4" />
          Analysis Complete
        </Badge>
      </div>

      <div className="grid gap-6">
        {mockProducts.map((product, index) => (
          <Card key={index} className="shadow-medium">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">RFP Requirement: {product.rfpItem}</CardTitle>
                  <CardDescription className="mt-1">
                    Top Match: <span className="font-semibold text-foreground">{product.topMatch}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-2xl font-bold text-success">{product.matchScore}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Match Confidence</span>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    Excellent Match
                  </Badge>
                </div>
                <Progress value={product.matchScore} className="h-2" />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Alternative Options</h4>
                <div className="space-y-2">
                  {product.alternatives.map((alt, altIndex) => (
                    <div key={altIndex} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-sm font-medium">{alt.name}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={alt.score} className="h-1.5 w-24" />
                        <span className="text-sm font-semibold text-muted-foreground">{alt.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductMatching;
