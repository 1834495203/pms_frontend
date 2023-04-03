<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const state = ref()

onMounted(()=>{
    state.value = route.query.state    
})

const toBack = ()=>{
    router.back()
}
</script>

<template>
    <el-result
    icon="success"
    title="Success Tip"
    sub-title="Please follow the instructions"
    v-if="state === 'success'">
        <template #extra>
            <el-button type="primary" @click="toBack">Back</el-button>
        </template>
    </el-result>

    <el-result
    icon="warning"
    title="Warning Tip"
    sub-title="Please follow the instructions"
    v-else-if="state === 'warning'">
        <template #extra>
            <el-button type="primary" @click="toBack">Back</el-button>
        </template>
    </el-result>

    <el-result
    icon="error"
    title="Error Tip"
    sub-title="Please follow the instructions"
    v-else-if="state === 'error'">
        <template #extra>
            <el-button type="primary" @click="toBack">Back</el-button>
        </template>
    </el-result>
</template>

<style>
</style>