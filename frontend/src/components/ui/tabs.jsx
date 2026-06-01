import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext({ value: "", onValueChange: () => {} });

export const Tabs = ({ value, onValueChange, defaultValue, className = "", children, ...props }) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const val = value !== undefined ? value : internalValue;
  const setter = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ value: val, onValueChange: setter }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground ${className}`}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef(
  ({ className = "", value, ...props }, ref) => {
    const ctx = useContext(TabsContext);
    const isActive = ctx.value === value;
    return (
      <button
        ref={ref}
        onClick={() => ctx.onValueChange(value)}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${
          isActive
            ? "bg-background text-foreground shadow-sm"
            : "hover:bg-background/50"
        } ${className}`}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef(
  ({ className = "", value, ...props }, ref) => {
    const ctx = useContext(TabsContext);
    if (ctx.value !== value) return null;
    return (
      <div
        ref={ref}
        className={`mt-2 ring-offset-background focus-visible:outline-none ${className}`}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";
