<template>
    <div id="projectLog">
        <div class="buttons">
            <div class="btn" @click="refreshHandle"><i class="btn-icon el-icon-refresh"></i>刷新</div>
        </div>
        <div class="notice">温馨提示：偷懒不想做分页，暂时只显示20条最新记录！</div>
        <el-table :data="svn" style="width: 100%" max-height="500">
            <el-table-column prop="version" label="版本" width="100" />
            <el-table-column prop="user" label="用户" width="120" />
            <el-table-column prop="time" label="时间" />
            <el-table-column prop="remark" label="备注" />
        </el-table>
    </div>
</template>

<script>
import { watchEffect, reactive } from 'vue';
import { getSvnLog } from '../../node/svn';

export default {
    name: 'ProjectLog',
    props: {
        project: Object
    },
    setup(props) {
        const svn = reactive([]);
        let timeout = null;
        watchEffect(() => {
            if (props.project && props.project.url) {
                timeout && clearTimeout(timeout);
                timeout = setTimeout(() => {
                    svn.splice(0, svn.length);
                    svn.push(...(getSvnLog(props.project.url) || []));
                    timeout && clearTimeout(timeout);
                }, 100);
            }
        });

        const refreshHandle = () => {
            svn.splice(0, svn.length);
            timeout && clearTimeout(timeout);
            timeout = setTimeout(() => {
                svn.push(...(getSvnLog(props.project.url) || []));
                timeout && clearTimeout(timeout);
            }, 100);
        };

        return {
            svn,
            refreshHandle
        };
    }
};
</script>

<style scoped lang="less">
#projectLog {
    width: 100%;
    color: #CCCCCC;

    .notice {
        text-align: left;
        font-size: 13px;
        margin-top: 10px;
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
}
</style>
