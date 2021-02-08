export default (searchProperties, record) => (searchKeyword) =>
  !!searchProperties
    ? searchProperties.length !== 0
      ? searchProperties.some((property) => record[property].toLowerCase().includes(searchKeyword.toLowerCase()))
      : true
    : true;
