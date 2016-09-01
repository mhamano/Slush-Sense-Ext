define([
        "qlik",
        "jquery",
        /*'underscore',*/
        "./properties",
        "./initialproperties",
        "./lib/js/extensionUtils",
        "text!./lib/css/style.css"
],
function ( qlik, $, /*_,*/ props, initProps, extensionUtils, cssContent ) {
    'use strict';

    extensionUtils.addStyleToHeader(cssContent);

    console.log('Initializing - remove me');

    return {

        definition: props,

        initialProperties: initProps,

        support: {
            snapshot: true,
            export: true,
            exportData: true
        },

        //resize : function( /*$element, layout*/ ) {
            //do nothing
        //},

        // Angular Support (uncomment to use)
        //template: '',

        // Angular Controller
        //controller: ['$scope', function ($scope) {
		    //
        //}],


        paint: function ( $element /*, layout*/ ) {

            /*
            console.groupCollapsed('Basic Objects');
            console.info('$element:');
            console.log($element);
            console.info('layout:');
            console.log(layout);
            console.groupEnd();
            */

            $element.empty();
            var $helloWorld = $(document.createElement('div'));
            $helloWorld.addClass('hello-world');
            $helloWorld.html('Hello World from the extension "<%= extensionName %>"');
            $element.append($helloWorld);

            //needed for export
            return qlik.Promise.resolve();
        }
    };

});
