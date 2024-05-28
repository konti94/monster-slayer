import { useEffect, useState } from "react";

function App() {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [currentRound, setCurrentRound] = useState(0);
  const [winner, setWinner] = useState(null);
  const [logMessages, setLogMessages] = useState([]);

  useEffect(() => {
    if (playerHealth <= 0 && monsterHealth <= 0) {
      setWinner('draw');
    } else if (playerHealth <= 0) {
      setWinner('monster');
    } else if (monsterHealth <= 0) {
      setWinner('player');
    }
  }, [playerHealth, monsterHealth])

  const startGame = () => {
    setPlayerHealth(100);
    setMonsterHealth(100);
    setCurrentRound(0);
    setWinner(null);
    setLogMessages([]);
  }

  const attackMonster = () => {
    setCurrentRound((prevRound) => prevRound + 1);
    const attackValue = getRandomValue(5, 12);
    setMonsterHealth((prevHealth) => prevHealth - attackValue);
    addLogMessage('player', 'attack', attackValue);
    attackPlayer();
  }

  const attackPlayer = () => {
    const attackValue = getRandomValue(8, 15);
    setPlayerHealth((prevHealth) => prevHealth - attackValue);
    addLogMessage('monster', 'attack', attackValue);
  }

  const specialAttackMonster = () => {
    setCurrentRound((prevRound) => prevRound + 1);
    const attackValue = getRandomValue(10, 25);
    setMonsterHealth((prevHealth) => prevHealth - attackValue);
    addLogMessage('player', 'attack', attackValue);
    attackPlayer();
  }

  const healPlayer = () => {
    setCurrentRound((prevRound) => prevRound + 1);
    const healValue = getRandomValue(8, 20);
    setPlayerHealth((prevHealth) => {
      const newHealth = prevHealth + healValue;
      return newHealth > 100 ? 100 : newHealth;
    });
    addLogMessage('player', 'heal', healValue);
    attackPlayer();
  }

  const surrender = () => {
    setWinner('monster');
  }

  const addLogMessage = (who, what, value) => {
    let prevLogMessages = logMessages;
    let currentLogMessages = {
      actionBy: who,
      actionType: what,
      actionValue: value
    };

    prevLogMessages.unshift(currentLogMessages);
    setLogMessages(prevLogMessages);
  };

  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const mayUseSpecialAttack = () => {
    return currentRound % 3 !== 0;
  }

  return (
    <>
      <section id="monster" className="container">
        <h2>Monster Health</h2>
        <div className="healthbar">
          <div className="healthbar__value" style={monsterHealth < 0 ? {width: 0 + '%'} : {width: monsterHealth + '%'}}></div>
        </div>
      </section>
      <section id="player" className="container">
        <h2>Your Health</h2>
        <div className="healthbar">
          <div className="healthbar__value" style={playerHealth < 0 ? {width: 0 + '%'} : {width: playerHealth + '%'}}></div>
        </div>
      </section>
      {winner ? (
        <section className="container">
          <h2>Game Over!</h2>
          {winner === 'monster' && <h3>You lost!</h3>}
          {winner === 'player' && <h3>You won!</h3>}
          {winner === 'draw' && <h3>It's a draw!</h3>}
          <button onClick={startGame}>Start New Game</button>
        </section>
        ) : (
        <section id="controls">
          <button onClick={attackMonster}>ATTACK</button>
          <button onClick={specialAttackMonster} disabled={mayUseSpecialAttack() ? 'disabled' : null}>SPECIAL ATTACK</button>
          <button onClick={healPlayer}>HEAL</button>
          <button onClick={surrender}>SURRENDER</button>
        </section>
      )}
      <section id="log" className="container">
        <h2>Battle Log</h2>
        <ul>
          {logMessages && logMessages?.map((logMessage, index) => (
            <li key={index}>
              <span className={logMessage.actionBy === 'player' ? 'log--player' : 'log--monster'}>{logMessage.actionBy === 'player' ? 'Player' : 'Monster'}</span>
              {logMessage.actionType === 'heal' && <span> heals himself for <span className="log--heal">{logMessage.actionValue}</span></span>}
              {logMessage.actionType !== 'heal' && <span> attacks and deals <span className="log-damage">{logMessage.actionValue}</span></span>}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default App;
