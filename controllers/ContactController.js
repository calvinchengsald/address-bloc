
const Contact = require('../db/models').Contact;

module.exports = class ContactController{

  constructor(){
    this.addContactQuestions = [
      {
        type: "input",
        name: "name",
        message: "Contact's name - ",
        validate(val){
          return val !== "";
        }
      },
      {
        type: "input",
        name: "phone",
        message: "Contact's phone number - ",
        validate(val){
          return val !== "";
        }
      },
      {
        type: "input",
        name: "email",
        message: "Contact's email address - ",
        validate(val){
          return val !== "";
        }
      }
    ];
    this.searchContactQuestions = [
      {
        type: "input",
        name: "name",
        message: "Contact's name - ",
        validate(val){
          return val !== "";
        }
      }
    ];
  }

  addContact(name, phone, email){
    return Contact.create({name,phone, email});
  }
  getContacts(){
    return Contact.findAll();
  }
  iterativeSearch(contacts, target){
    for( let contact of contacts){
      if(contact.name === target){
        return contact;
      }
    }
    return null;
  }
  binarySearch(contact, target){
    let left = 0;
    let right = contact.length-1;
    let index = Math.floor((right-left) / 2 )+ left;
    if(contact.length ===0){return null;}
    while( left < right){
      if(contact[index].name === target){
        return contact[index];
      }
      else if(contact[index].name > target){
        right = index-1;
        index =  (right-left) / 2 + left;
      }
      else {
        left = index+1;
        index =  (right-left) / 2 + left;
      }
    }
    return null;
  }
  search(name){
    return Contact.findOne({
        where: {name}
    });
  }
  delete(id){
    return Contact.destroy({
        where: {id}
      })
  }
}
