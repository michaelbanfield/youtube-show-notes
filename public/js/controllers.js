'use strict';

/* Controllers */




function IndexCtrl($scope, $http, $location) {
    $scope.start = 0
    $scope.videoID = "tGZbz_68EaM"
    $scope.setVideoView = true;

    $scope.setVideo = function () {
        $scope.setVideoView = false;
        $scope.reloadVideo()
    }

    $scope.reloadVideo = function(autoplay) {
        autoplay = typeof autoplay !== 'undefined' ? autoplay : 0;
        $('.embedFrame').remove()
        $('.videoframe').append('<embed id = "playerid" class="embedFrame"  width="1120" height="630" allowfullscreen="true" allowscriptaccess="always" quality="high" bgcolor="#000000" name="playerid" style="" src="http://www.youtube.com/v/' + $scope.videoID + '?enablejsapi=1&version=3?&playerapiid=ytplayer&start=' + $scope.start + '&autoplay=' + autoplay + '" type="application/x-shockwave-flash">')

    }




    $scope.loadPosts = function () {
        $http.get('/api/notes/' + $scope.videoID).
            success(function(data, status, headers, config) {
                $scope.posts = data.posts;
            });

    }

    $scope.loadPosts()
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
        //$scope.currentTime = myPlayer.getCurrentTime()
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
        $scope.form.videoID = $scope.videoID
        $http.post('/api/post', $scope.form).
            success(function(data) {
                $scope.loadPosts()
                $scope.form = {};
            });
        $scope.noteView = false;
        $scope.playVideo()
    };

}

function AddPostCtrl($scope, $http, $location) {
    $scope.form = {};
    $scope.submitPost = function () {
        $http.post('/api/post', $scope.form).
            success(function(data) {
                $location.path('/');
            });
    };
}

function ReadPostCtrl($scope, $http, $routeParams) {
    $http.get('/api/post/' + $routeParams.id).
        success(function(data) {
            $scope.post = data.post;
        });

}


function ReadNotesCtrl($scope, $http, $routeParams) {
    $scope.videoID = $routeParams.id
    $http.get('/api/notes/' + $routeParams.id).
        success(function(data, status, headers, config) {
            $scope.posts = data.posts;

        });

    $scope.changeStart = function (time) {
        $scope.start = time
    }
}


function EditPostCtrl($scope, $http, $location, $routeParams) {
    $scope.form = {};
    $http.get('/api/post/' + $routeParams.id).
        success(function(data) {
            $scope.form = data.post;
        });

    $scope.editPost = function () {
        $http.put('/api/post/' + $routeParams.id, $scope.form).
            success(function(data) {
                $location.url('/readPost/' + $routeParams.id);
            });
    };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/post/' + $routeParams.id).
        success(function(data) {
            $scope.post = data.post;
        });

    $scope.deletePost = function () {
        $http.delete('/api/post/' + $routeParams.id).
            success(function(data) {
                $location.url('/');
            });
    };

    $scope.home = function () {
        $location.url('/');
    };
}







