<template>
  <div class="view">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
        <el-card shadow="hover">
          <div class="statistics-card">
            <svg class="icon" aria-hidden="true" style="font-size: 70px">
              <use xlink:href="#iconSmile"></use>
            </svg>
            <div>
              <h3>共计注册人数</h3>
              <h3 class="total-user-count">{{statistics.totalUserCount}}</h3>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
        <el-card shadow="hover">
          <div class="statistics-card">
            <svg class="icon" aria-hidden="true" style="font-size: 70px">
              <use xlink:href="#icondog1"></use>
            </svg>
            <div>
              <h3>SoupCraft成员</h3>
              <h3 class="total-editor-count">{{statistics.totalEditorCount}}</h3>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
        <el-card shadow="hover">
          <div class="statistics-card">
            <svg class="icon" aria-hidden="true" style="font-size: 70px">
              <use xlink:href="#iconBlog"></use>
            </svg>
            <div>
              <h3>共计发布文章</h3>
              <h3 class="total-published-blog-count">{{statistics.totalPublishedBlogCount}}</h3>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
        <el-card shadow="hover">
          <div class="statistics-card">
            <svg class="icon" aria-hidden="true" style="font-size: 70px">
              <use xlink:href="#iconblog"></use>
            </svg>
            <div>
              <h3>正在打磨的文章</h3>
              <h3 class="total-draft-blog-count">{{statistics.totalDraftBlogCount}}</h3>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :md="24" :lg="12">
        <el-card shadow="never">
          <div id="tag-blog-pie" style="width: 500px;height:300px;margin: auto;"></div>
        </el-card>
      </el-col>
      <el-col :md="24" :lg="12">
        <el-card shadow="never">
          <div id="member-blog-chart" style="width: 500px;height:300px;margin: auto;"></div>
        </el-card>
      </el-col>
    </el-row>
    <h1>
      用户过滤搜索功能
    </h1>
    <h1>
      接口文档补全
    </h1>
    <br>
    <h1>个人信息修改</h1>
    <h1>共有70次评论</h1>
    <h1>共有2000次浏览</h1>
    <h1>共收获了70个赞</h1>
    <h1>这是你使用SoupCraft的第30天</h1>
    <h1>功能：用户中心 分周统计发布的文章 您大概平均几周发一篇文章</h1>
    <br>
    <h1>历史记录（diff对比）</h1>
    <h1>侧边导航</h1>
    <h1>权限功能梳理</h1>
    <h1>平台发布：小程序 web||| 是否开启评论</h1>
    <h1>功能：备忘录</h1>
    <h1>功能：简历中心</h1>
    <h1>功能：发布文章邮件通知</h1>
  </div>
</template>

<script>
  import * as statisticsApi from '../../api/statistics';

  export default {
    name: 'Home',
    data() {
      return {
        statistics: {
          tagsBlog: []
        }
      };
    },
    created() {
      this.getHomeStatistics();
      // window.onresize = () => this.getHomeStatistics();
    },
    methods: {
      getHomeStatistics() {
        const loading = this.$loading({
          lock: true,
          text: '正在加载统计数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        statisticsApi.getHomeStatistics()
          .then((res) => {
            this.statistics = res.data;
            this.drawTagBlogPie();
            this.drawMemberBlogChart();
            setTimeout(() => loading.close(), 200);
          })
          .finally(() => setTimeout(() => loading.close(), 200));
      },
      drawTagBlogPie() {
        const seriesData = this.statistics.tagsBlog.filter(item => item.value > 0);
        const tagBlogPie = this.$echarts.init(document.getElementById('tag-blog-pie'), 'macarons');
        tagBlogPie.setOption({
          title: {
            text: '文章标签词云',
            left: 'center',
            textStyle: {
              color: '#313131',
              fontWeight: 'normal',
              fontFamily: '"ZCOOL XiaoWei", sans-serif'
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '共 {c} 篇 {b} 相关的文章',
            textStyle: {
              fontFamily: '"ZCOOL XiaoWei", serif'
            },
          },
          series: [{
            type: 'wordCloud',
            shape: 'cardioid',
            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.
            // maskImage: maskImage,
            left: 'center',
            top: 'center',
            right: null,
            bottom: null,
            sizeRange: [14, 60],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 15,
            drawOutOfBound: false,
            textStyle: {
              normal: {
                fontWeight: 'bold',
                color: function () {
                  return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') + ')';
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            data: seriesData
          }]
        });
      },
      drawMemberBlogChart() {
        const { xAxis, series } = this.statistics.membersBlog;
        const tagBlogPie = this.$echarts.init(document.getElementById('member-blog-chart'), 'macarons');
        tagBlogPie.setOption({
          title: {
            text: '成员发布文章情况',
            left: 'center',
            textStyle: {
              color: '#313131',
              fontWeight: 'normal',
              fontFamily: '"ZCOOL XiaoWei", sans-serif'
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} 贡献了 {c} 篇文章',
            textStyle: {
              fontFamily: '"ZCOOL XiaoWei", serif'
            },
          },
          xAxis: {
            type: 'category',
            data: xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: series,
            type: 'bar'
          }]
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .view {
    padding: 30px 20px;
    background-color: #f8f8f8;
  }

  .el-card {
    margin: 15px 20px 0 20px;
    padding: 0 20px;
  }

  .statistics-card {
    display: flex;
    justify-content: space-between;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-end;

      h3 {
        margin: 0;

        &:first-of-type {
          color: #8c8c8c;
        }

        /*&:last-of-type {*/
        /*  color: #656665;*/
        /*}*/
      }

      .total-user-count {
        color: #40c8c6;
      }

      .total-editor-count {
        color: #37a3f8;
      }

      .total-published-blog-count {
        color: #f4516b;
      }

      .total-draft-blog-count {
        color: #33bfa2;
      }
    }
  }

</style>
