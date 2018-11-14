var tld_count = {".edu": 0, ".gov": 0, ".com": 0, ".org": 0, ".net": 0, "other":0};
function myFunction() {
    document.getElementById("openFile").addEventListener('change', function () {

        var fr = new FileReader();

        var body = document.getElementsByTagName("body")[0];

        var tbl = document.createElement("table");

        tbl.setAttribute("id", "myTable");

        var tblBody = document.createElement("tbody");

        fr.onload = function () {

            let text = this.result.split("\n");

            var row1 = document.createElement("tr"); //header row
            var heading = document.createElement("th");
            row1.setAttribute("style", "background-color: black;opacity: 0.8; color: white");

            var hcellText = document.createTextNode("FULL URL");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("PROTOCOL");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("USERNAME");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("PASSWORD");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("HOSTNAME");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("TLD");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("PORT");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("PATH");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("QUERY");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("FRAGMENT");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            hcellText = document.createTextNode("IP ADDRESS");
            heading = document.createElement("th");
            heading.appendChild(hcellText);
            row1.appendChild(heading);

            tblBody.appendChild(row1);

            for (let j = 0; j < text.length; j++) {

                let url = parseUri(text[j]);
                var row = document.createElement("tr");
                row.setAttribute("style", "background-color: white ;opacity: 0.8; color: black");

                let temp = 0;

                while (temp <= 10) {
                    var cell = document.createElement("td");

                    if (temp == 0) {
                        var cellText = document.createTextNode(url['href']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 1) {
                        var cellText = document.createTextNode(url['protocol']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 2) {
                        var cellText = document.createTextNode(url['username']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 3) {
                        var cellText = document.createTextNode(url['password']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 4) {
                        var cellText = document.createTextNode(url['host']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 5) {
                        let tld = "." + url['host'].split('.').pop();
                        var cellText = document.createTextNode(tld);//tld
                        cell.appendChild(cellText);
                        row.appendChild(cell);

                        if(tld in tld_count){
                            tld_count[tld]++;
                        }
                        else{
                            tld_count["other"]++;
                        }
                    }
                    else if (temp == 6) {
                        var cellText = document.createTextNode(url['port']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 7) {
                        var cellText = document.createTextNode(url['path']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 8) { //gotten from url.search
                        var cellText = document.createTextNode(url['query']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 9) {//fragment
                        var cellText = document.createTextNode(url['fragment']);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (temp == 10) {//IP Address
                        loading(cell, url);
                        row.appendChild(cell);
                    }
                    temp++;
                }
                tblBody.appendChild(row);
                tbl.setAttribute("style", "align: center; font-size: 10px;");
            }
            tbl.appendChild(tblBody);
            body.appendChild(tbl);
        };
        fr.readAsText(this.files[0]);

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Task', 'TLD Data'],
                ['.com', tld_count[".com"]],
                ['.edu', tld_count[".edu"]],
                ['.gov', tld_count[".gov"]],
                ['.org', tld_count[".org"]],
                ['.net', tld_count[".net"]],
                ['other', tld_count["other"]],
            ]);

            // Optional; add a title and set the width and height of the chart
            var options = {'title':'Top Level Domain Data Summary', 'width':450, 'height':300};

            // Display the chart inside the <div> element with id="piechart"
            var pie = document.getElementById('piechart');
            pie.setAttribute("style", "opacity: 0.8; color: white; display: inline-block");
            pie.setAttribute("class", "center");
            var chart = new google.visualization.PieChart(pie);
            chart.draw(data, options);
        }
    });
}
function loading(b,url){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var a = JSON.parse(xhttp.responseText);
            var t = document.createTextNode(a.Answer[0].data);
            b.appendChild(t);
        }
    };
    xhttp.open("GET", "https://dns.google.com/resolve?name=" + url["host"], true);
    xhttp.send();

}
function openNav() {
    document.getElementById("mySidenav").style.width = "350px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

//URL Component Parser
function parseUri(str) {
    var	o   = parseUri.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};

parseUri.options = {
    strictMode: false,
    key: ["href","protocol","authority","userInfo","username","password","host","port","relative","path","directory","file","query","fragment"],
    q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};



