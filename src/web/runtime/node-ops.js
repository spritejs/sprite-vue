/* @flow */

import { namespaceMap } from 'web/util/index'
import { isValidNodeType, createNode, Scene, Label, BaseNode } from 'spritejs'

export function createElement (tagName: string, vnode: VNode): Element {
  if (isValidNodeType(tagName)) {
    let attrs = {}
    if (vnode.data && vnode.data.attrs) {
      attrs = vnode.data.attrs
    }
    if (tagName === 'scene') {
      const elm = document.createElement('div')
      elm.id = attrs.id
      const scene = createNode(tagName, elm, attrs)
      elm.scene = scene
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
  // return createNode('data', { text })
  const comment = document.createComment(text)
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
  return comment
}

export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  if (parentNode instanceof BaseNode) {
    if (parentNode instanceof Label && newNode.nodeType === document.TEXT_NODE) {
      parentNode.text = newNode.textContent
      // parentNode.childNodes = [newNode]
    }
    if (newNode.nodeType === document.COMMENT_NODE) {
      // newNode = createNode('data', { text: newNode.textContent })
      parentNode.insertBefore(newNode, referenceNode)
    }
    if (newNode instanceof BaseNode) {
      parentNode.insertBefore(newNode, referenceNode)
    }
  } else {
    parentNode.insertBefore(newNode, referenceNode)
  }
}

export function removeChild (node: Node, child: Node) {
  node.removeChild(child)
}

export function appendChild (node: Node, child: Node) {
  if (child instanceof Scene) {
    node.appendChild(child.container)
    setTimeout(() => {
      child.updateViewport()
    })
  } else if (node instanceof BaseNode) {
    if (node instanceof Label && child.nodeType === document.TEXT_NODE) {
      node.text = child.textContent
      // node.childNodes = [child]
    }
    // if (child.nodeType === document.COMMENT_NODE) {
    //   child = createNode('data', { text: child.textContent })
    // }
    if (child instanceof BaseNode) {
      node.appendChild(child)
    }
  } else {
    node.appendChild(child)
  }
}

export function parentNode (node: Node): ?Node {
  return node.parentNode || node.parent
}

export function nextSibling (node: Node): ?Node {
  return node.nextSibling
}

export function tagName (node: Element): string {
  return node.tagName
}

export function setTextContent (node: Node, text: string) {
  node.textContent = text
}

export function setStyleScope (node: Element, scopeId: string) {
  node.setAttribute(scopeId, '')
}
