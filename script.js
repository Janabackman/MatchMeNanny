/* Created by Jana Backman, last edited 8/17/2020
 * This program is the script for the website matchmenanny. The program is design for parents that are looking for nannies to find their best option 
 * by only answering a couple of questions. There are nannies in a json file that would be access with an AJAX request once the form is completed and submitted.
 * The program then would output the best matched nannies for the user and would give an option to contact them via email or text message.   
*/
'use strict';
$(function() {
    /* 1st step- first page of website - when click on start button change the visible main content div to the form div*/
    function changePage1 (){    
        //on click the start button to get to the from page
        $('#start').on('click', function(e){
            //add class hide to hide content to the welcome div 
            $('#main-content').addClass('hide');
            //remove the hide class from the forms div and add the main content class to add style to it
            $('#form1').removeClass('hide')
                    .addClass('main-content');
          
            //this code would enable the submit button once all the fields are completed
            //target all required fields
            let allInput = $('#fname, #lname, #full-time, #amount, #part-time, #city');
            //on change prompt this function 
            allInput.on('change', function(e){
                //prevent deafault
                e.preventDefault();
                //these are if nested statements making sure all the fields required are not empty 
                //if fname, lname, and amount fields are not empty 
                if ($('#fname').val()!=='' && $('#lname').val()!== '' && $('#amount').val()!==''){
                    //if either part time or full time are checked
                    if ($('#full-time').is(':checked')||$('#part-time').is(':checked')){
                        //if the option selected has a value
                        if ($('select option:selected').val().length >0){
                            //enable the submit button 
                            $('#s-button').prop('disabled', false);
                        }
                    }
                }
            });
      
        });
    }
    /*end 1st step*/

    /*2nd step - this adds a new field to enter ages of children when the filed that asks for number of children is changed 
    it also lets the user add more of the same filed if need to add ages of more than one child*/
    function addField(){
        //when change this field there another field would appear that would let you enter the age of the child
        $('#amount').on('change', function(e){
            e.preventDefault();
            //remove the class hide and add class form-e to make it a field
            $('#age').removeClass('hide')
                    .addClass('form-e');
        });
        //this function creates a new number input to add the age of another child
        function addChildren(){
            //create a div with label and input
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
            //labels focuses the correct input as the user adds children ages
            for (let i =0 ; i<newId.length; ++i){
                //variable to add to the end of name of id for each input added
                let sum = i+1;
                //variable to hold name of id and for
                let yearsOld = 'years-old'+sum;
                //update for and id for each added field 
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
    
   /*3rd step - this is the main function. The function would trigger by submitting the form. It would then assign the users data to the user object
   Then with AJAX the program request to access the nanny.json file and matches the user data with the nanny’s data. The program then outputs the results on the screen. 
   if the user data entered does not match any candidate the program would let the user know and give them the opportunity to try again the form.*/
    function submitMainForm(){
        //function for submission
        function submitForm(e){
            //prevent default
            e.preventDefault();
            //add class hide to make form not to be visible
            $('#form1').addClass('hide');

            //user object with form data entered by user
            let user = {
                fname: $('#fname').val(),
                lname: $('#lname').val(),
                city: $('select#city').val(),
                schedule: $('input[name = "schedule"]:checked').val(),
                amountChildren: $('amount').val(),
                kidAges:[],
                ocassional: false
            }

            //populating kids age array depending on user input
            //creates an array for children ages
            let kidAgesArray = $('input.child-age');
            //iterates through the array and assign each value to user array 
            for (let i = 0; i<kidAgesArray.length; ++i){
                user.kidAges[i] = kidAgesArray.eq(i).val();
            }   
            //checks if occasional sitter is checked and assign true to it in user object
            let ocassionalValue =  $('input[name = "ocassional"]:checked').val();
            if (ocassionalValue === 'ocassional'){
                user.ocassional = true;
            }        
            
            //make an ajax request to pull up nanny.json with nannies data
            let request= $.ajax({
                method: 'get',
                url: 'nanny.json',
                dataType: 'json'
            });  
            
            //variable to check if there is a match between user and nannies
            let validateNanny = false;
            
            //if the request succced
            request.done(function(data){
                //iterate through the array of nanny objects in json file
                for (let nanny of data){
                //if the city and the schedule match between nanny and user
                    if (nanny.city === user.city && nanny.time === user.schedule){
                        //there is a match then make this true
                        validateNanny = true; 
                        //target the empty results div from the DOM 
                        let results = $('#results');
                        //create new div to display each nanny and their information
                        let newNanny = $('<div class = "nanny"></div>');
                        //create an image element on the DOM
                        let img = $('<img>');
                        //assign nanny image to the image element
                        img.attr('src', nanny.image);
                        //add alt to image
                        let altName = 'Profile image of '+nanny.name +' '+nanny.lastName;
                        img.attr('alt', altName);
                        //create paragraph to display nanny info
                        let p1Text = '<p>Name: '+ nanny.name +'</p>';
                        let p2Text = '<p>Last Name: '+ nanny.lastName+'</p>';
                        let p3Text = '<p>City: '+nanny.city+'</p>';
                        let p4Text = '<p>Years of Experience: '+nanny.yearsExp+'</p>';
                        //create div to display nanny info
                        let divP = $('<div class= "nanny-info">');
                        //add paragraphs to the div
                        divP.html(p1Text+p2Text+p3Text+p4Text);
                    
                        //display certificates from the array
                        let p5 = $('<p>Certificates: </p>');
                        for (let cert of nanny.certificates){
                            let span = $('<span>');
                            span.html(cert);
                            p5.append(span);
                        }
                        //append list of CERT's to div
                        divP.append(p5);
                        //append image to the nanny's div
                        newNanny.append(img);
                        //append nanny info to nanny's div
                        newNanny.append(divP);

                        //create a div for contact nanny's contact info
                        let contactInfo = $('<div>');
                        //add class to div
                        contactInfo.addClass('contact-info');
                        //create a button that would display contact info by clicking on it and append to DOM
                        let contactButton = $('<button class = "button contact" type ="button">Contact</button>');
                        contactInfo.append(contactButton);
                        newNanny.append(contactInfo);
                        
                        //append the nanny div with all the info to results div
                        results.append(newNanny);
                        //create a hidden div for the contact info 
                        let contact = $('<div>');
                        contact.addClass('hide');
                        let email = $('<a>');
                        email.html('E-mail-me: '+ nanny.email);
                        email.attr('href', 'mailto:'+nanny.email);
                        let phone = $('<a>');
                        phone.html('<br>Text me: '+nanny.phone);
                        phone.attr('href', 'sms:+1'+nanny.phone);
                        //append to DOM
                        contact.append(email);
                        contact.append(phone);
                        contactInfo.append(contact);
                        //access all nannies from the DOM 
                        let nannyArray = $('.nanny');
                        //iterate through the nannies divs
                        for (let i = 0; i<nannyArray.length; ++i){
                            //on click the contact button of each nanny
                            $('.contact').eq(i).on('click', function(e){
                                //access the div of contact info and remove class hide to display
                                let x = $(this).parent().find(contact);
                                if (x.hasClass('hide')){
                                    x.removeClass('hide');
                                }
                                //if the div does not have class hide (because already clicked once), then add class hide to hide content again
                                else{
                                    x.addClass('hide');
                                }
                            });
                        }
                    }
                }
                //if no match between nannies and user
                if (validateNanny === false){
                    //create div for response and append to results2 div (that is empty)
                    let results = $('#results2');
                    //create a paragraph that says that there is no match
                    let p = $('<p>');
                    p.html('NO MATCH TRY AGAIN!!');
                    //append to div
                    results.append(p);
                    //create a button to go back to form and append to div
                    let buttonBack = $('<button class = "button back" type ="button">Back to Form</button>');
                    results.append(buttonBack);
                    
                    //remove class hide when fail again and go back to the fail div
                    if (results.hasClass('hide')){
                        results.removeClass('hide');
                    }
                    //the button activates on click and removes hide class from form and hides the fail div
                    buttonBack.on('click', function(e){  
                        $('#form1').removeClass('hide');
                        results.addClass('hide');
                        results.html('');
                    });
                }
            });
            //if the AJAX request fails
            request.fail(function(response){
                console.log('ERROR: '+ response.statusText);
            });
        }
        //call function for submit
        $('#main-form').submit(submitForm);
    }//end 3rd step
     
    //call function one - first step
    changePage1();

    //call function two - second step
    addField();
    
    //call function three - third step
    submitMainForm();   
});
