import {VatTu} from '../_layout/home/vattumodel';

export class CartModel{
    arrVatTuSelected : Array<VatTuCart>;
    tongSoLuong : number;
    tongTien : number;
    constructor(arr : Array<VatTuCart> , soluong : number , tien : number){
        this.arrVatTuSelected = arr;
        this.tongSoLuong = soluong;
        this.tongTien=tien;
    }
}

export class VatTuCart{
    MaVatTu:string;
    SoLuong:number;
    constructor(mavattu : string , soluong:number){
        this.MaVatTu = mavattu;
        this.SoLuong = soluong;
    }
}