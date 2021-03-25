
window.onload = function(){
    
    if (history.state === null){
        console.log("no history found");
        Hot();
    }
    else {
        RefreshScreen();
        document.getElementById("Footer-Nav").setAttribute("style", history.state.NavRam);
        GetData(history.state.Type ,history.state.SearchType, history.state.UserId, history.state.CurPageNum, history.state.SearchData);
        document.getElementById(history.state.DisplayType).setAttribute("style", "display:''");

        document.getElementById("PageNumber-Input").value = history.state.CurPageNum + 1; 
    }
    //console.log("onload", history.state);
}

window.addEventListener('popstate', function (event) {
    //console.log(history.state, "popstate");
    if (history.state != null){
        RefreshScreen();
        document.getElementById("Footer-Nav").setAttribute("style", history.state.NavRam);
        GetData(history.state.Type ,history.state.SearchType, history.state.UserId, history.state.CurPageNum, history.state.SearchData);
        document.getElementById(history.state.DisplayType).setAttribute("style", "display:''");

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
                JsonData0.metadata.songAuthorName,
                JsonData0.metadata.songSubName,
                JsonData0.metadata.levelAuthorName
            ];
            //console.log(i);
            CreateSingleSongInfo(i);
        }
        document.getElementById("NumberOfPages").innerHTML = "of " + (JsonData0.lastPage + 1);
        User_Id = User_Id.substring(0, User_Id.length - 1);

        ReplaceHistoryState(MapsOrSearch, Type, User_Id, Page,  window.history.state.DisplayType, JsonData0.lastPage,  SearchParameters, window.history.state.NavRam);
        //console.log("history state",window.history.state);
        
    }).catch(function(){
        console.log("Error: did not load for you");
        alert("Could not load page, try reloading the page");
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
    var DivHeader = GenorateHeaderInfo(Data0);
    DivSimpleSongInfo.appendChild(DivHeader);
    //Date Uploaded
    var DivDateUp = GenorateDateUploaded(Data0, " ", "en-GB");
    DivSimpleSongInfo.appendChild(DivDateUp);
    //Cover Image
    var DivImage = GenorateCoverImage(Data0);
    DivSimpleSongInfo.appendChild(DivImage);
    //Song and user
    var DivSongAndUser = GenorateSongAndUserInfo(Data0, "21px", true);
    DivSimpleSongInfo.appendChild(DivSongAndUser);
    //Map stats
    var time = Data0[6];
    if (time === 0) {
        time = FindMapDuration(Data0);
    }
    var DivMapStats = GenorateMapStats(Data0, time, false);
    DivSimpleSongInfo.appendChild(DivMapStats);
    //Modes
    var DivModes = GenorateModes(Data0, time);
    DivSimpleSongInfo.appendChild(DivModes);
    //Download stuff
    var DivDownloadStuff = GenorateDownloadStuff(Data0);
    DivSimpleSongInfo.appendChild(DivDownloadStuff);

    document.getElementById("SongSearch-ListDisplay").appendChild(DivSimpleSongInfo);
}

function CreateSingleSongInfo(Data0){
    var DivSimpleSongInfoContainer = document.createElement("div");
    DivSimpleSongInfoContainer.setAttribute("class", "Simple-Song-Info-Container");

    var time = Data0[6];
    if (time === 0) {
        time = FindMapDuration(Data0);
    }
    //left area
    var DivLeftArea = document.createElement("div");
    DivLeftArea.setAttribute("class", "Left-Area");
    var DivImage0 = document.createElement("div");
    DivImage0.setAttribute("class", "Cover-Image-Div");
    var DivImage = GenorateCoverImage(Data0);
    DivImage0.appendChild(DivImage);
    var DivModes = GenorateModes(Data0, time);
    DivLeftArea.appendChild(DivImage0);
    DivLeftArea.appendChild(DivModes);

    DivSimpleSongInfoContainer.appendChild(DivLeftArea);
    //right area
    var DivRightArea = document.createElement("div");
    DivRightArea.setAttribute("class", "Right-Area");
    //right top
    var DivTop = document.createElement("div");
    DivTop.setAttribute("class", "Top-Area");
    var DivSongInfo = document.createElement("div");
    DivSongInfo.setAttribute("class", "Song-Info");

    var DivSongNameStuff = GenorateSongNameStuff(Data0);
    var DivDateUploaded = GenorateDateUploaded(Data0, "Uploaded on: ", "en-ZA");
    var DivSongAndUser = GenorateSongAndUserInfo(Data0, "32px", false);

    DivSongInfo.appendChild(DivSongNameStuff);
    DivSongInfo.appendChild(DivDateUploaded);
    DivSongInfo.appendChild(DivSongAndUser);

    DivTop.appendChild(DivSongInfo);

    var DivMapStats = GenorateMapStats(Data0, time, true);

    DivTop.appendChild(DivMapStats);

    var DivMiddle = document.createElement("div");
    DivMiddle. setAttribute("class", "Middle-Area");
    DivDescription = document.createElement("div");
    DivDescription.setAttribute("class", "Description");
    DivDescription.innerText = Data0[9];
    DivMiddle.appendChild(DivDescription);


    var DivDownloadStuff = GenorateDownloadStuff(Data0);
    
    DivRightArea.appendChild(DivTop);
    DivRightArea.appendChild(DivMiddle);
    DivRightArea.appendChild(DivDownloadStuff);

    DivSimpleSongInfoContainer.appendChild(DivRightArea);

    document.getElementById("SingleSong-Info").appendChild(DivSimpleSongInfoContainer);
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
    window.scrollTo(0,0);
}

function SearchInput() {
    event.preventDefault();
   
    var SearchBarInputValue = document.getElementById("Search-Bar-Input").value;
    SearchBarInputValue = "?q=" + SearchBarInputValue;
    PushHistoryState("search", "text", "", "0", "SongSearch-ListDisplay", "", SearchBarInputValue, "display: ''");
    RefreshScreen();
    document.getElementById(history.state.DisplayType).setAttribute("style", "display: '' ");
    document.getElementById("Footer-Nav").setAttribute("style", "display:''");
    GetData("search","text", "", 0, SearchBarInputValue);
    document.getElementById("PageNumber-Input").value = "1";
    window.scrollTo(0,0);
}

function SearchKey() {
    event.preventDefault();
    var KeyInput = document.getElementById("Key-Search-Input").value;
    PushHistoryState("search", "text", "", "0", "SingleSong-Info", "", KeyInput, "display:none");
    RefreshScreen();
    document.getElementById(history.state.DisplayType).setAttribute("style", "display: '' ");
    document.getElementById("Footer-Nav").setAttribute("style", "display:none");

    GetData("maps","detail","","",KeyInput);
    window.scrollTo(0,0);
    //"2365"
}

function NextPage() {
    var HistoryState = history.state;

    var NumberOfPages = GetNumberofPages();

    RefreshScreen();
    document.getElementById(HistoryState.DisplayType).setAttribute("style", "display: '' ");

    //console.log(HistoryState);
    var n = Number(HistoryState.CurPageNum) + 1;
    //console.log(NumberOfPages, HistoryState.CurPageNum);
    if (NumberOfPages = null || NumberOfPages <= HistoryState.CurPageNum) {
        n = 0;
    }

    GetData(HistoryState.Type ,HistoryState.SearchType, HistoryState.UserId, n, HistoryState.SearchData);

    document.getElementById("PageNumber-Input").value = n + 1;
    PushHistoryState(HistoryState.Type, HistoryState.SearchType, HistoryState.UserId, n, HistoryState.DisplayType, "", HistoryState.SearchData, "display:''");
    window.scrollTo(0,0);
}

function PreviousPage() {
    var HistoryState = history.state;

    RefreshScreen();
    document.getElementById(HistoryState.DisplayType).setAttribute("style", "display: '' ");

    var n = Number(HistoryState.CurPageNum) - 1;

    if (n <= -1){
        n = HistoryState.TotalPageNumber;
    }

    GetData(HistoryState.Type ,HistoryState.SearchType, HistoryState.UserId, n, HistoryState.SearchData);

    document.getElementById("PageNumber-Input").value = n + 1;
    PushHistoryState(HistoryState.Type, HistoryState.SearchType, HistoryState.UserId, n, HistoryState.DisplayType, "", HistoryState.SearchData, "display:''");
    window.scrollTo(0,0);
}


function Hot() {
    PushHistoryState("maps", "hot", "", "0", "SongSearch-ListDisplay", "", "", "display:''");

    //console.log(history.state);

    RefreshScreen();
    document.getElementById("SongSearch-ListDisplay").setAttribute("style", "display: '' ");
    document.getElementById("Footer-Nav").setAttribute("style", "display:''");
    document.getElementById("PageNumber-Input").value = "1";
    GetData("maps","hot", "", 0, "?automapper=1");
    window.scrollTo(0,0);
}

function Latest() {
    PushHistoryState("maps", "latest", "", "0", "SongSearch-ListDisplay", "", "", "display:''");
    //console.log(history.state);

    RefreshScreen();
    document.getElementById("SongSearch-ListDisplay").setAttribute("style", "display: '' ");
    document.getElementById("Footer-Nav").setAttribute("style", "display:''");
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
    var h = history.state;
    var User_id = UserId.getAttribute("data-user-id");
    RefreshScreen();
    document.getElementById("SongSearch-ListDisplay").setAttribute("style", "display: '' ");
    document.getElementById("Footer-Nav").setAttribute("style", "display:''");
    GetData("maps", "uploader", User_id , 0, "");
    PushHistoryState(h.Type, h.SearchType, h.UserId, h.CurPageNum, "SongSearch-ListDisplay", h.TotalPageNumber, h.SearchData, "display:''");
    document.getElementById("PageNumber-Input").value = "1";
    window.scrollTo(0,0);
    
}

function LoadDetailMapInfo(MapKey) {
 event.preventDefault();
 document.getElementById("Key-Search-Input").value = MapKey.getAttribute("Data-Map-Key");
 SearchKey();
}

function ReplaceHistoryState(HistoryType,HistorySearchType, HistoryUserId, HistoryCurrentPageNumber, HistoryDisplayType, HistoryTotalPageNumber, HistorySearchData, HistoryNavRam) {
    let StateObj = {Type: HistoryType, SearchType: HistorySearchType, UserId: HistoryUserId, CurPageNum: HistoryCurrentPageNumber, DisplayType: HistoryDisplayType ,TotalPageNumber: HistoryTotalPageNumber, SearchData: HistorySearchData, NavRam: HistoryNavRam};
    window.history.replaceState(StateObj, "", "");
}

function PushHistoryState(HistoryType,HistorySearchType, HistoryUserId, HistoryCurrentPageNumber, HistoryDisplayType, HistoryTotalPageNumber, HistorySearchData, HistoryNavRam) {
    let StateObj = {Type: HistoryType, SearchType: HistorySearchType, UserId: HistoryUserId, CurPageNum: HistoryCurrentPageNumber, DisplayType: HistoryDisplayType ,TotalPageNumber: HistoryTotalPageNumber, SearchData: HistorySearchData, NavRam: HistoryNavRam};
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
//////
// create page elements functions
//////
function GenorateHeaderInfo(Data1) {
    var DivHeader = document.createElement("div");
    DivHeader.setAttribute("class", "Header-Info");
    var DivMapper = document.createElement("div");
    DivMapper.innerHTML = Data1[0];
    var DivKey = document.createElement("div");
    DivKey.innerHTML = Data1[1] + " 🔑";
    DivHeader.appendChild(DivMapper);
    DivHeader.appendChild(DivKey);
    return DivHeader;
}

function GenorateDateUploaded(Data1, PreText, Paramete1) {
    var DivDateUp = document.createElement("div");
    var d = Data1[2];
    var LocalDate = new Date (d);
    DivDateUp.innerHTML = PreText + LocalDate.toLocaleString(Paramete1, {hour12:true, year:"numeric", month:"numeric", day:"numeric", hour:"numeric", minute:"numeric"});
    DivDateUp.setAttribute("class", "Date-Uploaded");
    return DivDateUp;
}

function GenorateCoverImage(Data1) {
    var DivImage = document.createElement("div");
    DivImage.setAttribute("class", "Cover-Image");
    var Img0 = document.createElement("img");
    Img0.setAttribute("loading", "lazy");
    Img0.src = "https://beatsaver.com" + Data1[3];
    DivImage.appendChild(Img0);
    return DivImage;
}

function GenorateSongAndUserInfo(Data1, FontSize, TitleClick) {
    var DivSongAndUser = document.createElement("div");
    DivSongAndUser.setAttribute("class", "SongAndUser-Info");
    if (TitleClick === true){
        var A0 = document.createElement("a");
        A0.setAttribute("href", "javascript:void(0)");
        A0.setAttribute("onclick", "LoadDetailMapInfo(this)");
        A0.setAttribute("Data-Map-Key", Data1[1]);
        A0.setAttribute("style","font-size:" + FontSize);
        A0.innerHTML = Data1[4];
        DivSongAndUser.appendChild(A0);
    }
    else{
        var A0 = document.createElement("div");
        A0.innerHTML = Data1[4];
        A0.setAttribute("style","font-size:" + FontSize + ";color: #262626;");
        DivSongAndUser.appendChild(A0);
    }
    var Div0 = document.createElement("div");
    Div0.innerHTML = "Uploaded by ";
    var A1 = document.createElement("a");
    A1.setAttribute("href", "javascript:void(0)");
    A1.setAttribute("onclick", "GetUserMaps(this)");
    A1.setAttribute("Data-User-ID", Data1[5]._id);
    A1.innerHTML = Data1[5].username;
    Div0.appendChild(A1);
    DivSongAndUser.appendChild(Div0);
    return DivSongAndUser;
}

function GenorateMapStats(Data1, time1, Single) {
    var DivMapStats = document.createElement("div");
    DivMapStats.setAttribute("class", "MapStats");
    var Div1 = document.createElement("div");
    var Div2 = document.createElement("div");
    var Div3 = document.createElement("div");
    var Div4 = document.createElement("div");
    var Div5 = document.createElement("div");

    var min = Math.floor(time1/60);
    var sec = time1 % 60;
    sec = sec < 10 ? "0" + sec : sec;
    Div1.innerHTML = min + ":" + sec + " 🕔";

    Div2.innerHTML = Intl.NumberFormat('en-US', {style: 'decimal'}).format(Data1[7].upVotes) + " 👍";
    Div3.innerHTML = Intl.NumberFormat('en-US', {style: 'decimal'}).format(Data1[7].downVotes) + " 👎";
    Div4.innerHTML = Intl.NumberFormat('en-US', {style: 'decimal'}).format(Data1[7].downloads) + " 💾";
    var Rating = Data1[7].rating;
    Rating = Math.round(Rating * 10000)/100;
    Div5.innerHTML = Rating + "% 💯";
    Div1.setAttribute("title", "Beatmap Duration");
    Div2.setAttribute("title", "Upvotes");
    Div3.setAttribute("title", "Downvotes");
    Div4.setAttribute("title", "Downloads");
    Div5.setAttribute("title", "Beatmap Rating");

    if (Single === true) {
        var Div6 = document.createElement("div");
        Div6.innerHTML = Data1[1] + " 🔑";
        DivMapStats.appendChild(Div6);
    }

    DivMapStats.appendChild(Div1);
    DivMapStats.appendChild(Div2);
    DivMapStats.appendChild(Div3);
    DivMapStats.appendChild(Div4);
    DivMapStats.appendChild(Div5);
    return DivMapStats;
}

function GenorateModes(Data1, time1){
    var p = Data1[8].length;
    var DivModes = document.createElement("div");
    DivModes.setAttribute("class", "Modes")
    
    for (i=0; i<=p-1; i++){
        var DivMode = document.createElement("div");
        DivMode.setAttribute("class", "Mode");
        var DivStandard = document.createElement("div");
        DivStandard.setAttribute("class", "Standard");
        var DivModeTitle = document.createElement("div");
        DivModeTitle.innerHTML = Data1[8][i].name;
        DivModeTitle.setAttribute("class", "Mode-Title");
        var DivDifs = document.createElement("div");
        DivDifs.setAttribute("class", "Difs");

        if (Data1[8][i].difficulties.easy != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "Easy");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Easy";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data1[8][i].difficulties.easy.notes;
            var Nps = Math.round((NotesNumber/time1)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        if (Data1[8][i].difficulties.normal != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "Normal");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Normal";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data1[8][i].difficulties.normal.notes;
            var Nps = Math.round((NotesNumber/time1)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        if (Data1[8][i].difficulties.hard != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "Hard");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Hard";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data1[8][i].difficulties.hard.notes;
            var Nps = Math.round((NotesNumber/time1)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        if (Data1[8][i].difficulties.expert != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "Expert");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Expert";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data1[8][i].difficulties.expert.notes;
            var Nps = Math.round((NotesNumber/time1)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        if (Data1[8][i].difficulties.expertPlus != null){
            var DivEasy = document.createElement("div");
            DivEasy.setAttribute("class", "ExpertPlus");
            var Div6 = document.createElement("div");
            Div6.innerHTML = "Expert +";
            var Div7 = document.createElement("div");
            var NotesNumber  = Data1[8][i].difficulties.expertPlus.notes;
            var Nps = Math.round((NotesNumber/time1)*100)/100;
            Div7.innerHTML = Nps + " NPS";
            DivEasy.appendChild(Div6);
            DivEasy.appendChild(Div7);
            DivDifs.appendChild(DivEasy);
        }
        DivStandard.appendChild(DivModeTitle);
        DivStandard.appendChild(DivDifs);
        DivMode.appendChild(DivStandard);
        DivModes.appendChild(DivMode);
    }
    return DivModes;
}

function GenorateDownloadStuff(Data1) {
    var DivDownloadStuff = document.createElement("div");
    DivDownloadStuff.setAttribute("class", "Download-Stuff");
    var A2 = document.createElement("a");
    A2.innerHTML = "Download";
    var Dl = "https://beatsaver.com" + Data1[9];
    A2.setAttribute("href", Dl);
    var A3 = document.createElement("a");
    A3.innerHTML = "OneClick™";
    var Oc = "beatsaver://" + Data1[1];
    A3.setAttribute("href", Oc);
    var A4 = document.createElement("a");
    A4.innerHTML = "3D preview";
    var ThreeDPreview = "https://skystudioapps.com/bs-viewer/?id=" + Data1[1];
    A4.setAttribute("href", ThreeDPreview);
    A4.setAttribute("target", "_blank");
    DivDownloadStuff.appendChild(A2);
    DivDownloadStuff.appendChild(A4);
    DivDownloadStuff.appendChild(A3);
    return DivDownloadStuff;
}

function GenorateSongNameStuff(Data1) {
    var DivSongNameStuff = document.createElement("div");
    DivSongNameStuff.setAttribute("class", "Song-Name-Stuff");
    var Div6 = document.createElement("div");
    var Div7 = document.createElement("div");
    var Div8 = document.createElement("div");
    var Div9 = document.createElement("div");

    Div6.innerHTML = "Song Name: " + Data1[10];
    Div7.innerHTML = "Song Author Name: " + Data1[11];
    Div8.innerHTML = "Song Sub Name: " + Data1[12];
    Div9.innerHTML = "levelAuthorName: " + Data1[13];

    DivSongNameStuff.appendChild(Div6);
    DivSongNameStuff.appendChild(Div7);
    DivSongNameStuff.appendChild(Div8);
    DivSongNameStuff.appendChild(Div9);

    return DivSongNameStuff;
}