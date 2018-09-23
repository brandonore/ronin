$(document).ready(() => {
/*---------------------------------------
* Requires and variables
* ---------------------------------------*/
const ElectronTitlebarWindows = require('electron-titlebar-windows');
const titlebar = new ElectronTitlebarWindows({draggable: true, backgroundColor: '#03c9a9'});
const jsPDF = require('jspdf');
const flatpickr = require('flatpickr');
const numeral = require('numeral');
let imgData = '';
let width, height;
let pdf = new jsPDF('p', 'mm', 'a4');
let sum = 0;
let fpickrOptions = {
    minDate: 'today',
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y'
}
const lineItem = `<div class="line-item">
                    <input type="text" class="itm-d" placeholder="Description of product or service..." />
                    <input type="text" maxlength="12" value="1" class="qty-input" />
                    <input type="text" maxlength="8" class="rate-input" value="0" />
                    <div class="rate-span">$0.00</div>
                    <span class="close-btn"><i class="fal fa-times"></i></span>
                </div>`

titlebar.appendTo(document.getElementById('title-bar'));
titlebar.on('close', function(e) {
    console.log('close');
});

/*---------------------------------------
* Handle clicks
* ---------------------------------------*/



$('#btn-about').on('click', function(e) {
    let modal = new Custombox.modal({
        content: {
            effect: 'fadein',
            target: '#modal',
            close: true
        },
        overlay: {
            active: true,
            color: '#000',
            opacity: .48
        }
    })
    modal.open();
})

//create instance of flatpickr
$('.cal').flatpickr(fpickrOptions);

//add line item on btn click
$('#line-item-btn').on('click', () => {
    $(lineItem).insertBefore('#line-item-btn');
})

//remove line item on span click and update balance
$(document).on('click', '.close-btn', function(e) {
    $(this).parent().remove();
    $('.line-item').trigger('updateBalance');
    checkSpans();
    e.stopPropagation();
})

//update span w/ formatted input value
$(document).on('keyup', '.rate-input', function() {
    let val = numeral($(this).val()).format('$0,0.00');
    $(this).next().html(val);
    $(this).trigger('updateBalance'); 
}).on('keyup', '.qty-input', function() {
    $(this).trigger('updateBalance');
})

//update balance on focusout
$(document).on('focusout', '.rate-input', function() {
    $(this).trigger('updateBalance');
}).on('focusout', '.qty-input', function() {
    $(this).trigger('updateBalance');
})

//update balance when quantity changes
$(document).on('updateBalance', '.line-item', function() {
    let total = $(this).find('.qty-input').val() * $(this).find('.rate-input').val();
    $(this).find('.rate-span').html(numeral(total).format('$0,0.00'));
})

//update balance
$(document).on('updateBalance', '.line-item', function() {
    let total = 0;
    let spans = $('.rate-span');
    for(let i = 0; i < spans.length; i++) {
        let val = $(spans[i]).text();
        val = parseFloat(val.substr(1).replace(/,/g, ''));
        total += val;
    }
    $('#balance').text(numeral(total).format('$0,0.00'));
})

$('.line-item').trigger('updateBalance');

//generate pdf on button click
$('#btn-pdf').on('click', () => {
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
const removeImg = () => {
    document.getElementById('file').value = '';
    $('#img-select').removeAttr('style');
    $('#img-select').css({'border': 'solid 1px #bdc3c7', 'background-color': '#F8F9F9'});
    $('.fa-upload').css('display', 'block');
    $('#remove-img').css('display', 'none');
    pdf = new jsPDF('p', 'mm', 'a4');
}

//check if all line items are removed and reset balance
const checkSpans = () => {
    let spans = $('.rate-span');
    if(spans.length === 0) {
        total = 0;
        $('#balance').text(numeral(total).format('$0,0.00'));
    }
}
})