
import { getSrcPath } from '../utils/commonUtils';
import { execSync } from 'child_process';
import iconv from 'iconv-lite';

let encoding = 'cp936';
let binaryEncoding = 'binary';

export function getSvnLog(url) {
    const out = [];
    const path = getSrcPath(url);
    const logs = execSync(`cd /D ${path} && svn log -l 20 -r HEAD:1`, { encoding: binaryEncoding});
    const log = iconv.decode(new Buffer(logs, binaryEncoding), encoding);
    if (log) {
        let lst = log.split('------------------------------------------------------------------------');
        if (lst) {
            for (let i = 0; i < lst.length; i ++) {
                let item = lst[i];
                if (item) {
                    item = item.replace(/\r\n/g, '');
                    item = item.replace(/1 line/g, '');
                    item = item.replace(/2 line/g, '');
                    item = item.split('|');
                    let data = {
                        version: item[0],
                        user: item[1],
                        time: item[2],
                        remark: item[3]
                    };
                    out.push(data);
                }
            }
        }
    }
    return out;
}
