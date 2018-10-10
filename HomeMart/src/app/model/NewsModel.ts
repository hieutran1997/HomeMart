export class NewsModel{
    public  Title : string;
    public  Summary : string;
    public  Content : string;
    public  Type : string;
    public  Image : number[];
    public  CreateDate : Date;
    public  Tags : string;
    public   ID: string;
}

export class NewsPaging{
    public Data : Array<NewsModel>;
    public ItemTotal:number;
    public PageSize : number;
    public PageNumber : number;
}