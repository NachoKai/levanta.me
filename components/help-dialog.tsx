'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/hooks/use-notifications'
import {
	Bell,
	Briefcase,
	Camera,
	Coffee,
	HelpCircle,
	Info,
	Keyboard,
	Pause,
	RotateCcw,
	Zap,
} from 'lucide-react'

export function HelpDialog() {
	const { sendNotification } = useNotifications()

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className='fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg cursor-pointer z-40 bg-background/80 backdrop-blur-sm border-2 hover:scale-110  duration-200 hover:shadow-xl'
					size='icon'
					variant='outline'
				>
					<HelpCircle className='h-5 w-5' />
					<span className='sr-only'>Help</span>
				</Button>
			</DialogTrigger>
			<DialogContent
				className='max-w-3xl max-h-[90vh] overflow-y-auto'
				style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
			>
				<DialogHeader>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-primary/10 text-primary rounded-lg'>
							<HelpCircle className='h-6 w-6' />
						</div>
						<div>
							<DialogTitle className='text-2xl font-bold'>Levanta.me Help</DialogTitle>
							<DialogDescription className='text-base mt-1'>
								Learn how to use the productivity timer effectively
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className='space-y-8 pt-6'>
					{/* Keyboard Shortcuts */}
					<div>
						<div className='flex items-center gap-3 mb-4'>
							<div className='p-2 bg-blue-500/10 text-blue-500 rounded-lg'>
								<Keyboard className='h-5 w-5' />
							</div>
							<h3 className='text-lg font-semibold'>Keyboard Shortcuts</h3>
						</div>
						<div className='grid gap-3'>
							<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3'>
									<Briefcase className='h-4 w-4 text-muted-foreground' />
									<span className='font-medium'>Switch to Work mode</span>
								</div>
								<kbd className='px-3 py-1.5 bg-background border rounded-md text-sm font-mono shadow-sm'>
									W
								</kbd>
							</div>
							<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3'>
									<Coffee className='h-4 w-4 text-muted-foreground' />
									<span className='font-medium'>Switch to Rest mode</span>
								</div>
								<kbd className='px-3 py-1.5 bg-background border rounded-md text-sm font-mono shadow-sm'>
									R
								</kbd>
							</div>
							<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3'>
									<Pause className='h-4 w-4 text-muted-foreground' />
									<span className='font-medium'>Pause timer</span>
								</div>
								<div className='flex gap-2 items-center'>
									<kbd className='px-3 py-1.5 bg-background border rounded-md text-sm font-mono shadow-sm'>
										P
									</kbd>
									<span className='text-muted-foreground text-sm mx-1'>or</span>
									<kbd className='px-3 py-1.5 bg-background border rounded-md text-sm font-mono shadow-sm'>
										Space
									</kbd>
								</div>
							</div>
							<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3'>
									<RotateCcw className='h-4 w-4 text-muted-foreground' />
									<span className='font-medium'>Reset all timers</span>
								</div>
								<kbd className='px-3 py-1.5 bg-background border rounded-md text-sm font-mono shadow-sm'>
									Shift + R
								</kbd>
							</div>
						</div>
					</div>

					{/* How It Works */}
					<div>
						<div className='flex items-center gap-3 mb-4'>
							<div className='p-2 bg-green-500/10 text-green-500 rounded-lg'>
								<Info className='h-5 w-5' />
							</div>
							<h3 className='text-lg font-semibold'>How It Works</h3>
						</div>
						<div className='space-y-4'>
							<div className='p-5 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3 mb-3'>
									<div className='p-2 bg-primary/10 text-primary rounded-lg'>
										<Briefcase className='h-4 w-4' />
									</div>
									<h4 className='font-semibold'>Manual Mode (Camera OFF)</h4>
								</div>
								<p className='text-muted-foreground leading-relaxed'>
									Click Work or Rest buttons to manually start tracking time. Perfect for
									when you don&apos;t want to use the camera or when you prefer full
									control over when sessions start and stop.
								</p>
							</div>
							<div className='p-5 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3 mb-3'>
									<div className='p-2 bg-blue-500/10 text-blue-500 rounded-lg'>
										<Camera className='h-4 w-4' />
									</div>
									<h4 className='font-semibold'>Automatic Mode (Camera ON)</h4>
								</div>
								<p className='text-muted-foreground leading-relaxed'>
									Timer automatically starts when your face is detected and pauses when
									you leave. Great for hands-free tracking that adapts to your natural
									work patterns.
								</p>
							</div>
						</div>
					</div>

					{/* Tips */}
					<div>
						<div className='flex items-center gap-3 mb-4'>
							<div className='p-2 bg-yellow-500/10 text-yellow-500 rounded-lg'>
								<Zap className='h-5 w-5' />
							</div>
							<h3 className='text-lg font-semibold'>Pro Tips</h3>
						</div>
						<div className='grid gap-3'>
							<div className='flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 '>
								<div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
								<p className='text-sm leading-relaxed'>
									Set Work/Rest durations to get notified when time is up - you manually
									switch modes when ready
								</p>
							</div>
							<div className='flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 '>
								<div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
								<p className='text-sm leading-relaxed'>
									Enable Timer Reminders to get periodic notifications during long work
									sessions
								</p>
							</div>
							<div className='flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 '>
								<div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
								<p className='text-sm leading-relaxed'>
									Use Water Reminders to stay hydrated throughout the day
								</p>
							</div>
							<div className='flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 '>
								<div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
								<p className='text-sm leading-relaxed'>
									Connect Telegram bot to receive notifications on your phone (requires
									bot token and chat ID)
								</p>
							</div>
							<div className='flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 '>
								<div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
								<p className='text-sm leading-relaxed'>
									Your settings and timer data are saved locally in your browser
								</p>
							</div>
							<div className='flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 '>
								<div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
								<p className='text-sm leading-relaxed'>
									Set any interval to 0 to disable that specific feature
								</p>
							</div>
						</div>
					</div>

					{/* Test Notification */}
					<div>
						<div className='flex items-center gap-3 mb-4'>
							<div className='p-2 bg-red-500/10 text-red-500 rounded-lg'>
								<Bell className='h-5 w-5' />
							</div>
							<h3 className='text-lg font-semibold'>Test Notifications</h3>
						</div>
						<div className='p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
							<p className='text-sm text-muted-foreground mb-4'>
								Test your notification settings to ensure browser and Telegram
								notifications are working correctly.
							</p>
							<Button
								className='w-full h-11 text-base font-medium cursor-pointer  duration-200'
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
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
