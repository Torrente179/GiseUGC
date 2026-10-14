import { useRef, type KeyboardEvent } from 'react';
import { useSegmentThumb } from './hooks';

export type SegmentedItem = { id: string; label: string };

type SegmentedControlProps = {
  items: SegmentedItem[];
  value: number;
  onChange: (index: number) => void;
  ariaLabel: string;
  /** Prefix shared with the panels: tabs are `${idPrefix}-tab-N`, panels `${idPrefix}-panel-N`. */
  idPrefix: string;
  className: string;
};

/**
 * Tablist with a sliding thumb. Automatic activation: arrows move focus and
 * selection together, Home and End jump to the ends.
 */
const SegmentedControl = ({ items, value, onChange, ariaLabel, idPrefix, className }: SegmentedControlProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const box = useSegmentThumb(rootRef, value);

  const select = (index: number) => {
    const next = (index + items.length) % items.length;
    onChange(next);
    const tabs = rootRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs?.[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        select(value + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        select(value - 1);
        break;
      case 'Home':
        event.preventDefault();
        select(0);
        break;
      case 'End':
        event.preventDefault();
        select(items.length - 1);
        break;
      default:
    }
  };

  return (
    <div
      ref={rootRef}
      className={`${className}${box ? ' is-measured' : ''}`}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      <span
        className="kn-thumb"
        aria-hidden="true"
        style={
          box
            ? {
                width: box.width,
                height: box.height,
                transform: `translate(${box.x}px, ${box.y}px)`,
              }
            : undefined
        }
      />
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${index}`}
          aria-selected={index === value}
          aria-controls={`${idPrefix}-panel-${index}`}
          tabIndex={index === value ? 0 : -1}
          className={index === value ? 'kn-sb is-on' : 'kn-sb'}
          onClick={() => onChange(index)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
