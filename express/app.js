const express = require('express');
const request = require('request');
var cors = require('cors')
const app = express();
const port = 3000;

app.use(cors());

app.get('/featured-homes', function(expressRequest, expressResponse) {
  var backendRequest = request({
    method: 'GET',
    url: 'https://duproprio.com/fr/api-proxy/featured-homes',
    qs:
    {
      'regions[]': '4',
      'type[]': 'house',
      'subtype[]': '4',
      lot_dimension_sq_meter: '~1000',
      online_since: '7',
      is_for_sale: '1',
      with_builders: '1',
      parent: '1',
      pageNumber: '1',
      sort: '-published_at',
      'subtype%5B%5D': '4',
      'type%5B%5D': 'house',
      'regions%5B%5D': '4'
    }
  })
  backendRequest.on('response', function(backendResponse) {
    backendRequest.pipe(expressResponse);
  });

  backendRequest.on('error', function(backendError) {
    expressResponse.statusCode = 500;
    console.error(backendError);
    expressResponse.end(backendError);
  });
  expressRequest.pipe(backendRequest)
});

app.listen(port, () => console.log(`Express is running ${port}!`));
