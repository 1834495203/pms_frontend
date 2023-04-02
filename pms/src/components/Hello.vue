<script setup lang="ts">
    import axios from '../api/request'
    import { ref, onMounted } from 'vue'
    import { visitor } from '../model/visitor'
    import { RestResponse } from '../model/general'

    const info = ref<RestResponse<visitor>>()

    onMounted(()=>{
        console.log("ok")
        axios.get('/pms/auth/test').then((res)=>{
            if(res.status === 200){
                console.log(res)
                info.value = res.data
            }
        })
    })

</script>

<template>
    <h1>你好, {{ info?.result.name }}</h1>
</template>