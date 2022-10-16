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
        contractTemplateData: getStorageComplexTypeData(storageKeys.CONTRACT_TEMPLATE_DATA) || {
            belongTO:localStorage.getItem("user") || "",
            data: [],
            totalCount: 0,
        },
    }
}

const mutations = {
    SET_CONTRACT_TEMPLATE_LIST: (state, data) => {
        state.contractTemplateData = data

        setStorageComplexTypeDate(storageKeys.CONTRACT_TEMPLATE_DATA, data)
    }
}

//默认获取第一页10条数据
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
    getContractTemplateList: async (context, requestData = contractTemplateParameter.requestData, requiredData = contractTemplateParameter.required) => {
        try {
            const { data } = await queryContractTemplateList(requestData, requiredData)
            let userName = localStorage.getItem("user") || ""
            let root = localStorage.getItem("root") || ""
            if (data.code == 0) {
                //过滤用户权限内可见的模板数据
                if(root.slice(0,2) !== "PO"){
                    let filteList = data.data.filter((obj, index) => {
                        return obj.creator === userName
                    })
                    let newData = {
                        ...data
                    }
                    newData.data = filteList
                    newData.totalCount = filteList.length
                    context.commit(mutationsKeys.SET_CONTRACT_TEMPLATE_LIST, {
                        belongTO:localStorage.getItem("user") || "",
                        data:newData,
                        timeout: Date.now() + commonKeys.MAX_AGE
                    })
                }else {
                    context.commit(mutationsKeys.SET_CONTRACT_TEMPLATE_LIST, {
                        belongTO:localStorage.getItem("user") || "",
                        data,
                        timeout: Date.now() + commonKeys.MAX_AGE
                    })
                }
            }

        } catch (err) {
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