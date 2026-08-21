import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md'
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-[#002869]';
  const houseColor = isLight ? '#FFFFFF' : '#002869';
  const arrowColor = '#FF6B35';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon SVG mirroring exact Image 3 mark */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* House Outline */}
          <path
            d="M20 50L45 28C47.5 25.8 51.5 25.8 54 28L78 48C80 49.8 81 52.4 80.6 55L78 72C77.4 76.4 73.6 80 69.2 80H26C21.6 80 18 76.4 18 72V52C18 51.2 18.3 50.5 18.8 50Z"
            stroke={houseColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Chimney / Roof accent */}
          <path
            d="M22 40V24H32V31"
            stroke={houseColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Upward Growth Arrow */}
          <path
            d="M44 56L68 28"
            stroke={arrowColor}
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          <path
            d="M52 26H71V44"
            stroke={arrowColor}
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Accent dot above arrow */}
          <circle cx="75" cy="18" r="4.5" fill={arrowColor} />

          {/* Location Pin inside the House */}
          <path
            d="M48 42C40 42 35 47.5 35 55.5C35 65 48 78 48 78C48 78 61 65 61 55.5C61 47.5 56 42 48 42Z"
            stroke={houseColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isLight ? '#0B3D91' : '#FFFFFF'}
          />
          {/* Orange center dot of location pin */}
          <circle cx="48" cy="54" r="4" fill={arrowColor} />
        </svg>
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span className={`font-extrabold tracking-tight ${textSizes[size]} ${textColor} font-heading`}>
              Property<span className="text-[#FF6B35]">Lelo</span>
            </span>
          </div>
          <span className={`text-[10px] font-medium tracking-wider uppercase ${isLight ? 'text-blue-200/80' : 'text-slate-500'} mt-0.5`}>
            Marketplace India
          </span>
        </div>
      )}
    </div>
  );
};
