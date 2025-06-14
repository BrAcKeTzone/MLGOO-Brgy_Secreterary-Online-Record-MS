export const CURRENT_YEAR = new Date().getFullYear().toString();

export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 2020; year--) {
    years.push({ _id: year.toString(), name: year.toString() });
  }
  return years;
};