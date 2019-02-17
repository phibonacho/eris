const { app, globalShortcut } = require('electron');
const Mousetrap = require('mousetrap');
const config = require('./data/basicInfo');
const lang = require('./data/language');
var remote = require('electron').remote;
var fs = remote.require('fs');

let toRemove = [];
let rowNum = 1;

window.onload = ()=>{
    // fill modal list:
    config.Programs.forEach((value)=>{
        $('#programInput').append(`<option class="text-white" value="${value}">${value}</option>`);
    });

    config["Local Centers"].forEach((value)=>{
        $('#localCenterInput').append(`<option class="text-white" value="${value}">${value}</option>`);
    });

    $("form[name=\"addRow\"] input, form[name=\"addRow\"] select").change(()=>{
        disableAdd(incompleteFields());
    });

    $.each(lang, (key, value) =>{
        $('#langInput').append(`<option class="text-white" value="${value}" title="${key}">${value}</option>`);
    });


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

    $("#usersTable").on("change", function () {
        let disabled = true;
        $('#usersTable input').each(function() {
            $(this).closest("tr").toggleClass("table-primary", $(this).is(':checked')).toggleClass("text-muted", $(this).is(':checked'));
            if($(this).is(':checked')){
                if(disabled) disabled = false;
                toRemove.push($(this).closest("th").text());
            }
        });
        $('#removebtn').toggleClass("disabled", disabled).attr("disabled", disabled);
    });

    $("#removebtn").click(function () {
        $('#removebtn').toggleClass("disabled", true).attr("readonly", true);
        $('#usersTable input:checked').each(function() {
            $(this).closest("tr").fadeOut("slow").remove();
        });

        // re-indexing:
        rowNum = 1;

        $("#usersTable").find("tr").each(function(){
            let rowHeader = $(this).find("th");
            if(/^\d+$/.test(rowHeader.text()))
                rowHeader.html(rowNum++);
        });

        $("#tableInfo").toggleClass("d-none", $("#usersTable").find("tr")-1===0);

    });
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
                    <input type="checkbox" class="custom-checkbox bg-dark" value="${currRow}">
                </td>
            </tr>`);

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