import fs from 'fs-extra';
import { app, remote } from 'electron';
import path from 'path';

// 根据process.type来分辨在哪种模式使用哪种模块
const APP = process.type === 'renderer' ? remote.app : app;

// 获取electron应用的用户目录
const STORE_PATH = APP.getPath('userData');

export const copyDist = path.join(STORE_PATH, '/appDistTemp');

if (!fs.pathExistsSync(copyDist)) {
    fs.mkdirpSync(copyDist);
}

export const copy = (projectName, src, dist) => {
    return new Promise((resolve, reject) => {
        const _dist = path.join(copyDist, dist);
        // 不存在的话创建目录
        if (!fs.pathExistsSync(_dist)) {
            fs.mkdirpSync(_dist);
        }
        spliceFile(projectName);
        fs.copy(src, _dist, err => {
            if (err) return reject({
                code: 0,
                err
            });
            resolve({
                code: 1
            });
        });
    });
};

// 只保存前最新的5个
const spliceFile = (projectName) => {
    const projectPath = path.join(copyDist, projectName);
    const lst = fs.readdirSync(projectPath);
    let delList = null;
    if (lst && lst.length > 5) {
        delList = lst.slice(0, lst.length - 5);
    }
    // 删除目录
    if (delList) {
        delList.map(name => {
            const delPath = path.join(projectPath, name);
            fs.rmdir(delPath, {recursive: true});
        });
    }
};

// 只保存前最新的5个
export const getProjectHistory = (projectName) => {
    let lst = [];
    if (projectName) {
        const projectPath = path.join(copyDist, projectName);
        if (fs.pathExistsSync(projectPath)) {
            lst = fs.readdirSync(projectPath);
        }
    }
    lst = lst.map(item => {
        const ary = item.split('-');
        return {
            fullName: item,
            shortName: ary[0],
            date: `${ary[1]}-${ary[2]}-${ary[3]}`,
            time: `${ary[4]}:${ary[5]}:${ary[6]}`
        };
    });
    return lst || [];
};

export const getPath = (projectName, name) => {
    return path.join(copyDist, projectName, name);
};

// 删除指定文件
export const deleteFile = (projectName, fullName) => {
    const projectPath = path.join(copyDist, projectName);
    const delPath = path.join(projectPath, fullName);
    fs.rmdirSync(delPath, {recursive: true});
};
