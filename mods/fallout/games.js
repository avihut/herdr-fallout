import { shared,setShared } from "herdr";
import { div,h_flex,v_flex,pal,txt,root,btn,shell,award } from "./kit.js";
import { newHack,guess,bracket,newSalvage,move,MAP } from "./game.js";
export class Hacking {
  init(){this.reset();}
  reset(){this.g=newHack();}
  render(){const c=pal(),g=this.g;
    const body=v_flex().gap(10).child(txt("ROBCO / PASSWORD TRAINING",20)).child(txt("SIMULATOR · No connection to your terminals or credentials",11,c.faint))
    .child(h_flex().gap(8).items_center().child(txt("ATTEMPTS "+"■ ".repeat(g.tries)+"□ ".repeat(4-g.tries),15)).child(div().flex_1()).child(btn("reset","NEW SEED",()=>this.reset())))
    .child(h_flex().gap(16).items_start().child(v_flex().w(300).gap(3).children(g.words.map((w,i)=>h_flex().gap(8).items_center().child(txt("0x"+(0xf000+i*12).toString(16).toUpperCase(),11,c.faint)).child(btn("word-"+w,g.removed.includes(w)?"....":w,()=>{if(guess(g,w)&&g.state==="won"){award("Hacker");setShared("fallout.hackWins",(shared("fallout.hackWins")??0)+1);}},g.guesses.includes(w)).h(24)).child(txt(["#!;.*","^|%:!","?.:/*"][i%3],12,c.faint)))))
    .child(v_flex().flex_1().min_w(0).gap(8).child(txt("TERMINAL OUTPUT",11,c.faint)).children(g.log.slice(-9).map(s=>txt(s,12))).child(div().flex_1()).child(txt("Paired brackets hide assistance.",11,c.faint)).child(h_flex().gap(8).children(["<._.>","[!;!]","{:@:}"].map((s,i)=>btn("bracket-"+i,g.used.includes(i)?".....":s,()=>bracket(g,i)))))))
    .child(txt(g.state==="won"?"CERTIFICATE STORED IN INV. You may safely eject.":g.state==="lost"?"Lockout affects only this game. NEW SEED resets it.":"COLD vs CORD = 3/4. A matching letter in another position does not count.",11,c.faint));
    return shell("HOLOTAPE 01 / SECURITY TRAINER",body);
  }
}
export class Salvage {
  init(_p,cx){this.f=cx.focus_handle();this.g=newSalvage();this.f.focus();}
  step(dx,dy){if(move(this.g,dx,dy)&&this.g.state==="won"){award("Pathfinder");const best=shared("fallout.salvageBest");if(!best||this.g.steps<best)setShared("fallout.salvageBest",this.g.steps);}}
  render(){const c=pal(),g=this.g;return shell("HOLOTAPE 02 / WASTELAND COURIER",v_flex().gap(10).track_focus(this.f).on_key_down((e,cx)=>{const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]}[e.key];if(d){this.step(...d);cx.stop_propagation();cx.notify();}})
      .child(txt("ORIGINAL TURN-BASED HOLOTAPE SIMULATOR",12,c.faint)).child(txt("Collect all 3 C caches, then reach V. 22 fuel. Walls cost no fuel.",12))
      .child(h_flex().gap(20).items_start().child(v_flex().gap(3).children(MAP.map((row,y)=>h_flex().gap(3).children([...row].map((tile,x)=>{const me=g.x===x&&g.y===y,taken=g.caps.includes(x+","+y);return btn("tile-"+x+"-"+y,me?"@":tile==="C"&&taken?"·":tile==="."?"·":tile,()=>{this.f.focus();this.step(x-g.x,y-g.y);},me).w(35).h(35);}))))).child(v_flex().gap(10).child(txt("FUEL "+g.fuel,18)).child(txt("CACHES "+g.caps.length+"/3",15)).child(txt("MOVES "+g.steps,12)).child(txt("BEST "+(shared("fallout.salvageBest")??"—"),12)).child(btn("up","↑",()=>this.step(0,-1))).child(h_flex().gap(4).child(btn("left","←",()=>this.step(-1,0))).child(btn("down","↓",()=>this.step(0,1))).child(btn("right","→",()=>this.step(1,0)))).child(btn("restart","REWIND",()=>{this.g=newSalvage();this.f.focus();}))))
      .child(txt(g.state==="won"?"DELIVERY COMPLETE · Pathfinder badge stored.":g.state==="lost"?"OUT OF FUEL · Rewind the tape to try a shorter route.":"Arrow keys / WASD / click an adjacent square / direction buttons",12))
      .child(txt("@ courier    # obstruction    C cache    V vault exit",11,c.faint)).child(txt("No timers. Every move is yours. No real resources are consumed.",11,c.faint)));
  }
}
