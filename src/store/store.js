import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import logging_dialog from './logging-dialog'
import dropdown_dialog from './dropdown-dialog'
import account_login from './account-login'

export default new vuex.Store ({
    state : {
        'userAgreement' : true
    },
    modules : {
        loggingDialog : logging_dialog,
        dropdownDialog : dropdown_dialog,
        accountLogin : account_login
    },
    mutations : {
        checkAccount : function (state,param) {
            let account = param.account;
            let vue = param.vue;
            if(account === undefined || account === "") {
                vue.$message({
                    message : '账号不能为空',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if(!(/^[a-zA-Z0-9]{6,12}$/.test( account ))) {
                vue.$message({
                    message : '账号格式错误，请重填',
                    type : 'error',
                    center : true
                });
                return false;
            }
        },
        checkPassword : function (state, param) {
            let password = param.password;
            let vue = param.vue;
            if(password === undefined || password === "") {
                vue.$message({
                    message : '密码不能为空',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if(!(/^[a-zA-Z0-9]{6,20}$/.test( password ))) {
                vue.$message({
                    message : '密码格式错误，请重填',
                    type : 'error',
                    center : true
                });
                return false;
            }
        },
        switchUserAgreement :function (state) {
            state.userAgreement = !state.userAgreement;
        },
        checkUserAgreement : function(state,param) {
            let vue = param.vue;
            if(!state.userAgreement) {
                vue.$message({
                    message : '请同意用户协议',
                    type : 'error',
                    center : true
                });
                return false;
            }
        }
    }
})
