<template>
  <el-container>
    <el-aside>
      <div class="menu-title">前端管理系统</div>
      <el-divider></el-divider>
      <div class="btns">
        <div :class="['btn', menuIndex === 0 ? 'active' : '']">建投开发环境</div>
        <div :class="['btn', menuIndex === 1 ? 'active' : '']">建投生产环境</div>
      </div>
      <el-button class="add-button" size="medium" icon="el-icon-plus"></el-button>
    </el-aside>
    <el-main>
      <div class="projects">
        <el-card class="qd-card" shadow="always">
          <i class="el-icon-news"></i>
          <div>业务办理</div>
        </el-card>
        <el-card class="qd-card" shadow="always">
          <i class="el-icon-news"></i>
           <div>理财中心</div>
        </el-card>
        <el-card class="qd-card" shadow="always">
          <i class="el-icon-news"></i>
          <div>公募基金</div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Home',
  setup() {
    const menuIndex = ref(0);

    return {
      menuIndex
    };
  }
};
</script>

<style scoped lang="less">
.el-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.el-aside {
  background: #252526;
  width: 200px !important;
  position: relative;
}

.add-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 20px);
  background: transparent;
  color: #409EFF;
  border-color: #325375;
}

.btns {
  position: absolute;
  top: 105px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  padding-bottom: 70px;
}

.btn {
  height: 40px;
  line-height: 40px;
  color: #ababab;
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
  cursor: pointer;
}

.active {
  color: #409EFF !important;
  border-right: 5px solid #409EFF;
  background: rgba(64,158,255,0.3);
}

.menu-title {
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #ccccd4;
  font-size: 24px;
}

.el-divider {
  margin-top: 0;
  background-color: #646975;
}

.el-main {
  background: #1e1e1e;
  color: #b6b6b6;
}

.projects {
  display: flex;
  flex-wrap: wrap;
}

.qd-card {
  width: 250px;
  display: inline-block;
  margin-right: 20px;
  text-align: center;
  margin-top: 20px;
  cursor: pointer;

  i {
    color: #409EFF;
    font-size: 45px;
  }
}
</style>
