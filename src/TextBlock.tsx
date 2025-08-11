import { useAdaptivePadding } from "./utils/useLineCount";
import dotsSvg from "./assets/dots.svg";
import { useEffect, useState } from "react";

export const TextBlock = ({
  text,
  indicatorValue,
  showPlus,
}: {
  text: string;
  indicatorValue: number;
  showPlus: boolean;
}) => {
  const { ref, padding: basePadding } = useAdaptivePadding(24, 16, text);
  const [indicatorOffset, setIndicatorOffset] = useState(0);

  useEffect(() => {
    if (ref.current && indicatorValue > 0) {
      const element = ref.current;
      const textElement = element.querySelector("p") || element;

      const textWidth = textElement.scrollWidth;
      const containerWidth = element.clientWidth;
      const indicatorWidth = 40;
      const rightMargin = 20;

      if (textWidth > containerWidth - indicatorWidth - rightMargin) {
        setIndicatorOffset(1);
      } else {
        setIndicatorOffset(0);
      }
    }
  }, [text, indicatorValue, ref.current]);

  const finalPadding = basePadding;

  const getIndicatorStyles = () => {
    if (indicatorValue === 0) return null;

    if (showPlus && indicatorValue >= 1 && indicatorValue <= 999) {
      return {
        background:
          "linear-gradient(180deg, #3FCCFF 0%, #068DFB 100%), #FFFFFF",
        backgroundColor: "#3FCCFF",
        color: "white",
        border: "none",
      };
    } else {
      return {
        backgroundColor: "white",
        color: "#B4B4B4",
        border: "1px solid #B4B4B4",
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
  console.log(
    basePadding,
    "basePadding",
    indicatorOffset,
    "indicatorOffset",
    finalPadding,
    "final"
  );

  return (
    <div
      className="max-w-[345px] w-full font-urbanist rounded-[25px] bg-white shadow-lg px-4 relative right-0"
      ref={ref}
      style={{
        paddingTop: finalPadding,
        paddingBottom: finalPadding,
        boxSizing: "border-box",
        whiteSpace: "normal",
        wordBreak: "break-word",
      }}
    >
      <p className="text-gray-800 text-base leading-relaxed m-0 break-words">
        {text || "Drinking water lorem30"}
      </p>

      {/* Три точки справа сверху */}
      <img src={dotsSvg} alt="" className="absolute top-0 right-0 px-4 py-2" />

      {/* Индикатор справа снизу */}
      {indicatorStyles && (
        <div
          className="absolute px-2 py-1 rounded-full"
          style={{
            bottom: `${finalPadding}px`,
            right: "16px",
            transform: `translateY(${indicatorOffset * 14}px)`,
            transition: "transform 0.2s ease-in-out",
            ...indicatorStyles,
          }}
        >
          <p className="text-xs font-normal leading-[10px] m-0">
            {getIndicatorText()}
          </p>
        </div>
      )}
    </div>
  );
};
