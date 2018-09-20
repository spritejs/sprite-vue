const Transitions = {
  'fade-in': (duration = 300, easing = 'ease-in') => {
    return {
      from: {
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'fade-out': (duration = 300, easing = 'ease-out') => {
    return {
      to: {
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'slide-in-top': (duration = 300, easing = 'ease-in', distance = 300) => {
    return {
      from: {
        translate: [0, -distance],
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'slide-in-right': (duration = 300, easing = 'ease-in', distance = 300) => {
    return {
      from: {
        translate: [distance, 0],
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'slide-in-bottom': (duration = 300, easing = 'ease-in', distance = 300) => {
    return {
      from: {
        translate: [0, distance],
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'slide-in-left': (duration = 300, easing = 'ease-in', distance = 300) => {
    return {
      from: {
        translate: [-distance, 0],
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'slide-out-top': (duration = 300, easing = 'ease-in', distance = 300) => {
    return {
      to: {
        translate: [0, -distance],
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'slide-out-right': (duration = 300, easing = 'ease-in', distance = 300) => {
    return {
      to: {
        translate: [distance, 0],
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'slide-out-bottom': (duration = 300, easing = 'ease-in', distance = 300) => {
    return {
      to: {
        translate: [0, distance],
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  },
  'slide-out-left': (duration = 300, easing = 'ease-in', distance = 300) => {
    return {
      to: {
        translate: [-distance, 0],
        opacity: 0
      },
      action: {
        duration,
        easing
      }
    }
  }
}

function getTransition (option) {
  let transition = option
  if (typeof option === 'string') {
    transition = Transitions[option]()
  } else if (Array.isArray(option)) { // [name, time, easing]
    const [name, ...args] = option
    transition = Transitions[name](args)
  }
  return transition
}

function findByKey (key, children) {
  let ret
  children.some((child) => {
    if (child.key === key) {
      ret = child
      return true
    }
    if (child.children) return !!findByKey(key, child.children)
  })
  return ret
}

export default {
  props: ['forKey', 'enter', 'exit', 'show', 'hide', 'enterMode', 'exitMode', 'attrs'],
  render (createElement) {
    let children = this.$slots.default
    let { forKey, enter, exit, show, hide, enterMode, exitMode } = this
    if (this.attrs) {
      if (this.attrs.enter) enter = enter || this.attrs.enter
      if (this.attrs.exit) exit = exit || this.attrs.exit
      if (this.attrs.show) show = show || this.attrs.show
      if (this.attrs.hide) hide = hide || this.attrs.hide
      if (this.attrs.enterMode) enterMode = enterMode || this.attrs.enterMode
      if (this.attrs.exitMode) exitMode = exitMode || this.attrs.exitMode
      if (this.attrs.forKey) forKey = forKey || this.attrs.forKey
    }

    let root = null
    if (forKey) {
      root = findByKey(forKey, children)
      if (!root) {
        throw new Error(`Can't find element: ${forKey}`)
      }
      children = root.children
      if (!children) {
        throw new Error(`The element ${forKey} is not a container`)
      }
    }

    children.forEach((child) => {
      child.data = child.data || {}
      child.data.attrs = child.data.attrs || {}
      const attrs = child.data.attrs
      const states = {}
      const actions = {}
      if (enter) {
        const transition = getTransition(enter)
        if (transition) {
          states.beforeEnter = transition.from
          if (transition.to) {
            states.afterEnter = transition.to
          }
          actions['beforeEnter:'] = transition.action
        }
        // if (!child.key) {
        //   child.key = `_key${Math.random()}`
        // }
      }
      if (exit) {
        const transition = getTransition(exit)
        if (transition) {
          states.afterExit = transition.to
          if (transition.from) {
            states.beforeExit = transition.from
          }
          actions[':afterExit'] = transition.action
        }
        // if (!child.key) {
        //   child.key = `_key${Math.random()}`
        // }
      }
      if (show) {
        const transition = getTransition(show)
        if (transition) {
          states.beforeShow = transition.from
          if (transition.to) {
            states.show = transition.to
          }
          actions['beforeShow:'] = transition.action
        }
      }
      if (hide) {
        const transition = getTransition(hide)
        if (transition) {
          states.hide = transition.to
          if (transition.from) {
            states.show = transition.from
          }
          actions[':hide'] = transition.action
        }
      }
      attrs.states = Object.assign({}, attrs.states, states)
      attrs.actions = Object.assign({}, attrs.action, actions)
    })
    if (root) {
      root._hasTransition = true
      root.data = root.data || {}
      root.data.attrs = root.data.attrs || {}
      if (enterMode) {
        root.data.attrs.enterMode = enterMode
      }
      if (exitMode) {
        root.data.attrs.exitMode = exitMode
      }
    }
    children = this.$slots.default
    if (children.length === 1) {
      const rawChild = children[0]
      if (!root) rawChild._hasTransition = true
      return rawChild
    }
    const group = createElement('group', children)
    if (!root) {
      group.data = {
        attrs: {}
      }
      if (enterMode) {
        group.data.attrs.enterMode = enterMode
      }
      if (exitMode) {
        group.data.attrs.exitMode = exitMode
      }
    }
    return group
  }
}
