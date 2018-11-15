var a = [];
var ipVal = [];
function classA() {
    for (let ip of range('0.0.0.0', '0.0.0.60')) {
        a.push(ip);
    }
    return a;
}

function classB() {
    for (let ip of range('128.0.0.0', '128.0.0.20')) {
        a.push(ip);
    }
    return a;
}

function classC() {
    for (let ip of range('192.0.0.0', '192.0.0.20')) {
        a.push(ip);
    }
    return a;
}

function classD() {
    for (let ip of range('224.0.0.0', '224.0.0.20')) {
        a.push(ip);
    }
    return a;
}

function classE() {
    for (let ip of range('240.0.0.0', '240.0.0.20')) {
        a.push(ip);
    }
    return a;
}

function start(){

    var ipType = document.getElementById("ip4").value;
    if (ipType === undefined)
        ipType = document.getElementById("ip6").value;

    var cls = document.getElementById("ip4type").value;
    if (cls === undefined)
        cls = document.getElementById("ip6type").value;

    var n = document.getElementById("n").value;

    var i;
    if(ipType === "IPV4"){
        if(cls === "Classful"){
            var dropDn = document.getElementById("Classful").value;
            if(dropDn === "Class A"){
                classA();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
                store(ipVal,n);
            }
            else if(dropDn === "Class B"){
                classB();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
                store(ipVal,n);
            }
            else if(dropDn === "Class C"){
                classC();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
                store(ipVal,n);
            }
            else if(dropDn === "Class D"){
                classD();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
                store(ipVal,n);
            }
            else{
                classE();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
                store(ipVal,n);
            }
        }
        else{
            //classless
        }
    }
}

function store(ips, n){
    var i;
    for(i = 0; i < ips.length; i++){
        if(localStorage.getItem(ips[i]))
            console.log("nothing");
        else
            var ip = "";
            var j;
            for(j = 0; j<n; j++)
                ip += ips[j] + "\n";
            localStorage.setItem(ips[i], ips[i]);
            document.getElementById("output").innerText = ip;

    }
}

//Zero compression
function reduce(ip) {
    let ip6 = require('ip6');
    return abbreviate(ip);
}

'use strict';

/**
 *
 * This is sourced form https://www.npmjs.com/package/ip-range-generator
 * had some issues with npm that prevents me from using this
 *
 **/
const ipv4 = /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(?:\.(?!$)|$)){4}$/;

/**
 * Convert an IPv4 to an hexadecimal representation
 * @param  {String} ip   IPv4
 * @return {Integer} hex representation
 */
function ip2hex(ip) {
    let parts = ip.split('.').map(str => parseInt(str, 10));
    let n = 0;

    n += parts[3];
    n += parts[2] * 256;      // 2^8
    n += parts[1] * 65536;    // 2^16
    n += parts[0] * 16777216; // 2^24

    return n;
}

function assertIpv4(str, msg) {
    if (!ipv4.test(str)) { throw new Error(msg); }
}

/**
 * Generate all IPv4 that are included in the given range
 * @param {String} ip1   first IPv4 of the range
 * @param {String} ip2   last IPv4 of the range
 * @yield {String} IPv4 included in the range
 */
function *range(ip1, ip2) {
    assertIpv4(ip1, 'argument "ip1" must be a valid IPv4 address');
    assertIpv4(ip2, 'argument "ip2" must be a valid IPv4 address');

    let hex = ip2hex(ip1);
    let hex2 = ip2hex(ip2);

    if (hex > hex2) {
        let tmp = hex;
        hex = hex2;
        hex2 = tmp;
    }

    for (let i = hex; i <= hex2; i++) {
        yield `${(i >> 24) & 0xff}.${(i >> 16) & 0xff}.${(i >> 8) & 0xff}.${i & 0xff}`;
    }
}

//Sourced form ip6
let abbreviate = function (a) {
    if (!_validate(a)) {
        throw new Error('Invalid address: ' + a);
    }
    a = normalize(a);
    a = a.replace(/0000/g, 'g');
    a = a.replace(/\:000/g, ':');
    a = a.replace(/\:00/g, ':');
    a = a.replace(/\:0/g, ':');
    a = a.replace(/g/g, '0');
    let sections = a.split(/\:/g);
    let zPreviousFlag = false;
    let zeroStartIndex = -1;
    let zeroLength = 0;
    let zStartIndex = -1;
    let zLength = 0;
    for (let i = 0; i < 8; ++i) {
        let section = sections[i];
        let zFlag = (section === '0');
        if (zFlag && !zPreviousFlag) {
            zStartIndex = i;
        }
        if (!zFlag && zPreviousFlag) {
            zLength = i - zStartIndex;
        }
        if (zLength > 1 && zLength > zeroLength) {
            zeroStartIndex = zStartIndex;
            zeroLength = zLength;
        }
        zPreviousFlag = (section === '0');
    }
    if (zPreviousFlag) {
        zLength = 8 - zStartIndex;
    }
    if (zLength > 1 && zLength > zeroLength) {
        zeroStartIndex = zStartIndex;
        zeroLength = zLength;
    }
    //console.log(zeroStartIndex, zeroLength);
    //console.log(sections);
    if (zeroStartIndex >= 0 && zeroLength > 1) {
        sections.splice(zeroStartIndex, zeroLength, 'g');
    }
    //console.log(sections);
    a = sections.join(':');
    //console.log(a);
    a = a.replace(/\:g\:/g, '::');
    a = a.replace(/\:g/g, '::');
    a = a.replace(/g\:/g, '::');
    a = a.replace(/g/g, '::');
    //console.log(a);
    return a;
};

