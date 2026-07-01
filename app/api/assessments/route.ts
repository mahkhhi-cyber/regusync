import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { generateControlsMapping } from '@/lib/openai'

export async function POST(req: Request) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { orgId, type, framework } = await req.json()

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    })

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const results = await generateControlsMapping({
      companyName: org.name,
      industry: org.industry,
      companySize: org.size,
      description: org.description || '',
    })

    const assessment = await prisma.assessment.create({
      data: {
        type,
        framework,
        status: 'completed',
        progress: 100,
        results,
        orgId,
      },
    })

    return NextResponse.json({ assessment })
  } catch (error) {
    console.error('Assessment error:', error)
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get('orgId')

  if (!orgId) {
    return NextResponse.json({ error: 'orgId required' }, { status: 400 })
  }

  const assessments = await prisma.assessment.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ assessments })
}
