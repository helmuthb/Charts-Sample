$(function(){
    var loop = 0;
    $("script[type^=\"text/csv\"]").each(function(){
        loop++;
        var rows = [];
        var i;
        var dateToString = function(d) {
            return d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
        }
        var milsecPerDay = 1000 * 60 * 60 * 24;
        $.each($.trim($(this).text()).split(/[\015\012]/), function(i,row) {
            // read in each row
            var splitrow = row.split(",");
            var dateStart = new Date(splitrow[2]);
            var dateEnd = new Date(splitrow[3]);
            rows[i] = {
                'id': splitrow[0],
                'parent': splitrow[1] || undefined,
                'dateStart': dateStart,
                'dateEnd': dateEnd,
                'start_date': dateToString(dateStart),
                'duration': Math.round((dateEnd - dateStart) / milsecPerDay),
                'progress': 0,
                'open': true,
                'order': i,
                'class': splitrow[4] || undefined,
                'text': splitrow[5],
                'type': (splitrow[2] == splitrow[3]) ? 'milestone' : 'task'
            };
        });
        // find start / end dates for parents
        parentStart = [];
        parentEnd = [];
        for (i=0; i<rows.length; i++) {
            if (rows[i].parent) {
                var p = rows[i].parent;
                if (p in parentStart) {
                    if (parentStart[p] > rows[i].dateStart) {
                        parentStart[p] = rows[i].dateStart;
                    }
                }
                else {
                    parentStart[p] = rows[i].dateStart;
                }
                if (p in parentEnd) {
                    if (parentEnd[p] < rows[i].dateEnd) {
                        parentEnd[p] = rows[i].dateEnd;
                    }
                }
                else {
                    parentEnd[p] = rows[i].dateEnd;
                }
            }
        }
        // and now set the start/end date & duration for parents
        for (i=0; i<rows.length; i++) {
            var id = rows[i].id;
            if (id in parentStart && id in parentEnd) {
                rows[i].dateStart = parentStart[id];
                rows[i].start_date = dateToString(parentStart[id]);
                rows[i].dateEnd = parentEnd[id];
                rows[i].duration = Math.round((parentEnd[id] - parentStart[id]) / milsecPerDay);
                rows[i].type = "project";
            }
        }
        // find bracket start / end date
        var startDate = new Date('2100-01-01');
        var endDate = new Date('1980-01-01');
        for (i=0; i<rows.length; i++) {
            if (rows[i].dateStart < startDate) {
                startDate = rows[i].dateStart;
            }
            if (rows[i].dateEnd > endDate) {
                endDate = rows[i].dateEnd;
            }
        }
        var id = 'gantt' + loop;
        $(this).replaceWith("<div id='" + id + "' style='width:100%; height:100%;'></div>");
        var tasks = {
            'data': rows,
            'links': []
        };
        setTimeout(function() {
            gantt._get_safe_type = function(t){
                return t;
            };
            gantt.init(id);
            gantt.config.scale_unit = 'year';
            gantt.config.date_scale = '%Y';
            gantt.templates.date_scale = null;
            gantt.config.autosize = true;
            gantt.config.readonly = true;
            gantt.config.select_task = false;
            gantt.config.min_column_width = 0;
            gantt.config.task_height = 24;
            gantt.config.step = 1;
            gantt.config.start_date = Date.parse(startDate.getFullYear() + "-01-01");
            gantt.config.end_date = Date.parse(endDate.getFullYear() + "-12-31");
            gantt.config.subscales = [
                    {unit: "month", step: 3, template: function (date) {
                        var getMonth = gantt.date.date_to_str("%n");
                        return "Q" + Math.round((1 + parseInt(getMonth(date))) / 3);
                    }}
            ];
            gantt.config.columns = [
                {name:"text", tree:true, width:'*', resize:true }
            ];
            gantt.templates.task_class = function(start, end, task) { return task.class || ''; }
            gantt.templates.task_text = function(start, end, task) { return ''; }
            gantt.parse(tasks);
        }, 50);
    });
});
