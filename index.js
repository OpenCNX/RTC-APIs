const {HTTP, XML} = require('./Utils');

HTTP.get('http://chiangmaibackend.yusai.asia/smartapp/APIBUSNEW/bus_kku.php').
    then(resp => resp.text()).
    then(async xml => {
      const json = await XML.parseStringPromise(xml);
      const transformed = json.eyefleet.data.map(node => {
        let n = node['$'];
        n.cos = parseInt(n.cos, 10);
        n.spd = parseInt(n.spd, 10);
        n.acc = n.acc.toLowerCase() === 'false';
        return n;
      });
      console.log(transformed);
    });