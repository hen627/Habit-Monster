export const Weekdays = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

export const getCurrentDay = () => {
  const today = new Date().getDay();
  return today === 0 ? Weekdays[6].name : Weekdays[today - 1].name;
};

export const randomHexColor = () => {
  return "#000000".replace(/0/g, () => {
    return Math.round(Math.random() * 16).toString(16);
  });
};
