import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(inputs.filter(Boolean).join(' '))
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}
