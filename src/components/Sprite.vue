<template>
  <scene v-if="visible" id="container" :resolution="[1200, 1200]" :viewport="[600, 600]">
    <layer id="fglayer">
      <group>
        <sprite :pos="[100, 100]" :bgcolor="bgcolor" :size="[100, 100]" v-on:click="onClick"
        v-on:mouseenter="onMouseEnter"
        v-on:mouseleave="onMouseLeave"></sprite>
        <label v-show="toggle" :pos="[300, 100]" :width="300"
        font="24px '宋体'" lineBreak="normal" :text="text">
        </label>
      </group>
      <group display="flex" :pos="[100, 500]" :width="600" justifyContent="space-between">
        <sprite v-for="(item, key, index) in items" v-show="item.visible" :bgcolor="item.color"
        :size="[50, 50]" :key="index"></sprite>
      </group>
    </layer>
  </scene>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    window.test = {
      visible: true,
      bgcolor: 'green',
      toggle: true,
      text: `Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite
          Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite`,
      items: [
        { color: 'red', visible: true },
        { color: 'blue', visible: true },
        { color: 'green', visible: false },
      ],
    };
    return window.test;
  },
  methods: {
    onClick(evt) {
      console.log(evt);
      this.toggle = !this.toggle;
    },
    onMouseEnter() {
      console.log('mouseenter');
    },
    onMouseLeave() {
      console.log('mouseleave');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  border: solid 1px black;
  width: 600px;
  height: 600px;
  position: relative;
}

canvas {
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
</style>
