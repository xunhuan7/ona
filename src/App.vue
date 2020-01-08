<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
  * {
    font-family: 'ZCOOL XiaoWei', sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    min-width: 100vw;
    min-height: 100vh;
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 8px rgba(0, 0, 0, .04);
    z-index: 100;
  }

  .el-drawer__body {
    overflow: auto;
  }

  .ql-container.ql-snow {
    margin: 50px auto 0 auto;
    padding: 30px;
    max-width: 1000px;
    border: none;
    box-shadow: 0 2px 4px rgba(83, 83, 83, 0.12), 0 0 8px rgba(133, 133, 133, 0.04);

    h1, h2, h3, h4, h5, h6 {
      margin-bottom: .5em;
    }

    p, blockquote, li {
      margin-bottom: .5em;
      line-height: 1.5;
      color: #313131;
      font-size: 15px;
    }

    pre {
      margin-bottom: .5em;
      line-height: 1.5;
      background-color: #f2f2f2;
      font-size: 14px;
    }
  }

  .ql-toolbar.ql-snow {
    position: sticky;
    top: 45px;
    border: none;
    background-color: #ededed;
    z-index: 10;
  }
</style>
