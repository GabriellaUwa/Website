'use strict';

var a;
var ipVal = [];
function classA() {
    a = [];
    for (let ip of range('0.0.0.0', '0.0.0.60')) {
        a.push(ip);
    }
    return a;
}

function classB() {
    a = [];
    for (let ip of range('128.0.0.0', '128.0.0.60')) {
        a.push(ip);
    }
    return a;
}

function classC() {
    a = [];
    for (let ip of range('192.0.0.0', '192.0.0.60')) {
        a.push(ip);
    }
    return a;
}

function classD() {
    a = [];
    for (let ip of range('224.0.0.0', '224.0.0.60')) {
        a.push(ip);
    }
    return a;
}

function classE() {
    a = [];
    for (let ip of range('240.0.0.0', '240.0.0.60')) {
        a.push(ip);
    }
    return a;
}

function start(){

    var ipType;
    if(document.getElementById('ip4').checked) {
        ipType = document.getElementById("ip4").value;
    }
    else
        ipType = document.getElementById("ip6").value;

    var cls;
    if(document.getElementById('ip4type').checked) {
        cls = document.getElementById("ip4type").value;
    }
    else
        cls = document.getElementById("ip4type2").value;


    var n = document.getElementById("n").value;

    var i;
    if(ipType === "IPV4"){
        if(cls === "Classful"){
            var dropDn = document.getElementById("Classful").value;
            if(dropDn === "Class A"){
                classA();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
            }
            else if(dropDn === "Class B"){
                classB();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
            }
            else if(dropDn === "Class C"){
                classC();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
            }
            else if(dropDn === "Class D"){
                classD();
                for(i = 0; i<n; i++)
                    ipVal.push(a[Math.floor(Math.random() * a.length)]);
            }
            else{
                classE();
                ipVal.push("Sorry this class of Ip's are reserved");
            }
            store(ipVal,n);
        }
        else {
            //classless
        }
    }
    else if (ipType === "IPV6"){
        if(document.getElementById("Zero").value === true){
            document.getElementById("output").innerText = abbreviate(generateIP6());
        }
        else
            document.getElementById("output").innerText = generateIP6();
        //ipv6
    }
}

function generateIP6(){
    //do generation of ip6 here
    //generate and if not in DB
    localStorage.setItem("","")
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
    return abbreviate(ip);
}


/**
 *
 * This is sourced form https://www.npmjs.com/package/ip-range-generator
 * had some issues with npm that prevented me from importing the packages
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

/***
'use strict';

const word = '[a-fA-F\\d:]';
const b = `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))`;

const v4 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

const v6seg = '[a-fA-F\\d]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

const ip = opts => opts && opts.exact ?
    new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
    new RegExp(`(?:${b}${v4}${b})|(?:${b}${v6}${b})`, 'g');

ip.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(`${b}${v4}${b}`, 'g');
ip.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(`${b}${v6}${b}`, 'g');
 ***/

