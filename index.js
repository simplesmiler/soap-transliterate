// const soap = require('soap-server');
//
// function LangService() {
//   // @NOOP
// }
//
// LangService.prototype.transliterate = function (text) {
//   return transliterate(text);
// };
//
// const soapServer = new soap.SoapServer();
// soapServer.addService('lang', new LangService());
//
// soapServer.listen(1337, '0.0.0.0');

const fs = require('fs');
const soap = require('soap');
const { transliterate } = require('transliteration');

const services = {
    Lang: {
        LangSoap: {
            Transliterate(args) {
                return transliterate(args.InputText);
            },

            // // This is how to define an asynchronous function with a callback.
            // MyAsyncFunction: function(args, callback) {
            //     // do some work
            //     callback({
            //         name: args.name
            //     });
            // },
            //
            // // This is how to define an asynchronous function with a Promise.
            // MyPromiseFunction: function(args) {
            //     return new Promise((resolve) => {
            //         // do some work
            //         resolve({
            //             name: args.name
            //         });
            //     });
            // },
            //
            // // This is how to receive incoming headers
            // HeadersAwareFunction: function(args, cb, headers) {
            //     return {
            //         name: headers.Token
            //     };
            // },
            //
            // // You can also inspect the original `req`
            // reallyDetailedFunction: function(args, cb, headers, req) {
            //     console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
            //     return {
            //         name: headers.Token
            //     };
            // }
        }
    }
};

const express = require('express');
const app = express();

const audit = require('express-requests-logger');
app.use(audit());

const bodyParser = require('body-parser');
app.use(bodyParser.raw({ type: () => true, limit: '5mb' }));

const xml = fs.readFileSync('lang.wsdl', 'utf8');
app.listen(1337, function() {
   // Note: /wsdl route will be handled by soap module
   // and all other routes & middleware will continue to work
   soap.listen(app, '/lang', services, xml);
});