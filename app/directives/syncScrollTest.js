'use strict';

describe('myApp module', function() {

  var compile, scope, directiveElem;

  var testCode = "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n" +
                  "This\nis\nseveral\nlines\nof\ntext\nfor\ntesting\npurposes\n"

  beforeEach(function () {
    module('myApp');

    inject(function ($compile, $rootScope) {
      compile = $compile;
      scope = $rootScope.$new();
    });

    directiveElem = getCompiledElement();
  });

  function getCompiledElement() {
    var element = angular.element(
      '<div sync-scroll >' +
        '<textarea style="height:100px; width:100px;"></textarea>' +
        '<cont style="height:100px; width:100px; overflow:auto;">' +
          '<content></content>' +
        '</cont>' +
      '</div>');
    var compiledElement = compile(element)(scope);
    scope.$digest();
    return compiledElement;
  }

  it('should have at least two elements', function () {
    var elements = directiveElem.children();
    expect(elements.length).toBeGreaterThan(1);
  });

  it('should sync the height of child elements', function () {
    var elements = directiveElem.children();
    var ta = elements[0];
    var div = elements[1];
    ta.style.height = '500px';
    ta.style.width = '500px';
    angular.element(ta).triggerHandler('mousedown');
    angular.element(ta).triggerHandler('mousemove');
    expect(ta.style.height).toBe(div.style.height);
    expect(ta.style.width).toBe(div.style.width);
  });

  it('should sync the scroll position of child elements', function () {
    var elements = directiveElem.children();
    var ta = angular.element(elements[0]);
    var cont = angular.element(elements[1]);
    var content = cont.find('content');
    ta.val(testCode);
    content.html(testCode);
    ta[0].scrollTop = 100;
    ta.triggerHandler('scroll');
    //NOTE: This test does not actually work due to test runner limitations
    //the results below log are '0,0' see e2e test for similar test
    //console.log(ta[0].scrollHeight, cont[0].scrollHeight);
    expect(ta[0].scrollTop).toBe(cont[0].scrollTop);
  });
});