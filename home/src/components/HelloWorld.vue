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

      <div class="divide-line"></div>

      <div class="cache-container">
          <div class="cache-item">
              <el-button type="primary" @click="handleCleanCache(1, 1)">清空强缓存</el-button>
              <img v-if="loadingCache1" class="loadingBranch" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547402653549&di=7af100875d9d454d4d1522c0be6d30be&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2F2964c767d5798be6c8f83739fb5689b9.gif" alt="">
              <span v-if="loadingCache1"> 请稍等1分钟，正在清空缓存 </span>
              <span v-if="cache1 && !loadingCache1">{{cache1}}</span>
          </div>

          <div class="cache-item">
              <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="cachePath">
              </el-input>
              <el-button type="primary" @click="handleCleanCache(2, 2)">清CDN缓存(按路径)</el-button>
              <img v-if="loadingCache2" class="loadingBranch" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547402653549&di=7af100875d9d454d4d1522c0be6d30be&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2F2964c767d5798be6c8f83739fb5689b9.gif" alt="">
              <span v-if="loadingCache2"> 请稍等30s </span>
              <span v-if="cache2 && !loadingCache2">{{cache2}}</span>
          </div>

          <div class="cache-item">
              <el-button type="primary" @click="handleCleanCache(1, 3)">清空协商缓存</el-button>
              <img v-if="loadingCache3" class="loadingBranch" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547402653549&di=7af100875d9d454d4d1522c0be6d30be&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2F2964c767d5798be6c8f83739fb5689b9.gif" alt="">
              <span v-if="loadingCache3"> 请稍等1分钟，正在清空缓存 </span>
              <span v-if="cache3 && !loadingCache3">{{cache3}}</span>
          </div>

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
    import {cleanCache} from '../api.js'
    export default {
        name: 'HelloWorld',
        data () {
            return {
                branch: '',
                cookie: '',
                regular: '',
                cache1: '',
                cache2: '',
                cache3: '',
                showPrepareDialog: false,
                showRegularDialog: false,
                loadingCache1: false,
                loadingCache2: false,
                loadingCache3: false,
                loadingBranch: false,
                loadingPrepare: false,
                loadingRegular: false,
                cachePath: '',
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
                    this.regular = "部署到正式, master合并"
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
            },
            setLoading(id, bool) {
                if (id === 1) {
                    this.loadingCache1 = bool;
                } else if (id === 2) {
                    this.loadingCache2 = bool;
                } else if (id === 3) {
                    this.loadingCache3 = bool;
                }
            },
            setCacheContent(id, content) {
                if (id === 1) {
                    this.cache1 = content;
                } else if (id === 2) {
                    this.cache2 = content;
                } else if (id === 3) {
                    this.cache3 = content;
                }
            },
            async handleCleanCache(type, id) {
                if (!type || !id) {
                    return
                }
                this.setLoading(id, true)
                try {
                    let param = {
                        type,
                        urls: ['http://www.bi15s.cn/wugong_project_2/'],
                    }
                    let result = (await cleanCache(param)).data;
                    if (!result || !result.success) {
                        this.$message({
                            message: result.message || '请求失败',
                            type: 'warning'
                        });
                        return
                    }

                    this.setLoading(id, false)
                    this.setCacheContent(id, '已清除，访问 http://www.bi15s.cn/wugong_project_2/ 吧')
                } catch (e) {
                    this.$message({
                        message: e.message || '请求失败',
                        type: 'warning'
                    });
                }
            },
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
    .divide-line {
        width: 100%;
        height: 1px;
        background-color: dodgerblue;
    }
    .cache-container {
        margin-top: 30px;
        width: 100%;
    }
    .cache-item {
        text-align: left;
        padding-left: 30px;
        padding-right: 30px;
        margin: 20px;
    }
</style>
