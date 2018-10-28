export class ObjectCartModel
{
    public  NGAY: string;
    public  MAKHACHHANG :string;
    public  THANHTIENSAUVAT :number;
    public  TENNN :string;
    public  SDTNN :string;
    public  DIACHINN :string;
    public  UNITCODE :string;
    public  SOPHIEUCON :number;
    public  SOLUONG : number;
    public  Details :Array<DetailsCart>;
    public  TYPECUSTOMER :string;
    constructor( dataDetail:Array<DetailsCart>){
        this.Details = dataDetail;
    }
}

export class DetailsCart
{
    public  MAHANG :string;
    public  TENHANG :string
    public  SOLUONG :number;
    public  DONGIA :number;
    public  SOLUONGTON :number;
    public  SOLUONGLE :number;
    public  DONGIADEXUAT :number;
}