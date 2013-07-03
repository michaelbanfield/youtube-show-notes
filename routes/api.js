// initialize our faux database
var data = {
    "posts": [
        {
            "time": 50,
            "note": "A note",
            "videoID": "tGZbz_68EaM"
        },
        {
            "time": 60,
            "note": "Another note",
            "videoID": "tGZbz_68EaM"
        },
        {
            "time": 120,
            "note": "Another note",
            "videoID": "lolol"
        }
    ]
};

var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

// GET

exports.posts = function (req, res) {
    var posts = [];
    data.posts.forEach(function (post, i) {
        if(post.videoID == "tGZbz_68EaM") {
            posts.push({
                id: i,
                time: post.time,
                note: post.note
            });
        }

    });
    res.json({
        posts: posts
    });
};

exports.notes = function (req, res) {
    var videoID = req.params.id
    var posts = [];
    data.posts.forEach(function (post, i) {
        if(post.videoID == videoID) {
            posts.push({
                id: i,
                time: post.time,
                note: post.note
            });
        }

    });
    res.json({
        posts: posts
    });
};

exports.post = function (req, res) {
    var id = req.params.id;
    if (id >= 0 && id < data.posts.length) {
        res.json({
            post: data.posts[id]
        });
    } else {
        res.json(false);
    }
};

// POST
exports.addPost = function (req, res) {
    data.posts.push(req.body);
    res.json(req.body);
};

exports.saveNotes = function(req, res) {
    client.set("testkey", "lol", redis.print)
}



// PUT
exports.editPost = function (req, res) {
    var id = req.params.id;

    if (id >= 0 && id < data.posts.length) {
        data.posts[id] = req.body;
        res.json(true);
    } else {
        res.json(false);
    }
};

// DELETE
exports.deletePost = function (req, res) {
    var id = req.params.id;

    if (id >= 0 && id < data.posts.length) {
        data.posts.splice(id, 1);
        res.json(true);
    } else {
        res.json(false);
    }
};