<template>
  <div class="app-container">
    <el-row>
      <el-button
        type="primary"
        icon="el-icon-document-add"
        size="medium"
        style="float:right;margin-right:30px;"
        @click="dialogCreateEquipment=true"
      >添加新设备</el-button>
    </el-row>

    <el-table v-loading="listLoading" :data="list" style="width: 100%" stripe>
      <el-table-column type="index" width="100" align="center">
      </el-table-column>

      <el-table-column label="设备名称" width="150" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-if="modList[scope.$index].mod" v-model="modList[scope.$index].modEquipment" maxlength="10"></el-input>
          <span v-else>{{ scope.row.equipment }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备备注" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-if="modList[scope.$index].mod" v-model="modList[scope.$index].modComment" maxlength="50"></el-input>
          <span v-else>{{ scope.row.equipmentComment }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备单位" width="100" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-if="modList[scope.$index].mod" v-model="modList[scope.$index].modUnit"></el-input>
          <span v-else>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="modList[scope.$index].mod"
            type="success"
            size="mini"
            icon="el-icon-edit"
            @click="update(scope.$index)"
          >保存</el-button>

          <el-button
            v-else
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="modList[scope.$index].mod = true"
          >修改</el-button>

          <el-button
            v-if="modList[scope.$index].mod"
            size="mini"
            icon="el-icon-error"
            @click="cancel(scope.$index)"
          >取消</el-button>

          <el-button
            v-else
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="del(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加设备" :visible.sync="dialogCreateEquipment" :center="true" width="40%">
      <el-form :model="createEquipmentForm" label-position="right" ref="createEquipmentForm" :rules="rules">
        <el-form-item label="设备名称" prop="equipment" label-width="100px">
          <el-input v-model="createEquipmentForm.equipment" type="text" maxlength="10"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="comment" label-width="100px">
          <el-input v-model="createEquipmentForm.comment" type="textarea" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="单位" prop="unit" label-width="100px">
          <el-input v-model="createEquipmentForm.unit" type="text" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateEquipment=false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>

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
import { queryByPage, updateEquipment, deleteEquipment, createEquipment } from "@/api/equipment";
import { type } from 'os';

export default {
  components: { Pagination },
  data(){
    return {
      listLoading:false,
      list:[],
      modList:[
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
        {
          modEquipment: '',
          mod: false,
          modComment: '',
          modUnit: ''
        },
      ],

      dialogCreateEquipment: false,
      createEquipmentForm:{
        equipment: '',
        comment: '',
        unit: ''
      },

      total:0,
      listQuery:{
        page: 1,
        limit: 10
      },

      rules: {
        equipment: { required: true, message: '设备名称不能为空', trigger: 'blur' },
        unit: { required: true, message: '设备单位不能为空', trigger: 'blur' },
      }
    }
  },

  created() {
    this.getList();
  },

  methods: {
    getList(){
      this.listLoading = true;
      queryByPage(this.listQuery).then(res => {
        if(res.code == 0){
          this.list = res.data.records
          this.total = res.data.total
          this.list.forEach((item, index) => {
            this.modList[index].modEquipment = item.equipment;
            this.modList[index].mod = false;
            this.modList[index].modComment = item.equipmentComment;
            this.modList[index].modUnit = item.unit;
          })
          this.listLoading = false;
        }
        else{
          this.$message({
            message: '加载失败',
            type: "warning"
          })
        }
      })
    },

    update(index){
      var data={
        id: this.list[index].id,
        equipment: this.modList[index].modEquipment,
        comment: this.modList[index].modComment,
        unit: this.modList[index].modUnit
      }
      if(data.equipment != '' && data.unit != '') {
        updateEquipment(data).then(res => {
          if(res.code == 0){
            this.getList();
            this.$message({
              message: '修改成功',
              type: "success"
            })
          }
          else{
            this.$message({
              message: '修改失败',
              type: "warning"
            })
          }
        })
      }
      else{
        this.$message({
          message: "设备名与设备单位不能为空",
          type: "warning"
        })
      }
    },

    cancel(index){
      this.modList[index].modEquipment = this.list[index].equipment;
      this.modList[index].mod = false;
      this.modList[index].modComment = this.list[index].equipmentComment;
      this.modList[index].modUnit = this.list[index].unit;
    },

    del(id){
      this.$confirm("确认删除该记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteEquipment(id).then(res => {
          if(res.code == 0){
            this.getList()
            this.$message({
              message: "删除成功",
              type: "success"
            })
          }
          else{
            this.message({
              message: "删除失败",
              type: 'warning'
            })
          }
        })
      })
    },

    create(){
      this.$refs["createEquipmentForm"].validate((valid) => {
        if (valid){
          createEquipment(this.createEquipmentForm).then(res => {
            if (res.code == 0){
              this.createEquipmentForm = {
                equipment: '',
                comment: '',
                unit: ''
              }
              this.dialogCreateEquipment = false;
              this.getList()
              this.$message({
                message: '添加成功',
                type: "success"
              })
            }
            else {
              this.dialogCreateEquipment = false;
              this.getList()
              this.$message({
                message: '添加失败',
                type: "warning"
              })
            }
          })
        }
        else{
          console.log("errorSubmit")
        }
      })
    }
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-col .el-col-span{
  text-align: center;
}
.list-item{
  border-radius: 10px;
  border: 1px #409EFF solid;
  align-content: center;
  margin: 10px;
}
</style>