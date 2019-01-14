<template>
  <div class="hello">
    <h1>欢迎来到wugong发布管理系统</h1>
      <div class="top-container">
          <el-select v-model="selected" placeholder="请选择">
              <el-option
                      v-for="item in project"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
          </el-select>
          <el-button type="primary" @click="handleCreateBranch">创建分支</el-button>
          <img v-if="loadingBranch" class="loadingBranch" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547402653549&di=7af100875d9d454d4d1522c0be6d30be&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2F2964c767d5798be6c8f83739fb5689b9.gif" alt="">
          <div v-if="branch && branch.length > 0">请复制分支名进行开发：<span class="color-blue">{{branch}}</span></div>
      </div>
      <div class="middle-container">
          <el-button type="success" @click="handleSetPrepare">上预发布</el-button>
          <img v-if="loadingPrepare" class="loadingBranch" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547402653549&di=7af100875d9d454d4d1522c0be6d30be&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2F2964c767d5798be6c8f83739fb5689b9.gif" alt="">
          <span v-if="loadingPrepare"> 请稍等3分钟，需要拉取你的代码，重装依赖，编译打包 </span>
          <span v-if="!loadingPrepare && cookie"> 请使用cookie 为 {{cookie}},访问 http://118.24.193.194 </span>
      </div>
      <div class="bottom-container">
          <el-button type="info" @click="handleSetRegular">上正式环境</el-button>
          <img v-if="loadingRegular" class="loadingBranch" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547402653549&di=7af100875d9d454d4d1522c0be6d30be&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2F2964c767d5798be6c8f83739fb5689b9.gif" alt="">
          <span v-if="loadingRegular"> 请稍等1分钟，需要复制到正式环境 </span>
          <span v-if="regular && !loadingRegular">{{regular}}</span>
      </div>

      <el-dialog
              title="注意"
              :visible.sync="showPrepareDialog"
              width="30%"
              >
          <span>请确保已经把代码提交到{{branch}}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showPrepareDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmSetPrepare">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog
              title="注意"
              :visible.sync="showRegularDialog"
              width="30%"
      >
          <span>请确保预发已经验证，将会直接影响线上用户</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showRegularDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmSetRegular">确 定</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
    const axios = require('axios')
    export default {
        name: 'HelloWorld',
        data () {
            return {
                branch: '',
                cookie: '',
                regular: '',
                showPrepareDialog: false,
                showRegularDialog: false,
                loadingBranch: false,
                loadingPrepare: false,
                loadingRegular: false,
                selected: '',
                project: [{
                    value: '项目1 - wugong_project_1',
                    label: 'wugong_project_1'
                }],
            }
        },
        props: {
        },
        methods: {
            confirmSetPrepare() {
                this.showPrepareDialog = false;
                this.setPrepare()
            },
            confirmSetRegular() {
              this.showRegularDialog = false;
              this.setRegular()
            },
            async setPrepare() {
                if (!this.branch) {
                    this.$message({
                        message: '还没有新建分支，请先新建一条分支哦',
                        type: 'warning'
                    });
                    return
                }
                this.loadingPrepare = true;
                let config = {
                    method: 'post',
                    url: 'http://118.24.193.194:83/wugong_serve?method=set_prepare',
                    data: {
                        "project_name": "wugong_project_1",
                        "branch": this.branch,
                    },
                }
                try {
                    let result = (await axios(config)).data;
                    this.loadingPrepare = false;
                    if (!result || !result.success) {
                        this.$message({
                            message: result.message || '网络错误，请求失败',
                        });
                    }
                    if (result.data) {
                        this.loadingPrepare = false;
                        this.cookie = result.data.cookie;
                    }
                } catch (e) {
                    this.$message({
                        message: e.message || '网络错误，请求失败',
                    });
                }

            },
            async setRegular() {
                if (!this.branch) {
                    this.$message({
                        message: '还没有新建分支，请先新建一条分支哦',
                        type: 'warning'
                    });
                    return
                }
                this.loadingRegular = true;
                let config = {
                    method: 'post',
                    url: 'http://118.24.193.194:83/wugong_serve?method=set_regular',
                    data: {
                        "project_name": "wugong_project_1",
                        "branch": this.branch,
                    },
                }
                try {
                    let result = (await axios(config)).data;
                    this.loadingRegular = false;
                    if (!result || !result.success) {
                        this.$message({
                            message: result.message || '网络错误，请求失败',
                        });
                    }
                    this.regular = "已经部署到正式环境"
                } catch (e) {
                    this.$message({
                        message: e.message || '网络错误，请求失败',
                    });
                }

            },
            handleSetPrepare() {
                if (!this.branch || this.branch.length === 0) {
                    this.$message({
                        message: '还没有新建分支，请先新建一条分支哦',
                        type: 'warning'
                    });
                    return
                }
                this.showPrepareDialog = true;
            },
            handleSetRegular() {
                if (!this.branch || this.branch.length === 0) {
                    this.$message({
                        message: '还没有新建分支，请先新建一条分支哦',
                        type: 'warning'
                    });
                    return
                }
                this.showRegularDialog = true;
            },
            handleCreateBranch() {
                this.loadingBranch = true;
                this.branch = '';
                axios({
                    method: 'post',
                    url: 'http://118.24.193.194:83/wugong_serve?method=create_branch',
                    data: {
                        "project_name": "wugong_project_1"
                    },
                }).then((result) => {
                    result = result.data
                    console.log(result)
                    if (result && result.success) {
                        this.loadingBranch = false;
                        this.branch = result.data.branch
                    }
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .top-container {
        padding-top: 20px;
        padding-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loadingBranch {
        width: 50px;
        height: 50px;
    }
    .color-blue {
        color: dodgerblue;
    }
    .middle-container {
        padding-top: 20px;
        padding-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bottom-container {
        padding-top: 20px;
        padding-bottom: 20px;
    }
</style>
