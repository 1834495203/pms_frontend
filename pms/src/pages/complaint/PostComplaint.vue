<script setup lang="ts">
import { ElNotification as notify } from 'element-plus'
import axios from '../../api/request'
import { onMounted, ref } from 'vue'
import { Proprietor } from '../../model/entity'
import { IceCreamRound } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref<Proprietor>()
const src = ref('')
const anonymous = ref(false)

onMounted(()=>{
    axios.get('/pms/auth/info').then((res)=>{
        if(res.status === 200){
            user.value = res.data.result
            if(user.value?.profile !== null)
            src.value = `http://api.mahiro.com/file/mediafiles/${user.value?.profile}`
        }
    })
})

const onBack = async () => {
    notify('Back')
    router.back()
}
</script>

<template>
    <div aria-label="A complete example of page header">
        <el-page-header @back="onBack" style="color: black;">
            <template #content>
                <div class="flex items-center" v-if="!anonymous">
                    <el-avatar
                    class="mr-3"
                    :size="50"
                    :src="src">
                        <span>{{ user?.username }}</span>
                    </el-avatar>
                    <span class="text-large font-600 mr-3"> {{ user?.username }} </span>
                    <el-tag>业主</el-tag>
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
            
            <template #extra>
                <div class="flex items-center">
                    <el-switch v-model="anonymous" active-text="匿名模式"/>
                </div>
            </template>
        </el-page-header>
        <el-divider><el-icon><IceCreamRound /></el-icon></el-divider>
        <!-- 投诉表单 -->
        <div class="complaint-form">
            <h1>nihao</h1>
        </div>
    </div>
</template>

<style>
.complaint-form {
    color: black;
}

.items-center {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
}

</style>