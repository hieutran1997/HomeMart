using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BT.API.HOME.Models
{
    public class ObjectResult<T>
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public bool Result { get; set; }
    }
}