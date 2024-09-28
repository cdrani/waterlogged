import Stripe from 'stripe'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'

const stripe = new Stripe(import.meta.env.VITE_STRIPE_API_KEY, { typescript: true })

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { userId, ref } = await request.json()

        // fetch customer, create if one doesn't exist
        let customer

        const allCustomers = (await stripe.customers.list({ email: userId })).data

        if (allCustomers.length > 0) {
            customer = allCustomers[0].id
        } else {
            const newCustomer = await stripe.customers.create({ email: userId })
            customer = newCustomer.id
        }
        
        const session = await stripe.checkout.sessions.create({
            customer,
            mode: 'subscription',
            allow_promotion_codes: true,
            line_items: [{
                quantity: 1,
                price: import.meta.env.VITE_STRIPE_PRICE_ID,
            }],
            cancel_url: `${import.meta.env.VITE_STRIPE_CANCEL_URL}?ref=${ref}`,
            success_url: `${import.meta.env.VITE_STRIPE_SUCCESS_URL}?ref=${ref}`,
        })
        
	    return json(session.url)
    } catch (error) {
        console.error('Error in Stripe connection:', error)
        return json({ error: 'Failed to connect to Stripe' }, { status: 500 })
    }
}
