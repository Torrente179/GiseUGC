import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import App, { type AppRouteComponents } from '@/App';
import { LocaleProvider } from '@/lib/locale-context';
import '@/index.css';

export const readEmbeddedRouteData = <T,>(): T => {
  const node = document.getElementById('route-data');
  if (!node?.textContent) throw new Error('Missing prerendered route data');
  return JSON.parse(node.textContent) as T;
};

// Registered path changes are document navigations because every document
// carries route-specific data, metadata, critical CSS, and a route-specific
// hydrator. Same-page/hash links remain native and preserve smooth scrolling.
document.addEventListener(
  'click',
  (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const target = event.target;
    const anchor =
      target instanceof Element
        ? target.closest<HTMLAnchorElement>('a[href]')
        : null;
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
      return;
    }
    const destination = new URL(anchor.href, window.location.href);
    if (
      destination.origin !== window.location.origin ||
      destination.pathname === window.location.pathname
    ) {
      return;
    }
    event.preventDefault();
    window.location.assign(destination.href);
  },
  { capture: true },
);

const armMotion = () => {
  window.setTimeout(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.documentElement.classList.add('motion-ready');
      });
    });
  }, 400);
};

const armMotionAfterStyles = () => {
  const pendingStyles = Array.from(
    document.querySelectorAll<HTMLLinkElement>(
      'link[title="styles"][href*="/assets/"]',
    ),
  ).filter((link) => !link.sheet);
  if (pendingStyles.length === 0) {
    armMotion();
    return;
  }

  let remaining = pendingStyles.length;
  const settle = () => {
    remaining -= 1;
    if (remaining === 0) armMotion();
  };
  pendingStyles.forEach((link) => {
    link.addEventListener('load', settle, { once: true });
    link.addEventListener('error', settle, { once: true });
  });
  window.setTimeout(armMotion, 2000);
};

export const bootstrapApp = (routeComponents: AppRouteComponents) => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Missing #root');

  document.documentElement.classList.remove('boot-home');
  armMotionAfterStyles();

  const app = (
    <BrowserRouter>
      <LocaleProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App routeComponents={routeComponents} />
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  );

  if (root.dataset.prerendered === 'true') {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
};
