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
  let newContent = content.replace(/'\/(api\/[^']+)'/g, '\${import.meta.env.VITE_API_URL || \\'http://localhost:8000\\'}/\');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed ' + file);
  }
});
