import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatTime(seconds: number) {
	const h = Math.floor(seconds / 3600)
	const remaining = seconds % 3600
	const m = Math.floor(remaining / 60)
	const s = remaining % 60

	return `${h}h ${m}m ${s}s`
}
