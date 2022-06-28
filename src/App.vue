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
:root {
  --file-font-color: #000;
  --file-time-font-color: #000;
  --file-background-color: #fff;

  --login-img-opacity: 1;
  --login-font-color: #000;
  --login-background-color: #ebeffe;
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
@media (prefers-color-scheme: dark) {
  :root {
    --file-font-color: #000;
    --file-time-font-color: #000;
    --file-background-color: #fff;

    --login-font-color: #aaa;
    --login-img-opacity: 0.5;
    --login-border-color: #fff;
    --login-background-color: #000;
    --login-background-hover-color: #555;
    --login-box-shadow-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
