const express = require("express");
const router = express.Router();
const { Blog, Contact, User, Category, Admin } = require("../models/model")
const multer = require("multer");
const imageUpload = require("../helpers/image-upload");
const upload = multer({ dest: 'uploads/' })
const bcrypt = require("bcrypt")
const fs = require("fs")
const isAdmin = require("../middlewares/isAdmin")


router.get("/", isAdmin, async (req, res) => {
   const categories = await Category.findAll();
    res.render("admin/home_admin",{
        categories:categories,
        img: req.session.img,
        username: req.session.email,
        page: "home"
    })
})

router.get("/users/:categoryId",isAdmin, async (req, res) => {
    const users = await User.findAll({
        include: { model: Category },
        where: { categoryId: req.params.categoryId }
    });
    res.render("admin/users", {
        bloglar: users,
        img: req.session.img,
        username: req.session.email,
        page: "users"
    })
});

router.get("/contact", async (req, res) => {
    const contacts = await Contact.findAll();
    res.render("admin/contact", {
        contact: contacts,
        page: "contact",
        img: req.session.img,
        username: req.session.email,
    })
});

router.get("/contact/:contactId", async (req, res) => {
    const id = req.params.contactId;
    const contact = await Contact.findByPk(id)
    res.render("admin/contact_single", {
        contact: contact
    })
})


router.get("/contact/delete/:contactId", async (req, res) => {
    const contact = await Contact.findByPk(req.params.contactId)
    res.render("admin/contact_delete", {
        contact: contact
    })
})

router.post("/contact/delete/:contactId", async (req, res) => {
    const contact = await Contact.findByPk(req.params.contactId);
    if (contact) {
        contact.destroy();
        res.redirect("/admin/contact")
    } else {
        console.log("Message tapylmady")
    }
})


router.get("/users", async (req, res) => {
    const blogs = await User.findAll();
    res.render("admin/users", {
        bloglar: blogs,
        page: "users",
        img: req.session.img,
        username: req.session.email,
    })
})



router.get("/user/:userId", async (req, res) => {
    const id = req.params.userId;
    const user = await User.findByPk(id)
    res.render("admin/user-single", {
        user: user
    })
})

router.post("/blog/edit/:blogId", async (req, res) => {
    const blog = await Blog.findByPk(req.params.blogId);
    if (blog) {
        blog.title = req.body.title,
            blog.description = req.body.description,
            blog.save()

        res.redirect("/admin/blog")
    }
})

router.get("/blog/edit/:blogId", async (req, res) => {
    const id = req.params.blogId;
    const blog = await Blog.findOne({
        where: { id: id }
    })
    res.render("admin/blog-edit", {
        blog: blog
    })
})

router.get("/user/delete/:userId", async (req, res) => {
    const user = await User.findByPk(req.params.userId)
    res.render("admin/user_delete", {
        user: user
    })
})

router.post("/user/delete/:userId", async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    if (user) {
        fs.unlink("./public/uploads/user/" + user.user_img, err => { })
        user.destroy();
        return res.redirect("/admin/users")
    } else {
        console.log("Işgär tapylmady")
    }
})



router.get("/category", async (req, res) => {
    const category = await Category.findAll();
    res.render("admin/categories", {
        category: category,
        action: req.query.action,
        page: "category",
        img: req.session.img,
        username: req.session.email,
    })
});

router.get("/category-add", (req, res) => {
    res.render("admin/category-add")
})

router.post("/category-add", async (req, res) => {
    try {
        const category = await Category.create({
            name: req.body.name
        })
        res.redirect("/admin/category?action=create");
    } catch (err) {
        console.log(err)
    }
})

router.get("/category/:categoryId", async (req, res) => {
    const id = req.params.categoryId;
    const category = await Category.findByPk(id)
    res.render("admin/category_single", {
        category: category
    })
})

router.get("/category/edit/:categoryId", async (req, res) => {
    const id = req.params.categoryId;
    const category = await Category.findByPk(id)
    res.render("admin/category-edit", {
        category: category
    })
})

//bcrypt
//jsonwebtoken


router.post("/category/edit/:categoryId", async (req, res) => {
    const category = await Category.findByPk(req.params.categoryId);
    if (category) {
        category.name = req.body.name,
        category.save()

        res.redirect("/admin/category")
    }
})

router.get("/category/delete/:categoryId", async (req, res) => {
    const category = await Category.findByPk(req.params.categoryId)
    res.render("admin/category_delete", {
        category: category
    })
})

router.post("/category/delete/:categoryId", async (req, res) => {
    const category = await Category.findByPk(req.params.categoryId);
    if (category) {
        category.destroy();
        res.redirect("/admin/category?action=delete")
    } else {
        console.log("Category tapylmady")
    }
})



router.get("/profil", isAdmin, async (req, res) => {
    const worker = await Admin.findOne({
        where: {
            id: req.session.userId
        }
    })

    res.render("admin/profil", {
        user: worker
    })
})


router.post("/profil/edit", isAdmin, imageUpload.upload.single("admin_img"), async (req, res) => {
    let img = req.body.admin_img;
    if (req.file) {
        img = req.file.filename;

        fs.unlink("./public/uploads/profil/" + req.body.img, err => {
            console.log(err);
        })
    }
    const user = await Admin.findOne({
        where: {
            id: req.session.userId
        }
    });

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    if (user) {
        user.name = req.body.name,
            user.password = hashedPassword,
            user.admin_img = img,
            user.save()

        res.redirect("/admin/profil")
    }
})

router.get("/profil/edit", isAdmin, async (req, res) => {
    const user = await Admin.findOne({
        where: { id: req.session.userId }
    })
    res.render("admin/profil-edit", {
        user: user
    })
})

module.exports = router;