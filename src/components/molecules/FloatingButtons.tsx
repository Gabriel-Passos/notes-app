import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { AddNoteForm } from './AddNoteForm';
import type { CreateNoteInput } from '@/domain/notes/types';

interface FloatingButtonsProps {
  onAdd: (note: CreateNoteInput) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  selectedCategoryId?: string | null;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  onAdd,
  theme,
  onThemeToggle,
  selectedCategoryId
}) => {
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={position}
      onStop={handleDragStop}
      bounds="parent"
      handle=".handle"
      positionOffset={{ x: 0, y: 0 }}
      grid={[1, 1]}
      scale={1}
    >
      <div 
        ref={nodeRef}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 select-none touch-none"
        style={{ 
          zIndex: 50,
          transform: 'translate(0,0)',
          willChange: 'transform'
        }}
      >
        <div className="handle p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 cursor-grab"
          style={{ transition: 'box-shadow 200ms ease-out' }}
        >
          <AddNoteForm
            onAdd={onAdd}
            theme={theme}
            onThemeToggle={onThemeToggle}
            onPreview={() => {}}
            onCancelPreview={() => {}}
            selectedCategoryId={selectedCategoryId}
          />
        </div>
      </div>
    </Draggable>
  );
}; 