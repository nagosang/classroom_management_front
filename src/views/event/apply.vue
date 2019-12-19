<template>
  <div class="app-container" >
    <div style="width: 50%;margin:0 auto;">
      <el-form :model="eventForm" label-position="right" :rules="rules" ref="eventForm">
        <div class="title-container">
          <h3 class="title">申请借用教室</h3>
        </div>
        
        <el-form-item label="名称"label-width="150px" prop="name">
          <el-input v-model="eventForm.name" maxlength="10" style="width: 500px"></el-input>
        </el-form-item>

        <el-form-item label="备注" label-width="150px" prop="comment">
          <el-input v-model="eventForm.comment" type="textarea" maxlength="100" style="width: 500px"></el-input>
        </el-form-item>

        <el-form-item label="申请人学号/工号"label-width="150px" prop=".proposerId">
          <el-input v-model="eventForm.proposerId" maxlength="10" style="width: 500px"></el-input>
        </el-form-item>

        <el-form-item label="申请人姓名"label-width="150px" prop="proposerName">
          <el-input v-model="eventForm.proposerName" maxlength="10" style="width: 500px"></el-input>
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

        <el-form-item label-width="150px">
          <el-button type="primary" @click="create">申请</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { createEvent } from "@/api/event";
import { queryBuild } from "@/api/build";
import { getRoomList } from "@/api/classroom";

export default {
  data() {
    return {
      eventForm:{
        name:'',
        comment:'',
        buildId: '',
        roomId: '',
        day: '',
        time: [],
        proposerId: '',
        proposerName: '',
      },
      eachBuilds:[],
      eachClassrooms:[],

      rules:{
        name: { required: true, message: '请输入名称', trigger: 'blur' },
        roomId: { required: true, message: '请选择地点', trigger: 'change' },
        day: { required: true, message: '请选择日期', trigger: 'blur' },
        time: { required: true, message: '请输入节次', trigger: 'blur' },
        proposerId: { required: true, message: '不能为空', trigger: 'blur' },
        proposerName: { required: true, message: '不能为空', trigger: 'blur' },
      },
    }
  },

  created() {
    queryBuild().then(res => {
      this.eachBuilds = res.data;
    })
  },

  methods: {
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
            time: this.eventForm.time.toString(),
            proposerId: this.eventForm.proposerId,
            proposerName: this.eventForm.proposerName
          }
          createEvent(eventDate).then(res => {
            if(res.code == 0){
              this.$refs["eventForm"].resetFields();
              this.$message({
                message: '申请成功',
                type: "success"
              })
            }
            else {
              this.dialogCreateEvent = false;
              this.$message({
                message: '申请失败, 该时间段被占用',
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
.table-form {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.app-container{
  width: 100%;
}

.title-container {
  position: relative;
}

.title {
  font-size: 26px;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: bold;
}
</style>