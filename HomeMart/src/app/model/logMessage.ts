export class logMessage{
    public Room:String;
    public SendBy:String;
    public DateTime:String;
    public Time:String;
    public ContentMessage:String;
    public AppId:String;
    public Receive:String;
    public Email:String ;
    public Name :String;
    constructor(room:String , sendBy:String , dateTime:String , time:String , contentMessge:String , appId :String , receive:String , email:String , name:String){
        this.Room = room;
        this.SendBy = sendBy;
        this.DateTime = dateTime;
        this.Time = time;
        this.ContentMessage = contentMessge;
        this.AppId = appId;
        this.Receive = receive;
        this.Email = email;
        this.Name = name;
    }
}