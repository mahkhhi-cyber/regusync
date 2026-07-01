import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/stripe'

export async function POST() {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const priceId = process.env.STRIPE_PRICE_ID
  
  if (!priceId) {
    return NextResponse.json({ error: 'Stripe price not configured' }, { status: 500 })
  }

  const customer = await getOrCreateCustomer(user.email, user.id)
  const checkoutSession = await createCheckoutSession(customer.id, priceId)

  return NextResponse.json({ url: checkoutSession.url })
}
