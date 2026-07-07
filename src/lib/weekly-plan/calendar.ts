export function generateWeekDates(
  startDate: Date
) {
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);

    date.setDate(
      startDate.getDate() + i
    );

    dates.push(date);
  }

  return dates;
}