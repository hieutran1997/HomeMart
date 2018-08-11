using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class VatTuViewCart
    {
        public string TenVatTu { get; set; }
        public byte[] Avatar { get; set; }
        public decimal GiaBanLeVat { get; set; }
        public decimal SoLuong { get; set; }
    }
}