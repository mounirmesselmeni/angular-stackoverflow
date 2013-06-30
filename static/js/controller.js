if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
var questionsUrl = "https://api.stackexchange.com/2.1/users/{0}/questions?order=desc&sort=activity&site=stackoverflow";
var answersUrl = "https://api.stackexchange.com/2.1/users/{0}/answers?order=desc&sort=activity&site=stackoverflow";
var soApp = angular.module('soApp', []);

soApp.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = '';
});

soApp.controller('MainController',
    function MainController($scope, $http){
        
        $scope.user = '';
        $scope.loading = false;

        $scope.currentAnswersPage = 0;
        $scope.pageAnswersSize = 3;

        $scope.currentQuestionsPage = 0;
        $scope.pageQuestionsSize = 3;

        $scope.submit = function(){
            if($scope.user && $scope.user != ''){
                $scope.questions = [];
                $scope.answers = [];
                var questions_page = 1;
                var answers_page = 1;
                fetch_questions(questionsUrl.format($scope.user), 1);
                fetch_answers(answersUrl.format($scope.user), 1);
            }
        }

        $scope.numberOfAnswersPages=function(){
            if (typeof $scope.answers === "undefined") 
                return 0;
            return Math.ceil($scope.answers.length/$scope.pageAnswersSize);                
        }

        $scope.numberOfQuestionsPages=function(){
            if (typeof $scope.questions === "undefined") 
                return 0;
            return Math.ceil($scope.questions.length/$scope.pageQuestionsSize);                
        }


        fetch_answers = function(url, page){
            $scope.loading = true;
            console.log(page);
            $http.get( url+"&page="+page)
            .success(function(data) {
                $scope.answers = $scope.answers.concat(data.items);
                if(data.has_more) fetch_answers(url, page+1);
                $scope.loading = false;
                console.log($scope.answers);
            });
        }

        fetch_questions = function(url, page){
            $scope.loading = true;
            console.log(page);
            $http.get( url+"&page="+page)
            .success(function(data) {
                $scope.questions = $scope.questions.concat(data.items);
                if(data.has_more) fetch_questions(url, page+1);
                $scope.loading = false;
                console.log($scope.questions);
            });
        }

    }
);

soApp.filter('startFrom', function() {
    return function(input, start) {
        if (typeof input === "undefined") 
            return [];
        start = +start; //parse to int
        return input.slice(start);
    }
});