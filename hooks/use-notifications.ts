'use client'

import { useCallback } from 'react'
import { useWorkTimerStore } from '@/lib/store'

export function useNotifications() {
	const {
		telegramToken,
		telegramChatId,
		useBrowserNotifications,
		useTelegramNotifications,
	} = useWorkTimerStore()

	const sendBrowserNotification = useCallback(
		(title: string, body: string) => {
			if (!useBrowserNotifications) {
				return
			}

			try {
				if ('Notification' in window) {
					if (Notification.permission === 'granted') {
						new Notification(title, { body })
					} else if (Notification.permission !== 'denied') {
						Notification.requestPermission()
							.then(permission => {
								if (permission === 'granted') {
									new Notification(title, { body })
								}
							})
							.catch(err => {
								console.warn('Notification permission request failed:', err)
							})
					}
				}
			} catch (err) {
				console.warn('Browser notification failed:', err)
			}
		},
		[useBrowserNotifications]
	)

	const sendTelegramNotification = useCallback(
		async (title: string, body: string) => {
			if (!useTelegramNotifications) return
			if (!telegramToken || !telegramChatId) return

			try {
				const message = `*${title}*\n${body}`
				const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`

				await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						chat_id: telegramChatId,
						text: message,
						parse_mode: 'Markdown',
					}),
				})
			} catch (err) {
				console.error('Telegram notification error:', err)
			}
		},
		[telegramToken, telegramChatId, useTelegramNotifications]
	)

	const sendNotification = useCallback(
		(title: string, body: string) => {
			try {
				sendBrowserNotification(title, body)
				sendTelegramNotification(title, body)
			} catch (err) {
				console.warn('Notification sending failed:', err)
			}
		},
		[sendBrowserNotification, sendTelegramNotification]
	)

	return {
		sendNotification,
		sendBrowserNotification,
		sendTelegramNotification,
	}
}
