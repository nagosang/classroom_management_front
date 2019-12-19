<template>
  <div class="app-container">
    <el-row>
      <el-button
        type="primary"
        icon="el-icon-document-add"
        size="medium"
        style="float:right;margin-right:30px;"
        @click="add"
      >添加教学楼</el-button>
    </el-row>

    <el-row :gutter="20" v-loading="loading">
      <el-col :span="6" v-for="(list,index) in listData" style="margin-top:30px">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix" style="height:30px">
            <div v-if="modData[index].mod">
              <el-input
                type="text"
                v-model="modData[index].modName"
                style="width: 150px"
                size="small"
                maxlength="15"
                show-word-limit
              >
              </el-input>
              <div style="float:right">
                <el-button type="primary" icon="el-icon-check" circle size="mini" @click="update(list.id, index)"></el-button>
                <el-button type="info" icon="el-icon-close" circle size="mini" @click="modData[index].mod = false;"></el-button>
              </div>
            </div>
            <div v-else>
              <span>{{ list.name }}</span>
              <el-button style="float: right; padding: 3px 0;color:red;margin-left:5px" type="text" @click="del(list.id)">删除</el-button>
              <el-button style="float: right; padding: 3px 0" type="text" @click="mod(index)">修改</el-button>
            </div>
          </div>
          <div class="text item">{{ '拥有教室：' + list.count + '间' }}</div>
          <div class="text item">备注:</div>
          <el-input
            v-if="modData[index].mod"
            type="textarea"
            v-model="modData[index].modNotes"
            maxlength="40"
            show-word-limit
          >
          </el-input>
          <div v-else class="text item">{{ list.notes }}</div>
        </el-card>
      </el-col>
      <el-col :span="6" style="margin-top:30px" v-if="ifUpdate && listQuery.page == parseInt(this.total/8) + 1">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix" style="height:30px">
            <el-input
              type="text"
              v-model="newBuild.name"
              style="width: 150px"
              size="small"
              maxlength="15"
              show-word-limit
            >
            </el-input>
            <div style="float:right">
              <el-button type="primary" icon="el-icon-check" circle size="mini" @click="addBuild"></el-button>
              <el-button type="info" icon="el-icon-close" circle size="mini" @click="cancelAdd"></el-button>
            </div>
          </div>
          <div class="text item">备注:</div>
          <el-input
            type="textarea"
            v-model="newBuild.notes"
            maxlength="40"
            show-word-limit
          >
          </el-input>
        </el-card>
      </el-col>
    </el-row>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      layout="total, prev, pager, next"
      @pagination="getList"
      style="text-align:center"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { queryList, updateBuild, createBuild, deleteBuild } from "@/api/build";
import { type } from 'os';

export default {
  components: { Pagination },
  data(){
    return{
      listData:[],
      loading:false,

      modData:[
        {
          modName: '',
          mod: false,
          modNotes: ''
        },
        {
          modName: '',
          mod: false,
          modNotes: ''
        },
        {
          modName: '',
          mod: false,
          modNotes: ''
        },
        {
          modName: '',
          mod: false,
          modNotes: ''
        },
        {
          modName: '',
          mod: false,
          modNotes: ''
        },
        {
          modName: '',
          mod: false,
          modNotes: ''
        },
        {
          modName: '',
          mod: false,
          modNotes: ''
        },
        {
          modName: '',
          mod: false,
          modNotes: ''
        },
      ],

      ifUpdate: false,
      newBuild:{
        name: '',
        notes: ''
      },

      total:0,
      listQuery:{
        page: 1,
        limit:8,
      }
    }
  },

  created(){
    this.getList()
  },

  methods: {
    getList(){
      this.loading = true
      this.ifUpdate = false
      queryList(this.listQuery.page).then(res => {
        if(res.code == 0){
          this.total = res.data.total;
          this.listData = res.data.records;
          this.loading = false;
        }
        else{
          this.$message({
            message: "系统异常",
            type: "warning"
          })
        }
        this.listData.forEach((item,index) => {
          this.modData[index].modName = item.name;
          this.modData[index].mod = false;
          this.modData[index].modNotes = item.notes;
        })
      })
    },

    mod(index){
      this.modData[index].mod = true;
      this.modData[index].modName = this.listData[index].name;
      this.modData[index].modNotes = this.listData[index].notes;
    },

    update(id, index){
      var data={
        id: 0,
        name: '',
        notes: ''
      }
      data.id = id;
      data.name = this.modData[index].modName;
      data.notes = this.modData[index].modNotes;
      if(data.name != '') {
        updateBuild(data).then(res => {
          if(res.code == 0){
            this.modData[index].mod = false;
            this.getList();
            this.$message({
              message: "修改成功",
              type: "success"
            })
          }
          else{
            this.$message({
              message: "修改失败",
              type: "warning"
            })
          }
        })
      }
      else{
        this.$message({
          message: "教学楼名称不能为空",
          type: 'warning'
        })
      }
    },

    add(){
      this.listQuery.page = parseInt(this.total/8) + 1;
      this.getList();
      this.newBuild.name=''
      this.newBuild.notes=''
      this.ifUpdate = true
    },

    cancelAdd(){
      this.ifUpdate = false;
      if(this.total%8 == 0){
        this.listQuery.page = parseInt(this.total/8);
      }
      else{
        this.listQuery.page = parseInt(this.total/8) + 1;
      }
      this.getList()
    },

    addBuild(){
      if(this.newBuild.name != ''){
        createBuild(this.newBuild).then(res => {
          if(res.code == 0){
            this.getList()
            this.$message({
              message: "添加成功",
              type: 'success'
            })
          }
          else{
            this.$message({
              message: "添加失败",
              type: 'warning'
            })
          }
        })
      }
      else{
        this.$message({
          message: "教学楼名称不能为空",
          type: 'warning'
        })
      }
    },

    del(id){
      this.$confirm("确认删除该记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteBuild(id).then(res =>{
          if(res.code == 0){
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            if((this.total-1)%8 == 0){
              this.listQuery.page = this.listQuery.page - 1;
            }
            this.getList();
          }
          else{
            this.$message({
              message: '删除失败'+res.msg,
              type: "warning"
            })
          }
        })
      })
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card{
  height: 250px;
}
</style>
