'use client'

import { useEffect } from 'react'

export function useKeyboardShortcuts({
	onWorkMode,
	onRestMode,
	onReset,
	onPause,
	status,
}: {
	onWorkMode: () => void
	onRestMode: () => void
	onReset: () => void
	onPause: () => void
	status: string
}) {
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				return
			}

			switch (e.key.toLowerCase()) {
				case 'w':
					onWorkMode()
					break
				case 'r':
					if (e.shiftKey) {
						onReset()
					} else {
						onRestMode()
					}
					break
				case 'p':
				case ' ':
					e.preventDefault()
					onPause()
					break
			}
		}

		window.addEventListener('keydown', handleKeyPress)

		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [status, onWorkMode, onRestMode, onReset, onPause])
}
