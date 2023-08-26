<template>
  <input type="text" v-model="inputVal" @keyup.enter="() => handleSearch()" />
  <br />
  <button @click="handleSearch(true)">搜索</button>
  <br />
  <br />
  <div>返回结果是：{{ resVal }}</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "@/api/request.ts";
const prePath = `http://192.168.31.158:8091/`
console.log("api", api);

const inputVal = ref("");
const resVal = ref("default res");
function handleSearch(isAxios=false) {
  console.log("search", inputVal.value);
  if (isAxios) {
    api
      .axios({
        method: "post",
        url: `${prePath}getUserInfo`,
        data: {
          inputVal: inputVal.value,
          uniqueKeyNoParams: true
        },
      })
      .then((res) => {
        console.log("res", res);
        const data = res.data.data;
        resVal.value = data.searchKey;
      })
      .catch((err) => {
        console.log("err", err);
      });
    return;
  }

  api.api
    .post("getUserInfo", {
      inputVal: inputVal.value,
    })
    .then((res: any) => {
      console.log("11111111111", res);
      const data = res.data.data;
      resVal.value = data.searchKey;
    })
    .catch((err: any) => {
      console.log(2222, err);
    });
}
</script>
