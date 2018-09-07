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

function compileProto (target, proto = {}) {
  const { states, actions } = proto

  if (typeof proto.data === 'function') {
    const _getter = proto.data
    proto.data = function (...args) {
      const exData = extractStates(target, states, actions)
      const data = Object.assign(exData, _getter.call(target, ...args))
      return data
    }
  } else if (proto.data) {
    const exData = extractStates(target, states, actions)
    proto.data = Object.assign({}, proto.data, exData)
  }

  delete proto.states
  delete proto.actions

  return proto
}

export default class extends Vue {
  static component (name, proto) {
    return super.component(name, compileProto(this, proto))
  }
  constructor (proto) {
    super(compileProto(proto, proto))
  }
}
