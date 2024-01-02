<template>
  <button @click="fetchServer">请求server</button>
  <div>
    <h1>{{ hello.message }}</h1>
  </div>
</template>

<script setup>
import { get } from "utils/http";
import { ref } from "vue";

const hello = ref({});

const fetchServer = () => {
  hello.value = "loading...";
  get("/api/hello")
    .then(function (data) {
      hello.value = data;
    })
    .catch((e) => {
      hello.value = "error";
    });
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
