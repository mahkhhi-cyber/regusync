'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, 
  Plus, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Organization {
  id: string
  name: string
  industry: string
  size: string
  createdAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchOrganizations()
    }
  }, [status, router])

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations')
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch (error) {
      console.error('Failed to fetch organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
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
          <SidebarLink href="/dashboard" icon={<BarChart3 className="h-5 w-5" />} active>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/dashboard/policies" icon={<FileText className="h-5 w-5" />}>
            Policies
          </SidebarLink>
          <SidebarLink href="/dashboard/assessments" icon={<BarChart3 className="h-5 w-5" />}>
            Assessments
          </SidebarLink>
          <SidebarLink href="/dashboard/settings" icon={<Settings className="h-5 w-5" />}>
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
        <div className="max-w-5xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500 mb-8">Manage your compliance workspaces</p>

          {orgs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-brand-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Create your first organization</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Set up your company profile to start generating compliance policies and assessments.
              </p>
              <Link
                href="/dashboard/organizations/new"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" />
                Add Organization
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Your Organizations</h2>
                <Link
                  href="/dashboard/organizations/new"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Organization
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orgs.map((org) => (
                  <Link
                    key={org.id}
                    href={`/dashboard/organizations/${org.id}`}
                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600">
                        {org.name}
                      </h3>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-brand-600" />
                    </div>
                    <p className="text-sm text-gray-500">
                      {org.industry} · {org.size}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
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
