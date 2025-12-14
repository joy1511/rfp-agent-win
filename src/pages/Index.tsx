import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AgentOrchestrator from "@/components/agents/AgentOrchestrator";
import RFPScanner from "@/components/rfp/RFPScanner";
import ProductMatching from "@/components/products/ProductMatching";
import PricingSummary from "@/components/pricing/PricingSummary";
import WorkflowTimeline from "@/components/workflow/WorkflowTimeline";

const Index = () => {
  const [activeView, setActiveView] = useState<'overview' | 'rfp' | 'products' | 'pricing'>('overview');
  const [workflowInProgress, setWorkflowInProgress] = useState(false);

  // Handle workflow progression after RFP is processed
  const handleRFPProcessed = () => {
    setWorkflowInProgress(true);
    
    // Step 1: Show Product Matching after RFP is processed (simulate processing time)
    setTimeout(() => {
      setActiveView('products');
      
      // Step 2: Show Pricing Summary after Product Matching (simulate analysis time)
      setTimeout(() => {
        setActiveView('pricing');
        setWorkflowInProgress(false);
      }, 2000); // 2 seconds delay for product matching
    }, 1000); // 1 second delay for RFP processing
  };

  // Allow manual view changes only when workflow is not in progress
  const handleViewChange = (view: 'overview' | 'rfp' | 'products' | 'pricing') => {
    if (!workflowInProgress) {
      setActiveView(view);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeView={activeView} onViewChange={handleViewChange} />
      
      <main className="container mx-auto px-6 py-8">
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AgentOrchestrator />
            </div>
            <WorkflowTimeline />
          </div>
        )}

        {activeView === 'rfp' && <RFPScanner onRFPProcessed={handleRFPProcessed} />}
        {activeView === 'products' && <ProductMatching />}
        {activeView === 'pricing' && <PricingSummary />}
      </main>
    </div>
  );
};

export default Index;
