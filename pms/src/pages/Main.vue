<script setup lang="ts">
import { ref, onBeforeMount, onMounted, watch } from 'vue'
import useCookie from 'vue-cookies'
import jwt from 'jwt-decode'
import { userInfo } from '../model/entity'
import { useRouter } from 'vue-router'
import axios from '../api/request'
import { Proprietor } from '../model/entity'

const proprietor = ref<Proprietor>()
const router = useRouter()
const cookie:any = useCookie
const proprietorAuth = ref(true)
const adminAuth = ref(true)
const activeIndex = ref(router.currentRoute.value.name)

watch(()=>router.currentRoute.value.name, ()=>{
    activeIndex.value = router.currentRoute.value.name
})

// const myObserver = new ResizeObserver(entries => {
//     entries.forEach((res)=>{
//         const aside = document.querySelector('.aside')
//         aside!.setAttribute('max-height', String(res.contentBoxSize[0].blockSize).valueOf()+'px')
//     })
// });

onMounted(()=>{
    activeIndex.value = router.currentRoute.value.name
    // const x = document.querySelector('.el-main')
    // myObserver.observe(x!)
    axios.get('/pms/auth/info').then((res)=>{
        if(res.status === 200){
            proprietor.value = res.data.result
        }
    })
})

const handleSelect = (key: string, keyPath: string[]) => {
    router.push({name: key})
}

onBeforeMount(()=>{
    const user:userInfo = jwt(cookie.get('user'))
    //业主
    proprietorAuth.value = !user.auth.includes('910')
    //管理员
    adminAuth.value = !user.auth.includes('900')
})
</script>

<template>
    <div class="container-main">
        <el-container>
            <el-aside width="300px">
                <div class="aside">
                    <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    @select="handleSelect"
                    text-color="#ffffff"
                    :unique-opened="true">
                        <el-menu-item index="center">个人中心</el-menu-item>
                        <el-sub-menu index="2" :disabled="proprietorAuth">
                            <template #title>业主功能</template>
                            <el-menu-item index="postCom">投诉上报</el-menu-item>
                            <el-menu-item index="2-2">维修上报</el-menu-item>
                            <el-menu-item index="queryCom">投诉查询</el-menu-item>
                            <el-menu-item index="2-4">维修查询</el-menu-item>
                            <el-menu-item index="broadcastForProp">公告查看</el-menu-item>
                            <el-menu-item index="2-6">访客查询</el-menu-item>
                            <el-menu-item index="2-7">设施查询</el-menu-item>
                            <el-menu-item index="2-8">缴费服务</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="3" :disabled="adminAuth">
                            <template #title>管理员功能</template>
                                <el-menu-item index="building">楼栋管理</el-menu-item>
                                <el-menu-item index="broadcast">公告管理</el-menu-item>
                                <el-menu-item index="complaint">投诉管理</el-menu-item>
                                <el-menu-item index="3-4">访客管理</el-menu-item>
                                <el-menu-item index="3-5">维修管理</el-menu-item>
                                <el-menu-item index="personnel">人员管理</el-menu-item>
                                <el-menu-item index="3-7">设施管理</el-menu-item>
                                <el-menu-item index="cost">缴费管理</el-menu-item>
                        </el-sub-menu>
                        <el-menu-item index="4">更多</el-menu-item>
                    </el-menu>
                </div>
            </el-aside>

            <div ref="main" class="main">
                <el-main style="min-height: 100vh;"><router-view :user="proprietor"/></el-main>
            </div>
        </el-container>
    </div>
</template>

<style>
.main {
    background-color: white;
    width: 100%;
}

.container-main .el-container .main .el-main {
    /* box-sizing: content-box;
    min-height: 100vh;  */
    height: fit-content;
}

.el-sub-menu__title {
    border-bottom: 1px white solid;
}

.common-layout {
    min-width: 1100px;
}

.container-main .el-main {
    height: 100vh;
    /* background-color: #1c1c1c; */
    background-color: white;
}

.container-main .el-aside{
    box-sizing: content-box;
    min-width: 100px;
    max-width: 300px;
    width: 250px;
}

.container-main {
    min-width: 600px;
    background-color: #213d5b;
}

.container-main .el-menu {
    background-color:  #213d5b;
}
</style>