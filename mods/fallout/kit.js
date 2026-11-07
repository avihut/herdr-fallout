import { div, svg } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { theme, settings, shared, setShared, openOverlay, closeOverlay, props, playSound } from "herdr";
export { div, svg, h_flex, v_flex };
export function pal() {
  const t = theme(), dark = settings()?.dark !== false, amber = shared("fallout.amber") === true;
  return { ...t, ink: amber ? (dark ? "#ffcd70" : "#71420b") : (dark ? "#a6f58d" : "#24552a"),
    faint: dark ? "#9ba88f" : "#53634c", metal: dark ? "#30382c" : "#cbd0b7",
    edge: dark ? "#657050" : "#7c8767", well: dark ? "#111a10" : "#e8ecd9",
    paper: dark ? "#c9c9a6" : "#343e26", danger: dark ? "#ffb875" : "#8a350d" };
}
export function txt(s, size=12, color) { return div().text_size(size).text_color(color ?? pal().ink).child(String(s)); }
export function root() { const c=pal(); return v_flex().size_full().font_family("Geist Mono").text_size(12).text_color(c.ink).bg(c.well); }
export function btn(id, label, action, on=false) { const c=pal(); return h_flex().id(id).flex_none().items_center().justify_center().px(10).h(28).border(1).border_color(on ? c.ink : c.edge).bg(on ? c.ink : c.well).text_color(on ? c.well : c.ink).text_size(12).cursor_pointer().hover(s=>s.bg(c.ink).text_color(c.well)).on_mouse_down("left",(_e,cx)=>cx.stop_propagation()).on_click((e,cx)=>{ action?.(e,cx); cx.notify(); }).child(label); }
export function rule(label) { const c=pal(); return h_flex().w_full().flex_none().gap(8).items_center().py(8).child(txt(label,10,c.faint)).child(div().flex_1().h(1).bg(c.edge)); }
export function signal(status) { const c=pal(); let el=div().size(7).rounded(1).bg(status==="blocked"?c.danger:status==="idle"?c.faint:c.ink); if(status==="working"&&!shared("fallout.reduced")) el=el.loop("opacity",{from:0.35,to:1,period:1800}); return el; }
export function open(role, extra={}) { const z=settings()?.zoom||1; return openOverlay({mod:"fallout",kind:"dialog",frame:"none",width:Math.min(role==="hack"?720:600,850)*z,height:(role==="hack"?600:role==="salvage"?570:530)*z,props:{role,...extra}}); }
export function menu(kind, target={}) { return openOverlay({mod:"fallout",kind:"popup",frame:"none",width:262*(settings()?.zoom||1),props:{role:"menu",kind,target}}); }
export function close() { closeOverlay(props()?.overlay); }
export function shell(title,body) { const c=pal(); return root().border(3).border_color(c.edge).p(12).gap(8).child(h_flex().flex_none().items_center().justify_between().child(txt(title,16)).child(btn("close","EJECT ×",close))).child(div().h(1).bg(c.edge)).child(body.flex_1().min_h(0)); }
export function award(key) { const found=shared("fallout.discoveries")??[]; if(!found.includes(key)) { setShared("fallout.discoveries",[...found,key]); if(shared("fallout.sound")) playSound("done"); } }
