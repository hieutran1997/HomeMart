using System;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using System.Data;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using BT.API.HOME.Models;
using OracleInternal.Secure.Network;
using System.Threading.Tasks;
using static BT.API.HOME.Models.AddressModel;

namespace BT.API.HOME.Controllers
{
    [RoutePrefix("api/home")]
    public class HomeController : ApiController
    {
        /// <summary>
        /// Lấy danh sách các mặt hàng trang home
        /// </summary>
        /// <param name="pagenumber"></param>
        /// <param name="pagesize"></param>
        /// <param name="order"></param>
        /// <param name="sorttype"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> GetListMerchanedise(decimal pagenumber, decimal pagesize, string order, string sorttype)
        {
            List<VatTuModel> lstVatTu = new List<VatTuModel>();
            VatTuDTO vattu = new VatTuDTO(lstVatTu);
            string table_XNT = CommonService.GET_TABLE_NAME_NGAYHACHTOAN_CSDL_ORACLE();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    decimal P_PAGENUMBER = pagenumber;
                    decimal P_PAGESIZE = pagesize;
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.InitialLONGFetchSize = 1000;
                    command.CommandText = string.Format(@"SELECT * FROM ( SELECT a.*, rownum r__ FROM ( SELECT vt.MAVATTU , vt.TENVATTU , vt.GIABANLEVAT ,vt.Avatar, vt.PATH_IMAGE , vt.IMAGE , xnt.TONCUOIKYSL  FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU  WHERE vt.MADONVI ='DV1-CH1'  AND xnt.TONCUOIKYSL > 0 AND xnt.MAKHO ='DV1-CH1-KBL' ORDER BY " + order + " " + sorttype + " ) a WHERE rownum < ((" + P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " + P_PAGESIZE + ") + 1)");
                    command.CommandType = CommandType.Text;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            decimal dongia, soluong = 0;
                            while (reader.Read())
                            {
                                VatTuModel temp = new VatTuModel();
                                temp.MaVatTu = reader["MAVATTU"].ToString();
                                temp.TenVatTu = reader["TENVATTU"].ToString();
                                decimal.TryParse(reader["GIABANLEVAT"].ToString(), out dongia);
                                temp.DonGia = dongia;
                                decimal.TryParse(reader["TONCUOIKYSL"].ToString(), out soluong);
                                temp.SoTon = soluong;
                                string HinhAnh = reader["IMAGE"].ToString();
                                string[] lstAnh = HinhAnh.Split(',');
                                temp.HinhAnh = new List<string>();
                                try
                                {
                                    temp.Avatar = (byte[])reader["Avatar"];
                                }
                                catch (Exception)
                                {
                                }
                                string Path = reader["PATH_IMAGE"].ToString();
                                for (int i = 0; i < lstAnh.Length; i++)
                                {
                                    if (!string.IsNullOrEmpty(lstAnh[i]))
                                    {
                                        temp.HinhAnh.Add(Path + lstAnh[i]);
                                    }
                                }
                                temp.DonGiaKhuyenMai = 0;
                                //temp.DonGiaKhuyenMai = CommonService.GET_CTKM(connection, temp.MaVatTu, "DV1-CH1");
                                lstVatTu.Add(temp);
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }

                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = @"SELECT COUNT(*) TOTALITEM FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU WHERE vt.MADONVI ='DV1-CH1' AND xnt.TONCUOIKYSL > 0";
                    cmd.CommandType = CommandType.Text;
                    OracleDataReader dataReader = cmd.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        decimal totalitem = 0;
                        while (dataReader.Read())
                        {
                            decimal.TryParse(dataReader["TOTALITEM"].ToString(), out totalitem);
                            vattu.ItemTotal = totalitem;
                            vattu.PageSize = pagesize;
                            vattu.PageNumber = pagenumber;
                        }
                    }
                }
            }
            return Ok(vattu);
        }

        /// <summary>
        /// Lấy dánh sách các mặt hàng dựa theo loại 
        /// </summary>
        /// <param name="pagenumber"></param>
        /// <param name="pagesize"></param>
        /// <param name="merchanedisetype"></param>
        /// <param name="order"></param>
        /// <param name="sorttype"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> GetListMerchanediseByCategory(decimal pagenumber, decimal pagesize, string merchanedisetype, string order, string sorttype)
        {
            List<VatTuModel> lstVatTu = new List<VatTuModel>();
            VatTuDTO vattu = new VatTuDTO(lstVatTu);
            string table_XNT = CommonService.GET_TABLE_NAME_NGAYHACHTOAN_CSDL_ORACLE();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    decimal P_PAGENUMBER = pagenumber;
                    decimal P_PAGESIZE = pagesize;
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.InitialLONGFetchSize = 1000;
                    command.CommandText = string.Format(@"SELECT * FROM ( SELECT a.*, rownum r__ FROM ( SELECT vt.MAVATTU , vt.TENVATTU , vt.GIABANLEVAT ,vt.Avatar, vt.PATH_IMAGE , vt.IMAGE , xnt.TONCUOIKYSL  FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU  WHERE vt.MADONVI ='DV1-CH1'  AND xnt.TONCUOIKYSL > 0 AND xnt.MAKHO ='DV1-CH1-KBL' AND vt.MANHOMVATTU='" + merchanedisetype + "' OR vt.MALOAIVATTU = '" + merchanedisetype + "' ORDER BY " + order + " " + sorttype + " ) a WHERE rownum < ((" + P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " + P_PAGESIZE + ") + 1)");
                    command.CommandType = CommandType.Text;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            decimal dongia, soluong = 0;
                            while (reader.Read())
                            {
                                VatTuModel temp = new VatTuModel();
                                temp.MaVatTu = reader["MAVATTU"].ToString();
                                temp.TenVatTu = reader["TENVATTU"].ToString();
                                decimal.TryParse(reader["GIABANLEVAT"].ToString(), out dongia);
                                temp.DonGia = dongia;
                                decimal.TryParse(reader["TONCUOIKYSL"].ToString(), out soluong);
                                temp.SoTon = soluong;
                                try
                                {
                                    temp.Avatar = (byte[])reader["Avatar"];
                                }
                                catch (Exception)
                                {
                                }
                                string HinhAnh = reader["IMAGE"].ToString();
                                string[] lstAnh = HinhAnh.Split(',');
                                temp.HinhAnh = new List<string>();

                                string Path = reader["PATH_IMAGE"].ToString();
                                for (int i = 0; i < lstAnh.Length; i++)
                                {
                                    if (!string.IsNullOrEmpty(lstAnh[i]))
                                    {
                                        temp.HinhAnh.Add(Path + lstAnh[i]);
                                    }
                                }
                                lstVatTu.Add(temp);
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = @"SELECT COUNT(*) TOTALITEM FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU WHERE vt.MADONVI ='DV1-CH1' AND xnt.TONCUOIKYSL > 0  AND vt.MANHOMVATTU='" + merchanedisetype + "' OR vt.MALOAIVATTU = '" + merchanedisetype + "'";
                    cmd.CommandType = CommandType.Text;
                    OracleDataReader dataReader = cmd.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        decimal totalitem = 0;
                        while (dataReader.Read())
                        {
                            decimal.TryParse(dataReader["TOTALITEM"].ToString(), out totalitem);
                            vattu.ItemTotal = totalitem;
                            vattu.PageSize = pagesize;
                            vattu.PageNumber = pagenumber;
                        }
                    }
                }
            }
            return Ok(vattu);
        }

        /// <summary>
        /// Lấy thông tin chi tiết mặt hàng theo mã hàng
        /// </summary>
        /// <param name="mavattu"></param>
        /// <param name="madonvi"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> GetDetailMerchanedise(string mavattu, string madonvi)
        {
            VatTuDetail result = new VatTuDetail();
            string table_XNT = CommonService.GET_TABLE_NAME_NGAYHACHTOAN_CSDL_ORACLE();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = connection;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = @"SELECT vt.MAVATTU , vt.TITLE , vt.TENVATTU,vt.MASIZE ,vt.MADONVI, vt.GIABANLEVAT,vt.TENNHACUNGCAP ,vt.Avatar , vt.MANHOMVATTU, vt.PATH_IMAGE , vt.IMAGE , xnt.TONCUOIKYSL  FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU WHERE vt.MADONVI ='" + madonvi + "' AND xnt.MAKHO ='DV1-CH1-KBL' AND vt.MAVATTU = :mavattu";
                    cmd.Parameters.Add("mavattu", OracleDbType.NVarchar2, 50).Value = mavattu;
                    try
                    {
                        OracleDataReader reader = cmd.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                decimal dongia, soluong = 0;
                                result.MaVatTu = reader["MAVATTU"].ToString();
                                result.TenVatTu = reader["TENVATTU"].ToString();
                                decimal.TryParse(reader["GIABANLEVAT"].ToString(), out dongia);
                                result.DonGia = dongia;
                                decimal.TryParse(reader["TONCUOIKYSL"].ToString(), out soluong);
                                result.SoTon = soluong;
                                string HinhAnh = reader["IMAGE"].ToString();
                                string[] lstAnh = HinhAnh.Split(',');
                                result.HinhAnhs = new List<string>();
                                result.Avatar = (byte[])reader["Avatar"];
                                string Path = reader["PATH_IMAGE"].ToString();
                                result.MaDonVi = reader["MADONVI"].ToString();
                                result.MaNhomVatTu = reader["MANHOMVATTU"].ToString();
                                result.MoTa = reader["TITLE"].ToString();
                                for (int i = 0; i < lstAnh.Length; i++)
                                {
                                    if (!string.IsNullOrEmpty(lstAnh[i]))
                                    {
                                        result.HinhAnhs.Add(Path + lstAnh[i]);
                                    }
                                }
                                result.NhaCungCap = reader["TENNHACUNGCAP"].ToString();
                                result.MoTa = reader["TITLE"].ToString();
                                string[] sizes = reader["MASIZE"].ToString().Split(',');
                                result.Size = sizes;
                            }
                        }
                    }
                    catch (Exception ex) { }
                }
            }
            return Ok(result);
        }

        /// <summary>
        /// Lấy danh sách các loại hàng hóa
        /// </summary>
        /// <param name="madonvi"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> GetListMerchanediseType(string madonvi)
        {
            List<MerchanediseType> lstMerchanediseType = new List<MerchanediseType>();
            using (
                OracleConnection connection =
                    new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM DM_LOAIVATTU WHERE UNITCODE = :madonvi";
                    command.Parameters.Add("madonvi", OracleDbType.NVarchar2, 10).Value = madonvi;
                    OracleDataReader reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            MerchanediseType merchanediseType = new MerchanediseType();
                            merchanediseType.MaLoaiVatTu = reader["MALOAIVATTU"].ToString();
                            merchanediseType.TenLoaiVatTu = reader["TENLOAIVT"].ToString();
                            merchanediseType.UnitCode = reader["UNITCODE"].ToString();
                            lstMerchanediseType.Add(merchanediseType);
                        }
                    }
                }
            }
            return Ok(lstMerchanediseType);
        }

        [Route("GetTitleOfCategory")]
        [HttpGet]
        public async Task<IHttpActionResult> GetTitleOfCategory(string code, string madonvi)
        {
            string results = "";
            using (OracleConnection connection =
                new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    if (code.Length > 3)
                    {
                        command.CommandText = @"SELECT TENNHOMVT FROM DM_NHOMVATTU WHERE MANHOMVTU = '" + code + "' AND UNITCODE = '" + madonvi + "'";
                    }
                    else
                    {
                        command.CommandText = @"SELECT TENLOAIVT FROM DM_LOAIVATTU WHERE MALOAIVATTU = '" + code + "' AND UNITCODE = '" + madonvi + "'";
                    }
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                if (code.Length > 3)
                                {
                                    results = reader["TENNHOMVT"].ToString();
                                }
                                else
                                {
                                    results = reader["TENLOAIVT"].ToString();
                                }
                            }
                        }
                    }
                    catch (Exception) { }
                }
                return Ok(results);
            }
        }


        /// <summary>
        /// Lấy danh sách các nhóm hàng hóa
        /// </summary>
        /// <param name="unitcode"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> GetAllGroupMerchanedise(string unitcode)
        {
            List<NhomVatTuModel> lstNhomVatTu = new List<NhomVatTuModel>();
            using (
                OracleConnection connection =
                    new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM DM_NHOMVATTU WHERE UNITCODE = :madonvi ";
                    command.Parameters.Add("madonvi", OracleDbType.NVarchar2, 10).Value = unitcode;
                    OracleDataReader reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            NhomVatTuModel temp = new NhomVatTuModel();
                            temp.MALOAIVATTU = reader["MALOAIVATTU"].ToString();
                            temp.MANHOMVATTU = reader["MANHOMVTU"].ToString();
                            temp.TENNHOMVATTU = reader["TENNHOMVT"].ToString();
                            temp.MADONVI = reader["UNITCODE"].ToString();
                            temp.MACHA = reader["MACHA"].ToString();
                            lstNhomVatTu.Add(temp);
                        }
                    }
                }
            }
            return Ok(lstNhomVatTu);
        }

        /// <summary>
        /// Lấy mặt hàng theo mã hàng
        /// </summary>
        /// <param name="mavattuselect"></param>
        /// <param name="madonvi"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> GetMerchanediseByCode(string mavattuselect, string madonvi)
        {
            VatTuViewCart result = new VatTuViewCart();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = connection;
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = @"SELECT vt.AVATAR,vt.TENHANG,vt.GIABANLEVAT FROM V_VATTU_GIABAN vt WHERE vt.MAVATTU=:mavattu AND vt.UNITCODE = :madonvi";
                    cmd.Parameters.Add("mavattu", OracleDbType.NVarchar2, 50).Value = mavattuselect;
                    cmd.Parameters.Add("madonvi", OracleDbType.NVarchar2, 50).Value = madonvi;
                    try
                    {
                        OracleDataReader reader = cmd.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                decimal dongia = 0;
                                result.TenVatTu = reader["TENHANG"].ToString();
                                decimal.TryParse(reader["GIABANLEVAT"].ToString(), out dongia);
                                result.GiaBanLeVat = dongia;
                                result.Avatar = (byte[])reader["Avatar"];
                                result.SoLuong = 0;
                            }
                        }
                    }
                    catch (Exception ex) { }
                }
            }
            return Ok(result);
        }

        /// <summary>
        /// Khuyến mãi
        /// </summary>
        /// <param name="pagenumber"></param>
        /// <param name="pagesize"></param>
        /// <param name="makho"></param>
        /// <param name="madonvi"></param>
        /// <returns></returns>
        public async Task<IHttpActionResult> GetListMerchanediseKhuyenMai(decimal pagenumber, decimal pagesize, string makho, string madonvi)
        {
            List<VatTuModel> lstVatTu = new List<VatTuModel>();
            VatTuDTO vattu = new VatTuDTO(lstVatTu);
            string table_XNT = CommonService.GET_TABLE_NAME_NGAYHACHTOAN_CSDL_ORACLE();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    decimal P_PAGENUMBER = pagenumber;
                    decimal P_PAGESIZE = pagesize;
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.InitialLONGFetchSize = 1000;
                    command.CommandText = string.Format(@"SELECT * FROM ( SELECT a.*, rownum r__ FROM ( SELECT km.MACHUONGTRINH,km.TUNGAY,DENNGAY,km.TUGIO,km.DENGIO,km.MAVATTU,km.SOLUONG,km.TYLEKHUYENMAICHILDREN AS TYLE,km.GIATRIKHUYENMAICHILDREN AS GIATRI,vt.GIABANLEVAT,vt.AVATAR,vt.TENHANG,xnt.TONCUOIKYSL SOTON FROM V_VATTU_GIABAN vt RIGHT JOIN V_CHUONGTRINH_KHUYENMAI km ON vt.MAVATTU = km.MAVATTU LEFT JOIN " + table_XNT + " xnt ON xnt.MAVATTU= km.MAVATTU WHERE km.UNITCODE = '" + madonvi + "' AND km.TRANGTHAI = 10 AND vt.UNITCODE ='" + madonvi + "' AND xnt.MAKHO ='" + makho + "' AND km.TUNGAY >=TO_DATE(SYSDATE,'DD/MM/YY') AND km.DENNGAY <= TO_DATE(SYSDATE,'DD/MM/YY') ORDER BY vt.I_CREATE_DATE DESC ) a WHERE rownum < ((" + P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " + P_PAGESIZE + ") + 1)");
                    command.CommandType = CommandType.Text;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            decimal dongia, soluong, khuyenmai, tyle = 0;
                            while (reader.Read())
                            {
                                VatTuModel temp = new VatTuModel();
                                temp.MaVatTu = reader["MAVATTU"].ToString();
                                temp.TenVatTu = reader["TENVATTU"].ToString();
                                decimal.TryParse(reader["GIABANLEVAT"].ToString(), out dongia);
                                temp.DonGia = dongia;
                                decimal.TryParse(reader["TONCUOIKYSL"].ToString(), out soluong);
                                temp.SoTon = soluong;
                                string HinhAnh = reader["IMAGE"].ToString();
                                string[] lstAnh = HinhAnh.Split(',');
                                temp.HinhAnh = new List<string>();
                                temp.Avatar = (byte[])reader["Avatar"];
                                string Path = reader["PATH_IMAGE"].ToString();
                                decimal.TryParse(reader["GIATRI"].ToString(), out khuyenmai);
                                temp.DonGiaKhuyenMai = khuyenmai;
                                decimal.TryParse(reader["TYLE"].ToString(), out tyle);
                                temp.TyLeKhuyeMai = tyle;
                                for (int i = 0; i < lstAnh.Length; i++)
                                {
                                    if (!string.IsNullOrEmpty(lstAnh[i]))
                                    {
                                        temp.HinhAnh.Add(Path + lstAnh[i]);
                                    }
                                }
                                lstVatTu.Add(temp);
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }

                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = @"SELECT COUNT(*) TOTALITEM FROM V_CHUONGTRINH_KHUYENMAI vt WHERE vt.UNITCODE ='" + madonvi + "' AND vt.TUNGAY >=TO_DATE(SYSDATE,'DD/MM/YY') AND vt.DENNGAY <= TO_DATE(SYSDATE,'DD/MM/YY') ";
                    cmd.CommandType = CommandType.Text;
                    OracleDataReader dataReader = cmd.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        decimal totalitem = 0;
                        while (dataReader.Read())
                        {
                            decimal.TryParse(dataReader["TOTALITEM"].ToString(), out totalitem);
                            vattu.ItemTotal = totalitem;
                            vattu.PageSize = pagesize;
                            vattu.PageNumber = pagenumber;
                        }
                    }
                }
            }
            return Ok(vattu);
        }

        /// <summary>
        /// Đăng ký khách hàng
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("RegisKhachHang")]
        public async Task<IHttpActionResult> RegisKhachHang(KhachHangModel obj)
        {
            string newID = CommonService.GET_NEW_ID("KH");
            ObjectResult dataResult = new ObjectResult();
            string data = "";
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"INSERT INTO DM_KHACHHANG (ID,MAKH,TENKH,TENKHAC,DIACHI,TINHTHANHPHO,QUANHUYEN,TRANGTHAI,DIENTHOAI,EMAIL,NGAYSINH,I_CREATE_DATE,UNITCODE)
                                            VALUES (:ID,:MAKH,:TENKH,:TENKHAC,:DIACHI,:TINH,:QUANHUYEN,:TRANGTHAI,:DIENTHOAI,:EMAIL,:NGAYSINH,:CREATEDATE,:UNITCODE)";
                    command.Parameters.Add("ID", OracleDbType.NVarchar2, 50).Value = Guid.NewGuid();
                    command.Parameters.Add("MAKH", OracleDbType.NVarchar2, 50).Value = "KH_" + obj.DienThoai;
                    command.Parameters.Add("TENKH", OracleDbType.NVarchar2, 500).Value = obj.TenKH;
                    command.Parameters.Add("TENKHAC", OracleDbType.NVarchar2, 500).Value = obj.TenKhac;
                    command.Parameters.Add("DIACHI", OracleDbType.NVarchar2, 500).Value = obj.DiaChi;
                    command.Parameters.Add("TINH", OracleDbType.NVarchar2, 50).Value = obj.TinhTP;
                    command.Parameters.Add("QUANHUYEN", OracleDbType.NVarchar2, 50).Value = obj.QuanHuyen;
                    command.Parameters.Add("TRANGTHAI", OracleDbType.Decimal).Value = 10;
                    command.Parameters.Add("DIENTHOAI", OracleDbType.NVarchar2, 50).Value = obj.DienThoai;
                    command.Parameters.Add("EMAIL", OracleDbType.NVarchar2, 100).Value = obj.Email;
                    command.Parameters.Add("NGAYSINH", OracleDbType.Date).Value = obj.NgaySinh;
                    command.Parameters.Add("CREATEDATE", OracleDbType.Date).Value = DateTime.Now;
                    command.Parameters.Add("UNITCODE", OracleDbType.NVarchar2, 50).Value = obj.MaDonVi;
                    try
                    {
                        int result = command.ExecuteNonQuery();
                        if (result > 0)
                        {
                            OracleCommand cmd = new OracleCommand();
                            cmd.Connection = connection;
                            cmd.CommandType = CommandType.Text;
                            cmd.CommandText =
                                @"INSERT INTO AU_NGUOIDUNG (ID , USERNAME, PASSWORD ,MANHANVIEN,SODIENTHOAI,TRANGTHAI,I_CREATE_DATE,UNITCODE)
                                   VALUES (:ID , :USERNAME , :PASSWORD , :MANHANVIEN , :SODIENTHOAI , :TRANGTHAI , :CREATEDATE ,:UNITCODE)";
                            cmd.Parameters.Add("ID", OracleDbType.NVarchar2, 50).Value = Guid.NewGuid();
                            cmd.Parameters.Add("USERNAME", OracleDbType.NVarchar2, 50).Value = obj.DienThoai;
                            cmd.Parameters.Add("PASSWORD", OracleDbType.NVarchar2, 100).Value = CommonService.MD5Hash(obj.MatKhau);
                            cmd.Parameters.Add("MANHANVIEN", OracleDbType.NVarchar2, 50).Value = "KH_" + obj.DienThoai;
                            cmd.Parameters.Add("SODIENTHOAI", OracleDbType.NVarchar2, 50).Value = obj.DienThoai;
                            cmd.Parameters.Add("TRANGTHAI", OracleDbType.Decimal).Value = 10;
                            cmd.Parameters.Add("CREATEDATE", OracleDbType.Date).Value = DateTime.Now;
                            cmd.Parameters.Add("UNITCODE", OracleDbType.NVarchar2, 50).Value = obj.MaDonVi;
                            result = cmd.ExecuteNonQuery();
                            if (result > 0)
                            {
                                data = "Thêm mới thành công ";
                                dataResult.Message = data;
                                dataResult.Result = true;
                            }
                        }
                        else
                        {
                            data = " Thêm mới thất bại vui lòng kiểm tra lại !";
                            dataResult.Message = data;
                            dataResult.Result = false;
                        }
                    }
                    catch (Exception ex)
                    {
                        data = " Thêm mới thất bại vui lòng kiểm tra lại !";
                        dataResult.Message = data;
                        dataResult.Result = false;
                    }
                }
            }

            return Ok(dataResult);
        }

        /// <summary>
        /// Đăng nhập
        /// </summary>
        /// <param name="username"></param>
        /// <param name="pass"></param>
        /// <param name="donvi"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> Login(string username, string pass, string donvi)
        {
            ObjectResult dataResult = new ObjectResult();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    string password = CommonService.MD5Hash(pass);
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM AU_NGUOIDUNG WHERE USERNAME = '" + username + "' AND PASSWORD='" + password + "' AND UNITCODE ='" + donvi + "'";
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                dataResult.Result = true;
                                dataResult.Message = "Đăng nhập thành công !";
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        dataResult.Result = false;
                        dataResult.Message = "Đăng nhập thất bại!";
                    }
                }
            }
            return Ok(dataResult);
        }

        /// <summary>
        /// Lấy thông tin user theo số điện thoại
        /// </summary>
        /// <param name="sodienthoai"></param>
        /// <param name="unitcode2"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetUserByPhone(string sodienthoai, string unitcode2)
        {
            KhachHangModel dataResult = new KhachHangModel();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM DM_KHACHHANG WHERE DIENTHOAI= :dienthoai AND UNITCODE=:unitcode";
                    command.Parameters.Add("dienthoai", OracleDbType.NVarchar2, 50).Value = sodienthoai;
                    command.Parameters.Add("unitcode", OracleDbType.NVarchar2, 50).Value = unitcode2;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                dataResult.TenKH = reader["TENKH"].ToString();
                                dataResult.DienThoai = reader["DIENTHOAI"].ToString();
                                dataResult.DiaChi = reader["DIACHI"].ToString();
                                dataResult.MaDonVi = reader["UNITCODE"].ToString();
                                dataResult.MaKH = reader["MAKH"].ToString();
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            return Ok(dataResult);
        }

        /// <summary>
        /// Thanh toán
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("CheckOut")]
        public async Task<IHttpActionResult> CheckOut(ObjectCartModel data)
        {
            ObjectResult dataResult = new ObjectResult();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    DateTime time = DateTime.Now;
                    string soPhieu = data.SDTNN + "_" + time.Minute + time.Hour + time.Day;
                    string soPhieuPK = data.SDTNN + "_" + time.Minute + time.Hour + time.Day + "_" + data.UNITCODE;
                    OracleTransaction txn = connection.BeginTransaction(IsolationLevel.ReadCommitted);
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"INSERT INTO NVDATHANG (ID,SOPHIEU,MAHD,SOPHIEUPK,LOAI,NGAY,MAKHACHHANG,THANHTIENSAUVAT,TRANGTHAI,TENNN,SDTNN,DIACHINN,TRANGTHAITT,ISBANBUON,I_CREATE_DATE,UNITCODE,SOPHIEUCON)
                                            VALUES (:ID,:SOPHIEU,:MAHD,:SOPHIEUPK,:LOAI,:NGAY,:MAKHACHHANG,:THANHTIENSAUVAT,:TRANGTHAI,:TENNN,:SDTNN,:DIACHINN,:TRANGTHAITT,:ISBANBUON,:I_CREATE_DATE,:UNITCODE,:SOPHIEUCON)";
                    command.Parameters.Add("ID", OracleDbType.NVarchar2, 50).Value = Guid.NewGuid();
                    command.Parameters.Add("SOPHIEU", OracleDbType.NVarchar2, 50).Value = soPhieu;
                    command.Parameters.Add("MAHD", OracleDbType.NVarchar2, 50).Value = soPhieu;
                    command.Parameters.Add("SOPHIEUPK", OracleDbType.NVarchar2, 50).Value = soPhieuPK;
                    command.Parameters.Add("LOAI", OracleDbType.Decimal).Value = 2;
                    command.Parameters.Add("NGAY", OracleDbType.Date).Value = time;
                    command.Parameters.Add("MAKHACHHANG", OracleDbType.NVarchar2, 50).Value = "KH_" + data.SDTNN;
                    command.Parameters.Add("THANHTIENSAUVAT", OracleDbType.NVarchar2, 50).Value = data.THANHTIENSAUVAT;
                    command.Parameters.Add("TRANGTHAI", OracleDbType.Decimal).Value = 1; //Trạng thái đơn hàng mới
                    command.Parameters.Add("TENNN", OracleDbType.NVarchar2, 50).Value = data.TENNN;
                    command.Parameters.Add("SDTNN", OracleDbType.NVarchar2, 50).Value = data.SDTNN;
                    command.Parameters.Add("DIACHINN", OracleDbType.NVarchar2, 50).Value = data.DIACHINN;
                    command.Parameters.Add("TRANGTHAITT", OracleDbType.Decimal).Value = 0;
                    command.Parameters.Add("ISBANBUON", OracleDbType.Decimal).Value = 0;
                    command.Parameters.Add("I_CREATE_DATE", OracleDbType.Date).Value = time;
                    command.Parameters.Add("UNITCODE", OracleDbType.NVarchar2, 50).Value = data.UNITCODE;
                    command.Parameters.Add("SOPHIEUCON", OracleDbType.Decimal).Value = data.SOPHIEUCON;
                    try
                    {
                        int result = command.ExecuteNonQuery();
                        if (result > 0)
                        {
                            int itemp = 0, itemp2 = 0;
                            data.Details.ForEach(x =>
                            {
                                OracleCommand cmd = new OracleCommand();
                                cmd.Connection = connection;
                                cmd.CommandType = CommandType.Text;
                                itemp2++;
                                cmd.CommandText = @"INSERT INTO NVDATHANGCHITIET (ID,SOPHIEU,SOPHIEUPK,MAHD,MAHANG,TENHANG,SOLUONG,DONGIA,THANHTIEN)
                                                    VALUES (:ID,:SOPHIEU,:SOPHIEUPK,:MAHD,:MAHANG,:TENHANG,:SOLUONG,:DONGIA,:THANHTIEN)";
                                cmd.Parameters.Add("ID", OracleDbType.NVarchar2, 50).Value = Guid.NewGuid();
                                cmd.Parameters.Add("SOPHIEU", OracleDbType.NVarchar2, 50).Value = soPhieu;
                                cmd.Parameters.Add("SOPHIEUPK", OracleDbType.NVarchar2, 50).Value = soPhieuPK;
                                cmd.Parameters.Add("MAHD", OracleDbType.NVarchar2, 50).Value = soPhieu;
                                cmd.Parameters.Add("MAHANG", OracleDbType.NVarchar2, 50).Value = x.MAHANG;
                                cmd.Parameters.Add("TENHANG", OracleDbType.NVarchar2, 50).Value = x.TENHANG;
                                cmd.Parameters.Add("SOLUONG", OracleDbType.Decimal).Value = x.SOLUONG;
                                cmd.Parameters.Add("DONGIA", OracleDbType.Decimal).Value = x.DONGIA;
                                cmd.Parameters.Add("THANHTIEN", OracleDbType.Decimal).Value = x.DONGIA * x.SOLUONG;
                                int resultDetail = cmd.ExecuteNonQuery();
                                if (resultDetail > 0)
                                {
                                    itemp++;
                                }
                            });
                            if (itemp == itemp2)
                            {
                                dataResult.Message = "Thanh toán thành công !";
                                dataResult.Result = true;
                                txn.Commit();
                            }
                            else
                            {
                                txn.Rollback();
                                dataResult.Message = "Thanh toán thất bại vui lòng kiểm tra lại !";
                                dataResult.Result = false;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        dataResult.Message = "Thanh toán thất bại vui lòng kiểm tra lại !";
                        dataResult.Result = false;
                        txn.Rollback();
                    }
                }
            }
            return Ok(dataResult);
        }

        /// <summary>
        /// Tìm kiếm mặt hàng theo key search
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SearchByCode")]
        public async Task<IHttpActionResult> SearchByCode(RequestObjectSearch data)
        {
            List<VatTuModel> lstVatTu = new List<VatTuModel>();
            VatTuDTO vattu = new VatTuDTO(lstVatTu);
            string table_XNT = CommonService.GET_TABLE_NAME_NGAYHACHTOAN_CSDL_ORACLE();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    decimal P_PAGENUMBER = data.pagenumber;
                    decimal P_PAGESIZE = data.pagesize;
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.InitialLONGFetchSize = 1000;
                    command.CommandText = string.Format(@"SELECT * FROM ( SELECT a.*, rownum r__ FROM ( SELECT vt.MAVATTU , vt.TENVATTU , vt.GIABANLEVAT ,vt.Avatar, vt.PATH_IMAGE , vt.IMAGE , xnt.TONCUOIKYSL  FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU  WHERE vt.MADONVI ='DV1-CH1' AND xnt.MAKHO ='DV1-CH1-KBL'  AND xnt.TONCUOIKYSL > 0 AND vt.TENVATTU  LIKE '%" + data.keysearch + "%' OR vt.MAVATTU LIKE '%" + data.keysearch + "%' ORDER BY " + data.order + " " + data.sorttype + " ) a WHERE rownum < ((" + P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " + P_PAGESIZE + ") + 1)");
                    command.CommandType = CommandType.Text;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            decimal dongia, soluong = 0;
                            while (reader.Read())
                            {
                                VatTuModel temp = new VatTuModel();
                                temp.MaVatTu = reader["MAVATTU"].ToString();
                                temp.TenVatTu = reader["TENVATTU"].ToString();
                                decimal.TryParse(reader["GIABANLEVAT"].ToString(), out dongia);
                                temp.DonGia = dongia;
                                decimal.TryParse(reader["TONCUOIKYSL"].ToString(), out soluong);
                                temp.SoTon = soluong;
                                try
                                {
                                    temp.Avatar = (byte[])reader["Avatar"];
                                }
                                catch (Exception)
                                {
                                }
                                string HinhAnh = reader["IMAGE"].ToString();
                                string[] lstAnh = HinhAnh.Split(',');
                                temp.HinhAnh = new List<string>();

                                string Path = reader["PATH_IMAGE"].ToString();
                                for (int i = 0; i < lstAnh.Length; i++)
                                {
                                    if (!string.IsNullOrEmpty(lstAnh[i]))
                                    {
                                        temp.HinhAnh.Add(Path + lstAnh[i]);
                                    }
                                }
                                lstVatTu.Add(temp);
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = connection;
                    cmd.CommandText = @"SELECT COUNT(*) TOTALITEM FROM V_VATTU_GIABAN vt WHERE vt.MADONVI ='DV1-CH1' AND  vt.TENVATTU  LIKE '%" + data.keysearch + "%' OR vt.MAVATTU LIKE '%" + data.keysearch + "%'";
                    cmd.CommandType = CommandType.Text;
                    OracleDataReader dataReader = cmd.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        decimal totalitem = 0;
                        while (dataReader.Read())
                        {
                            decimal.TryParse(dataReader["TOTALITEM"].ToString(), out totalitem);
                            vattu.ItemTotal = totalitem;
                            vattu.PageSize = data.pagesize;
                            vattu.PageNumber = data.pagenumber;
                        }
                    }
                }
            }
            return Ok(vattu);
        }

        /// <summary>
        /// Lấy danh sách các sản phẩm liên quan
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetMerchanediseRel")]
        public async Task<IHttpActionResult> GetMerchanediseRel(MerchanediseType request)
        {
            List<VatTuCungNhom> result = new List<VatTuCungNhom>();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT vt.TENVATTU,vt.MAVATTU , vt.AVATAR ,vt.GIABANLEVAT,vt.MANHOMVATTU FROM V_VATTU_GIABAN vt WHERE vt.MANHOMVATTU =:maloai AND vt.UNITCODE=:madonvi AND ROWNUM <= 10";
                    command.Parameters.Add("maloai", OracleDbType.NVarchar2, 50).Value = request.MaLoaiVatTu;
                    command.Parameters.Add("madonvi", OracleDbType.NVarchar2, 50).Value = request.UnitCode;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            decimal dg = 0;
                            while (reader.Read())
                            {
                                VatTuCungNhom data = new VatTuCungNhom();
                                data.Avatar = (byte[])reader["Avatar"];
                                data.TenVatTu = reader["TENVATTU"].ToString();
                                data.MaVatTu = reader["MAVATTU"].ToString();
                                data.MaLoaiVatTu = reader["MANHOMVATTU"].ToString();
                                decimal.TryParse(reader["GIABANLEVAT"].ToString(), out dg);
                                data.DonGia = dg;
                                result.Add(data);
                            }
                        }
                    }
                    catch (Exception ex) { }
                }
            }
            return Ok(result);
        }

        /// <summary>
        /// Lấy thông tin đơn hàng chưa nhận
        /// </summary>
        /// <returns></returns>
        public async Task<IHttpActionResult> GetAllBill(string maKhachHang)
        {
            List<DonDatHangModel> result = new List<DonDatHangModel>();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT MAHD , NOIDUNG , THANHTIENSAUVAT ,TRANGTHAI,SOPHIEUCON ,SOPHIEUCON ,NGAY FROM NVDATHANG WHERE MAKHACHHANG = :makhachhang";
                    command.Parameters.Add("makhachhang", OracleDbType.NVarchar2, 50).Value = maKhachHang;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            decimal sophieu, trangthai, ttien = 0;
                            DateTime time = new DateTime();
                            while (reader.Read())
                            {
                                DonDatHangModel item = new DonDatHangModel();
                                item.MAHD = reader["MAHD"].ToString();
                                item.NOIDUNG = reader["NOIDUNG"].ToString();
                                decimal.TryParse(reader["TRANGTHAI"].ToString(), out trangthai);
                                decimal.TryParse(reader["SOPHIEUCON"].ToString(), out sophieu);
                                decimal.TryParse(reader["THANHTIENSAUVAT"].ToString(), out ttien);
                                item.TRANGTHAI = trangthai;
                                item.SOPHIEUCON = sophieu;
                                item.THANHTIENSAUVAT = ttien;
                                DateTime.TryParse(reader["NGAY"].ToString(), out time);
                                item.NGAY = time;
                                result.Add(item);
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                        throw;
                    }

                }
            }
            return Ok(result);
        }

        /// <summary>
        /// Xóa đơn hàng
        /// </summary>
        /// <param name="madonhang"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> DeleteOrder(string madonhang)
        {
            ObjectResult dataResult = new ObjectResult();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleTransaction txn = connection.BeginTransaction(IsolationLevel.ReadCommitted);
                    OracleCommand command = new OracleCommand();
                    command.CommandText = @"DELETE NVDATHANG WHERE MAHD = :maHD";
                    command.CommandType = CommandType.Text;
                    command.Connection = connection;
                    command.Parameters.Add("maHD", OracleDbType.NVarchar2, 50).Value = madonhang;
                    try
                    {
                        int result = command.ExecuteNonQuery();
                        if (result > 0)
                        {
                            OracleCommand cmd = new OracleCommand();
                            cmd.CommandText = @"DELETE NVDATHANGCHITIET WHERE MAHD = :maHD";
                            cmd.CommandType = CommandType.Text;
                            cmd.Connection = connection;
                            cmd.Parameters.Add("maHD", OracleDbType.NVarchar2, 50).Value = madonhang;
                            int exresult = cmd.ExecuteNonQuery();
                            if (exresult > 0)
                            {
                                txn.Commit();
                                dataResult.Result = true;
                                dataResult.Message = "Xóa đơn hàng thành công !";
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        txn.Rollback();
                        dataResult.Result = false;
                        dataResult.Message = "Không xóa được đơn hàng !";
                    }
                }
            }
            return Ok(dataResult);
        }

        /// <summary>
        /// Lấy ra danh sách các thành phố trong db
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetAddressCity()
        {
            List<AddressModel.City> list = new List<AddressModel.City>();
            using (OracleConnection connection =
                new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT CITY_ID,CITY_NAME FROM DM_THANHPHO";
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                AddressModel.City city = new AddressModel.City();
                                city.City_Id = reader["CITY_ID"].ToString();
                                city.City_Name = reader["CITY_NAME"].ToString();
                                list.Add(city);
                            }
                        }
                    }
                    catch (Exception)
                    {
                    }
                }
            }
            return Ok(list);
        }

        /// <summary>
        /// Lấy ra danh sách quận huyện của thành phố/tỉnh
        /// </summary>
        /// <param name="cityid"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetDistrictsByCityId(string cityid)
        {
            List<AddressModel.Districts> list = new List<AddressModel.Districts>();
            using (OracleConnection connection =
                new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT * FROM DM_TINHHUYEN WHERE CITY_ID = :cityid";
                    command.Parameters.Add("cityid", OracleDbType.NVarchar2, 10).Value = cityid;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                AddressModel.Districts district = new AddressModel.Districts();
                                district.Districts_Id = reader["DISTRICTS_ID"].ToString();
                                district.Districts_Name = reader["DISTRICTS_NAME"].ToString();
                                list.Add(district);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            return Ok(list);
        }

        /// <summary>
        /// Lấy thông tin địa chỉ của khách hàng
        /// </summary>
        /// <param name="username"></param>
        /// <param name="madonvi"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetAddress(string sdt, string madonvi)
        {
            ResultAddress diachi = new ResultAddress();
            using (OracleConnection connection =
                new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText =
                        @"SELECT kh.DIACHI,tp.CITY_NAME,qh.DISTRICTS_NAME FROM DM_KHACHHANG kh LEFT JOIN DM_THANHPHO tp ON kh.TINHTHANHPHO = tp.CITY_ID INNER JOIN DM_TINHHUYEN qh ON kh.QUANHUYEN = qh.DISTRICTS_ID
                            WHERE kh.DIENTHOAI = :sdt AND kh.UNITCODE= :madonvi";
                    command.Parameters.Add("sdt", OracleDbType.Varchar2, 12).Value = sdt;
                    command.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = madonvi;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                diachi.Address = reader["DIACHI"].ToString();
                                diachi.City_Name = reader["CITY_NAME"].ToString();
                                diachi.Districts_Name = reader["DISTRICTS_NAME"].ToString();
                            }
                        }
                    }
                    catch (Exception) { }
                }

                return Ok(diachi);
            }
        }

        /// <summary>
        /// Lấy danh sách tin tức
        /// </summary>
        /// <param name="unitcodefornews"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetNews(string unitcodefornews , string type)
        {
            List<NewsModel> results = new List<NewsModel>();
             
            using (OracleConnection connection =
                new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    if (type != "News")
                    {
                        command.CommandText = @"SELECT t.TENLOAITINTUC,t.TIEUDE,t.TOMTAT,t.NOIDUNG,t.IMAGECOVER,t.I_CREATE_DATE FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.LOAITINTUC='" + type + "' AND t.I_STATE='isUsed' ORDER BY t.I_CREATE_DATE DESC";
                        command.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornews;
                        try
                        {
                            OracleDataReader reader = command.ExecuteReader();
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    NewsModel news = new NewsModel();
                                    news.Title = reader["TIEUDE"].ToString();
                                    news.Summary = reader["TOMTAT"].ToString();
                                    news.Content = reader["NOIDUNG"].ToString();
                                    news.Type = reader["TENLOAITINTUC"].ToString();
                                    DateTime createDate = DateTime.MinValue;
                                    DateTime.TryParse(reader["I_CREATE_DATE"].ToString(), out createDate);
                                    news.CreateDate = createDate;
                                    results.Add(news);
                                }
                            }
                        }
                        catch (Exception) { }
                    }
                    else
                    {
                        command.CommandText = @"SELECT t.ID,t.TIEUDE,t.TOMTAT,t.IMAGECOVER,t.I_CREATE_DATE FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.LOAITINTUC='" + type + "' AND t.I_STATE='isUsed' AND  rownum <= 5 ORDER BY t.I_CREATE_DATE DESC";
                        command.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornews;
                        try
                        {
                            OracleDataReader reader = command.ExecuteReader();
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    NewsModel news = new NewsModel();
                                    news.ID = reader["ID"].ToString();
                                    news.Title = reader["TIEUDE"].ToString();
                                    news.Summary = reader["TOMTAT"].ToString();
                                    DateTime createDate = DateTime.MinValue;
                                    DateTime.TryParse(reader["I_CREATE_DATE"].ToString(), out createDate);
                                    news.CreateDate = createDate;
                                    results.Add(news);
                                }
                            }
                        }
                        catch (Exception) { }
                    }
                    
                }

                return Ok(results);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetNewsPaging(decimal pagenumber, decimal pagesize, string unitcodefornews, string type)
        {
            List<NewsModel> results = new List<NewsModel>();
            NewsPaging listNews = new NewsPaging(results);
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    decimal P_PAGENUMBER = pagenumber;
                    decimal P_PAGESIZE = pagesize;
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.InitialLONGFetchSize = 1000;
                    command.CommandText = string.Format(
                        @"SELECT * FROM ( SELECT a.*, rownum r__ FROM (SELECT t.ID,t.TIEUDE,t.TOMTAT,t.IMAGECOVER,t.I_CREATE_DATE FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.LOAITINTUC='" +
                        type + "' AND t.I_STATE='isUsed' ORDER BY t.I_CREATE_DATE DESC) a WHERE rownum < ((" +
                        P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " +
                        P_PAGESIZE + ") + 1)");
                    command.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornews;
                    command.CommandType = CommandType.Text;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                NewsModel news = new NewsModel();
                                news.ID = reader["ID"].ToString();
                                news.Title = reader["TIEUDE"].ToString();
                                news.Summary = reader["TOMTAT"].ToString();
                                DateTime createDate = DateTime.MinValue;
                                DateTime.TryParse(reader["I_CREATE_DATE"].ToString(), out createDate);
                                news.CreateDate = createDate;
                                results.Add(news);
                            }
                        }
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = connection;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandText = @"SELECT COUNT(*) TOTALITEM FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.LOAITINTUC='" +
                                          type + "' AND t.I_STATE='isUsed'";
                        cmd.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornews;
                        OracleDataReader dataReader = cmd.ExecuteReader();
                        if (dataReader.HasRows)
                        {
                            decimal totalitem = 0;
                            while (dataReader.Read())
                            {
                                decimal.TryParse(dataReader["TOTALITEM"].ToString(), out totalitem);
                                listNews.ItemTotal = totalitem;
                                listNews.PageSize = pagesize;
                                listNews.PageNumber = pagenumber;
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            return Ok(listNews);
        }

        /// <summary>
        /// Hàm lấy ảnh bìa trang chính
        /// </summary>
        /// <param name="unitcodefornews"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetImageCover(string unitcodefornews)
        {
            List<NewsModel> results = new List<NewsModel>();

            using (OracleConnection connection =
                new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT t.TIEUDE,t.TENLOAITINTUC,t.NOIDUNG,t.IMAGECOVER FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.LOAITINTUC='ImgCover' AND t.I_STATE='isUsed' ORDER BY t.I_CREATE_DATE DESC";
                    command.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornews;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                NewsModel news = new NewsModel();
                                news.Title = reader["TIEUDE"].ToString();
                                news.Content = reader["NOIDUNG"].ToString();
                                news.Type = reader["TENLOAITINTUC"].ToString();
                                news.Image = (byte[])reader["IMAGECOVER"];
                                results.Add(news);
                            }
                        }
                    }
                    catch (Exception) { }
                }

                return Ok(results);
            }
        }

        /// <summary>
        /// Hàm lấy chi tiết tin tức
        /// </summary>
        /// <param name="unitcodefornews"></param>
        /// <param name="title"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetNewsDetailsById(string unitcodefornewsdetails ,string id)
        {
            NewsModel results = new NewsModel();

            using (OracleConnection connection =
                new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT t.ID,t.TENLOAITINTUC,t.TIEUDE,t.NOIDUNG,t.IMAGECOVER,t.I_CREATE_DATE,t.TAGS FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.ID=:id AND t.I_STATE='isUsed'";
                    command.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornewsdetails;
                    command.Parameters.Add("id", OracleDbType.NVarchar2, 500).Value = id;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                DateTime createDate = DateTime.MinValue;
                                DateTime.TryParse(reader["I_CREATE_DATE"].ToString(), out createDate);
                                results.CreateDate = createDate;
                                results.Title = reader["TIEUDE"].ToString();
                                results.Content = reader["NOIDUNG"].ToString();
                                results.Type = reader["TENLOAITINTUC"].ToString();
                                results.Tags = reader["TAGS"].ToString();
                                results.ID = reader["ID"].ToString();
                            }
                        }
                    }
                    catch (Exception) { }
                }

                return Ok(results);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetNewsInvolve(string unitcodefornewsdetails, string tags, string id)
        {
            List<NewsModel> results = new List<NewsModel>();
            using (OracleConnection connection =
                new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    var lstTags = tags.Split(',');
                    string filterTags = "";
                    if (lstTags.Count() > 0)
                    {
                        filterTags += " AND ";
                    }
                    for (int i = 0; i < lstTags.Count(); i++)
                    {
                        if (i == 0)
                        {
                            filterTags += "( t.TAGS like '%" + lstTags[i] + "%'";
                        }
                        else
                        {
                            
                            filterTags += "OR t.TAGS like '%" + lstTags[i] + "%'";
                        }
                        if (i == lstTags.Count() - 1)
                        {
                            filterTags += " )";
                        }
                    }
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"SELECT t.ID,t.TENLOAITINTUC,t.TIEUDE,t.TOMTAT,t.I_CREATE_DATE,t.TAGS FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.ID <> :id AND t.I_STATE='isUsed' "+ filterTags + " AND ROWNUM <= 5 ORDER BY I_CREATE_DATE";
                    command.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornewsdetails;
                    command.Parameters.Add("id", OracleDbType.NVarchar2, 500).Value = id;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                NewsModel temp = new NewsModel();
                                DateTime createDate = DateTime.MinValue;
                                DateTime.TryParse(reader["I_CREATE_DATE"].ToString(), out createDate);
                                temp.CreateDate = createDate;
                                temp.Title = reader["TIEUDE"].ToString();
                                temp.Tags = reader["TAGS"].ToString();
                                temp.ID = reader["ID"].ToString();
                                temp.Summary = reader["TOMTAT"].ToString();
                                results.Add(temp);
                            }
                        }
                    }
                    catch (Exception) { }
                }
                return Ok(results);
            }
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> GetNewsPagingByTags(decimal pagenumber, decimal pagesize, string unitcodefornews, string type , string tags)
        {
            List<NewsModel> results = new List<NewsModel>();
            NewsPaging listNews = new NewsPaging(results);
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    decimal P_PAGENUMBER = pagenumber;
                    decimal P_PAGESIZE = pagesize;
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.InitialLONGFetchSize = 1000;
                    command.CommandText = string.Format(
                        @"SELECT * FROM ( SELECT a.*, rownum r__ FROM (SELECT t.ID,t.TIEUDE,t.TOMTAT,t.IMAGECOVER,t.I_CREATE_DATE FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.LOAITINTUC='" +
                        type + "' AND t.I_STATE='isUsed' AND t.TAGS like '%"+tags+"%' ORDER BY t.I_CREATE_DATE DESC) a WHERE rownum < ((" +
                        P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " +
                        P_PAGESIZE + ") + 1)");
                    command.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornews;
                    command.CommandType = CommandType.Text;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                NewsModel news = new NewsModel();
                                news.ID = reader["ID"].ToString();
                                news.Title = reader["TIEUDE"].ToString();
                                news.Summary = reader["TOMTAT"].ToString();
                                DateTime createDate = DateTime.MinValue;
                                DateTime.TryParse(reader["I_CREATE_DATE"].ToString(), out createDate);
                                news.CreateDate = createDate;
                                results.Add(news);
                            }
                        }
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = connection;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandText = @"SELECT COUNT(*) TOTALITEM FROM DM_TINTUC t WHERE t.UNITCODE = :madonvi AND t.LOAITINTUC='" +
                                          type + "' AND t.TAGS like '%" + tags + "%' AND t.I_STATE='isUsed'";
                        cmd.Parameters.Add("madonvi", OracleDbType.Varchar2, 10).Value = unitcodefornews;
                        OracleDataReader dataReader = cmd.ExecuteReader();
                        if (dataReader.HasRows)
                        {
                            decimal totalitem = 0;
                            while (dataReader.Read())
                            {
                                decimal.TryParse(dataReader["TOTALITEM"].ToString(), out totalitem);
                                listNews.ItemTotal = totalitem;
                                listNews.PageSize = pagesize;
                                listNews.PageNumber = pagenumber;
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            return Ok(listNews);
        }

        public HttpResponseMessage Put()
        {
            return new HttpResponseMessage()
            {
                Content = new StringContent("PUT: Test message")
            };
        }
    }
}
