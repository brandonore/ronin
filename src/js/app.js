const ElectronTitlebarWindows = require('electron-titlebar-windows');
const titlebar = new ElectronTitlebarWindows({draggable: true, backgroundColor: '#03c9a9'});
const jsPDF = require('jspdf');
let imgData = '';

titlebar.appendTo(document.getElementById('title-bar'));

titlebar.on('close', function(e) {
    console.log('close');
});

let pdf = new jsPDF();
let width = pdf.internal.pageSize.width;
let height = pdf.internal.pageSize.height;
let h = 500;
let aspectwidth = (height - h)*(9/16);

$('#gen').on('click', () => {
    printPDF();
})

const printPDF = () => {
    // pdf.text(15, 10, 'Yay pdf!');
    pdf.addImage(imgData, 'PNG', 5, 5, aspectwidth, (height - h));
    pdf.save(`${$('#inv-num').val()}.pdf`);
    removeImg();
}

//img upload 
document.getElementById('file').addEventListener('change', readURL, true);

//clear img
$('#remove-img').on('click', () => {
    removeImg();
})

//select img and set background of container
function readURL() {
    let file = document.getElementById('file').files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
        document.getElementById('img-select').style.backgroundImage = `url(${reader.result})`;
        imgData = reader.result;
    }
    if(file) {
        reader.readAsDataURL(file);
        $('.fa-upload').css('display', 'none');
        $('#remove-img').css('display', 'block');
        $('#img-select').css({'border': 'none', 'background-color': 'transparent'});
    } else {}
}

//remove img
function removeImg() {
    document.getElementById('file').value = '';
    $('#img-select').removeAttr('style');
    $('#img-select').css({'border': 'solid 1px #bdc3c7', 'background-color': '#F8F9F9'});
    $('.fa-upload').css('display', 'block');
    $('#remove-img').css('display', 'none');
    pdf = new jsPDF();
}

//hide default file input button, replace with icon
$('.fa-upload').on('click', () => {
    $('input[type="file"]').trigger('click');
})