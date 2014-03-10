$(function(){
   
module('App js');
gathrApp = GathrNamespace("Gathr.UTIL");
test('getFormattedPrice',function(){
    expect(2);
    equal(gathrApp.getFormattedPrice(30.3444),30.34,'passed');
    equal(gathrApp.getFormattedPrice(30.00),30.00,'passed');
})
test('getEnvDetail',function(){
    expect(1);
    equal(gathrApp.getEnvDetail(),'dev','current env is set as dev');
})
test('isEnvStaging',function(){
    expect(1);
    equal(gathrApp.isEnvStaging(),false,'current env is not staging');
})
test('getSiteDomain',function(){
    expect(1);
    var getEnv = gathrApp.getEnvDetail()+".gathr.com";
    equal(gathrApp.getSiteDomain(),getEnv,'site domain'+gathrApp.getSiteDomain());
})

module("Mock Ajax", {
    setup: function () {
        $.mockjax({
            url:"/mockedservice",
            contentType:"text/json",
            responseText:{bla:'Test'}
        });
    },
    teardown: function () {
        $.mockjaxClear();
    }
});
asyncTest("Test I get a mocked response from a service", function () {
    $.getJSON("/mockedservice", function (response) {
        console.log(response);
        ok(response,"got some response");
       equal(response.bla, 'Test', "response was not Test");
        start();
    });
});

});
/* module('Module A');
test('isEven()', function() {
    ok(isEven(0), 'Zero is an even number');
    ok(isEven(2), 'So is two');
    ok(isEven(-4), 'So is negative four');
    ok(!isEven(1), 'One is not an even number');
    ok(!isEven(-7), 'Neither is negative seven');
    // Fails
    ok(isEven(3), 'Three is an even number');
})

test('assertions', function() {
    equal( 1, 1, 'one equals one');
})
module('Module B');
var isPalin = function( str ){ return (str.split('').reverse().join('') == str) ? true : false; };

module( 'Palin Test' ); 
test( 'isPalin()', function() { 
    expect( 1 ); 
    equal( isPalin('madam'), true, 'Test a true palindrome' ); 
    notEqual( isPalin('world'), true, 'Test a false palindrome');
}); 
var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=austin,tx&format=json&jsoncallback=?";

var stubbedJSON = function(url,data,callback,format){
        callback({'title':'test'});
    };
    var originalJSON = $.getJSON;
    module("stubbing out getJSON", {setup: function(){
        $.getJSON = stubbedJSON;
    }, teardown: function(){
      $.getJSON = originalJSON;  
    }})
    test("getJSON should be stubbed",function(){
        expect(1);
        var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=austin,tx&format=json&jsoncallback=?";
        $.getJSON(url,null,function(data){
            equal(data.title,"fake results");
        });
    });


$(document).ready(function(){
    test("should get results from getJson call",function(){
        expect(1);
        var results;
        $(document).ajaxComplete(function(){
            start();
            equals(results.title,"Recent Uploads tagged austin and tx","actual: " + results.title);
        });
        stop();
        $.getJSON(url,null,function(data){
            results = data;
        });
    })

});*/