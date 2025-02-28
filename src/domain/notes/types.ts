/**
 * Represents the position of a note on the screen
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Represents the styling options for a note
 */
export interface NoteStyle {
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  fontWeight: 'normal' | 'bold' | 'light';
  fontStyle: 'normal' | 'italic';
}

/**
 * Represents a note in the application
 */
export interface Note {
  /**
   * Unique identifier for the note
   */
  id: string;
  /**
   * Title of the note
   */
  title?: string;
  /**
   * Content of the note
   */
  content: string;
  /**
   * Position of the note on the screen
   */
  position: Position;
  /**
   * Background color of the note
   */
  color: string;
  /**
   * Category of the note
   */
  categoryId?: string;
  /**
   * Style options for the note
   */
  style: NoteStyle;
  /**
   * Creation timestamp
   */
  createdAt: Date;
  /**
   * Last update timestamp
   */
  updatedAt: Date;
}

/**
 * Represents the input for creating a new note
 */
export type CreateNoteInput = Omit<Note, 'id'>;

/**
 * Represents the input for updating an existing note
 */
export type UpdateNoteInput = Partial<Note> & Pick<Note, 'id'>;

/**
 * Represents a category of note
 */
export interface Category {
  id: string;
  name: string;
  color: string;
} 