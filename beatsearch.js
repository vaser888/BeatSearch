
window.onload = function(){
    
    if (history.state === null){
        console.log("lol");
    }
    console.log(history.state, "onload");
}

window.addEventListener('popstate', function (event) {
    console.log(history.state, "popstate");
    if (history.state != null){
        RefreshScreen();
        GetData(history.state.Type ,history.state.SearchType, history.state.UserId, history.state.CurPageNum, history.state.SearchData);
        document.getElementById(history.state.DisplayType).setAttribute("style", "display: '' ");
        document.getElementById("PageNumber-Input").value = history.state.CurPageNum + 1;    
    }
});

var JsonData;
var t;

function GetData(MapsOrSearch, Type, User_Id, Page, SearchParameters) {

    if (User_Id != ""){
        User_Id = User_Id + "/";
    }
    if (SearchParameters === "?q=") {
        alert("type something to search");
    }
    fetch("https://beatsaver.com/api/" + MapsOrSearch +"/" + Type +"/" + User_Id + Page + SearchParameters).then(function (r) { return r.json() }).then(function (JsonData0) {
        //console.log(JsonData0);
        var t;  

        var TotalMaps = JsonData0.totalDocs;
        
        if (Type == "uploader"){
            var u = JsonData0.docs[0].uploader.username;
            CreateUploaderHeader(u, TotalMaps);
        }

        if (TotalMaps>=25) {
            TotalMaps = 25;
        }
        if (Type != "detail"){
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
        }
        else {
            console.log("you got this!");
            var i = [
                JsonData0.metadata.levelAuthorName,
                JsonData0.key,
                JsonData0.uploaded,
                JsonData0.coverURL,
                JsonData0.name,
                JsonData0.uploader,
                JsonData0.metadata.duration,
                JsonData0.stats,
                JsonData0.metadata.characteristics,
                JsonData0.description,
                JsonData0.metadata.songName,
                JsonData0.metadata.songSubName,
                JsonData0.metadata.songAuthorName,
                JsonData0.metadata.levelAuthorName
            ];
            console.log(i);
            CreateSimpleSongInfo(i);
        }
        document.getElementById("NumberOfPages").innerHTML = "of " + (JsonData0.lastPage + 1);
        User_Id = User_Id.substring(0, User_Id.length - 1);

        ReplaceHistoryState(MapsOrSearch, Type, User_Id, Page,  window.history.state.DisplayType, JsonData0.lastPage,  SearchParameters);
        console.log(window.history.state);
        
    }).catch(function(){
        console.log("Error: did not load for you");
    });
}

function CreateUploaderHeader(UserName, TotalMapNumber) {
    var MapOrMaps;
    if (TotalMapNumber != 1) {
        MapOrMaps = " maps";
    }
    else {
        MapsOrMaps = " map";
    }
    document.getElementById("MapperHeader").innerHTML = UserName + " has created " + TotalMapNumber + MapOrMaps;
    document.getElementById("MapperHeader").setAttribute("class", "MapperHeader");
}

function CreateSimpleSongInfo(Data0) {
    var DivSimpleSongInfo = document.createElement("div");
    DivSimpleSongInfo.setAttribute("class", "Simple-Song-Info");
    // header Info
    var DivHeader = document.createElement("div");
    DivHeader.setAttribute("class", "Header-Info");
    var DivMapper = document.createElement("div");
    DivMapper.innerHTML = Data0[0];
    var DivKey = document.createElement("div");
    DivKey.innerHTML = Data0[1] + " 🔑";
    DivHeader.appendChild(DivMapper);
    DivHeader.appendChild(DivKey);
    DivSimpleSongInfo.appendChild(DivHeader);
    //Date Uploaded
    var DivDateUp = document.createElement("div");
    var d = Data0[2];
    var LocalDate = new Date (d);
    DivDateUp.innerHTML = LocalDate.toLocaleString("en-GB", {hour12:true, year:"numeric", month:"numeric", day:"numeric", hour:"numeric", minute:"numeric"});
    DivDateUp.setAttribute("class", "Date-Uploaded");
    DivSimpleSongInfo.appendChild(DivDateUp);
    //Cover Image
    var DivImage = document.createElement("div");
    DivImage.setAttribute("class", "Cover-Image");
    var Img0 = document.createElement("img");
    Img0.setAttribute("loading", "lazy");
    Img0.src = "https://beatsaver.com" + Data0[3];
    DivImage.appendChild(Img0);
    DivSimpleSongInfo.appendChild(DivImage);
    //Song and user
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
    A1.setAttribute("onclick", "GetUserMaps(this)");
    A1.setAttribute("Data-User-ID", Data0[5]._id);
    A1.innerHTML = Data0[5].username;
    Div0.appendChild(A1);
    DivSongAndUser.appendChild(Div0);
    DivSimpleSongInfo.appendChild(DivSongAndUser);
    //Map stats
    var DivMapStats = document.createElement("div");
    DivMapStats.setAttribute("class", "MapStats");
    var Div1 = document.createElement("div");
    var Div2 = document.createElement("div");
    var Div3 = document.createElement("div");
    var Div4 = document.createElement("div");
    var Div5 = document.createElement("div");
    var time = Data0[6];
    if (time === 0) {
        time = FindMapDuration(Data0);
    }
    var min = Math.floor(time/60);
    var sec = time % 60;
    sec = sec < 10 ? "0" + sec : sec;
    Div1.innerHTML = min + ":" + sec + " 🕔";

    Div2.innerHTML = Intl.NumberFormat('en-US', {style: 'decimal'}).format(Data0[7].upVotes) + " 👍";
    Div3.innerHTML = Intl.NumberFormat('en-US', {style: 'decimal'}).format(Data0[7].downVotes) + " 👎";
    Div4.innerHTML = Intl.NumberFormat('en-US', {style: 'decimal'}).format(Data0[7].downloads) + " 💾";
    var Rating = Data0[7].rating;
    Rating = Math.round(Rating * 10000)/100;
    Div5.innerHTML = Rating + "% 💯";
    Div1.setAttribute("title", "Beatmap Duration");
    Div2.setAttribute("title", "Upvotes");
    Div3.setAttribute("title", "Downvotes");
    Div4.setAttribute("title", "Downloads");
    Div5.setAttribute("title", "Beatmap Rating");

    DivMapStats.appendChild(Div1);
    DivMapStats.appendChild(Div2);
    DivMapStats.appendChild(Div3);
    DivMapStats.appendChild(Div4);
    DivMapStats.appendChild(Div5);
    DivSimpleSongInfo.appendChild(DivMapStats);
    //Modes
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
    //Download stuff
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

function GetNumberofPages(PageNumbers) {
    PageNumbers = document.getElementById("NumberOfPages").innerHTML;
    PageNumbers = Number(PageNumbers.substring(3))-1;
    return PageNumbers;
}

function SearchPage() {
    event.preventDefault();

    var HistoryState = history.state;

    RefreshScreen();
    document.getElementById(HistoryState.DisplayType).setAttribute("style", "display: '' ");

    var PageInputValue = document.getElementById("PageNumber-Input").value;
    PageInputValue = Number(PageInputValue)-1;
    var NumberOfPages = GetNumberofPages();
    if (PageInputValue === NaN || PageInputValue >= NumberOfPages || PageInputValue <= 0) {
        PageInputValue = 0;
        document.getElementById("PageNumber-Input").value = 1;
    }

    GetData(HistoryState.Type ,HistoryState.SearchType, HistoryState.UserId , PageInputValue, HistoryState.SearchData);
}

function SearchInput() {
    event.preventDefault();
   
    var SearchBarInputValue = document.getElementById("Search-Bar-Input").value;
    SearchBarInputValue = "?q=" + SearchBarInputValue;
    PushHistoryState("search", "text", "", "0", "SongSearch-ListDisplay", "", SearchBarInputValue);
    RefreshScreen();
    document.getElementById(history.state.DisplayType).setAttribute("style", "display: '' ");
    GetData("search","text", "", 0, SearchBarInputValue);
    document.getElementById("PageNumber-Input").value = "1";
    window.scrollTo(0,0);
    
    console.log(SearchBarInputValue);
}

function SearchKey() {
    event.preventDefault();
    console.log("hey");
    var KeyInput = document.getElementById("Key-Search-Input").value;
    GetData("maps","detail","","",KeyInput);
    //"2365"
}

function NextPage() {
    var HistoryState = history.state;

    var NumberOfPages = GetNumberofPages();

    RefreshScreen();
    document.getElementById(HistoryState.DisplayType).setAttribute("style", "display: '' ");

    //console.log(HistoryState);
    var n = Number(HistoryState.CurPageNum) + 1;
    console.log(NumberOfPages, HistoryState.CurPageNum);
    if (NumberOfPages = null || NumberOfPages <= HistoryState.CurPageNum) {
        n = 0;
    }

    GetData(HistoryState.Type ,HistoryState.SearchType, HistoryState.UserId, n, HistoryState.SearchData);

    document.getElementById("PageNumber-Input").value = n + 1;
    ReplaceHistoryState(HistoryState.Type, HistoryState.SearchType, HistoryState.UserId, n, HistoryState.DisplayType, "", HistoryState.SearchData);
    window.scrollTo(0,0);
}

function PreviousPage() {
    var HistoryState = history.state;

    RefreshScreen();
    document.getElementById(HistoryState.DisplayType).setAttribute("style", "display: '' ");

    //console.log(s);
    var n = Number(HistoryState.CurPageNum) - 1;

    if (n <= -1){
        n = HistoryState.TotalPageNumber;
    }

    GetData(HistoryState.Type ,HistoryState.SearchType, HistoryState.UserId, n, HistoryState.SearchData);

    document.getElementById("PageNumber-Input").value = n + 1;
    ReplaceHistoryState(HistoryState.Type, HistoryState.SearchType, HistoryState.UserId, n, HistoryState.DisplayType, "", HistoryState.SearchData);
    window.scrollTo(0,0);
}


function Hot() {
    PushHistoryState("maps", "hot", "", "0", "SongSearch-ListDisplay", "", "");

    console.log(history.state);

    RefreshScreen();
    document.getElementById("SongSearch-ListDisplay").setAttribute("style", "display: '' ");
    document.getElementById("PageNumber-Input").value = "1";
    GetData("maps","hot", "", 0, "?automapper=1");
    window.scrollTo(0,0);
}

function Latest() {
    PushHistoryState("maps", "latest", "", "0", "SongSearch-ListDisplay", "", "");
    console.log(history.state);

    RefreshScreen();
    document.getElementById("SongSearch-ListDisplay").setAttribute("style", "display: '' ");
    document.getElementById("PageNumber-Input").value = "1";
    GetData("maps","latest", "", 0, "?automapper=1");
    window.scrollTo(0,0);
}

function RefreshScreen() {
    document.getElementById("SongSearch-ListDisplay").remove();
    document.getElementById("SingleSong-Info").remove(); 
    document.getElementById("MapperHeader").innerHTML = "";
    document.getElementById("MapperHeader").setAttribute("class", "");
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

function GetUserMaps(UserId) {
    event.preventDefault();
    var User_id = UserId.getAttribute("data-user-id");
    RefreshScreen();
    document.getElementById("SongSearch-ListDisplay").setAttribute("style", "display: '' ");
    GetData("maps", "uploader", User_id , 0, "");
    document.getElementById("PageNumber-Input").value = "1";
    window.scrollTo(0,0);
    
}

function ReplaceHistoryState(HistoryType,HistorySearchType, HistoryUserId, HistoryCurrentPageNumber, HistoryDisplayType, HistoryTotalPageNumber, HistorySearchData) {
    let StateObj = {Type: HistoryType, SearchType: HistorySearchType, UserId: HistoryUserId, CurPageNum: HistoryCurrentPageNumber, DisplayType: HistoryDisplayType ,TotalPageNumber: HistoryTotalPageNumber, SearchData: HistorySearchData};
    window.history.replaceState(StateObj, "", "");
}

function PushHistoryState(HistoryType,HistorySearchType, HistoryUserId, HistoryCurrentPageNumber, HistoryDisplayType, HistoryTotalPageNumber, HistorySearchData) {
    let StateObj = {Type: HistoryType, SearchType: HistorySearchType, UserId: HistoryUserId, CurPageNum: HistoryCurrentPageNumber, DisplayType: HistoryDisplayType ,TotalPageNumber: HistoryTotalPageNumber, SearchData: HistorySearchData};
    window.history.pushState(StateObj, "", "");
}

function FindMapDuration(Data1) {
    var x = Data1[8][0].difficulties;
    var arr = [x.easy, x.normal, x.hard, x.expert, x.expertPlus];
    for (j=0 ; j<=5; j++) {
        if (arr[j] != null ) {
            var x = parseInt(arr[j].duration);
            Math.floor(x);
            return x;
        } 
    }
}