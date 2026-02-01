'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
	Bell,
	Briefcase,
	Camera,
	Clock,
	Coffee,
	Droplet,
	MessageSquare,
	Moon,
	Pause,
	Play,
	RotateCcw,
	Sun,
} from 'lucide-react'
import { useWorkTimerStore } from '@/lib/store'
import { useFaceDetection } from '@/hooks/use-face-detection'
import { useNotifications } from '@/hooks/use-notifications'
import { HelpDialog } from '@/components/help-dialog'

export function WorkTimer() {
	const {
		mode,
		status,
		workTime,
		restTime,
		workDuration,
		restDuration,
		timerInterval,
		waterInterval,
		telegramToken,
		telegramChatId,
		useCameraDetection,
		useBrowserNotifications,
		useTelegramNotifications,
		setMode,
		setStatus,
		incrementWorkTime,
		incrementRestTime,
		resetWorkTime,
		resetRestTime,
		resetTimers,
		setWorkDuration,
		setRestDuration,
		setTimerInterval,
		setWaterInterval,
		setTelegramToken,
		setTelegramChatId,
		setUseCameraDetection,
		setUseBrowserNotifications,
		setUseTelegramNotifications,
		isSessionActive,
		setIsSessionActive,
	} = useWorkTimerStore()

	const {
		isFaceDetected,
		isLoading: isCameraLoading,
		error: cameraError,
		startCamera,
		stopCamera,
		videoRef,
		canvasRef,
	} = useFaceDetection()
	const { sendNotification } = useNotifications()

	const [theme, setTheme] = useState<'light' | 'dark'>('dark')

	const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const timerReminderRef = useRef<NodeJS.Timeout | null>(null)
	const waterReminderRef = useRef<NodeJS.Timeout | null>(null)
	const isNaggingRef = useRef<boolean>(false)

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null

		if (savedTheme) {
			setTheme(savedTheme)
			document.documentElement.classList.toggle('dark', savedTheme === 'dark')
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

			setTheme(prefersDark ? 'dark' : 'light')
			document.documentElement.classList.toggle('dark', prefersDark)
		}
	}, [])

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark'

		setTheme(newTheme)
		localStorage.setItem('theme', newTheme)
		document.documentElement.classList.toggle('dark', newTheme === 'dark')
	}

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
					handleModeChange('work')
					break
				case 'r':
					if (e.shiftKey) {
						handleReset()
					} else {
						handleModeChange('rest')
					}
					break
				case 'p':
				case ' ':
					e.preventDefault()
					handlePause()
					break
			}
		}

		window.addEventListener('keydown', handleKeyPress)

		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [status])

	useEffect(() => {
		const formatTime = (seconds: number) => {
			const h = Math.floor(seconds / 3600)
			const m = Math.floor((seconds % 3600) / 60)
			const s = seconds % 60

			return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`
		}

		if (status === 'working') {
			document.title = `⏰ Working - ${formatTime(workTime)} - Levanta.me`
		} else if (status === 'resting') {
			document.title = `☕ Resting - ${formatTime(restTime)} - Levanta.me`
		} else {
			document.title = `⏸️ Idle - Levanta.me`
		}
	}, [status, workTime, restTime])

	useEffect(() => {
		if (useCameraDetection) {
			startCamera()
		} else {
			stopCamera()
		}
	}, [useCameraDetection, startCamera, stopCamera])

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

	useEffect(() => {
		if (!useCameraDetection) return

		if (isFaceDetected && status === 'idle' && isSessionActive) {
			setStatus('working')
		} else if (!isFaceDetected && status === 'working') {
			setStatus('idle')
		} else if (isFaceDetected && status === 'resting') {
			setStatus('idle')
		}
	}, [isFaceDetected, status, useCameraDetection, setStatus, isSessionActive])

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

				if (currentState.status === 'idle') {
					return
				}

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
						'Still working?',
						`You should take a break! Your work time finished ${overtimeMinutes} minutes ago.`
					)
				} else if (
					currentState.mode === 'rest' &&
					currentState.restTime >= currentState.restDuration * 60 &&
					currentState.status === 'resting'
				) {
					sendNotification(
						'Still resting?',
						`Time to get back to work! Your rest time finished ${overtimeMinutes} minutes ago.`
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

	useEffect(() => {
		if (waterReminderRef.current) {
			clearInterval(waterReminderRef.current)
		}

		if (waterInterval > 0 && status !== 'idle') {
			waterReminderRef.current = setInterval(() => {
				sendNotification('Water Reminder', '💧 Time to drink some water!')
			}, waterInterval * 60 * 1000)
		}

		return () => {
			if (waterReminderRef.current) {
				clearInterval(waterReminderRef.current)
			}
		}
	}, [waterInterval, status, sendNotification])

	const [workCompleted, setWorkCompleted] = useState(false)
	const [restCompleted, setRestCompleted] = useState(false)

	useEffect(() => {
		if (
			workDuration > 0 &&
			workTime >= workDuration * 60 &&
			!workCompleted &&
			mode === 'work'
		) {
			setWorkCompleted(true)
			sendNotification(
				'Work time finished. Go for a break!',
				`You've completed ${workDuration} minutes of work. Click Rest when you're ready for a break.`
			)
		} else if (workTime < workDuration * 60 || mode !== 'work') {
			setWorkCompleted(false)
		}
	}, [workTime, workDuration, workCompleted, mode, sendNotification])

	useEffect(() => {
		if (
			restDuration > 0 &&
			restTime >= restDuration * 60 &&
			!restCompleted &&
			mode === 'rest'
		) {
			setRestCompleted(true)
			sendNotification(
				'Rest time finished!',
				`You've rested for ${restDuration} minutes. Click Work when you're ready to resume.`
			)
		} else if (restTime < restDuration * 60 || mode !== 'rest') {
			setRestCompleted(false)
		}
	}, [restTime, restDuration, restCompleted, mode, sendNotification])

	const handleModeChange = (newMode: 'work' | 'rest') => {
		if (timerReminderRef.current) {
			clearInterval(timerReminderRef.current)
			timerReminderRef.current = null
		}
		isNaggingRef.current = false

		setMode(newMode)
		setIsSessionActive(true)
		if (newMode === 'work') {
			setStatus('working')
			resetRestTime()
		} else {
			setStatus('resting')
			resetWorkTime()
		}
	}

	const handlePause = () => {
		if (status === 'idle') {
			setIsSessionActive(true)
			if (mode === 'work') {
				setStatus('working')
			} else {
				setStatus('resting')
			}
		} else {
			setStatus('idle')
			setIsSessionActive(false)
		}
	}

	const handleReset = () => {
		resetTimers()
		setStatus('idle')
		setIsSessionActive(false)
	}

	const formatTime = (seconds: number) => {
		const h = Math.floor(seconds / 3600)
		const m = Math.floor((seconds % 3600) / 60)
		const s = seconds % 60

		return `${h}h ${m}m ${s}s`
	}

	return (
		<>
			<HelpDialog />
			<Button
				className='fixed top-6 right-6 h-10 w-10 rounded-full shadow-lg cursor-pointer z-50 bg-transparent'
				size='icon'
				variant='outline'
				onClick={toggleTheme}
			>
				{theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
				<span className='sr-only'>Toggle theme</span>
			</Button>
			<div className='container mx-auto max-w-5xl px-4 py-8 space-y-6'>
				{/* Header Controls */}
				<Card className='border-2'>
					<CardContent className='p-6'>
						<div className='flex flex-wrap gap-3'>
							<Button
								className='flex-1 min-w-[140px] h-12 text-base cursor-pointer disabled:cursor-not-allowed'
								disabled={mode === 'work' && status !== 'idle'}
								variant={mode === 'work' ? 'default' : 'outline'}
								onClick={() => handleModeChange('work')}
							>
								<Briefcase className='mr-2 h-5 w-5' />
								Work
							</Button>
							<Button
								className='flex-1 min-w-[140px] h-12 text-base cursor-pointer disabled:cursor-not-allowed'
								disabled={mode === 'rest' && status !== 'idle'}
								variant={mode === 'rest' ? 'default' : 'outline'}
								onClick={() => handleModeChange('rest')}
							>
								<Coffee className='mr-2 h-5 w-5' />
								Rest
							</Button>
							<Button
								className='flex-1 min-w-[140px] h-12 text-base bg-transparent cursor-pointer disabled:cursor-not-allowed'
								disabled={status === 'idle' && workTime === 0 && restTime === 0}
								variant='outline'
								onClick={handlePause}
							>
								{status === 'idle' ? (
									<>
										<Play className='mr-2 h-5 w-5' />
										Resume
									</>
								) : (
									<>
										<Pause className='mr-2 h-5 w-5' />
										Pause
									</>
								)}
							</Button>
							<Button
								className='flex-1 min-w-[140px] h-12 text-base bg-transparent cursor-pointer disabled:cursor-not-allowed'
								disabled={workTime === 0 && restTime === 0}
								variant='outline'
								onClick={handleReset}
							>
								<RotateCcw className='mr-2 h-5 w-5' />
								Reset
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Completion Notifications */}
				{workCompleted && mode === 'work' && (
					<Card className='border-2 bg-blue-500/10 border-blue-500'>
						<CardContent className='p-4'>
							<p className='text-lg font-semibold text-blue-700 dark:text-blue-300'>
								Work time finished. Go for a break! 🛌
							</p>
						</CardContent>
					</Card>
				)}
				{restCompleted && mode === 'rest' && (
					<Card className='border-2 bg-green-500/10 border-green-500'>
						<CardContent className='p-4'>
							<p className='text-lg font-semibold text-green-700 dark:text-green-300'>
								Rest time finished. Ready to get back to work! 💪
							</p>
						</CardContent>
					</Card>
				)}

				{/* Timer Display */}
				<div className='grid gap-6 md:grid-cols-2'>
					<Card className='border-2'>
						<CardContent className='p-6'>
							<div className='flex items-center gap-2 mb-4 text-muted-foreground'>
								<Briefcase className='h-5 w-5' />
								<h3 className='font-semibold text-sm uppercase tracking-wide'>
									Work Time
								</h3>
							</div>
							<p className='text-4xl font-bold font-mono'>{formatTime(workTime)}</p>
						</CardContent>
					</Card>

					<Card className='border-2'>
						<CardContent className='p-6'>
							<div className='flex items-center gap-2 mb-4 text-muted-foreground'>
								<Coffee className='h-5 w-5' />
								<h3 className='font-semibold text-sm uppercase tracking-wide'>
									Rest Time
								</h3>
							</div>
							<p className='text-4xl font-bold font-mono'>{formatTime(restTime)}</p>
						</CardContent>
					</Card>
				</div>

				{/* Current Status */}
				<Card className='border-2 bg-muted/30'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2'>
									Current Status
								</p>
								<p className='text-3xl font-bold capitalize'>
									{status === 'working'
										? 'Working'
										: status === 'resting'
										? 'Resting'
										: 'Idle'}
									{status === 'idle' && mode === 'work' && workTime > 0 && ' (Paused)'}
									{status === 'idle' && mode === 'rest' && restTime > 0 && ' (Paused)'}
								</p>
							</div>
							{status === 'working' ? (
								<Briefcase className='h-12 w-12 text-muted-foreground' />
							) : status === 'resting' ? (
								<Coffee className='h-12 w-12 text-muted-foreground' />
							) : (
								<Clock className='h-12 w-12 text-muted-foreground' />
							)}
						</div>
					</CardContent>
				</Card>

				{/* Settings */}
				<Card className='border-2'>
					<CardContent className='p-6 space-y-6'>
						<h3 className='text-lg font-semibold mb-4'>Settings</h3>

						<div className='grid gap-6 md:grid-cols-2'>
							<div className='space-y-2'>
								<Label className='flex items-center gap-2' htmlFor='work-duration'>
									<Briefcase className='h-4 w-4' />
									Work time (minutes)
								</Label>
								<Input
									className='h-10'
									id='work-duration'
									min='0'
									type='number'
									value={workDuration}
									onChange={e => {
										const value = e.target.value.replace(/^0+/, '') || '0'

										setWorkDuration(Number(value))
									}}
								/>
							</div>

							<div className='space-y-2'>
								<Label className='flex items-center gap-2' htmlFor='rest-duration'>
									<Coffee className='h-4 w-4' />
									Rest time (minutes)
								</Label>
								<Input
									className='h-10'
									id='rest-duration'
									min='0'
									type='number'
									value={restDuration}
									onChange={e => {
										const value = e.target.value.replace(/^0+/, '') || '0'

										setRestDuration(Number(value))
									}}
								/>
							</div>

							<div className='space-y-2'>
								<Label className='flex items-center gap-2' htmlFor='timer-interval'>
									<Clock className='h-4 w-4' />
									Timer Reminder Interval (minutes)
								</Label>
								<Input
									className='h-10'
									id='timer-interval'
									min='0'
									type='number'
									value={timerInterval}
									onChange={e => {
										const value = e.target.value.replace(/^0+/, '') || '0'

										setTimerInterval(Number(value))
									}}
								/>
							</div>

							<div className='space-y-2'>
								<Label className='flex items-center gap-2' htmlFor='water-interval'>
									<Droplet className='h-4 w-4' />
									Water Reminder Interval (minutes)
								</Label>
								<Input
									className='h-10'
									id='water-interval'
									min='0'
									type='number'
									value={waterInterval}
									onChange={e => {
										const value = e.target.value.replace(/^0+/, '') || '0'

										setWaterInterval(Number(value))
									}}
								/>
							</div>

							<div className='space-y-2'>
								<Label className='flex items-center gap-2' htmlFor='telegram-token'>
									<Bell className='h-4 w-4' />
									Telegram Bot Token
								</Label>
								<Input
									className='h-10'
									id='telegram-token'
									placeholder='Bot Token from @BotFather'
									type='text'
									value={telegramToken}
									onChange={e => setTelegramToken(e.target.value)}
								/>
							</div>

							<div className='space-y-2'>
								<Label className='flex items-center gap-2' htmlFor='telegram-chat'>
									<MessageSquare className='h-4 w-4' />
									Telegram Chat ID
								</Label>
								<Input
									className='h-10'
									id='telegram-chat'
									placeholder='Chat ID from @BotFather'
									type='text'
									value={telegramChatId}
									onChange={e => setTelegramChatId(e.target.value)}
								/>
							</div>
						</div>

						<div className='space-y-4 pt-4 border-t'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Bell className='h-5 w-5' />
									<Label
										className='text-base cursor-pointer'
										htmlFor='use-browser-notifications'
									>
										Enable Browser Notifications
									</Label>
								</div>
								<Switch
									checked={useBrowserNotifications}
									id='use-browser-notifications'
									onCheckedChange={setUseBrowserNotifications}
								/>
							</div>

							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<MessageSquare className='h-5 w-5' />
									<Label
										className='text-base cursor-pointer'
										htmlFor='use-telegram-notifications'
									>
										Enable Telegram Notifications
									</Label>
								</div>
								<Switch
									checked={useTelegramNotifications}
									id='use-telegram-notifications'
									onCheckedChange={setUseTelegramNotifications}
								/>
							</div>

							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Camera className='h-5 w-5' />
									<Label className='text-base cursor-pointer' htmlFor='use-camera'>
										Use Camera for Face Detection
									</Label>
								</div>
								<Switch
									checked={useCameraDetection}
									id='use-camera'
									onCheckedChange={setUseCameraDetection}
								/>
							</div>

							<Button
								className='w-full cursor-pointer'
								variant='outline'
								onClick={() =>
									sendNotification(
										'Test Notification',
										'This is a test notification to verify your settings are working correctly.'
									)
								}
							>
								<Bell className='mr-2 h-4 w-4' />
								Test Notification
							</Button>
						</div>

						{useCameraDetection && (
							<div
								className={`p-4 rounded-lg border ${
									cameraError
										? 'bg-destructive/10 border-destructive'
										: 'bg-muted border-border'
								}`}
							>
								<p className='text-sm'>
									{isCameraLoading ? (
										<span className='text-muted-foreground'>⏳ Loading camera...</span>
									) : cameraError ? (
										<span className='text-destructive'>
											<strong>Error:</strong> {cameraError}
										</span>
									) : isFaceDetected ? (
										<span className='text-green-600 dark:text-green-500 font-medium'>
											✅ Face detected - Timer active
										</span>
									) : (
										<span className='text-amber-600 dark:text-amber-500 font-medium'>
											⏸️ No face detected - Timer paused
										</span>
									)}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Camera Overlay */}
			{useCameraDetection && (
				<div className='fixed bottom-4 right-4 z-50 rounded-lg overflow-hidden shadow-2xl border-2 border-primary/20 bg-black w-32 md:w-80 aspect-[4/3]'>
					<video
						ref={videoRef}
						muted
						playsInline
						className='w-full h-full object-cover transform scale-x-[-1]'
					/>
					<canvas
						ref={canvasRef}
						className='absolute inset-0 w-full h-full transform scale-x-[-1]'
					/>
					{isCameraLoading && (
						<div className='absolute inset-0 flex items-center justify-center bg-black/50 text-white'>
							<span className='animate-pulse'>Starting Camera...</span>
						</div>
					)}
				</div>
			)}
		</>
	)
}
