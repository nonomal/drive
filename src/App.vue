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
  --login-border-color: #dcdfe6;
  --login-background-hover-color: #fff;
  --login-background-color: #ebeffe;
  --login-transparent-color: transparent;
  --login-box-shadow-color: rgba(0, 0, 0, 0.2);
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
    --file-background-color: #1a202c;

    --login-font-color: #aaa;
    --login-img-opacity: 0.5;
    --login-border-color: #fff;
    --login-background-color: #1a202c;
    --login-background-hover-color: #555;
    --login-transparent-color: #1a202c;
    --login-box-shadow-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
