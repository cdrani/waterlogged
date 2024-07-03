<script lang="ts">
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'
    injectSpeedInsights()
	import '../app.css'
</script>

<slot></slot>
