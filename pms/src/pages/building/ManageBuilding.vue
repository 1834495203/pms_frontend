<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ResultHouseDto, information } from '../../model/entity'
import axios from 'axios'
import pageHeader from '../components/pageHeader.vue'
import { ElMessage, ElTree } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { toNumber } from 'lodash'
import { checkUserAuth } from '../func/GeneralFunc'
import { useRouter } from 'vue-router'
import useCookie from 'vue-cookies'

const isDelete = ref(false)
const alterHouseInfo = ref(false)
const bindPropInfo = ref(false)
const cookie:any = useCookie
const router = useRouter()
const dataSource = ref<ResultHouseDto[]>([])
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultExpand = ref([1])
const id = ref()
const header = {
    'TOKEN': cookie.get('user')
}

watch(()=>filterText.value, (val)=>{
    treeRef.value!.filter(val)
})

const queryNextLabel = [
    {
        val:'栋',
        type:'b',
        next:'单元'
    },
    {
        val:'单元',
        type:'u',
        next:'楼'
    },
    {
        val:'楼',
        type:'f',
        next:'门牌'
    },
    {
        val:'门牌',
        type:'d',
        next:''
    },
]

const getType = (val:string)=>{
    for (const key of queryNextLabel) {
        if(val === key.val)
            return key.type
    }
    return ''
}

const getNextLabel = (val:string)=>{
    for (const key of queryNextLabel) {
        if(val === key.val)
            return key.next
    }
    return ''
}

const filterNode = (value: string, data: ResultHouseDto, node:Node) => {
    if (!value) return true
    return computed(node, data).includes(value)
}

const computed = (node:Node, data:ResultHouseDto)=>{
    let s:string
    let parent = node.parent
    s = data.value! + data.label!

    while(parent.data.value !== undefined){
        s = parent.data.value + '-' + s
        parent = parent.parent
    }
    return s
}

const append = (node:Node, data: ResultHouseDto)=>{
    //展开父节点
    defaultExpand.value = [node.parent.data.hid]
    console.log(getNextLabel(node.label))
    let val = '1'
    if(data.children && data.children[data.children.length-1] !== undefined){
        val = (toNumber(data.children[data.children.length-1].value) + 1).toString()
    }
    //新增节点的信息
    const newNode = {
        hid:++id.value, 
        label:getNextLabel(node.label), 
        value:val, 
        children:[], 
        parent:node.data.hid,
        type:getType(getNextLabel(node.label))
    }
    axios.put('pms/form/building', newNode, {headers:header}).then((res)=>{
        if(res.status === 200){
            if(res.data.type === 606){
                ElMessage.success(res.data.msg)
                if(!data.children){
                    data.children = []
                }
                defaultExpand.value = [node.parent.data.hid]
                data.children.push(newNode)
            }else{
                ElMessage.error(res.data.msg)
            }
        }
    })
    dataSource.value = [...dataSource.value]
}

const remove = (node:Node, data:ResultHouseDto)=>{
    //展开父节点
    defaultExpand.value = [node.parent.data.hid]
    const parent = node.parent
    const children:ResultHouseDto[] = parent.data.children || parent.data
    const index = children.findIndex(d=>d.hid === data.hid)
    const result:ResultHouseDto = children.splice(index, 1)[0]
    console.log(result)
    axios.post('pms/form/building', result, {headers:header}).then((res)=>{
        if(res.status === 200){
            if(res.data.type === 604){
                ElMessage.warning(res.data.msg)
            }else ElMessage.error(res.data.msg)
        }
    }).finally(()=>{
        isDelete.value = false
    })
    defaultExpand.value = [node.parent.data.hid]
    dataSource.value = [...dataSource.value]
}

//将楼栋信息与业主绑定
const toBind = ()=>{
    bindPropInfo.value = true
}

//查看楼栋信息
const toQuery = (data:ResultHouseDto)=>{
    axios.get(`/pms/form/building/info/${data.hid}`).then((res)=>{
        if(res.status === 200){
            if(res.data.type === 603){
                //查询成功
            }
        }
    })
    alterHouseInfo.value = true
}

const defaultProps = {
  children: 'children',
  label: 'label',
  id:'hid'
}

onMounted(()=>{
    checkUserAuth(router)
    axios.get('/pms/form/building/1', {headers:header}).then((res)=>{
        if(res.status === 200){
            dataSource.value.push(res.data.result)
            id.value = dataSource.value[0].lastId
        }
    })
})
</script>

<template>
    <div class="manage-building">
        <pageHeader :has-anonymous="false"/>

        <el-input 
        v-model="filterText" 
        placeholder="搜索的格式为：{栋}-{单元}-{楼}-{门牌}" 
        :clearable="true"/>
        <el-tree
        ref="treeRef"
        :data="dataSource"
        show-checkbox
        node-key="hid"
        :defaultProps="defaultProps"
        :accordion="true"
        :indent="50"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultExpand">
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span style="margin: 0 20px;">{{ computed(node, data) }}</span>
                    <span>
                        <el-link 
                        @click="append(node, data)" 
                        type="success"
                        v-if="node.level !== 4"> 添加 </el-link>
                        <div v-else-if="node.level === 4" style="display: inline;">
                            <el-link type="success" @click="toBind"> 绑定 </el-link>
                            <el-link type="warning" style="margin-left: 8px" @click="toQuery(data)"> 查看 </el-link>
                        </div>
                        <el-link style="margin-left: 8px" type="danger" @click="isDelete = true"> 删除 </el-link>

                        <el-dialog
                        v-model="isDelete"
                        title="警告"
                        width="30%">
                            <span>确认删除此节点吗？</span>
                            <span style="display: block;">此操作将会删除该节点下的所有子节点!</span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="isDelete = false">取消</el-button>
                                    <el-button type="danger" @click="remove(node, data)">确认</el-button>
                                </span>
                            </template>
                        </el-dialog>
                    </span>
                </span>
            </template>
        </el-tree>

        <el-dialog v-model="bindPropInfo" title="业主信息绑定">

        </el-dialog>

        <el-dialog v-model="alterHouseInfo" title="房屋信息查看">
            
        </el-dialog>
    </div>
</template>

<style>
.manage-building .el-tree-node__content {
    height: 50px;
}
</style>