/**
 * 一个基于cli的表单模板生成工具
 * @author yuting
 * @date: 2017/09/01
 * @version: 0.0.1
 */

import inquirer from 'inquirer';

const template = [];

function inputOption(answers) {
  if (answers.options === undefined) {
    answers.options = [];
  }
  const { type } = answers;
  if (type !== 'picker' && type !== 'mutiplePicker') {
    answers.options = null;
    return Promise.resolve();
  }
  return (function next() {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'label',
        message: '（label）option的名：',
      },
      {
        type: 'input',
        name: 'value',
        message: '（value）option的值：',
      },
    ]).then((option) => {
      answers.options.push(option);
      return inquirer.prompt({
        type: 'confirm',
        name: 'goon',
        message: '继续其他 option ?（默认 true）',
        default: true,
      }).then((a) => {
        if (a.goon) {
          return next();
        }
        return Promise.resolve();
      });
    });
  }());
}

function genFormItem() {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: '(id) 表单项的key：',
    },
    {
      type: 'input',
      name: 'name',
      message: '(name) 表单项的标签：',
    },
    {
      type: 'rawlist',
      name: 'rule',
      choices: [
        'none',
        'required',
      ],
      message: '(rule) 验证规则（默认 none）：',
      default: 'none',
    },
    {
      type: 'input',
      name: 'spec',
      message: '(spec) 单位（默认 null）：',
      default: null,

    },
    {
      type: 'input',
      name: 'holder',
      message: '(holder) 占位文字（默认 null）：',
      default: null,

    },
    {
      type: 'confirm',
      name: 'readonly',
      message: '（readonly）只读？（默认 false）',
      default: false,
    },
    {
      type: 'rawlist',
      name: 'type',
      message: '(type) 表单项类型（默认 text）：',
      choices: [
        'text',
        'number',
        'picker',
        'mutiplePicker',
        'picture',
        'area',
        'date',
        'time',
        'video',
      ],
      pageSize: 10,
      default: 'text',
    },
    {
      type: 'input',
      name: 'value',
      message: '(value) 初始值（默认 null）：',
      default: null,
    },
    {
      type: 'confirm',
      name: 'space',
      message: '(config.space) 是否留白?（默认 false）',
      default: false,
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const { rule, space } = answers;
    if (rule === 'none') {
      answers.rule = null;
    }
    answers.config = space ? { space: true } : { space: false };
    delete answers.space;
    Object.keys(answers).forEach((k) => {
      if (answers[k] === '') {
        answers[k] = null;
      }
    });
    inputOption(answers).then(() => {
      inquirer.prompt({
        type: 'confirm',
        name: 'continue',
        message: '继续其他表单项 ?（默认 true）',
        default: true,
      }).then((answer) => {
        template.push(answers);
        if (answer.continue) {
          genFormItem();
        } else {
          console.log(JSON.stringify(template, null, '  '));
        }
      });
    });
  });
}

genFormItem();
