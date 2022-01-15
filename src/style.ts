import {Rule, Selector, SimpleSelector, specificity, Specificity, Stylesheet, Value} from "./css.js";
import {Element, ElementData, getClassesFromElementData, getIdFromElementData, Node} from "./dom.js";

type PropertyMap = Map<string, Value>

interface StyleNode {
  node: Node
  specifiedValues: PropertyMap,
  children: StyleNode[]
}

const matches = (elem: ElementData, selector: Selector): boolean => {
  switch (selector.selectorType) {
    case "simple":
      return matchSimpleSelector(elem, selector as SimpleSelector)
  }
}


const matchSimpleSelector = (elem: ElementData, selector: SimpleSelector): boolean => {
  if (selector.tagName && selector.tagName != elem.tagName) {
    return false
  }
  if (selector.id && selector.id != getIdFromElementData(elem)) {
    return false
  }
  const elemClasses = getClassesFromElementData(elem)
  // FIXME(HeavenOSK): 多分間違ってる
  if (selector.class.length > 0 && selector.class.some((c) => !elemClasses.includes(c))) {
    return false
  }
  return true
}

type MatchedRule = [Specificity, Rule]

const matchRule = (elem: ElementData, rule: Rule): MatchedRule | null => {
  const selector = rule.selectors.find((s) => {
    return matches(elem, s)
  })
  if (!selector) {
    return null
  }
  return [specificity(selector as SimpleSelector), rule]
}
const matchingRules = (elem: ElementData, styleSheet: Stylesheet): MatchedRule[] => {
  return styleSheet.rules
    .map<MatchedRule | null>((rule) => matchRule(elem, rule))
    .filter((r) => {
      return r != null
    }) as MatchedRule[]
}

const specifiedValues = (elem: ElementData, styleSheet: Stylesheet): PropertyMap => {
  let values = new Map<string, Value>()
  let rules = matchingRules(elem, styleSheet)
  const sorted = rules.sort(([a, _], [b, __]) => {
    for (let i = 0; i <= 2; i++) {
      const elA = a[i]
      const elB = b[i]
      if (elA == elB) {
        continue
      }
      return elA - elB
    }
    return 0
  })
  for (let [_, rule] of sorted) {
    for (const declaration of rule.declarations) {
      values.set(declaration.name, declaration.value)
    }
  }
  return values
}

export const genStyleTree = (root: Node, styleSheet: Stylesheet): StyleNode => {
  const getSpecifiedValues = (): PropertyMap => {
    switch (root.nodeType.nodeTypeName) {
      case "element":
        return specifiedValues((root.nodeType as Element).data, styleSheet)
      case 'text':
        return new Map()
    }
  }
  return {
    node: root,
    specifiedValues: getSpecifiedValues(),
    children: root.children.map(child =>
      genStyleTree(child, styleSheet)
    )
  }
}
