/* CMSP配置 */
let configOpts = {
    // 链上身份模式: CA-证书模式, PWK-公私钥模式
    chainIdentityModel: 'CA',
    // 长安链版本
    chainMakerVersion: '2.2.0',
    // 长安链兼容版本
    chainMakerCompatibleVersion: '2.2.0',
    // CMSP版本
    version: '0.1.0'
};

// 获取配置项内容
export function getConfigOpt(optKey) {
    return configOpts[optKey];
}
