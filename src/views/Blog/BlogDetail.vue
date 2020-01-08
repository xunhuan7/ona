<template>
  <div class="view">
    <div class="publish-bar">
      <el-button type="warning" size="mini" @click="publish('draft')">存草稿</el-button>
      <el-button type="success" size="mini" @click="publish('published')">发布</el-button>
    </div>
    <el-tooltip class="item" effect="dark" content="编辑文章基本项" placement="left-start">
      <el-button type="primary" icon="el-icon-edit" circle @click="()=>{this.drawer = true}"
                 style="position: fixed;right: 40px;bottom:100px;z-index: 10"></el-button>
    </el-tooltip>
    <el-drawer title="文章基本数据" :visible.sync="drawer" direction="rtl" size="40%"
               :wrapperClosable="false">
      <el-form :model="blog" label-position="top" ref="createForm" size="mini"
               style="padding: 20px 40px;">
        <el-form-item label="创建时间">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ blog.created_at | formatTime }}</span>
        </el-form-item>
        <el-form-item label="修改时间">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ blog.updated_at | formatTime }}</span>
        </el-form-item>
        <el-form-item label="文章作者">
          <span>{{ blog.creator.nickname }}</span>
        </el-form-item>
        <el-form-item label="文章头图">
          <el-upload drag action="http://localhost:3000/file/upload"
                     :multiple="false" :with-credentials="true"
                     :before-upload="beforeImageUpload"
                     :on-error="uploadImageFailed" :on-success="uploadImageSuccess">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="头图预览" required>
          <el-image :src="blog.head_photo" placeholder="暂无头图..." fit="cover"
                    style="width: 340px;height: 200px" :preview-src-list="[blog.head_photo]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-form-item>
        <el-form-item label="文章标题" prop="title" required>
          <el-input v-model="blog.title"></el-input>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary" required>
          <el-input v-model="blog.summary" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="文章标签" prop="tags">
          <el-select v-model="blog.tags" multiple filterable allow-create default-first-option
                     placeholder="请选择文章标签">
            <el-option v-for="item in allTags" :key="item._id" :label="item.tag"
                       :value="item.tag">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评分(由管理员评定)">
          <el-rate v-model="blog.weight" :max="3" :disabled="me.role !== 'admin'"></el-rate>
        </el-form-item>
        <el-form-item label="置顶(由管理员评定)">
          <template slot-scope="scope">
            <el-switch
              :value="blog.stick === undefined ? true : blog.stick"
              @change="me.role === 'admin' && changeBlogSort($event,blog)"
              :disabled="me.role !== 'admin'"
              active-color="#13ce66"
              inactive-color="#dfdfdf">
            </el-switch>
          </template>
        </el-form-item>
        <el-divider></el-divider>
        <p>存草稿或发布时统一保存基本数据</p>
      </el-form>
    </el-drawer>
    <div v-loading="editorUploadImageLoading">
      <el-form :model="blog" label-position="top" size="mini">
        <el-form-item required>
          <quill-editor v-model="blog.content" ref="quillEditor"
                        :options="editorOption"></quill-editor>
        </el-form-item>
      </el-form>
    </div>
    <el-upload style="display: none" action="http://localhost:3000/file/upload"
               :multiple="false" :with-credentials="true"
               :before-upload="beforeEditorImageUpload"
               :on-error="uploadImageFailed" :on-success="uploadEditorImageSuccess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" id="editor-upload-image">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
    </el-upload>
    <el-backtop target=".el-main"></el-backtop>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import hljs from 'highlight.js';
  import * as blogApi from '../../api/blog';
  import * as tagApi from '../../api/tag';

  export default {
    name: 'BlogDetail',
    data() {
      return {
        allTags: [],
        blog: {
          creator: { nickname: '' },
          nickname: '',
          head_photo: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
        },
        drawer: false,
        editorOption: {
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image', 'video'],
              ]
            },
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            },
            imageDrop: true,
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              modules: ['Resize', 'DisplaySize', 'Toolbar']
            },
          },
          theme: 'snow'
        },
        addImgRange: null,
        editorUploadImageLoading: false
      };
    },
    computed: {
      ...mapState(['me']),
    },
    created() {
      this.getTagList();
      this.getBlogDetail();
    },
    mounted() {
      this.bindUploadTrigger();
    },
    methods: {
      getTagList() {
        tagApi.getTagList()
          .then((res) => {
            this.allTags = res.data.list;
          });
      },
      getBlogDetail() {
        const loading = this.$loading({
          lock: true,
          text: '正在加载文章数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        blogApi.getBlogDetail(this.$route.params.id)
          .then((res) => {
            this.blog = res.data;
            setTimeout(() => loading.close(), 200);
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      changeBlogSort($event, blog) {
        const loading = this.$loading({
          lock: true,
          text: '正在加载文章数据...',
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
            setTimeout(() => loading.close(), 200);
            this.getBlogDetail();
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      beforeImageUpload(file) {
        const isRequiredType = (file.type === 'image/jpeg' || file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isRequiredType) {
          this.$message.warning('图片只能是 JPG、JPEG 或 PNG 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.warning('图片大小不能超过 2MB!');
          return false;
        }
        return isRequiredType && isLt2M;
      },
      uploadImageFailed(err) {
        console.log(err);
        this.editorUploadImageLoading = false;
        this.$notify.error({
          title: '发生错误',
          message: '图片上传失败!'
        });
      },
      uploadImageSuccess(res) {
        this.blog['head_photo'] = 'http://q3p4uf2cq.bkt.clouddn.com/' + res.data.key;
        this.$notify({
          title: '操作成功',
          message: res.message,
          type: 'success'
        });
      },
      bindUploadTrigger() {
        const vm = this;
        this.$refs.quillEditor.quill
          .getModule('toolbar')
          .addHandler('image', async function (image) {
            vm.addImgRange = vm.$refs.quillEditor.quill.getSelection();
            if (image) {
              const fileInput = document.getElementById('editor-upload-image');
              fileInput.click();
            }
          });
      },
      beforeEditorImageUpload(file) {
        this.editorUploadImageLoading = true;
        const isRequiredType = (file.type === 'image/jpeg' || file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isRequiredType) {
          this.$message.warning('图片只能是 JPG、JPEG 或 PNG 格式!');
          this.editorUploadImageLoading = false;
          return false;
        }
        if (!isLt2M) {
          this.$message.warning('图片大小不能超过 2MB!');
          this.editorUploadImageLoading = false;
          return false;
        }
        return isRequiredType && isLt2M;
      },
      uploadEditorImageSuccess(res) {
        this.editorUploadImageLoading = false;
        const imageSource = 'http://q3p4uf2cq.bkt.clouddn.com/' + res.data.key;
        this.$refs.quillEditor.quill.insertEmbed(this.addImgRange != null ? this.addImgRange.index : 0, 'image', imageSource);
      },
      publish(status) {
        const { head_photo, title, summary, content, tags, weight, stick } = this.blog;
        const loading = this.$loading({
          lock: true,
          text: '正在保存文章数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        blogApi.updateBlogById(this.blog._id, {
          head_photo,
          title,
          summary,
          content,
          tags,
          weight,
          stick,
          status
        })
          .then(() => {
            this.$notify({
              title: '操作成功',
              message: '文章保存成功',
              type: 'success'
            });
            setTimeout(() => loading.close(), 200);
            this.getBlogDetail();
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-select {
    display: block;
  }

  .publish-bar {
    position: sticky;
    z-index: 10;
    top: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 45px;
    padding: 0 20px;
    background-image: linear-gradient(90deg, rgb(32, 182, 249), rgb(32, 182, 249) 0px, rgb(33, 120, 241) 100%, rgb(33, 120, 241) 0px);
  }
</style>
