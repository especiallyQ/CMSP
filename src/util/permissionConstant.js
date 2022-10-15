export const permissionKeys = {
    modulePermission: {
        viewContractTemplateVersion: {
            have: 0b0000000001,
            pending: 0b0000100000
        },
        addContractTemplateVersion: {
            have: 0b0000000010,
            pending: 0b0001000000
        },
        updateTemplate: {
            have: 0b0000000100,
            pending: 0b0010000000
        },
        deleteTemplate: {
            have: 0b0000001000,
            pending: 0b0100000000
        },
        contractTemplateAddText: {
            have: 0b0000010000,
            pending: 0b1000000000
        },
    },
    userIdentity: {
        PO_Admin: 0b1011101,
        PU_Admin: 0b1011101,
        AD_Admin: 0b1011101,
        PO_Operator: 0b0000001,
        PU_Operator: 0b0000001,
    }
}

export function binaryConversion(num) {
    if (Object.prototype.toString.call(num) !== "[object Number]") {
        return new Error("需传入Number类型！")
    }
    return Number(num.toString(2))
}

export function decimalConversion(num, base = 2) {
    return parseInt(num, base)
}


export function havePermission(permissionName) {
    let root = localStorage.getItem("root");
    if(root){
        let permission = permissionKeys.userIdentity[root] ? permissionKeys.userIdentity[root] : 0;

        if((permission & permissionKeys.modulePermission[permissionName].have) ===
        permissionKeys.modulePermission[permissionName].have){
            return true
        }
        return false
    }
}

export function pendingPermission(permissionName){
    let root = localStorage.getItem("root");
    if(root){
        let permission = permissionKeys.userIdentity[root] ? permissionKeys.userIdentity[root] : 0;

        if((permission & permissionKeys.modulePermission[permissionName].pending) ===
        permissionKeys.modulePermission[permissionName].pending){
            return true
        }
        return false
    }
}