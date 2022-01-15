import {isWhitespace} from "./util/isWhiteSpace.js";

export type Dom = {
  children: Dom[]
  nodeType: NodeType
}

export const text = (data: string): Dom => {
  return {
    children: [],
    nodeType: {
      data: data,
    },
  }
}
export const elem = (name: string, attrs: AttrMap, children: Dom[]): Dom => {
  return {
    children: children,
    nodeType: {
      data: {
        tagName: name,
        attributes: attrs,
      },
    },
  }
}

export type NodeType = Text | Element

export type Text = { data: string }

export type Element = { data: ElementData }

export type ElementData = {
  tagName: string
  attributes: AttrMap,
}

export type AttrMap = Map<string, string>;
const alphabetOrNumberPattern = /[0-9a-zA-Z]/

export class Parser {
  pos: number
  input: string

  constructor(pos: number, input: string) {
    this.pos = pos
    this.input = input
  }

  nextChar(): string {
    return this.input.charAt(this.pos)
  }

  startsWith(s: string): boolean {
    return this.input.substr(this.pos).startsWith(s)
  }

  eof(): boolean {
    return this.pos >= this.input.length
  }

  consumeChar(): string {
    const nextChar = this.input.charAt(this.pos)
    this.pos += 1
    return nextChar
  }

  consumeWhile(test: (char: string) => boolean): string {
    let result = ''
    while (!this.eof() && test(this.nextChar())) {
      result += this.consumeChar()
    }
    return result
  }

  consumeWhiteSpace() {
    this.consumeWhile((char) => isWhitespace(char))
  }

  parseTagName(): string {
    return this.consumeWhile((c) => {
      return alphabetOrNumberPattern.test(c)
    })
  }

  parseNode(): Dom {
    switch (this.nextChar()) {
      case '<':
        return this.parseElement()
      default:
        return this.parseText()
    }
  }

  parseText(): Dom {
    return text(this.consumeWhile((c) => {
      return c != '<'
    }))
  }

  parseElement(): Dom {
    this.consumeChar()
    const tagName = this.parseTagName()
    const attrs = this.parseAttributes()
    this.consumeChar()

    const children = this.parseNodes()

    this.consumeChar()
    this.consumeChar()
    this.parseTagName()
    this.consumeChar()
    return elem(tagName, attrs, children)
  }

  parseAttr(): [string, string] {
    const name = this.parseTagName()
    this.consumeChar()
    const value = this.parseAttrValue()
    return [name, value]
  }

  parseAttrValue(): string {
    const openQuote = this.consumeChar()
    const value = this.consumeWhile((c) => {
      return c != openQuote
    })
    this.consumeChar()
    return value
  }

  parseAttributes(): AttrMap {
    let attributes: AttrMap = new Map<string, string>()
    while (true) {
      this.consumeWhiteSpace()
      if (this.nextChar() == '>') {
        break;
      }
      const [name, value] = this.parseAttr()
      attributes.set(name, value)
    }
    return attributes
  }

  parseNodes(): Dom[] {
    let nodes: Dom[] = []
    while (true) {
      this.consumeWhiteSpace()
      if (this.eof() || this.startsWith("</")) {
        break
      }
      nodes.push(this.parseNode())
    }
    return nodes
  }

  static parse(source: string): Dom {
    const parser = new Parser(0, source)
    const nodes = parser.parseNodes()
    if (nodes.length == 1) {
      return nodes[0]
    } else {
      return elem('html', new Map(), nodes)
    }
  }
}
