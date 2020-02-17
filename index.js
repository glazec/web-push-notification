const fetch = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');

async function maim() {
    try {
        // Get newPost.json from your site.
        var newPostOnlineSite = await fetch('https://www.inevitable.tech/newPost.json')
        newPostOnlineSite = await newPostOnlineSite.json();
        newPostOnlineSite = JSON.parse(JSON.stringify(newPostOnlineSite));
        // Get newPost.json from your repo.
        var newPostRepo = await fetch('https://raw.githubusercontent.com/glazec/glazec.github.io/master/newPost.json')
        newPostRepo = await newPostRepo.json();
        newPostRepo = JSON.parse(JSON.stringify(newPostRepo))
        console.log(newPostOnlineSite)
        console.log(newPostRepo)
    
        //publish the site
        fetch(process.env.buildHook, { method: 'POST' });
    
        if (newPostOnlineSite.id != newPostRepo.id) {   
            // push new Post notificaiton
    
            payload = { "title": newPostRepo.title, "message": newPostRepo.summary, "target_url": newPostRepo.url }
            const response = await fetch('https://app.webpushr.com/api/v1/notification/send/all', {
                method: 'POST',
                headers: {
                    'webpushrKey': process.env.webpushrKey,
                    'webpushrAuthToken': process.env.webpushrAuthToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
    
            if (!response.ok) {
                // NOT res.status >= 200 && res.status < 300 
                return JSON.stringify({ statusCode: data.status, body: data.detail });
            }
            return (
                "Successfully push notification"),
            
    
    
        }
        else {
            return (
                "No New Post detected.");
        }
    
    } catch (error) {
        core.setFailed(error.message);
    }

}

main()