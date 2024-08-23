import Stripe from 'stripe'

const stripe = new Stripe(import.meta.env.VITE_STRIPE_API_KEY!, {
	typescript: true,
})

export async function POST(request: Request) {
	let data = await request.json()
	let userId = data.userId

	// fetch customer, create if one doesn't exist
	let customer

	const allCustomers = (await stripe.customers.list({ email: userId })).data

	if (allCustomers.length > 0) customer = allCustomers[0].id
	else {
		const newCustomer = await stripe.customers.create({ email: userId })
		customer = newCustomer.id
	}

	const session = await stripe.checkout.sessions.create({
		customer,
		mode: 'subscription',
		line_items: [{
            quantity: 1,
            price: import.meta.env.STRIPE_PRICE_ID,
		}],
		cancel_url: import.meta.env.VITE_STRIPE_CANCEL_URL,
		success_url: import.meta.env.VITE_STRIPE_SUCCESS_URL,
	})

	return Response.json(session.url)
}
