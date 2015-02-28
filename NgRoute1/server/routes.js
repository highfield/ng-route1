"use strict";

var _ = require('lodash');
var path = require('path');


var routes = [

    // Views
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
                var requestedView = path.join('./', req.url);
                res.render(requestedView);
            }]
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
                res.render('index');
            }]
    }
];


module.exports = function (app) {
    
    _.each(routes, function (route) {
        var args = _.flatten([route.path, route.middleware]);
        
        switch (route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}
