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
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-button class="button" type="danger" @click="login()" round>稍后再说</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button class="button" type="primary" @click="bindPhone()" round>绑定手机号</el-button>
                </el-col>
            </el-row>
        </el-main>
        <el-footer></el-footer>
        <logining-dialog :dialogVisible= 'dialogVisible' :account= 'account' :phone= 'phone' @dialogData= "closeDialog"></logining-dialog>
    </el-container>
</template>

<script>
import LoginHeader from "./LoginHeader.vue";
import LoginingDialog from './LoginingDialog.vue';
const TIME_COUNT = 60;

export default {
  name: "BindPhone",
  data: function() {
    return {
      userId : "",
      account: "",
      phone: "",
      codeValue: "",
      headerContent: "绑定手机号",
      timer : null,
      count : '',
      show : true,
      dialogVisible : false
    };
  },
  mounted : function () {
      this.userId = this.$route.params.userId;
      this.account = this.$route.params.account;
  },
  components: {
    "login-header": LoginHeader,
    'logining-dialog' : LoginingDialog
  },
  methods : {
      getCodeValue:function () {
        if(this.phone === "" || this.phone === null) {
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
      bindPhone : function () {
        if(this.phone === null || this.phone === "") {
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
        if(this.codeValue === null || this.codeValue === "") {
            this.$message({
                message : '验证码不能为空',
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
                    // 绑定手机号 需要userId
                    let bindData = {
                        userId : this.userId,
                        phone : this.phone
                    };
                    this.$http
                        .put ('/user?type=userId',bindData)
                        .then (response => {
                            let json = response.data;
                            if(json.success === false) {
                                this.$message({
                                    message : json.message,
                                    type : 'error',
                                    center : true
                                });
                            }else {
                                this.phone = json.data.user.phone;
                                this.login();
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
      },
      login : function () {
          this.dialogVisible = true;
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
};
</script>