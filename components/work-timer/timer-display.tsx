import { memo } from 'react'
import { Briefcase, Clock, Coffee } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'

const STATUS_ICONS = {
	working: <Briefcase className='h-8 w-8' />,
	resting: <Coffee className='h-8 w-8' />,
	idle: <Clock className='h-8 w-8' />,
} as const

export const TimerDisplay = memo(
	({
		isManuallyPaused,
		mode,
		restDuration,
		restTime,
		status,
		workDuration,
		workTime,
	}: {
		isManuallyPaused: boolean
		mode: 'work' | 'rest'
		restDuration: number
		restTime: number
		status: 'idle' | 'working' | 'resting'
		workDuration: number
		workTime: number
	}) => {
		const currentTime = mode === 'work' ? workTime : restTime
		const currentDuration = mode === 'work' ? workDuration : restDuration
		const progress =
			currentDuration > 0
				? Math.min(100, (currentTime / (currentDuration * 60)) * 100)
				: 0

		const getStatusTitle = () => {
			if (status === 'working' || status === 'resting') {
				return status === 'working' ? 'Working' : 'Resting'
			}

			return isManuallyPaused ? 'Paused' : 'Idle'
		}

		const getStatusSubtitle = () => {
			if (status === 'working') return 'Focus Mode'
			if (status === 'resting') return 'Recharge Time'
			if (status === 'idle') {
				const hasTime =
					(mode === 'work' && workTime > 0) || (mode === 'rest' && restTime > 0)

				return hasTime ? 'Ready to Resume' : 'Ready to Start'
			}

			return ''
		}

		const getStatusSubtitleColor = () => {
			if (status === 'working') return 'text-blue-500'
			if (status === 'resting') return 'text-green-500'

			return 'text-muted-foreground'
		}

		return (
			<Card
				className={`
				border-2 duration-300 hover:shadow-lg
				${
					status === 'working'
						? 'border-blue-500/50 bg-blue-500/5 shadow-blue-500/20'
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
									? 'bg-blue-500 text-white shadow-lg'
									: status === 'resting'
									? 'bg-green-500 text-white shadow-lg'
									: 'bg-muted text-muted-foreground'
							}
						`}
						>
							{STATUS_ICONS[status]}
						</div>
						<div className='flex-1'>
							<h2 className='text-3xl font-bold capitalize mb-2'>{getStatusTitle()}</h2>
							<p className={`text-lg font-medium ${getStatusSubtitleColor()}`}>
								{getStatusSubtitle()}
							</p>
						</div>
					</div>

					<div className='text-center'>
						<p className='text-6xl md:text-7xl font-bold font-mono tabular-nums tracking-tight mb-6'>
							{formatTime(currentTime)}
						</p>

						{currentDuration > 0 && (
							<div className='max-w-xxl mx-auto'>
								<div className='flex items-center justify-between text-sm text-muted-foreground mb-2'>
									<span>{mode === 'work' ? 'Work' : 'Rest'} Progress</span>
									<span>{Math.round(progress)}%</span>
								</div>
								<div className='w-full bg-muted rounded-full h-3 overflow-hidden'>
									<div
										className={`
										h-full duration-300 ease-out
										${
											status === 'working'
												? 'bg-blue-500'
												: status === 'resting'
												? 'bg-green-500'
												: 'bg-muted-foreground'
										}
										`}
										style={{ width: `${progress}%` }}
									/>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		)
	}
)

TimerDisplay.displayName = 'TimerDisplay'
