import { useEffect, useState, useMemo } from 'react'

import { TimeRangeType, TimePointType } from './type'

const range24H = { from: 0, to: 23 }

const normalizedTimeRanges = (timeRanges: TimeRangeType[] | undefined) => {
  if (!timeRanges?.length) return [range24H]
  // Step 1: Sort the time ranges by the 'from' value
  timeRanges.sort((a, b) => a.from - b.from)

  // Step 2: Merge overlapping time ranges
  const timeRangesRes: TimeRangeType[] = []
  let currentRange = timeRanges[0]

  for (let i = 1; i < timeRanges.length; i += 1) {
    if (currentRange.from >= currentRange.to) {
      console.error('error timeRanges : from must be smaller than to')
      return [range24H]
    }

    const nextRange = timeRanges[i]

    if (nextRange.from <= currentRange.to + 1) {
      // Merge overlapping ranges
      currentRange.to = Math.max(currentRange.to, nextRange.to)
    } else {
      // No overlap, add the current range to normalizedTimeRange and update currentRange
      timeRangesRes.push({
        from: Math.floor(currentRange.from),
        to: Math.floor(currentRange.to)
      })
      currentRange = nextRange
    }
  }

  // Add the last range
  timeRangesRes.push({
    from: Math.floor(currentRange.from),
    to: Math.floor(currentRange.to)
  })

  return timeRangesRes
}

type useTimeScheduleType = {
  widthContainer: number
  timeRanges?: TimeRangeType[]
}
type useTimeScheduleReturnType = {
  widthHour: number
  timePoints: TimePointType[]
}

function useTimeSchedule({
  widthContainer,
  timeRanges
}: useTimeScheduleType): useTimeScheduleReturnType {
  const [widthHour, setWidthHour] = useState(0)
  const [timePoints, setTimePoints] = useState<TimePointType[]>([])

  const normolizeRangeMemo = useMemo(
    () => normalizedTimeRanges(timeRanges),
    [timeRanges]
  )

  // hook to setWidthHour
  useEffect(() => {
    const totalPart = normolizeRangeMemo.reduce(
      (total, range) => total + (range.to - range.from + 2),
      0
    )
    let widthPart = widthContainer / totalPart
    if (widthPart < 45) {
      widthPart = 45
    }
    setWidthHour(widthPart)
  }, [widthContainer, normolizeRangeMemo])

  // hook to setTimePoints
  useEffect(() => {
    const listTimePoints: TimePointType[] = []
    // generate time points
    normolizeRangeMemo.forEach(({ from, to }) => {
      const hours = Array.from(
        { length: to - from + 1 },
        (_, index) => index + from
      )

      const pointPrev = listTimePoints[listTimePoints.length - 1]
      const positionOrigin = pointPrev ? pointPrev.leftPosition + widthHour : 0
      // point is empty
      listTimePoints.push({
        value: from - 1,
        range: {
          from: pointPrev ? pointPrev.value + 1 : Number.NEGATIVE_INFINITY,
          to: from - 1
        },
        leftPosition: positionOrigin,
        isEmpty: true
      })

      // points in range
      hours.forEach((hour, indexHour) => {
        listTimePoints.push({
          value: hour,
          leftPosition: positionOrigin + (indexHour + 1) * widthHour
        })
      })
    })
    setTimePoints(listTimePoints)
  }, [widthHour])

  return { widthHour, timePoints }
}

export default useTimeSchedule
