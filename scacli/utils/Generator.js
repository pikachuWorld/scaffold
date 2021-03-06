// lib/Generator.js
const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer');
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo');
const chalk = require('chalk');

//开始添加动画

async function wrapLoading(fn, message, ...args){
    // console.log('---wrapLoading--', fn, '--message--',message,'-args-', ...args)
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // console.log('---spinner--', spinner)
    // 开始加载动画
    spinner.start();
    try{
        // 执行传入方法 fn
        const result = await fn(...args);
        // console.log('###try--result---', result)
        //  状态修改为成功
        spinner.succeed();
        return result;
    } catch(error){
        // 状态修为失败
       spinner.fail('Request fail, refetch ....', error)

    }

}

class Generator{
    constructor(name, targetDir){
        // console.log('----11Generator---', name, targetDir)
        // 目录名称
        this.name = name;
        // // 创建位置
        this.targetDir = targetDir;
        // 对 download-git-repo 进行 promise 化改造
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }
    // 获取用户选择的模板
    // 1）从远程拉取模板数据
    // 2）用户选择自己新下载的模板名称
    // 3）return 用户选择的名称
    async getRepo(){
        // 
        const repoList = await wrapLoading(getRepoList, 'wait fetch template')
        if(!repoList) return;
        const repos = repoList.map(item => item.name)
       
        const { repo } = await inquirer.prompt({
           name: 'repo',
           type: 'list',
           choices: repos,
           message: 'Please choose a template to create project' 
        })
        //
        return repo
    }
   // 获取用户选择的版本
  // 1）基于 repo 结果，远程拉取对应的 tag 列表
  // 2）用户选择自己需要下载的 tag
  // 3）return 用户选择的 tag

  async getTag(repo) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
    if (!tags) return;
    
    // 过滤我们需要的 tag 名称
    const tagsList = tags.map(item => item.name);

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Place choose a tag to create project'
    })

    // 3）return 用户选择的 tag
    return tag
  }
    // 下载远程模板
    // 1）拼接下载地址
    // 2）调用下载方法
    async download(repo, tag){
        // 1）拼接下载地址
        const requestUrl=`peach-cli-organization/${repo}${tag?'#'+tag:''}`;
      
        // // 2）调用下载方法
        await wrapLoading(
            this.downloadGitRepo, // 
            'waiting download template', // 
            requestUrl, //
            path.resolve(process.cwd(), this.targetDir) // 
        )
      
    }

    // 核心创建逻辑
    async create(){
       const repo = await this.getRepo()
    //    console.log('用户选择，repo=' + repo)
        // 2) 获取 tag 名称
        const tag = await this.getTag(repo)
            // 3）下载模板到模板目录
        await this.download(repo, tag)
        // console.log('create-----getloadRes', getloadRes)
        console.log('用户选择了，repo=' + repo + '，tag='+ tag)
        // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')

    }
}

module.exports = Generator;