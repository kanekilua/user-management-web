<template>
    <el-container>
        <login-header :headerContent = 'headerContent'></login-header>
        <el-main>
            <el-input class="input" placeholder="账号" prefix-icon="el-icon-ali-people" v-model="account"></el-input>
            <el-input type="password" class="input" placeholder="密码" prefix-icon="el-icon-ali-lock" v-model="password"></el-input>
            <el-button class="button" type="primary" @click="guestLogin()" round>立即登入</el-button>
        </el-main>
        <el-footer>
            <router-link class="footLeft " to="PhoneLogin"><返回登录</router-link>
            <el-checkbox class="footRight" v-model="checked">阅读并同意<router-link class="agreementFont" to = 'UserAgreement'> 《用户协议》</router-link></el-checkbox>
        </el-footer>
    </el-container>
</template>
<script>
    import LoginHeader from "./LoginHeader.vue";

    export default {
        name : 'GuestLogin',
        data : function () {
            return {
                account : '',
                password : '',
                checked : true,
                headerContent : '游客登录'
            }
        },
        mounted : function() {
            this.getGuestAccount();
        },
        components : {
            'login-header' : LoginHeader 
        },
        methods : {
            getGuestAccount: function () {
                let hashString = this.$md5(this.getDateString() + 'guest');
                let config = {
                    headers : {
                        'Monster' : hashString
                    }
                };
                this.$http
                    .get ('/user?type=guest',config)
                    .then (response => {
                        let json = response.data;
                        if(json.success === false) {
                            this.$message({
                                message : json.message,
                                type : 'error',
                                center : true
                            });
                        }else {
                            this.account = json.data.user.account;
                            this.password = json.data.user.password;
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
            guestLogin : function () {
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
                if(!(/^[a-zA-Z0-9]{6,12}$/.test(this.account))) {
                    this.$message({
                        message : '账号格式错误，请重填',
                        type : 'error',
                        center : true
                    });
                    return false;
                }
                if (this.password === null || this.password === "") {
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
                let hashPwd = this.$md5(this.password);
                let accountData = {
                    account : this.account,
                    password : hashPwd
                };
                let hashString = this.$md5(this.getDateString() + 'guest');
                let config = {
                    headers : {
                        'Monster' : hashString
                    }
                };
                this.$http
                    .post ('/user',accountData,config)
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
                            if(user.phone === null || user.phone === "") {
                                this.$router.push({ 
                                    name: 'BindPhone',
                                    params : {
                                        userId : user.userId,
                                        account : this.account
                                    }
                                });
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
            }
        }
    }
</script>
