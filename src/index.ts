import {promises as fs} from 'fs'
import {Parser as CSSParser} from './css.js'
import {Parser as HTMLParser} from "./dom.js";
import {genStyleTree} from "./style.js";
// eslint-disable-next-line import/no-unresolved

const htmlPath = './src/milestones/0000/sample.html';
const cssPath = './src/milestones/0000/sample.css'

const exec = async () => {
  const rawHtml = await fs.readFile(htmlPath, 'utf-8');
  const rawCss = await fs.readFile(cssPath, 'utf-8')
  const node = HTMLParser.parse(rawHtml)
  const stylesheet = CSSParser.parse(rawCss)
  const styleTree = genStyleTree(node, stylesheet)
  console.log(styleTree)

}
exec()
  .then(message => console.log('success', message))
  .catch(err => console.log('failed', err))
