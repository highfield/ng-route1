"use strict";


scotchApp.controller(
    'navController', 
    function ($scope, $location, TplMgr) {
        //init the template manager for the current scope
        TplMgr.init($scope, $location);
    });


scotchApp.controller(
    'homeController', 
    function ($scope) {
        $scope.message = 'Everyone come and see how good I look!';
    });


scotchApp.controller(
    'aboutController', 
    function ($scope) {
        $scope.message = 'Look! I am an about page.';
    });


scotchApp.controller(
    'contactController', 
    function ($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });


scotchApp.controller(
    'pageAController', 
    function ($scope, $location, TplMgr) {
        
        var scopeOptions = {
            selectionChanged: function (newValue, oldValue) {
                //navigate somewhere upon a valid selection
                if (newValue && newValue.selected) {
                    var path = $scope.locPath.composeUrl({
                        svc: "page", 
                        ids: [newValue.selected.id]
                    });
                    $location.path(path);
                }
            }
        }
        
        //init the template manager for the current scope
        TplMgr.init(
            $scope, 
            $location, 
            scopeOptions
        );
        
        $scope.message = 'Message "A".';
        
        //set the list's available options
        $scope.selector.items = [
            { text: "Page 'C'", id: 2 },
            { text: "Page 'A'", id: 0 },
            { text: "Page 'B'", id: 1 }
        ];
        
        
        //nothing special
        $scope.dummy = null;
    
    });


scotchApp.controller(
    'pageBController', 
    function ($scope) {
        $scope.message = 'Message "B".';
        
        //expose the flag for dis/allowing the access to some pages
        $scope.allow = allowed;
        $scope.$watch("allow", function () { allowed = $scope.allow; });
    });


scotchApp.controller(
    'pageCController', 
    function ($scope) {
        $scope.message = 'Message "C".';
    });
