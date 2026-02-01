'use client'

import { useEffect, useRef } from 'react'

export function useTimer({
	status,
	incrementWorkTime,
	incrementRestTime,
}: {
	status: string
	incrementWorkTime: (seconds: number) => void
	incrementRestTime: (seconds: number) => void
}) {
	const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const lastTickRef = useRef<number>(0)

	useEffect(() => {
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current)
		}

		if (status !== 'idle') {
			lastTickRef.current = Date.now()

			timerIntervalRef.current = setInterval(() => {
				const now = Date.now()
				const delta = now - lastTickRef.current

				if (delta >= 1000) {
					const secondsPassed = Math.floor(delta / 1000)

					if (status === 'working') {
						incrementWorkTime(secondsPassed)
					} else if (status === 'resting') {
						incrementRestTime(secondsPassed)
					}

					lastTickRef.current += secondsPassed * 1000
				}
			}, 100)
		}

		return () => {
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current)
			}
		}
	}, [status, incrementWorkTime, incrementRestTime])
}
