//---------------------------------------------------------------
//                     DOM Element References                  --
//---------------------------------------------------------------

const postContainerNode = document.querySelector('report-flow-provider')
const homepagePostContainerNode = postContainerNode.querySelector(':scope > shreddit-feed')




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

//takes a node list at the post level
function addButtonToPosts(nodes) {

  //filter node list to only contain image posts
  posts = Array.from(nodes).filter(node =>
    node.nodeName === 'SHREDDIT-POST' &&
    (node.getAttribute('post-type') === 'image' || 
      node.getAttribute('post-type') === 'gallery')
  )

  // if there are image posts, check each post for openImageButton and add if not present
  if (posts.length) {
    for (let post of posts) {
      if (!post.shadowRoot.querySelector('button[data-action="open-image"]')) {
        
        // Identify the buttonBarNode
        const buttonBarNode = post.shadowRoot.querySelector('.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start')
        
        //add the button
        buttonBarNode.appendChild(openImageButton.cloneNode(true))
      }
    }
  }
}




//---------------------------------------------------------------
//                        Process Posts                        --
//---------------------------------------------------------------

function processPosts() {

  //process posts on reddit homepage
  if (homepagePostContainerNode) {
    
    //process initial posts located directly under report-flow-provider
    //  (tried using DOMContentLoaded event listener, but it wouldn't fire because the dom already loaded
    //  before this script was run. Try *** code at bottom of document if it acts up)
    addButtonToPosts(homepagePostContainerNode.childNodes)

    //set up the mutation observer to catch new post batches
    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.addedNodes.length) {  
          //delay 1000ms before executing, otherwise nodes may return null
          setTimeout(() => {addButtonToPosts(mutation.addedNodes)}, 1000)
        }
      }
    })
    observer.observe(homepagePostContainerNode, { childList: true })


  //process posts on other pages (subreddits, user profiles)
  } else {

    //process initial posts located directly under report-flow-provider
    addButtonToPosts(postContainerNode.childNodes)

    //set up the mutation observer to catch new post batches
    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
          
          // Loop through all added nodes
          for (let node of mutation.addedNodes) {

            //process if the node is faceplate-batch
            if (node.nodeName === 'FACEPLATE-BATCH') {
                //delay 1000ms before executing, otherwise nodes may return null
                setTimeout(() => {addButtonToPosts(node.childNodes)}, 1000)
            }
          }
        }
      }
    })
    observer.observe(postContainerNode, { childList: true })
  }
}

//run the processPosts function when the page loads
processPosts()

//run the processPosts function when navigated to a different page
document.addEventListener('NavigateEvent', function(event) {
  // Check if the navigationType is 'traverse'
  if (event.detail && event.detail.navigationType === 'push') {
    processPosts()
  }
})




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




//---------------------------------------------------------------
//                   unused code                   --
//---------------------------------------------------------------

//***
// if (document.readyState === 'loading') {  // If document is still loading, add the event listener
//   document.addEventListener('DOMContentLoaded', function() {
//       console.log("Inside DOMContentLoaded listener");
//       setTimeout(() => {addButtonToPosts(homepagePostContainerNode.childNodes)}, 1000);
//   });
// } else {  // Otherwise, directly execute your code
//   console.log("Directly invoking the code as the document is already parsed");
//   setTimeout(() => {addButtonToPosts(homepagePostContainerNode.childNodes)}, 1000);
// }