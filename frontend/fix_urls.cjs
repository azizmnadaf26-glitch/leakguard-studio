const fs = require('fs');
const walk = dir => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if(file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
};
const files = walk('./src/components');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/\"\/api\//g, '`${import.meta.env.VITE_API_URL || \'http://localhost:8000\'}/api/');
  newContent = newContent.replace(/`\${import.meta.env.VITE_API_URL \|\| 'http:\/\/localhost:8000'}\/api\/[a-zA-Z0-9_\-\/]+(\?[a-zA-Z0-9_=&${}]*)?\"/g, match => {
    return match.slice(0, -1) + '`'; // replace closing double quote with backtick
  });
  // Fix the previously broken templated URLs
  newContent = newContent.replace(/`\/(api\/[^`]+)`/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:8000\'}/$1`');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed ' + file);
  }
});
