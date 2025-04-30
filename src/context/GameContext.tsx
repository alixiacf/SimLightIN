import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type PowerSourceType = 'solar' | 'wind' | 'hydro' | 'gas' | 'nuclear' | 'primary' | 'secondary' | 'tertiary';
export type WeatherType = 'sunny' | 'cloudy' | 'stormy' | 'windy' | 'rainy';
export type EventType = 'heatwave' | 'storm' | 'lowReservoir' | 'localFestival' | 'persistentShadow' | 'turbineMalfunction' | 'cooperativeNeighbors' | 'failedPrediction' | 'energyExport' | 'nuclearShutdown';

export interface GameEvent {
  type: EventType;
  title: string;
  description: string;
  effect: string;
  duration: number; // in seconds
  modifiers: {
    consumption?: number; // percentage modifier
    solarProduction?: number;
    windProduction?: number;
    hydroProduction?: number;
    primaryReserveDisabled?: boolean;
    additionalLoad?: number; // MW
  };
}

export interface PowerSource {
  id: string;
  type: PowerSourceType;
  name: string;
  category: 'variable' | 'dispatchable';
  capacity: number;
  currentOutput: number;
  isActive: boolean;
  isReserve: boolean;
  activationTime: number;
  baseOutput?: number; // New field for tracking base output
}

export interface Consumer {
  id: string;
  name: string;
  consumption: number;
  isActive: boolean;
}

interface Weather {
  type: WeatherType;
  solarMultiplier: number;
  windMultiplier: number;
  hydroMultiplier: number;
}

interface GameContextType {
  powerSources: PowerSource[];
  consumers: Consumer[];
  totalProduction: number;
  totalConsumption: number;
  gridFrequency: number;
  isStable: boolean;
  currentWeather: Weather;
  currentEvent: GameEvent | null;
  togglePowerSource: (id: string) => void;
  toggleConsumer: (id: string) => void;
  changeWeather: () => void;
  resetGame: () => void;
  noConsumersActive: boolean;
}

const gameEvents: GameEvent[] = [
  {
    type: 'heatwave',
    title: 'Ola de Calor Imprevista',
    description: '¡Los aires acondicionados trabajan a pleno rendimiento!',
    effect: '+30% consumo en las casas',
    duration: 120, // 2 minutes
    modifiers: { consumption: 1.3 }
  },
  {
    type: 'storm',
    title: 'Tormenta en el Norte',
    description: 'Los molinos de viento deben reducir su producción',
    effect: '-80% producción eólica',
    duration: 90,
    modifiers: { windProduction: 0.2 }
  },
  {
    type: 'lowReservoir',
    title: 'Embalse Bajo Mínimos',
    description: 'La hidroeléctrica debe detener su producción',
    effect: 'Hidroeléctrica no disponible',
    duration: 180,
    modifiers: { hydroProduction: 0 }
  },
  {
    type: 'localFestival',
    title: 'Fiesta de San Frikilín del KWh',
    description: '¡Todo el mundo está de celebración!',
    effect: '+20% demanda',
    duration: 120,
    modifiers: { consumption: 1.2 }
  },
  {
    type: 'persistentShadow',
    title: 'Sombra Persistente',
    description: 'Una densa capa de nubes cubre los paneles solares',
    effect: '-60% producción solar',
    duration: 150,
    modifiers: { solarProduction: 0.4 }
  },
  {
    type: 'turbineMalfunction',
    title: 'Avería en Turbina de Gas',
    description: 'La reserva primaria no responde',
    effect: 'Reserva primaria deshabilitada',
    duration: 60,
    modifiers: { primaryReserveDisabled: true }
  },
  {
    type: 'cooperativeNeighbors',
    title: 'Vecinos Colaborativos',
    description: 'La comunidad reduce su consumo',
    effect: '-15% consumo general',
    duration: 90,
    modifiers: { consumption: 0.85 }
  },
  {
    type: 'energyExport',
    title: 'Exportación Energética',
    description: 'Ayudamos a un país vecino',
    effect: '+10 MW de demanda',
    duration: 120,
    modifiers: { additionalLoad: 10 }
  },
  {
    type: 'nuclearShutdown',
    title: 'Parón Nuclear Inesperado',
    description: 'Pérdida súbita de generación',
    effect: '-15 MW de producción',
    duration: 90,
    modifiers: { additionalLoad: 15 }
  }
];

const weatherConditions: Weather[] = [
  { type: 'sunny', solarMultiplier: 1, windMultiplier: 0.6, hydroMultiplier: 0.8 },
  { type: 'cloudy', solarMultiplier: 0.4, windMultiplier: 0.8, hydroMultiplier: 0.9 },
  { type: 'stormy', solarMultiplier: 0.2, windMultiplier: 1.2, hydroMultiplier: 1.2 },
  { type: 'windy', solarMultiplier: 0.7, windMultiplier: 1.3, hydroMultiplier: 0.9 },
  { type: 'rainy', solarMultiplier: 0.3, windMultiplier: 0.7, hydroMultiplier: 1.1 }
];

const initialPowerSources: PowerSource[] = [
  {
    id: 'solar1',
    type: 'solar',
    name: 'Paneles Solares',
    category: 'variable',
    capacity: 30,
    currentOutput: 0,
    isActive: false,
    isReserve: false,
    activationTime: 0
  },
  {
    id: 'wind1',
    type: 'wind',
    name: 'Molinos de Viento',
    category: 'variable',
    capacity: 25,
    currentOutput: 0,
    isActive: false,
    isReserve: false,
    activationTime: 0
  },
  {
    id: 'hydro1',
    type: 'hydro',
    name: 'Hidroeléctrica',
    category: 'variable',
    capacity: 40,
    currentOutput: 0,
    isActive: false,
    isReserve: false,
    activationTime: 0
  },
  {
    id: 'nuclear1',
    type: 'nuclear',
    name: 'Central Nuclear',
    category: 'dispatchable',
    capacity: 60,
    currentOutput: 0,
    baseOutput: 60,
    isActive: false,
    isReserve: false,
    activationTime: 0
  },
  {
    id: 'gas1',
    type: 'gas',
    name: 'Central de Gas',
    category: 'dispatchable',
    capacity: 45,
    currentOutput: 0,
    baseOutput: 45,
    isActive: false,
    isReserve: false,
    activationTime: 0
  },
  {
    id: 'primary1',
    type: 'primary',
    name: 'Reserva Primaria',
    category: 'dispatchable',
    capacity: 20,
    currentOutput: 0,
    baseOutput: 20,
    isActive: false,
    isReserve: true,
    activationTime: 1
  },
  {
    id: 'secondary1',
    type: 'secondary',
    name: 'Reserva Secundaria',
    category: 'dispatchable',
    capacity: 35,
    currentOutput: 0,
    baseOutput: 35,
    isActive: false,
    isReserve: true,
    activationTime: 3
  },
  {
    id: 'tertiary1',
    type: 'tertiary',
    name: 'Reserva Terciaria',
    category: 'dispatchable',
    capacity: 50,
    currentOutput: 0,
    baseOutput: 50,
    isActive: false,
    isReserve: true,
    activationTime: 5
  }
];

const initialConsumers: Consumer[] = [
  {
    id: 'pueblo',
    name: 'Pueblo',
    consumption: 25,
    isActive: false
  },
  {
    id: 'villa',
    name: 'Villa',
    consumption: 40,
    isActive: false
  },
  {
    id: 'ciudad',
    name: 'Ciudad',
    consumption: 60,
    isActive: false
  },
  {
    id: 'capital',
    name: 'Capital',
    consumption: 85,
    isActive: false
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [powerSources, setPowerSources] = useState<PowerSource[]>(initialPowerSources);
  const [primaryReserveLocked, setPrimaryReserveLocked] = useState(false);
  const [consumers, setConsumers] = useState<Consumer[]>(initialConsumers);
  const [currentWeather, setCurrentWeather] = useState<Weather>(weatherConditions[0]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [eventTimer, setEventTimer] = useState<NodeJS.Timeout | null>(null);

  // Bloqueo y desactivación de la reserva primaria durante 'Avería en Turbina de Gas'
  React.useEffect(() => {
    if (currentEvent?.type === 'turbineMalfunction') {
      setPrimaryReserveLocked(true);
      setPowerSources(prev => prev.map(source =>
        source.type === 'primary' ? { ...source, isActive: false } : source
      ));
    } else {
      setPrimaryReserveLocked(false);
    }
  }, [currentEvent]);

  const totalProduction = powerSources.reduce((sum, source) => {
    if (!source.isActive) return sum;
    
    let output = source.currentOutput;
    if (currentEvent) {
      if (source.type === 'solar' && currentEvent.modifiers.solarProduction !== undefined) {
        output *= currentEvent.modifiers.solarProduction;
      }
      if (source.type === 'wind' && currentEvent.modifiers.windProduction !== undefined) {
        output *= currentEvent.modifiers.windProduction;
      }
      if (source.type === 'hydro' && currentEvent.modifiers.hydroProduction !== undefined) {
        output *= currentEvent.modifiers.hydroProduction;
      }
      if (source.type === 'primary' && currentEvent.modifiers.primaryReserveDisabled) {
        output = 0;
      }
    }
    return sum + output;
  }, 0);

  const totalConsumption = consumers.reduce((sum, consumer) => {
    if (!consumer.isActive) return sum;
    let consumption = consumer.consumption;
    if (currentEvent?.modifiers.consumption) {
      consumption *= currentEvent.modifiers.consumption;
    }
    return sum + consumption;
  }, currentEvent?.modifiers.additionalLoad || 0);

  const gridFrequency = 50 + (totalProduction - totalConsumption) / 20;
  const isStable = gridFrequency >= 49.8 && gridFrequency <= 50.2;

  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const currentIndex = weatherConditions.findIndex(w => w.type === currentWeather.type);
      const nextIndex = Math.floor(Math.random() * weatherConditions.length);
      if (nextIndex !== currentIndex) {
        setCurrentWeather(weatherConditions[nextIndex]);
      }
    }, 30000); // Change weather every 30 seconds

    return () => clearInterval(weatherInterval);
  }, [currentWeather]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPowerSources(prev => prev.map(source => {
        if (!source.isActive) return { ...source, currentOutput: 0 };
        
        let output: number;
        
        if (source.category === 'variable') {
          let baseOutput = source.capacity;
          switch (source.type) {
            case 'solar':
              baseOutput *= currentWeather.solarMultiplier;
              break;
            case 'wind':
              baseOutput *= currentWeather.windMultiplier;
              break;
            case 'hydro':
              baseOutput *= currentWeather.hydroMultiplier;
              break;
          }
          
          const variation = Math.random() * 0.1 - 0.05;
          output = baseOutput * (1 + variation);
        } else {
          const baseOutput = source.baseOutput || source.capacity;
          const variation = Math.random() * 0.02 - 0.01;
          output = baseOutput * (1 + variation);
        }
        
        return { ...source, currentOutput: Math.max(0, output) };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [currentWeather]);

  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (!currentEvent) {
        const randomEvent = gameEvents[Math.floor(Math.random() * gameEvents.length)];
        setCurrentEvent(randomEvent);
        
        const timer = setTimeout(() => {
          setCurrentEvent(null);
        }, randomEvent.duration * 1000);
        
        setEventTimer(timer);
      }
    }, 30000);

    return () => {
      clearInterval(eventInterval);
      if (eventTimer) clearTimeout(eventTimer);
    };
  }, [currentEvent]);

  const togglePowerSource = (id: string) => {
    setPowerSources(prev => prev.map(source => {
      if (source.id !== id) return source;
      // Si es reserva primaria y está bloqueada, no permitimos activarla
      if (source.type === 'primary' && primaryReserveLocked && !source.isActive) {
        alert('La reserva primaria está deshabilitada por avería en la turbina de gas.');
        return source;
      }
      const newIsActive = !source.isActive;
      return {
        ...source,
        isActive: newIsActive,
        currentOutput: newIsActive ? (source.baseOutput || source.capacity) : 0
      };
    }));
  };

  const toggleConsumer = (id: string) => {
    setConsumers(prev => prev.map(consumer => {
      if (consumer.id !== id) return consumer;
      return {
        ...consumer,
        isActive: !consumer.isActive
      };
    }));
  };

  const changeWeather = () => {
    const currentIndex = weatherConditions.findIndex(w => w.type === currentWeather.type);
    const nextIndex = (currentIndex + 1) % weatherConditions.length;
    setCurrentWeather(weatherConditions[nextIndex]);
  };

  const resetGame = () => {
    setPowerSources(initialPowerSources);
    setConsumers(initialConsumers);
    setCurrentWeather(weatherConditions[0]);
    setCurrentEvent(null);
    if (eventTimer) clearTimeout(eventTimer);
  };

  const noConsumersActive = consumers.filter(c => c.isActive).length === 0;

  return (
    <GameContext.Provider
      value={{
        powerSources,
        consumers,
        totalProduction,
        totalConsumption,
        gridFrequency,
        isStable,
        currentWeather,
        currentEvent,
        togglePowerSource,
        toggleConsumer,
        changeWeather,
        resetGame,
        noConsumersActive
      }}
    >
      {children}
    </GameContext.Provider>
  );
};