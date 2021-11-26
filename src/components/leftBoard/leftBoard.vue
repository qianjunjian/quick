<template>
    <div id="left-board" :style="{width: basedWidth + 'px'}" :class="[tabIndex > 0 ? 'show' : 'hide']">
        <Folders v-if="tabIndex === 1" />
    </div>
    <div
        :class="['resize-line', moving ? 'moving' : '']"
        @mousedown="handleMouseDown"
    ></div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { remote } from 'electron';
import Folders from '../folders/folders.vue';

const minWidth = 170;
const tabWidth = 48;
const rightMaxWidth = 300;

export default {
    name: 'Left',
    components: {
        Folders
    },
    setup() {
        const store = useStore();
        const tabIndex = computed(() => store.state.leftTabIndex);
        const basedWidth = computed(() => store.state.leftBoardwidth);
        const moving = ref(false);
        const handleMouseDown = () => {
            moving.value = true;
            const maxWidth = remote.getCurrentWindow().getSize()[0] - rightMaxWidth - tabWidth;
            document.documentElement.style.cursor = 'ew-resize';
            const handleMouseMove = e => {
                const width = e.clientX - tabWidth + 2;
                if (tabIndex.value === 0 && (width >= minWidth / 2)) {
                    store.commit('showLeftBoard');
                } else if (width < minWidth / 2) {
                    store.commit('hideLeftBoard', minWidth);
                } else if (width < minWidth / 1) {
                    // 什么也不做
                } else if (width > maxWidth / 1) {
                    // 什么也不做
                } else {
                    store.commit('setLeftBoardwidth', width);
                }
            };
            const handleMouseUp = () => {
                moving.value = false;
                document.documentElement.style.cursor = '';
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };

        return {
            tabIndex,
            handleMouseDown,
            basedWidth,
            moving
        };
    }
};
</script>

<style scoped lang="less">
#left-board {
    height: 100%;
    background: #252526;
    position: relative;
    max-width: calc(100% - 48px - 300px);
}

.resize-line {
    position: relative;
    left: -4px;
    top: 0;
    bottom: 0;
    width: 4px;
    background: transparent;
    cursor: ew-resize;

    &:hover {
        background: #007acc;
        transition-delay: 0.3s;
    }

    &.moving {
        background: #007acc;
    }
}

.hide {
    display: none;
}
</style>
