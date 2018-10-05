(function() {

  angular.module('ellora')

  .factory('HttpService', function($http) {
    var obj = {}

    obj.post = function(path, data){
       return  $http.post('/API/' + path, data, {withCredentials: true})
    },

    obj.get = function(path){
       return  $http.get('/API/' + path)

    }

    return obj;
  })

  .factory('LoginService', [
  "$cookies", function($cookies) {
    var admin = 'admin';
    var pass = 'curryking';
    var isAuthenticated = false;
    
    return {
      login : function(username, password) {
        isAuthenticated = username === admin && password === pass;
        //$cookies.put("admin", isAuthenticated);
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      }
    };
    
  }]);


})();
