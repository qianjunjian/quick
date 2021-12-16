<template>
    <div class="page-full">
        <Header></Header>
        <div class="body">
        <Left></Left>
        <LeftBoard></LeftBoard>
        <div class="content">
            <Tags v-show="showTags"></Tags>
            <Content></Content>
        </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../components/header/header.vue';
import Left from '../components/left/left.vue';
import LeftBoard from '../components/leftBoard/leftBoard.vue';
import Footer from '../components/footer/footer.vue';
import Content from '../components/content/content.vue';
import Tags from '../components/tags/tags.vue';
import db from '../database/datastore';
import { initDB, refreshProjectStatus } from '../utils/commonUtils';
import { useStore } from 'vuex';
import { onMounted, computed } from 'vue';

export default {
    name: 'Home',
    components: {
        Header,
        Left,
        Footer,
        LeftBoard,
        Content,
        Tags
    },
    setup() {
        const store = useStore();
        const showTags = computed(() => store.state.projectHistory && store.state.projectHistory.length > 0);
        // 初始化db
        initDB(db, store);
        onMounted(() => {
            refreshProjectStatus(store.state.workSpaces, store.commit);
            // 每1分钟刷新下
            setInterval(() => {
                refreshProjectStatus(store.state.workSpaces, store.commit);
            }, 60000);
        });

        return {
            showTags
        };
    }
};
</script>

<style scoped lang="less">
.page-full {
    position: absolute;
    left: 0;
    right: 0;
    top: 2px;
    bottom: 0;
    background-color: #1e1e1e;

    .body {
        position: absolute;
        top: 29px;
        left: 0;
        right: 0;
        bottom: 19px;
        display: flex;

        .content {
        flex: 1;
        width: 100%;
        height: 100%;
        text-align: center;
        }
    }
}
</style>
