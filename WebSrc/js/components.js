import {
    addRow,
    disableAdd, groupAndDisplay,
    highligthRow,
    incompleteFields, reindex,
    removeRow,
    resetFields, selectAll,
    updateActions, print_users, loadToast, load_file, print_group
} from "./commonFunctions";


const Mousetrap = require('mousetrap');
const config = require('../data/configuration');
import Trianglify from 'trianglify';
import toastTemplate from '../component/notification_component.html'
import {groups, to_mix} from "./grouper";

let body_defaults = config["trianglifyDefaults"].body;



$(document).ready(() => {
    // load background
    body_defaults.height = window.innerHeight;
    body_defaults.width = window.innerWidth;
    let pattern = Trianglify(body_defaults);
    document.body.appendChild(pattern.canvas());
});

$(window).resize(()=>{
    body_defaults.height = window.innerHeight;
    body_defaults.width = window.innerWidth;
    let pattern = Trianglify(body_defaults);
    document.body.appendChild(pattern.canvas());
});

window.onload = ()=>{
    // override configuration with user's specifics:

    // fill modal list:
    let programs = config.formData.programs;
    let localCenter = config.formData.localCenter;
    let languages = config.formData.languages;

    programs.forEach((value)=>{
        $('#programInput').append(`<option class="text-white" value="${value}">${value}</option>`);
    });

    localCenter.forEach((value)=>{
        $('#localCenterInput').append(`<option class="text-white" value="${value}">${value}</option>`);
    });

    $("form[name=\"addRow\"] input, form[name=\"addRow\"] select").change(()=>{
        disableAdd(incompleteFields());
    });

    for(let key in languages){
        $('#langInput').append(`<option class="text-white" value="${languages[key]}" title="${key}">${languages[key]}</option>`);
    }

    // addRow button
    $("#addbtn").click(function(){
        addRow($("#nameInput").val(), $("#surnameInput").val(), $("#sexInput").val(), $("#langInput").val(), $("#localCenterInput").val(), $("#programInput").val());
        resetFields();
        disableAdd(true);
    });

    // select all button
    $("#select-all").on('click', selectAll
    );

    // modify remove button on row click:
    $("#usersTable").on("change", function () {
        let rn = highligthRow();
        updateActions(rn);
    }).on('tableModified', function(){
        console.log('table had been modified!!');
        if($('#usersTable tr').not('.header-row').length !==0){
            $('#printbtn').toggleClass("disabled", false).toggleClass("text-warning", true).attr("disabled", false);
        }
        else
            $('#printbtn').toggleClass("disabled", true).toggleClass("text-warning", false).attr("disabled", true);
    });

    // removeButton
    $("#removebtn").click(function () {
        $('#removebtn').toggleClass("disabled", true).attr("readonly", true);
        $('#usersTable input:checked').each(function() {
            removeRow(this);
        });

        // re-indexing:
        reindex();

        $("#tableInfo").toggleClass("d-none", $("#usersTable").find("tr")-1===0);
        updateActions(0);

        // unselect the select all button
        $("#select-all-btn").prop("checked", false);
    });

    // loadButton
    $('#loadbtn').click(function(){
        load_file();
    });

    // toggleButton
    $("#menu-toggle").on('click', function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // group button
    $('#group-btn').click(function(){
        $('#loading-spinner').toggleClass('d-none', false);
        new Promise((resolve, reject)=>{
            let rowNum = $('#groupNumSelect').val();
            if(to_mix.items.length >= rowNum)
                resolve(groupAndDisplay(rowNum));
            else
                reject();
        }).then(()=>{$('#loading-spinner').toggleClass('d-none', true);},
            () => {
                $.get('WebSrc/component/notification_component.html').done((data)=>{
                    let toaster = $(data);
                    toaster.find('.fas').addClass('fa-exclamation-triangle').addClass('text-warning');
                    toaster.find('.toast-body').text('You don\'t have enough persons to group');
                    toaster.toast({ 'delay' : 6000});
                    $('#toast-container').append(toaster);
                    toaster.toast('show');
                });
                $('#loading-spinner').toggleClass('d-none', true);
            });
    });

    $("#printTable").click(function (e) {
        e.preventDefault();
        let target = $(this).closest('.modal').data('table');
        let to_print;
        switch(target){
            case 'to_mix':
                to_print = to_mix;
                break;
            case 'groups':
                to_print  = groups;
                break;
            default:
                return;
        }
        console.log(to_print);
        new Promise((resolve, reject)=>{
            if((to_print.hasOwnProperty('items') && to_print.items.length !==0)|| to_print.length > 0)
                resolve($('#fileName').val());
            else
                reject();
        }).then((fileName)=>{
                if(to_print.hasOwnProperty('items'))
                    print_users(fileName);
                else
                    for(let i = 0 ; i < to_print.length; i++){
                        print_group(fileName, i);
                    }
            },
            () => {
                // $.get('WebSrc/component/notification_component.html').done((data)=>{
                //     loadToast(data);
                // });
                loadToast(toastTemplate);
            }).then(()=>{},
            (err)=>{
                console.log(err.message);
            });
    });

    // activate toasts

    $(function(){
        console.log('loading components');
        $('.toast').toast({ 'delay' : 6000});
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
        $('[data-toggle="modal"], [data-target="#createFile"]').on('click', function (e) {
            let button = $(this);
            let targetTable = button.data('table');
            let modal = $(button.data('target'));

            modal.data('table', targetTable);
        });
    });
};

Mousetrap.bind('ctrl+n', () => { $("#addRowModal").modal('toggle'); });
