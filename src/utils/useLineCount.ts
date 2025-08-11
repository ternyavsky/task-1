import { useEffect, useState } from "react";

export const useLineCount = ({
  smallPadding,
  largePadding,
}: {
  smallPadding: number;
  largePadding: number;
}) => {
  const [lineCount, setLineCount] = useState(0);
  const [padding, setPadding] = useState(largePadding);

  useEffect(() => {
    const element = document.querySelector("p");
    if (!element) return;
    const style = window.getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);

    setLineCount(Math.round(element.clientHeight / lineHeight));
    setPadding(lineCount > 1 ? smallPadding : largePadding);
  }, [lineCount]);

  return { lineCount, padding };
};

