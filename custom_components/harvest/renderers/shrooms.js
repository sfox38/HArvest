(()=>{var mi=Object.defineProperty;var sr=x=>{throw TypeError(x)};var fi=(x,f,d)=>f in x?mi(x,f,{enumerable:!0,configurable:!0,writable:!0,value:d}):x[f]=d;var fs=(x,f,d)=>fi(x,typeof f!="symbol"?f+"":f,d),Hs=(x,f,d)=>f.has(x)||sr("Cannot "+d);var t=(x,f,d)=>(Hs(x,f,"read from private field"),d?d.call(x):f.get(x)),i=(x,f,d)=>f.has(x)?sr("Cannot add the same private member more than once"):f instanceof WeakSet?f.add(x):f.set(x,d),r=(x,f,d,it)=>(Hs(x,f,"write to private field"),it?it.call(x,d):f.set(x,d),d),p=(x,f,d)=>(Hs(x,f,"access private method"),d);(function(){"use strict";var jo,Se,mt,Ht,Wt,V,Fo,Tt,Yt,Ut,nt,Kt,Xt,j,F,Et,$e,Jt,Le,at,Ts,Es,rr,ht,Qt,Ae,ft,te,W,Me,qt,It,Bt,N,A,ee,Vt,Ot,X,ke,Go,oe,$,_s,ir,qs,Is,Bs,Cs,nr,Wo,He,Yo,Te,Y,lt,se,Uo,Ee,U,qe,dt,vt,Ie,Ko,Be,gt,ar,Vs,hr,Xo,Ve,D,E,re,ie,bt,xs,Pt,Oe,yt,ne,Dt,z,B,lr,dr,Os,Ps,zo,Jo,Pe,J,De,Ne,Q,ze,xt,Ze,ae,he,le,wt,ct,Re,Qo,je,Fe,Z,cr,Ds,pr,Ns,ur,Ge,We,ts,Ye,Nt,zt,de,ce,pe,Ue,Ke,tt,Xe,G,mr,fr,vr,vs,es,Je,Qe,to,eo,oo,so,ro,io,no,ao,O,ho,lo,_t,ue,pt,R,Ct,St,co,et,po,uo,mo,os,ss,rs,fo,Zt,me,fe,ve,is,ns,S,gr,zs,Zs,br,yr,Rs,gs,xr,as,vo,ge,go,bo,yo,Rt,hs,ls,ds,xo,ot,jt,cs,be,st,Ft,$t,wo,ye,js,wr,ps,_o,Co,xe,So,$o,Lo,Lt,ut,Ao,q,Ce,Ss,we,_e,Fs,Gs,us,Mo,At,ws,ko,Ho,To,Eo,rt,qo,Io,Gt,Bo,Vo,Oo,Po;const x=window.HArvest;if(!x||!x.renderers||!x.renderers.BaseCard){console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");return}const f=x.renderers.BaseCard,d=window.HArvest.esc;function it(h,m){let e=null,o=null,s=null;function n(...a){o=this,s=a,e&&clearTimeout(e),e=setTimeout(()=>{e=null,h.apply(o,s),s=null},m)}return n.flush=function(){e!==null&&(clearTimeout(e),e=null,s&&(h.apply(o,s),s=null))},n}function w(h){return h?h.charAt(0).toUpperCase()+h.slice(1).replace(/_/g," "):""}function vi(h,m,e){return Math.min(e,Math.max(m,h))}function Ws(h,m){const e=h.querySelector(".shroom-controls-shell");e&&e.setAttribute("data-collapsed",String(m))}function Mt(h,m){h&&(h.setAttribute("role","button"),h.setAttribute("tabindex","0"),h.setAttribute("aria-label",m),h.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),h.click())}))}function M(h){h.querySelectorAll("[part=companion]").forEach(m=>{m.title=m.getAttribute("aria-label")??"Companion"})}const _r={light:"var(--hrv-ex-shroom-light, #ff9800)",switch:"var(--hrv-ex-shroom-switch, #2196f3)",input_boolean:"var(--hrv-ex-shroom-switch, #2196f3)",lock:"var(--hrv-ex-shroom-lock, #2196f3)",fan:"var(--hrv-ex-shroom-fan, #4caf50)",climate:"var(--hrv-ex-shroom-climate, #ff5722)",cover:"var(--hrv-ex-shroom-cover, #9c27b0)",media_player:"var(--hrv-ex-shroom-media, #e91e63)",sensor:"var(--hrv-ex-shroom-sensor, #03a9f4)",binary_sensor:"var(--hrv-ex-shroom-binary, #8bc34a)",input_number:"var(--hrv-ex-shroom-input, #00bcd4)",input_select:"var(--hrv-ex-shroom-input, #00bcd4)",timer:"var(--hrv-ex-shroom-timer, #673ab7)",remote:"var(--hrv-ex-shroom-remote, #607d8b)",weather:"var(--hrv-ex-shroom-weather, #ff9800)"};function Ys(h){return _r[h]??"var(--hrv-color-primary, #ff9800)"}function C(h,m,e){if(!h)return;const o=Ys(m);e?(h.style.background=`color-mix(in srgb, ${o} 20%, transparent)`,h.style.color=o):(h.style.background="var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))",h.style.color="var(--hrv-color-icon, #757575)")}function k(h){const m=(h.config.displayHints??h.def.display_hints??{}).layout??null,e=h.root.host;e&&(m==="vertical"?e.setAttribute("data-layout","vertical"):e.removeAttribute("data-layout"))}function Cr(h){if(!h)return()=>{};const m=80,e=1.6,o=.96,s=.04;let n=null,a=0,l=0,u=0,c=!1,v=0;const g=[],b=()=>{v&&(cancelAnimationFrame(v),v=0)},I=y=>{for(;g.length&&g[0].t<y-m;)g.shift();if(g.length<2)return 0;const L=g[0],K=g[g.length-1],ms=K.t-L.t;return ms<=0?0:(K.x-L.x)/ms},P=()=>{if(Math.abs(u)<s)return;let y=performance.now();const L=K=>{const ms=K-y;if(y=K,h.scrollLeft-=u*ms,u*=Math.pow(o,ms/16),Math.abs(u)<s){v=0,u=0;return}const ui=h.scrollWidth-h.clientWidth;if(h.scrollLeft<=0||h.scrollLeft>=ui){v=0,u=0;return}v=requestAnimationFrame(L)};v=requestAnimationFrame(L)},Do=y=>{if(h.scrollWidth<=h.clientWidth||y.pointerType==="touch")return;const L=y.target;if(!(L&&L!==h&&L.closest?.("button, a"))){b(),n=y.pointerId,a=y.clientX,l=h.scrollLeft,u=0,c=!1,g.length=0,g.push({x:y.clientX,t:y.timeStamp});try{h.setPointerCapture(n)}catch{}}},No=y=>{if(y.pointerId!==n)return;const L=y.clientX-a;Math.abs(L)>4&&(c=!0,h.dataset.dragging="true"),h.scrollLeft=l-L,g.push({x:y.clientX,t:y.timeStamp});const K=y.timeStamp-m;for(;g.length>2&&g[0].t<K;)g.shift()},_=y=>{if(y.pointerId===n){try{h.releasePointerCapture(n)}catch{}if(n=null,c){const L=K=>{K.stopPropagation(),K.preventDefault()};window.addEventListener("click",L,{capture:!0,once:!0}),requestAnimationFrame(()=>h.removeAttribute("data-dragging")),u=I(y.timeStamp)*e,P()}g.length=0}};return h.addEventListener("pointerdown",Do),h.addEventListener("pointermove",No),h.addEventListener("pointerup",_),h.addEventListener("pointercancel",_),h.addEventListener("wheel",b,{passive:!0}),h.addEventListener("touchstart",b,{passive:!0}),()=>{b(),h.removeEventListener("pointerdown",Do),h.removeEventListener("pointermove",No),h.removeEventListener("pointerup",_),h.removeEventListener("pointercancel",_),h.removeEventListener("wheel",b),h.removeEventListener("touchstart",b)}}function Us(h,m){if(h!=="on")return null;if(m.rgb_color){const[o,s,n]=m.rgb_color;return(.299*o+.587*s+.114*n)/255>.85?`rgb(${Math.round(o*.8)}, ${Math.round(s*.8)}, ${Math.round(n*.75)})`:`rgb(${o}, ${s}, ${n})`}if(m.hs_color)return`hsl(${m.hs_color[0]}, ${Math.max(m.hs_color[1],50)}%, 55%)`;const e=m.color_temp_kelvin??(m.color_temp?Math.round(1e6/m.color_temp):null);return e?e>=5200?"#4ba3e0":e>=4500?"#e0c85a":e<=3e3?"#e6a040":"#ddb840":null}const H=`
    [data-gesture-hold=pending]::before {
      animation: none !important;
      opacity: 0 !important;
    }
    .shroom-state-item {
      display: flex;
      align-items: center;
      gap: var(--hrv-ex-shroom-spacing, 12px);
      cursor: default;
    }
    .shroom-state-item[data-tappable=true] {
      cursor: pointer;
    }
    .shroom-state-item[role=button]:focus-visible {
      outline: 2px solid var(--hrv-color-primary, #6366f1);
      outline-offset: 2px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
    }

    .shroom-icon-shape {
      width: var(--hrv-ex-shroom-icon-size, 42px);
      height: var(--hrv-ex-shroom-icon-size, 42px);
      min-width: var(--hrv-ex-shroom-icon-size, 42px);
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 280ms ease-out, color 280ms ease-out;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
    }
    .shroom-icon-shape svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .shroom-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .shroom-primary {
      font-size: 14px;
      font-weight: 400;
      color: var(--hrv-color-text, #212121);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.3;
    }

    .shroom-secondary {
      font-size: 12px;
      font-weight: 400;
      color: var(--hrv-color-text-secondary, #757575);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.3;
    }

    :host([data-layout=vertical]) .shroom-state-item {
      flex-direction: column;
      text-align: center;
    }
    :host([data-layout=vertical]) .shroom-icon-shape {
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: 50%;
    }
    :host([data-layout=vertical]) .shroom-icon-shape svg {
      width: 22px;
      height: 22px;
    }
    :host([data-layout=vertical]) .shroom-info {
      align-items: center;
    }

    :host([layout=row]) [part=card] > *:not(.shroom-state-item):not([part=row-control]) {
      display: none !important;
    }
    :host([layout=row]) .shroom-state-item {
      flex: 1;
      min-width: 0;
      padding: 0;
    }
    :host([layout=row]) .shroom-secondary,
    :host([layout=row]) .shroom-press-btn {
      display: none;
    }
    :host([layout=row]) .shroom-icon-shape {
      width: 24px;
      height: 24px;
      min-width: 24px;
      border-radius: 50%;
      background: none !important;
    }
    :host([layout=row]) .shroom-icon-shape svg {
      width: 18px;
      height: 18px;
    }
  `,$s=`
    .shroom-controls-shell {
      overflow: hidden;
      transition: max-height 0.45s cubic-bezier(0.22, 0.84, 0.26, 1),
                  margin-top 0.45s cubic-bezier(0.22, 0.84, 0.26, 1),
                  opacity 0.35s ease;
    }
    .shroom-controls-shell[data-collapsed=true] {
      max-height: 0 !important;
      margin-top: 0 !important;
      opacity: 0;
      pointer-events: none;
    }
    .shroom-controls-shell[data-collapsed=false] {
      max-height: 400px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      opacity: 1;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-controls-shell { transition: none; }
    }
  `,Zo=`
    .shroom-slider-wrap {
      position: relative;
      width: 100%;
      height: var(--hrv-ex-shroom-slider-height, 42px);
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      overflow: hidden;
    }
    .shroom-slider-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .shroom-slider-cover {
      position: absolute;
      top: 0; right: 0; bottom: 0;
      background: var(--hrv-ex-shroom-slider-track, rgba(0,0,0,0.35));
      pointer-events: none;
      transition: left 180ms ease-in-out;
    }
    .shroom-slider-edge {
      position: absolute;
      top: 4px; bottom: 4px;
      width: 3px;
      border-radius: 1.5px;
      background: rgba(255,255,255,0.8);
      pointer-events: none;
      transition: left 180ms ease-in-out;
      transform: translateX(-50%);
      box-shadow: 0 0 4px rgba(0,0,0,0.15);
    }
    .shroom-slider-input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      margin: 0;
      padding: 0;
      opacity: 0;
      z-index: 1;
    }
    .shroom-slider-input:focus-visible ~ .shroom-slider-focus-ring,
    .shroom-slider-wrap:focus-within .shroom-slider-focus-ring {
      box-shadow: inset 0 0 0 2px var(--hrv-color-primary, #6366f1);
    }
    .shroom-slider-focus-ring {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      transition: box-shadow 150ms ease;
    }
  `,kt=`
    .shroom-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: var(--hrv-radius-l, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: var(--hrv-font-size-s, 13px);
      font-weight: var(--hrv-font-weight-medium, 500);
      font-family: inherit;
      cursor: pointer;
      transition: background 280ms ease-out;
      line-height: 1;
    }
    .shroom-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-btn:focus-visible {
      outline: 2px solid var(--hrv-color-primary, #6366f1);
      outline-offset: 2px;
    }
    .shroom-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .shroom-btn[aria-pressed=true],
    .shroom-btn[data-active=true] {
      background: var(--hrv-color-primary);
      color: var(--hrv-color-on-primary);
    }
    .shroom-btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .shroom-btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      padding: 0;
    }
    .shroom-btn-icon svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `,T=`
    [part=companion-zone] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      border-top: none;
      padding-top: 0;
    }
    [part=companion-zone]:empty { display: none; }
    [part=companion] {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 16px;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      border: none;
      cursor: default;
      font-size: 11px;
      color: var(--hrv-color-text-secondary);
      transition: background 280ms ease-out;
    }
    [part=companion][data-interactive=true] { cursor: pointer; }
    [part=companion][data-interactive=true]:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    [part=companion][data-on=true] {
      background: var(--hrv-color-primary-dim);
    }
    [part=companion-icon] {
      width: 14px; height: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    [part=companion-icon] svg { width: 100%; height: 100%; fill: currentColor; }
  `,Sr=`
    ${H}
    ${T}
  `;class Ks extends f{constructor(){super(...arguments);i(this,jo,null);i(this,Se,null);i(this,mt,!1)}render(){k(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Sr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${d(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,jo,this.root.querySelector(".shroom-icon-shape")),r(this,Se,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline"),"card-icon");const o=this.root.querySelector(".shroom-state-item");if(e){Mt(o,`${this.def.friendly_name} - Toggle`);const s=()=>{const a=this.config.gestureConfig?.tap;if(a){this._runAction(a);return}this.config.card?.sendCommand("toggle",{})};this._attachGestureHandlers(o,{onTap:s});const n=this.root.querySelector("[part=row-toggle]");n&&this._attachGestureHandlers(n,{onTap:s})}this.renderCompanions(),M(this.root)}applyState(e,o){r(this,mt,e==="on");const s=this.def.domain??"switch";C(t(this,jo),s,t(this,mt)),t(this,Se)&&(t(this,Se).textContent=w(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,mt)));const a=this.root.querySelector("[part=row-toggle]");a&&(a.setAttribute("aria-pressed",String(t(this,mt))),a.disabled=e==="unavailable"||e==="unknown");const l=this.root.querySelector("[part=row-state]");l&&(l.textContent=w(e));const u=t(this,mt)?this.resolveIcon(this.def.icon,"mdi:toggle-switch"):this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline");this.renderIcon(u,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,o){return e==="toggle"||e==="turn_on"||e==="turn_off"?{state:e==="toggle"?t(this,mt)?"off":"on":e==="turn_on"?"on":"off",attributes:{}}:null}}jo=new WeakMap,Se=new WeakMap,mt=new WeakMap;const Ro=["brightness","temp","color"],$r={brightness:"mdi:brightness-4",temp:"mdi:thermometer",color:"mdi:palette"},Lr=`
    ${H}
    ${$s}
    ${Zo}
    ${kt}
    ${T}

    .shroom-light-mode-btns {
      display: flex;
      gap: 6px;
    }
    .shroom-light-mode-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 280ms ease-out;
    }
    .shroom-light-mode-btn[hidden] {
      display: none;
    }
    .shroom-light-mode-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-light-mode-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-light-controls-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .shroom-light-controls-row .shroom-slider-wrap {
      flex: 1;
    }
    .shroom-slider-wrap.shroom-light-slider-wrap {
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
    }
    .shroom-slider-bg.shroom-brightness-bg {
      background: var(--shroom-light-accent, var(--hrv-ex-shroom-light, #ff9800));
    }
    .shroom-slider-bg.shroom-ct-bg {
      background: linear-gradient(90deg, #ffb74d 0%, #fff9c4 40%, #bbdefb 70%, #64b5f6 100%);
    }
    .shroom-slider-bg.shroom-hue-bg {
      background: linear-gradient(90deg,
        hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%),
        hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%)
      );
    }
    .shroom-light-ro {
      font-size: var(--hrv-font-size-s, 13px);
      color: var(--hrv-color-text-secondary, #757575);
      margin-top: 4px;
    }
  `;class Ar extends f{constructor(e,o,s,n){super(e,o,s,n);i(this,at);i(this,Ht,null);i(this,Wt,null);i(this,V,null);i(this,Fo,null);i(this,Tt,null);i(this,Yt,null);i(this,Ut,[]);i(this,nt,0);i(this,Kt,4e3);i(this,Xt,0);i(this,j,!1);i(this,F,0);i(this,Et,2e3);i(this,$e,6500);i(this,Jt,{});i(this,Le);r(this,Le,it(p(this,at,rr).bind(this),300))}render(){k(this);const e=this.def.capabilities==="read-write",o=this.def.supported_features??[],s=this.config.displayHints??{},n=s.show_brightness!==!1&&o.includes("brightness"),a=s.show_color_temp!==!1&&o.includes("color_temp"),l=s.show_rgb!==!1&&o.includes("rgb_color"),u=e&&(n||a||l),c=[n,a,l].filter(Boolean).length;r(this,Et,this.def.feature_config?.min_color_temp_kelvin??2e3),r(this,$e,this.def.feature_config?.max_color_temp_kelvin??6500);const v=[n,a,l];v[t(this,F)]||(r(this,F,v.findIndex(Boolean)),t(this,F)===-1&&r(this,F,0)),this.root.innerHTML=`
        <style>${Lr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${d(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          ${u?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-light-controls-row">
                <div class="shroom-slider-wrap shroom-light-slider-wrap">
                  <div class="shroom-slider-bg shroom-brightness-bg"></div>
                  <div class="shroom-slider-cover" style="left:0%"></div>
                  <div class="shroom-slider-edge" style="left:0%;display:none"></div>
                  <input type="range" class="shroom-slider-input" min="0" max="100"
                    step="1" value="0"
                    aria-label="${d(this.def.friendly_name)} level"
                    aria-valuetext="0%">
                  <div class="shroom-slider-focus-ring"></div>
                </div>
                ${c>1?`
                  <div class="shroom-light-mode-btns">
                    ${n?'<button class="shroom-light-mode-btn" data-mode="brightness" type="button" aria-label="Brightness"><span part="light-mode-brightness"></span></button>':""}
                    ${a?'<button class="shroom-light-mode-btn" data-mode="temp" type="button" aria-label="Color temperature"><span part="light-mode-temp"></span></button>':""}
                    ${l?'<button class="shroom-light-mode-btn" data-mode="color" type="button" aria-label="Color"><span part="light-mode-color"></span></button>':""}
                  </div>
                `:""}
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ht,this.root.querySelector(".shroom-icon-shape")),r(this,Wt,this.root.querySelector(".shroom-secondary")),r(this,V,this.root.querySelector(".shroom-slider-input")),r(this,Fo,this.root.querySelector(".shroom-slider-bg")),r(this,Tt,this.root.querySelector(".shroom-slider-cover")),r(this,Yt,this.root.querySelector(".shroom-slider-edge")),r(this,Ut,[...this.root.querySelectorAll(".shroom-light-mode-btn")]),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon");for(const b of t(this,Ut))this.renderIcon($r[b.dataset.mode]??"mdi:help-circle",`light-mode-${b.dataset.mode}`);const g=this.root.querySelector(".shroom-state-item");if(e){Mt(g,`${this.def.friendly_name} - Toggle`);const b=()=>{const P=this.config.gestureConfig?.tap;if(P){this._runAction(P);return}this.config.card?.sendCommand("toggle",{})};this._attachGestureHandlers(g,{onTap:b});const I=this.root.querySelector("[part=row-toggle]");I&&this._attachGestureHandlers(I,{onTap:b})}for(const b of t(this,Ut))b.addEventListener("click",()=>{const I=b.dataset.mode,P=Ro.indexOf(I);P===-1||P===t(this,F)||(r(this,F,P),p(this,at,Ts).call(this))});t(this,V)&&(t(this,V).addEventListener("input",()=>{const b=parseInt(t(this,V).value,10),I=Ro[t(this,F)]??"brightness";I==="brightness"?r(this,nt,b):I==="temp"?r(this,Kt,Math.round(t(this,Et)+b/100*(t(this,$e)-t(this,Et)))):r(this,Xt,Math.round(b*3.6)),p(this,at,Es).call(this),t(this,Le).call(this,I)}),this.guardSlider(t(this,V),t(this,Le))),this.renderCompanions(),M(this.root)}applyState(e,o){r(this,j,e==="on"),r(this,Jt,o),Ws(this.root,!t(this,j));const s=Us(e,o);t(this,j)&&s?t(this,Ht)&&(t(this,Ht).style.background=`color-mix(in srgb, ${s} 20%, transparent)`,t(this,Ht).style.color=s):C(t(this,Ht),"light",t(this,j)),r(this,nt,o.brightness!=null?Math.round(o.brightness/255*100):0),r(this,Kt,o.color_temp_kelvin??(o.color_temp?Math.round(1e6/o.color_temp):4e3)),r(this,Xt,o.hs_color?.[0]??42),t(this,Wt)&&(t(this,j)&&o.brightness!=null?t(this,Wt).textContent=`${t(this,nt)}%`:t(this,Wt).textContent=w(e));const n=this.root.querySelector(".shroom-slider-wrap");if(n){const v=Us("on",o);n.style.setProperty("--shroom-light-accent",v??"var(--hrv-ex-shroom-light, #ff9800)")}p(this,at,Ts).call(this);const a=this.root.querySelector(".shroom-state-item");a?.hasAttribute("role")&&a.setAttribute("aria-pressed",String(t(this,j)));const l=this.root.querySelector("[part=row-toggle]");l&&(l.setAttribute("aria-pressed",String(t(this,j))),l.disabled=e==="unavailable"||e==="unknown");const u=this.root.querySelector("[part=row-state]");if(u&&(u.textContent=w(e)),t(this,V)){const v=Ro[t(this,F)]??"brightness",g=parseInt(t(this,V).value,10);v==="brightness"?t(this,V).setAttribute("aria-valuetext",`${g}%`):v==="temp"?t(this,V).setAttribute("aria-valuetext",`${g}K`):t(this,V).setAttribute("aria-valuetext",`${g}`)}const c=t(this,j)?this.resolveIcon(this.def.icon,"mdi:lightbulb"):this.resolveIcon(this.def.icon,"mdi:lightbulb-off");this.renderIcon(c,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}${t(this,j)?`, ${t(this,nt)}%`:""}`)}predictState(e,o){if(e==="toggle")return{state:t(this,j)?"off":"on",attributes:t(this,Jt)};if(e==="turn_on"){const s={...t(this,Jt)};return o.brightness!=null&&(s.brightness=o.brightness),o.color_temp_kelvin!=null&&(s.color_temp_kelvin=o.color_temp_kelvin),o.hs_color!=null&&(s.hs_color=o.hs_color),{state:"on",attributes:s}}return e==="turn_off"?{state:"off",attributes:t(this,Jt)}:null}}Ht=new WeakMap,Wt=new WeakMap,V=new WeakMap,Fo=new WeakMap,Tt=new WeakMap,Yt=new WeakMap,Ut=new WeakMap,nt=new WeakMap,Kt=new WeakMap,Xt=new WeakMap,j=new WeakMap,F=new WeakMap,Et=new WeakMap,$e=new WeakMap,Jt=new WeakMap,Le=new WeakMap,at=new WeakSet,Ts=function(){const e=Ro[t(this,F)]??"brightness",o=t(this,Fo);o?.classList.remove("shroom-brightness-bg","shroom-ct-bg","shroom-hue-bg"),e==="brightness"?o?.classList.add("shroom-brightness-bg"):e==="temp"?o?.classList.add("shroom-ct-bg"):o?.classList.add("shroom-hue-bg");for(const s of t(this,Ut))s.hidden=s.dataset.mode===e;p(this,at,Es).call(this)},Es=function(){const e=Ro[t(this,F)]??"brightness";let o=0;e==="brightness"?o=t(this,nt):e==="temp"?o=Math.round((t(this,Kt)-t(this,Et))/(t(this,$e)-t(this,Et))*100):o=Math.round(t(this,Xt)/3.6);const s=e==="brightness";t(this,Tt)&&(s?(t(this,Tt).style.display="",t(this,Tt).style.left=`${o}%`):t(this,Tt).style.display="none"),t(this,Yt)&&(t(this,Yt).style.display=s?"none":"",s||(t(this,Yt).style.left=`${o}%`)),t(this,V)&&!this.isSliderActive(t(this,V))&&(t(this,V).value=String(o))},rr=function(e){e==="brightness"?t(this,nt)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:Math.round(t(this,nt)*2.55)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,Kt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,Xt),100]})};const Mr={temperature:"var(--hrv-ex-shroom-climate, #ff5722)",humidity:"var(--hrv-ex-shroom-sensor, #03a9f4)",battery:"var(--hrv-ex-shroom-fan, #4caf50)"},kr={temperature:"mdi:thermometer",humidity:"mdi:water-percent",battery:"mdi:battery"};function Hr(h){return h==null||isNaN(h)||h>=90?"mdi:battery":h>=70?"mdi:battery-70":h>=50?"mdi:battery-50":h>=30?"mdi:battery-30":h>=10?"mdi:battery-10":"mdi:battery-alert"}function Tr(h){return h==null||isNaN(h)?"var(--hrv-ex-shroom-fan, #4caf50)":h<=10?"var(--hrv-color-error, #f44336)":h<=20?"var(--hrv-color-warning, #ff9800)":"var(--hrv-ex-shroom-fan, #4caf50)"}const Er=`
    ${H}
    ${T}
  `;class bs extends f{constructor(){super(...arguments);i(this,ht,null);i(this,Qt,null);i(this,Ae,null)}render(){k(this),r(this,Ae,this.def.device_class??null);const e=kr[t(this,Ae)]??"mdi:gauge";this.root.innerHTML=`
        <style>${Er}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span part="row-control"><span part="row-value"></span></span>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,ht,this.root.querySelector(".shroom-icon-shape")),r(this,Qt,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,e),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}applyState(e,o){const s=parseFloat(e),n=this.def.unit_of_measurement??"",a=!isNaN(s),l=t(this,Ae);if(t(this,Qt))if(a){const c=o.suggested_display_precision,v=c!=null?s.toFixed(c):String(Math.round(s*10)/10);t(this,Qt).textContent=n?`${v} ${n}`:v}else t(this,Qt).textContent=w(e);if(l==="battery"&&a){const c=Tr(s);t(this,ht)&&(t(this,ht).style.background=`color-mix(in srgb, ${c} 20%, transparent)`,t(this,ht).style.color=c),this.renderIcon(this.resolveIcon(this.def.icon,Hr(s)),"card-icon")}else{const c=Mr[l]??Ys("sensor");t(this,ht)&&(t(this,ht).style.background=`color-mix(in srgb, ${c} 20%, transparent)`,t(this,ht).style.color=c)}const u=this.root.querySelector("[part=row-value]");if(u)if(a){const c=o.suggested_display_precision,v=c!=null?s.toFixed(c):String(Math.round(s*10)/10);u.textContent=n?`${v} ${n}`:v}else u.textContent=w(e);this.announceState(`${this.def.friendly_name}, ${a?s:e} ${n}`)}}ht=new WeakMap,Qt=new WeakMap,Ae=new WeakMap;const qr=`
    ${H}
    ${$s}
    ${Zo}
    ${kt}
    ${T}

    @keyframes shroom-fan-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-icon-shape[data-spinning=true] svg {
        animation: none !important;
      }
    }
    .shroom-icon-shape[data-spinning=true] svg {
      animation: shroom-fan-spin var(--shroom-fan-duration, 1s) linear infinite;
    }

    .shroom-fan-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .shroom-fan-speed-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .shroom-fan-speed-row .shroom-slider-wrap {
      flex: 1;
    }
    .shroom-fan-feat-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }
    .shroom-fan-step-dots {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: center;
    }
    .shroom-fan-step-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: 11px;
      font-weight: var(--hrv-font-weight-medium, 500);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 280ms ease-out, color 280ms ease-out;
    }
    .shroom-fan-step-dot:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-fan-step-dot[data-active=true] {
      background: var(--hrv-ex-shroom-fan, #4caf50);
      color: #fff;
    }
    .shroom-fan-cycle-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 280ms ease-out;
    }
    .shroom-fan-cycle-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-fan-cycle-btn svg {
      width: 22px; height: 22px; fill: currentColor;
    }
    .shroom-fan-slider-bg {
      background: var(--hrv-ex-shroom-fan, #4caf50);
    }
  `;class Ir extends f{constructor(e,o,s,n){super(e,o,s,n);i(this,$);i(this,ft,null);i(this,te,null);i(this,W,null);i(this,Me,null);i(this,qt,null);i(this,It,null);i(this,Bt,null);i(this,N,!1);i(this,A,0);i(this,ee,!1);i(this,Vt,"forward");i(this,Ot,null);i(this,X,[]);i(this,ke);i(this,Go,!1);i(this,oe,!1);r(this,ke,it(p(this,$,nr).bind(this),300)),r(this,X,e.feature_config?.preset_modes??[])}render(){k(this);const e=this.def.capabilities==="read-write",o=this.def.supported_features??[],s=this.config.displayHints??this.def.display_hints??{},n=s.display_mode??null;let a=o.includes("set_speed");const l=s.show_oscillate!==!1&&o.includes("oscillate"),u=s.show_direction!==!1&&o.includes("direction"),c=s.show_presets!==!1&&o.includes("preset_mode");n==="on-off"&&(a=!1);let v=e&&a,g=v&&t(this,$,ir),b=!1,I=!1;n==="continuous"?g=!1:n==="stepped"?I=g:n==="cycle"?(g=!0,b=!0):g&&t(this,X).length?b=!0:g&&(I=!0),r(this,Go,b);const P=e&&(l||u||c);this.root.innerHTML=`
        <style>${qr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${d(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          ${v||P?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${v&&!g?`
                  <div class="shroom-fan-speed-row">
                    <div class="shroom-slider-wrap">
                      <div class="shroom-slider-bg shroom-fan-slider-bg"></div>
                      <div class="shroom-slider-cover" style="left:0%"></div>
                      <input type="range" class="shroom-slider-input" min="0" max="100"
                        step="1" value="0"
                        aria-label="${d(this.def.friendly_name)} speed"
                        aria-valuetext="0%">
                      <div class="shroom-slider-focus-ring"></div>
                    </div>
                  </div>
                `:""}
                ${v&&I?`
                  <div class="shroom-fan-step-dots">
                    ${t(this,$,qs).map((_,y)=>`
                      <button class="shroom-fan-step-dot" data-pct="${_}" type="button"
                        data-active="false"
                        aria-label="Speed ${y+1} (${_}%)"
                        title="Speed ${y+1} (${_}%)">${y+1}</button>
                    `).join("")}
                  </div>
                `:""}
                ${v&&b?`
                  <div style="display:flex;justify-content:center;">
                    <button class="shroom-fan-cycle-btn" type="button"
                      title="Cycle speed"
                      aria-label="Cycle fan speed">
                      <svg viewBox="0 0 24 24"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg>
                    </button>
                  </div>
                `:""}
                ${P?`
                  <div class="shroom-fan-feat-row">
                    ${l?'<button class="shroom-btn shroom-fan-feat" data-feat="oscillate" type="button" aria-label="Oscillate" aria-pressed="false">Oscillate</button>':""}
                    ${u?'<button class="shroom-btn shroom-fan-feat" data-feat="direction" type="button" aria-label="Direction: forward">Forward</button>':""}
                    ${c?'<button class="shroom-btn shroom-fan-feat" data-feat="preset" type="button" aria-label="Preset">Preset</button>':""}
                  </div>
                `:""}
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,ft,this.root.querySelector(".shroom-icon-shape")),r(this,te,this.root.querySelector(".shroom-secondary")),r(this,W,this.root.querySelector(".shroom-slider-input")),r(this,Me,this.root.querySelector(".shroom-slider-cover")),r(this,qt,this.root.querySelector('[data-feat="oscillate"]')),r(this,It,this.root.querySelector('[data-feat="direction"]')),r(this,Bt,this.root.querySelector('[data-feat="preset"]')),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"card-icon");const Do=this.root.querySelector(".shroom-state-item");if(e){Mt(Do,`${this.def.friendly_name} - Toggle`);const _=()=>{const L=this.config.gestureConfig?.tap;if(L){this._runAction(L);return}this.config.card?.sendCommand("toggle",{})};this._attachGestureHandlers(Do,{onTap:_});const y=this.root.querySelector("[part=row-toggle]");y&&this._attachGestureHandlers(y,{onTap:_})}t(this,W)&&(t(this,W).addEventListener("input",()=>{const _=Number(t(this,W).value);r(this,A,_),t(this,W).setAttribute("aria-valuetext",`${Math.round(_)}%`),p(this,$,Is).call(this),t(this,ke).call(this)}),this.guardSlider(t(this,W),t(this,ke))),this.root.querySelectorAll(".shroom-fan-step-dot").forEach(_=>{_.addEventListener("click",()=>{const y=Number(_.getAttribute("data-pct"));r(this,A,y),r(this,N,!0),p(this,$,Bs).call(this),this.config.card?.sendCommand("set_percentage",{percentage:y})})}),this.root.querySelector(".shroom-fan-cycle-btn")?.addEventListener("click",()=>{const _=t(this,$,qs);if(!_.length)return;let y;if(!t(this,N)||t(this,A)===0)y=_[0];else{const L=_.findIndex(K=>K>t(this,A));y=L===-1?_[0]:_[L]}r(this,A,y),r(this,N,!0),this.config.card?.sendCommand("set_percentage",{percentage:y})}),t(this,qt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,ee)})}),t(this,It)?.addEventListener("click",()=>{const _=t(this,Vt)==="forward"?"reverse":"forward";r(this,Vt,_),p(this,$,Cs).call(this),this.config.card?.sendCommand("set_direction",{direction:_})}),t(this,Bt)?.addEventListener("click",()=>{if(!t(this,X).length)return;const y=((t(this,Ot)?t(this,X).indexOf(t(this,Ot)):-1)+1)%t(this,X).length,L=t(this,X)[y];r(this,Ot,L),p(this,$,Cs).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:L})}),this.renderCompanions(),M(this.root)}applyState(e,o){r(this,N,e==="on"),r(this,A,o?.percentage??0),r(this,ee,o?.oscillating??!1),r(this,Vt,o?.direction??"forward"),r(this,Ot,o?.preset_mode??null),o?.preset_modes?.length&&r(this,X,o.preset_modes),r(this,oe,t(this,Go)||o?.assumed_state===!0),Ws(this.root,!t(this,N)),C(t(this,ft),"fan",t(this,N));const s=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??"mdi:fan";if(this.renderIcon(this.resolveIcon(s,"mdi:fan"),"card-icon"),t(this,ft))if(t(this,N)&&t(this,A)>0&&!t(this,oe)&&this.config.animate!==!1){const u=1/(1.5*Math.pow(t(this,A)/100,.5));t(this,ft).setAttribute("data-spinning","true"),t(this,ft).style.setProperty("--shroom-fan-duration",`${u.toFixed(2)}s`)}else t(this,ft).setAttribute("data-spinning","false");t(this,te)&&(t(this,N)&&t(this,A)>0&&!t(this,oe)?t(this,te).textContent=`${Math.round(t(this,A))}%`:t(this,te).textContent=w(e)),p(this,$,Is).call(this),p(this,$,Bs).call(this),p(this,$,Cs).call(this);const n=this.root.querySelector("[part=row-toggle]");n&&(n.setAttribute("aria-pressed",String(t(this,N))),n.disabled=e==="unavailable"||e==="unknown");const a=this.root.querySelector("[part=row-state]");a&&(a.textContent=w(e)),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,A)>0&&!t(this,oe)?`, ${Math.round(t(this,A))}%`:""))}predictState(e,o){return e==="toggle"?{state:t(this,N)?"off":"on",attributes:{percentage:t(this,A)}}:e==="set_percentage"?{state:"on",attributes:{percentage:o.percentage,oscillating:t(this,ee),direction:t(this,Vt),preset_mode:t(this,Ot),preset_modes:t(this,X)}}:e==="oscillate"?{state:"on",attributes:{percentage:t(this,A),oscillating:o.oscillating,direction:t(this,Vt)}}:e==="set_direction"?{state:"on",attributes:{percentage:t(this,A),oscillating:t(this,ee),direction:o.direction}}:null}}ft=new WeakMap,te=new WeakMap,W=new WeakMap,Me=new WeakMap,qt=new WeakMap,It=new WeakMap,Bt=new WeakMap,N=new WeakMap,A=new WeakMap,ee=new WeakMap,Vt=new WeakMap,Ot=new WeakMap,X=new WeakMap,ke=new WeakMap,Go=new WeakMap,oe=new WeakMap,$=new WeakSet,_s=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},ir=function(){return t(this,$,_s)>1},qs=function(){const e=t(this,$,_s),o=[];for(let s=1;s*e<=100.001;s++)o.push(s*e);return o},Is=function(){if(!t(this,W))return;const e=t(this,A);this.isSliderActive(t(this,W))||(t(this,W).value=String(e)),t(this,Me)&&(t(this,Me).style.left=`${e}%`)},Bs=function(){const e=t(this,$,_s)/2;this.root.querySelectorAll(".shroom-fan-step-dot").forEach(o=>{const s=Number(o.getAttribute("data-pct"));o.setAttribute("data-active",String(t(this,N)&&t(this,A)>=s-e))})},Cs=function(){t(this,qt)&&(t(this,qt).setAttribute("aria-pressed","false"),t(this,qt).textContent="Oscillate"),t(this,It)&&(t(this,It).textContent="Direction",t(this,It).setAttribute("aria-label","Direction")),t(this,Bt)&&(t(this,Bt).textContent="Preset",t(this,Bt).setAttribute("data-active","false"))},nr=function(){t(this,A)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,A)})};const Br=`
    ${H}
    ${T}
  `;class Vr extends f{constructor(){super(...arguments);i(this,Wo,null);i(this,He,null)}render(){k(this),this.root.innerHTML=`
        <style>${Br}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span part="row-control"><span part="row-value"></span></span>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Wo,this.root.querySelector(".shroom-icon-shape")),r(this,He,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}applyState(e,o){const s=e==="on";C(t(this,Wo),"binary_sensor",s);const n=this.formatStateLabel(e);t(this,He)&&(t(this,He).textContent=n);const a=this.root.querySelector("[part=row-value]");a&&(a.textContent=n);const l=s?"mdi:radiobox-marked":"mdi:radiobox-blank",u=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(u,l),"card-icon"),this.announceState(`${this.def.friendly_name}, ${n}`)}}Wo=new WeakMap,He=new WeakMap;const Or=`
    ${H}
    ${T}

    .shroom-generic-toggle {
      -webkit-appearance: none;
      appearance: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: var(--hrv-radius-l, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: var(--hrv-font-size-s, 13px);
      font-weight: var(--hrv-font-weight-medium, 500);
      font-family: inherit;
      cursor: pointer;
      transition: background 280ms ease-out;
      line-height: 1;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
    }
    .shroom-generic-toggle:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-generic-toggle[data-on=true] {
      background: var(--hrv-color-primary);
      color: var(--hrv-color-on-primary);
    }
    .shroom-generic-toggle[hidden] { display: none; }
    .shroom-generic-toggle:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-generic-toggle { transition: none; }
    }
  `;class Pr extends f{constructor(){super(...arguments);i(this,Yo,null);i(this,Te,null);i(this,Y,null);i(this,lt,!1);i(this,se,!1)}render(){k(this);const e=this.def.capabilities==="read-write";r(this,se,!1),this.root.innerHTML=`
        <style>${Or}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span part="row-control"><span part="row-value"></span></span>
          ${e?`
            <button class="shroom-generic-toggle" type="button" data-on="false"
              title="Toggle" aria-label="${d(this.def.friendly_name)} - Toggle"
              hidden>Toggle</button>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Yo,this.root.querySelector(".shroom-icon-shape")),r(this,Te,this.root.querySelector(".shroom-secondary")),r(this,Y,this.root.querySelector(".shroom-generic-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:help-circle"),"card-icon"),t(this,Y)&&e&&this._attachGestureHandlers(t(this,Y),{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),M(this.root)}applyState(e,o){const s=e==="on"||e==="off";r(this,lt,e==="on"),t(this,Te)&&(t(this,Te).textContent=w(e));const n=this.root.querySelector("[part=row-value]");n&&(n.textContent=w(e));const a=this.def.domain??"generic";C(t(this,Yo),a,t(this,lt)),t(this,Y)&&(s&&!t(this,se)&&(t(this,Y).removeAttribute("hidden"),r(this,se,!0)),t(this,se)&&(t(this,Y).setAttribute("data-on",String(t(this,lt))),t(this,Y).setAttribute("aria-pressed",String(t(this,lt))),t(this,Y).textContent=t(this,lt)?"On":"Off",t(this,Y).title=t(this,lt)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,o){return e!=="toggle"?null:{state:t(this,lt)?"off":"on",attributes:{}}}}Yo=new WeakMap,Te=new WeakMap,Y=new WeakMap,lt=new WeakMap,se=new WeakMap;const Dr=`
    ${H}
    ${$s}
    ${Zo}
    ${kt}
    ${T}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }

    .shroom-controls-shell {
      margin-left: calc(var(--hrv-ex-shroom-icon-size, 42px) + var(--hrv-ex-shroom-spacing, 12px));
    }
  `;class Xs extends f{constructor(e,o,s,n){super(e,o,s,n);i(this,gt);i(this,Uo,null);i(this,Ee,null);i(this,U,null);i(this,qe,null);i(this,dt,0);i(this,vt,0);i(this,Ie,100);i(this,Ko,1);i(this,Be);r(this,Be,it(p(this,gt,hr).bind(this),300))}render(){k(this);const e=this.def.capabilities==="read-write";if(r(this,vt,this.def.feature_config?.min??0),r(this,Ie,this.def.feature_config?.max??100),r(this,Ko,this.def.feature_config?.step??1),this.root.innerHTML=`
        <style>${Dr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-controls-shell" data-collapsed="false">
              <div class="shroom-slider-wrap">
                <div class="shroom-slider-bg shroom-num-slider-bg"></div>
                <div class="shroom-slider-cover" style="left:0%"></div>
                <input type="range" class="shroom-slider-input"
                  min="${t(this,vt)}" max="${t(this,Ie)}" step="${t(this,Ko)}" value="${t(this,vt)}"
                  aria-label="${d(this.def.friendly_name)} value"
                  aria-valuetext="${t(this,vt)}${this.def.unit_of_measurement?` ${d(this.def.unit_of_measurement)}`:""}">
                <div class="shroom-slider-focus-ring"></div>
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Uo,this.root.querySelector(".shroom-icon-shape")),r(this,Ee,this.root.querySelector(".shroom-secondary")),r(this,U,this.root.querySelector(".shroom-slider-input")),r(this,qe,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:ray-vertex"),"card-icon"),C(t(this,Uo),"input_number",!0),t(this,U)){const o=this.def.unit_of_measurement??"";t(this,U).addEventListener("input",()=>{r(this,dt,parseFloat(t(this,U).value)),t(this,U).setAttribute("aria-valuetext",`${t(this,dt)}${o?` ${o}`:""}`),p(this,gt,Vs).call(this),t(this,Be).call(this)}),this.guardSlider(t(this,U),t(this,Be))}this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}applyState(e,o){const s=parseFloat(e);if(isNaN(s))return;r(this,dt,s),p(this,gt,Vs).call(this);const n=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${s}${n?` ${n}`:""}`)}predictState(e,o){return e==="set_value"&&o.value!==void 0?{state:String(o.value),attributes:{}}:null}}Uo=new WeakMap,Ee=new WeakMap,U=new WeakMap,qe=new WeakMap,dt=new WeakMap,vt=new WeakMap,Ie=new WeakMap,Ko=new WeakMap,Be=new WeakMap,gt=new WeakSet,ar=function(e){const o=t(this,Ie)-t(this,vt);return o===0?0:Math.max(0,Math.min(100,(e-t(this,vt))/o*100))},Vs=function(){const e=p(this,gt,ar).call(this,t(this,dt));t(this,qe)&&(t(this,qe).style.left=`${e}%`),t(this,U)&&!this.isSliderActive(t(this,U))&&(t(this,U).value=String(t(this,dt)));const o=this.def.unit_of_measurement??"";t(this,Ee)&&(t(this,Ee).textContent=`${t(this,dt)}${o?` ${o}`:""}`)},hr=function(){this.config.card?.sendCommand("set_value",{value:t(this,dt)})};const Nr=`
    ${H}
    ${kt}
    ${T}

    .shroom-select-shell {
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
    }

    /* Pills mode: chip row */
    .shroom-select-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .shroom-select-pill {
      padding: 6px 14px;
      border-radius: 999px;
      border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.08));
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .shroom-select-pill:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-select-pill[data-active=true] {
      background: color-mix(in srgb, var(--hrv-color-primary, #ff9800) 28%, transparent);
      border-color: color-mix(in srgb, var(--hrv-color-primary, #ff9800) 60%, transparent);
    }

    /* Dropdown mode: trigger button */
    .shroom-select-current {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: 13px;
      font-family: inherit;
      text-align: left;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 280ms ease-out;
    }
    .shroom-select-current:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-select-current:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .shroom-select-arrow {
      font-size: 10px;
      opacity: 0.5;
      transition: transform 200ms ease;
    }
    .shroom-select-current[aria-expanded=true] .shroom-select-arrow {
      transform: rotate(180deg);
    }

    /* Dropdown menu - rendered as a popover in the top layer so it
       escapes any ancestor stacking context or overflow:hidden. */
    .shroom-select-dropdown {
      position: fixed;
      margin: 0;
      inset: unset;
      background: var(--hrv-card-background, #ffffff);
      border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.08));
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      max-height: 240px;
      overflow-y: auto;
      scrollbar-width: thin;
      padding: 4px;
      color: var(--hrv-color-text, #212121);
      font-family: inherit;
    }
    .shroom-select-dropdown:not(:popover-open) { display: none; }
    .shroom-select-option {
      display: block;
      width: 100%;
      padding: 8px 14px;
      border: none;
      background: transparent;
      color: var(--hrv-color-text, #212121);
      text-align: left;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      border-radius: 8px;
      transition: background 150ms;
    }
    .shroom-select-option:hover,
    .shroom-select-option:focus-visible {
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      outline: none;
    }
    .shroom-select-option[data-active=true] {
      color: var(--hrv-color-primary, #ff9800);
      font-weight: 600;
      background: color-mix(in srgb, var(--hrv-color-primary, #ff9800) 14%, transparent);
    }
  `;class Js extends f{constructor(){super(...arguments);i(this,B);i(this,Xo,null);i(this,Ve,null);i(this,D,null);i(this,E,null);i(this,re,null);i(this,ie,[]);i(this,bt,[]);i(this,xs,"");i(this,Pt,[]);i(this,Oe,"");i(this,yt,!1);i(this,ne,"pills");i(this,Dt,null);i(this,z,null)}render(){k(this);const e=this.def.capabilities==="read-write",o=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";r(this,ne,o==="dropdown"?"dropdown":"pills"),r(this,Pt,this.def.feature_config?.options??[]);const s=e?t(this,ne)==="dropdown"?`
            <div class="shroom-select-shell">
              <button class="shroom-select-current" type="button"
                aria-label="${d(this.def.friendly_name)}"
                aria-haspopup="listbox" aria-expanded="false">
                <span class="shroom-select-label">-</span>
                <span class="shroom-select-arrow" aria-hidden="true">&#9660;</span>
              </button>
              <div class="shroom-select-dropdown" role="listbox" popover="manual"></div>
            </div>`:`
            <div class="shroom-select-shell">
              <div class="shroom-select-grid"></div>
            </div>`:"";this.root.innerHTML=`
        <style>${Nr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${s}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Xo,this.root.querySelector(".shroom-icon-shape")),r(this,Ve,this.root.querySelector(".shroom-secondary")),r(this,D,this.root.querySelector(".shroom-select-current")),r(this,E,this.root.querySelector(".shroom-select-dropdown")),r(this,re,this.root.querySelector(".shroom-select-grid")),r(this,ie,[]),r(this,bt,[]),r(this,Oe,""),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:form-select"),"card-icon"),C(t(this,Xo),"input_select",!0),t(this,D)&&e&&(t(this,D).addEventListener("click",n=>{n.stopPropagation(),t(this,yt)?p(this,B,zo).call(this):p(this,B,Ps).call(this)}),t(this,D).addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" "||n.key==="ArrowDown")&&!t(this,yt)?(n.preventDefault(),p(this,B,Ps).call(this),t(this,bt)[0]?.focus()):n.key==="Escape"&&t(this,yt)&&(p(this,B,zo).call(this),t(this,D).focus())}),r(this,Dt,n=>{t(this,yt)&&!this.root.host.contains(n.target)&&p(this,B,zo).call(this)}),document.addEventListener("click",t(this,Dt))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}applyState(e,o){r(this,xs,e);const s=o?.options,n=Array.isArray(s)&&s.length?s:t(this,Pt);r(this,Pt,n),t(this,Ve)&&(t(this,Ve).textContent=e);const a=n.join("|");if(a!==t(this,Oe)&&(r(this,Oe,a),t(this,ne)==="dropdown"?p(this,B,dr).call(this,n):p(this,B,lr).call(this,n)),t(this,ne)==="dropdown"){const l=this.root.querySelector(".shroom-select-label");l&&(l.textContent=e);for(const u of t(this,bt)){const c=u.dataset.option===e;u.setAttribute("data-active",String(c)),u.setAttribute("aria-selected",String(c))}}else for(const l of t(this,ie))l.setAttribute("data-active",String(l.dataset.option===e));this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,o){return e==="select_option"&&o.option!==void 0?{state:String(o.option),attributes:{options:t(this,Pt)}}:null}destroy(){t(this,Dt)&&(document.removeEventListener("click",t(this,Dt)),r(this,Dt,null)),t(this,z)&&(window.removeEventListener("scroll",t(this,z),!0),window.removeEventListener("resize",t(this,z)),r(this,z,null));try{t(this,E)?.hidePopover?.()}catch{}}}Xo=new WeakMap,Ve=new WeakMap,D=new WeakMap,E=new WeakMap,re=new WeakMap,ie=new WeakMap,bt=new WeakMap,xs=new WeakMap,Pt=new WeakMap,Oe=new WeakMap,yt=new WeakMap,ne=new WeakMap,Dt=new WeakMap,z=new WeakMap,B=new WeakSet,lr=function(e){if(t(this,re)){t(this,re).innerHTML="",r(this,ie,[]);for(const o of e){const s=document.createElement("button");s.type="button",s.className="shroom-select-pill",s.dataset.option=o,s.textContent=w(o),s.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:o})}),t(this,re).appendChild(s),t(this,ie).push(s)}}},dr=function(e){if(t(this,E)){t(this,E).innerHTML="",r(this,bt,[]);for(const o of e){const s=document.createElement("button");s.type="button",s.className="shroom-select-option",s.role="option",s.dataset.option=o,s.textContent=w(o),s.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:o}),p(this,B,zo).call(this),t(this,D)?.focus()}),s.addEventListener("keydown",n=>{const a=t(this,bt),l=a.indexOf(s);n.key==="ArrowDown"?(n.preventDefault(),a[Math.min(l+1,a.length-1)]?.focus()):n.key==="ArrowUp"?(n.preventDefault(),l===0?t(this,D)?.focus():a[l-1]?.focus()):n.key==="Escape"&&(p(this,B,zo).call(this),t(this,D)?.focus())}),t(this,E).appendChild(s),t(this,bt).push(s)}}},Os=function(){if(!t(this,E)||!t(this,D))return;const e=t(this,D).getBoundingClientRect(),o=window.innerHeight-e.bottom,s=e.top,n=Math.min(t(this,E).scrollHeight||240,240);t(this,E).style.left=`${Math.round(e.left)}px`,t(this,E).style.width=`${Math.round(e.width)}px`,o<n+8&&s>o?t(this,E).style.top=`${Math.max(8,Math.round(e.top-n-6))}px`:t(this,E).style.top=`${Math.round(e.bottom+6)}px`},Ps=function(){if(!(!t(this,E)||!t(this,Pt).length)){try{typeof t(this,E).showPopover=="function"&&t(this,E).showPopover()}catch{}t(this,D)?.setAttribute("aria-expanded","true"),p(this,B,Os).call(this),r(this,z,()=>p(this,B,Os).call(this)),window.addEventListener("scroll",t(this,z),!0),window.addEventListener("resize",t(this,z)),r(this,yt,!0)}},zo=function(){try{typeof t(this,E)?.hidePopover=="function"&&t(this,E).hidePopover()}catch{}t(this,D)?.setAttribute("aria-expanded","false"),t(this,z)&&(window.removeEventListener("scroll",t(this,z),!0),window.removeEventListener("resize",t(this,z)),r(this,z,null)),r(this,yt,!1)};const zr=`
    ${H}
    ${Zo}
    ${kt}
    ${T}

    .shroom-cover-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      min-height: var(--hrv-ex-shroom-slider-height, 42px);
    }
    .shroom-cover-slider-view {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 8px;
    }
    .shroom-cover-slider-view[hidden] { display: none; }
    .shroom-cover-slider-view .shroom-slider-wrap { flex: 1; }
    .shroom-cover-btn-view {
      display: flex;
      flex: 1;
      justify-content: center;
      gap: 8px;
    }
    .shroom-cover-btn-view[hidden] { display: none; }
    .shroom-cover-action-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 280ms ease-out;
    }
    .shroom-cover-action-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-cover-action-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .shroom-cover-action-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-cover-toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-cover-toggle-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-cover-toggle-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-cover-slider-bg {
      background: var(--hrv-ex-shroom-cover, #5389ec);
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-cover-action-btn,
      .shroom-cover-toggle-btn { transition: none; }
    }
  `;class Zr extends f{constructor(e,o,s,n){super(e,o,s,n);i(this,Z);i(this,Jo,null);i(this,Pe,null);i(this,J,null);i(this,De,null);i(this,Ne,null);i(this,Q,null);i(this,ze,null);i(this,xt,0);i(this,Ze,null);i(this,ae,null);i(this,he,null);i(this,le,null);i(this,wt,0);i(this,ct,!1);i(this,Re,"closed");i(this,Qo,{});i(this,je);i(this,Fe);r(this,je,it(p(this,Z,pr).bind(this),300)),r(this,Fe,it(p(this,Z,ur).bind(this),300))}render(){k(this);const e=this.def.capabilities==="read-write",o=this.config.displayHints??{},s=o.show_position!==!1&&this.def.supported_features?.includes("set_position"),n=o.show_tilt!==!1&&this.def.supported_features?.includes("set_tilt_position"),a=!this.def.supported_features||this.def.supported_features.includes("buttons"),l=e&&(s||n||a);this.root.innerHTML=`
        <style>${zr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span part="row-control"><span part="row-state"></span></span>
          ${l?`
            ${s||a?`
            <div class="shroom-cover-bar">
              ${s?`
                <div class="shroom-cover-slider-view">
                  <div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-cover-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <div class="shroom-slider-edge" style="left:0%"></div>
                    <input part="position-slider" type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${d(this.def.friendly_name)} position"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>
                </div>
              `:""}
              ${a?`
                <div class="shroom-cover-btn-view"${s?" hidden":""}>
                  <button class="shroom-cover-action-btn" data-action="open" type="button"
                    title="Open" aria-label="Open cover">
                    <svg viewBox="0 0 24 24"><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/></svg>
                  </button>
                  <button class="shroom-cover-action-btn" data-action="stop" type="button"
                    title="Stop" aria-label="Stop cover">
                    <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                  </button>
                  <button class="shroom-cover-action-btn" data-action="close" type="button"
                    title="Close" aria-label="Close cover">
                    <svg viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                  </button>
                </div>
              `:""}
              ${s&&a?`
                <button class="shroom-cover-toggle-btn" type="button" title="Controls" aria-label="Toggle cover controls" aria-expanded="false">
                  <svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>
                </button>
              `:""}
            </div>
            `:""}
            ${n?`
              <div class="shroom-cover-bar">
                <div class="shroom-cover-slider-view">
                  <div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-cover-slider-bg"></div>
                    <div class="shroom-slider-cover shroom-cover-tilt-cover" style="left:0%"></div>
                    <div class="shroom-slider-edge shroom-cover-tilt-edge" style="left:0%"></div>
                    <input part="tilt-slider" type="range" class="shroom-slider-input shroom-cover-tilt-slider"
                      min="0" max="100" step="1" value="0"
                      aria-label="${d(this.def.friendly_name)} tilt"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>
                </div>
              </div>
            `:""}
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Jo,this.root.querySelector(".shroom-icon-shape")),r(this,Pe,this.root.querySelector(".shroom-secondary")),r(this,J,this.root.querySelector("[part=position-slider]")),r(this,De,this.root.querySelector(".shroom-slider-cover")),r(this,Q,this.root.querySelector("[part=tilt-slider]")),r(this,ze,this.root.querySelector(".shroom-cover-tilt-cover")),r(this,Ne,this.root.querySelector(".shroom-cover-slider-view")),r(this,Ze,this.root.querySelector(".shroom-cover-btn-view")),r(this,ae,this.root.querySelector("[data-action=open]")),r(this,he,this.root.querySelector("[data-action=stop]")),r(this,le,this.root.querySelector("[data-action=close]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:window-shutter"),"card-icon"),t(this,J)&&(t(this,J).addEventListener("input",()=>{r(this,wt,parseInt(t(this,J).value,10)),p(this,Z,Ds).call(this),t(this,je).call(this)}),this.guardSlider(t(this,J),t(this,je))),t(this,Q)&&(t(this,Q).addEventListener("input",()=>{r(this,xt,parseInt(t(this,Q).value,10)),p(this,Z,Ns).call(this),t(this,Fe).call(this)}),this.guardSlider(t(this,Q),t(this,Fe))),[t(this,ae),t(this,he),t(this,le)].forEach(c=>{if(!c)return;const v=c.getAttribute("data-action");c.addEventListener("click",()=>{this.config.card?.sendCommand(`${v}_cover`,{})})});const u=this.root.querySelector(".shroom-cover-toggle-btn");u?.addEventListener("click",()=>{r(this,ct,!t(this,ct)),u.setAttribute("aria-expanded",String(t(this,ct))),u.setAttribute("aria-label",t(this,ct)?"Show position slider":"Show cover buttons"),p(this,Z,cr).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}applyState(e,o){r(this,Re,e),r(this,Qo,{...o});const s=e==="open"||e==="opening";if(C(t(this,Jo),"cover",s),t(this,Pe)){const u=o.current_position,c=w(e);t(this,Pe).textContent=u!==void 0?`${c} - ${u}%`:c}const n=this.root.querySelector("[part=row-state]");n&&(n.textContent=w(e));const a=e==="opening"||e==="closing",l=o.current_position;t(this,ae)&&(t(this,ae).disabled=!a&&l===100),t(this,he)&&(t(this,he).disabled=!a),t(this,le)&&(t(this,le).disabled=!a&&e==="closed"),o.current_position!==void 0&&(r(this,wt,o.current_position),t(this,J)&&!this.isSliderActive(t(this,J))&&(t(this,J).value=String(t(this,wt))),p(this,Z,Ds).call(this)),o.current_tilt_position!==void 0&&(r(this,xt,o.current_tilt_position),t(this,Q)&&!this.isSliderActive(t(this,Q))&&(t(this,Q).value=String(t(this,xt))),p(this,Z,Ns).call(this)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,o){const s={...t(this,Qo)};return e==="open_cover"?(s.current_position=100,{state:"open",attributes:s}):e==="close_cover"?(s.current_position=0,{state:"closed",attributes:s}):e==="stop_cover"?{state:t(this,Re),attributes:s}:e==="set_cover_position"&&o.position!==void 0?(s.current_position=o.position,{state:o.position>0?"open":"closed",attributes:s}):e==="set_cover_tilt_position"&&o.tilt_position!==void 0?(s.current_tilt_position=o.tilt_position,{state:t(this,Re),attributes:s}):null}}Jo=new WeakMap,Pe=new WeakMap,J=new WeakMap,De=new WeakMap,Ne=new WeakMap,Q=new WeakMap,ze=new WeakMap,xt=new WeakMap,Ze=new WeakMap,ae=new WeakMap,he=new WeakMap,le=new WeakMap,wt=new WeakMap,ct=new WeakMap,Re=new WeakMap,Qo=new WeakMap,je=new WeakMap,Fe=new WeakMap,Z=new WeakSet,cr=function(){t(this,Ne)&&(t(this,Ne).hidden=t(this,ct)),t(this,Ze)&&(t(this,Ze).hidden=!t(this,ct));const e=this.root.querySelector(".shroom-cover-toggle-btn");e&&(e.innerHTML=t(this,ct)?'<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>')},Ds=function(){t(this,De)&&(t(this,De).style.left=`${t(this,wt)}%`);const e=this.root.querySelector(".shroom-slider-edge");e&&(e.style.left=`${t(this,wt)}%`)},pr=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,wt)})},Ns=function(){t(this,ze)&&(t(this,ze).style.left=`${t(this,xt)}%`);const e=this.root.querySelector(".shroom-cover-tilt-edge");e&&(e.style.left=`${t(this,xt)}%`)},ur=function(){this.config.card?.sendCommand("set_cover_tilt_position",{tilt_position:t(this,xt)})};const Rr=`
    ${H}
    ${T}
  `;class jr extends f{constructor(){super(...arguments);i(this,Ge,null);i(this,We,null);i(this,ts,!1)}render(){k(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Rr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ge,this.root.querySelector(".shroom-icon-shape")),r(this,We,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:remote"),"card-icon"),C(t(this,Ge),"remote",!1);const o=this.root.querySelector(".shroom-state-item");e&&(Mt(o,`${this.def.friendly_name} - Toggle power`),this._attachGestureHandlers(o,{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand(t(this,ts)?"turn_off":"turn_on",{})}})),this.renderCompanions(),M(this.root)}applyState(e,o){const s=e==="on";r(this,ts,s),C(t(this,Ge),"remote",s),t(this,We)&&(t(this,We).textContent=w(e));const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(n,"mdi:remote"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ge=new WeakMap,We=new WeakMap,ts=new WeakMap;function ys(h){h<0&&(h=0);const m=Math.floor(h/3600),e=Math.floor(h%3600/60),o=Math.floor(h%60),s=n=>String(n).padStart(2,"0");return m>0?`${m}:${s(e)}:${s(o)}`:`${s(e)}:${s(o)}`}function Qs(h){if(typeof h=="number")return h;if(typeof h!="string")return 0;const m=h.split(":").map(Number);return m.length===3?m[0]*3600+m[1]*60+m[2]:m.length===2?m[0]*60+m[1]:m[0]||0}const Fr=`
    ${H}
    ${kt}
    ${T}

    .shroom-timer-controls {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
    }
    .shroom-timer-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 280ms ease-out;
    }
    .shroom-timer-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-timer-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .shroom-timer-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-timer-btn { transition: none; }
    }
  `;class Gr extends f{constructor(){super(...arguments);i(this,G);i(this,Ye,null);i(this,Nt,null);i(this,zt,null);i(this,de,null);i(this,ce,null);i(this,pe,null);i(this,Ue,"idle");i(this,Ke,{});i(this,tt,null);i(this,Xe,null)}render(){k(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Fr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-timer-controls">
              <button class="shroom-timer-btn" data-action="playpause" type="button"
                title="Start" aria-label="${d(this.def.friendly_name)} - Start">
                <span part="playpause-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="cancel" type="button"
                title="Cancel" aria-label="${d(this.def.friendly_name)} - Cancel">
                <span part="cancel-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="finish" type="button"
                title="Finish" aria-label="${d(this.def.friendly_name)} - Finish">
                <span part="finish-icon" aria-hidden="true"></span>
              </button>
            </div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ye,this.root.querySelector(".shroom-icon-shape")),r(this,Nt,this.root.querySelector(".shroom-secondary")),r(this,zt,this.root.querySelector("[data-action=playpause]")),r(this,de,this.root.querySelector("[data-action=cancel]")),r(this,ce,this.root.querySelector("[data-action=finish]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:timer-outline"),"card-icon"),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),C(t(this,Ye),"timer",!1),e&&(t(this,zt)?.addEventListener("click",()=>{const o=t(this,Ue)==="active"?"pause":"start";this.config.card?.sendCommand(o,{})}),t(this,de)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,ce)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}applyState(e,o){r(this,Ue,e),r(this,Ke,{...o}),r(this,tt,o.finishes_at??null),r(this,Xe,o.remaining!=null?Qs(o.remaining):null);const s=e==="active";C(t(this,Ye),"timer",s||e==="paused"),p(this,G,mr).call(this,e),p(this,G,fr).call(this,e),s&&t(this,tt)?p(this,G,vr).call(this):p(this,G,vs).call(this)}predictState(e,o){const s={...t(this,Ke)};return e==="start"?{state:"active",attributes:s}:e==="pause"?(t(this,tt)&&(s.remaining=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3)),{state:"paused",attributes:s}):e==="cancel"||e==="finish"?{state:"idle",attributes:s}:null}}Ye=new WeakMap,Nt=new WeakMap,zt=new WeakMap,de=new WeakMap,ce=new WeakMap,pe=new WeakMap,Ue=new WeakMap,Ke=new WeakMap,tt=new WeakMap,Xe=new WeakMap,G=new WeakSet,mr=function(e){const o=e==="idle",s=e==="active";if(t(this,zt)){const n=s?"mdi:pause":"mdi:play",a=s?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(n,"playpause-icon"),t(this,zt).title=a,t(this,zt).setAttribute("aria-label",`${this.def.friendly_name} - ${a}`)}t(this,de)&&(t(this,de).disabled=o),t(this,ce)&&(t(this,ce).disabled=o),this.announceState(`${this.def.friendly_name}, ${e}`)},fr=function(e){if(!t(this,Nt))return;const o=w(e);let s=null;if(e==="idle"){const n=t(this,Ke).duration;s=n?ys(Qs(n)):"00:00"}else if(e==="paused"&&t(this,Xe)!=null)s=ys(t(this,Xe));else if(e==="active"&&t(this,tt)){const n=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3);s=ys(n)}t(this,Nt).textContent=s?`${o} - ${s}`:o},vr=function(){p(this,G,vs).call(this),r(this,pe,setInterval(()=>{if(!t(this,tt)||t(this,Ue)!=="active"){p(this,G,vs).call(this);return}const e=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3);t(this,Nt)&&(t(this,Nt).textContent=`Active - ${ys(e)}`),e<=0&&p(this,G,vs).call(this)},1e3))},vs=function(){t(this,pe)&&(clearInterval(t(this,pe)),r(this,pe,null))};const Wr=`
    ${H}
    ${kt}
    ${T}

    .shroom-climate-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      min-height: var(--hrv-ex-shroom-slider-height, 42px);
    }
    .shroom-climate-bar[hidden] { display: none; }
    .shroom-climate-temp-view {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 4px;
    }
    .shroom-climate-temp-view[hidden] { display: none; }
    .shroom-climate-step-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: 18px;
      font-weight: 400;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-climate-step-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-climate-step-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .shroom-climate-temp-display {
      flex: 1;
      text-align: center;
      font-size: 28px;
      font-weight: 300;
      color: var(--hrv-color-text, #212121);
      line-height: 1;
    }
    .shroom-climate-temp-frac {
      font-size: 16px;
      color: var(--hrv-color-text-secondary, #757575);
    }
    .shroom-climate-temp-unit {
      font-size: 14px;
      color: var(--hrv-color-text-secondary, #757575);
      margin-left: 2px;
    }
    .shroom-climate-feat-view {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }
    .shroom-climate-feat-view[hidden] { display: none; }
    .shroom-climate-feat-btn {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 12px;
      border: none;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      font-size: 11px;
      font-family: inherit;
      cursor: pointer;
      transition: background 280ms ease-out;
      line-height: 1.2;
    }
    .shroom-climate-feat-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-climate-feat-label {
      font-size: 10px;
      color: var(--hrv-color-text-secondary, #757575);
    }
    .shroom-climate-feat-value {
      font-weight: 500;
    }
    .shroom-climate-toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-climate-toggle-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-climate-toggle-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    /* Climate dropdown - rendered as a popover in the top layer so it
       escapes any ancestor stacking context or overflow:hidden. */
    .shroom-climate-dropdown {
      position: fixed;
      margin: 0;
      inset: unset;
      background: var(--hrv-card-background, #ffffff);
      border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.08));
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      max-height: 240px;
      overflow-y: auto;
      scrollbar-width: thin;
      padding: 4px;
      color: var(--hrv-color-text, #212121);
      font-family: inherit;
    }
    .shroom-climate-dropdown:not(:popover-open) { display: none; }
    .shroom-climate-dd-option {
      display: block;
      width: 100%;
      padding: 8px 14px;
      border: none;
      background: transparent;
      color: var(--hrv-color-text, #212121);
      text-align: left;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      border-radius: 8px;
      transition: background 150ms;
    }
    .shroom-climate-dd-option:hover,
    .shroom-climate-dd-option:focus-visible {
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      outline: none;
    }
    .shroom-climate-dd-option[data-active=true] {
      color: var(--hrv-color-primary, #ff9800);
      font-weight: 600;
      background: color-mix(in srgb, var(--hrv-color-primary, #ff9800) 14%, transparent);
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-climate-step-btn,
      .shroom-climate-feat-btn,
      .shroom-climate-toggle-btn { transition: none; }
    }
  `;class Yr extends f{constructor(e,o,s,n){super(e,o,s,n);i(this,S);i(this,es,null);i(this,Je,null);i(this,Qe,null);i(this,to,null);i(this,eo,null);i(this,oo,null);i(this,so,null);i(this,ro,null);i(this,io,null);i(this,no,null);i(this,ao,null);i(this,O,null);i(this,ho,null);i(this,lo,null);i(this,_t,null);i(this,ue,null);i(this,pt,null);i(this,R,null);i(this,Ct,!1);i(this,St,20);i(this,co,null);i(this,et,"off");i(this,po,null);i(this,uo,null);i(this,mo,null);i(this,os,16);i(this,ss,32);i(this,rs,.5);i(this,fo,"°C");i(this,Zt,[]);i(this,me,[]);i(this,fe,[]);i(this,ve,[]);i(this,is,{});i(this,ns);r(this,ns,it(p(this,S,br).bind(this),500))}render(){k(this);const e=this.def.capabilities==="read-write",o=this.config.displayHints??{},s=this.def.supported_features?.includes("target_temperature"),n=o.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),a=o.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),l=o.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);r(this,os,this.def.feature_config?.min_temp??16),r(this,ss,this.def.feature_config?.max_temp??32),r(this,rs,this.def.feature_config?.temp_step??.5),r(this,fo,this.def.unit_of_measurement??"°C"),r(this,Zt,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),r(this,me,this.def.feature_config?.fan_modes??[]),r(this,fe,this.def.feature_config?.preset_modes??[]),r(this,ve,this.def.feature_config?.swing_modes??[]);const u=e&&(t(this,Zt).length||t(this,fe).length||t(this,me).length||t(this,ve).length),[c,v]=t(this,St).toFixed(1).split(".");this.root.innerHTML=`
        <style>${Wr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${s||u?`
            <div class="shroom-climate-bar">
              ${s?`
                <div class="shroom-climate-temp-view">
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="-" type="button"
                      aria-label="Decrease temperature" title="Decrease">&#8722;</button>
                  `:""}
                  <span class="shroom-climate-temp-display">
                    <span class="shroom-climate-temp-int">${d(c)}</span><span class="shroom-climate-temp-frac">.${d(v)}</span>
                    <span class="shroom-climate-temp-unit">${d(t(this,fo))}</span>
                  </span>
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  `:""}
                </div>
              `:""}
              ${u?`
                <div class="shroom-climate-feat-view" hidden>
                  ${o.show_hvac_modes!==!1&&t(this,Zt).length?`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${a&&t(this,fe).length?`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${n&&t(this,me).length?`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${l&&t(this,ve).length?`
                    <button class="shroom-climate-feat-btn" data-feat="swing" type="button" title="Change swing mode" aria-label="Change swing mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Swing</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                </div>
                <button class="shroom-climate-toggle-btn" type="button" title="Settings" aria-label="Toggle climate settings" aria-expanded="false">
                  <svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>
                </button>
              `:""}
            </div>
            <div class="shroom-climate-dropdown" role="listbox" popover="manual"></div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,es,this.root.querySelector(".shroom-icon-shape")),r(this,Je,this.root.querySelector(".shroom-secondary")),r(this,Qe,this.root.querySelector(".shroom-climate-bar")),r(this,to,this.root.querySelector(".shroom-climate-temp-int")),r(this,eo,this.root.querySelector(".shroom-climate-temp-frac")),r(this,oo,this.root.querySelector("[data-dir='-']")),r(this,so,this.root.querySelector("[data-dir='+']")),r(this,ro,this.root.querySelector("[data-feat=mode]")),r(this,io,this.root.querySelector("[data-feat=fan]")),r(this,no,this.root.querySelector("[data-feat=preset]")),r(this,ao,this.root.querySelector("[data-feat=swing]")),r(this,O,this.root.querySelector(".shroom-climate-dropdown")),r(this,ho,this.root.querySelector(".shroom-climate-temp-view")),r(this,lo,this.root.querySelector(".shroom-climate-feat-view")),r(this,_t,this.root.querySelector(".shroom-climate-toggle-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:thermostat"),"card-icon");const g=this.root.querySelector(".shroom-state-item");e&&(Mt(g,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(g,{onTap:()=>{const b=this.config.gestureConfig?.tap;if(b){this._runAction(b);return}const I=t(this,et)==="off"?t(this,Zt).find(P=>P!=="off")??"heat":"off";this.config.card?.sendCommand("set_hvac_mode",{hvac_mode:I})}})),t(this,oo)&&t(this,oo).addEventListener("click",b=>{b.stopPropagation(),p(this,S,zs).call(this,-1)}),t(this,so)&&t(this,so).addEventListener("click",b=>{b.stopPropagation(),p(this,S,zs).call(this,1)}),t(this,_t)&&t(this,_t).addEventListener("click",b=>{b.stopPropagation(),r(this,Ct,!t(this,Ct)),t(this,_t).setAttribute("aria-expanded",String(t(this,Ct))),p(this,S,gr).call(this)}),e&&[t(this,ro),t(this,io),t(this,no),t(this,ao)].forEach(b=>{if(!b)return;const I=b.getAttribute("data-feat");b.addEventListener("click",P=>{P.stopPropagation(),p(this,S,yr).call(this,I)})}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}applyState(e,o){r(this,is,{...o}),r(this,et,e),r(this,po,o.fan_mode??null),r(this,uo,o.preset_mode??null),r(this,mo,o.swing_mode??null),r(this,co,o.current_temperature??null);const s=e==="off";if(t(this,Qe)&&(t(this,Qe).hidden=s),C(t(this,es),"climate",!s),o.temperature!==void 0&&(r(this,St,o.temperature),p(this,S,Zs).call(this)),t(this,Je)){const a=o.hvac_action??e,l=t(this,co)!=null?` - ${t(this,co)} ${t(this,fo)}`:"";t(this,Je).textContent=w(a)+l}p(this,S,xr).call(this);const n=o.hvac_action??e;this.announceState(`${this.def.friendly_name}, ${w(n)}`)}predictState(e,o){const s={...t(this,is)};return e==="set_hvac_mode"&&o.hvac_mode?{state:o.hvac_mode,attributes:s}:e==="set_temperature"&&o.temperature!==void 0?{state:t(this,et),attributes:{...s,temperature:o.temperature}}:e==="set_fan_mode"&&o.fan_mode?{state:t(this,et),attributes:{...s,fan_mode:o.fan_mode}}:e==="set_preset_mode"&&o.preset_mode?{state:t(this,et),attributes:{...s,preset_mode:o.preset_mode}}:e==="set_swing_mode"&&o.swing_mode?{state:t(this,et),attributes:{...s,swing_mode:o.swing_mode}}:null}destroy(){t(this,pt)&&(document.removeEventListener("pointerdown",t(this,pt),!0),r(this,pt,null)),t(this,R)&&(window.removeEventListener("scroll",t(this,R),!0),window.removeEventListener("resize",t(this,R)),r(this,R,null));try{t(this,O)?.hidePopover?.()}catch{}}}es=new WeakMap,Je=new WeakMap,Qe=new WeakMap,to=new WeakMap,eo=new WeakMap,oo=new WeakMap,so=new WeakMap,ro=new WeakMap,io=new WeakMap,no=new WeakMap,ao=new WeakMap,O=new WeakMap,ho=new WeakMap,lo=new WeakMap,_t=new WeakMap,ue=new WeakMap,pt=new WeakMap,R=new WeakMap,Ct=new WeakMap,St=new WeakMap,co=new WeakMap,et=new WeakMap,po=new WeakMap,uo=new WeakMap,mo=new WeakMap,os=new WeakMap,ss=new WeakMap,rs=new WeakMap,fo=new WeakMap,Zt=new WeakMap,me=new WeakMap,fe=new WeakMap,ve=new WeakMap,is=new WeakMap,ns=new WeakMap,S=new WeakSet,gr=function(){t(this,ho)&&(t(this,ho).hidden=t(this,Ct)),t(this,lo)&&(t(this,lo).hidden=!t(this,Ct)),t(this,_t)&&(t(this,_t).innerHTML=t(this,Ct)?'<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>')},zs=function(e){const o=Math.round((t(this,St)+e*t(this,rs))*100)/100;r(this,St,Math.max(t(this,os),Math.min(t(this,ss),o))),p(this,S,Zs).call(this),t(this,ns).call(this)},Zs=function(){const[e,o]=t(this,St).toFixed(1).split(".");t(this,to)&&(t(this,to).textContent=e),t(this,eo)&&(t(this,eo).textContent=`.${o}`)},br=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,St)})},yr=function(e){if(t(this,ue)===e){p(this,S,gs).call(this);return}t(this,ue)&&p(this,S,gs).call(this),r(this,ue,e);let o=[],s=null,n="",a="";switch(e){case"mode":o=t(this,Zt),s=t(this,et),n="set_hvac_mode",a="hvac_mode";break;case"fan":o=t(this,me),s=t(this,po),n="set_fan_mode",a="fan_mode";break;case"preset":o=t(this,fe),s=t(this,uo),n="set_preset_mode",a="preset_mode";break;case"swing":o=t(this,ve),s=t(this,mo),n="set_swing_mode",a="swing_mode";break}if(!o.length||!t(this,O))return;t(this,O).innerHTML=o.map(c=>`
        <button class="shroom-climate-dd-option" data-active="${c===s}" role="option"
          aria-selected="${c===s}" type="button">
          ${d(w(c))}
        </button>
      `).join(""),t(this,O).querySelectorAll(".shroom-climate-dd-option").forEach((c,v)=>{c.addEventListener("click",g=>{g.stopPropagation(),this.config.card?.sendCommand(n,{[a]:o[v]}),p(this,S,gs).call(this)})});const l=this.root.querySelector(`[data-feat="${e}"]`);l&&l.setAttribute("aria-expanded","true");try{t(this,O).showPopover?.()}catch{}p(this,S,Rs).call(this,l),r(this,R,()=>p(this,S,Rs).call(this,l)),window.addEventListener("scroll",t(this,R),!0),window.addEventListener("resize",t(this,R));const u=c=>{c.composedPath().some(g=>g===this.root||g===this.root.host)||p(this,S,gs).call(this)};r(this,pt,u),document.addEventListener("pointerdown",u,!0)},Rs=function(e){if(!t(this,O)||!e)return;const o=e.getBoundingClientRect(),s=window.innerHeight-o.bottom,n=o.top,a=Math.min(t(this,O).scrollHeight||240,240),l=Math.max(140,Math.round(o.width));t(this,O).style.left=`${Math.round(o.left)}px`,t(this,O).style.minWidth=`${l}px`,s<a+8&&n>s?t(this,O).style.top=`${Math.max(8,Math.round(o.top-a-6))}px`:t(this,O).style.top=`${Math.round(o.bottom+6)}px`},gs=function(){r(this,ue,null);try{t(this,O)?.hidePopover?.()}catch{}this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(e=>{e.setAttribute("aria-expanded","false")}),t(this,pt)&&(document.removeEventListener("pointerdown",t(this,pt),!0),r(this,pt,null)),t(this,R)&&(window.removeEventListener("scroll",t(this,R),!0),window.removeEventListener("resize",t(this,R)),r(this,R,null))},xr=function(){const e=(o,s)=>{if(!o)return;const n=o.querySelector(".shroom-climate-feat-value");n&&(n.textContent=w(s??"None"))};e(t(this,ro),t(this,et)),e(t(this,io),t(this,po)),e(t(this,no),t(this,uo)),e(t(this,ao),t(this,mo))};const Ur=`
    ${H}
    ${Zo}
    ${kt}
    ${T}

    .shroom-mp-bar {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
    }
    .shroom-mp-bar[hidden] { display: none; }
    .shroom-mp-transport-view {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: var(--hrv-ex-shroom-slider-height, 42px);
    }
    .shroom-mp-transport-view[hidden] { display: none; }
    .shroom-mp-volume-view {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: var(--hrv-ex-shroom-slider-height, 42px);
    }
    .shroom-mp-volume-view[hidden] { display: none; }
    .shroom-mp-volume-view .shroom-slider-wrap { flex: 1; }
    .shroom-mp-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text, #212121);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-mp-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-mp-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .shroom-mp-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    .shroom-mp-slider-bg {
      background: var(--hrv-ex-shroom-media, #e91e63);
    }
    .shroom-mp-back-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      border: none;
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-icon, #757575);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
      transition: background 280ms ease-out;
    }
    .shroom-mp-back-btn:hover {
      background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10));
    }
    .shroom-mp-back-btn svg {
      width: 20px; height: 20px; fill: currentColor;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-mp-btn,
      .shroom-mp-back-btn { transition: none; }
    }
  `;class Kr extends f{constructor(e,o,s,n){super(e,o,s,n);i(this,ye);i(this,as,null);i(this,vo,null);i(this,ge,null);i(this,go,null);i(this,bo,null);i(this,yo,null);i(this,Rt,null);i(this,hs,null);i(this,ls,null);i(this,ds,null);i(this,xo,null);i(this,ot,null);i(this,jt,null);i(this,cs,!1);i(this,be,!1);i(this,st,0);i(this,Ft,"idle");i(this,$t,{});i(this,wo);r(this,wo,it(p(this,ye,wr).bind(this),200))}render(){k(this);const e=this.def.capabilities==="read-write",o=this.def.supported_features??[],s=this.config.displayHints??{},n=o.includes("play_pause"),a=o.includes("previous_track"),l=o.includes("next_track"),u=o.includes("turn_on")||o.includes("turn_off"),c=s.show_volume!==!1&&o.includes("volume_set"),v=s.show_volume!==!1&&o.includes("volume_step"),g=c||v;this.root.innerHTML=`
        <style>${Ur}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-mp-bar" hidden>
              <div class="shroom-mp-transport-view">
                ${u?`<button class="shroom-mp-btn" data-role="power" type="button" title="Power" aria-label="Power">
                  <span part="power-icon" aria-hidden="true"></span>
                </button>`:""}
                ${a?`
                  <button class="shroom-mp-btn" data-role="prev" type="button" title="Previous" aria-label="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                ${n?`<button class="shroom-mp-btn" data-role="play" type="button" title="Play" aria-label="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>`:""}
                ${l?`
                  <button class="shroom-mp-btn" data-role="next" type="button" title="Next" aria-label="Next track">
                    <span part="next-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                ${g?`<button class="shroom-mp-btn" data-role="volume" type="button" title="Volume" aria-label="Volume controls">
                  <span part="vol-icon" aria-hidden="true"></span>
                </button>`:""}
              </div>
              <div class="shroom-mp-volume-view" hidden>
                  ${v?`<button class="shroom-mp-btn" data-role="vol-down" type="button" title="Volume down" aria-label="Volume down">
                    <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z"/></svg>
                  </button>`:""}
                  ${c?`<div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-mp-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <input type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${d(this.def.friendly_name)} volume"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>`:""}
                  ${v?`<button class="shroom-mp-btn" data-role="vol-up" type="button" title="Volume up" aria-label="Volume up">
                    <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M14,11H17V8H19V11H22V13H19V16H17V13H14V11Z"/></svg>
                  </button>`:""}
                  <button class="shroom-mp-back-btn" type="button" title="Controls" aria-label="Back to controls">
                    <svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
                  </button>
                </div>
            </div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,as,this.root.querySelector(".shroom-icon-shape")),r(this,vo,this.root.querySelector(".shroom-primary")),r(this,ge,this.root.querySelector(".shroom-secondary")),r(this,yo,this.root.querySelector(".shroom-mp-bar")),r(this,go,this.root.querySelector(".shroom-mp-transport-view")),r(this,bo,this.root.querySelector(".shroom-mp-volume-view")),r(this,Rt,this.root.querySelector("[data-role=play]")),r(this,hs,this.root.querySelector("[data-role=prev]")),r(this,ls,this.root.querySelector("[data-role=next]")),r(this,ds,this.root.querySelector("[data-role=power]")),r(this,xo,this.root.querySelector("[data-role=volume]")),r(this,ot,this.root.querySelector(".shroom-slider-input")),r(this,jt,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:speaker"),"card-icon"),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:power","power-icon"),this.renderIcon("mdi:volume-high","vol-icon"),e&&(t(this,Rt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,hs)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,ls)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),t(this,ds)?.addEventListener("click",()=>{const No=["off","unavailable","unknown"].includes(t(this,Ft))?"turn_on":"turn_off";o.includes(No)&&this.config.card?.sendCommand(No,{})}),t(this,xo)?.addEventListener("click",()=>{r(this,be,!0),p(this,ye,js).call(this)}),this.root.querySelector(".shroom-mp-back-btn")?.addEventListener("click",()=>{r(this,be,!1),p(this,ye,js).call(this)}),this.root.querySelector("[data-role=vol-down]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_down",{})}),this.root.querySelector("[data-role=vol-up]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_up",{})})),t(this,ot)&&(t(this,ot).addEventListener("input",()=>{r(this,st,parseInt(t(this,ot).value,10)),t(this,jt)&&(t(this,jt).style.left=`${t(this,st)}%`),t(this,wo).call(this)}),this.guardSlider(t(this,ot),t(this,wo))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}applyState(e,o){r(this,Ft,e),r(this,$t,o);const s=e==="playing",n=s||e==="paused";C(t(this,as),"media_player",n),t(this,yo)&&(t(this,yo).hidden=!n&&!this.def.supported_features?.includes("turn_on"));const a=o.media_title??"",l=o.media_artist??"";if(t(this,vo)&&(t(this,vo).textContent=n&&a?a:this.def.friendly_name),t(this,ge))if(n){const u=t(this,st)>0?`${t(this,st)}%`:"",c=[l,u].filter(Boolean);t(this,ge).textContent=c.join(" - ")||w(e)}else t(this,ge).textContent=w(e);if(t(this,Rt)){const u=s?"mdi:pause":"mdi:play";this.renderIcon(u,"play-icon");const c=s?"Pause":"Play";t(this,Rt).title=c,t(this,Rt).setAttribute("aria-label",c)}if(o.volume_level!==void 0&&(r(this,st,Math.round(o.volume_level*100)),t(this,ot)&&!this.isSliderActive(t(this,ot))&&(t(this,ot).value=String(t(this,st))),t(this,jt)&&(t(this,jt).style.left=`${t(this,st)}%`)),r(this,cs,!!o.is_volume_muted),t(this,xo)){const u=t(this,cs)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(u,"vol-icon")}this.announceState(`${this.def.friendly_name}, ${e}${a?` - ${a}`:""}`)}predictState(e,o){return e==="media_play_pause"?{state:t(this,Ft)==="playing"?"paused":"playing",attributes:t(this,$t)}:e==="volume_mute"?{state:t(this,Ft),attributes:{...t(this,$t),is_volume_muted:!!o.is_volume_muted}}:e==="volume_set"?{state:t(this,Ft),attributes:{...t(this,$t),volume_level:o.volume_level}}:e==="turn_off"?{state:"off",attributes:t(this,$t)}:e==="turn_on"?{state:"idle",attributes:t(this,$t)}:null}}as=new WeakMap,vo=new WeakMap,ge=new WeakMap,go=new WeakMap,bo=new WeakMap,yo=new WeakMap,Rt=new WeakMap,hs=new WeakMap,ls=new WeakMap,ds=new WeakMap,xo=new WeakMap,ot=new WeakMap,jt=new WeakMap,cs=new WeakMap,be=new WeakMap,st=new WeakMap,Ft=new WeakMap,$t=new WeakMap,wo=new WeakMap,ye=new WeakSet,js=function(){t(this,go)&&(t(this,go).hidden=t(this,be)),t(this,bo)&&(t(this,bo).hidden=!t(this,be))},wr=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,st)/100})};const tr={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},Xr=tr.cloudy,Jr="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z",Qr="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",ti="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",ei=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Ls(h,m){const e=tr[h]??Xr;return`<svg viewBox="0 0 24 24" width="${m}" height="${m}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function As(h){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${h}" fill="currentColor"/></svg>`}const oi=`
    ${H}
    ${T}

    .shroom-weather-body {
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
    }
    .shroom-weather-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .shroom-weather-icon {
      color: var(--hrv-ex-shroom-weather, #ff9800);
      flex-shrink: 0;
      line-height: 0;
    }
    .shroom-weather-temp {
      font-size: 36px;
      font-weight: 300;
      color: var(--hrv-color-text, #212121);
      line-height: 1;
    }
    .shroom-weather-unit {
      font-size: 16px;
      color: var(--hrv-color-text-secondary, #757575);
    }
    .shroom-weather-stats {
      display: flex;
      justify-content: center;
      gap: 16px;
      width: 100%;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
    }
    .shroom-weather-stat {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: var(--hrv-color-text-secondary, #757575);
    }
    .shroom-weather-stat svg {
      color: var(--hrv-color-icon, #757575);
      flex-shrink: 0;
    }
    .shroom-forecast-toggle {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
      border-radius: 12px;
      background: none;
      font-size: 10px;
      font-weight: 500;
      color: var(--hrv-color-text-secondary, #757575);
      cursor: pointer;
      font-family: inherit;
      margin-top: 8px;
    }
    .shroom-forecast-toggle:hover {
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
    }
    .shroom-forecast-toggle:empty { display: none; }
    .shroom-forecast-strip {
      width: 100%;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
    }
    .shroom-forecast-strip:empty { display: none; }
    .shroom-forecast-strip[data-mode=daily] {
      display: flex;
      justify-content: space-between;
      gap: 4px;
    }
    .shroom-forecast-strip[data-mode=hourly] {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--hrv-color-border, rgba(0,0,0,0.12)) transparent;
      width: 0;
      min-width: 100%;
      padding-bottom: 4px;
    }
    .shroom-forecast-strip[data-mode=hourly]::-webkit-scrollbar {
      height: 4px;
    }
    .shroom-forecast-strip[data-mode=hourly]::-webkit-scrollbar-track {
      background: transparent;
    }
    .shroom-forecast-strip[data-mode=hourly]::-webkit-scrollbar-thumb {
      background: var(--hrv-color-border, rgba(0,0,0,0.12));
      border-radius: 2px;
    }
    .shroom-forecast-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      flex: 0 0 auto;
      min-width: 42px;
    }
    .shroom-forecast-strip[data-mode=daily] .shroom-forecast-day {
      flex: 1;
      min-width: 0;
    }
    .shroom-forecast-day-name {
      font-size: 10px;
      color: var(--hrv-color-text-secondary, #757575);
      font-weight: 500;
    }
    .shroom-forecast-day svg {
      color: var(--hrv-color-icon, #757575);
    }
    .shroom-forecast-temps {
      font-size: 10px;
      color: var(--hrv-color-text, #212121);
      white-space: nowrap;
    }
    .shroom-forecast-lo {
      color: var(--hrv-color-text-secondary, #757575);
    }
  `;class si extends f{constructor(){super(...arguments);i(this,q);i(this,ps,null);i(this,_o,null);i(this,Co,null);i(this,xe,null);i(this,So,null);i(this,$o,null);i(this,Lo,null);i(this,Lt,null);i(this,ut,null);i(this,Ao,null);i(this,we,null);i(this,_e,null)}render(){k(this),this.root.innerHTML=`
        <style>${oi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <div class="shroom-weather-body">
            <div class="shroom-weather-main">
              <span class="shroom-weather-icon">${Ls("cloudy",36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${As(Jr)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${As(Qr)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${As(ti)}
                <span data-value>--</span>
              </span>
            </div>
            <button class="shroom-forecast-toggle" type="button" aria-label="Toggle forecast view"></button>
            <div class="shroom-forecast-strip" data-mode="daily" role="list"></div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,ps,this.root.querySelector(".shroom-icon-shape")),r(this,_o,this.root.querySelector(".shroom-secondary")),r(this,Co,this.root.querySelector(".shroom-weather-icon")),r(this,xe,this.root.querySelector(".shroom-weather-temp")),r(this,So,this.root.querySelector("[data-stat=humidity] [data-value]")),r(this,$o,this.root.querySelector("[data-stat=wind] [data-value]")),r(this,Lo,this.root.querySelector("[data-stat=pressure] [data-value]")),r(this,Lt,this.root.querySelector(".shroom-forecast-strip")),r(this,ut,this.root.querySelector(".shroom-forecast-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:weather-cloudy"),"card-icon"),C(t(this,ps),"weather",!0),r(this,Ao,Cr(t(this,Lt))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),M(this.root)}destroy(){var e;(e=t(this,Ao))==null||e.call(this),r(this,Ao,null)}applyState(e,o){const s=e||"cloudy";t(this,Co)&&(t(this,Co).innerHTML=Ls(s,36));const n=this.i18n.t(`weather.${s}`)!==`weather.${s}`?this.i18n.t(`weather.${s}`):s.replace(/-/g," ");t(this,_o)&&(t(this,_o).textContent=w(n));const a=o.temperature??o.native_temperature;let l=String(o.temperature_unit||o.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(l&&!/^°/.test(l)&&l.length<=2&&(l=`°${l}`),t(this,xe)){const c=t(this,xe).querySelector(".shroom-weather-unit");t(this,xe).firstChild.textContent=a!=null?Math.round(Number(a)):"--",c&&(c.textContent=l)}if(t(this,So)){const c=o.humidity;t(this,So).textContent=c!=null?`${c}%`:"--"}if(t(this,$o)){const c=o.wind_speed,v=o.wind_speed_unit??"";t(this,$o).textContent=c!=null?`${c} ${v}`.trim():"--"}if(t(this,Lo)){const c=o.pressure,v=o.pressure_unit??"";t(this,Lo).textContent=c!=null?`${c} ${v}`.trim():"--"}const u=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;r(this,we,u?o.forecast_daily??o.forecast??null:null),r(this,_e,u?o.forecast_hourly??null:null),p(this,q,Fs).call(this),p(this,q,Gs).call(this),this.announceState(`${this.def.friendly_name}, ${n}, ${a??"--"} ${l}`)}}ps=new WeakMap,_o=new WeakMap,Co=new WeakMap,xe=new WeakMap,So=new WeakMap,$o=new WeakMap,Lo=new WeakMap,Lt=new WeakMap,ut=new WeakMap,Ao=new WeakMap,q=new WeakSet,Ce=function(){return this.config._forecastMode??"daily"},Ss=function(e){this.config._forecastMode=e},we=new WeakMap,_e=new WeakMap,Fs=function(){if(!t(this,ut))return;const e=Array.isArray(t(this,we))&&t(this,we).length>0,o=Array.isArray(t(this,_e))&&t(this,_e).length>0;if(!e&&!o){t(this,ut).textContent="";return}e&&!o&&r(this,q,"daily",Ss),!e&&o&&r(this,q,"hourly",Ss),e&&o?(t(this,ut).textContent=t(this,q,Ce)==="daily"?"Hourly":"5-Day",t(this,ut).onclick=()=>{r(this,q,t(this,q,Ce)==="daily"?"hourly":"daily",Ss),p(this,q,Fs).call(this),p(this,q,Gs).call(this)}):(t(this,ut).textContent="",t(this,ut).onclick=null)},Gs=function(){if(!t(this,Lt))return;const e=t(this,q,Ce)==="hourly"?t(this,_e):t(this,we);if(t(this,Lt).setAttribute("data-mode",t(this,q,Ce)),!Array.isArray(e)||e.length===0){t(this,Lt).innerHTML="";return}const o=t(this,q,Ce)==="daily"?e.slice(0,5):e;t(this,Lt).innerHTML=o.map(s=>{const n=new Date(s.datetime);let a;t(this,q,Ce)==="hourly"?a=n.toLocaleTimeString([],{hour:"numeric"}):a=ei[n.getDay()]??"";const l=(s.temperature??s.native_temperature)!=null?Math.round(s.temperature??s.native_temperature):"--",u=(s.templow??s.native_templow)!=null?Math.round(s.templow??s.native_templow):null;return`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${d(String(a))}</span>
            ${Ls(s.condition||"cloudy",18)}
            <span class="shroom-forecast-temps">
              ${d(String(l))}${u!=null?`/<span class="shroom-forecast-lo">${d(String(u))}</span>`:""}
            </span>
          </div>`}).join("")};const ri=`
    ${H}
    ${T}
  `;class ii extends f{constructor(){super(...arguments);i(this,us,null);i(this,Mo,null);i(this,At,!1);i(this,ws,"unknown")}render(){k(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${ri}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${d(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,us,this.root.querySelector(".shroom-icon-shape")),r(this,Mo,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"card-icon");const o=this.root.querySelector(".shroom-state-item");if(e){Mt(o,`${this.def.friendly_name} - Lock/Unlock`);const s=()=>{const a=this.config.gestureConfig?.tap;if(a){this._runAction(a);return}this.config.card?.sendCommand(t(this,At)?"unlock":"lock",{})};this._attachGestureHandlers(o,{onTap:s});const n=this.root.querySelector("[part=row-toggle]");n&&this._attachGestureHandlers(n,{onTap:s})}this.renderCompanions(),M(this.root)}applyState(e,o){r(this,ws,e),r(this,At,e==="locked");const s=e==="jammed";C(t(this,us),"lock",t(this,At)),t(this,Mo)&&(t(this,Mo).textContent=w(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,At)));const a=this.root.querySelector("[part=row-toggle]");a&&(a.setAttribute("aria-pressed",String(t(this,At))),a.disabled=e==="unavailable"||e==="unknown");const l=this.root.querySelector("[part=row-state]");l&&(l.textContent=w(e));const u=s?"mdi:lock-alert":t(this,At)?"mdi:lock":"mdi:lock-open",c=this.def.icon_state_map?.[e]??this.def.icon??u;this.renderIcon(this.resolveIcon(c,u),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,o){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}us=new WeakMap,Mo=new WeakMap,At=new WeakMap,ws=new WeakMap;const ni=`
    ${H}
    ${T}
  `;class er extends f{constructor(){super(...arguments);i(this,ko,null);i(this,Ho,null)}render(){k(this);const e=this.def.capabilities==="read-write",o=this.i18n.t("action.run")!=="action.run"?this.i18n.t("action.run"):"Run";this.root.innerHTML=`
        <style>${ni}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-run-btn" type="button" aria-label="${d(this.def.friendly_name)} - ${d(o)}">${d(o)}</button></span>`:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,ko,this.root.querySelector(".shroom-icon-shape")),r(this,Ho,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),C(t(this,ko),"script",!1);const s=this.root.querySelector(".shroom-state-item");if(e){const n=()=>{const l=this.config.gestureConfig?.tap;if(l){this._runAction(l);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})};Mt(s,`${this.def.friendly_name} - ${o}`),this._attachGestureHandlers(s,{onTap:n});const a=this.root.querySelector("[part=row-run-btn]");a&&this._attachGestureHandlers(a,{onTap:n})}this.renderCompanions(),M(this.root)}applyState(e,o){const s=e==="on";C(t(this,ko),"script",s),t(this,Ho)&&(t(this,Ho).textContent=s?this.i18n.t("state.running")!=="state.running"?this.i18n.t("state.running"):"Running":w(e));const n=this.root.querySelector("[part=row-run-btn]");n&&(n.disabled=e==="unavailable"||e==="unknown");const a=s?"mdi:script-text":"mdi:script-text-play",l=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(l,a),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}ko=new WeakMap,Ho=new WeakMap,fs(er,"staleOnMount",!1);const ai=`
    ${H}
    ${T}
    [part=enable-toggle] {
      width: 100%;
      margin-top: 8px;
      padding: 6px 12px;
      border: none;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text-secondary, #757575);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    [part=enable-toggle][aria-pressed=true] {
      background: color-mix(in srgb, var(--hrv-color-primary, #1976d2) 20%, transparent);
      color: var(--hrv-color-primary, #1976d2);
    }
    [part=enable-toggle]:disabled { opacity: 0.4; cursor: not-allowed; }
  `;class or extends f{constructor(){super(...arguments);i(this,To,null);i(this,Eo,null);i(this,rt,null)}render(){k(this);const e=this.def.capabilities==="read-write",o=this.i18n.t("action.trigger")!=="action.trigger"?this.i18n.t("action.trigger"):"Trigger";this.root.innerHTML=`
        <style>${ai}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?'<button part="enable-toggle" type="button"></button>':""}
          ${e?`<span part="row-control"><button part="row-trigger-btn" type="button" aria-label="${d(this.def.friendly_name)} - ${d(o)}">${d(o)}</button></span>`:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,To,this.root.querySelector(".shroom-icon-shape")),r(this,Eo,this.root.querySelector(".shroom-secondary")),r(this,rt,this.root.querySelector("[part=enable-toggle]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),C(t(this,To),"automation",!1);const s=this.root.querySelector(".shroom-state-item");if(e){const n=()=>{const l=this.config.gestureConfig?.tap;if(l){this._runAction(l);return}this.config.card?.sendCommand("trigger",{})};Mt(s,`${this.def.friendly_name} - ${o}`),this._attachGestureHandlers(s,{onTap:n});const a=this.root.querySelector("[part=row-trigger-btn]");a&&this._attachGestureHandlers(a,{onTap:n}),this._attachGestureHandlers(t(this,rt),{onTap:()=>{const l=t(this,rt)?.getAttribute("aria-pressed")==="true";this.config.card?.sendCommand(l?"turn_off":"turn_on",{})}})}this.renderCompanions(),M(this.root)}applyState(e,o){const s=e==="on";C(t(this,To),"automation",s),t(this,Eo)&&(t(this,Eo).textContent=s?this.i18n.t("state.on")!=="state.on"?this.i18n.t("state.on"):"Enabled":w(e)),t(this,rt)&&(t(this,rt).disabled=e==="unavailable"||e==="unknown",t(this,rt).textContent=s?"Enabled":"Disabled",t(this,rt).setAttribute("aria-pressed",String(s)),t(this,rt).setAttribute("aria-label",`${this.def.friendly_name} - ${s?"Disable":"Enable"}`));const n=this.root.querySelector("[part=row-trigger-btn]");n&&(n.disabled=e==="unavailable"||e==="unknown");const a=s?"mdi:robot":"mdi:robot-off",l=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(l,a),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}predictState(e,o){return e==="turn_on"?{state:"on",attributes:{}}:e==="turn_off"?{state:"off",attributes:{}}:null}}To=new WeakMap,Eo=new WeakMap,rt=new WeakMap,fs(or,"staleOnMount",!1);const hi=`
    ${H}
    ${T}

    .shroom-press-btn {
      align-self: flex-start;
      padding: 1px 8px;
      border: none;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
      color: var(--hrv-color-text-secondary, #757575);
      font-size: 11px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 150ms ease, opacity 150ms ease;
      line-height: 1.4;
    }
    .shroom-press-btn:hover { background: var(--hrv-ex-shroom-btn-bg-active, rgba(0,0,0,0.10)); }
    .shroom-press-btn:active { opacity: 0.7; }
    .shroom-press-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `;class Ms extends f{constructor(){super(...arguments);i(this,qo,null);i(this,Io,null);i(this,Gt,null)}render(){k(this);const e=this.def.capabilities==="read-write",o=this.i18n.t("action.press")!=="action.press"?this.i18n.t("action.press"):"Press";if(this.root.innerHTML=`
        <style>${hi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              ${e?`<button class="shroom-press-btn" part="press-button" type="button" aria-label="${d(this.def.friendly_name)}">${d(o)}</button>`:'<span class="shroom-secondary">-</span>'}
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-press-btn" type="button" aria-label="${d(this.def.friendly_name)} - ${d(o)}">${d(o)}</button></span>`:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,qo,this.root.querySelector(".shroom-icon-shape")),r(this,Io,this.root.querySelector(".shroom-secondary")),r(this,Gt,this.root.querySelector(".shroom-press-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),C(t(this,qo),"button",!1),e){const s=()=>{const a=this.config.gestureConfig?.tap;if(a){this._runAction(a);return}this.config.card?.sendCommand("press",{})};t(this,Gt)&&this._attachGestureHandlers(t(this,Gt),{onTap:s});const n=this.root.querySelector("[part=row-press-btn]");n&&this._attachGestureHandlers(n,{onTap:s})}this.renderCompanions(),M(this.root)}applyState(e,o){C(t(this,qo),"button",!1);const s=e==="unavailable"||e==="unknown";t(this,Gt)&&(t(this,Gt).disabled=s),t(this,Io)&&(t(this,Io).textContent=s?w(e):this.formatStateLabel(e));const n=this.root.querySelector("[part=row-press-btn]");n&&(n.disabled=s);const a=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(a,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}qo=new WeakMap,Io=new WeakMap,Gt=new WeakMap,fs(Ms,"staleOnMount",!1);const li=`
    ${H}
    ${T}
  `;class ks extends f{constructor(){super(...arguments);i(this,Bo,null);i(this,Vo,null)}render(){k(this),this.root.innerHTML=`
        <style>${li}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span part="row-control"><span part="row-value"></span></span>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Bo,this.root.querySelector(".shroom-icon-shape")),r(this,Vo,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"card-icon"),C(t(this,Bo),"person",!1),this.renderCompanions(),M(this.root)}applyState(e,o){const s=e==="home";C(t(this,Bo),"person",s);const n=e==="not_home"?"Away":e==="home"?"Home":w(e);t(this,Vo)&&(t(this,Vo).textContent=n);const a=this.root.querySelector("[part=row-value]");a&&(a.textContent=n);const l=e==="not_home"?"mdi:account-off":"mdi:account",u=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(u,l),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Bo=new WeakMap,Vo=new WeakMap,fs(ks,"staleOnMount",!0);const di=`
    ${H}
    ${T}
  `;class ci extends f{constructor(){super(...arguments);i(this,Oo,null);i(this,Po,null)}render(){k(this),this.root.innerHTML=`
        <style>${di}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span part="row-control"><span part="row-value"></span></span>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Oo,this.root.querySelector(".shroom-icon-shape")),r(this,Po,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:eye"),"card-icon"),C(t(this,Oo),"event",!1),this.renderCompanions(),M(this.root)}applyState(e,o){C(t(this,Oo),"event",!1),t(this,Po)&&(t(this,Po).textContent=w(e));const s=this.root.querySelector("[part=row-value]");s&&(s.textContent=w(e));const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:eye";this.renderIcon(this.resolveIcon(n,"mdi:eye"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Oo=new WeakMap,Po=new WeakMap;const pi=document.currentScript&&document.currentScript.dataset.rendererId||"shrooms";x._renderers=x._renderers||{},x._renderers[pi]={light:Ar,switch:Ks,input_boolean:Ks,lock:ii,sensor:bs,"sensor.temperature":bs,"sensor.humidity":bs,"sensor.battery":bs,fan:Ir,binary_sensor:Vr,generic:Pr,input_number:Xs,input_select:Js,select:Js,cover:Zr,remote:jr,timer:Gr,climate:Yr,media_player:Kr,weather:si,script:er,automation:or,button:Ms,input_button:Ms,person:ks,device_tracker:ks,event:ci,number:Xs,badge:null}})();})();
