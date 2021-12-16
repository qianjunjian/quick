<template>
    <div id="content">
        <ProjectContent v-show="hasContent" />
        <ContentNoData v-show="!hasContent" />
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import ProjectContent from '../projectContent/projectContent.vue';
import ContentNoData from '../contentNoData/contentNoData.vue';

export default {
    name: 'Content',
    components: {
        ProjectContent,
        ContentNoData
    },
    setup() {
        const store = useStore();
        const hasContent = computed(() => !!store.state.activeProjectId);
        return {
            hasContent
        };
    }
};
</script>

<style scoped lang="less">
</style>
