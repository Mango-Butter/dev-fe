import { formatDateToKSTString } from "../libs/date.ts";

export const getQuarterDateRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0~11

  let startMonth = 0;
  let endMonth = 2;

  if (month < 3) {
    startMonth = 0;
    endMonth = 2; // Q1
  } else if (month < 6) {
    startMonth = 3;
    endMonth = 5; // Q2
  } else if (month < 9) {
    startMonth = 6;
    endMonth = 8; // Q3
  } else {
    startMonth = 9;
    endMonth = 11; // Q4
  }

  const startDate = new Date(year, startMonth, 1);
  const endDate = new Date(year, endMonth + 1, 0); // 마지막 날

  return {
    start: formatDateToKSTString(startDate),
    end: formatDateToKSTString(endDate),
  };
};
