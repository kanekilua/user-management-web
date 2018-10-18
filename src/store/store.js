import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import logging_dialog from './logging-dialog'
import dropdown_dialog from './dropdown-dialog'
import account_login from './account-login'

export default new vuex.Store ({
    modules : {
        loggingDialog : logging_dialog,
        dropdownDialog : dropdown_dialog,
        accountLogin : account_login
    }
})
