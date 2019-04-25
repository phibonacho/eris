/*css*/
import '../scss/common.scss';

/* bootstrap js*/
import './fontawesome'
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/toast';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/tooltip';
import dialog from 'dialog';

/* robaccia per lavorare coi file */
const electron = window.require('electron');
const remote = electron.remote;
const fs = remote.require('fs');
// const dialog = require('dialog');

import {aggregate, groups, to_mix} from "./grouper";
import PersonClass from "./PersonClass";

let rowNum = 1;
let state = false;

export function incompleteFields(){
    let result = false;
    $('form[name="addRow"] input').each(function(){
        result = result || $(this).val()==="";
    })

    $('form[name="addRow"] select').each(function(){
        result = result || $(this).val()=== null;
    });
    return result;
}

export function addRow(name, surname, sex, lang, localC, program){
    to_mix.add(
        new PersonClass(
            name,
            surname,
            sex,
            lang,
            localC,
            program
        )
    );
    let currRow = rowNum++;
    let newRow = $(`
            <tr>
                <th scope="row">${currRow}</th>
                <td>${name}</td>
                <td>${surname}</td>
                <td>${sex}</td>
                <td>${lang}</td>
                <td>${localC}</td>
                <td>${program}</td>
                <td>
                    <label class="switch">
                    <input type="checkbox" value="${currRow}">
                    <span class="slider round"></span>
                    </label>
                </td>
            </tr>`
    );

    console.log('to_mix is: '+to_mix);
    newRow.hide();
    $("#usersTable").append(newRow);
    newRow.fadeIn("slow");
}

export function resetFields() {
    $('form[name="addRow"] input').each(function(){
        $(this).val("");
    })

    $('form[name="addRow"] select').each(function(){
        $(this).val(null);
    });
}

export function disableAdd(disable){
    $("#addbtn").toggleClass("disabled", disable).attr("disabled", disable);
}

export function print_users(fileName){
    print_aux(to_mix, fileName, 'Unmixed');
}

export function print_group(fileName, index){
    print_aux(groups[index], fileName, index+1);
}

function print_aux(target, fileName, index){
    let content =  `,,Group,${index},,\nName,Surname,Sex,Language,Local Center,Program\n`;
    for(let i = 0; i<target.items.length; i++){
        content+=target.items[i].toCSV();
    }
    console.log('here we are in: '+require('path').resolve(__dirname));
    fs.appendFile(`myFiles/${fileName}.csv`, content, (err)=>{
        if(err) throw console.log(err.message);
        else console.log('written!');
    });
}

export function load_file(){
    remote.dialog.showOpenDialog(fileNames => {
        // fileNames is an array that contains all the selected
        if(fileNames === undefined){
            console.log("No file selected");
            return;
        }

        console.log(fileNames[0]);

        fs.readFile(fileNames[0], 'utf-8', (err, data) => {
            if(err){
                alert("An error ocurred reading the file :" + err.message);
                return;
            }

            data.toString().split("\n").forEach(function(line, index, arr) {
                if (index === arr.length - 1 && line === "") { return; }
                if(line.match(/([A-Z][a-z]+),([A-Z][a-z]+),(M|F),([a-z]{2}(?:-[A-Z]+)?),([a-zA-Z\s\-\.]+),([a-zA-Z\s\-\.]+)/)){
                    console.log(index + " " + line);
                    let initiliazers = line.toString().split(',');
                    console.log(initiliazers);
                    addRow(initiliazers[0], initiliazers[1], initiliazers[2], initiliazers[3], initiliazers[4], initiliazers[5]);
                }
            });
            console.log("end");
        });
    });
}
export function highligthRow(){
    $('#usersTable input').each(function() {
        $(this).closest("tr").not('.header-row').toggleClass("table-primary", $(this).is(':checked')).toggleClass("text-muted", $(this).is(':checked'));
    });

    return $('#usersTable input:checked').not('.header-row').length;
}

export function removeRow(elem){
    let row = $(elem).closest('tr');
    let index = $(elem).parent().siblings(':first').text()-1;
    $(elem).closest("tr").not('#headerRow').fadeOut("slow").remove();
    let removed = to_mix.remove_at(index);
}

export function reindex(){
    rowNum = 1;

    $("#usersTable").find("tr").each(function(){
        let rowHeader = $(this).find("th");
        if(/^\d+$/.test(rowHeader.text()))
            rowHeader.html(rowNum++);
    });
}

export function updateActions(rowNum){
    if(rowNum!==0){
        $('#removebtn').toggleClass("disabled", false).toggleClass("text-danger", true).attr("disabled", false);
        $('#delete_counter').text(rowNum).fadeIn();
    }
    else{
        $('#removebtn').toggleClass("disabled", true).toggleClass("text-danger", false).attr("disabled", true);
        $('#delete_counter').fadeOut();
    }
}

export function selectAll(){
    state = !state;
    $('#usersTable').find('tr').not($('.header-row')).each(function() {
        $(this).find('input').prop('checked', state);
    });
}

export function groupAndDisplay(groupNum){
    flushGroups();
    let target = $('#groupTable');
    aggregate(groupNum);
    for(let i = 0; i< groups.length; i++){
        let to_display = $(groups[i].groupStats(i));
        to_display.hide();
        target.append(to_display);
        to_display.fadeIn();
        to_display.find('[data-toggle="popover"]').each(function () {
           $(this).popover();
        });
    }
}

export function loadToast(data){
    let toaster = $(data);
    toaster.find('.fas').addClass('fa-exclamation-triangle').addClass('text-warning');
    toaster.find('.toast-body').text('No row to print...');
    toaster.toast({ 'delay' : 6000});
    $('#toast-container').append(toaster);
    toaster.toast('show');
}

function flushGroups(){
    $('#groupTable').find('tr').not($('.header-row')).each(function(){
        $(this).fadeOut().remove();
    });
}
