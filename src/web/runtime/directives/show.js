/* @flow */

import * as spritejs from 'spritejs'
import { enter, leave } from '../modules/transition'

const BaseSprite = spritejs.BaseSprite || spritejs.Node

function getStyle (el) {
  if (el instanceof BaseSprite) {
    return el.attributes
  }
  if (el.canvas && el.canvas.style) return el.canvas.style
  if (el.container && el.container.style) return el.container.style
  return el.style
}

// recursively search for possible transition defined inside the component root
function locateNode (vnode: VNode): VNodeWithData {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

export default {
  bind (el: any, { value }: VNodeDirective, vnode: VNodeWithData) {
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    const style = getStyle(el)
    if (el instanceof BaseSprite) {
      const states = style.states
      if (!value && states.hide) {
        const beforeHide = { __default: true }
        if (states.beforeShow) {
          Object.keys(states.beforeShow).forEach((key) => {
            beforeHide[key] = style[key]
          })
        }
        Object.keys(states.hide).forEach((key) => {
          beforeHide[key] = style[key]
        })
        states.show = beforeHide
        el.attr(states.hide)
      }
      if (!value) {
        style.display = 'none'
        style.quietSet('state', 'hide')
      }
      // if (value) el.show()
    } else {
      const originalDisplay = el.__vOriginalDisplay =
        style.display === 'none' ? '' : style.display
      if (value && transition) {
        vnode.data.show = true
        enter(vnode, () => {
          style.display = originalDisplay
        })
      } else {
        style.display = value ? originalDisplay : 'none'
      }
    }
  },

  update (el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) {
    /* istanbul ignore if */
    if (!value === !oldValue) return
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    const style = getStyle(el)
    if (el instanceof BaseSprite) {
      if (value) el.show()
      else el.hide()
    } else {
      if (transition) {
        vnode.data.show = true
        if (value) {
          enter(vnode, () => {
            style.display = el.__vOriginalDisplay
          })
        } else {
          leave(vnode, () => {
            style.display = 'none'
          })
        }
      } else {
        style.display = value ? el.__vOriginalDisplay : 'none'
      }
    }
  },

  unbind (
    el: any,
    binding: VNodeDirective,
    vnode: VNodeWithData,
    oldVnode: VNodeWithData,
    isDestroy: boolean
  ) {
    if (!isDestroy) {
      const style = getStyle(el)
      style.display = el.__vOriginalDisplay
    }
  }
}
