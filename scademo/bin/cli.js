#! /usr/bin/env node

console.log('~~~~~ peach-cli working ~~~~~')
const program = require('commander')
const chalk = require('chalk');
var figlet = require('figlet');
program
//定义命令和参数
   .command('create <app-name>')
   .description('create a new project')
   .option('-f, --force', 'overwrite target directory if it exit')
   .action((name, options)=>{
       //
       console.log('name:', name, 'option:', options)
       require('../lib/create.js')(name, options)
   })

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')
// 

// 配置 config 命令

program
//定义命令和参数
   .command('config [value]')
   .description('inspect and modify the config')
   .option('-g, --get <path>', 'get value from option')
   .option('-s, --set <path> <value>')
   .option('-d, --delete <path>', 'delete option from config')
   .action((value, options)=>{
       //
       console.log(value, options)
       
})
// 配置 UI命令
program
//定义命令和参数
   .command('ui')
   .description('start add open roc-cli ui')
   .option('-p, --port <port>', 'Port used for the UI Server')
   .action((options)=>{
       //
       console.log(options)
       
})

program
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('peach song', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`pec <command> --help`)} show details\r\n`)
  })

  program.parse(process.argv)


