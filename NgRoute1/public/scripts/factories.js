"use strict";

//just a shared utility flag
var allowed = false;


//here is a (scripted) example of template selection
//however, this logic could be implemented on the server side,
//or even by a database content
var myTemplateSelector = function (scope) {
    var ab = "ABCDEFGH";
    
    var svc = scope.locPath.getService();
    
    if (!svc) {
        //no "service" specified:
        //yield the home page, but only for the root path
        if (scope.locPath.getIsRoot()) {
            return "partials/home";
        }
    }
    else {
        //a trivial template selection based on the service name
        var id = _.first(scope.locPath.getIds());
        switch (svc) {
            case "page":
                return "partials/page" + ab[parseInt(id)];

            case "about":
            case "home":
                return "partials/" + svc;

            case "contact":
                return "partials/" + (allowed ? svc:"tplerror");
        }
    }
}


//here is how could look the "template manager"
scotchApp.factory(
    "TplMgr",
    function () {
        
        var init = function (scope, location, options) {
            options = options || {};
            
            //walk up the scope-tree to find the closest ancestor
            //which exposes the template manager
            var p = scope.$parent;
            while (p) {
                if (p.locPath) break;
                p = p.$parent;
            }
            
            //when there's no ancestor, it means this is the root
            var isScopeRoot = p == null;
            
            //the location-path updater
            //this is the trickiest part of the game: the current browser location
            //is analyzed then compared to the assigned one to the scope (at the init time)
            //the resulting template selection is based on the comparison
            var update = function () {
                var lp = new LocPath(location.path());
                while (isScopeRoot && !lp.getIsRoot()) {
                    lp = new LocPath(lp.getBase());
                }
                scope.locPath = isScopeRoot ? lp : p.locPath.getRelative(lp);
            }
            
            //update the location-path for the first time
            update();
            
            //expose the ngInclude's template-selector
            //this function is apparently called on every change anywhere
            scope.headerTemplateSelector = function () {
                update();
                return myTemplateSelector(scope);
            }
            
            //when requested, init the selector's stuffs for the scope
            if (options.selectionChanged) {
                scope.selector = {
                    items: [],
                    selected: null
                }
                
                scope.$watch("selector", options.selectionChanged, true);
            }
        }
        
        return {
            init: init
        }
    });

