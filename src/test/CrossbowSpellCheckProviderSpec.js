var assert = require('assert');
var CrossbowSpellCheckProvider = require('../index.js');
var spellchecker = new CrossbowSpellCheckProvider();
var wordlist = spellchecker.getWordList();

describe('CrossbowSpellCheckerProvider: ', function() {

	it('should be able to check words in wordlist are suggested', function() {
		invalidWords = [];
		for (i = 0; i < wordlist.length; i += 2) {
			var ukTerm = wordlist[i];
			var usEquiv = wordlist[i + 1];
			if (ukTerm === usEquiv) {
				continue;
			}

			assert.equal(true, spellchecker.correct(ukTerm));
			if (spellchecker.suggest(usEquiv).indexOf(ukTerm) == -1) {
				//console.log("usEquiv:" + usEquiv);
				//console.log("suggestions:" + spellchecker.suggest(usEquiv));
				invalidWords.push(usEquiv);
			}
		}
		//console.log("invalid words:" + invalidWords);
		assert.equal(0, invalidWords.length);

	})

	xit('shouldn\'t be marking storeys as correct', function() {
		assert.equal(false, spellchecker.correct('storeys'));
	});
	
	it('should be able to handle over 50 checks', function() {
		for (i = 0; i < 100; i++) {
		  spellchecker.spellCheck("test" + i , undefined);	
		}		
	});

});
