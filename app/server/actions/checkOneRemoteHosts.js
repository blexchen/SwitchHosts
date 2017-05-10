/**
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

const getUrl = require('./getUrl')
const isExpired = require('../checkIsExpired')

function now () {
  let dt = new Date()

  return `${dt.getFullYear()}-${dt.getMonth() +
                                1}-${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`
}

module.exports = (svr, hosts, force = false) => {
  return new Promise((resolve, reject) => {
    if (hosts.where !== 'remote' || !hosts.url) {
      resolve(hosts)
      return
    }

    if (force || isExpired(svr, hosts)) {
      let hosts2 = Object.assign({}, hosts)

      console.log('check', hosts2.title, force, isExpired(svr, hosts2))
      getUrl(svr, hosts2.url)
        .then(content => {
          hosts2.content = content
          hosts2.last_refresh = now()
        })
        .then(() => resolve(hosts2))
        .catch(e => resolve(e))
    } else {
      resolve(hosts)
    }
  })
}
