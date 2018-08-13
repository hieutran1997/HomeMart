using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class ObjectCartModel
    {
        public string NGAY { get; set; }
        public string MAKHACHHANG { get; set; }
        public string THANHTIENSAUVAT { get; set; }
        public string TENNN { get; set; }
        public string SDTNN { get; set; }
        public string DIACHINN { get; set; }
        public string UNITCODE { get; set; }
        public decimal SOPHIEUCON { get; set; }
        public decimal SOLUONG { get; set; }
        public List<DetailsCart> Details { get; set; }
    }

    public class DetailsCart
    {
        public string MAHANG { get; set; }
        public string TENHANG { get; set; }
        public decimal SOLUONG { get; set; }
        public decimal DONGIA { get; set; }
        public decimal SOLUONGTON { get; set; }
        public decimal SOLUONGLE { get; set; }
        public decimal DONGIADEXUAT { get; set; }
    }
}