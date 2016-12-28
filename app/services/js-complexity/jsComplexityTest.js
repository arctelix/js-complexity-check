'use strict';

// TODO: Toggle parser with test runner

describe('myApp.jsComplexity Service', function() {

  beforeEach(module('myApp'));

  var parser = 'esprima'; // 'regex' or 'esprima'

  describe('jsComplexity Service', function(){

    it('should exist', inject(function(jsComplexity) {
      expect(jsComplexity).toBeDefined();
      expect(jsComplexity.evaluate).toBeDefined();
    }));

    // if, else, else if tests
  
    it('should evaluate a single if correctly with ' + parser, inject(function(jsComplexity) {
       expect(jsComplexity.evaluate('function check(a){ if(a){return a;}}', parser).complexity-1).toEqual(1);
    }));
  
    it('should evaluate an if, else correctly with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a){return a;}else{return 0;}}', parser).complexity-1).toEqual(2);
    }));
  
    it('should evaluate an if, else if, else correctly with regex ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return a;}else if(a=0){return 2;}else{return 0;}}', parser).complexity-1).toEqual(3);
    }));

    it('should evaluate an if, else if (2), else correctly with regex ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return a;}else if(a=-1){return 1;}else if(a=0){return 2;}else{return 0;}}', parser).complexity-1).toEqual(4);
    }));

    // switch, case, default tests

    it('should evaluate a switch, case correctly with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(x){case 1:return 1;}', parser).complexity-1).toEqual(1);
    }));

    it('should evaluate a switch, case (2) correctly with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(x){case 1:return 1;case 2:return 2;}', parser).complexity-1).toEqual(2);
    }));

    it('should evaluate a switch, case (2), default correctly with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ switch(x){case 1:return 1;case 2:return 2;default:return 0;}', parser).complexity-1).toEqual(3);
    }));


    // loop tests

    it('should evaluate a for loop correctly with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ for(var i in x){console.log(x[i]);}', parser).complexity-1).toEqual(1);
    }));

    it('should evaluate a while loop correctly with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ while(x){console.log(x);}', parser).complexity-1).toEqual(1);
    }));


    // Test ignored conditions

    it('should ignore conditions in double quoted strings with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ if(a=1){return "if";}else{return "else";}}', parser).complexity-1).toEqual(2);
    }));

    it('should ignore conditions in single quoted strings with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate("function check(a){ if(a=1){return 'if';}else{return 'else';}}", parser).complexity-1).toEqual(2);
    }));

    it('should ignore conditions in line comments with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ // if else case for while \n if(a=1){return 0;}else{return 1;}}', parser).complexity-1).toEqual(2);
    }))

    it('should ignore conditions in multi-line comments with ' + parser, inject(function(jsComplexity) {
      expect(jsComplexity.evaluate('function check(a){ /* if else \n case \n for \n while */ if(a=1){return "if";}else{return "else";}}', parser).complexity-1).toEqual(2);
    }))


  });
});
  