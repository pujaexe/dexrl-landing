import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

type ClassValue = string | number | null | undefined | false;
const cn = (...classes: ClassValue[]) =>
  classes.filter(Boolean).join(" ");

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type AccordionValue = string | string[] | undefined;

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: AccordionValue;
  value?: AccordionValue;
  onValueChange?: (value: AccordionValue) => void;
  collapsible?: boolean;
}

interface AccordionContextValue {
  type: "single" | "multiple";
  toggleItem: (value: string) => void;
  isItemOpen: (value: string) => boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null,
);

const useAccordionContext = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within <Accordion>");
  }
  return context;
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      defaultValue,
      value,
      onValueChange,
      collapsible = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const initialValue = React.useMemo<AccordionValue>(() => {
      if (value !== undefined) return value;
      if (defaultValue !== undefined) return defaultValue;
      return type === "multiple" ? [] : undefined;
    }, [value, defaultValue, type]);

    const [internalValue, setInternalValue] =
      React.useState<AccordionValue>(initialValue);

    const isControlled = value !== undefined;
    const resolvedValue = isControlled ? value : internalValue;

    const handleValueChange = React.useCallback(
      (nextValue: AccordionValue) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange],
    );

    const toggleItem = React.useCallback(
      (itemValue: string) => {
        if (type === "multiple") {
          const current = Array.isArray(resolvedValue) ? resolvedValue : [];
          const exists = current.includes(itemValue);
          const next = exists
            ? current.filter((v) => v !== itemValue)
            : [...current, itemValue];
          handleValueChange(next);
          return;
        }

        const isOpen = resolvedValue === itemValue;
        if (isOpen && !collapsible) return;
        handleValueChange(isOpen ? undefined : itemValue);
      },
      [collapsible, handleValueChange, resolvedValue, type],
    );

    const isItemOpen = React.useCallback(
      (itemValue: string) => {
        if (type === "multiple") {
          return Array.isArray(resolvedValue) && resolvedValue.includes(itemValue);
        }
        return resolvedValue === itemValue;
      },
      [resolvedValue, type],
    );

    const contextValue = React.useMemo(
      () => ({
        type,
        toggleItem,
        isItemOpen,
      }),
      [type, toggleItem, isItemOpen],
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  toggle: () => void;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

const useAccordionItemContext = () => {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionItem components must be used within <AccordionItem>",
    );
  }
  return context;
};

interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { toggleItem, isItemOpen } = useAccordionContext();
    const isOpen = isItemOpen(value);
    const triggerId = React.useId();
    const contentId = React.useId();

    const contextValue = React.useMemo(
      () => ({
        value,
        isOpen,
        toggle: () => toggleItem(value),
        triggerId,
        contentId,
      }),
      [value, isOpen, toggleItem, triggerId, contentId],
    );

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("border-b", className)}
          data-state={isOpen ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { toggle, isOpen, triggerId, contentId } = useAccordionItemContext();

  return (
    <button
      ref={ref}
      id={triggerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={toggle}
      className={cn(
        "cursor-pointer flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 shrink-0 text-white transition-transform duration-200" />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, style, ...props }, ref) => {
  const { isOpen, contentId, triggerId } = useAccordionItemContext();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = React.useState(0);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      contentRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref],
  );

  const measureHeight = React.useCallback(() => {
    const nextHeight = innerRef.current?.scrollHeight ?? 0;
    setHeight(nextHeight);
  }, []);

  useIsomorphicLayoutEffect(() => {
    measureHeight();
  }, [measureHeight, children]);

  useIsomorphicLayoutEffect(() => {
    if (!innerRef.current) return;
    const observer = new ResizeObserver(() => measureHeight());
    observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, [measureHeight]);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => measureHeight());
    }
  }, [isOpen, measureHeight]);

  return (
    <div
      ref={setRefs}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      aria-hidden={!isOpen}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "overflow-hidden text-sm transition-[max-height,opacity] duration-300 ease-out",
        className,
      )}
      style={{
        maxHeight: isOpen ? height : 0,
        opacity: isOpen ? 1 : 0,
        ...style,
      }}
      {...props}
    >
      <div ref={innerRef} className="pb-4 pt-0">
        {children}
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
