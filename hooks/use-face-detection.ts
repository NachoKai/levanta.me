'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useFaceDetection() {
	const [isFaceDetected, setIsFaceDetected] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const videoRef = useRef<HTMLVideoElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const detectorRef = useRef<any>(null)
	const animationFrameRef = useRef<number | null>(null)

	const loadFaceDetector = useCallback(async () => {
		try {
			const testResponse = await fetch(
				'/models/tiny_face_detector_model-weights_manifest.json'
			)

			if (!testResponse.ok) {
				throw new Error('Models not found. Please download face detection models first.')
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
				'Face detection models not found. Run: npx degit vladmandic/face-api/model public/models to download them, then restart the app.'

			setError(errorMessage)

			return false
		}
	}, [])

	const detectFaces = useCallback(async () => {
		if (!videoRef.current || !detectorRef.current) return

		try {
			const faceapi = detectorRef.current
			const detections = await faceapi.detectAllFaces(
				videoRef.current,
				new faceapi.TinyFaceDetectorOptions()
			)

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
			if (!detectorRef.current) {
				const loaded = await loadFaceDetector()

				if (!loaded) {
					setIsLoading(false)

					return
				}
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: { width: 640, height: 480 },
			})

			if (!videoRef.current) {
				videoRef.current = document.createElement('video')
				videoRef.current.autoplay = true
				videoRef.current.muted = true
			}

			videoRef.current.srcObject = stream
			streamRef.current = stream

			await new Promise(resolve => {
				if (videoRef.current) {
					videoRef.current.onloadedmetadata = resolve
				}
			})

			detectFaces()
			setIsLoading(false)
		} catch (err) {
			console.error('Camera access error:', err)
			setError('Failed to access camera')
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

		setIsFaceDetected(false)
	}, [])

	useEffect(() => {
		return () => {
			stopCamera()
		}
	}, [stopCamera])

	return {
		isFaceDetected,
		isLoading,
		error,
		startCamera,
		stopCamera,
	}
}
