import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/home.vue'
import welcome from './components/welcome.vue'
import users from './components/user/users.vue'
import rights from './components/power/rights.vue'
import roles from './components/power/roles.vue'
import cate from './components/goods/cate.vue'
Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: login },
        { path: '/home', component: home,redirect:'/welcome',children:[
            {path:'/welcome',component:welcome},
            {path:'/users',component:users},
            {path:'/rights',component:rights},
            {path:'/roles',component:roles},
            {path:'/categories',component:cate}
        ] }
    ]
})
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    if (!window.sessionStorage.getItem('token')) return next('/login')
    next()
})
export default router
