using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace BT.API.HOME
{
    public class CommonService
    {
        public static string GET_TABLE_NAME_NGAYHACHTOAN_CSDL_ORACLE()
        {
            string result = string.Empty;
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    try
                    {
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = connection;
                        cmd.CommandText = string.Format(@"SELECT KY,NAM FROM (SELECT MAX(KY) AS KY,NAM FROM DM_KYKETOAN WHERE UNITCODE = 'DV1-CH1' AND TRANGTHAI = 10 AND NAM = (SELECT MAX(NAM) FROM DM_KYKETOAN WHERE UNITCODE = 'DV1-CH1') GROUP BY KY,NAM ORDER BY KY DESC) WHERE ROWNUM = 1");
                        OracleDataReader dataReader = cmd.ExecuteReader();
                        if (dataReader.HasRows)
                        {
                            string KY = string.Empty;
                            string NAM = string.Empty;
                            while (dataReader.Read())
                            {
                                KY = dataReader["KY"].ToString();
                                NAM = dataReader["NAM"].ToString();
                            }
                            result = ("XNT_" + NAM + "_KY_" + KY).ToUpper().Trim();
                        }
                    }
                    catch (Exception ex)
                    {
                       
                    }
                    finally
                    {
                        connection.Close();
                        connection.Dispose();
                    }
                }
                else
                {
                }
            }
            return result;
        }
        public static string GET_NEW_ID(string model)
        {
            string result = string.Empty;
            decimal id = 0;
            using (OracleConnection connection = new OracleConnection(ConfigurationManager.ConnectionStrings["HomeConnection"].ConnectionString))
            {
                connection.Open();
                if (connection.State == ConnectionState.Open)
                {
                    try
                    {
                        string sql = string.Format(@"SELECT * FROM MD_ID_BUILDER WHERE TYPE = '" + model + "' AND UNITCODE = 'DV1'");
                        OracleDataAdapter adapter = new OracleDataAdapter(sql,connection);
                        DataTable temp = new DataTable();
                        adapter.Fill(temp);
                        decimal.TryParse(result, out id);
                        id += 1;
                        int length = id.ToString().Length;
                        switch (length)
                        {
                            case 1:
                                result = "00000" + id;
                                break;
                            case 2:
                                result = "0000" + id;
                                break;
                            case 3:
                                result = "000" + id;
                                break;
                            case 4:
                                result = "00" + id;
                                break;
                            case 5:
                                result = "0" + id;
                                break;
                            case 6:
                                result = "" + id;
                                break;
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    finally
                    {
                        connection.Close();
                        connection.Dispose();
                    }
                }
                else
                {
                }
            }
            return result;
        }

        public static string MD5Hash(string input)
        {
            StringBuilder hash = new StringBuilder();
            MD5CryptoServiceProvider md5provider = new MD5CryptoServiceProvider();
            byte[] bytes = md5provider.ComputeHash(new UTF8Encoding().GetBytes(input));

            for (int i = 0; i < bytes.Length; i++)
            {
                hash.Append(bytes[i].ToString("x2"));
            }
            return hash.ToString();
        }
    }
}