<script lang="ts">
	import { inject } from '@vercel/analytics'
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'
	import '../app.css'

	inject()
	injectSpeedInsights()
</script>

<slot></slot>
