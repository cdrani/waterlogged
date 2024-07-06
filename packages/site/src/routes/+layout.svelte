<script lang="ts">
	import { inject } from '@vercel/analytics'
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'
	import '../app.css'
    import 'common/base.css'

	inject()
	injectSpeedInsights()
</script>

<slot></slot>
