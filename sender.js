"use strict";
define([
        "superagent"
    ], function(superagent){

    /*template*/
    var Template = function(tplString){
        this.string = tplString;    
    };

    Template.fast = function(string, settings, getter){
        var t = new Template(string);
        return t.make(settings, getter);
    };

    Template.prototype = {
        fast : Template.fast,
        get string(){
            return this._string;
        },
        set string(value){
            this._string = value;
            this.update();
        },
        update : function(){
            var matches = this._string.match(/\{{[^${]*}}/g) || [];
            var vars = [];

            for (var a = 0, l = matches.length, name; a < l; a++){
                name = matches[a].substring(2, matches[a].length - 2);
                if (vars.indexOf(name) < 0) vars.push(name);
            }

            this._vars = vars;
        },
        make : function(settings, /*func*/getter){
            var string = this._string;
            var vars = this._vars;

            if (getter){
                for (var a = 0, l = vars.length; a < l; a++){
                    string = string.replace(new RegExp("\\{{" + vars[a] + "}}", "g"), (getter(vars[a], settings)));
                }

            } else {
                for (var a = 0, l = vars.length; a < l; a++){
                    if (settings[vars[a]]) string = string.replace(new RegExp("\\{{" + vars[a] + "}}", "g"), (settings[vars[a]]));
                }

            }

            
            return string;
        }
    };

    var sender;


    /*sender*/
    var Sender = function(newInstance){

        if (newInstance != true && sender instanceof Sender){
            return sender;
        }

        this._superagent = superagent;
        this._presets = {};
        this._vars = {};

        sender = this;

    };

    Sender.prototype = {
        onResponse : null,
        onError : null,
        set : function(type, name, value){
            if (type = "var"){
                this._vars[name] = value;
            }
        },
        get vars(){
            return this._vars;
        },
        set vars(data){
            for (var k in data){
                this._vars[k] = data[k];
            }
        },
        get presets(){
            return this._presets;
        },
        set presets(data){
            for (var k in data){
                this._presets[k] = data[k];
                this._presets[k].name = k;
            }
        },
        _onresponse : function(xhr, options, data, error, response){
            if (this.onResponse){
                this.onResponse(new this.Response(error, response || null, xhr, options, data));
            }

            if (this.onError && error){
                this.onError(new this.Response(error, response || null, xhr, options, data));
            }

            if (options.callback){
                options.callback(new this.Response(error, response || null, xhr, options, data));
            }

        },
        request : function(options, data){
            if (typeof options == "string"){
                var name = options;
                return this.request(this._presets[name], data);
            } else {
                this.send(options, data);
            }
        },
        send : function(options, data){
            var method = options.method || "get";
            var url    = Template.fast(options.url, this._vars);

            if (data && data.vars) url = Template.fast(url, data.vars);


            var mime   = options.mime || "form";
            var action = method == "get" ? "send" : "query";

            var xhr = superagent[method](url);

            xhr.type(mime);
            xhr.send(data ? data.body : undefined);
            xhr[action](data ? data.body : undefined);

            if (options.headers){
                this.setHeaders(xhr, options.headers);
            }

            xhr.end(this._onresponse.bind(this, xhr, options, data));

        },
        setHeaders : function(xhr, headers){
            for (var k in headers){
                xhr.set(k, Template.fast(headers[k], this._vars));
            }
        },
        Response : function(error, response, xhr, options, data){
            this.error = error;
            this.response = response;
            this.body = response.body;
            this.xhr = xhr;
            this.options = options;
            this.name = options.name;
            this.request = data;
        }
    };

    return Sender;

});