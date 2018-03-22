
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

  describe("#defined()", () => {
    it("should be defined", () => {
      expect(ContactController).toBeDefined();
    });
  });

  describe("#getContacts()", () => {
      it("should return an empty array when no contacts are available", (done) => {
        this.book.getContacts()
        .then((contacts) => {
          expect(contacts.length).toBe(0);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });

      it("should return an array of contacts when contacts are available", (done) => {
        this.book.addContact("Alice", "001-101-1010", "alice@example.com")
        .then(() => {
          this.book.getContacts()
          .then((contacts) => {
            expect(contacts.length).toBe(1);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });

  });

  describe("#searchMethods()", ()=>{

    const zelda = ["Zelda Smith", "000-100-111", "zelda@nintendo.com"];
    const snake = ["Solid Snake", "100-100-100", "snake@konami.com"];
    const magus = ["Magus Johnson", "101-010-101", "magus@squaresoft.com"];
    const alloy = ["Alloy Rodriguez", "111-111-111", "allow@guerrilla-games.com"];

    describe("#iterativeSearch()", () =>{

      it("should return null when called with empty array", () => {
        expect(this.book.iterativeSearch([],"Alloy")).toBeNull();
      });

      it("should return null when contact is not found", (done) =>{
        this.book.addContact(...zelda).then( () =>{
          this.book.getContacts().then ((contacts) =>{
            expect(this.book.iterativeSearch(contacts, "Magnus Johnson")).toBeNull();
            done();
          }).catch((error)=>{
            console.log(error);
            done();
          });
        });
      });

      it("should return contact if found", (done) =>{
        this.book.addContact(...zelda).then(()=>{
          this.book.addContact(...snake).then(()=>{
            this.book.addContact(...magus).then(()=>{
              this.book.addContact(...alloy).then(() =>{
                this.book.getContacts().then( (contacts) =>{
                  let con = this.book.iterativeSearch(contacts,"Magus Johnson");
                  expect(con.name).toBe("Magus Johnson");
                  expect(con.phone).toBe("101-010-101");
                  expect(con.email).toBe("magus@squaresoft.com");
                  done();
                }).catch((err)=>{
                  console.log(err);
                  done();
                });
              });
            });
          });
        });
      });
    });

    describe("#binarySearch()", ()=> {
      it("should return null when called with empty array", () => {
        expect(this.book.binarySearch([],"Alloy")).toBeNull();
      });

      it("should return null when contact is not found", (done) =>{
        this.book.addContact(...zelda).then( () =>{
          this.book.getContacts().then ((contacts) =>{
            expect(this.book.binarySearch(contacts, "Magnus Johnson")).toBeNull();
            done();
          }).catch((error)=>{
            console.log(error);
            done();
          });
        });
      });

      it("should return contact if found", (done) =>{
        this.book.addContact(...alloy).then(()=>{
          this.book.addContact(...magus).then(()=>{
            this.book.addContact(...snake).then(()=>{
              this.book.addContact(...zelda).then(() =>{
                this.book.getContacts().then( (contacts) =>{
                  let con = this.book.binarySearch(contacts,"Magus Johnson");
                  expect(con.name).toBe("Magus Johnson");
                  expect(con.phone).toBe("101-010-101");
                  expect(con.email).toBe("magus@squaresoft.com");
                  done();
                }).catch((err)=>{
                  console.log(err);
                  done();
                });
              });
            });
          });
        });
      });
    });

    describe("#search()", () => {
      it("should return null when a contact was not found", (done) => {
        this.book.addContact(...zelda).then(() => {
          this.book.search("Solid Snake").then((contact) => {
            expect(contact).toBeNull();
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should return the contact when found", (done) => {
        this.book.addContact(...snake).then(() => {
          this.book.search("Solid Snake").then((contact) => {
            expect(contact).not.toBeNull();
            expect(contact.name).toBe("Solid Snake");
            expect(contact.phone).toBe("100-100-100");
            expect(contact.email).toBe("snake@konami.com");
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });

    });

  });

  describe("#delete()", () => {

     it("should not remove any contacts that do not match the ID passed", (done) => {
       this.book.addContact("Rick Deckard", "000-000-000", "null@null.com")
       .then(() => {
         this.book.getContacts()
         .then((contacts) => {
           expect(contacts[0].name).toBe("Rick Deckard");
           expect(contacts.length).toBe(1);
           this.book.deleteContact(99)
           .then(() => {
             this.book.getContacts()
             .then((contacts) => {
               expect(contacts.length).toBe(1);
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           });
         });
       });
     });

     it("should remove the contact that matches the ID passed", (done) => {

       this.book.addContact("Rick Deckard", "000-000-000", "null@null.com").then((contact) => {
         this.book.getContacts()
         .then((contacts) => {
           expect(contacts[0].name).toBe("Rick Deckard");
           expect(contacts.length).toBe(1);
           this.book.deleteContact(contact.id)
           .then(() => {
             this.book.getContacts()
             .then((contacts) => {
               expect(contacts.length).toBe(0);
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           });
         });
       });

     });

  });

});
