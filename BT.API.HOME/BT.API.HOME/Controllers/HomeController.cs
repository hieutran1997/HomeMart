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
                    command.CommandText = string.Format(@"SELECT * FROM ( SELECT a.*, rownum r__ FROM ( SELECT vt.MAVATTU , vt.TENVATTU , vt.GIABANLEVAT , vt.PATH_IMAGE , vt.IMAGE , xnt.TONCUOIKYSL  FROM V_VATTU_GIABAN vt INNER JOIN " + table_XNT + " xnt ON vt.MAVATTU = xnt.MAVATTU  WHERE vt.MADONVI ='DV1-CH1' AND xnt.MAKHO ='DV1-CH1-KBL' ORDER BY vt.I_CREATE_DATE DESC ) a WHERE rownum < ((" + P_PAGENUMBER + " * " + P_PAGESIZE + ") + 1 )  )  WHERE r__ >= (((" + P_PAGENUMBER + "-1) * " + P_PAGESIZE + ") + 1)");
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
                                temp.SoLuong = soluong;
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

        //public IHttpActionResult GetAllLoaiHangHoa()
        //{
            
        //}

        public HttpResponseMessage Put()
        {
            return new HttpResponseMessage()
            {
                Content = new StringContent("PUT: Test message")
            };
        }
    }
}
