const {ipcRenderer, remote:{dialog}} = require('electron')
const customTitlebar = require('custom-electron-titlebar')
const bootbox = require('bootbox')
const SerialNode = require('./serial.js')
const Store = require('./store.js')
const path = require('path')
window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')

const serial = new SerialNode()

//user-preferences
const store = new Store({
    configName: 'serial-node',
    defaults: {
        'outputPath': "",
        'baudRateList': [
            {value: '115200', text: 'Humacount 30 TS - (115200)'},
            {value: '2400', text: 'HumaLyzer Primus - (2400)'}
        ]
    }
})

$(document).ready(function() {
    /*
    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#0069d9'),
        icon: 'images/logo.png',
        menu: null,
        titleHorizontalAlignment:'left',
        shadow:true
    })
    */

    $('#port-list-refresh').click(async function() {
        await refreshPortList()
    })
    $('#btn-path-selector').click(function() {
        const path = dialog.showOpenDialog({
            title: 'Selecione a pasta',
            buttonLabel: 'Selecionar',
            properties: ['openDirectory']
          })
          if (path) {
              $("#output-path").val(path)
              store.set('outputPath', path)
          }
    })
    $('#port-list').change(function() {
        store.set('portId', $('#port-list').val())
    })
    $('#baud-rate').change(function() {
        store.set('selectedBaudRate', $('#baud-rate').val())
    })
    $('#baud-rate-remove').click(function() {
        $("#baud-rate").find('option[value="' + $("#baud-rate").val() + '"]').remove()
        store.set('baudRateList', dropdownToJson('#baud-rate'))
    })
    $('#baud-rate-add').click(function() {
        addBaudRateName()
    })
    $('#btn-serial-start').click(function() {
        let dialog = bootbox.dialog({
            title: '<i class="fa fa-usb"></i> Recebendo dados',
            message: '<label class=\"mr-sm-2\" for=\"output-stream\"><i class=\"fa fa-terminal\"></i> Terminal</label><textarea rows=\"10\" id=\"output-stream\" name=\"output-stream\" class=\"form-control mr-sm-2\" readonly></textarea>',
            size: 'large',
            closeButton: false,
            buttons: {
                ok: {
                    label: "<i class=\"fa fa-power-off\"></i> Finalizar Conexão",
                    className: 'btn-danger',
                    callback: function() {
                        serial.closePort()
                    }
                }
            }
        })
        listenSerial()
    })
})

function listenSerial() {
    const date = new Date()
    const formatedDate =  `${date.getDate()}`.padStart(2, '0') + `-` +
    `${date.getMonth()+1}`.padStart(2, '0') + `-` +
    `${date.getFullYear()}` + `_` + 
    `${date.getHours()}`.padStart(2, '0') +
    `${date.getMinutes()}`.padStart(2, '0')

    serial.setOutputElementId('output-stream')
    serial.setOutputFile(path.join($('#output-path').val(), `${formatedDate}___hemograma.txt`))
    serial.listenPort($('#port-list').val(), $('#baud-rate').val())
}
function addBaudRateName() {
    bootbox.prompt("Nome do equipamento", function(result) {
        if (result === '') {
            addBaudRateName()
        } else if (result === null) {

        } else {
            addBaudRateValue(result)
        }
    })
}
function addBaudRateValue(baudRateName) {
    bootbox.prompt("Taxa de transferência do equipamento (Baud Rate)", function(result) {
        if (result === '') {
            addBaudRateValue()
        } else if (result === null) {

        } else {
            $('#baud-rate').append($('<option></option>').attr('value', result).text(baudRateName + ' - (' + result + ')' ))
            store.set('baudRateList', dropdownToJson('#baud-rate'))
        }
    })
}
function loadPreferences() {
    $("#output-path").val(store.get('outputPath'))
    if ($("#port-list").find('option[value="' + store.get('portId') + '"]').val()) {
        $("#port-list").val(store.get('portId'))
    }
    updateDropdownList('#baud-rate', store.get('baudRateList'))
    if ($("#baud-rate").find('option[value="' + store.get('selectedBaudRate') + '"]').val()) {
        $("#baud-rate").val(store.get('selectedBaudRate'))
    }
}
function updateDropdownList(elementId, data) {
    const element = $(elementId)
    element.empty()
    element.append('<option selected="true" value="" disabled>Selecione</option>')
    element.prop('selectedIndex', 0)
    if(data) {
        for (let item of data) {
            element.append($('<option></option>').attr('value', item.value).text(item.text))
        }
    }
}
function dropdownToJson(elementId) {
    const element = $(elementId)
    let optionsList = element.children('option')
    .filter(function() { return this.value != ''}) //remove default empty option
    .map(function() { return {value: this.value, text: this.text} }).get()
    return optionsList
}

async function refreshPortList() {
    const portList = await serial.listPorts()
    updateDropdownList('#port-list', portList)
}
//LISTENERS
//initial ports list load
ipcRenderer.on('listPorts', function(e, data) {
    updateDropdownList('#port-list', data)
    loadPreferences()
})
/*
$("#serial-form").on("submit", function(e) {
    $("#status").html('<center>Processando</center>');
    e.preventDefault();
    var inf = $("#yfile")[0];
    if(inf.files.length === 0){
        alert('No file choosen!');
    }
    else{
        var pathArray = [];
        for(var i=0;i<inf.files.length;i++){
            pathArray.push(inf.files[i].path);
        }
        $(".small").html('Establishing connection and creating table');
        $(".footer").show();
        var autoid;
        if($("#autoid").is(":checked")){
            autoid = true;
        }
        else{
            autoid = false;
        }
        var item = {
            db: $("#ydb").val(),
            user: $("#yuser").val(),
            pass: $("#ypass").val(),
            path: pathArray,
            table: $("#ytable").val(),
            autoid: autoid
        };
        if($("#mysql-check").is(":checked")){
            item.customStartEnd = true;
            item.rowS = $("#yrowS").val();
            item.rowE = $("#yrowE").val();
            item.colS = $("#ycolS").val();
            item.colE = $("#ycolE").val();
        }
        if(item.customStartEnd){
            if(!(item.rowS && item.rowE && item.colS && item.colE)){
                alert('All the 4 fields must be defined when Custom Start-End is Checked!');
                $(".small").html('Error');
                return;
            }
        }
        console.log(item);
        ipcRenderer.send('readXls', item);
    }
    
})
*/
