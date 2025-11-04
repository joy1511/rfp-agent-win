import { Button } from "@/components/ui/button";
import { Brain, FileText, Package, DollarSign } from "lucide-react";

interface DashboardHeaderProps {
  activeView: 'overview' | 'rfp' | 'products' | 'pricing';
  onViewChange: (view: 'overview' | 'rfp' | 'products' | 'pricing') => void;
}

const DashboardHeader = ({ activeView, onViewChange }: DashboardHeaderProps) => {
  return (
    <header className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">RFP Agent AI</h1>
              <p className="text-sm text-muted-foreground">Intelligent RFP Response Automation</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <Button
              variant={activeView === 'overview' ? 'default' : 'ghost'}
              onClick={() => onViewChange('overview')}
              className="gap-2"
            >
              <Brain className="h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeView === 'rfp' ? 'default' : 'ghost'}
              onClick={() => onViewChange('rfp')}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              RFP Scanner
            </Button>
            <Button
              variant={activeView === 'products' ? 'default' : 'ghost'}
              onClick={() => onViewChange('products')}
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              Products
            </Button>
            <Button
              variant={activeView === 'pricing' ? 'default' : 'ghost'}
              onClick={() => onViewChange('pricing')}
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Pricing
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
