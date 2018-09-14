/*---------------------------------------
* Requires and variables
* ---------------------------------------*/
const ElectronTitlebarWindows = require('electron-titlebar-windows');
const titlebar = new ElectronTitlebarWindows({draggable: true, backgroundColor: '#03c9a9'});
const jsPDF = require('jspdf');
let imgData = '';
let width, height;
let pdf = new jsPDF('p', 'mm', 'a4');

titlebar.appendTo(document.getElementById('title-bar'));
titlebar.on('close', function(e) {
    console.log('close');
});

/*---------------------------------------
* Handle clicks
* ---------------------------------------*/
//generate pdf on button click
$('#gen').on('click', () => {
    printPDF();
})

//clear img
$('#remove-img').on('click', () => {
    removeImg();
})

//hide default file input button, replace with icon
$('.fa-upload').on('click', () => {
    $('input[type="file"]').trigger('click');
})

//img upload 
document.getElementById('file').addEventListener('change', readURL, true);

/*---------------------------------------
* Functions
* ---------------------------------------*/
// write data to pdf document
const printPDF = () => {
    // pdf.text(15, 10, 'Yay pdf!');
    pdf.addImage(imgData, 'PNG', 10, 5, width * 0.05, height * 0.05);
    pdf.save(`${$('#inv-num').val()}.pdf`);
    removeImg();
}

//select img and set background of container
function readURL() {
    let file = document.getElementById('file').files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
        document.getElementById('img-select').style.backgroundImage = `url(${reader.result})`;
        imgData = reader.result;
        let image = new Image();
        image.src = reader.result;
        image.onload = () => {
            console.log(image.width, image.height);
            height = image.height;
            width = image.width;
        }
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
    pdf = new jsPDF('p', 'mm', 'a4');
}