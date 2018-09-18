/* @flow */

import { namespaceMap, isReservedTag } from 'web/util/index'
import { isValidNodeType, createNode, Scene, Label, BaseNode, DataNode } from 'spritejs'

export function createElement (tagName: string, vnode: VNode): Element {
  let isSpriteNode = !isReservedTag(tagName) && isValidNodeType(tagName)
  if (tagName.startsWith('s-')) {
    tagName = tagName.slice(2)
    isSpriteNode = isValidNodeType(tagName)
  }
  if (isSpriteNode) {
    let attrs = {}
    if (vnode.data && vnode.data.attrs) {
      attrs = vnode.data.attrs
    }
    if (tagName === 'scene') {
      const elm = document.createElement('div')
      if (attrs.id) elm.id = attrs.id
      if (!vnode.data.ref) vnode.data.ref = 'scene'
      const scene = createNode(tagName, elm, attrs)
      elm.scene = scene
      if (attrs.resources) {
        const resources = attrs.resources
        scene.preload(...resources).then(() => {
          scene.dispatchEvent('load', { resources })
        })
      }
      return scene
    }
    return createNode(tagName, attrs)
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

export function createTextNode (text: string): Text {
  return document.createTextNode(text)
}

export function createComment (text: string): Comment {
  const comment = document.createComment(text)
  comment.dataset = {}
  comment.connect = (parent, zOrder) => {
    comment.parent = parent
    comment.zOrder = zOrder
  }
  comment.disconnect = (parent) => {
    delete comment.parent
    delete comment.zOrder
  }
  comment.dispatchEvent = () => false
  comment.forceUpdate = () => false
  comment.isVisible = () => false
  comment.__data = new DataNode({ display: 'none' })
  comment.contains = () => false
  comment.enter = () => comment
  comment.exit = () => comment
  comment.attr = (...args) => {
    return comment.__data.attr(...args)
  }
  return comment
}

export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  if (parentNode instanceof BaseNode) {
    if (parentNode instanceof Label && newNode.nodeType === document.TEXT_NODE) {
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
      // parentNode.childNodes = [newNode]
    }
    if (newNode instanceof BaseNode || newNode.nodeType === document.COMMENT_NODE || parentNode instanceof Scene) {
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
    if (node instanceof Label && child.nodeType === document.TEXT_NODE) {
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
    }
    if (child instanceof BaseNode || child.nodeType === document.COMMENT_NODE || node instanceof Scene) {
      node.appendChild(child)
    } else if (child.nodeType !== document.TEXT_NODE) {
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
  if (node instanceof BaseNode) {
    if (node.parent) {
      const idx = node.parent.children.indexOf(node)
      return node.parent.children[idx + 1]
    }
    return null
  }
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
