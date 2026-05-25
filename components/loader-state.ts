// Module-level flag — resets on page refresh, persists across client-side navigation
export let loaderDone = false
export function markLoaderDone() { loaderDone = true }
