<template>
  <div class="view">
    <div class="form-wrapper">
      <div class="title">
        行远自迩，登高自卑
      </div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        status-icon
      >
        <el-form-item prop="email">
          <el-input
            v-model="ruleForm.email"
            name="email"
            type="text"
            autocomplete="on"
            placeholder="Email"
            @keyup.enter.prevent.native="submitForm"
          >
            <template slot="prepend">
              <i class="el-icon-lollipop" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            name="password"
            type="password"
            autocomplete="on"
            placeholder="Password"
            @keyup.enter.prevent.native="submitForm"
          >
            <template slot="prepend">
              <i class="el-icon-hot-water" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="disabled"
            type="primary"
            @click.prevent="submitForm"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import * as userApi from '../../api/user';

export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        email: '',
        password: '',
      },
      rules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
      disabled: false,
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.disabled = true;
          userApi.logIn(this.ruleForm)
            .then((res) => {
              Message({
                type: 'success',
                showClose: true,
                message: res.message,
              });
              this.disabled = false;
              this.$router.push('/user');
            })
            .catch(() => {
              this.disabled = false;
            });
        }
        return false;
      });
    },
  },
};
</script>

<style scoped lang="less">
  .view {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("https://lin-xin.gitee.io/example/work/static/img/login-bg.e2134055.jpg") 0 0 / cover no-repeat;
  }

  .form-wrapper {
    width: 370px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.3);

    .title {
      display: flex;
      justify-content: center;
      padding: 20px 0;
      border-bottom: 1px solid #ddd;
      color: #fff;
      font-size: 20px;
    }

    .el-form {
      padding: 30px;

      & /deep/ .el-input-group__prepend {
        border: none;
      }

      & /deep/ .el-input__inner {
        border: none;
      }
    }
  }

  .el-button {
    width: 100%;
  }
</style>
