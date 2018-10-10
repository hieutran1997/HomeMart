using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class NewsModel
    {
        public string ID { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Content { get; set; }
        public string Type { get; set; }
        public byte[] Image { get; set; }
        public DateTime CreateDate { get; set; }
        public string Tags { get; set; }
    }

    public class NewsPaging
    {
        public List<NewsModel> Data { get; set; }
        public decimal ItemTotal { get; set; }
        public decimal PageSize { get; set; }
        public decimal PageNumber { get; set; }
        public NewsPaging(List<NewsModel> _data)
        {
            Data = _data;
        }
    }
}