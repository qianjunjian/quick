<template>
    <div id="mytitle" :class="[active ? 'active' : '']">
        <div class="logo"></div>
        <div class="header-info">
            <div class="menus">
                <div :class="['title-bar', 'no-drag', showFilesMenusPannel ? 'active' : '']" @click="showFilesMenus">File</div>
            </div>
            <div class="btns">
                <span class="header-icon el-icon-minus no-drag" @click="minimizeWin"></span>
                <span class="header-icon el-icon-full-screen no-drag" @click="maximizeWin"></span>
                <span class="header-icon el-icon-close no-drag" @click="closeWin"></span>
            </div>
        </div>
        <div :class="['menu-info', showFilesMenusPannel ? '' : 'hide']">
            <div class="menu-item" @click="newWorkspace">new workspace<span>Ctrl+W</span></div>
            <div class="split-line"></div>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { onMounted, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import Mousetrap from 'mousetrap';
import { useStore } from 'vuex';

export default {
    name: 'Home',
    setup() {
        const active = ref(false);
        const store = useStore();
        const showFilesMenusPannel = ref(false);

        const minimizeWin = () => {
            ipcRenderer.send('window-min');
        };
        const maximizeWin = () => {
            ipcRenderer.send('window-max');
        };
        const closeWin = () => {
            ipcRenderer.send('window-close');
        };
        const hideMenusHandle = () => {
            showFilesMenusPannel.value = false;
        };
        const showFilesMenus = e => {
            e.preventDefault();
            e.stopPropagation();
            if (showFilesMenusPannel.value) {
                // 解绑
                document.removeEventListener('click', hideMenusHandle);
            } else {
                // 绑定
                document.addEventListener('click', hideMenusHandle);
            }
            showFilesMenusPannel.value = !showFilesMenusPannel.value;
        };

        const newWorkspace = () => {
            ElMessageBox.prompt('请输入您的工程目录名：', '新建', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /.{1,12}$/,
                inputErrorMessage: '请输入1到12位字符'
            }).then(({ value }) => {
                store.commit('addWorkspaces', value);
            }).catch(() => {});
        };

        Mousetrap.bind('ctrl+w', function() {
            newWorkspace();
        });

        onMounted(() => {
            ipcRenderer.on('window-focus', () => {
                active.value = true;
            });
            ipcRenderer.on('window-blur', () => {
                active.value = false;
                hideMenusHandle();
            });
        });

        return {
            minimizeWin,
            maximizeWin,
            closeWin,
            active,
            showFilesMenus,
            showFilesMenusPannel,
            newWorkspace
        };
    }
};
</script>

<style scoped lang="less">
.hide {
    display: none;
}
.no-drag {
    -webkit-app-region: no-drag;
}
#mytitle {
    width: 100%;
    height: 30px;
    background-color: #323233;
    color: #727273;
    -webkit-app-region: drag;
    display: flex;
    position: relative;
    z-index: 10;

    &.active {
       background-color: #3c3c3c;
       color: #bfbfbf;
    }

    .header-info {
        flex: 1;
        width: 0;
        display: flex;
        justify-content: space-between;
    }

    .btns {
        white-space: nowrap;
    }

    .logo {
        display: inline-block;
        margin-top: 3px;
        margin-left: 3px;
        height: 24px;
        width: 80px;
        min-width: 80px;
        background-image: url(../../assets/logo.png);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 80px 24px;
        margin-right: 20px;
    }

    .title-bar {
        line-height: 30px;
        font-size: 14px;
        padding: 0 5px;
        text-align: center;

        &.active {
            background-color: #505050;
        }

        &:hover {
            background-color: #505050;
        }
    }

    .header-icon {
        line-height: 30px;
        font-size: 16px;
        padding: 0 15px;
        text-align: center;

        &:hover {
            background-color: #505050;
        }

        &.el-icon-close:hover {
            background-color: rgb(214, 20, 37) !important;
        }
    }

    .menu-info {
        position: absolute;
        top: 30px;
        left: 103px;
        width: 200px;
        padding: 0 10px;
        background-color: #252526;
        font-size: 14px;
        min-height: 150px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 50%);
        .menu-item {
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            font-size: 13px;
            padding: 0 10px;

            span {
                float: right;
            }
        }
    }

    .split-line {
        width: 100%;
        height: 1px;
        background: #5c5c5c;
    }
}
</style>
