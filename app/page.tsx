import Link from 'next/link'
import { ArrowRight, Shield, Zap, FileText, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-brand-600" />
              <span className="text-xl font-bold text-gray-900">ReguSync</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gray-50 pt-20 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Get SOC 2 Compliant in <span className="text-brand-600">Weeks</span>, Not Months
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              AI-powered compliance automation that generates policies, collects evidence, and prepares you for audit — all in one platform. Starting at $99/month.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-medium text-white hover:bg-brand-700"
              >
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Learn More
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need for SOC 2</h2>
            <p className="mt-4 text-gray-600">From zero to audit-ready in weeks, not quarters.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-brand-600" />}
              title="AI Policy Generator"
              description="Generate 8+ security policies customized to your company in minutes, not weeks."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-brand-600" />}
              title="Controls Mapping"
              description="Auto-map Trust Services Criteria to your controls with evidence requirements."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-brand-600" />}
              title="Audit Readiness"
              description="Track progress, collect evidence, and export everything for your auditor."
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple Pricing</h2>
            <p className="mt-4 text-gray-600">Start small, scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="$99"
              description="For startups preparing for their first SOC 2"
              features={[
                'SOC 2 Type I automation',
                '5 AI-generated policies',
                'Basic controls mapping',
                'Email support',
              ]}
              cta="Start Free Trial"
              href="/register"
            />
            <PricingCard
              name="Growth"
              price="$299"
              description="For growing teams with ongoing compliance needs"
              features={[
                'SOC 2 Type I & II',
                'Unlimited AI policies',
                'Advanced controls mapping',
                'Evidence collection workflows',
                'Priority support',
              ]}
              cta="Start Free Trial"
              href="/register"
              highlighted
            />
            <PricingCard
              name="Scale"
              price="$799"
              description="For teams with multiple frameworks"
              features={[
                'ISO 27001 + SOC 2 + GDPR',
                'Vendor risk assessments',
                'API access',
                'Custom integrations',
                'Dedicated account manager',
              ]}
              cta="Contact Sales"
              href="/register"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-500">
          <p>© 2024 ReguSync. Built for the future of compliance.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  href,
  highlighted = false,
}: {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  href: string
  highlighted?: boolean
}) {
  return (
    <div className={`rounded-2xl p-8 ${highlighted ? 'border-2 border-brand-600 bg-white shadow-lg' : 'border border-gray-200 bg-white'}`}>
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <div className="mt-4">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-500">/month</span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-8 block w-full rounded-lg px-4 py-2 text-center text-sm font-medium ${
          highlighted
            ? 'bg-brand-600 text-white hover:bg-brand-700'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
