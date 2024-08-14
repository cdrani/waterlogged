<script lang="ts">
	import '../app.css'
</script>

<slot></slot>

<footer class="hidden lg:flex fixed z-[100000] bottom-0 justify-between items-center mx-auto text-white w-full h-12 bg-gray-800">
    <div class="flex justify-between items-center w-full lg:min-w-[1120px] lg:max-w-[1376px] mx-auto">
        <div class="flex justify-between items-center gap-2">
            <a aria-label="github" target="_blank" href="htpps://github.com/cdrani/">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
            </a>
            <a aria-label="linkedin" target="_blank" href="https://twitter.com/c_drani">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="m7 17l4.194-4.193M17 7l-4.193 4.194m0 0L9.777 7H7l4.194 5.807m1.612-1.614L17 17h-2.778l-3.028-4.193"/><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"/></g></svg>
            </a>
            <a aria-label="twitter" target="_blank" href="https://linkedin.com/in/cdrani">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7" viewBox="0 0 24 24"><path fill="currentColor" d="M10.033 15.3h-1.6v-5.199h1.6zm-.8-5.866c-.577 0-.866-.267-.866-.8a.74.74 0 0 1 .25-.567a.868.868 0 0 1 .616-.233c.577 0 .866.268.866.801s-.288.799-.866.799m6.734 5.866h-1.633v-2.9c0-.755-.268-1.133-.801-1.133c-.422 0-.699.211-.834.633c-.043.067-.066.201-.066.4v3H11v-3.533c0-.8-.012-1.355-.033-1.666h1.4l.1.699c.367-.556.9-.833 1.633-.833c.557 0 1.006.194 1.35.583c.346.389.518.95.518 1.684V15.3zM12 21c-4.963 0-9-4.037-9-9s4.037-9 9-9s9 4.037 9 9s-4.037 9-9 9m0-16c-3.859 0-7 3.141-7 7s3.141 7 7 7s7-3.141 7-7s-3.141-7-7-7"/></svg>
            </a>
        </div>

        <div class="inline-flex gap-[2px] items-center">
            <span class="inline-flex justify-end mt-1">&copy</span>
            <span class="inline-flex items-center">waterlogged {(new Date()).getFullYear()}</span>
        </div>
    </div>
</footer>
