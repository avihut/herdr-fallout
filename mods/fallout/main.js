import { View } from "gpui-kit";
import { props,spaces,agents,panes,machines,focused,theme,settings,shared,setShared,run,layouts,setAgentOrder,window as appWindow,exec } from "herdr";
import { div,svg,h_flex,v_flex,pal,txt,root,btn,rule,signal,open,menu,close,shell,award } from "./kit.js";
import { Hacking,Salvage } from "./games.js";
import { parseNetwork,parseBattery } from "./telemetry.js";

const REPLACED={main:"my-herdr",terminals:"my-terminals",win98:"win98-dark"};
const TITLES={main:"Herdr",terminals:"Terminals",win98:"Windows 98",winxp:"Windows XP","herdr-t3":"Herdr T3","main-folders":"Space Folders","herdr-sim":"Herdr Sim",cockpit:"Cockpit",traveler:"Traveler",lcars:"LCARS"};
function title(n){const b=Object.keys(REPLACED).find(b=>REPLACED[b]===n),base=n.replace(/^my-/,"");return TITLES[b]??TITLES[n]??TITLES[base]??base.split(/[-_ ]+/).map(s=>s[0]?.toUpperCase()+s.slice(1)).join(" ");}
function agentName(a){return a.title||a.program?.name||a.app||a.address;}
function goAgent(a){run("agent.focus",{terminal:a.address});}
function emblem(name,size=50){return svg("mods/fallout/assets/"+name+".svg").size(size).text_color(pal().ink);}
function card(id,label,sub,action,on=false){const c=pal();return v_flex().id(id).w_full().flex_none().p(8).gap(4).border_l(3).border_color(on?c.ink:c.edge).bg(on?theme().selected:c.well).cursor_pointer().hover(s=>s.bg(theme().hover)).on_click((e,cx)=>{action?.();cx.notify();}).child(txt(label,12).truncate()).child(txt(sub,10,c.faint).truncate());}
function machineName(m){return m??"LOCAL";}

class Top {
  init(){this.taps=0;}
  render(){const c=pal(),section=shared("fallout.section")??"DATA";return root().bg(c.metal).px(12).child(h_flex().size_full().gap(14).items_center()
    .child(div().w(appWindow()?.platform==="macos"?70:0).flex_none())
    .child(div().id("vault-iris").cursor_pointer().tooltip("Service seal. A technician might tap it three times.").on_mouse_down("left",(_e,cx)=>cx.stop_propagation()).on_click(()=>{if(++this.taps%3===0){award("Overseer");open("dossier",{secret:"seal"});}}).child(emblem("iris",42)))
    .child(v_flex().w(175).flex_none().child(txt("PIP-BOY / HERDR",16)).child(txt("FIELD OPERATIONS • 3000",10,c.paper)))
    .child(h_flex().gap(5).children(["STAT","INV","DATA","MAP","RADIO"].map(s=>btn("section-"+s,s,()=>setShared("fallout.section",s),s===section))))
    .child(div().flex_1())
    .child(btn("help","?",()=>open("help")).tooltip("Field manual, controls and secrets"))
    .child(btn("layout-switch","Fallout ▾",()=>menu("layouts")))
    .when(appWindow()?.buttons,el=>el.child(btn("min","−",()=>run("window.minimize"))).child(btn("max","□",()=>run("window.maximize"))).child(btn("quit","×",()=>run("window.close")))));
  }
}
class Sidebar {
  render(){const c=pal(),mode=shared("fallout.section")??"DATA",all=agents(),ss=spaces();setAgentOrder(all.map(a=>a.address));
    let content=v_flex().w_full().gap(5);
    if(mode==="DATA")content=content.child(rule("SETTLEMENTS / WORKSPACES")).children(ss.map(s=>card("space-"+s.id,(s.active?"▣ ":"□ ")+s.name,machineName(s.machine)+" · "+s.tabs.length+" quests · "+(s.status??"no agents"),()=>run("space.select",{id:s.id}),s.active).on_mouse_down("right",(_e,cx)=>{cx.stop_propagation();menu("space",{id:s.id});}))).child(btn("new-space","+ SETTLEMENT",()=>run("space.new",{}))).child(rule("COMPANIONS / LIVE AGENTS")).children(all.map(a=>card("agent-"+a.address,agentName(a),a.address+" · "+a.status+" · "+a.space_name,()=>goAgent(a),a.focused).on_mouse_down("right",(_e,cx)=>{cx.stop_propagation();menu("agent",{terminal:a.address,pinned:a.pinned});}))).when(!all.length,e=>e.child(txt("No agents reporting status.",11,c.faint)));
    if(mode==="STAT"){const needs=all.filter(a=>a.status==="blocked"||a.status==="done");content=content.child(rule("LIVE OPERATIONS")).child(h_flex().gap(12).items_center().child(div().id("service-bot").cursor_pointer().tooltip("Pet the field service robot.").on_click(()=>{award("Good Neighbor");open("dossier",{secret:"robot"});}).child(emblem("robot",104))).child(v_flex().gap(8).child(txt(ss.length+" SETTLEMENTS",12)).child(txt(all.length+" COMPANIONS",12)).child(txt(needs.length+" OBJECTIVES",12))))
      .child(txt("Counts above come from Herdr.",10,c.faint)).child(rule("STATUS / REAL AGENT REPORTS")).children(["working","blocked","done","idle"].map(s=>h_flex().h(25).gap(8).items_center().child(signal(s)).child(txt(s,12)).child(div().flex_1()).child(txt(all.filter(a=>a.status===s).length,15))))
      .child(rule("ATTENTION OBJECTIVES")).children(needs.map(a=>card("objective-"+a.address,agentName(a),a.status==="blocked"?"Needs your input · "+a.address:"Finished unseen · "+a.address,()=>goAgent(a))))
      .when(!needs.length,e=>e.child(txt("No pending attention objectives.",11,c.faint))).child(rule("FIELD NOTES")).child(txt("Working = active assignment. Blocked = needs input. Done = finished unseen. Idle = ready.",11,c.faint));}
    if(mode==="MAP")content=content.child(rule("RADIO RELAY MAP / MACHINES")).child(emblem("relay",115)).child(txt("Schematic • not geographic location",10,c.faint)).children(machines().map(m=>v_flex().gap(4).child(card("machine-"+machineName(m.name),"◈ "+machineName(m.name),"layout "+m.layout,()=>run("app.settings",{section:"machines"}))).children(ss.filter(s=>s.machine===m.name).map(s=>card("map-space-"+s.id,"  └ "+s.name,s.tabs.length+" quests · click to travel",()=>run("space.select",{id:s.id}),s.active))))).child(btn("machines","MANAGE RELAYS",()=>run("app.settings",{section:"machines"})));
    if(mode==="INV")content=content.child(rule("HOLOTAPE INVENTORY")).child(card("hack-tape","01 / PASSWORD TRAINER","RobCo likeness puzzle · PLAY",()=>open("hack"))).child(card("salvage-tape","02 / WASTELAND COURIER","Original route puzzle · PLAY",()=>open("salvage"))).child(rule("COLLECTED BADGES")).children((shared("fallout.discoveries")??[]).map(s=>txt("[✓] "+s,12))).when(!(shared("fallout.discoveries")??[]).length,e=>e.child(txt("Explore the console to collect badges.",11,c.faint))).child(rule("PERSONAL BESTS")).child(txt("Hacks solved: "+(shared("fallout.hackWins")??0),12)).child(txt("Courier best: "+(shared("fallout.salvageBest")??"—")+" moves",12)).child(card("nuka","BOTTLE CAP / INSPECT","One pre-war keepsake. Click to inspect.",()=>{award("Cap Collector");open("dossier",{secret:"cap"});}));
    if(mode==="RADIO")content=content.child(rule("RADIO / SIMULATOR")).child(emblem("relay",110)).child(txt("CIVIL DEFENSE TEST SIGNAL",13)).child(txt("Fictional station · visual signal only",10,c.faint)).child(h_flex().h(50).gap(4).items_center().children([12,28,42,20,36,48,25,15,35,22,44,18].map((h,i)=>div().w(7).h(h).bg(c.ink).when(!shared("fallout.reduced"),e=>e.loop("height",{from:6,to:h,period:900+i*90}))))).child(card("frequency","FREQUENCY 101.1","Click the tuning dial to inspect the signal",()=>{award("Lone Wanderer");open("dossier",{secret:"radio"});})).child(txt("No music is streamed or bundled. Game rewards may use Herdr’s local attention chime when enabled below.",11,c.faint)).child(btn("sound",shared("fallout.sound")?"REWARD CHIME: ON":"REWARD CHIME: MUTED",()=>setShared("fallout.sound",!shared("fallout.sound"))));
    return root().p(12).gap(7).child(h_flex().flex_none().justify_between().child(txt(mode+" / FIELD CONSOLE",13)).child(txt("●",12))).child(div().h(1).bg(c.ink)).child(div().id("sidebar-scroll").flex_1().min_h(0).overflow_y_scrollbar().child(content)).child(btn("motion",shared("fallout.reduced")?"MOTION: REDUCED":"MOTION: ON",()=>setShared("fallout.reduced",!shared("fallout.reduced")))).child(btn("palette",shared("fallout.amber")?"PHOSPHOR: AMBER":"PHOSPHOR: GREEN",()=>setShared("fallout.amber",!shared("fallout.amber"))));
  }
}
class Tabs {
  render(){const c=pal(),s=spaces().find(s=>s.active);return root().bg(c.metal).child(h_flex().size_full().gap(5).px(8).items_center().child(txt("QUESTS",10,c.paper)).child(h_flex().id("quest-scroll").flex_1().min_w(0).overflow_x_scrollbar().gap(5).children((s?.tabs??[]).map(t=>btn("tab-"+t.id,(t.active?"▣ ":"□ ")+t.name+(t.settled?" [parked]":""),()=>run("tab.select",{id:t.id}),t.active).tooltip(t.name+" · "+(t.status??"no agent status")).on_mouse_down("right",(_e,cx)=>{cx.stop_propagation();menu("tab",{id:t.id,settled:t.settled});})))).child(btn("new-tab","+",()=>run("tab.new",{})).tooltip("New quest / terminal tab")));}
}
class Pane {
  render(){const c=pal(),p=panes().find(p=>p.pane===props()?.pane);return root().bg(c.metal).child(h_flex().size_full().px(8).gap(7).items_center().child(signal(p?.status)).child(txt(p?.terminal??"MOD",10)).child(txt(p?.title??"TERMINAL",11,c.paper).flex_1().truncate()).child(btn("pane-more","···",()=>menu("pane",{pane:p?.pane,terminal:p?.terminal})).h(22)).child(btn("pane-zoom",p?.zoomed?"↙":"↗",()=>p&&run("pane.zoom",{pane:p.pane})).h(22)));}
}
class Footer {
  init(_p,cx){this.net="LINK ?";this.netInfo="Local network status not read yet";this.battery=null;this.last="Pending";this.refresh(cx);cx.timer.every(30000,cx=>this.refresh(cx));}
  refresh(cx){if(this.probing)return;if(appWindow()?.platform!=="macos"){this.net="LINK ?";this.netInfo="Host telemetry unavailable on this platform";return;}this.probing=true;cx.spawn(async cx=>{try{const results=await Promise.allSettled([exec("/usr/sbin/scutil",["--nwi"]),exec("/usr/bin/pmset",["-g","batt"])]);const n=parseNetwork(results[0].status==="fulfilled"?results[0].value:null);this.net=n.label;this.netInfo=n.detail;this.battery=parseBattery(results[1].status==="fulfilled"?results[1].value:null,this.battery);this.last=new Date().toLocaleTimeString();}finally{this.probing=false;cx.notify();}});}
  render(){const c=pal(),s=spaces().find(s=>s.active),all=agents(),needs=all.filter(a=>a.status==="blocked"||a.status==="done");return root().bg(c.metal).child(h_flex().size_full().px(10).gap(12).items_center().child(txt("ROBCO / LIVE",10,c.paper)).child(txt(s?.name??"NO SETTLEMENT",11).truncate().flex_1()).child(btn("attention",needs.length+" OBJECTIVES",()=>{const a=needs[0];if(a)goAgent(a);else setShared("fallout.section","STAT");}).h(23)).child(h_flex().id("network").gap(5).items_center().tooltip(this.netInfo+" Updated "+this.last+"; refreshes every 30s.").child(emblem("relay",16)).child(txt(this.net,10))).when(!!this.battery,e=>e.child(h_flex().id("battery").gap(4).items_center().tooltip(this.battery.detail).child(div().w(20).h(10).border(1).border_color(c.ink).p(1).child(div().h_full().w(Math.max(1,16*(this.battery.pct||0)/100)).bg(c.ink))).child(txt(this.battery.label,10)))).child(btn("footer-manual","MANUAL",()=>open("help")).h(23)));}
}
class Menu {
  render(){const c=pal(),p=props()??{},t=p.target??{},entries=[];const action=(label,f)=>entries.push({label,f});
    if(p.kind==="layouts"){const all=layouts();for(const name of all.filter(n=>!(REPLACED[n]&&all.includes(REPLACED[n]))))action((shared("layout")===name?"▣ ":"□ ")+title(name),()=>run("layout.switch",{name}));}
    if(p.kind==="space"){action("Rename settlement…",()=>run("space.rename",{id:t.id}));action("New quest",()=>run("tab.new",{space:t.id}));action("Close settlement…",()=>run("space.close",{id:t.id}));}
    if(p.kind==="tab"){action("Rename quest…",()=>run("tab.rename",{id:t.id}));action(t.settled?"Resume quest":"Park quest (keep running)",()=>run(t.settled?"tab.unsettle":"tab.settle",{id:t.id}));action("Close quest…",()=>run("tab.close",{id:t.id}));}
    if(p.kind==="agent"){action("Focus companion",()=>run("agent.focus",{terminal:t.terminal}));action("Peek at terminal",()=>run("terminal.peek",{terminal:t.terminal}));action(t.pinned?"Unpin companion":"Pin companion",()=>run("terminal.pin",{terminal:t.terminal,pinned:!t.pinned}));}
    if(p.kind==="pane"){if(t.pane){action("Split right",()=>run("pane.split",{pane:t.pane,direction:"right"}));action("Split down",()=>run("pane.split",{pane:t.pane,direction:"down"}));action("Zoom pane",()=>run("pane.zoom",{pane:t.pane}));action("Close pane…",()=>run("pane.close",{pane:t.pane}));}if(t.terminal)action("Peek terminal",()=>run("terminal.peek",{terminal:t.terminal}));}
    return v_flex().w_full().bg(c.well).border(2).border_color(c.edge).p(6).gap(2).font_family("Geist Mono").child(txt(p.kind==="layouts"?"DISPLAY MODULE / LAYOUTS":"FIELD ACTIONS",11,c.faint).px(7).py(6)).children(entries.map((it,i)=>btn("menu-"+i,it.label,()=>{close();it.f();}).justify_start().border(0).w_full().h(28)));
  }
}
class Help {
  render(){const c=pal();return shell("VAULT FIELD MANUAL",v_flex().id("manual-scroll").overflow_y_scrollbar().gap(9)
    .child(txt("WELCOME, FIELD OPERATOR.",20)).child(txt("The console is ready. Your existing work stays live.",12))
    .child(rule("YOUR WORK, THROUGH A PIP-BOY"))
    .children(["DATA • Settlements are workspaces; quests are tabs; companions are your actual agents.","STAT • Real working / blocked / done / idle reports. Click an objective to reach its agent.","MAP • Machines and their workspaces. This is a network schematic, not a GPS map.","INV • Two playable holotapes and your discovery badges.","RADIO • A visual fictional station. Reward chimes are muted by default."].map(s=>txt(s,12)))
    .child(rule("CONTROLS"))
    .children(["Fallout ▾ opens the native layout switcher. Right-click a settlement, quest or companion for actions.","Pane ··· offers splits, zoom and close. Original terminal keys and selection stay available.","PHOSPHOR changes green / amber chrome. MOTION stops all decorative animation. Light/dark follows Herdr appearance.","Network and battery are local macOS readings every 30s. LINK UP is not proof of Internet access. No battery hardware: no battery badge."].map(s=>txt(s,11,c.faint)))
    .child(rule("SERVICE BULLETIN / DISCOVERIES"))
    .child(txt("Try three taps on the vault iris, pet the STAT robot, inspect the INV bottle cap, or tune 101.1. The paired brackets in the trainer can help. None touches your terminals.",11))
    .child(h_flex().gap(8).child(btn("play-hack","HACKING TRAINER",()=>{close();open("hack");})).child(btn("play-salvage","COURIER TAPE",()=>{close();open("salvage");})))
    .child(txt("Independent fan interface. Original vectors; bundled Geist Mono. No game assets, music or fonts extracted.",10,c.faint)));
  }
}
class Dossier {
  render(){const secret=props()?.secret??"seal",c=pal();const data={seal:["OVERSEER MAINTENANCE ARCHIVE","Vault door service test: PASSED.","OVERSEER MEMO 101: The door is operational. The committee responsible for authorizing its opening is still in committee. Please enjoy another productive day underground.","Overseer badge recovered."],robot:["FIELD SERVICE UNIT / GREETING","The robot accepts your pat.","PAT RECEIVED. Your field service unit would wave all three arms, but two are holding a clipboard. It has promoted you to Honorary Keeper of the Spare Screws.","Good Neighbor badge recovered."],cap:["PRE-WAR BOTTLE CAP / INSPECTION","Estimated value: one pleasant distraction.","The faded label reads Nuka-Cola. A tiny engraving on the inside says: For emergency refreshment, apply bottle. Bottle not included.","Cap Collector badge recovered."],radio:["101.1 / LOST MAINTENANCE CHANNEL","Fictional transmission decoded.","An old procurement loop repeats: Vault 13 requests one water chip. The dispatch clerk has filed it under urgent, which is apparently a very large filing cabinet.","Lone Wanderer badge recovered."]}[secret];return shell("RESTRICTED / SERVICE RECORD",v_flex().gap(18).items_center().child(emblem(secret==="robot"?"robot":secret==="radio"?"relay":"iris",120)).child(txt(data[0],18)).child(txt(data[1],15)).child(txt(data[2],13,c.faint)).child(txt(data[3],12)).child(txt("SIMULATOR / COLLECTIBLE LORE",10,c.faint)));}
}
const ROLES={top:Top,sidebar:Sidebar,tabs:Tabs,pane:Pane,footer:Footer,menu:Menu,help:Help,hack:Hacking,salvage:Salvage,dossier:Dossier};
export default class Fallout extends View {
  init(p,cx){const pr={...(p??{}),...(props()??{})};this.role=new (ROLES[pr.role]??Help)();this.role.init?.(pr,cx);}
  render(cx){return this.role.render(cx);}
}
