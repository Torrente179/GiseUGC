import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  /**
   * Optional custom fallback. When a render function is passed it receives the
   * caught error and a reset callback so callers can offer a retry affordance.
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /**
   * Short label identifying the wrapped area (e.g. "portfolio"). Included in the
   * logged error so a swallowed section failure is still diagnosable.
   */
  section?: string;
  /**
   * When true the boundary renders nothing on failure instead of the default
   * card. Useful for non-critical, below-the-fold sections that should simply
   * disappear rather than show an error surface.
   */
  silent?: boolean;
};

type ErrorBoundaryState = {
  error: Error | null;
};

// React error boundaries must be class components. This is the single recovery
// surface for render-time throws — without it any uncaught error blanks the
// whole route. Event-handler and async errors are NOT caught here by design
// (React limitation); media/network failures are handled where they occur.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const where = this.props.section ? ` [${this.props.section}]` : '';
    console.error(`ErrorBoundary caught an error${where}:`, error, info.componentStack);

    // Forward to Vercel Analytics if it has loaded, so production failures are
    // observable. Guarded because `va` is injected asynchronously.
    const va = (window as Window & { va?: (...args: unknown[]) => void }).va;
    if (typeof va === 'function') {
      va('event', {
        name: 'Render Error',
        section: this.props.section ?? 'app',
        message: error.message,
      });
    }
  }

  reset = () => {
    if (this.state.error) this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.silent) return null;

    if (typeof this.props.fallback === 'function') {
      return this.props.fallback(error, this.reset);
    }
    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <div
        role="alert"
        className="flex min-h-[280px] w-full flex-col items-center justify-center gap-4 px-6 py-12 text-center"
      >
        <h2 className="type-marketing-display text-xl font-semibold text-foreground">
          Algo salió mal aquí
        </h2>
        <p className="strategic-body max-w-md text-sm text-muted-foreground">
          Esta sección no pudo cargarse. Puedes reintentar o recargar la página.
        </p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={this.reset} className="btn-primary-nordic btn-press">
            Reintentar
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
