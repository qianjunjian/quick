<template>
    <div id="folders">
        <div class="title">WORKSPACES
            <el-dropdown
                trigger="click"
                size="mini"
                :hide-on-click="false"
                @command="choseWorkspace"
            >
                <i class="select-workspace">···</i>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="item in workSpaces" :key="item.id" :command="item.id"><span :class="['dropdown-icon', item.check ? 'el-icon-check' : '']"></span><span class="dropdown-name">{{ item.workName }}</span></el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-collapse accordion v-model="workSpacesActiveIndex" @change="handleChange">
            <template v-for="item in workSpaces">
                <el-collapse-item :key="item.id" :name="item.id" v-if="item.check">
                    <template #title>
                        <span class="work-name">{{ item.workName }}</span>
                        <div class="btns">
                            <i class="el-icon-document-add" v-show="item.id === workSpacesActiveIndex"></i>
                            <el-popconfirm
                                title="确定删除?"
                                confirmButtonText="确定"
                                cancelButtonText="取消"
                                @confirm="deleteWorkspace(item.id)">
                                <template #reference>
                                    <i class="el-icon-delete" v-show="!item.notDelete && item.id === workSpacesActiveIndex"></i>
                                </template>
                            </el-popconfirm>
                        </div>
                    </template>
                    <el-scrollbar :height="`calc(100vh - 94px - 30px * ${workSpacesShowCount})`">
                        <Project></Project>
                        <Project></Project>
                    </el-scrollbar>
                </el-collapse-item>
            </template>
        </el-collapse>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import Project from '../project/project.vue';

export default {
    name: 'Folders',
    components: {
        Project
    },
    setup() {
        const store = useStore();
        const tabIndex = computed(() => store.state.leftTabIndex);
        const workSpaces = computed(() => store.state.workSpaces);
        const workSpacesShowCount = computed(() => {
            const list = store.state.workSpaces.filter(item => item.check === true);
            return list.length;
        });
        const workSpacesActiveIndex = computed(() => store.state.workSpacesActiveIndex);

        const handleChange = val => {
            store.commit('setWorkSpacesActiveIndex', val);
        };

        const deleteWorkspace = val => {
            store.commit('deleteWorkspace', val);
        };

        const choseWorkspace = val => {
            store.commit('choseWorkspace', val);
        };

        return {
            tabIndex,
            workSpaces,
            workSpacesActiveIndex,
            workSpacesShowCount,
            handleChange,
            deleteWorkspace,
            choseWorkspace
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
        position: relative;

        .select-workspace {
            font-size: 20px;
            color: #bbbbbb;
            cursor: pointer;
        }

        :deep(.el-dropdown) {
            position: absolute;
            right: 20px;
            top: 10px;
        }
    }

    .work-name {
        flex: 1;
        width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .btns {
        margin-right: 13px;
        font-size: 15px;

        i {
            padding: 3px;

            &:hover {
                background-color: #505050;
            }
        }
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
        justify-content: space-between;
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
