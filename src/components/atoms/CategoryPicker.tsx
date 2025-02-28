import { useCallback, useState } from 'react';
import { TagIcon } from '@heroicons/react/24/outline';
import { useCategoryStore } from '@/domain/notes/categoryStore';
import { cn } from '@/lib/utils';
import type { Category } from '@/domain/notes/types';

interface CategoryPickerProps {
  /**
   * ID da categoria selecionada
   */
  value?: string;
  /**
   * Label for the picker
   */
  label?: string;
  /**
   * Callback quando uma categoria é selecionada
   */
  onChange: (categoryId: string) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = useCategoryStore((state) => state.categories);
  const selectedCategory = categories.find(cat => cat.id === value);

  console.log(value);
  console.log(selectedCategory);

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      onChange(categoryId);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div className="relative flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        {selectedCategory ? (
          <>
            <div 
              className="w-4 h-4 rounded-full ring-2 ring-gray-300 dark:ring-gray-600"
              style={{ backgroundColor: selectedCategory.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">
              {selectedCategory.name}
            </span>
          </>
        ) : (
          <>
            <TagIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              Selecionar Categoria
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <div className="space-y-1 min-w-[200px]">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    value === category.id && "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <div 
                    className="w-4 h-4 rounded-full mr-3 ring-2 ring-gray-300 dark:ring-gray-600"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

CategoryPicker.displayName = 'CategoryPicker'; 