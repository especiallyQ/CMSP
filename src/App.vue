<template>
    <div id="app" class="web-font">
        <router-view></router-view>
    </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template';
export default {
    name: 'App',
    components: {
        VueLoading
    },
    data() {
        return {
            load: this.$root.load
        };
    },
    methods: {}
};
</script>

<style>
#app {
    /* min-width: 800px; */
    height: 100%;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2E384D;
    min-width: 1280px;
}
ul,
li {
    list-style: none;
}
</style>
