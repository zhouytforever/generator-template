/**
 * Editor prompt example
 */

'use strict';
var inquirer = require('inquirer');
var template = [];

function genFormItem () {
				var obj = {};
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
								{name: 'none', value: null},
								{name: 'required', value: 'required'},
								],
								message: '(rule) 验证规则：',
								filter: function (value) {
												if (value) {
													console.log('有规则');
												}
												return value;
								}
				},
				{
								type: 'rawList',
								name: 'type',
								message: '(type) 表单项类型：',
								choices: [
												'text',
												'number',
												'picker',
												'mutiplePicker',
												'upload',
												'area',
								],
								default: 'text',

				},
				{
								type: 'input',
								name: 'spec',
								message: '(spec) 单位：',
								default: null,

				},

				];

				inquirer.prompt(questions).then(function (answers) {
							 console.log(JSON.stringify(answers, null, '    '));
							 template.push(answers);
							 inquirer.prompt({
											 type: 'confirm',
											 name: 'continue',
											 message: 'continue?',
											 default: true,
							 }).then( answer => {
											 if (answer.continue) {
															 genFormItem(); 
											 } else {
															console.log(JSON.stringify(template, null, '    '));
											 }
							 })
				});

}

genFormItem();
