import * as React from "react"

const MOBILE_BREAKPOINT = 768

const getIsMobile = () =>
  typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

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
