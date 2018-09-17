using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class NewsModel
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Type { get; set; }
        public byte[] Image { get; set; }
    }
}