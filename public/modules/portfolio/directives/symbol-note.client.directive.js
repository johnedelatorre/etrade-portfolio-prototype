'use strict';
angular.module('portfolio').directive('symbolNote', ['$popover',
    function($popover) {
        return {
	    template: '<span ng-class="{\'et-icon-document-alt\':!note, \'et-icon-document\':note}" title="Add Note" bs-popover data-template="/modules/portfolio/views/partials/symbol-note.client.view.html" data-placement="bottom-right"></span>',
            restrict: 'EA',
            replace: true,
            link: function postLink($scope, $element, $attrs) {
            },
            controller: function($scope, $element, $attrs) {
            	//PLEASE REWRITE ME. THIS IS AWFUL.
                $scope.symbolNote = $scope.position._id + '-note';
        		$scope.note = localStorage.getItem($scope.symbolNote) || '';
                $scope.saveNote = function(note) {
                    if (note.length > 0) {
                        localStorage.setItem($scope.symbolNote, note);
                        $scope.note = note;
                    } else {
                        localStorage.removeItem($scope.symbolNote);
                        $scope.note = '';
                    }
                };
            }
        };
    }
]);