<script setup lang="ts">
import { ElMessage, ElNotification as notify, UploadInstance, UploadUserFile, UploadFile, UploadFiles, ElLoading } from 'element-plus'
import axios from '../../api/request'
import { ref, watch } from 'vue'
import { pict } from '../../model/entity'
import { Plus } from '@element-plus/icons-vue'
import useCookie from 'vue-cookies'

const toU = defineEmits(['arr'])
const arr = ref<Map<string, number>>(new Map<string, number>())
const pict = ref<pict>()
const uploadRef = ref<UploadInstance>()
const cookie:any = useCookie
const headers: Record<string, any> = {
    'TOKEN': cookie.get('user'),
}

watch(()=>arr.value, ()=>{
    toU('arr', arr.value)
}, {deep:true})

const toExceed = (files: File[], uploadFiles: UploadUserFile[])=>{
    ElMessage.warning("最大不超过6张图")
}

const uploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
    //文件上传成功后
    if(response.type === 313){
        pict.value = response.result
        arr.value.set(uploadFile.name, pict.value!.pid!)
    }
}

const pictRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
    //文件删除
    const id = arr.value.get(uploadFile.name)
    axios.delete(`/pms/form/upload/${id}`).then((res)=>{
        if(res.status === 200){
            console.log(res.data)
        }
    })
}
</script>

<template>
    <el-upload
    action="http://api.mahiro.com/pms/form/upload"
    ref="uploadRef"
    list-type="picture-card"
    :limit="6"
    name="file"
    method="post"
    :headers="headers"
    :auto-upload="true"
    :on-exceed="toExceed"
    :on-success="uploadSuccess"
    :on-remove="pictRemove">
        <el-icon><Plus /></el-icon>
    </el-upload>
</template>

<style>
</style>