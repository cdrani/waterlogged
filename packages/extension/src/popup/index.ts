import '../app.css'
import App from '../App.svelte'

const target = document.getElementById('app')
async function render() {
    new App({ target })
}
document.addEventListener('DOMContentLoaded', render)
