// Header主进程
import {
	ipcMain
} from 'electron';

export const mainProcessForHeader = (win) => {
    // 窗口 最小化
    ipcMain.on('window-min', function() {
        // 收到渲染进程的窗口最小化操作的通知，并调用窗口最小化函数，执行该操作
        win.minimize();
    });

    // 窗口 最大化、恢复
    ipcMain.on('window-max', function() {
        if (win.isMaximized()) {
            // 恢复
            win.restore();
        } else {
            // 最大化
            win.maximize();
        }
    });

    // 关闭窗口
    ipcMain.on('window-close', function() {
        win.close();
    });
};
