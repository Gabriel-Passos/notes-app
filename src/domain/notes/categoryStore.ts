import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from './types';

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Trabalho', color: '#fef3c7' },
  { id: '2', name: 'Pessoal', color: '#dbeafe' },
  { id: '3', name: 'Ideias', color: '#dcfce7' },
  { id: '4', name: 'Importante', color: '#fee2e2' },
];

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (categoryData) => {
        const newCategory: Category = {
          id: crypto.randomUUID(),
          ...categoryData,
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...data } : category
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      getCategory: (id) => {
        return get().categories.find((category) => category.id === id);
      },
    }),
    {
      name: 'categories-storage',
    }
  )
); 