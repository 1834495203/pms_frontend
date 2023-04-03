<script setup lang="ts">
import { allUser } from '../../model/entity'
import { ElNotification as notify } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { IceCreamRound } from '@element-plus/icons-vue'

const prop = defineProps<{
    user:allUser, anonymous?:boolean, src:string, hasAnonymous:boolean
}>()
const router = useRouter()
const isAnonymous = ref(prop.anonymous)

const emits = defineEmits(['isAnonymous'])

watch(()=>isAnonymous.value, ()=>{
    emits('isAnonymous', isAnonymous.value)
})

const onBack = async () => {
    notify('Back')
    router.back()
}
</script>

<template>
    <el-page-header @back="onBack" style="color: black;">
        <template #content>
            <div class="flex items-center" v-if="!isAnonymous">
                <el-avatar
                class="mr-3"
                :size="50"
                :src="prop.src">
                    <span>{{ prop.user?.username }}</span>
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
        
        <template #extra v-if="prop.hasAnonymous">
            <div class="flex items-center">
                <el-switch v-model="isAnonymous" active-text="匿名模式"/>
            </div>
        </template>
    </el-page-header>
    <el-divider><el-icon><IceCreamRound /></el-icon></el-divider>
</template>

<style>
</style>