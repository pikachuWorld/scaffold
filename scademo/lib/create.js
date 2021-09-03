const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./Generator')
console.log('---create--Generator',Generator)
module.exports = async function(name, options){
    //
    console.log('>>>print create.js', name, options)
    // 执行创建命令
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir =path.join(cwd, name)
    console.log(cwd, '目录----', targetAir, fs.existsSync(targetAir))
    // 目录是否已经存在
    if(fs.existsSync(targetAir)){
        //
        // console.log('options.force---', options.force)
        if(options.force){
            await fs.remove(targetAir)

        }else{
            // 询问用户是否确定要覆盖
            let { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: 'Target directory already exists  Pick an actions:',
                    choices: [
                        {
                            name: 'Overwrite',
                            value: 'overwrite'
                        },{
                            name: 'Cancel',
                            value: false
                        }
                    ]

                }
            ])
            // console.log('----', action)
            if(!action){
                return;
            }else if(action === 'overwrite'){
                //移除已经存在的目录
                console.log(`\r\nRemoving`)
                await fs.remove(targetAir)
            }

        }
    }
    // 
    const generator = new Generator(name, targetAir)
    //
    generator.create()

}