import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const Boom = () => {
  throw new Error('kaboom');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React logs caught errors to console.error; silence it for clean output.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>healthy</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('healthy')).toBeInTheDocument();
  });

  it('renders the fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Algo salió mal aquí')).toBeInTheDocument();
  });

  it('renders nothing in silent mode when a child throws', () => {
    const { container } = render(
      <ErrorBoundary silent>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('still logs caught errors (observability) even when silent', () => {
    render(
      <ErrorBoundary silent section="portfolio">
        <Boom />
      </ErrorBoundary>,
    );
    expect(console.error).toHaveBeenCalled();
  });
});
