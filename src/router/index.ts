import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      
        {
          path: '/',
          name: 'login',
          component: LoginView,
        },
        {
          path:'/login',
          name:'login',
          component:() => import('../views/LoginView.vue')
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue'),
        },
        {
          path:'/register',
          name:'register',
          component:() => import('../views/RegisterView.vue')
        },
        {
          path:'/table',
          name:'table',
          component:() => import('../views/Table.vue'),
          props: true
        },
        {
          path:'/home',
          name:'home',
          component:() => import('../views/HomeView.vue')
        },
        {
          path:'/own',
          name:'own',
          component:() => import('../views/OwnView.vue')
        },
        //如果点击链接没有路径就会跳转到ErrorView页面
        {
          path:'/:catchAll(.*)*',
          name:'ErrorView',
          component:() => import('../views/ErrorView.vue')
        }
     
   
    
  ],
})
// router.beforeEach((to,from) =>{
//   if(to.name !== 'LoginView' && !localStorage.getItem('token')){
//     return '/login'
//   }
// })

export default router
