<template>
  <scene id="container" :resolution="[1200, 1200]" :viewport="[600, 600]">
    <layer id="fglayer">
      <sprite :pos="[100, 100]" :bgcolor="bgcolor" :size="[100, 100]" v-on:click="onClick"></sprite>
      <label :pos="[300, 100]" :width="300" font="24px '宋体'" lineBreak="normal">
        Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite
        Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite,Hello Sprite
      </label>
    </layer>
  </scene>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    window.test = {
      bgcolor: 'green',
    };
    return window.test;
  },
  methods: {
    onClick(evt) {
      console.log(evt);
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
