<template>
  <div class="app-container">
    <!-- 工具条 -->
    <el-row>
      <div class="search-box" style="width: 100%">
        <el-select v-model="buildId" placeholder="所在教学楼" @change="getList(buildId)" style="width: 150px;" align="center">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="eachBuild in eachBuilds" :label="eachBuild.name" :value="eachBuild.id"></el-option>
        </el-select>
      <el-button
        type="primary"
        icon="el-icon-document-add"
        size="medium"
        style="float:right;margin-right:30px;"
        @click="addClassroom"
      >添加教室</el-button>
      </div>
    </el-row>

    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" stripe>

      <el-table-column type="index" width="80" align="center">
      </el-table-column>

      <el-table-column label="所在教学楼" width="100" align="center">
        <template slot-scope="scope">
          <span v-for="eachBuild in eachBuilds" v-if="scope.row.buildId == eachBuild.id">{{ eachBuild.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所在楼层" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.floor }}</span>
        </template>
      </el-table-column>

      <el-table-column label="教室" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="当前状态" width="250" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.time == null">当前无课</el-tag>
          <el-tag v-else>{{ scope.row.courseName || '当前有课' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="拥有的设备" align="center">
        <template slot-scope="scope">
          <el-button
          size="mini"
          icon="el-icon-info"
          @click="equipmentDialog(scope.row)">
            查看设备
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="mod(scope.row)"
          >修改</el-button>

          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="del(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="管理设备" :visible.sync="dialogEquipmentManage" :center="true" width="30%">
      <el-form :model="equipmentForm" label-position="right">
        <el-form-item
        v-for="eachEquipment in equipmentData"
        :label="eachEquipment.equipment"
        label-width="150px">
          <el-input type="number" v-model.number="eachEquipment.number" @input="change($event)" style="width:150px">
            <span slot="append">{{ eachEquipment.unit }}</span>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEquipmentManage = false">取 消</el-button>
        <el-button type="primary" @click="saveEquipemt()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加教室" :visible.sync="dialogAddClassroom" :center="true" width="30%">
      <el-form :model="addClassroomForm" label-position="right" :rules="rules" ref="addClassroomForm">
        <el-form-item label="教室编号" prop="roomId" label-width="150px">
          <el-input v-model="addClassroomForm.roomId" type="text" style="width: 150px" maxlength="10"></el-input>
        </el-form-item>

        <el-form-item label="所在教学楼" prop="buildId" label-width="150px">
          <el-select v-model="addClassroomForm.buildId" placeholder="所在教学楼" style="width: 150px;" align="center">
            <el-option v-for="eachBuild in eachBuilds" :label="eachBuild.name" :value="eachBuild.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在楼层" prop="floor" label-width="150px">
          <el-input-number v-model="addClassroomForm.floor":min="-1" :max="10" style="width: 150px" @change="floorChange"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddClassroom = false; getList(buildId)">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改教室信息" :visible.sync="dialogUpdateClassroom" :center="true" width="30%">
      <el-form :model="updateClassroomForm" label-position="right" :rules="rules" ref="updateClassroomForm">
        <el-form-item label="教室编号" prop="roomId" label-width="150px">
          <el-input v-model="updateClassroomForm.roomId" type="text" style="width: 150px" maxlength="10"></el-input>
        </el-form-item>

        <el-form-item label="所在教学楼" prop="buildId" label-width="150px">
          <el-select v-model="updateClassroomForm.buildId" placeholder="所在教学楼" style="width: 150px;" align="center">
            <el-option v-for="eachBuild in eachBuilds" :label="eachBuild.name" :value="eachBuild.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在楼层" prop="floor" label-width="150px">
          <el-input-number v-model="updateClassroomForm.floor":min="-1" :max="10" style="width: 150px" @change="floorChange"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateClassroom = false; getList(buildId)">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
      style="text-align:center"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { queryByPage, createRoom, delRoom, updateRoom, updateEquipment } from "@/api/classroom";
import { queryBuild } from "@/api/build";
import { getEquipmentList } from "@/api/equipment";
import { getCourseName } from "@/api/course"
import { type } from 'os';

export default {
  components: { Pagination },
  data() {
    var id = 0;
    return {
      buildId: null,
      eachBuilds:[],
      
      tableData: [{}],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },

      dialogEquipmentManage: false,
      equipmentData: {},

      status: '',
      equipmentForm: {
      },

      dialogAddClassroom: false,
      addClassroomForm:{
        roomId: '',
        buildId: '',
        floor: 0
      },

      dialogUpdateClassroom: false,
      updateClassroomForm:{
        id: 0,
        roomId:'',
        buildId:'',
        floor:0
      },

      rules: {
        roomId: { required: true, message: '请输入教室编号', trigger: 'blur' },
        buildId:  { required: true, message: '请选择所在教学楼', trigger: 'change' }
      }
    };
  },
  created() {
    queryBuild().then(res => {
      this.eachBuilds = res.data;
    })
    getEquipmentList().then(res => {
      if(res.code == 0){
        this.equipmentData = res.data;
      }
      else{
        this.$message({
          message: '系统异常',
          type: 'warning'
        });
      }
    })
    this.getList("");
  },
  methods: {
    getList(build_id) {
      this.listLoading = true;
      var str = '';
      if (this.buildId == null) {
        str = '{"page":' + this.listQuery.page + ',"limit":' + this.listQuery.limit + ',"buildId":""}';
      }
      else {
        str = '{"page":' + this.listQuery.page + ',"limit":' + this.listQuery.limit + ',"buildId":"' + this.buildId + '"}';
      }
      var searchData = JSON.parse(str)
      queryByPage(searchData).then(res => {
        if(res.code == 0){
          this.tableData = res.data.records;
          this.tableData.forEach(item => {
            if(typeof(item.time) != 'undefined'){
              getCourseName(item.courseId).then(res => {
                if(res.code == 0){
                  item.courseName = res.name;
                }
                else{
                  this.$message({
                    message: '系统异常',
                    type: 'warning'
                  });
                }
              })
            }
          })
          this.total = res.data.total;
          this.listLoading = false;
        }
        else{
          this.$message({
            message: '系统异常',
            type: 'warning'
          });
        }
      })
    },

    equipmentDialog(row){
      var e = JSON.parse(row.equipment);
      this.dialogEquipmentManage = true;
      this.equipmentData.forEach(item => {
        if(typeof(e[item.id]) != 'undefined'){
          item.number = e[item.id];
        }
        else {
          item.number = 0;
        }
      })
      this.id = row.id;
    },

    change(e){
      e = Math.abs(parseInt(e));
      this.$forceUpdate();
    },

    addClassroom(){
      this.dialogAddClassroom = true;
      this.addClassroomForm={
        roomId: '',
        buildId: '',
        floor: 0
      }
    },

    floorChange(){
      this.addClassroomForm.floor = Math.floor(this.addClassroomForm.floor)
    },

    add(){
      this.$refs["addClassroomForm"].validate((valid) => {
        if (valid) {
          createRoom(this.addClassroomForm).then(res => {
            if(res.code == 0){
              this.dialogAddClassroom = false;
              this.getList(this.buildId);
              this.$message({
                message: '添加成功',
                type: 'success'
              });
            }
            else{
              this.$message({
                message: '添加失败' + res.msg,
                type: 'warning'
              });
            }
          })
        }
        else{
          console.log("errorSubmit");
        }
      })
    },

    del(id){
      this.$confirm("确认删除该记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delRoom(id).then(res =>{
          if(res.code == 0){
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList(this.buildId);
          }
          else{
            this.$message({
              message: '删除失败'+res.msg,
              type: "warning"
            })
          }
        })
      })
    },

    mod(row){
      this.updateClassroomForm = row;
      this.dialogUpdateClassroom = true;
    },

    update(){
      this.$refs["updateClassroomForm"].validate((valid) => {
        if (valid){
          updateRoom(this.updateClassroomForm).then(res => {
            if(res.code == 0){
              this.dialogUpdateClassroom = false;
              this.$message({
                message:"修改成功",
                type: "success"
              })
              this.getList(this.buildId);
            }
            else{
              this.dialogUpdateClassroom = false;
              this.$message({
                message:"修改失败",
                type: "warning"
              })
              this.getList(this.buildId);
            }
          })
        }
        else{
          console.log("errorSubmit");
        }
      })
    },

    saveEquipemt(){
      this.equipmentData.forEach(item => {
        item.number = Math.abs(parseInt(item.number));
      })
      var newData = this.equipmentData.filter(function(item){
        return item.number != 0;
      })
      updateEquipment(newData,this.id).then(res => {
        if(res.code == 0){
          this.dialogEquipmentManage = false;
          this.$message({
            message: "修改成功",
            type: "success"
          })
          this.getList(this.buildId);
        }
        else{
          this.dialogEquipmentManage = false;
          this.$message({
            message: "修改失败",
            type: "warning"
          })
        }
      })
    }
  }
}
</script>

<style scoped>
@import url("../../styles/views/dataprovider.css");
.link-type{
  color: black;
}
</style>