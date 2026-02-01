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

	const loadFaceDetector = useCallback(async () => {
		try {
			const testResponse = await fetch(
				'/models/tiny_face_detector_model-weights_manifest.json'
			)

			if (!testResponse.ok) {
				console.error(
					'Model manifest check failed:',
					testResponse.status,
					testResponse.statusText
				)
				throw new Error(
					`Models not found (Status: ${testResponse.status}). Please download face detection models.`
				)
			}

			const faceapi = await import('@vladmandic/face-api')
			const MODEL_URL = '/models'

			await Promise.all([
				faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
				faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
				faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
			])

			detectorRef.current = faceapi

			return true
		} catch (err) {
			console.error('Failed to load face detection models:', err)
			const errorMessage =
				'Face detection models not found or failed to load. Run: npx degit vladmandic/face-api/model public/models'

			setError(errorMessage)

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
				animationFrameRef.current = requestAnimationFrame(detectFaces)

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

			animationFrameRef.current = requestAnimationFrame(detectFaces)
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

			detectFaces()
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
