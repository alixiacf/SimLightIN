import React from 'react';

interface GameHeaderProps {
  className?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ className }) => {
  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 flex items-center justify-between ${className || ''}`}>
      <span className="flex items-center text-xs font-semibold whitespace-nowrap"><span className="mr-2" role="img" aria-label="peligro">&#x26A0;&#xFE0F;</span>IA-ismo Newsletter <span className="mx-1">|</span> <span className="ml-1">Jugar Simulador Gestión Eléctrica - LightIn <span className='text-[10px] font-normal'>(+8 años)</span></span></span>
      <span className="text-xs font-light tracking-wide ml-2 whitespace-nowrap">www.iaismo.com</span>
    </div>
  );
};

export default GameHeader;