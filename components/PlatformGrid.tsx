
import React from 'react';
import { SocialPlatform } from '../types';

interface PlatformGridProps {
  platforms: SocialPlatform[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const PlatformGrid: React.FC<PlatformGridProps> = ({ platforms, selectedIds, onToggle }) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {platforms.map((platform) => {
        const isSelected = selectedIds.includes(platform.id);
        return (
          <div
            key={platform.id}
            onClick={() => onToggle(platform.id)}
            className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer border transition-all duration-300 ${
              isSelected 
                ? 'border-indigo-600 bg-indigo-50/70 shadow-sm' 
                : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'
            }`}>
              <i className={`${platform.icon} text-lg`}></i>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className={`text-xs font-black truncate ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                  {platform.name}
                </h4>
                <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">
                  {platform.aspectRatio}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium truncate">{platform.type} • {platform.dimensions}</p>
            </div>
            {isSelected && (
              <div className="text-indigo-600 animate-in zoom-in duration-300">
                <i className="fa-solid fa-circle-check"></i>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
