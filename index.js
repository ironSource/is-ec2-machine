'use strict'

if (process.platform === 'win32') {
  const cp = require('child_process')

  // Untested!
  // https://projects.puppetlabs.com/issues/15391#note-3
  module.exports = function isEC2 () {
    return serviceExists('ec2config')
  }

  function serviceExists (name) {
    try {
      var res = cp.execSync(`sc query ${name}`, { encoding: 'utf8' })
    } catch (err) {
      return false
    }

    return res.indexOf(`SERVICE_NAME: ${name}`) >= 0
  }
} else {
  const fs = require('fs')

  module.exports = function isEC2 () {
    // If this is not sufficient, we could consider dmidecode
    // http://serverfault.com/a/775063

    try {
      var fd = fs.openSync('/sys/hypervisor/uuid', 'r')
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      return false
    }

    const head = Buffer(3)

    fs.readSync(fd, head, 0, 3, 0)
    fs.closeSync(fd)

    return head == 'ec2'
  }
}
