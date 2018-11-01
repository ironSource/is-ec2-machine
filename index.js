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
    // Might be "Xen" or other on older instance types (t2)
    if (head('/sys/class/dmi/id/bios_vendor', 10) === 'Amazon EC2') {
      return true
    }

    // Does not exist in newer instance types (t3, c5)
    if (head('/sys/hypervisor/uuid', 3) === 'ec2') {
      return true
    }

    return false
  }

  function head (path, length) {
    let fd

    try {
      fd = fs.openSync(path, 'r')
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      return
    }

    const buf = Buffer.allocUnsafe(length)
    const bytesRead = fs.readSync(fd, buf, 0, length, 0)

    fs.closeSync(fd)

    if (bytesRead === length) {
      return buf.toString()
    }
  }
}
