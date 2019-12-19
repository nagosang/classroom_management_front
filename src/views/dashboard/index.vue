<template>
  <div class="dashboard-container" style="width: 100%">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <div class="dashboard-text">管理员端</div>
    <span>现在时间为：{{ time }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSystemTime} from '@/api/dashboard'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },

  data(){
    return {
      time: ''
    } 
  },
  created(){
    getSystemTime().then(response => {
      if(response.code == 0){
        this.time = response.time;
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
