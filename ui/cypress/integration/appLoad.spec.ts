describe('Application should load', () => {
  it('Should visit home page', () => {
    cy.visit('/');
    cy.contains('Welcome to');
  });
});
