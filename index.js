const fetch = require("node-fetch");
const core = require("@actions/core");
const github = require("@actions/github");

async function main() {
  try {
    // Get newPost.json from your site.
    var newPostOnlineSite = await fetch(process.env.newPostOnlineSite);
    newPostOnlineSite = await newPostOnlineSite.json();
    newPostOnlineSite = JSON.parse(JSON.stringify(newPostOnlineSite));
    // Get newPost.json from your repo.
    var newPostRepo = await fetch(process.env.newPostRepo);
    // Get newPost.json from the repo
    newPostRepo = await newPostRepo.json();
    newPostRepo = JSON.parse(JSON.stringify(newPostRepo));
    console.table({
      "From online site": newPostOnlineSite,
      "From Repo": newPostRepo
    });

    //publish the site
    fetch(process.env.buildHook, { method: "POST" });
    console.info("Trigger Netlify deploy");

    //determine whether to push web notification
    if (newPostOnlineSite.id != newPostRepo.id) {
      // push new Post notification

      payload = {
        title: newPostRepo.title,
        message: newPostRepo.summary,
        target_url: "posts/"+newPostRepo.id
      };
      const response = await fetch(
        "https://app.webpushr.com/api/v1/notification/send/all",
        {
          method: "POST",
          headers: {
            webpushrKey: process.env.webpushrKey,
            webpushrAuthToken: process.env.webpushrAuthToken,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // NOT res.status >= 200 && res.status < 300
        console.info(JSON.stringify(data));
        core.setOutput(
          "msg",
          JSON.stringify({ statusCode: data.status, body: data.detail })
        );
      } else {
        console.info("Successfully push notification");
        core.setOutput("msg", "Successfully push notification");
      }
    } else {
      console.info("No New Post detected.");
      core.setOutput("msg", "No New Post detected.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
