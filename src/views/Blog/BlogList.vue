<template>
  <div class="view">
    <el-form :inline="true" :model="searchForm" size="mini" style="float: left">
      <el-form-item>
        <el-input v-model="searchForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="文章状态" clearable>
          <el-option label="DRAFT" value="draft"></el-option>
          <el-option label="PUBLISHED" value="published"></el-option>
          <el-option label="DELETED" value="deleted"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.weight" placeholder="评分" clearable>
          <el-option label="普通一星" value="1"></el-option>
          <el-option label="荣耀二星" value="2"></el-option>
          <el-option label="无敌三星" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.creator" placeholder="作者" clearable>
          <el-option label="Jayden" value="1"></el-option>
          <el-option label="咽痛" value="2"></el-option>
          <el-option label="张玉珍" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchBlog">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button type="success" icon="el-icon-edit" size="mini" @click="createDialogVisible = true">
      创建
    </el-button>

    <!-- s: 新建文章弹窗表单 -->
    <el-dialog title="创建文章" :visible.sync="createDialogVisible" :close-on-click-modal="false"
               :close-on-press-escape="false" width="450px" class="create-dialog">
      <el-form :model="createForm" label-position="top" ref="createForm" size="mini"
               :rules="createRules">
        <el-form-item label="文章标题" prop="title" required>
          <el-input v-model="createForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary" required>
          <el-input v-model="createForm.summary" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="文章标签" prop="tags">
          <el-select v-model="createForm.tags" multiple filterable allow-create default-first-option
                     placeholder="请选择文章标签">
            <el-option v-for="item in allTags" :key="item._id" :label="item.tag"
                       :value="item.tag">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeCreateForm">取 消</el-button>
        <el-button type="primary" size="mini" @click="createBlog" :disabled="createSubmitDisabled">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- e: 新建文章弹窗表单 -->

    <el-table :data="users.list" border>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.created_at | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="250">
        <template slot-scope="scope">
          <h5>
            <el-link :underline="false" :href="`http://eboher.im/blog/${scope.row._id}`"
                     v-if="scope.row.status === 'published'"
                     target="_blank">
              {{scope.row.title}}
            </el-link>
            <template v-else>
              {{scope.row.title}}
            </template>
          </h5>
          <el-tag size="mini" v-for="(item,index) in scope.row.tags" :key="index">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="摘要" width="300"/>
      <el-table-column prop="weight" label="评分">
        <template slot-scope="scope">
          <i v-for="item in scope.row.weight" class="el-icon-star-on"
             style="color: #f7ba2a;font-size: 18px"></i>
        </template>
      </el-table-column>
      <el-table-column prop="stick" label="置顶">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.stick === undefined ? true : scope.row.stick"
            @change="me.role === 'admin' && changeBlogSort($event,scope.row)"
            :disabled="me.role !== 'admin'"
            active-color="#13ce66"
            inactive-color="#dfdfdf">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="阅读数"/>
      <el-table-column prop="likes" label="点赞数"/>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'draft'" size="mini" type="info">
            {{ scope.row.status | uppercase }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'published'" size="mini" type="success">
            {{ scope.row.status | uppercase}}
          </el-tag>
          <el-tag v-if="scope.row.status === 'deleted'" size="mini" type="danger">
            {{ scope.row.status | uppercase }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator.nickname" label="作者"/>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="$router.push(`/blog/${scope.row._id}`)">
            编辑
          </el-button>
          <el-button size="mini" type="success" v-if="scope.row.status!=='published'"
                     :disabled="me.role !== 'admin' && scope.row.creator !== me._id"
                     @click="(me.role === 'admin' || scope.row.creator === me._id) && changeBlogStatus(scope.row,'published')">
            发布
          </el-button>
          <el-button size="mini" v-if="scope.row.status!=='draft'"
                     :disabled="me.role !== 'admin' && scope.row.creator !== me._id"
                     @click="(me.role === 'admin' || scope.row.creator === me._id) && changeBlogStatus(scope.row,'draft')">
            草稿
          </el-button>
          <el-button size="mini" type="danger" v-if="scope.row.status!=='deleted'"
                     :disabled="me.role !== 'admin' && scope.row.creator !== me._id"
                     @click="(me.role === 'admin' || scope.row.creator === me._id) && changeBlogStatus(scope.row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="users.page" :page-sizes="[10, 20, 30]"
                   :page-size="users.page_size"
                   :total="users.count" layout="total, sizes, prev, pager, next, jumper"
                   @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import * as blogApi from '../../api/blog';
  import * as tagApi from '../../api/tag';

  export default {
    name: 'BlogList',
    data() {
      return {
        searchForm: {
          title: '',
          weight: undefined,
          status: '',
          creator: ''
        },
        createDialogVisible: false,
        createSubmitDisabled: false,
        allTags: [],
        createRules: {
          title: [
            {
              required: true,
              message: '请输入文章标题',
              trigger: 'blur',
            },
          ],
          summary: [
            {
              required: true,
              message: '请输入文章摘要',
              trigger: 'blur',
            },
          ],
        },
        createForm: {
          title: '',
          summary: '',
          tags: []
        },
        users: {},
      };
    },
    computed: {
      ...mapState(['me']),
    },
    created() {
      this.getBlogList({ page_size: 10 });
      this.getTagList();
    },
    methods: {
      searchBlog() {

      },
      createBlog() {
        this.$refs['createForm'].validate((valid) => {
          if (valid) {
            this.createSubmitDisabled = true;
            blogApi.createBlog(this.createForm)
              .then((res) => {
                this.$notify({
                  title: '操作成功',
                  message: res.message,
                  type: 'success'
                });
                this.createForm.title = '';
                this.createForm.summary = '';
                this.createForm.tags = [];
                this.closeCreateForm();
                this.getBlogList();
              })
              .finally(() => {
                this.createSubmitDisabled = false;
              });
          }
        });
      },
      closeCreateForm() {
        this.createSubmitDisabled = false;
        this.createDialogVisible = false;
        this.$refs['createForm'].clearValidate();
      },
      getTagList() {
        tagApi.getTagList()
          .then((res) => {
            this.allTags = res.data.list;
          });
      },
      getBlogList(params) {
        const loading = this.$loading({
          lock: true,
          text: '正在获取文章列表数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        blogApi.getBlogList(params)
          .then((res) => {
            this.users = res.data;
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      changeBlogStatus(blog, status) {
        if (blog.content === '' || blog.created_at === blog.updated_at) {
          this.$notify.warning({
            title: '警告',
            message: '文章内容还未进行补全，无法修改状态',
          });
          return true;
        }
        const { _id } = blog;
        const loading = this.$loading({
          lock: true,
          text: '正在修改文章发布状态...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        blogApi.updateBlogStatus(_id, { status })
          .then(() => {
            this.$notify({
              title: '操作成功',
              message: '文章状态修改成功',
              type: 'success'
            });
            this.getBlogList({
              page: this.users.page,
              page_size: this.users.page_size,
            });
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      changeBlogSort($event, blog) {
        const loading = this.$loading({
          lock: true,
          text: '正在修改文章置顶状态...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        blogApi.updateBlogStick(blog._id, { stick: !blog.stick })
          .then(() => {
            this.$notify({
              title: '操作成功',
              message: '文章状态置顶状态修改成功',
              type: 'success'
            });
            this.getBlogList({
              page: this.users.page,
              page_size: this.users.page_size,
            });
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      handleCurrentChange(page) {
        const { page_size } = this.users;
        this.getBlogList({
          page,
          page_size,
        });
      },
      handleSizeChange(page_size) {
        this.getBlogList({
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

  .create-dialog /deep/ .el-select {
    display: block;
  }

  .el-pagination {
    margin-top: 14px;
  }
</style>
