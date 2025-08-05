import { clear } from 'echarts/types/src/util/throttle.js'
import {defineStore } from 'pinia'

export interface TableDataItem{
    id:number,
    name:string,
    age:number,
    sex:string,
    cost:number,
    month:number,
    address:string,
    checked:boolean
}
interface TableState{
    tableData:TableDataItem[]
}


export const useTableStore = defineStore('table', {
    state:():TableState =>({
        tableData : []
    }),
    actions:{
        setTableData(data:TableDataItem[]){
            this.tableData = data
        },
        addTableRow(item:TableDataItem){
            this.tableData.push(item)
        },
        clearTableData(){
            this.tableData = []
        },
    },
    getters:{
        //获取所有数据
        getTableData():TableDataItem[]{
            return this.tableData
        },
        getUserData:(state) =>(name:string):TableDataItem[]=>{
            return state.tableData.filter(item=>item.name === name)
        }
    }

})