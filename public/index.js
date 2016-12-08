/* global firebase */
var app = angular.module('app', [])
app.controller('LoginCtrl', function ($window) {
    var config = {
        apiKey: "AIzaSyD-3iC1D0F8kLgb4OiVuMsZuH8M4daYXBE",
        authDomain: "water-ec2fa.firebaseapp.com",
        databaseURL: "https://water-ec2fa.firebaseio.com",
        storageBucket: "water-ec2fa.appspot.com",
        messagingSenderId: "547238191292"
    }
    firebase.initializeApp(config)
    var vm = this
    vm.fblogin = () => {
        vm.fbloaded = 'loading'
        var provider = new firebase.auth.FacebookAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function (result) {
            writeUserData(user)
        }).catch(function (error) {
            vm.fbloaded = ''
        })

    }
    vm.login = () => {
         vm.loginloaded = 'loading'
        firebase.auth().signInWithEmailAndPassword(vm.email, vm.password).then(function (result) {
            writeUserData(user)
        }).catch(function (error) {
            vm.loginloaded = ''
        })
    }
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            writeUserData(user)
            console.log('User is signed in.')
        } else {
            console.log('No user is signed in.')
        }
    })
    function writeUserData(user) {
        firebase.database().ref('users/' + user.uid).set({
            uid: user.uid,
            email: user.email
        }).then(function () {
            vm.loginloaded = ''
            vm.fbloaded = ''
            $window.location.href = 'room.html'
        })
    }
})