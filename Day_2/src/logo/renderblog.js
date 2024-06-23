let dataproject = [];

function inputblog(event) {
  event.preventDefault();

  let projectname = document.getElementById("projectname").value;
  let startdate = new Date(document.getElementById("firstdate").value);
  let enddate = new Date(document.getElementById("enddate").value);
  let description = document.getElementById("description").value;
  let nodejs = document.getElementById("nodejs").checked;
  let reactjs = document.getElementById("reactjs").checked;
  let nextjs = document.getElementById("nextjs").checked;
  let typescript = document.getElementById("typescript").checked;
  let uploadimage = document.getElementById("uploadimage").files;

  if (projectname == "") {
    alert("nama project tidak boleh kosong");
  } else if (startdate == "") {
    alert("start date harus diisi");
  } else if (enddate == "") {
    alert("end date tidak boleh kosong");
  } else if (description == "") {
    alert("description tidak boleh kosong");
  } else if (
    nodejs == "" &&
    reactjs == "" &&
    nextjs == "" &&
    typescript == ""
  ) {
    alert("silahkan pilih salah satu technologies");
  } else if (uploadimage == "") {
    alert("silahkan masukkan gambar");
  } else {
    alert("postingan anda sudah dibuat");
  }

  inputimage = URL.createObjectURL(uploadimage[0]);

  const renderblog = {
    title: projectname,
    body: description,
    nodejs,
    reactjs,
    nextjs,
    typescript,
    image: inputimage,
    postAt: new Date(),
    startdate,
    enddate,
  };
  dataproject.push(renderblog);
  // console.log("dataArray:", dataproject);
}

function timeinfo(time) {
  const thistime = new Date().getTime();
  const timeposted = time;

  const distance = thistime - timeposted;

  const distanceSeconds = Math.floor(distance / 1000);
  const distanceMinutes = Math.floor(distance / 1000 / 60);
  const distanceHours = Math.floor(distance / 1000 / 60 / 60);
  const distanceDay = Math.floor(distance / 1000 / 60 / 60 / 24);
  const distanceMounth = Math.floor(distance / 1000 / 60 / 60 / 24 / 30);

  console.log(distanceSeconds);
  console.log(distanceMinutes);
  console.log(distanceHours);
  console.log(distanceDay);
  console.log(distanceMounth);

  if (distanceMounth > 0) {
    return `${distanceMounth} Mounth Ago`;
  } else if (distanceDay > 0) {
    return `${distanceDay} Day Ago`;
  } else if (distanceHours > 0) {
    return `${distanceHours} Hours Ago`;
  } else if (distanceMinutes > 0) {
    return `${distanceMinutes} Minutes Ago`;
  } else if (distanceSeconds > 0) {
    return `Just now`;
  }
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

function renderProject() {
  document.getElementById("content").innerHTML = "";
  for (let index = 0; index < dataproject.length; index++) {
    document.getElementById("content").innerHTML += `

              <div class="card d-flex" style="width: 18rem;">
                <img src="${dataproject[index].image}" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">${dataproject[index].title}</h5>
                          <h6 class="card-subtitle mb-2 text-body-secondary">Durasi: ${duration(dataproject[index].startdate,dataproject[index].enddate)} </h6>
                          <h6 class="card-subtitle mb-2 text-body-secondary">dipost: ${timeinfo(dataproject[index].postAt)} </h6>
                          <p class="card-text">${dataproject[index].body}</p>
                          <h6 class="card-subtitle mb-2 text-body-secondary">
    ${
      dataproject[index].nodejs == ""
        ? ""
        : '<i class="fa-brands fa-google-play" style= "font-size: 1.2em;"></i>'
    }
    ${
      dataproject[index].reactjs == ""
        ? ""
        : '<i class="fa-brands fa-android" style= "font-size: 1.2em;"></i>'
    }
    ${
      dataproject[index].nextjs == ""
        ? ""
        : '<i class="fa-brands fa-js" style= "font-size: 1.2em;"></i>'
    }
    ${
      dataproject[index].typescript == ""
        ? ""
        : '<i class="fa-brands fa-apple" style= "font-size: 1.2em;"></i>'
    }
    </h6>
          <div class="d-flex justify-content-between">
                          <a href="#" class="btn btn-primary">Edit Blog</a>
                          <a href="#" class="btn btn-primary text-end">Delete blog</a>
          </div>
                            </div>
                                        </div>

          `;
  }
}

setInterval(function () {
  renderProject();
}, 1000);

{
  /* <div class="w-25 justify-content-center rounded-4">
<div class="w-100 d-flex align-items-center justify-content-center">
    <img src="${
      dataproject[index].image
    }" alt="image upload" class ="w-50" />
</div>
<div class="blog-content">
        <a href="" target="_black" class="w-25">${
          dataproject[index].title
        }</a>
        <div class="infopost">
    <div class = "mt-0">
          <p>
              Durasi: ${duration(
                dataproject[index].startdate,
                dataproject[index].enddate
              )}
          </p>
    </div>
    <div class = "infotime">
          <p>
              Dipost : ${timeinfo(dataproject[index].postAt)}
          </p>
    </div>
        <div>
    <div class ="isi">
    <p>
        ${dataproject[index].body}
    </p>
    </div>
    <div class="detail-blog">
    ${
      dataproject[index].nodejs == ""
        ? ""
        : '<i class="fa-brands fa-google-play" style= "font-size: 1.2em;"></i>'
    }
    ${
      dataproject[index].reactjs == ""
        ? ""
        : '<i class="fa-brands fa-android" style= "font-size: 1.2em;"></i>'
    }
    ${
      dataproject[index].nextjs == ""
        ? ""
        : '<i class="fa-brands fa-js" style= "font-size: 1.2em;"></i>'
    }
    ${
      dataproject[index].typescript == ""
        ? ""
        : '<i class="fa-brands fa-apple" style= "font-size: 1.2em;"></i>'
    }
    </div>
    <div class="btn-group">
        <button class="btnedit"> Edit Blog </button>
        <button class="btnpost"> Post Blog </button>
    </div>
</div>
</div> */
}
