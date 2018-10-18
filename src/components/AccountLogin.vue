<template>
    <el-container>
        <login-header :headerContent = 'headerContent'></login-header>
        <el-main>
            <el-input class="input" placeholder="账号" prefix-icon="el-icon-ali-people" @change="changeGetWay()" v-model="account">
                <i :class="inputSuffixIcon" slot="suffix" @click="showDropdown()"></i>
            </el-input>
            <el-input class="input" type="password" placeholder="密码" prefix-icon="el-icon-ali-lock" @change="changeGetWay()" v-model="password">
                <router-link to="ResetPwd" slot="append" style="color:grey">忘记密码</router-link>
            </el-input>
            <el-button class="button" type="primary" @click="accountLogin()" round>登录</el-button>
            <el-checkbox class="check" v-model="checked">阅读并同意<router-link to = 'UserAgreement' class="agreementFont"> 《用户协议》</router-link></el-checkbox>
        </el-main>
        <el-footer>
            <router-link class="footLeft" to= "PhoneLogin">切换登陆方式></router-link>
            <router-link class="footRight" to= "Register">立即注册></router-link>
        </el-footer>
        <logining-dialog :phone = 'phone'></logining-dialog>
        <dropdown-dialog @deleteUser= "deleteUser" @changInput= "changInput" :users= 'users'></dropdown-dialog>
    </el-container>
</template>

<script>
    import LoginHeader from './LoginHeader.vue';
    import LoginingDialog from './LoginingDialog.vue';
    import DropdownDialog from './DropdownDialog.vue';

    export default {
        name : 'AccountLogin',
        data : function (){
            return {
                getFromStorage : false,
                checked : true,
                headerContent : '账号登录'
            };
        },
        watch : {
            users (val) {
                if(val.length > 1) {
                    this.inputSuffixIcon = 'el-icon-ali-unfold el-input__icon';
                }else {
                    this.inputSuffixIcon = '';
                }
            }
        }, 
        mounted : function () {
            this.getUsers();
        },
        components : {
            'login-header' : LoginHeader,
            'logining-dialog' : LoginingDialog,
            'dropdown-dialog' : DropdownDialog
        },
        methods: {
            accountLogin : function () {
                if (this.checked === false) {
                    this.$message({
                        message : '请同意用户协议',
                        type : 'error',
                        center : true
                    });
                    return false;
                }
                if(this.password === undefined || this.password === "") {
                    this.$message({
                        message : '密码不能为空',
                        type : 'error',
                        center : true
                    });
                    return false;
                }
                if(!(/^[a-zA-Z0-9]{6,20}$/.test( this.password ))) {
                    this.$message({
                        message : '密码格式错误，请重填',
                        type : 'error',
                        center : true
                    });
                    return false;
                }
                let accountData ;
                if(this.getFromStorage) {
                    let realPwd = '';
                    for(let i =0 ; i < this.users.length; ++i) {
                        if(this.account === this.users[i].phone || this.account === this.users[i].account) {
                            realPwd = this.users[i].password;
                        }
                    }
                    accountData = {
                        account : this.account,
                        password : realPwd
                    };
                }else {
                    let hashPwd = this.$md5(this.password);
                    accountData = {
                        account : this.account,
                        password : hashPwd
                    };
                }
                this.$http
                    .post ('/user/login',accountData)
                    .then (response => {
                        let json = response.data;
                        if(json.success === false) {
                            let json = response.data;
                            this.$message({
                                message : json.message,
                                type : 'error',
                                center : true
                            });
                        }else {
                            let user = json.data.user;
                            if(localStorage.hasOwnProperty('monster-user')) {
                                let users = JSON.parse(localStorage.getItem('monster-user'));
                                for(let i = 0; i< users.length ; ++i) {
                                    if(user.userId === users[i].userId) {
                                        users.splice(i,1);
                                    }
                                }
                                if(users.length === 7) {
                                    users.splice(0,1);
                                }
                                users.push(user);
                                localStorage.setItem('monster-user',JSON.stringify(users));
                            }else {
                                let users = [];
                                users.push(user);
                                localStorage.setItem('monster-user',JSON.stringify(users));
                            }
                            if(user.phone === undefined || user.phone === "") {
                                this.$router.push({ 
                                    name: 'BindPhone',
                                    params : {
                                        userId : user.userId,
                                        account : this.account
                                    }
                                });
                            }else {
                                this.$store.state.loggingDialog.show = true;
                            }
                        }
                    })
                    .catch (response => {
                        this.$message({
                            message : '连接服务器失败',
                            type : 'error',
                            center : true
                        });
                    });
            },
            getUsers : function () {
                this.users = JSON.parse(localStorage.getItem('monster-user'));
                this.changInput(this.users[this.users.length-1]);
                this.getFromStorage = true;
            },
            changeGetWay : function () {
                this.getFromStorage = false;
            },
            closeDropdown : function (data) {
                if(this.users.length > 1) {
                    this.inputSuffixIcon = 'el-icon-ali-unfold el-input__icon';
                }else{
                    this.inputSuffixIcon = '';
                }
                this.$store.state.dropdownDialog.show = data;
                this.getFromStorage = true;
            },
            showDropdown : function () {
                this.inputSuffixIcon = 'el-icon-ali-packup el-input__icon';
                this.$store.state.dropdownDialog.show = !this.$store.state.dropdownDialog.show;
            },
            changInput : function (user) {
                this.account = (user.phone === undefined || user.phone === '') ? user.account : user.phone;
                this.password = user.password.slice(1,7);
            },
            deleteUser : function (userId) {
                for(let i=0;i<this.users.length; ++i) {
                    if(this.users[i].userId === userId) {
                        this.users.splice(i,1);
                    }
                }
                localStorage.setItem('monster-user',JSON.stringify(this.users));
            }
        }
    }
</script>
