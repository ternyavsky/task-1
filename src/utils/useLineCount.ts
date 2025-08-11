import { useEffect, useRef, useState } from "react";

type PaddingResult = {
  ref: React.RefObject<HTMLDivElement>;
  padding: number;
  isSingleLine: boolean;
};

export function useAdaptivePadding(
  paddingOneLine = 24,
  paddingMultiLine = 16,
  text = ""
): PaddingResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const [padding, setPadding] = useState<number>(paddingOneLine);
  const [isSingleLine, setIsSingleLine] = useState<boolean>(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;

    const measure = () => {
      if (!el) return;

      const clone = el.cloneNode(true) as HTMLElement;

      const mirror = document.createElement("div");
      mirror.style.position = "absolute";
      mirror.style.left = "-99999px";
      mirror.style.top = "-99999px";
      mirror.style.visibility = "hidden";
      mirror.style.pointerEvents = "none";
      mirror.style.overflow = "visible";
      mirror.style.width = `${el.clientWidth}px`;
      mirror.style.boxSizing = "border-box";

      const cs = window.getComputedStyle(el);
      clone.style.margin = "0";
      clone.style.transform = "none";
      clone.style.width = "100%";
      clone.style.boxSizing = "border-box";
      clone.style.font = cs.font;
      clone.style.whiteSpace = cs.whiteSpace;
      clone.style.letterSpacing = cs.letterSpacing;
      clone.style.wordSpacing = cs.wordSpacing;
      clone.style.textTransform = cs.textTransform;
      clone.style.padding = "0";

      mirror.appendChild(clone);
      document.body.appendChild(mirror);

      let lineHeightPx = 0;
      const cloneCS = window.getComputedStyle(clone);
      if (cloneCS.lineHeight !== "normal") {
        lineHeightPx = parseFloat(cloneCS.lineHeight);
      } else {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.padding = "0";
        span.style.margin = "0";
        span.textContent = "M";
        clone.appendChild(span);
        lineHeightPx = span.getBoundingClientRect().height;
        clone.removeChild(span);
      }

      const contentRect = clone.getBoundingClientRect();
      const contentHeight = contentRect.height;

      const textOnlyHeight = Math.max(0, contentHeight);

      const lines = Math.max(
        1,
        Math.round(textOnlyHeight / (lineHeightPx || 1))
      );

      const single = lines === 1;
      setIsSingleLine(single);
      setPadding(single ? paddingOneLine : paddingMultiLine);

      document.body.removeChild(mirror);
    };

    const schedule = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(el);


    const mo = new MutationObserver(schedule);
    mo.observe(el, { childList: true, subtree: true, characterData: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(() => schedule());
    }

    const onWin = () => schedule();
    window.addEventListener("resize", onWin);

    schedule();

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", onWin);
    };
  }, [paddingOneLine, paddingMultiLine, text]);

  return { ref, padding, isSingleLine };
}
