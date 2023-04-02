<script setup lang="ts">
import { onBeforeMount } from 'vue'
import UseCookie from 'vue-cookies'
import { userInfo } from './model/entity'
import { ref } from 'vue'
import jwt from 'jwt-decode'
import Headers from './components/Headers.vue'

const cookie: any = UseCookie
const user_cookie = ref<userInfo>()
const username = ref()
const hasUser = ref(false)

onBeforeMount(() => {
  if((hasUser.value = cookie.isKey('user'))){
    user_cookie.value = jwt(cookie.get('user'))
    username.value = user_cookie.value?.sub.split(',')[0].split(':')[1].replaceAll('"', '')
  }
})
</script>

<template>
    <el-container>
      <!-- 页头 -->
      <el-header style="height: 80px; min-width: 1100px;">
        <Headers/>
      </el-header>

        <div class="common-layout">
          <!-- 主体 -->
          <el-main>
            <router-view/>
          </el-main>

          <!-- 页脚 -->
          <el-footer>
            <span>During the whole of a dull, dark soundless day | In the autumn of that year, when the clouds hung
            oppressively low in heaven</span>
          </el-footer>
        </div>
    </el-container>
</template>

<style>
.el-main {
  height: fit-content;
}

.el-header {
  background-color: #080c17;
}

.common-layout {
  max-width: 1400px;
  min-width: 1000px;
  width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  flex-basis: content;
}

.user-info a {
  text-decoration: none;
}

.el-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  display: flex;
  justify-content: center;
}

.el-button {
  color: white;
  border-color: #475669;
}
</style>
