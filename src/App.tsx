import { TextBlock } from "./TextBlock";
import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [indicatorValue, setIndicatorValue] = useState<number>(1);
  const [showPlus, setShowPlus] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#FCFCFC] p-6">
      {/* Панель управления для тестирования */}
      <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-6 border border-gray-200 z-50 min-w-[300px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Панель тестирования
        </h2>

        {/* Поле для ввода текста */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текст для блоков:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст для тестирования..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
            rows={3}
          />
          <div className="mt-2 text-xs text-gray-500">
            Символов: {text.length} | Строк: {text.split("\n").length}
          </div>
        </div>

        {/* Поле для изменения значения индикатора */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Значение индикатора:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={
                indicatorValue === 0
                  ? ""
                  : indicatorValue >= 1 && indicatorValue <= 999
                  ? `+${indicatorValue}`
                  : indicatorValue.toString()
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || value === "0") {
                  setIndicatorValue(0);
                  setShowPlus(false);
                } else if (value.startsWith("+")) {
                  const numValue = parseInt(value.substring(1));
                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 999) {
                    setIndicatorValue(numValue);
                    setShowPlus(true);
                  }
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 9999) {
                    setIndicatorValue(numValue);
                    setShowPlus(false);
                  }
                }
              }}
              placeholder="Введите значение (например: 5, +5, 1000)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <button
              onClick={() => setIndicatorValue(0)}
              className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Скрыть
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <div>0 или пусто - индикатор скрыт</div>
            <div>5, 1000 - обычное отображение (без плюса)</div>
            <div>+5, +999 - активное голубое состояние (с плюсом)</div>
          </div>
        </div>

        {/* Быстрые кнопки для тестирования */}
        <div className="space-y-2">
          <button
            onClick={() => setText("Короткий текст")}
            className="w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
          >
            Короткий текст
          </button>
          <button
            onClick={() =>
              setText(
                "Очень длинный текст который займет несколько строк и покажет как работает смещение индикатора при угрозе столкновения с текстом"
              )
            }
            className="w-full px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
          >
            Длинный текст
          </button>
          <button
            onClick={() => {
              setIndicatorValue(999);
              setShowPlus(true);
            }}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Активный индикатор (+999)
          </button>
          <button
            onClick={() => {
              setIndicatorValue(5);
              setShowPlus(true);
            }}
            className="w-full px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
          >
            Активный индикатор (+5)
          </button>
          <button
            onClick={() => {
              setIndicatorValue(1000);
              setShowPlus(false);
            }}
            className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
          >
            Обычный индикатор (1000)
          </button>
        </div>

     
      </div>

      {/* Основной контент */}
      <div className="pt-24">

        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {/* Блоки только с текстом */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Блоки "только текст"
            </h2>
            {Array.from({ length: 3 }).map((_, index) => (
              <TextBlock
                key={index}
                text={text}
                indicatorValue={indicatorValue}
                showPlus={showPlus}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
