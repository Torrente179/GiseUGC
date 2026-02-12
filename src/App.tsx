import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";

const App = () => (
  <MotionConfig reducedMotion="user">
    <Index />
  </MotionConfig>
);

export default App;
