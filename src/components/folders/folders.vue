<template>
    <div id="folders">
        <div class="title">WORKSPACES</div>
        <el-collapse accordion>
            <el-collapse-item name="1">
                <template #title>
                    开发环境
                </template>
                <el-scrollbar height="calc(100vh - 94px - 30px * 3)">
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent within interface: all elements should be consistent, such
                    as: design style, icons and texts, position of elements, etc.
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent within interface: all elements should be consistent, such
                    as: design style, icons and texts, position of elements, etc.
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent within interface: all elements should be consistent, such
                    as: design style, icons and texts, position of elements, etc.
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent within interface: all elements should be consistent, such
                    as: design style, icons and texts, position of elements, etc.
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                    <div>
                    Consistent within interface: all elements should be consistent, such
                    as: design style, icons and texts, position of elements, etc.
                    </div>
                    <div>
                    Consistent with real life: in line with the process and logic of real
                    life, and comply with languages and habits that the users are used to;
                    </div>
                </el-scrollbar>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template #title>
                    生产环境
                </template>
                <div>
                Consistent with real life: in line with the process and logic of real
                life, and comply with languages and habits that the users are used to;
                </div>
                <div>
                Consistent within interface: all elements should be consistent, such
                as: design style, icons and texts, position of elements, etc.
                </div>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template #title>
                    生产环境
                </template>
                <div>
                Consistent with real life: in line with the process and logic of real
                life, and comply with languages and habits that the users are used to;
                </div>
                <div>
                Consistent within interface: all elements should be consistent, such
                as: design style, icons and texts, position of elements, etc.
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: 'Folders',
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
#folders {
    width: 100%;
    height: 100%;

    .title {
        font-size: 12px;
        color: #bbbbbb;
        padding: 13px;
    }

    :deep(.el-collapse) {
        border-bottom: 0;
        border-top: 0;
    }

    :deep(.el-scrollbar__wrap) {
        background: linear-gradient(#252526, transparent 100%), linear-gradient(rgba(0, 0, 0, 1), transparent 100%);
        background-size: 100% 10px, 100% 2px;
        background-repeat: no-repeat;
        background-attachment: local, scroll;
    }

    :deep(.el-collapse-item) {
        border-top: 1px solid #474747;
    }

    :deep(.el-collapse-item__header) {
        background-color: transparent;
        height: 30px;
        line-height: 30px;
        color: #cccccc;
        border-bottom: 0;
        padding-left: 22px;
        position: relative;
    }

    :deep(.el-collapse-item__wrap) {
        background-color: transparent;
        color: #cccccc;
        border-bottom: 0;
    }

    :deep(.el-collapse-item__content) {
        color: #cccccc;
        padding-bottom: 0;
    }

    :deep(.el-collapse-item__arrow) {
        position: absolute;
        left: 5px;
        top: 9px;
    }
}
</style>
