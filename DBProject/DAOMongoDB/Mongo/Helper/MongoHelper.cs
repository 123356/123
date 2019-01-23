using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace DAOMongoDB.Mongo
{
    public class MongoHelper : IDisposable
    {
        //public static readonly string _MongoDbConnectionStr = "Servers=192.168.0.3:27017;ConnectTimeout=30000;ConnectionLifetime=300000;MinimumPoolSize=8;MaximumPoolSize=256;Pooled=true";
        //public static readonly string database = "Friends";





        //private static IMongoCollection<T> GetCollection<T>(string collectionName = null)
        //{
        //    MongoUrl mongoUrl = new MongoUrl(_MongoDbConnectionStr);
        //    var mongoClient = new MongoClient(mongoUrl);
        //    var database = mongoClient.GetDatabase(mongoUrl.DatabaseName);
        //    return database.GetCollection<T>(collectionName ?? typeof(T).Name);
        //}

        //public class Db
        //{
        //    private static readonly string connStr = ConfigurationManager.ConnectionStrings["MgconnStr"].ToString();

        //    private static readonly string dbName = ConfigurationManager.AppSettings["dbName"].ToString();

        //    private static IMongoDatabase db = null;

        //    private static readonly object lockHelper = new object();

        //    private Db() { }

        //    public static IMongoDatabase GetDb()
        //    {
        //        if (db == null)
        //        {
        //            lock (lockHelper)
        //            {
        //                if (db == null)
        //                {
        //                    var client = new MongoClient(connStr);
        //                    db = client.GetDatabase(dbName);
        //                }
        //            }
        //        }
        //        return db;
        //    }
        //}


        //public class MongoDbHelper<T> where T:BaseEntity
        //{
        //    private IMongoDatabase db = null;

        //    private IMongoCollection<T> collection = null;

        //    public MongoDbHelper()
        //    {
        //        this.db = Db.GetDb();
        //        collection = db.GetCollection<T>(typeof(T).Name);
        //    }

        //    public T Insert(T entity)
        //    {
        //        collection.InsertOneAsync(entity);
        //        return entity;
        //    }

        //    //public void Modify(string id, string field, string value)
        //    //{
        //    //    var filter = Builders<T>.Filter.Eq("Id", ObjectId.Parse(id));
        //    //    var updated = Builders<T>.Update.Set(field, value);
        //    //    UpdateResult result = collection.UpdateOneAsync(filter, updated).Result;
        //    //}

        //    //public void Update(T entity)
        //    //{
        //    //    var old = collection.Find(e => e.ID.Equals(entity.ID)).ToList().FirstOrDefault();

        //    //    foreach (var prop in entity.GetType().GetProperties())
        //    //    {
        //    //        var newValue = prop.GetValue(entity);
        //    //        var oldValue = old.GetType().GetProperty(prop.Name).GetValue(old);
        //    //        if (newValue != null)
        //    //        {
        //    //            if (!newValue.ToString().Equals(oldValue.ToString()))
        //    //            {
        //    //                old.GetType().GetProperty(prop.Name).SetValue(old, newValue.ToString());
        //    //            }
        //    //        }
        //    //    }
        //    //    //old.State = "y";
        //    //    //old.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

        //    //    var filter = Builders<T>.Filter.Eq("Id", entity.ID);
        //    //    ReplaceOneResult result = collection.ReplaceOneAsync(filter, old).Result;
        //    //}

        //    //public void Delete(T entity)
        //    //{
        //    //    var filter = Builders<T>.Filter.Eq("ID", entity.ID);
        //    //    collection.DeleteOneAsync(filter);
        //    //}

        //    //public T QueryOne(string id)
        //    //{
        //    //    return collection.Find(a => a.ID == ObjectId.Parse(id)).ToList().FirstOrDefault();
        //    //}

        //    public List<T> QueryAll(string tableName)
        //    {
        //        this.db = Db.GetDb();
        //        collection = db.GetCollection<T>(tableName);
        //        return collection.Find(new BsonDocument()).Limit(50).ToList();
        //    }



        //}

        protected static IMongoClient _client;
        protected static IMongoDatabase _database;
     
        private static readonly string connStr = ConfigurationManager.ConnectionStrings["MgconnStr"].ToString();

        private static readonly string dbName = ConfigurationManager.AppSettings["dbName"].ToString();
        #region Constructors
        public MongoHelper()
        {
            _client = new MongoClient(connStr);
            _database = _client.GetDatabase(dbName);
        }

        //public MongoHelper(string dbname, ILogger log)
        //{
        //    _client = new MongoClient(connStr);
        //    _database = _client.GetDatabase(dbName);
        //    //_logger = log;
        //}
        public MongoHelper(string dbname)
        {
            _client = new MongoClient(connStr);
            _database = _client.GetDatabase(dbName);
        }
        #endregion

        #region Select
        #region Select Count
        /// <summary>
        /// Returns the count of all recors in the specified collection
        /// </summary>
        /// <param name="collectionName"></param>
        /// <returns></returns>
        public long? SelectCount(string collectionName)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>(collectionName);
                return collection.Find(new BsonDocument()).Count();
            }
            catch (Exception ex)
            {
                this.WriteError("SelectCount", "SelectCount(string collectionName)", ex.Message);
                throw ex;
                //return null;
            }
        }
        /// <summary>
        /// Select count 
        /// </summary>
        /// <param name="collectionName"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public long SelectCount(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            return collection.Find(filter).Count();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="collectionName"></param>
        /// <param name="field"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public long SelectCount(string collectionName, string field, string value)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            return collection.Find(Builder.FilterEq(field, value)).Count();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="collectionName"></param>
        /// <param name="field"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public long SelectCount(string collectionName, string field, ObjectId id)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            return collection.Find(Builder.FilterEq(field, id)).Count();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="collectionName"></param>
        /// <param name="field"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public long SelectCount<T>(string collectionName, string field, T value)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            return collection.Find(Builder.FilterEq<T>(field, value)).Count();
        }
        #endregion
        /// <summary>
        /// Returns a list of the given type
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="collectionName"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public List<T> Select<T>(string collectionName, FilterDefinition<BsonDocument> filter, int rows, int page,out int total)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            SortDefinitionBuilder<BsonDocument> builderSort = Builders<BsonDocument>.Sort;
            SortDefinition<BsonDocument> sort = builderSort.Descending("RecTime");
            //total = Convert.ToInt32(collection.Indexes);
            total = 20;
            var result = collection.Find(filter).Skip((page - 1) * rows).Limit(rows).ToList();
            List<T> returnList = new List<T>();
            foreach (var l in result)
            {
                returnList.Add(BsonSerializer.Deserialize<T>(l));
            }
            return returnList;
        }
        /// <summary>
        /// Select a single record of the given type
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="collectionName"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public T SelectOne<T>(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            var result = collection.Find(filter).ToList();
            if (result.Count > 1)
            {
                throw new Exception("To many results");
            }
            return BsonSerializer.Deserialize<T>(result.ElementAt(0));
        }
        #endregion

        #region Insert
        /// <summary>
        /// Insert a BsonDocument 
        /// </summary>
        /// <param name="collectionName"></param>
        /// <param name="doc"></param>
        /// <returns></returns>
        public bool Insert(string collectionName, BsonDocument doc)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>(collectionName);
                collection.InsertOne(doc);
                return true;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// Insert an object of any type
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="collectionName"></param>
        /// <param name="doc"></param>
        /// <returns></returns>
        public bool Insert<T>(string collectionName, T doc)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>(collectionName);
                collection.InsertOne(doc.ToBsonDocument());
                return true;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// Insert multiple objects into a collection
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="collectionName"></param>
        /// <param name="documents"></param>
        /// <returns></returns>
        public bool InsertMany<T>(string collectionName, IEnumerable<T> documents)
        {
            try
            {
                List<BsonDocument> docs = new List<BsonDocument>();
                for (int i = 0; i < documents.Count(); i++)
                {
                    docs[i] = documents.ElementAt(i).ToBsonDocument();
                }
                var collection = _database.GetCollection<BsonDocument>(collectionName);
                collection.InsertMany(docs);
                return true;
            }
            catch
            {
                return false;
            }
        }
        #endregion

        #region Update
        /// <summary>
        /// Update an object
        /// </summary>
        /// <param name="collectionName"></param>
        /// <param name="filter"></param>
        /// <param name="update"></param>
        /// <returns></returns>
        public bool UpdateOne(string collectionName, FilterDefinition<BsonDocument> filter, UpdateDefinition<BsonDocument> update)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>(collectionName);
                collection.UpdateOne(filter, update);
                return true;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// Update an object
        /// </summary>
        /// <param name="collectionName"></param>
        /// <param name="fieldName">The field name to identify the object to be updated</param>
        /// <param name="value">The value to the identifier field</param>
        /// <param name="update"></param>
        /// <returns></returns>
        public bool UpdateOne(string collectionName, string fieldName, string value, UpdateDefinition<BsonDocument> update)
        {
            try
            {
                var filter = Builder.FilterEq(fieldName, value);
                var collection = _database.GetCollection<BsonDocument>(collectionName);
                collection.UpdateOne(filter, update);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Update an Array inside an object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="collectionName"></param>
        /// <param name="arrayField"></param>
        /// <param name="list"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public bool UpdateArray<T>(string collectionName, string arrayField, List<T> list, FilterDefinition<BsonDocument> filter)
        {
            try
            {
                var collection = _database.GetCollection<BsonDocument>(collectionName);
                var update = Builders<BsonDocument>.Update.PushEach(arrayField, list);
                collection.FindOneAndUpdate<BsonDocument>(filter, update);
                return true;
            }
            catch
            {
                return false;
            }
        }
        #endregion

        #region Delete
        /// <summary>
        /// Remove an object from  a collection
        /// </summary>
        /// <param name="collectionName"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public bool Delete(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// Remove an object from a collection
        /// </summary>
        /// <param name="collectionName"></param>
        /// <param name="fieldName"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public bool Delete(string collectionName, string fieldName, string value)
        {
            var filter = Builder.FilterEq(fieldName, value);
            throw new NotImplementedException();
        }
        #endregion

        #region private
        private void WriteError(string title, string function, string message)
        {
            //if (_logger != null)
            //    _logger.WriteError(title, function, message);
            System.Diagnostics.Debug.Write(title + function + "-"+message);
        }
        #endregion

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}