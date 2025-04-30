import React from 'react';
import { PowerSource } from '../context/GameContext';
import { Sun, Wind, Droplet, Flame } from 'lucide-react';

interface PowerSourceCardProps {
  source: PowerSource;
  onToggle: () => void;
}

const PowerSourceCard: React.FC<PowerSourceCardProps> = ({ source, onToggle }) => {
  const getIcon = () => {
    switch (source.type) {
      case 'solar':
        return <Sun size={24} className="text-yellow-500" />;
      case 'wind':
        return <Wind size={24} className="text-sky-500" />;
      case 'hydro':
        return <Droplet size={24} className="text-blue-500" />;
      case 'gas':
        return <Flame size={24} className="text-orange-500" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    if (!source.isActive) return 'bg-gray-100';
    
    switch (source.type) {
      case 'solar':
        return 'bg-yellow-100';
      case 'wind':
        return 'bg-sky-100';
      case 'hydro':
        return 'bg-blue-100';
      case 'gas':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md transition-all duration-300 ${getBackgroundColor()} hover:shadow-lg cursor-pointer transform hover:scale-105 px-1 py-1 text-xs`}
      onClick={onToggle}
      style={{ minHeight: 28 }}
    >
      <div className="flex items-center gap-1">
        <span className="bg-white rounded-full flex items-center justify-center mr-1" style={{width:18,height:18}}>{getIcon()}</span>
        <span className="font-semibold text-gray-800">{source.name}</span>
        <span className="ml-1 text-gray-600 font-mono">{source.currentOutput.toFixed(1)} MW</span>
        {['solar','wind','hydro'].includes(source.type) && (
          <span className="ml-1 text-green-700 font-bold">R</span>
        )}
        {['nuclear','gas'].includes(source.type) && (
          <span className="ml-1 text-blue-700 font-bold">C</span>
        )}
        <span className={`ml-auto h-3 w-3 rounded-full ${source.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </div>
      
      {source.isActive && (
        <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 animate-pulse"
            style={{ width: `${(source.currentOutput / source.capacity) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default PowerSourceCard