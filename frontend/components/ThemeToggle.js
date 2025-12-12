import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 neo-card bg-neo-yellow text-neo-black hover:bg-yellow-400 border-2 border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-full flex items-center justify-center shadow-neo"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-6 w-6" />
      ) : (
        <SunIcon className="h-6 w-6" />
      )}
    </button>
  );
}
