export type Node = {
  children: Node[]
  nodeType: NodeType
}

export const text = (data: string): Node => {
  return {
    children: [],
    nodeType: {
      data: data,
    },
  }
}
export const elem = (name: string, attrs: AttrMap, children: Node[]): Node => {
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

type NodeType = Text | Element

type Text = { data: string }

type Element = { data: ElementData }

type ElementData = {
  tagName: string
  attributes: AttrMap,
}

export type AttrMap = Map<string, string>;
