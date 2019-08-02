import { app } from "electron";
import { BrowserWindow } from "electron";
import path = require("path");
import url = require("url");

let win: BrowserWindow;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    win.loadURL(url.format({
        pathname: path.resolve(__dirname, "client", "index.html"),
        protocol: "file:",
        slashes: true,
    }));
}

app.on("ready", createWindow);
