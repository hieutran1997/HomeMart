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
        public decimal SoTon { get; set; }
        public List<string> HinhAnh { get; set; }
        public byte[] Avatar { get; set; }
        public decimal DonGiaKhuyenMai { get; set; }
        public decimal TyLeKhuyeMai { get; set; }
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

    public class VatTuDetail
    {
        public string MaVatTu { get; set; }
        public string TenVatTu { get; set; }
        public string MoTa { get; set; }
        public string MaNhomVatTu { get; set; }
        public decimal DonGia { get; set; }
        public decimal SoTon { get; set; }
        public string NhaCungCap { get; set; }
        public string[] Size { get; set; }
        public byte[] Avatar { get; set; }
        public List<string> HinhAnhs { get; set; }
        public string MaDonVi { get; set; }
    }
}