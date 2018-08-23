using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class NhomVatTuModel
    {
        public string MALOAIVATTU { get; set; }
        public string MANHOMVATTU { get; set; }
        public string MACHA { get; set; }
        public string TENNHOMVATTU { get; set; }
        public string MADONVI { get; set; }

    }
    public class VatTuCungNhom
    {
        public string MaVatTu { get; set; }
        public string TenVatTu { get; set; }
        public decimal DonGia { get; set; }
        public byte[] Avatar { get; set; }
        public string MaLoaiVatTu { get; set; }
    }
}