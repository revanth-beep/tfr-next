// Module-level flags — reset on page refresh, persist across client-side navigation
export let loaderDone  = false
export let heroReady   = false
export function markLoaderDone() { loaderDone = true }
export function markHeroReady()  { heroReady  = true }
