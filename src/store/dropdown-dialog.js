export default {
    state: {
        show : false
    },
    mutations: {
        switchDropdown : function (state){
            state.show = !state.show;
        }
    }
}