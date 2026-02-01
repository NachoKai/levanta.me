'use client'

import { useEffect, useState } from 'react'

export function useSettingsInputs({
	workDuration,
	restDuration,
	timerInterval,
	waterInterval,
	onWorkDurationChange,
	onRestDurationChange,
	onTimerIntervalChange,
	onWaterIntervalChange,
}: {
	workDuration: number
	restDuration: number
	timerInterval: number
	waterInterval: number
	onWorkDurationChange: (value: number) => void
	onRestDurationChange: (value: number) => void
	onTimerIntervalChange: (value: number) => void
	onWaterIntervalChange: (value: number) => void
}) {
	const [workDurationInput, setWorkDurationInput] = useState(String(workDuration))
	const [restDurationInput, setRestDurationInput] = useState(String(restDuration))
	const [timerIntervalInput, setTimerIntervalInput] = useState(String(timerInterval))
	const [waterIntervalInput, setWaterIntervalInput] = useState(String(waterInterval))

	useEffect(() => {
		setWorkDurationInput(String(workDuration))
	}, [workDuration])

	useEffect(() => {
		setRestDurationInput(String(restDuration))
	}, [restDuration])

	useEffect(() => {
		setTimerIntervalInput(String(timerInterval))
	}, [timerInterval])

	useEffect(() => {
		setWaterIntervalInput(String(waterInterval))
	}, [waterInterval])

	const handleWorkDurationChange = (value: string) => {
		setWorkDurationInput(value)
		if (value === '' || value === '-') {
			onWorkDurationChange(0)
		} else {
			const num = Number(value)

			if (!isNaN(num)) {
				onWorkDurationChange(num)
			}
		}
	}

	const handleRestDurationChange = (value: string) => {
		setRestDurationInput(value)
		if (value === '' || value === '-') {
			onRestDurationChange(0)
		} else {
			const num = Number(value)

			if (!isNaN(num)) {
				onRestDurationChange(num)
			}
		}
	}

	const handleTimerIntervalChange = (value: string) => {
		setTimerIntervalInput(value)
		if (value === '' || value === '-') {
			onTimerIntervalChange(0)
		} else {
			const num = Number(value)

			if (!isNaN(num)) {
				onTimerIntervalChange(num)
			}
		}
	}

	const handleWaterIntervalChange = (value: string) => {
		setWaterIntervalInput(value)
		if (value === '' || value === '-') {
			onWaterIntervalChange(0)
		} else {
			const num = Number(value)

			if (!isNaN(num)) {
				onWaterIntervalChange(num)
			}
		}
	}

	return {
		workDurationInput,
		restDurationInput,
		timerIntervalInput,
		waterIntervalInput,
		handleWorkDurationChange,
		handleRestDurationChange,
		handleTimerIntervalChange,
		handleWaterIntervalChange,
	}
}
