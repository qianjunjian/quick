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
		showAddProject: false,
		showAddProjectData: {},
		workSpacesActiveIndex: 1,
		building: {},
		activeProjectId: '',
		projectHistory: []
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
				server: '192.168.9.247',
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
			db.set('workSpaces', state.workSpaces).write();
		},
		setWorkSpacesActiveIndex(state, workSpacesActiveIndex) {
			state.workSpacesActiveIndex = workSpacesActiveIndex;
			db.set('workSpacesActiveIndex', workSpacesActiveIndex).write();
		},
		setShowAddProject(state, data) {
			const { showAddProject, showAddProjectData } = data;
			state.showAddProject = showAddProject;
			state.showAddProjectData = showAddProjectData;
		},
		modifyProject(state, data) {
			const workSpaces = state.workSpaces;
			const index = workSpaces.findIndex(item => item.id === data.parentId);
			if (data.type === 1) {
				workSpaces[index].children.push({
					...data
				});
			} else {
				const children = workSpaces[index].children;
				const _idx = children.findIndex(item => item.id === data.id);
				children[_idx] = {
					...children[_idx],
					...data
				};

				// 更新history堆栈
				const idx = state.projectHistory.findIndex(item => item.id === data.id);
				if (idx >= 0) {
					state.projectHistory[idx] = {
						...state.projectHistory[idx],
						...data
					};
				}
			}
			db.set('workSpaces', workSpaces).write();
		},
		deleteProject(state, data) {
			const workSpaces = state.workSpaces;
			const index = workSpaces.findIndex(item => item.id === data.parentId);

			const _idx = workSpaces[index].children.findIndex(item => item.id === data.id);
			workSpaces[index].children.splice(_idx, 1);

			state.workSpaces = workSpaces;
			db.set('workSpaces', workSpaces).write();

			// 删除history堆栈
			const idx = state.projectHistory.findIndex(item => item.id === data.id);
			if (idx >= 0) {
				state.projectHistory.splice(idx, 1);
			}
			if (state.activeProjectId === data.id) {
				if (state.projectHistory[idx - 1]) {
					state.activeProjectId = state.projectHistory[idx - 1].id;
				} else if (state.projectHistory[idx]) {
					state.activeProjectId = state.projectHistory[idx].id;
				} else {
					state.activeProjectId = '';
				}
			}
		},
		setActiveProject(state, data) {
			state.activeProjectId = data.id;

			const index = state.projectHistory.findIndex(item => item.id === data.id);
			if (index < 0) {
				state.projectHistory.unshift(data);
			}
		},
		deleteActiveProject(state, data) {
			const index = state.projectHistory.findIndex(item => item.id === data.id);
			if (index >= 0) {
				state.projectHistory.splice(index, 1);
			}
			if (state.activeProjectId === data.id) {
				if (state.projectHistory[index - 1]) {
					state.activeProjectId = state.projectHistory[index - 1].id;
				} else if (state.projectHistory[index]) {
					state.activeProjectId = state.projectHistory[index].id;
				} else {
					state.activeProjectId = '';
				}
			}
		},
		setBuilding(state, data) {
			const {id, type} = data;
			state.building[id] = {
				type
			};
		}
	},
	actions: {}
});
