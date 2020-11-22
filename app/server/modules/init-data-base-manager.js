var db;

exports.setDatabaseInstance = function (databaseInstance) {
    db = databaseInstance;
};

exports.getDatabaseInstance = function (callback) {
    callback(null, db);
};