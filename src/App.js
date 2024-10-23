import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import SnakeGame from './Components/SnakeGame';




export default function App() {
  const snakeGameRef = useRef(null);
  let tg;
  const [gameSize, setGameSize] = useState(0);
  const [score, setScore] = useState(0); // Состояние для хранения очков

  const handleDirectionChange = (keyCode) => {
    if (snakeGameRef.current) {
      snakeGameRef.current.setDirection({ keyCode });
    }
    // console.log('gay');
  }

  const handleGetBonus = () => {
    // Логика для обработки бонуса (например, обновление состояния)
    console.log("Получены очки:", score);

    let data = {
      nickname: tg.initData,
      score: score
    }

    tg.sendData(JSON.stringify(data));
  };

  const updateScore = (newScore) => {
    setScore(newScore);
  };
  
  useEffect(() => {

    let tg = window.Telegram.WebApp;

    const calculateSize = () => {
      const newSize = Math.floor(window.innerWidth * 0.6); // 80% ширины экрана
      setGameSize(newSize);
    };

    calculateSize(); // Вызываем функцию для начального расчета
    window.addEventListener('resize', calculateSize); // Добавляем обработчик события resize

    // Убираем обработчик события при размонтировании компонента
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

//   const handleBonusClick = async () => {
//     const response = await fetch('http://localhost:5000/get_bonus', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ nickname, bonus_amount: bonusAmount }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//         setMessage(data.message);
//     } else {
//         setMessage(data.error);
//     }
// };

  return (
    <div className="text-3xl font-bold w-screen h-full min-h-screen justify-between items-center bg-stone-800 bg-gradient-radial flex flex-col">

      <div className="h-auto w-auto">
        <div className="mt-20 h-auto w-auto rounded-lg border-4 border-sky-300 bg-sky-300 neon-glow">
          <div className="h-auto w-full rounded-md border-4 border-white bg-stone-800 ledbg py-2 px-4">
            <SnakeGame ref={snakeGameRef} size={gameSize} onScoreChange={updateScore} onFinish={handleGetBonus}/> {/* Задаем размер игры */}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col mt-5 items-center">
        <button onClick={() => handleDirectionChange(38)} className="control-button font-bold font-mine">↑</button>
        <div className="">
          <button onClick={() => handleDirectionChange(37)} className="control-button font-bold font-mine mr-2">←</button>
          <button onClick={() => handleDirectionChange(39)} className="control-button font-bold font-mine ml-2">→</button>
        </div>
        <button onClick={() => handleDirectionChange(40)} className="control-button font-bold font-mine">↓</button>
      </div> */}

      <p className="text-white font-pixelfont font-bold text-4xl mt-6">{score}</p>

      <div className="flex mt-5 items-center w-4/6 justify-between">
        
        <div className="">
          <button onClick={() => handleDirectionChange(37)} className="control-button font-bold font-mine">←</button>
          <button onClick={() => handleDirectionChange(39)} className="control-button font-bold font-mine">→</button>
        </div>
        <div className="">
          <button onClick={() => handleDirectionChange(38)} className="control-button font-bold font-mine">↑</button>
          <button onClick={() => handleDirectionChange(40)} className="control-button font-bold font-mine">↓</button>
        </div>
        
      </div>

      <div className="">
        <p className='text-white text-xl text-center mb-5 font-pix'>GinzaProject</p>
        <p className="text-amber-400 mb-16 text-outline-orange font-pixelfont text-4xl sm:text-6xl">ARCADE GAME</p>
      </div>
    </div>
  )
};
