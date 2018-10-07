const RTCBus = require('../lib');

RTCBus.getBusStatus().then(resp => {
  console.log(Object.entries(resp).length);
  Object.entries(resp).
      forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
  return resp;
}).catch(err => {
  console.log('Error:' + err);
});