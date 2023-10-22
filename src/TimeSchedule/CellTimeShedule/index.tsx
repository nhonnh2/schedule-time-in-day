/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { ReactNode, MouseEvent } from 'react';

import { TimePointType } from '../type';
import useCellTimeSchedule from './useCellTimeSchedule';

export type CellTimeSheduleProps = {
  startTime: number;
  endTime: number;
  originTime?: number;
  timePoints: TimePointType[];
  styleCell?: object;
  classNameCell?: string;
  children: ReactNode;
  widthHour: number;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

const CellTimeShedule = ({
  startTime,
  endTime,
  originTime,
  timePoints,
  classNameCell,
  styleCell,
  children,
  widthHour,
  onClick,
}: CellTimeSheduleProps) => {
  const { width, leftPosition, overflowedClassName } = useCellTimeSchedule({
    startTime,
    endTime,
    timePoints,
    originTime,
    widthHour,
  });

  return width ? (
    <div
      style={{
        position: 'absolute',
        overflow: 'hidden',
        left: `${leftPosition}px`,
        width: `${width}px`,
        ...styleCell,
      }}
      className={`${classNameCell} ${overflowedClassName}`}
      onClick={(e) => onClick && onClick(e)}
    >
      {children}
    </div>
  ) : null;
};
export default CellTimeShedule;
