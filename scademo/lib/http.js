// lib/http.js
// 
const axios = require('axios')
axios.interceptors.response.use(res => {
    console.log('@@@@@res--', res)
    return res.data;
})
/**
 * 获取模版列表
 * @return Promise
*/
async function getRepoList(){
    return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}
/**
 * 获取版本信息
 * @param {string} repo 模版名称
 * 
*/
async function getTagList(repo){
   return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
    getRepoList,
    getTagList
}

