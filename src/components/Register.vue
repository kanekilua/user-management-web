<template>
    <el-container>
        <login-header :headerContent = 'headerContent'></login-header>
        <el-main>
            <el-input class="input" placeholder="手机号" prefix-icon="el-icon-ali-mobilephone" v-model="phone"></el-input>
            <el-input class="input" placeholder="短信验证码" prefix-icon="el-icon-ali-mail" v-model="codeValue">
                <el-button slot="append" @click="getCodeValue()">
                    <span v-show="show">获取验证码</span>
                    <span v-show="!show">{{count}} s</span>
                </el-button>
            </el-input>
            <el-input :type = "pwdInputType" class="input" placeholder="6-20位字母或数字" prefix-icon= "el-icon-ali-lock" v-model= "password" ref="pwdInput">
                <el-button @click= "changeIsVisitble()" slot="append" :icon= "pwdInputIcon" ref="pwdIcon"></el-button>
            </el-input>
            <el-button class="button" type="primary" @click="registerLogin()" round>立即登入</el-button>
        </el-main>
        <el-footer>
            <router-link class="footLeft " to= "PhoneLogin"><返回登录</router-link>
            <el-checkbox class="footRight" v-model="checked">阅读并同意<router-link class="agreementFont" to = 'UserAgreement'> 《用户协议》</router-link></el-checkbox>
        </el-footer>
        <logining-dialog :phone = 'phone'></logining-dialog>
    </el-container>
</template>
<script>
import LoginHeader from "./LoginHeader.vue";
import LoginingDialog from './LoginingDialog.vue';

const TIME_COUNT = 60;

export default {
    name : 'Register',
    data : function () {
        return {
            phone : '',
            codeValue : '',
            password : '',
            checked : true,
            headerContent : '注册',
            timer : null,
            count : '',
            show : true,
            pwdVisitble : false,
            pwdInputType : 'password',
            pwdInputIcon : 'el-icon-ali-browse_fill'
        }
    },
    components : {
        'login-header' : LoginHeader,
        'logining-dialog' : LoginingDialog
    },
    methods : {
        getCodeValue:function () {
            if(this.phone === "" || this.phone === undefined) {
                this.$message({
                    message : '手机号码不能为空',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phone))) {
                this.$message({
                    message : '手机号码有误，请重填',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.show = false;
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                    } else {
                        this.show = true;
                        clearInterval(this.timer);
                        this.timer = null;  
                    }
                }, 1000);
            }
            let postData = {
                'phone' : this.phone
            };
            let hashString = this.$md5(this.getDateString() + 'sms');
            let config = {
                headers : {
                    'Monster' : hashString
                }
            }
            // 发送短信
            this.$http
                .post ('/sms',postData,config)
                .then (response => {
                    let json = response.data;
                    if(json.success === false) {
                        this.$message({
                            message : json.message,
                            type : 'error',
                            center : true
                        });
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
        changeIsVisitble:function () {
            this.pwdVisitble = !this.pwdVisitble;
            if(this.pwdVisitble) {
                this.pwdInputType = 'text';
                this.pwdInputIcon = 'el-icon-ali-browse'
            }else {
                this.pwdInputType = 'password';
                this.pwdInputIcon = 'el-icon-ali-browse_fill'
            }
            
        },
        registerLogin : function () {
            if(this.phone === "" || this.phone === undefined) {
                this.$message({
                    message : '手机号码不能为空',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phone))) {
                this.$message({
                    message : '手机号码有误，请重填',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if(this.codeValue === undefined || this.codeValue === "") {
                this.$message({
                    message : '验证码不能为空',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if (this.password === undefined || this.password === "") {
                this.$message({
                    message : '密码不能为空',
                    type : 'error',
                    center : true
                });
                return false;
            }
            if(!(/^[a-zA-Z0-9]{6,20}$/.test( this.password))) {
                this.$message({
                    message : '密码格式错误，请重填',
                    type : 'error',
                    center : true
                });
                return false;
            }
            let validateData = {
                phone : this.phone,
                codeValue : this.codeValue
            };
            this.$http
                .post ('/sms/validate',validateData)
                .then (response => {
                    let json = response.data;
                    if(json.success === false) {
                        this.$message({
                            message : json.message,
                            type : 'error',
                            center : true
                        });
                    }else {
                        let password = this.$md5(this.password);
                        let registerData = {
                            phone : this.phone,
                            password : password
                        };
                        this.$http
                            .post ('/user',registerData)
                            .then (response => {
                                let json = response.data;
                                if(json.success === false) {
                                    this.$message({
                                        message : json.message,
                                        type : 'error',
                                        center : true
                                    });
                                }else {
                                    this.$store.state.loggingDialog.show = true;
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
