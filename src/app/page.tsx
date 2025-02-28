'use client';

import { ErrorBoundary } from '@/components/templates/ErrorBoundary';
import { NotesContainer } from '@/components/organisms/NotesContainer';
import { Header } from '@/components/organisms/Header';
import { useNotes } from '@/hooks/useNotes';
import { FloatingButtons } from '@/components/molecules/FloatingButtons';
import { useState, useCallback, useEffect } from 'react';

/**
 * Main page component that serves as the application entry point
 * Wrapped with ErrorBoundary for error handling
 */
export default function Home() {
  const { createNote } = useNotes();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  /**
   * Initialize theme from user preference
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const initialTheme = isDarkMode ? 'dark' : (savedTheme || (systemPrefersDark ? 'dark' : 'light'));
    setCurrentTheme(initialTheme as 'light' | 'dark');
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  /**
   * Handles theme toggle between light and dark modes
   */
  const handleThemeToggle = useCallback(() => {
    setCurrentTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  return (
    <ErrorBoundary>
      <main className="relative flex min-h-screen flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden">
        <Header onFilterChange={setCategoryFilter} />
        
        <div className="flex-1 p-8 relative">
          <NotesContainer
            onAddNote={createNote}
            categoryFilter={categoryFilter}
          />
        </div>

        <FloatingButtons
          onAdd={createNote}
          theme={currentTheme}
          onThemeToggle={handleThemeToggle}
          selectedCategoryId={categoryFilter}
        />
      </main>
    </ErrorBoundary>
  );
}