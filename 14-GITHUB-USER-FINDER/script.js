const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");
const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioElement = document.getElementById("bio");
const locationElement = document.getElementById("location");
const joinedDateElement = document.getElementById("joined-date");
const profileLink = document.getElementById("profile-link");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("public-repos");
const companyElement = document.getElementById("company");
const blogElement = document.getElementById("blog");
const twitterElement = document.getElementById("twitter");
const companyContainer = document.getElementById("company-container");
const blogContainer = document.getElementById("blog-container");
const twitterContainer = document.getElementById("twitter-container");
const reposContainer = document.getElementById("repos-container");


const apiUrl = "https://api.github.com/users/";

searchBtn.addEventListener("mouseover", ()=>{
    searchBtn.classList.add("enlarge-btn");
    searchBtn.textContent="search";
    searchBtn.classList.remove("fas","fa-search");
})
searchBtn.addEventListener("mouseout", ()=>{
    searchBtn.classList.remove("enlarge-btn");
        searchBtn.textContent="";
    searchBtn.classList.add("fas","fa-search");
})
searchBtn.addEventListener("click", searchUser)
searchInput.addEventListener("keypress", (e)=>{
    if(e.key === "Enter") searchUser();
})

async function searchUser(){
    const username = searchInput.value.trim();
    if(username === ""){
        errorContainer.classList.remove("hidden");
        errorContainer.textContent = "Please enter a username";
        return;
    }
    else{
        try{
            profileContainer.classList.add("hidden");
            errorContainer.classList.add("hidden");
            const res = await fetch(`${apiUrl}${username}`);
            if(!res.ok){
                errorContainer.classList.remove("hidden");
                return;
            }

            const userData = await res.json();
            displayUserData(userData) //THIS WILL FORMAT AND DISPLAY THE USER STATS

            fetchRepositories(userData.repos_url);
        }catch(err){
            showError(err);
        }
    }
}

function showError(err){
    errorContainer.classList.remove("hidden");
    errorContainer.textContent = err.message;
    profileContainer.classList.add("hidden");
}

function displayUserData(userData){
    const {
        avatar_url,
        name,
        login,
        bio,
        location,
        created_at,
        blog,
        company,
        twitter_username,
        public_repos,
        followers: followersCount,
        following: followingCount,
        html_url
    } = userData;

    avatar.src = avatar_url;
    nameElement.textContent = name || login;
    usernameElement.textContent = `@${login}`;
    bioElement.textContent = bio || "No bio available";
    locationElement.textContent = location || "Not specified";
    // joinedDateElement.textContent = new Date(created_at).toLocaleDateString();  //this is for normal format
    joinedDateElement.textContent = formatDate(created_at);
    profileLink.href = html_url;

    followers.textContent = followersCount;
    following.textContent = followingCount;
    repos.textContent = public_repos;

    companyElement.textContent = company || "Not specified";
    blogElement.textContent = blog || "No Website";
    blogElement.href = blog ? blog : "#";
    twitterElement.textContent = twitter_username ? `@${twitter_username}` : "No Twitter";
    twitterElement.href = twitter_username ? `https://twitter.com/${twitter_username}` : "#";

    company ? companyContainer.classList.remove("hidden") : companyContainer.classList.add("hidden");
    blog ? blogContainer.classList.remove("hidden") : blogContainer.classList.add("hidden");
    twitter_username ? twitterContainer.classList.remove("hidden") : twitterContainer.classList.add("hidden");

    profileContainer.classList.remove("hidden");
}
function formatDate(created_at){
    return new Date(created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

async function fetchRepositories(reposUrl){
    reposContainer.innerHTML = '<div class="loading-repos">Loading Repositories....</div>';

    try{
        const res = await fetch(reposUrl);
        const repos = await res.json();
        //todo: Sort the Array
        const sortedRepos = repos.toSorted(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        //todo: Check if the array is sorted
        // for(let i = 0; i < sortedRepos.length; i++){
        //     let dateCr = sortedRepos[i].created_at
        //     console.log(dateCr);
        // }
        displayRepos(sortedRepos);
    }catch(error){
        reposContainer.innerHTML = '<div class="no-repos">error.message</div>';
    }
}

function displayRepos(repos){

    if(repos.length === 0){
        reposContainer.innerHTML = '<div class="no-repos">No Repositories Found</div>';
        return;
    }
    reposContainer.innerHTML="";
    repos.forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";

        const updatedAt = formatDate(repo.updated_at);

        repoCard.innerHTML = `
      <a href="${repo.html_url}" target="_blank" class="repo-name">
        <i class="fas fa-code-branch"></i> ${repo.name}
      </a>
      <p class="repo-description">${repo.description || "No description available"}</p>
      <div class="repo-meta">
        ${
            repo.language
                ? `
          <div class="repo-meta-item">
            <i class="fas fa-circle"></i> ${repo.language}
          </div>
        `
                : ""
        }
        <div class="repo-meta-item">
          <i class="fas fa-star"></i> ${repo.stargazers_count}
        </div>
        <div class="repo-meta-item">
          <i class="fas fa-code-fork"></i> ${repo.forks_count}
        </div>
        <div class="repo-meta-item">
          <i class="fas fa-history"></i> ${updatedAt}
        </div>
      </div>
    `;
        reposContainer.appendChild(repoCard);
    });
}



// todo: remove this default value
// searchInput.value = "yuvasec";
// searchUser();
