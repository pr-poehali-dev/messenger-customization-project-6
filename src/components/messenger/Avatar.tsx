import React from 'react';

interface AvatarProps {
  initials: string;
  color: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

const sizeMap = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const dotSizeMap = {
  xs: 'w-2 h-2 -right-0.5 -bottom-0.5',
  sm: 'w-2.5 h-2.5 right-0 bottom-0',
  md: 'w-3 h-3 right-0 bottom-0',
  lg: 'w-3.5 h-3.5 right-0.5 bottom-0.5',
  xl: 'w-4 h-4 right-1 bottom-1',
};

export default function Avatar({ initials, color, size = 'md', online, className = '' }: AvatarProps) {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-white select-none`}
        style={{ background: `linear-gradient(135deg, ${color}cc, ${color}88)`, border: `1.5px solid ${color}44` }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <div
          className={`absolute ${dotSizeMap[size]} rounded-full border-2 border-[hsl(var(--background))] ${online ? 'bg-green-400' : 'bg-gray-600'}`}
        />
      )}
    </div>
  );
}
