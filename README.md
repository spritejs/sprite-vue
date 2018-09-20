# sprite-vue

> Vue.js 支持 SpriteJS 的 Runtime

- [文档](http://vue.spritejs.org) 
- [Live DEMO](https://codepen.io/collection/nVbpGo/)

## 直接使用

[例子](https://code.h5jun.com/najo/edit?js,output)

```html
<script src="https://s3.ssl.qhres.com/!b39e60e4/sprite-vue.min.js"></script>
<div id="app"></div>
<script>
const { Vue } = spritevue;

new Vue({
  el: '#app',
  data() {
    return {
      viewport: [600, 600],
    }
  },
  template: `<div>
  <scene id="container" :viewport=viewport>
    <layer id="fglayer">
      <sprite :pos="[100, 100]" :size="[50, 50]"
        bgcolor="red"></sprite>
    </layer>
  </scene>
</div>`,
});
</script>
```

## 项目里安装和使用

用 vue-cli 创建任意项目，将对应的 vue 模块替换成 sprite-vue 模块，在使用方式上稍作修改：

```js
import Vue from 'vue';
```

修改为

```js
import { Vue, spritejs } from 'sprite-vue'
```

Enjoy~
