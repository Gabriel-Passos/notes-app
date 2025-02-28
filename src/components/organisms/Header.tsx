import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { useCategoryStore } from '@/domain/notes/categoryStore';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onFilterChange: (categoryId: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({ onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = useCategoryStore((state) => state.categories);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onFilterChange(categoryId);
    setIsFilterOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex h-16 items-center justify-between px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notes App
        </h1>
        
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
              selectedCategory && "ring-2 ring-blue-500"
            )}
          >
            <FunnelIcon className="h-4 w-4" />
            <span>
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : "Todas as categorias"}
            </span>
          </button>

          {isFilterOpen && (
            <>
              <div 
                className="fixed inset-0" 
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={cn(
                      "flex w-full items-center px-3 py-2 rounded-md text-sm",
                      "hover:bg-gray-100 dark:hover:bg-gray-700",
                      !selectedCategory && "bg-gray-100 dark:bg-gray-700"
                    )}
                  >
                    Todas as categorias
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 rounded-md text-sm",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        selectedCategory === category.id && "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}; 