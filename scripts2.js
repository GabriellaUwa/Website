var a = [];
function classA(n) {
    for (let ip of range('0.0.0.0', '127.0.0.0')) {
        for(i =0; i < n; i++){
            a.append(ip);
        }
    }
    return a;
}

function classB(n) {
    for (let ip of range('128.0.0.0', '191.255.0.0')) {
        for(i =0; i < n; i++){
            a.append(ip);
        }
    }
    return a;
}

function classC(n) {
    for (let ip of range('192.0.0.0', '223.255.255.0')) {
        for(i =0; i < n; i++){
            a.append(ip);
        }
    }
    return a;
}

function classD(n) {
    for (let ip of range('224.0.0.0', '239.255.255.255')) {
        for(i =0; i < n; i++){
            a.append(ip);
        }
    }
    return a;
}

function classE(n) {
    for (let ip of range('240.0.0.0', '255.255.255.255')) {
        for(i =0; i < n; i++){
            a.append(ip);
        }
    }
    return a;
}

function start(){

        var rdB1 = document.getElementById("ipType").value;
        var rdB1 = document.getElementById("ip4Type").value;
        var n = document.getElementById("n").value;
        var ip = "";

        if(rdB1 === "IPV4"){
            if(rdB2 === "Classful"){
                var dropDn = document.getElementById("Classful").value;
                if(dropDn === "Class A"){
                    classA(n);
                    ip = a[Math.floor(Math.random() * a.length)];
                }
                else if(dropDn === "Class B"){
                    classB(n);
                    ip = a[Math.floor(Math.random() * a.length)];
                }
                else if(dropDn === "Class C"){
                    classC(n);
                    ip = a[Math.floor(Math.random() * a.length)];
                }
                else if(dropDn === "Class D"){
                    classD(n);
                    ip = a[Math.floor(Math.random() * a.length)];
                }
                else{
                    classE(n);
                    ip = a[Math.floor(Math.random() * a.length)];
                }
            }
            else{
                //classless
            }
        }
        else{
            //ipv6
        }

        store(ip);
}

function store(ips){

    for(i = 0; i < ips.length; i++){
        if(localStorage.getItem(ips[i]))
            console.log("nothing");
        else
            localStorage.setItem(ips[i], ips[i]);
            document.getElementById("output").innerHTML(ips[i]);

    }
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

    let hex  = ip2hex(ip1);
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
