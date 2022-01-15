import {promises as fs} from 'fs';

const htmlPath = './src/milestones/0000/sample.html';
const cssPath = './src/milestones/0000/sample.css';

const exec = async () => {
  const html = await fs.readFile(htmlPath, 'utf-8');
  const css = await fs.readFile(cssPath, 'utf-8');
  console.log(html)
  console.log(css)
}
exec()
  .then(message => console.log('success', message))
  .catch(err => console.log('failed', err))
