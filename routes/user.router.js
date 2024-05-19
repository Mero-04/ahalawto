const express = require("express");
const router = express.Router();
const { Blog, Contact, User, Category, Message, Group_chat } = require("../models/model")
const multer = require("multer");
const imageUpload = require("../helpers/image-upload");
const upload = multer({ dest: 'uploads/' })
const bcrypt = require("bcrypt")
const fs = require("fs")
const isKadr = require("../middlewares/isUser")
const { Op, where } = require("sequelize")
const moment = require("moment")


router.get("/", async (req, res) => {
    res.render("user/home_user",{
        img: req.session.img,
        username: req.session.email,
        page: "home"
    })
})

router.get("/users", isKadr, async (req, res) => {
    const blogs = await User.findAll();
    res.render("user/users", {
        bloglar: blogs
    })
})

router.get("/inbox", isKadr, async (req, res) => {
    const users = await User.findAll({
    });
    const message = await Message.findAll({
        include: { model: User },
    })
    const sender_message = await Message.findAll({
        include: { model: User }
    })
    res.render("user/inbox", {
        ulanyjylar: users,
        userId: req.session.userId,
        sender_messages: sender_message,
        sender_userId: req.params.userId,
        img: req.session.img,
        username: req.session.email,
        page: "inbox"
    })
})


router.get("/inbox/:userId", isKadr, async (req, res) => {
    const users = await User.findAll({});
    const message = await Message.findAll({
        include: { model: User },
        where: {

            [Op.or]: [
                {
                    [Op.and]: [{
                        send_user: req.params.userId,
                        userId: req.session.userId
                    }]
                },
                {
                    [Op.and]: [{
                        send_user: req.session.userId,
                        userId: req.params.userId
                    }]
                }
            ]

        }
    })

    res.render("user/inbox2", {
        ulanyjylar: users,
        userId: req.session.userId,
        sender_userId: req.params.userId,
        messages: message,
        img: req.session.img,
        username: req.session.email,
        page: "inbox"
    })
})


router.get("/message/:userId", isKadr, async (req, res) => {
    const id = req.params.userId;
    const user = await User.findOne({
        where: { id: id }
    })
    res.render("user/user-message", {
        user: user
    })
})

router.post("/message", isKadr, imageUpload.upload.single("file"), async (req, res) => {
    const id = req.params.userId;
   
    if (req.file) {
         await Message.create({
            message: req.body.message,
            userId: req.body.send_user,
            send_user: req.session.userId,
            sender: req.session.email,
            file: req.file.filename,
            created_at: moment().locale("tk").format('LT')
        })
        res.redirect("/user/inbox/" + req.body.send_user)
    } else {
        let message = await Message.create({
            message: req.body.message,
            userId: req.body.send_user,
            send_user: req.session.userId,
            sender: req.session.email,
            created_at: moment().locale("tk").format('LT')
        })
        res.redirect("/user/inbox/" + req.body.send_user)
    }

})




router.post("/message/delete/:messageId", isKadr, async (req, res) => {
    const message = await Message.findOne({
        where: { id : req.params.messageId}
    });
    if (message) {
        message.destroy();
        return res.redirect("/user/inbox/" + message.userId )
    } else {
        console.log("Message tapylmady")
    }
})


router.get("/umumy_chat/", async (req, res) => {
    const users = await User.findAll({
    });
    const message = await Group_chat.findAll({
        include: { model: User },
    })
    res.render("user/obsy_chat", {
        ulanyjylar: users,
        userId: req.session.userId,
        messages: message,
        sender_userId: req.params.userId,
        img: req.session.img,
        username: req.session.email,
        page: "obshy_chat"
    })
})

router.post("/umumy_chat/message", isKadr, imageUpload.upload.single("file"), async (req, res) => {
       
    if (req.file) {
         await Group_chat.create({
            message: req.body.message,
            userId: req.session.userId,
            sender: req.session.email,
            file: req.file.filename,
            created_at: moment().locale("tk").format('LT')
        })
        res.redirect("/user/umumy_chat" )
    } else {
        let message = await Group_chat.create({
            message: req.body.message,
            userId: req.session.userId,
            sender: req.session.email,
            created_at: moment().locale("tk").format('LT')
        })
        res.redirect("/user/umumy_chat")
    }

})

router.post("/umumy_chat/message/delete/:messageId", isKadr, async (req, res) => {
    const message = await Group_chat.findOne({
        where: { id : req.params.messageId}
    });
    if (message) {
        message.destroy();
        return res.redirect("/user/umumy_chat")
    } else {
        console.log("Message tapylmady")
    }
})




router.get("/login", (req, res) => {
    res.render("user/user-login")
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            where: { name: req.body.name }
        });

        if (!user) {
            return res.render("user/user-login", {
                message: "Login yalnys"
            })
        }

        const match = await bcrypt.compare(req.body.password, user.password)
        if (match) {
            req.session.isAuth = true;
            req.session.email = user.name;
            req.session.img = user.user_img;
            req.session.role = user.role;
            req.session.userId = user.id;
            res.redirect("/user");
        } else {
            return res.render("user/user-login", {
                message: "password yalnys"
            })
        }
    }
    catch (err) {
        console.log(err);
    }
})

router.get("/logout", async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/")
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;