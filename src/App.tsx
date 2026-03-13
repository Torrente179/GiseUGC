import Index from "./pages/Index";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App = () => {
  return (
    <>
      <Index />
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
