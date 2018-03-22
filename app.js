const inquirer = require('inquirer');
const MenuController = require('./controllers/MenuControllers.js');
const menu = new MenuController();

menu.clear();
menu.main();
