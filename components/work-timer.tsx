'use client'

import { useEffect, useMemo, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkTimerStore } from '@/lib/store'
import { useFaceDetection } from '@/hooks/use-face-detection'
import { useNotifications } from '@/hooks/use-notifications'
import { useTheme } from '@/hooks/use-theme'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useTimer } from '@/hooks/use-timer'
import { useNotificationReminders } from '@/hooks/use-notification-reminders'
import { useSettingsInputs } from '@/hooks/use-settings-inputs'
import { HelpDialog } from '@/components/help-dialog'
import { HeaderControls } from '@/components/work-timer/header-controls'
import { TimerDisplay } from '@/components/work-timer/timer-display'
import { SettingsPanel } from '@/components/work-timer/settings-panel'

import { formatTime } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Static JSX icons extracted outside component to prevent re-creation
const ICONS = {
	sun: <Sun className='h-5 w-5' />,
	moon: <Moon className='h-5 w-5' />,
} as const

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
		isManuallyPaused,
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
		setIsManuallyPaused,
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

	// Derived state optimization - move computed values to useMemo
	const workCompleted = useMemo(
		() => workDuration > 0 && workTime >= workDuration * 60 && mode === 'work',
		[workDuration, workTime, mode]
	)

	const restCompleted = useMemo(
		() => restDuration > 0 && restTime >= restDuration * 60 && mode === 'rest',
		[restDuration, restTime, mode]
	)

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
		setIsManuallyPaused(false)
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
			setIsManuallyPaused(false)
			if (mode === 'work') {
				setStatus('working')
			} else {
				setStatus('resting')
			}
		} else {
			setStatus('idle')
			setIsSessionActive(false)
			setIsManuallyPaused(true)
		}
	}

	const handleReset = () => {
		resetTimers()
		setStatus('idle')
		setIsSessionActive(false)
		setIsManuallyPaused(false)
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

	useEffect(() => {
		if (!useCameraDetection) return
		if (!isSessionActive) return
		if (workCompleted || restCompleted) return

		if (mode === 'work') {
			if (isFaceDetected && status === 'idle' && !isManuallyPaused) {
				setStatus('working')
			} else if (!isFaceDetected && status === 'working') {
				setStatus('idle')
				setIsManuallyPaused(false)
			}
		}

		if (mode === 'rest') {
			if (!isFaceDetected && status === 'idle' && !isManuallyPaused) {
				setStatus('resting')
			} else if (isFaceDetected && status === 'resting') {
				setStatus('idle')
				setIsManuallyPaused(false)
			}
		}
	}, [
		isFaceDetected,
		status,
		useCameraDetection,
		mode,
		isSessionActive,
		workCompleted,
		restCompleted,
		isManuallyPaused,
		setIsManuallyPaused,
		setStatus,
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
				{theme === 'dark' ? ICONS.sun : ICONS.moon}
				<span className='sr-only'>Toggle theme</span>
			</Button>
			<div className='container mx-auto max-w-6xl px-6 py-8 lg:py-12 space-y-8'>
				{/* Header Controls */}
				<HeaderControls
					mode={mode}
					restTime={restTime}
					status={status}
					workTime={workTime}
					onModeChange={handleModeChange}
					onPause={handlePause}
					onReset={handleReset}
				/>

				{/* Timer Display */}
				<TimerDisplay
					isManuallyPaused={isManuallyPaused}
					mode={mode}
					restDuration={restDuration}
					restTime={restTime}
					status={status}
					workDuration={workDuration}
					workTime={workTime}
				/>

				{/* Settings */}
				<SettingsPanel
					restDurationInput={restDurationInput}
					showChatId={showChatId}
					showToken={showToken}
					telegramChatId={telegramChatId}
					telegramToken={telegramToken}
					timerIntervalInput={timerIntervalInput}
					useBrowserNotifications={useBrowserNotifications}
					useCameraDetection={useCameraDetection}
					useTelegramNotifications={useTelegramNotifications}
					waterIntervalInput={waterIntervalInput}
					workDurationInput={workDurationInput}
					onRestDurationChange={handleRestDurationChange}
					onTelegramChatIdChange={setTelegramChatId}
					onTelegramTokenChange={setTelegramToken}
					onTimerIntervalChange={handleTimerIntervalChange}
					onToggleBrowserNotifications={setUseBrowserNotifications}
					onToggleCameraDetection={setUseCameraDetection}
					onToggleShowChatId={() => setShowChatId(!showChatId)}
					onToggleShowToken={() => setShowToken(!showToken)}
					onToggleTelegramNotifications={setUseTelegramNotifications}
					onWaterIntervalChange={handleWaterIntervalChange}
					onWorkDurationChange={handleWorkDurationChange}
				/>
			</div>

			{/* Camera Overlay Portal */}
			{useCameraDetection && (
				<LazyFaceDetectionOverlay
					cameraError={cameraError}
					canvasRef={canvasRef}
					isCameraLoading={isCameraLoading}
					isFaceDetected={isFaceDetected}
					videoRef={videoRef}
				/>
			)}
		</>
	)
}

const LazyFaceDetectionOverlay = dynamic(
	() =>
		import('./face-detection-overlay').then(mod => ({
			default: mod.FaceDetectionOverlay,
		})),
	{
		loading: () => (
			<div className='fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg'>
				Loading camera...
			</div>
		),
		ssr: false,
	}
)
