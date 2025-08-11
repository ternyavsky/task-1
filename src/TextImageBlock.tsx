import dotsSvg from "./assets/dots.svg";
import { useEffect, useState } from "react";
import image from "./assets/image.svg";

export const TextImageBlock = ({
  text,
  indicatorValue,
  showPlus,
}: {
  text: string;
  indicatorValue: number;
  showPlus: boolean;
}) => {
  const container = document.getElementById("block2");
  const element = container?.querySelector("p");
  const [lineCount, setLineCount] = useState(1);
  const [extraHeight, setExtraHeight] = useState(0);
  useEffect(() => {
    if (!element) return;

    const style = window.getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);
    setLineCount(Math.round(element.clientHeight / lineHeight));
    console.log(lineCount, "lineCount");
  }, [text]);
  const [indicatorOffset, setIndicatorOffset] = useState(0);
  useEffect(() => {
    if (!element) {
      setIndicatorOffset(0);
      setExtraHeight(0);
      return;
    }

    const p = element;
    if (!p) {
      setIndicatorOffset(0);
      setExtraHeight(0);
      return;
    }

    const containerWidth = container?.clientWidth;
    const indicatorWidth = 60; // индикатор + отступы
    const safeZone = 20; // сколько пикселей хотим оставить до индикатора

    const textNode = p.firstChild;
    if (!textNode) {
      setIndicatorOffset(0);
      setExtraHeight(0);
      return;
    }

    const range = document.createRange();
    range.setStart(textNode, 0);

    const text = p.textContent || "";
    let lastLineWidth = 0;
    let lastLineStart = 0;
    let prevTop = null;

    // Идём по символам и фиксируем начало последней строки
    for (let i = 1; i <= text.length; i++) {
      range.setEnd(textNode, i);
      const rects = range.getClientRects();
      const lastRect = rects[rects.length - 1];

      if (prevTop === null) {
        prevTop = lastRect.top;
      }

      if (lastRect.top !== prevTop) {
        // новая строка
        lastLineStart = i - 1;
        prevTop = lastRect.top;
      }
    }

    // Меряем ширину последней строки
    range.setStart(textNode, lastLineStart);
    range.setEnd(textNode, text.length);
    lastLineWidth = range.getBoundingClientRect().width;

    range.detach?.();
    console.log(lastLineWidth, "lastLineWidth");
    console.log(containerWidth, "containerWidth");
    console.log(indicatorWidth, "indicatorWidth");
    console.log(safeZone, "safezone");

    if (
      lastLineWidth >
      (containerWidth || 0) - indicatorWidth - safeZone - 60
    ) {
      if (lineCount > 1) {
        setIndicatorOffset(1); // сместить индикатор вниз
        setExtraHeight(20);
        setLineCount(lineCount + 1);
      }
    } else {
      setIndicatorOffset(0);
      setExtraHeight(0);
    }
  }, [text, indicatorValue, element]);

  // Используем базовые паддинги из хука

  const getIndicatorStyles = () => {
    if (indicatorValue === 0) return null;

    if (showPlus && indicatorValue >= 1 && indicatorValue <= 999) {
      return {
        background: "linear-gradient(180deg, #3FCCFF 0%, #068DFB 100%)",
        color: "white",
        border: "none",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      };
    } else {
      return {
        backgroundColor: "white",
        color: "#B4B4B4",
        border: "1px solid #B4B4B4",
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
      };
    }
  };

  const getIndicatorText = () => {
    if (indicatorValue === 0) return "";

    if (showPlus && indicatorValue >= 1 && indicatorValue <= 999) {
      return `+${indicatorValue}`;
    } else {
      return indicatorValue > 9999 ? "9999" : indicatorValue.toString();
    }
  };

  const indicatorStyles = getIndicatorStyles();

  return (
    <div
      className="max-w-[345px] w-full font-urbanist rounded-[25px] bg-white px-4 relative flex gap-2"
      id="block2"
      style={{
        paddingTop: `${lineCount < 3 && 16}px`,
        paddingBottom: `${extraHeight + 16}px`,
        boxSizing: "border-box",
        whiteSpace: "normal",
        wordBreak: "break-word",
        border: "1px solid #E5E7EB",
        boxShadow: "0px 1px 8px 0px rgba(0, 0, 0, 0.1)",
        alignItems: lineCount > 2 ? "start" : "center",
      }}
    >
      <img src={image} alt="" />
      <p className="text-[14px] leading-[140%] m-0 break-words font-normal text-[#3B4552] w-fit">
        {text || "Drinking water"}
      </p>

      {/* Три точки справа сверху */}
      <img
        src={dotsSvg}
        alt=""
        className="absolute top-0 right-0 mt-[9px] mx-[18px]"
      />

      {/* Индикатор справа снизу */}
      {indicatorStyles && (
        <div
          className="absolute px-2 py-1 rounded-[30px]"
          style={{
            bottom: `10px`,
            right: "15px",
            transform: `translateY(${indicatorOffset}px)`, // Смещение на 20px при необходимости
            transition: "transform 0.2s ease-in-out",
            ...indicatorStyles,
          }}
        >
          <p className="text-[12px] font-normal leading-[100%] m-0">
            {getIndicatorText()}
          </p>
        </div>
      )}
    </div>
  );
};
