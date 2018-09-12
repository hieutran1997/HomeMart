using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class AddressModel
    {
        public class City
        {
            public string City_Id { get; set; }
            public string City_Name { get; set; }
        }

        public class Districts
        {
            public string City_Id { get; set; }
            public string Districts_Id { get; set; }
            public string Districts_Name { get; set; }
        }
        public class ResultAddress
        {
            public string City_Name { get; set; }
            public string Districts_Name { get; set; }
            public string Address { get; set; }
        }
    }
}