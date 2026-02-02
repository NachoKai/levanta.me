'use client'

import { useEffect, useRef } from 'react'
import { useWorkTimerStore } from '@/lib/store'

export function useNotificationReminders({
	workTime,
	restTime,
	workDuration,
	restDuration,
	mode,
	status,
	timerInterval,
	waterInterval,
	sendNotification,
}: {
	workTime: number
	restTime: number
	workDuration: number
	restDuration: number
	mode: 'work' | 'rest'
	status: string
	timerInterval: number
	waterInterval: number
	sendNotification: (title: string, message: string) => void
}) {
	const timerReminderRef = useRef<NodeJS.Timeout | null>(null)
	const waterReminderRef = useRef<NodeJS.Timeout | null>(null)
	const isNaggingRef = useRef<boolean>(false)
	const workCompletedRef = useRef<boolean>(false)
	const restCompletedRef = useRef<boolean>(false)

	// Completion notifications effect
	useEffect(() => {
		// Work completion notification
		if (
			workDuration > 0 &&
			workTime >= workDuration * 60 &&
			!workCompletedRef.current &&
			mode === 'work' &&
			status === 'working'
		) {
			workCompletedRef.current = true
			sendNotification(
				'Work time finished! ☕',
				`You've completed ${workDuration} minutes of work. Click Rest when you're ready for a break.`
			)
		} else if (workTime < workDuration * 60 || mode !== 'work') {
			workCompletedRef.current = false
		}

		// Rest completion notification
		if (
			restDuration > 0 &&
			restTime >= restDuration * 60 &&
			!restCompletedRef.current &&
			mode === 'rest' &&
			status === 'resting'
		) {
			restCompletedRef.current = true
			sendNotification(
				'Rest time finished! ⏰',
				`You've rested for ${restDuration} minutes. Click Work when you're ready to resume.`
			)
		} else if (restTime < restDuration * 60 || mode !== 'rest') {
			restCompletedRef.current = false
		}
	}, [workTime, restTime, workDuration, restDuration, mode, status, sendNotification])

	// Timer reminder effect
	useEffect(() => {
		const shouldNagWorkToRest =
			workDuration > 0 &&
			workTime >= workDuration * 60 &&
			mode === 'work' &&
			status === 'working' &&
			timerInterval > 0
		const shouldNagRestToWork =
			restDuration > 0 &&
			restTime >= restDuration * 60 &&
			mode === 'rest' &&
			status === 'resting' &&
			timerInterval > 0
		const shouldNag = shouldNagWorkToRest || shouldNagRestToWork

		if (shouldNag && !isNaggingRef.current) {
			isNaggingRef.current = true
			timerReminderRef.current = setInterval(() => {
				const currentState = useWorkTimerStore.getState()

				if (currentState.status === 'idle') return

				const overtimeMinutes =
					currentState.mode === 'work'
						? Math.floor((currentState.workTime - currentState.workDuration * 60) / 60)
						: Math.floor((currentState.restTime - currentState.restDuration * 60) / 60)

				if (
					currentState.mode === 'work' &&
					currentState.workTime >= currentState.workDuration * 60 &&
					currentState.status === 'working'
				) {
					sendNotification(
						'Still working? ⏰',
						`You should take a break! Your work time finished ${overtimeMinutes} minutes ago. ☕`
					)
				} else if (
					currentState.mode === 'rest' &&
					currentState.restTime >= currentState.restDuration * 60 &&
					currentState.status === 'resting'
				) {
					sendNotification(
						'Still resting? ☕',
						`Time to get back to work! Your rest time finished ${overtimeMinutes} minutes ago. ⏰`
					)
				}
			}, timerInterval * 60 * 1000)
		}

		if (!shouldNag && isNaggingRef.current) {
			isNaggingRef.current = false
			if (timerReminderRef.current) {
				clearInterval(timerReminderRef.current)
				timerReminderRef.current = null
			}
		}
	}, [
		workTime,
		restTime,
		workDuration,
		restDuration,
		mode,
		status,
		timerInterval,
		sendNotification,
	])

	// Water reminder effect
	useEffect(() => {
		if (waterReminderRef.current) {
			clearInterval(waterReminderRef.current)
		}

		if (waterInterval > 0 && status !== 'idle') {
			waterReminderRef.current = setInterval(() => {
				sendNotification('💦 Water Reminder', 'Time to drink some water! 💧')
			}, waterInterval * 60 * 1000)
		}

		return () => {
			if (waterReminderRef.current) {
				clearInterval(waterReminderRef.current)
			}
		}
	}, [waterInterval, status, sendNotification])

	const clearTimerReminder = () => {
		if (timerReminderRef.current) {
			clearInterval(timerReminderRef.current)
			timerReminderRef.current = null
		}
		isNaggingRef.current = false
	}

	return { clearTimerReminder }
}
