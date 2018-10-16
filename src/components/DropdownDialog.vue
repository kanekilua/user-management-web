<template>
    <el-dialog  :visible.sync="visible" width="90%" :show-close=false :close-on-press-escape=false :close-on-click-modal=false @close = 'updateData() ' @open= 'openDialog()'>   
        <el-table :data="gridData">
            <el-table-column property="date" label="日期" width="150"></el-table-column>
            <el-table-column property="name" label="姓名" width="200"></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
        </el-table>
    </el-dialog>
</template>
<script>
    export default {
        name : "DropdownDialog",
        data () {
            return {
            }
        },
        methods :{
        }
    }
</script>
