import React from 'react';
import ReserveCard from './ReserveCard';
import { useGameContext } from '../context/GameContext';

const ReservesPanel: React.FC = () => {
  const { powerSources, togglePowerSource } = useGameContext();
  
  // Filter just the reserves
  const reserves = powerSources.filter(source => source.isReserve);

  return (
    <div className="grid grid-cols-3 gap-1">
      {reserves.map((reserve, idx) => (
        <ReserveCard 
          key={reserve.id}
          reserve={reserve}
          title={`R${['I','II','III'][idx] || (idx+1)}`}
          onToggle={() => togglePowerSource(reserve.id)}
        />
      ))}
    </div>
  );
};

export default ReservesPanel