import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the TextInput component
 */
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  /**
   * Label for the input field
   */
  label?: string;
  /**
   * Error message to display
   */
  error?: string;
  multiline?: boolean;
  rows?: number;
}

/**
 * A reusable text input component with consistent styling
 */
export const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(
  ({ label, error, className = '', multiline, rows = 3, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              className={cn(
                "w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-all",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 dark:placeholder-gray-400",
                "disabled:cursor-not-allowed disabled:opacity-50", "resize-none",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                className
              )}
              {...props}
              
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={cn(
                "w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-all",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 dark:placeholder-gray-400",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                className
              )}
              {...props}
            />
          )}
          {error && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
