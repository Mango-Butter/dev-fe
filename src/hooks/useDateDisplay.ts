// components/common/RangeDatePicker/useDateDisplay.ts
export const formatDate = (date: Date) =>
  `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
