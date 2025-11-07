import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Patrick & Douwe Consulting</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Expert consulting for school districts in demographic analysis, building conditions, capital planning, and
              school optimization. We help ensure your facilities support the needs of students and programs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/existing-conditions"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Existing Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/educational-adequacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Educational Adequacy
                </Link>
              </li>
              <li>
                <Link
                  href="/capital-planning"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Capital Planning
                </Link>
              </li>
              <li>
                <Link
                  href="/school-optimization"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  School Optimization
                </Link>
              </li>
              <li>
                <Link
                  href="/equitable-decision-making"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Equitable Decision Making
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@pdconsulting.com</li>
              <li>(555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Patrick & Douwe Consulting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
