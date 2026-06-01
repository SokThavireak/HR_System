import React from "react";

/**
 * LordIcon animated icon wrapper.
 * Uses the LordIcon CDN script (loaded in index.html).
 *
 * Usage:
 *   <LordIcon name="login" size={24} />
 *   <LordIcon name="check-circle" size={32} trigger="hover" />
 *
 * Find icons at: https://lordicon.com/icons
 */

const ICON_MAP = {
  // Auth
  login: "xvcivyuhkgfk",
  logout: "xvcivyuhkgfk",
  signup: "xvcivyuhkgfk",

  // Navigation
  home: "qezpbmvjheck",
  dashboard: "qezpbmvjheck",
  settings: "pmnllzgueijc",
  profile: "qypnzyoujzxa",

  // Actions
  search: "gwnoedmouscf",
  add: "xciyricynzxb",
  edit: "wtzkeuxcwcjq",
  delete: "zvrggdkkjzfv",
  download: "qponljtnfehs",
  upload: "xhtjjcurqgis",
  refresh: "qasvlsewztya",

  // HR-specific
  users: "urwafpwsslzv",
  user: "qypnzyoujzxa",
  calendar: "apmisokeepju",
  clock: "ktsahhoi",
  dollar: "aqmedxvzxyxp",
  chart: "mcpxyoezdfge",
  file: "wtzkeuxcwcjq",
  mail: "nzrjxqpmgmpl",
  bell: "pmnllzgueijc",

  // Status
  "check-circle": "tullwzvmvmkc",
  "x-circle": "ttqlsbhknznt",
  warning: "pmnllzgueijc",
  info: "pmnllzgueijc",
  error: "zvrggdkkjzfv",

  // Misc
  star: "rnrxoghkjfck",
  heart: "rnrxoghkjfck",
  menu: "dxwdztyzqrzd",
  close: "hlizqijxqibe",
  arrow: "dxwdztyzqrzd",
};

// The CDN script stores icons by their unique hash
// Using the free hosted JSON URLs for trigger-based animation
const getIconUrl = (name) => {
  return `https://cdn.lordicon.com/${name}.json`;
};

/**
 * Lazily load a LordIcon from CDN.
 * The JSON contains the animation data; the <lord-icon> web component renders it.
 */
function useLordIconLoaded(src) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!src) return;
    // The lordicon.js script fetches the JSON by src automatically
    // We just need to ensure the script is present
    if (window.customElements && window.customElements.get("lord-icon")) {
      setLoaded(true);
      return;
    }

    // Poll for element upgrade
    const interval = setInterval(() => {
      if (window.customElements && window.customElements.get("lord-icon")) {
        setLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [src]);

  return loaded;
}

export function LordIcon({
  name,
  size = 24,
  trigger = "loop",
  colors = null,
  className = "",
  asButton = false,
  ...props
}) {
  const iconKey = ICON_MAP[name] || name;
  const src = getIconUrl(iconKey);
  const isLoaded = useLordIconLoaded(src);

  const defaultColors = colors || "primary:#9a0002,secondary:#efe6dd";

  const inner = React.createElement("lord-icon", {
    src,
    trigger: trigger === "none" ? undefined : trigger,
    colors: defaultColors,
    style: { width: size, height: size },
  });

  if (asButton) {
    return React.createElement(
      "button",
      {
        className: `inline-flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-accent cursor-pointer ${className}`,
        type: "button",
        ...props,
      },
      inner
    );
  }

  return React.createElement(
    "span",
    {
      className: `inline-flex items-center justify-center ${className}`,
      style: { width: size, height: size },
    },
    !isLoaded
      ? React.createElement("span", {
          className: "inline-block rounded-full loading-shimmer",
          style: { width: size, height: size },
        })
      : inner
  );
}

/**
 * Drop-in replacement for common Lucide icons using LordIcon.
 * Map: { lucideIconName: lordIconName }
 */
export const StatusIcon = ({ status, size = 20 }) => {
  const map = {
    success: { name: "check-circle", trigger: "hover" },
    error: { name: "x-circle", trigger: "hover" },
    warning: { name: "warning", trigger: "hover" },
    info: { name: "info", trigger: "hover" },
    pending: { name: "clock", trigger: "loop" },
  };

  const config = map[status] || map.info;
  return LordIcon({ name: config.name, size, trigger: config.trigger });
};
