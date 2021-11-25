<template>
    <div id="left-board" :class="[tabIndex > 0 ? 'show' : 'hide']">
        <div
          ref="rResizeLine"
          class="resize-line"
          @mousedown="handleMouseDown"
        ></div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: 'Left',
    setup() {
        const store = useStore();
        const tabIndex = computed(() => store.state.leftTabIndex);
        return {
            tabIndex
        };
    }
};
</script>

<style scoped lang="less">
#left-board {
    height: 100%;
    width: 250px;
    background: #252526;
    position: relative;

    .resize-line {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: transparent;
        cursor: ew-resize;

        &:hover {
            background: #007acc;
            transition-delay: 0.6s;
        }
    }
}

.hide {
    display: none;
}
</style>
