import {LoaiVatTu} from '../model/LoaiVatTu';
import {NhomVatTu} from '../model/nhomVatTu';

export class sideBarShow{
    public MaLoaiVatTu : string;
    public TenLoaiVatTu : string;
    public ListNhomVatTu : Array<NhomVatTu>;
    constructor(){
        this.MaLoaiVatTu = '';
        this.TenLoaiVatTu = '';
        this.ListNhomVatTu = [];
    }
}