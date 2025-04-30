import React from 'react';
import { Consumer } from '../context/GameContext';
import { Home, Building, Building2, Building as Buildings } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

interface ConsumerCardProps {
  consumer: Consumer;
  onToggle: () => void;
}

const ConsumerCard: React.FC<ConsumerCardProps> = ({ consumer, onToggle }) => {
  const { isStable } = useGameContext();

  const getIcon = () => {
    switch (consumer.name) {
      case 'Pueblo':
        return <Home size={20} className="text-orange-500" />;
      case 'Villa':
        return <Building size={22} className="text-orange-500" />;
      case 'Ciudad':
        return <Building2 size={24} className="text-orange-500" />;
      case 'Capital':
        return <Buildings size={26} className="text-orange-500" />;
      default:
        return <Home size={18} className="text-orange-500" />;
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md transition-all duration-300 bg-gray-100 hover:shadow-lg cursor-pointer transform hover:scale-105 px-1 py-1 text-xs`}
      onClick={onToggle}
      style={{ minHeight: 28 }}
    >
      <div className="flex items-center gap-1">
        <span className="bg-white rounded-full flex items-center justify-center mr-1" style={{width:18,height:18}}>{getIcon()}</span>
        <span className="font-semibold text-gray-800">{consumer.name}</span>
        <span className="ml-1 text-gray-600 font-mono">{consumer.consumption.toFixed(1)} MW</span>
        <span className={`ml-auto h-3 w-3 rounded-full ${consumer.isActive ? (isStable ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-500'}`}></span>
      </div>
      
      {consumer.isActive && (
        <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-300 to-orange-500 animate-pulse"
            style={{ width: '100%' }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ConsumerCard;