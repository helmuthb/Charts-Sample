# Samples for HTML-based charts

These are simple samples for creating HTML-based charts and reports.

## GANTT-Charts

This is a sample for creating a Gantt chart from a textual description. It uses the [dhtmlxGantt](https://dhtmlx.com/docs/products/dhtmlxGantt/) library.

You specify the project lines as a ```<script type="text/csv">``` in the following format:
```
<script type="text/csv">
100,0,2016-01-01,2016-01-01,type-b,Preparations
110,100,2017-07-01,2018-06-30,type-b,Getting Ready
200,0,2016-01-01,2016-01-01,type-a,Sub Project A
210,200,2019-01-01,2019-12-31,type-a,Step 1
</script>
 ```

The first column specifies the _ID) of the task or task group.
The second column specifies the parent ID - ```0``` if it is a top-level task (group).
The third and fourth column provide the start and end date.
The fifth column provides a _class_ - which can then be used with CSS to format the tasks differently.
Finally, the sixth column is the description or text for the task or task group.

## Tables

This is just some JavaScript hack to have an easy text format for creating a table from simple text.
