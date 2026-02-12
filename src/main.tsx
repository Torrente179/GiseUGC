import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import './index.css'
import { i18nInitPromise } from './i18n'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found');
}

const root = createRoot(rootElement);

const renderApp = () => {
  root.render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
    </ThemeProvider>
  );
};

i18nInitPromise
  .catch((error) => {
    if (import.meta.env.DEV) {
      console.error('i18n initialization failed. Rendering app with fallback language.', error);
    }
  })
  .finally(renderApp);
