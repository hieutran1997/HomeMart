export class VatTu{
    public  TenVatTu : string;
    public  MaVatTu :string;
    public  DonGia : number;
    public  SoTon :number;
    public SoLuong : number;
    public  HinhAnh :Array<string>;
    public ItemTotal: number;
    public Avartar : Array<number>;
    public selectFavorite : number;
    public DonGiaKhuyenMai :number;
    public TyLeKhuyeMai : number;
}

export class VatTuDTO{
    public Data : Array<VatTu>;
    public ItemTotal:number;
    public PageSize : number;
    public PageNumber : number;
}

export class VatTuDetail{
    public  TenVatTu : string;
    public  MaVatTu :string;
    public  DonGia : number;
    public  SoTon :number;
    public  HinhAnhs :Array<string>;
    public ItemTotal: number;
    public Avartar : Array<number>;
    public selectFavorite : number;
    public  MoTa:string;
    public  NhaCungCap:string;
    public Size : Array<string>;
    public  MaDonVi:string;
    constructor(){
        this.TenVatTu = "";
        this.MaVatTu = "";
        this.DonGia = 0;
        this.SoTon = 0;
        this.Avartar = null;
    }
}