import {isWhitespace} from "@/util/isWhiteSpace";
import assert from "assert";

const identifierPattern = /[0-9a-zA-Z\-\_]/
const numberPattern = /[0-9]/

interface Stylesheet {
  rules: Rule[]
}

interface Rule {
  selectors: Selector[],
  declarations: Declaration[],
}

type Selector = SimpleSelector

interface SimpleSelector {
  tagName: string | null
  id: string | null
  class: string[]
}

interface Declaration {
  name: string,
  value: Value,
}

type Value = Keyword | Length | ColorValue
type Keyword = string
type Length = {
  value: number,
  unit: Unit
}
type Unit = 'px'

interface ColorValue {
  r: number,
  g: number,
  b: number,
  a: number,
}

export const parse = (source: string): Stylesheet => {
  let parser = new Parser(0, source)
  return {
    rules: parser.parseRules(),
  }
}

class Parser {
  pos: number
  input: string

  constructor(pos: number, input: string) {
    this.pos = pos
    this.input = input
  }

  parseRules(): Rule[] {
    let rules: Rule[] = []
    while (true) {
      this.consumeWhiteSpace()
      if (this.eof()) {
        break
      }
      rules.push(this.parseRule())
    }
    return rules
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

  consume_char(): string {
    const nextChar = this.input.charAt(this.pos)
    this.pos += 1
    return nextChar
  }

  consume_while(test: (char: string) => boolean): string {
    let result = ''
    while (!this.eof() && test(this.nextChar())) {
      result += this.consume_char()
    }
    return result
  }

  consumeWhiteSpace() {
    this.consume_while((char) => isWhitespace(char))
  }

  parseIdentifier(): string {
    return this.consume_while((c) => {
      return this.validIdentifierChar(c)
    })
  }

  validIdentifierChar(c: string): boolean {
    return identifierPattern.test(c)
  }

  // Parse one simple selector, e.g.: `type#id.class1.class2.class3`
  parseSimpleSelector(): SimpleSelector {
    let selector: SimpleSelector = {
      tagName: null,
      id: null,
      class: []
    }
    while (!this.eof()) {
      const c = this.nextChar()
      switch (c) {
        case '#':
          this.consume_char()
          selector.id = this.parseIdentifier()
          break
        case '.':
          this.consume_char()
          selector.class.push(this.parseIdentifier())
          break
        case '*':
          this.consume_char()
          break
        default:
          if (this.validIdentifierChar(c)) {
            selector.tagName = this.parseIdentifier()
          }
          break
      }
    }
    return selector
  }

  parseDeclarations(): Declaration[] {
    assert(this.consume_char() == '{')
    let declarations: Declaration[] = []
    while (true) {
      this.consumeWhiteSpace()
      if (this.nextChar() == '}') {
        this.consume_char()
        break
      }
      declarations.push(this.parseDeclaration())
    }
    return declarations
  }

  parseDeclaration(): Declaration {
    const propertyName = this.parseIdentifier()
    this.consumeWhiteSpace()
    this.consume_char()
    assert(this.consume_char() == ':',)
    this.consumeWhiteSpace()
    const value = this.parseValue()
    this.consumeWhiteSpace()
    assert(this.consume_char() == ';')
    return {
      name: propertyName,
      value: value,
    }
  }

  parseValue(): Value {
    const c = this.nextChar()
    if (numberPattern.test(c)) {
      return this.parseLength()
    }
    if (c == "#") {
      return this.parseColor()
    }
    return this.parseIdentifier()
  }

  parseLength(): Length {
    return {
      value: this.parseFloat(),
      unit: this.parseUnit(),
    }
  }

  parseFloat(): number {
    const s = this.consume_while((c) => {
      return numberPattern.test(c) || c == '.'
    })
    return parseFloat(s)
  }

  parseUnit(): Unit {
    const identifier = this.parseIdentifier()
    switch (identifier) {
      case "px":
        return "px"
      default:
        throw Error('Unrecognized unit')
    }
  }

  parseColor(): ColorValue {
    assert(this.consume_char() == '#')
    return {
      r: this.parseHexPair(),
      g: this.parseHexPair(),
      b: this.parseHexPair(),
      a: 255,
    }
  }

  parseHexPair(): number {
    const s = this.input.substring(this.pos, this.pos + 2)
    this.pos += 2
    return parseInt(s, 16)
  }

  parseRule(): Rule {
    return {
      selectors: this.parseSelectors(),
      declarations: this.parseDeclarations(),
    }
  }

  parseSelectors(): Selector[] {
    let selectors: Selector[] = []
    loop: while (true) {
      selectors.push(this.parseSimpleSelector())
      this.consumeWhiteSpace()
      const c = this.nextChar()
      switch (c) {
        case ',':
          this.consume_char()
          this.consumeWhiteSpace()
        case '{':
          break loop
        default:
          Error(`Unexpected character ${c} in selector list`)
      }
    }
    selectors.sort((a, b) => {
      return compareSpecificities(specificity(a), specificity(b))
    })
    return selectors
  }
}

type Specificity = [number, number, number]

const specificity = (selector: Selector): Specificity => {
  // http://www.w3.org/TR/selectors/#specificity
  const a = selector.id ? 1 : 0
  const b = selector.class.length
  const c = selector.tagName ? 1 : 0
  return [a, b, c]
}

const compareSpecificities = (specificityA: Specificity, specificityB: Specificity): number => {
  for (let i = 0; i < specificity.length; i++) {
    const a = specificityA[0]
    const b = specificityB[0]
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
  }
  return 0;
}
