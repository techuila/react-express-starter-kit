export const booleanToNumConverter = (boolean) => {
  if (boolean === true) {
    return 1;
  }
  if (boolean === false) {
    return 0;
  }
};
export const numToBooleanConverter = (num) => {
  if (num === 1) {
    return true;
  }
  if (num === 0) {
    return false;
  }
};

export const toggleStatus = (num) => {
  if (num === 1) {
    return 0;
  }
  if (num === 0) {
    return 1;
  }
};

export const get_latest_dateHELPER = (date) => {
  const latestdate = new Date(
    Math.max.apply(
      null,
      date.map(function (e) {
        return new Date(e.valid_from);
      })
    )
  );
  return latestdate;
};
