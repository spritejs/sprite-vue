<template>
  <scene id="container" :resolution="[1200, 1200]" :viewport="[600, 600]">
    <layer id="fglayer">
      <group>
        <sprite :pos="[100, 100]" :bgcolor="bgcolor" :size="[100, 100]" v-on:click="onClick"
        v-on:mouseenter="onMouseEnter"
        v-on:mouseleave="onMouseLeave"></sprite>
        <label v-if="toggle" :pos="[300, 100]" :width="300"
        font="24px '宋体'" lineBreak="normal" :text="text">
        </label>
      </group>
    </layer>
  </scene>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    window.test = {
      bgcolor: 'green',
      toggle: true,
      text: `Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite
          Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite`,
    };
    return window.test;
  },
  methods: {
    onClick(evt) {
      console.log(evt);
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
</style>
