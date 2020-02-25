# web-push-notification

**Please use [hexo-web-push-notification](https://github.com/glazec/hexo-web-push-notification) instead.**


![.github/workflows/main.yml](https://github.com/glazec/web-push-notification/workflows/.github/workflows/main.yml/badge.svg)
## Intro
This action is designed for blog to automately **push notification**.

When a new post releases, the action will push new web notification containg new post info (only one post per time).

## How it work
This action works with [hexo-detect-new-post](https://github.com/glazec/hexo-detect-new-post),[netlify](https://www.netlify.com), and [webPushr](https://app.webpushr.com/dashboard)

[hexo-detect-new-post](https://github.com/glazec/hexo-detect-new-post) is used to generate `newPost.json`, which contains the new post's information. [example](https://www.inevitable.tech/newPost.json).

[netlify](https://www.netlify.com) is used to host the new website. When the deploy webhook is triggered, netlify will build and publish the new site.

[webPushr](https://app.webpushr.com/dashboard) is used to manage the push the web notification.

When new post is pushed to github repo. This github action is triggered. It will compare `newPost.json` between github repo and the online site. Notice, at this time, the webhook is not triggered. This means the site containing the new post has **not** been deployed. If there is a difference between two `newPost.json`, the action will trigger webPushr api to make a new notification. At the end, the action will always trigger the netlify deploy webhook to update the new site hosted in netlify.

*Notice: To make everything work, you need to disable netlify's auto deploy. To achieve this, go to netlify github app setting and disallow it to read your site repo.*

## How to use

Here is an example of [.github/workflows/main.yml](https://github.com/glazec/glazec.github.io/blob/master/.github/workflows/main.yml).
```yaml
name: web push notification

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Push web notification
      id: notification
      uses: glazec/web-push-notification@v1.3
      env:
        webpushrKey: ${{ secrets.webpushrKey }}
        webpushrAuthToken: ${{ secrets.webpushrAuthToken }}
        newPostRepo: ${{ secrets.newPostRepo }}
        newPostOnlineSite: ${{ secrets.newPostOnlineSite }}
        buildHook: ${{ secrets.buildHook }}
```

Please remember to set these **five** environment variables. You can set it in setting->secrets.
```
        webpushrKey: **** # This is your webpushr api key.
        webpushrAuthToken: *** # This is your webpushr auth token
        newPostRepo: *** # This is the url of newPost.json from the repo.
        newPostOnlineSite: **** # This is the url of newPost.json from your site hosted by netlify.
        buildHook: *** # This is your netlify build hook.
```
