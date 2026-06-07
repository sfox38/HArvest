(()=>{var Ir=Object.defineProperty;var qr=(y,f,p)=>f in y?Ir(y,f,{enumerable:!0,configurable:!0,writable:!0,value:p}):y[f]=p;var yo=(y,f,p)=>(qr(y,typeof f!="symbol"?f+"":f,p),p),Ko=(y,f,p)=>{if(!f.has(y))throw TypeError("Cannot "+p)};var t=(y,f,p)=>(Ko(y,f,"read from private field"),p?p.call(y):f.get(y)),i=(y,f,p)=>{if(f.has(y))throw TypeError("Cannot add the same private member more than once");f instanceof WeakSet?f.add(y):f.set(y,p)},r=(y,f,p,rt)=>(Ko(y,f,"write to private field"),rt?rt.call(y,p):f.set(y,p),p);var c=(y,f,p)=>(Ko(y,f,"access private method"),p);(function(){"use strict";var Es,fe,yt,xt,Ot,E,Ts,_t,Dt,Pt,J,Nt,Zt,N,O,Ct,ve,zt,ge,Is,Xo,qs,Jo,$o,wi,Q,Rt,be,at,jt,Z,ye,wt,$t,Lt,D,$,Ft,St,At,W,xe,Bs,Wt,_e,Ro,Lo,$i,Vs,Qo,Os,ti,Ds,ei,Ce,jo,So,Li,Ps,we,Ns,$e,z,tt,Yt,Zs,Le,R,Se,et,ht,Ae,zs,Me,Ao,Si,Rs,si,Mo,Ai,js,He,I,k,Gt,Ut,lt,Ho,Mt,ke,dt,Kt,Ht,B,ko,Mi,Eo,Hi,Fs,oi,Ws,ii,kt,Ms,Ys,Ee,Y,Te,Ie,qe,Xt,Jt,Qt,ct,st,Gs,Us,Be,To,ki,Ks,ri,Io,Ei,Ve,Oe,De,Et,Tt,te,ee,se,Pe,Ne,G,Ze,qo,Ti,Bo,Ii,Vo,qi,oe,xo,Xs,ze,Re,je,Fe,We,Ye,Ge,Ue,Ke,Xe,T,Je,Qe,pt,ie,ot,V,mt,ut,ts,U,es,ss,os,Js,Qs,to,is,It,re,ne,ae,eo,so,Oo,Bi,oo,ni,io,ai,Do,Vi,Po,Oi,ro,hi,he,_o,No,Di,no,rs,le,ns,as,hs,qt,ao,ho,lo,ls,K,Bt,co,de,X,ft,vt,ds,po,li,Zo,Pi,mo,cs,ps,ce,ms,us,fs,gt,it,vs,P,ue,Fo,pe,me,uo,di,fo,ci,vo,gs,Vt,zo,bs,ys,xs,_s,Cs,ws,$s,Ls,Ss,As;const y=window.HArvest;if(!y||!y.renderers||!y.renderers.BaseCard){console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");return}const f=y.renderers.BaseCard,p=window.HArvest.esc;function rt(a,d){let e=null,s=null,o=null;function n(...h){s=this,o=h,e&&clearTimeout(e),e=setTimeout(()=>{e=null,a.apply(s,o),o=null},d)}return n.flush=function(){e!==null&&(clearTimeout(e),e=null,o&&(a.apply(s,o),o=null))},n}function w(a){return a?a.charAt(0).toUpperCase()+a.slice(1).replace(/_/g," "):""}function Br(a,d,e){return Math.min(e,Math.max(d,a))}function pi(a,d){const e=a.querySelector(".shroom-controls-shell");e&&e.setAttribute("data-collapsed",String(d))}function nt(a,d){a&&(a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-label",d),a.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),a.click())}))}function L(a){a.querySelectorAll("[part=companion]").forEach(d=>{d.title=d.getAttribute("aria-label")??"Companion"})}const Ni={light:"var(--hrv-ex-shroom-light, #ff9800)",switch:"var(--hrv-ex-shroom-switch, #2196f3)",input_boolean:"var(--hrv-ex-shroom-switch, #2196f3)",lock:"var(--hrv-ex-shroom-lock, #2196f3)",fan:"var(--hrv-ex-shroom-fan, #4caf50)",climate:"var(--hrv-ex-shroom-climate, #ff5722)",cover:"var(--hrv-ex-shroom-cover, #9c27b0)",media_player:"var(--hrv-ex-shroom-media, #e91e63)",sensor:"var(--hrv-ex-shroom-sensor, #03a9f4)",binary_sensor:"var(--hrv-ex-shroom-binary, #8bc34a)",input_number:"var(--hrv-ex-shroom-input, #00bcd4)",input_select:"var(--hrv-ex-shroom-input, #00bcd4)",timer:"var(--hrv-ex-shroom-timer, #673ab7)",remote:"var(--hrv-ex-shroom-remote, #607d8b)",weather:"var(--hrv-ex-shroom-weather, #ff9800)"};function mi(a){return Ni[a]??"var(--hrv-color-primary, #ff9800)"}function _(a,d,e){if(!a)return;const s=mi(d);e?(a.style.background=`color-mix(in srgb, ${s} 20%, transparent)`,a.style.color=s):(a.style.background="var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))",a.style.color="var(--hrv-color-icon, #757575)")}function S(a){const d=(a.config.displayHints??a.def.display_hints??{}).layout??null,e=a.root.host;e&&(d==="vertical"?e.setAttribute("data-layout","vertical"):e.removeAttribute("data-layout"))}function Zi(a){if(!a)return()=>{};const d=80,e=1.6,s=.96,o=.04;let n=null,h=0,l=0,m=0,u=!1,C=0;const b=[],v=()=>{C&&(cancelAnimationFrame(C),C=0)},q=g=>{for(;b.length&&b[0].t<g-d;)b.shift();if(b.length<2)return 0;const H=b[0],F=b[b.length-1],bo=F.t-H.t;return bo<=0?0:(F.x-H.x)/bo},j=()=>{if(Math.abs(m)<o)return;let g=performance.now();const H=F=>{const bo=F-g;if(g=F,a.scrollLeft-=m*bo,m*=Math.pow(s,bo/16),Math.abs(m)<o){C=0,m=0;return}const Tr=a.scrollWidth-a.clientWidth;if(a.scrollLeft<=0||a.scrollLeft>=Tr){C=0,m=0;return}C=requestAnimationFrame(H)};C=requestAnimationFrame(H)},go=g=>{if(a.scrollWidth<=a.clientWidth||g.pointerType==="touch")return;const H=g.target;if(!(H&&H!==a&&H.closest?.("button, a"))){v(),n=g.pointerId,h=g.clientX,l=a.scrollLeft,m=0,u=!1,b.length=0,b.push({x:g.clientX,t:g.timeStamp});try{a.setPointerCapture(n)}catch{}}},Uo=g=>{if(g.pointerId!==n)return;const H=g.clientX-h;Math.abs(H)>4&&(u=!0,a.dataset.dragging="true"),a.scrollLeft=l-H,b.push({x:g.clientX,t:g.timeStamp});const F=g.timeStamp-d;for(;b.length>2&&b[0].t<F;)b.shift()},x=g=>{if(g.pointerId===n){try{a.releasePointerCapture(n)}catch{}if(n=null,u){const H=F=>{F.stopPropagation(),F.preventDefault()};window.addEventListener("click",H,{capture:!0,once:!0}),requestAnimationFrame(()=>a.removeAttribute("data-dragging")),m=q(g.timeStamp)*e,j()}b.length=0}};return a.addEventListener("pointerdown",go),a.addEventListener("pointermove",Uo),a.addEventListener("pointerup",x),a.addEventListener("pointercancel",x),a.addEventListener("wheel",v,{passive:!0}),a.addEventListener("touchstart",v,{passive:!0}),()=>{v(),a.removeEventListener("pointerdown",go),a.removeEventListener("pointermove",Uo),a.removeEventListener("pointerup",x),a.removeEventListener("pointercancel",x),a.removeEventListener("wheel",v),a.removeEventListener("touchstart",v)}}function ui(a,d){if(a!=="on")return null;if(d.rgb_color){const[s,o,n]=d.rgb_color;return(.299*s+.587*o+.114*n)/255>.85?`rgb(${Math.round(s*.8)}, ${Math.round(o*.8)}, ${Math.round(n*.75)})`:`rgb(${s}, ${o}, ${n})`}if(d.hs_color)return`hsl(${d.hs_color[0]}, ${Math.max(d.hs_color[1],50)}%, 55%)`;const e=d.color_temp_kelvin??(d.color_temp?Math.round(1e6/d.color_temp):null);return e?e>=5200?"#4ba3e0":e>=4500?"#e0c85a":e<=3e3?"#e6a040":"#ddb840":null}const A=`
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
  `,Wo=`
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
  `,Hs=`
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
  `,bt=`
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
  `,M=`
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
  `,zi=`
    ${A}
    ${M}
  `;class fi extends f{constructor(){super(...arguments);i(this,Es,null);i(this,fe,null);i(this,yt,!1)}render(){S(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${zi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Es,this.root.querySelector(".shroom-icon-shape")),r(this,fe,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline"),"card-icon");const s=this.root.querySelector(".shroom-state-item");e&&(nt(s,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(s,{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand("toggle",{})}})),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,yt,e==="on");const o=this.def.domain??"switch";_(t(this,Es),o,t(this,yt)),t(this,fe)&&(t(this,fe).textContent=w(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,yt)));const h=t(this,yt)?this.resolveIcon(this.def.icon,"mdi:toggle-switch"):this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="toggle"||e==="turn_on"||e==="turn_off"?{state:e==="toggle"?t(this,yt)?"off":"on":e==="turn_on"?"on":"off",attributes:{}}:null}}Es=new WeakMap,fe=new WeakMap,yt=new WeakMap;const ks=["brightness","temp","color"],Ri={brightness:"mdi:brightness-4",temp:"mdi:thermometer",color:"mdi:palette"},ji=`
    ${A}
    ${Wo}
    ${Hs}
    ${bt}
    ${M}

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
  `;class Fi extends f{constructor(e,s,o,n){super(e,s,o,n);i(this,Is);i(this,qs);i(this,$o);i(this,xt,null);i(this,Ot,null);i(this,E,null);i(this,Ts,null);i(this,_t,null);i(this,Dt,null);i(this,Pt,[]);i(this,J,0);i(this,Nt,4e3);i(this,Zt,0);i(this,N,!1);i(this,O,0);i(this,Ct,2e3);i(this,ve,6500);i(this,zt,{});i(this,ge,void 0);r(this,ge,rt(c(this,$o,wi).bind(this),300))}render(){S(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??{},n=o.show_brightness!==!1&&s.includes("brightness"),h=o.show_color_temp!==!1&&s.includes("color_temp"),l=o.show_rgb!==!1&&s.includes("rgb_color"),m=e&&(n||h||l),u=[n,h,l].filter(Boolean).length;r(this,Ct,this.def.feature_config?.min_color_temp_kelvin??2e3),r(this,ve,this.def.feature_config?.max_color_temp_kelvin??6500);const C=[n,h,l];C[t(this,O)]||(r(this,O,C.findIndex(Boolean)),t(this,O)===-1&&r(this,O,0)),this.root.innerHTML=`
        <style>${ji}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${m?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-light-controls-row">
                <div class="shroom-slider-wrap shroom-light-slider-wrap">
                  <div class="shroom-slider-bg shroom-brightness-bg"></div>
                  <div class="shroom-slider-cover" style="left:0%"></div>
                  <div class="shroom-slider-edge" style="left:0%;display:none"></div>
                  <input type="range" class="shroom-slider-input" min="0" max="100"
                    step="1" value="0"
                    aria-label="${p(this.def.friendly_name)} level"
                    aria-valuetext="0%">
                  <div class="shroom-slider-focus-ring"></div>
                </div>
                ${u>1?`
                  <div class="shroom-light-mode-btns">
                    ${n?'<button class="shroom-light-mode-btn" data-mode="brightness" type="button" aria-label="Brightness"><span part="light-mode-brightness"></span></button>':""}
                    ${h?'<button class="shroom-light-mode-btn" data-mode="temp" type="button" aria-label="Color temperature"><span part="light-mode-temp"></span></button>':""}
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
      `,r(this,xt,this.root.querySelector(".shroom-icon-shape")),r(this,Ot,this.root.querySelector(".shroom-secondary")),r(this,E,this.root.querySelector(".shroom-slider-input")),r(this,Ts,this.root.querySelector(".shroom-slider-bg")),r(this,_t,this.root.querySelector(".shroom-slider-cover")),r(this,Dt,this.root.querySelector(".shroom-slider-edge")),r(this,Pt,[...this.root.querySelectorAll(".shroom-light-mode-btn")]),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon");for(const v of t(this,Pt))this.renderIcon(Ri[v.dataset.mode]??"mdi:help-circle",`light-mode-${v.dataset.mode}`);const b=this.root.querySelector(".shroom-state-item");e&&(nt(b,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(b,{onTap:()=>{const v=this.config.gestureConfig?.tap;if(v){this._runAction(v);return}this.config.card?.sendCommand("toggle",{})}}));for(const v of t(this,Pt))v.addEventListener("click",()=>{const q=v.dataset.mode,j=ks.indexOf(q);j===-1||j===t(this,O)||(r(this,O,j),c(this,Is,Xo).call(this))});t(this,E)&&(t(this,E).addEventListener("input",()=>{const v=parseInt(t(this,E).value,10),q=ks[t(this,O)]??"brightness";q==="brightness"?r(this,J,v):q==="temp"?r(this,Nt,Math.round(t(this,Ct)+v/100*(t(this,ve)-t(this,Ct)))):r(this,Zt,Math.round(v*3.6)),c(this,qs,Jo).call(this),t(this,ge).call(this,q)}),this.guardSlider(t(this,E),t(this,ge))),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,N,e==="on"),r(this,zt,s),pi(this.root,!t(this,N));const o=ui(e,s);t(this,N)&&o?t(this,xt)&&(t(this,xt).style.background=`color-mix(in srgb, ${o} 20%, transparent)`,t(this,xt).style.color=o):_(t(this,xt),"light",t(this,N)),r(this,J,s.brightness!=null?Math.round(s.brightness/255*100):0),r(this,Nt,s.color_temp_kelvin??(s.color_temp?Math.round(1e6/s.color_temp):4e3)),r(this,Zt,s.hs_color?.[0]??42),t(this,Ot)&&(t(this,N)&&s.brightness!=null?t(this,Ot).textContent=`${t(this,J)}%`:t(this,Ot).textContent=w(e));const n=this.root.querySelector(".shroom-slider-wrap");if(n){const m=ui("on",s);n.style.setProperty("--shroom-light-accent",m??"var(--hrv-ex-shroom-light, #ff9800)")}c(this,Is,Xo).call(this);const h=this.root.querySelector(".shroom-state-item");if(h?.hasAttribute("role")&&h.setAttribute("aria-pressed",String(t(this,N))),t(this,E)){const m=ks[t(this,O)]??"brightness",u=parseInt(t(this,E).value,10);m==="brightness"?t(this,E).setAttribute("aria-valuetext",`${u}%`):m==="temp"?t(this,E).setAttribute("aria-valuetext",`${u}K`):t(this,E).setAttribute("aria-valuetext",`${u}`)}const l=t(this,N)?this.resolveIcon(this.def.icon,"mdi:lightbulb"):this.resolveIcon(this.def.icon,"mdi:lightbulb-off");this.renderIcon(l,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}${t(this,N)?`, ${t(this,J)}%`:""}`)}predictState(e,s){if(e==="toggle")return{state:t(this,N)?"off":"on",attributes:t(this,zt)};if(e==="turn_on"){const o={...t(this,zt)};return s.brightness!=null&&(o.brightness=s.brightness),s.color_temp_kelvin!=null&&(o.color_temp_kelvin=s.color_temp_kelvin),s.hs_color!=null&&(o.hs_color=s.hs_color),{state:"on",attributes:o}}return e==="turn_off"?{state:"off",attributes:t(this,zt)}:null}}xt=new WeakMap,Ot=new WeakMap,E=new WeakMap,Ts=new WeakMap,_t=new WeakMap,Dt=new WeakMap,Pt=new WeakMap,J=new WeakMap,Nt=new WeakMap,Zt=new WeakMap,N=new WeakMap,O=new WeakMap,Ct=new WeakMap,ve=new WeakMap,zt=new WeakMap,ge=new WeakMap,Is=new WeakSet,Xo=function(){const e=ks[t(this,O)]??"brightness",s=t(this,Ts);s?.classList.remove("shroom-brightness-bg","shroom-ct-bg","shroom-hue-bg"),e==="brightness"?s?.classList.add("shroom-brightness-bg"):e==="temp"?s?.classList.add("shroom-ct-bg"):s?.classList.add("shroom-hue-bg");for(const o of t(this,Pt))o.hidden=o.dataset.mode===e;c(this,qs,Jo).call(this)},qs=new WeakSet,Jo=function(){const e=ks[t(this,O)]??"brightness";let s=0;e==="brightness"?s=t(this,J):e==="temp"?s=Math.round((t(this,Nt)-t(this,Ct))/(t(this,ve)-t(this,Ct))*100):s=Math.round(t(this,Zt)/3.6);const o=e==="brightness";t(this,_t)&&(o?(t(this,_t).style.display="",t(this,_t).style.left=`${s}%`):t(this,_t).style.display="none"),t(this,Dt)&&(t(this,Dt).style.display=o?"none":"",o||(t(this,Dt).style.left=`${s}%`)),t(this,E)&&!this.isSliderActive(t(this,E))&&(t(this,E).value=String(s))},$o=new WeakSet,wi=function(e){e==="brightness"?t(this,J)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:Math.round(t(this,J)*2.55)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,Nt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,Zt),100]})};const Wi={temperature:"var(--hrv-ex-shroom-climate, #ff5722)",humidity:"var(--hrv-ex-shroom-sensor, #03a9f4)",battery:"var(--hrv-ex-shroom-fan, #4caf50)"},Yi={temperature:"mdi:thermometer",humidity:"mdi:water-percent",battery:"mdi:battery"};function Gi(a){return a==null||isNaN(a)||a>=90?"mdi:battery":a>=70?"mdi:battery-70":a>=50?"mdi:battery-50":a>=30?"mdi:battery-30":a>=10?"mdi:battery-10":"mdi:battery-alert"}function Ui(a){return a==null||isNaN(a)?"var(--hrv-ex-shroom-fan, #4caf50)":a<=10?"var(--hrv-color-error, #f44336)":a<=20?"var(--hrv-color-warning, #ff9800)":"var(--hrv-ex-shroom-fan, #4caf50)"}const Ki=`
    ${A}
    ${M}
  `;class Co extends f{constructor(){super(...arguments);i(this,Q,null);i(this,Rt,null);i(this,be,null)}render(){S(this),r(this,be,this.def.device_class??null);const e=Yi[t(this,be)]??"mdi:gauge";this.root.innerHTML=`
        <style>${Ki}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Q,this.root.querySelector(".shroom-icon-shape")),r(this,Rt,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,e),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){const o=parseFloat(e),n=this.def.unit_of_measurement??"",h=!isNaN(o),l=t(this,be);if(t(this,Rt))if(h){const m=s.suggested_display_precision,u=m!=null?o.toFixed(m):String(Math.round(o*10)/10);t(this,Rt).textContent=n?`${u} ${n}`:u}else t(this,Rt).textContent=w(e);if(l==="battery"&&h){const m=Ui(o);t(this,Q)&&(t(this,Q).style.background=`color-mix(in srgb, ${m} 20%, transparent)`,t(this,Q).style.color=m),this.renderIcon(this.resolveIcon(this.def.icon,Gi(o)),"card-icon")}else{const m=Wi[l]??mi("sensor");t(this,Q)&&(t(this,Q).style.background=`color-mix(in srgb, ${m} 20%, transparent)`,t(this,Q).style.color=m)}this.announceState(`${this.def.friendly_name}, ${h?o:e} ${n}`)}}Q=new WeakMap,Rt=new WeakMap,be=new WeakMap;const Xi=`
    ${A}
    ${Wo}
    ${Hs}
    ${bt}
    ${M}

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
  `;class Ji extends f{constructor(e,s,o,n){super(e,s,o,n);i(this,_e);i(this,Lo);i(this,Vs);i(this,Os);i(this,Ds);i(this,Ce);i(this,So);i(this,at,null);i(this,jt,null);i(this,Z,null);i(this,ye,null);i(this,wt,null);i(this,$t,null);i(this,Lt,null);i(this,D,!1);i(this,$,0);i(this,Ft,!1);i(this,St,"forward");i(this,At,null);i(this,W,[]);i(this,xe,void 0);i(this,Bs,!1);i(this,Wt,!1);r(this,xe,rt(c(this,So,Li).bind(this),300)),r(this,W,e.feature_config?.preset_modes??[])}render(){S(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??this.def.display_hints??{},n=o.display_mode??null;let h=s.includes("set_speed");const l=o.show_oscillate!==!1&&s.includes("oscillate"),m=o.show_direction!==!1&&s.includes("direction"),u=o.show_presets!==!1&&s.includes("preset_mode");n==="on-off"&&(h=!1);let C=e&&h,b=C&&t(this,Lo,$i),v=!1,q=!1;n==="continuous"?b=!1:n==="stepped"?q=b:n==="cycle"?(b=!0,v=!0):b&&t(this,W).length?v=!0:b&&(q=!0),r(this,Bs,v);const j=e&&(l||m||u);this.root.innerHTML=`
        <style>${Xi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${C||j?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${C&&!b?`
                  <div class="shroom-fan-speed-row">
                    <div class="shroom-slider-wrap">
                      <div class="shroom-slider-bg shroom-fan-slider-bg"></div>
                      <div class="shroom-slider-cover" style="left:0%"></div>
                      <input type="range" class="shroom-slider-input" min="0" max="100"
                        step="1" value="0"
                        aria-label="${p(this.def.friendly_name)} speed"
                        aria-valuetext="0%">
                      <div class="shroom-slider-focus-ring"></div>
                    </div>
                  </div>
                `:""}
                ${C&&q?`
                  <div class="shroom-fan-step-dots">
                    ${t(this,Vs,Qo).map((x,g)=>`
                      <button class="shroom-fan-step-dot" data-pct="${x}" type="button"
                        data-active="false"
                        aria-label="Speed ${g+1} (${x}%)"
                        title="Speed ${g+1} (${x}%)">${g+1}</button>
                    `).join("")}
                  </div>
                `:""}
                ${C&&v?`
                  <div style="display:flex;justify-content:center;">
                    <button class="shroom-fan-cycle-btn" type="button"
                      title="Cycle speed"
                      aria-label="Cycle fan speed">
                      <svg viewBox="0 0 24 24"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg>
                    </button>
                  </div>
                `:""}
                ${j?`
                  <div class="shroom-fan-feat-row">
                    ${l?'<button class="shroom-btn shroom-fan-feat" data-feat="oscillate" type="button" aria-label="Oscillate" aria-pressed="false">Oscillate</button>':""}
                    ${m?'<button class="shroom-btn shroom-fan-feat" data-feat="direction" type="button" aria-label="Direction: forward">Forward</button>':""}
                    ${u?'<button class="shroom-btn shroom-fan-feat" data-feat="preset" type="button" aria-label="Preset">Preset</button>':""}
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
      `,r(this,at,this.root.querySelector(".shroom-icon-shape")),r(this,jt,this.root.querySelector(".shroom-secondary")),r(this,Z,this.root.querySelector(".shroom-slider-input")),r(this,ye,this.root.querySelector(".shroom-slider-cover")),r(this,wt,this.root.querySelector('[data-feat="oscillate"]')),r(this,$t,this.root.querySelector('[data-feat="direction"]')),r(this,Lt,this.root.querySelector('[data-feat="preset"]')),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"card-icon");const go=this.root.querySelector(".shroom-state-item");e&&(nt(go,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(go,{onTap:()=>{const x=this.config.gestureConfig?.tap;if(x){this._runAction(x);return}this.config.card?.sendCommand("toggle",{})}})),t(this,Z)&&(t(this,Z).addEventListener("input",()=>{const x=Number(t(this,Z).value);r(this,$,x),t(this,Z).setAttribute("aria-valuetext",`${Math.round(x)}%`),c(this,Os,ti).call(this),t(this,xe).call(this)}),this.guardSlider(t(this,Z),t(this,xe))),this.root.querySelectorAll(".shroom-fan-step-dot").forEach(x=>{x.addEventListener("click",()=>{const g=Number(x.getAttribute("data-pct"));r(this,$,g),r(this,D,!0),c(this,Ds,ei).call(this),this.config.card?.sendCommand("set_percentage",{percentage:g})})}),this.root.querySelector(".shroom-fan-cycle-btn")?.addEventListener("click",()=>{const x=t(this,Vs,Qo);if(!x.length)return;let g;if(!t(this,D)||t(this,$)===0)g=x[0];else{const H=x.findIndex(F=>F>t(this,$));g=H===-1?x[0]:x[H]}r(this,$,g),r(this,D,!0),this.config.card?.sendCommand("set_percentage",{percentage:g})}),t(this,wt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,Ft)})}),t(this,$t)?.addEventListener("click",()=>{const x=t(this,St)==="forward"?"reverse":"forward";r(this,St,x),c(this,Ce,jo).call(this),this.config.card?.sendCommand("set_direction",{direction:x})}),t(this,Lt)?.addEventListener("click",()=>{if(!t(this,W).length)return;const g=((t(this,At)?t(this,W).indexOf(t(this,At)):-1)+1)%t(this,W).length,H=t(this,W)[g];r(this,At,H),c(this,Ce,jo).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:H})}),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,D,e==="on"),r(this,$,s?.percentage??0),r(this,Ft,s?.oscillating??!1),r(this,St,s?.direction??"forward"),r(this,At,s?.preset_mode??null),s?.preset_modes?.length&&r(this,W,s.preset_modes),r(this,Wt,t(this,Bs)||s?.assumed_state===!0),pi(this.root,!t(this,D)),_(t(this,at),"fan",t(this,D));const o=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??"mdi:fan";if(this.renderIcon(this.resolveIcon(o,"mdi:fan"),"card-icon"),t(this,at))if(t(this,D)&&t(this,$)>0&&!t(this,Wt)&&this.config.animate!==!1){const h=1/(1.5*Math.pow(t(this,$)/100,.5));t(this,at).setAttribute("data-spinning","true"),t(this,at).style.setProperty("--shroom-fan-duration",`${h.toFixed(2)}s`)}else t(this,at).setAttribute("data-spinning","false");t(this,jt)&&(t(this,D)&&t(this,$)>0&&!t(this,Wt)?t(this,jt).textContent=`${Math.round(t(this,$))}%`:t(this,jt).textContent=w(e)),c(this,Os,ti).call(this),c(this,Ds,ei).call(this),c(this,Ce,jo).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,$)>0&&!t(this,Wt)?`, ${Math.round(t(this,$))}%`:""))}predictState(e,s){return e==="toggle"?{state:t(this,D)?"off":"on",attributes:{percentage:t(this,$)}}:e==="set_percentage"?{state:"on",attributes:{percentage:s.percentage,oscillating:t(this,Ft),direction:t(this,St),preset_mode:t(this,At),preset_modes:t(this,W)}}:e==="oscillate"?{state:"on",attributes:{percentage:t(this,$),oscillating:s.oscillating,direction:t(this,St)}}:e==="set_direction"?{state:"on",attributes:{percentage:t(this,$),oscillating:t(this,Ft),direction:s.direction}}:null}}at=new WeakMap,jt=new WeakMap,Z=new WeakMap,ye=new WeakMap,wt=new WeakMap,$t=new WeakMap,Lt=new WeakMap,D=new WeakMap,$=new WeakMap,Ft=new WeakMap,St=new WeakMap,At=new WeakMap,W=new WeakMap,xe=new WeakMap,Bs=new WeakMap,Wt=new WeakMap,_e=new WeakSet,Ro=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},Lo=new WeakSet,$i=function(){return t(this,_e,Ro)>1},Vs=new WeakSet,Qo=function(){const e=t(this,_e,Ro),s=[];for(let o=1;o*e<=100.001;o++)s.push(o*e);return s},Os=new WeakSet,ti=function(){if(!t(this,Z))return;const e=t(this,$);this.isSliderActive(t(this,Z))||(t(this,Z).value=String(e)),t(this,ye)&&(t(this,ye).style.left=`${e}%`)},Ds=new WeakSet,ei=function(){const e=t(this,_e,Ro)/2;this.root.querySelectorAll(".shroom-fan-step-dot").forEach(s=>{const o=Number(s.getAttribute("data-pct"));s.setAttribute("data-active",String(t(this,D)&&t(this,$)>=o-e))})},Ce=new WeakSet,jo=function(){t(this,wt)&&(t(this,wt).setAttribute("aria-pressed","false"),t(this,wt).textContent="Oscillate"),t(this,$t)&&(t(this,$t).textContent="Direction",t(this,$t).setAttribute("aria-label","Direction")),t(this,Lt)&&(t(this,Lt).textContent="Preset",t(this,Lt).setAttribute("data-active","false"))},So=new WeakSet,Li=function(){t(this,$)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,$)})};const Qi=`
    ${A}
    ${M}
  `;class tr extends f{constructor(){super(...arguments);i(this,Ps,null);i(this,we,null)}render(){S(this),this.root.innerHTML=`
        <style>${Qi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ps,this.root.querySelector(".shroom-icon-shape")),r(this,we,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){const o=e==="on";_(t(this,Ps),"binary_sensor",o);const n=this.formatStateLabel(e);t(this,we)&&(t(this,we).textContent=n);const h=o?"mdi:radiobox-marked":"mdi:radiobox-blank",l=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(l,h),"card-icon"),this.announceState(`${this.def.friendly_name}, ${n}`)}}Ps=new WeakMap,we=new WeakMap;const er=`
    ${A}
    ${M}

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
  `;class sr extends f{constructor(){super(...arguments);i(this,Ns,null);i(this,$e,null);i(this,z,null);i(this,tt,!1);i(this,Yt,!1)}render(){S(this);const e=this.def.capabilities==="read-write";r(this,Yt,!1),this.root.innerHTML=`
        <style>${er}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <button class="shroom-generic-toggle" type="button" data-on="false"
              title="Toggle" aria-label="${p(this.def.friendly_name)} - Toggle"
              hidden>Toggle</button>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ns,this.root.querySelector(".shroom-icon-shape")),r(this,$e,this.root.querySelector(".shroom-secondary")),r(this,z,this.root.querySelector(".shroom-generic-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:help-circle"),"card-icon"),t(this,z)&&e&&this._attachGestureHandlers(t(this,z),{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),L(this.root)}applyState(e,s){const o=e==="on"||e==="off";r(this,tt,e==="on"),t(this,$e)&&(t(this,$e).textContent=w(e));const n=this.def.domain??"generic";_(t(this,Ns),n,t(this,tt)),t(this,z)&&(o&&!t(this,Yt)&&(t(this,z).removeAttribute("hidden"),r(this,Yt,!0)),t(this,Yt)&&(t(this,z).setAttribute("data-on",String(t(this,tt))),t(this,z).setAttribute("aria-pressed",String(t(this,tt))),t(this,z).textContent=t(this,tt)?"On":"Off",t(this,z).title=t(this,tt)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e!=="toggle"?null:{state:t(this,tt)?"off":"on",attributes:{}}}}Ns=new WeakMap,$e=new WeakMap,z=new WeakMap,tt=new WeakMap,Yt=new WeakMap;const or=`
    ${A}
    ${Wo}
    ${Hs}
    ${bt}
    ${M}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }
  `;class ir extends f{constructor(e,s,o,n){super(e,s,o,n);i(this,Ao);i(this,Rs);i(this,Mo);i(this,Zs,null);i(this,Le,null);i(this,R,null);i(this,Se,null);i(this,et,0);i(this,ht,0);i(this,Ae,100);i(this,zs,1);i(this,Me,void 0);r(this,Me,rt(c(this,Mo,Ai).bind(this),300))}render(){S(this);const e=this.def.capabilities==="read-write";if(r(this,ht,this.def.feature_config?.min??0),r(this,Ae,this.def.feature_config?.max??100),r(this,zs,this.def.feature_config?.step??1),this.root.innerHTML=`
        <style>${or}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-controls-shell" data-collapsed="false">
              <div class="shroom-slider-wrap">
                <div class="shroom-slider-bg shroom-num-slider-bg"></div>
                <div class="shroom-slider-cover" style="left:0%"></div>
                <input type="range" class="shroom-slider-input"
                  min="${t(this,ht)}" max="${t(this,Ae)}" step="${t(this,zs)}" value="${t(this,ht)}"
                  aria-label="${p(this.def.friendly_name)} value"
                  aria-valuetext="${t(this,ht)}${this.def.unit_of_measurement?` ${p(this.def.unit_of_measurement)}`:""}">
                <div class="shroom-slider-focus-ring"></div>
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Zs,this.root.querySelector(".shroom-icon-shape")),r(this,Le,this.root.querySelector(".shroom-secondary")),r(this,R,this.root.querySelector(".shroom-slider-input")),r(this,Se,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:ray-vertex"),"card-icon"),_(t(this,Zs),"input_number",!0),t(this,R)){const s=this.def.unit_of_measurement??"";t(this,R).addEventListener("input",()=>{r(this,et,parseFloat(t(this,R).value)),t(this,R).setAttribute("aria-valuetext",`${t(this,et)}${s?` ${s}`:""}`),c(this,Rs,si).call(this),t(this,Me).call(this)}),this.guardSlider(t(this,R),t(this,Me))}this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){const o=parseFloat(e);if(isNaN(o))return;r(this,et,o),c(this,Rs,si).call(this);const n=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${o}${n?` ${n}`:""}`)}predictState(e,s){return e==="set_value"&&s.value!==void 0?{state:String(s.value),attributes:{}}:null}}Zs=new WeakMap,Le=new WeakMap,R=new WeakMap,Se=new WeakMap,et=new WeakMap,ht=new WeakMap,Ae=new WeakMap,zs=new WeakMap,Me=new WeakMap,Ao=new WeakSet,Si=function(e){const s=t(this,Ae)-t(this,ht);return s===0?0:Math.max(0,Math.min(100,(e-t(this,ht))/s*100))},Rs=new WeakSet,si=function(){const e=c(this,Ao,Si).call(this,t(this,et));t(this,Se)&&(t(this,Se).style.left=`${e}%`),t(this,R)&&!this.isSliderActive(t(this,R))&&(t(this,R).value=String(t(this,et)));const s=this.def.unit_of_measurement??"";t(this,Le)&&(t(this,Le).textContent=`${t(this,et)}${s?` ${s}`:""}`)},Mo=new WeakSet,Ai=function(){this.config.card?.sendCommand("set_value",{value:t(this,et)})};const rr=`
    ${A}
    ${bt}
    ${M}

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
  `;class vi extends f{constructor(){super(...arguments);i(this,ko);i(this,Eo);i(this,Fs);i(this,Ws);i(this,kt);i(this,js,null);i(this,He,null);i(this,I,null);i(this,k,null);i(this,Gt,null);i(this,Ut,[]);i(this,lt,[]);i(this,Ho,"");i(this,Mt,[]);i(this,ke,"");i(this,dt,!1);i(this,Kt,"pills");i(this,Ht,null);i(this,B,null)}render(){S(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";r(this,Kt,s==="dropdown"?"dropdown":"pills"),r(this,Mt,this.def.feature_config?.options??[]);const o=e?t(this,Kt)==="dropdown"?`
            <div class="shroom-select-shell">
              <button class="shroom-select-current" type="button"
                aria-label="${p(this.def.friendly_name)}"
                aria-haspopup="listbox" aria-expanded="false">
                <span class="shroom-select-label">-</span>
                <span class="shroom-select-arrow" aria-hidden="true">&#9660;</span>
              </button>
              <div class="shroom-select-dropdown" role="listbox" popover="manual"></div>
            </div>`:`
            <div class="shroom-select-shell">
              <div class="shroom-select-grid"></div>
            </div>`:"";this.root.innerHTML=`
        <style>${rr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${o}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,js,this.root.querySelector(".shroom-icon-shape")),r(this,He,this.root.querySelector(".shroom-secondary")),r(this,I,this.root.querySelector(".shroom-select-current")),r(this,k,this.root.querySelector(".shroom-select-dropdown")),r(this,Gt,this.root.querySelector(".shroom-select-grid")),r(this,Ut,[]),r(this,lt,[]),r(this,ke,""),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:form-select"),"card-icon"),_(t(this,js),"input_select",!0),t(this,I)&&e&&(t(this,I).addEventListener("click",n=>{n.stopPropagation(),t(this,dt)?c(this,kt,Ms).call(this):c(this,Ws,ii).call(this)}),t(this,I).addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" "||n.key==="ArrowDown")&&!t(this,dt)?(n.preventDefault(),c(this,Ws,ii).call(this),t(this,lt)[0]?.focus()):n.key==="Escape"&&t(this,dt)&&(c(this,kt,Ms).call(this),t(this,I).focus())}),r(this,Ht,n=>{t(this,dt)&&!this.root.host.contains(n.target)&&c(this,kt,Ms).call(this)}),document.addEventListener("click",t(this,Ht))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,Ho,e);const o=s?.options,n=Array.isArray(o)&&o.length?o:t(this,Mt);r(this,Mt,n),t(this,He)&&(t(this,He).textContent=e);const h=n.join("|");if(h!==t(this,ke)&&(r(this,ke,h),t(this,Kt)==="dropdown"?c(this,Eo,Hi).call(this,n):c(this,ko,Mi).call(this,n)),t(this,Kt)==="dropdown"){const l=this.root.querySelector(".shroom-select-label");l&&(l.textContent=e);for(const m of t(this,lt)){const u=m.dataset.option===e;m.setAttribute("data-active",String(u)),m.setAttribute("aria-selected",String(u))}}else for(const l of t(this,Ut))l.setAttribute("data-active",String(l.dataset.option===e));this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="select_option"&&s.option!==void 0?{state:String(s.option),attributes:{options:t(this,Mt)}}:null}destroy(){t(this,Ht)&&(document.removeEventListener("click",t(this,Ht)),r(this,Ht,null)),t(this,B)&&(window.removeEventListener("scroll",t(this,B),!0),window.removeEventListener("resize",t(this,B)),r(this,B,null));try{t(this,k)?.hidePopover?.()}catch{}}}js=new WeakMap,He=new WeakMap,I=new WeakMap,k=new WeakMap,Gt=new WeakMap,Ut=new WeakMap,lt=new WeakMap,Ho=new WeakMap,Mt=new WeakMap,ke=new WeakMap,dt=new WeakMap,Kt=new WeakMap,Ht=new WeakMap,B=new WeakMap,ko=new WeakSet,Mi=function(e){if(t(this,Gt)){t(this,Gt).innerHTML="",r(this,Ut,[]);for(const s of e){const o=document.createElement("button");o.type="button",o.className="shroom-select-pill",o.dataset.option=s,o.textContent=w(s),o.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s})}),t(this,Gt).appendChild(o),t(this,Ut).push(o)}}},Eo=new WeakSet,Hi=function(e){if(t(this,k)){t(this,k).innerHTML="",r(this,lt,[]);for(const s of e){const o=document.createElement("button");o.type="button",o.className="shroom-select-option",o.role="option",o.dataset.option=s,o.textContent=w(s),o.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s}),c(this,kt,Ms).call(this),t(this,I)?.focus()}),o.addEventListener("keydown",n=>{const h=t(this,lt),l=h.indexOf(o);n.key==="ArrowDown"?(n.preventDefault(),h[Math.min(l+1,h.length-1)]?.focus()):n.key==="ArrowUp"?(n.preventDefault(),l===0?t(this,I)?.focus():h[l-1]?.focus()):n.key==="Escape"&&(c(this,kt,Ms).call(this),t(this,I)?.focus())}),t(this,k).appendChild(o),t(this,lt).push(o)}}},Fs=new WeakSet,oi=function(){if(!t(this,k)||!t(this,I))return;const e=t(this,I).getBoundingClientRect(),s=window.innerHeight-e.bottom,o=e.top,n=Math.min(t(this,k).scrollHeight||240,240);t(this,k).style.left=`${Math.round(e.left)}px`,t(this,k).style.width=`${Math.round(e.width)}px`,s<n+8&&o>s?t(this,k).style.top=`${Math.max(8,Math.round(e.top-n-6))}px`:t(this,k).style.top=`${Math.round(e.bottom+6)}px`},Ws=new WeakSet,ii=function(){if(!(!t(this,k)||!t(this,Mt).length)){try{typeof t(this,k).showPopover=="function"&&t(this,k).showPopover()}catch{}t(this,I)?.setAttribute("aria-expanded","true"),c(this,Fs,oi).call(this),r(this,B,()=>c(this,Fs,oi).call(this)),window.addEventListener("scroll",t(this,B),!0),window.addEventListener("resize",t(this,B)),r(this,dt,!0)}},kt=new WeakSet,Ms=function(){try{typeof t(this,k)?.hidePopover=="function"&&t(this,k).hidePopover()}catch{}t(this,I)?.setAttribute("aria-expanded","false"),t(this,B)&&(window.removeEventListener("scroll",t(this,B),!0),window.removeEventListener("resize",t(this,B)),r(this,B,null)),r(this,dt,!1)};const nr=`
    ${A}
    ${Hs}
    ${bt}
    ${M}

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
  `;class ar extends f{constructor(e,s,o,n){super(e,s,o,n);i(this,To);i(this,Ks);i(this,Io);i(this,Ys,null);i(this,Ee,null);i(this,Y,null);i(this,Te,null);i(this,Ie,null);i(this,qe,null);i(this,Xt,null);i(this,Jt,null);i(this,Qt,null);i(this,ct,0);i(this,st,!1);i(this,Gs,"closed");i(this,Us,{});i(this,Be,void 0);r(this,Be,rt(c(this,Io,Ei).bind(this),300))}render(){S(this);const e=this.def.capabilities==="read-write",o=(this.config.displayHints??{}).show_position!==!1&&this.def.supported_features?.includes("set_position"),n=!this.def.supported_features||this.def.supported_features.includes("buttons"),h=e&&(o||n);this.root.innerHTML=`
        <style>${nr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${h?`
            <div class="shroom-cover-bar">
              ${o?`
                <div class="shroom-cover-slider-view">
                  <div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-cover-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <div class="shroom-slider-edge" style="left:0%"></div>
                    <input type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${p(this.def.friendly_name)} position"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>
                </div>
              `:""}
              ${n?`
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
              ${o&&n?`
                <button class="shroom-cover-toggle-btn" type="button" title="Controls" aria-label="Toggle cover controls" aria-expanded="false">
                  <svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>
                </button>
              `:""}
            </div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ys,this.root.querySelector(".shroom-icon-shape")),r(this,Ee,this.root.querySelector(".shroom-secondary")),r(this,Y,this.root.querySelector(".shroom-slider-input")),r(this,Te,this.root.querySelector(".shroom-slider-cover")),r(this,Ie,this.root.querySelector(".shroom-cover-slider-view")),r(this,qe,this.root.querySelector(".shroom-cover-btn-view")),r(this,Xt,this.root.querySelector("[data-action=open]")),r(this,Jt,this.root.querySelector("[data-action=stop]")),r(this,Qt,this.root.querySelector("[data-action=close]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:window-shutter"),"card-icon"),t(this,Y)&&(t(this,Y).addEventListener("input",()=>{r(this,ct,parseInt(t(this,Y).value,10)),c(this,Ks,ri).call(this),t(this,Be).call(this)}),this.guardSlider(t(this,Y),t(this,Be))),[t(this,Xt),t(this,Jt),t(this,Qt)].forEach(m=>{if(!m)return;const u=m.getAttribute("data-action");m.addEventListener("click",()=>{this.config.card?.sendCommand(`${u}_cover`,{})})});const l=this.root.querySelector(".shroom-cover-toggle-btn");l?.addEventListener("click",()=>{r(this,st,!t(this,st)),l.setAttribute("aria-expanded",String(t(this,st))),l.setAttribute("aria-label",t(this,st)?"Show position slider":"Show cover buttons"),c(this,To,ki).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,Gs,e),r(this,Us,{...s});const o=e==="open"||e==="opening";if(_(t(this,Ys),"cover",o),t(this,Ee)){const l=s.current_position,m=w(e);t(this,Ee).textContent=l!==void 0?`${m} - ${l}%`:m}const n=e==="opening"||e==="closing",h=s.current_position;t(this,Xt)&&(t(this,Xt).disabled=!n&&h===100),t(this,Jt)&&(t(this,Jt).disabled=!n),t(this,Qt)&&(t(this,Qt).disabled=!n&&e==="closed"),s.current_position!==void 0&&(r(this,ct,s.current_position),t(this,Y)&&!this.isSliderActive(t(this,Y))&&(t(this,Y).value=String(t(this,ct))),c(this,Ks,ri).call(this)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){const o={...t(this,Us)};return e==="open_cover"?(o.current_position=100,{state:"open",attributes:o}):e==="close_cover"?(o.current_position=0,{state:"closed",attributes:o}):e==="stop_cover"?{state:t(this,Gs),attributes:o}:e==="set_cover_position"&&s.position!==void 0?(o.current_position=s.position,{state:s.position>0?"open":"closed",attributes:o}):null}}Ys=new WeakMap,Ee=new WeakMap,Y=new WeakMap,Te=new WeakMap,Ie=new WeakMap,qe=new WeakMap,Xt=new WeakMap,Jt=new WeakMap,Qt=new WeakMap,ct=new WeakMap,st=new WeakMap,Gs=new WeakMap,Us=new WeakMap,Be=new WeakMap,To=new WeakSet,ki=function(){t(this,Ie)&&(t(this,Ie).hidden=t(this,st)),t(this,qe)&&(t(this,qe).hidden=!t(this,st));const e=this.root.querySelector(".shroom-cover-toggle-btn");e&&(e.innerHTML=t(this,st)?'<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>')},Ks=new WeakSet,ri=function(){t(this,Te)&&(t(this,Te).style.left=`${t(this,ct)}%`);const e=this.root.querySelector(".shroom-slider-edge");e&&(e.style.left=`${t(this,ct)}%`)},Io=new WeakSet,Ei=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,ct)})};const hr=`
    ${A}
    ${M}
  `;class lr extends f{constructor(){super(...arguments);i(this,Ve,null);i(this,Oe,null)}render(){S(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${hr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ve,this.root.querySelector(".shroom-icon-shape")),r(this,Oe,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:remote"),"card-icon"),_(t(this,Ve),"remote",!1);const s=this.root.querySelector(".shroom-state-item");e&&(nt(s,`${this.def.friendly_name} - Send command`),this._attachGestureHandlers(s,{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}const n=this.config.tapAction?.data?.command??"power",h=this.config.tapAction?.data?.device??void 0,l=h?{command:n,device:h}:{command:n};this.config.card?.sendCommand("send_command",l)}})),this.renderCompanions(),L(this.root)}applyState(e,s){const o=e==="on";_(t(this,Ve),"remote",o),t(this,Oe)&&(t(this,Oe).textContent=w(e));const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(n,"mdi:remote"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ve=new WeakMap,Oe=new WeakMap;function wo(a){a<0&&(a=0);const d=Math.floor(a/3600),e=Math.floor(a%3600/60),s=Math.floor(a%60),o=n=>String(n).padStart(2,"0");return d>0?`${d}:${o(e)}:${o(s)}`:`${o(e)}:${o(s)}`}function gi(a){if(typeof a=="number")return a;if(typeof a!="string")return 0;const d=a.split(":").map(Number);return d.length===3?d[0]*3600+d[1]*60+d[2]:d.length===2?d[0]*60+d[1]:d[0]||0}const dr=`
    ${A}
    ${bt}
    ${M}

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
  `;class cr extends f{constructor(){super(...arguments);i(this,qo);i(this,Bo);i(this,Vo);i(this,oe);i(this,De,null);i(this,Et,null);i(this,Tt,null);i(this,te,null);i(this,ee,null);i(this,se,null);i(this,Pe,"idle");i(this,Ne,{});i(this,G,null);i(this,Ze,null)}render(){S(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${dr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-timer-controls">
              <button class="shroom-timer-btn" data-action="playpause" type="button"
                title="Start" aria-label="${p(this.def.friendly_name)} - Start">
                <span part="playpause-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="cancel" type="button"
                title="Cancel" aria-label="${p(this.def.friendly_name)} - Cancel">
                <span part="cancel-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="finish" type="button"
                title="Finish" aria-label="${p(this.def.friendly_name)} - Finish">
                <span part="finish-icon" aria-hidden="true"></span>
              </button>
            </div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,De,this.root.querySelector(".shroom-icon-shape")),r(this,Et,this.root.querySelector(".shroom-secondary")),r(this,Tt,this.root.querySelector("[data-action=playpause]")),r(this,te,this.root.querySelector("[data-action=cancel]")),r(this,ee,this.root.querySelector("[data-action=finish]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:timer-outline"),"card-icon"),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),_(t(this,De),"timer",!1),e&&(t(this,Tt)?.addEventListener("click",()=>{const s=t(this,Pe)==="active"?"pause":"start";this.config.card?.sendCommand(s,{})}),t(this,te)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,ee)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,Pe,e),r(this,Ne,{...s}),r(this,G,s.finishes_at??null),r(this,Ze,s.remaining!=null?gi(s.remaining):null);const o=e==="active";_(t(this,De),"timer",o||e==="paused"),c(this,qo,Ti).call(this,e),c(this,Bo,Ii).call(this,e),o&&t(this,G)?c(this,Vo,qi).call(this):c(this,oe,xo).call(this)}predictState(e,s){const o={...t(this,Ne)};return e==="start"?{state:"active",attributes:o}:e==="pause"?(t(this,G)&&(o.remaining=Math.max(0,(new Date(t(this,G)).getTime()-Date.now())/1e3)),{state:"paused",attributes:o}):e==="cancel"||e==="finish"?{state:"idle",attributes:o}:null}}De=new WeakMap,Et=new WeakMap,Tt=new WeakMap,te=new WeakMap,ee=new WeakMap,se=new WeakMap,Pe=new WeakMap,Ne=new WeakMap,G=new WeakMap,Ze=new WeakMap,qo=new WeakSet,Ti=function(e){const s=e==="idle",o=e==="active";if(t(this,Tt)){const n=o?"mdi:pause":"mdi:play",h=o?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(n,"playpause-icon"),t(this,Tt).title=h,t(this,Tt).setAttribute("aria-label",`${this.def.friendly_name} - ${h}`)}t(this,te)&&(t(this,te).disabled=s),t(this,ee)&&(t(this,ee).disabled=s),this.announceState(`${this.def.friendly_name}, ${e}`)},Bo=new WeakSet,Ii=function(e){if(!t(this,Et))return;const s=w(e);let o=null;if(e==="idle"){const n=t(this,Ne).duration;o=n?wo(gi(n)):"00:00"}else if(e==="paused"&&t(this,Ze)!=null)o=wo(t(this,Ze));else if(e==="active"&&t(this,G)){const n=Math.max(0,(new Date(t(this,G)).getTime()-Date.now())/1e3);o=wo(n)}t(this,Et).textContent=o?`${s} - ${o}`:s},Vo=new WeakSet,qi=function(){c(this,oe,xo).call(this),r(this,se,setInterval(()=>{if(!t(this,G)||t(this,Pe)!=="active"){c(this,oe,xo).call(this);return}const e=Math.max(0,(new Date(t(this,G)).getTime()-Date.now())/1e3);t(this,Et)&&(t(this,Et).textContent=`Active - ${wo(e)}`),e<=0&&c(this,oe,xo).call(this)},1e3))},oe=new WeakSet,xo=function(){t(this,se)&&(clearInterval(t(this,se)),r(this,se,null))};const pr=`
    ${A}
    ${bt}
    ${M}

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
  `;class mr extends f{constructor(e,s,o,n){super(e,s,o,n);i(this,Oo);i(this,oo);i(this,io);i(this,Do);i(this,Po);i(this,ro);i(this,he);i(this,No);i(this,Xs,null);i(this,ze,null);i(this,Re,null);i(this,je,null);i(this,Fe,null);i(this,We,null);i(this,Ye,null);i(this,Ge,null);i(this,Ue,null);i(this,Ke,null);i(this,Xe,null);i(this,T,null);i(this,Je,null);i(this,Qe,null);i(this,pt,null);i(this,ie,null);i(this,ot,null);i(this,V,null);i(this,mt,!1);i(this,ut,20);i(this,ts,null);i(this,U,"off");i(this,es,null);i(this,ss,null);i(this,os,null);i(this,Js,16);i(this,Qs,32);i(this,to,.5);i(this,is,"°C");i(this,It,[]);i(this,re,[]);i(this,ne,[]);i(this,ae,[]);i(this,eo,{});i(this,so,void 0);r(this,so,rt(c(this,Do,Vi).bind(this),500))}render(){S(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},o=this.def.supported_features?.includes("target_temperature"),n=s.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),h=s.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),l=s.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);r(this,Js,this.def.feature_config?.min_temp??16),r(this,Qs,this.def.feature_config?.max_temp??32),r(this,to,this.def.feature_config?.temp_step??.5),r(this,is,this.def.unit_of_measurement??"°C"),r(this,It,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),r(this,re,this.def.feature_config?.fan_modes??[]),r(this,ne,this.def.feature_config?.preset_modes??[]),r(this,ae,this.def.feature_config?.swing_modes??[]);const m=e&&(t(this,It).length||t(this,ne).length||t(this,re).length||t(this,ae).length),[u,C]=t(this,ut).toFixed(1).split(".");this.root.innerHTML=`
        <style>${pr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
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
                    <span class="shroom-climate-temp-int">${p(u)}</span><span class="shroom-climate-temp-frac">.${p(C)}</span>
                    <span class="shroom-climate-temp-unit">${p(t(this,is))}</span>
                  </span>
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  `:""}
                </div>
              `:""}
              ${m?`
                <div class="shroom-climate-feat-view" hidden>
                  ${s.show_hvac_modes!==!1&&t(this,It).length?`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${h&&t(this,ne).length?`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${n&&t(this,re).length?`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${l&&t(this,ae).length?`
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
      `,r(this,Xs,this.root.querySelector(".shroom-icon-shape")),r(this,ze,this.root.querySelector(".shroom-secondary")),r(this,Re,this.root.querySelector(".shroom-climate-bar")),r(this,je,this.root.querySelector(".shroom-climate-temp-int")),r(this,Fe,this.root.querySelector(".shroom-climate-temp-frac")),r(this,We,this.root.querySelector("[data-dir='-']")),r(this,Ye,this.root.querySelector("[data-dir='+']")),r(this,Ge,this.root.querySelector("[data-feat=mode]")),r(this,Ue,this.root.querySelector("[data-feat=fan]")),r(this,Ke,this.root.querySelector("[data-feat=preset]")),r(this,Xe,this.root.querySelector("[data-feat=swing]")),r(this,T,this.root.querySelector(".shroom-climate-dropdown")),r(this,Je,this.root.querySelector(".shroom-climate-temp-view")),r(this,Qe,this.root.querySelector(".shroom-climate-feat-view")),r(this,pt,this.root.querySelector(".shroom-climate-toggle-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:thermostat"),"card-icon");const b=this.root.querySelector(".shroom-state-item");e&&(nt(b,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(b,{onTap:()=>{const v=this.config.gestureConfig?.tap;if(v){this._runAction(v);return}const q=t(this,U)==="off"?t(this,It).find(j=>j!=="off")??"heat":"off";this.config.card?.sendCommand("set_hvac_mode",{hvac_mode:q})}})),t(this,We)&&t(this,We).addEventListener("click",v=>{v.stopPropagation(),c(this,oo,ni).call(this,-1)}),t(this,Ye)&&t(this,Ye).addEventListener("click",v=>{v.stopPropagation(),c(this,oo,ni).call(this,1)}),t(this,pt)&&t(this,pt).addEventListener("click",v=>{v.stopPropagation(),r(this,mt,!t(this,mt)),t(this,pt).setAttribute("aria-expanded",String(t(this,mt))),c(this,Oo,Bi).call(this)}),e&&[t(this,Ge),t(this,Ue),t(this,Ke),t(this,Xe)].forEach(v=>{if(!v)return;const q=v.getAttribute("data-feat");v.addEventListener("click",j=>{j.stopPropagation(),c(this,Po,Oi).call(this,q)})}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,eo,{...s}),r(this,U,e),r(this,es,s.fan_mode??null),r(this,ss,s.preset_mode??null),r(this,os,s.swing_mode??null),r(this,ts,s.current_temperature??null);const o=e==="off";if(t(this,Re)&&(t(this,Re).hidden=o),_(t(this,Xs),"climate",!o),s.temperature!==void 0&&(r(this,ut,s.temperature),c(this,io,ai).call(this)),t(this,ze)){const h=s.hvac_action??e,l=t(this,ts)!=null?` - ${t(this,ts)} ${t(this,is)}`:"";t(this,ze).textContent=w(h)+l}c(this,No,Di).call(this);const n=s.hvac_action??e;this.announceState(`${this.def.friendly_name}, ${w(n)}`)}predictState(e,s){const o={...t(this,eo)};return e==="set_hvac_mode"&&s.hvac_mode?{state:s.hvac_mode,attributes:o}:e==="set_temperature"&&s.temperature!==void 0?{state:t(this,U),attributes:{...o,temperature:s.temperature}}:e==="set_fan_mode"&&s.fan_mode?{state:t(this,U),attributes:{...o,fan_mode:s.fan_mode}}:e==="set_preset_mode"&&s.preset_mode?{state:t(this,U),attributes:{...o,preset_mode:s.preset_mode}}:e==="set_swing_mode"&&s.swing_mode?{state:t(this,U),attributes:{...o,swing_mode:s.swing_mode}}:null}destroy(){t(this,ot)&&(document.removeEventListener("pointerdown",t(this,ot),!0),r(this,ot,null)),t(this,V)&&(window.removeEventListener("scroll",t(this,V),!0),window.removeEventListener("resize",t(this,V)),r(this,V,null));try{t(this,T)?.hidePopover?.()}catch{}}}Xs=new WeakMap,ze=new WeakMap,Re=new WeakMap,je=new WeakMap,Fe=new WeakMap,We=new WeakMap,Ye=new WeakMap,Ge=new WeakMap,Ue=new WeakMap,Ke=new WeakMap,Xe=new WeakMap,T=new WeakMap,Je=new WeakMap,Qe=new WeakMap,pt=new WeakMap,ie=new WeakMap,ot=new WeakMap,V=new WeakMap,mt=new WeakMap,ut=new WeakMap,ts=new WeakMap,U=new WeakMap,es=new WeakMap,ss=new WeakMap,os=new WeakMap,Js=new WeakMap,Qs=new WeakMap,to=new WeakMap,is=new WeakMap,It=new WeakMap,re=new WeakMap,ne=new WeakMap,ae=new WeakMap,eo=new WeakMap,so=new WeakMap,Oo=new WeakSet,Bi=function(){t(this,Je)&&(t(this,Je).hidden=t(this,mt)),t(this,Qe)&&(t(this,Qe).hidden=!t(this,mt)),t(this,pt)&&(t(this,pt).innerHTML=t(this,mt)?'<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>')},oo=new WeakSet,ni=function(e){const s=Math.round((t(this,ut)+e*t(this,to))*100)/100;r(this,ut,Math.max(t(this,Js),Math.min(t(this,Qs),s))),c(this,io,ai).call(this),t(this,so).call(this)},io=new WeakSet,ai=function(){const[e,s]=t(this,ut).toFixed(1).split(".");t(this,je)&&(t(this,je).textContent=e),t(this,Fe)&&(t(this,Fe).textContent=`.${s}`)},Do=new WeakSet,Vi=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,ut)})},Po=new WeakSet,Oi=function(e){if(t(this,ie)===e){c(this,he,_o).call(this);return}t(this,ie)&&c(this,he,_o).call(this),r(this,ie,e);let s=[],o=null,n="",h="";switch(e){case"mode":s=t(this,It),o=t(this,U),n="set_hvac_mode",h="hvac_mode";break;case"fan":s=t(this,re),o=t(this,es),n="set_fan_mode",h="fan_mode";break;case"preset":s=t(this,ne),o=t(this,ss),n="set_preset_mode",h="preset_mode";break;case"swing":s=t(this,ae),o=t(this,os),n="set_swing_mode",h="swing_mode";break}if(!s.length||!t(this,T))return;t(this,T).innerHTML=s.map(u=>`
        <button class="shroom-climate-dd-option" data-active="${u===o}" role="option"
          aria-selected="${u===o}" type="button">
          ${p(w(u))}
        </button>
      `).join(""),t(this,T).querySelectorAll(".shroom-climate-dd-option").forEach((u,C)=>{u.addEventListener("click",b=>{b.stopPropagation(),this.config.card?.sendCommand(n,{[h]:s[C]}),c(this,he,_o).call(this)})});const l=this.root.querySelector(`[data-feat="${e}"]`);l&&l.setAttribute("aria-expanded","true");try{t(this,T).showPopover?.()}catch{}c(this,ro,hi).call(this,l),r(this,V,()=>c(this,ro,hi).call(this,l)),window.addEventListener("scroll",t(this,V),!0),window.addEventListener("resize",t(this,V));const m=u=>{u.composedPath().some(b=>b===this.root||b===this.root.host)||c(this,he,_o).call(this)};r(this,ot,m),document.addEventListener("pointerdown",m,!0)},ro=new WeakSet,hi=function(e){if(!t(this,T)||!e)return;const s=e.getBoundingClientRect(),o=window.innerHeight-s.bottom,n=s.top,h=Math.min(t(this,T).scrollHeight||240,240),l=Math.max(140,Math.round(s.width));t(this,T).style.left=`${Math.round(s.left)}px`,t(this,T).style.minWidth=`${l}px`,o<h+8&&n>o?t(this,T).style.top=`${Math.max(8,Math.round(s.top-h-6))}px`:t(this,T).style.top=`${Math.round(s.bottom+6)}px`},he=new WeakSet,_o=function(){r(this,ie,null);try{t(this,T)?.hidePopover?.()}catch{}this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(e=>{e.setAttribute("aria-expanded","false")}),t(this,ot)&&(document.removeEventListener("pointerdown",t(this,ot),!0),r(this,ot,null)),t(this,V)&&(window.removeEventListener("scroll",t(this,V),!0),window.removeEventListener("resize",t(this,V)),r(this,V,null))},No=new WeakSet,Di=function(){const e=(s,o)=>{if(!s)return;const n=s.querySelector(".shroom-climate-feat-value");n&&(n.textContent=w(o??"None"))};e(t(this,Ge),t(this,U)),e(t(this,Ue),t(this,es)),e(t(this,Ke),t(this,ss)),e(t(this,Xe),t(this,os))};const ur=`
    ${A}
    ${Hs}
    ${bt}
    ${M}

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
  `;class fr extends f{constructor(e,s,o,n){super(e,s,o,n);i(this,po);i(this,Zo);i(this,no,null);i(this,rs,null);i(this,le,null);i(this,ns,null);i(this,as,null);i(this,hs,null);i(this,qt,null);i(this,ao,null);i(this,ho,null);i(this,lo,null);i(this,ls,null);i(this,K,null);i(this,Bt,null);i(this,co,!1);i(this,de,!1);i(this,X,0);i(this,ft,"idle");i(this,vt,{});i(this,ds,void 0);r(this,ds,rt(c(this,Zo,Pi).bind(this),200))}render(){S(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??{},n=s.includes("previous_track");this.root.innerHTML=`
        <style>${ur}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-mp-bar" hidden>
              <div class="shroom-mp-transport-view">
                <button class="shroom-mp-btn" data-role="power" type="button" title="Power" aria-label="Power">
                  <span part="power-icon" aria-hidden="true"></span>
                </button>
                ${n?`
                  <button class="shroom-mp-btn" data-role="prev" type="button" title="Previous" aria-label="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                <button class="shroom-mp-btn" data-role="play" type="button" title="Play" aria-label="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>
                ${n?`
                  <button class="shroom-mp-btn" data-role="next" type="button" title="Next" aria-label="Next track">
                    <span part="next-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                <button class="shroom-mp-btn" data-role="volume" type="button" title="Volume" aria-label="Volume controls">
                  <span part="vol-icon" aria-hidden="true"></span>
                </button>
              </div>
              <div class="shroom-mp-volume-view" hidden>
                  <button class="shroom-mp-btn" data-role="vol-down" type="button" title="Volume down" aria-label="Volume down">
                    <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z"/></svg>
                  </button>
                  <div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-mp-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <input type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${p(this.def.friendly_name)} volume"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>
                  <button class="shroom-mp-btn" data-role="vol-up" type="button" title="Volume up" aria-label="Volume up">
                    <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M14,11H17V8H19V11H22V13H19V16H17V13H14V11Z"/></svg>
                  </button>
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
      `,r(this,no,this.root.querySelector(".shroom-icon-shape")),r(this,rs,this.root.querySelector(".shroom-primary")),r(this,le,this.root.querySelector(".shroom-secondary")),r(this,hs,this.root.querySelector(".shroom-mp-bar")),r(this,ns,this.root.querySelector(".shroom-mp-transport-view")),r(this,as,this.root.querySelector(".shroom-mp-volume-view")),r(this,qt,this.root.querySelector("[data-role=play]")),r(this,ao,this.root.querySelector("[data-role=prev]")),r(this,ho,this.root.querySelector("[data-role=next]")),r(this,lo,this.root.querySelector("[data-role=power]")),r(this,ls,this.root.querySelector("[data-role=volume]")),r(this,K,this.root.querySelector(".shroom-slider-input")),r(this,Bt,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:speaker"),"card-icon"),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:power","power-icon"),this.renderIcon("mdi:volume-high","vol-icon"),e&&(t(this,qt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,ao)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,ho)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),t(this,lo)?.addEventListener("click",()=>{const u=t(this,ft)==="playing"||t(this,ft)==="paused";this.config.card?.sendCommand(u?"turn_off":"turn_on",{})}),t(this,ls)?.addEventListener("click",()=>{r(this,de,!0),c(this,po,li).call(this)}),this.root.querySelector(".shroom-mp-back-btn")?.addEventListener("click",()=>{r(this,de,!1),c(this,po,li).call(this)}),this.root.querySelector("[data-role=vol-down]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_down",{})}),this.root.querySelector("[data-role=vol-up]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_up",{})})),t(this,K)&&(t(this,K).addEventListener("input",()=>{r(this,X,parseInt(t(this,K).value,10)),t(this,Bt)&&(t(this,Bt).style.left=`${t(this,X)}%`),t(this,ds).call(this)}),this.guardSlider(t(this,K),t(this,ds))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,ft,e),r(this,vt,s);const o=e==="playing",n=o||e==="paused";_(t(this,no),"media_player",n),t(this,hs)&&(t(this,hs).hidden=!n);const h=s.media_title??"",l=s.media_artist??"";if(t(this,rs)&&(t(this,rs).textContent=n&&h?h:this.def.friendly_name),t(this,le))if(n){const m=t(this,X)>0?`${t(this,X)}%`:"",u=[l,m].filter(Boolean);t(this,le).textContent=u.join(" - ")||w(e)}else t(this,le).textContent=w(e);if(t(this,qt)){const m=o?"mdi:pause":"mdi:play";this.renderIcon(m,"play-icon");const u=o?"Pause":"Play";t(this,qt).title=u,t(this,qt).setAttribute("aria-label",u)}if(s.volume_level!==void 0&&(r(this,X,Math.round(s.volume_level*100)),t(this,K)&&!this.isSliderActive(t(this,K))&&(t(this,K).value=String(t(this,X))),t(this,Bt)&&(t(this,Bt).style.left=`${t(this,X)}%`)),r(this,co,!!s.is_volume_muted),t(this,ls)){const m=t(this,co)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(m,"vol-icon")}this.announceState(`${this.def.friendly_name}, ${e}${h?` - ${h}`:""}`)}predictState(e,s){return e==="media_play_pause"?{state:t(this,ft)==="playing"?"paused":"playing",attributes:t(this,vt)}:e==="volume_mute"?{state:t(this,ft),attributes:{...t(this,vt),is_volume_muted:!!s.is_volume_muted}}:e==="volume_set"?{state:t(this,ft),attributes:{...t(this,vt),volume_level:s.volume_level}}:e==="turn_off"?{state:"off",attributes:t(this,vt)}:e==="turn_on"?{state:"idle",attributes:t(this,vt)}:null}}no=new WeakMap,rs=new WeakMap,le=new WeakMap,ns=new WeakMap,as=new WeakMap,hs=new WeakMap,qt=new WeakMap,ao=new WeakMap,ho=new WeakMap,lo=new WeakMap,ls=new WeakMap,K=new WeakMap,Bt=new WeakMap,co=new WeakMap,de=new WeakMap,X=new WeakMap,ft=new WeakMap,vt=new WeakMap,ds=new WeakMap,po=new WeakSet,li=function(){t(this,ns)&&(t(this,ns).hidden=t(this,de)),t(this,as)&&(t(this,as).hidden=!t(this,de))},Zo=new WeakSet,Pi=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,X)/100})};const bi={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},vr=bi.cloudy,gr="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z",br="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",yr="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",xr=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Yo(a,d){const e=bi[a]??vr;return`<svg viewBox="0 0 24 24" width="${d}" height="${d}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Go(a){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${a}" fill="currentColor"/></svg>`}const _r=`
    ${A}
    ${M}

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
  `;class Cr extends f{constructor(){super(...arguments);i(this,P);i(this,uo);i(this,fo);i(this,mo,null);i(this,cs,null);i(this,ps,null);i(this,ce,null);i(this,ms,null);i(this,us,null);i(this,fs,null);i(this,gt,null);i(this,it,null);i(this,vs,null);i(this,pe,null);i(this,me,null)}render(){S(this),this.root.innerHTML=`
        <style>${_r}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <div class="shroom-weather-body">
            <div class="shroom-weather-main">
              <span class="shroom-weather-icon">${Yo("cloudy",36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${Go(gr)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${Go(br)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${Go(yr)}
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
      `,r(this,mo,this.root.querySelector(".shroom-icon-shape")),r(this,cs,this.root.querySelector(".shroom-secondary")),r(this,ps,this.root.querySelector(".shroom-weather-icon")),r(this,ce,this.root.querySelector(".shroom-weather-temp")),r(this,ms,this.root.querySelector("[data-stat=humidity] [data-value]")),r(this,us,this.root.querySelector("[data-stat=wind] [data-value]")),r(this,fs,this.root.querySelector("[data-stat=pressure] [data-value]")),r(this,gt,this.root.querySelector(".shroom-forecast-strip")),r(this,it,this.root.querySelector(".shroom-forecast-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:weather-cloudy"),"card-icon"),_(t(this,mo),"weather",!0),r(this,vs,Zi(t(this,gt))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}destroy(){var e;(e=t(this,vs))==null||e.call(this),r(this,vs,null)}applyState(e,s){const o=e||"cloudy";t(this,ps)&&(t(this,ps).innerHTML=Yo(o,36));const n=this.i18n.t(`weather.${o}`)!==`weather.${o}`?this.i18n.t(`weather.${o}`):o.replace(/-/g," ");t(this,cs)&&(t(this,cs).textContent=w(n));const h=s.temperature??s.native_temperature;let l=String(s.temperature_unit||s.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(l&&!/^°/.test(l)&&l.length<=2&&(l=`°${l}`),t(this,ce)){const u=t(this,ce).querySelector(".shroom-weather-unit");t(this,ce).firstChild.textContent=h!=null?Math.round(Number(h)):"--",u&&(u.textContent=l)}if(t(this,ms)){const u=s.humidity;t(this,ms).textContent=u!=null?`${u}%`:"--"}if(t(this,us)){const u=s.wind_speed,C=s.wind_speed_unit??"";t(this,us).textContent=u!=null?`${u} ${C}`.trim():"--"}if(t(this,fs)){const u=s.pressure,C=s.pressure_unit??"";t(this,fs).textContent=u!=null?`${u} ${C}`.trim():"--"}const m=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;r(this,pe,m?s.forecast_daily??s.forecast??null:null),r(this,me,m?s.forecast_hourly??null:null),c(this,uo,di).call(this),c(this,fo,ci).call(this),this.announceState(`${this.def.friendly_name}, ${n}, ${h??"--"} ${l}`)}}mo=new WeakMap,cs=new WeakMap,ps=new WeakMap,ce=new WeakMap,ms=new WeakMap,us=new WeakMap,fs=new WeakMap,gt=new WeakMap,it=new WeakMap,vs=new WeakMap,P=new WeakSet,ue=function(){return this.config._forecastMode??"daily"},Fo=function(e){this.config._forecastMode=e},pe=new WeakMap,me=new WeakMap,uo=new WeakSet,di=function(){if(!t(this,it))return;const e=Array.isArray(t(this,pe))&&t(this,pe).length>0,s=Array.isArray(t(this,me))&&t(this,me).length>0;if(!e&&!s){t(this,it).textContent="";return}e&&!s&&r(this,P,"daily",Fo),!e&&s&&r(this,P,"hourly",Fo),e&&s?(t(this,it).textContent=t(this,P,ue)==="daily"?"Hourly":"5-Day",t(this,it).onclick=()=>{r(this,P,t(this,P,ue)==="daily"?"hourly":"daily",Fo),c(this,uo,di).call(this),c(this,fo,ci).call(this)}):(t(this,it).textContent="",t(this,it).onclick=null)},fo=new WeakSet,ci=function(){if(!t(this,gt))return;const e=t(this,P,ue)==="hourly"?t(this,me):t(this,pe);if(t(this,gt).setAttribute("data-mode",t(this,P,ue)),!Array.isArray(e)||e.length===0){t(this,gt).innerHTML="";return}const s=t(this,P,ue)==="daily"?e.slice(0,5):e;t(this,gt).innerHTML=s.map(o=>{const n=new Date(o.datetime);let h;t(this,P,ue)==="hourly"?h=n.toLocaleTimeString([],{hour:"numeric"}):h=xr[n.getDay()]??"";const l=(o.temperature??o.native_temperature)!=null?Math.round(o.temperature??o.native_temperature):"--",m=(o.templow??o.native_templow)!=null?Math.round(o.templow??o.native_templow):null;return`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${p(String(h))}</span>
            ${Yo(o.condition||"cloudy",18)}
            <span class="shroom-forecast-temps">
              ${p(String(l))}${m!=null?`/<span class="shroom-forecast-lo">${p(String(m))}</span>`:""}
            </span>
          </div>`}).join("")};const wr=`
    ${A}
    ${M}
  `;class $r extends f{constructor(){super(...arguments);i(this,vo,null);i(this,gs,null);i(this,Vt,!1);i(this,zo,"unknown")}render(){S(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${wr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,vo,this.root.querySelector(".shroom-icon-shape")),r(this,gs,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"card-icon");const s=this.root.querySelector(".shroom-state-item");e&&(nt(s,`${this.def.friendly_name} - Lock/Unlock`),this._attachGestureHandlers(s,{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand(t(this,Vt)?"unlock":"lock",{})}})),this.renderCompanions(),L(this.root)}applyState(e,s){r(this,zo,e),r(this,Vt,e==="locked");const o=e==="jammed";_(t(this,vo),"lock",t(this,Vt)),t(this,gs)&&(t(this,gs).textContent=w(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,Vt)));const h=o?"mdi:lock-alert":t(this,Vt)?"mdi:lock":"mdi:lock-open",l=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(l,h),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}vo=new WeakMap,gs=new WeakMap,Vt=new WeakMap,zo=new WeakMap;const Lr=`
    ${A}
    ${M}
  `;class yi extends f{constructor(){super(...arguments);i(this,bs,null);i(this,ys,null)}render(){S(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.run")!=="action.run"?this.i18n.t("action.run"):"Run";this.root.innerHTML=`
        <style>${Lr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,bs,this.root.querySelector(".shroom-icon-shape")),r(this,ys,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),_(t(this,bs),"script",!1);const o=this.root.querySelector(".shroom-state-item");e&&(nt(o,`${this.def.friendly_name} - ${s}`),this._attachGestureHandlers(o,{onTap:()=>{const n=this.config.gestureConfig?.tap;if(n){this._runAction(n);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})}})),this.renderCompanions(),L(this.root)}applyState(e,s){const o=e==="on";_(t(this,bs),"script",o),t(this,ys)&&(t(this,ys).textContent=o?this.i18n.t("state.running")!=="state.running"?this.i18n.t("state.running"):"Running":w(e));const n=o?"mdi:script-text":"mdi:script-text-play",h=this.def.icon_state_map?.[e]??this.def.icon??n;this.renderIcon(this.resolveIcon(h,n),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}bs=new WeakMap,ys=new WeakMap,yo(yi,"staleOnMount",!1);const Sr=`
    ${A}
    ${M}
  `;class xi extends f{constructor(){super(...arguments);i(this,xs,null);i(this,_s,null)}render(){S(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.trigger")!=="action.trigger"?this.i18n.t("action.trigger"):"Trigger";this.root.innerHTML=`
        <style>${Sr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,xs,this.root.querySelector(".shroom-icon-shape")),r(this,_s,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),_(t(this,xs),"automation",!1);const o=this.root.querySelector(".shroom-state-item");e&&(nt(o,`${this.def.friendly_name} - ${s}`),this._attachGestureHandlers(o,{onTap:()=>{const n=this.config.gestureConfig?.tap;if(n){this._runAction(n);return}this.config.card?.sendCommand("trigger",{})}})),this.renderCompanions(),L(this.root)}applyState(e,s){const o=e==="on";_(t(this,xs),"automation",o),t(this,_s)&&(t(this,_s).textContent=o?this.i18n.t("state.on")!=="state.on"?this.i18n.t("state.on"):"Enabled":w(e));const n=o?"mdi:robot":"mdi:robot-off",h=this.def.icon_state_map?.[e]??this.def.icon??n;this.renderIcon(this.resolveIcon(h,n),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}}xs=new WeakMap,_s=new WeakMap,yo(xi,"staleOnMount",!1);const Ar=`
    ${A}
    ${M}
  `;class _i extends f{constructor(){super(...arguments);i(this,Cs,null);i(this,ws,null)}render(){S(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.press")!=="action.press"?this.i18n.t("action.press"):"Press";this.root.innerHTML=`
        <style>${Ar}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Cs,this.root.querySelector(".shroom-icon-shape")),r(this,ws,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),_(t(this,Cs),"button",!1);const o=this.root.querySelector(".shroom-state-item");e&&(nt(o,`${this.def.friendly_name} - ${s}`),this._attachGestureHandlers(o,{onTap:()=>{const n=this.config.gestureConfig?.tap;if(n){this._runAction(n);return}this.config.card?.sendCommand("press",{})}})),this.renderCompanions(),L(this.root)}applyState(e,s){_(t(this,Cs),"button",!1),t(this,ws)&&(t(this,ws).textContent=w(e));const o=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(o,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Cs=new WeakMap,ws=new WeakMap,yo(_i,"staleOnMount",!1);const Mr=`
    ${A}
    ${M}
  `;class Ci extends f{constructor(){super(...arguments);i(this,$s,null);i(this,Ls,null)}render(){S(this),this.root.innerHTML=`
        <style>${Mr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,$s,this.root.querySelector(".shroom-icon-shape")),r(this,Ls,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"card-icon"),_(t(this,$s),"person",!1),this.renderCompanions(),L(this.root)}applyState(e,s){const o=e==="home";if(_(t(this,$s),"person",o),t(this,Ls)){const l=e==="not_home"?"Away":e==="home"?"Home":w(e);t(this,Ls).textContent=l}const n=e==="not_home"?"mdi:account-off":"mdi:account",h=this.def.icon_state_map?.[e]??this.def.icon??n;this.renderIcon(this.resolveIcon(h,n),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}$s=new WeakMap,Ls=new WeakMap,yo(Ci,"staleOnMount",!0);const Hr=`
    ${A}
    ${M}
  `;class kr extends f{constructor(){super(...arguments);i(this,Ss,null);i(this,As,null)}render(){S(this),this.root.innerHTML=`
        <style>${Hr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,r(this,Ss,this.root.querySelector(".shroom-icon-shape")),r(this,As,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:eye"),"card-icon"),_(t(this,Ss),"event",!1),this.renderCompanions(),L(this.root)}applyState(e,s){_(t(this,Ss),"event",!1),t(this,As)&&(t(this,As).textContent=w(e));const o=this.def.icon_state_map?.[e]??this.def.icon??"mdi:eye";this.renderIcon(this.resolveIcon(o,"mdi:eye"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ss=new WeakMap,As=new WeakMap;const Er=document.currentScript&&document.currentScript.dataset.rendererId||"shrooms";y._renderers=y._renderers||{},y._renderers[Er]={light:Fi,switch:fi,input_boolean:fi,lock:$r,sensor:Co,"sensor.temperature":Co,"sensor.humidity":Co,"sensor.battery":Co,fan:Ji,binary_sensor:tr,generic:sr,input_number:ir,input_select:vi,select:vi,cover:ar,remote:lr,timer:cr,climate:mr,media_player:fr,weather:Cr,script:yi,automation:xi,button:_i,person:Ci,event:kr,_capabilities:{fan:{display_modes:["on-off","continuous","stepped","cycle"]},input_number:{display_modes:["slider","buttons"]},input_select:{display_modes:["pills","dropdown"]},select:{display_modes:["pills","dropdown"]},light:{features:["brightness","color_temp","rgb"]},climate:{features:["hvac_modes","presets","fan_mode","swing_mode"]},cover:{features:["position","tilt"]},media_player:{features:["transport","volume","source"]}}}})();})();
