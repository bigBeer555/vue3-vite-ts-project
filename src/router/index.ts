import { createWebHistory, createRouter,createWebHashHistory } from "vue-router";

const routes = [
    {
        path: '/', 
        component: () => import('@/pages/draw/index.vue'),
        name: 'Draw',
        meta: {
            title: '绘图',
            icon: 'login',
            roles: ['admin', 'user'],
            cache: false,
            transition: 'gradient',
            shaking: false,
        }
    },
    {
        path: '/chunkUpload', 
        component: () => import('@/pages/chunkUpload/index.vue'),
        name: 'ChunkUpload',
        meta: {
            title: '分片上传',
            icon: 'login',
            roles: ['admin', 'user'],
            cache: false,
            transition: 'gradient',
            shaking: false,
        }
    },
    { 
        path: '/login', 
        component: () => import('@/pages/login/index.vue'),
        name: 'Login',
        meta: {
            title: '登录',
            icon: 'login',
            roles: ['admin', 'user'],
            cache: false,
            transition: 'gradient',
            shaking: false,
        }
    },
    { 
        path: '/index', 
        component: () => import('@/pages/index/index.vue'),  // 修复：添加import()
        name: 'Index',
        meta: {
            title: '首页',
            icon: 'home',
            roles: ['admin', 'user'],
            cache: true,
            transition: 'fade',
            shaking: false,
        }
    },
    {
        path: '/404',
        component: () => import('@/pages/404/index.vue'),
        name: 'NotFound',
        meta: {
            title: '404 Not Found',
            icon: 'error',
            roles: ['admin', 'user'],
            cache: false,
            transition: 'fade',
            shaking: false,
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        console.log(to, from, savedPosition, 'scrollBehavior')
        // 如果有保存的位置（例如浏览器后退），恢复到该位置
        if (savedPosition) {
            return savedPosition
        }
        // 否则滚动到顶部，添加平滑滚动
        return { 
            left: 0, 
            top: 100,
            behavior: 'smooth'
        }
    },
})

const authRouter = [
    {
        path: '/messages',
        component: () => import('@/pages/messages/index.vue'),
        name: 'Messages',
        meta: {
            title: '消息中心',
            icon: 'message',
            roles: ['user'],
            cache: true,
            transition: 'fade',
            shaking: true,
        }
    },
]

const authStr = 'user'  // 权限角色

router.beforeEach((to, from, next) => {
    console.log(to, from, 'to-form')
    const roles = (to?.meta?.roles as string[]) || []
    // 登录时生成权限动态路由
    if(to.name === 'Index') {
        authRouter.forEach(item => {
            if(roles.includes(authStr)) router.addRoute(item)
        })
        return next()
    }
    if(to.name === 'Login') {
        // 退出时清除动态路由
        routes.forEach(item => {
            if(item?.meta?.shaking) router.addRoute(item)
        })
        return next()
    }
    if(roles.includes(authStr)) {
        return next()
    }
    // window.alert('您没有权限访问该页面')
    next({ name: 'NotFound' })
})

export default router;