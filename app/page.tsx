import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, TrendingUp, Users, BarChart3, Scale, Wrench } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
                Building the Future of Educational Facilities
              </h1>
              <p className="text-lg lg:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                We partner with school districts to understand demographic trends, assess building conditions, and
                develop strategic plans that ensure facilities support student success and program excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary">
                  Explore Our Services
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Planning Tools Demo Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Interactive Planning Tools</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We build custom interactive tools that enable district leaders to explore scenarios, analyze capacity,
                and make data-driven decisions in real-time.
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="rounded-lg overflow-hidden shadow-xl border border-border">
                <video
                  src="/siteplan-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                  aria-label="Interactive site planning tool demonstration showing building placement, capacity analysis, and capital cost estimation"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Example: Interactive site planning tool for scenario modeling and capacity analysis
              </p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Comprehensive consulting services to help school districts make informed, data-driven decisions about
                their facilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/existing-conditions">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <Building2 className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Existing Conditions Analysis</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Comprehensive assessment of building conditions, systems, and infrastructure to identify
                      maintenance needs and capital improvement priorities.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/educational-adequacy">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Educational Adequacy</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Evaluate how well facilities support current and future educational programs, ensuring spaces meet
                      the needs of students and staff.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/capital-planning">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <Wrench className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Capital Planning</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Develop strategic capital budgets and multi-year investment plans that prioritize projects and
                      align resources with district goals.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/school-optimization">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">School Optimization</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Analyze enrollment trends and building utilization to develop strategies for consolidation,
                      reconfiguration, and portfolio optimization.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/equitable-decision-making">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <Scale className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Equitable Decision Making</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Ensure facilities planning processes center equity, providing all students with access to
                      high-quality learning environments.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Card className="h-full bg-secondary text-secondary-foreground">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary-foreground/10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Interactive Planning Tools</h3>
                  <p className="text-secondary-foreground/90 leading-relaxed">
                    Custom dashboards and interactive tools that enable continuous planning and data-driven decision
                    making for district leaders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Approach</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Data-Driven Analysis</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We leverage demographic data, enrollment projections, and facility assessments to provide
                      actionable insights for strategic planning.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Successful facilities planning requires meaningful stakeholder input. We facilitate inclusive
                      processes that build community support and trust.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Long-Term Vision</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our recommendations balance immediate needs with long-term sustainability, ensuring investments
                      serve students for decades to come.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                <img
                  src="/school-building-architectural-planning-blueprints-.jpg"
                  alt="Facilities planning process"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Facilities?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Let's discuss how we can help your district develop a strategic facilities plan that supports student
              success and community goals.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
