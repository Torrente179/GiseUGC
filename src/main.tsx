import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import './index.css'
import './i18n'; // Import i18n configuration

// The boot shell (index.html) darkens itself on home paths to match the hero.
// Once React owns the DOM the boot styles must not leak into other routes.
document.documentElement.classList.remove('boot-home');

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <App />
        </ThemeProvider>
    </BrowserRouter>
);
