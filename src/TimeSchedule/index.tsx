import React, { useCallback, ReactNode } from 'react'

import TimeBar from './TimeBar'
import CellTimeShedule, { CellTimeSheduleProps } from './CellTimeShedule'
import useTimeSchedule from './useTimeSchedule'

import { TimeRangeType } from './type'

type TimeScheduleProps = {
  widthContainer: number
  timeRanges?: TimeRangeType[]
  emptyElement?: JSX.Element
  format?: string
  renderContent: (
    headerRenderer: ReactNode,
    cellRenderer: ReactNode,
    widthHour: number
  ) => JSX.Element
}

const TimeSchedule = ({
  widthContainer,
  timeRanges,
  emptyElement,
  format,
  renderContent
}: TimeScheduleProps) => {
  const { widthHour, timePoints } = useTimeSchedule({
    timeRanges,
    widthContainer
  })
  const headerRenderer = useCallback(
    () => (
      <TimeBar timePoints={timePoints} widthHour={widthHour} format={format} />
    ),
    [widthHour, timePoints]
  )
  const cellRenderer = useCallback(
    (props: Omit<CellTimeSheduleProps, 'timePoints' | 'widthHour'>) => (
      <CellTimeShedule
        {...props}
        timePoints={timePoints}
        widthHour={widthHour}
      />
    ),
    [widthHour, timePoints]
  )
  if (renderContent) {
    return renderContent(
      headerRenderer,
      cellRenderer,
      widthHour * timePoints.length
    )
  }
  return <div>{emptyElement ? emptyElement : 'Empty'}</div>
}

export default TimeSchedule
