// utils/http.js
// 
const axios = require('axios')
axios.interceptors.response.use(res => {
    // console.log('999res.data--', res.data)
    return res.data;
})
/**
 * 获取模版列表
 * @return Promise
*/
async function getRepoList(){
    return axios.get('https://api.github.com/orgs/peach-cli-organization/repos')
}
/**
 * 获取版本信息
 * @param {string} repo 模版名称
 * 
*/
async function getTagList(repo){
    return axios.get(`https://api.github.com/repos/peach-cli-organization/${repo}/tags`)
}

module.exports = {
    getRepoList,
    getTagList
}

