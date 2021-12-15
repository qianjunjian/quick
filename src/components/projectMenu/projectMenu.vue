<template>
    <div id="projectMenu" :style="{top: y + 'px', left: x + 'px'}" @mousedown="mousedownHandle($event)">
        <div class="menu-item" @click="openFolder($event)">打开项目所在目录</div>
        <div class="menu-item" @click="openWidthVsCode($event)">使用vsCode打开</div>
        <div class="split-line"></div>
        <div class="menu-item" @click="buildHandle">打包</div>
        <div class="menu-item" @click="buildAndUploadHandle">打包并上传</div>
        <div class="split-line"></div>
        <div class="menu-item" @click="editHandle">编辑</div>
        <div class="menu-item" @click="deleteHandle">删除</div>
    </div>
</template>

<script>
import cmd from 'node-cmd';
import { useStore } from 'vuex';
import { buildProject, buildAndUploadProject } from '../../node/build';

export default {
    name: 'ProjectMenu',
    props: {
        x: Number,
        y: Number,
        data: Object
    },
    setup(props, context) {
        const store = useStore();
        const mousedownHandle = e => {
            e.preventDefault();
            e.stopPropagation();
        };
        const openFolder = e => {
            const { data: project } = props;
            cmd.run(`cd /D ${project.url} && explorer .`);
            context.emit('close', e);
        };
        const openWidthVsCode = e => {
            const { data: project } = props;
            cmd.run(`code ${project.url}`);
            context.emit('close', e);
        };
        const editHandle = e => {
            const { data: project } = props;
            store.commit('setShowAddProject', {
                showAddProject: true,
                showAddProjectData: {
                    ...project,
                    type: 2
                }
            });
            context.emit('close', e);
        };
        const buildHandle = e => {
            const { data: project } = props;
            buildProject(project, store);
            context.emit('close', e);
        };
        const deleteHandle = e => {
            const { data: project } = props;
            store.commit('deleteProject', {
                ...project
            });
            context.emit('close', e);
        };
        const buildAndUploadHandle = e => {
            const { data: project } = props;
            buildAndUploadProject(project, store);
            context.emit('close', e);
        };
        return {
            openFolder,
            openWidthVsCode,
            mousedownHandle,
            editHandle,
            deleteHandle,
            buildHandle,
            buildAndUploadHandle
        };
    }
};
</script>

<style scoped lang="less">
#projectMenu {
    position: absolute;
    z-index: 101;
    background-color: #252526;
    min-width: 200px;
    min-height: 150px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.5);
    color: #cccccc;
    padding: 10px 0;

    .menu-item {
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        font-size: 13px;
        padding: 0 30px;

        &:hover {
            background-color: #094771;
        }
    }

    .split-line {
        height: 1px;
        background: #5c5c5c;
        margin: 10px;
    }
}
</style>
