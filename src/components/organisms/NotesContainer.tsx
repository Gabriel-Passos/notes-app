import { useRef, useEffect, useState } from 'react';
import { NoteCard } from '../molecules/NoteCard';
import { useNotes } from '@/hooks/useNotes';
import type { CreateNoteInput, Note } from '@/domain/notes/types';

/**
 * Props for the NotesContainer component
 */
interface NotesContainerProps {
  /**
   * Callback when a new note is created
   */
  onAddNote: (input: CreateNoteInput) => void;
  categoryFilter: string | null;
}

/**
 * Container component that manages the display and interaction of all notes
 * Provides a horizontally scrollable area where notes can be placed
 */
export const NotesContainer: React.FC<NotesContainerProps> = ({ 
  onAddNote,
  categoryFilter 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { notes, editNote, removeNote } = useNotes();
  const [containerWidth, setContainerWidth] = useState('100%');

  // Filtra as notas baseado na categoria selecionada
  const filteredNotes = categoryFilter
    ? notes.filter(note => note.categoryId === categoryFilter)
    : notes;

  // Calcula a largura necessária baseada nas posições das notas
  useEffect(() => {
    if (!filteredNotes.length) {
      setContainerWidth('100%');
      return;
    }

    const maxX = Math.max(...filteredNotes.map(note => (note.position?.x || 0) + 320));
    const viewportWidth = window.innerWidth;
    
    setContainerWidth(maxX > viewportWidth ? `${maxX + 100}px` : '100%');
  }, [filteredNotes]);

  return (
    <div 
      className="relative w-full h-[calc(100vh-10rem)] overflow-x-auto overflow-y-hidden"
      style={{
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div
        ref={containerRef}
        className="relative h-full bg-gradient-to-br from-gray-50 to-white transition-colors dark:from-gray-900 dark:to-gray-800"
        style={{ width: containerWidth }}
      >
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onUpdate={editNote}
            onDelete={removeNote}
          />
        ))}
      </div>
    </div>
  );
}; 