'use client'

import { useEffect, useState } from 'react'
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
	Eye,
	EyeOff,
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
import { useTheme } from '@/hooks/use-theme'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useTimer } from '@/hooks/use-timer'
import { useNotificationReminders } from '@/hooks/use-notification-reminders'
import { useSettingsInputs } from '@/hooks/use-settings-inputs'
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
	const { theme, toggleTheme } = useTheme()

	const [showToken, setShowToken] = useState(false)
	const [showChatId, setShowChatId] = useState(false)

	const {
		workDurationInput,
		restDurationInput,
		timerIntervalInput,
		waterIntervalInput,
		handleWorkDurationChange,
		handleRestDurationChange,
		handleTimerIntervalChange,
		handleWaterIntervalChange,
	} = useSettingsInputs({
		workDuration,
		restDuration,
		timerInterval,
		waterInterval,
		onWorkDurationChange: setWorkDuration,
		onRestDurationChange: setRestDuration,
		onTimerIntervalChange: setTimerInterval,
		onWaterIntervalChange: setWaterInterval,
	})

	const handleModeChange = (newMode: 'work' | 'rest') => {
		clearTimerReminder()

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

	useKeyboardShortcuts({
		onWorkMode: () => handleModeChange('work'),
		onRestMode: () => handleModeChange('rest'),
		onReset: handleReset,
		onPause: handlePause,
		status,
	})

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

	useTimer({
		status,
		incrementWorkTime,
		incrementRestTime,
	})

	useEffect(() => {
		if (!useCameraDetection) return

		if (!isFaceDetected && status === 'working') {
			setStatus('idle')
		} else if (isFaceDetected && status === 'resting') {
			setStatus('idle')
		} else if (isFaceDetected && status === 'idle' && mode === 'work') {
			setStatus('working')
			setIsSessionActive(true)
		} else if (isFaceDetected && status === 'idle' && mode === 'rest') {
			setStatus('resting')
			setIsSessionActive(true)
		}
	}, [isFaceDetected, status, useCameraDetection, setStatus, mode, setIsSessionActive])

	const { clearTimerReminder } = useNotificationReminders({
		workTime,
		restTime,
		workDuration,
		restDuration,
		mode,
		status,
		timerInterval,
		waterInterval,
		sendNotification,
	})

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
									value={workDurationInput}
									onChange={e => handleWorkDurationChange(e.target.value)}
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
									value={restDurationInput}
									onChange={e => handleRestDurationChange(e.target.value)}
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
									value={timerIntervalInput}
									onChange={e => handleTimerIntervalChange(e.target.value)}
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
									value={waterIntervalInput}
									onChange={e => handleWaterIntervalChange(e.target.value)}
								/>
							</div>

							<div className='space-y-2'>
								<Label className='flex items-center gap-2' htmlFor='telegram-token'>
									<Bell className='h-4 w-4' />
									Telegram Bot Token
								</Label>
								<div className='relative'>
									<Input
										className='h-10 pr-10'
										id='telegram-token'
										placeholder='Bot Token from @BotFather'
										type={showToken ? 'text' : 'password'}
										value={telegramToken}
										onChange={e => setTelegramToken(e.target.value)}
									/>
									<Button
										className='absolute right-0 top-0 h-10 w-10 rounded-l-none'
										size='icon'
										type='button'
										variant='ghost'
										onClick={() => setShowToken(!showToken)}
									>
										{showToken ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
										<span className='sr-only'>Toggle token visibility</span>
									</Button>
								</div>
							</div>

							<div className='space-y-2'>
								<Label className='flex items-center gap-2' htmlFor='telegram-chat'>
									<MessageSquare className='h-4 w-4' />
									Telegram Chat ID
								</Label>
								<div className='relative'>
									<Input
										className='h-10 pr-10'
										id='telegram-chat'
										placeholder='Chat ID from @BotFather'
										type={showChatId ? 'text' : 'password'}
										value={telegramChatId}
										onChange={e => setTelegramChatId(e.target.value)}
									/>
									<Button
										className='absolute right-0 top-0 h-10 w-10 rounded-l-none'
										size='icon'
										type='button'
										variant='ghost'
										onClick={() => setShowChatId(!showChatId)}
									>
										{showChatId ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
										<span className='sr-only'>Toggle chat ID visibility</span>
									</Button>
								</div>
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
					</CardContent>
				</Card>
			</div>

			{/* Camera Overlay */}
			{useCameraDetection && (
				<div
					className={`fixed bottom-4 right-4 z-50 rounded-lg overflow-hidden shadow-2xl bg-black w-32 md:w-80 aspect-[4/3] ${
						cameraError
							? 'border-4 border-red-500'
							: isCameraLoading
							? 'border-4 border-gray-400'
							: isFaceDetected
							? 'border-4 border-green-500'
							: 'border-4 border-yellow-500'
					}`}
				>
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
							<span className='animate-pulse text-center'>Starting Camera...</span>
						</div>
					)}
				</div>
			)}
		</>
	)
}
