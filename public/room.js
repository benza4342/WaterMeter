var config = {
  apiKey: 'AIzaSyD-3iC1D0F8kLgb4OiVuMsZuH8M4daYXBE',
  authDomain: 'water-ec2fa.firebaseapp.com',
  databaseURL: 'https://water-ec2fa.firebaseio.com',
  storageBucket: 'water-ec2fa.appspot.com',
  messagingSenderId: '547238191292'
}
firebase.initializeApp(config)
var database = firebase.database()
var app = angular.module('app', [])
app
  .controller('RoomCtrl', function ($window, $scope) {
    vm = this
    vm.scope = $scope
    firebase.auth().onAuthStateChanged((user) => {
      if (user) { vm.getdata() } else {
        vm.loading = ''
        window.location.href = 'index.html'
      }
    })
    vm.logout = () => {
      vm.loading = 'active'
      firebase.auth().signOut()
    }
    vm.toggle = () => { $('.ui.sidebar').sidebar('show') }
    vm.modalOwner = () => {
      $('#modalOwner').modal({
        onHide: function () {
          vm.onsave()
          return true
        }
      }).modal('show')
    }
    vm.modalRoom = (ownerid, roomid) => {
      vm.OwnerId = ownerid
      vm.RoomId = roomid
      if (roomid != 0) {
        vm.RoomId = roomid
        var roomref = firebase.database().ref('rooms/' + vm.OwnerId + '/' + roomid)
        roomref.once('value', function (snapshot) {
          vm.room = snapshot.val()
          vm.scope.$apply()
        })
      }
      $('#modalRoom').modal({
        onHide: function () {
          vm.onsave()
          return true
        }
      }).modal('show')
    }
    vm.getdata = () => {
      vm.loading = 'active'
      vm.list = []
      var ownersref = firebase.database().ref('owners/' + firebase.auth().currentUser.uid)
      ownersref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var obOwner = childSnapshot.val()
          obOwner.id = childSnapshot.key
          obOwner.roomlist = []
          var roomref = firebase.database().ref('rooms/' + childSnapshot.key)
          roomref.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val()
              childData.id = childSnapshot.key
              obOwner.roomlist.push(childData)
            })
            vm.list.push(obOwner)
            vm.loading = ''
            vm.scope.$apply()
          })
        })
      })
    }
    vm.saveOwner = () => {
      var ownersref = firebase.database().ref('owners/' + firebase.auth().currentUser.uid)
      var newOwnerRef = ownersref.push()
      id = newOwnerRef.key
      vm.owner.create = new Date().getTime()
      newOwnerRef.set(vm.owner)
      vm.getdata()
    }
    vm.saveRoom = () => {
      var roomref = firebase.database().ref('rooms/' + vm.OwnerId)
      if (vm.RoomId == 0) {
        var newroomRef = roomref.push()
        vm.room.create = new Date().getTime()
        vm.room.modify = new Date().getTime()
      } else {
        var newroomRef = firebase.database().ref('rooms/' + vm.OwnerId + '/' + vm.RoomId)
        vm.room.modify = new Date().getTime()
      }
      newroomRef.set(vm.room)
      vm.getdata()
    }
    vm.onsave = () => {
      vm.OwnerId = 0
      vm.RoomId = 0
      vm.room = {}
      vm.owner = {}
    }
  })
  .directive('myRepeatDirective', function () {
    return function (scope, element, attrs) {
      $('.ui.accordion').accordion()
    }
  })