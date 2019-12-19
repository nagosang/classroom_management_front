<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item command="test">修改密码</el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="40%">
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="验证当前密码"></el-step>
        <el-step title="设置新密码"></el-step>
      </el-steps>
      
      <el-form v-show="active == 0" :model="check" label-position="right">
        <el-form-item label="请验证密码" label-width="120px" style="margin:10px">
          <el-input
          v-model="check.password"
          type="password"
          placeholder="请验证密码"
          name="password"
          tabindex="1"
          />
        </el-form-item>
      </el-form>

      <el-form v-show="active == 1" :model="newPwd" label-position="right" :rules="rules" ref="newPwd">
        <el-form-item label="设置新密码" label-width="120px" style="margin:20px" prop="newPassword">
          <el-input
          v-model="newPwd.newPassword"
          type="password"
          placeholder="设置新密码"
          />
        </el-form-item>

        <el-form-item label="重复密码" label-width="120px" style="margin:20px" prop="rePassword">
          <el-input
          v-model="newPwd.rePassword"
          type="password"
          placeholder="重复密码"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="active == 0" @click="next">下一步</el-button>
        <el-button type="primary" v-else @click="update">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { removeToken, getToken } from '@/utils/auth'
import { login } from "@/api/login"
import { changePwd } from "@/api/admin"

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data(){
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 18) {
        callback(new Error("密码长度不小于6或不大于18"));
      } else {
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.newPwd.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return{
      dialogVisible: false,
      active:0,
      check:{
        password:'',
      },
      newPwd:{
        newPassword:'',
        rePassword:'',
      },
      rules:{
        newPassword:[{ required: true, trigger: "blur", validator: validatePassword }],
        rePassword:[{ required: true, trigger: "blur", validator: validateRePassword }],
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // await this.$store.dispatch('user/logout')
      removeToken();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },

    handleCommand(command) {
      this.dialogVisible = true;
      this.check={
        password:'',
      }
      if (this.$refs["newPwd"]!==undefined) {
        this.$refs["newPwd"].resetFields();
      }
    },

    next(){
      var text = '{"admin":"'+ getToken() +'","password":"'+this.check.password+'"}'
      var data = JSON.parse(text)
      login(data).then(res => {
        if(res.code == 0) {
          this.active = 1
        }
        else{
          this.$message({
            message: '密码不正确',
            type: "warning"
          })
        }
      })
    },

    update(){
      this.$refs["newPwd"].validate((valid) => {
        if (valid) {
          var data={
            admin: getToken(),
            password: this.check.password,
            newPassword: this.newPwd.newPassword
          }
          changePwd(data).then(res => {
            if (res.code == 0){
              this.dialogVisible = false;
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }
            else{
              this.$message({
                message: '修改失败',
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!');
        }
      });
    },

    cancel(){
      this.dialogVisible = false;
      this.check={
        password:'',
      }
      if (this.$refs["newPwd"]!==undefined) {
        this.$refs["newPwd"].resetFields();
      }
      this.active = 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
