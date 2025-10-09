const { Octokit } = require("@octokit/rest");
require('dotenv').config();

const token = process.env.GITHUB_ACCESS_TOKEN;
console.log(token);

const octokit = new Octokit({ auth: token });

/*  Returns commit array */
async function fetchPagesCommits(owner, repo, page) {
    const res = await octokit.repos.listCommits({
        owner: owner,
        repo: repo,
        per_page: 100,  // Maximum GitHub lets you have
        page: page
    });
    console.log(res.data);
    return res.data || []
}

async function fetchAllCommits(owner, repo) {
    const allCommits = []
    let page = 1;
    let keepGoing = true;

    while (keepGoing) {
        const data = await fetchPagesCommits(owner, repo, page);
        if (data.length === 0) break; // No more commits!
        data.forEach(commit => {
            console.log(commit.sha, commit.commit.message);
            allCommits.push(commit);
        });


        page++;
    }
    return allCommits;
}

module.exports = {
    fetchAllCommits,
    fetchPagesCommits,
};