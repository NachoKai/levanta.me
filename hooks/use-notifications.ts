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
			console.log('sendBrowserNotification called', { title, useBrowserNotifications })

			if (!useBrowserNotifications) {
				console.log('Browser notifications disabled')
				return
			}

			if ('Notification' in window) {
				console.log('Notification API available, permission:', Notification.permission)
				if (Notification.permission === 'granted') {
					console.log('Creating notification...')
					new Notification(title, { body, icon: '/icon.png' })
				} else if (Notification.permission !== 'denied') {
					console.log('Requesting notification permission...')
					Notification.requestPermission().then(permission => {
						console.log('Permission result:', permission)
						if (permission === 'granted') {
							new Notification(title, { body, icon: '/icon.png' })
						}
					})
				} else {
					console.log('Notifications denied by user')
				}
			} else {
				console.log('Notification API not available')
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
			sendBrowserNotification(title, body)
			sendTelegramNotification(title, body)
		},
		[sendBrowserNotification, sendTelegramNotification]
	)

	return {
		sendNotification,
		sendBrowserNotification,
		sendTelegramNotification,
	}
}
