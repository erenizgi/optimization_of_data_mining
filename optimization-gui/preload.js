// preload.js
const { contextBridge } = require("electron");
const { fetchPagesCommits, fetchAllCommits } = require("./functions");

require('dotenv').config();

contextBridge.exposeInMainWorld("api", {
    fetchPagesCommits: fetchPagesCommits,
    fetchAllCommits: fetchAllCommits
});