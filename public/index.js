/* global firebase */
var app = angular.module('app', []);
app.controller('LoginCtrl', function ($window) {
    var config = {
        apiKey: "AIzaSyD-3iC1D0F8kLgb4OiVuMsZuH8M4daYXBE",
        authDomain: "water-ec2fa.firebaseapp.com",
        databaseURL: "https://water-ec2fa.firebaseio.com",
        storageBucket: "water-ec2fa.appspot.com",
        messagingSenderId: "547238191292"
    };
    firebase.initializeApp(config);
    var vm = this;
    vm.fblogin = () => {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;
            writeUserData(user);
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });

    };
    vm.login = () => {
        const user = firebase.auth().currentUser;
        var starCountRef = firebase.database().ref('users/' + user.uid);
        starCountRef.on('value', function (snapshot) {
            debugger;
            //updateStarCount(postElement, snapshot.val());
        });
    };
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('User is signed in.');
            $window.location.href = 'room.html';
        } else {
            console.log('No user is signed in.');
        }
    });
    function writeUserData(user) {
        firebase.database().ref('users/' + user.uid).set({
            displayName: user.displayName,
            email: user.email
        });
    }
});