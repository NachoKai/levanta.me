import { memo } from 'react'
import { Briefcase, Coffee } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const ICONS = {
	briefcase: <Briefcase className='h-6 w-6' />,
	coffee: <Coffee className='h-6 w-6' />,
} as const

export const CompletionNotifications = memo(
	({
		mode,
		restCompleted,
		restDuration,
		workCompleted,
		workDuration,
	}: {
		mode: 'work' | 'rest'
		restCompleted: boolean
		restDuration: number
		workCompleted: boolean
		workDuration: number
	}) => {
		return (
			<>
				{workCompleted && mode === 'work' && (
					<Card className='border-2 border-blue-500/30 bg-linear-to-r from-blue-500/10 to-blue-600/10 shadow-lg shadow-blue-500/10 animate-pulse'>
						<CardContent className='p-6'>
							<div className='flex items-center gap-4'>
								<div className='p-3 bg-blue-500 text-white rounded-full'>
									{ICONS.coffee}
								</div>
								<div className='flex-1'>
									<p className='text-xl font-semibold text-blue-700 dark:text-blue-300'>
										Work Complete! Time for a Break
									</p>
									<p className='text-base text-blue-600/70 dark:text-blue-400/70 mt-1'>
										You&apos;ve worked for {workDuration} minutes. Click Rest to start
										your break.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
				{restCompleted && mode === 'rest' && (
					<Card className='border-2 border-green-500/30 bg-linear-to-r from-green-500/10 to-green-600/10 shadow-lg shadow-green-500/10 animate-pulse'>
						<CardContent className='p-6'>
							<div className='flex items-center gap-4'>
								<div className='p-3 bg-green-500 text-white rounded-full'>
									{ICONS.briefcase}
								</div>
								<div className='flex-1'>
									<p className='text-xl font-semibold text-green-700 dark:text-green-300'>
										Rest Complete! Ready to Work
									</p>
									<p className='text-base text-green-600/70 dark:text-green-400/70 mt-1'>
										You&apos;ve rested for {restDuration} minutes. Click Work to resume.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</>
		)
	}
)

CompletionNotifications.displayName = 'CompletionNotifications'
