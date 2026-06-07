(function () {
  "use strict";

  window.tailwind = window.tailwind || {};
  window.tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ["Nunito", "sans-serif"],
          ko: ["Jua", "sans-serif"]
        },
        colors: {
          app: {
            bg: "#F3F4F6",
            card: "#FFFFFF",
            text: "#4B5563",
            textLight: "#9CA3AF",
            primary: "#6366F1",
            primaryLight: "#A5B4FC",
            success: "#10B981",
            error: "#EF4444",
            accent: "#FCD34D"
          }
        },
        boxShadow: {
          soft: "10px 10px 20px #d1d5db, -10px -10px 20px #ffffff",
          "inner-soft": "inset 5px 5px 10px #d1d5db, inset -5px -5px 10px #ffffff"
        }
      }
    }
  };
})();
