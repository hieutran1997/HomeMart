using System;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using System.Data;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;
using BT.API.HOME.Models;

namespace BT.API.HOME.Controllers
{
    public class HomeController : ApiController
    {
        public IHttpActionResult GetListMerchanedise(decimal pagenumber , decimal pagesize)
        {
            List<VatTuModel> lstVatTu = new List<VatTuModel>();
            VatTuDTO vattu = new VatTuDTO(lstVatTu);
            string table_XNT = CommonService.GET_TABLE_NAME_NGAYHACHTOAN_CSDL_ORACLE();
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if(connection.State == ConnectionState.Open)
                {
                    decimal P_PAGENUMBER = pagenumber;
                    decimal P_PAGESIZE = pagesize;
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.InitialLONGFetchSize = 1000;
                    command.CommandText = string.Format(@"SELECT * FROM ( SELECT a.*, rownum r__ FROM ( SELECT vt.MAVATTU , vt.TENVATTU , vt.GIABANLEVAT ,vt.Avatar, vt.PATH_IMAGE , vt.IMAGE , xnt.TONCUOIKYSL  FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU  WHERE vt.MADONVI ='DV1-CH1' AND xnt.MAKHO ='DV1-CH1-KBL' ORDER BY vt.I_CREATE_DATE DESC ) a WHERE rownum < ((" + P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " + P_PAGESIZE + ") + 1)");
                    command.CommandType = CommandType.Text;
                    try
                    {
                        OracleDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            decimal dongia ,soluong = 0;
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
                    cmd.CommandText = @"SELECT COUNT(*) TOTALITEM FROM V_VATTU_GIABAN vt WHERE vt.MADONVI ='DV1-CH1'";
                    cmd.CommandType = CommandType.Text;
                    OracleDataReader dataReader = cmd.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        decimal  totalitem = 0;
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

        public IHttpActionResult GetListMerchanediseByCategory(decimal pagenumber, decimal pagesize,string merchanedisetype)
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
                    command.CommandText = string.Format(@"SELECT * FROM ( SELECT a.*, rownum r__ FROM ( SELECT vt.MAVATTU , vt.TENVATTU , vt.GIABANLEVAT ,vt.Avatar, vt.PATH_IMAGE , vt.IMAGE , xnt.TONCUOIKYSL  FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU  WHERE vt.MADONVI ='DV1-CH1' AND xnt.MAKHO ='DV1-CH1-KBL' AND vt.MANHOMVATTU='" + merchanedisetype + "' OR vt.MALOAIVATTU = '"+ merchanedisetype + "' ORDER BY vt.I_CREATE_DATE DESC ) a WHERE rownum < ((" + P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " + P_PAGESIZE + ") + 1)");
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
                                temp.Avatar = (byte[])reader["Avatar"];
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
                    cmd.CommandText = @"SELECT COUNT(*) TOTALITEM FROM V_VATTU_GIABAN vt WHERE vt.MADONVI ='DV1-CH1' AND vt.MANHOMVATTU='" + merchanedisetype + "' OR vt.MALOAIVATTU = '" + merchanedisetype + "'";
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

        public IHttpActionResult GetDetailMerchanedise(string mavattu , string madonvi)
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
                    cmd.CommandText = @"SELECT vt.MAVATTU , vt.TENVATTU,vt.MASIZE ,vt.TITLE ,vt.MADONVI, vt.GIABANLEVAT,vt.TENNHACUNGCAP ,vt.Avatar, vt.PATH_IMAGE , vt.IMAGE , xnt.TONCUOIKYSL  FROM V_VATTU_GIABAN vt LEFT JOIN " + table_XNT+" xnt ON vt.MAVATTU = xnt.MAVATTU WHERE vt.MADONVI ='"+ madonvi + "' AND xnt.MAKHO ='DV1-CH1-KBL' AND vt.MAVATTU = :mavattu";
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
                    }catch(Exception ex) { }
                }
            }
            return Ok(result);
        }

        public IHttpActionResult GetListMerchanediseType(string madonvi)
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
                    command.Parameters.Add("madonvi", OracleDbType.NVarchar2,10).Value = madonvi;
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

        public IHttpActionResult GetAllGroupMerchanedise(string unitcode)
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

        public IHttpActionResult GetMerchanediseByCode(string mavattuselect,string madonvi)
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
                                decimal dongia= 0;
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

        public HttpResponseMessage Put()
        {
            return new HttpResponseMessage()
            {
                Content = new StringContent("PUT: Test message")
            };
        }
    }
}
