<template>
  <div>
    <div class="container-fluid">
      <el-row class="spannel_list" :gutter="10">
        <el-col :sm="6" :xs="24">
          <el-card>
            <i class="el-icon-news"></i>
            <div>
              <b>文章总数</b>
              <count-to :start-val="0" :end-val="postCount" :duration="2600" class="card-panel-num" />
            </div>
          </el-card>
        </el-col>
        <el-col :sm="6" :xs="24">
          <el-card>
            <i class="el-icon-connection"></i>
            <div>
              <b>分类总数</b>
              <count-to :start-val="0" :end-val="cateCount" :duration="2600" class="card-panel-num" />
            </div>
          </el-card>
        </el-col>
        <el-col :sm="6" :xs="24">
          <el-card>
            <i class="el-icon-chat-dot-square"></i>
            <div>
              <b>评论总数</b>
              <count-to :start-val="0" :end-val="commentCount" :duration="2600" class="card-panel-num" />
            </div>
          </el-card>
        </el-col>
        <el-col :sm="6" :xs="24">
          <el-card>
            <i class="el-icon-data-line"></i>
            <div>
              <b>博客存活时间</b>
              <count-to :start-val="0" :end-val="postCount" :duration="2600" class="card-panel-num" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="container-fluid">
      <el-row class="curve-pie" :gutter="10">
        <el-col :sm="24" :xs="24">
          <div class="gragh_pannel" id="curve_show"></div>
        </el-col>
      </el-row>
    </div>
    <div class="container-fluid">
      <el-row class="curve-pie" :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="gragh_pannel" id="pie_show"></div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <div class="column_pannel" id="column_show"></div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <div class="column_pannel" id="ze_show"></div>
        </el-col>
      </el-row>
    </div>
    <div class="container-fluid">
      <div class="gragh_pannel" id="column1_show"></div>
    </div>
  </div>
</template>

<script>
import { getPostCount, getCateCount, getCommentCount } from '@/api'
import CountTo from 'vue-count-to'
// echarts内部用的是命名导出 export const 变量名 多个
import * as echarts from 'echarts'
// import resize from './mixins/resize'
// 在这里获取不到真实DOM，得在组件的mounted周期获取
export default {
  name: 'my-home',
  data () {
    return {
      postCount: 0,
      cateCount: 0,
      commentCount: 0
    }
  },
  components: {
    CountTo
  },
  created () {
    this.initAllCount()
  },
  mounted () {
    this.initCurveFn()
    this.picChartFn()
    this.columnChartFn()
    this.zeChartFn()
    this.botChartFn()
  },
  methods: {
    // 初始化面积图
    initCurveFn () {
      // 基于准备好的dom，初始化echarts实例

      // const animationDuration = 3000
      const curveChart = echarts.init(document.getElementById('curve_show'))
      // 绘制图表
      // 数据源(模拟后台返回的数据)

      const expectedData = [100, 120, 161, 134, 105, 160, 165]
      const actualData = [120, 82, 91, 154, 162, 140, 145]
      curveChart.setOption({
        // mixins: [resize],
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [{
          name: 'expected',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'actual',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
      // curveChart.setOption({
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'cross',
      //       label: {
      //         backgroundColor: '#6a7985'
      //       }
      //     }
      //   },
      //   legend: {
      //     data: ['Email', 'Video Ads', 'Direct', 'Search Engine']
      //   },
      //   toolbox: {
      //     feature: {
      //       saveAsImage: {}
      //     }
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: [
      //     {
      //       type: 'category',
      //       boundaryGap: false,
      //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value'
      //     }
      //   ],
      //   series: [
      //     {
      //       name: 'Email',
      //       type: 'line',
      //       stack: 'Total',
      //       areaStyle: {},
      //       emphasis: {
      //         focus: 'series'
      //       },
      //       data: [120, 132, 101, 134, 90, 230, 210]
      //     },
      //     {
      //       name: 'Union Ads',
      //       type: 'line',
      //       stack: 'Total',
      //       areaStyle: {},
      //       emphasis: {
      //         focus: 'series'
      //       },
      //       data: [220, 182, 191, 234, 290, 330, 310]
      //     },
      //     {
      //       name: 'Search Engine',
      //       type: 'line',
      //       stack: 'Total',
      //       label: {
      //         show: true,
      //         position: 'top'
      //       },
      //       areaStyle: {},
      //       emphasis: {
      //         focus: 'series'
      //       },
      //       data: [820, 932, 901, 934, 1290, 1330, 1320]
      //     }
      //   ]
      // })
    },
    picChartFn () {
      const pieChart = echarts.init(document.getElementById('pie_show'))
      pieChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: 'Sales', max: 10000 },
            { name: 'Administration', max: 20000 },
            { name: 'Information Technology', max: 20000 },
            { name: 'Customer Support', max: 20000 },
            { name: 'Development', max: 20000 },
            { name: 'Marketing', max: 20000 }
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Allocated Budget', 'Expected Spending', 'Actual Spending']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: 'Allocated Budget'
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: 'Expected Spending'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: 'Actual Spending'
            }
          ],
          animationDuration: 3000
        }]
      })
    },
    columnChartFn () {
      const columnChart = echarts.init(document.getElementById('column_show'))
      columnChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    zeChartFn () {
      const animationDuration = 6000

      const zeChart = echarts.init(document.getElementById('ze_show'))
      zeChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: 'pageA',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [79, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageB',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageC',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 52, 200, 334, 390, 330, 220],
          animationDuration
        }]
      })
    },
    botChartFn () {
      const botChart = echarts.init(document.getElementById('column1_show'))
      botChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: 'Email',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: 'Search Engine',
            type: 'bar',
            data: [862, 1018, 964, 1026, 1679, 1600, 1570],
            emphasis: {
              focus: 'series'
            },
            markLine: {
              lineStyle: {
                type: 'dashed'
              },
              data: [[{ type: 'min' }, { type: 'max' }]]
            }
          },
          {
            name: 'Baidu',
            type: 'bar',
            barWidth: 5,
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: [620, 732, 701, 734, 1090, 1130, 1120]
          },
          {
            name: 'Google',
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 290, 230, 220]
          },
          {
            name: 'Bing',
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: [60, 72, 71, 74, 190, 130, 110]
          },
          {
            name: 'Others',
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: [62, 82, 91, 84, 109, 110, 120]
          }
        ]
      })
    },
    async initAllCount () {
      const { data: post } = await getPostCount()
      const { data: cate } = await getCateCount()
      const { data: comment } = await getCommentCount()
      if (post.status !== 200) return this.$message.error(post.message)
      if (cate.status !== 200) return this.$message.error(cate.message)
      if (cate.status !== 200) return this.$message.error(comment.message)
      this.postCount = post.data
      this.cateCount = cate.data
      this.commentCount = comment.data.commentCount
    }
  }
}

</script>

<style lang="less" scoped>
.spannel_list {
  margin-top: 20px;
}

.spannel {
  height: 100px;
  overflow: hidden;
  text-align: center;
  position: relative;
  background-color: #fff;
  border: 1px solid #e7e7e9;
  margin-bottom: 20px;
}

.spannel em {
  font-style: normal;
  font-size: 50px;
  line-height: 50px;
  display: inline-block;
  margin: 10px 0 0 20px;
  font-family: 'Arial';
  color: #83a2ed;
}

.spannel span {
  font-size: 14px;
  display: inline-block;
  color: #83a2ed;
  margin-left: 10px;
}

.spannel b {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  line-height: 24px;
  background: #e5e5e5;
  color: #333;
  font-size: 14px;
  font-weight: normal;
}

.scolor01 em,
.scolor01 span {
  color: #6ac6e2;
}

.scolor02 em,
.scolor02 span {
  color: #5fd9de;
}

.scolor03 em,
.scolor03 span {
  color: #58d88e;
}

.gragh_pannel {
  height: 500px;
  border: 1px solid #e7e7e9;
  background-color: #fff !important;
  margin-bottom: 20px;
}
.sales_pannel {
  width: 542px;
  height: 300%;
}
.column_pannel {
  margin-bottom: 20px;
  height: 400px;
  border: 1px solid #e7e7e9;
  background-color: #fff !important;
}

.el-card {
  margin:0 20px;
  margin-bottom: 32px;
}

::v-deep .el-card__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  i {
    font-size: 48px;
  }
  b {
      color: rgba(0,0,0,.45);
      font-size: 16px;
      font-weight: 700;
  }
  .card-panel-num {
    color: #666;
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    margin: 20px 0 10px 0;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
