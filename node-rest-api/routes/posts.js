const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/user")
    // router.get("/", (req, res) => {
    //     res.send("hey its posts")
    // })


//Create a post
router.post("/", async(req, res) => {
    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a post
router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {

            await post.updateOne({ $set: req.body });
            res.status(200).json("Post has been updated");

        } else {
            res.status(403).json("you can update only your post")
        }
    } catch (err) {
        return res.status(500).json(err);
    }

});

//delete a post
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {

            await post.deleteOne();
            res.status(200).json("Post has been deleted");

        } else {
            res.status(403).json("you can delete only your post")
        }
    } catch (err) {
        return res.status(500).json(err);
    }

});

//like dis like a post
router.put("/:id/like", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // console.log(post.likes.includes(req.body.userId));
        if (!post.likes.includes(req.body.userId)) {
            console.log("2");
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked")

        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json(" The post has been disliked ");
        }

    } catch (err) {
        return res.status(500).json(err);
    }
});

//get a post
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).send(post);
    } catch (err) {
        res.status(500).json(err)
    }
});

//get timeline a post
router.get("/timeline/all", async(req, res) => {
    console.log("2");
    try {
        console.log("2");
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;