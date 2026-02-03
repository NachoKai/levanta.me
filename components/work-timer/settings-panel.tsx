import { memo } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'

const ICONS = {
	briefcase: <Briefcase className='h-5 w-5' />,
	coffee: <Coffee className='h-5 w-5' />,
	clock: <Clock className='h-5 w-5' />,
	bell: <Bell className='h-5 w-5' />,
	telegram: <MessageSquare className='h-5 w-5' />,
	camera: <Camera className='h-5 w-5' />,
	water: <Droplet className='h-5 w-5' />,
	eye: <Eye className='h-4 w-4' />,
	eyeOff: <EyeOff className='h-4 w-4' />,
} as const

export const SettingsPanel = memo(
	({
		onTelegramChatIdChange,
		onTelegramTokenChange,
		onTimerIntervalChange,
		onToggleBrowserNotifications,
		onToggleCameraDetection,
		onToggleShowChatId,
		onToggleShowToken,
		onToggleTelegramNotifications,
		onWaterIntervalChange,
		onWorkDurationChange,
		onRestDurationChange,
		restDurationInput,
		showChatId,
		showToken,
		telegramChatId,
		telegramToken,
		timerIntervalInput,
		useBrowserNotifications,
		useCameraDetection,
		useTelegramNotifications,
		waterIntervalInput,
		workDurationInput,
	}: {
		onTelegramChatIdChange: (_value: string) => void
		onTelegramTokenChange: (_value: string) => void
		onTimerIntervalChange: (_value: string) => void
		onToggleBrowserNotifications: (_checked: boolean) => void
		onToggleCameraDetection: (_checked: boolean) => void
		onToggleShowChatId: () => void
		onToggleShowToken: () => void
		onToggleTelegramNotifications: (_checked: boolean) => void
		onWaterIntervalChange: (_value: string) => void
		onWorkDurationChange: (_value: string) => void
		onRestDurationChange: (_value: string) => void
		restDurationInput: string
		showChatId: boolean
		showToken: boolean
		telegramChatId: string
		telegramToken: string
		timerIntervalInput: string
		useBrowserNotifications: boolean
		useCameraDetection: boolean
		useTelegramNotifications: boolean
		waterIntervalInput: string
		workDurationInput: string
	}) => {
		return (
			<Card className='border-2 shadow-sm'>
				<CardContent className='p-8 space-y-8'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-muted rounded-lg'>{ICONS.bell}</div>
						<h3 className='text-xl font-semibold'>Settings</h3>
					</div>

					{/* Duration Settings */}
					<div className='space-y-6'>
						<div className='grid gap-6 md:grid-cols-2'>
							<div className='space-y-3'>
								<Label
									className='flex items-center gap-2 text-base font-medium'
									htmlFor='work-duration'
								>
									<div className='p-1.5 bg-primary/10 text-primary rounded'>
										{ICONS.briefcase}
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
									onChange={e => onWorkDurationChange(e.target.value)}
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
										{ICONS.coffee}
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
									onChange={e => onRestDurationChange(e.target.value)}
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
										{ICONS.clock}
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
									onChange={e => onTimerIntervalChange(e.target.value)}
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
										{ICONS.water}
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
									onChange={e => onWaterIntervalChange(e.target.value)}
								/>
								<p className='text-xs text-muted-foreground'>
									Minutes between hydration reminders
								</p>
							</div>
						</div>
					</div>

					{/* Telegram Settings */}
					<div className='space-y-6'>
						<div className='grid gap-6 md:grid-cols-2'>
							<div className='space-y-3'>
								<Label
									className='flex items-center gap-2 text-base font-medium'
									htmlFor='telegram-token'
								>
									{ICONS.telegram}
									Bot Token
								</Label>
								<div className='relative'>
									<Input
										className='h-11 pr-11 text-base'
										id='telegram-token'
										placeholder='Bot Token from @BotFather'
										type={showToken ? 'text' : 'password'}
										value={telegramToken}
										onChange={e => onTelegramTokenChange(e.target.value)}
									/>
									<Button
										className='absolute right-0 top-0 h-11 w-11 rounded-l-none hover:bg-muted cursor-pointer'
										size='icon'
										type='button'
										variant='ghost'
										onClick={onToggleShowToken}
									>
										{showToken ? ICONS.eyeOff : ICONS.eye}
										<span className='sr-only'>Toggle token visibility</span>
									</Button>
								</div>
							</div>

							<div className='space-y-3'>
								<Label
									className='flex items-center gap-2 text-base font-medium'
									htmlFor='telegram-chat'
								>
									{ICONS.telegram}
									Chat ID
								</Label>
								<div className='relative'>
									<Input
										className='h-11 pr-11 text-base'
										id='telegram-chat'
										placeholder='Your Chat ID'
										type={showChatId ? 'text' : 'password'}
										value={telegramChatId}
										onChange={e => onTelegramChatIdChange(e.target.value)}
									/>
									<Button
										className='absolute right-0 top-0 h-11 w-11 rounded-l-none hover:bg-muted cursor-pointer'
										size='icon'
										type='button'
										variant='ghost'
										onClick={onToggleShowChatId}
									>
										{showChatId ? ICONS.eyeOff : ICONS.eye}
										<span className='sr-only'>Toggle chat ID visibility</span>
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Feature Toggles */}
					<div className='space-y-6 pt-6'>
						<div className='space-y-4'>
							<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3'>
									{ICONS.bell}
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
									onCheckedChange={onToggleBrowserNotifications}
								/>
							</div>

							<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3'>
									{ICONS.telegram}
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
									onCheckedChange={onToggleTelegramNotifications}
								/>
							</div>

							<div className='flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 '>
								<div className='flex items-center gap-3'>
									{ICONS.camera}
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
									onCheckedChange={onToggleCameraDetection}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}
)

SettingsPanel.displayName = 'SettingsPanel'
