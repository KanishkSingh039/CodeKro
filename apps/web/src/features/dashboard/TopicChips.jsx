import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TagChip from '../../components/ui/TagChip';

const TOPICS = [
  { id: 'all', label: 'All Topics' },
  { id: 'Array', label: 'Arrays' },
  { id: 'String', label: 'Strings' },
  { id: 'Hash Table', label: 'Hash Table' },
  { id: 'Dynamic Programming', label: 'Dynamic Programming' },
  { id: 'Two Pointers', label: 'Two Pointers' },
  { id: 'Binary Search', label: 'Binary Search' },
  { id: 'Tree', label: 'Trees' },
  { id: 'Depth-First Search', label: 'DFS' },
  { id: 'Breadth-First Search', label: 'BFS' },
  { id: 'Linked List', label: 'Linked List' },
  { id: 'Graph', label: 'Graphs' },
  { id: 'Heap (Priority Queue)', label: 'Heap' },
  { id: 'Sorting', label: 'Sorting' },
  { id: 'Greedy', label: 'Greedy' },
  { id: 'Stack', label: 'Stack' },
  { id: 'Design', label: 'Design' },
];

/**
 * TopicChips Component
 * Neutral pill selector row for algorithm topics with green border when active.
 */
export default function TopicChips({
  selectedTag = 'all',
  onSelectTag,
}) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center group py-1">
      {/* Scroll Left Button */}
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Scroll topics left"
        className="hidden md:flex absolute -left-2 z-10 w-6 h-6 items-center justify-center rounded-full bg-bg-surface border border-border-default text-text-muted hover:text-text-primary shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Topics Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {TOPICS.map((topic) => {
          const isSelected = selectedTag.toLowerCase() === topic.id.toLowerCase();
          return (
            <TagChip
              key={topic.id}
              label={topic.label}
              selected={isSelected}
              onClick={() => onSelectTag(isSelected && topic.id !== 'all' ? 'all' : topic.id)}
              size="md"
            />
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Scroll topics right"
        className="hidden md:flex absolute -right-2 z-10 w-6 h-6 items-center justify-center rounded-full bg-bg-surface border border-border-default text-text-muted hover:text-text-primary shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
