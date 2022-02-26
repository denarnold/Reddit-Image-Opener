//---------------------------------------------------------------
//                     DOM Element References                  --
//---------------------------------------------------------------

const postContainerDom = 'div.rpBJOHq2PR60pnwJlUyP0'
const postDom = '._1poyrkZ7g36PawDueRza-J'
const buttonBarDom = '._3-miAEojrCvx_4FQ8x3P-s'

const singleImageDom = '._2_tDEnGMLxpM6uOa2kaDB3'
const multiImageDom = '._1dwExqTGJH2jnA-MYGkEL-'
const externalLinkDom = '._13svhQIUZqD9PVzFcLwOKT'
const validUrlRegex = new RegExp('.*(\.reddit.com\/)(r\/([^\/]*)\/)((?!comments).)*$')




//---------------------------------------------------------------
//                     Create Button Class                     --
//---------------------------------------------------------------

//create a new button class called "openImageClass"
//  Elements coppied from share button class 'kU8ebCMnbXfjCWfqn0WPb' but removed the :focus portion
//  because the button would stay highlighted after being clicked.
var style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = '.openImageClass{border-radius:2px;padding:8px;display:-ms-flexbox;display:flex;' +
                  '-ms-flex-align:center;align-items:center;text-transform:capitalize;height:100%}' +
                  '.openImageClass:hover{background-color:var(--newRedditTheme-navIconFaded10);outline:none}'

document.getElementsByTagName('head')[0].appendChild(style)




//---------------------------------------------------------------
//                       addButton Function                    --
//---------------------------------------------------------------

function addButton(postNode) {
  //create button
  btn = document.createElement('button')
  btn.innerHTML = "Open Image"
  btn.className = 'openImageClass'

  //append the button to a new node
  newNode = document.createElement("div")
  newNode.append(btn)

  //append the button to the button bar
  let buttonBar = postNode.querySelector(buttonBarDom)
  buttonBar.append(newNode)
}




//---------------------------------------------------------------
//                   findSourceLink Function                   --
//---------------------------------------------------------------

function findSourceLink(postNode) {
  //identify the image node
  if (postNode.querySelector(multiImageDom)) {
    //for multi-image posts, find the container that is currently displayed
    //  will show left:0px when initially loaded, then left: 0px; after switching between images
    displayedImageContainer = postNode.querySelector('[style="left:0px"], [style="left: 0px;"]')

    console.log(postNode)
    //console.log(displayedImageContainer)
    //navigate to the image node within the container
    imageNode = displayedImageContainer.querySelector(multiImageDom)
  } else {
    //handle single-image posts
    imageNode = postNode.querySelector(singleImageDom)
  }
  
  let rawLink = imageNode.src

  //get source link for reddit images
  if (rawLink.substr(0, 23) == 'https://preview.redd.it') {
    newLink = 'https://i.redd.it' + rawLink.substr(23)
  
  //get source link for external images
  } else if (rawLink.substr(0, 32) == 'https://external-preview.redd.it') {
    newLink = postNode.querySelector(externalLinkDom).getAttribute('href')
  
  //push remaining good links through
  } else if (rawLink.substr(0, 17) == 'https://i.redd.it') {
    newLink = rawLink
  }

  //return the output
  return newLink
}




//---------------------------------------------------------------
//                   Check Posts on Time Interval              --
//---------------------------------------------------------------

function checkPosts() {
  //validate that reddit is either on the main page or a subreddit
  //  (this is just for effeciency)
  if(validUrlRegex.test(window.location.href)) {
  
    //create a list of all posts
    posts = document.querySelectorAll(postContainerDom)[0].childNodes

    //iterate through the list
    for (post of posts) {

      //check if post is an image post
      if (post.querySelector([singleImageDom, multiImageDom].join())) {

        //if post doesn't already contain the Source Image button, add one
        //  not exactly sure how formula works, copied from a webpage
        if ((Array.from(post.querySelectorAll('div')).find(el => el.textContent === 'Open Image')) == undefined ) {
          addButton(post)
        }
      }
    }
  }
}

//run checkPosts immediately on page load
checkPosts()

//run checkposts every x seconds
setInterval(checkPosts, 2000)




//---------------------------------------------------------------
//                    Listen for Button Clicks                 --
//---------------------------------------------------------------

document.addEventListener("click", function(btn) {

  if (btn.target.innerText == "Open Image") {

    //find the image node and image source for that post
    let postNode = btn.target.closest(postDom)
    let sourceLink = findSourceLink(postNode)

    //send a message to background.js as an array containing an identifying message and the link
    chrome.runtime.sendMessage(["Open this image link", sourceLink])
  }
})