/* jslint node: true */
"use strict";

/**
 * A module that contains the main system object!
 * @module securitySystem
 */

var securityList = [];


/**
 * Creates a security with the given name.
 * @param {String} name - The name of the security.
 */
function Security(name) {
    this.name = name;
    this.trades = [];
    this.sells =[];
    this.buys = [];

    this.addTrade = function(trade){
      this.trades.push(trade);
    };

    this.addBuy = function(trade){
      this.buys.push(trade);
    };

    this.addSell = function(trade){
      this.sells.push(trade);
    };

    this.removeOrder = function(id){
      var found = false;

      for(var i = 0; i < this.sells.length; i++) {
        if(this.sells[i].id === id) {
          found = true;
          this.sells.splice(i, 1);
        }
      }

      if(!found){
        for(var i = 0; i < this.buys.length; i++) {
          if(this.buys[i].id === id) {
            this.buys.splice(i, 1);
          }
        }
      }
    };
}



/**
 * Creates a security with the given name.
 * @param {String} name - The name of the security.
 */
 //CHECK IF ALREADY IN LIST, IF SO DONT ADD IT, we dont want duplicates
exports.addSecurity = function (name) {
  var exists = false;

  for(var i=0; i < securityList.length; i++){
    var ExistingName = securityList[i].name;
    
    if(name === ExistingName){
      exists = true;
      break;
    }  
  }

  if(!exists){
    var newsecurity = new Security(name);
    securityList.push(newsecurity);
  }
};

/**
 * Returns all the securitys.
 */
exports.getSecurities = function() {
  return securityList;
};

/**
 * Removes the security object with the matching name.
 * @param {String} name - The name of the security.
 */
exports.removeSecurity = function(name){
  for (var i = 0; i < securityList.length; i++) {
    var security = securityList[i];
    if (security.name === name) {
      securityList.splice(i, 1);
      security.remove();
      break;
    }
  }
};

/**
 * Return the security object with the matching name.
 * @param {String} name - The name of the security.
 */
exports.findSecurity = function(name) {
  for (var i = 0; i < securityList.length; i++) {
    if (securityList[i].name === name) {
      return securityList[i];
    }
  }
};


