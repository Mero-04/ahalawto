const { DataTypes } = require('sequelize');
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    blog_img: { type: DataTypes.STRING, allowNull: false }
});


const Contact = sequelize.define("contact", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});


const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ata_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birth: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duty: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tel_nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    arka_file: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "USER"
    },
});

const Admin = sequelize.define("admin", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ADMIN"
    },
    admin_img: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const Worker = sequelize.define("worker", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "WORKER"
    },
    worker_img: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const Category = sequelize.define("category", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Message = sequelize.define("message", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    send_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

const Group_chat = sequelize.define("group_chat", {
    id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.STRING,
        allowNull: false
    },
});




Admin.findOrCreate({ where: { name: "admin", password: "$2b$10$ppLSj03K./oeMqaDKYEpTehMP5/Nxp5JzmppDXbygn/ReZMhwBe5W", role: "ADMIN", admin_img: "Surat yok" } })
Worker.findOrCreate({ where: { name: "kadr", password: "$2b$10$ppLSj03K./oeMqaDKYEpTehMP5/Nxp5JzmppDXbygn/ReZMhwBe5W", role: "WORKER", worker_img: "Surat yok" } })

Category.hasMany(User, { onDelete: "cascade", onUpdate: "cascade" })
User.belongsTo(Category)

User.hasMany(Message, { onDelete: "cascade", onUpdate: "cascade" })
Message.belongsTo(User)

User.hasMany(Group_chat, { onDelete: "cascade", onUpdate: "cascade" })
Group_chat.belongsTo(User)

module.exports = {
    Blog,
    Contact,
    Admin,
    User,
    Worker,
    Category,
    Message,
    Group_chat
};