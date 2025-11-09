import BusinessPlanDashboard from "@/components/k12/business-plan-dashboard"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navigation />
      <main className="flex-1 py-10">
        <BusinessPlanDashboard />
      </main>
      <Footer />
    </div>
  )
}
