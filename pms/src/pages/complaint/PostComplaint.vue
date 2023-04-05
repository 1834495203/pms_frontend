<script setup lang="ts">
import { ElMessage, ElNotification as notify, UploadInstance, UploadUserFile, UploadFile, UploadFiles, ElLoading } from 'element-plus'
import axios from '../../api/request'
import { onMounted, ref } from 'vue'
import { allUser, complaint, pict, userInfo} from '../../model/entity'
import { useRouter } from 'vue-router'
import useCookie from 'vue-cookies'
import jwt from 'jwt-decode'
import pageHeader from '../components/pageHeader.vue'
import uploadPict from '../components/uploadFile.vue'
 
//arr存储待写入数据库的图片信息id
const arr = ref<Map<string, number>>(new Map<string, number>())
const pict = ref<pict>()
const uploadRef = ref<UploadInstance>()
const cookie:any = useCookie
const headers: Record<string, any> = {
    'TOKEN': cookie.get('user')
}
const complaint = ref<complaint>({
    pubilsherId: -1,
    title: ''
})
const router = useRouter()
const user = ref<allUser>()
const src = ref('')
const anonymous = ref(false)

const getArr = (ar:Map<string, number>)=>{
    arr.value = ar
}

onMounted(()=>{
    axios.get('/pms/auth/info').then((res)=>{
        if(res.status === 200){
            user.value = res.data.result
            if(user.value?.profile !== null)
            src.value = `http://api.mahiro.com/file/mediafiles/${user.value?.profile}`
        }
    })
})

const isAnonymous = (val:boolean)=>{
    anonymous.value = val
}

const toExceed = (files: File[], uploadFiles: UploadUserFile[])=>{
    ElMessage.warning("最大不超过6张图")
}

const uploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
    //文件上传
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

const toSubmit = ()=>{
    //加载动画
    console.log(arr)
    const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
    })
    const user:userInfo = jwt(cookie.get('user'))
    let obj = Object.create(null)
    for(let[k,v] of arr.value){
        obj[k] = v
    }
    complaint.value.profiles = JSON.stringify(obj)
    complaint.value.pubilsherId = user.id
    if(anonymous){
        complaint.value.pubilsherId = 0
    }
    axios.put('pms/form/complaint', complaint.value).then((res)=>{
        if(res.status === 200){
            if(res.data.type === 101){
                ElMessage.success('发送成功')
                router.push({name: 'result', query: {state: 'success'}})
            }else{
                ElMessage.success('发送失败')
                router.push({name: 'result', query: {state: 'error'}})
            }
        }
    }).finally(()=>{
        loading.close()
    })
}
</script>

<template>
    <div aria-label="A complete example of page header">
        <pageHeader 
        :has-anonymous="true" 
        :src="src" 
        :anonymous="anonymous" 
        :user="user!"
        @is-anonymous="isAnonymous"/>
        <!-- 投诉表单 -->
        <div class="complaint-form">
            <el-form :model="complaint" label-width="120px" label-position="left">
                <el-form-item label="标题">
                    <el-input 
                    v-model="complaint.title" 
                    :maxlength="30" 
                    placeholder="请输入标题" 
                    :show-word-limit="true"/>
                </el-form-item>
                <el-form-item label="图片上传">
                    <!-- <el-upload
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
                    </el-upload> -->
                    <uploadPict @arr="getArr"/>
                </el-form-item>
                <el-form-item label="问题描述">
                    <el-input 
                    v-model="complaint.content" 
                    :maxlength="300" 
                    type="textarea"
                    :rows="8"
                    :show-word-limit="true"/>
                </el-form-item>

                <el-button @click="toSubmit">提交</el-button>
            </el-form>
        </div>
    </div>
</template>

<style>
.complaint-form {
    margin: auto;
    color: black;
    width: 600px;
}

.items-center {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
}

</style>