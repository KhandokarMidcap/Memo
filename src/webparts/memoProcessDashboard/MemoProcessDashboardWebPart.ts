import {Version} from '@microsoft/sp-core-library';
import {IPropertyPaneConfiguration, PropertyPaneTextField} from '@microsoft/sp-property-pane';
import {BaseClientSideWebPart} from '@microsoft/sp-webpart-base';
import {escape} from '@microsoft/sp-lodash-subset';

import styles from './MemoProcessDashboardWebPart.module.scss';
import * as strings from 'MemoProcessDashboardWebPartStrings';
import {SPComponentLoader} from '@microsoft/sp-loader';
import * as $ from 'jquery';
import 'DataTables.net';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'datatables.net-rowgroup';
import './moment-plugin';
import './demo.css';

export interface IMemoProcessDashboardWebPartProps {
  description: string;
}

export interface MemoProcessLists {
  value: MemoProcessList[];
}
export interface MemoProcessList {
  Id: string;
  Title: string;
  Assignee: any;
  DocumentLine: string;
  Borrower: string;
  Requester: string;
  RiskRating: string;
  RatingNumber: string;
  AssigneeId: string;
  DateNeededBy: string;
  Status: string;
  Comments: string;
}

let collapsedGroups = {};



export default class MemoProcessDashboardWebPart extends BaseClientSideWebPart < IMemoProcessDashboardWebPartProps > {
  public constructor() {
      super();
      SPComponentLoader.loadCss('https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
      SPComponentLoader.loadCss('https://cdn.datatables.net/1.10.22/css/dataTables.bootstrap.min.css');
      SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
      SPComponentLoader.loadCss('https://cdn.datatables.net/plug-ins/1.10.21/integration/font-awesome/dataTables.fontAwesome.css');
      //

      var $ = require('jquery');
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
      return {
          pages: [{
              header: {
                  description: strings.PropertyPaneDescription
              },
              groups: [{
                  groupName: strings.BasicGroupName,
                  groupFields: [
                      PropertyPaneTextField('description', {
                          label: strings.DescriptionFieldLabel
                      })
                  ]
              }]
          }]
      };
  }



  public getTablHTML(items: MemoProcessList[]) {
      let html: string = '';
      html += `<thead style="background: #f0f4f5;">
                <tr class="${styles.Tr_Head}">
                    <th>Task Name</th>
                    <th>PBR Name</th>
                    <th>PM</th>
                    <th> Date Submitted</th>
                    <th> Date Needed By</th>
                    <th>Rating</th>
                    <th>Status</th>

                    <th>Next Step</th>
                    <th>Action Needed By</th>
                   
               
                    
              
           
         
                    <th style="width: 64px !important;">Action</th>
                    <th style="width: 64px !important;">Delete</th>
                </tr>
            </thead>
            <tbody>`

      items.forEach((item: MemoProcessList) => {

          let assigneeName: string = item.Assignee.Title;
          let ShortName: string = "";
          let friendlyDate = '';
          let friendlyCreatedDate = '';
          let statusClass = '';
          let buttonHTML = '';
        

          if (item.Status == 'In Review' || item.Status == 'Edit Required') {
              statusClass = 'status-wrapper-green';
              buttonHTML = '<button class="btn rowButton" onClick="return onButtonClick(' + item.Id + ',\'editrequired\')">Action</button>';
          } else if (item.Status == 'Work in progress' || item.Status == 'Pending Review') {
              statusClass = 'status-wrapper-yellow';
              buttonHTML = '<button class="btn rowButton" onClick="return onButtonClick(' + item.Id + ',\'new\')">Action</button>';
          } else if (item.Status == 'Completed' || item.Status == 'Approved') {
              statusClass = 'status-wrapper-purple';
              buttonHTML = `<button class="btn rowButton" onClick="return onButtonClick('+ item.Id +',\'checkdocument\')">View</button>`;
          }

          if (item.DateNeededBy != undefined) {

          }

          if (assigneeName != undefined || assigneeName != null) {
              ShortName = assigneeName.split(' ')[0].substr(0, 1) + (assigneeName.split(' ').length > 1 ? assigneeName.split(' ')[1].substr(0, 1) : '');
          }

          //   <td><p class="${styles[statusClass]}">${item.Status}</p></td>
          html += `
          <tr>            
              <td>${item.Title}d</td>
              <td>${item.Borrower}</td>
              <td>${item.Requester}</td>
              <td>${item.RiskRating}</td>
              <td>
                  <div class="${styles["name-wrapper"]}">
                    <div class="${styles["name-round"]}">${ShortName.toUpperCase()}</div>
                    <div class="${styles["name-whole"]}">${assigneeName}</div>
                  </div>
                </td>
                <td>${item.DateNeededBy}</td>
 
            <td><p class="${styles[statusClass]}">${item.Status}</p></td>
            <td>Next Step</td>
              <td>${item.Id}</td>
              <td>${buttonHTML}</td>
          </tr>
          `;
      });

      html += '<tbody>';

      return html;
  }

  public ApplyDataTable() {
      let groupColumn = 7;
      let itemTable = $('#requests').DataTable({
          'columnDefs': [{
  
              'targets': groupColumn,
              'visible': false,
        
          }],
          'paging': false,
          'pageLength': 1,
          info: false,
          responsive: true,
    
          orderFixed: [
              [4, 'desc']
          ],
          // rowGroup: {
          //     dataSrc: groupColumn,
          //     startRender: function(rows, group) {
          //         let collapsed = !!collapsedGroups[group];
          //         return $('<tr class="GroupHeader" />').append('<td colspan="7"><i class="fa fa-angle-right" aria-hidden="true"></i><span>' + group + ' (' + rows.count() + ')</span></td>').attr('data-name', group).toggleClass('collapsed', collapsed);
          //     }
          // },
          columns: [{
                  title: 'Task Name'
              },
              {
                  title: 'PBR Name'
              },
              {
                title: 'PM'
            },
            {
              title: 'Date Submitted'
          },
          
          {
            title: 'Date Needed By'
        },
              {
                title: 'Rating'
            },
            {
              title: 'Status'
          },
       
        {
          title: 'Next Step'
      },
 
              {
                  title: 'Action Needed By'
              },
            
           
            
           
         
              {
                  'data': null,
                  title: 'Action',
                  "render": function(item) {
                      return '<div class="btn-group"> <button class="datatableBtn" itemId="' + item.Id + '" type="button" onclick="return false" value="0" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#myModal">View</button></div>'
                  }
              },
              {
                'data': null,
                title: 'Delete',
                "render": function(item) {
                    return '<div class="btn-group"> <button class="datatableBtn" itemId="' + item.Id + '" type="button" onclick="return false" value="0" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#myDelete">Delete</button></div>'
                }
            }
          ],
      });


      $('#requests tbody').on('click', 'tr.group-start', function() {
          let name = $(this).data('name');
          collapsedGroups[name] = !collapsedGroups[name];
          itemTable.draw(false);
      });

  }


  public render(): void {
let buttonAction1 = ''
let buttonAction2 = ''
      this.domElement.innerHTML = `
      <style>


      .av_l_8474018e {
        min-height: 0;
        -ms-flex-preferred-size: 0;
        flex-basis: 0;
        border: 1px solid #e5e5e5;
        border-bottom: 0;
        margin: 15px auto 0;
        max-width: 1564px !important;
    }






















      @media screen and (min-width: 1024px)
{
      .a_e_50a7110f:not(.b_e_50a7110f) .k_e_50a7110f {
          display: flex;
          max-width: 100% !important;
      }

    }




      .az_n_8474018e {
    
        max-width: 100% !important;
    }
      table.dataTable thead th {
        white-space: nowrap
      }

      .demo-preview {
        padding-top: 60px;
        padding-bottom: 10px;
        width:300px;
        margin: auto;
        text-align:center;
      
      }
      .demo-preview .label{
        margin-right:10px;
        margin-bottom:10px
      }
      .label {
        display: inline-block;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        padding: 4px 8px;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 400;
        color: #FFF
      }
      
      .label.label-pill,
      .label.label-rounded {
        border-radius: 99999px
      }
      
      .label.label-square {
        border-radius: 0
      }
      
      .label.label-default {
        background-color: #B0BEC5
      }
      
      .label.label-primary {
        background-color: #2196F3
      }
      
      .label.label-secondary {
        background-color: #323a45;
        color: #FFF
      }
      
      .label.label-info {
        background-color: #29B6F6
      }
      
      .label.label-success {
        background-color: #64DD17
      }
      
      .label.label-warning {
        background-color: #FFD600
      }
      
      .label.label-danger {
        background-color: #ef1c1c
      }
      
      .label.label-outlined {
        border-width: 1px;
        border-style: solid;
        background-color: transparent
      }
      
      .label.label-outlined.label-default {
        border-color: #B0BEC5;
        color: #B0BEC5
      }
      
      .label.label-outlined.label-primary {
        border-color: #2196F3;
        color: #2196F3
      }
      
      .label.label-outlined.label-secondary {
        border-color: #323a45;
        color: #323a45
      }
      
      .label.label-outlined.label-info {
        border-color: #29B6F6;
        color: #29B6F6
      }
      
      .label.label-outlined.label-success {
        border-color: #64DD17;
        color: #64DD17
      }
      
      .label.label-outlined.label-warning {
        border-color: #ef9a00eb;
        color: #ef9a00eb;
      }
      
      .label.label-outlined.label-danger {
        border-color: #ef1c1c;
        color: #ef1c1c
      }
      .card {
        border: 0px solid rgba(0,0,0,.125) !important;
       
    }
      </style>



    <p></p>
    <div class="card" id="FilesPanel" >
    <table style="width: 100%;">
    <tr>
    <td>
        <div id="FilesGrid" class=${styles.FilesTable} style="width: 100%"></div>
    </td>
    </tr>
    </table>
    </div>


    <!-- Bootstrap Modal Dialog for NEW DRAFT-->
    <div class="modal fade" id="NewPopupDraft" tabindex="-1" role="dialog" aria-labelledby="NewPopupDraftLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
         
                <h4 class="modal-title" id="NewPopupDraftLabel">
                    Add New File
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">

   



                  <div class="form-group">
                    <label>Comments <span style="color:red"><span> <span class="reqCommentsNewDraft" style="color:red; display:none"> Please enter the comments. </span></label>
                    <textarea id="itemCommentNewDraft" class="form-control" rows="5"></textarea>

                    <div class="alert alert-warning lockedNewDraft">
                 
                    </div>
                  </div>
                  <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-warning btn-sm" id="EditRequiredbtnNewDraft">
                      Edit Required
                    </button>
                    <button type="submit" class="btn btn-primary btn-sm" id="ApproveItembtnNewDraft">
                      Approve
                    </button>
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>






























    <!-- Bootstrap Modal Dialog for NEW ONLY-->
    <div class="modal fade" id="NewPopup" tabindex="-1" role="dialog" aria-labelledby="NewPopupLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
         
                <h4 class="modal-title" id="NewPopupLabel">
                    Add New File
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">

                <div class="form-group">

                <p>Requires Executive Approval?</p>
        
                  <label class="radio-inline">
                    <input value="Yes" type="radio" name="optradio" checked> Yes
                  </label>
                  <label class="radio-inline">
                    <input value="No" type="radio" name="optradio"> No
                  </label>



                </div>



                <div class="form-group">

                <p>Please select the signer from Apollo</p>
        
                  <label class="radio-inline">
                    <input value="Maurice Amsellem" type="radio" name="optradioApollo" checked> Maurice Amsellem
                  </label>
                  <label class="radio-inline">
                    <input value="Michael Levin" type="radio" name="optradioApollo"> Michael Levin
                  </label>



                </div>







                  <div class="form-group">
                    <label>Comments <span style="color:red"><span> <span class="reqCommentsNew" style="color:red; display:none"> Please enter the comments. </span></label>
                    <textarea id="itemCommentNew" class="form-control" rows="5"></textarea>

                    <div class="alert alert-warning lockedNew">
                 
                    </div>
                  </div>
                  <!-- hidden controls -->
                  <div style="display: none">
                  <input id="riskRatingNumber" />
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-warning btn-sm" id="EditRequiredbtnNew">
                      Edit Required
                    </button>
                    <button type="submit" class="btn btn-primary btn-sm" id="ApproveItembtnNew">
                      Approve
                    </button>
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>






    <!-- Bootstrap Modal Dialog for REVIEW DRAFT-->
    <div class="modal fade" id="ReviewPopupDraft" tabindex="-1" role="dialog" aria-labelledby="ReviewPopupDraftLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
         
                <h4 class="modal-title" id="ReviewPopupDraftLabel">
                    Add New File
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">

           
           
                  <div class="form-group">
                  <label>Comments <span style="color:red"><span> <span class="reqCommentsReviewDraft" style="color:red; display:none"> Please enter the comments. </span></label>
                  <textarea id="itemCommentReviewDraft" class="form-control" rows="5"></textarea> <br>

                  <div class="alert alert-warning lockedReviewDraft">
                 
                </div>
               
                  </div>
                  <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-warning btn-sm" id="EditRequiredbtnReviewDraft">
                      Edit Required (Draft)
                    </button>
                    <button type="submit" class="btn btn-primary btn-sm" id="ApproveItembtnReviewDraft">
                      Approve (Draft)
                    </button>
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>
























    <!-- Bootstrap Modal Dialog for REVIEW ONLY-->
    <div class="modal fade" id="ReviewPopup" tabindex="-1" role="dialog" aria-labelledby="ReviewPopupLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
         
                <h4 class="modal-title" id="ReviewPopupLabel">
                    Add New File
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">

                <div style="display:none" class="form-group">
                <label>Risk Level</label>
            <span id="CurrentRiskLabel"> </span>
              </div>
              <div class="form-group">

              <p>Requires Executive Approval?</p>
      
                <label class="radio-inline">
                  <input value="Yes" type="radio" name="optradioReview" checked> Yes
                </label>
                <label class="radio-inline">
                  <input value="No" type="radio" name="optradioReview"> No
                </label>



              </div>

              <div class="form-group">

              <p>Please select the signer from Apollo</p>
      
                <label class="radio-inline">
                  <input value="Maurice Amsellem" type="radio" name="optradioApolloReview" checked> Maurice Amsellem
                </label>
                <label class="radio-inline">
                  <input value="Michael Levin" type="radio" name="optradioApolloReview"> Michael Levin
                </label>



              </div>

           
                  <div class="form-group">
                  <label>Comments <span style="color:red"><span> <span class="reqCommentsReview" style="color:red; display:none"> Please enter the comments. </span></label>
                  <textarea id="itemCommentReview" class="form-control" rows="5"></textarea> <br>

                  <div class="alert alert-warning lockedReview">
                 
                </div>
               
                  </div>
                  <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-warning btn-sm" id="EditRequiredbtnReview">
                      Edit Required
                    </button>
                    <button type="submit" class="btn btn-primary btn-sm" id="ApproveItembtnReview">
                      Approve
                    </button>
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>

















    <!-- Bootstrap Modal Dialog for EXECUTIVE files-->

    <div class="modal fade" id="NewPopupExecutive" tabindex="-1" role="dialog" aria-labelledby="NewPopupExecutiveLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
         
                <h4 class="modal-title" id="NewPopupLabelExecutive">
                    Add New File
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">

  



                  <div class="form-group">
                    <label>Comments <span style="color:red"><span> <span class="reqCommentsExecutive" style="color:red; display:none"> Please enter the comments. </span></label>
                    <textarea id="itemCommentExecutive" class="form-control" rows="5"></textarea>

                    <div class="alert alert-warning lockedExecutive">
                 
                    </div>
                  </div>
                  <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-warning btn-sm" id="EditRequiredbtnExecutive">
                      Edit Required
                    </button>
                    <button type="submit" class="btn btn-primary btn-sm" id="ApproveItembtnExecutive">
                      Approve
                    </button>
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>












    <!-- Bootstrap Modal Dialog for Edit Require Draft files-->
    <div class="modal fade" id="EditPopupDraft" tabindex="-1" role="dialog" aria-labelledby="EditPopupDraftLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title" id="EditPopupDraftLabel">
                    Add New File
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">
                  <div class="form-group">
                    <label>Comments <span style="color:red"><span> <span class="reqCommentsEditDraft" style="color:red; display:none"> Please enter the comments. </span></label>
                    <textarea id="itemCommentEditDraft" class="form-control" rows="5" ></textarea>
               
               
                    <div class="alert alert-warning lockedEditDraftRequired">
                 
                    </div>
               
                    </div>

                  <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary  btn-sm" id="SendForReviewDraft">
                    RESUBMIT FOR REVIEW (Draft)
                    </button>
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>












    <!-- Bootstrap Modal Dialog for Delete-->
    <div class="modal fade" id="DeletePopupDraft" tabindex="-1" role="dialog" aria-labelledby="DeletePopupDraftLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title" id="DeletePopupDraftLabel">
                    Add New File
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">
                  <div class="form-group">
                    <label>Comments <span style="color:red"><span> <span class="reqCommentsDeleteDraft" style="color:red; display:none"> Reason for delete. </span></label>
                    <textarea id="itemCommentDeleteDraft" class="form-control" rows="5" ></textarea>
               
               
                    <div class="alert alert-warning lockedDeleteDraftRequired">
                 
                    </div>
               
                    </div>

                  <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary  btn-sm" id="SendForDelete">
                  DELETE
                    </button>
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>





















    <!-- Bootstrap Modal Dialog for Edit Require files-->
    <div class="modal fade" id="EditPopup" tabindex="-1" role="dialog" aria-labelledby="EditPopupLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title" id="EditPopupLabel">
                    Add New File
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">
                  <div class="form-group">
                    <label>Comments <span style="color:red"><span> <span class="reqCommentsEdit" style="color:red; display:none"> Please enter the comments. </span></label>
                    <textarea id="itemCommentEdit" class="form-control" rows="5" ></textarea>
               
               
                    <div class="alert alert-warning lockedEditRequired">
                 
                    </div>
               
                    </div>

                  <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary  btn-sm" id="SendForReview">
                    RESUBMIT FOR APPROVAL
                    </button>
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>


















    <!-- Acknoledge Esign-->

    <div class="modal fade" id="EsignAck" tabindex="-1" role="dialog" aria-labelledby="EsignAckLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
         
                <h4 class="modal-title" id="EsignAckLabel">
                   E-sign Information
                </h4>
                <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                </button>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">

  


                You will need to sign the document using Adobe Sign. Please check your Outlook Inbox for an email from Adobe Sign to complete this process. The email may take up to 5 minutes to arrive in your inbox.
            
            
                  </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger  btn-sm" data-dismiss="modal" '>
                    ACKNOWLEDGE
                    </button>
                
                  </div>
            </div>
        </div>
    </div>
    </div>
    </div>

  `;
  let LoginUsername: string = "";
      var RestUrl = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('MemoProcess')/Items?$select=*,ItemComment,Assignee/Title,Requester/Title,DraftReviewer/Title,ExecutiveReviewer/Title&$expand=Assignee/Title,Requester/Title,ExecutiveReviewer/Title,DraftReviewer/Title`;
      var RestUrlLog = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('NotificationLog')/Items`;

      var getItem = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('MemoProcess')`;
      var getItemLog = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('NotificationLog')`;
      var webURL = this.context.pageContext.web.absoluteUrl;
      var getCurrentUser = this.context.pageContext.web.absoluteUrl + `/_api/web/CurrentUser`;
      $(document).ready(function() {

        
        $.ajax({
          url: getCurrentUser,
          method: "GET",
          headers: {
              "accept": "application/json;odata=verbose"
          },
          success: function(data) {


LoginUsername = data.d.Title;
            console.log(data.d.Title);
            PopulateGrid();
       
          }})





      


          function PopulateGrid() {
              //Clear datatables
              $('#FilesGrid').empty();
              ( < any > $('#NewPopup')).modal('hide');
              ( < any > $('#EditPopup')).modal('hide');


              //Get File list items
              $.ajax({
                  url: RestUrl,
                  method: "GET",
                  headers: {
                      "accept": "application/json;odata=verbose"
                  },
                  success: function(data) {

          
                      if (data.d.results.length > 0) {
                          let groupColumn = 7;

                       if(data.d.results != null){
                          $('#FilesGrid').append(GenerateTableFromJson(data.d.results));
                          var oTable = ( < any > $('#FilesTable')).DataTable({
                              select: true,
                              paging: false,
                              searching: false,
                              'columnDefs': [{
                                  'targets': groupColumn,
                                  'visible': false
                                
                              }],
                              // rowGroup: {
                              //     dataSrc: groupColumn,
                              //     startRender: function(rows, group) {
                              //         let collapsed = !!collapsedGroups[group];

                              //         rows.nodes().each(function(r) {
                              //             r.style.display = collapsed ? 'none' : '';
                              //         });

                              //         var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';
                              //         return $('<tr class="GroupHeader" />').append('<td colspan="7"><span style="cursor: pointer;"> <i class="fa fa-fw ' + toggleClass + ' toggler" ></i>' + group + ' (' + rows.count() + ')</span></td>')
                              //             .attr('data-name', group)
                              //             .toggleClass('collapsed', collapsed);
                              //     }
                              // },
                              //adjust column widths
                              "columns": [
                                  {
                                      title: 'PBR Name'
                                  },
                                  {
                                    title: 'PM'
                                },
                                {
                                  title: 'Memo'
                              },
                                {
                                  title: 'Date Submitted'
                              },
                              {
                                title: 'Date Needed By'
                            },
                                  {
                                    title: 'Current RR'
                                },
                            
                              {
                                title: 'Status'
                            },
                            {
                              title: 'Next Step'
                          },
                         
                                  {
                                      title: 'Action Needed By'
                                  },
                                
                              
                             

                                
                                  {
                                      "width": "2%"
                                  },
                                  {
                                    title: 'Delete'
                                },
                              ],
                              "aaSorting": [[ 4, "asc" ]] 
                          });


                          $('#FilesTable tbody').on('click', 'tr.group-start', function() {
                              var name = $(this).data('name');
                              collapsedGroups[name] = !collapsedGroups[name];
                              oTable.draw(false);
                          });


                        }

                      } else {
                          $('#FilesGrid').append("<span>No Files Found.</span>");
                      }
                  },
                  error: function(data) {
                      $('#FilesGrid').append("<span>Error Retreiving Files. Error : " + JSON.stringify(data) + "</span>");
                  }
              });


          };


          function GenerateTableFromJson(objArray) {
          var tableContent = `<table id="FilesTable" class="table" cellspacing="0" width="100%">
                        <thead style="background: #f0f4f5;">
                        <tr class="${styles.Tr_Head}">
               
                        <th>PBR Name</th>
                        <th>PM</th>
                        <th>Memo</th>
                        <th> Date Submitted</th>
                        <th> Date Needed By</th>
                        <th>Rating</th>
                        <th>Status</th>
   
                        <th>Next Step</th>
                        <th>Action Needed By</th>
                
              
                   
                  
                     
                        <th>Action</th>
                        <th>Delete</th>
                      </tr></thead>
                      <tbody>`;
              for (var i = 0; i < objArray.length; i++) {

if(objArray[i].Status != null){
                  let assigneeName: string = objArray[i].Assignee.Title;
                  let ShortName: string = "";
                  let executiveReviewerName: string = objArray[i].ExecutiveReviewer.Title;
                  let ShortNameexecutiveReviewerName: string = "";
                  let requesterName: string = objArray[i].Requester.Title;
                  let ShortNameRequester: string = "";


                  let draftReviewer: string = objArray[i].DraftReviewer.Title;
                  let ShortNamedraftReviewer: string = "";

                  let friendlyDate = "";
                  let friendlyCreatedDate = "";
                  let statusClass = '';
                  let statusIcon = '';
                  let buttonHTML = '';
                  let buttonDelete = '';
                  let itemStatus = objArray[i].Status;
                  let itemId = objArray[i].Id;
                  let SourceURL = objArray[i].Source;
                  let RiskRating = objArray[i].RiskRating
                  let RatingNumber = objArray[i].RatingNumber
                  let RiskRatingValue ='';
                  let NextStep = '';
                  let iconNextStep = '';
                  let fileIcon = 'fa fa-file-word-o';
                 let fileColor = 'blue'
                  if(RiskRating == "No"){
                    RiskRating = ""
                    RiskRatingValue = RatingNumber
                  }else if(RiskRating == "Yes") {
                
                    RiskRating = "fa fa-exclamation"
                    RiskRatingValue = RatingNumber
                  }else{
                    RiskRating = "fa fa-arrow-right"
                    RiskRatingValue = "TBD"
                  }
                  
                  if (assigneeName != undefined || assigneeName != null) {
                    ShortName = assigneeName.split(' ')[0].substr(0, 1) + (assigneeName.split(' ').length > 1 ? assigneeName.split(' ')[1].substr(0, 1) : '');
                }

                if (requesterName != undefined || requesterName != null) {
                  ShortNameRequester = requesterName.split(' ')[0].substr(0, 1) + (requesterName.split(' ').length > 1 ? requesterName.split(' ')[1].substr(0, 1) : '');
              }
  
              if (executiveReviewerName != undefined || executiveReviewerName != null) {
              
                ShortNameexecutiveReviewerName = executiveReviewerName.split(' ')[0].substr(0, 1) + (executiveReviewerName.split(' ').length > 1 ? executiveReviewerName.split(' ')[1].substr(0, 1) : '');
            }

              if (draftReviewer != undefined || draftReviewer != null) {
              
                ShortNamedraftReviewer = draftReviewer.split(' ')[0].substr(0, 1) + (draftReviewer.split(' ').length > 1 ? draftReviewer.split(' ')[1].substr(0, 1) : '');
            }


debugger;
                  if (itemStatus == 'New (Draft)' || itemStatus == 'New') {
                    statusClass = 'label label-primary label-outlined';
                    statusIcon = 'fa fa-star';


                    if(objArray[i].BypassDraft == "Yes"){
                      assigneeName = assigneeName;
                      ShortName = ShortName;
                      if(assigneeName.trim() == LoginUsername.trim()){
                        buttonHTML = '<button class="btn btn-success  btn-sm newbtn action-yellow "  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Perform Action</button>';

                      }else{
                        buttonHTML = '<button class="btn btn-success  disabled  btn-sm action-yellow "  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Unauthorized</button>';

                      }
                    }else{
                      assigneeName = draftReviewer;
                      ShortName = ShortNamedraftReviewer;
                    if(draftReviewer == LoginUsername.trim()){
                    buttonHTML = '<button class="btn btn-success  btn-sm newbtnDraft action-yellow "  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Perform Action</button>';
                    }else{
                      buttonHTML = '<button class="btn btn-success disabled  btn-sm action-yellow "  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Unauthorized</button>';
 
                    }
                  }
                   
                    buttonDelete = '<button class="btn btn-danger  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
              
               
                    NextStep= 'Review in Process'
                    iconNextStep = "label label-primary label-outlined"
                }

                  else if (itemStatus == 'Draft Approved' ) {
                      statusClass = 'label label-primary label-outlined';
                      statusIcon = 'fa fa-star';
                      if(assigneeName.trim() == LoginUsername.trim()){
                      buttonHTML = '<button class="btn btn-success  btn-sm newbtn action-yellow "  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Perform Action</button>';
                      }else{
                        buttonHTML = '<button class="btn btn-success  disabled  btn-sm action-yellow "  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Unauthorized</button>';

                      }
                      buttonDelete = '<button class="btn btn-danger  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                      assigneeName = assigneeName;
                      ShortName = ShortName;
                      NextStep= 'MD Memo Review'

                      iconNextStep = "label label-primary label-outlined"
                  }else if (itemStatus == 'Pending Review') {
                    statusClass = 'label label-warning label-outlined';
                    statusIcon = 'fa fa-star';
                 
                    if(assigneeName.trim() == LoginUsername.trim()){
                    buttonHTML = '<button class="btn btn-success  btn-sm pendingReviewbtn action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Perform Action</button>';
                    }else{
                      buttonHTML = '<button class="btn btn-success  disabled btn-sm  action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Unauthorized</button>';
     
                    }
                 
                 
                 
                    buttonDelete = '<button class="btn btn-danger  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                    assigneeName = assigneeName;
                    ShortName = ShortName;
                    NextStep= 'MD Memo Review'
                    iconNextStep = "label label-warning label-outlined"
                }
                else if (itemStatus == 'Pending Review (Draft)') {
                  statusClass = 'label label-warning label-outlined';
                  statusIcon = 'fa fa-star';
                  if(draftReviewer == LoginUsername.trim()){
                  buttonHTML = '<button class="btn btn-success  btn-sm pendingReviewbtnDraft action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Perform Action</button>';
                  }
                  else{
                    buttonHTML = '<button class="btn btn-success disabled  btn-sm  action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Unauthorized</button>';
  
                  }
                  
                  buttonDelete = '<button class="btn btn-danger  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                  assigneeName = draftReviewer;
                  ShortName = ShortNamedraftReviewer;
                  NextStep= 'Review in Process'
                  iconNextStep = "label label-warning label-outlined"
              }
                  
                else if (itemStatus == 'Pending Exec Approval') {
             
                    statusClass = 'label label-warning label-outlined';
                    statusIcon = 'fa fa-spinner fa-spin';
                    if(executiveReviewerName.trim() == LoginUsername.trim()){
                    buttonHTML = '<button class="btn btn-success  btn-sm pendingExecutive action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Perform Action</button>';
                    }else{
                      buttonHTML = '<button class="btn btn-success disabled  btn-sm  action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Unauthorized</button>';
  
                    }
                  
                    buttonDelete = '<button class="btn btn-danger  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                    assigneeName = executiveReviewerName;
                    ShortName = ShortNameexecutiveReviewerName;
                    NextStep= 'CEO Reviews Memo'
                    iconNextStep = "label label-info label-outlined"
                }
                  
                  else if (itemStatus == 'In Review' || itemStatus == 'Edit Required' ||  itemStatus == 'Edit Required (Executive)') {
                      
                    statusClass = 'label label-warning label-outlined';
                    statusIcon = 'fa fa-exclamation';
                    assigneeName = requesterName;
                    ShortName = ShortNameRequester;  
                    if(requesterName.trim() == LoginUsername.trim()){            
                      buttonHTML = '<button class="btn btn-success btn-sm editRequired action-greem" href="#"  style="background: #106ebe; WHITE-SPACE: NOWRAP !IMPORTANT"  status="editrequired" id =' + itemId + '>Perform Action</button>';
                    }else{
                      buttonHTML = '<button class="btn btn-success btn-sm disabled action-greem" href="#"  style="background: #106ebe; WHITE-SPACE: NOWRAP !IMPORTANT"  status="editrequired" id =' + itemId + '>Unauthorized</button>';

                    }
                      buttonDelete = '<button class="btn btn-danger  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                      NextStep= 'PM Updates Memo'
                      iconNextStep = "label label-info label-outlined"
                    } 
                    
                    else if (itemStatus == 'Edit Required (Draft)') {
                      
                      statusClass = 'label label-warning label-outlined';
                      statusIcon = 'fa fa-exclamation';
                      assigneeName = requesterName;
                      ShortName = ShortNameRequester; 
                      if(requesterName.trim() == LoginUsername.trim()){                  
                        buttonHTML = '<button class="btn btn-success btn-sm editRequiredDraft action-greem" href="#"  style="background: #106ebe; WHITE-SPACE: NOWRAP !IMPORTANT"  status="editrequired" id =' + itemId + '>Perform Action</button>';
                      }else{
                        buttonHTML = '<button class="btn btn-success btn-sm disabled  action-greem" href="#"  style="background: #106ebe; WHITE-SPACE: NOWRAP !IMPORTANT"  status="editrequired" id =' + itemId + '>Unauthorized</button>';

                      }
                        buttonDelete = '<button class="btn btn-danger  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                        NextStep= 'PM Updates Memo'
                        iconNextStep = "label label-info label-outlined"
                      } 




                    
                    else if (itemStatus == 'Completed' || itemStatus == 'Approved' || itemStatus == 'Fully Executed') {
                      statusClass = 'label label-info label-outlined';
                      statusIcon = 'fa fa-check-square';
                      fileIcon = 'fa fa-file-pdf-o'
                      fileColor = 'Red'
                      buttonHTML = '<a class="btn btn-info  btn-sm checkDocument action-purple" style="background: gray" href="' + SourceURL + '" status="approved">View</a>';
                      buttonDelete = '<button class="btn btn-danger disabled  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                      assigneeName = requesterName;
                      ShortName = ShortNameRequester;
                      NextStep= 'Completed'
                      iconNextStep ="label label-info label-outlined"
                  }

                  

                  else if (itemStatus == 'Recommended for Approval by MCF') {
                    statusClass = 'label label-success label-outlined';
                    statusIcon = 'fa fa-check-circle';
                   // buttonHTML = '<button class="btn btn-success  btn-sm btnesign action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Start Esign</button>';
                   buttonHTML = "<span class='badge badge-pill badge-light'>Esign started..</span>"
                   buttonDelete = '<button class="btn btn-danger disabled  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                    assigneeName = assigneeName;
                    ShortName = ShortName;
                    NextStep= 'E-sign Process'
         
                    iconNextStep ="label label-info label-outlined"
             
               
                }
                else if (itemStatus == 'Wait for sign') {
                  statusClass = 'label label-success label-outlined';
                  statusIcon = 'fa fa-pen';
                 // buttonHTML = '<button class="btn btn-success  btn-sm btnesign action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Start Esign</button>';
                 buttonHTML = "<span class='badge badge-pill badge-light'>Esign started..</span>"
                 buttonDelete = '<button class="btn btn-danger disabled  btn-sm newbtnDelete action-yellow "  style="background: ##dc1919 ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" id =' + itemId + '>Delete</button>';
                 assigneeName = requesterName;
                  ShortName = ShortNameRequester;
                  NextStep= 'Sign and file'
       
                  iconNextStep ="label label-info label-outlined"
           
             
              }

                  /*
                  else if (itemStatus == 'Pending Exec Approval') {
                    statusClass = 'text-warning';
                    statusIcon = 'fa fa-spinner fa-spin';
                    buttonHTML = '<button class="btn btn-success  btn-sm newbtnExec action-yellow"  style="background: #106ebe ; WHITE-SPACE: NOWRAP !IMPORTANT" href="#" status="new" id =' + itemId + '>Perform Action</button>';

                    assigneeName = requesterName;
                    ShortName = ShortNameRequester;
             
               
                }
                  
                */



               if (objArray[i].Created != undefined) {

                var date = new Date(objArray[i].Created);
                //var month = date.getMonth() + 1;
             //   friendlyDate = objArray[i].DateNeededBy//(month.toString().length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
     
          friendlyCreatedDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
              }


                  if (objArray[i].DateNeededBy != undefined) {
                      var date = new Date(objArray[i].DateNeededBy);
                      //var month = date.getMonth() + 1;
                   //   friendlyDate = objArray[i].DateNeededBy//(month.toString().length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
        
                friendlyDate =((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
                    }



                  

                  tableContent += `
                                  <tr>            
                                      <td>${objArray[i].Borrower}</td>
                              

                                      <td>
                                      <div class="${styles["name-wrapper"]}">
                                        <div class="${styles["name-round"]}">${ShortNameRequester.toUpperCase()}</div>
                                        <div class="${styles["name-whole"]}">${requesterName}</div>
                                      </div>
                                    </td>
                                    <td> <i style="color:${fileColor}" class="${fileIcon}"></i> <a href="#" onclick="window.open('${SourceURL}');return false;" style="cursor:pointer">${objArray[i].Title}</a></td>

                                    <td  style= "white-space: nowrap !important"><i class="fa fa-calendar" aria-hidden="true"></i> ${friendlyCreatedDate}</td>
                                    <td  style= "white-space: nowrap !important"><i class="fa fa-calendar" aria-hidden="true"></i> ${friendlyDate}</td>
                                      <td><span><i  class="${RiskRating}"></i> ${RiskRatingValue}</span></td>
                                      <td> <span class="${statusClass}"><i  class="${statusIcon}"></i> ${itemStatus}</span></td>
                      
                                      <td> <span  class="${iconNextStep}"> ${NextStep} </span>   </td>
                                      <td>
                                          <div class="${styles["name-wrapper"]}">
                                            <div class="${styles["name-round"]}">${ShortName.toUpperCase()}</div>
                                            <div class="${styles["name-whole"]}">${assigneeName}</div>
                                          </div>
                                        </td>
                                  
                          
                                
                                  
                         
                            
                                      <td>${buttonHTML}</td>
                                      <td>${buttonDelete}</td>
                                  </tr>
                                  `;
              }
            }
              tableContent += `
                              </tbody>
                              </table>`;
              return tableContent;
          };






        function getFormDigets() {
            var formDigest; // Global Variable

            $.ajax({
                url: webURL + "/\_api/contextinfo",
                type: "POST",
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "contentType": "text/xml"
                },
                success: function(dataforDigest) {
                    var requestdigest = dataforDigest;
                    formDigest = dataforDigest.d.GetContextWebInformation.FormDigestValue;
                },
                error: function(err) {
                    console.log(JSON.stringify(err));
                }
            });

            return formDigest;
        }

        function getEtag(id) {
          var newEtag; // Global Variable

          $.ajax({
              url: getItem + "/items(" + id + ")",
              type: "GET",
              async: false,
              headers: {
                  "accept": "application/json;odata=verbose",
                  "contentType": "text/xml"
              },
              success: function(dataforEtag) {
                  newEtag = dataforEtag.d.__metadata.etag;
                  
              },
              error: function(err) {
                  console.log(JSON.stringify(err));
              }
          });

          return newEtag;
      }

$(document).on('click', '.pendingReviewbtn', function(e) {
            e.preventDefault();
          
            $(".showhide").hide();
            $('#itemCommentReview').val('')
            $('.lockedReview').html('')
            var id = this.id;
            var status = this.status;
            let ApolloApprover = null;
            var requestUri = getItem + "/items(" + id + ")";
            $.ajax({
                url: requestUri,
                method: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "accept": "application/json;odata=verbose"
                },
                success: function(data1) {
                    $('#fileId').val(data1.d.Id);
      
                    $("#CurrentRiskLabel").text(data1.d.RiskRating)
                    ApolloApprover = data1.d.ApolloApprover             
                    if(data1.d.RiskRating == "Yes"){
                      $('input:radio[name=optradioReview]').val(['Yes']);
                    }else{
                      $('input:radio[name=optradioReview]').val(['No']);
                    }
               
                   
                    if(ApolloApprover !=null){
                      $('input:radio[name=optradioApolloReview]').val([ApolloApprover]);
                     }

                    $('#ReviewPopupLabel').html('Memo Review');
                    ( < any > $('#ReviewPopup')).modal('show');
                    $("#etag").val(data1.d.__metadata.etag);
                  
                }
            });
        });



//Draft


        $(document).on('click', '.pendingReviewbtnDraft', function(e) {
          e.preventDefault();
          $(".showhide").hide();
          $('#itemCommentReviewDraft').val('')
          $('.lockedReviewDraft').html('')
          var id = this.id;
          var status = this.status;
          var requestUri = getItem + "/items(" + id + ")";
          $.ajax({
              url: requestUri,
              method: "GET",
              contentType: "application/json;odata=verbose",
              headers: {
                  "accept": "application/json;odata=verbose"
              },
              success: function(data1) {
                  $('#fileId').val(data1.d.Id);
      
               //   $("#CurrentRiskLabel").text(data1.d.RiskRating)
                  $('#ReviewPopupDraftLabel').html('Memo Review (Draft)');
                  ( < any > $('#ReviewPopupDraft')).modal('show');
                  $("#etag").val(data1.d.__metadata.etag);
                
              }
          });
      });





      $(document).on('click', '#EditRequiredbtnReviewDraft', function() {


        var itemComment = $("#itemCommentReviewDraft").val();  
        
       // if(itemComment !=""){
        //  $(".reqCommentsReviewDraft").hide()
             var id = $("#fileId").val();
             //var eTag = $("#etag").val();
             var eTag = getEtag(id);
             var formDigest = getFormDigets();
             
             var requestUri = getItem + "/items(" + id + ")";
                  var requestHeaders = {
                      "accept": "application/json;odata=verbose",
                      "X-HTTP-Method": "MERGE",
                      "X-RequestDigest": formDigest,
                      "If-Match": eTag
                  }
                  var fileData = null;
            
                    fileData = {
                        __metadata: {
                            "type": "SP.Data.MemoProcessItem"
                        },
                        ItemComment: itemComment,
                        Status: "Edit Required (Draft)", 
                        NotificationStatus : "Sending"             
                    };
                  
                  var requestBody = JSON.stringify(fileData);
    
                  return $.ajax({
                      url: requestUri,
                      type: "POST",
                      contentType: "application/json;odata=verbose",
                      headers: requestHeaders,
                      data: requestBody,
                      success: function() {
                          PopulateGrid();
                          ( < any > $('#ReviewPopupDraft')).modal('hide');
                          UpdateNotificationLog(id)
                      },
                      error: function(xhr, status, error){
    
                      $(".lockedReviewDraft").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')
    
                    
    
                      }
                  });
    
               // }else{
                 // $(".reqCommentsReviewDraft").show()
               // }
             
              });
    



$(document).on('click', '#EditRequiredbtnReview', function() {

  var riskRating = $("input[name='optradioReview']:checked").val();
  var apolloApprover = $("input[name='optradioApolloReview']:checked").val();
    var itemComment = $("#itemCommentReview").val();  

   // if(itemComment !=""){
      //$(".reqCommentsReview").hide()
         var id = $("#fileId").val();
         //var eTag = $("#etag").val();
         var eTag = getEtag(id);
         var formDigest = getFormDigets();
         
         var requestUri = getItem + "/items(" + id + ")";
              var requestHeaders = {
                  "accept": "application/json;odata=verbose",
                  "X-HTTP-Method": "MERGE",
                  "X-RequestDigest": formDigest,
                  "If-Match": eTag
              }
              var fileData = null;
        
                fileData = {
                    __metadata: {
                        "type": "SP.Data.MemoProcessItem"
                    },
                    ItemComment: itemComment,
                    Status: "Edit Required", 
                    RiskRating: riskRating,
                    NotificationStatus : "Sending",
                    ApolloApprover :      apolloApprover,        
                };
              
              var requestBody = JSON.stringify(fileData);

              return $.ajax({
                  url: requestUri,
                  type: "POST",
                  contentType: "application/json;odata=verbose",
                  headers: requestHeaders,
                  data: requestBody,
                  success: function() {
                      PopulateGrid();
                      ( < any > $('#ReviewPopup')).modal('hide');
                      UpdateNotificationLog(id)
                  },
                  error: function(xhr, status, error){

                  $(".lockedReview").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')

                

                  }
              });

          //  }else{
            //  $(".reqCommentsReview").show()
           // }
         
          });

 $(document).on('click', '#ApproveItembtnReview', function() {

      let setStatus ='';
      //let riskRating =  $("#CurrentRiskLabel").text().trim();   
      var itemComment = $("#itemCommentReview").val();    
      var riskRating = $("input[name='optradioReview']:checked").val();
      var apolloApprover = $("input[name='optradioApolloReview']:checked").val();
     // if(itemComment != ""){
        //$(".reqCommentsReview").hide();
if(riskRating == "Yes"){
    setStatus= "Pending Exec Approval"
}else{
    setStatus= "Recommended for Approval by MCF"
}                      
                
         var id = $("#fileId").val();
         //var eTag = $("#etag").val();
         var eTag = getEtag(id);
         var formDigest = getFormDigets();
         var requestUri = getItem + "/items(" + id + ")";
              var requestHeaders = {
                  "accept": "application/json;odata=verbose",
                  "X-HTTP-Method": "MERGE",
                  "X-RequestDigest": formDigest,
                  "If-Match": eTag
              }

  
        
              var  fileData = {
                    __metadata: {
                        "type": "SP.Data.MemoProcessItem"
                    },
                    ItemComment: itemComment,
                    RiskRating: riskRating,
                    Status: setStatus,
                    ApolloApprover: apolloApprover
                  
                };

              
              var requestBody = JSON.stringify(fileData);

              return $.ajax({
                  url: requestUri,
                  type: "POST",
                  contentType: "application/json;odata=verbose",
                  headers: requestHeaders,
                  data: requestBody,
                  success: function() {
                      PopulateGrid();
                      ( < any > $('#ReviewPopup')).modal('hide');
                      ( < any > $('#EsignAck')).modal('show'); 
                      UpdateNotificationLog(id);
                  },
                  error: function(xhr, status, error){

                    $(".lockedReview").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')




                  }
              });
       



           // }else{
           //   $(".reqCommentsReview").show();
         //   }



          });


          $(document).on('click', '#ApproveItembtnReviewDraft', function() {
      
        
         
                  var itemComment = $("#itemCommentReviewDraft").val();    
            
                //  if(itemComment != ""){
                   // $(".reqCommentsReviewDraft").hide();
         //   if(riskRating == "Yes"){
              //  setStatus= "Pending Exec Approval"
        //    }else{
              //  setStatus= "MCF Approved"
          //  }                      
                            
                     var id = $("#fileId").val();
                     //var eTag = $("#etag").val();
                     var eTag = getEtag(id);
                     var formDigest = getFormDigets();
                     var requestUri = getItem + "/items(" + id + ")";
                          var requestHeaders = {
                              "accept": "application/json;odata=verbose",
                              "X-HTTP-Method": "MERGE",
                              "X-RequestDigest": formDigest,
                              "If-Match": eTag
                          }
            
              
                    
                          var  fileData = {
                                __metadata: {
                                    "type": "SP.Data.MemoProcessItem"
                                },
                                ItemComment: itemComment,
                                Status: "Draft Approved"
                              
                            };
            
                          
                          var requestBody = JSON.stringify(fileData);
            
                          return $.ajax({
                              url: requestUri,
                              type: "POST",
                              contentType: "application/json;odata=verbose",
                              headers: requestHeaders,
                              data: requestBody,
                              success: function() {
                                  PopulateGrid();
                                  
                                  ( < any > $('#ReviewPopupDraft')).modal('hide');
                                  UpdateNotificationLog(id);
                              },
                              error: function(xhr, status, error){
            
                                $(".lockedReviewDraft").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')
            
            
            
            
                              }
                          });
                   
            
            
            
                      //  }else{
                       //   $(".reqCommentsReviewDraft").show();
                      //  }
            
            
            
                      });
            


$(document).on('click', '.pendingExecutive', function(e) {
            e.preventDefault();
            $(".showhide").hide();
            $('#itemCommentExecutive').val('')
            $('.lockedExecutive').html('')
            var id = this.id;
            var status = this.status;
            var requestUri = getItem + "/items(" + id + ")";
            $.ajax({
                url: requestUri,
                method: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "accept": "application/json;odata=verbose"
                },
                success: function(data1) {
                
                    $('#fileId').val(data1.d.Id);
                    $('#NewPopupLabelExecutive').html('Memo Review Executive');
                    ( < any > $('#NewPopupExecutive')).modal('show');
                    $("#etag").val(data1.d.__metadata.etag);
                  
                }
            });
        });
   
$(document).on('click', '#ApproveItembtnExecutive', function() {

        
            var itemComment = $("#itemCommentExecutive").val();
            //if(itemComment !=""){
             // $(".reqCommentsExecutive").hide();
              var id = $("#fileId").val();
              //var eTag = $("#etag").val();
              var eTag = getEtag(id);
              var formDigest = getFormDigets();
              var requestUri = getItem + "/items(" + id + ")";
              var requestHeaders = {
                  "accept": "application/json;odata=verbose",
                  "X-HTTP-Method": "MERGE",
                  // "X-RequestDigest": $('#__REQUESTDIGEST').val(),
                  "X-RequestDigest": formDigest,
                  "If-Match": eTag
              }       
              var fileData = {
                    __metadata: {
                        "type": "SP.Data.MemoProcessItem"
                    },
                    ItemComment: itemComment,
                    Status: "Recommended for Approval by MCF",
                    NotificationStatus: "Sending"
         
              
                };
            var requestBody = JSON.stringify(fileData);

              return $.ajax({
                  url: requestUri,
                  type: "POST",
                  contentType: "application/json;odata=verbose",
                  headers: requestHeaders,
                  data: requestBody,
                  success: function() {
                      PopulateGrid();
                      ( < any > $('#NewPopupExecutive')).modal('hide');
                      UpdateNotificationLog(id);
                  },
                  error: function(xhr, status, error){

                    $(".lockedExecutive").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')




                  }
              });
          //  }else{
           //   $(".reqCommentsExecutive").show();
           // }
          });

 $(document).on('click', '#EditRequiredbtnExecutive', function() {
    var itemComment = $("#itemCommentExecutive").val();

   // if(itemComment !=""){
      //$(".reqCommentsExecutive").hide();
    var id = $("#fileId").val();
    //var eTag = $("#etag").val();
    var eTag = getEtag(id);
    var formDigest = getFormDigets();
              var requestUri = getItem + "/items(" + id + ")";
              var requestHeaders = {
                  "accept": "application/json;odata=verbose",
                  "X-HTTP-Method": "MERGE",
                  "X-RequestDigest": formDigest,
                  "If-Match": eTag
              }
                     
              var  fileData = {
                    __metadata: {
                        "type": "SP.Data.MemoProcessItem"
                    },
                    ItemComment: itemComment,
                    Status: "Edit Required (Executive)",
                    NotificationStatus: "Sending"              
                };
              
              var requestBody = JSON.stringify(fileData);

              return $.ajax({
                  url: requestUri,
                  type: "POST",
                  contentType: "application/json;odata=verbose",
                  headers: requestHeaders,
                  data: requestBody,
                  success: function() {
                      PopulateGrid();
                      ( < any > $('#NewPopupExecutive')).modal('hide');
                      UpdateNotificationLog(id)
                  },
                  error: function(xhr, status, error){

                    $(".lockedExecutive").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')




                  }
              });
          //  }else{
            //  $(".reqCommentsExecutive").show();
           // }
          });




//DRAFT NEW
          $(document).on('click', '.newbtnDraft', function(e) {
         
                 
                                e.preventDefault();
                                $(".showhide").show();
                          
                                $('#itemCommentNewDraft').val('')
                                $(".lockedNewDraft").html("")
                             //   $("#Rating").val($("#Rating option:first").val());
                                var id = this.id;
                                var status = this.status;
                                var requestUri = getItem + "/items(" + id + ")";
                                $.ajax({
                                    url: requestUri,
                                    method: "GET",
                                    contentType: "application/json;odata=verbose",
                                    headers: {
                                        "accept": "application/json;odata=verbose"
                                    },
                                    success: function(data1) {
                                      debugger;
                                        $('#fileId').val(data1.d.Id);

                                        var flID =  $('#fileId').val();
                                        $('#NewPopupDraftLabel').html('Memo Review');
                                        ( < any > $('#NewPopupDraft')).modal('show');
                                        
                                        $("#etag").val(data1.d.__metadata.etag);
                                      
                                    }
                                });
                            });
                  

//DRAFT EDIT REQUIRED
                            $(document).on('click', '#EditRequiredbtnNewDraft', function() {
                           
                              debugger;
                                 // let riskRating = '';
                                //  let currentRiskRate = null; 
                                //  riskRating = $("#Rating").val();   
                                  var itemComment = $("#itemCommentNewDraft").val();    
                                //  if(riskRating != ""){ 
                                 //   $(".reqRating").hide()  
                                 // if(itemComment != ""){ 
                                  //  $(".reqCommentsNewDraft").hide()  
                                
                            
                                  //   currentRiskRate = parseInt($("#Rating").val().trim());
                                   //  if(currentRiskRate){    
                                              // if(currentRiskRate >= 6){
                                                 //  riskRating = "Yes"
                                              // }else{
                                               //    riskRating =  "No"
                                              // }                                
                                           // }   
                                     var id = $("#fileId").val();
                                     //var eTag = $("#etag").val();
                                     var eTag = getEtag(id);
                                     var formDigest = getFormDigets();
                                     var requestUri = getItem + "/items(" + id + ")";
                                          var requestHeaders = {
                                              "accept": "application/json;odata=verbose",
                                              "X-HTTP-Method": "MERGE",
                                              "X-RequestDigest": formDigest,
                                              "If-Match": eTag
                                          }
                            
                                          var fileData = null;
                                    
                                            fileData = {
                                                __metadata: {
                                                    "type": "SP.Data.MemoProcessItem"
                                                },
                                                ItemComment: itemComment,
                                                Status: "Edit Required (Draft)",
                                               // RiskRating: riskRating,
                                              //  RatingNumber : currentRiskRate.toString(),
                                                NotificationStatus : "Sending"
                                            };
                            
                                          
                                          var requestBody = JSON.stringify(fileData);
                            
                                          return $.ajax({
                                              url: requestUri,
                                              type: "POST",
                                              contentType: "application/json;odata=verbose",
                                              headers: requestHeaders,
                                              data: requestBody,
                                              success: function() {
                                                  PopulateGrid();
                                             
                                                  ( < any > $('#NewPopupDraft')).modal('hide');

                                                  debugger;
                                                  UpdateNotificationLog(id)
                                              },
                                              error: function(xhr, status, error){
                            
                                                $(".lockedNewDraft").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')
                            
                            
                            
                            
                                              }
                                          });
                                      //  }else{
                                         // $(".reqCommentsNewDraft").show()  
                                    
                                       // }
                                  //    }else{
                                        
                                      //  $(".reqRating").show()   
                                     // }
                            
                            
                            
                            
                            
                            
                            
                                      });



                                      $(document).on('click', '#ApproveItembtnNewDraft', function() {

                                        let setStatus ='';
                                      //  let riskRating = '';
                                      //  let currentRiskRate = null; 
                                      //  riskRating = $("#Rating").val();   
                                        var itemComment = $("#itemCommentNewDraft").val();    
                                       // if(riskRating != ""){ 
                                        //  $(".reqRating").hide()  
                                      //    if(itemComment != ""){ 
                                         //   $(".reqCommentsNewDraft").hide()  
                                         //  currentRiskRate = parseInt($("#Rating").val().trim());
                                        //   if(currentRiskRate){    
                                                  //   if(currentRiskRate >= 6){
                                                     //    riskRating = "Yes"
                                                      //   setStatus= "Pending Exec Approval"
                                                   //  }else{
                                                      //   riskRating =  "No"
                                                        // setStatus= "MCF Approved"
                                                   //  }                                
                                                 // }   
                                           var id = $("#fileId").val();
                                           //var eTag = $("#etag").val();
                                           var eTag = getEtag(id);
                                           var formDigest = getFormDigets();
                                           var requestUri = getItem + "/items(" + id + ")";
                                                var requestHeaders = {
                                                    "accept": "application/json;odata=verbose",
                                                    "X-HTTP-Method": "MERGE",
                                                    "X-RequestDigest": formDigest,
                                                    "If-Match": eTag
                                                }
                                  
                                                var fileData = null;
                                          
                                                  fileData = {
                                                      __metadata: {
                                                          "type": "SP.Data.MemoProcessItem"
                                                      },
                                                      ItemComment: itemComment,
                                                      Status: "Draft Approved",
                                                     // RiskRating: riskRating,
                                                    //  RatingNumber : currentRiskRate.toString(),
                                                      NotificationStatus : "Sending"
                                                  };
                                  
                                                
                                                var requestBody = JSON.stringify(fileData);
                                  
                                                return $.ajax({
                                                    url: requestUri,
                                                    type: "POST",
                                                    contentType: "application/json;odata=verbose",
                                                    headers: requestHeaders,
                                                    data: requestBody,
                                                    success: function() {
                                                        PopulateGrid();
                                                                 ( < any > $('#NewPopupDraft')).modal('hide');
                                                                 UpdateNotificationLog(id)
                                                    },
                                                    error: function(xhr, status, error){
                                  
                                                      $(".lockedNewDraft").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')
                                  
                                  
                                  
                                  
                                                    }
                                                });
                                                
                                            //  }else{
                                                //$(".reqCommentsNewDraft").show()  
                                              //}
                                          //  }else{
                                            //  $(".reqRating").show()   
                                           // }
                                            });























//khan
$(document).on('click', '.newbtn', function(e) {

let currentRiskRate = null; 
let ApolloApprover = null;
                    e.preventDefault();
                    $(".showhide").show();
              
                    $('#itemCommentNew').val('')
                    $(".lockedNew").html("")
                    $("#Rating").val($("#Rating option:first").val());
                    var id = this.id;
                    var status = this.status;
                    var requestUri = getItem + "/items(" + id + ")";
                    $.ajax({
                        url: requestUri,
                        method: "GET",
                        contentType: "application/json;odata=verbose",
                        headers: {
                            "accept": "application/json;odata=verbose"
                        },
                        success: function(data1) {
                        
                          ApolloApprover = data1.d.ApolloApprover
                          $('#riskRatingNumber').val(data1.d.RatingNumber);
                          currentRiskRate = parseFloat(data1.d.RatingNumber);
                          if(currentRiskRate >= 6){
                            $('input:radio[name=optradio]').val(['Yes']);
                        } else{
                          $('input:radio[name=optradio]').val(['No']);
                         }   

                         if(ApolloApprover !=null){
                          $('input:radio[name=optradioApollo]').val([ApolloApprover]);
                         }


                            $('#fileId').val(data1.d.Id);
                            $('#NewPopupLabel').html('Memo Review');
                            ( < any > $('#NewPopup')).modal('show');
                            $("#etag").val(data1.d.__metadata.etag);
                          
                        }
                    });
                });
      
//For the New form - very first
 $(document).on('click', '#EditRequiredbtnNew', function() {


  var riskRating = $("input[name='optradio']:checked").val();
  var apolloApprover = $("input[name='optradioApollo']:checked").val();



      // let riskRating = '';
       let currentRiskRate = null; 
    //  riskRating = $("#Rating").val();   
      var itemComment = $("#itemCommentNew").val();    
     // if(riskRating != ""){ 
        $(".reqRating").hide()  
     // if(itemComment != ""){ 
      //  $(".reqCommentsNew").hide()  
    

       currentRiskRate = parseFloat($("#riskRatingNumber").val().trim());
       // if(currentRiskRate){    
                 //  if(currentRiskRate >= 6){
                      // riskRating = "Yes"
                  // }else{
                     // riskRating =  "No"
                  // }                                
               // }   
         var id = $("#fileId").val();
         //var eTag = $("#etag").val();
         var eTag = getEtag(id);
         var formDigest = getFormDigets();
         var requestUri = getItem + "/items(" + id + ")";
              var requestHeaders = {
                  "accept": "application/json;odata=verbose",
                  "X-HTTP-Method": "MERGE",
                  "X-RequestDigest": formDigest,
                  "If-Match": eTag
              }

              var fileData = null;
        
                fileData = {
                    __metadata: {
                        "type": "SP.Data.MemoProcessItem"
                    },
                    ItemComment: itemComment,
                    Status: "Edit Required",
                    RiskRating: riskRating,
                    RatingNumber : currentRiskRate.toString(),
                    NotificationStatus : "Sending",
                    ApolloApprover: apolloApprover
                };

              
              var requestBody = JSON.stringify(fileData);

              return $.ajax({
                  url: requestUri,
                  type: "POST",
                  contentType: "application/json;odata=verbose",
                  headers: requestHeaders,
                  data: requestBody,
                  success: function() {
                      PopulateGrid();
                      UpdateNotificationLog(id)
                  },
                  error: function(xhr, status, error){

                    $(".lockedNew").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')




                  }
              });
         //   }else{
            //  $(".reqCommentsNew").show()  
        
         //   }
         // }else{
            
         //   $(".reqRating").show()   
        //  }







          });
//For the New form - very first
 $(document).on('click', '#ApproveItembtnNew', function() {



  var riskRating = $("input[name='optradio']:checked").val();
  var apolloApprover = $("input[name='optradioApollo']:checked").val();
      let setStatus ='';
     // let riskRating = '';
     let currentRiskRate = null; 
  //   riskRating = $("#riskRatingNumber").val();   
     var itemComment = $("#itemCommentNew").val();    
    //  if(riskRating != ""){ 
     //   $(".reqRating").hide()  
      //  if(itemComment != ""){ 

       
         // $(".reqCommentsNew").hide()  
         currentRiskRate = parseFloat($("#riskRatingNumber").val().trim());
        //if(currentRiskRate){   
          
        
        if(riskRating == "Yes"){
          setStatus= "Pending Exec Approval"
          
        }else{
          setStatus= "Recommended for Approval by MCF"
        }
                                                 
               // }   
         var id = $("#fileId").val();
         //var eTag = $("#etag").val();
         var eTag = getEtag(id);
         var formDigest = getFormDigets();
         var requestUri = getItem + "/items(" + id + ")";
              var requestHeaders = {
                  "accept": "application/json;odata=verbose",
                  "X-HTTP-Method": "MERGE",
                  "X-RequestDigest": formDigest,
                  "If-Match": eTag
              }

              var fileData = null;
        
                fileData = {
                    __metadata: {
                        "type": "SP.Data.MemoProcessItem"
                    },
                    ItemComment: itemComment,
                    Status: setStatus,
                    RiskRating: riskRating,
                    RatingNumber : currentRiskRate.toString(),
                    NotificationStatus : "Sending",
                    ApolloApprover: apolloApprover
                };

              
              var requestBody = JSON.stringify(fileData);

              return $.ajax({
                  url: requestUri,
                  type: "POST",
                  contentType: "application/json;odata=verbose",
                  headers: requestHeaders,
                  data: requestBody,
                  success: function() {
                      PopulateGrid();
                      UpdateNotificationLog(id);

                      
                      ( < any > $('#NewPopup')).modal('hide');
                      ( < any > $('#EsignAck')).modal('show');
                  },
                  error: function(xhr, status, error){

                    $(".lockedNew").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')




                  }
              });
              
           // }else{
            //  $(".reqCommentsNew").show()  
          //  }
        //  }else{
           // $(".reqRating").show()   
        //  }
          });



//DRAFT
          $(document).on('click', '.editRequiredDraft', function(e) {
            e.preventDefault();
            $('#itemCommentEditDraft').val('')
             $(".lockedEditDraftRequired").html("");
            var id = this.id;
            var status = this.status;
            var requestUri = getItem + "/items(" + id + ")";

            $.ajax({
                url: requestUri,
                method: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "accept": "application/json;odata=verbose"
                },
                success: function(data) {
                    $('#fileId').val(data.d.Id);
                    $('#EditPopupDraftLabel').html('Edit Required');
                    ( < any > $('#EditPopupDraft')).modal('show');
                    $("#etag").val(data.d.__metadata.etag);
                }
            });
          
       
        });






//Delete Button Pop up Modal
$(document).on('click', '.newbtnDelete', function(e) {
  e.preventDefault();
  $('#itemCommentDeleteDraft').val('')
   $(".lockedDeleteDraftRequired").html("");
  var id = this.id;
  var status = this.status;
  var requestUri = getItem + "/items(" + id + ")";

  $.ajax({
      url: requestUri,
      method: "GET",
      contentType: "application/json;odata=verbose",
      headers: {
          "accept": "application/json;odata=verbose"
      },
      success: function(data) {
          $('#fileId').val(data.d.Id);
          $('#DeletePopupDraftLabel').html('Delete Confirmation');
          ( < any > $('#DeletePopupDraft')).modal('show');
          $("#etag").val(data.d.__metadata.etag);
      }
  });


});





//Delete Button Confirmed
$(document).on('click', '#SendForDelete', function() {

            
                var itemComment = $("#itemCommentDeleteDraft").val();
                if(itemComment !=""){
                  $(".reqCommentsDeleteDraft").hide();
                var id = $("#fileId").val();
                //var eTag = $("#etag").val();
                var eTag = getEtag(id);
                var formDigest = getFormDigets();
  
  
                var requestUri = getItem + "/items(" + id + ")/recycle()";
                var requestHeaders = {
                    "accept": "application/json;odata=verbose",
       
                    "X-RequestDigest": formDigest,
                    "If-Match": eTag
                }
  
                return $.ajax({
                    url: requestUri,
                    type: "DELETE",
                    contentType: "application/json;odata=verbose",
                    headers: requestHeaders,
                  //  data: requestBody,
                    success: function() {
                        PopulateGrid();
                        ( < any > $('#DeletePopupDraft')).modal('hide');
                    },
                    error: function(xhr, status, error){
  
                      $(".lockedDeleteDraftRequired").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')
  
  
  
  
                    }
                });
              }
        else{
  
          $(".reqCommentsDeleteDraft").show();
          
        }
  
  
            });










 $(document).on('click', '.editRequired', function(e) {
            e.preventDefault();
            $('#itemCommentEdit').val('')
    $(".lockedEditRequired").html("");
            var id = this.id;
            var status = this.status;
            var requestUri = getItem + "/items(" + id + ")";

            $.ajax({
                url: requestUri,
                method: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "accept": "application/json;odata=verbose"
                },
                success: function(data) {
                    $('#fileId').val(data.d.Id);
                    $('#EditPopupLabel').html('Edit Required');
                    ( < any > $('#EditPopup')).modal('show');
                    $("#etag").val(data.d.__metadata.etag);
                }
            });
          
       
        });



//DRaft

        $(document).on('click', '#SendForReviewDraft', function() {
        
                    
                        var itemComment = $("#itemCommentEditDraft").val();
                       // if(itemComment !=""){
                         // $(".reqCommentsEditDraft").hide();
                        var id = $("#fileId").val();
                        //var eTag = $("#etag").val();
                        var eTag = getEtag(id);
                        var formDigest = getFormDigets();
          
          
                        var requestUri = getItem + "/items(" + id + ")";
                        var requestHeaders = {
                            "accept": "application/json;odata=verbose",
                            "X-HTTP-Method": "MERGE",
                            "X-RequestDigest": formDigest,
                            "If-Match": eTag
                        }
                        var fileData = {
                            __metadata: {
                                "type": "SP.Data.MemoProcessItem"
                            },
                            ItemComment: itemComment,
                            Status: "Pending Review (Draft)",
                            NotificationStatus : "Sending"
                        };
                        var requestBody = JSON.stringify(fileData);
          
                        return $.ajax({
                            url: requestUri,
                            type: "POST",
                            contentType: "application/json;odata=verbose",
                            headers: requestHeaders,
                            data: requestBody,
                            success: function() {
                                PopulateGrid();
                                ( < any > $('#EditPopupDraft')).modal('hide');
                                UpdateNotificationLog(id)
                            },
                            error: function(xhr, status, error){
          
                              $(".lockedEditDraftRequired").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')
          
          
          
          
                            }
                        });
                     // }
               // else{
          
                //  $(".reqCommentsEditDraft").show();
                  
              //  }
          
          
                    });
















 $(document).on('click', '#SendForReview', function() {

          
              var itemComment = $("#itemCommentEdit").val();
              //if(itemComment !=""){
              //  $(".reqCommentsEdit").hide();
              var id = $("#fileId").val();
              //var eTag = $("#etag").val();
              var eTag = getEtag(id);
              var formDigest = getFormDigets();


              var requestUri = getItem + "/items(" + id + ")";
              var requestHeaders = {
                  "accept": "application/json;odata=verbose",
                  "X-HTTP-Method": "MERGE",
                  "X-RequestDigest": formDigest,
                  "If-Match": eTag
              }
              var fileData = {
                  __metadata: {
                      "type": "SP.Data.MemoProcessItem"
                  },
                  ItemComment: itemComment,
                  Status: "Pending Review",
                  NotificationStatus : "Sending"
              };
              var requestBody = JSON.stringify(fileData);

              return $.ajax({
                  url: requestUri,
                  type: "POST",
                  contentType: "application/json;odata=verbose",
                  headers: requestHeaders,
                  data: requestBody,
                  success: function() {
                      PopulateGrid();
                      UpdateNotificationLog(id)
                  },
                  error: function(xhr, status, error){

                    $(".lockedEditRequired").html('<strong>Warning! </strong> <span style=" word-wrap: break-word; text-align:left">'+ xhr.responseJSON.error.message.value +'</span>')




                  }
              });
         //   }
      //else{

      //  $(".reqCommentsEdit").show();
        
    //  }


          });





function UpdateNotificationLog(memoID){

  debugger;
   //Get File list items
   $.ajax({
    url: RestUrlLog+"?$filter=MemoID eq "+memoID+"",
    method: "GET",
    headers: {
        "accept": "application/json;odata=verbose"
    },
    success: function(data) {

debugger;
        if (data.d.results.length > 0) {
          debugger;
         var ID = data.d.results[0].Id

       var id = $("#fileId").val();

          var eTag = getEtag(id);
          var formDigest = getFormDigets();
                    var requestUri = getItemLog + "/items(" + ID + ")";
                    var requestHeaders = {
                        "accept": "application/json;odata=verbose",
                        "X-HTTP-Method": "MERGE",
                        "X-RequestDigest": formDigest,
                        "If-Match": "*"
                    }
                           
                    var  fileData = {
                          __metadata: {
                              "type": "SP.Data.NotificationLogListItem"
                          },
                   
                    
                          NotificationStatus: "Sending"              
                      };
                    
                    var requestBody = JSON.stringify(fileData);
        
                    return $.ajax({
                        url: requestUri,
                        type: "POST",
                        contentType: "application/json;odata=verbose",
                        headers: requestHeaders,
                        data: requestBody,
                        success: function() {
                          debugger;
                        },
                        error: function(xhr, status, error){
        
                         console.log( xhr.responseJSON.error.message.value)
        
        
        
        
                        }
                    });


        };
      }})




















    

       
      
}












     
      });

      require('./script');
      require('datatables.net-rowgroup');
      //this._renderListAsync();
  }
}