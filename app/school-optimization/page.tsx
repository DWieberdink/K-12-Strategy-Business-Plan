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
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
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
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="relative h-96 bg-background rounded-lg overflow-hidden order-2 lg:order-1 lg:col-span-2 flex items-center justify-center">
                <img
                  src="/videos/NHPS_DecisionTool.gif"
                  alt="NHPS Decision Tool visualization"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="order-1 lg:order-2 lg:col-span-1">
                <h2 className="text-3xl font-bold mb-6">Right-Sizing Your Portfolio</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Changing demographics, enrollment patterns, and educational models require districts to continuously
                  evaluate their facility portfolios and make strategic adjustments.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We help districts analyze utilization data, project future enrollment, and develop optimization
                  strategies that balance educational quality, operational efficiency, and community impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="order-1 lg:order-1 lg:col-span-1">
                <h2 className="text-3xl font-bold mb-6">Transportation & Access Analysis</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Understanding transportation patterns and accessibility is critical for school optimization decisions. We
                  analyze travel times, route efficiency, and geographic access to ensure equitable service delivery across
                  your district.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our analysis helps districts understand how transportation constraints and opportunities impact school
                  consolidation, boundary adjustments, and facility location decisions.
                </p>
              </div>
              <div className="relative h-96 bg-background rounded-lg overflow-hidden order-2 lg:order-2 lg:col-span-2 flex items-center justify-center">
                <img
                  src="/videos/transportation analysis.gif"
                  alt="Transportation access analysis showing travel routes and catchment areas from a central school location"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="relative h-96 bg-muted/30 rounded-lg overflow-hidden order-2 lg:order-1 lg:col-span-2 flex items-center justify-center">
                <img
                  src="/images/Picture4.jpg"
                  alt="Regional analysis showing school locations, utilization zones, and transportation networks"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="order-1 lg:order-2 lg:col-span-1">
                <h2 className="text-3xl font-bold mb-6">Geographic Optimization & Scenario Planning</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Our geographic analysis tools help visualize school locations, transportation patterns, demographic
                  distributions, and optimization scenarios to support data-driven decision making about school
                  consolidation, boundary changes, and facility investments.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We develop interactive maps and scenario models that allow district leaders to explore different
                  optimization strategies and understand their geographic and demographic implications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analysis Areas */}
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2">Demographic Analysis</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Comprehensive study of population trends, housing development, and migration patterns to understand
                    enrollment drivers.
                  </p>
                  <ul className="space-y-2 text-lg text-muted-foreground mt-4">
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
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2">Enrollment Projections</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Multi-year enrollment forecasts at district, school, and grade level to inform capacity planning
                    decisions.
                  </p>
                  <ul className="space-y-2 text-lg text-muted-foreground mt-4">
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
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2">Capacity & Utilization</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Assessment of building capacity, current utilization rates, and opportunities to better align
                    enrollment with available space.
                  </p>
                  <ul className="space-y-2 text-lg text-muted-foreground mt-4">
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
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2">Optimization Scenarios</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Development of alternative scenarios for school consolidation, grade reconfiguration, and boundary
                    adjustments.
                  </p>
                  <ul className="space-y-2 text-lg text-muted-foreground mt-4">
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

        {/* Considerations */}
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Considerations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Educational Impact</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    How will changes affect program quality, student experience, and educational outcomes? We prioritize
                    solutions that enhance learning opportunities.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Financial Implications</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    What are the operating cost savings and capital investment requirements? We model the financial impact
                    of different optimization strategies.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Community Impact</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    How will changes affect neighborhoods, families, and community identity? We help districts navigate
                    sensitive community dynamics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-background">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
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
