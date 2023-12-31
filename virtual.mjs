/**
 * virtual.js
 * ~ virtual file management
 * authored by 9r3i
 * https://github.com/9r3i/virtual.js
 * started at november 21st 2023
 */
;function virtual(files){
/* virtual version */
Object.defineProperty(this,'version',{
  value:'1.1.0',
  writable:false,
});
/* virtual prefix */
this.prefix='virtual/';
/* registered files */
this.files=typeof files==='object'&&files!==null?files:{};
/* load a file -- must be registered */
this.load=async function(f){
  /* check registered files */
  if(!this.files.hasOwnProperty(f)){
    return false;
  }
  let c=this.get(f);
  if(!c){
    c=await this.update(f);
    if(!c){
      return false;
    }
  }
  if(f.match(/\.css$/)){
    return this.exec(c,'style',f);
  }else if(f.match(/(\.module\.js|\.mjs)$/)){
    return this.exec(c,'module',f);
  }else if(f.match(/\.js$/)){
    return this.exec(c,'script',f);
  }
  return false;
};
/* update a file -- must be registered */
this.update=async function(f){
  /* check registered files */
  if(!this.files.hasOwnProperty(f)){
    return false;
  }
  /* fetch from the source */
  let v=this.files[f],
  d=v.match(/^@([a-z]+\/[^:]+):/),
  w=d?v.substr(1):v,
  c=await fetch(w)
    .then(r=>r.text())
    .catch(e=>alert('Error: Failed to fetch "'+w+'".'));
  if(typeof c!=='string'){
    return false;
  }
  this.put(f,d?'data:'+d[1]+';base64,'+btoa(c):c);
  return c;
};
/* put */
this.put=function(f,c){
  if(typeof f==='string'&&typeof c ==='string'){
    localStorage.setItem(this.prefix+f,c);
    return true;
  }return false;
};
/* get */
this.get=function(f){
  let r=false;
  if(typeof f==='string'){
    r=localStorage.getItem(this.prefix+f);
  }return typeof r==='string'?r:false;
};
/* delete */
this.delete=function(f){
  localStorage.removeItem(this.prefix+f);
  return true;
};
/* clear all virtual files or all storage */
this.clear=function(a){
  if(a){
    localStorage.clear();
    return true;
  }
  let r=0,
  x=new RegExp('^'+this.prefix).toString();
  for(let i=0;i<localStorage.length;i++){
    let f=localStorage.key(i);
    if(f.match(x)){
      localStorage.removeItem(f);
      r++;
    }
  }return r;
};
/* list of all virtual files or all keys on the storage */
this.list=function(a){
  let r=[],
  x=new RegExp('^'+this.prefix,'');
  for(let i=0;i<localStorage.length;i++){
    let f=localStorage.key(i);
    if(a||f.match(x)){
      r.push(f);
    }
  }return r;
};
/* execute string */
this.exec=function(s,t,i){
  let w={
    script:['script','text/javascript'],
    module:['script','module'],
    style:['style','text/css'],
  },
  u=typeof t==='string'&&w.hasOwnProperty(t)?w[t]:w.script,
  c=document.createElement(u[0]);
  c.type=u[1];
  c.textContent=typeof s==='string'?s:'';
  c.id=typeof i==='string'?this.prefix+i:new Date().getTime();
  document.head.appendChild(c);
  return c;
};
};

export default virtual;
