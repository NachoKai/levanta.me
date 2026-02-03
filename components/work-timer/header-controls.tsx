import { memo } from 'react'
import { Briefcase, Coffee, Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const ICONS = {
	briefcase: <Briefcase className='h-5 w-5' />,
	coffee: <Coffee className='h-5 w-5' />,
	play: <Play className='h-5 w-5' />,
	pause: <Pause className='h-5 w-5' />,
	reset: <RotateCcw className='h-5 w-5' />,
} as const

export const HeaderControls = memo(
	({
		mode,
		onModeChange,
		onPause,
		onReset,
		status,
		workTime,
		restTime,
	}: {
		mode: 'work' | 'rest'
		onModeChange: (_newMode: 'work' | 'rest') => void
		onPause: () => void
		onReset: () => void
		status: 'idle' | 'working' | 'resting'
		workTime: number
		restTime: number
	}) => {
		return (
			<Card className='border-2 shadow-sm'>
				<CardContent className='p-8'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<Button
							className='h-14 text-base font-medium cursor-pointer disabled:cursor-not-allowed  duration-200 shadow-sm hover:shadow-md'
							disabled={mode === 'work' && status !== 'idle'}
							variant={mode === 'work' ? 'default' : 'outline'}
							onClick={() => onModeChange('work')}
						>
							<div className='flex items-center justify-center gap-2'>
								{ICONS.briefcase}
								<span>Work</span>
							</div>
						</Button>
						<Button
							className='h-14 text-base font-medium cursor-pointer disabled:cursor-not-allowed  duration-200 shadow-sm hover:shadow-md'
							disabled={mode === 'rest' && status !== 'idle'}
							variant={mode === 'rest' ? 'default' : 'outline'}
							onClick={() => onModeChange('rest')}
						>
							<div className='flex items-center justify-center gap-2'>
								{ICONS.coffee}
								<span>Rest</span>
							</div>
						</Button>
						<Button
							className='h-14 text-base font-medium cursor-pointer disabled:cursor-not-allowed  duration-200 shadow-sm hover:shadow-md'
							disabled={status === 'idle' && workTime === 0 && restTime === 0}
							variant='outline'
							onClick={onPause}
						>
							<div className='flex items-center justify-center gap-2'>
								{status === 'idle' ? (
									<>
										{ICONS.play}
										<span>Resume</span>
									</>
								) : (
									<>
										{ICONS.pause}
										<span>Pause</span>
									</>
								)}
							</div>
						</Button>
						<Button
							className='h-14 text-base font-medium cursor-pointer disabled:cursor-not-allowed  duration-200 shadow-sm hover:shadow-md'
							disabled={workTime === 0 && restTime === 0}
							variant='outline'
							onClick={onReset}
						>
							<div className='flex items-center justify-center gap-2'>
								{ICONS.reset}
								<span>Reset</span>
							</div>
						</Button>
					</div>
				</CardContent>
			</Card>
		)
	}
)

HeaderControls.displayName = 'HeaderControls'
