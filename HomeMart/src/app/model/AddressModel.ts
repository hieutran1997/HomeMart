export class City{
    public City_Id: string;
    public City_Name:string;
}

export class Districts{
    public  City_Id : string;
    public  Districts_Id : string;
    public  Districts_Name :string;
}

export class AddressModel{
    public  City_Name : string;
    public  Districts_Name : string;
    public  Address :string;
}