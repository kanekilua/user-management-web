<template>
    <p>
        <v-html-panel :url= "url"></v-html-panel>
    </p>
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
  }
};
</script>

<style scoped>
p {
  text-align: left; 
}
</style>
