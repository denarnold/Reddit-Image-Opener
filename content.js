//---------------------------------------------------------------
//                     DOM Element References                  --
//---------------------------------------------------------------

// const postContainerNode = document.querySelector('report-flow-provider')
// const postNode = document.querySelector('shreddit-post')
// const buttonBarNode = postNode.shadowRoot.querySelector('.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start')

// const singleImageDom = '._2_tDEnGMLxpM6uOa2kaDB3'
// const multiImageDom = '._1dwExqTGJH2jnA-MYGkEL-'
// const externalLinkDom = '._13svhQIUZqD9PVzFcLwOKT'




//---------------------------------------------------------------
//                     Construct the Button                    --
//---------------------------------------------------------------

//define script for a new image open button (derrived from the share button)
const buttonScript = `<button rpl=""
    class="button border-md flex flex-row justify-center items-center mr-sm h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover"
    style="height: var(--size-button-sm-h); font: var(--font-button-sm)"
    type="button"
    data-action="open-image"
    aria-haspopup="true"
    aria-expanded="false"
    >
    <span class="flex items-center">
      <span>
        Open Image
      </span>
    </span>
  </button>`

//use the dom parser to convert the buttonScript string into a node
const parser = new DOMParser()
const openImageButton = parser.parseFromString(buttonScript, 'text/html').body.firstChild




//---------------------------------------------------------------
//                  addButtonToPosts Function                  --
//---------------------------------------------------------------

//takes in a list of post nodes
function addButtonToPosts(posts) {

  // For each post, check if openImageButton exists in the button bar and add it if not
  for (let post of posts) {
    if (!post.shadowRoot.querySelector('button[data-action="open-image"]')) {
      
        // Identify the buttonBarNode
        const buttonBarNode = post.shadowRoot.querySelector('.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start')
        
        //add the button
        buttonBarNode.appendChild(openImageButton.cloneNode(true))
    }
  }
}




//---------------------------------------------------------------
//             Mutation Observer - New Post Batches            --
//---------------------------------------------------------------

//set up the mutation observer
const postContainerNode = document.querySelector('report-flow-provider')
const observer = new MutationObserver(mutations => {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      
      // Loop through all added nodes
      for (let node of mutation.addedNodes) {

        // Check if the added node is a faceplate-batch
        if (node.nodeName === 'FACEPLATE-BATCH') {

          console.log("Added faceplate-batch node:", node)

          // Filter its children to get the posts we're interested in
          const addedPosts = Array.from(node.childNodes).filter(post => 
            post.nodeName === 'SHREDDIT-POST' &&
            (post.getAttribute('post-type') === 'image' || 
              post.getAttribute('post-type') === 'gallery')
          )

          // If there are eligible posts, process them
          if (addedPosts.length) {
            setTimeout(() => {
              console.log("Here are the addedPosts: ", addedPosts)
              addButtonToPosts(addedPosts)
            }, 1000)  // 1000ms delay
          }
        }
      }
    }
  }
})

observer.observe(postContainerNode, { childList: true })




//---------------------------------------------------------------
//             Handling Initial Posts            --
//---------------------------------------------------------------

//building this out for subreddits. Will need to reinvestigate for reddit homepage
function addButtons() {

  // Get initial posts directly under report-flow-provider
  const postContainerNode1 = document.querySelector('report-flow-provider')
  const dom1Posts = Array.from(postContainerNode1.childNodes)
      .filter(node =>
        node.nodeName === 'SHREDDIT-POST' &&
        (node.getAttribute('post-type') === 'image' ||
          node.getAttribute('post-type') === 'gallery')
      )

  // Get additional posts under faceplate-batch.
  // This is a child of report-flow-provider where new posts are added.
  const postContainerNode2 = postContainerNode1.querySelector('faceplate-batch')
  const dom2Posts = postContainerNode2 
      ? Array.from(postContainerNode2.childNodes).filter(node => 
          node.nodeName === 'SHREDDIT-POST' &&
          (node.getAttribute('post-type') === 'image' || 
            node.getAttribute('post-type') === 'gallery')
      ): []

  // Combine the two lists
  const allPosts = [...dom1Posts, ...dom2Posts]

  
  //for every post, check if openImageButton exists in the button bar and add it if not
  for (let post of allPosts) {
    if (!post.shadowRoot.querySelector('button[data-action="open-image"]')) {

      //identify the buttonBarNode
      buttonBarNode = post.shadowRoot.querySelector('.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start')

      //add the openImageButton
      buttonBarNode.appendChild(openImageButton.cloneNode(true))
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

// document.addEventListener("click", function(btn) {

//   if (btn.target.innerText == "Open Image") {

//     //find the image node and image source for that post
//     let postNode = btn.target.closest(postDom)
//     let sourceLink = findSourceLink(postNode)

//     //send a message to background.js as an array containing an identifying message and the link
//     chrome.runtime.sendMessage(["Open this image link", sourceLink])
//   }
// })



document.addEventListener('click', function(event) {
  // Get the full path of the event, including elements inside shadow DOMs
  const path = event.composedPath()

  // Search within the first 3 elements in the path for a button element with the 'open-image' action
  for (let i = 0; i < Math.min(3, path.length); i++) {
      const element = path[i]
      if (element.nodeName === 'BUTTON' && element.dataset && element.dataset.action === 'open-image') {

          console.log('Open Image button clicked!')

          //identify the post dom element in the path (3 elements past the button element)
          const postElement = path[i+3]

          console.log(postElement)

          // //execute the findSourceLink function
          // findSourceLink(postElement)

          break // Exit the loop once we've found the element
      }
  }
})




//---------------------------------------------------------------
//                   findSourceLink Function                   --
//---------------------------------------------------------------

function findSourceLink(postNode) {
  //identify the image node
  if (postNode.querySelector(multiImageDom)) {
    //for multi-image posts, find the container that is currently displayed
    //  will show left:0px when initially loaded, then left: 0px after switching between images
    displayedImageContainer = postNode.querySelector('[style="left:0px"], [style="left: 0px"]')

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
    newLink = 'https://i.redd.it' + rawLink.substr(23, rawLink.indexOf('?')-23)
  
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