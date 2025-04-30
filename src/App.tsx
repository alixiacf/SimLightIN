import React from 'react';
import GameContainer from './components/GameContainer';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-blue-100 to-sky-200">
      <GameProvider>
        <GameContainer />
      </GameProvider>
    </div>
  );
}

export default App;