import React, { useRef, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Activity } from 'lucide-react';

const GridControl: React.FC = () => {
  const { 
    totalProduction, 
    totalConsumption, 
    gridFrequency,
    isStable,
    blackSwanActive
  } = useGameContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frequencyHistory = useRef<number[]>([]);

  // Reset frequency history when game resets
  useEffect(() => {
    if (totalProduction === 0 && totalConsumption === 0) {
      frequencyHistory.current = [];
    }
  }, [totalProduction, totalConsumption]);

  // Resize canvas when window resizes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Adjust canvas dimensions
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Add current frequency to history
    frequencyHistory.current.push(gridFrequency);
    if (frequencyHistory.current.length > 100) {
      frequencyHistory.current.shift();
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();

    // Draw admissible range lines (49.8 Hz and 50.2 Hz)
    const minHz = 49;
    const maxHz = 51;
    const range = maxHz - minHz;
    const yForHz = (hz: number) => ((maxHz - hz) / range) * canvas.height;
    ctx.strokeStyle = '#f59e42'; // naranja claro
    ctx.setLineDash([4, 4]);
    // 49.8 Hz
    ctx.beginPath();
    ctx.moveTo(0, yForHz(49.8));
    ctx.lineTo(canvas.width, yForHz(49.8));
    ctx.stroke();
    // 50.2 Hz
    ctx.beginPath();
    ctx.moveTo(0, yForHz(50.2));
    ctx.lineTo(canvas.width, yForHz(50.2));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw frequency line
    ctx.strokeStyle = isStable ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    frequencyHistory.current.forEach((freq, index) => {
      const x = (index / frequencyHistory.current.length) * canvas.width;
      const y = yForHz(freq);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw center line (50 Hz)
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, yForHz(50));
    ctx.lineTo(canvas.width, yForHz(50));
    ctx.stroke();
    ctx.setLineDash([]);
  }, [gridFrequency, isStable]);

  const { consumers } = useGameContext();
  const noConsumersActive = consumers.filter(c => c.isActive).length === 0;

  // Expón noConsumersActive para el contexto global
  React.useEffect(() => {}, [noConsumersActive, isStable]); // Dummy para asegurar dependencias

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg p-2 flex flex-col items-center justify-start">
      <h2 className="text-base font-bold text-gray-800 mb-1 text-center w-full">Centro de Control SCADA</h2>
      {/* Frequency visualization */}
      <div className="w-full flex flex-row items-stretch bg-gray-50 rounded-lg p-2 mb-1" style={{minHeight:'220px', maxHeight:'320px'}}>
        {/* Vertical labels */}
        <div className="flex flex-col justify-between items-end mr-1 py-1">
          <span className="text-xs text-gray-500">51 Hz</span>
          <span className="text-xs text-gray-500">50 Hz</span>
          <span className="text-xs text-gray-500">49 Hz</span>
        </div>
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
            style={{minHeight:'200px', maxHeight:'300px'}}
          />
        </div>
      </div>
      {/* Production and consumption info */}
      <div className="w-full grid grid-cols-3 gap-1 mt-1">
        <div className="bg-blue-50 p-1 rounded-lg flex flex-col items-center">
          <div className="text-xs font-medium text-gray-600">Producción</div>
          <div className="font-bold text-blue-600 text-base">{totalProduction.toFixed(1)} MW</div>
        </div>
        <div className="bg-orange-50 p-1 rounded-lg flex flex-col items-center">
          <h2 className="text-xs font-bold text-orange-500">Casas (Consumidores){noConsumersActive && isStable ? <span className="ml-1" role="img" aria-label="atención consumidores">👇</span> : null}</h2>
          <div className="font-bold text-orange-600 text-base">{totalConsumption.toFixed(1)} MW</div>
        </div>
        <div className={`p-1 rounded-lg flex flex-col items-center ${isStable ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-sm font-medium text-gray-600">Estado</div>
          <div className="flex items-center">
            <Activity size={16} className={`mr-1 ${isStable ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`font-bold ${isStable ? 'text-green-600' : 'text-red-600'}`}>
              {blackSwanActive 
                ? '¡EMERGENCIA!' 
                : isStable 
                  ? 'Estable' 
                  : gridFrequency < 49.8 
                    ? 'Baja' 
                    : 'Alta'}
            </span>
          </div>
        </div>
      </div>
      {/* Mensajes dinámicos de orientación */}
      {noConsumersActive && !isStable && totalProduction > 0 ? (
        <div className="w-full mt-2 mb-1 px-2 py-1 bg-red-50 border-l-4 border-red-400 rounded text-xs text-red-700 animate-pulse">
          Desactiva fuentes de energía para poder iniciar los consumidores.
        </div>
      ) : noConsumersActive ? (
        <div className="w-full mt-2 mb-1 px-2 py-1 bg-yellow-50 border-l-4 border-yellow-400 rounded text-xs text-gray-700 animate-pulse">
          Comienza conectando consumidores y mantén el ciclo suministro en verde para seguir añadiendo consumidores. Estate atento a las cards aleatorias que influyen en el sistema.
        </div>
      ) : !isStable ? (
        <div className="w-full mt-2 mb-1 px-2 py-1 bg-red-50 border-l-4 border-red-400 rounded text-xs text-red-700 animate-pulse">
          {totalProduction > totalConsumption ? (
            <>¡Sobra energía! Desconecta o ajusta alguna fuente de energía.</>
          ) : (
            <>¡Falta energía! Añade fuentes de energía o desconecta consumidores.</>
          )}
        </div>
      ) : (
        <div className="w-full mt-2 mb-1 px-2 py-1 bg-green-50 border-l-4 border-green-400 rounded text-xs text-green-700 animate-pulse">
          ¡Bien hecho! El sistema está equilibrado. Puedes seguir añadiendo consumidores.
        </div>
      )}
    </div>
  );
};

export default GridControl;