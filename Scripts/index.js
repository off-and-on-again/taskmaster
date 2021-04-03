// TODO: create constants for text to modify and form
const form = documents.query('form');
const nameInput = docuements.query('name-input');

// Initialise indexDB
let db;

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

window.onload = function() {
    // Open our database; it is created if it doesn't already exist
    // (see onupgradeneeded below)
    let request = window.indexedDB.open('schedule_db', 1);
  
    // onerror handler signifies that the database didn't open successfully
    request.onerror = function() {
      console.log('Database failed to open');
    };
  
    // onsuccess handler signifies that the database opened successfully
    request.onsuccess = function() {
      console.log('Database opened succesfully');
  
      // Store the opened database object in the db variable. This is used a lot below
      db = request.result;
  
      // Run the displayData() function to display the  already in the IDB
      displayData();
    };
  
    // Setup the database tables if this has not already been done
    request.onupgradeneeded = function(e) {
  
      // Grab a reference to the opened database
      let db = e.target.result;
  
      // Create an objectStore to store our notes in (basically like a single table)
      // including a auto-incrementing key
      let objectStore = db.createObjectStore('schedule_os', { keyPath: 'id', autoIncrement:true });
  
      // Define what data items the objectStore will contain
      objectStore.createIndex('event', 'event', { unique: false });
      objectStore.createIndex('startTime', 'start-time', { unique: false });
      objectStore.createIndex('endTime', 'end-time', { unique: false });
      objectStore.createIndex('day', 'day', { unique: false });
      objectStore.createIndex('colour', 'colour', { unique: false });
      objectStore.createIndex('notes', 'notes', { unique: false });
  
      console.log('Database setup complete');
    };

    function displayData() {
    
        // Open our object store and then get a cursor - which iterates through all the
        // different data items in the store
        let objectStore = db.transaction('schedule_os').objectStore('schedule_os');
        objectStore.openCursor().onsuccess = function(e) {
            // Get a reference to the cursor
            let cursor = e.target.result;
            // Generate date object and grab the corresponding weekday (0 = Sun, 1 = Mon... 6 = Sat)
            var date = new Date();
            var day = date.getDay();
        
            // If there is still another data item to iterate through, keep running this code
            if(cursor) {

                // Check to see if it matches the current date
                if(cursor.value.day != day) {
                    cursor.continue();
                }
                // Create a list item, h3, and p to put each data item inside when displaying it
                // structure the HTML fragment, and append it inside the list
                const listItem = document.createElement('li');
                const h3 = document.createElement('h3');
                const para = document.createElement('p');
        
                listItem.appendChild(h3);
                listItem.appendChild(para);
                list.appendChild(listItem);
        
                // Put the data from the cursor inside the h3 and para
                h3.textContent = cursor.value.title;
                para.textContent = cursor.value.body;
        
                // Store the ID of the data item inside an attribute on the listItem, so we know
                // which item it corresponds to. This will be useful later when we want to delete items
                listItem.setAttribute('data-note-id', cursor.value.id);
        
                // Create a button and place it inside each listItem
                const deleteBtn = document.createElement('button');
                listItem.appendChild(deleteBtn);
                deleteBtn.textContent = 'Delete';
        
                // Set an event handler so that when the button is clicked, the deleteItem()
                // function is run
                deleteBtn.onclick = deleteItem;
        
                // Iterate to the next item in the cursor
                cursor.continue();
            } else {
                // Again, if list item is empty, display a 'No notes stored' message
                if(!list.firstChild) {
                const listItem = document.createElement('li');
                listItem.textContent = 'No notes stored.'
                list.appendChild(listItem);
                }
                // if there are no more cursor items to iterate through, say so
                console.log('Notes all displayed');
            }
        };
      }
}