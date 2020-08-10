
'use strict';
$(function() {
    /* 1st step- first page of website - when click on start button change the visible main contant div to the form div*/
    function changePage1 (){    
        //on clik the start button to get to the from page
        $('#start').on('click', function(e){
            //add class hide to hide content to the welcome div 
            $('#main-content').addClass('hide');
            //remove the hide class from the forms div and add the main content class to add style to it
            $('#form1').removeClass('hide')
                    .addClass('main-content');
        });
    }
    /*end 1st step*/

    /*2nd step - this adds a new field to enter ages of children when the filed that asks for number of children is changed 
    it also lets the user add more of the same filed if need to add ages of more than one child*/
    function addField(){
        //when change this field there another field would appear that would let you enter the age of the child
        $('#amount').on('change', function(e){
            e.preventDefault();
            //remove the class hide and add class form-e to make it a fileld
            $('#age').removeClass('hide')
                    .addClass('form-e');
        });
        //this function creates a new number input to add the age of another child
        function addChildren(){
            //create a div with label and imput
            let newChild = $('<div class= "new-child"><label class = "new-child">Age of child:</label><input type="number" class = "new-child" class = "number" name="yearsOld" min = "0"></div>');
            //create another add child to add next child if needed
            let newAdd = $('<div><p>Add Child +</p></div>');
            //add class to style it
            newAdd.addClass('add');
            //call the function again by clicking for the next child
            newAdd.on('click', addChildren);  
            //append the new divs to the parent div '#age'
            $('#age').append(newChild);
            $('#age').append(newAdd);
            
            //variable to hold the new label
            let newFor = $('label.new-child');
            //variable to hold the new input
            let newId = $('input.new-child');
            //a for loop to update the id and for the label and the input so the 
            //labes focuses the correct input as the user addes children ages
            for (let i =0 ; i<newId.length; ++i){
                //varible to add to the end of name of id for each input added
                let sum = i+1;
                //varible to hold name of id and for
                let yearsOld = 'years-old'+sum;
                //uppdate for and id for each added field 
                newFor.eq(i).attr('for',yearsOld);
                //add class for style to input
                newId.eq(i).attr('id', yearsOld)
                        .addClass('number')
                        .addClass('child-age');
            }
        }
        
        //this would call the add children when you click on the add child 
        $('.add').on('click', addChildren);
    }
   /*end 2nd step*/
    
    //call function one - fisrt step
    changePage1();

    //call function two - second step
    addField();

    $('#main-form').submit(submitForm);
    function submitForm(e){
        e.preventDefault();
        $('#form1').addClass('hide');

        let user = {
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            city: $('select#city').val(),
            schedule: $('input[name = "schedule"]:checked').val(),
            amountChildren: $('amount').val(),
            kidAges:[],
            ocassional: false
        }

        let kidAgesArray = $('input.child-age');
        for (let i = 0; i<kidAgesArray.length; ++i){
            user.kidAges[i] = kidAgesArray.eq(i).val();
        }   

        let ocassionalValue =  $('input[name = "ocassional"]:checked').val();
        if (ocassionalValue === 'ocassional'){
            user.ocassional = true;
        }        
        
        //make an ajax request to pull up nannies information
        let request= $.ajax({
            method: 'get',
            url: 'nanny.json',
            dataType: 'json'
        });  
        
        let validateNanny = false
        request.done(function(data){
            for (let nanny of data){
               if (nanny.city === user.city && nanny.time === user.schedule){
                    let results = $('#results');
                    let newNanny = $('<div class = "nanny"></div>');

                    let img = $('<img>');
                    img.attr('src', nanny.image);
                    let altName = 'Profile image of '+nanny.name +' '+nanny.lastName;
                    img.attr('alt', altName);
                    let p1Text = '<p>Name: '+ nanny.name +'</p>';
                    let p2Text = '<p>Last Name: '+ nanny.lastName+'</p>';
                    let p3Text = '<p>City: '+nanny.city+'</p>';
                    let divP = $('<div class= "nanny-info">')
                    divP.html(p1Text+p2Text+p3Text);

                    let p4 = $('<p>Certificates: </p>');
                    for (let cert of nanny.certificates){
                        let span = $('<span>');
                        span.html(cert);
                        p4.append(span);
                    }
                    
                    newNanny.append(img);
                    newNanny.append(divP);
                    newNanny.append(p4);
                    results.append(newNanny);
                    validateNanny = true;
               }
            }
            if (validateNanny === false){
                console.log('NO MATCH TRY AGAIN!!')
            }
        });

        request.fail(function(response){
            console.log('EROOR: '+ response.statusText);
        });
    }
});
