export class VatTu{
    public  TenVatTu : string;
    public  MaVatTu :string;
    public  DonGia : number;
    public  SoLuong :number;
    public  HinhAnh :Array<string>;
    public ItemTotal: number;
}

export class VatTuDTO{
    public Data : Array<VatTu>;
    public ItemTotal:number;
    public PageSize : number;
    public PageNumber : number;
}