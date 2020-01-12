let a = tryImport('react');

let m = tryImport('@react/types', () => { });

const hasReact = hasModule('react')