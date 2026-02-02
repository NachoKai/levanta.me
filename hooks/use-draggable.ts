import { useCallback, useEffect, useState } from 'react'

interface UseDraggableProps {
	initialPosition: { x: number; y: number }
	elementWidth: number
	elementHeight: number
}

export function useDraggable({
	initialPosition,
	elementWidth,
	elementHeight,
}: UseDraggableProps) {
	const [position, setPosition] = useState(initialPosition)
	const [isDragging, setIsDragging] = useState(false)

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		setIsDragging(true)
		e.preventDefault()
	}, [])

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		setIsDragging(true)
		e.preventDefault()
	}, [])

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return

			const newX = e.clientX - elementWidth / 2
			const newY = e.clientY - elementHeight / 2
			const maxX = window.innerWidth - elementWidth
			const maxY = window.innerHeight - elementHeight

			setPosition({
				x: Math.max(0, Math.min(newX, maxX)),
				y: Math.max(0, Math.min(newY, maxY)),
			})
		},
		[isDragging, elementWidth, elementHeight]
	)

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (!isDragging) return

			e.preventDefault()
			e.stopPropagation()

			const touch = e.touches[0]
			const newX = touch.clientX - elementWidth / 2
			const newY = touch.clientY - elementHeight / 2
			const maxX = window.innerWidth - elementWidth
			const maxY = window.innerHeight - elementHeight

			setPosition({
				x: Math.max(0, Math.min(newX, maxX)),
				y: Math.max(0, Math.min(newY, maxY)),
			})
		},
		[isDragging, elementWidth, elementHeight]
	)

	const handleMouseUp = useCallback(() => {
		setIsDragging(false)
	}, [])

	const handleTouchEnd = useCallback(() => {
		setIsDragging(false)
	}, [])

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
			document.addEventListener('touchmove', handleTouchMove, { passive: false })
			document.addEventListener('touchend', handleTouchEnd)

			return () => {
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
				document.removeEventListener('touchmove', handleTouchMove)
				document.removeEventListener('touchend', handleTouchEnd)
			}
		}
	}, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

	return {
		position,
		isDragging,
		handleMouseDown,
		handleTouchStart,
	}
}
