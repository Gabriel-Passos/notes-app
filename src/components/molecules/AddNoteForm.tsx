import { useState, useCallback, useEffect } from 'react';
import { TextInput } from '../atoms/TextInput';
import { Button } from '../atoms/Button';
import type { CreateNoteInput, Note } from '@/domain/notes/types';
import { PlusIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { CategoryPicker } from '../atoms/CategoryPicker';
import { useCategoryStore } from '@/domain/notes/categoryStore';

/**
 * Props for the AddNoteForm component
 */
interface AddNoteFormProps {
  /**
   * Callback when a new note is created
   */
  onAdd: (input: CreateNoteInput) => void;
  onPreview: (note: Omit<Note, 'id'>) => void;
  onCancelPreview: () => void;
  /**
   * Current theme mode
   */
  theme: 'light' | 'dark';
  /**
   * Callback when theme is toggled
   */
  onThemeToggle: () => void;
  selectedCategoryId?: string | null;
}

/**
 * Form component for creating new notes
 */
export const AddNoteForm: React.FC<AddNoteFormProps> = ({ onAdd, onPreview, onCancelPreview, theme, onThemeToggle, selectedCategoryId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Obtém as categorias e a categoria padrão (primeira da lista)
  const categories = useCategoryStore((state) => state.categories);
  const defaultCategory = categories[0];

  const [categoryId, setCategoryId] = useState<string>(
    selectedCategoryId || defaultCategory?.id || ''
  );

  // Define a cor inicial baseada na categoria padrão
  const [backgroundColor, setBackgroundColor] = useState(defaultCategory?.color || '#fef3c7');

  // Atualiza a cor quando a categoria muda
  const handleCategoryChange = (newCategoryId: string) => {
    const category = categories.find(c => c.id === newCategoryId);
    if (category) {
      setCategoryId(newCategoryId);
      setBackgroundColor(category.color);
      
      // Atualiza o preview com a nova categoria
      if (content || title) {
        updatePreview(content, title, category.color, newCategoryId);
      }
    }
  };

  // Função auxiliar para atualizar o preview
  const updatePreview = (
    previewContent: string,
    previewTitle: string,
    color: string,
    catId: string | undefined
  ) => {
    if (isExpanded && (previewContent || previewTitle)) {
      onPreview({
        title: previewTitle,
        content: previewContent,
        position: { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 100 },
        color: color,
        categoryId: catId,
        style: {
          backgroundColor: color,
          textColor: '#1f2937',
          fontSize: '1rem',
          fontWeight: 'normal',
          fontStyle: 'normal',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      onCancelPreview();
    }
  };

  // Atualiza o preview quando o conteúdo muda
  useEffect(() => {
    updatePreview(content, title, backgroundColor, categoryId);
  }, [content, title, backgroundColor, categoryId, isExpanded]);

  // Atualiza o preview quando selectedCategoryId muda
  useEffect(() => {
    if (selectedCategoryId) {
      setCategoryId(selectedCategoryId);
      const category = categories.find(c => c.id === selectedCategoryId);
      if (category) {
        setBackgroundColor(category.color);
      }
    }
  }, [selectedCategoryId, categories]);

  // Manipula o envio do formulário
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim()) return;

      onAdd({
        title: title.trim() || 'Untitled',
        content: content.trim(),
        position: { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 100 },
        color: backgroundColor,
        categoryId: categoryId || defaultCategory?.id, // Use o categoryId atual ou o padrão
        style: {
          backgroundColor,
          textColor: '#1f2937',
          fontSize: '1rem',
          fontWeight: 'normal',
          fontStyle: 'normal',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setTitle('');
      setContent('');
      setCategoryId(selectedCategoryId || defaultCategory?.id || ''); // Reseta para a categoria selecionada ou padrão
      setBackgroundColor(defaultCategory?.color || '#fef3c7');
      setIsExpanded(false);
    },
    [content, title, backgroundColor, categoryId, defaultCategory, onAdd, selectedCategoryId]
  );

  if (!isExpanded) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="primary"
          size="md"
          className="scale-transition flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Note
        </Button>
        <Button
          onClick={onThemeToggle}
          variant="secondary"
          size="md"
          className="scale-transition"
        >
          {theme === 'light' ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4">
      <div className="space-y-4 rounded-lg bg-white/50 p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/50">
        <div className="flex items-center gap-4">
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="ring-offset-transparent text-base flex-1"
          />
          <div className="flex flex-col justify-end h-full">
            <CategoryPicker
              label="Category"
              value={categoryId || defaultCategory?.id}
              onChange={handleCategoryChange}
            />
          </div>
        </div>
        
        <TextInput
          label="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your note here..."
          className="ring-offset-transparent text-base"
          multiline
          rows={10}
          autoFocus
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="primary" disabled={!content.trim()}>
            Save Note
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setIsExpanded(false);
              setTitle('');
              setContent('');
              setCategoryId('');
              setBackgroundColor(defaultCategory?.color || '#fef3c7');
              onCancelPreview();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}; 