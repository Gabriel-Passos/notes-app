import { useCallback } from 'react';
import { useNotesStore } from '@/domain/notes/store';
import type { CreateNoteInput, UpdateNoteInput, Note } from '@/domain/notes/types';

/**
 * Custom hook for managing notes operations
 * @returns Object containing notes and note operations
 */
export const useNotes = () => {
  const { notes, addNote, updateNote, deleteNote, getNoteById } = useNotesStore();

  /**
   * Creates a new note
   * @param input - Note creation input
   */
  const createNote = useCallback((input: CreateNoteInput) => {
    addNote(input);
  }, [addNote]);

  /**
   * Updates an existing note
   * @param input - Note update input
   */
  const editNote = useCallback((input: UpdateNoteInput) => {
    updateNote(input);
  }, [updateNote]);

  /**
   * Removes a note
   * @param id - ID of the note to remove
   */
  const removeNote = useCallback((id: string) => {
    deleteNote(id);
  }, [deleteNote]);

  /**
   * Gets a note by its ID
   * @param id - ID of the note to retrieve
   * @returns The note if found, undefined otherwise
   */
  const getNote = useCallback((id: string): Note | undefined => {
    return getNoteById(id);
  }, [getNoteById]);

  return {
    notes,
    createNote,
    editNote,
    removeNote,
    getNote,
  };
}; 