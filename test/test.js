var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

var webdriver = require('selenium-webdriver');
var chrome    = require('selenium-webdriver/chrome');
var extend    = require('selenium-extend');
var test      = require('selenium-webdriver/testing');
var proxy     = require('selenium-webdriver/proxy');

var helpers = require('./helpers');

var driverPath = 'bin/chromedriver';
var driver;

test.describe('Launch the prototype',function(){

  this.timeout(30000);

  test.before(function() {

    var o = new chrome.Options();
    o.setProxy(proxy.manual({http: 'http://127.0.0.1:3128'},{bypass:'http://localhost'}));

    var s = new chrome.ServiceBuilder(driverPath).build(); 
    driver = chrome.createDriver(o, s);
    extend.addExtend(driver);

    driver.get('localhost:3000');

    driver.sleep(1000);

  });

  test.it('Navigate to the Trade Ticket',function(next){
    
    driver.findElement(webdriver.By.linkText('Trade Ticket')).click();
    driver.wait(webdriver.until.elementLocated(webdriver.By.className('trade'), 1500));

    driver.sleep(2000).then(function(){
      next();
    });

  });

  test.it('System should present user with Snapshot information in the Workspace',function(next){

    helpers.getActiveWorkspaceTabLabel(driver).then(function(txt){
      expect(txt.toLowerCase()).to.equal('snapshot');
      next();
    });

  });

  
  test.it('User can toggle to the Positions Tab in the Workspace',function(next){

    helpers.clickWorkspaceTab(2,driver).then(function(el){
      helpers.getActiveWorkspaceTabLabel(driver).then(function(txt){
        expect(txt.toLowerCase()).to.equal('positions');
        next();
      });
    });

  });

  test.it('User can toggle to the Open Orders Tab in the Workspace',function(next){

    helpers.clickWorkspaceTab(3,driver).then(function(el){
      helpers.getActiveWorkspaceTabLabel(driver).then(function(txt){
        expect(txt.toLowerCase()).to.equal('open orders');
        next();
      });
    });
    
  });

  test.it('User can toggle to the Snapshot Tab in the Workspace',function(next){

    helpers.clickWorkspaceTab(1,driver).then(function(el){
      helpers.getActiveWorkspaceTabLabel(driver).then(function(txt){
        expect(txt.toLowerCase()).to.equal('snapshot');
        next();
      });
    });
    
  });

  test.it('Add a stock symbol',function(next){

    driver.extend.typeText('[name="symbol"]','GE');

    driver.sleep(2000).then(function(){
      next();
    });

  });

  test.it('Enter a quantity',function(next){

    driver.extend.typeText('[name="shares"]',34)

    driver.sleep(2000).then(function(){
      next();
    });

  });

  test.it('Calculate the quantity',function(next){

    driver.findElement(webdriver.By.className('calculate')).click()

    driver.sleep(2000).then(function(){
      next();
    });
    
  });

  test.after(function(){
    driver.quit();
  });
  
});

