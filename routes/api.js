// initialize our faux database
var data = {
    "videoID": null,
    "posts": []
};
var redis = require('heroku-redis-client'),
    client = redis.createClient();
client.set('key', 'value');


client.on("error", function (err) {
    console.log("Error " + err);
});

// GET


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