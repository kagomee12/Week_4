const express = require("express");
const path = require("path");
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json")
const sequelize = new Sequelize(config.development);
const { models } = require("./models/blog");
// const { log } = require("console");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.urlencoded({ extended: false }));

app.use("/logo", express.static(path.join(__dirname, "src/logo")));

app.get("/home", home);
app.get("/myproject", myproject);
app.post("/myproject", addBlog);
app.get("/detailblog/:id", detailblog);

app.get("/update/:id", editBlog);
app.post("/updateblog/:id",updateBlog)
// app.get("/updateblog", updateblog);

app.get("/testimonial", testimonial);
app.get("/contact_me", contact_me);
app.post("/deleteblog/:id", deleteblog);



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
  const query = `SELECT * FROM "Blogs"`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  const sorted = obj.sort((a, b) => b.id - a.id);
  res.render("index", { data: sorted });
  console.log('obj: ', obj)
}

function myproject(req, res) {
  res.render("myproject");
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
      inputimage,

    } = req.body;

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
const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dayOfWeek = daysOfWeek[now.getDay()];
const month = monthsOfYear[now.getMonth()];
const day = now.getDate();
const year = now.getFullYear();

const formattedDate = `${dayOfWeek} ${month} ${day} ${year}`;



const dataBlog = await sequelize.query(`
  INSERT INTO public."Blogs" (
     "judul", "startdate", "enddate", "durasi", "content",
    "nodejs", "reactjs", "nextjs", "typescript", "inputimage", "nodejsicon",
    "reactjsicon", "nextjsicon", "typescripticon", "tglawal", "tglakhir",
    "nodejstext", "reactjstext", "nextjstext", "typescripttext", "createdAt", "updatedAt"
  ) VALUES (
     '${judul}', '${startdate}', '${enddate}', '${durasi}', '${content}',
    '${nodejs}', '${reactjs}', '${nextjs}', '${typescript}', '${inputimage}',
    '${nodejsicon}', '${reactjsicon}', '${nextjsicon}', '${typescripticon}',
    '${tglawal}', '${tglakhir}', '${nodejstext}', '${reactjstext}', '${nextjstext}',
    '${typescripttext}', '${formattedDate}', '${formattedDate}')`, { type: QueryTypes.INSERT });


      

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


 

    res.redirect("/home");
  }
  catch (error) { 
    throw error
  }
}

async function detailblog(req, res) {
  try{const { id } = req.params;

  const detail = await sequelize.query(`
    SELECT * FROM public."Blogs" WHERE id = ${id}`,{ type: QueryTypes.SELECT });

    console.log(detail)

  res.render("detailblog", {data: detail });
  }catch (error) {
    throw error
  }
}



async function editBlog(req, res) {
  try{ 
  const { id } = req.params;
  const editblog = await sequelize.query(`
    SELECT * FROM public."Blogs" WHERE id = ${id}`,{ type: QueryTypes.SELECT });
    res.render("updateblog", {data: editblog });
  }catch(error){
    throw error
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
      inputimage,

    } = req.body;

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
const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dayOfWeek = daysOfWeek[now.getDay()];
const month = monthsOfYear[now.getMonth()];
const day = now.getDate();
const year = now.getFullYear();

const formattedDate = `${dayOfWeek} ${month} ${day} ${year}`;

 const updated = await sequelize.query(`
  UPDATE public."Blogs"
  SET judul = '${judul}',
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
`,{ type: QueryTypes.UPDATE});
    res.redirect("/home");
  }
  catch (error) { 
    throw error
  }
}

// function updateblog(req, res){
//   res.render("/updateblog")
// }

function testimonial(req, res) {
  res.render("testimonial");
}
function contact_me(req, res) {
  res.render("contact_me");
}

async function deleteblog(req, res) {
  try {
    const { id } = req.params
    await sequelize.query(`DELETE FROM public."Blogs" WHERE id = ${id}`,{ type: QueryTypes.DELETE })

    res.redirect('/home')
} catch (error) {
    throw error
}
}

app.listen(3000);
