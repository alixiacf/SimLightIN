import React from 'react';
import { PowerSource } from '../context/GameContext';
import { Battery, BatteryMedium, BatteryFull } from 'lucide-react';

interface ReserveCardProps {
  reserve: PowerSource;
  onToggle: () => void;
  title?: string;
}

const ReserveCard: React.FC<ReserveCardProps> = ({ reserve, onToggle, title }) => {
  const getIcon = () => {
    switch (reserve.type) {
      case 'primary':
        return <Battery size={20} className="text-purple-500" />;
      case 'secondary':
        return <BatteryMedium size={20} className="text-indigo-500" />;
      case 'tertiary':
        return <BatteryFull size={20} className="text-blue-500" />;
      default:
        return null;
    }
  };
  


  const getBackgroundColor = () => {
    if (!reserve.isActive) return 'bg-gray-100';
    
    switch (reserve.type) {
      case 'primary':
        return 'bg-purple-100';
      case 'secondary':
        return 'bg-indigo-100';
      case 'tertiary':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md transition-all duration-300 ${getBackgroundColor()} hover:shadow-lg cursor-pointer transform hover:scale-105 px-2 py-1`}
      onClick={onToggle}
    >
      <div className="flex flex-col items-center justify-center px-1 py-1 text-xs">
        <div className="bg-white rounded-full flex items-center justify-center mb-1" style={{width:18,height:18}}>
          {React.cloneElement(getIcon() as React.ReactElement, { size: 18 })}
        </div>
        <span className="text-gray-600 font-mono mb-0.5">{reserve.currentOutput.toFixed(1)} MW</span>
        <span className="font-semibold text-gray-800 mb-0.5">{title || reserve.name}</span>
        <span className={`h-3 w-3 rounded-full ${reserve.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </div>
      
      {/* Power output bar */}
      {reserve.isActive && (
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-300 to-purple-500 animate-pulse"
            style={{ width: `${(reserve.currentOutput / reserve.capacity) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ReserveCard