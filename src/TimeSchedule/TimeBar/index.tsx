import React from 'react'

import { TimePointType } from '../type'

import moment from 'moment'

import './style.css'

type TimeBarProps = {
  timePoints: TimePointType[]
  widthHour: number
  format?: string
}

const TimeBar = ({ timePoints, widthHour, format }: TimeBarProps) => {
  const generateNameHour = (value: number) => {
    let extra = ''

    if (value >= 24) {
      value -= 24
      extra = ` DA`
    }
    const resName = moment(`${value}:00`, 'HH:mm').format(format)
    if (format === 'HH:mm') {
      return extra ? resName.replace(':00', extra) : resName
    }

    return (
      <div className='d-flex align-items-center justify-content-center flex-column'>
        {resName.replace(':00', '').toUpperCase()}
        {extra ? <span>{extra}</span> : null}
      </div>
    )
  }
  return (
    <div className='time-bar'>
      {timePoints?.map(({ value, leftPosition, isEmpty }) => (
        <div
          className={`time-hour ${isEmpty ? 'time-hour__empty' : ''}`}
          key={value}
          style={{ left: leftPosition, width: widthHour }}
        >
          {!isEmpty ? (
            <span className='time-name'>{generateNameHour(value)}</span>
          ) : (
            <span></span>
          )}
        </div>
      ))}
    </div>
  )
}

export default TimeBar
