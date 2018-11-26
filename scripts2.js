'use strict';

var a;
var ipVal;
var all4 = {};
var all6 = {};

//A little limiting/tacky but does the job!
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

function classless(){
    a = [];
    for (let ip of range('224.0.0.0', '224.0.0.60')) {
        a.push(ip);
    }
    for (let ip of range('192.0.0.0', '192.0.0.60')) {
        a.push(ip);
    }
    for (let ip of range('128.0.0.0', '128.0.0.60')) {
        a.push(ip);
    }
    for (let ip of range('0.0.0.0', '0.0.0.60')) {
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
    if(document.getElementById("z").value){
        testZero(document.getElementById("z").value);
    }
    else {
        if (ipType === "IPV4") {
            if (cls === "Classful") {
                var dropDn = document.getElementById("Classful").value;
                if (dropDn === "Class A") {
                    classA();
                    ipVal = [];
                    for (i = 0; i < n; i++)
                        ipVal.push((a[Math.floor(Math.random() * a.length)] + "/24"));
                    store(ipVal, n);
                }
                else if (dropDn === "Class B") {
                    classB();
                    ipVal = [];
                    for (i = 0; i < n; i++)
                        ipVal.push((a[Math.floor(Math.random() * a.length)] + "/16"));
                    store(ipVal, n);
                }
                else if (dropDn === "Class C") {
                    classC();
                    ipVal = [];
                    for (i = 0; i < n; i++)
                        ipVal.push((a[Math.floor(Math.random() * a.length)] + "/8"));
                    store(ipVal, n);
                }
                else if (dropDn === "Class D") {
                    classD();
                    ipVal = [];
                    for (i = 0; i < n; i++)
                        ipVal.push((a[Math.floor(Math.random() * a.length)] + "/0"));
                    store(ipVal, n);
                }
                else if (dropDn === "Class E") {
                    classE();
                    ipVal = [];
                    ipVal.push("Sorry this class of Ip's are reserved");
                    store(ipVal, n);
                }
            }
            else {
                classless();
                ipVal = [];
                let val = 32 - Math.round(Math.log2(document.getElementById("less").value));

                for (i = 0; i < n; i++)
                    ipVal.push((a[Math.floor(Math.random() * a.length)] + "/" + val));
                store(ipVal, n);
                //classless
            }
        }
        else if (ipType === "IPV6") {
            store(randomIp6(n), n);
        }
    }
}

function testZero(ip){
    document.getElementById("output").innerText = abbreviate(ip);
}

//abbreviates each line in given lines if generated ipv6

function abb(n){
    let str = "";
    var lines = n.split('\n');
    for(var i = 0;i < lines.length;i++){
        str+= abbreviate(lines[i]);
    }
    return str;
}

function store(ips, n){
    var i;
    for(i = 0; i < ips.length; i++){
        var ip = "";
        var j;

        if(document.getElementById('ip4').checked) {
            for(j = 0; j<n; j++) {
                all4[ips[i]] = true;
                ip += ips[j] + "\n";
            }
            localStorage.setItem("IPV4 Addresses", JSON.stringify(all4));
        }
        else if(document.getElementById('ip6').checked) {
            for(j = 0; j<n; j++) {
                all6[ips[i]] = true;
                ip += ips[j] + "\n";
            }
            localStorage.setItem("IPV6 Addresses", JSON.stringify(all6));
        }
        document.getElementById("output").innerText = ip;

    }
}
var randomIp6 = function(n) {

    var qty = n;

    var r = randomise("0123456789abcdef", 32 * qty, true);
    var ip_block = [];
    for(var i = 0; i < r.length; i++) {
        var block_index = Math.floor(i / 4);
        if(!Array.isArray(ip_block[block_index])) {
            ip_block.push([]);
        }
        if(!ip_block[block_index].length == 0 || r[i] !== "0") {
            ip_block[block_index].push(r[i]);
        }
    }
    var ip = [];
    for(var i = 0; i < ip_block.length; i++) {
        var ip_index = Math.floor(i / 8);
        if(!Array.isArray(ip[ip_index])) {
            ip.push([]);
        }
        ip[ip_index].push(ip_block[i].join(""));
    }
    var ips = [];
    for(var i = 0; i < ip.length; i++) {
        ips.push(ip[i].join(":"));
    }
    return ips
};

/**
 *
 * Lines 185-219 is sourced form https://www.npmjs.com/package/ip-range-generator
 * As I have troubles with using npm modules in browser
 *
 **/

const ipv4 = /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(?:\.(?!$)|$)){4}$/;

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

/***
 * abbreviate(), _validate(), _leftpad(), and normalize() are Sourced from https://www.npmjs.com/package/ip6
 * as my I cannot get npm modules to work on browser
 ***/

let _validate = function (a) {
    return /^[a-f0-9\\:]+$/ig.test(a);
};

let normalize = function (a) {
    let nh = a.split(/\:\:/g);
    if (nh.length > 2) {
        throw new Error('Invalid address: ' + a);
    }

    let sections = [];
    if (nh.length == 1) {
        // full mode
        sections = a.split(/\:/g);
        if (sections.length !== 8) {
            throw new Error('Invalid address: ' + a);
        }
    } else if (nh.length == 2) {
        // compact mode
        let n = nh[0];
        let h = nh[1];
        let ns = n.split(/\:/g);
        let hs = h.split(/\:/g);
        for (let i in ns) {
            sections[i] = ns[i];
        }
        for (let i = hs.length; i > 0; --i) {
            sections[7 - (hs.length - i)] = hs[i - 1];
        }
    }
    for (let i = 0; i < 8; ++i) {
        if (sections[i] === undefined) {
            sections[i] = '0000';
        }
        sections[i] = _leftPad(sections[i], '0', 4);
    }
    return sections.join(':');
};

let _leftPad = function (d, p, n) {
    let padding = p.repeat(n);
    if (d.length < padding.length) {
        d = padding.substring(0, padding.length - d.length) + d;
    }
    return d;
};

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


/**
 * Generates random Ipv6
 **/

function randomise(items, length, allowdups) {
    if(!Array.isArray(items)) {
        items = items.split("");
    }
    items.shuffle();
    if(allowdups) {
        var r = [];
        for(var i = 0; i < length; i++) {
            r[i] = items[Math.floor(Math.random() * items.length)];
        }
        return r;
    } else {
        if(length > 0 && length < items.length) {
            items.length = length;
        }
        return items;
    }
}
Array.prototype.shuffle = function() {
    var i = this.length,
        j, temp;
    if(i == 0) return;
    while(--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
};