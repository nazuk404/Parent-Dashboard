import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import './index.css'
import App from './App.tsx'

// Initialize dark mode by default
const theme = localStorage.getItem('theme') || 'dark'
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipPrimitive.Provider>
        <App />
      </TooltipPrimitive.Provider>
    </QueryClientProvider>
  </StrictMode>,
)
