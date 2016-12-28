'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('JS Complexity', function() {

  var testCode =  [
    "/* The initial complexity for a function is 1.\n",
    " For each branch or loop, 1 is added to the total. \n",
    " The complexity for the function below is 8 */\n",
    "\n",
    "// this if else will not be counted\n",
    "\n",
    "function a(x) {\n",
    "    if (!x) {\n",
    "        return 'if x is falsy'; // 2nd path\n",
    "    }\n",
    "    else if (isNaN(parseInt(x)) {\n",
    "        return 'else if x is not an int'); // 1st path\n",
    "    }\n",
    "    else {\n",
    "        console.log('else x is an integer'; // 3rd path\n",
    "    }\n",
    "\n",
    "    switch (x) {\n",
    "        case 1:\n",
    "            return 'case 0'; // 4th path\n",
    "        case 2:\n",
    "            return 'case 1'; // 5th path\n",
    "        default:\n",
    "            console.log('default'); // 6th path\n",
    "    }\n",
    "\n",
    "    for (var i in list) {\n",
    "        // 7th path\n",
    "        console.log('for index:' + i)\n",
    "    }\n",
    "}"
  ].join('');

  beforeEach(function () {
    browser.get('index.html');
  });

  it('should automatically redirect to / when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });

  it('should have an empty textarea on load', function () {
    var e = element(by.css('#check-form textarea'));
    expect(e.getAttribute("value")).toBe('');
  });

  it('should add demo text to textarea when "demo" is clicked', function () {
    element(by.css('#check-form [value="demo"]')).click().then(function () {
      var e = element(by.model('main.evalCode'));
      expect(e.getAttribute("value")).not.toBe('');
    });
  });

  it('should display the complexity number after "demo" is clicked', function () {
    element(by.css('#check-form [value="demo"]')).click().then(function () {
      var e = element(by.css('#total span'));
      expect(e.getText()).toBe('8');
    });
  });

  it('should display the complexity number after user input', function () {
    element(by.css('#check-form textarea')).sendKeys(testCode).then(function () {
      var e = element(by.css('#total span'));
      expect(e.getText()).toBe('8');
    });
  });

  it('should reset the textarea when "reset" is clicked', function () {
    element(by.css('#check-form textarea')).sendKeys(testCode);
    element(by.css('#check-form [value="reset"]')).click().then(function () {
      var e = element(by.css('#check-form textarea'));
      expect(e.getAttribute("value")).toBe('');
    });
  });

  it('should change and display the parser mode when "mode" is clicked', function () {
    element(by.css('#check-form [value="mode"]')).click().then(function () {
      var e = element(by.css('#check-form .actions .label'));
      expect(e.getText()).toBe('using regex engine');
    });
  });

  it('should sync the scroll position of textarea and overlay', function () {

    element(by.css('#check-form [value="demo"]')).click().then(function () {
      var directiveElem = element(by.css('#check-form .input-sync'));
      var ta = directiveElem.element(by.css('textarea'));
      var cont = directiveElem.element(by.css('tokenized'));
      browser.executeScript("document.getElementsByTagName('textarea')[0].scrollTop = 100;").then(function () {
        expect(ta.getAttribute('scrollTop')).toBe('100');
        expect(cont.getAttribute('scrollTop')).toBe('100');
      });
    });
  });
});
