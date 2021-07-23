<template>
  <el-container>
    <el-aside>
      <div class="menu-title">前端管理系统</div>
      <el-divider></el-divider>
      <div class="btns">
        <div v-for="(item, index) in menus" :key="index" :class="['btn', menuIndex === index ? 'active' : '']" @click="menuClickHandle(index)">{{item.name}}</div>
      </div>
      <el-button class="add-button" size="medium" icon="el-icon-plus" @click="addMenuHandle"></el-button>
    </el-aside>
    <el-main>
      <div class="projects">
        <el-card v-for="item in projects" :key="item.projectName" class="qd-card" shadow="always" @dblclick="openProject(item)">
          <i class="el-icon-news"></i>
          <div>{{item.projectName}}</div>
        </el-card>
        <el-card class="qd-card vertical-center" @click="addProjectHandle" shadow="always">
          <i class="el-icon-plus"></i>
        </el-card>
      </div>
    </el-main>
    <el-drawer
      title="添加项目"
      v-model="showAddProjectModal"
      direction="rtl"
      destroy-on-close>
      <el-form ref="form1" :model="formData" :rules="rules1" label-width="80px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="formData.projectName"></el-input>
        </el-form-item>
        <el-form-item label="项目路径" prop="url">
          <el-input v-model="formData.url" @click="showDialog" readonly>
            <template #append>
              <el-button icon="el-icon-folder-opened" @click="showDialog"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="center"><el-button type="primary" @click="onSubmit">添加</el-button></div>
      </el-form>
    </el-drawer>
    <el-drawer
      title="添加菜单"
      v-model="showAddMenuModal"
      direction="ltr"
      destroy-on-close>
      <el-form ref="form2" :model="formMenuData" :rules="rules2" label-width="60px">
        <el-form-item label="菜单" prop="name">
          <el-input v-model="formMenuData.name"></el-input>
        </el-form-item>
        <div class="center">
          <el-button type="primary" @click="onMenuSubmit">添加</el-button>
        </div>
      </el-form>
    </el-drawer>
  </el-container>
</template>

<script>
import { ref, reactive } from 'vue';
import cmd from 'node-cmd';
import db from '../database/datastore';
import { ipcRenderer } from 'electron';

export default {
  name: 'Home',
  setup() {
    let formData = reactive({
      projectName: '',
      url: ''
    });
    let formMenuData = reactive({
      name: ''
    });
    let showAddProjectModal = ref(false);
    let showAddMenuModal = ref(false);
    const form1 = ref(null);
    const form2 = ref(null);
    let menuIndex = ref(0);
    db.read();
    let projectsList = db.get('projectList').value();
    let projects = reactive(projectsList ? projectsList[menuIndex.value] || [] : []);
    let menuList = db.get('menuList').value();
    let menus = reactive(menuList || []);

    const addProjectHandle = () => {
      showAddProjectModal.value = true;
    };

    const onSubmit = () => {
      form1.value.validate((valid) => {
        if (valid) {
          showAddProjectModal.value = false;
          db.read();
          const projectsList = db.get('projectList').value() || [];
          if (!projectsList[menuIndex.value]) {
            projectsList[menuIndex.value] = [];
          }
          projects.push({
            ...formData
          });
          projectsList[menuIndex.value].push(formData);
          db.set('projectList', projectsList).write();
          formData.projectName = '';
          formData.url = '';
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    };

    const addMenuHandle = () => {
      showAddMenuModal.value = true;
    };

    const onMenuSubmit = () => {
      form2.value.validate((valid) => {
        if (valid) {
          showAddMenuModal.value = false;
          db.read();
          const menuList = db.get('menuList').value() || [];
          menus.push({
            ...formMenuData
          });
          menuList.push(formMenuData);
          db.set('menuList', menuList).write();
          formMenuData.name = '';
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    };

    const menuClickHandle = index => {
      menuIndex.value = index;
      db.read();
      let projectsList = db.get('projectList').value();
      const list = projectsList ? projectsList[menuIndex.value] || [] : [];
      projects.splice(0, projects.length);
      projects.splice(0, 0, ...list);
    };

    const openProject = project => {
      cmd.run(`code ${project.url}`);
    };

    const showDialog = () => {
      ipcRenderer.send('open-directory-dialog', 'openDirectory');
      ipcRenderer.on('selectedItem', (e, path) => {
        formData.url = path;
      });
    };

    return {
      menuIndex,
      projects,
      showAddProjectModal,
      showAddMenuModal,
      addProjectHandle,
      formData,
      onSubmit,
      addMenuHandle,
      formMenuData,
      menus,
      onMenuSubmit,
      menuClickHandle,
      openProject,
      showDialog,
      form1,
      form2,
      rules1: {
        projectName: [
          {required: true, message: '请输入项目名称', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '请输入项目地址', trigger: 'change'}
        ]
      },
      rules2: {
        name: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ]
      }
    };
  }
};
</script>

<style scoped lang="less">
.center {
  text-align: center;
}
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
  border-right: 5px solid #252526;
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
  margin-right: 0;
}

.qd-card {
  width: 250px;
  display: inline-block;
  text-align: center;
  margin: 10px;
  cursor: pointer;

  i {
    color: #409EFF;
    font-size: 45px;
  }

  &.vertical-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.el-form {
  padding: 20px 20px 20px 10px;
}

.add-button:hover {
  color: #409EFF;
  border-color: #409EFF !important;
  background-color: transparent !important;
}
.add-button:focus {
  color: #409EFF;
  border-color: #409EFF !important;
  background-color: transparent !important;
}
</style>
