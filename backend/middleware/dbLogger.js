const mongoose = require('mongoose');

// Track original methods to replace them with logging versions
const originalSave = mongoose.Model.prototype.save;
const originalFindOne = mongoose.Model.findOne;
const originalFind = mongoose.Model.find;
const originalFindById = mongoose.Model.findById;
const originalFindByIdAndUpdate = mongoose.Model.findByIdAndUpdate;
const originalFindByIdAndDelete = mongoose.Model.findByIdAndDelete;

// Add logging to Mongoose operations
const setupDbLogging = () => {
  // Log save operations
  mongoose.Model.prototype.save = function() {
    console.log(`[DB Operation] Save called on ${this.constructor.modelName}:`, JSON.stringify(this.toObject()));
    return originalSave.apply(this, arguments)
      .then(result => {
        console.log(`[DB Success] Save successful on ${this.constructor.modelName} with ID ${result._id}`);
        return result;
      })
      .catch(err => {
        console.error(`[DB Error] Save failed on ${this.constructor.modelName}:`, err.message);
        throw err;
      });
  };

  // Log findOne operations
  /*
  mongoose.Model.findOne = function() {
    const args = Array.from(arguments);
    console.log(`[DB Operation] FindOne called on ${this.modelName} with query:`, JSON.stringify(args[0] || {}));
    return originalFindOne.apply(this, args)
      .then(result => {
        console.log(`[DB Result] FindOne on ${this.modelName} returned:`, result ? 'Document found' : 'No document found');
        return result;
      })
      .catch(err => {
        console.error(`[DB Error] FindOne failed on ${this.modelName}:`, err.message);
        throw err;
      });
  };
  */

  // Log find operations
  /*
  mongoose.Model.find = function() {
    const args = Array.from(arguments);
    console.log(`[DB Operation] Find called on ${this.modelName} with query:`, JSON.stringify(args[0] || {}));
    return originalFind.apply(this, args)
      .then(result => {
        console.log(`[DB Result] Find on ${this.modelName} returned ${result.length} documents`);
        return result;
      })
      .catch(err => {
        console.error(`[DB Error] Find failed on ${this.modelName}:`, err.message);
        throw err;
      });
  };
  */

  // Log findById operations
  /*
  mongoose.Model.findById = function() {
    const args = Array.from(arguments);
    console.log(`[DB Operation] FindById called on ${this.modelName} with ID:`, args[0]);
    return originalFindById.apply(this, args)
      .then(result => {
        console.log(`[DB Result] FindById on ${this.modelName} returned:`, result ? 'Document found' : 'No document found');
        return result;
      })
      .catch(err => {
        console.error(`[DB Error] FindById failed on ${this.modelName}:`, err.message);
        throw err;
      });
  };
  */

  // Log findByIdAndUpdate operations
  /*
  mongoose.Model.findByIdAndUpdate = function() {
    const args = Array.from(arguments);
    console.log(`[DB Operation] FindByIdAndUpdate called on ${this.modelName} with ID:`, args[0]);
    return originalFindByIdAndUpdate.apply(this, args)
      .then(result => {
        console.log(`[DB Result] FindByIdAndUpdate on ${this.modelName} returned:`, result ? 'Document updated' : 'No document updated');
        return result;
      })
      .catch(err => {
        console.error(`[DB Error] FindByIdAndUpdate failed on ${this.modelName}:`, err.message);
        throw err;
      });
  };
  */

  // Log findByIdAndDelete operations
  /*
  mongoose.Model.findByIdAndDelete = function() {
    const args = Array.from(arguments);
    console.log(`[DB Operation] FindByIdAndDelete called on ${this.modelName} with ID:`, args[0]);
    return originalFindByIdAndDelete.apply(this, args)
      .then(result => {
        console.log(`[DB Result] FindByIdAndDelete on ${this.modelName} returned:`, result ? 'Document deleted' : 'No document deleted');
        return result;
      })
      .catch(err => {
        console.error(`[DB Error] FindByIdAndDelete failed on ${this.modelName}:`, err.message);
        throw err;
      });
  };
  */

  console.log('[DB Logger] Database operation logging enabled');
};

module.exports = setupDbLogging; 