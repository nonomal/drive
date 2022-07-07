### How to use
```javascript
// main.js

import PhototView from '@/components/PhotoView'
Vue.use(PhototView)

```

```javascript
//App.vue

<template>
    <button @click="showPhoto">Show Photo</button>
</template>

<script>
    export default {
        name:"App",
        imageData:[
            { src:"http://res.xiezy.top/1.jpg",imageName:"风景1"},
            { src:"http://res.xiezy.top/2.jpg",imageName:"风景2"},
            { src:"http://res.xiezy.top/2.jpg",imageName:"风景2"},
        ],
        methods:{
            showPhoto(){
                this.$photoview(this.imageData);
            }
        }
    }
</script>
```

***注意：imageData中的key不能修改，内部组件应用的是对应的key，如有需要去PhotoShow.vue中修改***


**图片加载使用了VueLazy插件**
```js

Vue.use()还可以传递第二个参数，
Boolean : true/false  决定是否使用vue-lazyload插件
    默认值：{
            loading: require('@/assets/loading.gif'),
            error: require('@/assets/error.png'),
            perload: 1
        }
Object : 参考vue-lazyload的配置项
```