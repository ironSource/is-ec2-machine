# is-ec2-machine

**Detect if current machine is running on AWS EC2. Inspired by [is-ec2]( https://github.com/dvonlehman/is-ec2), adds theoretical Windows support and does not needlessly spawn a process on Linux.**

## usage

```js
const isEC2 = require('is-ec2-machine')

if (isEC2()) {
  console.log('yep')
} else {
  console.log('no')
}
```

## install

With [npm](https://npmjs.org) do:

```
npm install is-ec2-machine
```

## license

MIT © ironSource
