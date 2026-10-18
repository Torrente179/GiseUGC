import * as React from "react"

const MOBILE_BREAKPOINT = 768

const getIsMobile = () =>
  typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * Phone width (< 768px). Starts false, matching the prerendered desktop
 * markup, so a hydrated component renders what the server did, then follows
 * the viewport. Pass `fromViewport` in a component that never renders during
 * hydration (a lazy section mounted after load): it then starts at the real
 * width instead of painting one desktop frame first.
 */
export function useIsMobile({ fromViewport = false }: { fromViewport?: boolean } = {}) {
  const [isMobile, setIsMobile] = React.useState(() => (fromViewport ? getIsMobile() : false))

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      // Transition: breakpoint flips swap lazy-loaded sections (Index.tsx
      // ternaries have no Suspense boundary). A synchronous update that
      // suspends would unmount the whole root — white screen on rotation.
      React.startTransition(() => {
        setIsMobile(getIsMobile())
      })
    }
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
