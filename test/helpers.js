var webdriver = require('selenium-webdriver');

var helpers = {};

helpers.getActiveWorkspaceTabLabel = function(driver){
  var foo = driver.extend.getText('.workspace .btn-group .btn.active');
  return foo;
}

helpers.clickWorkspaceTab = function(number,driver){
  var el = driver.findElement(webdriver.By.css('.workspace .btn-group:nth-child('+number+') .btn'));
  return el.click();
}

module.exports = helpers;