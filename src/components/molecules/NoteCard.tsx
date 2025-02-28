import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Note } from '@/domain/notes/types';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/domain/notes/categoryStore';
import { CategoryPicker } from '../atoms/CategoryPicker';

/**
 * Props for the NoteCard component
 */
interface NoteCardProps {
  /**
   * The note data to display
   */
  note: Note;
  /**
   * Callback when note is updated
   */
  onUpdate: (note: Note) => void;
  /**
   * Callback when note is deleted
   */
  onDelete: (id: string) => void;
  isPreview?: boolean;
}

/**
 * A draggable note card component that displays note content and allows editing
 */
export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onUpdate,
  onDelete,
  isPreview = false,
}) => {
  const nodeRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categories = useCategoryStore((state) => state.categories);
  const currentCategory = useCategoryStore((state) => 
    state.getCategory(note.categoryId || '')
  );

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    onUpdate({
      ...note,
      position: { x: data.x, y: data.y }
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      onUpdate({
        ...note,
        categoryId,
        color: category.color
      });
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={note.position}
      onStop={handleDragStop}
      bounds="parent"
      handle=".handle"
      positionOffset={{ x: 0, y: 0 }}
      grid={[1, 1]}
      scale={1}
    >
      <div
        ref={nodeRef}
        className={cn(
          "absolute flex min-h-[100px] min-w-[200px] max-w-[400px] flex-col gap-2 rounded-lg border border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm",
          isPreview && "ring-2 ring-blue-500 ring-offset-2"
        )}
        style={{ 
          backgroundColor: note.color,
          width: 'fit-content',
          height: 'fit-content',
          transform: 'translate(0,0)',
          transition: 'box-shadow 200ms ease-out',
          willChange: 'transform'
        }}
      >
        <div className="handle flex items-center justify-between gap-4 cursor-grab touch-none select-none">
          <div className="flex items-center gap-2 flex-1">
            <div className="bg-transparent text-lg font-medium text-gray-800 focus:outline-none cursor-text">
              {note.title}
            </div>
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-700 dark:text-gray-700" />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-64 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Categoria
                    </p>
                    <CategoryPicker
                      value={note.categoryId}
                      onChange={handleCategoryChange}
                    />
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => onDelete(note.id)}
                    className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-500 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete Note
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="min-h-[100px] bg-transparent text-base text-gray-900 mt-2 cursor-text">
          {note.content}
        </div>
        <div className='handle w-full flex flex-1 flex-col items-center mt-6 cursor-grab'>
          <div className="w-[32px] border-t-2 rounded-full border-gray-700/25" />
          <div className="w-[24px] border-t-2 rounded-full border-gray-700/25 mt-1" />
        </div>
      </div>
    </Draggable>
  );
}; 