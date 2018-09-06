/* @flow */

import { enter, leave } from '../modules/transition'

function getStyle (el) {
  if (el.style) return el.style
  if (el.container && el.container.style) return el.container.style
  return el.attributes
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
  },

  update (el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) {
    /* istanbul ignore if */
    if (!value === !oldValue) return
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    const style = getStyle(el)
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
