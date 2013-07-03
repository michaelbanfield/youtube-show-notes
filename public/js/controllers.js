'use strict';

/* Controllers */




function IndexCtrl($scope, $http, $location) {
    $scope.start = 0
    $scope.videoID = null
    $scope.setVideoView = true;

    $scope.data = {
        videoID: null,
        posts: []
    }

    $scope.setVideo = function () {
        $scope.setVideoView = false;
        $scope.reloadVideo()
    }

    $scope.reloadVideo = function(autoplay) {
        autoplay = typeof autoplay !== 'undefined' ? autoplay : 0;
        $('.embedFrame').remove()
        $('.videoframe').append('<embed id = "playerid" class="embedFrame"  width="1120" height="630" allowfullscreen="true" allowscriptaccess="always" quality="high" bgcolor="#000000" name="playerid" style="" src="http://www.youtube.com/v/' + $scope.videoID.split('v=')[1] + '?enablejsapi=1&version=3?&playerapiid=ytplayer&start=' + $scope.start + '&autoplay=' + autoplay + '" type="application/x-shockwave-flash">')

    }

    $scope.setPath = function() {
        var key = null
        $http.post('/api/savenotes/', $scope.data).
            success(function(data) {
                key = data.result
                $location.url('/read/' + key)
            });

    }
    $scope.currentTime = 0;
    $scope.noteView = false;

    $scope.addNote = function() {
        $scope.pauseVideo()
        $scope.currentTime = $scope.getTime()
        $scope.noteView = true;

    }

    $scope.pauseVideo = function() {

        var myPlayer = document.getElementById('playerid')
        myPlayer.pauseVideo()
    }

    $scope.playVideo = function() {

        var myPlayer = document.getElementById('playerid')
        myPlayer.playVideo()
    }

    $scope.getTime = function() {
        var myPlayer = document.getElementById('playerid')
        return Math.round(myPlayer.getCurrentTime())

    }

    $scope.changeStart = function (time) {
        $scope.start = time
        $scope.reloadVideo(1)
    }











    $scope.form = {};
    $scope.submitPost = function () {
        $scope.form.time = $scope.currentTime
        $scope.form.videoID = $scope.videoID.split('v=')[1]
        $scope.data.posts.push($scope.form)
        $scope.data.videoID = $scope.form.videoID
        $scope.noteView = false;
        $scope.form = {}
        $scope.playVideo()
    };

}


function ReadNotesCtrl($scope, $http, $routeParams) {
    $scope.posts = null
    $http.get('/api/getnotes/' + $routeParams.id).
        success(function(data, status, headers, config) {
            $scope.posts = data.post.posts
            $scope.videoID = data.post.videoID;

        });

    $scope.changeStart = function (time) {
        $scope.start = time
    }
}






