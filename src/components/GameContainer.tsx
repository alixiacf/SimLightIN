import React from 'react';
import PowerSourcesPanel from './PowerSourcesPanel';
import ConsumersPanel from './ConsumersPanel';
import GridControl from './GridControl';
import { useGameContext } from '../context/GameContext';
import ReservesPanel from './ReservesPanel';
import GameHeader from './GameHeader';
import WeatherCard from './WeatherCard';
import EventCard from './EventCard';
import EventImage from './EventImage';

const GameContainer: React.FC = () => {
  const { resetGame } = useGameContext();

  return (
    <div className="h-screen w-screen bg-white rounded-xl shadow-xl overflow-hidden grid grid-areas-layout">
      <GameHeader className="grid-in-header" />

      <div className="grid-in-generators p-3 overflow-auto flex flex-col">
        <div>
          <PowerSourcesPanel />
        </div>
        <div>

          <ReservesPanel />
        </div>
        <div>
          <WeatherCard />
        </div>
      </div>

      <div className="grid-in-control p-3 flex flex-col h-full">
        <div className="flex-1 mb-3 min-h-0">
          <GridControl />
        </div>
        <button 
          onClick={resetGame}
          className="py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors mt-auto"
        >
          Reiniciar Juego
        </button>
      </div>

      <div className="grid-in-consumers p-3 overflow-auto">
        <div>
          <h2 className="text-xs font-bold text-orange-500">Casas (Consumidores)</h2>
          <ConsumersPanel />
        </div>
      </div>

      <div className="grid-in-event-image p-3 col-span-3 flex flex-col gap-3">
        <EventImage />
        <EventCard />
      </div>
    </div>
  );
};

export default GameContainer;