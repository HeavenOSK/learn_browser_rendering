//todo(HeavenOSK): 正規表現あってる?
import {isWhitespace} from "./util/isWhiteSpace.js";

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

type Specificity = [number, number, number]

const specificity = (selector: Selector): Specificity => {
  const a = selector.id != null ? 1 : 0
  const b = selector.class.length
  const c = selector.tagName != null ? 1 : 0
  return [a, b, c]
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
      rules: parser.parseRules()
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

  consumeWhiteSpace() {
    this.consumeWhile((char) => isWhitespace(char))
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

  parseSelectors(): Selector[] {
    let selectors: Selector[] = []
    loop:while (true) {
      selectors.push(this.parseSimpleSelector())
      this.consumeWhiteSpace()
      const c = this.nextChar()
      switch (c) {
        case ',':
          this.consumeChar()
          this.consumeWhiteSpace()
          break
        case '{':
          break loop
        default:
          throw Error(`Unexpected character ${c} in selector list`)
      }
    }
    return selectors.sort((a, b) => {
      const specificityA = specificity(a)
      const specificityB = specificity(b)
      for (let i = 0; i <= 2; i++) {
        const elA = specificityA[i]
        const elB = specificityB[i]
        if (elA == elB) {
          continue
        }
        return elA - elB
      }
      return 0
    })
  }

  parseDeclarations(): Declaration[] {
    this.consumeChar()
    let declarations: Declaration[] = []
    while (true) {
      this.consumeWhiteSpace()
      if (this.nextChar() == '}') {
        this.consumeChar()
        break
      }
      declarations.push(this.parseDeclaration())
    }
    return declarations
  }

  parseDeclaration(): Declaration {
    const name = this.parseIdentifier()
    this.consumeWhiteSpace()
    this.consumeChar()
    this.consumeWhiteSpace()
    const value = this.parseValue()
    this.consumeWhiteSpace()
    this.consumeChar()
    return {
      name,
      value,
    }
  }

  parseValue(): Value {
    const c = this.nextChar()
    if (numberPattern.test(c)) {
      return this.parseLength()
    } else if (c == '#') {
      return this.parseColor()
    }
    return this.parseIdentifier()
  }

  parseColor(): Value {
    this.consumeChar()
    const r = this.parseHexPair()
    const g = this.parseHexPair()
    const b = this.parseHexPair()
    const a = 255
    return {
      r,
      g,
      b,
      a,
    } as ColorValue
  }

  parseHexPair(): number {
    const s = this.input.substr(this.pos, this.pos + 2)
    this.pos += 2
    return Number.parseInt(s, 16)
  }

  parseLength(): Value {
    const val = this.parseFloatValue()
    const unit = this.parseUnit()
    return {
      val,
      unit,
    } as Length
  }

  parseFloatValue(): number {
    let s = this.consumeWhile((c) => {
      return numberPattern.test(c) || c == '.'
    })
    return Number(s)
  }

  parseUnit(): Unit {
    const c = this.parseIdentifier().toLowerCase()
    if (c == 'px') {
      return 'px'
    }
    throw Error(`unrecognized unit ${c}`)
  }

  parseRule(): Rule {
    const selectors = this.parseSelectors()
    const declarations = this.parseDeclarations()
    return {
      selectors,
      declarations,
    }
  }

  parseRules(): Rule[] {
    const rules: Rule[] = []
    while (true) {
      this.consumeWhiteSpace()
      if (this.eof()) break
      rules.push(this.parseRule())
    }
    return rules
  }
}
