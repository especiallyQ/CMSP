<template>
    <div class="log-content-wrapper">
        <el-row :gutter="24" class="log-row">
            <el-col :span="24">
                <el-input
                    :value="log"
                    :rows="12"
                    resize="vertical"
                    readonly
                    type="textarea" />
            </el-col>
        </el-row>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{ $t('text.cancel') }}</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LogViewer',
    props: {
        log: {
            type: String,
            required: false
        }
    },
    data() {
        return {
        };
    },
    mounted() {
    },
    methods: {
        modelClose() {
            this.$emit('close', '0');
        }
    }
};
</script>

<style scoped>
.dialog-wrapper >>> .el-form-item__label {
    font-size: 12px;
    color: #737a86;
}
.log-content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.log-content-wrapper .log-row {
    width: 100%;
}
.log-content-wrapper .dialog-footer {
    text-align: right;
    margin-top: 10px;
    margin-right: -5px;
    padding-top: 12px;
    width: 100%;
}
</style>
