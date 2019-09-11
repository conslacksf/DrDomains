const axios = require('axios');
const schedule = require('node-schedule');
const bdmsdw = require('./bdmsdw.js');

var escapeRegExp = function(strToEscape) {
  return strToEscape.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var trimChar = function(origString, charToTrim) {
    charToTrim = escapeRegExp(charToTrim);
    var regEx = new RegExp("^[" + charToTrim + "]+|[" + charToTrim + "]+$", "g");
    return origString.replace(regEx, "");
}

const queryData = _ => {
  const results = bdmsdw.query("SELECT * FROM conslack.domain_redirects ORDER BY COALESCE(dw_last_update, src_create_date) ASC LIMIT 1", {raw: true}, function(err, data){
    if(err) throw err;
    else{
      return data;
    }
  })
  return results
}

const updateTable = async obj => {
  await bdmsdw.parameterizedQuery("UPDATE conslack.domain_redirects SET domain_redirect = $2, dw_last_update = GETDATE() WHERE sfdc_domain_id = $1", obj, function(err, data){
    if(err) throw err;
    else{
      console.log("Updated")
      return data;
    }
  })
}

const getDomain = async domain => {
  try {
    const response = await axios.get(domain);

    var redirect = response.request.res.responseUrl.replace('https://','').replace('http://','').replace('www.','').substring(0, 254)

    var y = trimChar(redirect, "/");

    console.log(y)
    return y;

  } catch (error) {
    console.log("Error")
    return "Axios not Found";
  }
}

const processArray = async item => {
  const domainRedirect = await getDomain('http://' + item[0].domain_name);
    
  const newObj = [
    item[0].sfdc_domain_id,
    domainRedirect
  ];

  const tableUpdate = await updateTable(newObj);
}

const runApp = async _ => {
  console.log('Starting App')

  const newdata = await queryData()

  console.log('Found Data')

  const final = await processArray(newdata)

  console.log('Restarting')
  
  runApp()
}

runApp();
