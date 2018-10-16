<template>
    <div>
      <div class="top">
        <div class="title">怪物游戏用户协议</div>
        <div class="icon" @click="goBack()"><i class="el-icon-arrow-left"></i></div>
      </div>
      <div class="text">
        <v-html-panel :url= "url"></v-html-panel>
      </div>
    </div>
</template>
<script>
import HtmlPanel from '@/components/HtmlPanel'

export default {
  data() {
    return {
      url: "http://121.40.47.149/user_agreement/"
    };
  },
  components : {
    'v-html-panel' : HtmlPanel
  },
  methods : {
    goBack : function () {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.top {
  height: 40px;
  background-color: rgb(240, 240, 240);
  padding-top: 15px;
  margin-bottom: 10px;
  position: relative;
}
p {
  text-align: left; 
}
.icon {
  position: absolute;
  width: 20px;
  height: 30px;
  padding: 3px;
}
.text {
  margin : 8px;
}
.title {
  position: absolute;
  width: 100%;
  text-align: center;
}
</style>
