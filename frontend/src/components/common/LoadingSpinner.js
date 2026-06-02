import React from "react";
import "../../styles/global.css";

const LoadingSpinner = ({ text = "Loading" }) => (
  <div className="loader-container">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
      <span className="relative flex h-7 w-7">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary/30" />
        <span className="relative inline-flex h-7 w-7 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </span>
    </div>
    {text && <span className="mt-3 text-sm font-medium text-muted-foreground">{text}</span>}
  </div>
);

export default LoadingSpinner;
