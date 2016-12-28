'use strict';

describe('myApp module', function() {

  beforeEach(module('myApp'));

  describe('mainView controller', function(){

    var ctrl, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new(); //get a childscope
        ctrl = $controller("mainViewCtrl", {$scope:scope});
    }));

    it('should calculate complexity for demo code', function() {
      ctrl.demo();
      expect(ctrl.results.complexity).toBe(8);
    });

    it('should reset', function() {
      ctrl.demo();
      ctrl.reset();
      expect(ctrl.results).toBe(null);
      expect(ctrl.evalCode).toBe('');
    });

    it('should toggle the parsing engine',function() {
      ctrl.toggleEngine();
      expect(ctrl.engine).toBe('regex');
      ctrl.toggleEngine();
      expect(ctrl.engine).toBe('esprima');
    });

  });
});