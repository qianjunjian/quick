import {
	createStore
} from 'vuex';

const leftBoardwidthBase = 250;

export default createStore({
	state: {
		preLeftTabIndex: 1,
		leftTabIndex: 1,
		leftBoardwidth: leftBoardwidthBase
	},
	mutations: {
		setLeftTabIndex(state, index) {
			state.leftTabIndex = index;
		},
		hideLeftBoard(state, minWidth) {
			if (state.leftTabIndex !== 0) {
				state.preLeftTabIndex = state.leftTabIndex;
				state.leftBoardwidth = minWidth;
				state.leftTabIndex = 0;
			}
		},
		showLeftBoard(state) {
			state.leftTabIndex = state.preLeftTabIndex;
		},
		setLeftBoardwidth(state, width) {
			state.leftBoardwidth = width;
		}
	},
	actions: {}
});
