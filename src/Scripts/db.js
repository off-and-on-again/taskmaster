 import Dexie from 'dexie';

 const db = new Dexie('scheduleDB');
 db.version(1).stores({
     startedEvents: "++id,title,start,length,hexColor,notes",
     events: "++id,title,allDay,start,end,hexColor,notes"
 });

 export default db;