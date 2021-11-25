<template>
    <div id="mytitle" :class="[active ? 'active' : '']">
        <div class="logo"></div>
        <div class="header-info">
            <div class="menus">
                <div class="title-bar no-drag">File</div>
            </div>
            <div class="btns">
                <span class="header-icon el-icon-minus no-drag" @click="minimizeWin"></span>
                <span class="header-icon el-icon-full-screen no-drag" @click="maximizeWin"></span>
                <span class="header-icon el-icon-close no-drag" @click="closeWin"></span>
            </div>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { onMounted, ref } from 'vue';
export default {
    name: 'Home',
    setup() {
        const active = ref(false);

        const minimizeWin = () => {
            ipcRenderer.send('window-min');
        };
        const maximizeWin = () => {
            ipcRenderer.send('window-max');
        };
        const closeWin = () => {
            ipcRenderer.send('window-close');
        };

        onMounted(() => {
            ipcRenderer.on('window-focus', () => {
                active.value = true;
            });
            ipcRenderer.on('window-blur', () => {
                active.value = false;
            });
        });

        return {
            minimizeWin,
            maximizeWin,
            closeWin,
            active
        };
    }
};
</script>

<style scoped lang="less">
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
}
</style>
