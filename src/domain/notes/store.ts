import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note, CreateNoteInput, UpdateNoteInput } from './types';

/**
 * Interface defining the shape of our notes store
 */
interface NotesStore {
  notes: Note[];
  addNote: (input: CreateNoteInput) => void;
  updateNote: (input: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

/**
 * Default style for new notes
 */
const DEFAULT_NOTE_STYLE = {
  backgroundColor: '#fef3c7', // Light yellow
  textColor: '#1f2937', // Gray-800
  fontSize: '1rem',
  fontWeight: 'normal' as const,
  fontStyle: 'normal' as const,
};

/**
 * Creates and manages the notes store with persistence
 * Handles proper date serialization/deserialization
 */
export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: [],

      /**
       * Adds a new note to the store
       * @param input - The note creation input
       */
      addNote: (input: CreateNoteInput) => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: input.title || 'Untitled',
          content: input.content,
          categoryId: input.categoryId,
          position: input.position || { x: 0, y: 0 },
          style: { ...DEFAULT_NOTE_STYLE, ...input.style },
          color: input.color || DEFAULT_NOTE_STYLE.backgroundColor,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          notes: [...state.notes, newNote],
        }));
      },

      /**
       * Updates an existing note in the store
       * @param input - The note update input
       */
      updateNote: (input: UpdateNoteInput) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === input.id
              ? {
                  ...note,
                  ...input,
                  style: input.style
                    ? { ...note.style, ...input.style }
                    : note.style,
                  updatedAt: new Date(),
                }
              : note
          ),
        }));
      },

      /**
       * Deletes a note from the store
       * @param id - The ID of the note to delete
       */
      deleteNote: (id: string) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      /**
       * Retrieves a note by its ID
       * @param id - The ID of the note to retrieve
       * @returns The note if found, undefined otherwise
       */
      getNoteById: (id: string) => {
        return get().notes.find((note) => note.id === id);
      },
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return JSON.stringify({
            state: {
              notes: (parsed.state?.notes || []).map((note: any) => ({
                ...note,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt),
              })),
            },
          });
        },
        setItem: (name: string, value: unknown) => {
          const state = value as { state: { notes: Note[] } };
          const serialized = JSON.stringify({
            state: {
              notes: (state.state?.notes || []).map((note) => ({
                ...note,
                createdAt: note.createdAt.toISOString(),
                updatedAt: note.updatedAt.toISOString(),
              })),
            },
          });
          localStorage.setItem(name, serialized);
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      })),
      partialize: (state) => ({ notes: state.notes }),
    }
  )
); 