'use client'

import { useState, useEffect } from 'react'
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
  Eye
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface Policy {
  id: string
  type: string
  title: string
  status: string
  createdAt: string
  orgId: string
  org: { name: string }
}

export default function PoliciesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [policyContent, setPolicyContent] = useState('')
  const [loadingPolicy, setLoadingPolicy] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchPolicies()
    }
  }, [status, router])

  const fetchPolicies = async () => {
    try {
      const orgsRes = await fetch('/api/organizations')
      const orgsData = await orgsRes.json()
      const orgs = orgsData.organizations || []
      
      const allPolicies: Policy[] = []
      for (const org of orgs) {
        const res = await fetch(`/api/policies?orgId=${org.id}`)
        const data = await res.json()
        if (data.policies) {
          allPolicies.push(...data.policies.map((p: any) => ({...p, org})))
        }
      }
      setPolicies(allPolicies)
    } catch (error) {
      console.error('Failed to fetch policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewPolicy = async (policy: Policy) => {
    setSelectedPolicy(policy)
    setLoadingPolicy(true)
    try {
      const res = await fetch(`/api/policies?orgId=${policy.orgId}`)
      const data = await res.json()
      const fullPolicy = data.policies.find((p: any) => p.id === policy.id)
      setPolicyContent(fullPolicy?.content || 'Policy content not available.')
    } catch {
      setPolicyContent('Error loading policy.')
    } finally {
      setLoadingPolicy(false)
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
          <SidebarLink href="/dashboard" icon={<BarChart3 className="h-5 w-5" />}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/dashboard/policies" icon={<FileText className="h-5 w-5" />} active>
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
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Policies</h1>
          <p className="text-gray-500 mb-8">View and manage all generated policies across your organizations.</p>

          {policies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No policies yet</h2>
              <p className="text-gray-500 mb-6">Go to an organization and generate your first policy.</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-700">Policy</th>
                    <th className="px-6 py-3 font-medium text-gray-700">Organization</th>
                    <th className="px-6 py-3 font-medium text-gray-700">Status</th>
                    <th className="px-6 py-3 font-medium text-gray-700">Created</th>
                    <th className="px-6 py-3 font-medium text-gray-700"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {policies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{policy.title}</td>
                      <td className="px-6 py-4 text-gray-500">{policy.org?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(policy.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewPolicy(policy)}
                          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{selectedPolicy.title}</h3>
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {loadingPolicy ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 whitespace-pre-wrap">{policyContent}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
