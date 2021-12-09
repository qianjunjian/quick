<template>
    <div id="left">
        <div class="left-top">
            <div :class="['common-icon', 'el-icon-folder', tabIndex === 1 ? 'active' : '']" @click="() => iconSelected(1)"></div>
            <div :class="['common-icon', 'el-icon-search', tabIndex === 2 ? 'active' : '']" @click="() => iconSelected(2)"></div>
        </div>
        <div class="left-bottom">
            <div class="common-icon el-icon-setting" @click="menusClick"></div>
            <div :class="['setting-layout', showMenus ? '' : 'hide']" @click="hideClick">
                <div class="setting-info">
                    <div class="menu-item">上传服务器设置</div>
                    <div class="split-line"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';

export default {
    name: 'Left',
    setup() {
        const store = useStore();
        const showMenus = ref(false);
        const tabIndex = computed(() => store.state.leftTabIndex);
        const iconSelected = index => {
            if (index === tabIndex.value) {
                store.commit('setLeftTabIndex', 0);
            } else {
                store.commit('setLeftTabIndex', index);
            }
        };
        const menusClick = () => {
            showMenus.value = true;
        };
        const hideClick = () => {
            showMenus.value = false;
        };
        return {
            tabIndex,
            iconSelected,
            showMenus,
            menusClick,
            hideClick
        };
    }
};
</script>

<style scoped lang="less">
#left {
    height: 100%;
    width: 48px;
    min-width: 48px;
    background: #333333;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .common-icon {
        padding: 11px 0;
        color: #858585;
        font-size: 26px;
        cursor: pointer;
        width: 100%;
        text-align: center;
        position: relative;

        &.active {
            color: #ffffff;

            &::after {
                content: "";
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 2px;
                background: #ffffff;
            }
        }
    }

    .setting-layout {
        position: fixed;
        background-color: transparent;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 100;

        &.hide {
            display: none;
        }
    }

    .setting-info {
        position: absolute;
        bottom: 20px;
        left: 48px;
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
}
</style>
