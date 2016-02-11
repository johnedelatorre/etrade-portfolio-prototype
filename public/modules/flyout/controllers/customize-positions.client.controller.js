'use strict';

angular.module('flyout').controller('CustomizePositionsController', ['$scope',
    function($scope) {

    function changeFields(templateIndex){
        //Set all fields in allOptions to false
        var allOptions =  Object.keys($scope.config.allOptions);
        allOptions.forEach(function(field){
                $scope.config.allOptions[field].enabled = false;
        });

        Object.keys($scope.config.allOptions).forEach(function(property){
            if($scope.views[templateIndex].fields.indexOf(property) >= 0){
                $scope.config.allOptions[property].enabled = true;
            }
        });
    }
    changeFields($scope.config.currentView);
    $scope.viewName = $scope.views[$scope.config.currentView].name;

    //Consolidate allOptions (from parent controller) into a renderable array of objects for the view
    $scope.groupedFields = {};

    //There's probably a better way to do this but I converted $scope.config.allOptions from an array to an object, so this was the easiest way to change it.
    var groups = {}, allOptions = Object.keys($scope.config.allOptions), i;
        for( i=0; i< allOptions.length; i++) {
            var option = allOptions[i];
            if(!$scope.groupedFields.hasOwnProperty($scope.config.allOptions[option].group)){
                $scope.groupedFields[$scope.config.allOptions[option].group] = {fields:{}};
            }
            $scope.groupedFields[$scope.config.allOptions[option].group].fields[option] = $scope.config.allOptions[option];
        }

    $scope.$watch('config.currentView', function(templateIndex,previous){
        //To handle the case of switching to create new view, giving the view a name, then checking a box
        if(templateIndex === 4 && parseInt(previous) !== 4){
            $scope.viewName = '';
        }
    });

    //This could probably just be hard coded into the view
    $scope.colCount = function(rows, items){
        var itemCount = Object.keys(items).length,
            columns = Math.ceil(itemCount/rows);
        return '-webkit-columns: '+ columns + ';columns: ' + columns +';';
    };
    //This too
    $scope.dynamicColGridWidth = function(size, base, rows, items){
        var itemCount = Object.keys(items).length,
            columns = Math.ceil(itemCount/rows);
        return 'col-'+size+'-'+columns*base;
    };

    $scope.enabledColumns = function(options){
        var result = {};
        angular.forEach(options, function(value, key){
            if(value.enabled){
                result[key]=value;
            }
        });
        return result;
    };

    $scope.saveView = function(){
        console.log($scope.templates[$scope.config.currentView]);
        var storedViews = $scope.views;
        //Create new view
        if($scope.views[$scope.config.currentView].name === 'Create New View'){
            var newView = {
                name: $scope.viewName,
                description: 'Custom view',
                type: 'custom',
                fields: Object.keys($scope.enabledColumns($scope.config.allOptions))
                };
            storedViews.push(newView);
            localStorage.setItem('PortfolioView2', JSON.stringify(storedViews));
        } else {
        storedViews[$scope.config.currentView].name = $scope.viewName;
        storedViews[$scope.config.currentView].fields = Object.keys($scope.enabledColumns($scope.config.allOptions));
        localStorage.setItem('PortfolioView2', JSON.stringify(storedViews));
        }

        if($scope.setDefaultView){
        localStorage.setItem('defaultView', $scope.config.currentView);
        }
        console.log($scope.templates[$scope.config.currentView]);
        //Bug: clear Local storage, customize view, save. Customize that view again, click 'reset to original'
    };

    $scope.deleteView = function(){
        $scope.views.splice($scope.config.currentView,1);
        localStorage.setItem('PortfolioView2', JSON.stringify($scope.views));
        if($scope.config.defaultView === $scope.config.currentView){
            localStorage.setItem('defaultView',0);
        } else if($scope.config.defaultView > $scope.currentView){
            localStorage.setItem('defaultview',$scope.config.defaultView-1);
        }

    };
    // $scope.restoreTemplate = function(){
    //  $scope.views[$scope.config.currentView] = angular.copy($scope.templates[$scope.config.currentView]);
    //  localStorage.setItem('PortfolioView2', JSON.stringify($scope.views));
    //  changeFields($scope.config.currentView);
    // };

    $scope.nameView = function(event, viewIndex){
        $scope.viewName = event.target.dataset.viewName;
        changeFields(viewIndex);
        if($scope.viewName === 'Create New View'){
            $scope.viewName = '';
        }
    };
    }
]);
