const express = require("express");
const path = require("path");
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development);
const { models } = require("./models/blog");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middleware/uploadImage")
const hbs = require('hbs');

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.urlencoded({ extended: false }));

app.use("/logo", express.static(path.join(__dirname, "src/logo")));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use(
  session({
    name: "data",
    secret: "dinastiasianvalue",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());


app.get("/home", home);
app.get("/myproject", myproject);
app.post("/myproject", upload.single("inputimage"), addBlog);
app.get("/detailblog/:id", detailblog);
app.get("/another", project)

app.get("/update/:id", editBlog);
app.post("/updateblog/:id", upload.single("inputimage"),updateBlog);

app.get("/testimonial", testimonial);
app.get("/contact_me", contact_me);
app.post("/deleteblog/:id", deleteblog);

app.get("/login", loginView);
app.post("/login", login);
app.get("/register", registerView);
app.post("/register", register);
app.get("/logout", logout);



async function register(req, res) {
  const { name, email, password } = req.body;

  const query = `SELECT * FROM "Users" WHERE email='${email}'`;
  const objreq = await sequelize.query(query, { type: QueryTypes.SELECT });
  console.log("email", objreq);

  if (objreq.length >= 1) {
    req.flash("danger", "Register Failed: Email Already Use!");
    return res.redirect("/register");
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      req.flash("danger", "Password failde to be encyptionsss!");
      return res.redirect("/register");
    }
    const now = new Date();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayOfWeek = daysOfWeek[now.getDay()];
    const month = monthsOfYear[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    const formattedDate = `${dayOfWeek} ${month} ${day} ${year}`;
    await sequelize.query(
      `INSERT INTO public."Users"("name", "email", "password", "createdAt", "updatedAt") VALUES ('${name}','${email}','${hash}','${formattedDate}','${formattedDate}')`,
      { type: QueryTypes.INSERT }
    );

    req.flash("success", "Register Success!");

    res.redirect("/login");
  });
}

async function registerView(req, res) {
  res.render("register");
}

async function login(req, res) {
  const { email, password } = req.body;
  const query = await sequelize.query(
    `
    SELECT * FROM public."Users" WHERE email = '${email}'`,
    { type: QueryTypes.SELECT }
  );

  if (query.length === 0) {
    req.flash("danger", "Login Failed: Email or Password is wrong!");
    return res.redirect("/login");
  }

  bcrypt.compare(password, query[0].password, (err, result) => {
    if (err) {
      req.flash("danger", "Login Failed: Internal Server Error");
      return res.redirect("/login");
    }

    if (!result) {
      req.flash("danger", "Login Failed: Email or Password is wrong!");
      return res.redirect("/login");
    }

    req.flash("success", "Login Success!");
    req.session.isLogin = true;
    req.session.user = {
      name: query[0].name,
      email: query[0].email,
    };
    req.session.name = query[0].name;
    

    res.redirect("/home");
  });
}



async function loginView(req, res) {
  res.render("login");
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
}

function duration(awal, akhir) {
  const tanggalawal = new Date(awal);
  const tanggalakhir = new Date(akhir);

  const dis = tanggalakhir - tanggalawal;

  const dHours = Math.floor(dis / 1000 / 60 / 60);
  const dDay = Math.floor(dis / 1000 / 60 / 60 / 24);
  const dMounth = Math.floor(dis / 1000 / 60 / 60 / 24 / 30);
  const dyear = Math.floor(dis / 1000 / 60 / 60 / 24 / 30 / 12);

  if (dyear > 0) {
    return `${dyear} Year`;
  } else if (dMounth > 0) {
    return `${dMounth} Mounth`;
  } else if (dDay > 0) {
    return `${dDay} Day`;
  } else if (dHours > 0) {
  }
}

async function home(req, res) {
  
  const isLogin = req.session.isLogin;
  const user = req.session.user;

  const query = `SELECT "Users".name, "Blogs".* FROM "Users" RIGHT JOIN "Blogs" ON "Users".name = "Blogs".name ORDER BY "Users".name `;

  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  const sorted = obj.sort((a, b) => b.id - a.id);

  console.log(user);

  res.render("index", { data: sorted, isLogin, user});
  // console.log("obj: ", obj, );
}

async function myproject(req, res) {
  const isLogin = req.session.isLogin;
  const user = req.session.user;
  const authorName = req.session.user.name;

  const query = `SELECT "Users".name, "Blogs".* FROM "Users" RIGHT JOIN "Blogs" ON "Users".name = "Blogs".name WHERE "Users".name = '${authorName}' ORDER BY "Users".name `;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

  const sorted = obj.sort((a, b) => b.id - a.id);

  res.render("myproject",{data: sorted, isLogin, user});
}

async function addBlog(req, res) {
  try {

    const { id } = req.params;
    
    const {
      judul,
      startdate,
      enddate,
      content,
      nodejs,
      reactjs,
      nextjs,
      typescript,
    } = req.body;
    const inputimage = req.file ? req.file.filename : "";
    const authorName = req.session.user.name;

    if (!judul || !startdate || !enddate || !content || !inputimage || !(nodejs || reactjs || nextjs || typescript)) {
      req.flash("danger", "Semua data harus diisi");
      return res.redirect('/myproject'); 
    }


    const durasi = duration(startdate, enddate);

    let nodejsicon = "";
    let reactjsicon = "";
    let nextjsicon = "";
    let typescripticon = "";
    let nodejstext = "";
    let reactjstext = "";
    let nextjstext = "";
    let typescripttext = "";

    if (nodejs == "true") {
      nodejsicon = "fa-brands fa-google-play";
      nodejstext = "Nodejs";
    }

    if (reactjs == "true") {
      reactjsicon = "fa-brands fa-android";
      reactjstext = "Reactjs";
    }

    if (nextjs == "true") {
      nextjsicon = "fa-brands fa-js";
      nextjstext = "Nextjs";
    }
    if (typescript == "true") {
      typescripticon = "fa-brands fa-apple";
      typescripttext = "typescript";
    }

    let tglawal = startdate.split("-").reverse().join("-");
    let tglakhir = enddate.split("-").reverse().join("-");

    const now = new Date();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayOfWeek = daysOfWeek[now.getDay()];
    const month = monthsOfYear[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    const formattedDate = `${dayOfWeek} ${month} ${day} ${year}`;

    const dataBlog = await sequelize.query(
      `
  INSERT INTO public."Blogs" (
     "judul","name", "startdate", "enddate", "durasi", "content",
    "nodejs", "reactjs", "nextjs", "typescript", "inputimage", "nodejsicon",
    "reactjsicon", "nextjsicon", "typescripticon", "tglawal", "tglakhir",
    "nodejstext", "reactjstext", "nextjstext", "typescripttext", "createdAt", "updatedAt"
  ) VALUES (
     '${judul}','${authorName}', '${startdate}', '${enddate}', '${durasi}', '${content}',
    '${nodejs}', '${reactjs}', '${nextjs}', '${typescript}', '${inputimage}',
    '${nodejsicon}', '${reactjsicon}', '${nextjsicon}', '${typescripticon}',
    '${tglawal}', '${tglakhir}', '${nodejstext}', '${reactjstext}', '${nextjstext}',
    '${typescripttext}', '${formattedDate}', '${formattedDate}')`,
      { type: QueryTypes.INSERT }
    );

    // console.log("Title :", judul);
    // console.log("stardate :", startdate);
    // console.log("enddate :", enddate);
    // console.log("durasi :", durasi);
    // console.log("content :", content);
    // console.log("nodejs :", nodejs);
    // console.log("reactjs :", reactjs);
    // console.log("nextjs :", nextjs);
    // console.log("typescript :", typescript);
    // console.log("image :", inputimage);

    res.redirect("/myproject");
  } catch (error) {
    throw error;
  }
}

async function detailblog(req, res) {
  try {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    
    const { id } = req.params;
    
    const detail = await sequelize.query(
      `
    SELECT * FROM public."Blogs" WHERE id = ${id}`,
      { type: QueryTypes.SELECT }
    );

    console.log(detail);

    res.render("detailblog", { data: detail, isLogin, user });
  } catch (error) {
    throw error;
  }
}

async function editBlog(req, res) {
  try {
    const isLogin = req.session.isLogin;
    const user = req.session.user;

    const { id } = req.params;
    const editblog = await sequelize.query(
      `
    SELECT * FROM public."Blogs" WHERE id = ${id}`,
      { type: QueryTypes.SELECT }
    );
    res.render("updateblog", { data: editblog, isLogin, user });
  } catch (error) {
    throw error;
  }
}

async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const {
      judul,
      startdate,
      enddate,
      content,
      nodejs,
      reactjs,
      nextjs,
      typescript,
    } = req.body;

    const inputimage = req.file ? req.file.filename : "";
    const authorName = req.session.user.name;

    if (!judul || !startdate || !enddate || !content || !inputimage || !(nodejs || reactjs || nextjs || typescript)) {
      req.flash("danger", "Semua data harus diisi");
      return res.redirect(`/update/${id}`); 
    } 

    const durasi = duration(startdate, enddate);

    let nodejsicon = "";
    let reactjsicon = "";
    let nextjsicon = "";
    let typescripticon = "";
    let nodejstext = "";
    let reactjstext = "";
    let nextjstext = "";
    let typescripttext = "";

    if (nodejs == "true") {
      nodejsicon = "fa-brands fa-google-play";
      nodejstext = "Nodejs";
    }

    if (reactjs == "true") {
      reactjsicon = "fa-brands fa-android";
      reactjstext = "Reactjs";
    }

    if (nextjs == "true") {
      nextjsicon = "fa-brands fa-js";
      nextjstext = "Nextjs";
    }
    if (typescript == "true") {
      typescripticon = "fa-brands fa-apple";
      typescripttext = "typescript";
    }

    let tglawal = startdate.split("-").reverse().join("-");
    let tglakhir = enddate.split("-").reverse().join("-");

    const now = new Date();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayOfWeek = daysOfWeek[now.getDay()];
    const month = monthsOfYear[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    const formattedDate = `${dayOfWeek} ${month} ${day} ${year}`;

    const updated = await sequelize.query(
      `
  UPDATE public."Blogs"
  SET judul = '${judul}',
      name = '${authorName}',
      startdate = '${startdate}',
      enddate = '${enddate}',
      durasi = '${durasi}',
      content = '${content}',
      nodejs = '${nodejs}',
      reactjs = '${reactjs}',
      nextjs = '${nextjs}',
      typescript = '${typescript}',
      inputimage = '${inputimage}',
      nodejsicon = '${nodejsicon}',
      reactjsicon = '${reactjsicon}',
      nextjsicon = '${nextjsicon}',
      typescripticon = '${typescripticon}',
      tglawal = '${tglawal}',
      tglakhir = '${tglakhir}',
      nodejstext = '${nodejstext}',
      reactjstext = '${reactjstext}',
      nextjstext = '${nextjstext}',
      typescripttext = '${typescripttext}',
      "createdAt" = '${formattedDate}',
      "updatedAt" = '${formattedDate}'
  WHERE id = ${id}
`,
      { type: QueryTypes.UPDATE }
    );
    res.redirect("/home");
  } catch (error) {
    throw error;
  }
}

function testimonial(req, res) {
  const isLogin = req.session.isLogin;
  const user = req.session.user;

  res.render("testimonial",{isLogin, user});
}

function contact_me(req, res) {
  const isLogin = req.session.isLogin;
  const user = req.session.user;
  res.render("contact_me",{isLogin, user});
}

async function deleteblog(req, res) {
  try {
    const { id } = req.params;
    await sequelize.query(`DELETE FROM public."Blogs" WHERE id = ${id}`, {
      type: QueryTypes.DELETE,
    });

    res.redirect("/home");
  } catch (error) {
    throw error;
  }
}


function project(req, res){
  res.render("anotherproject")
}

app.listen(3000);
