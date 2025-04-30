import React from 'react';
import { useGameContext } from '../context/GameContext';
import { CloudLightning } from 'lucide-react';

const BlackSwanButton: React.FC = () => {
  const { blackSwanActive, triggerBlackSwan } = useGameContext();

  return (
    <div className="w-full">
      <button 
        onClick={triggerBlackSwan}
        disabled={blackSwanActive}
        className={`
          w-full py-3 px-4 rounded-lg font-bold shadow-md transition-all duration-300
          flex items-center justify-center space-x-2
          ${blackSwanActive 
            ? 'bg-red-600 text-white cursor-not-allowed' 
            : 'bg-yellow-500 hover:bg-yellow-600 text-white transform hover:scale-105'
          }
        `}
      >
        <CloudLightning size={24} />
        <span>
          {blackSwanActive 
            ? '¡Emergencia en Progreso!' 
            : 'Activar Cisne Negro (Emergencia)'}
        </span>
      </button>
      <p className="text-xs text-center mt-2 text-gray-600">
        {blackSwanActive 
          ? 'Resolveremos la emergencia en breve...' 
          : 'Simula un evento inesperado en la red eléctrica'}
      </p>
    </div>
  );
};

export default BlackSwanButton;