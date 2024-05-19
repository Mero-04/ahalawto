const express = require("express");
const { Contact, Blog, Category, User } = require("../models/model");
const router = express.Router();

router.get("/contact", (req, res) => {
    res.render("contact", {
        page: "contact"
    })
})

router.get("/", async (req, res) => {
    const limit = 6;
    const categories = await Category.findAll();
    const users = await User.findAll({
        limit,
        order: [
            ["id", "DESC"]
        ],
        include: { model: Category }
    });
    res.render("index", {
        page: "home",
        categories: categories,
        users: users
    })
})

router.get("/users_category/:categoryId", async (req, res) => {
    const limit = 6;
    const categories = await Category.findAll();
    const users = await User.findAll({
        limit,
        order: [
            ["id", "DESC"]
        ],
        include: { model: Category },
        where: {
            categoryId: req.params.categoryId
        }
    });
    res.render("index", {
        page: "home",
        categories: categories,
        users: users
    })
})

router.post("/send-message", async (req, res) => {
    const contact = await Contact.create({
        name: req.body.name,
        email: req.body.email,
        phone_num: req.body.phone_num,
        message: req.body.message
    })
    res.redirect("/")
})




module.exports = router;