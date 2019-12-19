<template>
   <div class="app-container">
    <el-row>
      <el-button
        type="primary"
        icon="el-icon-document-add"
        size="medium"
        style="float:right;margin-right:30px;"
        @click="dialogCreateEvent = true"
      >添加新事件</el-button>
    </el-row>

    <el-table v-loading="listLoading" :data="list" style="width: 100%" stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline>
            <el-form-item label="名称" class="table-form">
              <span>{{ scope.row.name }}</span>
            </el-form-item>

            <el-form-item label="备注说明" class="table-form">
              <span>{{ scope.row.comment }}</span>
            </el-form-item>

            <el-form-item label="申请人ID" class="table-form">
              <span>{{ scope.row.proposerId }}</span>
            </el-form-item>

            <el-form-item label="申请人" class="table-form">
              <span>{{ scope.row.proposerName || "管理员" }}</span>
            </el-form-item>

            <el-form-item label="申请日期" class="table-form">
              <span>{{ scope.row.proposerDay }}</span>
            </el-form-item>

            <el-form-item label="日期" class="table-form">
              <span>{{ scope.row.day }}</span>
            </el-form-item>

            <el-form-item label="节数" class="table-form">
              <span>{{ scope.row.time }}</span>
            </el-form-item>

            <el-form-item label="地点" class="table-form">
              <span>{{ scope.row.roomId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="名称" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申请人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.proposerName || "管理员"}}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.day }}</span>
        </template>
      </el-table-column>

      <el-table-column label="节数" align="center">
        <template slot-scope="scope">
          <span>{{"第" + scope.row.time + "节课"}}</span>
        </template>
      </el-table-column>

      <el-table-column label="地点" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.situation == 0">未审核</el-tag>
          <el-tag type="success" v-if="scope.row.situation == 1">审核通过</el-tag>
          <el-tag type="danger" v-if="scope.row.situation == 2">审核不通过</el-tag>
          <el-tag type="info" v-if="scope.row.situation == 3">已过期</el-tag>
          <el-tag type="warning" v-if="scope.row.situation == 4">已取消</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center"  width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.situation == 0">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-check"
              @click="pass(scope.row.id)"
            >通过</el-button>

            <el-button
              type="danger"
              size="mini"
              icon="el-icon-circle-close"
              @click="notPass(scope.row.id)"
            >不通过</el-button>
          </div>

          <div v-else-if="scope.row.situation == 1">
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-delete"
              @click="cancel(scope.row.id)"
            >取消</el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新建事件" :visible.sync="dialogCreateEvent" :center="true" width="50%">
      <el-form :model="eventForm" label-position="right" :rules="rules" ref="eventForm">
        <el-form-item label="名称"label-width="150px" prop="name">
          <el-input v-model="eventForm.name" maxlength="10" style="width: 500px"></el-input>
        </el-form-item>

        <el-form-item label="备注" label-width="150px" prop="comment">
          <el-input v-model="eventForm.comment" type="textarea" maxlength="100" style="width: 500px"></el-input>
        </el-form-item>

        <el-form-item label="地点" prop="roomId" label-width="150px">
          <el-select v-model="eventForm.buildId" placeholder="所在教学楼" style="width: 150px;" align="center" @change="getRoom">
            <el-option v-for="eachBuild in eachBuilds" :label="eachBuild.name" :value="eachBuild.id"></el-option>
          </el-select>

          <el-select v-model="eventForm.roomId" placeholder="教室" style="width: 150px;" align="center">
            <el-option v-for="eachClassroom in eachClassrooms" :label="eachClassroom.roomId" :value="eachClassroom.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间" label-width="150px" prop="day">
          <el-date-picker
            v-model="eventForm.day"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="节数" label-width="150px" prop="time">
          <el-select v-model="eventForm.time" multiple placeholder="请选择">
            <el-option label="第一节" :value="1"></el-option>
            <el-option label="第二节" :value="2"></el-option>
            <el-option label="第三节" :value="3"></el-option>
            <el-option label="第四节" :value="4"></el-option>
            <el-option label="第五节" :value="5"></el-option>
            <el-option label="第六节" :value="6"></el-option>
            <el-option label="第七节" :value="7"></el-option>
            <el-option label="第八节" :value="8"></el-option>
            <el-option label="第九节" :value="9"></el-option>
            <el-option label="第十节" :value="10"></el-option>
            <el-option label="第十一节" :value="11"></el-option>
            <el-option label="第十二节" :value="12"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateEvent = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
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
import { getList, createEvent, eventPass, eventNotPass, eventCancel } from "@/api/event";
import { queryBuild } from "@/api/build";
import { getRoomList } from "@/api/classroom";

export default {
  components: { Pagination },
  data() {
    return {
      list:[],

      dialogCreateEvent: false,
      eventForm:{
        name:'',
        comment:'',
        buildId: '',
        roomId: '',
        day: '',
        time: []
      },
      eachBuilds:[],
      eachClassrooms:[],

      rules:{
        name: { required: true, message: '请输入名称', trigger: 'blur' },
        roomId: { required: true, message: '请选择地点', trigger: 'change' },
        day: { required: true, message: '请选择日期', trigger: 'blur' },
        time: { required: true, message: '请输入节次', trigger: 'blur' },
      },

      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
    }
  },

  created() {
    queryBuild().then(res => {
      this.eachBuilds = res.data;
    })
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true;
      getList(this.listQuery).then(res => {
        if (res.code == 0){
          console.log(res.data.records)
          this.list = res.data.records;
          this.total = res.data.total;
          this.listLoading = false;
        }
        else{
          this.$message({
            message: '系统异常',
            type: "error"
          })
        }
      })
    },

    getRoom(){
      this.eventForm.roomId='';
      getRoomList(this.eventForm.buildId).then(res => {
        if (res.code == 0){
          this.eachClassrooms = res.data;
        }
        else{
          this.$message({
            message: "系统异常",
            type: 'warning'
          })
        }
      })
    },

    create(){
      this.$refs["eventForm"].validate((valid) => {
        if (valid) {
          var eventDate={
            name: this.eventForm.name,
            comment: this.eventForm.comment,
            proposerId: "admin",
            roomId: this.eventForm.roomId,
            day: this.eventForm.day,
            time: this.eventForm.time.toString()
          }
          createEvent(eventDate).then(res => {
            if(res.code == 0){
              this.getList();
              this.dialogCreateEvent = false;
              this.$refs["eventForm"].resetFields();
              this.$message({
                message: '添加成功',
                type: "success"
              })
            }
            else {
              this.dialogCreateEvent = false;
              this.$message({
                message: '添加失败, 该时间段被占用',
                type: "warning"
              })
            }
          })
        }
        else{
          console.log("errorSubmit")
        }
      })
    },

    pass(id){
      eventPass(id).then(res => {
        if (res.code == 0) {
          this.getList();
          this.$message({
            message: "审核通过",
            type: "success"
          })
        }
        else {
          this.$message({
            message: res.msg,
            type: "warning"
          })
        }
      })
    },

    notPass(id){
      eventNotPass(id).then(res => {
        if (res.code == 0) {
          this.getList();
          this.$message({
            message: "已拒绝事件",
            type: "success"
          })
        }
        else {
          this.$message({
            message: res.msg,
            type: "warning"
          })
        }
      })
    },

    cancel(id){
      eventCancel(id).then(res => {
        if (res.code == 0) {
          this.getList();
          this.$message({
            message: "已取消",
            type: "success"
          })
        }
        else {
          this.$message({
            message: res.msg,
            type: "warning"
          })
        }
      })
    }
  }
}
</script>

<style>
.table-form {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>