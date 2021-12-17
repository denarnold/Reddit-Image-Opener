//---------------------------------------------------------------
//                     DOM Element References                  --
//---------------------------------------------------------------

const postContainerDom = 'div.rpBJOHq2PR60pnwJlUyP0'
const buttonBarDom = '._3-miAEojrCvx_4FQ8x3P-s'
const buttonClass = '_3U_7i38RDPV5eBv7m4M-9J' //award button class, but could be any in the button bar

const imageDom = '._2_tDEnGMLxpM6uOa2kaDB3'
const externalLinkDom = '._13svhQIUZqD9PVzFcLwOKT'
//const shareButtonDom = '._3sUJGnemgtNczijwoT8PGg'




//---------------------------------------------------------------
//                       doStuff Function                      --
//---------------------------------------------------------------

function doStuff(imageNode, postNode){
  let rawLink = imageNode.src

  console.log(imageNode)
  console.log(postNode)

  //get original link for reddit images
  if (rawLink.substr(0, 23) == 'https://preview.redd.it') {
    newLink = 'https://i.redd.it' + rawLink.substr(23)
  
  //get original link for external images
  } else if (rawLink.substr(0, 32) == 'https://external-preview.redd.it') {
    newLink = postNode.querySelector(externalLinkDom).getAttribute('href')
  
  //push remaining good links through
  } else if (rawLink.substr(0, 17) == 'https://i.redd.it') {
    newLink = rawLink
  }

  console.log(newLink)
  
  //add a link button to the post (it is just a link, not an actual button)
  //create button
  let btn = document.createElement('a')
  btn.setAttribute('href', newLink)
  btn.innerHTML = "Original Image"
  btn.target = '_blank'
  btn.rel = 'noreferrer noopener'

  //create a new node
  let newNode = document.createElement("div")
  //set one of the existing button class names to the new node so that the link is centered in the bar
  newNode.className = buttonClass
  //add the button to the node
  newNode.append(btn)

  console.log(newNode)

  //append the button to the button bar
  let buttonBar = postNode.querySelector(buttonBarDom)
  buttonBar.append(newNode)

  console.log(buttonBar)
}




//---------------------------------------------------------------
//                 Handle Initial Page Load Posts              --
//---------------------------------------------------------------

//create a list all initial posts when page first loads
initialPosts = document.querySelectorAll(postContainerDom)[0].childNodes

//iterate through the list. If a post contains the image dom reference, send it to the doStuff function
for (post of initialPosts) {
  if (post.querySelector(imageDom)) {
    console.log('sending initial load to function')
    doStuff(post.querySelector(imageDom), post)
  }
}




//---------------------------------------------------------------
//                      Handle Page Updates                    --
//---------------------------------------------------------------

//callback function to execute when mutations are observed
const callback = function(mutations, observer) {

  console.log(mutations)

  //iterate through mutations. Sometimes it is a list of 1, sometimes 2.
  //  It seems each mutation only ever contains a single added node.
  for (mutation of mutations) {
    
    //if the mutation node contains the image dom reference, send it to doStuff function
    if (mutation.addedNodes[0].querySelector(imageDom)) {
      doStuff(
        mutation.addedNodes[0].querySelector(imageDom),
        mutation.addedNodes[0]
      )
    }
  }
}

//Set up the mutation observer. Look for new children within the postContainerDom dom element.
new MutationObserver(callback).observe(
  document.querySelector(postContainerDom),
  {childList: true}
)