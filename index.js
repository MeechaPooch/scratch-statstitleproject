///// SET YOUR USERNAME, PASSWORD, AND PROJECT ID HERE /////////
const info = {
    username: "ilhp10",
    password: "its a secret!!!",
    projectId: "509531164"
}
//////////////////////////////////////////////////////////////


import Scratch from "scratch-api"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function commafy(numStr) {
    numStr = new String(numStr)
    for(let i=numStr.length-3; i>0; i-=3) {
        numStr = numStr.slice(0,i) + ',' + numStr.slice(i,numStr.length)
    }
    return numStr
}

let lastProjectStats = {}

import fetch from "node-fetch"


async function start() {Scratch.UserSession.create(info.username, info.password, async (err, user) => {
    let token;
    if (err) {
         console.log(err)
    } else {

        // get session token!
        let sessionJson = await (await fetch("https://scratch.mit.edu/session/", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en, en;q=0.8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": `scratchlanguage=en; scratchsessionsid=${user.sessionId}; scratchcsrftoken=X8VBEl8rfW8qE5QcAanYOXXPXmlC00uH; permissions=%7B%22admin%22%3Afalse%2C%22scratcher%22%3Atrue%2C%22new_scratcher%22%3Afalse%2C%22social%22%3Atrue%2C%22educator%22%3Afalse%2C%22educator_invitee%22%3Afalse%2C%22student%22%3Afalse%2C%22mute_status%22%3A%7B%7D%7D`
            },
            "referrer": "https://scratch.mit.edu/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors"
        })).json();
        token = sessionJson.user.token;
        // console.log(token)
        user.cloudSession(info.projectId, async (err, sess) => {
            while (true) {
		        await sleep(1000)
                try{

                let projectStats = (await (await fetch(`https://api.scratch.mit.edu/projects/${info.projectId}`)).json()).stats;
                // if(projectStats.loves === lastProjectStats.loves && projectStats.favorites === lastProjectStats.favorites && projectStats.remixes === lastProjectStats.remixes && projectStats.views === lastProjectStats.views) {continue;}
                // else {lastProjectStats = projectStats}
                 // console.log(projectStats)

                fetch(`https://api.scratch.mit.edu/projects/${info.projectId}`, {
                    "headers": {
                        "accept": "application/json",
                        "accept-language": "en, en;q=0.8",
                        "content-type": "application/json",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "x-token": token
                    },
                    "referrer": "https://scratch.mit.edu/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `{\"title\":\"This project has ${commafy(projectStats.views)} VIEWS\",\"instructions\":\"This project has:\\n${commafy(projectStats.views)} VIEWS, \\n${commafy(projectStats.loves)} LOVES,\\n${commafy(projectStats.favorites)} FAVORITES,\\n${commafy(projectStats.remixes)} REMIXES!\\nRead notes/credits to learn how it works!\"}`,
                    "method": "PUT",
                    "mode": "cors"
                }).then(async res => {/*console.log(await res.json()) */});


                sess.set("☁ loves", projectStats.loves);
                sess.set("☁ faves", projectStats.favorites);
                sess.set("☁ remixes", projectStats.remixes);
                sess.set("☁ views", projectStats.views);
                sess.set("☁ newScratcherTestVal", 1);
                console.log('done')
            } catch(err) {
                console.log(err)
                start();
		        break;
                // return;
            }
            }
        })
    }
});
}

start();
