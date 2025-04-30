import React from 'react';
import { useGameContext } from '../context/GameContext';

const EventImage: React.FC = () => {
  const { currentEvent } = useGameContext();

  // Si no hay evento, no mostramos nada
  if (!currentEvent) {
    return (
      <div className="w-full bg-gray-50 rounded-lg flex items-center justify-center p-1" style={{ maxHeight: '100px' }}>
        <p className="text-gray-400 text-xs">Sin eventos activos</p>
      </div>
    );
  }

  // Función para determinar la imagen según el tipo de evento
  const getEventImage = () => {
    switch (currentEvent.type) {
      case 'heatwave':
        return '/images/heatwave.png';
      case 'storm':
        return '/images/storm.png';
      case 'lowReservoir':
        return '/images/lowreservoir.png';
      case 'localFestival':
        return '/images/localFestival.png';
      case 'cooperativeNeighbors':
        return '/images/cooperativeNeighbors.png';
      case 'energyExport':
        return '/images/energyExport.png';
      case 'nuclearShutdown':
        return '/images/nuclearShutdown.png';
      case 'persistentShadow':
        return '/images/persistentShadow.png';
      case 'turbineMalfunction':
        return '/images/turbineMalfunction.png';
      default:
        return null;
    }
  };

  const imagePath = getEventImage();

  // Si no tenemos imagen para este evento, mostramos un mensaje
  if (!imagePath) {
    return (
      <div className="w-full bg-gray-50 rounded-lg flex items-center justify-center p-1" style={{ maxHeight: '100px' }}>
        <p className="text-gray-400 text-xs">Imagen no disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-2 flex items-center justify-center" style={{ maxHeight: '120px' }}>
      <img 
        src={imagePath} 
        alt={currentEvent.title}
        style={{ maxHeight: '100px', maxWidth: '95%', objectFit: 'contain' }}
        className="mx-auto rounded"
      />
    </div>
  );
};

export default EventImage;