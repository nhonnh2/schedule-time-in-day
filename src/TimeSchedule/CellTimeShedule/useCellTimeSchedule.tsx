import React, { useEffect, useState } from 'react'

import { TimePointType } from '../type'

type useCellTimeScheduleProps = {
  startTime: number
  endTime: number
  widthHour: number
  timePoints: TimePointType[]
  originTime?: number
}

type useCellTimeScheduleReturnType = {
  width: number
  leftPosition: number
  overflowedClassName: string
}

const useCellTimeSchedule = ({
  startTime,
  endTime,
  timePoints,
  originTime,
  widthHour
}: useCellTimeScheduleProps): useCellTimeScheduleReturnType => {
  const lastPoint = timePoints[timePoints.length - 1] || 0
  const firstPoint = timePoints[0] || 0

  const [leftPosition, setLeftPosition] = useState(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (startTime >= endTime) return

    const originPosition = originTime ? findTimePosition(originTime) : 0

    const startPosition = findTimePosition(startTime) - originPosition

    const endPosition = findTimePosition(endTime) - originPosition

    const widthNew = endPosition - startPosition

    setLeftPosition(startPosition)
    setWidth(widthNew)
  }, [startTime, endTime, timePoints])

  const findTimePosition = (timeValue: number) => {
    const maxPosition = lastPoint.leftPosition + widthHour
    if (timeValue >= lastPoint.value + 1) return maxPosition

    const remainTime = widthHour * (timeValue % 1)
    const timePoint = timePoints.find(
      (point) =>
        point.value === Math.floor(timeValue) ||
        (point.range &&
          point.range.from <= timeValue &&
          point.range.to >= timeValue)
    )

    if (!timePoint) return 0

    return (
      timePoint.leftPosition +
      (timePoint.value === Math.floor(timeValue) ? Math.abs(remainTime) : 0)
    )
  }

  const overflowedClassName = () => {
    if (startTime < firstPoint.value) {
      return 'cell-overflowed-start'
    }

    if (endTime > lastPoint.value + 1) {
      return 'cell-overflowed-end'
    }

    return ''
  }

  return { width, leftPosition, overflowedClassName: overflowedClassName() }
}

export default useCellTimeSchedule
