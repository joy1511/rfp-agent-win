import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AgentOrchestrator from "@/components/agents/AgentOrchestrator";
import RFPScanner from "@/components/rfp/RFPScanner";
import ProductMatching from "@/components/products/ProductMatching";
import PricingSummary from "@/components/pricing/PricingSummary";
import WorkflowTimeline from "@/components/workflow/WorkflowTimeline";

const Index = () => {
  const [activeView, setActiveView] = useState<'overview' | 'rfp' | 'products' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container mx-auto px-6 py-8">
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AgentOrchestrator />
            </div>
            <WorkflowTimeline />
          </div>
        )}

        {activeView === 'rfp' && <RFPScanner />}
        {activeView === 'products' && <ProductMatching />}
        {activeView === 'pricing' && <PricingSummary />}
      </main>
    </div>
  );
};

export default Index;
