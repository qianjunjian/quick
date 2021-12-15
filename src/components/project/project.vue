<template>
    <div id="project" @contextmenu.prevent="$emit('rightClick', $event)">
        <i :class="['iconfont', iconType]"></i>
        <div class="info">
            <div class="title">{{data.projectName}}</div>
            <template v-if="count > 0">
                <div class="body progress-body">{{projectStatus === 2 ? "正在打包" : "正在上传"}}：<el-progress :stroke-width="4" :percentage="count" :indeterminate="true" /></div>
            </template>
            <template v-else>
                <div class="body status-body">
                    状态：
                    <i class="iconfont icon-gantanhao" v-show="data.status_u" title="本地版本低于svn版本"></i>
                    <i class="iconfont icon-medium" v-show="data.status_m" title="本地代码有改动"></i>
                    <i class="iconfont icon-duigouxuanzhong" v-show="!data.status_u && !data.status_m" title="代码最新"></i>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, watchEffect, nextTick } from 'vue';

export default {
    name: 'Project',
    props: {
        data: Object
    },
    emits: ['rightClick'],
    setup(props) {
        const store = useStore();
        const count = ref(0);
        const tabIndex = computed(() => store.state.leftTabIndex);
        const projectStatus = computed(() => store.state.building[props.data.id]?.type);
        let timeout = null;
        watchEffect(async() => {
            const status = store.state.building[props.data.id]?.type;
            if (status === 2) {
                timeout = setInterval(() => {
                    if (count.value < 99) {
                        count.value = count.value + 1;
                    }
                }, 300);
            } else if (status === 3) {
                count.value = 1;
            } else {
                if (status === 1 && count.value > 0) {
                    count.value = 100;
                    timeout && clearInterval(timeout);
                    await nextTick();
                    count.value = 0;
                }
            }
        });
        const iconType = computed(() => {
            if (props.data.iconType === 'react') {
                return 'icon-React';
            }
            if (props.data.iconType === 'vue') {
                return 'icon-vue';
            }
            if (props.data.iconType === 'backbone') {
                return 'icon-bold';
            }
            return 'icon-React';
        });

        const iconSelected = index => {
            if (index === tabIndex.value) {
                store.commit('setLeftTabIndex', 0);
            } else {
                store.commit('setLeftTabIndex', index);
            }
        };

        return {
            tabIndex,
            iconSelected,
            iconType,
            count,
            projectStatus
        };
    }
};
</script>

<style scoped lang="less">
#project {
    padding: 6px 10px;
    display: flex;
    border: 1px solid transparent;
    cursor: pointer;

    .icon-vue {
        color: #56b359;
        font-size: 40px;
        width: 40px;
        height: 40px;

        &::before {
            background: #2e3031;
        }
    }

    .icon-React {
        color: #5adafd;
        font-size: 40px;
        width: 40px;
        height: 40px;

        &::before {
            background: #2e3031;
        }
    }

    .icon-bold {
        color: #cc5c0c;
        font-size: 40px;
        width: 40px;
        height: 40px;

        &::before {
            background: #2e3031;
        }
    }

    .status-body {
        display: flex;
        align-items: center;
        line-height: 16px !important;
    }

    .icon-gantanhao {
        color: red;
        margin-right: 5px;
    }

    .icon-medium {
        color: yellow;
        margin-right: 5px;
    }

    .icon-duigouxuanzhong {
        color: green;
    }

    .info {
        flex: 1;
        width: 0;
        margin-left: 10px;
        padding: 2px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    &:hover {
        background-color: #2a2d2e;
    }

    &:active {
        background-color: #094771;
        border: 1px solid #007fd4;
    }
    .progress-body {
        display: flex;
        line-height: 16px;
        color: #00e431;
    }
    .title {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .body {
        font-size: 11px;
    }

    .footer {
        font-size: 11px;
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :deep(.el-progress) {
        width: calc(100% - 56px);
    }

    :deep(.el-progress__text) {
        color: #cccccc;
        font-size: 11px !important;
        min-width: 25px !important;
    }
}
</style>
