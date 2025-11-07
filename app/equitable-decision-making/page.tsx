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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Equitable Decision Making</h1>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Center equity in facilities planning to ensure all students have access to high-quality learning
                environments, regardless of their background or neighborhood.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Equity as a Foundation</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Facilities planning decisions have profound implications for educational equity. The quality and
                  condition of school buildings directly impact student learning, health, and sense of belonging.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We help districts embed equity considerations throughout the planning process, from data analysis to
                  community engagement to project prioritization, ensuring that investments address historical
                  inequities and promote equitable outcomes.
                </p>
              </div>
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                <img
                  src="/diverse-students-learning-together-inclusive-class.jpg"
                  alt="Diverse students in quality learning environment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Framework */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Equity Framework</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Equity Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Examine disparities in facility conditions, program access, and resource allocation across schools
                    serving different student populations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Inclusive Engagement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Design engagement processes that reach historically marginalized communities and ensure diverse
                    voices shape planning decisions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Equity Criteria</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Develop prioritization criteria that explicitly consider equity impacts and direct resources to
                    schools with greatest need.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Impact Assessment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Evaluate how proposed changes will affect different student groups and communities, identifying
                    potential disparate impacts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Accountability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Establish metrics and monitoring systems to track progress toward equity goals and ensure
                    commitments are fulfilled.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Continuous Improvement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Build capacity for ongoing equity analysis and adjustment as conditions change and new disparities
                    emerge.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Questions */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Equity Questions</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Do all students have access to quality facilities?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Are there disparities in building conditions, maintenance, or amenities between schools serving
                    different student populations?
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Are resources distributed equitably?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Does capital investment align with student need, or do historical patterns perpetuate inequitable
                    resource allocation?
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Who is included in decision-making?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Are engagement processes accessible and inclusive, particularly for families who have been
                    historically excluded from planning?
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How will changes affect different communities?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Do proposed consolidations, boundary changes, or closures disproportionately impact specific student
                    groups or neighborhoods?
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Are we addressing root causes?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Does the plan tackle systemic inequities, or does it maintain existing patterns of advantage and
                    disadvantage?
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden order-2 lg:order-1">
                <img
                  src="/community-meeting-diverse-group-discussion-plannin.jpg"
                  alt="Community engagement and inclusive planning"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6">Centering Community Voice</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Equitable planning requires authentic community engagement that goes beyond traditional public
                  meetings to reach families where they are.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Multilingual materials and interpretation services
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Meetings in neighborhoods and community spaces
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Multiple engagement formats and accessibility accommodations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Partnership with community organizations and trusted messengers
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
