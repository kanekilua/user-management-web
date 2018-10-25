export default {
    state: {
        account : '',
        phone : '',
        password : '',
        userId : 0
    },
    getters : {
        inputSuffixIcon : (state, getters, rootState, rootGetters) => {
            if(getters.users.length > 1) {
                if(rootState.dropdownDialog.show === false) {
                    return 'el-icon-ali-unfold el-input__icon';
                }else {
                    return 'el-icon-ali-packup el-input__icon';
                }
            }else {
                return '';
            }
        },
        users : () => {
            return JSON.parse(localStorage.getItem('monster-user'));
        }
    },
    mutations: {
        updateAccount : function (state,param) {
            state.account = param;
        },
        updatePassword : function (state,param) {
            state.password = param;
        }
    }
}