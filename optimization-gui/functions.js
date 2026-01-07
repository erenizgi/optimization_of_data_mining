const { Octokit } = require("@octokit/rest");
require('dotenv').config();
const fs = require('fs');
const path = require('path');


const token = process.env.GITHUB_ACCESS_TOKEN;
console.log(token);

const octokit = new Octokit({ auth: token });

function saveEachCommitToFile(commits, folder = "commits_output", setStatus) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    let skipped = 0;
    let written = 0;
    commits.forEach((commit, index) => {
        const filename = path.join(folder, `${commit.sha}.json`);
        if (fs.existsSync(filename)) {
            skipped++;
            console.log(`Skipped (exists): ${filename} ${index + 1}/${commits.length}`);
            setStatus && setStatus(`Skipped (exists): ${filename} ${index + 1}/${commits.length}`);
            return;
        }
        fs.writeFileSync(filename, JSON.stringify(commit, null, 4), { encoding: 'utf-8' });
        written++;
        console.log(`Saved: ${filename} ${index + 1}/${commits.length}`);
        setStatus(`Saved: ${filename} ${index + 1}/${commits.length}`);
    });
    console.log(`${written} commits saved, ${skipped} skipped (already exists), to ${folder}/`);
    setStatus(`${written} commits saved, ${skipped} skipped (already exists), to ${folder}/`);
    return [written, skipped];
}

const commitMetadataFormatter = (commit) => {

    console.log(commit);

    return {
        author: commit.author?.login ? commit.author.login : "unknown",
        message: commit.commit.message,
        sha: commit.sha,
        files: commit.files ? commit.files.map(file => file) : [""],
        stats: commit.stats ? commit.stats : { additions: 0, deletions: 0, total: 0 }
    }

}


async function getSingleCommit(owner, repo, sha) {
    const { data } = await octokit.repos.getCommit({
        owner,
        repo,
        ref: sha,
    });

    // Artık data.files içinde değişen dosya detayları var:
    return commitMetadataFormatter(data);
}

/*  Returns commit array */
async function fetchPagesCommits(owner, repo, page, setStatus) {
    console.log(`Fetching page ${page} of commits for ${owner}/${repo}`);
    setStatus(`Fetching page ${page} of commits for ${owner}/${repo}`);
    const res = await octokit.repos.listCommits({
        owner: owner,
        repo: repo,
        per_page: 100,  // Maximum GitHub lets you have
        page: page
    });
    if (res.data.length > 0) {
        console.log(res.data.length, "shas of commits fetched.");
        setStatus(`${res.data.length} shas of commits fetched.`)
    }
    else {
        return []
    }
    console.log("Fetching commits with details included files.")
    setStatus("Fetching commits with details included files.")

    const pagesCommits = [];
    for (let i = 0; i < res.data.length; i++) {
        const commitWithFiles = await getSingleCommit(owner, repo, res.data[i].sha);
        pagesCommits.push(commitWithFiles);
        console.log(`Fetched commit ${i + 1}/${res.data.length} on page ${page}`);
        setStatus(`Fetched commit ${i + 1}/${res.data.length} on page ${page}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay to respect rate limits

    }
    return pagesCommits;
}

async function fetchAllCommits(owner, repo, pageStart, pageEnd, setStatus) {
    let page = pageStart;
    let keepGoing = true;
    let [written, skipped] = [0, 0]
    const totalCommits = []
    while (keepGoing) {
        const allCommits = []

        if (page > pageEnd) {
            console.log("Reached page end limit.");
            setStatus("Reached page end limit.");
            keepGoing = false;
            break;
        }
        const data = await fetchPagesCommits(owner, repo, page, setStatus);
        if (data.length === 0) {
            console.log("No more commits to fetch, ending.");
            setStatus("No more commits to fetch, ending.");
            break
        }; // No more commits!
        data.forEach(commit => {
            allCommits.push(commit);
        });
        const returned = saveEachCommitToFile(allCommits, `./${owner}_${repo}_commits`, setStatus);
        written += returned[0];
        skipped += returned[1];
        page++;
        totalCommits.push(...allCommits);
    }
    console.log(`${written} commits saved, ${skipped} skipped (already exists), to ./${owner}_${repo}_commits/, Total: ${written + skipped}`);
    setStatus(`${written} commits saved, ${skipped} skipped (already exists), to ./${owner}_${repo}_commits/, Total: ${written + skipped}`);
    return totalCommits;
}

module.exports = {
    fetchAllCommits,
    fetchPagesCommits,
};