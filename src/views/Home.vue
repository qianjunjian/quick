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
        <el-card v-for="(item, index) in projects" :key="item.projectName" class="qd-card" shadow="always" @dblclick="openProject(item)" @contextmenu="rightClick(index, item)">
          <i class="el-icon-news"></i>
          <div>{{item.projectName}}</div>
        </el-card>
        <el-card class="qd-card vertical-center" @click="addProjectHandle" shadow="always">
          <i class="el-icon-plus"></i>
        </el-card>
      </div>
    </el-main>
    <el-drawer
      :title="showModalTitle"
      v-model="showAddProjectModal"
      @close="beforeClose"
      direction="rtl"
      destroy-on-close>
      <el-form ref="form1" :model="formData" :rules="rules1" label-width="85px">
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
        <el-form-item label="node版本">
          <el-input v-model="formData.nodeVersion"></el-input>
        </el-form-item>
        <el-form-item label="打包命令">
          <el-input v-model="formData.buildCmd"></el-input>
        </el-form-item>
        <el-form-item label="打包文件夹">
          <el-input v-model="formData.buildFile"></el-input>
        </el-form-item>
        <el-form-item label="247目录">
          <el-input v-model="formData.remoteUrl"></el-input>
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
import { ref, reactive, computed } from 'vue';
import cmd from 'node-cmd';
import db from '../database/datastore';
import { ipcRenderer, remote } from 'electron';
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus';
import process from 'child_process';
import { upload } from '../node/sftp';
import path from 'path';
import fs from 'fs';

const { Menu, MenuItem } = remote;
const remoteUrlDefault = '/usr/local/nginx/html/test';
const nodeVersionDefault = '14.16.1';
const buildCmdDefault = ' npm run build:dll && npm run build';
const buildFileDefault = 'release';

export default {
  name: 'Home',
  setup() {
    let formData = reactive({
      projectName: '',
      url: '',
      remoteUrl: remoteUrlDefault,
      nodeVersion: nodeVersionDefault,
      buildCmd: buildCmdDefault,
      buildFile: buildFileDefault
    });
    let formMenuData = reactive({
      name: ''
    });
    let showAddProjectModal = ref(false);
    let showEditProjectModal = ref(false);
    let editProjectIndex = ref(null);
    let showModalTitle = computed(() => {
      return showEditProjectModal.value ? '编辑项目' : '添加项目';
    });
    const beforeClose = () => {
      showAddProjectModal.value = false;
      showEditProjectModal.value = false;
      formData.projectName = '';
      formData.url = '';
      formData.remoteUrl = remoteUrlDefault;
      formData.nodeVersion = nodeVersionDefault;
      formData.buildCmd = buildCmdDefault;
      formData.buildFile = buildFileDefault;
      editProjectIndex.value = null;
    };
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
          if (showEditProjectModal.value) {
            showAddProjectModal.value = false;
            showEditProjectModal.value = false;
            db.read();
            const projectsList = db.get('projectList').value() || [];
            if (!projectsList[menuIndex.value]) {
              projectsList[menuIndex.value] = [];
            }
            projects.splice(editProjectIndex.value, 1, {
              ...formData
            });
            projectsList[menuIndex.value].splice(editProjectIndex.value, 1, {
              ...formData
            });
            db.set('projectList', projectsList).write();
            formData.projectName = '';
            formData.url = '';
            formData.remoteUrl = remoteUrlDefault;
            formData.nodeVersion = nodeVersionDefault;
            formData.buildCmd = buildCmdDefault;
            formData.buildFile = buildFileDefault;
            editProjectIndex.value = null;
          } else {
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
            formData.remoteUrl = remoteUrlDefault;
            formData.nodeVersion = nodeVersionDefault;
            formData.buildCmd = buildCmdDefault;
            formData.buildFile = buildFileDefault;
          }
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

    const openProjectFolder = project => {
      cmd.run(`cd /D ${project.url} && explorer .`);
    };

    const showError = err => {
      ElMessageBox.alert(err, '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'error'
      });
    };

    const showSuccess = msg => {
      ElMessageBox.alert(msg, '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'success'
      });
    };

    const buildProject = (project, callBack) => {
      if (!project.nodeVersion) {
        showError('请配置node版本！');
        return;
      }
      if (!project.buildCmd) {
        showError('请配置打包命令！');
        return;
      }
      if (!project.buildFile) {
        showError('请配置打包文件夹！');
        return;
      }
      let loadingInstance = ElLoading.service({
        fullscreen: true,
        background: 'rgba(0, 0, 0, 0.8)',
        text: '打包中,请稍等...'
      });
      process.exec(`nvm use ${project.nodeVersion}`, function(error) {
        if (error) {
          showError(error);
          loadingInstance.close();
        } else {
          if (fs.existsSync(path.join(project.url, project.buildFile))) {
            process.exec(`rd /s /q ${path.join(project.url, project.buildFile)}`, function(error) {
              if (error) {
                showError(error);
                loadingInstance.close();
              } else {
                cmd.run(`cd /D ${project.url} && ${project.buildCmd}`,
                  function(err){
                    if (err) {
                      showError(err);
                      loadingInstance.close();
                    } else {
                      if (callBack) {
                        callBack(project, loadingInstance);
                      } else {
                        showSuccess(`【${project.projectName}】 打包成功！`);
                        loadingInstance.close();
                      }
                    }
                  }
                );
              }
            });
          } else {
            cmd.run(`cd /D ${project.url} && ${project.buildCmd}`,
              function(err){
                if (err) {
                  showError(err);
                  loadingInstance.close();
                } else {
                  if (callBack) {
                    callBack(project, loadingInstance);
                  } else {
                    showSuccess(`【${project.projectName}】 打包成功！`);
                    loadingInstance.close();
                  }
                }
              }
            );
          }
        }
      });
    };

    const showDialog = () => {
      ipcRenderer.send('open-directory-dialog', 'openDirectory');
      ipcRenderer.on('selectedItem', (e, path) => {
        formData.url = path;
      });
    };

    const uploadProject = project => {
      if (!project.remoteUrl) {
        showError('请配置上传目录！');
        return;
      }
      if (project.remoteUrl.indexOf('/usr/local/nginx/html')) {
        showError('上传目录请配置在ngix目录下！【/usr/local/nginx/html/**】');
        return;
      }
      buildProject(project, (project, loadingInstance) => {
        loadingInstance = ElLoading.service({
          fullscreen: true,
          background: 'rgba(0, 0, 0, 0.8)',
          text: '打包成功。上传中,请稍等...'
        });
        upload({
          localStatic: path.join(project.url, project.buildFile), // 本地文件夹路径
          remoteStatic: project.remoteUrl,
          successCallBack: () => {
            showSuccess(`【${project.projectName}】 上传成功!`);
            loadingInstance.close();
          },
          errorCallBack: err => {
            showError(err);
            loadingInstance.close();
          }
        });
      });
    };

    const rightClick = (index, item) => {
      const menu = new Menu();
      menu.append(new MenuItem({
        label: '打开项目所在目录',
        click: () => {
          //
          openProjectFolder(item);
        }
      }));
      menu.append(new MenuItem({
        label: '使用vsCode打开',
        click: () => {
          //
          openProject(item);
        }
      }));
      menu.append(new MenuItem({
        label: '打包',
        click: () => {
          //
          buildProject(item);
        }
      }));
      menu.append(new MenuItem({
        label: '打包并上传247服务器',
        click: () => {
          //
          uploadProject(item);
        }
      }));
      menu.append(new MenuItem({
        label: '编辑',
        click: () => {
          //
          db.read();
          const projectsList = db.get('projectList').value() || [];
          const prohect = projectsList[menuIndex.value][index];
          formData.projectName = prohect.projectName;
          formData.url = prohect.url;
          formData.remoteUrl = prohect.remoteUrl;
          formData.nodeVersion = prohect.nodeVersion;
          formData.buildCmd = prohect.buildCmd;
          formData.buildFile = prohect.buildFile;
          showAddProjectModal.value = true;
          showEditProjectModal.value = true;
          editProjectIndex.value = index;
        }
      }));
      menu.append(new MenuItem({
        label: '删除',
        click: () => {
          //
          ElMessageBox.confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            db.read();
            const projectsList = db.get('projectList').value() || [];
            projectsList[menuIndex.value].splice(index, 1);
            projects.splice(index, 1);
            db.set('projectList', projectsList).write();
            ElMessage.success({
              message: '删除成功!'
            });
          }).catch(() => {
            ElMessage.info({
              message: '已取消删除'
            });
          });
        }
      }));
      menu.popup(remote.getCurrentWindow());
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
      rightClick,
      form1,
      form2,
      showModalTitle,
      beforeClose,
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

.el-card__body {
  min-height: 1.6px;
  min-width: 250px;
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
