import { useEffect } from "react";

export function TawkToChat() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const existing = document.getElementById("tawkto-script");
    if (existing) return;

    const s1 = document.createElement("script");
    s1.id = "tawkto-script";
    s1.type = "text/javascript";
    s1.async = true;
    s1.src = "https://embed.tawk.to/6a237de9a48b111c34b6accc/1jqda7mfc";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  return null;
}
