<template>
    <el-container>
        <login-header :headerContent = 'headerContent'></login-header>
        <el-main>
            <el-input class="input" placeholder="账号" prefix-icon="el-icon-ali-people" @change="changeGetWay()" v-model="account"></el-input>
            <el-input class="input" type="password" placeholder="密码" prefix-icon="el-icon-ali-lock" @change="changeGetWay()" v-model="password">
                <router-link to="ResetPwd" slot="append" style="color:grey">忘记密码</router-link>
            </el-input>
            <el-button class="button" type="primary" @click="accountLogin()" round>登录</el-button>
            <el-checkbox class="check" v-model="checked">阅读并同意<router-link to = 'UserAgreement' class="agreementFont"> 《用户协议》</router-link></el-checkbox>
        </el-main>
        <el-footer>
            <router-link class="footLeft " to= "PhoneLogin">切换登陆方式></router-link>
            <router-link class="footRight " to= "Register">立即注册></router-link>
        </el-footer>
        <logining-dialog :dialogVisible= 'dialogVisible' :account= 'account' :phone = 'phone' @dialogData= "closeDialog"></logining-dialog>
    </el-container>
</template>

<script>
    import LoginHeader from './LoginHeader.vue';
    import LoginingDialog from './LoginingDialog.vue';

    export default {
        name : 'AccountLogin',
        data : function (){
            return {
                account : '',
                phone : '',
                password : '',
                getFromStorage : false,
                checked : true,
                headerContent : '账号登录',
                dialogVisible : false
            };
        },
        mounted : function () {
            this.changeInput();
        },
        components : {
            'login-header' : LoginHeader,
            'logining-dialog' : LoginingDialog
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
                if(this.account === null || this.account === "") {
                    this.$message({
                        message : '账号不能为空',
                        type : 'error',
                        center : true
                    });
                    return false;
                }
                if(!(/^[a-zA-Z0-9]{6,12}$/.test( this.account ))) {
                    this.$message({
                        message : '账号格式错误，请重填',
                        type : 'error',
                        center : true
                    });
                    return false;
                }
                if(this.password === null || this.password === "") {
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
                    let users = JSON.parse(localStorage.getItem('monster-user'));
                    accountData = {
                        account : this.account,
                        password : users[users.length - 1].password
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
                                users.push(user);
                                localStorage.setItem('monster-user',JSON.stringify(users));
                            }else {
                                let users = [];
                                users.push(user);
                                localStorage.setItem('monster-user',JSON.stringify(users));
                            }
                            if(user.phone === null || user.phone === "") {
                                this.$router.push({ 
                                    name: 'BindPhone',
                                    params : {
                                        userId : user.userId,
                                        account : this.account
                                    }
                                });
                            }else {
                                this.dialogVisible = true;
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
            changeInput : function () {
                let users = JSON.parse(localStorage.getItem('monster-user'));
                if(users != null && users.length > 0) {
                    let lastUser = users[users.length-1];
                    this.account = lastUser.phone  === "" ? lastUser.account : lastUser.phone;
                    this.password = lastUser.password.slice(1,7);
                    this.getFromStorage = true;
                }
            },
            changeGetWay : function () {
                this.getFromStorage = false;
            },
            closeDialog : function (data) {
                this.dialogVisible = data;
                this.$message({
                    message : '登录成功',
                    type : 'success',
                    center : true
                });
            }
        }
    }
</script>
