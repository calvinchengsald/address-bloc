const inquirer = require('inquirer');
const ContactController = require('./ContactController');

module.exports = class MenuController {
  constructor(){

    this.mainMenuQuestions = [
     {
      type: "list",
       name: "mainMenuChoice",
       message: "Please choose from an option below: ",
       choices: [
         "Add new contact",
         "View all contacts",
         "Search for a contact",
         "Get Date",
         "Exit",
       ]
     }
   ];
   this.book = new ContactController;
  }

  main(){

    console.log(`Welcome to AddressBloc!`);
    inquirer.prompt(this.mainMenuQuestions).then((response) => {
      switch(response.mainMenuChoice){
        case "Add new contact":
          this.addContact();
          break;
        case "Exit":
          this.exit();
          break;
        case "Get Date":
          this.getDate();
          break;
        case "View all contacts":
          this.getContacts();
          break;
        case "Search for a contact":
          this.searchContact();
          break;
        default:
          console.log("Invalid input");
          this.main();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  clear(){
    console.log("\x1Bc");
  }

  addContact(){
    this.clear();
    inquirer.prompt(this.book.addContactQuestions).then((answers) => {
       this.book.addContact(answers.name, answers.phone, answers.email).then((contact) => {
         console.log("Contact added successfully!");
         this.main();
       }).catch((err) => {
         console.log(err);
         this.main();
       });
     });
  }

  exit(){
    console.log("Thanks for using AddressBloc!");
    process.exit();
  }

  getDate(){
    var date = new Date();
    console.log(date.toDateString());
    console.log(date.toLocaleTimeString());
    this.main();
  }

  getContacts(){
    this.clear();
    this.book.getContacts().then((contacts)=> {
      for( let contact of contacts){
        console.log(
          `\n
          Name: ${contact.name}\n
          Phone: ${contact.phone}\n
          Email: ${contact.email}\n
          ___________________\n`
        );
      }
      this.main();
    }).catch((error) => {
      console.log(error);
      this.main();
    });

  }
  showContact(contact){
    console.log(`Found Contact:\n
    Name: ${contact.name}\n
    Phone: ${contact.phone}\n
    Email: ${contact.email}\n
    `);
    inquirer.prompt(this.book.showContactQuestions).then((answer) => {
       switch(answer.selected){
         case "Delete contact":
           this.deleteContact(contact);
           break;
         case "Main menu":
           this.main();
           break;
         default:
           console.log("Something went wrong.");
           this.showContact(contact);
       }
     }).catch((err) => {
       console.log(err);
       this.showContact(contact);
     });

  }
  searchContact(){
    this.clear();
    inquirer.prompt(this.book.searchContactQuestions).then((answers) => {
      this.book.search(answers.name).then((contact)=>{
        if(contact){
          this.showContact(contact);
        }
        else {
          console.log(`Contact: ${answers.name} not found`);
          this.main();
        }
      }).catch((err) => {
       console.log(err);
       this.main();
     });
    });
  }

  remindMe(){
    return "Learning is a life-long pursuit";
  }
  deleteContact(contact){
    inquirer.prompt(this.book.deleteConfirmQuestions).then((answer) => {
      if(answer.confirmation){
        this.book.deleteContact(contact.id);
        console.log("contact deleted!");
        this.main();
      } else {
        console.log("contact not deleted");
        this.showContact(contact);
      }
    }).catch((err) => {
      console.log(err);
      this.main();
    });
  }
}
