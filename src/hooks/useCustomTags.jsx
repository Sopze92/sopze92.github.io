import React from 'react'
import { Functions } from "../context/AppContext.jsx"

const _CUSTOMTAGS_= {
  simple:[
    ["</#>", '</span>']
  ],
  complex:[
    ["<b-", [
      [/<b-([0-9]+)>/g, '<b class="b-%">'],
    ]],
    ["<i-", [
      [/<i-([0-9]+)>/g, '<i class="i-%">'],
    ]],
    ["<#-", [
      [/<#-([0-9]+)>/g, '<span class="color-%">'],
    ]],
    ["<a-", [
      [/<a-l:([^>]+)>/g, '<a href="%" target="_blank">'],
      [/<a-g:([^>]+)>/g, '<a href="https://sopze92.github.io/%" target="_blank">'],
      [/<a-h:([^>]+)>/g, '<a href="http://%" target="_blank">'],
      [/<a-hs:([^>]+)>/g, '<a href="https://%" target="_blank">']
    ]]
  ]
}

const useCustomTags= (taglist=_CUSTOMTAGS_)=>{

  function solveCustomTags(text){

    if(!text) return ""
    if(!text.includes('<')) return text
    let _text= text

    for(let tag of taglist.simple){
      if(text.includes(tag[0])) _text= _text.replaceAll(tag[0], tag[1])
    }

    // using masters to lower the amount of iterations

    for(let master of taglist.complex){
      if(text.includes(master[0])) {

        let matches
        for(let tag of master[1]){

          matches= Array.from(text.matchAll(tag[0]))??[];

          for(let match of matches){

            if(matches.length == 7) console.log(match)

            _text= _text.replace(match[0], tag[1].replace('%', match[1]))
          }
        }
      }
    }
    return _text
  }

  function innerHtml(raw){
    return {dangerouslySetInnerHTML:{ __html : solveCustomTags(raw) }}
  }

  return {
    checkSafety: (Functions.checkHtmlSafety),
    solveCustomTags,
    innerHtml
  }
}

export default useCustomTags