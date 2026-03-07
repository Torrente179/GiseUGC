import { useEffect } from "react";
import Index from "./pages/Index";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { initLenis } from "@/lib/smooth-scroll";

const App = () => {
  useEffect(() => {
    const cleanup = initLenis();
    return cleanup;
  }, []);

  return (
    <>
      <Index />
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
