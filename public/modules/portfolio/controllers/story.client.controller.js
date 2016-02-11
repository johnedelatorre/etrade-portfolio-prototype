'use strict';

angular.module('portfolio').controller('StoryController', ['$scope', 'api',
	function($scope, api) {
	$scope.fetchStory = function(storyId){
	    api.news(storyId,{}).$promise.then(function(res){
		var body = res.NewsResponse.News[0].companyNews.split(/<\/pre>\s*<p>/)[0].replace(/<(\\)?.*>/g, '');
		$scope.story = body;
	    });
	};

	$scope.fetchStories = function(symbol){
	    $scope.stories = api.news('marketwatch', {count:3, symbol: symbol});
	};
	}
]);