 import Dexie from 'dexie';

 const db = new Dexie('scheduleDB');
 db.version(1).stores({
     startedEvents: "++id,title,start,length,colour,notes",
     events: "++id,title,allDay,start,end,colour,notes"
 });

 export default db;