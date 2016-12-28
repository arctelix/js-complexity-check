'use strict';

angular.module('myApp')
  .controller('mainViewCtrl', ['$scope', '$sce', 'jsComplexity',
    function ($scope, $sce, jsComplexity) {

      this.engine = 'esprima'

      this.demoJSCode = [
        "/* The initial complexity for a function is 1.\n",
        " * For each branch or loop, 1 is added to the total. \n",
        " * Therefore, the function below has a complexity of 8.\n",
        " *\n",
        " * Key words contributing to complexity are highlighted \n",
        " * in green and complexity is recalculated on the fly.\n",
        " */\n",
        "\n",
        "function a(x) {\n",
        "    if (!x) {\n",
        "        return 'if x is falsy'; // 1st path\n",
        "    }\n",
        "    else if (isNaN(parseInt(x)) {\n",
        "        return 'else if x is not an int'); // 2nd path\n",
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
      ]

      this.reset = function () {
        this.evalCode = '';
        this.results = null;
      };

      this.demo = function () {
        this.reset();
        this.evalCode = this.demoJSCode.join('');
        this.checkJSCode();
      };

      this.toggleEngine = function(){
        this.engine = this.engine == 'esprima' ? 'regex':'esprima'
      };

      this.checkJSCode = function () {
        this.results = jsComplexity.evaluate(this.evalCode, this.engine);
        this.results.text = $sce.trustAsHtml(this.results.text)
      };

  }]);