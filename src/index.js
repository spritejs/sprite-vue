import BaseVue from 'web/entry-runtime-with-compiler'
import * as spritejs from 'spritejs'

function compileProto (proto) {
  const { states, actions } = proto
  const exData = {}
  if (states) exData.states = states
  if (actions) exData.actions = actions

  if (typeof proto.data === 'function') {
    const _getter = proto.data
    proto.data = function (...args) {
      const data = Object.assign(exData, _getter.call(this, ...args))
      return data
    }
  } else {
    Object.assign(proto.data, exData)
  }

  delete proto.states
  delete proto.actions

  return proto
}

class Vue extends BaseVue {
  static component (name, proto) {
    console.log(proto)
    return super.component(name, compileProto(proto))
  }
  constructor (proto) {
    super(compileProto(proto))
  }
}

export {
  Vue,
  spritejs
}
