'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  BarChart3, 
  Loader2, 
  Sparkles,
  CheckCircle2,
  Clock,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Policy {
  id: string
  type: string
  title: string
  status: string
  createdAt: string
}

interface Assessment {
  id: string
  type: string
  framework: string
  status: string
  progress: number
  createdAt: string
}

const POLICY_TYPES = [
  { key: 'access-control', label: 'Access Control Policy' },
  { key: 'asset-management', label: 'Asset Management Policy' },
  { key: 'business-continuity', label: 'Business Continuity & DR' },
  { key: 'change-management', label: 'Change Management Policy' },
  { key: 'data-classification', label: 'Data Classification' },
  { key: 'incident-response', label: 'Incident Response' },
  { key: 'risk-assessment', label: 'Risk Assessment' },
  { key: 'vendor-management', label: 'Vendor Management' },
]

export default function OrganizationPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string
  
  const [policies, setPolicies] = useState<Policy[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [policyContent, setPolicyContent] = useState('')
  const [loadingPolicy, setLoadingPolicy] = useState(false)

  useEffect(() => {
    fetchData()
  }, [orgId])

  const fetchData = async () => {
    try {
      const [policiesRes, assessmentsRes] = await Promise.all([
        fetch(`/api/policies?orgId=${orgId}`),
        fetch(`/api/assessments?orgId=${orgId}`),
      ])
      const policiesData = await policiesRes.json()
      const assessmentsData = await assessmentsRes.json()
      setPolicies(policiesData.policies || [])
      setAssessments(assessmentsData.assessments || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePolicy = async (policyType: string) => {
    setGenerating(policyType)
    try {
      const res = await fetch('/api/policies/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, policyType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Policy generated!')
      fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate policy')
    } finally {
      setGenerating(null)
    }
  }

  const runAssessment = async () => {
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orgId, 
          type: 'soc2-readiness', 
          framework: 'SOC 2 Trust Services Criteria' 
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Assessment completed!')
      fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to run assessment')
    }
  }

  const viewPolicy = async (policy: Policy) => {
    setSelectedPolicy(policy)
    setLoadingPolicy(true)
    try {
      const res = await fetch(`/api/policies?orgId=${orgId}`)
      const data = await res.json()
      const fullPolicy = data.policies.find((p: Policy) => p.id === policy.id)
      setPolicyContent(fullPolicy?.content || 'Policy content loaded...')
    } catch {
      setPolicyContent('Error loading policy')
    } finally {
      setLoadingPolicy(false)
    }
  }

  const uniquePolicyTypes = new Set(policies.map(p => p.type))
  const generateAllMissing = async () => {
    const missing = POLICY_TYPES.filter(pt => !uniquePolicyTypes.has(pt.key))
    if (missing.length === 0) {
      toast.success('All policies are already generated!')
      return
    }
    for (const pt of missing) {
      await generatePolicy(pt.key)
    }
    toast.success(`Generated ${missing.length} missing policies!`)
  }

  const progress = Math.min(100, Math.round((uniquePolicyTypes.size / POLICY_TYPES.length) * 100))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SOC 2 Readiness</h1>
              <p className="text-gray-500 mt-1">Track your compliance progress</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-600">{progress}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div 
              className="bg-brand-600 h-3 rounded-full transition-all" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-600" />
                  Policies ({uniquePolicyTypes.size}/{POLICY_TYPES.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {POLICY_TYPES.map((pt) => {
                  const generated = policies.find((p) => p.type === pt.key)
                  return (
                    <div
                      key={pt.key}
                      className={`rounded-xl border p-4 transition-all ${
                        generated
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{pt.label}</span>
                        {generated ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      {generated ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewPolicy(generated)}
                            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                          >
                            View Policy
                          </button>
                          <Download className="h-3 w-3 text-gray-400" />
                        </div>
                      ) : (
                        <button
                          onClick={() => generatePolicy(pt.key)}
                          disabled={!!generating}
                          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium disabled:opacity-50"
                        >
                          {generating === pt.key ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3" />
                          )}
                          {generating === pt.key ? 'Generating...' : 'Generate with AI'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-brand-600" />
                  Assessments
                </h2>
                <button
                  onClick={runAssessment}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  <Sparkles className="h-4 w-4" />
                  Run SOC 2 Readiness
                </button>
              </div>

              {assessments.length === 0 ? (
                <p className="text-gray-500 text-sm">No assessments yet. Run your first SOC 2 readiness check.</p>
              ) : (
                <div className="space-y-3">
                  {assessments.map((a) => (
                    <div key={a.id} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{a.framework}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {a.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${a.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={generateAllMissing}
                  className="w-full flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  Generate All Missing Policies
                </button>
                <button 
                  onClick={runAssessment}
                  className="w-full flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <BarChart3 className="h-4 w-4 text-brand-600" />
                  Run Full Assessment
                </button>
              </div>
            </div>

            <div className="bg-brand-50 rounded-2xl border border-brand-100 p-6">
              <h3 className="font-semibold text-brand-900 mb-2">Need Help?</h3>
              <p className="text-sm text-brand-700 mb-4">
                Our AI can guide you through each step of SOC 2 preparation.
              </p>
              <Link 
                href="/dashboard/policies" 
                className="text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                View all policies →
              </Link>
            </div>
          </div>
        </div>
      </div>

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
