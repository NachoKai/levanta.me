'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useFaceDetection() {
	const [isFaceDetected, setIsFaceDetected] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const videoRef = useRef<HTMLVideoElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const detectorRef = useRef<any>(null)
	const animationFrameRef = useRef<number | null>(null)
	const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

	const loadFaceDetector = useCallback(async () => {
		try {
			const faceapi = await import('@vladmandic/face-api')
			let modelUrl = '/models'

			try {
				const testResponse = await fetch(
					'/models/tiny_face_detector_model-weights_manifest.json'
				)

				if (!testResponse.ok) throw new Error('Local models not found')
			} catch (e) {
				console.warn('Local models not found, falling back to CDN')
				modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'
			}

			const loadResults = await Promise.allSettled([
				faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
				faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
				faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
			])

			const failedLoads = loadResults.filter(result => result.status === 'rejected')

			if (failedLoads.length > 0) {
				console.warn(
					'Some models failed to load:',
					failedLoads.map(r => r.reason)
				)
				if (failedLoads.length === loadResults.length) {
					throw new Error('All models failed to load')
				}
			}

			detectorRef.current = faceapi

			return true
		} catch (err) {
			console.error('Failed to load face detection models:', err)
			setError(
				'Failed to load face detection models. Please check your internet connection.'
			)

			return false
		}
	}, [])

	const detectFaces = useCallback(async () => {
		if (
			!videoRef.current ||
			!canvasRef.current ||
			!detectorRef.current ||
			videoRef.current.paused ||
			videoRef.current.ended
		) {
			return
		}

		try {
			const faceapi = detectorRef.current

			const displaySize = {
				width: videoRef.current.videoWidth,
				height: videoRef.current.videoHeight,
			}

			if (displaySize.width === 0 || displaySize.height === 0) {
				return
			}

			faceapi.matchDimensions(canvasRef.current, displaySize)

			const detections = await faceapi
				.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
				.withFaceLandmarks()

			const resizedDetections = faceapi.resizeResults(detections, displaySize)
			const ctx = canvasRef.current.getContext('2d')

			if (ctx) {
				ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
				faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
				faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
			}

			setIsFaceDetected(detections.length > 0)
		} catch (err) {
			console.error('Face detection error:', err)
		}
	}, [])

	const startCamera = useCallback(async () => {
		setIsLoading(true)
		setError(null)

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { width: 640, height: 480 },
			})

			if (videoRef.current) {
				videoRef.current.srcObject = stream
				videoRef.current.onloadedmetadata = () => {
					videoRef.current?.play().catch(e => console.error('Play error:', e))
				}
			}
			streamRef.current = stream

			if (!detectorRef.current) {
				const loaded = await loadFaceDetector()

				if (!loaded) {
					setIsLoading(false)

					return
				}
			}

			detectionIntervalRef.current = setInterval(detectFaces, 2000) // Check face every 2 seconds
			setIsLoading(false)
		} catch (err) {
			console.error('Camera access error:', err)
			setError('Failed to access camera. Please allow camera permissions.')
			setIsLoading(false)
		}
	}, [loadFaceDetector, detectFaces])

	const stopCamera = useCallback(() => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current)
			animationFrameRef.current = null
		}

		if (detectionIntervalRef.current) {
			clearInterval(detectionIntervalRef.current)
			detectionIntervalRef.current = null
		}

		if (streamRef.current) {
			streamRef.current.getTracks().forEach(track => track.stop())
			streamRef.current = null
		}

		if (videoRef.current) {
			videoRef.current.srcObject = null
		}

		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d')

			if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
		}

		setIsFaceDetected(false)
	}, [])

	useEffect(() => {
		return () => {
			stopCamera()
		}
	}, [stopCamera])

	return {
		videoRef,
		canvasRef,
		isFaceDetected,
		isLoading,
		error,
		startCamera,
		stopCamera,
	}
}
