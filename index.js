#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { default as inquirer } from 'inquirer';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(chalk.bold.green("seleku"),chalk.bold.white("-kit"),chalk.bgWhite(chalk.bold.red(" v1.0.0 "),"\n"));

const CHOICES = fs.readdirSync(path.join(__dirname, 'project-template'));
const QUESTIONS = [
{
   name: 'template',
   type: 'list',
   message: 'Select Project Template',
   choices: CHOICES
},
{
   name: 'name',
   type: 'input',
   message: 'New project name?'
}];


const CURR_DIR = process.cwd();

function createProject(projectPath) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);

    return true;
}

const SKIP_FILES = ['node_modules'];

function createDirectoryContents(templatePath, projectName) {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        // skip files that should not be copied
        if (SKIP_FILES.indexOf(file) > -1) return;

        if (stats.isFile()) {
            // read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file));
        }
    });
}


inquirer.prompt(QUESTIONS)
.then(answers => {

    const projectChoice = answers['template'];
    const projectName = answers['name'];
    const templatePath = path.join(__dirname, 'project-template', projectChoice);
    const tartgetPath = path.join(CURR_DIR, projectName);

    if (!createProject(tartgetPath)) {
        return;
    }
    createDirectoryContents(templatePath, projectName);

   console.log(chalk.bold.green("\n\trun this command for setup your project \n\tcd "+projectName),"\n",chalk.bold.green("\tthen run 'npm run i'"),"\n",chalk.bold.green("\tand then 'npm run dev'"));
});