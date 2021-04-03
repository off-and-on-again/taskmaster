// TODO: create constants for text to modify and form
const form = documents.query('form');
const nameInput = docuements.query('name-input');

document.body.onload = nameDisplayCheck;

// Stop the form from submitting when a button is pressed
form.addEventListener('submit', function(e) {
    e.preventDefault();
});

// run function when the 'submit' button is clicked or 
// 'enter key' is pressed
submitBtn.addEventListener('click', function() {
    // store the entered name in web storage
    localStorage.setItem('name', nameInput.value);
    
    // Update the website with name
    updateDisplay();

});

  updateDisplay = function() {
    // check whether the 'name' data item is stored in web Storage
    if(localStorage.getItem('name')) {
        // If it is, display personalized greeting
        let name = localStorage.getItem('name');
        // Display Name

    } else {
        
        // If not, display generic greeting
  }
}

  // run function when the 'Forget' button is clicked
forgetBtn.addEventListener('click', function() {
    
    // Remove the stored name from web storage
    localStorage.removeItem('name');

    // run nameDisplayCheck() to sort out displaying the
    // generic greeting again and updating the form display
    updateDisplay();
});



