using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class KhachHangModel
    {
        public string TenKH { get; set; }
        public string TenKhac { get; set; }
        public DateTime NgaySinh { get; set; }
        public string Email { get; set; }
        public string DienThoai { get; set; }
        public string DiaChi { get; set; }
        public string TinhTP { get; set; }
        public string QuanHuyen { get; set; }
        public string MatKhau { get; set; }
        public string MaDonVi { get; set; }
        public string MaKH { get; set; }
        public bool NPP { get; set; }
        public string TenCH { get; set; }
    }
}