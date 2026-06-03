// Initialize Vercel Web Analytics
(function() {
  // Inline the inject function from @vercel/analytics
  const initQueue = () => {
    if (window.va) return;
    window.va = function a(...params) {
      (window.vaq = window.vaq || []).push(params);
    };
  };

  function isBrowser() {
    return typeof window !== "undefined";
  }

  function detectEnvironment() {
    try {
      const env = "production"; // Force production mode for static sites
      if (env === "development" || env === "test") {
        return "development";
      }
    } catch (e) {
    }
    return "production";
  }

  function setMode(mode = "auto") {
    if (mode === "auto") {
      window.vam = detectEnvironment();
      return;
    }
    window.vam = mode;
  }

  function getMode() {
    return window.vam || "production";
  }

  function isProduction() {
    return getMode() === "production";
  }

  function pageview(properties) {
    if (!isBrowser()) return;
    if (!isProduction()) {
      return;
    }
    try {
      initQueue();
      window.va("pageview", properties);
    } catch (err) {
      console.error(err);
    }
  }

  function track(name2, properties) {
    if (!isBrowser()) return;
    if (!properties) {
      properties = {};
    }
    if (!isProduction()) {
      return;
    }
    try {
      initQueue();
      window.va("event", { name: name2, data: properties });
    } catch (err) {
      console.error(err);
    }
  }

  function inject(props = {
    debug: true
  }) {
    if (!isBrowser()) return;
    setMode(props.mode);
    if (!isProduction()) {
      return;
    }
    initQueue();
    const src = props.scriptSrc || "/_vercel/insights/script.js";
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.setAttribute("data-sdkn", "@vercel/analytics");
    script.setAttribute("data-sdkv", "1.6.1");
    if (props.nonce) {
      script.setAttribute("nonce", props.nonce);
    }
    script.onerror = () => {
      const errorMessage = "Vercel Web Analytics failed to load.";
      if (props.debug) {
        console.error(errorMessage);
      }
    };
    if (props.beforeSend) {
      window.vaq = [];
      window.va = function a2(...params) {
        const [event, data2] = params;
        const beforeSendResult = props.beforeSend == null ? void 0 : props.beforeSend({
          type: event,
          data: data2
        });
        if (beforeSendResult !== null && beforeSendResult !== false) {
          window.vaq.push(params);
        }
      };
    }
    document.head.appendChild(script);
  }

  // Auto-inject on load
  inject();
})();
