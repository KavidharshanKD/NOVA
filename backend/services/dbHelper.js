import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('backend/data');

// Ensure database fallback directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (modelName) => {
  return path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
};

const readData = (modelName) => {
  const filePath = getFilePath(modelName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
};

const writeData = (modelName, data) => {
  const filePath = getFilePath(modelName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const dbHelper = {
  find: async (Model, query = {}) => {
    if (!global.useLocalMockDB) {
      return await Model.find(query);
    }
    
    let items = readData(Model.modelName);
    return items.filter(item => {
      for (let key in query) {
        if (query[key] && typeof query[key] === 'object' && query[key].$in) {
          if (!query[key].$in.includes(item[key])) return false;
        } else if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },

  findOne: async (Model, query = {}) => {
    if (!global.useLocalMockDB) {
      return await Model.findOne(query);
    }
    
    let items = readData(Model.modelName);
    const found = items.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    return found || null;
  },

  findById: async (Model, id) => {
    if (!global.useLocalMockDB) {
      return await Model.findById(id);
    }
    
    let items = readData(Model.modelName);
    const stringId = id ? id.toString() : '';
    const found = items.find(item => item._id === stringId || item.id === stringId);
    return found || null;
  },

  create: async (Model, data) => {
    if (!global.useLocalMockDB) {
      return await Model.create(data);
    }
    
    let items = readData(Model.modelName);
    const newDoc = {
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    items.push(newDoc);
    writeData(Model.modelName, items);
    return newDoc;
  },

  findByIdAndUpdate: async (Model, id, update, options = {}) => {
    if (!global.useLocalMockDB) {
      return await Model.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    
    let items = readData(Model.modelName);
    const stringId = id ? id.toString() : '';
    const idx = items.findIndex(item => item._id === stringId || item.id === stringId);
    if (idx === -1) return null;
    
    // Apply mongoose-like updates
    let updatedItem = { ...items[idx] };
    const actualUpdate = update.$set || update;
    
    for (let key in actualUpdate) {
      updatedItem[key] = actualUpdate[key];
    }
    
    // Handle increments ($inc)
    if (update.$inc) {
      for (let key in update.$inc) {
        updatedItem[key] = (updatedItem[key] || 0) + update.$inc[key];
      }
    }
    
    items[idx] = updatedItem;
    writeData(Model.modelName, items);
    return updatedItem;
  },

  updateOne: async (Model, query, update, options = {}) => {
    if (!global.useLocalMockDB) {
      return await Model.updateOne(query, update, options);
    }
    
    let items = readData(Model.modelName);
    const idx = items.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (idx === -1) return { nModified: 0 };
    
    let updatedItem = { ...items[idx] };
    const actualUpdate = update.$set || update;
    
    for (let key in actualUpdate) {
      updatedItem[key] = actualUpdate[key];
    }
    
    if (update.$inc) {
      for (let key in update.$inc) {
        updatedItem[key] = (updatedItem[key] || 0) + update.$inc[key];
      }
    }
    
    items[idx] = updatedItem;
    writeData(Model.modelName, items);
    return { nModified: 1 };
  },

  deleteOne: async (Model, query = {}) => {
    if (!global.useLocalMockDB) {
      return await Model.deleteOne(query);
    }
    
    let items = readData(Model.modelName);
    const initialLen = items.length;
    items = items.filter(item => {
      for (let key in query) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });
    writeData(Model.modelName, items);
    return { deletedCount: initialLen - items.length };
  }
};
