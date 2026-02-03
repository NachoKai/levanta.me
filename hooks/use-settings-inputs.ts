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
	const [workDurationInput, setWorkDurationInput] = useState(`${workDuration}`)
	const [restDurationInput, setRestDurationInput] = useState(`${restDuration}`)
	const [timerIntervalInput, setTimerIntervalInput] = useState(`${timerInterval}`)
	const [waterIntervalInput, setWaterIntervalInput] = useState(`${waterInterval}`)

	useEffect(() => {
		setWorkDurationInput(`${workDuration}`)
	}, [workDuration])

	useEffect(() => {
		setRestDurationInput(`${restDuration}`)
	}, [restDuration])

	useEffect(() => {
		setTimerIntervalInput(`${timerInterval}`)
	}, [timerInterval])

	useEffect(() => {
		setWaterIntervalInput(`${waterInterval}`)
	}, [waterInterval])

	const createNumberInputHandler = (
		setter: (value: string) => void,
		onChange: (value: number) => void
	) => {
		return (value: string) => {
			setter(value)
			if (value === '' || value === '-') {
				onChange(0)
			} else {
				const num = Number(value)

				if (!isNaN(num)) {
					onChange(num)
				}
			}
		}
	}

	const handleWorkDurationChange = createNumberInputHandler(
		setWorkDurationInput,
		onWorkDurationChange
	)

	const handleRestDurationChange = createNumberInputHandler(
		setRestDurationInput,
		onRestDurationChange
	)

	const handleTimerIntervalChange = createNumberInputHandler(
		setTimerIntervalInput,
		onTimerIntervalChange
	)

	const handleWaterIntervalChange = createNumberInputHandler(
		setWaterIntervalInput,
		onWaterIntervalChange
	)

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
