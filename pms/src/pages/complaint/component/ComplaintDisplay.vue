<script setup lang="ts">
import { PageResult, complaint, resultComplaintDto } from '../../../model/entity'
import { ref } from 'vue'

const prop = defineProps<{result?:PageResult<resultComplaintDto>}>()
const show_iamge = ref(false)

const filterTag = (value: string, row: complaint) => {
    return row.state === value
}

const toDisplayImg = (num:number)=>{
    console.log(prop.result?.items![num].objectName)
}
</script>

<template>

    <el-table ref="tableRef" row-key="date" :data="prop.result?.items" style="width: 100%">
        <el-table-column
        prop="createDate"
        label="日期"
        sortable
        width="180"
        column-key="date"/>

        <el-table-column prop="title" label="标题" width="180" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="objectName" label="图片信息" >
            <template #default="scope">
                <el-image
                style="width: 100px; height: 100px"
                src="http://api.mahiro.com/file/mediafiles/2023/04/03/ed0637f348c86b5692dcd5ed9b48e646.jpg"
                :zoom-rate="1.2"
                :preview-src-list="prop.result?.items![scope.$index].objectName"
                :initial-index="4"
                fit="cover"
                :preview-teleported="true"/>
            </template>
        </el-table-column>

        <el-table-column
        prop="state"
        label="状态"
        width="100"
        :filters="[
            { text: '未处理', value: '40011' },
            { text: '已处理', value: '40010' },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
            <template #default="scope">
                <el-tag
                disable-transitions
                >{{ scope.row.state }}</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<style>
</style>