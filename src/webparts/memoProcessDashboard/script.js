$(document).ready(function () {
   
    var groupColumn = 4;
    var collapsedGroups = {};


    
    
  //   $('#requests').DataTable({
  //     "columnDefs": [
  //         { "visible": true, "targets": groupColumn }
  //     ],
  //     "order": [[ groupColumn, 'desc' ]],
  //     "displayLength": 25,
  //     "drawCallback": function ( settings ) {
  //         var api = this.api();
  //         var rows = api.rows( {page:'current'} ).nodes();
  //         var last=null;

  //         api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
  //             if ( last !== group ) {
  //                 $(rows).eq( i ).before(
  //                     '<tr class="group"><td colspan="5">'+group+'</td></tr>'
  //                 );

  //                 last = group;
  //             }
  //         } );
  //     }
  // } );

  

  // var itemTable = $('#requests').DataTable({
  //   'columnDefs': [
  //     {//hide the index 1 column, which is company name
  //       'targets': groupColumn,
  //       'visible': false,
  //     },
  //     {
  //       targets: 3,
  //       render: $.fn.dataTable.render.moment('MM/DD/YYYY')
  //     } 
  //   ],
  //   'paging':   false,
  //   'pageLength': 1,
  //   //use department name as the default order
  //   orderFixed: [[4, 'desc']],
  //   rowGroup: {
  //     dataSrc: groupColumn,
  //     startRender: function (rows, group) {
  //         let collapsed = !!collapsedGroups[group];
  //         rows.nodes().each(function (r) {
  //             r.style.display = collapsed ? 'none' : '';
  //         });
  //         // Add category name to the <tr>. NOTE: Hardcoded colspan
  //         return $('<tr class="GroupHeader" />').append('<td colspan="6"><i class="fa fa-angle-right" aria-hidden="true"></i><span>' + group + ' (' + rows.count() + ')</span></td>').attr('data-name', group).toggleClass('collapsed', collapsed);
  //     }
  //   }
  //   });

  //   $('#requests tbody').on('click', 'tr.group-start', function () {
  //       let name = $(this).data('name');
  //       collapsedGroups[name] = !collapsedGroups[name];
  //       itemTable.draw(false);
  //   });
  

  
  function onButtonClick(id,status){
    debugger;
        var popUpHTML = '<div id="dialog" title="Basic dialog"><p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the &apos;x&apos; icon.</p><//div>';
    
        $(".ModelPopUpDiv").html(popUpHTML);
        $(".ModelPopUpDiv").dialog();
        
      }


  });

