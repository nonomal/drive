import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'Login',
    component: ()=> import ('../views/Login.vue'),
    meta:{
      isShow:false
    }
  },{
    path:'/',
    name:'Index',
    redirect: { name: 'Login' },
    meta:{
      isShow:false
    }
  },{
    path:'/drive',
    name:'Drive',
    redirect: '/drive/file',
    component: ()=> import ('../views/Index.vue'),
    meta:{
      isShow:true
    },
    children:[
      {
        path:'file',
        name:'File',
        component:()=> import('../views/File.vue'),
        children:[
          {
            path:'folder/:file_id',
            name:'Folder',
            component:()=> import('../views/Folder.vue')
          }
        ]
      },{
        path:'album',
        name:'Album',
        component:()=> import('../views/Album.vue')
      },{
        path:'Favorite',
        name:'Favorite',
        component:()=> import('../views/Favorite.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  if (localStorage.getItem('token')) {
    // 在已登陆的情况下访问登陆页会重定向到首页
      if (to.path === '/login') {
          next({path: '/drive/file'})
      }else {
          next()
      }
  } else {
      // 没有登陆则访问任何页面都重定向到登陆页
      if (to.path === '/login') {
          next()
      } else {
          next(`/login?redirect=${to.path}`)
      }
  }
})
export default router
