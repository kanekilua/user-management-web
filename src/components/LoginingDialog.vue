<template>
    <el-dialog  :visible.sync="visible" width="90%" :show-close=false :close-on-press-escape=false :close-on-click-modal=false @close = 'updateData() ' @open= 'openDialog()'>   
            <p v-if="phone != null && phone != ''">{{phone}}</p>
            <p v-else>{{account}}</p>
            <p>正在登录<i class="el-icon-loading"></i></p>
            <el-button size="mini" @click="">切换账号</el-button>
    </el-dialog>
</template>
<script>
    export default {
        name : "Logining",
        props : ['dialogVisible','account','phone'],
        data () {
            return {
                visible: this.dialogVisible
            }
        },
        watch: {
            dialogVisible (val) {
                this.visible = val;
            }
        },
        methods :{
            updateData () {
                this.$emit('dialogData', false); //这句不知道什么意思鸭
            },
            openDialog : function () {
                setTimeout(() => {
                    this.updateData();
                },3000);
            }
        }
    }
</script>
