import Client from 'ssh2-sftp-client';

const sftp = new Client();

const config = {
  host: '192.168.9.247',
  port: '22',
  username: 'root',
  password: 'linkage@12345'
};

const instance = sftp.connect(config);
/**
 * 上传文件到sftp
 * @param { Object } config    sftp 链接配置参数
 * @param { String } config.host sftp 主机地址
 * @param { String } config.port sftp 端口号
 * @param { String } config.username sftp 用户名
 * @param { String } config.password sftp 密码
 *
 * @param { Object } options 配置参数
 * @param { String } localStatic // 本地静态资源文件夹路径
 * @param { String } remoteStatic // 服务器静态资源文件夹路径
 * @param { String } localFile // 本地html页面
 * @param { String } remoteFile // 服务器html页面
 */
export function upload(options) {
  instance.then(() => {
    console.log('文件上传中');
    return sftp.exists(options.remoteStatic + '/app');
  }).then((data) => {
    if (data) {
      return sftp.rmdir(options.remoteStatic + '/app', true);
    } else {
      return true;
    }
  }).then(() => {
    return sftp.exists(options.remoteStatic + '/lib');
  }).then((data) => {
    if (data) {
      return sftp.rmdir(options.remoteStatic + '/lib', true);
    } else {
      return true;
    }
  }).then(() => {
    return sftp.exists(options.remoteStatic + '/resources');
  }).then((data) => {
    if (data) {
      return sftp.rmdir(options.remoteStatic + '/resources', true);
    } else {
      return true;
    }
  }).then(() => {
    return sftp.exists(options.remoteStatic + '/main.html');
  }).then((data) => {
    if (data) {
      return sftp.delete(options.remoteStatic + '/main.html');
    } else {
      return true;
    }
  }).then(() => {
    return sftp.exists(options.remoteStatic + '/subYwbl');
  }).then(data => {
    if (!data) {
      return sftp.rmdir(options.remoteStatic, true);
    } else {
      return true;
    }
  }).then(() => {
    return sftp.uploadDir(options.localStatic, options.remoteStatic);
  }).then(() => {
    console.log('文件上传成功');
    // sftp.end();
    options.successCallBack && options.successCallBack();
  }).catch((err) => {
    console.log('上传失败', err);
    // sftp.end();
    options.errorCallBack && options.errorCallBack(err);
  });
}
