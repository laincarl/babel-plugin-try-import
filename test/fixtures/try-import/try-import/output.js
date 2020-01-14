let dd = function () {
  let temp;

  try {
    temp = require('react').default;
  } catch (error) {}

  return temp;
}();

let m = function () {
  let temp = () => {};

  try {
    temp = require('@react/types').default;
  } catch (error) {}

  return temp;
}();

const hasReact = function () {
  let temp = false;

  try {
    require.resolveWeak('react');

    temp = true;
  } catch (error) {}

  return temp;
}();