
'use strict';
$(function() {
    //on clik the start button to get to the from page
    $('#start').on('click', function(e){
       //add class hide to hide content to the welcome div 
       $('#main-content').addClass('hide');
       //remove the hide class from the forms div and add the main content class to add style to it
       $('#form1').removeClass('hide')
                .addClass('main-content');
    });
   

    $('#amount').on('change', function(e){
        e.preventDefault();
        $('#age').removeClass('hide')
                        .addClass('form-e');
    })
    $('.add').on('click', addChildren);

    function addChildren(){
        let newChild = $('<div class= "new-child"><label class = "new-child">Age of child:</label><input type="number" class = "new-child" class = "number" name="yearsOld" min = "0"></div>');
        let newAdd = $('<div><p>Add Child +</p></div>');
        newAdd.addClass('add');
        newAdd.on('click', addChildren);  
        $('#age').append(newChild);
        $('#age').append(newAdd);
        
        let newFor = $('label.new-child');
        let newId = $('input.new-child');
        for (let i =0 ; i<newId.length; ++i){
            let sum = i+1;
            let yearsOld = 'years-old'+sum;
            newFor.eq(i).attr('for',yearsOld);
            newId.eq(i).attr('id', yearsOld)
                    .addClass('number');
                    console.log('hello');
        }
        
    }; 

});
