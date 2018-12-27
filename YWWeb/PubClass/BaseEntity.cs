using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YWWeb.PubClass
{
    public abstract class BaseEntity
    {
        public BaseEntity()
        {
            this.ID = ObjectId.GenerateNewId();
        }
      
        [BsonElement(elementName: "_id")]
        public ObjectId ID { get; set; }
        public System.DateTime RecTime { get; set; }
        public int TagID { get; set; }
        public int PID { get; set; }
        public Nullable<double> PV { get; set; }
        public string AlarmStatus { get; set; }
        public Nullable<double> AlarmLimits { get; set; }
    }
}