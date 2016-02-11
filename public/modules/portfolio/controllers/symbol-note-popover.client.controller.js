'use strict';

angular.module('portfolio').controller('SymbolNotePopoverController', ['$scope',
	function($scope) {
		var symbolNote = $scope.$parent.$parent.content + '-note';
		console.log($scope);
		$scope.note = localStorage.getItem(symbolNote) || '';
		$scope.saveNote = function(){
			//Sorry about the $parent.$parent.content. It's not the right way to do this.
			if($scope.note.length > 0){
				localStorage.setItem(symbolNote, $scope.note);
			}
			else{
				localStorage.removeItem(symbolNote);
			}
			$scope.$hide();
		};
	}
]);