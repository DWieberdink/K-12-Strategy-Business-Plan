import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CapitalPlanningPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="max-w-4xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Capital Planning</h1>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Develop strategic, multi-year capital budgets that prioritize investments, align resources with district
                goals, and ensure sustainable facility improvements.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold mb-6">Strategic Investment Planning</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Effective capital planning requires balancing immediate needs with long-term vision, available
                  resources with community expectations, and maintenance with modernization.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We help districts develop comprehensive capital plans that prioritize projects based on data-driven
                  criteria, establish realistic timelines, and identify sustainable funding strategies.
                </p>
              </div>
              <div className="relative h-96 bg-background rounded-lg overflow-hidden order-2 lg:order-2 lg:col-span-2 flex items-center justify-center">
                <img
                  src="/financial-planning-charts-budget-graphs-capital-in.jpg"
                  alt="Capital planning and budgeting"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Capital Plan Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Needs Assessment</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Comprehensive inventory of capital needs based on facility conditions, educational adequacy, and
                    enrollment projections.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Project Prioritization</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Objective criteria and scoring systems to rank projects based on urgency, impact, and alignment with
                    district goals.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Cost Estimation</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Detailed cost projections for capital projects including construction, equipment, soft costs, and
                    contingencies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Funding Analysis</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Evaluation of funding sources including bonds, state aid, grants, and operating budgets.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Implementation Timeline</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Multi-year phasing plans that sequence projects logically and manage cash flow requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Performance Metrics</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Key indicators to track plan implementation, measure outcomes, and demonstrate accountability.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Planning Approach</h2>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data Collection & Analysis</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Gather comprehensive data on facility conditions, enrollment trends, program needs, and financial
                    capacity to establish a solid foundation for planning.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Stakeholder Engagement</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Facilitate input from administrators, teachers, staff, families, and community members to ensure the
                    plan reflects diverse perspectives and priorities.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scenario Development</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Create multiple planning scenarios that explore different investment levels, project sequences, and
                    funding strategies to inform decision-making.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary">4</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Plan Development</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Synthesize analysis and input into a comprehensive capital plan with clear priorities, timelines,
                    costs, and implementation strategies.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary">5</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Communication & Adoption</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Support plan communication to stakeholders and the broader community, building understanding and
                    support for capital investments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Strategic Capital Planning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Informed Decision-Making</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Data-driven prioritization ensures resources are directed to the highest-impact projects.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Financial Sustainability</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Long-term planning helps districts manage debt, maintain reserves, and avoid financial stress.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Community Confidence</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Transparent planning processes build trust and support for capital investments.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Operational Efficiency</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Strategic investments reduce long-term operating costs and improve facility performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-background">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Develop Your Capital Plan</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Let's create a strategic roadmap for your district's facility investments.
            </p>
            <Button size="lg">Start Planning</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
