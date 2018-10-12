<template>
     <el-header>
            <h2>{{headerContent}}</h2>
    </el-header>
</template>
<script>
    export default {
        name : "LoginHeader",
        props : ['headerContent']
    }
</script>