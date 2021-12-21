<template>
    <div id="projectLog">
        <el-table :data="svn" style="width: 100%" max-height="500">
            <el-table-column prop="version" label="版本" width="100" />
            <el-table-column prop="user" label="用户" width="120" />
            <el-table-column prop="time" label="时间" />
            <el-table-column prop="remark" label="备注" />
        </el-table>
    </div>
</template>

<script>
import { watchEffect, reactive, nextTick } from 'vue';
import { getSvnLog } from '../../node/svn';

export default {
    name: 'ProjectLog',
    props: {
        project: Object
    },
    setup(props) {
        const svn = reactive([]);
        watchEffect(() => {
            if (props.project && props.project.url) {
                nextTick(() => {
                    svn.splice(0, svn.length);
                    svn.push(...(getSvnLog(props.project.url) || []));
                });
            }
        });

        return {
            svn
        };
    }
};
</script>

<style scoped lang="less">
#projectLog {
    width: 100%;
    color: #CCCCCC;
}
</style>
