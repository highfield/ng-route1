"use strict";

//the "LocPath" object is a modelization of a relative URL
//the model relies on a predefined path encoding:
//general schema:
//  (base)/[service/][~ID1/] ...
//the "~" symbol prefixes an identifier, otherwise it's a service
//TODO:
//  - complete the path schema to support the multi-ID
function LocPath(path) {
    var self = this;
    var base = "/";
    var svc;
    var ids = [];
    var parts = [];
    
    if (_.isString(path)) {
        //string URL
        var six = 0;
        var eix = path.length - 1;
        if (path.length > 0 && path.charAt(0) === "/") six++;
        if (eix > six && path.charAt(eix) === "/") eix--;
        
        parts = path.substring(six, eix + 1).split("/");
        var k = parts.length;
        while (--k >= 0) {
            var p;
            if ((p = parts[k]).length === 0) break;
            if (p.charAt(0) === "~") {
                ids.push(p.substr(1));
            } else {
                svc = p;
                break;
            }
        }
        
        var subparts = parts.slice(0, k);
        subparts.unshift("");
        subparts.push("");
        base = subparts.join("/");
        if (ids.length > 1) ids.reverse();
    } else if (path && path.base && _.isString(path.base)) {
        //object URL (mostly internal use)
        base = path.base;
        if (base.charAt(0) !== "/") base = "/" + base;
        if (base.charAt(base.length - 1) !== "/") base += "/";
        svc = path.svc;
        ids = path.ids || [];
        parts = path.parts || [];
    } else {
        throw new Error();
    }
    
    this.getIsRoot = function () {
        return base === "/";
    }
    
    this.getBase = function () {
        return base;
    }
    
    this.getService = function () {
        return svc;
    }
    
    this.getIds = function () {
        return _.clone(ids);
    }
    
    this.getRawParts = function () {
        return _.clone(parts);
    }
    
    this.getPath = function () {
        var url = base.split("/");
        url = url.slice(0, url.length - 1);
        if (svc) url.push(svc);
        for (var k = 0; k < ids.length; k++) {
            var id = ids[k].toString();
            if (id.charAt(0) !== "~") id = "~" + id;
            url.push(id);
        }
        url.push("");
        return url.join("/");
    }
    
    this.composeUrl = function (args) {
        var url = base.split("/");
        url = url.slice(0, url.length - 1);
        if (_.isString(args.svc)) url.push(args.svc);
        if (args.ids && _.isArray(args.ids)) {
            for (var k = 0; k < args.ids.length; k++) {
                var id = args.ids[k].toString();
                if (id.charAt(0) !== "~") id = "~" + id;
                url.push(id);
            }
        }
        url.push("");
        return url.join("/");
    }
    
    this.getRelative = function (other) {
        var thisPath = self.getPath();
        var otherPath = other.getPath();
        if (otherPath.indexOf(thisPath) !== 0) return new LocPath("");
        
        var six = thisPath.length;
        var eix = otherPath.length - 1;
        if (eix > six && otherPath.charAt(eix) === "/") eix--;
        
        var parts = otherPath.substring(six, eix + 1).split("/");
        var ids = [];
        var svc;
        for (var k = 0; k < parts.length; k++) {
            var p;
            if ((p = parts[k]).length === 0) break;
            if (p.charAt(0) === "~") {
                ids.push(p.substr(1));
            } else if (k === 0) {
                svc = p;
            } else {
                break;
            }
        }
        
        return new LocPath({
            base: thisPath,
            svc: svc,
            ids: ids,
            parts: parts
        });
    }
}

