'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
import { useDraggable } from '@/hooks/use-draggable'
import { HelpDialog } from '@/components/help-dialog'
import { formatTime } from '@/lib/utils'

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
		isSessionActive,
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
	const workCompleted =
		workDuration > 0 && workTime >= workDuration * 60 && mode === 'work'
	const restCompleted =
		restDuration > 0 && restTime >= restDuration * 60 && mode === 'rest'

	const {
		position: cameraPosition,
		isDragging,
		handleMouseDown,
		handleTouchStart,
	} = useDraggable({
		initialPosition: { x: 16, y: 16 },
		elementWidth: 192,
		elementHeight: 144,
	})
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

	useTimer({
		status,
		incrementWorkTime,
		incrementRestTime,
	})

	useEffect(() => {
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

	const memoizedSetStatus = useCallback(
		(newStatus: 'idle' | 'working' | 'resting') => {
			setStatus(newStatus)
		},
		[setStatus]
	)

	useEffect(() => {
		if (!useCameraDetection) return
		if (!isSessionActive) return
		if (workCompleted || restCompleted) return

		if (mode === 'work') {
			if (isFaceDetected && status === 'idle') {
				memoizedSetStatus('working')
			} else if (!isFaceDetected && status === 'working') {
				memoizedSetStatus('idle')
			}
		}

		if (mode === 'rest') {
			if (!isFaceDetected && status === 'idle') {
				memoizedSetStatus('resting')
			} else if (isFaceDetected && status === 'resting') {
				memoizedSetStatus('idle')
			}
		}
	}, [
		isFaceDetected,
		status,
		useCameraDetection,
		mode,
		isSessionActive,
		memoizedSetStatus,
		workCompleted,
		restCompleted,
	])

	return (
		<>
			<HelpDialog />
			<Button
				className='fixed top-4 right-4 h-12 w-12 rounded-full shadow-lg cursor-pointer z-50 bg-background/80 backdrop-blur-sm border-2 hover:scale-110  duration-200 hover:shadow-xl'
				size='icon'
				variant='outline'
				onClick={toggleTheme}
			>
				{theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
				<span className='sr-only'>Toggle theme</span>
			</Button>
			<div className='container mx-auto max-w-6xl px-6 py-8 lg:py-12 space-y-8'>
				{/* Header Controls */}
				<Card className='border-2 shadow-sm'>
					<CardContent className='p-8'>
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							<Button
								className='h-14 text-base font-medium cursor-pointer disabled:cursor-not-allowed  duration-200 shadow-sm hover:shadow-md'
								disabled={mode === 'work' && status !== 'idle'}
								variant={mode === 'work' ? 'default' : 'outline'}
								onClick={() => handleModeChange('work')}
							>
								<div className='flex items-center justify-center gap-2'>
									<Briefcase className='h-5 w-5' />
									<span>Work</span>
								</div>
							</Button>
							<Button
								className='h-14 text-base font-medium cursor-pointer disabled:cursor-not-allowed  duration-200 shadow-sm hover:shadow-md'
								disabled={mode === 'rest' && status !== 'idle'}
								variant={mode === 'rest' ? 'default' : 'outline'}
								onClick={() => handleModeChange('rest')}
							>
								<div className='flex items-center justify-center gap-2'>
									<Coffee className='h-5 w-5' />
									<span>Rest</span>
								</div>
							</Button>
							<Button
								className='h-14 text-base font-medium cursor-pointer disabled:cursor-not-allowed  duration-200 shadow-sm hover:shadow-md'
								disabled={status === 'idle' && workTime === 0 && restTime === 0}
								variant='outline'
								onClick={handlePause}
							>
								<div className='flex items-center justify-center gap-2'>
									{status === 'idle' ? (
										<>
											<Play className='h-5 w-5' />
											<span>Resume</span>
										</>
									) : (
										<>
											<Pause className='h-5 w-5' />
											<span>Pause</span>
										</>
									)}
								</div>
							</Button>
							<Button
								className='h-14 text-base font-medium cursor-pointer disabled:cursor-not-allowed  duration-200 shadow-sm hover:shadow-md'
								disabled={workTime === 0 && restTime === 0}
								variant='outline'
								onClick={handleReset}
							>
								<div className='flex items-center justify-center gap-2'>
									<RotateCcw className='h-5 w-5' />
									<span>Reset</span>
								</div>
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Completion Notifications */}
				{workCompleted && mode === 'work' && (
					<Card className='border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-blue-600/10 shadow-lg shadow-blue-500/10 animate-pulse'>
						<CardContent className='p-6'>
							<div className='flex items-center gap-4'>
								<div className='p-3 bg-blue-500 text-white rounded-full'>
									<Coffee className='h-6 w-6' />
								</div>
								<div className='flex-1'>
									<p className='text-lg font-semibold text-blue-700 dark:text-blue-300'>
										Work Complete! Time for a Break
									</p>
									<p className='text-sm text-blue-600/70 dark:text-blue-400/70 mt-1'>
										You&apos;ve worked for {workDuration} minutes. Click Rest to start
										your break.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
				{restCompleted && mode === 'rest' && (
					<Card className='border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-600/10 shadow-lg shadow-green-500/10 animate-pulse'>
						<CardContent className='p-6'>
							<div className='flex items-center gap-4'>
								<div className='p-3 bg-green-500 text-white rounded-full'>
									<Briefcase className='h-6 w-6' />
								</div>
								<div className='flex-1'>
									<p className='text-lg font-semibold text-green-700 dark:text-green-300'>
										Rest Complete! Ready to Work
									</p>
									<p className='text-sm text-green-600/70 dark:text-green-400/70 mt-1'>
										You&apos;ve rested for {restDuration} minutes. Click Work to resume.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Timer Display */}
				<Card
					className={`
					border-2 duration-300 hover:shadow-lg
					${
						status === 'working'
							? 'border-primary/50 bg-primary/5 shadow-primary/20'
							: status === 'resting'
							? 'border-green-500/50 bg-green-500/5 shadow-green-500/20'
							: 'border-border bg-muted/30'
					}
				`}
				>
					<CardContent className='p-8'>
						<div className='flex items-center gap-4 mb-8'>
							<div
								className={`
								p-4 rounded-xl duration-300
								${
									status === 'working'
										? 'bg-primary text-primary-foreground shadow-lg'
										: status === 'resting'
										? 'bg-green-500 text-white shadow-lg'
										: 'bg-muted text-muted-foreground'
								}
							`}
							>
								{status === 'working' ? (
									<Briefcase className='h-8 w-8' />
								) : status === 'resting' ? (
									<Coffee className='h-8 w-8' />
								) : (
									<Clock className='h-8 w-8' />
								)}
							</div>
							<div className='flex-1'>
								<h2 className='text-3xl font-bold capitalize mb-2'>
									{status === 'working' || status === 'resting'
										? status === 'working'
											? 'Working'
											: 'Resting'
										: status === 'idle' &&
										  ((mode === 'work' && workTime > 0) ||
												(mode === 'rest' && restTime > 0))
										? 'Paused'
										: 'Idle'}
								</h2>
								{status === 'working' && (
									<p className='text-lg text-primary font-medium'>Focus Mode</p>
								)}
								{status === 'resting' && (
									<p className='text-lg text-green-500 font-medium'>Recharge Time</p>
								)}
								{status === 'idle' &&
									!(
										(mode === 'work' && workTime > 0) ||
										(mode === 'rest' && restTime > 0)
									) && (
										<p className='text-lg text-muted-foreground font-medium'>
											Ready to Start
										</p>
									)}
								{status === 'idle' &&
									((mode === 'work' && workTime > 0) ||
										(mode === 'rest' && restTime > 0)) && (
										<p className='text-lg text-muted-foreground font-medium'>
											Ready to Resume
										</p>
									)}
							</div>
						</div>

						<div className='text-center'>
							<p className='text-6xl md:text-7xl font-bold font-mono tabular-nums tracking-tight mb-6'>
								{formatTime(mode === 'work' ? workTime : restTime)}
							</p>

							{(mode === 'work' ? workDuration : restDuration) > 0 && (
								<div className='max-w-xxl mx-auto'>
									<div className='flex items-center justify-between text-sm text-muted-foreground mb-2'>
										<span>{mode === 'work' ? 'Work' : 'Rest'} Progress</span>
										<span>
											{Math.min(
												100,
												Math.round(
													((mode === 'work' ? workTime : restTime) /
														((mode === 'work' ? workDuration : restDuration) * 60)) *
														100
												)
											)}
											%
										</span>
									</div>
									<div className='w-full bg-muted rounded-full h-3 overflow-hidden'>
										<div
											className={`
											h-full duration-300 ease-out
											${
												status === 'working'
													? 'bg-primary'
													: status === 'resting'
													? 'bg-green-500'
													: 'bg-muted-foreground'
											}
											`}
											style={{
												width: `${Math.min(
													100,
													((mode === 'work' ? workTime : restTime) /
														((mode === 'work' ? workDuration : restDuration) * 60)) *
														100
												)}%`,
											}}
										/>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Settings */}
				<Card className='border-2 shadow-sm'>
					<CardContent className='p-8 space-y-8'>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-muted rounded-lg'>
								<Bell className='h-5 w-5' />
							</div>
							<h3 className='text-xl font-semibold'>Settings</h3>
						</div>

						{/* Duration Settings */}
						<div className='space-y-6'>
							<h4 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
								Time Durations
							</h4>
							<div className='grid gap-6 md:grid-cols-2'>
								<div className='space-y-3'>
									<Label
										className='flex items-center gap-2 text-base font-medium'
										htmlFor='work-duration'
									>
										<div className='p-1.5 bg-primary/10 text-primary rounded'>
											<Briefcase className='h-4 w-4' />
										</div>
										Work Duration
									</Label>
									<Input
										className='h-11 text-base'
										id='work-duration'
										min='0'
										placeholder='25'
										type='number'
										value={workDurationInput}
										onChange={e => handleWorkDurationChange(e.target.value)}
									/>
									<p className='text-xs text-muted-foreground'>
										Minutes of work before break reminder
									</p>
								</div>

								<div className='space-y-3'>
									<Label
										className='flex items-center gap-2 text-base font-medium'
										htmlFor='rest-duration'
									>
										<div className='p-1.5 bg-green-500/10 text-green-500 rounded'>
											<Coffee className='h-4 w-4' />
										</div>
										Rest Duration
									</Label>
									<Input
										className='h-11 text-base'
										id='rest-duration'
										min='0'
										placeholder='5'
										type='number'
										value={restDurationInput}
										onChange={e => handleRestDurationChange(e.target.value)}
									/>
									<p className='text-xs text-muted-foreground'>
										Minutes of rest before work reminder
									</p>
								</div>

								<div className='space-y-3'>
									<Label
										className='flex items-center gap-2 text-base font-medium'
										htmlFor='timer-interval'
									>
										<div className='p-1.5 bg-blue-500/10 text-blue-500 rounded'>
											<Clock className='h-4 w-4' />
										</div>
										Timer Reminder
									</Label>
									<Input
										className='h-11 text-base'
										id='timer-interval'
										min='0'
										placeholder='60'
										type='number'
										value={timerIntervalInput}
										onChange={e => handleTimerIntervalChange(e.target.value)}
									/>
									<p className='text-xs text-muted-foreground'>
										Minutes between timer reminders
									</p>
								</div>

								<div className='space-y-3'>
									<Label
										className='flex items-center gap-2 text-base font-medium'
										htmlFor='water-interval'
									>
										<div className='p-1.5 bg-cyan-500/10 text-cyan-500 rounded'>
											<Droplet className='h-4 w-4' />
										</div>
										Water Reminder
									</Label>
									<Input
										className='h-11 text-base'
										id='water-interval'
										min='0'
										placeholder='30'
										type='number'
										value={waterIntervalInput}
										onChange={e => handleWaterIntervalChange(e.target.value)}
									/>
									<p className='text-xs text-muted-foreground'>
										Minutes between hydration reminders
									</p>
								</div>
							</div>
						</div>

						{/* Telegram Settings */}
						<div className='space-y-6'>
							<h4 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
								Telegram Integration
							</h4>
							<div className='grid gap-6 md:grid-cols-2'>
								<div className='space-y-3'>
									<Label
										className='flex items-center gap-2 text-base font-medium'
										htmlFor='telegram-token'
									>
										<MessageSquare className='h-4 w-4' />
										Bot Token
									</Label>
									<div className='relative'>
										<Input
											className='h-11 pr-11 text-base'
											id='telegram-token'
											placeholder='Bot Token from @BotFather'
											type={showToken ? 'text' : 'password'}
											value={telegramToken}
											onChange={e => setTelegramToken(e.target.value)}
										/>
										<Button
											className='absolute right-0 top-0 h-11 w-11 rounded-l-none hover:bg-muted cursor-pointer'
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

								<div className='space-y-3'>
									<Label
										className='flex items-center gap-2 text-base font-medium'
										htmlFor='telegram-chat'
									>
										<MessageSquare className='h-4 w-4' />
										Chat ID
									</Label>
									<div className='relative'>
										<Input
											className='h-11 pr-11 text-base'
											id='telegram-chat'
											placeholder='Your Chat ID'
											type={showChatId ? 'text' : 'password'}
											value={telegramChatId}
											onChange={e => setTelegramChatId(e.target.value)}
										/>
										<Button
											className='absolute right-0 top-0 h-11 w-11 rounded-l-none hover:bg-muted cursor-pointer'
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
						</div>

						{/* Feature Toggles */}
						<div className='space-y-6 pt-6 border-t'>
							<h4 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
								Features
							</h4>
							<div className='space-y-4'>
								<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
									<div className='flex items-center gap-3'>
										<Bell className='h-5 w-5 text-muted-foreground' />
										<div>
											<Label
												className='text-base font-medium cursor-pointer'
												htmlFor='use-browser-notifications'
											>
												Browser Notifications
											</Label>
											<p className='text-sm text-muted-foreground mt-1'>
												Get notifications in your browser
											</p>
										</div>
									</div>
									<Switch
										checked={useBrowserNotifications}
										id='use-browser-notifications'
										onCheckedChange={setUseBrowserNotifications}
									/>
								</div>

								<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
									<div className='flex items-center gap-3'>
										<MessageSquare className='h-5 w-5 text-muted-foreground' />
										<div>
											<Label
												className='text-base font-medium cursor-pointer'
												htmlFor='use-telegram-notifications'
											>
												Telegram Notifications
											</Label>
											<p className='text-sm text-muted-foreground mt-1'>
												Receive notifications on Telegram
											</p>
										</div>
									</div>
									<Switch
										checked={useTelegramNotifications}
										id='use-telegram-notifications'
										onCheckedChange={setUseTelegramNotifications}
									/>
								</div>

								<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
									<div className='flex items-center gap-3'>
										<Camera className='h-5 w-5 text-muted-foreground' />
										<div>
											<Label
												className='text-base font-medium cursor-pointer'
												htmlFor='use-camera'
											>
												Face Detection
											</Label>
											<p className='text-sm text-muted-foreground mt-1'>
												Auto-pause when you leave your desk
											</p>
										</div>
									</div>
									<Switch
										checked={useCameraDetection}
										id='use-camera'
										onCheckedChange={setUseCameraDetection}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Camera Overlay Portal */}
			{useCameraDetection &&
				createPortal(
					<div
						className={`fixed z-[999999] group ${
							isDragging ? 'cursor-grabbing' : 'cursor-grab'
						}`}
						style={{
							position: 'fixed',
							left: `${cameraPosition.x}px`,
							top: `${cameraPosition.y}px`,
							zIndex: 999999,
						}}
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
					>
						<div
							className={`
								relative rounded-xl overflow-hidden shadow-2xl bg-black  duration-300
								w-32 md:w-40 aspect-[4/3] hover:scale-105 hover:shadow-3xl select-none
								${isDragging ? 'scale-95' : ''}
								${
									cameraError
										? 'ring-4 ring-red-500/50 border-2 border-red-500'
										: isCameraLoading
										? 'ring-4 ring-gray-400/50 border-2 border-gray-400'
										: isFaceDetected
										? 'ring-4 ring-green-500/50 border-2 border-green-500'
										: 'ring-4 ring-yellow-500/50 border-2 border-yellow-500'
								}
							`}
						>
							<video
								ref={videoRef}
								muted
								playsInline
								className='w-full h-full object-cover'
							/>
							<canvas ref={canvasRef} className='absolute inset-0 w-full h-full' />

							{isCameraLoading && (
								<div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white'>
									<div className='text-center'>
										<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2' />
									</div>
								</div>
							)}

							{cameraError && (
								<div className='absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm text-red-500' />
							)}
						</div>

						{/* Camera info tooltip */}
						<div className='absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none'>
							<div className='bg-background/90 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs shadow-lg'>
								<p className='font-medium mb-1'>Face Detection Active</p>
								<p className='text-muted-foreground'>
									{isFaceDetected
										? 'Timer will run when face is detected'
										: 'Timer paused - no face detected'}
								</p>
							</div>
						</div>
					</div>,
					document.body
				)}
		</>
	)
}
