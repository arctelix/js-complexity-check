'use strict';

angular.module('myApp')
.service('jsComplexity', ['$window', function($window) {

  // Ignore all quoted strings & comments
  var reIgnore = /(?:\".*?\")|(?:\'.*?\')|(?:\/\/.*)|(?:\/\*[\W\w]*\*\/)/;

  // A decent regex only solution
  function getValidMatches(re, input){
    re = new RegExp(reIgnore.source+'|'+re.source, 'g');
    var matches, valid = [];

    while (matches = re.exec(input)) {
      var i = 0, match;

      while(i < matches.length - 1){
        i++; // zero indexes are invalid matches
        match = matches[i];
        if(match) valid.push({
          value:match,
          range:[re.lastIndex - match.length,re.lastIndex]
        });
      }
    }
    return valid;
  }

  function getTokensRegex(jsCode){
    return {
      ifelses:getValidMatches(/(if)|(else if)|(else)/, jsCode),
      switches:getValidMatches(/(case)|(default)/, jsCode),
      loops:getValidMatches(/(while)|(for)/, jsCode)
    };
  }

  // There seems to be some variation in how complexity is calculated
  // https://www.cqse.eu/en/blog/mccabe-cyclomatic-complexity/
  function calculateComplexity(tokenGroups){
    var tokens, complexity = 1;
    for (var k in tokenGroups){
      tokens = tokenGroups[k];
      complexity += tokens.length;
    }
    return complexity;
  }

  function getTokensEsprima(jsCode){
    var token, tokenNext, groupKey, currentGroup,
        i = 0,
        tokenGroups = {},
        allTokens = $window.esprima.tokenize(jsCode, {range:true});

    var groupKeys = {
      'if':'ifelses',
      'else':'ifelses',
      'else if':'ifelses',

      'case':'switches',
      'default':'switches',

      'for':'loops',
      'while':'loops'
    };

    // Sort esprima tokens into tokenGroups
    while (i < allTokens.length - 1){
      token = allTokens[i];
      i++;

      if (token.type != 'Keyword')
        continue;

      tokenNext = allTokens[i];
      groupKey = undefined;

      // Convert 'else' 'if' sequence to a 'else if' token
      if (token.value == 'else' && tokenNext.value == 'if' &&
            token.range[1] === tokenNext.range[0] - 1 ) {
        token.value = 'else if';
        token.range = [token.range[0], tokenNext.range[1]];
        allTokens.splice(i, 1);
        groupKey = 'ifelses';
      }

      // Convert token.value to groupKey
      groupKey = groupKeys[token.value];

      if (!groupKey)
        continue;

      currentGroup = tokenGroups[groupKey];

      // initialize or increment current key
      if (currentGroup){
        currentGroup.push(token);
      }else{
        tokenGroups[groupKey] = [token];
      }
    }
    return tokenGroups;
  }

  function evaluateRegex(jsCode){
    var tokens = getTokensRegex(jsCode);
    var complexity = calculateComplexity(tokens);
    return {complexity:complexity, tokens:tokens};
  }

  function evaluateEsprima(jsCode){
    var tokens = getTokensEsprima(jsCode);
    var complexity = calculateComplexity(tokens);
    return {complexity:complexity, tokens:tokens};
  }

  function tokenizeText(text, tokens){
    var wrappedText  = "",
        allTokens   = [],
        lrStart     = 0, // last range start
        lrEnd       = 0, // last range end
        pathNum     = 1; // running total of progrom paths

    // Add all tokens to one list
    for (var k in tokens){
      if (tokens.hasOwnProperty(k))
        allTokens = allTokens.concat(tokens[k]);
    }

    sortTokens(allTokens);

    // wrap keywords in token tags
    for (var i in allTokens){

      var token     = allTokens[i],
          iStart    = token.range[0],
          iEnd      = token.range[1];

      token.path = pathNum;
      pathNum++;

      wrappedText += text.slice(lrEnd, iStart);
      wrappedText += '<token>'+text.slice(iStart, iEnd)+'<span>path #'+token.path+'</span></token>';

      lrStart = iStart;
      lrEnd = iEnd;
    }
    wrappedText += text.slice(lrEnd);
    wrappedText = wrappedText.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    return wrappedText;
  }

  function sortTokens(tokens){
    tokens.sort(function (a, b) {
      return a.range[0] - b.range[0]
    });
    return tokens
  }

  this.evaluate = function(jsCode, mode) {
    var result;

    if(mode == 'esprima')
      result = evaluateEsprima(jsCode);
    else
      result = evaluateRegex(jsCode);

    result.text = tokenizeText(jsCode, result.tokens);

    return result;
  }
}]);