<template>
    <div id="folders">
        <div class="title">WORKSPACES
            <el-dropdown
                trigger="click"
                size="mini"
                :hide-on-click="false"
                @command="choseWorkspace"
            >
                <i class="select-workspace" title="选择需要显示的文件夹">···</i>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="item in workSpaces" :key="item.id" :command="item.id"><span :class="['dropdown-icon', item.check ? 'el-icon-check' : '']"></span><span class="dropdown-name">{{ item.workName }}</span></el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-collapse accordion v-model="workSpacesActiveIndex">
            <template v-for="item in workSpaces">
                <el-collapse-item :key="item.id" :name="item.id" v-if="item.check">
                    <template #title>
                        <span class="work-name">{{ item.workName }}</span>
                        <div class="btns">
                            <i class="title-icon el-icon-refresh" @click="refresh($event)" title="刷新" v-show="item.id === workSpacesActiveIndex"></i>
                            <i class="title-icon el-icon-document-add" @click="addProject($event, item.id)" title="当前文件夹下新增工程" v-show="item.id === workSpacesActiveIndex"></i>
                            <el-popconfirm
                                title="确定删除?"
                                confirmButtonText="确定"
                                cancelButtonText="取消"
                                @confirm="deleteWorkspace(item.id)">
                                <template #reference>
                                    <i class="title-icon el-icon-delete" title="删除文件夹" v-show="!item.notDelete && item.id === workSpacesActiveIndex"></i>
                                </template>
                            </el-popconfirm>
                        </div>
                    </template>
                    <el-scrollbar :height="`calc(100vh - 94px - 30px * ${workSpacesShowCount})`">
                        <Project v-for="ob in item.children" :key="ob.id" :data="ob" @rightClick="rightClick($event, ob)" @leftClick="leftClick(ob)"></Project>
                    </el-scrollbar>
                </el-collapse-item>
            </template>
        </el-collapse>
        <el-dialog
            @closed="closeHandle"
            destroy-on-close
            :model-value="showAddProject"
            :title="form?.type === 2 ? '编辑' : '新增'">
            <el-form ref="form1" :model="form" :rules="rules1">
                <el-form-item label="workspace：" :label-width="120">
                    <el-select v-model="form.parentId" placeholder="请选择">
                        <el-option v-for="item in workSpaces" :key="item.id" :label="item.workName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目名称：" :label-width="120">
                    <el-input v-model="form.projectName"></el-input>
                </el-form-item>
                <el-form-item label="项目路径：" prop="url" :label-width="120">
                    <el-input v-model="form.url" @click="showDialog" readonly>
                        <template #append>
                            <el-button icon="el-icon-folder-opened" @click="showDialog"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="node版本：" :label-width="120">
                    <el-input v-model="form.nodeVersion"></el-input>
                </el-form-item>
                <el-form-item label="打包命令：" :label-width="120">
                    <el-input v-model="form.buildCmd"></el-input>
                </el-form-item>
                <el-form-item label="打包文件夹：" :label-width="120">
                    <el-input v-model="form.buildFile"></el-input>
                </el-form-item>
                <el-form-item label="上传目录：" :label-width="120">
                    <el-input v-model="form.remoteUrl"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button size="mini" @click="hideProject">取消</el-button>
                    <el-button size="mini" type="primary" @click="addHandle">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <ProjectMenu
            :x="projectMenuData?.x"
            :y="projectMenuData?.y"
            :data="projectMenuData?.data"
            v-show="projectMenuData?.show"
            @close="closeMenuHandle"
        ></ProjectMenu>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, reactive, watch, toRefs, ref } from 'vue';
import Project from '../project/project.vue';
import ProjectMenu from '../projectMenu/projectMenu.vue';
import { ipcRenderer } from 'electron';
import { refreshProjectStatus } from '../../utils/commonUtils';

export default {
    name: 'Folders',
    components: {
        Project,
        ProjectMenu
    },
    setup() {
        const store = useStore();
        const tabIndex = computed(() => store.state.leftTabIndex);
        const workSpaces = computed(() => store.state.workSpaces);
        const projectMenuData = reactive({
            x: 0,
            y: 0,
            show: false
        });
        const form1 = ref(null);
        const showAddProject = computed(() => store.state.showAddProject);

        const workSpacesShowCount = computed(() => {
            const list = store.state.workSpaces.filter(item => item.check === true);
            return list.length;
        });
        const workSpacesActiveIndex = computed({
            get() {
                return store.state.workSpacesActiveIndex;
            },
            set(val) {
                store.commit('setWorkSpacesActiveIndex', val);
            }
        });

        const deleteWorkspace = val => {
            store.commit('deleteWorkspace', val);
        };

        const choseWorkspace = val => {
            store.commit('choseWorkspace', val);
        };

        const addProject = (e, id) => {
            e.preventDefault();
            e.stopPropagation();
            store.commit('setShowAddProject', {
                showAddProject: true,
                showAddProjectData: {
                    type: 1,
                    parentId: id
                }
            });
        };

        const hideProject = () => {
            store.commit('setShowAddProject', {
                showAddProject: false,
                showAddProjectData: {}
            });
        };

        let data = reactive({
            form: {
                type: 1,
                id: '',
                parentId: '',
                projectName: '',
                url: '',
                nodeVersion: '',
                buildCmd: '',
                buildFile: '',
                remoteUrl: ''
            }
        });

        watch(() => store.state.showAddProjectData, (newValue) => {
            if (newValue) {
                data.form.type = newValue.type ?? '';
                data.form.id = newValue.id ?? Math.random();
                data.form.parentId = newValue.parentId ?? '';

                data.form.projectName = newValue.projectName ?? '';
                data.form.url = newValue.url ?? '';
                data.form.nodeVersion = newValue.nodeVersion ?? '14.16.1';
                data.form.buildCmd = newValue.buildCmd ?? 'npm run build:dll && npm run build';
                data.form.buildFile = newValue.buildFile ?? 'release';
                data.form.remoteUrl = newValue.remoteUrl ?? '/usr/local/nginx/html/test';
            }
        });

        const closeHandle = () => {
            store.commit('setShowAddProject', {
                showAddProject: false,
                showAddProjectData: null
            });
        };

        const addHandle = () => {
            //
            form1.value.validate((valid) => {
                if (valid) {
                    store.commit('modifyProject', {
                        ...data.form
                    });
                    closeHandle();
                }
            });
        };

        const showDialog = () => {
            ipcRenderer.send('open-directory-dialog', 'openDirectory');
            ipcRenderer.on('selectedItem', (e, path) => {
                data.form.url = path;
            });
        };

        const refresh = e => {
            e.preventDefault();
            e.stopPropagation();
            refreshProjectStatus(store.state.workSpaces, store.commit);
        };

        const rightClick = (e, ob) => {
            const status = store.state.building[ob.id]?.type;
            if (status === 2) {
                return;
            }
            projectMenuData.x = e.clientX - 48;
            projectMenuData.y = e.clientY - 30;
            projectMenuData.show = true;
            projectMenuData.data = ob;
            document.addEventListener('mousedown', closeMenuHandle);
        };

        const leftClick = (ob) => {
            store.commit('setActiveProject', {
                ...ob
            });
        };

        const closeMenuHandle = e => {
            e.preventDefault();
            e.stopPropagation();
            projectMenuData.x = 0;
            projectMenuData.y = 0;
            projectMenuData.show = false;
            document.removeEventListener('mousedown', closeMenuHandle);
        };

        return {
            tabIndex,
            workSpaces,
            workSpacesActiveIndex,
            workSpacesShowCount,
            deleteWorkspace,
            choseWorkspace,
            addProject,
            hideProject,
            showAddProject,
            addHandle,
            closeHandle,
            closeMenuHandle,
            showDialog,
            refresh,
            rightClick,
            leftClick,
            projectMenuData,
            form1,
            rules1: {
                projectName: [
                    {required: true, message: '请输入项目名称', trigger: 'blur'}
                ],
                url: [
                    {required: true, message: '请输入项目地址', trigger: 'change'}
                ]
            },
            ...toRefs(data)
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

            &:active {
                background-color: transparent;
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

    :deep(.el-collapse-item) {
        .title-icon {
            display: none;
        }
        &:hover, &:active {
            .title-icon {
                display: inline-block;
            }
        }
    }
}
</style>
