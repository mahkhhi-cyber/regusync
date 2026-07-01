import Link from 'next/link'
import { ArrowRight, Check, Shield } from 'lucide-react'

export const metadata = {
  title: 'Pricing - ReguSync',
  description: 'Simple, transparent pricing for SOC 2 compliance automation.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-brand-600" />
              <Link href="/" className="text-xl font-bold text-gray-900">ReguSync</Link>
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

      {/* Hero */}
      <section className="bg-gray-50 pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Start small, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
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
            
            {/* Growth */}
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
            
            {/* Scale */}
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

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem 
              question="Can I switch plans later?"
              answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle."
            />
            <FAQItem 
              question="Is there a free trial?"
              answer="Yes, every plan includes a 14-day free trial. No credit card required to start."
            />
            <FAQItem 
              question="What happens after my trial ends?"
              answer="You can choose to upgrade to a paid plan, or your account will be paused. You won't lose any data."
            />
            <FAQItem 
              question="Do I need a credit card for the trial?"
              answer="No. We only ask for payment details when you decide to upgrade after your trial."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get SOC 2 compliant?
          </h2>
          <p className="text-gray-600 mb-8">
            Join hundreds of companies using ReguSync to automate their compliance.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-medium text-white hover:bg-brand-700"
          >
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-500">
          <p>© 2024 ReguSync. Built for the future of compliance.</p>
        </div>
      </footer>
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
    <div className={`rounded-2xl p-8 ${highlighted ? 'border-2 border-brand-600 bg-white shadow-lg relative' : 'border border-gray-200 bg-white'}`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <div className="mt-4">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-500">/month</span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-8 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium ${
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-sm text-gray-600">{answer}</p>
    </div>
  )
}
