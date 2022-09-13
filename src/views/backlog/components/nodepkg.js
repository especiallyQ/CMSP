import Vue from 'vue';
import { Message } from 'element-ui';
import { chooseLang } from "@/util/errcode.js";
import { forceMakeNodePackage, downloadNodePackageByNotify } from '@/util/api';

/**
 * 重新生成节点安装包（若存在，则会先删除旧安装包）
 */
export function deleteAndMakeNodePackage(chainId, nodeId) {
    let $ref = this;
    return new Promise((resolve, reject) => {
        forceMakeNodePackage({
            chainId,
            nodeId
        }).then(res => {
            if (res.data.code === 0) {
                Message({
                    type: 'success',
                    message: Vue.prototype.$t.call($ref, 'chainNode.makeNodePackageSuccess')
                });
            } else {
                Message({
                    message: chooseLang(res.data.code),
                    type: 'error',
                    duration: 2000
                });
            }
            resolve();
        }).catch(err => {
            Message({
                message: err.data || Vue.prototype.$t.call($ref, 'text.systemError'),
                type: 'error',
                duration: 2000
            });
            reject();
        });
    });
}

/**
 * 根据通知ID下载节点安装包
 */
export function downloadNodePackageByNotification(notificationId) {
    let $ref = this;
    return new Promise((resolve, reject) => {
        downloadNodePackageByNotify(notificationId).then(res => {
            if (res.status === 200) {
                const blob = new Blob([res.data]);
                let fileName = `node.tar.gz`;
                let disposition = res.headers['content-disposition'] || '';
                let fileNameIdx = disposition.indexOf('filename=');
                if (fileNameIdx != -1) {
                    let tmp = disposition.substring(fileNameIdx + 9);
                    if (tmp) {
                        fileName = decodeURIComponent(tmp);
                    }
                }
                if ('download' in document.createElement('a')) {
                    const elink = document.createElement('a')
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href)
                    document.body.removeChild(elink)
                } else {
                    navigator.msSaveBlob(blob, fileName)
                }
            } else {
                if (typeof res.data.text === 'function') {
                    res.data.text().then(text => {
                        let resp = JSON.parse(text)
                        Message({
                            message: chooseLang(resp.code) || resp.message,
                            type: 'error',
                            duration: 2000
                        });
                    });
                } else {
                    Message({
                        message: chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }
            resolve();
        }).catch(err => {
            Message({
                message: err.data || Vue.prototype.$t.call($ref, 'text.systemError'),
                type: 'error',
                duration: 2000
            });
            reject();
        });
    });
}
