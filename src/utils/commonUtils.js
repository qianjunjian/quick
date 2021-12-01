export const initDB = (db, store) => {
    db.read();
    let workSpaces = db.get('workSpaces').value();
    if (!workSpaces || workSpaces.length === 0) {
        // 设置默认值
        workSpaces = [];
        workSpaces.push({
            workName: '开发环境',
            notDelete: true,
            check: true,
            id: 1,
            children: []
        });
        workSpaces.push({
            workName: '生产环境',
            notDelete: true,
            check: true,
            id: 2,
            children: []
        });
    }
    // 同步到redux
    store.commit('setWorkspaces', workSpaces);
    let workSpacesActiveIndex = db.get('workSpacesActiveIndex').value();
    if (!workSpacesActiveIndex) {
        workSpacesActiveIndex = 1;
    }
    // 同步到redux
    store.commit('setWorkSpacesActiveIndex', workSpacesActiveIndex);
};
