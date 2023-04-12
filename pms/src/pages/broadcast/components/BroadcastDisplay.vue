<script setup lang="ts">
import { PageResult, complaint, resultBroadcastDto, userInfo } from '../../../model/entity'
import { Picture  } from '@element-plus/icons-vue'

const prop = defineProps<{
    result?:PageResult<resultBroadcastDto>, 
    loading?:boolean,
    currentUser?:userInfo
    }>()

const filterTag = (value: string, row: complaint) => {
    return row.state === value
}

const handleDelete = (index: number, row: resultBroadcastDto) => {
    //删除
  console.log(index, row)
}
</script>

<template>
    <div class="displayBroadcast">
        <el-table 
        ref="tableRef" 
        :data="prop.result?.items" 
        v-loading="prop.loading">

            <el-table-column type="expand">
                <template #default="props">
                    <el-descriptions :column="3" :border="true">
                        <el-descriptions-item label="内容" width="200" :span="3">
                            {{ props.row.content }}
                        </el-descriptions-item>
                        <el-descriptions-item label="发布时间">
                            {{ props.row.createTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="发布人">
                            {{ props.row.username }}
                        </el-descriptions-item>
                    </el-descriptions>
                </template>
            </el-table-column>

            <el-table-column
            prop="createDate"
            label="日期"
            column-key="date"/>

            <el-table-column prop="title" label="标题" />

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
                { text: '紧急', value: '30010' },
                { text: '日常', value: '30011' },
                { text: '警告', value: '30012' },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
                <template #default="scope">
                    <el-tag v-if="scope.row.state === '30010'" type="danger">紧急</el-tag>
                    <el-tag v-else-if="scope.row.state === '30011'" type="success">日常</el-tag>
                    <el-tag v-else-if="scope.row.state === '30012'" type="warning">警告</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="correspond" label="对应">
                <template #default="scope">
                    <el-tag v-if="scope.row.correspond === '999'" type="success">全体</el-tag>
                    <el-tag v-else-if="scope.row.correspond === '900'" type="danger">员工</el-tag>
                    <el-tag v-else-if="scope.row.correspond === '910'" type="warning">业主</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" v-if="prop.currentUser?.auth.includes('900')">
                <template #default="scope">
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
</style>