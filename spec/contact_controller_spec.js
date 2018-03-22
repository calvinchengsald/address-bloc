
const ContactController = require ('.././controllers/ContactController.js');
const sequelize = require("../db/models/index").sequelize;

describe("ContactController", () => {

  beforeEach((done) => {
   this.book = new ContactController();

   sequelize.sync({force: true}).then((res) => {
     done();
   })
   .catch((err) => {
     done();
   });
  });

  // #2
  describe("#addContact()", () => {

   it("should add a single contact into the book", (done) => {
      expect(this.book.contacts.length).toBe(0);
      this.book.addContact("Alice", "001-101-1010", "Alice.wonderland@gmail.com").then((contact) =>{
        expect(contact.name).toBe("Alice");
        expect(contact.phone).toBe("001-101-1010");
        expect(contact.email).toBe("Alice.wonderland@gmail.com");
        done();
      })
      .catch((err) => {
        done();
      });
    })
  });

  it("should be defined", () => {
    expect(ContactController).toBeDefined();
  });

});
