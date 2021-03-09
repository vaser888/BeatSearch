
var JsonData;
var t;

GetData("hot",0);

function GetData(Type, Page) {
    fetch("https://beatsaver.com/api/maps/" + Type + "/" + Page + "?automapper=1").then(function (r) { return r.json() }).then(function (JsonData0) {
        
        console.log(JsonData0);
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
                console.log(i, BotTest);
                CreateSimpleSongInfo(i);
            }

    }
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
    DivDateUp.innerHTML = LocalDate.toLocaleString("en-US", {hour12:true, year:"numeric", month:"numeric", day:"numeric", hour:"numeric", minute:"numeric"});
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
    Div1.innerHTML = min + ":" + sec + " 🕔";
    Div2.innerHTML = Data0[7].upVotes + " 👍";
    Div3.innerHTML = Data0[7].downVotes + " 👎";
    Div4.innerHTML = Data0[7].downloads + " 💾";
    var Rating = Data0[7].rating;
    Rating = Math.round(Rating * 10000)/100;
    Div5.innerHTML = Rating + " 💯";
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



    console.log(p);


    document.getElementById("SongSearch-ListDisplay").appendChild(DivSimpleSongInfo);
}
