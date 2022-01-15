import {promises as fs} from 'fs'
import {Parser as CSSParser} from './css.js'
// eslint-disable-next-line import/no-unresolved

// const htmlPath = './src/milestones/0000/sample.html';
const cssPath = './src/milestones/0000/sample.css'

const exec = async () => {
  // const rawHtml = await fs.readFile(htmlPath, 'utf-8');
  const rawCss = await fs.readFile(cssPath, 'utf-8')
  // const dom = HTMLParser.parse(rawHtml)
  const css = CSSParser.parse(rawCss)
  // console.log(dom)
  console.log(css)
}
exec()
  .then(message => console.log('success', message))
  .catch(err => console.log('failed', err))
