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
  CheckCircle2
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface Assessment {
  id: string
  type: string
  framework: string
  status: string
  progress: number
  results: string
  createdAt: string
  orgId: string
  org: { name: string }
}

export default function AssessmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchAssessments()
    }
  }, [status, router])

  const fetchAssessments = async () => {
    try {
      const orgsRes = await fetch('/api/organizations')
      const orgsData = await orgsRes.json()
      const orgs = orgsData.organizations || []
      
      const allAssessments: Assessment[] = []
      for (const org of orgs) {
        const res = await fetch(`/api/assessments?orgId=${org.id}`)
        const data = await res.json()
        if (data.assessments) {
          allAssessments.push(...data.assessments.map((a: any) => ({...a, org})))
        }
      }
      setAssessments(allAssessments)
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
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
          <SidebarLink href="/dashboard" icon={<BarChart3 className="h-5 w-5" />}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/dashboard/policies" icon={<FileText className="h-5 w-5" />}>
            Policies
          </SidebarLink>
          <SidebarLink href="/dashboard/assessments" icon={<BarChart3 className="h-5 w-5" />} active>
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

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Assessments</h1>
          <p className="text-gray-500 mb-8">Review all compliance assessments and readiness checks.</p>

          {assessments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No assessments yet</h2>
              <p className="text-gray-500 mb-6">Run your first SOC 2 readiness assessment from an organization.</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{assessment.framework}</h3>
                      <p className="text-sm text-gray-500">{assessment.org?.name || 'Unknown Organization'}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      assessment.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {assessment.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                      {assessment.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div className="bg-brand-600 h-2 rounded-full transition-all" style={{ width: `${assessment.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Created: {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setSelectedAssessment(assessment)}
                      className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                      View Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedAssessment.framework}</h3>
                <p className="text-sm text-gray-500">{selectedAssessment.org?.name}</p>
              </div>
              <button 
                onClick={() => setSelectedAssessment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">{selectedAssessment.results || 'No detailed results available.'}</p>
              </div>
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
