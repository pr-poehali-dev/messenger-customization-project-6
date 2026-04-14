import React from 'react';
import { stories } from '@/data/mockData';
import Icon from '@/components/ui/icon';

export default function StoriesBar() {
  return (
    <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {stories.map((story, i) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {story.id === '1' ? (
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${story.color}33, ${story.color}11)`,
                    border: `2px dashed ${story.color}66`
                  }}
                >
                  <span style={{ color: story.color }}>{story.initials}</span>
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--accent-green)' }}
                >
                  <Icon name="Plus" size={12} className="text-[hsl(var(--background))]" />
                </div>
              </div>
            ) : (
              <div
                className="w-14 h-14 rounded-full p-0.5"
                style={{
                  background: story.viewed
                    ? 'hsl(var(--border))'
                    : 'conic-gradient(#3ecf8e 0%, #0fa36a 40%, #22d3ee 70%, #3ecf8e 100%)'
                }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center font-semibold text-sm border-2 border-[hsl(var(--background))]"
                  style={{
                    background: `linear-gradient(135deg, ${story.color}cc, ${story.color}88)`,
                    color: 'white'
                  }}
                >
                  {story.initials}
                </div>
              </div>
            )}
            <span
              className="text-[10px] font-medium max-w-[56px] text-center leading-tight truncate"
              style={{ color: story.viewed ? 'var(--text-muted)' : 'var(--text-secondary)' }}
            >
              {story.id === '1' ? 'Добавить' : story.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
