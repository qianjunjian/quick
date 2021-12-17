import { ElMessageBox, ElNotification } from 'element-plus';
import process from 'child_process';
import fs from 'fs';
import path from 'path';
import cmd from 'node-cmd';
import { formatDateWithYear, formatDate } from '../utils/commonUtils';
import { copy } from './copy';
import { upload } from './sftp';

const showError = err => {
    ElMessageBox.alert(err, '提示', {
      confirmButtonText: '确定',
      showCancelButton: false,
      type: 'error'
    });
};

export const buildProject = (project, store, callBack) => {
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

  store.commit('setBuilding', {
    id: project.id,
    type: 2
  });
  process.exec(`nvm use ${project.nodeVersion}`, function(error) {
    if (error) {
      showError(error);
    } else {
      if (fs.existsSync(path.join(project.url, project.buildFile))) {
        process.exec(`rd /s /q ${path.join(project.url, project.buildFile)}`, function(error) {
          if (error) {
            showError(error);
          } else {
            cmd.run(`cd /D ${project.url} && ${project.buildCmd}`,
              function(err){
                if (err) {
                  showError(err);
                } else {
                  let time = new Date();
                  let _time = formatDate(time);
                  time = formatDateWithYear(time);

                  // 备份打包代码
                  const distTemp = `/${project.projectName}/${project.projectName + '-' + time}`;
                  copy(project.projectName, path.join(project.url, project.buildFile), distTemp);

                  if (callBack) {
                    callBack(project, _time);
                    return;
                  } else {
                    ElNotification({
                      title: '打包成功',
                      message: `${_time}  ${project.projectName}  打包成功！`,
                      type: 'success',
                      duration: 0,
                      position: 'bottom-right'
                    });
                  }
                }
                store.commit('setBuilding', {
                  id: project.id,
                  type: 1
                });
              }
            );
          }
        });
      } else {
        cmd.run(`cd /D ${project.url} && ${project.buildCmd}`,
          function(err){
            if (err) {
              showError(err);
            } else {
              let time = new Date();
              let _time = formatDate(time);
              time = formatDateWithYear(time);

              // 备份打包代码
              const distTemp = `/${project.projectName}/${project.projectName + '-' + time}`;
              copy(project.projectName, path.join(project.url, project.buildFile), distTemp);

              if (callBack) {
                callBack(project, _time);
                return;
              } else {
                ElNotification({
                  title: '打包成功',
                  message: `${_time} ${project.projectName} 打包成功！`,
                  type: 'success',
                  duration: 0,
                  position: 'bottom-right'
                });
              }
            }
            store.commit('setBuilding', {
              id: project.id,
              type: 1
            });
          }
        );
      }
    }
  });
};

export const buildAndUploadProject = (project, store) => {
  if (!project.remoteUrl) {
    showError('请配置上传目录！');
    return;
  }
  if (project.remoteUrl.indexOf('nginx/html')) {
    showError('上传目录请配置在ngix目录下！【/usr/local/nginx/html/**】');
    return;
  }
  buildProject(project, store, (project, _time) => {
    store.commit('setBuilding', {
      id: project.id,
      type: 3
    });
    const timeout = setTimeout(() => {
      upload({
        localStatic: path.join(project.url, project.buildFile), // 本地文件夹路径
        remoteStatic: project.remoteUrl,
        successCallBack: () => {
          ElNotification({
            title: '打包并上传成功',
            message: `${_time}  ${project.projectName}  打包并上传成功！`,
            type: 'success',
            duration: 0,
            position: 'bottom-right'
          });
          store.commit('setBuilding', {
            id: project.id,
            type: 1
          });
          timeout && clearTimeout(timeout);
        },
        errorCallBack: err => {
          showError(err);
          store.commit('setBuilding', {
            id: project.id,
            type: 1
          });
          timeout && clearTimeout(timeout);
        }
      });
    }, 100);
  });
};

export const uploadProject = (project, store, path, fullName) => {
  if (!project.remoteUrl) {
    showError('请配置上传目录！');
    return;
  }
  if (project.remoteUrl.indexOf('nginx/html') < 0) {
    showError('上传目录请配置在ngix目录下！【/usr/local/nginx/html/**】');
    return;
  }
  store.commit('setBuilding', {
    id: project.id,
    type: 3
  });
  const timeout = setTimeout(() => {
    upload({
      localStatic: path, // 本地文件夹路径
      remoteStatic: project.remoteUrl,
      successCallBack: () => {
        ElNotification({
          title: '上传成功',
          message: `${fullName} 上传成功！`,
          type: 'success',
          duration: 0,
          position: 'bottom-right'
        });
        store.commit('setBuilding', {
          id: project.id,
          type: 1
        });
        timeout && clearTimeout(timeout);
      },
      errorCallBack: err => {
        showError(err);
        store.commit('setBuilding', {
          id: project.id,
          type: 1
        });
        timeout && clearTimeout(timeout);
      }
    });
  }, 100);
};
