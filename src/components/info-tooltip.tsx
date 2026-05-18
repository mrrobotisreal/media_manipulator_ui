import { Info } from 'lucide-react';
import { useId, useState, type ReactNode, type KeyboardEvent, type MouseEvent } from 'react';

interface InfoTooltipProps {
  content: ReactNode;
  ariaLabel?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: 'sm' | 'md' | 'lg';
}

const widthClass: Record<NonNullable<InfoTooltipProps['width']>, string> = {
  sm: 'w-56',
  md: 'w-72',
  lg: 'w-80',
};

const alignClass: Record<NonNullable<InfoTooltipProps['align']>, string> = {
  left: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-0',
};

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  ariaLabel,
  className,
  align = 'center',
  width = 'md',
}) => {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <span className={`relative inline-flex align-middle ${className ?? ''}`}>
      <button
        type="button"
        aria-label={ariaLabel ?? 'More information'}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="inline-flex items-center justify-center text-muted-foreground hover:text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full p-0.5"
      >
        <Info className="w-4 h-4" />
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 top-full mt-2 ${alignClass[align]} ${widthClass[width]} max-w-[80vw] rounded-lg border border-border bg-popover text-popover-foreground shadow-lg p-3 text-xs leading-relaxed whitespace-normal text-left font-normal pointer-events-none`}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default InfoTooltip;
