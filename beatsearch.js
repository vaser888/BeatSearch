
window.onload = function(){
    
    if (history.state === null){
        console.log("lol");
    }
}

var JsonData;
var t;

function GetData(Type, Page) {
    fetch("https://beatsaver.com/api/maps/" + Type + "/" + Page + "?automapper=1").then(function (r) { return r.json() }).then(function (JsonData0) {
        //console.log(JsonData0);
        var t;  
        var TotalMaps = JsonData0.totalDocs;
        /*if(Type ==="detail") {
            t = JsonData0;
            //console.log("detail");
        }
        */
            //console.log("hey");
        if (TotalMaps>=25) {
            TotalMaps = 25;
        }
        for (x=0; x<=TotalMaps-1; x++){
                t = JsonData0.docs[x];


            var i = [
                t.metadata.levelAuthorName,
                t.key,
                t.uploaded,
                t.coverURL,
                t.name,
                t.uploader,
                t.metadata.duration,
                t.stats,
                t.metadata.characteristics,
                t.downloadURL
            ];
            var BotTest = i[0];
            if (BotTest === "Beat Sage") {
            }
            else {
                //console.log(i, BotTest);
                CreateSimpleSongInfo(i);
            }
        }
        document.getElementById("NumberOfPages").innerHTML = "of " + (JsonData0.lastPage + 1);
        var p = window.history.state;
        let StateObj = {SearchType: Type, CurPageNum: Page, DisplayType: p.DisplayType ,TotalPageNumber: JsonData0.lastPage};
        window.history.replaceState(StateObj, "", "");
        console.log(window.history.state);
    }).catch(function(){

    });
}


function GrabSimpleData() {
    var i = GetData("hot", 0);
    var t = i.docs[0].metadata;
    var h = t.difficulties.easy;
    console.log(i,h);
}

function GetHotData(PageNumber) {
    var z = GetData("hot", PageNumber);
    var y = z.docs[0].metadata;
    var a = y.characteristics[0].difficulties;
    console.log(a);
}

function CreateSimpleSongInfo(Data0) {
    var DivSimpleSongInfo = document.createElement("div");
    DivSimpleSongInfo.setAttribute("class", "Simple-Song-Info");

    var DivHeader = document.createElement("div");
    DivHeader.setAttribute("class", "Header-Info");
    var DivMapper = document.createElement("div");
    DivMapper.innerHTML = Data0[0];
    var DivKey = document.createElement("div");
    DivKey.innerHTML = Data0[1] + " 🔑";
    DivHeader.appendChild(DivMapper);
    DivHeader.appendChild(DivKey);
    DivSimpleSongInfo.appendChild(DivHeader);

    var DivDateUp = document.createElement("div");
    var d = Data0[2];
    var LocalDate = new Date (d);
    DivDateUp.innerHTML = LocalDate.toLocaleString("en-GB", {hour12:true, year:"numeric", month:"numeric", day:"numeric", hour:"numeric", minute:"numeric"});
    DivDateUp.setAttribute("class", "Date-Uploaded");
    DivSimpleSongInfo.appendChild(DivDateUp);

    var DivImage = document.createElement("div");
    DivImage.setAttribute("class", "Cover-Image");
    var Img0 = document.createElement("img");
    Img0.src = "https://beatsaver.com" + Data0[3];
    DivImage.appendChild(Img0);
    DivSimpleSongInfo.appendChild(DivImage);

    var DivSongAndUser = document.createElement("div");
    DivSongAndUser.setAttribute("class", "SongAndUser-Info");
    var A0 = document.createElement("a");
    A0.setAttribute("href", "javascript:void(0)");
    A0.setAttribute("style","font-size:21px");
    A0.innerHTML = Data0[4];
    DivSongAndUser.appendChild(A0);
    var Div0 = document.createElement("div");
    Div0.innerHTML = "Uploaded by ";
    var A1 = document.createElement("a");
    A1.setAttribute("href", "javascript:void(0)");
    A1.innerHTML = Data0[5].username;
    Div0.appendChild(A1);
    DivSongAndUser.appendChild(Div0);
    DivSimpleSongInfo.appendChild(DivSongAndUser);

    var DivMapStats = document.createElement("div");
    DivMapStats.setAttribute("class", "MapStats");
    var Div1 = document.createElement("div");
    var Div2 = document.createElement("div");
    var Div3 = document.createElement("div");
    var Div4 = document.createElement("div");
    var Div5 = document.createElement("div");
    var time = Data0[6];
    var min = Math.floor(time/60);
    var sec = time % 60;
    sec = sec < 10 ? "0" + sec : sec;
    Div1.innerHTML = min + ":" + sec + " 🕔";
    Div2.innerHTML = Data0[7].upVotes + " 👍";
    Div3.innerHTML = Data0[7].downVotes + " 👎";
    Div4.innerHTML = Data0[7].downloads + " 💾";
    var Rating = Data0[7].rating;
    Rating = Math.round(Rating * 10000)/100;
    Div5.innerHTML = Rating + "% 💯";
    DivMapStats.appendChild(Div1);
    DivMapStats.appendChild(Div2);
    DivMapStats.appendChild(Div3);
    DivMapStats.appendChild(Div4);
    DivMapStats.appendChild(Div5);
    DivSimpleSongInfo.appendChild(DivMapStats);

    var p = Data0[8].length;
    for (i=0; i<=p-1; i++){
        var DivModes = document.createElement("div");
        DivModes.setAttribute("class", "Modes");
        var DivStandard = document.createElement("div");
        DivStandard.setAttribute("class", "Standard");
        var DivModeTitle = document.createElement("div");
        DivModeTitle.innerHTML = Data0[8][i].name;
        DivModeTitle.setAttribute("class", "Mode-Title");
        var DivDifs = document.createElement("div");
        DivDifs.setAttribute("class", "Difs");

        if (Data0[8][i].difficulties.easy != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "Easy");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Easy";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data0[8][i].difficulties.easy.notes;
            var Nps = Math.round((NotesNumber/time)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        if (Data0[8][i].difficulties.normal != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "Normal");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Normal";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data0[8][i].difficulties.normal.notes;
            var Nps = Math.round((NotesNumber/time)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        if (Data0[8][i].difficulties.hard != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "Hard");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Hard";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data0[8][i].difficulties.hard.notes;
            var Nps = Math.round((NotesNumber/time)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        if (Data0[8][i].difficulties.expert != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "Expert");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Expert";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data0[8][i].difficulties.expert.notes;
            var Nps = Math.round((NotesNumber/time)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        if (Data0[8][i].difficulties.expertPlus != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "ExpertPlus");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "expertPlus";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data0[8][i].difficulties.expertPlus.notes;
            var Nps = Math.round((NotesNumber/time)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        DivStandard.appendChild(DivModeTitle);
        DivStandard.appendChild(DivDifs);
        DivModes.appendChild(DivStandard);
        DivSimpleSongInfo.appendChild(DivModes);
    }
    
    var DivDownloadStuff = document.createElement("div");
    DivDownloadStuff.setAttribute("class", "Download-Stuff");
    var A2 = document.createElement("a");
    A2.innerHTML = "Download";
    var Dl = "https://beatsaver.com" + Data0[9];
    A2.setAttribute("href", Dl);
    var A3 = document.createElement("a");
    A3.innerHTML = "OneClick™";
    var Oc = "beatsaver://" + Data0[1];
    A3.setAttribute("href", Oc);
    DivDownloadStuff.appendChild(A2);
    DivDownloadStuff.appendChild(A3);
    DivSimpleSongInfo.appendChild(DivDownloadStuff);

    //console.log(p);

    document.getElementById("SongSearch-ListDisplay").appendChild(DivSimpleSongInfo);
}

var idValue;

document.getElementById("PageNumber-Input").addEventListener("input", (event)=> {NoLettersHere("PageNumber-Input", "Number"); });
document.getElementById("Key-Search-Input").addEventListener("input", (event)=> {NoLettersHere("Key-Search-Input", "Hex"); });

function NoLettersHere(id, setting) {
    if (setting === "Number"){
        var numCheck = /[0-9]+$/;
    }
    if (setting === "Hex"){
        var numCheck = /[0-9,a-f, A-F]+$/;
    }

    if (document.getElementById(id).value.match(numCheck)) {
        if (setting === 1){
        }
    }
    else{
        var t = document.getElementById(id).value;
        document.getElementById(id).value = t.substring(0, t.length - 1);
    }
}

function SearchPage() {
    event.preventDefault();
    console.log("hello");
}

function SearchInput() {
    event.preventDefault();
    console.log("yo");
}

function SearchKey() {
    event.preventDefault();
    console.log("hey");
}

function NextPage() {

    var s = history.state;

    RefreshScreen();
    document.getElementById(s.DisplayType).setAttribute("style", "display: '' ");

    console.log(s);
    var n = Number(s.CurPageNum) + 1;

    if (s.TotalPageNumber = null) {
        n = 0;
    }

    GetData(s.SearchType, n);

    document.getElementById("PageNumber-Input").value = n + 1;
    let StateObj = {SearchType: s.SearchType, CurPageNum: n, DisplayType: s.DisplayType};
    window.history.replaceState(StateObj, "", "");
    window.scrollTo(0,0);
}

function PreviousPage() {

    var s = history.state;

    RefreshScreen();
    document.getElementById(s.DisplayType).setAttribute("style", "display: '' ");

    //console.log(s);
    var n = Number(s.CurPageNum) - 1;

    if (n <= -1){
        n = s.TotalPageNumber;
    }

    GetData(s.SearchType, n);

    document.getElementById("PageNumber-Input").value = n + 1;
    let StateObj = {SearchType: s.SearchType, CurPageNum: n, DisplayType: s.DisplayType};
    window.history.replaceState(StateObj, "", "");
    window.scrollTo(0,0);
}


function Hot() {
    let StateObj = {SearchType: "hot", CurPageNum: "0", DisplayType: "SongSearch-ListDisplay"}
    window.history.pushState(StateObj, "", "");
    console.log(history.state);

    RefreshScreen();
    document.getElementById("SongSearch-ListDisplay").setAttribute("style", "display: '' ");
    document.getElementById("PageNumber-Input").value = "1";
    GetData("hot", 0);
    window.scrollTo(0,0);
}

function Latest() {
    let StateObj = {SearchType: "latest", page: "0", DisplayType: "SongSearch-ListDisplay"}
    window.history.pushState(StateObj, "", "");
    console.log(history.state);

    RefreshScreen();
    document.getElementById("SongSearch-ListDisplay").setAttribute("style", "display: '' ");
    document.getElementById("PageNumber-Input").value = "1";
    GetData("latest", 0);
    window.scrollTo(0,0);
}

function RefreshScreen() {
    document.getElementById("SongSearch-ListDisplay").remove();
    document.getElementById("SingleSong-Info").remove();
    var SongSearchListDisplay = document.createElement("div");
    SongSearchListDisplay.setAttribute("id", "SongSearch-ListDisplay");
    SongSearchListDisplay.setAttribute("class", "SongSearch-ListDisplay");
    SongSearchListDisplay.setAttribute("style", "display: none");
    document.getElementById("DisplayArea").appendChild(SongSearchListDisplay);
    var SingleSongInfo = document.createElement("div");
    SingleSongInfo.setAttribute("id", "SingleSong-Info");
    SingleSongInfo.setAttribute("class", "SingleSong-Info");
    SingleSongInfo.setAttribute("style", "display: none");
    document.getElementById("DisplayArea").appendChild(SingleSongInfo);
}