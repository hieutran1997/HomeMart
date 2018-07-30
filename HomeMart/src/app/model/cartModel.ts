import {VatTu} from '../_layout/home/vattumodel';

export class CartModel{
    arrVatTuSelected : Array<VatTu>;
    tongSoLuong : number;
    tongTien : number;
    constructor(arr : Array<VatTu> , soluong : number , tien : number){
        this.arrVatTuSelected = arr;
        this.tongSoLuong = soluong;
        this.tongTien=tien;
    }
}