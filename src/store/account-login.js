export default {
    state: {
        account : '',
        phone : '',
        password : '',
        userId : 0,
        inputSuffixIcon : '',
        users : []
    },
    mutations : {
        checkAccount : function () {
            if(state.account === undefined || state.account === "") {
                this.$message({
                    message : '账号不能为空',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if(!(/^[a-zA-Z0-9]{6,12}$/.test( state.account ))) {
                this.$message({
                    message : '账号格式错误，请重填',
                    type : 'error',
                    center : true
                });
                return false;
            }
        }
    }
}