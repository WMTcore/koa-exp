import * as test from './test';

let ctx=this;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    return response
      .json()
      .then(function(json) {
        var error = new Error(response.status)
        error.response = json
        throw error
      })
  }
}

function parseJSON(response) {
  return response.json()
}

function fetchAPI(url, options) {
  options = {
    credentials: 'same-origin',
    ...options
  }
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
}

export default new Proxy(test,{
  apply:function(target, object, args){
    console.error(target,object,args)
  }
})
