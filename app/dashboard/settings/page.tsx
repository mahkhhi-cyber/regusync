'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Loader2,
  ArrowLeft,
  User,
  Bell,
  Lock,
  CreditCard
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-brand-600" />
            <span className="text-xl font-bold">ReguSync</span>
          </div>
        </div>
        <nav className="px-4 space-y-1">
          <SidebarLink href="/dashboard" icon={<BarChart3 className="h-5 w-5" />}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/dashboard/policies" icon={<FileText className="h-5 w-5" />}>
            Policies
          </SidebarLink>
          <SidebarLink href="/dashboard/assessments" icon={<BarChart3 className="h-5 w-5" />}>
            Assessments
          </SidebarLink>
          <SidebarLink href="/dashboard/settings" icon={<Settings className="h-5 w-5" />} active>
            Settings
          </SidebarLink>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-3xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-500 mb-8">Manage your account and preferences.</p>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <User className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                  <p className="text-sm text-gray-500">Your account information</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={session.user?.name || ''}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={session.user?.email || ''}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">Notification settings will be available in a future update.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                  <p className="text-sm text-gray-500">Password and authentication</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">Password change functionality will be available in a future update.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Billing</h2>
                  <p className="text-sm text-gray-500">Subscription and payments</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Current Plan</p>
                  <p className="text-sm text-gray-500">Free Trial (14 days)</p>
                </div>
                <Link
                  href="/pricing"
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Upgrade →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function SidebarLink({ 
  href, 
  icon, 
  children, 
  active = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  active?: boolean 
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {children}
    </Link>
  )
}
