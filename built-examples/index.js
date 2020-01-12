let a;

try {
  a = require('react').default;
} catch (error) {}

let m = () => {};

try {
  m = require('@react/types').default;
} catch (error) {}

let hasReact = false;

try {
  require.resolveWeak('react');

  hasReact = true;
} catch (error) {}