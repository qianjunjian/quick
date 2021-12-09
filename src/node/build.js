import { ElMessageBox } from 'element-plus';
import process from 'child_process';
import fs from 'fs';
import path from 'path';
import cmd from 'node-cmd';

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
                  if (callBack) {
                    callBack(project);
                  } else {
                    // todo
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
              if (callBack) {
                callBack(project);
              } else {
                // todo
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
