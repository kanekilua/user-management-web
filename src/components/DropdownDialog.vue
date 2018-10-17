<template>
    <div class="market_out">
        <el-dialog  :visible.sync="visible" width="calc(100% - 42px)" top="190px"
                    :show-close=false
                    :modal= false
                    @close= 'closeDialog()'>   
            <el-table :data="gridData" :show-header= false max-height="180px" @cell-click="clickItem">
                <el-table-column property="account"  min-width="200" align='left'></el-table-column>
                <el-table-column property="operate"  width="40" align='left' fixed='right'>
                    <template slot-scope="scope">
                        <i class="el-icon-ali-delete_fill"></i>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name : "DropdownDialog",
        props : ['dropdownVisible','users','account'],
        data () {
            return {
                visible : this.dropdownVisible,
                gridData: []
            }
        },
        watch: {
            dropdownVisible (val) {
                this.visible = val;
            },
            users (val) {
                this.users = val;
                this.changeGridData (val);
            },
            account (val) {
                this.account = val;
                this.changeGridData(this.users);
            }
        },
        methods :{
            closeDialog : function () {
                this.$emit('dialogData', false);
            },
            clickItem : function (row, column, cell, event) {
                if(column.fixed === 'right') {
                    this.$emit('deleteUser',row.userId);
                }else{
                    this.$emit('changInput',row);
                }
                this.$emit('dialogData',false);
            },
            changeGridData : function (users) {
                this.gridData = [];
                for(let i = 0;i< users.length; ++i) {
                    if(users[i].phone != undefined && users[i].phone != '' ) {
                        if(users[i].phone != this.account) {
                            this.gridData.push({'userId' : users[i].userId ,'account':users[i].phone ,'password' :users[i].password });
                        }
                    }else {
                        if(users[i].account != this.account) {
                            this.gridData.push({'userId' : users[i].userId ,'account':users[i].account ,'password' :users[i].password});
                        }
                    }
                }
            }
        }
    }
</script>
<style>
.market_out .el-dialog__body {
    padding : 0px;
}
.market_out .el-table td, .el-table th {
    padding : 3px 0;
    font-size: 12px;
}
</style>

