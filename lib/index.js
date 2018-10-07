const {HTTP, XML, debug} = require('../lib/utils');
const fetch = require('node-fetch');

const processingXML = async xml => {
  debug('parsing xml');
  const json = await XML.parseStringPromise(xml);
  debug('xml parsed');
  return json.eyefleet.data.map(node => {
    let n = node['$'];
    debug(`processing json id=${n.mid}`);
    n.cos = parseInt(n.cos, 10);
    n.spd = parseInt(n.spd, 10);
    n.acc = n.acc.toLowerCase() === 'false';
    return n;
  });
};

const generateObjectWithKey = arr => {
  return arr.reduce((obj, bus) => {
    obj[bus.gps_box] = bus;
    return obj;
  }, {});
};

const requests = [
  HTTP.get('http://chiangmaibackend.yusai.asia/smartapp/APIBUSNEW/APIThebus.php').
      then(resp => resp.json()).
      then(generateObjectWithKey),
  HTTP.get('http://chiangmaibackend.yusai.asia/smartapp/APIBUSNEW/bus_kku.php').
      then(resp => resp.text()).
      then(processingXML),
];

module.exports = {
  getBusStatus: () => fetch.Promise.all(requests).
      then(resp => {
        const [bus, statuses] = resp;
        return statuses.map(status => bus[status.mid] ? {...status, ...bus[status.mid]} : status);
      }).
      then(buses => {
        return buses.reduce((obj, bus) => {
          const {
            mid, date, lat, lng, spd, cos,
            acc, line, mileage, bus_number, license_plate,
          } = bus;
          obj[bus.mid] = {mid, date, lat, lng, spd, cos, acc, line, mileage, bus_number, license_plate};
          return obj;
        }, {});
      }).
      catch(err => {
        console.log('got error when performing http requests');
      }),
};
