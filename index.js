const {HTTP, XML, debug} = require('./Utils');
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

fetch.Promise.all(requests).
    then(resp => {
      const [bus, statuses] = resp;
      const s = statuses.map(status => bus[status.mid] ? {...status, ...bus[status.mid]} : status);
      console.log(s);
    }).
    catch(err => {
      console.log('got error when performing http requests');
    });

