<template>
    <div id="tags">
        <div :class="['tag', activeProjectId === item.id ? 'active' : ''] " v-for="item in projectHistory" :key="item.id" @click="clickHandle(item)">
            <i :class="['icon', 'iconfont', item.iconType === 'vue' ? 'icon-vue ' : item.iconType === 'backbone' ? 'icon-bold' : 'icon-React']"></i>
            {{item.projectName}}
            <i class="close el-icon-close" @click="deleteHandle($event, item)"></i>
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
        const projectHistory = computed(() => store.state.projectHistory);
        const activeProjectId = computed(() => store.state.activeProjectId);
        const clickHandle = item => {
            store.commit('setActiveProject', {
                ...item
            });
        };
        const deleteHandle = (e, item) => {
            e.stopPropagation();
            store.commit('deleteActiveProject', {
                id: item.id
            });
        };

        return {
            clickHandle,
            projectHistory,
            activeProjectId,
            deleteHandle
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
        color: #cccccc;
        position: relative;
        cursor: pointer;
        white-space: nowrap;

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
            color: #dab560;
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

        .icon-bold {
            color: #cc5c0c;
            top: 2px;
        }

        .icon-vue {
            color: #56b359;
        }
    }
}
</style>
