var _ = require('underscore');
var EventEmitter = require('events');
var wordlist = require('./wordlist');
var dictionary = require('dictionary-en-gb');
var nspell = require('nspell');
var util = require('util');

/**
 * Creates a spell-check provider to be passed to
 * `webFrame.setSpellCheckProvider`.
 * 
 * 
 * @return {SpellCheckProvider}
 */
var SpellCheckProvider = function() {
  EventEmitter.call(this);    
  
  dictionary(function (err, dict) {
    if (err) {
      throw err;      
    }
    
    this._nspellInstance = nspell(dict);    
    init();    
  });   
};


function init() {
  console.log("processing " + wordlist.length + " words");
  //initialise missing words from our wordlist      
  for(i = 0; i < wordlist.length; i += 2) {
    var ukTerm = wordlist[i];
    var usEquiv = wordlist[i+1];       
      
    if(ukTerm !== usEquiv) {
      if(this._nspellInstance.spell(usEquiv).correct) {        	
        this._nspellInstance.remove(usEquiv);  	
      }
    } 
    if(!this._nspellInstance.spell(ukTerm).correct) {            
      this._nspellInstance.add(ukTerm);
    }
  }      
};

util.inherits(SpellCheckProvider, EventEmitter);

_.extend(SpellCheckProvider.prototype, {
    spellCheck : function(text) {
	if(text !== '' && !this.correct(text)) {	    
	    this.emit('misspelling', _nspellInstance.suggest(text));
	    return false;
	} else {
	    this.emit('clear');
	    return true;
	}	
    },	 
    suggest : function(text) {	    
      if(text !== '') {
        return _nspellInstance.suggest(text);
      }
      return [];
    },
    correct : function(text) {      
      if(text !== '') {	  
        return _nspellInstance.correct(text);
      }
      return true;
    },
    spell : function(text) {
      if(text !== '') {
        return _nspellInstance.spell(text);  
      }	      
    },
    add : function(text) {
      if(text !== '') {
        _nspellInstance.add(text); 	
      }	    
    },
    remove : function(text) {
      if(text !== '') {
        _nspellInstance.remove(text);
      }    
    },
    getWordList : function() {
	return wordlist;
    }
});

module.exports = SpellCheckProvider;
