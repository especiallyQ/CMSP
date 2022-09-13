<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :title="$t('chainOrg.viewPem')"
        :width="'450px'"
        :append-to-body="true"
        :center="true"
        class="dialog-wrapper"
        :close-on-click-modal="false">
        <div class="key-view-wrapper">
            <div class="key-row">
                <div class="key-content-wrapper">
                    <span class="title">
                        {{ $t('chainOrg.pemName') }}
                    </span>
                    <el-input
                        v-model="keyData"
                        :rows="10"
                        resize="none"
                        readonly
                        type="textarea"/>
                </div>
            </div>
            <div class="dialog-footer">
                <el-button @click="modelClose">{{ $t('text.close') }}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { viewChainOrgKey } from '@/util/api';
export default {
    name: 'keyViewDialog',
    props: {
        visible: { type: Boolean, required: false, default: false },
        // 1-组织公钥, 2-节点公钥, 3-用户公钥
        keyType: { type: Number, required: false, default: null },
        id: { type: Number, required: false, default: null }
    },
    watch: {
        visible(nval, oval) {
            this.dialogVisible = nval;
            if (nval) {
                this.delayFetchData();
            }
        },
        dialogVisible(nval, oval) {
            if (!nval) {
                this.modelClose();
            }
        }
    },
    data() {
        return {
            role: localStorage.getItem('root'),
            dialogVisible: this.visible || false,
            loading: false,
            keyData: ''
        };
    },
    mounted() {
    },
    methods: {
        modelClose() {
            this.$emit('close', false);
        },
        delayFetchData(ms) {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.timer = null;
                this.fetchData();
            }, ms || 20);
        },
        fetchData() {
            if (this.keyType == null || this.id == null) {
                return;
            }
            this.loading = true;
            viewChainOrgKey({
                type: this.keyType,
                id: this.id
            }).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.keyData = res.data.data.publicKey;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        }
    }
}
</script>

<style scoped>
.key-view-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.key-view-wrapper .key-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 25px;
}
.key-view-wrapper .key-row .key-content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
}
.key-view-wrapper .key-row .key-content-wrapper.ml20 {
    margin-left: 20px;
}
.key-view-wrapper .key-row .key-content-wrapper .title {
    margin-bottom: 10px;
    font-size: 12px;
    color: #737a86;
}
.key-view-wrapper .dialog-footer {
    text-align: right;
    margin-right: -5px;
    width: 100%;
}
</style>
