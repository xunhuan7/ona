<template>
  <el-container style="height: 100vh">
    <el-aside width="200px">
      <el-menu
        :router="true"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        default-active="user"
      >
        <el-menu-item index="user">
          <i class="el-icon-tableware" />
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="blog">
          <i class="el-icon-cold-drink" />
          <span slot="title">文章管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            首页
          </el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <span style="font-family: 'Zhi Mang Xing', cursive;font-size: 30px">
          行远自迩，登高自卑。凭文载道，以歌咏志。
        </span>
        <el-dropdown
          trigger="click"
          @command="handleCommand"
        >
          <span class="avatar">
            <el-avatar
              shape="square"
              src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item
              divided
              command="logOut"
            >
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Message } from 'element-ui';
import * as userApi from '../api/user';

export default {
  name: 'Layout',
  data() {
    return {};
  },
  methods: {
    handleCommand(command) {
      this[command]();
    },
    logOut() {
      const loading = this.$loading({
        lock: true,
        text: '正在进行操作',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        //  TODO: 删除本地cookie
      });
      setTimeout(() => {
        loading.close();
        this.$router.push('/login');
      }, 2000);
    },
  },
};
</script>

<style scoped lang="less">
  .el-menu {
    border: none;
  }

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    color: #333;

    .avatar:hover {
      cursor: pointer;
    }
  }

  .el-aside {
    background-color: #545c64
  }
</style>
