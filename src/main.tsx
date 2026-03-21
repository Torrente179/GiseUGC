import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import './index.css'
import './i18n'; // Import i18n configuration

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <App />
        </ThemeProvider>
    </BrowserRouter>
);
