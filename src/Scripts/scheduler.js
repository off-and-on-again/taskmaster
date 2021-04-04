let db;

export function grabDatabase() {
    let request = window.indexedDB.open("schedule_db", 1);

    request.onerror = function () {
        console.log("Database failed to open");
    };

    request.onsuccess = function () {
        console.log('Database opened succesfully');
    }
    // Store the opened database object in the db variable. This is used a lot below
    return request.result;
}

export function unpackData(key) {

    db = grabDatabase();

    request.onupgradeneeded = function (e) {

        // Grab a reference to the opened database
        let db = e.target.result;

        // Create an objectStore to store our notes in (basically like a single table)
        // including a auto-incrementing key
        let savedEventStore = db.createObjectStore('savedEvents_os', { keyPath: 'id', autoIncrement: true });

        // Define what data items the objectStore will contain
        savedEventStore.createIndex('id', 'id', { unique: true });
        savedEventStore.createIndex('name', 'name', { unique: false });
        savedEventStore.createIndex('colour', 'colour', { unique: false });
        savedEventStore.createIndex('start', 'start', { unique: false });
        savedEventStore.createIndex('length', 'length', { unique: false });
        savedEventStore.createIndex('notes', 'notes', { unique: false });


        let eventsStore = db.createObjectStore('events_os', { keyPath: 'id', autoIncrement: true });

        // Define what data items the objectStore will contain
        eventsStore.createIndex('id', 'id', { unique: true });
        eventsStore.createIndex('name', 'name', { unique: false });
        eventsStore.createIndex('colour', 'colour', { unique: false });
        eventsStore.createIndex('start', 'start', { unique: false });
        eventsStore.createIndex('end', 'colour', { unique: false });
        eventsStore.createIndex('day', 'day', { unique: false });
        eventsStore.createIndex('notes', 'notes', { unique: false });

        console.log('Database setup complete');
    };

    if (key == 0) {

        let objectStore = db.transaction('savedEvents_os').objectStore('savedEvents_os');
        let savedEvents = [];
        objectStore.openCursor().onsucess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                savedEvents.push(cursor.value);
                cursor.continue();
            } else {
                return savedEvents;
            }
        };
    } else {

        let objectStore = db.transaction('events_os').objectStore('events_os');
        let events = [];
        objectStore.openCursor().onsucess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                events.push(cursor.value);
                cursor.continue();
            } else {
                return events;
            }
        };
    }
}

export function addData(event, key) {

    db = grabDatabase();

    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    if (key == 0) {
        let transaction = db.transaction(['savedEvents_os'], 'readwrite');
        let objectStore = db.objectStore('savedEvents_os');

        let newItem = {
            id: event.id,
            name: event.name,
            start: event.start,
            colour: event.colour,
            length: event.length,
            notes: event.notes,
        };

    } else {
        let transaction = db.transaction(['events_os'], 'readwrite');
        let objectStore = db.objectStore('events_os');

        let newItem = {
            id: event.id,
            name: event.name,
            start: event.start,
            colour: event.colour,
            end: event.end,
            day: false,
            notes: event.notes,
        };
    }
    objectStore.add(newItem);

    transaction.oncomplete = function () {
        console.log('Transaction completed: database modification finished.');
    };

    transaction.onerror = function () {
        console.log('Transaction not opened due to error');
    };
}

export function deleteData(event, key) {

    db = grabDatabase();

    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    if (key == 0) {
        let transaction = db.transaction(['savedEvents_os'], 'readwrite');
        let objectStore = db.objectStore('savedEvents_os');

    } else {
        let transaction = db.transaction(['events_os'], 'readwrite');
        let objectStore = db.objectStore('events_os');
    }

    let request = objectStore.delete(event.id);
    transaction.oncomplete = function () {
        console.log('Note ' + noteId + ' deleted.');
    };

}

export function updateData(event, key) {

    db = grabDatabase();

    if (key == 0) {
        let transaction = db.transaction(["savedEvents_os"], 'readwrite');
        let objectStore = db.objectStore("savedEvents_os");
        updatedItem = {
            id: event.id,
            name: event.name,
            start: event.start,
            colour: event.colour,
            length: event.length,
            notes: event.notes,
        };
    } else {
        let transaction = db.transaction(['events_os'], 'readwrite');
        let objectStore = db.objectStore('events_os');

        let newItem = {
            id: event.id,
            name: event.name,
            start: event.start,
            colour: event.colour,
            end: event.end,
            day: false,
            notes: event.notes,
        };
    }

    request = objectStore.put(newItem);

}