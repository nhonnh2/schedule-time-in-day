export type TimeRangeType = { from: number; to: number };

export type TimePointType = {
  value: number;
  leftPosition: number;
  isEmpty?: boolean;
  range?: TimeRangeType;
};
