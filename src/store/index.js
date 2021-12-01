import {
	createStore
} from 'vuex';
import db from '../database/datastore';

const leftBoardwidthBase = 250;

export default createStore({
	state: {
		preLeftTabIndex: 1,
		leftTabIndex: 1,
		leftBoardwidth: leftBoardwidthBase,
		workSpaces: [],
		workSpacesActiveIndex: 1
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
		},
		setWorkspaces(state, workSpaces) {
			state.workSpaces = workSpaces;
			db.set('workSpaces', workSpaces).write();
		},
		addWorkspaces(state, value) {
			const workSpaces = state.workSpaces;
			workSpaces.push({
				workName: value,
				notDelete: false,
				check: true,
				id: Math.random(),
				children: []
			});
			db.set('workSpaces', workSpaces).write();
		},
		deleteWorkspace(state, value) {
			const workSpaces = state.workSpaces;
			state.workSpaces = workSpaces.filter(item => item.id !== value);
			db.set('workSpaces', state.workSpaces).write();
		},
		choseWorkspace(state, value) {
			const workSpaces = state.workSpaces;
			const index = workSpaces.findIndex(item => item.id === value);
			workSpaces[index].check = !workSpaces[index].check;
			// state.workSpaces = cloneDeep(workSpaces);
			db.set('workSpaces', state.workSpaces).write();
		},
		setWorkSpacesActiveIndex(state, workSpacesActiveIndex) {
			state.workSpacesActiveIndex = workSpacesActiveIndex;
			db.set('workSpacesActiveIndex', workSpacesActiveIndex).write();
		}
	},
	actions: {}
});
