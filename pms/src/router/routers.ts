import {createRouter, createWebHashHistory} from 'vue-router'
import useCookie from 'vue-cookies'
import jwt from 'jwt-decode'
import { allUser, userInfo } from '../model/entity'
import { ElMessage } from 'element-plus'

const routes = [
    {
        name:"index", 
        path:'/', 
        component:()=>import('../components/Container.vue'),
    },
    {
        name:'login',
        path:'/login',
        component:()=>import('../pages/Login.vue'),
    },
    {
        name:'main',
        path:'/main/',
        component:()=>import('../pages/Main.vue'),
        children:[
            {
                name:'center',
                path:'center',
                component:()=>import('../pages/center/PCenter.vue'),
                prop: true
            },
            {
                name:'postCom',
                path:'postCom',
                component:()=>import('../pages/complaint/PostComplaint.vue'),
            },
            {
                name:'result',
                path:'result',
                component:()=>import('../pages/Result.vue'),
            },
            {
                name:'queryCom',
                path:'queryCom',
                component:()=>import('../pages/complaint/QueryComplaint.vue'),
            },
            {
                name:'broadcastForProp',
                path:'broadcast',
                component:()=>import('../pages/broadcast/ShowBroadcast.vue'),
            },
            {
                name:'auth',
                path:'auth/',
                children:[
                    {
                        name:'broadcast',
                        path:'broadcast',
                        component:()=>import('../pages/broadcast/ManageBroadcast.vue'),
                    },
                    {
                        name:'complaint',
                        path:'complaint',
                        component:()=>import('../pages/complaint/QueryComplaint.vue'),
                    },
                    {
                        name:'building',
                        path:'building',
                        component:()=>import('../pages/building/ManageBuilding.vue'),
                    },
                    {
                        name:'personnel',
                        path:'personnel',
                        component:()=>import('../pages/personnel/ManagePersonnel.vue'),
                    },
                    {
                        name:'cost',
                        path:'cost',
                        component:()=>import('../pages/expense/Expense.vue'),
                    },
                ]
            },
        ]
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes:routes
})

router.beforeEach((to, from, next)=>{
    const cookie:any = useCookie
    if(to.path === '/'){
        next()
    }else if(to.path !== '/login' && !cookie.isKey('user')){
        ElMessage.error('没有权限!请登录')
        next('/login')
    }else if (cookie.isKey('user') && to.path === '.login'){
        ElMessage.warning('您已登录!')
        next('/')
    }else next()
})

export default router