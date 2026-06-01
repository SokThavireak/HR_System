import React from "react";

const LoadingSpinner = ({ text = "Loading" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
      <span className="relative flex h-7 w-7">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary/30" />
        <span className="relative inline-flex h-7 w-7 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </span>
    </div>
    <span className="text-sm font-medium text-muted-foreground">{text}</span>
  </div>
);

export default LoadingSpinner;
