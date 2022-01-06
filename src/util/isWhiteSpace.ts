const whitespaceRe = /\s/
export const isWhitespace = (c: string): boolean => {
  return whitespaceRe.test(c)
}
