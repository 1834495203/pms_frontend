<script setup lang="ts">
import { allUser } from '../../model/entity'
import { ElNotification as notify } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { IceCreamRound } from '@element-plus/icons-vue'
import axios from '../../api/request'

const prop = defineProps<{
    user?:allUser, anonymous?:boolean, src?:string, hasAnonymous:boolean
}>()
const router = useRouter()
const isAnonymous = ref(prop.anonymous)
const user = ref<allUser>()
const src = ref()

const emits = defineEmits(['isAnonymous'])

watch(()=>isAnonymous.value, ()=>{
    emits('isAnonymous', isAnonymous.value)
})

const onBack = async () => {
    notify('Back')
    router.back()
}

onMounted(()=>{
    if(prop.user === undefined || prop.src === undefined){
        axios.get('/pms/auth/info').then((res)=>{
            if(res.status === 200){
                user.value = res.data.result
                if(user.value?.profile !== null)
                src.value = `http://api.mahiro.com/file/mediafiles/${user.value?.profile}`
            }
        })
    }
})
</script>

<template>
    <el-page-header @back="onBack" style="color: black;">
        <template #content>
            <div class="flex items-center" v-if="!isAnonymous">
                <el-avatar
                class="mr-3"
                :size="50"
                :src="prop.src === undefined ? src : prop.src">
                    <span>{{ prop.user === undefined ? user?.username : prop.user.username }}</span>
                </el-avatar>
                <span class="text-large font-600 mr-3"> {{ prop.user === undefined ? user?.username : prop.user.username }} </span>
                <el-tag v-if="prop.user?.status === '91090' || user?.status === '91090'">业主</el-tag>
                <el-tag v-else-if="prop.user?.authority === '90090' || user?.authority === '90090'" type="danger">管理员</el-tag>
            </div>
            <div class="flex items-center" v-else>
                <el-avatar
                class="mr-3"
                :size="50">
                    <span>匿名</span>
                </el-avatar>
                <span class="text-large font-600 mr-3">匿名</span>
            </div>
        </template>
        
        <template #extra v-if="prop.hasAnonymous">
            <div class="flex items-center">
                <el-switch v-model="isAnonymous" active-text="匿名模式"/>
            </div>
        </template>
    </el-page-header>
    <el-divider><el-icon><IceCreamRound /></el-icon></el-divider>
</template>

<style>
.items-center {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
}
</style>