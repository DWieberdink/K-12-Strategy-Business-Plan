import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function ExistingConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Existing Conditions Analysis</h1>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Comprehensive facility assessments that provide a clear understanding of building conditions, systems
                performance, and infrastructure needs to inform capital planning decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Understanding Your Facilities</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our existing conditions analysis provides a comprehensive evaluation of your district's facilities,
                  identifying immediate maintenance needs, deferred maintenance backlogs, and long-term capital
                  improvement priorities.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We assess building systems, structural integrity, accessibility compliance, and overall facility
                  conditions to create a detailed roadmap for investment and improvement.
                </p>
              </div>
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                <img
                  src="/school-building-exterior-condition-assessment-insp.jpg"
                  alt="Building condition assessment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Capacity Utilization Analysis */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Capacity Utilization Analysis</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              We analyze enrollment patterns and building capacity to identify underutilized and overcrowded facilities,
              helping districts optimize their building portfolio and plan for future needs.
            </p>
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <img
                src="/images/dc-utilization.jpg"
                alt="School utilization maps showing capacity analysis across elementary, middle, and high schools with color-coded utilization rates"
                className="w-full h-auto"
              />
              <p className="text-sm text-muted-foreground text-center mt-4">
                Example: Utilization analysis showing capacity distribution across school levels
              </p>
            </div>
          </div>
        </section>

        {/* Building Age & Lifespan Analysis */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Building Age & Lifespan Analysis</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Understanding the age and remaining useful life of your facilities is critical for capital planning.
                  We assess building systems against their expected lifespans to identify replacement priorities and
                  budget requirements.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our analysis helps districts anticipate major system replacements and plan for modernization needs
                  before facilities reach critical failure points.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-8">
                <img
                  src="/images/building-lifespan.png"
                  alt="Building age distribution chart showing facilities within and exceeding expected lifespan"
                  className="w-full h-auto"
                />
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Building age distribution analysis identifying facilities exceeding expected lifespan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* System Replacement Cost Analysis */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-center">System Replacement Cost Analysis</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              We provide detailed cost estimates for major system replacements across your portfolio, enabling
              data-driven budget planning and equitable resource allocation across all facilities.
            </p>
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <img
                src="/images/system-replacement-cost.jpg"
                alt="Box plot showing distribution of system replacement costs across different geographic areas"
                className="w-full h-auto"
              />
              <p className="text-sm text-muted-foreground text-center mt-4">
                Example: System replacement cost distribution analysis by geographic area
              </p>
            </div>
          </div>
        </section>

        {/* What We Assess */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">What We Assess</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Building Envelope",
                  description: "Roofs, walls, windows, doors, and weatherproofing systems",
                },
                {
                  title: "Mechanical Systems",
                  description: "HVAC, ventilation, and climate control infrastructure",
                },
                {
                  title: "Electrical Systems",
                  description: "Power distribution, lighting, and emergency systems",
                },
                {
                  title: "Plumbing Systems",
                  description: "Water supply, drainage, and fixture conditions",
                },
                {
                  title: "Structural Integrity",
                  description: "Foundations, framing, and load-bearing elements",
                },
                {
                  title: "Life Safety",
                  description: "Fire protection, egress, and emergency systems",
                },
                {
                  title: "Accessibility",
                  description: "ADA compliance and universal design features",
                },
                {
                  title: "Site & Grounds",
                  description: "Parking, playgrounds, athletic fields, and landscaping",
                },
                {
                  title: "Technology Infrastructure",
                  description: "Network cabling, connectivity, and AV systems",
                },
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <CheckCircle2 className="h-6 w-6 text-secondary mb-3" />
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Deliverables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Facility Condition Index (FCI)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Standardized metrics that quantify building conditions and enable comparison across your portfolio.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Deferred Maintenance Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Detailed accounting of maintenance backlogs with cost estimates and prioritization recommendations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Capital Needs Assessment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Multi-year projections of capital improvement needs with cost estimates and timeline
                    recommendations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Interactive Dashboards</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Digital tools that allow district leaders to explore facility data and track improvement progress
                    over time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Get a Clear Picture of Your Facilities</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our existing conditions analysis provides the foundation for strategic facilities planning.
            </p>
            <Button size="lg">Request an Assessment</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
