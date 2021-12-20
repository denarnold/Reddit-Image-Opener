//---------------------------------------------------------------
//                     DOM Element References                  --
//---------------------------------------------------------------

const postContainerDom = 'div.rpBJOHq2PR60pnwJlUyP0'
const buttonBarDom = '._3-miAEojrCvx_4FQ8x3P-s'
const buttonClass = '_3U_7i38RDPV5eBv7m4M-9J' //award button class, but could be any in the button bar

const imageDom = '._2_tDEnGMLxpM6uOa2kaDB3'
const externalLinkDom = '._13svhQIUZqD9PVzFcLwOKT'
const validUrlRegex = new RegExp('.*(\.reddit.com\/)(r\/([^\/]*)\/)?$')




//---------------------------------------------------------------
//                   findSourceLink Function                   --
//---------------------------------------------------------------

function findSourceLink(imageNode, postNode) {
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
//                       addButton Function                    --
//---------------------------------------------------------------

function addButton(postNode) {
  //create button
  let btn = document.createElement('a')
  btn.innerHTML = "Open Image"
  btn.setAttribute('href', '#!')

  //create a new node
  let newNode = document.createElement("div")
  //set one of the existing button class names to the new node so that the link is centered in the bar
  newNode.className = buttonClass
  //add the button to the node
  newNode.append(btn)

  //append the button to the button bar
  let buttonBar = postNode.querySelector(buttonBarDom)
  buttonBar.append(newNode)
}




//---------------------------------------------------------------
//                   Check Posts on Time Interval              --
//---------------------------------------------------------------

function checkPosts() {
  //validate that reddit is either on the main page or a community page
  //  (this is just for effeciency)
  if(validUrlRegex.test(window.location.href)) {
  
    //create a list of all posts
    posts = document.querySelectorAll(postContainerDom)[0].childNodes

    //iterate through the list
    for (post of posts) {

      //check if post is an image post
      if (post.querySelector(imageDom)) {

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
  
  if (btn.target.innerHTML == "Open Image") {

    //find the image node and image source for that post
    let postNode = btn.path[4]
    let imageNode = postNode.querySelector(imageDom)
    let sourceLink = findSourceLink(imageNode, postNode)

    //send a message to background.js as an array containing an identifying message and the link
    chrome.runtime.sendMessage(["Open this image link", sourceLink])
  }
})