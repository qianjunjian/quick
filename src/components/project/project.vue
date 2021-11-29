<template>
    <div id="project">
        <div class="icon"><i class="iconfont icon-React"></i></div>
        <div class="info">
            <div class="title">理财中心</div>
            <!-- <div class="body">最近打包时间：2021.11.29</div> -->
             <div class="body">正在打包：</div>
            <div class="footer">
                <el-progress :stroke-width="4" :percentage="50" :indeterminate="true" />
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: 'Project',
    setup() {
        const store = useStore();
        const tabIndex = computed(() => store.state.leftTabIndex);
        const iconSelected = index => {
            if (index === tabIndex.value) {
                store.commit('setLeftTabIndex', 0);
            } else {
                store.commit('setLeftTabIndex', index);
            }
        };
        return {
            tabIndex,
            iconSelected
        };
    }
};
</script>

<style scoped lang="less">
#project {
    padding-left: 12px;
    padding-right: 12px;
    height: 60px;
    display: flex;
    border: 1px solid transparent;
    cursor: pointer;

    .icon {
        width: 50px;
        height: 50px;
        position: relative;
        align-self: center;
    }

    .icon-React {
        color: #5adafd;
    }

    .iconfont {
        font-size: 50px;
        position: absolute;
        left: 0;
        top: -18px;
        width: 50px;
        height: 50px;
    }
    .info {
        flex: 1;
        width: 0;
        margin-left: 10px;
        padding: 5px 0;
    }

    &:hover {
        background-color: #2a2d2e;
    }

    &:active {
        background-color: #094771;
        border: 1px solid #007fd4;
    }

    .title {
        font-size: 14px;
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .body {
        font-size: 11px;
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .footer {
        font-size: 11px;
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :deep(.el-progress__text) {
        color: #cccccc;
        font-size: 11px !important;
        min-width: 25px !important;
    }
}
</style>
