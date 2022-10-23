import { queryContractTemplateList, queryContractTemplateVersionList } from "../../util/api"

import storageKeys from '../../util/storageKeys/contractTemplateStorageKey'
import mutationsKeys from '../../util/storeKeys/contractTemplate/mutationsKeys'
import commonKeys from '../../util/storeKeys/contractTemplate/commonKeys'


//获取本地数据（复杂类型数据）
function getStorageComplexTypeData(storageKey) {
    return JSON.parse(sessionStorage.getItem(storageKey))
}
//合约模板列表（复杂类型数据）短期持久化
function setStorageComplexTypeDate(storageKey, data) {
    sessionStorage.setItem(storageKey, JSON.stringify(data))
}

const state = () => {
    return {
        contractTemplateData: getStorageComplexTypeData(storageKeys.CONTRACT_TEMPLATE_DATA) || {
            belongTO: localStorage.getItem("user") || "",
            data: [],
            totalCount: 0,
        },
        templateVersionList: {}
    }
}

const mutations = {
    SET_CONTRACT_TEMPLATE_LIST: (state, data) => {
        state.contractTemplateData = data

        setStorageComplexTypeDate(storageKeys.CONTRACT_TEMPLATE_DATA, data)
    },
    SET_TEMPLATE_VERSION_LIST: (state, data) => {
        state.templateVersionList = data
    }
}

const actions = {
    getContractTemplateList: async (context, payLoad) => {
        try {
            const { data } = await queryContractTemplateList(payLoad.requestData, payLoad.requiredData)
            let userName = localStorage.getItem("user") || ""
            let root = localStorage.getItem("root") || ""
            let groupId = localStorage.getItem("groupId") || ""
            if (data.code == 0) {
                //过滤用户权限内可见的模板数据
                if (root.slice(0, 2) !== "PO") {
                    let filteList = data.data.filter((obj, index) => {
                        if (obj.visibility === 0) {
                            return true
                        } else if (obj.groupId == groupId) {
                            return true
                        }

                        return obj.creator === userName
                    })
                    let newData = {
                        ...data
                    }
                    newData.data = filteList
                    context.commit(mutationsKeys.SET_CONTRACT_TEMPLATE_LIST, {
                        belongTO: localStorage.getItem("user") || "",
                        data: newData,
                        timeout: Date.now() + commonKeys.MAX_AGE
                    })
                } else {
                    context.commit(mutationsKeys.SET_CONTRACT_TEMPLATE_LIST, {
                        belongTO: localStorage.getItem("user") || "",
                        data,
                        timeout: Date.now() + commonKeys.MAX_AGE
                    })
                }
            }
        } catch (err) {
            return Promise.reject(err)
        }
    },
    getTamplateVersionList: async (context, payLoad) => {
        try {
            const { data } = await queryContractTemplateVersionList({
                templateId: payLoad.templateId
            })
            context.commit(mutationsKeys.SET_TEMPLATE_VERSION_LIST, data)
        } catch (e) {
            throw e
        }
    }
}

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}