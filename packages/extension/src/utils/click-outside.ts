export function clickOutside(node: Node): { destroy: () => void } {
    function handleClick(event: Event) {
        if (!node?.contains(event.target as Node)) {
            node.dispatchEvent(new CustomEvent('click_outside', { detail: node }))
        }
    }
		
    document.body.addEventListener('click', handleClick, true)
    
    return {
        destroy() {
            document.body.removeEventListener('click', handleClick, true);
        }
    }
}
