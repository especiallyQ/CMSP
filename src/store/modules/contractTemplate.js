import { queryContractTemplateList } from "../../util/api"

import storageKeys from '../../util/storageKeys/contractTemplateStorageKey'
import mutationsKeys from '../../util/storeKeys/contractTemplate/mutationsKeys'
import commonKeys from '../../util/storeKeys/contractTemplate/commonKeys'

//合约模板列表（复杂类型数据）短期持久化
function getStorageComplexTypeData(storageKey) {
    return JSON.parse(sessionStorage.getItem(storageKey))
}
//获取本地数据（复杂类型数据）
function setStorageComplexTypeDate(storageKey, data) {
    sessionStorage.setItem(storageKey, JSON.stringify(data))
}

const state = () => {
    return {
        contractTemplateData: getStorageComplexTypeData(storageKeys.CONTRACT_TEMPLATE_DATA) || {},
    }
}

const mutations = {
    SET_CONTRACT_TEMPLATE_LIST: (state, data) => {
        state.contractTemplate = data

        setStorageComplexTypeDate(storageKeys.CONTRACT_TEMPLATE_DATA, data)
    }
}


/**
 * 
 * 
 * 
 * @param {array} arr 数组
 * @param {boolean} 
 */
let contractTemplateParameter = {
    requestData: {
        pageNumber: 1,
        pageSize: 10
    },
    required: {
        creator: "",
        templateName: ""
    }
}

const actions = {
    getContractTemplateList:async (context, requestData = contractTemplateParameter.requestData, requiredData = contractTemplateParameter.required) => {
        try{
            const { data } = await queryContractTemplateList(requestData, requiredData)

            context.commit(mutationsKeys.SET_CONTRACT_TEMPLATE_LIST, {
                data,
                timeout: Date.now() + commonKeys.MAX_AGE
            })

        }catch(err) {
            return Promise.reject(err)
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