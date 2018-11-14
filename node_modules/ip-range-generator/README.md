# ip-range-generator
This module exports a generator function that generate all IPv4 present in a delimited range.

## Usage
```javascript
  const range = require('ip-range-generator');
  
  for (let ip of range('192.168.0.0', '192.168.1.0')) {
    console.log(ip);
  }
```
