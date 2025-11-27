import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EducationalAdequacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="max-w-4xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Educational Adequacy</h1>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Evaluate how well your facilities support educational programs and student learning, ensuring spaces are
                designed to meet the evolving needs of 21st-century education.
              </p>
            </div>
          </div>
        </section>

        {/* Educational Adequacy Assessment Visualization */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="relative h-96 bg-muted/30 rounded-lg overflow-hidden order-2 lg:order-1 lg:col-span-2 flex items-center justify-center">
                <img
                  src="/images/educational-adequacy-assessment.png"
                  alt="Educational Adequacy Assessment showing rosette graphics and multi-dimensional scores for different schools"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="order-1 lg:order-2 lg:col-span-1">
                <h2 className="text-3xl font-bold mb-6">Multi-Dimensional Assessment Framework</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Our educational adequacy assessments evaluate multiple categories including classroom quality, safety and
                  security, presence, assembly spaces, extended learning, organization, community engagement, and
                  environmental quality. The results provide a comprehensive view of how well each facility supports
                  educational programs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Presentation at Different Scales */}
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="order-1 lg:order-1 lg:col-span-1">
                <h2 className="text-3xl font-bold mb-6">Presenting Data at Different Scales</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Educational adequacy data can be presented at multiple scales to serve different audiences and
                  decision-making needs. From detailed classroom-level metrics to district-wide summary visualizations, we
                  create flexible reporting tools that allow stakeholders to explore data at the level of detail most
                  relevant to their needs.
                </p>
              </div>
              <div className="relative h-96 bg-background rounded-lg overflow-hidden order-2 lg:order-2 lg:col-span-2 flex items-center justify-center">
                <img
                  src="/images/ea-data-scales.png"
                  alt="Educational Adequacy data presented at different scales from detailed tables to summary visualizations"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-12 bg-background">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Program Review</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We work with educators to understand current and future program requirements and educational goals.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Facility Assessment</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Comprehensive evaluation of existing spaces against educational standards and best practices.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Gap Analysis</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Identify deficiencies and opportunities to better align facilities with educational programs and
                  student needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Areas */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Assessment Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Program Spaces</h3>
                  <ul className="space-y-2 text-lg text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Science labs and STEM facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Arts, music, and performance spaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Career and technical education workshops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Special education and support services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Physical education and athletic facilities</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Learning Environments</h3>
                  <ul className="space-y-2 text-lg text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Classroom size and configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Flexible and collaborative learning spaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Natural lighting and indoor air quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Acoustics and noise control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Technology infrastructure and connectivity</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Support Spaces</h3>
                  <ul className="space-y-2 text-lg text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Libraries and media centers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Cafeterias and food service facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Administrative and counseling offices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Health and wellness facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Storage and support service areas</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-secondary rounded-full"></div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Access & Equity</h3>
                  <ul className="space-y-2 text-lg text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Universal design and accessibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Equitable distribution of resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Transportation and site access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Safety and security features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      <span className="leading-relaxed">Community use and partnerships</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ensure Your Facilities Support Learning</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Let's evaluate how well your spaces align with your educational vision.
            </p>
            <Button size="lg">Schedule a Consultation</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
