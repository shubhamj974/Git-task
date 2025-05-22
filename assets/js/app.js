let cl = console.log;
const form = document.getElementById('form');
const search = document.getElementById('search');
const mainContent = document.getElementById('mainContent');

const baseUrl = `https://api.github.com/users/`;

let gitArr = [];

const gitTemplating = (arr) => {
    let result = '';
    arr.forEach(ele => {
        mainContent.innerHTML = result +=
        `
            <div class="card mt-4 text-white">
                <div class="card-body">
                    <div class="row p-4">
                        <figure class="avtar-img m-0">
                            <img class="img-fluid avtar" src="${ele.avatar_url}" alt="${ele.name}">
                        </figure>
                        <div class="main-content ml-4">
                            <h3>${ele.name}</h3>
                            <p></p>
                            <ul class="Follow d-flex p-0 my-4">
                                <li> <strong><a href="javasvript:;" target="_blank">${ele.followers} Follower</a></strong></li>
                                <li> <strong><a href="javasvript:;" target="_blank">${ele.following} Following</a></strong></li>
                                <li> <strong><a href="javasvript:;" target="_blank">${ele.public_repos} Repos</a></strong></li>
                            </ul>
                            <div id="ReposList"></div>
                            
                        </div>
                    </div>
                </div>
            </div>
        `
    })
}



form.addEventListener('submit', (e) => {
    e.preventDefault();
    gitArr = [];
    mainContent.innerHTML = '';

    let gitUrl = `${baseUrl}${search.value}`;
    let reposUrl = `${baseUrl}${search.value}/repos?sort=created`;

    const makeAPiCall = (method, apiUrl, body) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest;
            xhr.open(method, apiUrl);
            xhr.onload = () => {
                xhr.status >= 200 && xhr.status < 300 ? resolve(xhr.response) : reject('Something went wrong');
            }
            xhr.send(body);
        });
    };

    makeAPiCall('GET', gitUrl)
        .then((res) => {
            let data = JSON.parse(res);
            gitArr.push(data);
            gitTemplating(gitArr);
            cl(gitArr);
            return makeAPiCall('GET', reposUrl);
        })
        .then((res) => {
            let reposData = JSON.parse(res);
            let arr = [...reposData];
            let fiveRepos = arr.slice(0, 5);
            cl(fiveRepos);

            const allCards = document.querySelectorAll('.card');
            const latestCard = allCards[allCards.length - 1];
            const ReposList = latestCard.querySelector('#ReposList');

            let ul = document.createElement('ul');
            ul.className = `Repos d-flex p-0`;

            let result = '';
            fiveRepos.forEach(repo => {
                result += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`;
            });

            ul.innerHTML = result;
            ReposList.append(ul);
        })
        .catch((err) => {
            cl(err);
            mainContent.innerHTML = `<div class="alert alert-danger mt-3">${err}</div>`;
        })
        .finally(() => {
            e.target.reset();
        });
});

 