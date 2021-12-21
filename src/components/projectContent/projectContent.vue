<template>
    <div id="projectContent">
        <div class="header">
            <div class="icon"><i :class="['icon', 'iconfont', projectDetail?.iconType === 'vue' ? 'icon-vue ' : projectDetail?.iconType === 'backbone' ? 'icon-bold' : 'icon-React']"></i></div>
            <div class="info">
                <div class="name">
                    <span>{{projectDetail?.projectName}}</span>
                    <span class="version">v1.0.0</span>
                </div>
                <div class="hot">
                    <span>linkage</span>
                    <span class="split-line"></span>
                    <i class="iconfont icon-hotfill"></i>
                    <span>235</span>
                    <span class="split-line"></span>
                    <el-rate v-model="rate" allow-half />
                </div>
                <div class="buttons">
                    <div class="btn"><i class="btn-icon el-icon-edit"></i>编辑</div>
                    <div class="btn"><i class="btn-icon el-icon-lightning"></i>打包</div>
                    <div class="btn"><i class="btn-icon el-icon-upload"></i>打包并上传</div>
                </div>
            </div>
        </div>
        <div class="body">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="打包记录" name="one">
                    <ProjectHistory :project="projectDetail" />
                </el-tab-pane>
                <el-tab-pane label="提交记录" name="two">
                    <ProjectLog :project="projectDetail" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import ProjectHistory from '../projectHistory/projectHistory.vue';
import ProjectLog from '../projectLog/projectLog.vue';

export default {
    name: 'ProjectContent',
    components: {
        ProjectHistory,
        ProjectLog
    },
    setup() {
        const store = useStore();
        const rate = ref(5);
        const activeName = ref('one');
        const projectDetail = computed(() => {
            const workSpaces = store.state.workSpaces;
            const id = store.state.activeProjectId;
            let project = null;
            for (let item of workSpaces) {
                if (item.children) {
                    for (let o of item.children) {
                        if (o.id === id) {
                            project = o;
                            break;
                        }
                    }
                }
                if (project) {
                    break;
                }
            }
            return project;
        });
        const handleClick = (tab) => {
            console.log(tab, event);
        };
        return {
            projectDetail,
            rate,
            activeName,
            handleClick
        };
    }
};
</script>

<style scoped lang="less">
#projectContent {
    max-width: 1000px;
    min-width: 500px;
    padding: 20px 10px 20px;
    margin: 0 auto;

    .header {
        display: flex;
        .icon {
            width: 130px;
            height: 130px;
            position: relative;
            align-self: center;
            margin-right: 20px;
        }

        .icon-React {
            color: #5adafd;
            font-size: 130px;
        }

        .icon-bold {
            color: #cc5c0c;
            font-size: 130px;
        }

        .icon-vue {
            color: #56b359;
            font-size: 130px;
        }

        .icon-hotfill {
           font-size: 12px;
           margin-right: 5px;
           color: rgb(255, 102, 0);
        }

        .name {
            font-size: 18px;
            color: #cccccc;
            margin-top: 20px;
        }

        .version {
            font-size: 12px;
            margin-left: 20px;
        }

        .info {
            text-align: left;
        }

        .hot {
            color: #cccccc;
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-top: 10px;
        }

        .split-line {
            width: 1px;
            display: inline-block;
            height: 12px;
            margin: 0 20px;
            background-color: #636363;
        }

        .buttons {
            display: flex;
            margin-top: 10px;
            cursor: pointer;

            .btn {
                font-size: 12px;
                color: #fff5e5;
                background-color: #0e639c;
                padding: 4px 10px;

                &:not(:last-child) {
                    margin-right: 10px;
                }

                &:hover {
                    background-color: #1177bb !important;
                }

                &:active {
                    background-color: #1177bb !important;
                }
            }
        }

        .btn-icon {
            margin-right: 2px;
        }
    }

    :deep(.el-tabs__item) {
        color: #909090;
    }

    :deep(.is-active) {
        color: #cccccc;
    }

    :deep(.el-tabs__nav-wrap::after) {
        background-color: #4d4d4d;
    }
}
</style>
