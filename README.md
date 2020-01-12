# babel-plugin-try-import
try import module in webpack

#### what will this plugin do ?

convert 
```
let react = tryImport('react');
```
into

```
let react;
try {
  react = require('react').default;
} catch (error) {}

```
so that webpack won't throw error while `react` is not exist

convert
```
let hasReact = hasModule('react');
```
into

```
let hasReact = false;

try {
  require.resolveWeak('react');
  hasReact = true;
} catch (error) {}

```
so that you can check if a module exists