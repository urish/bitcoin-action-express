// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// We need the Assistant client for all the magic here
import { DialogflowApp } from 'actions-on-google';
// To make our http request (a bit nicer)
import * as request from 'request';
import * as express from 'express';
import { json } from 'body-parser';

// Some variables we will use in this example
const ACTION_PRICE = 'price';
const ACTION_TOTAL = 'total';
const EXT_BITCOIN_API_URL = "https://blockchain.info";
const EXT_PRICE = "/q/24hrprice";
const EXT_TOTAL = "/q/totalbc";

const expressApp = express();
expressApp.use(json());


// [START bitcoinInfo]
expressApp.post('/', (req, res) => {
  const app = new DialogflowApp({ request: req, response: res });
  console.log('bitcoinInfoAction Request headers: ' + JSON.stringify(req.headers));
  console.log('bitcoinInfoAction Request body: ' + JSON.stringify(req.body));

  // Fulfill price action business logic
  function priceHandler(assistant) {
    request(EXT_BITCOIN_API_URL + EXT_PRICE, function (error, response, body) {
      // The fulfillment logic for returning the bitcoin current price
      console.log("priceHandler response: " + JSON.stringify(response) + " Body: " + body + " | Error: " + error);
      const msg = "Bitcoin is " + body + " USD! Why didn't you buy it in 2012? You could have been rich!";
      assistant.tell(msg);
    });
  }

  // Fulfill total bitcoin action 
  function totalHandler(assistant) {
    request(EXT_BITCOIN_API_URL + EXT_TOTAL, function (error, response, body) {
      console.log("totalHandler response: " + JSON.stringify(response) + " Body: " + body + " | Error: " + error);
      // The fulfillment logic for returning the amount of bitcoins in the world
      const billionsBitcoins = body / 1000000000;
      const msg = "Right now there are " + billionsBitcoins + " billion bitcoins around the world.";
      assistant.tell(msg);
    });
  }

  // The Entry point to all our actions
  const actionMap = new Map();
  actionMap.set(ACTION_PRICE, priceHandler);
  actionMap.set(ACTION_TOTAL, totalHandler);

  app.handleRequest(actionMap);
});
// [END bitcoinInfo]

expressApp.get('/', function (req, res) {
  res.send('It really works 😹!');
});

expressApp.listen(8080);
