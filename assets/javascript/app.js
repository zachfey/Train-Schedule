var config = {
    apiKey: "AIzaSyD2LCsxpjik-EL7vkAdOal5RAwWqrjOIPc",
    authDomain: "train-schedule-f471e.firebaseapp.com",
    databaseURL: "https://train-schedule-f471e.firebaseio.com",
    projectId: "train-schedule-f471e",
    storageBucket: "train-schedule-f471e.appspot.com",
    messagingSenderId: "1097088438585"
};
firebase.initializeApp(config);

var database = firebase.database();
let trainName = "";
let destination = "";
let firstTrain = "";
let frequency = 0;

$("#addTrain").on("click", function (event) {
    event.preventDefault();
    trainName = $("#inputName").val().trim();
    destination= $("#inputDest").val().trim();
    firstTrain = $("#inputTime").val().trim();
    frequency = $("#inputFreq").val().trim();
    console.log('vars assigned, push to database')
    database.ref("/trains").push({
        name: trainName,
        dest: destination,
        firstTrain: firstTrain,
        freq: frequency,
    });
});


database.ref("/trains").on("child_added", function (snapshot) {

    let firstTrainHour = snapshot.val().firstTrain.split(':')[0];
    let firstTrainMin = snapshot.val().firstTrain.split(':')[1];
    console.log(firstTrainHour + ':' + firstTrainMin)
    let fTrainMoment= moment().hour(firstTrainHour).minute(firstTrainMin).second(0)
    console.log(fTrainMoment);

    for(i = fTrainMoment; i < moment(); i.add(snapshot.val().freq, 'minutes')){}
    console.log('next train: ' + i);

    let nextArrival = i.format('HH:mm')
    let minAway =  parseInt(i.diff(moment())/1000/60)

    let col1 = $("<td>").text(snapshot.val().name);
    let col2 = $("<td>").text(snapshot.val().dest);
    let col3 = $("<td>").text(snapshot.val().freq);
    let col4 = $("<td>").text(nextArrival);
    let col5 = $("<td>").text(minAway);
    let newrow = $("<tr>").append(col1, col2, col3, col4, col5);
    $("#table-data").append(newrow);
});

