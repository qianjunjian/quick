import {
	createStore
} from 'vuex';

export default createStore({
	state: {
		leftTabIndex: 1
	},
	mutations: {
		setLeftTabIndex(state, index) {
			// mutate state
			state.leftTabIndex = index;
		}
	},
	actions: {}
});
