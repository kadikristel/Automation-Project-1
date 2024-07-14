/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!************************************************!*\
  !*** ./cypress/e2e/form_1_test_exercise.cy.js ***!
  \************************************************/


beforeEach(() => {
  cy.visit('cypress/fixtures/registration_form_1.html');
});

// NB! this is copy of registration_form_1_test.cy.js

/*
Tasks done during VS Code live demo:
1 and 2 - If you see this text and found file location in project tree, great job!
3 - Find "MyPass123" - and then duplicate line 20 by using Shift + Alt + DownArrow
4 - Uncomment lines 18 - 21
5 - Find and replace username2 to username
6 - autoformat the code, using Shift + Alt + F
 */

describe('This is first test suite', () => {
  it('User can submit data only when valid mandatory values are added', () => {
    // cy.get('#username2').type('Something')
    // cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    // cy.get('input[name="password"]').type('MyPass123')
    // cy.get('[name="confirm"]').type('MyPass123')
    //in order to activate submit button, user has to click somewhere outside the input field
    cy.get('h2').contains('Password').click();
    cy.get('.submit_button').should('be.enabled');
    cy.get('.submit_button').click();

    // Assert that both input and password error messages are not shown
    // next 2 lines check exactly the same, but using different approach
    cy.get('#input_error_message').should('not.be.visible');
    cy.get('#password_error_message').should('have.css', 'display', 'none');

    // Assert that successful message is visible
    // next 2 lines check exactly the same, but using different approach
    cy.get('#success_message').should('be.visible');
    cy.get('#success_message').should('have.css', 'display', 'block');
  });
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV8xX3Rlc3RfZXhlcmNpc2UuY3kuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsVUFBVSxDQUFDLE1BQU07RUFDYkMsRUFBRSxDQUFDQyxLQUFLLENBQUMsMkNBQTJDLENBQUM7QUFDekQsQ0FBQyxDQUFDOztBQUVGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFDLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxNQUFNO0VBQ3ZDQyxFQUFFLENBQUMsaUVBQWlFLEVBQUUsTUFBTTtJQUN4RTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0FILEVBQUUsQ0FBQ0ksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUNDLEtBQUssQ0FBQyxDQUFDO0lBRXpDTixFQUFFLENBQUNJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDRyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQzdDUCxFQUFFLENBQUNJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDRSxLQUFLLENBQUMsQ0FBQzs7SUFFaEM7SUFDQTtJQUNBTixFQUFFLENBQUNJLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDdkRQLEVBQUUsQ0FBQ0ksR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUNHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQzs7SUFFdkU7SUFDQTtJQUNBUCxFQUFFLENBQUNJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDRyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQy9DUCxFQUFFLENBQUNJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDRyxNQUFNLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUM7RUFDckUsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jeXByZXNzdHV0b3JpYWwvLi9jeXByZXNzL2UyZS9mb3JtXzFfdGVzdF9leGVyY2lzZS5jeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgIGN5LnZpc2l0KCdjeXByZXNzL2ZpeHR1cmVzL3JlZ2lzdHJhdGlvbl9mb3JtXzEuaHRtbCcpXHJcbn0pXHJcblxyXG4vLyBOQiEgdGhpcyBpcyBjb3B5IG9mIHJlZ2lzdHJhdGlvbl9mb3JtXzFfdGVzdC5jeS5qc1xyXG5cclxuLypcclxuVGFza3MgZG9uZSBkdXJpbmcgVlMgQ29kZSBsaXZlIGRlbW86XHJcbjEgYW5kIDIgLSBJZiB5b3Ugc2VlIHRoaXMgdGV4dCBhbmQgZm91bmQgZmlsZSBsb2NhdGlvbiBpbiBwcm9qZWN0IHRyZWUsIGdyZWF0IGpvYiFcclxuMyAtIEZpbmQgXCJNeVBhc3MxMjNcIiAtIGFuZCB0aGVuIGR1cGxpY2F0ZSBsaW5lIDIwIGJ5IHVzaW5nIFNoaWZ0ICsgQWx0ICsgRG93bkFycm93XHJcbjQgLSBVbmNvbW1lbnQgbGluZXMgMTggLSAyMVxyXG41IC0gRmluZCBhbmQgcmVwbGFjZSB1c2VybmFtZTIgdG8gdXNlcm5hbWVcclxuNiAtIGF1dG9mb3JtYXQgdGhlIGNvZGUsIHVzaW5nIFNoaWZ0ICsgQWx0ICsgRlxyXG4gKi9cclxuXHJcbmRlc2NyaWJlKCdUaGlzIGlzIGZpcnN0IHRlc3Qgc3VpdGUnLCAoKSA9PiB7XHJcbiAgICBpdCgnVXNlciBjYW4gc3VibWl0IGRhdGEgb25seSB3aGVuIHZhbGlkIG1hbmRhdG9yeSB2YWx1ZXMgYXJlIGFkZGVkJywgKCkgPT4ge1xyXG4gICAgICAgIC8vIGN5LmdldCgnI3VzZXJuYW1lMicpLnR5cGUoJ1NvbWV0aGluZycpXHJcbiAgICAgICAgLy8gY3kuZ2V0KCdbZGF0YS10ZXN0aWQ9XCJwaG9uZU51bWJlclRlc3RJZFwiXScpLnR5cGUoJzEwMjAzMDQwJylcclxuICAgICAgICAvLyBjeS5nZXQoJ2lucHV0W25hbWU9XCJwYXNzd29yZFwiXScpLnR5cGUoJ015UGFzczEyMycpXHJcbiAgICAgICAgLy8gY3kuZ2V0KCdbbmFtZT1cImNvbmZpcm1cIl0nKS50eXBlKCdNeVBhc3MxMjMnKVxyXG4gICAgICAgIC8vaW4gb3JkZXIgdG8gYWN0aXZhdGUgc3VibWl0IGJ1dHRvbiwgdXNlciBoYXMgdG8gY2xpY2sgc29tZXdoZXJlIG91dHNpZGUgdGhlIGlucHV0IGZpZWxkXHJcbiAgICAgICAgY3kuZ2V0KCdoMicpLmNvbnRhaW5zKCdQYXNzd29yZCcpLmNsaWNrKClcclxuXHJcbiAgICAgICAgY3kuZ2V0KCcuc3VibWl0X2J1dHRvbicpLnNob3VsZCgnYmUuZW5hYmxlZCcpO1xyXG4gICAgICAgIGN5LmdldCgnLnN1Ym1pdF9idXR0b24nKS5jbGljaygpXHJcblxyXG4gICAgICAgIC8vIEFzc2VydCB0aGF0IGJvdGggaW5wdXQgYW5kIHBhc3N3b3JkIGVycm9yIG1lc3NhZ2VzIGFyZSBub3Qgc2hvd25cclxuICAgICAgICAvLyBuZXh0IDIgbGluZXMgY2hlY2sgZXhhY3RseSB0aGUgc2FtZSwgYnV0IHVzaW5nIGRpZmZlcmVudCBhcHByb2FjaFxyXG4gICAgICAgIGN5LmdldCgnI2lucHV0X2Vycm9yX21lc3NhZ2UnKS5zaG91bGQoJ25vdC5iZS52aXNpYmxlJylcclxuICAgICAgICBjeS5nZXQoJyNwYXNzd29yZF9lcnJvcl9tZXNzYWdlJykuc2hvdWxkKCdoYXZlLmNzcycsICdkaXNwbGF5JywgJ25vbmUnKVxyXG5cclxuICAgICAgICAvLyBBc3NlcnQgdGhhdCBzdWNjZXNzZnVsIG1lc3NhZ2UgaXMgdmlzaWJsZVxyXG4gICAgICAgIC8vIG5leHQgMiBsaW5lcyBjaGVjayBleGFjdGx5IHRoZSBzYW1lLCBidXQgdXNpbmcgZGlmZmVyZW50IGFwcHJvYWNoXHJcbiAgICAgICAgY3kuZ2V0KCcjc3VjY2Vzc19tZXNzYWdlJykuc2hvdWxkKCdiZS52aXNpYmxlJylcclxuICAgICAgICBjeS5nZXQoJyNzdWNjZXNzX21lc3NhZ2UnKS5zaG91bGQoJ2hhdmUuY3NzJywgJ2Rpc3BsYXknLCAnYmxvY2snKVxyXG4gICAgfSk7XHJcbn0pIl0sIm5hbWVzIjpbImJlZm9yZUVhY2giLCJjeSIsInZpc2l0IiwiZGVzY3JpYmUiLCJpdCIsImdldCIsImNvbnRhaW5zIiwiY2xpY2siLCJzaG91bGQiXSwic291cmNlUm9vdCI6IiJ9