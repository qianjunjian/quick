<template>
    <div id="projectHistory">
        <el-table :data="projectHistory" style="width: 100%">
            <el-table-column prop="shortName" label="工程名" width="180" />
            <el-table-column prop="date" label="日期" width="180" />
            <el-table-column prop="time" label="时间" />
            <el-table-column label="操作">
            <template #default="scope">
                <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index)"
                >上传服务器</el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index)"
                >删除</el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { watch, reactive, watchEffect} from 'vue';
import { getProjectHistory } from '../../node/copy';
import { uploadProject } from '../../node/build';
import { getPath, deleteFile } from '../../node/copy';

export default {
    name: 'ProjectHistory',
    props: {
        project: Object
    },
    setup(props) {
        const store = useStore();
        let projectHistory = reactive([]);
        watchEffect(() => {
            const status = store.state.building[props.project?.id]?.type;
            if (status === 1) {
                console.log('>>>>>>>>>>>>>>>1');
                projectHistory.splice(0, projectHistory.length);
                projectHistory.push(...getProjectHistory(props.project.projectName));
            }
        });
        watch(() => props.project, (newProject, oldProject) => {
            if (newProject?.projectName !== oldProject?.projectName) {
                console.log('>>>>>>>>>>>>>>>2');
                projectHistory.splice(0, projectHistory.length);
                projectHistory.push(...getProjectHistory(newProject.projectName));
            }
        });

        const handleEdit = (index) => {
            uploadProject(props.project, store, getPath(props.project.projectName, projectHistory[index].fullName), projectHistory[index].fullName);
        };

        const handleDelete = index => {
            deleteFile(props.project.projectName, projectHistory[index].fullName);
            projectHistory.splice(0, projectHistory.length);
            projectHistory.push(...getProjectHistory(props.project.projectName));
        };
        return {
            projectHistory,
            handleEdit,
            handleDelete
        };
    }
};
</script>

<style scoped lang="less">
#projectHistory {
    width: 100%;
    color: #CCCCCC;
}
</style>
