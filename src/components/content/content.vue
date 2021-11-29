<template>
    <div id="content">
        <div class="header">
            <div class="icon"><i class="iconfont icon-React"></i></div>
            <div class="info">
                <div class="name">
                    <span>理财中心</span>
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
                <el-tab-pane label="通知" name="first">User</el-tab-pane>
                <el-tab-pane label="打包记录" name="second">打包记录</el-tab-pane>
                <el-tab-pane label="提交记录" name="third">提交记录</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';

export default {
    name: 'Content',
    setup() {
        const store = useStore();
        const tabIndex = computed(() => store.state.leftTabIndex);
        const rate = ref(5);
        const iconSelected = index => {
            if (index === tabIndex.value) {
                store.commit('setLeftTabIndex', 0);
            } else {
                store.commit('setLeftTabIndex', index);
            }
        };
        return {
            tabIndex,
            rate,
            iconSelected
        };
    }
};
</script>

<style scoped lang="less">
#content {
    max-width: 1000px;
    margin: 0 auto;
    padding-top: 20px;

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
