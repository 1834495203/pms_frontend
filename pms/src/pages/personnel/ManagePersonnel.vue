<script setup lang="ts">
import { ref, onMounted } from 'vue'
import pageHeader from '../components/pageHeader.vue'
import { PageResult, Proprietor, QueryPersonnel, allUser } from '../../model/entity'
import Query4Personnel from './components/Query4Personnel.vue'

const currentPage = ref(1)
const proprietors = ref<PageResult<Proprietor>>()
const prop = ref<QueryPersonnel>({})
const activeName = ref('first')

const toGetPageResult = (result:PageResult<any>)=>{
    proprietors.value = result
}

const toChange = (val:number)=>{
    currentPage.value = val
}

const toAlter = (row:Proprietor)=>{
    console.log(row)
}

onMounted(()=>{
})
</script>

<template>
    <div class="dispaly-ersonnel">
        <pageHeader :has-anonymous="false"/>
        <el-tabs v-model="activeName" class="demo-tabs" tab-position="right">
            <el-tab-pane label="业主" name="first">
                <Query4Personnel 
                :query="prop" 
                :current-page="currentPage"
                @get-page-result="toGetPageResult"/>
                <div class="dispaly-prop">
                    <el-table 
                    :data="proprietors?.items" 
                    style="width: 100%"
                    row-key="username"
                    size="large">
                        <el-table-column prop="username" label="用户名" fixed/>
                        <el-table-column prop="name" label="姓名"/>
                        <el-table-column prop="phone" label="联系电话"/>
                        <el-table-column prop="age" label="年龄"/>
                        <el-table-column prop="gender" label="性别"/>
                        <el-table-column fixed="right" label="操作">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="toAlter(scope.row)">编辑</el-button>
                            <el-button link type="danger" size="small">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination 
                    v-if="proprietors !== undefined && proprietors !== null"
                    v-model:current-page="currentPage"
                    v-model:page-size="proprietors.pageSize"
                    layout="prev, pager, next, total" 
                    v-model:total="proprietors.counts"
                    @current-change="toChange"/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="管理员" name="second">
                <div class="display-admin">

                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style>
</style>