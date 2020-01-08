<template>
  <el-container style="height: 100vh">
    <el-aside width="auto">
      <router-link :to="{ path: '/'}"
                   :class="{'logo-container':true,'logo-container-collapse':isAsideCollapse}">
      </router-link>
      <el-menu background-color="#545c64" text-color="#fff" class="el-menu-vertical"
               active-text-color="#ffd04b" :default-active="defaultActive" :unique-opened="true"
               :collapse="isAsideCollapse" @select="selectNavigation">
        <el-menu-item index="/">
          <i class="el-icon-s-platform"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/blog">
          <i class="el-icon-notebook-1"></i>
          <span slot="title">文章</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <i class="el-icon-user"></i>
          <span slot="title">用户</span>
        </el-menu-item>
        <el-menu-item index="/document">
          <i class="el-icon-document"></i>
          <span slot="title">接口文档</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="breadcrumb-container">
          <el-link icon="el-icon-s-unfold" :underline="false" @click="collapseAside(false)"
                   v-if="isAsideCollapse"></el-link>
          <el-link icon="el-icon-s-fold" :underline="false" @click="collapseAside(true)"
                   v-else></el-link>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">
              <router-link v-if="item.url" :to="item.url">{{item.name}}</router-link>
              <a v-else>
                {{item.name}}
              </a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <span class="slogan hidden-md-and-down">
          行远自迩，登高自卑。凭文载道，以歌咏志。
        </span>
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="avatar">
            <el-avatar
              shape="square"
              :src="me.avatar"
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="pushToMe">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'Layout',
    data() {
      return {
        isAsideCollapse: false,
        defaultActive: ''
      };
    },
    computed: {
      ...mapState(['me']),
    },
    watch: {
      '$route': function () {
        const self = this;
        setTimeout(() => {
          self.highLight();
        }, 200);
      }
    },
    created() {
      this.highLight();
      this.$store.dispatch('getMe');
    },
    methods: {
      highLight() {
        const name = this.$route.name;
        switch (name) {
          case 'Home':
            this.defaultActive = '/';
            break;
          case 'BlogList':
          case 'BlogDetail':
            this.defaultActive = '/blog';
            break;
          case 'UserList':
            this.defaultActive = '/user';
            break;
          case 'Document':
            this.defaultActive = '/document';
            break;
          default:
            this.defaultActive = '404';
            break;
        }
      },
      collapseAside(status) {
        this.isAsideCollapse = status;
      },
      selectNavigation(path) {
        if (this.$route.path !== path) {
          this.$router.push(path);
        }
      },
      handleCommand(command) {
        this[command]();
      },
      pushToMe() {
        this.$router.push('/me');
      },
      logOut() {
        this.$cookies.remove('token');
        this.$cookies.remove('me');
        const loading = this.$loading({
          lock: true,
          text: '正在进行注销登出...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        setTimeout(() => {
          loading.close();
          this.$router.push('/login');
        }, 1200);
      },
    },
  };
</script>

<style scoped lang="less">
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 170px;
  }

  .logo-container {
    display: block;
    margin: auto;
    padding-top: 20px;
    width: 170px;
    height: 50px;
    background: url("https://summit-img.geekpark.net/ifx/her/soupcraft-logo--web-white-text.svg") 20% 20% ~"/" 80% auto no-repeat;
    background-origin: content-box;
    transition: all .2s;
  }

  .logo-container-collapse {
    width: 50px;
    background: url("https://summit-img.geekpark.net/ifx/her/soupcraft-logo--web-white-text.svg") 0 0 ~"/" 200px auto no-repeat;
    background-origin: content-box;
  }

  .el-aside {
    background-color: #545c64
  }

  .el-menu {
    border: none;
  }

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: content-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 8px rgba(0, 0, 0, .04);
    z-index: 10;
    color: #333;

    .breadcrumb-container {
      display: flex;
      align-items: center;

      .el-link {
        margin-right: 20px;
        font-size: 24px;
      }
    }

    .slogan {
      font-family: 'Zhi Mang Xing', cursive;
      font-size: 22px
    }

    .avatar:hover {
      cursor: pointer;
    }
  }

  .el-main {
    padding: 0;

    /deep/ .el-pagination {
      margin-top: 14px;
    }
  }
</style>
