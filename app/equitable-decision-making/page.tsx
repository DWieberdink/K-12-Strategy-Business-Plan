import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EquitableDecisionMakingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="max-w-4xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Equitable Decision Making</h1>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Center equity in facilities planning to ensure all students have access to high-quality learning
                environments, regardless of their background or neighborhood.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold mb-6">Equity as a Foundation</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Facilities planning decisions have profound implications for educational equity. The quality and
                  condition of school buildings directly impact student learning, health, and sense of belonging.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We help districts embed equity considerations throughout the planning process, from data analysis to
                  community engagement to project prioritization, ensuring that investments address historical
                  inequities and promote equitable outcomes.
                </p>
              </div>
              <div className="relative h-96 bg-background rounded-lg overflow-hidden order-2 lg:order-2 lg:col-span-2 flex items-center justify-center">
                <img
                  src="/diverse-students-learning-together-inclusive-class.jpg"
                  alt="Diverse students in quality learning environment"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Framework */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Equity Framework</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Equity Analysis</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Examine disparities in facility conditions, program access, and resource allocation across schools
                    serving different student populations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Inclusive Engagement</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Design engagement processes that reach historically marginalized communities and ensure diverse
                    voices shape planning decisions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Equity Criteria</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Develop prioritization criteria that explicitly consider equity impacts and direct resources to
                    schools with greatest need.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Impact Assessment</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Evaluate how proposed changes will affect different student groups and communities, identifying
                    potential disparate impacts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Accountability</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Establish metrics and monitoring systems to track progress toward equity goals and ensure
                    commitments are fulfilled.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-2">Continuous Improvement</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Build capacity for ongoing equity analysis and adjustment as conditions change and new disparities
                    emerge.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Questions */}
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Equity Questions</h2>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Do all students have access to quality facilities?</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Are there disparities in building conditions, maintenance, or amenities between schools serving
                    different student populations?
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
                  <h3 className="text-xl font-semibold mb-2">Are resources distributed equitably?</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Does capital investment align with student need, or do historical patterns perpetuate inequitable
                    resource allocation?
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
                  <h3 className="text-xl font-semibold mb-2">Who is included in decision-making?</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Are engagement processes accessible and inclusive, particularly for families who have been
                    historically excluded from planning?
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
                  <h3 className="text-xl font-semibold mb-2">How will changes affect different communities?</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Do proposed consolidations, boundary changes, or closures disproportionately impact specific student
                    groups or neighborhoods?
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
                  <h3 className="text-xl font-semibold mb-2">Are we addressing root causes?</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Does the plan tackle systemic inequities, or does it maintain existing patterns of advantage and
                    disadvantage?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="relative h-96 bg-muted/30 rounded-lg overflow-hidden order-2 lg:order-1 lg:col-span-2 flex items-center justify-center">
                <img
                  src="/community-meeting-diverse-group-discussion-plannin.jpg"
                  alt="Community engagement and inclusive planning"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="order-1 lg:order-2 lg:col-span-1">
                <h2 className="text-3xl font-bold mb-6">Centering Community Voice</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Equitable planning requires authentic community engagement that goes beyond traditional public
                  meetings to reach families where they are.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-lg text-muted-foreground leading-relaxed">
                      Multilingual materials and interpretation services
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-lg text-muted-foreground leading-relaxed">
                      Meetings in neighborhoods and community spaces
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-lg text-muted-foreground leading-relaxed">
                      Multiple engagement formats and accessibility accommodations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-lg text-muted-foreground leading-relaxed">
                      Partnership with community organizations and trusted messengers
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-background">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Plan with Equity at the Center</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Let's work together to ensure your facilities planning promotes equitable outcomes for all students.
            </p>
            <Button size="lg">Start the Conversation</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
