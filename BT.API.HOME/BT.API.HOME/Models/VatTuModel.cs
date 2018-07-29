using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class VatTuModel
    {
        public string TenVatTu { get; set; }
        public string MaVatTu { get; set; }
        public decimal DonGia { get; set; }
        public decimal SoLuong { get; set; }
        public List<string> HinhAnh { get; set; }
    }

    public class VatTuDTO
    {
        public List<VatTuModel> Data { get; set; }
        public decimal ItemTotal { get; set; }
        public decimal PageSize { get; set; }
        public decimal PageNumber { get; set; }
        public VatTuDTO(List<VatTuModel> _data)
        {
            Data = _data;
        }
    }
}