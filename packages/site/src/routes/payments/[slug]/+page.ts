import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = ({ params }) => {
    if (['success', 'cancel'].some(state => params.slug == state)) {
        const success =  params.slug == 'success'

        return {
            status: params.slug,
            title: `Payment Flow ${success ? 'SuccessFul' : 'Cancelled'}!`,
            content: success ? 'Pro Feautures Unlocked!' :
                'Continue On With Current Features!',
        }
    }

	error(404, 'Page Not found')
}
