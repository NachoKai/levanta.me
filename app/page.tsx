'use client'

import { WorkTimer } from '@/components/work-timer'

export default function Page() {
	return (
		<main className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='min-h-screen backdrop-blur-[0.5px]'>
				<WorkTimer />
			</div>
		</main>
	)
}
