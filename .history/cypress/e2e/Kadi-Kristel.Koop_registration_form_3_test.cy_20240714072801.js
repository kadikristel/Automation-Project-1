import "cypress-file-upload";

beforeEach(() => {
  cy.visit("cypress/fixtures/registration_form_3.html");
});

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */

describe("Bonus section: Visual tests, created by: Kadi-Kristel", () => {
  it("Check that Country dropdown is correct and City dropdown updates accordingly", () => {
    cy.get("#country").children().should("have.length", 4);
    cy.get("#country").find("option").should("have.length", 4);

    // Select a country (Estonia)
    cy.get("#country").select("Estonia").should("have.value", "object:4");

    cy.get("#city").select("Haapsalu");
    cy.get("#city").should("contain", "Haapsalu");

    // Change a country to Spain
    cy.get("#country").select("Spain").should("have.value", "object:3");

    // Verify that city "Haapsalu" is removed
    cy.get("#city").find("option").should("not.contain", "Haapsalu");

    const expectedCityOptions = [
      "",
      "Malaga",
      "Madrid",
      "Valencia",
      "Corralejo",
    ];

    cy.get("#city")
      .find("option")
      .then(($options) => {
        const actualCityOptions = [...$options].map((option) => option.text);
        expect(actualCityOptions).to.deep.eq(expectedCityOptions);
      });

    cy.get("#city").select("Valencia");
    cy.get("#city").should("contain", "Valencia");
  });

  it("Check that radio button list is correct", () => {
    cy.get('input[type="radio"]').should("have.length", 4);

    cy.get("input[type=radio]").next().eq(0).should("have.text", "Daily");
    cy.get("input[type=radio]").next().eq(1).should("have.text", "Weekly");
    cy.get("input[type=radio]").next().eq(2).should("have.text", "Monthly");
    cy.get("input[type=radio]").next().eq(3).should("have.text", "Never");

    cy.get('input[type="radio"]').eq(0).should("not.be.checked");
    cy.get('input[type="radio"]').eq(1).should("not.be.checked");
    cy.get('input[type="radio"]').eq(2).should("not.be.checked");
    cy.get('input[type="radio"]').eq(3).should("not.be.checked");

    cy.get('input[type="radio"]').eq(1).check().should("be.checked");
    cy.get('input[type="radio"]').eq(3).check().should("be.checked");
    cy.get('input[type="radio"]').eq(1).should("not.be.checked");
  });

  it("Check that checkbox list is correct", () => {
    cy.get('input[type="checkbox"]').should("have.length", 2);

    cy.get('input[type="checkbox"]').next().eq(0).should("have.text", "");
    cy.get('input[type="checkbox"]')
      .next()
      .eq(1)
      .should("have.text", "Accept our cookie policy");

    cy.get('input[type="checkbox"]').eq(0).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(1).should("not.be.checked");

    cy.get('input[type="checkbox"]').eq(0).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(1).check().should("be.checked");

    cy.get('button a[href="cookiePolicy.html"]').click();
    cy.url().should("include", "cookiePolicy.html");
    cy.go("back");
    cy.url().should("not.include", "cookiePolicy.html");

    cy.get('input[type="checkbox"]').eq(0).should("be.checked");
    cy.get('input[type="checkbox"]').eq(1).should("be.checked");
  });

  it("Check that email format is correct", () => {
    cy.get('input[name="email"]').type("kadi.test.com");
    cy.get('#emailAlert span[ng-show="myForm.email.$error.email"]')
      .should("be.visible")
      .and("contain", "Invalid email address");
    cy.get('input[name="email"]').clear();
    cy.get('input[name="email"]').type("kadi@test.com");
    cy.get('#emailAlert span[ng-show="myForm.email.$error.email"]').should(
      "not.be.visible"
    );
  });

  it("Check that datepicker works for date of registration", () => {
    const today = new Date();
    const date = today.toISOString().split("T")[0];
    cy.get('input[type="date"]').first().type(date);
    cy.get('input[type="date"]').should("have.value", date);
  });
});
/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */

describe("Bonus section: Functional tests, created by: Kadi-Kristel", () => {
  it("User can submit form with all fields valid", () => {
    cy.get("#name").type("Kadi");
    cy.get('input[name="email"]').type("kadi@test.com");
    cy.get('#emailAlert span[ng-show="myForm.email.$error.email"]').should(
      "not.be.visible"
    );
    cy.get("#emailAlert").should("not.be.visible");
    cy.get("#country").select("object:5").should("contain", "Austria");

    // After submitting the form, city dropdown seems to be broken. It doesn't display Salzburg anymore (all the other fields are still filled)
    cy.get("#city").select("Salzburg").should("contain", "Salzburg");

    cy.get('input[type="date"]').first().type("2024-07-12");
    cy.get('input[type="radio"]').check("Monthly");
    cy.get("#birthday").type("1995-03-29");
    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should("be.checked");
    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(1).should("be.checked");
    cy.get("#checkboxAlert").should("not.be.visible");

    // Uploading a file
    const fileName = "example_file_form3";
    cy.get("#myFile").attachFile(fileName);

    cy.get('button[type="submit"]').click();
    cy.go("back");
    cy.log("Back again in Registration form 3");
  });

  it("User fills only mandatory fields", () => {
    cy.get("#name").type("Kadi");
    cy.get('input[name="email"]').type("kadi@test.com");
    cy.get('#emailAlert span[ng-show="myForm.email.$error.email"]').should(
      "not.be.visible"
    );
    cy.get("#emailAlert").should("not.be.visible");
    cy.get("#country").select("object:4").should("contain", "Estonia");
    cy.get("#city").select("Tartu").should("contain", "Tartu");
    cy.get("#birthday").type("1995-03-29");
    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should("be.checked");
    cy.get("#checkboxAlert").should("not.be.visible");
    cy.get('input[type="submit"]').click();
    cy.go("back");
    cy.log("Back again in Registration form 3");
  });

  it("Mandatory fields are absent with corresponding assertions", () => {
    inputEmptyMandatoryFields();
  });

  it("Uploading a file", () => {
    const fileName = "example_file_form3";
    cy.visit("/cypress/fixtures/registration_form_3.html");
    cy.get("#myFile").attachFile(fileName);
    cy.get("button[type='submit']").should("contain", "Submit file").click();
    cy.url().should("include", "filename=example_file_form3");
    cy.go("back");
    cy.url().should("include", "registration_form_3.html");
    cy.get("#myFile").should("have.value", "");
    cy.log("Back again in Registration form 3");
  });
});

function inputEmptyMandatoryFields() {
  cy.log("Leaving mandatory fields empty");
  cy.get('input[name="email"]').clear().type("a").clear().blur();
  cy.get("#name").clear().type("a").clear().blur();

  // Check if the email alert element is visible
  cy.get("div#emailAlert").should("be.visible");

  // Ensure the specific required email message is visible
  cy.get("div#emailAlert span[ng-show='myForm.email.$error.required']")
    .should("be.visible")
    .and("contain", "Email is required");

  cy.get('input[ng-model="checkbox"]').uncheck();

  cy.contains("#checkboxAlert", "Checkbox is required").should(
    "not.be.visible"
  );

  cy.get('input[type="checkbox"]').eq(1).should("not.be.checked");

  cy.get('input[type="submit"]').should("be.disabled");
  cy.get('input[type="date"]').first().type("2024-07-12");

  const fileName = "example_file_form3";
  cy.get("#myFile").attachFile(fileName);
}
