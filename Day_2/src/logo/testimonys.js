

let testimonys = new Promise((resolve, reject) => {
  const xlx = new XMLHttpRequest();


xlx.open("GET","https://api.npoint.io/e6717caf5e2f5403b3c9",true);

xlx.onload = function () {
  if (xlx.status == 200) {
    resolve(JSON.parse(xlx.response));
  } else {
    reject("error");
  };
}

xlx.onerror = function() {
  reject("Not Found")
};

xlx.send();

});

function testimonipage(item) {
  return `
  <div class="card d-flex" style="width: 30%; max-height: 300px; min-width: 330px">
  <img src="./${item.gambar}" class="card-img-top" alt="..." style="max-height:160px; object-fit: cover;">
  <div class="card-body">
    <p class="card-text">${item.quote}</p>
    <p class="card-text"><small class="text-body-secondary text-end">- ${item.nama}</small></p>
    <p class="card-text"><small class="text-body-secondary text-end">${item.rating}<i class="fa-solid fa-star"></i></small></p>
  </div>
</div>


    `;
  }

async function allrating(item) {
  try {
    const respon = await testimonys;
    let testimony = ``;
    respon.forEach(function(item) {
        testimony += testimonipage(item)
      });
        document.getElementById("containertestimonial").innerHTML = testimony;
    }catch(error){
    console.log(error);
  }

};
allrating();


async function filterrating(rating) {
  try {
    const respon = await testimonys;
    let testimony = ``;
    const testifilter = respon.filter((item) => { 
         return item.rating === rating;
     });
     if (testifilter.length === 0) {
        testimony =  `<h2>"data not found"</h2>`;
     } else {
        testifilter.forEach(function(item) { 
            testimony += testimonipage(item);
         });
     }
     
     (document.getElementById("containertestimonial").innerHTML = testimony);
  } catch (error) {
    console.log(error);
  }
    
}

// <div class="bordertestimonial">
    //             <div style= "max-height : 196px;">
    //                 <img src="./${item.gambar}" alt="" class="gambarorang">
    //             </div>
    //             <div>
    //                 <p>"${item.quote}"</p>
    //             </div>
    //             <div class="conquote">
    //                 <p class="quote">- ${item.nama}</p>
    //             </div>
    //             <div class="conrating">
    //                 <p class="quote">${item.rating} <i class="fa-solid fa-star"></i></p>
    //             </div>
    // </div>

