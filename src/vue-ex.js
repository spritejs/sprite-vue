import Vue from 'web/entry-runtime-with-compiler'

function extractStates (target, states, actions) {
  if (typeof states === 'function') {
    states = states.call(target)
  }
  if (typeof actions === 'function') {
    actions = actions.call(target)
  }
  if (Array.isArray(actions)) {
    actions = { actions }
  }
  states = Object.assign({}, { states }, states)
  return Object.assign({}, states, actions)
}

function compileProto (proto = {}) {
  const { states, actions } = proto

  if (typeof proto.data === 'function') {
    const _getter = proto.data
    proto.data = function (...args) {
      const exData = extractStates(this, states, actions)
      const data = Object.assign(exData, _getter.call(this, ...args))
      return data
    }
  } else if (proto.data) {
    const exData = extractStates(null, states, actions)
    proto.data = Object.assign({}, proto.data, exData)
  }

  delete proto.states
  delete proto.actions

  return proto
}

const _component = Vue.component
Vue.component = function (name, proto) {
  return _component.call(Vue, name, compileProto(proto))
}

export default Vue
