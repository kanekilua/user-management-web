export default {
    install(Vue,options) {
        Vue.prototype.getDateString = function () {
            let date = new Date();
            let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
            let today = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
            let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
            let minutes = date.getMinutes()> 9 ? date.getMinutes() : '0' + date.getMinutes();
            let dateString = '' + date.getFullYear() + month + today + hour + minutes;
            return dateString;
        }
    }
}