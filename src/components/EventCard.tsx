import React from 'react';
import { useGameContext } from '../context/GameContext';
import { AlertTriangle, Zap, CloudRain, PartyPopper, Cloud, PenTool as Tool, Users, TrendingUp, Factory } from 'lucide-react';

const EventCard: React.FC = () => {
  const { currentEvent } = useGameContext();

  const [nextEventCountdown, setNextEventCountdown] = React.useState<number>(30);

  React.useEffect(() => {
    if (currentEvent) return;
    const interval = setInterval(() => {
      setNextEventCountdown((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentEvent]);

  if (!currentEvent) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md p-2 flex items-center justify-center" style={{ maxHeight: '80px' }}>
        <p className="text-xs text-gray-500 font-semibold flex items-center gap-2">
          <span role="img" aria-label="alerta">⏳</span>
          Próximo evento en: {String(nextEventCountdown).padStart(2, '0')}s
        </p>
      </div>
    );
  }

  const getEventIcon = () => {
    switch (currentEvent.type) {
      case 'heatwave':
        return <Zap size={18} className="text-yellow-500" />;
      case 'storm':
        return <CloudRain size={18} className="text-gray-500" />;
      case 'lowReservoir':
        return <AlertTriangle size={18} className="text-red-500" />;
      case 'localFestival':
        return <PartyPopper size={18} className="text-purple-500" />;
      case 'persistentShadow':
        return <Cloud size={18} className="text-gray-500" />;
      case 'turbineMalfunction':
        return <Tool size={18} className="text-orange-500" />;
      case 'cooperativeNeighbors':
        return <Users size={18} className="text-green-500" />;
      case 'energyExport':
        return <TrendingUp size={18} className="text-blue-500" />;
      case 'nuclearShutdown':
        return <Factory size={18} className="text-red-500" />;
      default:
        return <AlertTriangle size={18} className="text-yellow-500" />;
    }
  };

  const getEventBackground = () => {
    switch (currentEvent.type) {
      case 'heatwave':
        return 'bg-yellow-50 border-yellow-500';
      case 'storm':
        return 'bg-gray-50 border-gray-500';
      case 'lowReservoir':
        return 'bg-red-50 border-red-500';
      case 'localFestival':
        return 'bg-purple-50 border-purple-500';
      case 'persistentShadow':
        return 'bg-gray-50 border-gray-500';
      case 'turbineMalfunction':
        return 'bg-orange-50 border-orange-500';
      case 'cooperativeNeighbors':
        return 'bg-green-50 border-green-500';
      case 'energyExport':
        return 'bg-blue-50 border-blue-500';
      case 'nuclearShutdown':
        return 'bg-red-50 border-red-500';
      default:
        return 'bg-yellow-50 border-yellow-500';
    }
  };

  return (
    <div className={`rounded-lg shadow-md px-3 py-2 border-l-4 ${getEventBackground()}`} style={{ maxHeight: '100px', overflowY: 'auto' }}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-800 text-xs">Evento: {currentEvent.title}</h3>
        <div className="flex items-center">
          {getEventIcon()}
        </div>
      </div>
      
      <p className="text-xs text-gray-600 line-clamp-2">{currentEvent.description}</p>
      <p className="text-xs font-semibold text-red-600 mt-1">{currentEvent.effect}</p>
    </div>
  );
};

export default EventCard