(()=>{var Li=Object.defineProperty;var mr=x=>{throw TypeError(x)};var Ai=(x,v,d)=>v in x?Li(x,v,{enumerable:!0,configurable:!0,writable:!0,value:d}):x[v]=d;var So=(x,v,d)=>Ai(x,typeof v!="symbol"?v+"":v,d),No=(x,v,d)=>v.has(x)||mr("Cannot "+d);var t=(x,v,d)=>(No(x,v,"read from private field"),d?d.call(x):v.get(x)),i=(x,v,d)=>v.has(x)?mr("Cannot add the same private member more than once"):v instanceof WeakSet?v.add(x):v.set(x,d),r=(x,v,d,at)=>(No(x,v,"write to private field"),at?at.call(x,d):v.set(x,d),d),c=(x,v,d)=>(No(x,v,"access private method"),d);(function(){"use strict";var Js,He,gt,It,te,V,Qs,Bt,ee,se,ht,oe,re,j,F,Vt,Te,ie,Ee,lt,zo,Zo,fr,dt,ne,qe,bt,ae,W,Ie,Ot,Pt,Dt,N,M,he,Nt,zt,Q,Be,to,le,L,Eo,vr,Ro,jo,Fo,qo,gr,eo,Ve,so,Oe,Y,ct,de,oo,Pe,U,De,pt,yt,Ne,ro,ze,xt,br,Go,yr,io,Ze,D,q,ce,pe,wt,ko,Zt,Re,_t,ue,Rt,z,B,xr,wr,Wo,Yo,Us,no,je,tt,Fe,Ge,et,We,Ct,Ye,me,fe,ve,St,ut,Ue,ao,Ke,Xe,Z,_r,Uo,Cr,Ko,Sr,Je,Qe,ho,ts,jt,Ft,ge,be,ye,es,ss,st,os,G,$r,Lr,Ar,$o,lo,rs,is,ns,as,hs,ls,ds,cs,ps,us,O,ms,fs,$t,xe,mt,R,Lt,At,vs,ot,gs,bs,ys,co,po,uo,xs,Gt,we,_e,Ce,mo,fo,S,Mr,Xo,Jo,kr,Hr,Qo,Lo,Tr,vo,Mt,ws,_s,K,Wt,Yt,Cs,Ss,go,Ut,$s,Se,Ls,As,Ms,Kt,bo,yo,xo,ks,rt,Xt,Jt,$e,it,kt,ft,Hs,X,tr,er,Er,qr,wo,Ts,Es,Le,qs,Is,Bs,Ht,vt,Vs,I,ke,Io,Ae,Me,sr,or,_o,Os,Tt,Ho,Ps,Ds,Ns,zs,nt,Zs,Rs,Qt,js,Fs,Gs,Ws;const x=window.HArvest;if(!x||!x.renderers||!x.renderers.BaseCard){console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");return}const v=x.renderers.BaseCard,d=window.HArvest.esc;function at(h,u){let e=null,s=null,o=null;function n(...a){s=this,o=a,e&&clearTimeout(e),e=setTimeout(()=>{e=null,h.apply(s,o),o=null},u)}return n.flush=function(){e!==null&&(clearTimeout(e),e=null,o&&(h.apply(s,o),o=null))},n}function w(h){return h?h.charAt(0).toUpperCase()+h.slice(1).replace(/_/g," "):""}function Mi(h,u,e){return Math.min(e,Math.max(u,h))}function rr(h,u){const e=h.querySelector(".shroom-controls-shell");e&&e.setAttribute("data-collapsed",String(u))}function Et(h,u){h&&(h.setAttribute("role","button"),h.setAttribute("tabindex","0"),h.setAttribute("aria-label",u),h.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),h.click())}))}function k(h){h.querySelectorAll("[part=companion]").forEach(u=>{u.title=u.getAttribute("aria-label")??"Companion"})}const Ir={light:"var(--hrv-ex-shroom-light, #ff9800)",switch:"var(--hrv-ex-shroom-switch, #2196f3)",input_boolean:"var(--hrv-ex-shroom-switch, #2196f3)",lock:"var(--hrv-ex-shroom-lock, #2196f3)",fan:"var(--hrv-ex-shroom-fan, #4caf50)",climate:"var(--hrv-ex-shroom-climate, #ff5722)",cover:"var(--hrv-ex-shroom-cover, #9c27b0)",media_player:"var(--hrv-ex-shroom-media, #e91e63)",sensor:"var(--hrv-ex-shroom-sensor, #03a9f4)",binary_sensor:"var(--hrv-ex-shroom-binary, #8bc34a)",input_number:"var(--hrv-ex-shroom-input, #00bcd4)",input_select:"var(--hrv-ex-shroom-input, #00bcd4)",timer:"var(--hrv-ex-shroom-timer, #673ab7)",remote:"var(--hrv-ex-shroom-remote, #607d8b)",weather:"var(--hrv-ex-shroom-weather, #ff9800)"};function ir(h){return Ir[h]??"var(--hrv-color-primary, #ff9800)"}function C(h,u,e){if(!h)return;const s=ir(u);e?(h.style.background=`color-mix(in srgb, ${s} 20%, transparent)`,h.style.color=s):(h.style.background="var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))",h.style.color="var(--hrv-color-icon, #757575)")}function H(h){const u=(h.config.displayHints??h.def.display_hints??{}).layout??null,e=h.root.host;e&&(u==="vertical"?e.setAttribute("data-layout","vertical"):e.removeAttribute("data-layout"))}function Br(h){if(!h)return()=>{};const u=80,e=1.6,s=.96,o=.04;let n=null,a=0,l=0,m=0,p=!1,f=0;const g=[],b=()=>{f&&(cancelAnimationFrame(f),f=0)},$=y=>{for(;g.length&&g[0].t<y-u;)g.shift();if(g.length<2)return 0;const A=g[0],J=g[g.length-1],Co=J.t-A.t;return Co<=0?0:(J.x-A.x)/Co},P=()=>{if(Math.abs(m)<o)return;let y=performance.now();const A=J=>{const Co=J-y;if(y=J,h.scrollLeft-=m*Co,m*=Math.pow(s,Co/16),Math.abs(m)<o){f=0,m=0;return}const $i=h.scrollWidth-h.clientWidth;if(h.scrollLeft<=0||h.scrollLeft>=$i){f=0,m=0;return}f=requestAnimationFrame(A)};f=requestAnimationFrame(A)},Ys=y=>{if(h.scrollWidth<=h.clientWidth||y.pointerType==="touch")return;const A=y.target;if(!(A&&A!==h&&A.closest?.("button, a"))){b(),n=y.pointerId,a=y.clientX,l=h.scrollLeft,m=0,p=!1,g.length=0,g.push({x:y.clientX,t:y.timeStamp});try{h.setPointerCapture(n)}catch{}}},To=y=>{if(y.pointerId!==n)return;const A=y.clientX-a;Math.abs(A)>4&&(p=!0,h.dataset.dragging="true"),h.scrollLeft=l-A,g.push({x:y.clientX,t:y.timeStamp});const J=y.timeStamp-u;for(;g.length>2&&g[0].t<J;)g.shift()},_=y=>{if(y.pointerId===n){try{h.releasePointerCapture(n)}catch{}if(n=null,p){const A=J=>{J.stopPropagation(),J.preventDefault()};window.addEventListener("click",A,{capture:!0,once:!0}),requestAnimationFrame(()=>h.removeAttribute("data-dragging")),m=$(y.timeStamp)*e,P()}g.length=0}};return h.addEventListener("pointerdown",Ys),h.addEventListener("pointermove",To),h.addEventListener("pointerup",_),h.addEventListener("pointercancel",_),h.addEventListener("wheel",b,{passive:!0}),h.addEventListener("touchstart",b,{passive:!0}),()=>{b(),h.removeEventListener("pointerdown",Ys),h.removeEventListener("pointermove",To),h.removeEventListener("pointerup",_),h.removeEventListener("pointercancel",_),h.removeEventListener("wheel",b),h.removeEventListener("touchstart",b)}}function nr(h,u){if(h!=="on")return null;if(u.rgb_color){const[s,o,n]=u.rgb_color;return(.299*s+.587*o+.114*n)/255>.85?`rgb(${Math.round(s*.8)}, ${Math.round(o*.8)}, ${Math.round(n*.75)})`:`rgb(${s}, ${o}, ${n})`}if(u.hs_color)return`hsl(${u.hs_color[0]}, ${Math.max(u.hs_color[1],50)}%, 55%)`;const e=u.color_temp_kelvin??(u.color_temp?Math.round(1e6/u.color_temp):null);return e?e>=5200?"#4ba3e0":e>=4500?"#e0c85a":e<=3e3?"#e6a040":"#ddb840":null}const T=`
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
  `,Bo=`
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
  `,Ks=`
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
  `,qt=`
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
  `,E=`
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
  `,Vr=`
    ${T}
    ${E}
  `;class ar extends v{constructor(){super(...arguments);i(this,Js,null);i(this,He,null);i(this,gt,!1)}render(){H(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Vr}</style>
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
      `,r(this,Js,this.root.querySelector(".shroom-icon-shape")),r(this,He,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline"),"card-icon");const s=this.root.querySelector(".shroom-state-item");if(e){Et(s,`${this.def.friendly_name} - Toggle`);const o=()=>{const a=this.config.gestureConfig?.tap;if(a){this._runAction(a);return}this.config.card?.sendCommand("toggle",{})};this._attachGestureHandlers(s,{onTap:o});const n=this.root.querySelector("[part=row-toggle]");n&&this._attachGestureHandlers(n,{onTap:o})}this.renderCompanions(),k(this.root)}applyState(e,s){r(this,gt,e==="on");const o=this.def.domain??"switch";C(t(this,Js),o,t(this,gt)),t(this,He)&&(t(this,He).textContent=w(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,gt)));const a=this.root.querySelector("[part=row-toggle]");a&&(a.setAttribute("aria-pressed",String(t(this,gt))),a.disabled=e==="unavailable"||e==="unknown");const l=this.root.querySelector("[part=row-state]");l&&(l.textContent=w(e));const m=t(this,gt)?this.resolveIcon(this.def.icon,"mdi:toggle-switch"):this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline");this.renderIcon(m,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="toggle"||e==="turn_on"||e==="turn_off"?{state:e==="toggle"?t(this,gt)?"off":"on":e==="turn_on"?"on":"off",attributes:{}}:null}}Js=new WeakMap,He=new WeakMap,gt=new WeakMap;const Xs=["brightness","temp","color"],Or={brightness:"mdi:brightness-4",temp:"mdi:thermometer",color:"mdi:palette"},Pr=`
    ${T}
    ${Bo}
    ${Ks}
    ${qt}
    ${E}

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
  `;class Dr extends v{constructor(e,s,o,n){super(e,s,o,n);i(this,lt);i(this,It,null);i(this,te,null);i(this,V,null);i(this,Qs,null);i(this,Bt,null);i(this,ee,null);i(this,se,[]);i(this,ht,0);i(this,oe,4e3);i(this,re,0);i(this,j,!1);i(this,F,0);i(this,Vt,2e3);i(this,Te,6500);i(this,ie,{});i(this,Ee);r(this,Ee,at(c(this,lt,fr).bind(this),300))}render(){H(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??{},n=o.show_brightness!==!1&&s.includes("brightness"),a=o.show_color_temp!==!1&&s.includes("color_temp"),l=o.show_rgb!==!1&&s.includes("rgb_color"),m=e&&(n||a||l),p=[n,a,l].filter(Boolean).length;r(this,Vt,this.def.feature_config?.min_color_temp_kelvin??2e3),r(this,Te,this.def.feature_config?.max_color_temp_kelvin??6500);const f=[n,a,l];f[t(this,F)]||(r(this,F,f.findIndex(Boolean)),t(this,F)===-1&&r(this,F,0)),this.root.innerHTML=`
        <style>${Pr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${d(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          ${m?`
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
                ${p>1?`
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
      `,r(this,It,this.root.querySelector(".shroom-icon-shape")),r(this,te,this.root.querySelector(".shroom-secondary")),r(this,V,this.root.querySelector(".shroom-slider-input")),r(this,Qs,this.root.querySelector(".shroom-slider-bg")),r(this,Bt,this.root.querySelector(".shroom-slider-cover")),r(this,ee,this.root.querySelector(".shroom-slider-edge")),r(this,se,[...this.root.querySelectorAll(".shroom-light-mode-btn")]),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon");for(const b of t(this,se))this.renderIcon(Or[b.dataset.mode]??"mdi:help-circle",`light-mode-${b.dataset.mode}`);const g=this.root.querySelector(".shroom-state-item");if(e){Et(g,`${this.def.friendly_name} - Toggle`);const b=()=>{const P=this.config.gestureConfig?.tap;if(P){this._runAction(P);return}this.config.card?.sendCommand("toggle",{})};this._attachGestureHandlers(g,{onTap:b});const $=this.root.querySelector("[part=row-toggle]");$&&this._attachGestureHandlers($,{onTap:b})}for(const b of t(this,se))b.addEventListener("click",()=>{const $=b.dataset.mode,P=Xs.indexOf($);P===-1||P===t(this,F)||(r(this,F,P),c(this,lt,zo).call(this))});t(this,V)&&(t(this,V).addEventListener("input",()=>{const b=parseInt(t(this,V).value,10),$=Xs[t(this,F)]??"brightness";$==="brightness"?r(this,ht,b):$==="temp"?r(this,oe,Math.round(t(this,Vt)+b/100*(t(this,Te)-t(this,Vt)))):r(this,re,Math.round(b*3.6)),c(this,lt,Zo).call(this),t(this,Ee).call(this,$)}),this.guardSlider(t(this,V),t(this,Ee))),this.renderCompanions(),k(this.root)}applyState(e,s){r(this,j,e==="on"),r(this,ie,s),rr(this.root,!t(this,j));const o=nr(e,s);t(this,j)&&o?t(this,It)&&(t(this,It).style.background=`color-mix(in srgb, ${o} 20%, transparent)`,t(this,It).style.color=o):C(t(this,It),"light",t(this,j)),r(this,ht,s.brightness!=null?Math.round(s.brightness/255*100):0),r(this,oe,s.color_temp_kelvin??(s.color_temp?Math.round(1e6/s.color_temp):4e3)),r(this,re,s.hs_color?.[0]??42),t(this,te)&&(t(this,j)&&s.brightness!=null?t(this,te).textContent=`${t(this,ht)}%`:t(this,te).textContent=w(e));const n=this.root.querySelector(".shroom-slider-wrap");if(n){const f=nr("on",s);n.style.setProperty("--shroom-light-accent",f??"var(--hrv-ex-shroom-light, #ff9800)")}c(this,lt,zo).call(this);const a=this.root.querySelector(".shroom-state-item");a?.hasAttribute("role")&&a.setAttribute("aria-pressed",String(t(this,j)));const l=this.root.querySelector("[part=row-toggle]");l&&(l.setAttribute("aria-pressed",String(t(this,j))),l.disabled=e==="unavailable"||e==="unknown");const m=this.root.querySelector("[part=row-state]");if(m&&(m.textContent=w(e)),t(this,V)){const f=Xs[t(this,F)]??"brightness",g=parseInt(t(this,V).value,10);f==="brightness"?t(this,V).setAttribute("aria-valuetext",`${g}%`):f==="temp"?t(this,V).setAttribute("aria-valuetext",`${g}K`):t(this,V).setAttribute("aria-valuetext",`${g}`)}const p=t(this,j)?this.resolveIcon(this.def.icon,"mdi:lightbulb"):this.resolveIcon(this.def.icon,"mdi:lightbulb-off");this.renderIcon(p,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}${t(this,j)?`, ${t(this,ht)}%`:""}`)}predictState(e,s){if(e==="toggle")return{state:t(this,j)?"off":"on",attributes:t(this,ie)};if(e==="turn_on"){const o={...t(this,ie)};return s.brightness!=null&&(o.brightness=s.brightness),s.color_temp_kelvin!=null&&(o.color_temp_kelvin=s.color_temp_kelvin),s.hs_color!=null&&(o.hs_color=s.hs_color),{state:"on",attributes:o}}return e==="turn_off"?{state:"off",attributes:t(this,ie)}:null}}It=new WeakMap,te=new WeakMap,V=new WeakMap,Qs=new WeakMap,Bt=new WeakMap,ee=new WeakMap,se=new WeakMap,ht=new WeakMap,oe=new WeakMap,re=new WeakMap,j=new WeakMap,F=new WeakMap,Vt=new WeakMap,Te=new WeakMap,ie=new WeakMap,Ee=new WeakMap,lt=new WeakSet,zo=function(){const e=Xs[t(this,F)]??"brightness",s=t(this,Qs);s?.classList.remove("shroom-brightness-bg","shroom-ct-bg","shroom-hue-bg"),e==="brightness"?s?.classList.add("shroom-brightness-bg"):e==="temp"?s?.classList.add("shroom-ct-bg"):s?.classList.add("shroom-hue-bg");for(const o of t(this,se))o.hidden=o.dataset.mode===e;c(this,lt,Zo).call(this)},Zo=function(){const e=Xs[t(this,F)]??"brightness";let s=0;e==="brightness"?s=t(this,ht):e==="temp"?s=Math.round((t(this,oe)-t(this,Vt))/(t(this,Te)-t(this,Vt))*100):s=Math.round(t(this,re)/3.6);const o=e==="brightness";t(this,Bt)&&(o?(t(this,Bt).style.display="",t(this,Bt).style.left=`${s}%`):t(this,Bt).style.display="none"),t(this,ee)&&(t(this,ee).style.display=o?"none":"",o||(t(this,ee).style.left=`${s}%`)),t(this,V)&&!this.isSliderActive(t(this,V))&&(t(this,V).value=String(s))},fr=function(e){e==="brightness"?t(this,ht)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:Math.round(t(this,ht)*2.55)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,oe)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,re),100]})};const Nr={temperature:"var(--hrv-ex-shroom-climate, #ff5722)",humidity:"var(--hrv-ex-shroom-sensor, #03a9f4)",battery:"var(--hrv-ex-shroom-fan, #4caf50)"},zr={temperature:"mdi:thermometer",humidity:"mdi:water-percent",battery:"mdi:battery"};function Zr(h){return h==null||isNaN(h)||h>=90?"mdi:battery":h>=70?"mdi:battery-70":h>=50?"mdi:battery-50":h>=30?"mdi:battery-30":h>=10?"mdi:battery-10":"mdi:battery-alert"}function Rr(h){return h==null||isNaN(h)?"var(--hrv-ex-shroom-fan, #4caf50)":h<=10?"var(--hrv-color-error, #f44336)":h<=20?"var(--hrv-color-warning, #ff9800)":"var(--hrv-ex-shroom-fan, #4caf50)"}const jr=`
    ${T}
    ${E}
  `;class Ao extends v{constructor(){super(...arguments);i(this,dt,null);i(this,ne,null);i(this,qe,null)}render(){H(this),r(this,qe,this.def.device_class??null);const e=zr[t(this,qe)]??"mdi:gauge";this.root.innerHTML=`
        <style>${jr}</style>
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
      `,r(this,dt,this.root.querySelector(".shroom-icon-shape")),r(this,ne,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,e),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}applyState(e,s){const o=parseFloat(e),n=this.def.unit_of_measurement??"",a=!isNaN(o),l=t(this,qe);if(t(this,ne))if(a){const p=s.suggested_display_precision,f=p!=null?o.toFixed(p):String(Math.round(o*10)/10);t(this,ne).textContent=n?`${f} ${n}`:f}else t(this,ne).textContent=w(e);if(l==="battery"&&a){const p=Rr(o);t(this,dt)&&(t(this,dt).style.background=`color-mix(in srgb, ${p} 20%, transparent)`,t(this,dt).style.color=p),this.renderIcon(this.resolveIcon(this.def.icon,Zr(o)),"card-icon")}else{const p=Nr[l]??ir("sensor");t(this,dt)&&(t(this,dt).style.background=`color-mix(in srgb, ${p} 20%, transparent)`,t(this,dt).style.color=p)}const m=this.root.querySelector("[part=row-value]");if(m)if(a){const p=s.suggested_display_precision,f=p!=null?o.toFixed(p):String(Math.round(o*10)/10);m.textContent=n?`${f} ${n}`:f}else m.textContent=w(e);this.announceState(`${this.def.friendly_name}, ${a?o:e} ${n}`)}}dt=new WeakMap,ne=new WeakMap,qe=new WeakMap;const Fr=`
    ${T}
    ${Bo}
    ${Ks}
    ${qt}
    ${E}

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
  `;class Gr extends v{constructor(e,s,o,n){super(e,s,o,n);i(this,L);i(this,bt,null);i(this,ae,null);i(this,W,null);i(this,Ie,null);i(this,Ot,null);i(this,Pt,null);i(this,Dt,null);i(this,N,!1);i(this,M,0);i(this,he,!1);i(this,Nt,"forward");i(this,zt,null);i(this,Q,[]);i(this,Be);i(this,to,!1);i(this,le,!1);r(this,Be,at(c(this,L,gr).bind(this),300)),r(this,Q,e.feature_config?.preset_modes??[])}render(){H(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??this.def.display_hints??{},n=o.display_mode??null;let a=s.includes("set_speed");const l=o.show_oscillate!==!1&&s.includes("oscillate"),m=o.show_direction!==!1&&s.includes("direction"),p=o.show_presets!==!1&&s.includes("preset_mode");n==="on-off"&&(a=!1);let f=e&&a,g=f&&t(this,L,vr),b=!1,$=!1;n==="continuous"?g=!1:n==="stepped"?$=g:n==="cycle"?(g=!0,b=!0):g&&t(this,Q).length?b=!0:g&&($=!0),r(this,to,b);const P=e&&(l||m||p);this.root.innerHTML=`
        <style>${Fr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${d(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          ${f||P?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${f&&!g?`
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
                ${f&&$?`
                  <div class="shroom-fan-step-dots">
                    ${t(this,L,Ro).map((_,y)=>`
                      <button class="shroom-fan-step-dot" data-pct="${_}" type="button"
                        data-active="false"
                        aria-label="Speed ${y+1} (${_}%)"
                        title="Speed ${y+1} (${_}%)">${y+1}</button>
                    `).join("")}
                  </div>
                `:""}
                ${f&&b?`
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
                    ${m?'<button class="shroom-btn shroom-fan-feat" data-feat="direction" type="button" aria-label="Direction: forward">Forward</button>':""}
                    ${p?'<button class="shroom-btn shroom-fan-feat" data-feat="preset" type="button" aria-label="Preset">Preset</button>':""}
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
      `,r(this,bt,this.root.querySelector(".shroom-icon-shape")),r(this,ae,this.root.querySelector(".shroom-secondary")),r(this,W,this.root.querySelector(".shroom-slider-input")),r(this,Ie,this.root.querySelector(".shroom-slider-cover")),r(this,Ot,this.root.querySelector('[data-feat="oscillate"]')),r(this,Pt,this.root.querySelector('[data-feat="direction"]')),r(this,Dt,this.root.querySelector('[data-feat="preset"]')),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"card-icon");const Ys=this.root.querySelector(".shroom-state-item");if(e){Et(Ys,`${this.def.friendly_name} - Toggle`);const _=()=>{const A=this.config.gestureConfig?.tap;if(A){this._runAction(A);return}this.config.card?.sendCommand("toggle",{})};this._attachGestureHandlers(Ys,{onTap:_});const y=this.root.querySelector("[part=row-toggle]");y&&this._attachGestureHandlers(y,{onTap:_})}t(this,W)&&(t(this,W).addEventListener("input",()=>{const _=Number(t(this,W).value);r(this,M,_),t(this,W).setAttribute("aria-valuetext",`${Math.round(_)}%`),c(this,L,jo).call(this),t(this,Be).call(this)}),this.guardSlider(t(this,W),t(this,Be))),this.root.querySelectorAll(".shroom-fan-step-dot").forEach(_=>{_.addEventListener("click",()=>{const y=Number(_.getAttribute("data-pct"));r(this,M,y),r(this,N,!0),c(this,L,Fo).call(this),this.config.card?.sendCommand("set_percentage",{percentage:y})})}),this.root.querySelector(".shroom-fan-cycle-btn")?.addEventListener("click",()=>{const _=t(this,L,Ro);if(!_.length)return;let y;if(!t(this,N)||t(this,M)===0)y=_[0];else{const A=_.findIndex(J=>J>t(this,M));y=A===-1?_[0]:_[A]}r(this,M,y),r(this,N,!0),this.config.card?.sendCommand("set_percentage",{percentage:y})}),t(this,Ot)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,he)})}),t(this,Pt)?.addEventListener("click",()=>{const _=t(this,Nt)==="forward"?"reverse":"forward";r(this,Nt,_),c(this,L,qo).call(this),this.config.card?.sendCommand("set_direction",{direction:_})}),t(this,Dt)?.addEventListener("click",()=>{if(!t(this,Q).length)return;const y=((t(this,zt)?t(this,Q).indexOf(t(this,zt)):-1)+1)%t(this,Q).length,A=t(this,Q)[y];r(this,zt,A),c(this,L,qo).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:A})}),this.renderCompanions(),k(this.root)}applyState(e,s){r(this,N,e==="on"),r(this,M,s?.percentage??0),r(this,he,s?.oscillating??!1),r(this,Nt,s?.direction??"forward"),r(this,zt,s?.preset_mode??null),s?.preset_modes?.length&&r(this,Q,s.preset_modes),r(this,le,t(this,to)||s?.assumed_state===!0),rr(this.root,!t(this,N)),C(t(this,bt),"fan",t(this,N));const o=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??"mdi:fan";if(this.renderIcon(this.resolveIcon(o,"mdi:fan"),"card-icon"),t(this,bt))if(t(this,N)&&t(this,M)>0&&!t(this,le)&&!!this.config.animate){const m=2/Math.pow(t(this,M)/100,.5);t(this,bt).setAttribute("data-spinning","true"),t(this,bt).style.setProperty("--shroom-fan-duration",`${m.toFixed(2)}s`)}else t(this,bt).setAttribute("data-spinning","false");t(this,ae)&&(t(this,N)&&t(this,M)>0&&!t(this,le)?t(this,ae).textContent=`${Math.round(t(this,M))}%`:t(this,ae).textContent=w(e)),c(this,L,jo).call(this),c(this,L,Fo).call(this),c(this,L,qo).call(this);const n=this.root.querySelector("[part=row-toggle]");n&&(n.setAttribute("aria-pressed",String(t(this,N))),n.disabled=e==="unavailable"||e==="unknown");const a=this.root.querySelector("[part=row-state]");a&&(a.textContent=w(e)),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,M)>0&&!t(this,le)?`, ${Math.round(t(this,M))}%`:""))}predictState(e,s){return e==="toggle"?{state:t(this,N)?"off":"on",attributes:{percentage:t(this,M)}}:e==="set_percentage"?{state:"on",attributes:{percentage:s.percentage,oscillating:t(this,he),direction:t(this,Nt),preset_mode:t(this,zt),preset_modes:t(this,Q)}}:e==="oscillate"?{state:"on",attributes:{percentage:t(this,M),oscillating:s.oscillating,direction:t(this,Nt)}}:e==="set_direction"?{state:"on",attributes:{percentage:t(this,M),oscillating:t(this,he),direction:s.direction}}:null}}bt=new WeakMap,ae=new WeakMap,W=new WeakMap,Ie=new WeakMap,Ot=new WeakMap,Pt=new WeakMap,Dt=new WeakMap,N=new WeakMap,M=new WeakMap,he=new WeakMap,Nt=new WeakMap,zt=new WeakMap,Q=new WeakMap,Be=new WeakMap,to=new WeakMap,le=new WeakMap,L=new WeakSet,Eo=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},vr=function(){return t(this,L,Eo)>1},Ro=function(){const e=t(this,L,Eo),s=[];for(let o=1;o*e<=100.001;o++)s.push(o*e);return s},jo=function(){if(!t(this,W))return;const e=t(this,M);this.isSliderActive(t(this,W))||(t(this,W).value=String(e)),t(this,Ie)&&(t(this,Ie).style.left=`${e}%`)},Fo=function(){const e=t(this,L,Eo)/2;this.root.querySelectorAll(".shroom-fan-step-dot").forEach(s=>{const o=Number(s.getAttribute("data-pct"));s.setAttribute("data-active",String(t(this,N)&&t(this,M)>=o-e))})},qo=function(){t(this,Ot)&&(t(this,Ot).setAttribute("aria-pressed","false"),t(this,Ot).textContent="Oscillate"),t(this,Pt)&&(t(this,Pt).textContent="Direction",t(this,Pt).setAttribute("aria-label","Direction")),t(this,Dt)&&(t(this,Dt).textContent="Preset",t(this,Dt).setAttribute("data-active","false"))},gr=function(){t(this,M)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,M)})};const Wr=`
    ${T}
    ${E}
  `;class Yr extends v{constructor(){super(...arguments);i(this,eo,null);i(this,Ve,null)}render(){H(this),this.root.innerHTML=`
        <style>${Wr}</style>
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
      `,r(this,eo,this.root.querySelector(".shroom-icon-shape")),r(this,Ve,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}applyState(e,s){const o=e==="on";C(t(this,eo),"binary_sensor",o);const n=this.formatStateLabel(e);t(this,Ve)&&(t(this,Ve).textContent=n);const a=this.root.querySelector("[part=row-value]");a&&(a.textContent=n);const l=o?"mdi:radiobox-marked":"mdi:radiobox-blank",m=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(m,l),"card-icon"),this.announceState(`${this.def.friendly_name}, ${n}`)}}eo=new WeakMap,Ve=new WeakMap;const Ur=`
    ${T}
    ${E}

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
  `;class Kr extends v{constructor(){super(...arguments);i(this,so,null);i(this,Oe,null);i(this,Y,null);i(this,ct,!1);i(this,de,!1)}render(){H(this);const e=this.def.capabilities==="read-write";r(this,de,!1),this.root.innerHTML=`
        <style>${Ur}</style>
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
      `,r(this,so,this.root.querySelector(".shroom-icon-shape")),r(this,Oe,this.root.querySelector(".shroom-secondary")),r(this,Y,this.root.querySelector(".shroom-generic-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:help-circle"),"card-icon"),t(this,Y)&&e&&this._attachGestureHandlers(t(this,Y),{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),k(this.root)}applyState(e,s){const o=e==="on"||e==="off";r(this,ct,e==="on"),t(this,Oe)&&(t(this,Oe).textContent=w(e));const n=this.root.querySelector("[part=row-value]");n&&(n.textContent=w(e));const a=this.def.domain??"generic";C(t(this,so),a,t(this,ct)),t(this,Y)&&(o&&!t(this,de)&&(t(this,Y).removeAttribute("hidden"),r(this,de,!0)),t(this,de)&&(t(this,Y).setAttribute("data-on",String(t(this,ct))),t(this,Y).setAttribute("aria-pressed",String(t(this,ct))),t(this,Y).textContent=t(this,ct)?"On":"Off",t(this,Y).title=t(this,ct)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e!=="toggle"?null:{state:t(this,ct)?"off":"on",attributes:{}}}}so=new WeakMap,Oe=new WeakMap,Y=new WeakMap,ct=new WeakMap,de=new WeakMap;const Xr=`
    ${T}
    ${Bo}
    ${Ks}
    ${qt}
    ${E}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }

    .shroom-controls-shell {
      margin-left: calc(var(--hrv-ex-shroom-icon-size, 42px) + var(--hrv-ex-shroom-spacing, 12px));
    }
  `;class hr extends v{constructor(e,s,o,n){super(e,s,o,n);i(this,xt);i(this,oo,null);i(this,Pe,null);i(this,U,null);i(this,De,null);i(this,pt,0);i(this,yt,0);i(this,Ne,100);i(this,ro,1);i(this,ze);r(this,ze,at(c(this,xt,yr).bind(this),300))}render(){H(this);const e=this.def.capabilities==="read-write";if(r(this,yt,this.def.feature_config?.min??0),r(this,Ne,this.def.feature_config?.max??100),r(this,ro,this.def.feature_config?.step??1),this.root.innerHTML=`
        <style>${Xr}</style>
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
                  min="${t(this,yt)}" max="${t(this,Ne)}" step="${t(this,ro)}" value="${t(this,yt)}"
                  aria-label="${d(this.def.friendly_name)} value"
                  aria-valuetext="${t(this,yt)}${this.def.unit_of_measurement?` ${d(this.def.unit_of_measurement)}`:""}">
                <div class="shroom-slider-focus-ring"></div>
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,oo,this.root.querySelector(".shroom-icon-shape")),r(this,Pe,this.root.querySelector(".shroom-secondary")),r(this,U,this.root.querySelector(".shroom-slider-input")),r(this,De,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:ray-vertex"),"card-icon"),C(t(this,oo),"input_number",!0),t(this,U)){const s=this.def.unit_of_measurement??"";t(this,U).addEventListener("input",()=>{r(this,pt,parseFloat(t(this,U).value)),t(this,U).setAttribute("aria-valuetext",`${t(this,pt)}${s?` ${s}`:""}`),c(this,xt,Go).call(this),t(this,ze).call(this)}),this.guardSlider(t(this,U),t(this,ze))}this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}applyState(e,s){const o=parseFloat(e);if(isNaN(o))return;r(this,pt,o),c(this,xt,Go).call(this);const n=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${o}${n?` ${n}`:""}`)}predictState(e,s){return e==="set_value"&&s.value!==void 0?{state:String(s.value),attributes:{}}:null}}oo=new WeakMap,Pe=new WeakMap,U=new WeakMap,De=new WeakMap,pt=new WeakMap,yt=new WeakMap,Ne=new WeakMap,ro=new WeakMap,ze=new WeakMap,xt=new WeakSet,br=function(e){const s=t(this,Ne)-t(this,yt);return s===0?0:Math.max(0,Math.min(100,(e-t(this,yt))/s*100))},Go=function(){const e=c(this,xt,br).call(this,t(this,pt));t(this,De)&&(t(this,De).style.left=`${e}%`),t(this,U)&&!this.isSliderActive(t(this,U))&&(t(this,U).value=String(t(this,pt)));const s=this.def.unit_of_measurement??"";t(this,Pe)&&(t(this,Pe).textContent=`${t(this,pt)}${s?` ${s}`:""}`)},yr=function(){this.config.card?.sendCommand("set_value",{value:t(this,pt)})};const Jr=`
    ${T}
    ${qt}
    ${E}

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
  `;class lr extends v{constructor(){super(...arguments);i(this,B);i(this,io,null);i(this,Ze,null);i(this,D,null);i(this,q,null);i(this,ce,null);i(this,pe,[]);i(this,wt,[]);i(this,ko,"");i(this,Zt,[]);i(this,Re,"");i(this,_t,!1);i(this,ue,"pills");i(this,Rt,null);i(this,z,null)}render(){H(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";r(this,ue,s==="dropdown"?"dropdown":"pills"),r(this,Zt,this.def.feature_config?.options??[]);const o=e?t(this,ue)==="dropdown"?`
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
        <style>${Jr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${o}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,io,this.root.querySelector(".shroom-icon-shape")),r(this,Ze,this.root.querySelector(".shroom-secondary")),r(this,D,this.root.querySelector(".shroom-select-current")),r(this,q,this.root.querySelector(".shroom-select-dropdown")),r(this,ce,this.root.querySelector(".shroom-select-grid")),r(this,pe,[]),r(this,wt,[]),r(this,Re,""),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:format-list-bulleted"),"card-icon"),C(t(this,io),"input_select",!0),t(this,D)&&e&&(t(this,D).addEventListener("click",n=>{n.stopPropagation(),t(this,_t)?c(this,B,Us).call(this):c(this,B,Yo).call(this)}),t(this,D).addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" "||n.key==="ArrowDown")&&!t(this,_t)?(n.preventDefault(),c(this,B,Yo).call(this),t(this,wt)[0]?.focus()):n.key==="Escape"&&t(this,_t)&&(c(this,B,Us).call(this),t(this,D).focus())}),r(this,Rt,n=>{t(this,_t)&&!this.root.host.contains(n.target)&&c(this,B,Us).call(this)}),document.addEventListener("click",t(this,Rt))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}applyState(e,s){r(this,ko,e);const o=s?.options,n=Array.isArray(o)&&o.length?o:t(this,Zt);r(this,Zt,n),t(this,Ze)&&(t(this,Ze).textContent=e);const a=n.join("|");if(a!==t(this,Re)&&(r(this,Re,a),t(this,ue)==="dropdown"?c(this,B,wr).call(this,n):c(this,B,xr).call(this,n)),t(this,ue)==="dropdown"){const l=this.root.querySelector(".shroom-select-label");l&&(l.textContent=e);for(const m of t(this,wt)){const p=m.dataset.option===e;m.setAttribute("data-active",String(p)),m.setAttribute("aria-selected",String(p))}}else for(const l of t(this,pe))l.setAttribute("data-active",String(l.dataset.option===e));this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="select_option"&&s.option!==void 0?{state:String(s.option),attributes:{options:t(this,Zt)}}:null}destroy(){t(this,Rt)&&(document.removeEventListener("click",t(this,Rt)),r(this,Rt,null)),t(this,z)&&(window.removeEventListener("scroll",t(this,z),!0),window.removeEventListener("resize",t(this,z)),r(this,z,null));try{t(this,q)?.hidePopover?.()}catch{}}}io=new WeakMap,Ze=new WeakMap,D=new WeakMap,q=new WeakMap,ce=new WeakMap,pe=new WeakMap,wt=new WeakMap,ko=new WeakMap,Zt=new WeakMap,Re=new WeakMap,_t=new WeakMap,ue=new WeakMap,Rt=new WeakMap,z=new WeakMap,B=new WeakSet,xr=function(e){if(t(this,ce)){t(this,ce).innerHTML="",r(this,pe,[]);for(const s of e){const o=document.createElement("button");o.type="button",o.className="shroom-select-pill",o.dataset.option=s,o.textContent=w(s),o.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s})}),t(this,ce).appendChild(o),t(this,pe).push(o)}}},wr=function(e){if(t(this,q)){t(this,q).innerHTML="",r(this,wt,[]);for(const s of e){const o=document.createElement("button");o.type="button",o.className="shroom-select-option",o.role="option",o.dataset.option=s,o.textContent=w(s),o.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s}),c(this,B,Us).call(this),t(this,D)?.focus()}),o.addEventListener("keydown",n=>{const a=t(this,wt),l=a.indexOf(o);n.key==="ArrowDown"?(n.preventDefault(),a[Math.min(l+1,a.length-1)]?.focus()):n.key==="ArrowUp"?(n.preventDefault(),l===0?t(this,D)?.focus():a[l-1]?.focus()):n.key==="Escape"&&(c(this,B,Us).call(this),t(this,D)?.focus())}),t(this,q).appendChild(o),t(this,wt).push(o)}}},Wo=function(){if(!t(this,q)||!t(this,D))return;const e=t(this,D).getBoundingClientRect(),s=window.innerHeight-e.bottom,o=e.top,n=Math.min(t(this,q).scrollHeight||240,240);t(this,q).style.left=`${Math.round(e.left)}px`,t(this,q).style.width=`${Math.round(e.width)}px`,s<n+8&&o>s?t(this,q).style.top=`${Math.max(8,Math.round(e.top-n-6))}px`:t(this,q).style.top=`${Math.round(e.bottom+6)}px`},Yo=function(){if(!(!t(this,q)||!t(this,Zt).length)){try{typeof t(this,q).showPopover=="function"&&t(this,q).showPopover()}catch{}t(this,D)?.setAttribute("aria-expanded","true"),c(this,B,Wo).call(this),r(this,z,()=>c(this,B,Wo).call(this)),window.addEventListener("scroll",t(this,z),!0),window.addEventListener("resize",t(this,z)),r(this,_t,!0)}},Us=function(){try{typeof t(this,q)?.hidePopover=="function"&&t(this,q).hidePopover()}catch{}t(this,D)?.setAttribute("aria-expanded","false"),t(this,z)&&(window.removeEventListener("scroll",t(this,z),!0),window.removeEventListener("resize",t(this,z)),r(this,z,null)),r(this,_t,!1)};const Qr=`
    ${T}
    ${Ks}
    ${qt}
    ${E}

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
  `;class ti extends v{constructor(e,s,o,n){super(e,s,o,n);i(this,Z);i(this,no,null);i(this,je,null);i(this,tt,null);i(this,Fe,null);i(this,Ge,null);i(this,et,null);i(this,We,null);i(this,Ct,0);i(this,Ye,null);i(this,me,null);i(this,fe,null);i(this,ve,null);i(this,St,0);i(this,ut,!1);i(this,Ue,"closed");i(this,ao,{});i(this,Ke);i(this,Xe);r(this,Ke,at(c(this,Z,Cr).bind(this),300)),r(this,Xe,at(c(this,Z,Sr).bind(this),300))}render(){H(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},o=s.show_position!==!1&&this.def.supported_features?.includes("set_position"),n=s.show_tilt!==!1&&this.def.supported_features?.includes("set_tilt_position"),a=!this.def.supported_features||this.def.supported_features.includes("buttons"),l=e&&(o||n||a);this.root.innerHTML=`
        <style>${Qr}</style>
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
            ${o||a?`
            <div class="shroom-cover-bar">
              ${o?`
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
                <div class="shroom-cover-btn-view"${o?" hidden":""}>
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
              ${o&&a?`
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
      `,r(this,no,this.root.querySelector(".shroom-icon-shape")),r(this,je,this.root.querySelector(".shroom-secondary")),r(this,tt,this.root.querySelector("[part=position-slider]")),r(this,Fe,this.root.querySelector(".shroom-slider-cover")),r(this,et,this.root.querySelector("[part=tilt-slider]")),r(this,We,this.root.querySelector(".shroom-cover-tilt-cover")),r(this,Ge,this.root.querySelector(".shroom-cover-slider-view")),r(this,Ye,this.root.querySelector(".shroom-cover-btn-view")),r(this,me,this.root.querySelector("[data-action=open]")),r(this,fe,this.root.querySelector("[data-action=stop]")),r(this,ve,this.root.querySelector("[data-action=close]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:window-shutter"),"card-icon"),t(this,tt)&&(t(this,tt).addEventListener("input",()=>{r(this,St,parseInt(t(this,tt).value,10)),c(this,Z,Uo).call(this),t(this,Ke).call(this)}),this.guardSlider(t(this,tt),t(this,Ke))),t(this,et)&&(t(this,et).addEventListener("input",()=>{r(this,Ct,parseInt(t(this,et).value,10)),c(this,Z,Ko).call(this),t(this,Xe).call(this)}),this.guardSlider(t(this,et),t(this,Xe))),[t(this,me),t(this,fe),t(this,ve)].forEach(p=>{if(!p)return;const f=p.getAttribute("data-action");p.addEventListener("click",()=>{this.config.card?.sendCommand(`${f}_cover`,{})})});const m=this.root.querySelector(".shroom-cover-toggle-btn");m?.addEventListener("click",()=>{r(this,ut,!t(this,ut)),m.setAttribute("aria-expanded",String(t(this,ut))),m.setAttribute("aria-label",t(this,ut)?"Show position slider":"Show cover buttons"),c(this,Z,_r).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}applyState(e,s){r(this,Ue,e),r(this,ao,{...s});const o=e==="open"||e==="opening";if(C(t(this,no),"cover",o),t(this,je)){const m=s.current_position,p=w(e);t(this,je).textContent=m!==void 0?`${p} - ${m}%`:p}const n=this.root.querySelector("[part=row-state]");n&&(n.textContent=w(e));const a=e==="opening"||e==="closing",l=s.current_position;t(this,me)&&(t(this,me).disabled=!a&&l===100),t(this,fe)&&(t(this,fe).disabled=!a),t(this,ve)&&(t(this,ve).disabled=!a&&e==="closed"),s.current_position!==void 0&&(r(this,St,s.current_position),t(this,tt)&&!this.isSliderActive(t(this,tt))&&(t(this,tt).value=String(t(this,St))),c(this,Z,Uo).call(this)),s.current_tilt_position!==void 0&&(r(this,Ct,s.current_tilt_position),t(this,et)&&!this.isSliderActive(t(this,et))&&(t(this,et).value=String(t(this,Ct))),c(this,Z,Ko).call(this)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){const o={...t(this,ao)};return e==="open_cover"?(o.current_position=100,{state:"open",attributes:o}):e==="close_cover"?(o.current_position=0,{state:"closed",attributes:o}):e==="stop_cover"?{state:t(this,Ue),attributes:o}:e==="set_cover_position"&&s.position!==void 0?(o.current_position=s.position,{state:s.position>0?"open":"closed",attributes:o}):e==="set_cover_tilt_position"&&s.tilt_position!==void 0?(o.current_tilt_position=s.tilt_position,{state:t(this,Ue),attributes:o}):null}}no=new WeakMap,je=new WeakMap,tt=new WeakMap,Fe=new WeakMap,Ge=new WeakMap,et=new WeakMap,We=new WeakMap,Ct=new WeakMap,Ye=new WeakMap,me=new WeakMap,fe=new WeakMap,ve=new WeakMap,St=new WeakMap,ut=new WeakMap,Ue=new WeakMap,ao=new WeakMap,Ke=new WeakMap,Xe=new WeakMap,Z=new WeakSet,_r=function(){t(this,Ge)&&(t(this,Ge).hidden=t(this,ut)),t(this,Ye)&&(t(this,Ye).hidden=!t(this,ut));const e=this.root.querySelector(".shroom-cover-toggle-btn");e&&(e.innerHTML=t(this,ut)?'<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>')},Uo=function(){t(this,Fe)&&(t(this,Fe).style.left=`${t(this,St)}%`);const e=this.root.querySelector(".shroom-slider-edge");e&&(e.style.left=`${t(this,St)}%`)},Cr=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,St)})},Ko=function(){t(this,We)&&(t(this,We).style.left=`${t(this,Ct)}%`);const e=this.root.querySelector(".shroom-cover-tilt-edge");e&&(e.style.left=`${t(this,Ct)}%`)},Sr=function(){this.config.card?.sendCommand("set_cover_tilt_position",{tilt_position:t(this,Ct)})};const ei=`
    ${T}
    ${E}
  `;class si extends v{constructor(){super(...arguments);i(this,Je,null);i(this,Qe,null);i(this,ho,!1)}render(){H(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${ei}</style>
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
      `,r(this,Je,this.root.querySelector(".shroom-icon-shape")),r(this,Qe,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:remote"),"card-icon"),C(t(this,Je),"remote",!1);const s=this.root.querySelector(".shroom-state-item");e&&(Et(s,`${this.def.friendly_name} - Toggle power`),this._attachGestureHandlers(s,{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand(t(this,ho)?"turn_off":"turn_on",{})}})),this.renderCompanions(),k(this.root)}applyState(e,s){const o=e==="on";r(this,ho,o),C(t(this,Je),"remote",o),t(this,Qe)&&(t(this,Qe).textContent=w(e));const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(n,"mdi:remote"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Je=new WeakMap,Qe=new WeakMap,ho=new WeakMap;function Mo(h){h<0&&(h=0);const u=Math.floor(h/3600),e=Math.floor(h%3600/60),s=Math.floor(h%60),o=n=>String(n).padStart(2,"0");return u>0?`${u}:${o(e)}:${o(s)}`:`${o(e)}:${o(s)}`}function dr(h){if(typeof h=="number")return h;if(typeof h!="string")return 0;const u=h.split(":").map(Number);return u.length===3?u[0]*3600+u[1]*60+u[2]:u.length===2?u[0]*60+u[1]:u[0]||0}const oi=`
    ${T}
    ${qt}
    ${E}

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
  `;class ri extends v{constructor(){super(...arguments);i(this,G);i(this,ts,null);i(this,jt,null);i(this,Ft,null);i(this,ge,null);i(this,be,null);i(this,ye,null);i(this,es,"idle");i(this,ss,{});i(this,st,null);i(this,os,null)}render(){H(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${oi}</style>
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
      `,r(this,ts,this.root.querySelector(".shroom-icon-shape")),r(this,jt,this.root.querySelector(".shroom-secondary")),r(this,Ft,this.root.querySelector("[data-action=playpause]")),r(this,ge,this.root.querySelector("[data-action=cancel]")),r(this,be,this.root.querySelector("[data-action=finish]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:timer-outline"),"card-icon"),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),C(t(this,ts),"timer",!1),e&&(t(this,Ft)?.addEventListener("click",()=>{const s=t(this,es)==="active"?"pause":"start";this.config.card?.sendCommand(s,{})}),t(this,ge)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,be)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}applyState(e,s){r(this,es,e),r(this,ss,{...s}),r(this,st,s.finishes_at??null),r(this,os,s.remaining!=null?dr(s.remaining):null);const o=e==="active";C(t(this,ts),"timer",o||e==="paused"),c(this,G,$r).call(this,e),c(this,G,Lr).call(this,e),o&&t(this,st)?c(this,G,Ar).call(this):c(this,G,$o).call(this)}predictState(e,s){const o={...t(this,ss)};return e==="start"?{state:"active",attributes:o}:e==="pause"?(t(this,st)&&(o.remaining=Math.max(0,(new Date(t(this,st)).getTime()-Date.now())/1e3)),{state:"paused",attributes:o}):e==="cancel"||e==="finish"?{state:"idle",attributes:o}:null}}ts=new WeakMap,jt=new WeakMap,Ft=new WeakMap,ge=new WeakMap,be=new WeakMap,ye=new WeakMap,es=new WeakMap,ss=new WeakMap,st=new WeakMap,os=new WeakMap,G=new WeakSet,$r=function(e){const s=e==="idle",o=e==="active";if(t(this,Ft)){const n=o?"mdi:pause":"mdi:play",a=o?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(n,"playpause-icon"),t(this,Ft).title=a,t(this,Ft).setAttribute("aria-label",`${this.def.friendly_name} - ${a}`)}t(this,ge)&&(t(this,ge).disabled=s),t(this,be)&&(t(this,be).disabled=s),this.announceState(`${this.def.friendly_name}, ${e}`)},Lr=function(e){if(!t(this,jt))return;const s=w(e);let o=null;if(e==="idle"){const n=t(this,ss).duration;o=n?Mo(dr(n)):"00:00"}else if(e==="paused"&&t(this,os)!=null)o=Mo(t(this,os));else if(e==="active"&&t(this,st)){const n=Math.max(0,(new Date(t(this,st)).getTime()-Date.now())/1e3);o=Mo(n)}t(this,jt).textContent=o?`${s} - ${o}`:s},Ar=function(){c(this,G,$o).call(this),r(this,ye,setInterval(()=>{if(!t(this,st)||t(this,es)!=="active"){c(this,G,$o).call(this);return}const e=Math.max(0,(new Date(t(this,st)).getTime()-Date.now())/1e3);t(this,jt)&&(t(this,jt).textContent=`Active - ${Mo(e)}`),e<=0&&c(this,G,$o).call(this)},1e3))},$o=function(){t(this,ye)&&(clearInterval(t(this,ye)),r(this,ye,null))};const ii=`
    ${T}
    ${qt}
    ${E}

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
  `;class ni extends v{constructor(e,s,o,n){super(e,s,o,n);i(this,S);i(this,lo,null);i(this,rs,null);i(this,is,null);i(this,ns,null);i(this,as,null);i(this,hs,null);i(this,ls,null);i(this,ds,null);i(this,cs,null);i(this,ps,null);i(this,us,null);i(this,O,null);i(this,ms,null);i(this,fs,null);i(this,$t,null);i(this,xe,null);i(this,mt,null);i(this,R,null);i(this,Lt,!1);i(this,At,20);i(this,vs,null);i(this,ot,"off");i(this,gs,null);i(this,bs,null);i(this,ys,null);i(this,co,16);i(this,po,32);i(this,uo,.5);i(this,xs,"°C");i(this,Gt,[]);i(this,we,[]);i(this,_e,[]);i(this,Ce,[]);i(this,mo,{});i(this,fo);r(this,fo,at(c(this,S,kr).bind(this),500))}render(){H(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},o=this.def.supported_features?.includes("target_temperature"),n=s.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),a=s.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),l=s.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);r(this,co,this.def.feature_config?.min_temp??16),r(this,po,this.def.feature_config?.max_temp??32),r(this,uo,this.def.feature_config?.temp_step??.5),r(this,xs,this.def.unit_of_measurement??"°C"),r(this,Gt,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),r(this,we,this.def.feature_config?.fan_modes??[]),r(this,_e,this.def.feature_config?.preset_modes??[]),r(this,Ce,this.def.feature_config?.swing_modes??[]);const m=e&&(t(this,Gt).length||t(this,_e).length||t(this,we).length||t(this,Ce).length),[p,f]=t(this,At).toFixed(1).split(".");this.root.innerHTML=`
        <style>${ii}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${o||m?`
            <div class="shroom-climate-bar">
              ${o?`
                <div class="shroom-climate-temp-view">
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="-" type="button"
                      aria-label="Decrease temperature" title="Decrease">&#8722;</button>
                  `:""}
                  <span class="shroom-climate-temp-display">
                    <span class="shroom-climate-temp-int">${d(p)}</span><span class="shroom-climate-temp-frac">.${d(f)}</span>
                    <span class="shroom-climate-temp-unit">${d(t(this,xs))}</span>
                  </span>
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  `:""}
                </div>
              `:""}
              ${m?`
                <div class="shroom-climate-feat-view" hidden>
                  ${s.show_hvac_modes!==!1&&t(this,Gt).length?`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${a&&t(this,_e).length?`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${n&&t(this,we).length?`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${l&&t(this,Ce).length?`
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
      `,r(this,lo,this.root.querySelector(".shroom-icon-shape")),r(this,rs,this.root.querySelector(".shroom-secondary")),r(this,is,this.root.querySelector(".shroom-climate-bar")),r(this,ns,this.root.querySelector(".shroom-climate-temp-int")),r(this,as,this.root.querySelector(".shroom-climate-temp-frac")),r(this,hs,this.root.querySelector("[data-dir='-']")),r(this,ls,this.root.querySelector("[data-dir='+']")),r(this,ds,this.root.querySelector("[data-feat=mode]")),r(this,cs,this.root.querySelector("[data-feat=fan]")),r(this,ps,this.root.querySelector("[data-feat=preset]")),r(this,us,this.root.querySelector("[data-feat=swing]")),r(this,O,this.root.querySelector(".shroom-climate-dropdown")),r(this,ms,this.root.querySelector(".shroom-climate-temp-view")),r(this,fs,this.root.querySelector(".shroom-climate-feat-view")),r(this,$t,this.root.querySelector(".shroom-climate-toggle-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:thermostat"),"card-icon");const g=this.root.querySelector(".shroom-state-item");e&&(Et(g,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(g,{onTap:()=>{const b=this.config.gestureConfig?.tap;if(b){this._runAction(b);return}const $=t(this,ot)==="off"?t(this,Gt).find(P=>P!=="off")??"heat":"off";this.config.card?.sendCommand("set_hvac_mode",{hvac_mode:$})}})),t(this,hs)&&t(this,hs).addEventListener("click",b=>{b.stopPropagation(),c(this,S,Xo).call(this,-1)}),t(this,ls)&&t(this,ls).addEventListener("click",b=>{b.stopPropagation(),c(this,S,Xo).call(this,1)}),t(this,$t)&&t(this,$t).addEventListener("click",b=>{b.stopPropagation(),r(this,Lt,!t(this,Lt)),t(this,$t).setAttribute("aria-expanded",String(t(this,Lt))),c(this,S,Mr).call(this)}),e&&[t(this,ds),t(this,cs),t(this,ps),t(this,us)].forEach(b=>{if(!b)return;const $=b.getAttribute("data-feat");b.addEventListener("click",P=>{P.stopPropagation(),c(this,S,Hr).call(this,$)})}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}applyState(e,s){r(this,mo,{...s}),r(this,ot,e),r(this,gs,s.fan_mode??null),r(this,bs,s.preset_mode??null),r(this,ys,s.swing_mode??null),r(this,vs,s.current_temperature??null);const o=e==="off";if(t(this,is)&&(t(this,is).hidden=o),C(t(this,lo),"climate",!o),s.temperature!==void 0&&(r(this,At,s.temperature),c(this,S,Jo).call(this)),t(this,rs)){const a=s.hvac_action??e,l=t(this,vs)!=null?` - ${t(this,vs)} ${t(this,xs)}`:"";t(this,rs).textContent=w(a)+l}c(this,S,Tr).call(this);const n=s.hvac_action??e;this.announceState(`${this.def.friendly_name}, ${w(n)}`)}predictState(e,s){const o={...t(this,mo)};return e==="set_hvac_mode"&&s.hvac_mode?{state:s.hvac_mode,attributes:o}:e==="set_temperature"&&s.temperature!==void 0?{state:t(this,ot),attributes:{...o,temperature:s.temperature}}:e==="set_fan_mode"&&s.fan_mode?{state:t(this,ot),attributes:{...o,fan_mode:s.fan_mode}}:e==="set_preset_mode"&&s.preset_mode?{state:t(this,ot),attributes:{...o,preset_mode:s.preset_mode}}:e==="set_swing_mode"&&s.swing_mode?{state:t(this,ot),attributes:{...o,swing_mode:s.swing_mode}}:null}destroy(){t(this,mt)&&(document.removeEventListener("pointerdown",t(this,mt),!0),r(this,mt,null)),t(this,R)&&(window.removeEventListener("scroll",t(this,R),!0),window.removeEventListener("resize",t(this,R)),r(this,R,null));try{t(this,O)?.hidePopover?.()}catch{}}}lo=new WeakMap,rs=new WeakMap,is=new WeakMap,ns=new WeakMap,as=new WeakMap,hs=new WeakMap,ls=new WeakMap,ds=new WeakMap,cs=new WeakMap,ps=new WeakMap,us=new WeakMap,O=new WeakMap,ms=new WeakMap,fs=new WeakMap,$t=new WeakMap,xe=new WeakMap,mt=new WeakMap,R=new WeakMap,Lt=new WeakMap,At=new WeakMap,vs=new WeakMap,ot=new WeakMap,gs=new WeakMap,bs=new WeakMap,ys=new WeakMap,co=new WeakMap,po=new WeakMap,uo=new WeakMap,xs=new WeakMap,Gt=new WeakMap,we=new WeakMap,_e=new WeakMap,Ce=new WeakMap,mo=new WeakMap,fo=new WeakMap,S=new WeakSet,Mr=function(){t(this,ms)&&(t(this,ms).hidden=t(this,Lt)),t(this,fs)&&(t(this,fs).hidden=!t(this,Lt)),t(this,$t)&&(t(this,$t).innerHTML=t(this,Lt)?'<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>')},Xo=function(e){const s=Math.round((t(this,At)+e*t(this,uo))*100)/100;r(this,At,Math.max(t(this,co),Math.min(t(this,po),s))),c(this,S,Jo).call(this),t(this,fo).call(this)},Jo=function(){const[e,s]=t(this,At).toFixed(1).split(".");t(this,ns)&&(t(this,ns).textContent=e),t(this,as)&&(t(this,as).textContent=`.${s}`)},kr=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,At)})},Hr=function(e){if(t(this,xe)===e){c(this,S,Lo).call(this);return}t(this,xe)&&c(this,S,Lo).call(this),r(this,xe,e);let s=[],o=null,n="",a="";switch(e){case"mode":s=t(this,Gt),o=t(this,ot),n="set_hvac_mode",a="hvac_mode";break;case"fan":s=t(this,we),o=t(this,gs),n="set_fan_mode",a="fan_mode";break;case"preset":s=t(this,_e),o=t(this,bs),n="set_preset_mode",a="preset_mode";break;case"swing":s=t(this,Ce),o=t(this,ys),n="set_swing_mode",a="swing_mode";break}if(!s.length||!t(this,O))return;t(this,O).innerHTML=s.map(p=>`
        <button class="shroom-climate-dd-option" data-active="${p===o}" role="option"
          aria-selected="${p===o}" type="button">
          ${d(w(p))}
        </button>
      `).join(""),t(this,O).querySelectorAll(".shroom-climate-dd-option").forEach((p,f)=>{p.addEventListener("click",g=>{g.stopPropagation(),this.config.card?.sendCommand(n,{[a]:s[f]}),c(this,S,Lo).call(this)})});const l=this.root.querySelector(`[data-feat="${e}"]`);l&&l.setAttribute("aria-expanded","true");try{t(this,O).showPopover?.()}catch{}c(this,S,Qo).call(this,l),r(this,R,()=>c(this,S,Qo).call(this,l)),window.addEventListener("scroll",t(this,R),!0),window.addEventListener("resize",t(this,R));const m=p=>{p.composedPath().some(g=>g===this.root||g===this.root.host)||c(this,S,Lo).call(this)};r(this,mt,m),document.addEventListener("pointerdown",m,!0)},Qo=function(e){if(!t(this,O)||!e)return;const s=e.getBoundingClientRect(),o=window.innerHeight-s.bottom,n=s.top,a=Math.min(t(this,O).scrollHeight||240,240),l=Math.max(140,Math.round(s.width));t(this,O).style.left=`${Math.round(s.left)}px`,t(this,O).style.minWidth=`${l}px`,o<a+8&&n>o?t(this,O).style.top=`${Math.max(8,Math.round(s.top-a-6))}px`:t(this,O).style.top=`${Math.round(s.bottom+6)}px`},Lo=function(){r(this,xe,null);try{t(this,O)?.hidePopover?.()}catch{}this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(e=>{e.setAttribute("aria-expanded","false")}),t(this,mt)&&(document.removeEventListener("pointerdown",t(this,mt),!0),r(this,mt,null)),t(this,R)&&(window.removeEventListener("scroll",t(this,R),!0),window.removeEventListener("resize",t(this,R)),r(this,R,null))},Tr=function(){const e=(s,o)=>{if(!s)return;const n=s.querySelector(".shroom-climate-feat-value");n&&(n.textContent=w(o??"None"))};e(t(this,ds),t(this,ot)),e(t(this,cs),t(this,gs)),e(t(this,ps),t(this,bs)),e(t(this,us),t(this,ys))};const ai=`
    ${T}
    ${Ks}
    ${qt}
    ${E}

    .shroom-mp-icon-wrap {
      position: relative;
      flex-shrink: 0;
      display: flex;
    }
    .shroom-mp-art {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      display: none;
    }
    .shroom-mp-icon-wrap[data-has-art=true] .shroom-mp-art { display: block; }
    :host([data-layout=vertical]) .shroom-mp-art,
    :host([layout=row]) .shroom-mp-art { border-radius: 50%; }

    .shroom-mp-seek {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
    }
    .shroom-mp-seek[hidden] { display: none; }
    .shroom-mp-seek .shroom-slider-wrap { flex: 1; height: 28px; }
    .shroom-mp-seek-cover { transition: none; }
    .shroom-mp-time {
      font-size: 11px;
      color: var(--hrv-color-text-secondary, #757575);
      min-width: 32px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

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
  `;class hi extends v{constructor(e,s,o,n){super(e,s,o,n);i(this,X);i(this,vo,null);i(this,Mt,null);i(this,ws,"");i(this,_s,null);i(this,K,null);i(this,Wt,null);i(this,Yt,null);i(this,Cs,null);i(this,Ss,0);i(this,go,!1);i(this,Ut,null);i(this,$s,null);i(this,Se,null);i(this,Ls,null);i(this,As,null);i(this,Ms,null);i(this,Kt,null);i(this,bo,null);i(this,yo,null);i(this,xo,null);i(this,ks,null);i(this,rt,null);i(this,Xt,null);i(this,Jt,!1);i(this,$e,!1);i(this,it,0);i(this,kt,"idle");i(this,ft,{});i(this,Hs);r(this,Hs,at(c(this,X,Er).bind(this),200))}render(){H(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??{},n=s.includes("play_pause"),a=s.includes("previous_track"),l=s.includes("next_track"),m=s.includes("turn_on")||s.includes("turn_off"),p=o.show_volume!==!1&&s.includes("volume_set"),f=o.show_volume!==!1&&s.includes("volume_step"),g=p||f,b=o.show_volume!==!1&&s.includes("volume_mute");this.root.innerHTML=`
        <style>${ai}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-mp-icon-wrap" data-has-art="false">
              <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
              <img class="shroom-mp-art" part="media-art-img" alt="">
            </span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <div class="shroom-mp-seek" part="progress-row" hidden>
            <span class="shroom-mp-time" part="progress-elapsed">0:00</span>
            <div class="shroom-slider-wrap">
              <div class="shroom-slider-bg shroom-mp-slider-bg"></div>
              <div class="shroom-slider-cover shroom-mp-seek-cover" style="left:0%"></div>
              <input type="range" class="shroom-slider-input shroom-mp-seek-input"
                min="0" max="1000" step="1" value="0"
                aria-label="${d(this.def.friendly_name)} seek"
                ${e?"":"disabled"}>
              <div class="shroom-slider-focus-ring"></div>
            </div>
            <span class="shroom-mp-time" part="progress-duration">0:00</span>
          </div>
          ${e?`
            <div class="shroom-mp-bar" hidden>
              <div class="shroom-mp-transport-view">
                ${m?`<button class="shroom-mp-btn" data-role="power" type="button" title="Power" aria-label="Power">
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
                  ${b?`<button class="shroom-mp-btn" data-role="mute" type="button" title="Mute" aria-label="Mute" aria-pressed="false">
                    <span part="mute-icon" aria-hidden="true"></span>
                  </button>`:""}
                  ${f?`<button class="shroom-mp-btn" data-role="vol-down" type="button" title="Volume down" aria-label="Volume down">
                    <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z"/></svg>
                  </button>`:""}
                  ${p?`<div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-mp-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <input type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${d(this.def.friendly_name)} volume"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>`:""}
                  ${f?`<button class="shroom-mp-btn" data-role="vol-up" type="button" title="Volume up" aria-label="Volume up">
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
      `,r(this,vo,this.root.querySelector(".shroom-icon-shape")),r(this,Mt,this.root.querySelector(".shroom-mp-icon-wrap")),r(this,_s,this.root.querySelector("[part=progress-row]")),r(this,K,this.root.querySelector(".shroom-mp-seek-input")),r(this,Wt,this.root.querySelector(".shroom-mp-seek-cover")),r(this,Yt,this.root.querySelector("[part=progress-elapsed]")),r(this,Cs,this.root.querySelector("[part=progress-duration]")),r(this,$s,this.root.querySelector(".shroom-primary")),r(this,Se,this.root.querySelector(".shroom-secondary")),r(this,Ms,this.root.querySelector(".shroom-mp-bar")),r(this,Ls,this.root.querySelector(".shroom-mp-transport-view")),r(this,As,this.root.querySelector(".shroom-mp-volume-view")),r(this,Kt,this.root.querySelector("[data-role=play]")),r(this,bo,this.root.querySelector("[data-role=prev]")),r(this,yo,this.root.querySelector("[data-role=next]")),r(this,xo,this.root.querySelector("[data-role=power]")),r(this,ks,this.root.querySelector("[data-role=volume]")),r(this,rt,this.root.querySelector(".shroom-mp-volume-view .shroom-slider-input")),r(this,Xt,this.root.querySelector(".shroom-mp-volume-view .shroom-slider-cover")),r(this,Ut,this.root.querySelector("[data-role=mute]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:cast"),"card-icon"),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:power","power-icon"),this.renderIcon("mdi:volume-high","vol-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,Kt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,bo)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,yo)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),t(this,xo)?.addEventListener("click",()=>{const _=["off","unavailable","unknown"].includes(t(this,kt))?"turn_on":"turn_off";s.includes(_)&&this.config.card?.sendCommand(_,{})}),t(this,ks)?.addEventListener("click",()=>{r(this,$e,!0),c(this,X,tr).call(this)}),this.root.querySelector(".shroom-mp-back-btn")?.addEventListener("click",()=>{r(this,$e,!1),c(this,X,tr).call(this)}),this.root.querySelector("[data-role=vol-down]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_down",{})}),this.root.querySelector("[data-role=vol-up]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_up",{})}),t(this,Ut)?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,Jt)})})),t(this,rt)&&(t(this,rt).addEventListener("input",()=>{r(this,it,parseInt(t(this,rt).value,10)),t(this,Xt)&&(t(this,Xt).style.left=`${t(this,it)}%`),t(this,Hs).call(this)}),this.guardSlider(t(this,rt),t(this,Hs))),t(this,K)&&e&&(t(this,K).addEventListener("input",()=>{r(this,go,!0),this.beginMediaSeek();const $=parseInt(t(this,K).value,10)/1e3;t(this,Wt)&&(t(this,Wt).style.left=`${$*100}%`),t(this,Yt)&&(t(this,Yt).textContent=this.formatMediaTime($*t(this,Ss)))}),t(this,K).addEventListener("change",()=>{r(this,go,!1),this.endMediaSeek();const $=parseInt(t(this,K).value,10)/1e3;this.config.card?.sendCommand("media_seek",{seek_position:$*t(this,Ss)})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}destroy(){this.stopMediaTicker()}applyState(e,s){r(this,kt,e),r(this,ft,s);const o=e==="playing",n=o||e==="paused";C(t(this,vo),"media_player",n),c(this,X,qr).call(this,s.entity_picture),c(this,X,er).call(this),o&&this.mediaProgress(s,!0)?this.startMediaTicker(()=>c(this,X,er).call(this)):this.stopMediaTicker(),t(this,Ms)&&(t(this,Ms).hidden=!n&&!this.def.supported_features?.includes("turn_on"));const a=s.media_title??"",l=s.media_artist??"";if(t(this,$s)&&(t(this,$s).textContent=n&&a?a:this.def.friendly_name),t(this,Se))if(n){const p=this.mediaSourceText(s),f=t(this,it)>0?`${t(this,it)}%`:"",g=[l,p,f].filter(Boolean);t(this,Se).textContent=g.join(" - ")||w(e)}else t(this,Se).textContent=w(e);if(t(this,Kt)){const p=o?"mdi:pause":"mdi:play";this.renderIcon(p,"play-icon");const f=o?"Pause":"Play";t(this,Kt).title=f,t(this,Kt).setAttribute("aria-label",f)}s.volume_level!==void 0&&(r(this,it,Math.round(s.volume_level*100)),t(this,rt)&&!this.isSliderActive(t(this,rt))&&(t(this,rt).value=String(t(this,it))),t(this,Xt)&&(t(this,Xt).style.left=`${t(this,it)}%`)),r(this,Jt,!!s.is_volume_muted);const m=t(this,Jt)?"mdi:volume-off":"mdi:volume-high";t(this,ks)&&this.renderIcon(m,"vol-icon"),t(this,Ut)&&(this.renderIcon(m,"mute-icon"),t(this,Ut).setAttribute("aria-pressed",String(t(this,Jt))),t(this,Ut).title=t(this,Jt)?"Unmute":"Mute"),this.announceState(`${this.def.friendly_name}, ${e}${a?` - ${a}`:""}`)}predictState(e,s){return e==="media_play_pause"?{state:t(this,kt)==="playing"?"paused":"playing",attributes:t(this,ft)}:e==="volume_mute"?{state:t(this,kt),attributes:{...t(this,ft),is_volume_muted:!!s.is_volume_muted}}:e==="volume_set"?{state:t(this,kt),attributes:{...t(this,ft),volume_level:s.volume_level}}:e==="turn_off"?{state:"off",attributes:t(this,ft)}:e==="turn_on"?{state:"idle",attributes:t(this,ft)}:null}}vo=new WeakMap,Mt=new WeakMap,ws=new WeakMap,_s=new WeakMap,K=new WeakMap,Wt=new WeakMap,Yt=new WeakMap,Cs=new WeakMap,Ss=new WeakMap,go=new WeakMap,Ut=new WeakMap,$s=new WeakMap,Se=new WeakMap,Ls=new WeakMap,As=new WeakMap,Ms=new WeakMap,Kt=new WeakMap,bo=new WeakMap,yo=new WeakMap,xo=new WeakMap,ks=new WeakMap,rt=new WeakMap,Xt=new WeakMap,Jt=new WeakMap,$e=new WeakMap,it=new WeakMap,kt=new WeakMap,ft=new WeakMap,Hs=new WeakMap,X=new WeakSet,tr=function(){t(this,Ls)&&(t(this,Ls).hidden=t(this,$e)),t(this,As)&&(t(this,As).hidden=!t(this,$e))},er=function(){const e=this.mediaProgress(t(this,ft),t(this,kt)==="playing");t(this,_s)&&(t(this,_s).hidden=!e),e&&(r(this,Ss,e.duration),t(this,Cs)&&(t(this,Cs).textContent=this.formatMediaTime(e.duration)),!(this.isMediaSeekActive()||this.isFocused(t(this,K)))&&(t(this,K)&&(t(this,K).value=String(Math.round(e.fraction*1e3))),t(this,Wt)&&(t(this,Wt).style.left=`${e.fraction*100}%`),t(this,Yt)&&(t(this,Yt).textContent=this.formatMediaTime(e.elapsed))))},Er=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,it)/100})},qr=function(e){if(!t(this,Mt))return;const s=this.resolveAssetUrl(e);if(s===t(this,ws))return;r(this,ws,s);const o=t(this,Mt).querySelector(".shroom-mp-art");s&&o?(o.onerror=()=>{r(this,ws,""),t(this,Mt).setAttribute("data-has-art","false")},o.src=s,t(this,Mt).setAttribute("data-has-art","true")):(o&&o.removeAttribute("src"),t(this,Mt).setAttribute("data-has-art","false"))};const cr={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},li=cr.cloudy,di="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z",ci="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",pi="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",ui=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Vo(h,u){const e=cr[h]??li;return`<svg viewBox="0 0 24 24" width="${u}" height="${u}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Oo(h){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${h}" fill="currentColor"/></svg>`}const mi=`
    ${T}
    ${E}

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
  `;class fi extends v{constructor(){super(...arguments);i(this,I);i(this,wo,null);i(this,Ts,null);i(this,Es,null);i(this,Le,null);i(this,qs,null);i(this,Is,null);i(this,Bs,null);i(this,Ht,null);i(this,vt,null);i(this,Vs,null);i(this,Ae,null);i(this,Me,null)}render(){H(this),this.root.innerHTML=`
        <style>${mi}</style>
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
              <span class="shroom-weather-icon">${Vo("cloudy",36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${Oo(di)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${Oo(ci)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${Oo(pi)}
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
      `,r(this,wo,this.root.querySelector(".shroom-icon-shape")),r(this,Ts,this.root.querySelector(".shroom-secondary")),r(this,Es,this.root.querySelector(".shroom-weather-icon")),r(this,Le,this.root.querySelector(".shroom-weather-temp")),r(this,qs,this.root.querySelector("[data-stat=humidity] [data-value]")),r(this,Is,this.root.querySelector("[data-stat=wind] [data-value]")),r(this,Bs,this.root.querySelector("[data-stat=pressure] [data-value]")),r(this,Ht,this.root.querySelector(".shroom-forecast-strip")),r(this,vt,this.root.querySelector(".shroom-forecast-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:weather-cloudy"),"card-icon"),C(t(this,wo),"weather",!0),r(this,Vs,Br(t(this,Ht))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),k(this.root)}destroy(){var e;(e=t(this,Vs))==null||e.call(this),r(this,Vs,null)}applyState(e,s){const o=e||"cloudy";t(this,Es)&&(t(this,Es).innerHTML=Vo(o,36));const n=this.i18n.t(`weather.${o}`)!==`weather.${o}`?this.i18n.t(`weather.${o}`):o.replace(/-/g," ");t(this,Ts)&&(t(this,Ts).textContent=w(n));const a=s.temperature??s.native_temperature;let l=String(s.temperature_unit||s.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(l&&!/^°/.test(l)&&l.length<=2&&(l=`°${l}`),t(this,Le)){const p=t(this,Le).querySelector(".shroom-weather-unit");t(this,Le).firstChild.textContent=a!=null?Math.round(Number(a)):"--",p&&(p.textContent=l)}if(t(this,qs)){const p=s.humidity;t(this,qs).textContent=p!=null?`${p}%`:"--"}if(t(this,Is)){const p=s.wind_speed,f=s.wind_speed_unit??"";t(this,Is).textContent=p!=null?`${p} ${f}`.trim():"--"}if(t(this,Bs)){const p=s.pressure,f=s.pressure_unit??"";t(this,Bs).textContent=p!=null?`${p} ${f}`.trim():"--"}const m=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;r(this,Ae,m?s.forecast_daily??s.forecast??null:null),r(this,Me,m?s.forecast_hourly??null:null),c(this,I,sr).call(this),c(this,I,or).call(this),this.announceState(`${this.def.friendly_name}, ${n}, ${a??"--"} ${l}`)}}wo=new WeakMap,Ts=new WeakMap,Es=new WeakMap,Le=new WeakMap,qs=new WeakMap,Is=new WeakMap,Bs=new WeakMap,Ht=new WeakMap,vt=new WeakMap,Vs=new WeakMap,I=new WeakSet,ke=function(){return this.config._forecastMode??"daily"},Io=function(e){this.config._forecastMode=e},Ae=new WeakMap,Me=new WeakMap,sr=function(){if(!t(this,vt))return;const e=Array.isArray(t(this,Ae))&&t(this,Ae).length>0,s=Array.isArray(t(this,Me))&&t(this,Me).length>0;if(!e&&!s){t(this,vt).textContent="";return}e&&!s&&r(this,I,"daily",Io),!e&&s&&r(this,I,"hourly",Io),e&&s?(t(this,vt).textContent=t(this,I,ke)==="daily"?"Hourly":"5-Day",t(this,vt).onclick=()=>{r(this,I,t(this,I,ke)==="daily"?"hourly":"daily",Io),c(this,I,sr).call(this),c(this,I,or).call(this)}):(t(this,vt).textContent="",t(this,vt).onclick=null)},or=function(){if(!t(this,Ht))return;const e=t(this,I,ke)==="hourly"?t(this,Me):t(this,Ae);if(t(this,Ht).setAttribute("data-mode",t(this,I,ke)),!Array.isArray(e)||e.length===0){t(this,Ht).innerHTML="";return}const s=t(this,I,ke)==="daily"?e.slice(0,5):e;t(this,Ht).innerHTML=s.map(o=>{const n=new Date(o.datetime);let a;t(this,I,ke)==="hourly"?a=n.toLocaleTimeString([],{hour:"numeric"}):a=ui[n.getDay()]??"";const l=(o.temperature??o.native_temperature)!=null?Math.round(o.temperature??o.native_temperature):"--",m=(o.templow??o.native_templow)!=null?Math.round(o.templow??o.native_templow):null;return`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${d(String(a))}</span>
            ${Vo(o.condition||"cloudy",18)}
            <span class="shroom-forecast-temps">
              ${d(String(l))}${m!=null?`/<span class="shroom-forecast-lo">${d(String(m))}</span>`:""}
            </span>
          </div>`}).join("")};const vi=`
    ${T}
    ${E}
  `;class gi extends v{constructor(){super(...arguments);i(this,_o,null);i(this,Os,null);i(this,Tt,!1);i(this,Ho,"unknown")}render(){H(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${vi}</style>
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
      `,r(this,_o,this.root.querySelector(".shroom-icon-shape")),r(this,Os,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"card-icon");const s=this.root.querySelector(".shroom-state-item");if(e){Et(s,`${this.def.friendly_name} - Lock/Unlock`);const o=()=>{const a=this.config.gestureConfig?.tap;if(a){this._runAction(a);return}this.config.card?.sendCommand(t(this,Tt)?"unlock":"lock",{})};this._attachGestureHandlers(s,{onTap:o});const n=this.root.querySelector("[part=row-toggle]");n&&this._attachGestureHandlers(n,{onTap:o})}this.renderCompanions(),k(this.root)}applyState(e,s){r(this,Ho,e),r(this,Tt,e==="locked");const o=e==="jammed";C(t(this,_o),"lock",t(this,Tt)),t(this,Os)&&(t(this,Os).textContent=w(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,Tt)));const a=this.root.querySelector("[part=row-toggle]");a&&(a.setAttribute("aria-pressed",String(t(this,Tt))),a.disabled=e==="unavailable"||e==="unknown");const l=this.root.querySelector("[part=row-state]");l&&(l.textContent=w(e));const m=o?"mdi:lock-alert":t(this,Tt)?"mdi:lock":"mdi:lock-open",p=this.def.icon_state_map?.[e]??this.def.icon??m;this.renderIcon(this.resolveIcon(p,m),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}_o=new WeakMap,Os=new WeakMap,Tt=new WeakMap,Ho=new WeakMap;const bi=`
    ${T}
    ${E}
  `;class pr extends v{constructor(){super(...arguments);i(this,Ps,null);i(this,Ds,null)}render(){H(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.run")!=="action.run"?this.i18n.t("action.run"):"Run";this.root.innerHTML=`
        <style>${bi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-run-btn" type="button" aria-label="${d(this.def.friendly_name)} - ${d(s)}">${d(s)}</button></span>`:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ps,this.root.querySelector(".shroom-icon-shape")),r(this,Ds,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),C(t(this,Ps),"script",!1);const o=this.root.querySelector(".shroom-state-item");if(e){const n=()=>{const l=this.config.gestureConfig?.tap;if(l){this._runAction(l);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})};Et(o,`${this.def.friendly_name} - ${s}`),this._attachGestureHandlers(o,{onTap:n});const a=this.root.querySelector("[part=row-run-btn]");a&&this._attachGestureHandlers(a,{onTap:n})}this.renderCompanions(),k(this.root)}applyState(e,s){const o=e==="on";C(t(this,Ps),"script",o),t(this,Ds)&&(t(this,Ds).textContent=o?this.i18n.t("state.running")!=="state.running"?this.i18n.t("state.running"):"Running":w(e));const n=this.root.querySelector("[part=row-run-btn]");n&&(n.disabled=e==="unavailable"||e==="unknown");const a=o?"mdi:script-text":"mdi:script-text-play",l=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(l,a),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ps=new WeakMap,Ds=new WeakMap,So(pr,"staleOnMount",!1);const yi=`
    ${T}
    ${E}
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
  `;class ur extends v{constructor(){super(...arguments);i(this,Ns,null);i(this,zs,null);i(this,nt,null)}render(){H(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.trigger")!=="action.trigger"?this.i18n.t("action.trigger"):"Trigger";this.root.innerHTML=`
        <style>${yi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?'<button part="enable-toggle" type="button"></button>':""}
          ${e?`<span part="row-control"><button part="row-trigger-btn" type="button" aria-label="${d(this.def.friendly_name)} - ${d(s)}">${d(s)}</button></span>`:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ns,this.root.querySelector(".shroom-icon-shape")),r(this,zs,this.root.querySelector(".shroom-secondary")),r(this,nt,this.root.querySelector("[part=enable-toggle]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),C(t(this,Ns),"automation",!1);const o=this.root.querySelector(".shroom-state-item");if(e){const n=()=>{const l=this.config.gestureConfig?.tap;if(l){this._runAction(l);return}this.config.card?.sendCommand("trigger",{})};Et(o,`${this.def.friendly_name} - ${s}`),this._attachGestureHandlers(o,{onTap:n});const a=this.root.querySelector("[part=row-trigger-btn]");a&&this._attachGestureHandlers(a,{onTap:n}),this._attachGestureHandlers(t(this,nt),{onTap:()=>{const l=t(this,nt)?.getAttribute("aria-pressed")==="true";this.config.card?.sendCommand(l?"turn_off":"turn_on",{})}})}this.renderCompanions(),k(this.root)}applyState(e,s){const o=e==="on";C(t(this,Ns),"automation",o),t(this,zs)&&(t(this,zs).textContent=o?this.i18n.t("state.on")!=="state.on"?this.i18n.t("state.on"):"Enabled":w(e)),t(this,nt)&&(t(this,nt).disabled=e==="unavailable"||e==="unknown",t(this,nt).textContent=o?"Enabled":"Disabled",t(this,nt).setAttribute("aria-pressed",String(o)),t(this,nt).setAttribute("aria-label",`${this.def.friendly_name} - ${o?"Disable":"Enable"}`));const n=this.root.querySelector("[part=row-trigger-btn]");n&&(n.disabled=e==="unavailable"||e==="unknown");const a=o?"mdi:robot":"mdi:robot-off",l=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(l,a),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}predictState(e,s){return e==="turn_on"?{state:"on",attributes:{}}:e==="turn_off"?{state:"off",attributes:{}}:null}}Ns=new WeakMap,zs=new WeakMap,nt=new WeakMap,So(ur,"staleOnMount",!1);const xi=`
    ${T}
    ${E}

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
  `;class Po extends v{constructor(){super(...arguments);i(this,Zs,null);i(this,Rs,null);i(this,Qt,null)}render(){H(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.press")!=="action.press"?this.i18n.t("action.press"):"Press";if(this.root.innerHTML=`
        <style>${xi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${d(this.def.friendly_name)}</span>
              ${e?`<button class="shroom-press-btn" part="press-button" type="button" aria-label="${d(this.def.friendly_name)}">${d(s)}</button>`:'<span class="shroom-secondary">-</span>'}
            </div>
          </div>
          ${e?`<span part="row-control"><button part="row-press-btn" type="button" aria-label="${d(this.def.friendly_name)} - ${d(s)}">${d(s)}</button></span>`:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Zs,this.root.querySelector(".shroom-icon-shape")),r(this,Rs,this.root.querySelector(".shroom-secondary")),r(this,Qt,this.root.querySelector(".shroom-press-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),C(t(this,Zs),"button",!1),e){const o=()=>{const a=this.config.gestureConfig?.tap;if(a){this._runAction(a);return}this.config.card?.sendCommand("press",{})};t(this,Qt)&&this._attachGestureHandlers(t(this,Qt),{onTap:o});const n=this.root.querySelector("[part=row-press-btn]");n&&this._attachGestureHandlers(n,{onTap:o})}this.renderCompanions(),k(this.root)}applyState(e,s){C(t(this,Zs),"button",!1);const o=e==="unavailable"||e==="unknown";t(this,Qt)&&(t(this,Qt).disabled=o),t(this,Rs)&&(t(this,Rs).textContent=o?w(e):this.formatStateLabel(e));const n=this.root.querySelector("[part=row-press-btn]");n&&(n.disabled=o);const a=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(a,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Zs=new WeakMap,Rs=new WeakMap,Qt=new WeakMap,So(Po,"staleOnMount",!1);const wi=`
    ${T}
    ${E}
  `;class Do extends v{constructor(){super(...arguments);i(this,js,null);i(this,Fs,null)}render(){H(this),this.root.innerHTML=`
        <style>${wi}</style>
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
      `,r(this,js,this.root.querySelector(".shroom-icon-shape")),r(this,Fs,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"card-icon"),C(t(this,js),"person",!1),this.renderCompanions(),k(this.root)}applyState(e,s){const o=e==="home";C(t(this,js),"person",o);const n=e==="not_home"?"Away":e==="home"?"Home":w(e);t(this,Fs)&&(t(this,Fs).textContent=n);const a=this.root.querySelector("[part=row-value]");a&&(a.textContent=n);const l=e==="not_home"?"mdi:account-off":"mdi:account",m=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(m,l),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}js=new WeakMap,Fs=new WeakMap,So(Do,"staleOnMount",!0);const _i=`
    ${T}
    ${E}
  `;class Ci extends v{constructor(){super(...arguments);i(this,Gs,null);i(this,Ws,null)}render(){H(this),this.root.innerHTML=`
        <style>${_i}</style>
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
      `,r(this,Gs,this.root.querySelector(".shroom-icon-shape")),r(this,Ws,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:eye"),"card-icon"),C(t(this,Gs),"event",!1),this.renderCompanions(),k(this.root)}applyState(e,s){C(t(this,Gs),"event",!1),t(this,Ws)&&(t(this,Ws).textContent=w(e));const o=this.root.querySelector("[part=row-value]");o&&(o.textContent=w(e));const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:eye";this.renderIcon(this.resolveIcon(n,"mdi:eye"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Gs=new WeakMap,Ws=new WeakMap;const Si=document.currentScript&&document.currentScript.dataset.rendererId||"shrooms";x._renderers=x._renderers||{},x._renderers[Si]={light:Dr,switch:ar,input_boolean:ar,lock:gi,sensor:Ao,"sensor.temperature":Ao,"sensor.humidity":Ao,"sensor.battery":Ao,fan:Gr,binary_sensor:Yr,generic:Kr,input_number:hr,input_select:lr,select:lr,cover:ti,remote:si,timer:ri,climate:ni,media_player:hi,weather:fi,script:pr,automation:ur,button:Po,input_button:Po,person:Do,device_tracker:Do,event:Ci,number:hr,badge:null}})();})();
