<template>
  <div class="user">
    <el-table
      v-loading="loading"
      :data="users.list"
      border
    >
      <el-table-column
        prop="created_at"
        label="注册时间"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.created_at | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用户昵称"
      />
      <el-table-column
        prop="email"
        label="邮箱地址"
      />
      <el-table-column
        prop="role"
        label="权限"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.role === 'admin'"
            size="small"
            type="danger"
          >
            管理员
          </el-tag>
          <el-tag
            v-if="scope.row.role === 'editor'"
            size="small"
            type="success"
          >
            编辑
          </el-tag>
          <el-tag
            v-if="scope.row.role === 'ghost'"
            size="small"
            type="info"
          >
            游客
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_limited"
        label="状态"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.is_limited === true"
            size="small"
            effect="plain"
            type="danger"
          >
            禁用
          </el-tag>
          <el-tag
            v-if="scope.row.is_limited === false"
            size="small"
            effect="plain"
            type="success"
          >
            正常
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="avatar"
        label="头像"
      >
        <template slot-scope="scope">
          <el-avatar
            shape="square"
            :src="scope.row.avatar"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.is_limited === true"
            size="mini"
            type="success"
            :disabled="scope.row.role === 'admin'"
            @click="scope.row.role !== 'admin' && changeUserLimited(scope.row)"
          >
            解禁
          </el-button>
          <el-button
            v-if="scope.row.is_limited === false"
            size="mini"
            type="danger"
            :disabled="scope.row.role === 'admin'"
            @click="scope.row.role !== 'admin' && changeUserLimited(scope.row)"
          >
            封禁
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="users.page"
      :page-sizes="[1, 2, 4]"
      :page-size="users.page_size"
      :total="users.count"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui';
import * as userApi from '../../api/user';

export default {
  name: 'User',
  data() {
    return {
      users: {},
      loading: false,
    };
  },
  created() {
    this.getUserList({ page_size: 1 });
  },
  methods: {
    getUserList(params) {
      this.loading = true;
      userApi.getUserList(params)
        .then((res) => {
          this.users = res.data;
        })
        .finally(() => this.loading = false);
    },
    changeUserLimited(user) {
      userApi.putUser(user._id, {
        is_limited: !user.is_limited,
      })
        .then(() => {
          this.getUserList({
            page: this.users.page,
            page_size: this.users.page_size,
          });
        });
    },
    handleCurrentChange(page) {
      this.loading = true;
      const { page_size } = this.users;
      this.getUserList({
        page,
        page_size,
      });
    },
    handleSizeChange(page_size) {
      this.loading = true;
      this.getUserList({
        page: 1,
        page_size,
      });
    },
  },
};
</script>

<style scoped lang="less">
  .el-pagination {
    margin-top: 14px;
  }
</style>
