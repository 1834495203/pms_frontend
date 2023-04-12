<script setup lang="ts">
import { PageResult, resultComplaintDto, resultUserBaseInfo } from '../../../model/entity'
import { Picture, IceCreamRound } from '@element-plus/icons-vue'
import { onMounted, ref, watch} from 'vue'
import axios from '../../../api/request'
import { ElMessage, Filter, TableInstance } from 'element-plus'
import { RestResponse } from '../../../model/general'
import { complaint } from '../../../model/entity'

const tableRef = ref<TableInstance>()
const prop = defineProps<{
    result?:PageResult<resultComplaintDto>, 
    loading?:boolean, 
    auth:string,
    currentUserId:number
}>()
const emits = defineEmits(['filter'])

const src = ref()
const currentComplaint = ref<resultComplaintDto>()
const dialogTableVisible = ref(false)
const fellbackDialogVisible = ref(false)
const currentSolverInfo = ref<resultUserBaseInfo>()
const rate = ref()
const filter = ref()

const filterTag = (value: string, row: resultComplaintDto) => {
    return row.state === value
}

const toHandle = (index: number, row: resultComplaintDto)=>{
    src.value = 'http://api.mahiro.com/file/mediafiles/'+row.userProfile
    currentComplaint.value = row
    dialogTableVisible.value = !dialogTableVisible.value
    console.log(row)
}

const toFeedback = ()=>{
    //更新反馈信息
    if(currentComplaint.value !== undefined){
        currentComplaint.value.state = '40012'
        currentComplaint.value.solverId = prop.currentUserId
        axios.post('/pms/form/complaint', currentComplaint.value).then((res)=>{
            if(res.status === 200){
                dialogTableVisible.value = false
                console.log(res.data)
                ElMessage.success(res.data.msg)
            }
        })
    }
}

const filterChange = (filters:any)=>{
    filter.value = filters.state[0]
}

const toRowCell = (row:resultComplaintDto)=>{
    //业主操作权
    if(prop.auth.includes('910')){
        fellbackDialogVisible.value = true
    }
    //获取管理员用户信息
    currentComplaint.value = row
    currentSolverInfo.value = row.resultUserBaseInfo
}

//业主反馈
const toClickFellback = ()=>{
    currentComplaint.value!.state = '40010'
    axios.post('/pms/form/complaint', currentComplaint.value).then((res)=>{
        if(res.status === 200){
            const rr:RestResponse<complaint> = res.data
            if(rr.type === 605){
                fellbackDialogVisible.value = false
                ElMessage.success(rr.msg)
            }else{
                ElMessage.error(rr.msg)
            }
        }
    })
}

watch(()=>filter.value, ()=>{
    emits('filter', filter.value)
})
</script>

<template>
    <div class="displayComplaint">
        <el-table 
        ref="tableRef" 
        row-key="date" 
        :data="prop.result?.items" 
        style="width: 100%"
        v-loading="loading"
        :lazy="false"
        @row-dblclick="toRowCell"
        @filter-change="filterChange">
            <el-table-column
            prop="createDate"
            label="日期"
            width="180"
            column-key="date"/>

            <el-table-column prop="title" label="标题" width="180" />
            <el-table-column prop="content" label="内容" />
            <el-table-column prop="objectName" label="图片信息" >
                <template #default="scope">
                    <el-image
                    v-if="prop.result?.items![scope.$index].objectName !== null"
                    style="width: 100px; height: 100px"
                    :src="prop.result?.items![scope.$index].objectName![0]"
                    :zoom-rate="1.2"
                    :preview-src-list="prop.result?.items![scope.$index].objectName"
                    fit="cover"
                    :preview-teleported="true"/>
                    <div v-else class="demo-image__error">
                        <el-image>
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                    <span style="font-size: 0.5px;">暂无图片</span>
                                </div>
                            </template>
                        </el-image>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
            prop="state"
            label="状态"
            width="100"
            :filters="[
                { text: '未处理', value: '40011' },
                { text: '处理中', value: '40012' },
                { text: '已处理', value: '40010' },
            ]"
            column-key="state"
            :filter-method="filterTag"
            :filter-multiple="false"
            filter-placement="bottom"
            :reserve-selection="true">
                <template #default="scope">
                    <el-tag v-if="scope.row.state === '40011'">未处理</el-tag>
                    <el-tag v-else-if="scope.row.state === '40012'" type="warning">处理中</el-tag>
                    <el-tag v-else-if="scope.row.state === '40010'" type="danger">已处理</el-tag>
                </template>
            </el-table-column>

            <el-table-column v-if="prop.auth.includes('900')" label="处理">
                <template #default="scope">
                    <el-button
                    size="small"
                    type="success"
                    @click="toHandle(scope.$index, scope.row)">操作</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="fellbackDialogVisible" title="反馈操作" :draggable="true">
            <el-page-header v-if="currentSolverInfo !== null">
                <template #icon>
                    <el-icon><IceCreamRound /></el-icon>
                </template>
                <template #title>
                    <span>管理员</span>
                </template>
                <template #content>
                    <div class="flex items-center">
                        <el-avatar
                        class="mr-3"
                        :size="50"
                        :src="`http://api.mahiro.com/file/mediafiles/${currentSolverInfo?.profile}`">
                            <span>{{ currentSolverInfo?.username }}</span>
                        </el-avatar>
                        <span class="text-large font-600 mr-3"> {{ currentSolverInfo?.username }} </span>
                        <el-tag type="danger">管理员</el-tag>
                    </div>
                </template>
            </el-page-header>
            <div class="content">
                <el-descriptions title="反馈信息" :border="true" :colunm="3">
                    <el-descriptions-item label="发布人">{{ currentComplaint?.username }}</el-descriptions-item>
                    <el-descriptions-item label="标题">{{ currentComplaint?.title }}</el-descriptions-item>
                    <el-descriptions-item label="发表时间">{{ currentComplaint?.createTime }}</el-descriptions-item>
                    <el-descriptions-item label="反馈信息" :span="3">{{ currentComplaint?.process }}</el-descriptions-item>
                    <el-descriptions-item label="反馈时间">{{ currentComplaint?.processDate }}</el-descriptions-item>
                </el-descriptions>
                <el-form 
                :model="currentComplaint"
                v-if="currentSolverInfo !== null && currentComplaint !== undefined" 
                label-position="top">
                    <el-form-item>
                        <template #label>
                            <h1>评价</h1>
                        </template>
                        <span style="margin-right: 10px;">评分:</span>
                        <el-rate
                        v-model="currentComplaint.rate"
                        :texts="['不行', '还行', '一般', '不错', '很好']"
                        show-text
                        :disabled="currentComplaint.state==='40010'"/>
                    </el-form-item>
                    <el-form-item label="意见与建议" style="margin: 10px 0;">
                        <el-input 
                        maxlength="30" 
                        show-word-limit 
                        v-model="currentComplaint.opinion"
                        :disabled="currentComplaint.state==='40010'"/>
                    </el-form-item>
                    <el-button type="success" @click="toClickFellback" v-if="!(currentComplaint?.state==='40010')">提交</el-button>
                </el-form>
            </div>
        </el-dialog>

        <el-dialog v-model="dialogTableVisible" title="管理员操作" draggable>
            <el-page-header>
                <template #icon>
                    <el-icon><IceCreamRound /></el-icon>
                </template>
                <template #title>
                    <span>发表用户</span>
                </template>
                <template #content>
                    <div class="flex items-center">
                        <el-avatar
                        class="mr-3"
                        :size="50"
                        :src="src">
                            <span>{{ currentComplaint?.username }}</span>
                        </el-avatar>
                        <span class="text-large font-600 mr-3"> {{ currentComplaint?.username }} </span>
                        <el-tag>业主</el-tag>
                    </div>
                </template>
            </el-page-header>
            <div class="dialog-inner-form">
                <el-form :model="currentComplaint" label-width="100px" label-position="top">
                    <el-form-item label="标题">
                        <el-input v-model="currentComplaint!.title" disabled/>
                    </el-form-item>
                    <el-form-item label="内容">
                        <el-input v-model="currentComplaint!.content" disabled/>
                    </el-form-item>
                    <el-form-item label="反馈">
                        <el-input 
                        type="textarea" 
                        :rows="5" 
                        v-model="currentComplaint!.process" 
                        maxlength="300" show-word-limit
                        :disabled="currentComplaint?.state === '40012' || currentComplaint?.state === '40010'"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button type="priamry" @click="toFeedback">提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style>
.el-table-filter__list{
    color:black;
}

.demo-image__error .el-image {
    padding: 0 5px;
    max-width: 100px;
    max-height: 100px;
    width: 100%;
    height: 100px;
}

.demo-image__error .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}

.dialog-inner-form {
    margin-top: 10px;
}
</style>