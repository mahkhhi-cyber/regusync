import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

export const getOrCreateCustomer = async (email: string, userId: string) => {
  const customers = await stripe.customers.list({ email, limit: 1 })
  
  if (customers.data.length > 0) {
    return customers.data[0]
  }
  
  return await stripe.customers.create({
    email,
    metadata: { userId },
  })
}

export const createCheckoutSession = async (customerId: string, priceId: string) => {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    billing_address_collection: 'auto',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    subscription_data: {
      trial_period_days: 14,
    },
  })
}
