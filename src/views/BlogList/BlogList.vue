<template>
  <div class="user">
    <el-table
      v-loading="loading"
      :data="users.list"
      border
    >
      <el-table-column
        prop="created_at"
        label="创建时间"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.created_at | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="summary"
        label="摘要"
      />
      <el-table-column
        prop="weight"
        label="权重"
      >
        <template slot-scope="scope">
          <i
            v-for="item in scope.row.weight"
            class="el-icon-star-on"
          />
        </template>
      </el-table-column>
      <!--      <el-table-column prop="stick" label="是否置顶">-->
      <!--        <template slot-scope="scope">-->
      <!--         <span v-if="scope.row.stick">-->
      <!--           是-->
      <!--         </span>-->
      <!--          <span v-else>否</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="views" label="阅读次数"/>-->
      <!--      <el-table-column prop="likes" label="点赞次数"/>-->
      <el-table-column
        prop="status"
        label="文章状态"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status === 'draft'"
            size="small"
          >
            {{ scope.row.status }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'published'"
            size="small"
            type="success"
          >
            {{ scope.row.status }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'deleted'"
            size="small"
            type="danger"
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator.nickname"
        label="创建者"
      />
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
import * as blogApi from '../../api/blog';

export default {
  name: 'User',
  data() {
    return {
      users: {},
      loading: false,
    };
  },
  created() {
    this.getBlogList({ page_size: 1 });
  },
  methods: {
    getBlogList(params) {
      this.loading = true;
      blogApi.getBlogList(params)
        .then((res) => {
          this.users = res.data;
        })
        .finally(() => this.loading = false);
    },
    changeUserLimited(user) {
      blogApi.putUser(user._id, {
        is_limited: !user.is_limited,
      })
        .then(() => {
          this.getBlogList({
            page: this.users.page,
            page_size: this.users.page_size,
          });
        });
    },
    handleCurrentChange(page) {
      this.loading = true;
      const { page_size } = this.users;
      this.getBlogList({
        page,
        page_size,
      });
    },
    handleSizeChange(page_size) {
      this.loading = true;
      this.getBlogList({
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
