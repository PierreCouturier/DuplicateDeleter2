#!/usr/bin/env node

import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import fs from 'fs'
import chalk from 'chalk'

let path = './'
let separator
let index

let current_file = []
let last_file = []
let counter = 0
let deleted_counter = 0
let not_deleted_counter = 0
let skip_counter = 0

async function askSeparator() {
	const answers = await inquirer.prompt({
		name: 'separator',
		type: 'input',
		message: 'What is the separator?',
		default() {
			return '.'
		},
	})

	separator = answers.separator
}

async function askIndex() {
	const answers = await inquirer.prompt({
		name: 'index',
		type: 'list',
		message: 'What is the index?',
		choices: [1, 2, 3, 4],
	})

	index = answers.index
}

async function confirm() {
	const answers = await inquirer.prompt({
		name: 'confirm',
		type: 'confirm',
		message: 'Are you sure?',
	})

	if (answers.confirm) {
		return true
	} else {
		process.exit(1)
	}
}

async function deleteFiles() {
	const spinner = createSpinner('Deleting files...\n').start()

	fs.readdir(path, function (err, files) {
		if (err) {
			console.log(err)
			return
		}
		files.forEach((file) => {
			current_file['header'] = file.split(separator)[index - 1]
			current_file['full'] = file
			if (!current_file['header']) return skip_counter++
			if (current_file['header'] === last_file['header']) {
				try {
					fs.rmSync(`${path}/${current_file['full']}`, {
						recursive: true,
						force: true,
					})
					deleted_counter++
				} catch (err2) {
					console.log(err2)
					process.exit()
				}
			} else {
				last_file['header'] = current_file['header']
				not_deleted_counter += 1
			}
			counter++
		})
		spinner.success({
			text: `${chalk.bold('===== Result =====')}
  ${chalk.bold('Total file parsed:')} ${chalk.green.bold(counter)}.
  ${chalk.bold('Total file deleted:')} ${chalk.green.bold(deleted_counter)}.
  ${chalk.bold('Total file not deleted:')} ${chalk.green.bold(not_deleted_counter)}.
  ${chalk.bold('Total file skipped:')} ${chalk.green.bold(skip_counter)}`,
		})
	})
}

await askSeparator()
await askIndex()
await confirm()
await deleteFiles()
