/**
 * Editor prompt example
 */

'use strict';
var inquirer = require('inquirer');
var template = [];

function genFormItem () {
  var questions = [
    {
      type: 'input',
      name: 'id',
      message: '(id) 表单项的key：'
    },
    {
      type: 'input',
      name: 'name',
      message: '(name) 表单项的标签：'
    },
    {
      type: 'rawlist',
      name: 'rule',
      choices: [
        'none',
        'required',
      ],
      message: '(rule) 验证规则：',
      default: 1,
    },
    {
      type: 'input',
      name: 'spec',
      message: '(spec) 单位：',
      default: null,

    },
    {
      type: 'input',
      name: 'holder',
      message: '(holder) 占位文字：',
      default: null,

    },
    {
      type: 'confirm',
      name: 'readonly',
      message: '（readonly）只读？',
      default: false,
    },
    {
      type: 'rawlist',
      name: 'type',
      message: '(type) 表单项类型：',
      choices: [
        'text',
        'number',
        'picker',
        'mutiplePicker',
        'picture',
        'area'
      ],
      default: 'text',
    },
    {
      type: 'input',
      name: 'value',
      message: '(value) 默认值：',
      default: null,
      /*
    },
    {
      type: 'confirm',
      name: 'config.space',
      message: 'config.space ?',
      default: false,
      */
    }
  ];

  inquirer.prompt(questions).then(function (answers) {
    const { rule } = answers;
    if (rule === 'none') {
      answers.rule = null;
    }
    inputOption(answers).then( () => {
      inquirer.prompt({
        type: 'confirm',
        name: 'continue',
        message: 'continue ?',
        default: true,
      }).then( answer => {
        template.push(answers);
        if (answer.continue) {
          genFormItem();
        } else {
          console.log(template);
        }
      })
    });
  });
};

function inputOption (answers) {
  if (answers.options === void 0) {
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
      }
    ]).then( option => {
      answers.options.push( option );
      return inquirer.prompt({
        type: 'confirm',
        name: 'goon',
        message: 'go on option ? ',
        default: true,
      }).then( a => {
        if (a.goon) {
          return next();
        } else {
        }
      });
    });
  })();
}
genFormItem();
