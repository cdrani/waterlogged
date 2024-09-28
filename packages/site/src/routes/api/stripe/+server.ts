import Stripe from 'stripe'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'

const secret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET!

const stripe = new Stripe(import.meta.env.VITE_STRIPE_API_KEY!, {
	typescript: true,
})

async function getDexieToken() {
    const scopes = ['GLOBAL_READ', 'GLOBAL_WRITE', 'ACCESS_DB']
    const url = `${import.meta.env.VITE_DEXIE_DB_URL}/token`

    const body = {
        scopes,
        grant_type: 'client_credentials',
        client_id: import.meta.env.VITE_DEXIE_CLIENT_ID,
        client_secret: import.meta.env.VITE_DEXIE_CLIENT_SECRET,
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const token = await response.json()

    return token.accessToken
}

type DexieUserType = 'eval' | 'prod'

async function changeUserType(
	type: DexieUserType,
	token: string,
	userId: string
) {
    const url = `${import.meta.env.VITE_DEXIE_DB_URL}/users`
	const users = [{ userId, type }]

    await fetch(url, {
        method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
        body: JSON.stringify(users)
    })
}

export const POST: RequestHandler = async ({ request }) => {
	let event

	const payload = await (await request.blob()).text()
	const signature = request.headers.get('stripe-signature') as string

	try {
		event = stripe.webhooks.constructEvent(payload, signature, secret)
	} catch (err) {
		console.log(err)
		return Response.json('Webhook signature verification failed', { status: 400 })
	}

	switch (event.type) {
		case 'checkout.session.completed':
			const paymentIntent = event.data.object

			try {
				const token = await getDexieToken()
				await changeUserType(
					'prod',
					token,
					paymentIntent.customer_details?.email as string
				)
			} catch (error) {
				console.error(error)
				await stripe.subscriptions.cancel(paymentIntent.subscription as string)

				return json(
					'Could not upgrade user status. A refund has been issued to the payment method used.',
					{ status: 500 }
				)
			}

			break

		case 'customer.subscription.deleted':
			const customer = await stripe.customers.retrieve(
				event.data.object.customer as string
			)

			if (customer.deleted) {
				console.log('Customer deleted')
				break
			}

			try {
				const token = await getDexieToken()
				await changeUserType('eval', token, customer.email!)
			} catch (error) {
				console.error(error)

				return json(
					'Could not upgrade user status. A refund has been issued to the payment method used.',
					{ status: 500 }
				)
			}

			break
	}

	return json({ message: 'Success' }, { status: 200 })
}
