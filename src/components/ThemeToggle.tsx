import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'light' ? false : true // Default to dark
  })

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [enabled])

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setEnabled((prev) => !prev)}
      className="inline-flex items-center justify-center rounded-full p-2.5 text-slate-800 dark:text-slate-100 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900"
    >
      {!enabled ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-400" />
      )}
    </button>
  )
}
