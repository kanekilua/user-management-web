<template>
    <el-dialog  :visible.sync="visible" width="90%" :show-close=false :close-on-press-escape=false :close-on-click-modal=false @close = 'closeDialog() ' @open= 'openDialog()'>   
            <p v-if="phone != null && phone != ''">{{phone}}</p>
            <p v-else>{{account}}</p>
            <p>正在登录<i class="el-icon-loading"></i></p>
            <el-button size="mini" @click="changeAccount()">切换账号</el-button>
    </el-dialog>
</template>
<script>
    export default {
        name : "Logining",
        props : ['dialogVisible','account','phone'],
        data () {
            return {
                visible: this.dialogVisible,
                timer : 0
            }
        },
        watch: {
            dialogVisible (val) {
                this.visible = val;
            }
        },
        methods :{
            closeDialog () {
                this.$emit('dialogData', false);
                this.$router.push({ 
                    name: 'AccountLogin'
                });
            },
            openDialog : function () {
                this.timer = setTimeout(() => {
                    this.closeDialog();
                    this.$message({
                        message : '登录成功',
                        type : 'success',
                        center : true
                    });
                },3000);
            },
            changeAccount : function () {
                clearTimeout(this.timer);
                this.closeDialog();
            }
        }
    }
</script>
<style scoped>
* {padding: 8px; }
</style>

