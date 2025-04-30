import React from 'react';
import ConsumerCard from './ConsumerCard';
import { useGameContext } from '../context/GameContext';

const ConsumersPanel: React.FC = () => {
  const { consumers, toggleConsumer, isStable } = useGameContext();

  return (
    <div className="flex flex-col gap-1">
      {consumers.map(consumer => (
        <ConsumerCard 
          key={consumer.id}
          consumer={consumer}
          onToggle={() => {
            if (consumer.isActive) {
              // Siempre permitimos desactivar
              toggleConsumer(consumer.id);
            } else if (isStable) {
              // Solo permitimos activar si el sistema está equilibrado
              toggleConsumer(consumer.id);
            } else {
              alert('¡Solo puedes añadir consumidores cuando el sistema está equilibrado (en verde)! Ajusta la producción o el consumo para estabilizar la red.');
            }
          }}
        />
      ))}
    </div>
  );
};

export default ConsumersPanel;