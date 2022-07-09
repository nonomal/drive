<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">

body {
  margin: 0;
  padding: 0;
}
ul.menu {
  margin: 0;
  padding: 0;
  li {
    list-style: none;
    cursor: pointer;
    border-radius: 5px;
    padding: 10px 0 10px 20px;
    &:hover {
      background-color: #c5c5c5;
    }
  }
}
// @media (prefers-color-scheme: dark) {
//   body {
//     background-color: #000;
//     color: #aaa;
//   }
// }
</style>
