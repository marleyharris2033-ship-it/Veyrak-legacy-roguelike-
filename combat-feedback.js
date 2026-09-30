// Combat feedback is transient: it never becomes part of a saved run.
const listeners=new WeakMap();
export function emitFeedback(run,event){listeners.get(run)?.push(event);}
export function captureFeedback(run,action){
 const events=[];listeners.set(run,events);
 try{return {ok:action(),events};}finally{listeners.delete(run);}
}

export async function presentFeedback(events,{motion=true,hero='kaerun'}={}){
 if(!events.length)return;
 const layer=document.createElement('div');layer.className='combat-fx-layer'+(motion?'':' combat-fx-still');layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
 const timers=[],animations=[];
 const sprite=key=>key==='player'?document.querySelector('.combat-hero'):key==='companion'?document.querySelector('.companion-art'):document.querySelector(`.enemy-target[data-index="${Number(key.split(':')[1])}"] .enemy-art`);
 const anchor=key=>{const el=sprite(key),r=el?.getBoundingClientRect();return r?{el,x:r.left+r.width/2,y:r.top+r.height*.55}:null;};
 const schedule=(fn,delay)=>timers.push(setTimeout(fn,delay));
 const animate=(el,frames,duration)=>{if(motion&&el?.isConnected)animations.push(el.animate(frames,{duration,easing:'ease-out'}));};
 const number=(at,text,kind,offset=0)=>{const n=document.createElement('span');n.className='combat-fx-number '+kind;n.textContent=text;n.style.left=at.x+'px';n.style.top=(at.y+offset)+'px';layer.appendChild(n);};
 let hits=0,lastDelay=0;
 for(const event of events){
  const at=anchor(event.target);if(!at)continue;
  const delay=motion?Math.min(hits*85,340):0;lastDelay=Math.max(lastDelay,delay);
  if(event.kind==='hit'){
   hits++;
   const from=anchor(event.source),spell=event.source==='player'&&hero==='ilyra';
   schedule(()=>{
    if(from&&event.source!==event.target){
     const direction=at.x>=from.x?1:-1;
     animate(from.el,[{translate:'0px 0px'},{translate:`${direction*(spell?8:20)}px -3px`,offset:.35},{translate:'0px 0px'}],240);
     if(motion){const trail=document.createElement('i');trail.className='combat-fx-trail '+(spell?'crystal-bolt':'gauntlet-swipe');trail.style.left=from.x+'px';trail.style.top=from.y+'px';trail.style.width=Math.hypot(at.x-from.x,at.y-from.y)+'px';trail.style.rotate=Math.atan2(at.y-from.y,at.x-from.x)+'rad';layer.appendChild(trail);}
    }
   },delay);
   schedule(()=>{
    const direction=event.target==='player'?-1:1;
    animate(at.el,[{translate:'0px 0px',filter:getComputedStyle(at.el).filter},{translate:`${direction*9}px 0px`,filter:'brightness(1.7)',offset:.3},{translate:'0px 0px',filter:getComputedStyle(at.el).filter}],220);
    if(event.damage>0)number(at,'−'+event.damage,'damage');
    if(event.blocked>0)number(at,event.damage>0?'Blocked '+event.blocked:'BLOCKED '+event.blocked,'blocked',event.damage>0?30:0);
    if(!event.damage&&!event.blocked)number(at,'0','blocked');
    if(event.blockBreak)number(at,'BLOCK BROKEN','block-break',-30);
    if(motion){const burst=document.createElement('i');burst.className='combat-fx-impact'+(spell?' crystal-impact':'');burst.style.left=at.x+'px';burst.style.top=at.y+'px';layer.appendChild(burst);if(event.heavy&&event.damage>0)animate(document.querySelector('.arena'),[{translate:'0px 0px'},{translate:'-2px 1px'},{translate:'2px -1px'},{translate:'0px 0px'}],160);}
   },delay+(motion?95:0));
  }else schedule(()=>{
   number(at,event.text,event.kind,event.offset||0);
   if(['guard','heal'].includes(event.kind))animate(at.el,[{filter:getComputedStyle(at.el).filter},{filter:`drop-shadow(0 0 16px ${event.kind==='heal'?'#79ebbd':'#9be4ff'})`,offset:.4},{filter:getComputedStyle(at.el).filter}],300);
  },delay);
 }
 try{await new Promise(resolve=>schedule(resolve,motion?lastDelay+650:240));}
 finally{timers.forEach(clearTimeout);animations.forEach(a=>a.cancel());layer.remove();}
}
