import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function SchoolOptimizationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">School Optimization</h1>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Analyze enrollment trends and building utilization to develop strategies for consolidation,
                reconfiguration, and portfolio optimization that improve educational outcomes and operational
                efficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden order-2 lg:order-1"></div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6">Right-Sizing Your Portfolio</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Changing demographics, enrollment patterns, and educational models require districts to continuously
                  evaluate their facility portfolios and make strategic adjustments.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We help districts analyze utilization data, project future enrollment, and develop optimization
                  strategies that balance educational quality, operational efficiency, and community impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analysis Areas */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Demographic Analysis</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Comprehensive study of population trends, housing development, and migration patterns to understand
                    enrollment drivers.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Birth rate and cohort progression analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Housing and development impact assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Economic and employment trend analysis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Enrollment Projections</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Multi-year enrollment forecasts at district, school, and grade level to inform capacity planning
                    decisions.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>10-year enrollment projections by school</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Grade-level and program-specific forecasts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Scenario modeling for policy changes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Capacity & Utilization</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Assessment of building capacity, current utilization rates, and opportunities to better align
                    enrollment with available space.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Functional capacity analysis by school</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Utilization rate calculations and benchmarking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Space allocation and efficiency metrics</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Optimization Scenarios</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Development of alternative scenarios for school consolidation, grade reconfiguration, and boundary
                    adjustments.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>School closure and consolidation options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Grade reconfiguration alternatives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Attendance boundary modifications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Transportation & Access Analysis</h2>
            <div className="mb-8">
              <img
                src="/images/Picture5.png"
                alt="Transportation access analysis showing travel routes and catchment areas from a central school location"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-center text-sm text-muted-foreground mt-4">
                Analysis of transportation routes and accessibility from a central school location
              </p>
            </div>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
              Understanding transportation patterns and accessibility is critical for school optimization decisions. We
              analyze travel times, route efficiency, and geographic access to ensure equitable service delivery across
              your district.
            </p>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Geographic Optimization & Scenario Planning</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <img
                  src="/images/Picture4.jpg"
                  alt="Regional analysis showing school locations, utilization zones, and transportation networks"
                  className="w-full rounded-lg shadow-lg"
                />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Regional analysis showing school locations, utilization zones, and transportation networks
                </p>
              </div>
              <div>
                <img
                  src="/images/MPSImage.png"
                  alt="Milwaukee elementary schools map showing school locations, service areas, and optimization scenarios"
                  className="w-full rounded-lg shadow-lg"
                />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Detailed school location mapping with catchment areas and optimization scenarios
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
              Our geographic analysis tools help visualize school locations, transportation patterns, demographic
              distributions, and optimization scenarios to support data-driven decision making about school
              consolidation, boundary changes, and facility investments.
            </p>
          </div>
        </section>

        {/* Considerations */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Considerations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Educational Impact</h3>
                <p className="text-muted-foreground leading-relaxed">
                  How will changes affect program quality, student experience, and educational outcomes? We prioritize
                  solutions that enhance learning opportunities.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Financial Implications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  What are the operating cost savings and capital investment requirements? We model the financial impact
                  of different optimization strategies.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Community Impact</h3>
                <p className="text-muted-foreground leading-relaxed">
                  How will changes affect neighborhoods, families, and community identity? We help districts navigate
                  sensitive community dynamics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Interactive Planning Tools</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We develop custom interactive dashboards and scenario planning tools that allow district leaders to
                  explore optimization options and understand their implications.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Real-time enrollment and capacity modeling
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Interactive maps showing attendance boundaries and demographics
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Scenario comparison tools for evaluating alternatives
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Financial impact calculators and cost-benefit analysis
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                <img
                  src="/interactive-dashboard-data-visualization-planning-.jpg"
                  alt="Interactive planning dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Optimize Your School Portfolio</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Let's analyze your enrollment trends and develop strategies to right-size your facilities.
            </p>
            <Link href="/contact">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
