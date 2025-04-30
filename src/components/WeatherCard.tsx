import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Sun, Cloud, CloudLightning, Wind, CloudRain } from 'lucide-react';

const WeatherCard: React.FC = () => {
  const { currentWeather, changeWeather } = useGameContext();

  const getWeatherIcon = () => {
    switch (currentWeather.type) {
      case 'sunny':
        return <Sun size={24} className="text-yellow-500" />;
      case 'cloudy':
        return <Cloud size={24} className="text-gray-500" />;
      case 'stormy':
        return <CloudLightning size={24} className="text-purple-500" />;
      case 'windy':
        return <Wind size={24} className="text-blue-500" />;
      case 'rainy':
        return <CloudRain size={24} className="text-blue-400" />;
    }
  };

  const getWeatherName = () => {
    switch (currentWeather.type) {
      case 'sunny':
        return 'Soleado';
      case 'cloudy':
        return 'Nublado';
      case 'stormy':
        return 'Tormentoso';
      case 'windy':
        return 'Ventoso';
      case 'rainy':
        return 'Lluvioso';
    }
  };

  const getWeatherBackground = () => {
    switch (currentWeather.type) {
      case 'sunny':
        return 'bg-yellow-50';
      case 'cloudy':
        return 'bg-gray-50';
      case 'stormy':
        return 'bg-purple-50';
      case 'windy':
        return 'bg-blue-50';
      case 'rainy':
        return 'bg-blue-50';
    }
  };

  return (
    <div 
      onClick={changeWeather}
      className={`${getWeatherBackground()} h-full rounded-lg shadow-md px-2 py-1 cursor-pointer hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-gray-800">Clima</h3>
        <div className="flex items-center">
          {getWeatherIcon()}
          <span className="text-gray-700 ml-1 text-sm">{getWeatherName()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-0.5 text-xs">
        <div className="bg-white p-1 rounded">
          <div className="font-medium">Solar</div>
          <div className="font-bold text-yellow-600">{Math.round(currentWeather.solarMultiplier * 100)}%</div>
        </div>
        <div className="bg-white p-1 rounded">
          <div className="font-medium">Eólica</div>
          <div className="font-bold text-blue-600">{Math.round(currentWeather.windMultiplier * 100)}%</div>
        </div>
        <div className="bg-white p-1 rounded">
          <div className="font-medium">Hidro</div>
          <div className="font-bold text-blue-600">{Math.round(currentWeather.hydroMultiplier * 100)}%</div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 text-center">Click para cambiar</p>
    </div>
  );
};

export default WeatherCard;