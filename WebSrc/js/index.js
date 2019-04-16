/*css*/
import '../scss/common.scss';

/*js*/
import './fontawesome'
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/toast';
import 'bootstrap/js/dist/modal';
import './grouper';

const Mousetrap = require('mousetrap');
const config = require('../data/configuration');
const fs = require('fs');
import Trianglify from 'trianglify';

let users = [];
let toRemove = [];
let rowNum = 1;
let state = false;
let body_defaults;

let customconfig;// override configuration with user's specifics:
$.get(
    'WebSrc/data/custom.configuration.json',
    (data, status) => {
        customconfig = JSON.parse(data);
    }
).then(()=>{
    load_configuration(customconfig)
    body_defaults = config["trianglifyDefaults"].body;
    $(document).ready(() => {
        console.log('loading trianglify with defaults: '+body_defaults);

        // load background
        body_defaults.height = window.innerHeight;
        body_defaults.width = window.innerWidth;
        let pattern = Trianglify(body_defaults);
        document.body.appendChild(pattern.canvas());
    });

});


window.onload = ()=>{
    // override configuration with user's specifics:


    // fill modal list:
    let programs = config.formData.programs;
    let localCenter = config.formData.localCenters;
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

    // select all button
    $("#select-all").on('click', function(){
        state = !state;
        console.log("select all is: "+(state?"":"not")+" checked...");
        $('#usersTable').find('tr').not($('#headerRow')).each(function() {
            console.log("setting: checked");
            $(this).find('input').prop('checked', state);
        });
    });

    // addRow button
    $("#addbtn").click(function(){
        addRow();
        resetFields();
        disableAdd(true);

        $("#tableInfo").toggleClass("d-none", $("#usersTable").find("tr")-1!==0);
    });

    $("#printbtn").click(function () {
        print();
    });

    $("#confbtn").click(function () {
        addProgram("ciao");
    });

    // modify remove button on row click:
    $("#usersTable").on("change", function () {
        let rn = highligthRow();
        updateActions(rn);
    });

    // removeButton
    $("#removebtn").click(function () {
        $('#removebtn').toggleClass("disabled", true).attr("readonly", true);
        $('#usersTable input:checked').each(function() {
            $(this).closest("tr").not('#headerRow').fadeOut("slow").remove();
        });

        // re-indexing:
        rowNum = 1;

        $("#usersTable").find("tr").each(function(){
            let rowHeader = $(this).find("th");
            if(/^\d+$/.test(rowHeader.text()))
                rowHeader.html(rowNum++);
        });

        $("#tableInfo").toggleClass("d-none", $("#usersTable").find("tr")-1===0);
        updateActions(0);
        $("#select-all-btn").prop("checked", false)
    });

    // toggleButton
    $("#menu-toggle").on('click', function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    })

};

function incompleteFields(){
    let result = false;
    $('form[name="addRow"] input').each(function(){
        result = result || $(this).val()==="";
    })

    $('form[name="addRow"] select').each(function(){
        result = result || $(this).val()=== null;
    });
    return result;
}

function addRow(){
    let currRow = rowNum++;
    let newRow = $(`
            <tr>
                <th scope="row">${currRow}</th>
                <td>${$("#nameInput").val()}</td>
                <td>${$("#surnameInput").val()}</td>
                <td>${$("#sexInput").val()}</td>
                <td>${$("#langInput").val()}</td>
                <td>${$("#localCenterInput").val()}</td>
                <td>${$("#programInput").val()}</td>
                <td>
                    <label class="switch">
                    <input type="checkbox" value="${currRow}">
                    <span class="slider round"></span>
                    </label>
                </td>
            </tr>`
    );

    newRow.hide();
    $("#usersTable").append(newRow);
    newRow.fadeIn("slow");
}

function resetFields() {
    $('form[name="addRow"] input').each(function(){
        $(this).val("");
    })

    $('form[name="addRow"] select').each(function(){
        $(this).val(null);
    });
}

function disableAdd(disable){
    $("#addbtn").toggleClass("disabled", disable).attr("disabled", disable);
}

function print(){
    $('#usersTable').find("tr").each(function(){
        let row = "";
        $(this).find("td").each(function(){
            if(!$(this).has("input").length){
                row = row+$(this).html()+",";
            }
        });
        console.log($('#usersTable').find("tr").length-1);
        console.log(row);
    });
}

Mousetrap.bind('ctrl+n', () => { $("#addRowModal").modal('toggle'); });

function addProgram(obj){
    return addToConf("Program", obj);
}

function addLocalCenter(obj){
    return addToConf("Local Centers", obj);
}

function addToConf(array, obj){
    config.Program.push;
    fs.writeFile('../data/', JSON.stringify(config), function (err) {
        console.log(err);
    });
}


function highligthRow(){
    $('#usersTable input').each(function() {
        $(this).closest("tr").not('#headerRow').toggleClass("table-primary", $(this).is(':checked')).toggleClass("text-muted", $(this).is(':checked'));
    });

    return $('#usersTable input:checked').length;
}

function updateActions(rowNum){
    if(rowNum!==0){
        $('#removebtn').toggleClass("disabled", false).toggleClass("text-danger", true).attr("disabled", false);
        $('#printbtn').toggleClass("disabled", false).toggleClass("text-warning", true).attr("disabled", false);
        $('#delete_counter').text(rowNum).fadeIn();

    }
    else{
        $('#removebtn').toggleClass("disabled", true).toggleClass("text-danger", false).attr("disabled", true);
        $('#printbtn').toggleClass("disabled", true).toggleClass("text-warning", false).attr("disabled", true);
        $('#delete_counter').fadeOut();
    }
}

function load_configuration(user_config){
    console.log('loading custom configuration');
    console.log(user_config);
    for (let macroconfig in user_config){
        for (let conf in user_config[macroconfig]) {
            if(typeof user_config[macroconfig][conf] === 'object')
                for (let token in user_config[macroconfig][conf]) {
                    console.log('overriding: '+macroconfig+' : '+conf+' : '+' : '+token);
                    config[macroconfig][conf][token] = user_config[macroconfig][conf][token];
                }
            else
                config[macroconfig][conf] = user_config[macroconfig][conf];
        }
    }

    console.log('final configuration is:');
    console.log(config);
}