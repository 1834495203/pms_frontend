<script setup lang="ts">
import { PageResult, complaint, resultComplaintDto } from '../../../model/entity'
import { Picture, IceCreamRound } from '@element-plus/icons-vue'
import { ref } from 'vue'

const prop = defineProps<{result?:PageResult<resultComplaintDto>, loading?:boolean, auth:string}>()

const src = ref()
const currentComplaint = ref<resultComplaintDto>()
const dialogTableVisible = ref(false)
const filterTag = (value: string, row: complaint) => {
    return row.state === value
}

const toHandle = (index: number, row: resultComplaintDto)=>{
    src.value = 'http://api.mahiro.com/file/mediafiles/'+row.userProfile
    currentComplaint.value = row
    dialogTableVisible.value = !dialogTableVisible.value
    console.log(row)
}
</script>

<template>
    <div class="displayComplaint">
        <el-table 
        ref="tableRef" 
        row-key="date" 
        :data="prop.result?.items" 
        style="width: 100%"
        v-loading="loading">
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
            :filter-method="filterTag"
            filter-placement="bottom-end">
                <template #default="scope">
                    <el-tag v-if="scope.row.state === '40011'">未处理</el-tag>
                    <el-tag v-else-if="scope.row.state === '40012'">处理中</el-tag>
                    <el-tag v-else-if="scope.row.state === '40010'">已处理</el-tag>
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
                        <el-input type="textarea" :rows="5" v-model="currentComplaint!.process" maxlength="300" show-word-limit/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button type="priamry">提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style>
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