<template>
    <div class="notice-center-wrapper">
        <content-head :headTitle="$t('title.message')"></content-head>
        <div class="module-wrapper">
            <div class="tabs-wrapper">
                <el-tabs type="border-card" v-model="activeTab">
                    <el-tab-pane :label="$t('noticeCenter.unRead')" name="unReadTab">
                        <notice-list :status="0" />
                    </el-tab-pane>
                    <el-tab-pane :label="$t('noticeCenter.readed')" name="readedTab">
                        <notice-list :status="1" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from '@/components/contentHead';
import noticeList from './noticeList';
export default {
    name: 'noticeCenter',
    components: {
        contentHead,
        noticeList
    },
    data() {
        return {
            loading: false,
            activeTab: 'unReadTab'
        }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style scoped>
.tabs-wrapper {
    position: relative;
    padding: 30px 40px;
}
</style>