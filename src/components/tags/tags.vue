<template>
    <div id="tags">
        <div class="tag active">
            <i class="icon iconfont icon-React"></i>
            理财中心
            <i class="close el-icon-close"></i>
        </div>
        <div class="tag">
            <i class="icon iconfont icon-React"></i>
            公募基金
            <i class="close el-icon-close"></i>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: 'Tags',
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
#tags {
    height: 40px;
    width: calc(100% + 4px);
    display: flex;
    margin-left: -4px;
    background-color: #252526;

    .tag {
        padding: 0px 30px;
        line-height: 40px;
        font-size: 12px;
        background-color: #2d2d2d;
        color: #5cc991;
        position: relative;
        cursor: pointer;

        &:not(:first-child) {
            margin-left: 1px;
        }

        .close {
            width: 10px;
            height: 10px;
            font-size: 14px;
            color: #FFFFFF;
            position: absolute;
            right: 9px;
            top: 14px;
            display: none;
        }

        &:hover {
            .close {
                display: block;
            }
        }

        &.active {
            background-color: #1e1e1e;

            .close {
                display: block;
            }
        }

        .icon {
            position: absolute;
            left: 9px;
            top: 0px;
        }

        .icon-React {
            color: #5adafd;
        }
    }
}
</style>
