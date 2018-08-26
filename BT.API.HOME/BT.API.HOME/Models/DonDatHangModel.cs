using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class DonDatHangModel
    {
        public string MAHD { get; set; }
        public string NOIDUNG { get; set; }
        public decimal THANHTIENSAUVAT { get; set; }
        public decimal TRANGTHAI { get; set; }
        public decimal SOPHIEUCON { get; set; }
        public DateTime NGAY { get; set; }
    }
}