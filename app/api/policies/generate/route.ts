import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { generatePolicy } from '@/lib/openai'

export async function POST(req: Request) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { orgId, policyType } = await req.json()

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    })

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const policyTitles = {
      'access-control': 'Access Control Policy',
      'asset-management': 'Asset Management Policy',
      'business-continuity': 'Business Continuity & Disaster Recovery Policy',
      'change-management': 'Change Management Policy',
      'data-classification': 'Data Classification & Handling Policy',
      'incident-response': 'Incident Response Policy',
      'risk-assessment': 'Risk Assessment Policy',
      'vendor-management': 'Vendor & Third-Party Risk Management Policy',
    }

    const title = policyTitles[policyType] || `${policyType} Policy`

    const content = await generatePolicy(policyType, {
      companyName: org.name,
      industry: org.industry,
      companySize: org.size,
      description: org.description || '',
    })

    const policy = await prisma.policy.create({
      data: {
        type: policyType,
        title,
        content,
        status: 'generated',
        orgId,
      },
    })

    return NextResponse.json({ policy })
  } catch (error) {
    console.error('Policy generation error:', error)
    return NextResponse.json({ error: 'Failed to generate policy' }, { status: 500 })
  }
}
