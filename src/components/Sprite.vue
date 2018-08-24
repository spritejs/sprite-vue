<template>
  <scene id="container" :resolution="[600, 600]" :viewport="[300, 300]">
    <layer id="fglayer">
      <sprite :pos="[100, 100]" :bgcolor="bgcolor" :size="[100, 100]"></sprite>
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
