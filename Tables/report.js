$(function(){
    $("script[type^=\"text/csv\"]").each(function(){
       var paramstrs=$(this).attr("type").split(/;/).slice(1);

       var params = {}
       for(i in paramstrs) {
            keyval = paramstrs[i].split(/=/)
            params[keyval[0]] = keyval[1]
        }
        var separator = new RegExp(params["separator"] || ",");
        var temp = "<table data-csv=true";
        $.each(this.attributes, function(i, attr){
            temp += " " + attr.name + "='" + attr.value + "'";
        });
        temp += ">";
        var classes = [];
        var totals = [];
        $.each($.trim($(this).text()).split(/[\015\012]/), function(i,row){
            if( i==0 ) {
                temp += "<thead>";
            }
            temp += "<tr>";
            $.each(row.split(separator), function(j, cell){
                if( i==0) {
                    classes[j] = cell;
                    temp += "<th scope=col class='" + cell + "'></th>";
                    totals[j] = 0;
                } else {
                    temp += "<td class='" + classes[j] + "'>" + cell + "</td>";
                    totals[j] += parseInt(cell);
                }
            });
            temp += "</tr>";
            if( i==0 ) {
                temp += "</thead>";
            }
        });
        temp += "<tr class='total'>";
        for (j=0; j<totals.length; j++) {
            if (totals[j] > 0) {
                temp += "<td class='" + classes[j] + "'>" + totals[j] + "</td>";
            }
            else {
                temp += "<td class='" + classes[j] + "'></td>";
            }
        }
        temp += "</tr>";
        temp += "</table>";
        $(this).replaceWith(temp);
    });
});
