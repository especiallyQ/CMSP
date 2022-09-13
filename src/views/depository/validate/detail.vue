<template>
    <div class="validate-detail-wrapper">
        <div class="diff-wrapper">
            <div class="diff-column col-param-label">
                <div class="diff-row header" style="justify-content: flex-end">
                    {{$t('depository.params')}}
                </div>
                <template v-for="attrLabel in attributes">
                    <div class="diff-row">
                        {{attrLabel}}
                    </div>
                </template>
            </div>
            <div class="diff-column">
                <div class="diff-row header">
                    {{$t('depository.validateBefore')}}
                </div>
                <template v-for="(value, attr) in beforeContent">
                    <div class="diff-row">
                        <div :class="['diff-item', beforeTheme[attr]]">{{beforeContent[attr]}}</div>
                    </div>
                </template>
            </div>
            <div class="diff-column">
                <div class="diff-row header">
                    {{$t('depository.validateAfter')}}
                </div>
                <template v-for="(value, attr) in afterContent">
                    <div class="diff-row">
                        <div :class="['diff-item', afterTheme[attr]]">{{afterContent[attr]}}</div>
                    </div>
                </template>
            </div>
        </div>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.close')}}</el-button>
            <el-button
                @click="handleRoute"
                v-if="routeVisible">
                {{ $t('title.depositoryTitle') }}
            </el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/bus';
import router from '@/router';
import { validateDepositoryContentDiff } from '@/util/api';
export default {
    name: 'validateDetailDialog',
    props: {
        // 是否需要显示跳转存证模块路由的按钮
        routeVisible: { type: Boolean, required: false, default: false },
        // 存证内容id
        contentId: { type: Number, required: true, default: null }
    },
    data() {
        return {
            attributes: [], // 存证模板属性
            beforeContent: {}, // 校验前属性
            afterContent: {}, // 校验后属性
            beforeTheme: {}, // 校验前样式
            afterTheme: {}, // 校验后样式
            chainId: null, // 应用链id
            contractId: null, // 合约id
            templateId: null // 存证模板id
        };
    },
    mounted() {
        this.fetchInitData();
    },
    methods: {
        modelClose() {
            this.$emit('close');
        },
        // 获取页面初始化数据
        fetchInitData() {
            let reqData = {
                alarmType: 1,
                contentId: this.contentId
            };
            validateDepositoryContentDiff(reqData).then(res => {
                if (res.data.code === 0) {
                    let templateAttrs = [],
                        beforeContent = {},
                        afterContent = {},
                        beforeTheme = {},
                        afterTheme = {};
                    let beforeObj = JSON.parse(res.data.data.oldContent);
                    let afterObj = JSON.parse(res.data.data.newContent);
                    let attrList = res.data.data.headerList || [];
                    attrList.forEach(attr => {
                        let paramKey = attr.parameterName;
                        templateAttrs.push(paramKey);
                        let beforeValue = beforeObj[paramKey];
                        let afterValue = afterObj[paramKey];
                        beforeContent[paramKey] = beforeValue;
                        afterContent[paramKey] = afterValue;
                        if (beforeValue !== afterValue) { // 存在变更
                            beforeTheme[paramKey] = 'attr-changed';
                            afterTheme[paramKey] = 'attr-fixed';
                        } else {
                            beforeTheme[paramKey] = 'attr-unchange';
                            afterTheme[paramKey] = 'attr-unchange';
                        }
                    });
                    this.attributes = templateAttrs;
                    this.beforeContent = beforeContent;
                    this.afterContent = afterContent;
                    this.beforeTheme = beforeTheme;
                    this.afterTheme = afterTheme;

                    this.chainId = res.data.data.chainId;
                    this.contractId = res.data.data.contractId;
                    this.templateId = res.data.data.templateId;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 路由跳转事件,跳转至存证模块
        handleRoute() {
            router.push({
                name: 'depository',
                params: {
                    chainId: this.chainId,
                    contractId: this.contractId,
                    templateId: this.templateId
                }
            });
            Bus.$emit('routing', '/depository');
        }
    }
}
</script>

<style scoped>
.diff-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
}
.diff-wrapper .diff-column {
    font-size: 12px;
}
.diff-wrapper .diff-column .diff-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 36px;
    margin-bottom: 26px;
    user-select: none;
}
.col-param-label .diff-row {
    justify-content: flex-end;
}
.diff-wrapper .diff-column .header {
    justify-content: center;
    color: #409eff;
}
.diff-wrapper .diff-column .diff-row .diff-item {
    width: 160px;
    height: 36px;
    line-height: 34px;
    -webkit-appearance: none;
    border: 1px solid #409eff;
    border-radius: 4px;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    outline: 0;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #FFF;
    background-image: none;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    user-select: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.attr-fixed {
    color: #67c23a!important;
    border-color: #67c23a!important;
}
.attr-changed {
    color: #f56c6c!important;
    border-color: #f56c6c!important;
}
.attr-unchange {
    border-color: #409eff!important;
}
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
}
</style>
