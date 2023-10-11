//---------------------------------------------------------------
//                     Construct the Button                    --
//---------------------------------------------------------------

// Define script for a new image open button (derrived from the share button)
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

// Use the dom parser to convert the buttonScript string into a node
const parser = new DOMParser()
const openImageButton = parser.parseFromString(buttonScript, 'text/html').body.firstChild




//---------------------------------------------------------------
//                   Check Posts on Time Interval              --
//---------------------------------------------------------------

// Takes a node list and filters to only contain image posts
function filterImagePosts(container) {
    return Array.from(container.children).filter(node =>
        node.nodeName === 'SHREDDIT-POST' &&
        (node.getAttribute('post-type') === 'image' || 
         node.getAttribute('post-type') === 'gallery')
    )
}

function addButtonToPosts() {

    ////////////////////////  Assemble List of All Posts  ////////////////////////
    
    // Define the main post container node (contains initial posts and batches of new posts)
    const postContainerNode = document.querySelector('report-flow-provider')

    // Collect posts directly under report-flow-provider
    let allPosts = filterImagePosts(postContainerNode)

    // Collect posts under any faceplate-batch children of report-flow-provider
    const faceplateBatches = postContainerNode.querySelectorAll('faceplate-batch')
    for (let batch of faceplateBatches) {
        allPosts = allPosts.concat(filterImagePosts(batch))
    }

    // Collect posts under any shreddit-feed children of report-flow-provider
    const shredditFeeds = postContainerNode.querySelectorAll('shreddit-feed')
    for (let feed of shredditFeeds) {
        allPosts = allPosts.concat(filterImagePosts(feed))
    }


    ////////////////////////  Add Buttons  ////////////////////////

    // Check each image post for openImageButton and add if not present
    for (let post of allPosts) {
      if (!post.shadowRoot.querySelector('button[data-action="open-image"]')) {
        
        // Identify the buttonBarNode of the post
        let buttonBarNode = post.shadowRoot.querySelector('.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start')
        
        // Add the button
        buttonBarNode.appendChild(openImageButton.cloneNode(true))
      }
    }
}

// Run the assemblePostList function every 2 seconds
setInterval(addButtonToPosts, 2000)




//---------------------------------------------------------------
//                    Listen for Button Clicks                 --
//---------------------------------------------------------------

document.addEventListener('click', function(event) {
  // Get the full path of the event, including elements inside shadow DOMs
  const path = event.composedPath()

  // Search within the first 3 elements in the path for a button element with the 'open-image' action
  for (let i = 0; i < Math.min(3, path.length); i++) {
      const element = path[i]
      if (element.nodeName === 'BUTTON' && element.dataset && element.dataset.action === 'open-image') {

        // Identify the post dom element in the path (3 elements past the button element)
        const postNode = postElement = path[i+3]

        // Identify the image source link for the post
        const sourceLink = findSourceLink(postNode)

        //send a message to background.js as an array containing an identifying message and the link
        chrome.runtime.sendMessage(["Open this image link", sourceLink])

        // Exit the loop once we've found the element
        break
      }
  }
})




//---------------------------------------------------------------
//                   findSourceLink Function                   --
//---------------------------------------------------------------

// function findSourceLink(postNode) {
//   //identify the image node
//   if (postNode.querySelector(multiImageDom)) {
//     //for multi-image posts, find the container that is currently displayed
//     //  will show left:0px when initially loaded, then left: 0px after switching between images
//     displayedImageContainer = postNode.querySelector('[style="left:0px"], [style="left: 0px"]')

//     console.log(postNode)
//     //console.log(displayedImageContainer)
//     //navigate to the image node within the container
//     imageNode = displayedImageContainer.querySelector(multiImageDom)
//   } else {
//     //handle single-image posts
//     imageNode = postNode.querySelector(singleImageDom)
//   }
  
//   let rawLink = imageNode.src

//   //get source link for reddit images
//   if (rawLink.substr(0, 23) == 'https://preview.redd.it') {
//     newLink = 'https://i.redd.it' + rawLink.substr(23, rawLink.indexOf('?')-23)
  
//   //get source link for external images
//   } else if (rawLink.substr(0, 32) == 'https://external-preview.redd.it') {
//     newLink = postNode.querySelector(externalLinkDom).getAttribute('href')
  
//   //push remaining good links through
//   } else if (rawLink.substr(0, 17) == 'https://i.redd.it') {
//     newLink = rawLink
//   }

//   //return the output
//   return newLink
// }