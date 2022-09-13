import Bus from '@/bus';
import { voteBacklog } from '@/util/api';

export const comp = {
    data() {
        return {
            // 投票参数
            params: {}
        };
    },
    methods: {
        // 设置投票参数
        setParams(id, notificationId) {
            this.params.id = id;
            this.params.notificationId = notificationId;
        },
        // 投票事件
        handleVote(type) {
            if (type === 2) {
                this.$confirm(this.$t('backlog.confirmRefuse'), {
                    center: true
                }).then(() => {
                    this.loading = true;
                    this.vote(type);
                })
            } else {
                this.loading = true;
                this.vote(type);
            }
        },
        // 投票
        vote(type) {
            this.params.actionType = type;
            voteBacklog(this.params).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('backlog.voteSuccess')
                    });
                    Bus.$emit('refreshBacklog');
                    this.modelClose();
                    this.$emit('success');
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
        }
    },
}

export default comp;
