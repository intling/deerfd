<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useTableStore } from '@/stores/tableStore'

const tableStore = useTableStore()
const tableData = ref([...tableStore.tableData])
//将数据按照name进行分组
const groupDataByName = () => {
  const grouped = {}

  tableData.value.forEach(item => {
    const { name, month, cost } = item
    if (!grouped[name]) {
      grouped[name] = Array(12).fill(0) // 初始化 12 个月份
    }
    grouped[name][month - 1] = cost // 填入对应月份（注意索引从 0 开始）
  })

  return Object.keys(grouped).map(name => ({
    name: name,
    data: grouped[name]
  }))
}

onMounted(() => {
  console.log('tableData', tableData.value)
  const chartDom = document.getElementById('main')
  if (!chartDom) return
  const myChart = echarts.init(chartDom)
  const formattedData = groupDataByName(tableData.value)

  const option = {
    title: { text: '月花费趋势图' },
    tooltip: { trigger: 'axis' },
    legend: {
      data: tableData.value.map(item => item.name)
    },
    grid: { left: 30, right: 110, bottom: 30, containLabel: true },
    xAxis: {
      type: 'category',
      splitLine: { show: true },
      axisLabel: { margin: 30, fontSize: 16 },
      boundaryGap: false,
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    yAxis: {
      type: 'value',
      axisLabel: { margin: 30, fontSize: 16, formatter: '{value}' },
      inverse: false,
      interval: 1000,
      splitLine: { show: true },
      min: 0,
      max: 9000
    },
    series: formattedData.map(item => ({
      name: item.name,
      type: 'line',
      smooth: true,
      symbolSize: 20,
      emphasis: { focus: 'self' },
      endLabel: { show: true, formatter: '{a}', distance: 20 },
      lineStyle: { width: 4 },
      data: item.data,
    }))
  }

  myChart.setOption(option)
})
</script>

<template>
  <div id="main" style="width: 100%; height: 500px; margin: 0 auto;"></div>
</template>