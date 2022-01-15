//todo(HeavenOSK): 正規表現あってる?
const identifierPattern = /[0-9a-zA-Z\-\_]/
const numberPattern = /[0-9]/

interface SimpleSelector {
  tagName?: string
  id?: string
  class: string[]
}

type Selector = SimpleSelector

interface Declaration {
  name: string,
  value: Value,
}

type Value = Keyword | Length | ColorValue

type Unit = 'px'

type Keyword = string

interface Length {
  val: number
  unit: Unit,
}

type ColorValue = Color

interface Color {
  r: number,
  g: number,
  b: number,
  a: number,
}

interface Rule {
  selectors: Selector[]
  declarations: Declaration[]
}

interface Stylesheet {
  rules: Rule[]
}

export class Parser {
  pos: number
  input: string

  constructor(pos: number, input: string) {
    this.pos = pos
    this.input = input
  }

  static parse(source: string): Stylesheet {
    let parser = new Parser(0, source)
    return {
      rules: []
    }
  }

  nextChar(): string {
    return this.input.charAt(this.pos)
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

  eof(): boolean {
    return this.pos >= this.input.length
  }

  validIdentifierChar(c: string): boolean {
    return identifierPattern.test(c)
  }

  parseIdentifier(): string {
    return this.consumeWhile(this.validIdentifierChar)
  }
  
  parseSimpleSelector(): SimpleSelector {
    let selector: SimpleSelector = {
      class: [],
    }
    loop:while (!this.eof()) {
      const c = this.nextChar()
      switch (c) {
        case '#':
          this.consumeChar()
          selector.id = this.parseIdentifier()
          continue
        case '.':
          this.consumeChar()
          selector.class.push(this.parseIdentifier())
          continue
        case '*':
          this.consumeChar()
          continue
        default:
          if (this.validIdentifierChar(c)) {
            selector.tagName = this.parseIdentifier()
            continue
          }
          break loop
      }
    }
    return selector
  }
}
