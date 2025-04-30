import React from 'react';
import PowerSourceCard from './PowerSourceCard';
import { useGameContext } from '../context/GameContext';

const PowerSourcesPanel: React.FC = () => {
  const { powerSources, togglePowerSource, noConsumersActive, isStable } = useGameContext();
  
  const variableSources = powerSources.filter(source => source.category === 'variable' && !source.isReserve);
  const dispatchableSources = powerSources.filter(source => source.category === 'dispatchable' && !source.isReserve);

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xs font-bold text-blue-700">Superhéroes de la Energía{!noConsumersActive && !isStable ? <span className="ml-1" role="img" aria-label="atención energía">👇</span> : null}</h2>
      {variableSources.map(source => (
        <PowerSourceCard 
          key={source.id}
          source={source}
          onToggle={() => togglePowerSource(source.id)}
        />
      ))}
      {dispatchableSources.map(source => (
        <PowerSourceCard 
          key={source.id}
          source={source}
          onToggle={() => togglePowerSource(source.id)}
        />
      ))}
    </div>
  );
};

export default PowerSourcesPanel