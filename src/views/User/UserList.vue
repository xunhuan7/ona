<template>
  <div class="view">
    <el-table :data="users.list" border>
      <el-table-column prop="created_at" label="注册时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.created_at | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称"/>
      <el-table-column prop="email" label="邮箱地址"/>
      <el-table-column prop="role" label="权限" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.role === 'admin'" size="small" type="danger">
            管理员
          </el-tag>
          <el-tag v-if="scope.row.role === 'editor'" size="small" type="success">
            编辑
          </el-tag>
          <el-tag v-if="scope.row.role === 'ghost'" size="small" type="info">
            游客
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_limited" label="是否正常" width="200">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.role === 'admin'">无权操作</el-tag>
          <el-switch
            v-else
            :value="scope.row.is_limited === undefined ? true : !scope.row.is_limited"
            @change="scope.row.role !== 'admin' && changeUserLimited($event,scope.row)"
            :disabled="scope.row.role === 'admin'"
            active-text="正常"
            inactive-text="被禁用"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <el-image shape="square" style="width: 60px; height: 60px" fit="contain"
                    :src="scope.row.avatar"
                    :preview-src-list="[scope.row.avatar]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="权限分配">
        <template slot-scope="scope">
          <el-button v-if="scope.row.role === 'editor'" size="mini" type="success"
                     @click="changeUserRole(scope.row,'ghost')">
            贬
          </el-button>
          <el-button v-if="scope.row.role === 'ghost'" size="mini" type="warning"
                     @click="changeUserRole(scope.row,'editor')">
            擢升
          </el-button>
          <el-tag type="danger" v-if="scope.row.role === 'admin'">无权操作</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="users.page" :page-sizes="[1, 2, 4]"
                   :page-size="users.page_size"
                   :total="users.count" layout="total, sizes, prev, pager, next, jumper"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
  import { Message } from 'element-ui';
  import * as userApi from '../../api/user';

  export default {
    name: 'UserList',
    data() {
      return {
        users: {},
      };
    },
    created() {
      this.getUserList({ page_size: 1 });
    },
    methods: {
      getUserList(params) {
        const loading = this.$loading({
          lock: true,
          text: '正在获取用户列表数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        userApi.getUserList(params)
          .then((res) => {
            this.users = res.data;
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      changeUserLimited($event, user) {
        const loading = this.$loading({
          lock: true,
          text: '正在修改用户激活状态...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        userApi.putUser(user._id, {
          is_limited: !user.is_limited,
        })
          .then(() => {
            this.$notify({
              title: '操作成功',
              message: '用户激活状态修改成功',
              type: 'success'
            });
            this.getUserList({
              page: this.users.page,
              page_size: this.users.page_size,
            });
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      changeUserRole(user, role) {
        const loading = this.$loading({
          lock: true,
          text: '正在修改用户权限...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        userApi.putUser(user._id, { role })
          .then(() => {
            this.$notify({
              title: '操作成功',
              message: '用户权限修改成功',
              type: 'success'
            });
            this.getUserList({
              page: this.users.page,
              page_size: this.users.page_size,
            });
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      handleCurrentChange(page) {
        const { page_size } = this.users;
        this.getUserList({
          page,
          page_size,
        });
      },
      handleSizeChange(page_size) {
        this.getUserList({
          page: 1,
          page_size,
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .view {
    padding: 20px;
  }
</style>
