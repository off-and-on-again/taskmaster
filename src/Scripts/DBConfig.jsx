export const DBConfig = {
    name: 'Schedule',
    version: 1,
    objectStoresMeta: [
      {
        store: 'savedEvents',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'name', keypath: 'name', options: { unique: false } },
          { name: 'colour', keypath: 'colour', options: { unique: false } },
          { name: 'length', keypath: 'length', options: { unique: false } },
          { name: 'notes', keypath: 'notes', options: { unique: false } }
        ]
      },
      {
        store: 'events',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'id', keypath: 'id', options: { unique: false } },
          { name: 'name', keypath: 'name', options: { unique: false } },
          { name: 'start', keypath: 'start', options: { unique: false } },
          { name: 'end', keypath: 'end', options: { unique: false } },
          { name: 'colour', keypath: 'colour', options: { unique: false } },
          { name: 'day', keypath: 'day', options: { unique: false } },
          { name: 'notes', keypath: 'notes', options: { unique: false } }
        ]
      }
    ]
  };