/* @flow */

import { namespaceMap, isReservedTag } from 'web/util/index'
import { isValidNodeType, createNode, Scene, Label, BaseNode, DataNode } from 'spritejs'

export function createElement (tagName: string, vnode: VNode): Element {
  let isSpriteNode = !isReservedTag(tagName) && isValidNodeType(tagName)
  let hasPrefix = false
  if (tagName.startsWith('s-')) {
    tagName = tagName.slice(2)
    hasPrefix = true
    isSpriteNode = isValidNodeType(tagName)
  }
  if (isSpriteNode) {
    let attrs = {}
    if (vnode.data && vnode.data.attrs) {
      attrs = vnode.data.attrs
      if (!vnode._hasTransition) {
        // set transition attributes
        let parent = vnode.parent
        while (parent && parent.tag.startsWith('vue-component-')) {
          if (parent._hasTransition) {
            const { states, actions } = parent.data.attrs
            attrs.states = Object.assign({}, states, attrs.states)
            attrs.actions = Object.assign({}, actions, attrs.actions)
            break
          }
          parent = parent.parent
        }
      }
    }
    if (tagName === 'scene') {
      const elm = document.createElement('div')
      if (attrs.id) elm.id = attrs.id
      if (!vnode.data.ref) vnode.data.ref = 'scene'
      if (!('useDocumentCSS' in attrs)) attrs.useDocumentCSS = true
      const scene = createNode(tagName, elm, attrs)
      // elm.scene = scene
      if (attrs.resources) {
        const resources = attrs.resources
        scene.preload(...resources).then(() => {
          scene.dispatchEvent('load', { resources })
        })
      }
      return scene
    }
    const node = createNode(tagName, attrs)
    if (hasPrefix) {
      const _tagName = `S-${node.tagName}`
      Object.defineProperty(node, 'tagName', {
        get () {
          return _tagName
        }
      })
    }
    return node
  }
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple')
  }
  return elm
}

export function createElementNS (namespace: string, tagName: string): Element {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

// wrapping dom node to  sprite node
function wrapNode (node) {
  node.dataset = {}
  node.connect = (parent, zOrder) => {
    node.parent = parent
    node.zOrder = zOrder
    node.zIndex = 0
  }
  node.disconnect = (parent) => {
    delete node.parent
    delete node.zOrder
    delete node.zIndex
  }
  node.dispatchEvent = () => false
  node.forceUpdate = () => false
  node.isVisible = () => false
  node.__data = new DataNode()
  // reflect to get _attr Symbol
  Object.getOwnPropertySymbols(node.__data).some((symbol) => {
    if (symbol.toString() === 'Symbol(attr)') {
      node[symbol] = node.__data[symbol]
      return true
    }
  })
  node.contains = () => false
  node.enter = () => node
  node.exit = () => node
  node.attr = (...args) => {
    return node.__data.attr(...args)
  }
  node.updateStyles = () => false
  return node
}

export function createTextNode (text: string): Text {
  const textNode = document.createTextNode(text)
  return wrapNode(textNode)
}

export function createComment (text: string): Comment {
  const comment = document.createComment(text)
  return wrapNode(comment)
}

export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  if (parentNode instanceof BaseNode) {
    if (newNode.nodeType === document.TEXT_NODE) {
      if (parentNode instanceof Label) {
        parentNode.text = newNode.textContent
        Object.defineProperty(child, 'textContent', {
          set (text) {
            node.text = text
          },
          get () {
            return node.text
          },
          configurable: true
        })
      } else if (parentNode.appendChild) {
        parentNode.appendChild(newNode)
      }
      // parentNode.childNodes = [newNode]
    } else if (newNode instanceof BaseNode || newNode.nodeType === document.COMMENT_NODE || parentNode instanceof Scene) {
      parentNode.insertBefore(newNode, referenceNode)
    }
  } else {
    if (newNode instanceof Scene) newNode = newNode.container
    if (referenceNode instanceof Scene) referenceNode = referenceNode.container
    parentNode.insertBefore(newNode, referenceNode)
  }
}

export function removeChild (node: Node, child: Node) {
  if (child instanceof Scene) {
    node.removeChild(child.container)
  } else {
    node.removeChild(child)
  }
}

export function appendChild (node: Node, child: Node) {
  if (child instanceof Scene) {
    node.appendChild(child.container)
    child.parent = node
    setTimeout(() => {
      child.updateViewport()
    })
  } else if (node instanceof BaseNode) {
    if (child.nodeType === document.TEXT_NODE) {
      if (node instanceof Label) {
        node.text = child.textContent
        Object.defineProperty(child, 'textContent', {
          set (text) {
            node.text = text
          },
          get () {
            return node.text
          },
          configurable: true
        })
      } else if (node.appendChild) {
        node.appendChild(child)
      }
    } else if (child instanceof BaseNode || child.nodeType === document.COMMENT_NODE || node instanceof Scene) {
      node.appendChild(child)
    } else {
      const nodeType = child.tagName.toLowerCase()
      if (nodeType) {
        console.error(`Node#${nodeType} is not a sprite node.`, child)
        if (isValidNodeType(nodeType)) {
          console.warn(`'${nodeType}' is a reserved tag name, Use 's-${nodeType}' instead.`)
        }
      } else {
        console.error('Unknown node:', child)
      }
    }
  } else {
    node.appendChild(child)
  }
}

export function parentNode (node: Node): ?Node {
  return node.parent || node.parentNode
}

export function nextSibling (node: Node): ?Node {
  return node.nextSibling
}

export function tagName (node: Element): string {
  return node.tagName
}

export function setTextContent (node: Node, text: string) {
  if (node instanceof Label) {
    node.text = text
  } else {
    node.textContent = text
  }
}

export function setStyleScope (node: Element, scopeId: string) {
  node.setAttribute(scopeId, '')
}
