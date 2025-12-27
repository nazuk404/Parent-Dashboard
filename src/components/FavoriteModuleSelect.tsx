import * as Select from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../lib/utils'

export const modules = [
  { id: 'color-mixing', label: 'Color Mixing' },
  { id: 'first-aid', label: 'First Aid Sequencing' },
  { id: 'story-ordering', label: 'Story Ordering' },
] as const

export type ModuleId = typeof modules[number]['id']

export const getModuleLabel = (id: ModuleId | string): string => {
  const found = modules.find(m => m.id === id)
  return found ? found.label : String(id)
}

interface FavoriteModuleSelectProps {
  value: ModuleId | string
  onChange: (value: ModuleId) => void
  className?: string
}

export function FavoriteModuleSelect({ value, onChange, className }: FavoriteModuleSelectProps) {
  return (
    <Select.Root value={String(value)} onValueChange={(v) => onChange(v as ModuleId)}>
      <Select.Trigger
        className={cn(
          'w-full rounded-xl border border-emerald-500/60 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 flex items-center justify-between outline-none',
          'data-[placeholder]:text-slate-400',
          'focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400',
          className,
        )}
        aria-label="Favorite module"
      >
        <Select.Value placeholder="Choose module" />
        <Select.Icon>
          <ChevronDown size={16} className="text-slate-400" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className={cn(
            'z-50 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-100 shadow-2xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
            'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
          )}
        >
          <Select.ScrollUpButton className="flex h-6 items-center justify-center text-slate-400" />
          <Select.Viewport className="p-1">
            {modules.map((m) => (
              <Select.Item
                key={m.id}
                value={m.id}
                className={cn(
                  'flex cursor-pointer items-center rounded-lg px-3 py-2 outline-none',
                  'text-slate-200 hover:bg-slate-800 focus:bg-slate-800',
                  'data-[disabled]:opacity-50 data-[highlighted]:bg-slate-800',
                )}
              >
                <Select.ItemText>{m.label}</Select.ItemText>
                <Select.ItemIndicator className="ml-auto">
                  <Check size={14} className="text-emerald-400" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-6 items-center justify-center text-slate-400" />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
