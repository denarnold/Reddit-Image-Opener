/*
//replace top story
document.querySelector('.gs-c-promo-heading').innerText = 'A new headline!';

//replace top paragraph
document.querySelector('.gs-c-promo-heading').parentElement.querySelector('p').innerText = 'A new block of summary text';
*/


(function () {
    function fnAddLink() {
        var a = document.createElement('a');
        a.setAttribute('href', 'www.google.com');
        a.innerHTML = "Google"
        document.querySelector("._3-miAEojrCvx_4FQ8x3P-s").appendChild(a);
    }

    fnAddLink();
})();



// <div data-ignore-click="false" class="_3U_7i38RDPV5eBv7m4M-9J">
// <button class="_10K5i7NW6qcm-UoCtpB3aK YszYBnnIoNY8pZ6UwCivd _3yh2bniLq7bYr4BaiXowdO _2sAFaB0tx4Hd5KxVkdUcAx _28vEaVlLWeas1CDiLuTCap">
// <span class="pthKOcceozMuXLYrLlbL1">
// <i class="_1Xe01txJfRB9udUU85DNeR icon icon-save"> ::before == $0 </i>
// </span>
// <span class="_2-cXnP74241WI7fpcpfPmg _70940WUuFmpHbhKlj8EjZ">
// save
// </span>
// </button>
// </div>