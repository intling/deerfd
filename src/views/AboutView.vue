<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";
import { onMounted } from "vue";
import { useTableStore } from "@/stores/tableStore";

// 定义表格数据项的类型
interface TableDataItem {
  id: number;
  name: string;
  age: number;
  sex: string;
  cost: number;
  month: number;
  address?: string;
  checked?: boolean; // 添加一个可选的属性用于复选框状态
}
const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);
const selectAll = ref(false);
const tableStore = useTableStore();
//从pinia获取tableData
const tableData = ref([...tableStore.tableData]);

//页面加载时同步pinia数据到本地ref
onMounted(() => {
  tableData.value = [...tableStore.tableData];
});
//将数据按照name进行分组
const groupDataByName = (data: TableDataItem[]) => {
  const grouped: Record<string, number[]> = {};

  data.forEach((item) => {
    const { name, month, cost } = item;
    if (!grouped[name]) {
      grouped[name] = Array(12).fill(0); // 初始化 12 个月份
    }
    grouped[name][month - 1] = cost; // 填入对应月份（注意索引从 0 开始）
  });

  return Object.keys(grouped).map((name) => ({
    name: name,
    data: grouped[name],
  }));
};
//点击全选复选框就勾选所有行
const toggleSelectAll = (isChecked: boolean) => {
  tableData.value.forEach((item) => {
    item.checked = isChecked;
  });
  //更新全选状态
  selectAll.value = isChecked;
};
//点击表格中的某一行复选框就勾选对应行
const toggleSelect = (item: TableDataItem) => {
  item.checked = !item.checked;
};
// 导入 Excel
const triggerFileInput = () => {
  if (fileInput.value) {
    // 触发文件输入框的点击事件
    fileInput.value.click();
  }
};
const importExcel = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0]; // 获取上传的文件
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result;
    if (result instanceof ArrayBuffer) {
      const data = new Uint8Array(result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = (XLSX.utils.sheet_to_json(firstSheet) as Partial<TableDataItem>[]).map(
        (item) => ({
          id: Number(item.id) || 0,
          name: String(item.name || ""),
          age: Number(item.age) || 0,
          sex: String(item.sex || ""),
          cost: Number(item.cost) || 0,
          month: Number(item.month) || 0,
          address: String(item.address || ""),
          checked: Boolean(item.checked) || false,
        })
      ) as TableDataItem[];

      tableData.value = jsonData; // 更新表格数据
      tableStore.setTableData(jsonData); // 同步更新到 pinia 存储
    } else {
      console.error("文件读取失败，数据格式不正确");
    }
  };
};

//批量导出 批量导出逻辑 复选框勾选哪一个点击批量导出按钮后就可以导出并在图表中显示
const exportToExcelBatch = () => {
  const selectedRows = tableData.value.filter((item) => item.checked);
  if (selectedRows.length === 0) return;
  const fieldMapping = {
    id: "编号",
    name: "姓名",
    age: "年龄",
    sex: "性别",
    cost: "花费",
    month: "月份",
  };
  const formattedData = selectedRows.map((row) => ({
    id: row.id,
    name: row.name,
    age: row.age,
    sex: row.sex,
    cost: row.cost,
    month: row.month,
  }));

  // 定义输出的列顺序
  const headers = ["id", "name", "age", "sex", "cost", "month"];
  // 转换数据并自定义表头  // 将整个数组转换为一个 sheet
  const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });
  // 设置工作表的列标题为中文
  headers.forEach((key, index) => {
    const colLetter = XLSX.utils.encode_col(index); // A, B, C...
    ws[`${colLetter}1`] = { t: "s", v: fieldMapping[key as keyof typeof fieldMapping] }; // 修改表头
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "批量导出.xlsx");
};
// 导出 Excel
const exportToExcel = () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(tableData.value);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "个人信息.xlsx");
};
//批量导出图表
const gotoTablePageBatch = () => {
  const selectedRows = tableData.value.filter((item) => item.checked);
  router.push({
    path: "/table",
    state: { tableData: selectedRows },
  });
};
//导出图表
const gotoTablePage = () => {
  console.log("gotoTablePage 被点击");
  const formattedData = groupDataByName(tableData.value);
  console.log("formattedData:", formattedData);
  router.push({
    path: "/table",
    state: { tableData: formattedData },
  });
  console.log(formattedData);
};
</script>

<template>
  <!-- 导入 -->
  <input
    type="file"
    accept=".xlsx, .xls"
    @change="importExcel"
    ref="fileInput"
    style="display: none"
  />
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
          <th>
            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll(selectAll)" />
          </th>
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
          <th><input type="checkbox" v-model="item.checked" @change="toggleSelect(item)" /></th>
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
.containter {
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
.box {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  flex-direction: column;
  min-width: 150px;
  border-collapse: collapse;
  border-radius: 15px;
}
.box thead {
  height: 40px;
  position: sticky;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
  top: 0;
  background-color: white;
}
.box td,
th {
  height: 40px;
  border: 1px solid rgb(28, 25, 42);
}
button {
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  width: 100px;
  height: 30px;
  margin-bottom: 10px;
}
.import_btn {
  margin-left: 10px;
  margin-right: 10px;
}
.export_btn {
  background-color: #007bff;
  margin-right: 10px;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
</style>
