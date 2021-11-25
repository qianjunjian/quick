<template>
    <div id="left">
        <div class="left-top">
            <div :class="['common-icon', 'el-icon-folder', tabIndex === 1 ? 'active' : '']" @click="() => iconSelected(1)"></div>
            <div :class="['common-icon', 'el-icon-search', tabIndex === 2 ? 'active' : '']" @click="() => iconSelected(2)"></div>
        </div>
        <div class="left-bottom">
            <div class="common-icon el-icon-setting"></div>
        </div>
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
        const iconSelected = index => {
            if (index === tabIndex.value) {
                store.commit('setLeftTabIndex', 0);
            } else {
                store.commit('setLeftTabIndex', index);
            }
        };
        return {
            tabIndex,
            iconSelected
        };
    }
};
</script>

<style scoped lang="less">
#left {
    height: 100%;
    width: 48px;
    min-width: 48px;
    background: #333333;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .common-icon {
        padding: 11px 0;
        color: #858585;
        font-size: 26px;
        cursor: pointer;
        width: 100%;
        text-align: center;
        position: relative;

        &.active {
            color: #ffffff;

            &::after {
                content: "";
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 2px;
                background: #ffffff;
            }
        }
    }
}
</style>
