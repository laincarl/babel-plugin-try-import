# babel-plugin-try-import

try import module in webpack

#### what does this plugin do

convert

```javascript
let react = tryImport('react');
```

into

```javascript
let react = function () {
  let temp;

  try {
    temp = require('react').default;
  } catch (error) {}

  return temp;
}()
```

so that webpack won't throw error while `react` is not exist

convert

```javascript
let hasReact = hasModule('react');
```

into

```javascript
let hasReact = function () {
  let temp = false;

  try {
    require.resolveWeak('react');

    temp = true;
  } catch (error) {}

  return temp;
}()

```

so that you can check if a module exists
