beforeEach(() => {
  cy.visit("cypress/fixtures/registration_form_2.html");
});

describe("Section 1: Functional tests, created by: Kadi-Kristel", () => {
  it("User can use only same both first and validation passwords", () => {

/*
Assignment 4: add content to the following tests
*/

describe("Section 1: Functional tests, created by: Kadi-Kristel", () => {
  it("User can use only same both first and validation passwords", () => {
    // Add test steps for filling in only mandatory field
    cy.get("#username").type("kadikristel");
    cy.get("#email").type("kadi@test.com");
    cy.get('[data-cy="name"]').type("Kadi");
    cy.get("#lastName").type("Koop");
    cy.get('[data-testid="phoneNumberTestId"]').type("555666777");
    cy.get("#password").type("Password123");
    cy.get("#confirm").type("Pass321");
    cy.get("h2").contains("Password").click();
    cy.get('[name="confirm"]').type("{enter}");
    cy.window().scrollTo("bottom");
    cy.get("#password_error_message")
      .should("be.visible")
      .should("contain", "Passwords do not match!");

    cy.get("#success_message").should("not.be.visible");
    cy.get("button.submit_button").should("not.be.enabled");
    cy.get('input[name="confirm"]').should(
      "have.attr",
      "title",
      "Both passwords should match"
    );
    cy.get("#confirm").clear().type("Password123");
    cy.get("h2").contains("Password").click();
    cy.get("#password_error_message").should("not.be.visible");
    cy.get("#success_message").should("not.be.visible");
    cy.get("button.submit_button").should("be.enabled");
    cy.get("button.submit_button").click();
    cy.get("#success_message")
      .should("be.visible")
      .should("contain", "User successfully submitted registration");
    cy.get("#success_message").should("have.css", "display", "block");
  });
it("User can submit form with all fields added", () => {
    // Add test steps for filling in ALL fields
    cy.get("#username").type("kadikristel");
    cy.get("#email").type("kadi@test.com");
    cy.get('[data-cy="name"]').type("Kadi");
    cy.get("#lastName").type("Koop");
    cy.get('[data-testid="phoneNumberTestId"]').type("555666777");
    cy.get('input[type="radio"]').eq(1).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(2).check().should("be.checked");
    cy.get("#cars").select(3);
    cy.get("#animal").select(1);
    cy.get("#password").type("Password123");
    cy.get("#confirm").type("Password123");

    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.enabled").click();

    // Assert that submit button is enabled
    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.enabled").click();

    cy.get("#password_error_message").should("not.be.visible");
    cy.get("#input_error_message").should("not.be.visible");
    cy.get("#success_message")
      .should("be.visible")
      .should("contain", "User successfully submitted registration");
    cy.get("#success_message").should("have.css", "display", "block");
  });

  it("User can submit form with valid data and only mandatory fields added", () => {
    // Add test steps for filling in ONLY mandatory fields
    cy.get("#username").type("kadikristel");
    cy.get("#email").type("kadi@test.com");
    cy.get('[data-cy="name"]').type("Kadi");
    cy.get("#lastName").type("Koop");
    cy.get('[data-testid="phoneNumberTestId"]').type("555666777");
    cy.get("#password").type("Password123");
    cy.get("#confirm").type("Password123");
    cy.get("h2").contains("Password").click();
    cy.get("button.submit_button").should("be.enabled").click();

    cy.get("#input_error_message").should("not.be.visible");
    cy.get("#password_error_message").should("have.css", "display", "none");

    // Assert that submit button is enabled
    cy.get("h2").contains("Password").click();
    cy.get("button.submit_button").should("be.enabled").click();
    cy.get("#input_error_message").should("not.be.visible");
    cy.get("#password_error_message").should("have.css", "display", "none");

    // Assert that after submitting the form system shows successful message
    cy.get("#success_message")
      .should("be.visible")
      .should("contain", "User successfully submitted registration");
    cy.get("#success_message").should("have.css", "display", "block");

    // example, how to use function, which fills in all mandatory data
    // in order to see the content of the function, scroll to the end of the file
    inputValidData("johnDoe");
  });

  it("User cannot submit the form when email is not added", () => {
    cy.get("#username").type("kadikristel");
    cy.get("#email").type("kadi@test.com");
    cy.get('[data-cy="name"]').type("Kadi");
    cy.get("#lastName").type("Koop");
    cy.get('[data-testid="phoneNumberTestId"]').type("555666777");
    cy.get("#password").type("Password123");
    cy.get("#confirm").type("Password123");
  cy.get("#email").scrollIntoView();
    cy.get("#email").clear();
    cy.get("h2").contains("Password").click();

    cy.get(".submit_button").should("be.disabled");
    cy.get("#input_error_message")
      .should("be.visible")
      .should("contain", "Mandatory input field is not valid or empty!");
    cy.get("#success_message").should("not.be.visible");
  });
});

/*
Assignement 5: create more visual tests


describe("Section 2: Visual tests, created by: Kadi-Kristel", () => {
  it("Check that Cerebrum Hub logo is correct and has correct size", () => {
    cy.log("Will check Cerebrum Hub logo source and size");
    cy.get("#logo")
      .should("have.attr", "src")
      .should("include", "cerebrum_hub_logo");
<<<<<<< HEAD

=======
    // get element and check its parameter height
    // it should be less than 178 and greater than 100
>>>>>>> 9b06ef2 (Updated registration forms)
    cy.get("#logo")
      .invoke("height")
      .should("be.lessThan", 178)
      .and("be.greaterThan", 100);
  });
<<<<<<< HEAD

=======
>>>>>>> 9b06ef2 (Updated registration forms)
  it("Check that Cypress logo is correct and has correct size", () => {
    cy.log("Check Cypress logo source and size");
    cy.get('[data-cy="cypress_logo"]')
      .should("have.attr", "src")
      .should("include", "cypress_logo");
    cy.get('[data-cy="cypress_logo"]')
      .invoke("height")
      .should("be.lessThan", 116)
      .and("be.greaterThan", 80);
  });
<<<<<<< HEAD

=======
>>>>>>> 9b06ef2 (Updated registration forms)
  it("Check navigation part, registration form 1", () => {
    cy.get("nav").children().should("have.length", 2);

    // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
    cy.get("nav")
      .siblings("h1")
      .should("have.text", "Registration form number 2");

    // Get navigation element, find its first child, check the link content and click it
    cy.get("nav")
      .children()
      .eq(0)
      .should("be.visible")
      .and("have.attr", "href", "registration_form_1.html")
      .click();

<<<<<<< HEAD
    cy.url().should("contain", "/registration_form_1.html");

    cy.go("back");
    cy.log("Back again in registration form 2");
  });

  it("Check navigation part, registration form 3", () => {
    cy.get("nav").children().should("have.length", 2);

    cy.get("nav")
      .siblings("h1")
      .should("have.text", "Registration form number 2");

=======
    // Check that currently opened URL is correct
    cy.url().should("contain", "/registration_form_1.html");

    // Go back to previous page
    cy.go("back");
    cy.log("Back again in registration form 2");
  });
  it("Check navigation part, registration form 3", () => {
    cy.get("nav").children().should("have.length", 2);
    cy.get("nav")
      .siblings("h1")
      .should("have.text", "Registration form number 2");
>>>>>>> 9b06ef2 (Updated registration forms)
    cy.get("nav")
      .children()
      .eq(1)
      .should("be.visible")
      .and("have.attr", "href", "registration_form_3.html")
      .click();
<<<<<<< HEAD

    cy.url().should("contain", "/registration_form_3.html");

    cy.go("back");
    cy.log("Back again in Registration form 2");
  });

  it("Check that radio button list is correct", () => {
    cy.get('input[type="radio"]').should("have.length", 4);

=======
    cy.url().should("contain", "/registration_form_3.html");
    cy.go("back");
    cy.log("Back again in Registration form 2");
  });
  it("Check that radio button list is correct", () => {
    cy.get('input[type="radio"]').should("have.length", 4);

    // Verify labels of the radio buttons
>>>>>>> 9b06ef2 (Updated registration forms)
    cy.get('input[type="radio"]').next().eq(0).should("have.text", "HTML");
    cy.get('input[type="radio"]').next().eq(1).should("have.text", "CSS");
    cy.get('input[type="radio"]')
      .next()
      .eq(2)
      .should("have.text", "JavaScript");
    cy.get('input[type="radio"]').next().eq(3).should("have.text", "PHP");

    //Verify default state of radio buttons
    cy.get('input[type="radio"]').eq(0).should("not.be.checked");
    cy.get('input[type="radio"]').eq(1).should("not.be.checked");
    cy.get('input[type="radio"]').eq(2).should("not.be.checked");
    cy.get('input[type="radio"]').eq(3).should("not.be.checked");

    // Selecting one will remove selection from the other radio button
    cy.get('input[type="radio"]').eq(0).check().should("be.checked");
    cy.get('input[type="radio"]').eq(1).check().should("be.checked");
    cy.get('input[type="radio"]').eq(0).should("not.be.checked");
  });
<<<<<<< HEAD

  it("Check that checkbox list is correct", () => {
    cy.get('input[type="checkbox"]').should("have.length", 3);

=======
  it("Check that check box list is correct", () => {
    cy.get('input[type="checkbox"]').should("have.length", 3);
>>>>>>> 9b06ef2 (Updated registration forms)
    cy.get('input[type="checkbox"]')
      .next()
      .eq(0)
      .should("have.text", "I have a bike");
    cy.get('input[type="checkbox"]')
      .next()
      .eq(1)
      .should("have.text", "I have a car");
    cy.get('input[type="checkbox"]')
      .next()
      .eq(2)
      .should("have.text", "I have a boat");
<<<<<<< HEAD

=======
>>>>>>> 9b06ef2 (Updated registration forms)
    cy.get('input[type="checkbox"]').eq(0).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(1).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(2).should("not.be.checked");

<<<<<<< HEAD
=======
    // Check the checkboxes and verify it is checked
>>>>>>> 9b06ef2 (Updated registration forms)
    cy.get('input[type="checkbox"]').eq(0).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(1).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(2).check().should("be.checked");
  });
<<<<<<< HEAD

  it("Car dropdown is correct", () => {
    cy.get("#cars").select(1).screenshot("Cars drop-down");
    cy.screenshot("Full page screenshot");

=======
  it("Car dropdown is correct", () => {
    // Here is just an example how to explicitely create screenshot from the code
    // Select second element and create screenshot for this area or full page
    cy.get("#cars").select(1).screenshot("Cars drop-down");
    cy.screenshot("Full page screenshot");

    // Here are given different solutions how to get the length of array of elements in Cars dropdown
    // Next 2 lines of code do exactly the same!
>>>>>>> 9b06ef2 (Updated registration forms)
    cy.get("#cars").children().should("have.length", 4);
    cy.get("#cars").find("option").should("have.length", 4);

    // Check  that first element in the dropdown has text Volvo
    cy.get("#cars").find("option").eq(0).should("have.text", "Volvo");

    // Advanced level how to check the content of the Cars dropdown
    cy.get("#cars")
      .find("option")
      .then((options) => {
        const actual = [...options].map((option) => option.value);
        expect(actual).to.deep.eq(["volvo", "saab", "opel", "audi"]);
      });
  });
<<<<<<< HEAD

  it("Animal dropdown is correct", () => {
    cy.get("#animal").select(1).screenshot("Animal drop-down");
    cy.screenshot("Full page screenshot");

    cy.get("#animal").children().should("have.length", 6);
    cy.get("#animal").find("option").should("have.length", 6);

=======
  it("Animal dropdown is correct", () => {
    cy.get("#animal").select(1).screenshot("Animal drop-down");
    cy.screenshot("Full page screenshot");
    cy.get("#animal").children().should("have.length", 6);
    cy.get("#animal").find("option").should("have.length", 6);
>>>>>>> 9b06ef2 (Updated registration forms)
    cy.get("#animal").find("option").eq(3).should("have.text", "Hippo");

    // Advanced level how to check the content of the Animal dropdown
    cy.get("#animal")
      .find("option")
      .then((options) => {
        const actual = [...options].map((option) => option.value);
        expect(actual).to.deep.eq([
          "dog",
          "cat",
          "snake",
          "hippo",
          "cow",
          "mouse",
        ]);
      });
  });
});
<<<<<<< HEAD

=======
>>>>>>> 9b06ef2 (Updated registration forms)
function inputValidData(username) {
  cy.log("Username will be filled");
  cy.get('input[data-testid="user"]').type(username);
  cy.get("#email").type("validemail@yeap.com");
  cy.get('[data-cy="name"]').type("John");
  cy.get("#lastName").type("Doe");
  cy.get('[data-testid="phoneNumberTestId"]').type("10203040");
  cy.get("#password").type("MyPass");
  cy.get("#confirm").type("MyPass");
  cy.get("h2").contains("Password").click();
}