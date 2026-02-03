'use client'

import { createPortal } from 'react-dom'
import { useDraggable } from '@/hooks/use-draggable'

interface FaceDetectionOverlayProps {
	videoRef: React.RefObject<HTMLVideoElement | null>
	canvasRef: React.RefObject<HTMLCanvasElement | null>
	isFaceDetected: boolean
	isCameraLoading: boolean
	cameraError: string | null
}

export function FaceDetectionOverlay({
	videoRef,
	canvasRef,
	isFaceDetected,
	isCameraLoading,
	cameraError,
}: FaceDetectionOverlayProps) {
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

	return createPortal(
		<div
			className={`fixed z-999999 group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
					w-32 md:w-40 aspect-4/3 hover:scale-105 hover:shadow-3xl select-none
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
				<video ref={videoRef} muted playsInline className='w-full h-full object-cover' />
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
	)
}
