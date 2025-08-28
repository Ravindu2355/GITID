var owner = localStorage.getItem("Owner") || null ; //"Ravindu2355";
var token = localStorage.getItem("Tok") || null //"github_pat_11AVROLKI0eUaEEs8PSqt_GKlSV7Am5t1StXdg1SxMOZc80MCWUvRsM3qkuinm9RDEVQGBSA6fsKCeOQj";

if (owner && token) {
    document.querySelector(".OpenSection").style.display="none";
}

function setup() {
    ss=document.querySelector(".ss");
    n=document.getElementById("GTUN").value;
    k=document.getElementById("GTK").value;
    if (n=="" || k=="") {
           ss.classList.add("r");
           console.log("red");
    }else{ ss.classList.remove("r");
       localStorage.setItem("Owner",n );
       localStorage.setItem("Tok", k);
       location.reload();
    }
}

const fileValidateT = document.querySelector(".fvali");
async function fileExists() {
    const file_name = document.getElementById('file_name').value;
    if (file_name.split("").length < 10) {
        fileValidateT.innerHTML="";
        return;
    }
    fileValidateT.innerText="validating...";
    const repo = document.getElementById('repo').value || "RxVJson";
    const dir = document.getElementById('repo_path').value || "files";
    const path = `${dir}/${file_name}.txt`;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=main`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github.v3+json"
                // If it's a private repo, you need an Authorization token:
                // "Authorization": "token YOUR_GITHUB_TOKEN"
            }
        });

        if (res.status === 200) {
            console.log("✅ File exists");
            fileValidateT.innerText="✅ File exists";
            return true;
        } else if (res.status === 404) {
            console.log("❌ File not found");
            fileValidateT.innerText="❌ File not found";
            return false;
        } else {
            fileValidateT.innerText=`⚠️ Unexpected status: ${res.status}`;
            console.log(`⚠️ Unexpected status: ${res.status}`);
            return false;
        }
    } catch (err) {
        console.error("Error fetching file:", err);
        return false;
    }
}

// Example usage
//fileExists("octocat", "Hello-World", filename);

document.getElementById('file_name').addEventListener('input',function (e){
    document.querySelector('.ncout').textContent=e.target.value.length;
});

function getsrctype(){
    const selected = document.querySelector('input[name="sourceOption"]:checked');
    if (selected) {
        //alert("Selected source: " + selected.value);
        return selected.value; 
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set to content height
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => console.log("Copied to clipboard"))
    .catch(err => console.error("Copy failed:", err));
}

function encryptJson(text) {
  const key = CryptoJS.lib.WordArray.random(8).toString();
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return { text: encrypted, key };
}

document.getElementById('poster').addEventListener('input', e => {
  const url = e.target.value;
  const img = document.querySelector('.lgimg');
  img.src = url;
  img.style.display = 'block';
});

var des_img;

var dis_in = document.getElementById('description');
dis_in.addEventListener('input',function (e){
    autoResize(e.target);
    text=dis_in.value;
    dp=document.querySelector('.des_prev');
    if(des_img){
       url= document.querySelector('.des_img').src;
       dis_in.value=text.replace(/src="(.*?)"/g,`src="${url}"`);
    }
    dp.innerHTML=dis_in.value;
});

function dis_set() {
    text=dis_in.value;
    dp=document.querySelector('.des_prev');
    if(des_img){
       url= document.querySelector('.des_img').src;
       dis_in.value=text.replace(/src="(.*?)"/g,`src="${url}"`);
    }
    console.log(dis_in.value);
    dp.innerHTML=dis_in.value;
}



document.getElementById('des_pic_in').addEventListener('input', e => {
  url = e.target.value;
  const img = document.querySelector('.des_img');
  img.src = url;
  des_img=url;
  dis_set();
  img.style.display = 'block';
});

document.getElementById('src').addEventListener('input', e => {
  url = e.target.value;
  if (url.includes("/u/")){
      url = url.replace("u/","api/file/");
      e.target.value = url;
  }
  const video = document.querySelector('.vid');
  video.src = url;
  video.style.display = 'block';
});

document.getElementById('jsonForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const src = document.getElementById('src').value;
  const poster = document.getElementById('poster').value;
  const subf = document.getElementById('subf').value;
  const vbf = document.getElementById('vbf').value;
  const file_name = document.getElementById('file_name').value;
  const repo = document.getElementById('repo').value || "RxVJson";
  const dir = document.getElementById('repo_path').value || "files";
  //const token = "YOUR_GITHUB_TOKEN";
  //const owner = "Ravindu2355";
  const path = `${dir}/${file_name}.txt`;
  const srcType=getsrctype();
  const json = { title, description, src, poster, srcType, subfile: subf, vbfile: vbf};
  document.getElementById('jsonData').textContent = JSON.stringify(json, null, 2);

  const ejson = encryptJson(JSON.stringify(json));
  const encoded = btoa(ejson.text + "RvX" + ejson.key);

  try {
    const check = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { 'Authorization': `token ${token}` }
    });

    const method = check.ok ? "PUT" : "POST";
    const sha = check.ok ? (await check.json()).sha : null;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: { 'Authorization': `token ${token}` },
      body: JSON.stringify({
        message: "Upload via web",
        content: encoded,
        ...(sha && { sha })
      })
    });

    const result = await response.json();
    alert("File uploaded to GitHub!");
    console.log("GitHub URL:", result.content.download_url);
    copyToClipboard(result.content.download_url);
  } catch (err) {
    alert("Failed to upload to GitHub.");
    console.error(err);
  }
});

async function uploadFileToGitHub(file, repo, dir, token, owner) {
    const fileName = file.name;
    const path = `${dir}/${fileName}`;
    const content = await fileToBase64(file);

    // Check if file exists
    const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: { 'Authorization': `token ${token}` }
    });

    const filePayload = {
        message: `Upload ${fileName}`,
        content: content.split(',')[1],  // remove data: prefix
    };

    if (checkRes.ok) {
        const data = await checkRes.json();
        filePayload.sha = data.sha; // if exists, include sha to update
    }

    const uploadRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${token}` },
        body: JSON.stringify(filePayload)
    });

    const result = await uploadRes.json();
    return result.content.download_url;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


document.getElementById("poster_file").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;
    const repo = document.getElementById("repo").value || "Img"
    const dir = document.getElementById("repo_path").value || "files";

    const url = await uploadFileToGitHub(file, repo, dir, token, owner);
    document.getElementById("poster").value = url;
    document.querySelector(".lgimg").src = url;
});

document.getElementById("des_pic_in").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;
    const repo = document.getElementById("repo").value || "Img"
    const dir = document.getElementById("repo_path").value || "files";

    const url = await uploadFileToGitHub(file, repo, dir, token, owner);
    document.getElementById("des_pic").value = url;
    document.querySelector(".des_img").src = url;
    des_img = url;
    dis_set();
});

document.getElementById("subf_file").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;
    const repo = document.getElementById("repo").value || "srt";
    const dir = document.getElementById("repo_path").value || "files";

    const url = await uploadFileToGitHub(file, repo, dir, token, owner);
    document.getElementById("subf").value = url;
});

document.getElementById("vbf_file").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;
    const repo = document.getElementById("repo").value || "srt";
    const dir = document.getElementById("repo_path").value || "vibrate";

    const url = await uploadFileToGitHub(file, repo, dir, token, owner);
    document.getElementById("vbf").value = url;
});
