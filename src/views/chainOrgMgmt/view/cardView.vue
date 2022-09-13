<template>
    <div class="org-card-view" v-if="chainOrgList.length > 0">
        <div
            class="card-column"
            v-for="(item, index) in chainOrgList"
            :key="index">
            <div class="card-small">
                <div class="content-wrap" @click="viewChainOrg(item)">
                    <div class="icon-box">
                        <div
                            class="icon"
                            :style="{ backgroundColor: colors[index % 28] }">
                            {{getIconText(item.orgName)}}
                        </div>
                    </div>
                    <div class="content-box">
                        <div class="title">{{item.orgName}}</div>
                        <div class="info-wrap">
                            <div class="info-row">
                                <div class="item-content">{{$t('chainOrg.accountGroup') + ' : ' + item.accountGroupName}}</div>
                            </div>
                            <div class="info-row">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    placement="top"
                                    :open-delay="1000">
                                    <div slot="content" v-dompurify-html="getOrgInfo(item)"></div>
                                    <div class="item-content">
                                        {{$t('chainOrg.chainNodeTotalShort') + ' : ' + item.chainNodeCount +
                                        '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;' +
                                        $t('chainOrg.chainUserTotalShort') + ' : ' + item.chainUserCount}}
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="action-wrap">
                    <div class="action-inner">
                        <div
                            :class="['action-btn', 'danger', isDeleteChainOrgDisabled(item) ? 'disabled' : '']"
                            class="action-btn danger"
                            @click="deleteChainOrg(item)">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="$t('text.delete')"
                                placement="bottom"
                                :open-delay="1000">
                                <i class="cmsp-icon-guanbi1"></i>
                            </el-tooltip>
                        </div>
                        <div
                            :class="['action-btn', 'primary', isUpdateChainOrgDisabled(item) ? 'disabled' : '']"
                            class="action-btn primary"
                            @click="updateChainOrg(item)">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="$t('text.update')"
                                placement="bottom"
                                :open-delay="1000">
                                <i class="cmsp-icon-shezhi"></i>
                            </el-tooltip>
                        </div>
                        <div
                            class="action-btn primary"
                            @click="viewChainOrg(item)">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="$t('text.viewDetail')"
                                placement="bottom"
                                :open-delay="1000">
                                <i class="cmsp-icon-chakan"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="card-empty">
        <el-empty
            :image-size="43.5"
            :image="require('@/../static/image/empty.png')"
            :description="$t('text.noData')">
        </el-empty>
    </div>
</template>

<script>
import { earthTones } from '@/util/util';
import mixins from './mixins.js';
export default {
    name: 'orgCardView',
    components: {
    },
    mixins: [ mixins ],
    props: {
        // 组织数据
        data: { type: Array, required: false, default: () => { return [] } }
    },
    data() {
        return {
            loading: false,
            chainOrgList: this.data,
            colors: earthTones()
        }
    },
    watch: {
        data: function (val) {
            this.chainOrgList = val;
        }
    },
    created() {
    },
    beforeDestroy() {
    },
    mounted() {
    },
    methods: {
        // 获取图标中心文字
        getIconText(orgName) {
            let pattern = new RegExp('[\u4E00-\u9FA5]+');
            let firstChar = orgName.substring(0, 1);
            if (pattern.test(firstChar)) {
                return firstChar;
            } else {
                return firstChar.toUpperCase();
            }
        },
        // tip详情
        getOrgInfo(rowData) {
            let tip = this.$t('chainOrg.chainNodeTotal') + '&nbsp;:&nbsp;' + rowData.chainNodeCount + '<br />';
            tip += this.$t('chainOrg.chainUserTotal') + '&nbsp;:&nbsp;' + rowData.chainUserCount + '<br />';
            tip += this.$t('chainOrg.creator') + '&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;' + rowData.creator + '<br />';
            return tip;
        }
    }
}
</script>

<style scoped>
.org-card-view {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
}
.card-column {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 25%;
}
.content-wrap {
    cursor: pointer;
}
</style>
