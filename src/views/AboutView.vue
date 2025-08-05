<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
import { onMounted } from 'vue';
import { useTableStore } from '@/stores/tableStore'

const router = useRouter();
const fileInput = ref(null);
const selectAll = ref(false);
const tableStore = useTableStore();
//从pinia获取tableData
const tableData = ref([...tableStore.tableData]);

//页面加载时同步pinia数据到本地ref
onMounted(() =>{
  tableData.value = [...tableStore.tableData]
  // tableData.value = tableStore.tableData.map(item => ({ ...item, selected: false }))
})
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
//点击全选复选框就勾选所有行
const toggleSelectAll = (isChecked) => {
    tableData.value.forEach((item) => {
      item.selected = isChecked;
    });
};
//点击表格中的某一行复选框就勾选对应行
const toggleSelect = (item) => {
  item.checked = !item.checked;
};
// 导入 Excel
const triggerFileInput = () => fileInput.value.click();
const importExcel = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    tableData.value = jsonData; // 更新表格数据
    tableStore.setTableData(jsonData)//同步更新到pinia存储
  };
  reader.readAsArrayBuffer(file);
};

//批量导出 批量导出逻辑 复选框勾选哪一个点击批量导出按钮后就可以导出并在图表中显示
const exportToExcelBatch = () => { 
  const selectedRows = tableData.value.filter(item => item.checked);
  if(selectedRows.length === 0) return;
  // 定义字段映射关系
  const fieldMapping = {
    id: '编号',
    name: '姓名',
    age: '年龄',
    sex: '性别',
    cost: '花费',
    month: '月份'
  };
  const formattedData = selectedRows.map(row => ({
    id: row.id,
    name: row.name,
    age: row.age,
    sex: row.sex,
    cost: row.cost,
    month: row.month,
  }));

  // 定义输出的列顺序
  const headers = ['id', 'name', 'age', 'sex', 'cost', 'month'];
   // 转换数据并自定义表头  // 将整个数组转换为一个 sheet
  const ws = XLSX.utils.json_to_sheet(formattedData,{header:headers})
  // 设置工作表的列标题为中文
  headers.forEach((key, index) => {
    const colLetter = XLSX.utils.encode_col(index); // A, B, C...
    ws[`${colLetter}1`] = { t: 's', v: fieldMapping[key] }; // 修改表头
  });
  // 创建一个新的 Excel 工作簿
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //触发浏览器下载生成Excel文件
  XLSX.writeFile(wb, '批量导出.xlsx');
};
// 导出 Excel
const exportToExcel = () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(tableData.value);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, '个人信息.xlsx');
};
//批量导出图表
const gotoTablePageBatch = () =>{
  const selectedRows = tableData.value.filter(item => item.checked);
  router.push({
    path: '/table',
    state: { tableData: selectedRows }
  })
}
//导出图表
const gotoTablePage = () => {
  console.log('gotoTablePage 被点击')
  const formattedData = groupDataByName(tableData.value)
  console.log('formattedData:', formattedData)
  router.push({
    path: '/table',
    state: { tableData: formattedData }
  })
  console.log(formattedData.value)
}


</script>

<template>
  <!-- 导入 -->
  <input type="file" accept=".xlsx, .xls" @change="importExcel" ref="fileInput" style="display: none" />
   <button @click="triggerFileInput" class="import_btn">导入 Excel</button>

   <!-- 导出 -->
   <button @click="exportToExcelBatch" class="export_btn">批量 导出</button>
   <button @click="exportToExcel" class="export_btn">导出 Excel</button>
   <button @click="gotoTablePageBatch" class="export_btn">批量 导出图表</button>
   <button @click="gotoTablePage" class="export_btn">导出 图表</button>
   
   
   <!-- 显示数据 -->
    <div class="containter">
     <table class="box">
     <thead>
       <tr>
         <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll(selectAll)"></th>
         <th>编号</th>
         <th>姓名</th>
         <th>年龄</th>
         <th>性别</th>
         <th>花费</th>
         <th>月份</th>
         <th>地址</th>
       </tr>
     </thead>
     <tbody>
       <tr v-for="item in tableData" :key="item.id">
         <th><input type="checkbox" v-model="item.selected" @change="toggleSelect(item)"></th>
         <td>{{ item.id }}</td>
         <td>{{ item.name }}</td>
         <td>{{ item.age }}</td>
         <td>{{ item.sex }}</td>
         <td>{{ item.cost }}</td>
         <td>{{ item.month }}</td>
         <td>{{ item.address }}</td>
       </tr>
     </tbody>
   </table>
 </div>
</template>

<style scoped>
.containter{ 
  margin: 0 auto;
  text-align: center;
  margin-top: 20px;
  width: 800px;
  max-height: 80vh;
  overflow-x: auto;
  overflow-y: auto;
  min-height: auto;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.box{
  width: 100%;
  height: 100%;
  margin: 0 auto;
  flex-direction: column;
  min-width: 150px;
  border-collapse: collapse;
  border-radius: 15px;
}
.box thead{
  height: 40px;
  position: sticky;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
  top: 0;
  background-color: white;
}
.box td,th{
  height: 40px;
  border: 1px solid rgb(28, 25, 42);
}
button{
  background-color: #007BFF;
  color: white; 
  border-radius: 5px;
  width: 100px;
  height: 30px;
  margin-bottom: 10px;
}
.import_btn{
  margin-left: 10px;
  margin-right: 10px;
}
.export_btn{
  background-color: #007BFF;
  margin-right: 10px;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
</style>
