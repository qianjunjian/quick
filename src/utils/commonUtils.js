import cmd from 'node-cmd';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

const dirLst = [
    'src',
    'app',
    'page',
    'pages'
];

export const getSrcPath = url => {
    let _src = url;
    dirLst.some(item => {
        const srcPath = path.join(url, item);
        if (existsSync(srcPath)) {
            _src = srcPath;
            return true;
        }
        return false;
    });
    return _src;
};

export const initDB = (db, store) => {
    db.read();
    let workSpaces = db.get('workSpaces').value();
    if (!workSpaces || workSpaces.length === 0) {
        // 设置默认值
        workSpaces = [];
        workSpaces.push({
            workName: '开发环境',
            notDelete: true,
            check: true,
            id: 1,
            server: '192.168.9.247',
            children: []
        });
        workSpaces.push({
            workName: '生产环境',
            notDelete: true,
            check: true,
            id: 2,
            server: '192.168.9.247',
            children: []
        });
    }

    // 同步到redux
    store.commit('setWorkspaces', workSpaces);
    let workSpacesActiveIndex = db.get('workSpacesActiveIndex').value();
    if (!workSpacesActiveIndex) {
        workSpacesActiveIndex = 1;
    }
    // 同步到redux
    store.commit('setWorkSpacesActiveIndex', workSpacesActiveIndex);
};

export const refreshProjectStatus = (workSpaces = [], commit) => {
    let hasChange = false;
    workSpaces.forEach(work => {
        if (work.children && work.children.length > 0) {
            work.children.forEach((project = {}) => {
                // 获取工程状态
                const srcPath = getSrcPath(project.url);
                const projectStatus = cmd.runSync(`cd /D ${srcPath} && svn st -qu`);
                // svn 上有改动
                let _status_u = false;
                // 本地有改动
                let _status_m = false;
                if (projectStatus.data) {
                    if (projectStatus.data.includes(' * ')) {
                        _status_u = true;
                    }
                    if (projectStatus.data.includes('M  ')) {
                        _status_m = true;
                    }
                }
                if (project.status_u !== _status_u || project.status_m !== _status_m) {
                    project.status_u = _status_u;
                    project.status_m = _status_m;
                    hasChange = true;
                }

                // 自动查找icon图标
                if (!project.iconType && project.url) {
                    const pkgUrl = path.join(project.url, 'package.json');
                    if (existsSync(pkgUrl)) {
                        const pkg = readFileSync(pkgUrl, 'utf-8');
                        if (pkg.includes('react')) {
                            project.iconType = 'react';
                        } else if (pkg.includes('vue')) {
                            project.iconType = 'vue';
                        } else if (pkg.includes('backbone')) {
                            project.iconType = 'backbone';
                        } else {
                            project.iconType = 'react';
                        }
                    }
                }
            });
        }
    });

    if (hasChange) {
        commit('setWorkspaces', workSpaces);
    }
};
