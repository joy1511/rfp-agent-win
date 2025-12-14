import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { getProductMatching, type ProductMatch } from "@/lib/api";

const ProductMatching = () => {
  const [products, setProducts] = useState<ProductMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductMatching();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch product matching:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
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
        <div className="text-center py-8 text-muted-foreground">Loading product matches...</div>
      </div>
    );
  }

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
        {products.map((product, index) => (
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
