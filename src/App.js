import React, { useEffect, useState } from "react";
import Dice from "./Dice";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
export default function App() {
  const [bestTime, setBestTime] = useState(JSON.parse(localStorage.getItem("bestTime")));
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [score, setScore] = useState(0);
  const [tenzies, setTenzies] = useState(false);
  const [dice, setDice] = useState(allNewDice());

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld === true);
    const allSame = dice.every(die => die.value === dice[0].value);
    if (allHeld && allSame) {
      setTenzies(true);
      const finalDate = new Date();
      const finalTime = ((finalDate.getHours() * 60 * 60) + (finalDate.getMinutes() * 60) + (finalDate.getSeconds()))
      const elapsedTime = finalTime < time.seconds ? (finalTime + 86400) - time.seconds : finalTime - time.seconds;
      setTime(
        {
          minutes: Math.floor(elapsedTime / 60 - (Math.floor(elapsedTime / 3600) * 60)),
          seconds: Math.floor((elapsedTime - (Math.floor(elapsedTime / 3600) * 3600))
            - (Math.floor(elapsedTime / 60 - (Math.floor(elapsedTime / 3600) * 60)) * 60))
        }
      )
    }
  }, [dice]);

  function allNewDice() {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * (7 - 1) + 1);
      newArray.push({ value: randomNumber, isHeld: false, id: nanoid() });
    }
    return newArray;
  }
  function toggleHeld(id) {
    if (score === 0 && dice.every(die => die.isHeld === false)) {
      const startDate = new Date();
      const startTime = ((startDate.getHours() * 60 * 60) + (startDate.getMinutes() * 60) + (startDate.getSeconds()));
      setTime(prevTime => ({ ...prevTime, seconds: startTime }));
    }
    setDice(oldDice => oldDice.map(oldDie => oldDie.id === id ? { ...oldDie, isHeld: !(oldDie.isHeld) } : oldDie));
  }
  function rollDice() {
    if (tenzies) {
      setDice(allNewDice());
      setTenzies(false);
      if (isNewRecord) {
        setBestTime(time);
        localStorage.setItem("bestTime", JSON.stringify(time));
      }
      setTime({ minutes: 0, seconds: 0 });
      setScore(0);
    } else {
      setDice(oldDice => oldDice.map(oldDie => oldDie.isHeld === true ? oldDie : { ...oldDie, value: Math.floor(Math.random() * (7 - 1) + 1) }));
      setScore(prevScore => prevScore + 1);
    }
  }

  const diceElements = dice.map(dice => <Dice key={dice.id} id={dice.id} value={dice.value} isHeld={dice.isHeld} toggleHeld={toggleHeld} />);
  const isNewRecord = (bestTime === null) || (bestTime.minutes >= time.minutes && bestTime.seconds > time.seconds);
  return (
    <main>
      {tenzies && <Confetti />}
      <div className="game-container">
        <h2>{(isNewRecord && tenzies) && "NEW RECORD!"}</h2>
        <h3>{bestTime && "Best Time: " + bestTime.minutes + " minutes, " + bestTime.seconds + " seconds"}</h3>
        <h1>Tenzies!</h1>
        <h2>Click on the dice to match numbers with one another.</h2>
        <h3>{tenzies ? "The number of rolls you've made is  " + score : "Click the button to reroll the dice."}</h3>
        <h3>{tenzies && "Elapsed Time: " + time.minutes + " minutes, " + time.seconds + " seconds"}</h3>
        <div className="dice-container">
          {diceElements}
        </div>
        <button onClick={rollDice}>{tenzies ? "Reset Game" : "Roll"}</button>
      </div>
    </main>
  );
}