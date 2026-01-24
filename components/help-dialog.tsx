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
import { HelpCircle, Keyboard, Info, Zap } from 'lucide-react'

export function HelpDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					className='fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-transparent cursor-pointer'
				>
					<HelpCircle className='h-5 w-5' />
					<span className='sr-only'>Help</span>
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='text-2xl'>Levanta.me Help</DialogTitle>
					<DialogDescription>
						Learn how to use the productivity timer effectively
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-6 pt-4'>
					{/* Keyboard Shortcuts */}
					<div>
						<h3 className='flex items-center gap-2 font-semibold text-lg mb-3'>
							<Keyboard className='h-5 w-5' />
							Keyboard Shortcuts
						</h3>
						<div className='grid gap-2 text-sm'>
							<div className='flex items-center justify-between p-2 rounded bg-muted'>
								<span>Switch to Work mode</span>
								<kbd className='px-2 py-1 bg-background border rounded text-xs font-mono'>
									W
								</kbd>
							</div>
							<div className='flex items-center justify-between p-2 rounded bg-muted'>
								<span>Switch to Rest mode</span>
								<kbd className='px-2 py-1 bg-background border rounded text-xs font-mono'>
									R
								</kbd>
							</div>
							<div className='flex items-center justify-between p-2 rounded bg-muted'>
								<span>Pause timer</span>
								<div className='flex gap-2'>
									<kbd className='px-2 py-1 bg-background border rounded text-xs font-mono'>
										P
									</kbd>
									<span className='text-muted-foreground'>or</span>
									<kbd className='px-2 py-1 bg-background border rounded text-xs font-mono'>
										Space
									</kbd>
								</div>
							</div>
							<div className='flex items-center justify-between p-2 rounded bg-muted'>
								<span>Reset all timers</span>
								<kbd className='px-2 py-1 bg-background border rounded text-xs font-mono'>
									Shift + R
								</kbd>
							</div>
						</div>
					</div>

					{/* How It Works */}
					<div>
						<h3 className='flex items-center gap-2 font-semibold text-lg mb-3'>
							<Info className='h-5 w-5' />
							How It Works
						</h3>
						<div className='space-y-3 text-sm'>
							<div className='p-3 rounded bg-muted'>
								<h4 className='font-medium mb-1'>Manual Mode (Camera OFF)</h4>
								<p className='text-muted-foreground'>
									Click Work or Rest buttons to manually start tracking time. Perfect for
									when you don&apos;t want to use the camera.
								</p>
							</div>
							<div className='p-3 rounded bg-muted'>
								<h4 className='font-medium mb-1'>Automatic Mode (Camera ON)</h4>
								<p className='text-muted-foreground'>
									Timer automatically starts when your face is detected and pauses when
									you leave. Great for hands-free tracking.
								</p>
							</div>
						</div>
					</div>

					{/* Tips */}
					<div>
						<h3 className='flex items-center gap-2 font-semibold text-lg mb-3'>
							<Zap className='h-5 w-5' />
							Pro Tips
						</h3>
						<ul className='space-y-2 text-sm text-muted-foreground'>
							<li className='flex gap-2'>
								<span className='text-primary'>•</span>
								<span>
									Set Work/Rest durations to get notified when time is up - you manually
									switch modes when ready
								</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-primary'>•</span>
								<span>
									Enable Timer Reminders to get periodic notifications during long work
									sessions
								</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-primary'>•</span>
								<span>Use Water Reminders to stay hydrated throughout the day</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-primary'>•</span>
								<span>
									Connect Telegram bot to receive notifications on your phone (requires
									bot token and chat ID)
								</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-primary'>•</span>
								<span>
									Your settings and timer data are saved locally in your browser
								</span>
							</li>
							<li className='flex gap-2'>
								<span className='text-primary'>•</span>
								<span>Set any interval to 0 to disable that specific feature</span>
							</li>
						</ul>
					</div>

					{/* Face Detection Setup */}
					<div className='p-4 rounded border bg-muted/30'>
						<h4 className='font-medium mb-2'>Face Detection Setup</h4>
						<p className='text-sm text-muted-foreground mb-2'>
							To use face detection, download the required models:
						</p>
						<code className='block p-2 bg-background rounded text-xs font-mono'>
							node scripts/download-models.mjs
						</code>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
