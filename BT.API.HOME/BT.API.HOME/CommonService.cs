using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
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
    }
}