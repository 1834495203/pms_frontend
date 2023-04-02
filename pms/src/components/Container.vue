<script setup lang="ts">
import { ref } from 'vue'
import { ChatLineRound, Male } from '@element-plus/icons-vue'
import { IceCreamRound } from '@element-plus/icons-vue'

const activeName = ref('')

const arr:string[] = []
for (let i = 0; i < 6; i++) {
  arr[i] = (`src/assets/house-${i}.jpg`)
}
</script>

<template>
    <el-carousel :interval="3000" type="card" height="320px">
      <el-carousel-item v-for="a in arr" :key="a">
        <img :src="a"/>
      </el-carousel-item>
    </el-carousel>

    <el-divider>Rabindranath Tagore</el-divider>

    <div class="static">
      <el-row>
        <el-col :span="6">
          <el-statistic title="Daily active users" :value="268500" />
        </el-col>
        <el-col :span="6">
          <el-statistic :value="138">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Ratio of men to women
                <el-icon style="margin-left: 4px" :size="12">
                <Male />
                </el-icon>
              </div>
            </template>
          <template #suffix>/100</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="Total Transactions" :value="172000" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="Feedback number" :value="562">
            <template #suffix>
              <el-icon style="vertical-align: -0.125em">
                <ChatLineRound />
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>
  <el-collapse v-model="activeName" :accordion="true">
    <el-collapse-item title="Consistency" name="1">
      <div class="test">
        Consistent with real life: in line with the process and logic of real
        life, and comply with languages and habits that the users are used to;
      </div>
    </el-collapse-item>

    <el-collapse-item title="Feedback" name="2">
      <div class="test">
        Operation feedback: enable the users to clearly perceive their
        operations by style updates and interactive effects;
      </div>
    </el-collapse-item>

    <el-collapse-item title="Efficiency" name="3">
      <div class="test">
        Simplify the process: keep operating process simple and intuitive;
      </div>
      <div class="test">
        Definite and clear: enunciate your intentions clearly so that the
        users can quickly understand and make decisions;
      </div>
    </el-collapse-item>

    <el-collapse-item title="Controllability" name="4">
      <div class="test">
        Decision making: giving advices about operations is acceptable, but do
        not make decisions for the users;
      </div>
      <div class="test">
        Controlled consequences: users should be granted the freedom to
        operate, including canceling, aborting or terminating current
        operation.
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style>

.static  .el-statistic__content {
  color: white;
}

.static {
  margin-bottom: 40px;
}

.el-carousel {
  margin-bottom: 40px;
}

.el-carousel__item img {
  color: #475669;
  height: 100%;
  width: 100%;
}

.el-collapse {
    border-color: #1d3043 !important;
}

.el-collapse-item__header {
    height: 70px !important;
    font-size: 20px !important;
    padding: 0 20px;
    background-color: #1d3043 !important;
    color: white !important;
}

.el-collapse-item__wrap {
    background-color: #1d3043 !important;
    border-color: #1d3043 !important;
    color: white !important;
}

.test {
    color: white;
    font-size: 20px;
    text-align: left;
    padding: 0 10px;
}
</style>