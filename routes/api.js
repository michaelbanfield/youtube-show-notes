// initialize our faux database
var data = {
    "videoID": null,
    "posts": []
};
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var client = require("redis").createClient(rtg.port, rtg.hostname);

    client.auth(rtg.auth.split(":")[1]);

} else {
    var redis = require("redis"),
        client = redis.createClient();
}


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
    data.videoID = req.body.videoID
    data.posts.push(req.body);
    res.json(req.body);
};

exports.saveNotes = function(req, res) {
    var key = new Date().getTime().toString(12)
    console.log(key)

    client.set(key, JSON.stringify(req.body), redis.print)
    res.json({
        result: key
    })
    data = {
        "videoID": null,
        "posts": []
    };
}

exports.getNotes = function(req,res) {
    var id = req.params.id
    client.get(id, function(err,reply) {
        res.json({
            post: JSON.parse(reply)
        });
    });
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