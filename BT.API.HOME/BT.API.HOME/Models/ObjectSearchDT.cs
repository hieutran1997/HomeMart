using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class ObjectSearchDT
    {
        public string MaVatTu { get; set; }
        public string TenVatTu { get; set; }
    }

    public class RequestObjectSearch{
        public decimal pagenumber { get; set; }
        public decimal pagesize { get; set; }
        public string keysearch { get; set; }
        public string order { get; set; }
        public string sorttype { get; set; }
    }
}