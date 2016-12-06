var config = {
    apiKey: "AIzaSyD-3iC1D0F8kLgb4OiVuMsZuH8M4daYXBE",
    authDomain: "water-ec2fa.firebaseapp.com",
    databaseURL: "https://water-ec2fa.firebaseio.com",
    storageBucket: "water-ec2fa.appspot.com",
    messagingSenderId: "547238191292"
}
firebase.initializeApp(config)
var database = firebase.database()
var app = angular.module('app', [])
$('#menu').click(function () {
    $('.ui.sidebar').sidebar('show')
})
app.controller('RoomCtrl', function ($window, $scope) {
    vm = this
    vm.scope = $scope
    vm.list = []
    vm.showdetail = (id) => {
        alert(id)
    }
    vm.addOwner = () => {
        $('.ui.modal').modal('show')
        //vm.writeOwner()
    }
    vm.getdata = () => {
        vm.list.splice(0, vm.list.length)
        const user = firebase.auth().currentUser
        var ownersref = firebase.database().ref('owners/' + user.uid)
        ownersref.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var obOwner = childSnapshot.val()
                obOwner.id = childSnapshot.key
                obOwner.roomlist = []
                var roomref = firebase.database().ref('rooms/' + childSnapshot.key)
                roomref.on('value', function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var childData = childSnapshot.val()
                        childData.id = childSnapshot.key
                        obOwner.roomlist.push(childData)
                    })
                    vm.list.push(obOwner)
                    vm.scope.$apply()
                })
            })
        })
    }
    vm.writeOwner = () => {
        const user = firebase.auth().currentUser
        var ownersref = firebase.database().ref('owners/' + user.uid)
        var newOwnerRef = ownersref.push()
        id = newOwnerRef.key
        newOwnerRef.set({ name: 'test5' })
        newOwnerRef.on('child_added', function (data) {
            roomRef = firebase.database().ref('rooms/' + id)
            // for (i = 0 i <= 3 i++) {
            //     var newroomRef = roomRef.push()
            //     newroomRef.set({ roomno: '12/88', update: '12/01/2016', meter: 2000 })
            // }
            vm.getdata()
        })

    }
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('User is signed in.')
            vm.getdata()
            //window.location.href = 'roomOwner.html'
        } else {
            console.log('No user is signed in.')
            // window.location.href = 'index.html'
        }
    })
}).directive('myRepeatDirective', function () {
    return function (scope, element, attrs) {
        $('.ui.accordion').accordion()
    }
})


