import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      isShow: false
    }
  }, {
    path: '/',
    name: 'Index',
    redirect: { name: 'Login' },
    meta: {
      isShow: false
    }
  }, {
    path: '/drive',
    name: 'Drive',
    redirect: '/drive/file',
    component: () => import('../views/Index.vue'),
    meta: {
      isShow: true
    },
    children: [
      {
        path: 'file',
        name: 'File',
        component: () => import('../views/File.vue'),
        children: [
          {
            path: 'folder/:file_id',
            name: 'Folder',
            component: () => import('../views/Folder.vue')
          }
        ]
      }, {
        path: 'album',
        name: 'Album',
        component: () => import('../views/Album.vue')
      }, {
        path: 'Favorite',
        name: 'Favorite',
        component: () => import('../views/Favorite.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    if (localStorage.getItem('token')) next('/drive/file')
    else next()
  } else {
    next()
  }
})

export default router
