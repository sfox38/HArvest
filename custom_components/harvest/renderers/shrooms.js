(()=>{var Oo=(_,b,u)=>{if(!b.has(_))throw TypeError("Cannot "+u)};var t=(_,b,u)=>(Oo(_,b,"read from private field"),u?u.call(_):b.get(_)),o=(_,b,u)=>{if(b.has(_))throw TypeError("Cannot add the same private member more than once");b instanceof WeakSet?b.add(_):b.set(_,u)},i=(_,b,u,nt)=>(Oo(_,b,"write to private field"),nt?nt.call(_,u):b.set(_,u),u);var l=(_,b,u)=>(Oo(_,b,"access private method"),u);(function(){"use strict";var ws,ue,yt,xt,Bt,A,Cs,_t,Vt,Dt,G,Ot,Pt,D,O,wt,fe,Nt,ve,Ls,Po,Ss,No,mo,ai,tt,zt,ge,at,Zt,z,be,Ct,Lt,St,P,w,jt,$t,At,Y,ye,$s,Ft,xe,Eo,uo,hi,As,zo,Ms,Zo,Hs,jo,_e,To,fo,li,ks,we,Es,Ce,Z,et,Rt,Le,Se,Ts,$e,j,Ae,st,ht,Me,qs,He,vo,di,Is,Fo,go,ci,Bs,ke,q,S,Wt,Gt,lt,bo,Mt,Ee,dt,Yt,Ht,B,yo,pi,xo,mi,Vs,Ro,Ds,Wo,kt,ys,Os,Te,U,qe,Ie,Be,Ut,Kt,Xt,ct,ot,Ps,Ns,Ve,_o,ui,zs,Go,wo,fi,De,Oe,Pe,Ne,F,Et,Jt,Qt,te,ze,Ze,K,je,Co,vi,Lo,gi,So,bi,ee,ho,Zs,Fe,Re,We,Ge,Ye,Ue,Ke,Xe,Je,Qe,M,ts,es,pt,se,it,V,mt,ut,ss,X,os,is,rs,js,Fs,Rs,ns,Tt,oe,ie,re,Ws,Gs,$o,yi,Ys,Yo,Us,Uo,Ao,xi,Mo,_i,Ks,Ko,ne,lo,Ho,wi,Xs,as,ae,hs,ls,ds,qt,Js,Qs,to,cs,J,It,eo,he,Q,ft,vt,ps,so,Xo,ko,Ci,oo,ms,us,le,fs,vs,gs,gt,rt,bs,N,pe,qo,de,ce,io,Jo,ro,Qo;const _=window.HArvest;if(!_||!_.renderers||!_.renderers.BaseCard){console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");return}const b=_.renderers.BaseCard,u=window.HArvest.esc;function nt(a,c){let e=null,s=null,r=null;function n(...h){s=this,r=h,e&&clearTimeout(e),e=setTimeout(()=>{e=null,a.apply(s,r),r=null},c)}return n.flush=function(){e!==null&&(clearTimeout(e),e=null,r&&(a.apply(s,r),r=null))},n}function C(a){return a?a.charAt(0).toUpperCase()+a.slice(1).replace(/_/g," "):""}function cr(a,c,e){return Math.min(e,Math.max(c,a))}function ti(a,c){const e=a.querySelector(".shroom-controls-shell");e&&e.setAttribute("data-collapsed",String(c))}function me(a,c){a&&(a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-label",c),a.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),a.click())}))}function H(a){a.querySelectorAll("[part=companion]").forEach(c=>{c.title=c.getAttribute("aria-label")??"Companion"})}const Li={light:"var(--hrv-ex-shroom-light, #ff9800)",switch:"var(--hrv-ex-shroom-switch, #2196f3)",input_boolean:"var(--hrv-ex-shroom-switch, #2196f3)",fan:"var(--hrv-ex-shroom-fan, #4caf50)",climate:"var(--hrv-ex-shroom-climate, #ff5722)",cover:"var(--hrv-ex-shroom-cover, #9c27b0)",media_player:"var(--hrv-ex-shroom-media, #e91e63)",sensor:"var(--hrv-ex-shroom-sensor, #03a9f4)",binary_sensor:"var(--hrv-ex-shroom-binary, #8bc34a)",input_number:"var(--hrv-ex-shroom-input, #00bcd4)",input_select:"var(--hrv-ex-shroom-input, #00bcd4)",timer:"var(--hrv-ex-shroom-timer, #673ab7)",remote:"var(--hrv-ex-shroom-remote, #607d8b)",weather:"var(--hrv-ex-shroom-weather, #ff9800)",harvest_action:"var(--hrv-ex-shroom-action, #9c27b0)"};function ei(a){return Li[a]??"var(--hrv-color-primary, #ff9800)"}function $(a,c,e){if(!a)return;const s=ei(c);e?(a.style.background=`color-mix(in srgb, ${s} 20%, transparent)`,a.style.color=s):(a.style.background="var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))",a.style.color="var(--hrv-color-icon, #757575)")}function k(a){const c=(a.config.displayHints??a.def.display_hints??{}).layout??null,e=a.root.host;e&&(c==="vertical"?e.setAttribute("data-layout","vertical"):e.removeAttribute("data-layout"))}function Si(a){if(!a)return()=>{};const c=80,e=1.6,s=.96,r=.04;let n=null,h=0,d=0,p=0,m=!1,y=0;const g=[],f=()=>{y&&(cancelAnimationFrame(y),y=0)},I=v=>{for(;g.length&&g[0].t<v-c;)g.shift();if(g.length<2)return 0;const L=g[0],W=g[g.length-1],ao=W.t-L.t;return ao<=0?0:(W.x-L.x)/ao},R=()=>{if(Math.abs(p)<r)return;let v=performance.now();const L=W=>{const ao=W-v;if(v=W,a.scrollLeft-=p*ao,p*=Math.pow(s,ao/16),Math.abs(p)<r){y=0,p=0;return}const dr=a.scrollWidth-a.clientWidth;if(a.scrollLeft<=0||a.scrollLeft>=dr){y=0,p=0;return}y=requestAnimationFrame(L)};y=requestAnimationFrame(L)},no=v=>{if(a.scrollWidth<=a.clientWidth||v.pointerType==="touch")return;const L=v.target;if(!(L&&L!==a&&L.closest?.("button, a"))){f(),n=v.pointerId,h=v.clientX,d=a.scrollLeft,p=0,m=!1,g.length=0,g.push({x:v.clientX,t:v.timeStamp});try{a.setPointerCapture(n)}catch{}}},Do=v=>{if(v.pointerId!==n)return;const L=v.clientX-h;Math.abs(L)>4&&(m=!0,a.dataset.dragging="true"),a.scrollLeft=d-L,g.push({x:v.clientX,t:v.timeStamp});const W=v.timeStamp-c;for(;g.length>2&&g[0].t<W;)g.shift()},x=v=>{if(v.pointerId===n){try{a.releasePointerCapture(n)}catch{}if(n=null,m){const L=W=>{W.stopPropagation(),W.preventDefault()};window.addEventListener("click",L,{capture:!0,once:!0}),requestAnimationFrame(()=>a.removeAttribute("data-dragging")),p=I(v.timeStamp)*e,R()}g.length=0}};return a.addEventListener("pointerdown",no),a.addEventListener("pointermove",Do),a.addEventListener("pointerup",x),a.addEventListener("pointercancel",x),a.addEventListener("wheel",f,{passive:!0}),a.addEventListener("touchstart",f,{passive:!0}),()=>{f(),a.removeEventListener("pointerdown",no),a.removeEventListener("pointermove",Do),a.removeEventListener("pointerup",x),a.removeEventListener("pointercancel",x),a.removeEventListener("wheel",f),a.removeEventListener("touchstart",f)}}function si(a,c){if(a!=="on")return null;if(c.rgb_color){const[s,r,n]=c.rgb_color;return(.299*s+.587*r+.114*n)/255>.85?`rgb(${Math.round(s*.8)}, ${Math.round(r*.8)}, ${Math.round(n*.75)})`:`rgb(${s}, ${r}, ${n})`}if(c.hs_color)return`hsl(${c.hs_color[0]}, ${Math.max(c.hs_color[1],50)}%, 55%)`;const e=c.color_temp_kelvin??(c.color_temp?Math.round(1e6/c.color_temp):null);return e?e>=5200?"#4ba3e0":e>=4500?"#e0c85a":e<=3e3?"#e6a040":"#ddb840":null}const E=`
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
  `,Io=`
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
  `,xs=`
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
  `,$i=`
    ${E}
    ${T}
  `;class oi extends b{constructor(){super(...arguments);o(this,ws,null);o(this,ue,null);o(this,yt,!1)}render(){k(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${$i}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,ws,this.root.querySelector(".shroom-icon-shape")),i(this,ue,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline"),"card-icon");const s=this.root.querySelector(".shroom-state-item");e&&(me(s,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand("toggle",{})}})),this.renderCompanions(),H(this.root)}applyState(e,s){i(this,yt,e==="on");const r=this.def.domain??"switch";$(t(this,ws),r,t(this,yt)),t(this,ue)&&(t(this,ue).textContent=C(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,yt)));const h=t(this,yt)?this.resolveIcon(this.def.icon,"mdi:toggle-switch"):this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="toggle"||e==="turn_on"||e==="turn_off"?{state:e==="toggle"?t(this,yt)?"off":"on":e==="turn_on"?"on":"off",attributes:{}}:null}}ws=new WeakMap,ue=new WeakMap,yt=new WeakMap;const _s=["brightness","temp","color"],Ai={brightness:"mdi:brightness-4",temp:"mdi:thermometer",color:"mdi:palette"},Mi=`
    ${E}
    ${Io}
    ${xs}
    ${bt}
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
  `;class Hi extends b{constructor(e,s,r,n){super(e,s,r,n);o(this,Ls);o(this,Ss);o(this,mo);o(this,xt,null);o(this,Bt,null);o(this,A,null);o(this,Cs,null);o(this,_t,null);o(this,Vt,null);o(this,Dt,[]);o(this,G,0);o(this,Ot,4e3);o(this,Pt,0);o(this,D,!1);o(this,O,0);o(this,wt,2e3);o(this,fe,6500);o(this,Nt,{});o(this,ve,void 0);i(this,ve,nt(l(this,mo,ai).bind(this),300))}render(){k(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??{},n=r.show_brightness!==!1&&s.includes("brightness"),h=r.show_color_temp!==!1&&s.includes("color_temp"),d=r.show_rgb!==!1&&s.includes("rgb_color"),p=e&&(n||h||d),m=[n,h,d].filter(Boolean).length;i(this,wt,this.def.feature_config?.min_color_temp_kelvin??2e3),i(this,fe,this.def.feature_config?.max_color_temp_kelvin??6500);const y=[n,h,d];y[t(this,O)]||(i(this,O,y.findIndex(Boolean)),t(this,O)===-1&&i(this,O,0)),this.root.innerHTML=`
        <style>${Mi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${p?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-light-controls-row">
                <div class="shroom-slider-wrap shroom-light-slider-wrap">
                  <div class="shroom-slider-bg shroom-brightness-bg"></div>
                  <div class="shroom-slider-cover" style="left:0%"></div>
                  <div class="shroom-slider-edge" style="left:0%;display:none"></div>
                  <input type="range" class="shroom-slider-input" min="0" max="100"
                    step="1" value="0"
                    aria-label="${u(this.def.friendly_name)} level"
                    aria-valuetext="0%">
                  <div class="shroom-slider-focus-ring"></div>
                </div>
                ${m>1?`
                  <div class="shroom-light-mode-btns">
                    ${n?'<button class="shroom-light-mode-btn" data-mode="brightness" type="button" aria-label="Brightness"><span part="light-mode-brightness"></span></button>':""}
                    ${h?'<button class="shroom-light-mode-btn" data-mode="temp" type="button" aria-label="Color temperature"><span part="light-mode-temp"></span></button>':""}
                    ${d?'<button class="shroom-light-mode-btn" data-mode="color" type="button" aria-label="Color"><span part="light-mode-color"></span></button>':""}
                  </div>
                `:""}
              </div>
            </div>
          `:e?"":`
            <div class="shroom-light-ro">-</div>
          `}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,xt,this.root.querySelector(".shroom-icon-shape")),i(this,Bt,this.root.querySelector(".shroom-secondary")),i(this,A,this.root.querySelector(".shroom-slider-input")),i(this,Cs,this.root.querySelector(".shroom-slider-bg")),i(this,_t,this.root.querySelector(".shroom-slider-cover")),i(this,Vt,this.root.querySelector(".shroom-slider-edge")),i(this,Dt,[...this.root.querySelectorAll(".shroom-light-mode-btn")]),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon");for(const f of t(this,Dt))this.renderIcon(Ai[f.dataset.mode]??"mdi:help-circle",`light-mode-${f.dataset.mode}`);const g=this.root.querySelector(".shroom-state-item");e&&(me(g,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(g,{onTap:()=>{const f=this.config.gestureConfig?.tap;if(f){this._runAction(f);return}this.config.card?.sendCommand("toggle",{})}}));for(const f of t(this,Dt))f.addEventListener("click",()=>{const I=f.dataset.mode,R=_s.indexOf(I);R===-1||R===t(this,O)||(i(this,O,R),l(this,Ls,Po).call(this))});t(this,A)&&(t(this,A).addEventListener("input",()=>{const f=parseInt(t(this,A).value,10),I=_s[t(this,O)]??"brightness";I==="brightness"?i(this,G,f):I==="temp"?i(this,Ot,Math.round(t(this,wt)+f/100*(t(this,fe)-t(this,wt)))):i(this,Pt,Math.round(f*3.6)),l(this,Ss,No).call(this),t(this,ve).call(this,I)}),this.guardSlider(t(this,A),t(this,ve))),this.renderCompanions(),H(this.root)}applyState(e,s){i(this,D,e==="on"),i(this,Nt,s),ti(this.root,!t(this,D));const r=si(e,s);t(this,D)&&r?t(this,xt)&&(t(this,xt).style.background=`color-mix(in srgb, ${r} 20%, transparent)`,t(this,xt).style.color=r):$(t(this,xt),"light",t(this,D)),i(this,G,s.brightness!=null?Math.round(s.brightness/255*100):0),i(this,Ot,s.color_temp_kelvin??(s.color_temp?Math.round(1e6/s.color_temp):4e3)),i(this,Pt,s.hs_color?.[0]??42),t(this,Bt)&&(t(this,D)&&s.brightness!=null?t(this,Bt).textContent=`${t(this,G)}%`:t(this,Bt).textContent=C(e));const n=this.root.querySelector(".shroom-light-ro");n&&(n.textContent=t(this,D)&&s.brightness!=null?`${t(this,G)}%`:C(e));const h=this.root.querySelector(".shroom-slider-wrap");if(h){const m=si("on",s);h.style.setProperty("--shroom-light-accent",m??"var(--hrv-ex-shroom-light, #ff9800)")}l(this,Ls,Po).call(this);const d=this.root.querySelector(".shroom-state-item");if(d?.hasAttribute("role")&&d.setAttribute("aria-pressed",String(t(this,D))),t(this,A)){const m=_s[t(this,O)]??"brightness",y=parseInt(t(this,A).value,10);m==="brightness"?t(this,A).setAttribute("aria-valuetext",`${y}%`):m==="temp"?t(this,A).setAttribute("aria-valuetext",`${y}K`):t(this,A).setAttribute("aria-valuetext",`${y}`)}const p=t(this,D)?this.resolveIcon(this.def.icon,"mdi:lightbulb"):this.resolveIcon(this.def.icon,"mdi:lightbulb-off");this.renderIcon(p,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}${t(this,D)?`, ${t(this,G)}%`:""}`)}predictState(e,s){if(e==="toggle")return{state:t(this,D)?"off":"on",attributes:t(this,Nt)};if(e==="turn_on"){const r={...t(this,Nt)};return s.brightness!=null&&(r.brightness=s.brightness),s.color_temp_kelvin!=null&&(r.color_temp_kelvin=s.color_temp_kelvin),s.hs_color!=null&&(r.hs_color=s.hs_color),{state:"on",attributes:r}}return e==="turn_off"?{state:"off",attributes:t(this,Nt)}:null}}xt=new WeakMap,Bt=new WeakMap,A=new WeakMap,Cs=new WeakMap,_t=new WeakMap,Vt=new WeakMap,Dt=new WeakMap,G=new WeakMap,Ot=new WeakMap,Pt=new WeakMap,D=new WeakMap,O=new WeakMap,wt=new WeakMap,fe=new WeakMap,Nt=new WeakMap,ve=new WeakMap,Ls=new WeakSet,Po=function(){const e=_s[t(this,O)]??"brightness",s=t(this,Cs);s?.classList.remove("shroom-brightness-bg","shroom-ct-bg","shroom-hue-bg"),e==="brightness"?s?.classList.add("shroom-brightness-bg"):e==="temp"?s?.classList.add("shroom-ct-bg"):s?.classList.add("shroom-hue-bg");for(const r of t(this,Dt))r.hidden=r.dataset.mode===e;l(this,Ss,No).call(this)},Ss=new WeakSet,No=function(){const e=_s[t(this,O)]??"brightness";let s=0;e==="brightness"?s=t(this,G):e==="temp"?s=Math.round((t(this,Ot)-t(this,wt))/(t(this,fe)-t(this,wt))*100):s=Math.round(t(this,Pt)/3.6);const r=e==="brightness";t(this,_t)&&(r?(t(this,_t).style.display="",t(this,_t).style.left=`${s}%`):t(this,_t).style.display="none"),t(this,Vt)&&(t(this,Vt).style.display=r?"none":"",r||(t(this,Vt).style.left=`${s}%`)),t(this,A)&&!this.isSliderActive(t(this,A))&&(t(this,A).value=String(s))},mo=new WeakSet,ai=function(e){e==="brightness"?t(this,G)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:Math.round(t(this,G)*2.55)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,Ot)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,Pt),100]})};const ki={temperature:"var(--hrv-ex-shroom-climate, #ff5722)",humidity:"var(--hrv-ex-shroom-sensor, #03a9f4)",battery:"var(--hrv-ex-shroom-fan, #4caf50)"},Ei={temperature:"mdi:thermometer",humidity:"mdi:water-percent",battery:"mdi:battery"};function Ti(a){return a==null||isNaN(a)||a>=90?"mdi:battery":a>=70?"mdi:battery-70":a>=50?"mdi:battery-50":a>=30?"mdi:battery-30":a>=10?"mdi:battery-10":"mdi:battery-alert"}function qi(a){return a==null||isNaN(a)?"var(--hrv-ex-shroom-fan, #4caf50)":a<=10?"var(--hrv-color-error, #f44336)":a<=20?"var(--hrv-color-warning, #ff9800)":"var(--hrv-ex-shroom-fan, #4caf50)"}const Ii=`
    ${E}
    ${T}
  `;class co extends b{constructor(){super(...arguments);o(this,tt,null);o(this,zt,null);o(this,ge,null)}render(){k(this),i(this,ge,this.def.device_class??null);const e=Ei[t(this,ge)]??"mdi:gauge";this.root.innerHTML=`
        <style>${Ii}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,tt,this.root.querySelector(".shroom-icon-shape")),i(this,zt,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,e),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){const r=parseFloat(e),n=this.def.unit_of_measurement??"",h=!isNaN(r),d=t(this,ge);if(t(this,zt))if(h){const p=s.suggested_display_precision,m=p!=null?r.toFixed(p):String(Math.round(r*10)/10);t(this,zt).textContent=n?`${m} ${n}`:m}else t(this,zt).textContent=C(e);if(d==="battery"&&h){const p=qi(r);t(this,tt)&&(t(this,tt).style.background=`color-mix(in srgb, ${p} 20%, transparent)`,t(this,tt).style.color=p),this.renderIcon(this.resolveIcon(this.def.icon,Ti(r)),"card-icon")}else{const p=ki[d]??ei("sensor");t(this,tt)&&(t(this,tt).style.background=`color-mix(in srgb, ${p} 20%, transparent)`,t(this,tt).style.color=p)}this.announceState(`${this.def.friendly_name}, ${h?r:e} ${n}`)}}tt=new WeakMap,zt=new WeakMap,ge=new WeakMap;const Bi=`
    ${E}
    ${Io}
    ${xs}
    ${bt}
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
  `;class Vi extends b{constructor(e,s,r,n){super(e,s,r,n);o(this,xe);o(this,uo);o(this,As);o(this,Ms);o(this,Hs);o(this,_e);o(this,fo);o(this,at,null);o(this,Zt,null);o(this,z,null);o(this,be,null);o(this,Ct,null);o(this,Lt,null);o(this,St,null);o(this,P,!1);o(this,w,0);o(this,jt,!1);o(this,$t,"forward");o(this,At,null);o(this,Y,[]);o(this,ye,void 0);o(this,$s,!1);o(this,Ft,!1);i(this,ye,nt(l(this,fo,li).bind(this),300)),i(this,Y,e.feature_config?.preset_modes??[])}render(){k(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},n=r.display_mode??null;let h=s.includes("set_speed");const d=r.show_oscillate!==!1&&s.includes("oscillate"),p=r.show_direction!==!1&&s.includes("direction"),m=r.show_presets!==!1&&s.includes("preset_mode");n==="on-off"&&(h=!1);let y=e&&h,g=y&&t(this,uo,hi),f=!1,I=!1;n==="continuous"?g=!1:n==="stepped"?I=g:n==="cycle"?(g=!0,f=!0):g&&t(this,Y).length?f=!0:g&&(I=!0),i(this,$s,f);const R=e&&(d||p||m);this.root.innerHTML=`
        <style>${Bi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${y||R?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${y&&!g?`
                  <div class="shroom-fan-speed-row">
                    <div class="shroom-slider-wrap">
                      <div class="shroom-slider-bg shroom-fan-slider-bg"></div>
                      <div class="shroom-slider-cover" style="left:0%"></div>
                      <input type="range" class="shroom-slider-input" min="0" max="100"
                        step="1" value="0"
                        aria-label="${u(this.def.friendly_name)} speed"
                        aria-valuetext="0%">
                      <div class="shroom-slider-focus-ring"></div>
                    </div>
                  </div>
                `:""}
                ${y&&I?`
                  <div class="shroom-fan-step-dots">
                    ${t(this,As,zo).map((x,v)=>`
                      <button class="shroom-fan-step-dot" data-pct="${x}" type="button"
                        data-active="false"
                        aria-label="Speed ${v+1} (${x}%)"
                        title="Speed ${v+1} (${x}%)">${v+1}</button>
                    `).join("")}
                  </div>
                `:""}
                ${y&&f?`
                  <div style="display:flex;justify-content:center;">
                    <button class="shroom-fan-cycle-btn" type="button"
                      title="Cycle speed"
                      aria-label="Cycle fan speed">
                      <svg viewBox="0 0 24 24"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg>
                    </button>
                  </div>
                `:""}
                ${R?`
                  <div class="shroom-fan-feat-row">
                    ${d?'<button class="shroom-btn shroom-fan-feat" data-feat="oscillate" type="button" aria-label="Oscillate" aria-pressed="false">Oscillate</button>':""}
                    ${p?'<button class="shroom-btn shroom-fan-feat" data-feat="direction" type="button" aria-label="Direction: forward">Forward</button>':""}
                    ${m?'<button class="shroom-btn shroom-fan-feat" data-feat="preset" type="button" aria-label="Preset">Preset</button>':""}
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
      `,i(this,at,this.root.querySelector(".shroom-icon-shape")),i(this,Zt,this.root.querySelector(".shroom-secondary")),i(this,z,this.root.querySelector(".shroom-slider-input")),i(this,be,this.root.querySelector(".shroom-slider-cover")),i(this,Ct,this.root.querySelector('[data-feat="oscillate"]')),i(this,Lt,this.root.querySelector('[data-feat="direction"]')),i(this,St,this.root.querySelector('[data-feat="preset"]')),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"card-icon");const no=this.root.querySelector(".shroom-state-item");e&&(me(no,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(no,{onTap:()=>{const x=this.config.gestureConfig?.tap;if(x){this._runAction(x);return}this.config.card?.sendCommand("toggle",{})}})),t(this,z)&&(t(this,z).addEventListener("input",()=>{const x=Number(t(this,z).value);i(this,w,x),t(this,z).setAttribute("aria-valuetext",`${Math.round(x)}%`),l(this,Ms,Zo).call(this),t(this,ye).call(this)}),this.guardSlider(t(this,z),t(this,ye))),this.root.querySelectorAll(".shroom-fan-step-dot").forEach(x=>{x.addEventListener("click",()=>{const v=Number(x.getAttribute("data-pct"));i(this,w,v),i(this,P,!0),l(this,Hs,jo).call(this),this.config.card?.sendCommand("set_percentage",{percentage:v})})}),this.root.querySelector(".shroom-fan-cycle-btn")?.addEventListener("click",()=>{const x=t(this,As,zo);if(!x.length)return;let v;if(!t(this,P)||t(this,w)===0)v=x[0];else{const L=x.findIndex(W=>W>t(this,w));v=L===-1?x[0]:x[L]}i(this,w,v),i(this,P,!0),this.config.card?.sendCommand("set_percentage",{percentage:v})}),t(this,Ct)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,jt)})}),t(this,Lt)?.addEventListener("click",()=>{const x=t(this,$t)==="forward"?"reverse":"forward";i(this,$t,x),l(this,_e,To).call(this),this.config.card?.sendCommand("set_direction",{direction:x})}),t(this,St)?.addEventListener("click",()=>{if(!t(this,Y).length)return;const v=((t(this,At)?t(this,Y).indexOf(t(this,At)):-1)+1)%t(this,Y).length,L=t(this,Y)[v];i(this,At,L),l(this,_e,To).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:L})}),this.renderCompanions(),H(this.root)}applyState(e,s){i(this,P,e==="on"),i(this,w,s?.percentage??0),i(this,jt,s?.oscillating??!1),i(this,$t,s?.direction??"forward"),i(this,At,s?.preset_mode??null),s?.preset_modes?.length&&i(this,Y,s.preset_modes),i(this,Ft,t(this,$s)||s?.assumed_state===!0),ti(this.root,!t(this,P)),$(t(this,at),"fan",t(this,P));const r=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??"mdi:fan";if(this.renderIcon(this.resolveIcon(r,"mdi:fan"),"card-icon"),t(this,at))if(t(this,P)&&t(this,w)>0&&!t(this,Ft)&&this.config.animate!==!1){const h=1/(1.5*Math.pow(t(this,w)/100,.5));t(this,at).setAttribute("data-spinning","true"),t(this,at).style.setProperty("--shroom-fan-duration",`${h.toFixed(2)}s`)}else t(this,at).setAttribute("data-spinning","false");t(this,Zt)&&(t(this,P)&&t(this,w)>0&&!t(this,Ft)?t(this,Zt).textContent=`${Math.round(t(this,w))}%`:t(this,Zt).textContent=C(e)),l(this,Ms,Zo).call(this),l(this,Hs,jo).call(this),l(this,_e,To).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,w)>0&&!t(this,Ft)?`, ${Math.round(t(this,w))}%`:""))}predictState(e,s){return e==="toggle"?{state:t(this,P)?"off":"on",attributes:{percentage:t(this,w)}}:e==="set_percentage"?{state:"on",attributes:{percentage:s.percentage,oscillating:t(this,jt),direction:t(this,$t),preset_mode:t(this,At),preset_modes:t(this,Y)}}:e==="oscillate"?{state:"on",attributes:{percentage:t(this,w),oscillating:s.oscillating,direction:t(this,$t)}}:e==="set_direction"?{state:"on",attributes:{percentage:t(this,w),oscillating:t(this,jt),direction:s.direction}}:null}}at=new WeakMap,Zt=new WeakMap,z=new WeakMap,be=new WeakMap,Ct=new WeakMap,Lt=new WeakMap,St=new WeakMap,P=new WeakMap,w=new WeakMap,jt=new WeakMap,$t=new WeakMap,At=new WeakMap,Y=new WeakMap,ye=new WeakMap,$s=new WeakMap,Ft=new WeakMap,xe=new WeakSet,Eo=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},uo=new WeakSet,hi=function(){return t(this,xe,Eo)>1},As=new WeakSet,zo=function(){const e=t(this,xe,Eo),s=[];for(let r=1;r*e<=100.001;r++)s.push(r*e);return s},Ms=new WeakSet,Zo=function(){if(!t(this,z))return;const e=t(this,w);this.isSliderActive(t(this,z))||(t(this,z).value=String(e)),t(this,be)&&(t(this,be).style.left=`${e}%`)},Hs=new WeakSet,jo=function(){const e=t(this,xe,Eo)/2;this.root.querySelectorAll(".shroom-fan-step-dot").forEach(s=>{const r=Number(s.getAttribute("data-pct"));s.setAttribute("data-active",String(t(this,P)&&t(this,w)>=r-e))})},_e=new WeakSet,To=function(){t(this,Ct)&&(t(this,Ct).setAttribute("aria-pressed","false"),t(this,Ct).textContent="Oscillate"),t(this,Lt)&&(t(this,Lt).textContent="Direction",t(this,Lt).setAttribute("aria-label","Direction")),t(this,St)&&(t(this,St).textContent="Preset",t(this,St).setAttribute("data-active","false"))},fo=new WeakSet,li=function(){t(this,w)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,w)})};const Di=`
    ${E}
    ${T}
  `;class Oi extends b{constructor(){super(...arguments);o(this,ks,null);o(this,we,null)}render(){k(this),this.root.innerHTML=`
        <style>${Di}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,ks,this.root.querySelector(".shroom-icon-shape")),i(this,we,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.def.icon_state_map?.off??this.resolveIcon(this.def.icon,"mdi:radiobox-blank"),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){const r=e==="on";$(t(this,ks),"binary_sensor",r);const n=this.formatStateLabel(e);t(this,we)&&(t(this,we).textContent=n);const h=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,r?"mdi:radiobox-marked":"mdi:radiobox-blank");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${n}`)}}ks=new WeakMap,we=new WeakMap;const Pi=`
    ${E}
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
  `;class Ni extends b{constructor(){super(...arguments);o(this,Es,null);o(this,Ce,null);o(this,Z,null);o(this,et,!1);o(this,Rt,!1)}render(){k(this);const e=this.def.capabilities==="read-write";i(this,Rt,!1),this.root.innerHTML=`
        <style>${Pi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <button class="shroom-generic-toggle" type="button" data-on="false"
              title="Toggle" aria-label="${u(this.def.friendly_name)} - Toggle"
              hidden>Toggle</button>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Es,this.root.querySelector(".shroom-icon-shape")),i(this,Ce,this.root.querySelector(".shroom-secondary")),i(this,Z,this.root.querySelector(".shroom-generic-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:help-circle"),"card-icon"),t(this,Z)&&e&&this._attachGestureHandlers(t(this,Z),{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),H(this.root)}applyState(e,s){const r=e==="on"||e==="off";i(this,et,e==="on"),t(this,Ce)&&(t(this,Ce).textContent=C(e));const n=this.def.domain??"generic";$(t(this,Es),n,t(this,et)),t(this,Z)&&(r&&!t(this,Rt)&&(t(this,Z).removeAttribute("hidden"),i(this,Rt,!0)),t(this,Rt)&&(t(this,Z).setAttribute("data-on",String(t(this,et))),t(this,Z).setAttribute("aria-pressed",String(t(this,et))),t(this,Z).textContent=t(this,et)?"On":"Off",t(this,Z).title=t(this,et)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e!=="toggle"?null:{state:t(this,et)?"off":"on",attributes:{}}}}Es=new WeakMap,Ce=new WeakMap,Z=new WeakMap,et=new WeakMap,Rt=new WeakMap;const zi=`
    ${E}
    ${T}
  `;class Zi extends b{constructor(){super(...arguments);o(this,Le,null);o(this,Se,null)}render(){k(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${zi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Le,this.root.querySelector(".shroom-icon-shape")),i(this,Se,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.def.icon_state_map?.idle??this.resolveIcon(this.def.icon,"mdi:play"),"card-icon"),$(t(this,Le),"harvest_action",!1);const s=this.root.querySelector(".shroom-state-item");e&&(me(s,`${this.def.friendly_name} - Trigger`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand("trigger",{})}})),this.renderCompanions(),H(this.root)}applyState(e,s){const r=e==="triggered";t(this,Se)&&(t(this,Se).textContent=C(e)),$(t(this,Le),"harvest_action",r);const n=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,"mdi:play");this.renderIcon(n,"card-icon"),this.announceState(`${this.def.friendly_name}, ${C(e)}`)}predictState(e,s){return e!=="trigger"?null:{state:"triggered",attributes:{}}}}Le=new WeakMap,Se=new WeakMap;const ji=`
    ${E}
    ${Io}
    ${xs}
    ${bt}
    ${T}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }
  `;class Fi extends b{constructor(e,s,r,n){super(e,s,r,n);o(this,vo);o(this,Is);o(this,go);o(this,Ts,null);o(this,$e,null);o(this,j,null);o(this,Ae,null);o(this,st,0);o(this,ht,0);o(this,Me,100);o(this,qs,1);o(this,He,void 0);i(this,He,nt(l(this,go,ci).bind(this),300))}render(){k(this);const e=this.def.capabilities==="read-write";if(i(this,ht,this.def.feature_config?.min??0),i(this,Me,this.def.feature_config?.max??100),i(this,qs,this.def.feature_config?.step??1),this.root.innerHTML=`
        <style>${ji}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-controls-shell" data-collapsed="false">
              <div class="shroom-slider-wrap">
                <div class="shroom-slider-bg shroom-num-slider-bg"></div>
                <div class="shroom-slider-cover" style="left:0%"></div>
                <input type="range" class="shroom-slider-input"
                  min="${t(this,ht)}" max="${t(this,Me)}" step="${t(this,qs)}" value="${t(this,ht)}"
                  aria-label="${u(this.def.friendly_name)} value"
                  aria-valuetext="${t(this,ht)}${this.def.unit_of_measurement?` ${u(this.def.unit_of_measurement)}`:""}">
                <div class="shroom-slider-focus-ring"></div>
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Ts,this.root.querySelector(".shroom-icon-shape")),i(this,$e,this.root.querySelector(".shroom-secondary")),i(this,j,this.root.querySelector(".shroom-slider-input")),i(this,Ae,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:ray-vertex"),"card-icon"),$(t(this,Ts),"input_number",!0),t(this,j)){const s=this.def.unit_of_measurement??"";t(this,j).addEventListener("input",()=>{i(this,st,parseFloat(t(this,j).value)),t(this,j).setAttribute("aria-valuetext",`${t(this,st)}${s?` ${s}`:""}`),l(this,Is,Fo).call(this),t(this,He).call(this)}),this.guardSlider(t(this,j),t(this,He))}this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){const r=parseFloat(e);if(isNaN(r))return;i(this,st,r),l(this,Is,Fo).call(this);const n=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${n?` ${n}`:""}`)}predictState(e,s){return e==="set_value"&&s.value!==void 0?{state:String(s.value),attributes:{}}:null}}Ts=new WeakMap,$e=new WeakMap,j=new WeakMap,Ae=new WeakMap,st=new WeakMap,ht=new WeakMap,Me=new WeakMap,qs=new WeakMap,He=new WeakMap,vo=new WeakSet,di=function(e){const s=t(this,Me)-t(this,ht);return s===0?0:Math.max(0,Math.min(100,(e-t(this,ht))/s*100))},Is=new WeakSet,Fo=function(){const e=l(this,vo,di).call(this,t(this,st));t(this,Ae)&&(t(this,Ae).style.left=`${e}%`),t(this,j)&&!this.isSliderActive(t(this,j))&&(t(this,j).value=String(t(this,st)));const s=this.def.unit_of_measurement??"";t(this,$e)&&(t(this,$e).textContent=`${t(this,st)}${s?` ${s}`:""}`)},go=new WeakSet,ci=function(){this.config.card?.sendCommand("set_value",{value:t(this,st)})};const Ri=`
    ${E}
    ${bt}
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
  `;class ii extends b{constructor(){super(...arguments);o(this,yo);o(this,xo);o(this,Vs);o(this,Ds);o(this,kt);o(this,Bs,null);o(this,ke,null);o(this,q,null);o(this,S,null);o(this,Wt,null);o(this,Gt,[]);o(this,lt,[]);o(this,bo,"");o(this,Mt,[]);o(this,Ee,"");o(this,dt,!1);o(this,Yt,"pills");o(this,Ht,null);o(this,B,null)}render(){k(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";i(this,Yt,s==="dropdown"?"dropdown":"pills"),i(this,Mt,this.def.feature_config?.options??[]);const r=e?t(this,Yt)==="dropdown"?`
            <div class="shroom-select-shell">
              <button class="shroom-select-current" type="button"
                aria-label="${u(this.def.friendly_name)}"
                aria-haspopup="listbox" aria-expanded="false">
                <span class="shroom-select-label">-</span>
                <span class="shroom-select-arrow" aria-hidden="true">&#9660;</span>
              </button>
              <div class="shroom-select-dropdown" role="listbox" popover="manual"></div>
            </div>`:`
            <div class="shroom-select-shell">
              <div class="shroom-select-grid"></div>
            </div>`:"";this.root.innerHTML=`
        <style>${Ri}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${r}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Bs,this.root.querySelector(".shroom-icon-shape")),i(this,ke,this.root.querySelector(".shroom-secondary")),i(this,q,this.root.querySelector(".shroom-select-current")),i(this,S,this.root.querySelector(".shroom-select-dropdown")),i(this,Wt,this.root.querySelector(".shroom-select-grid")),i(this,Gt,[]),i(this,lt,[]),i(this,Ee,""),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:form-select"),"card-icon"),$(t(this,Bs),"input_select",!0),t(this,q)&&e&&(t(this,q).addEventListener("click",n=>{n.stopPropagation(),t(this,dt)?l(this,kt,ys).call(this):l(this,Ds,Wo).call(this)}),t(this,q).addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" "||n.key==="ArrowDown")&&!t(this,dt)?(n.preventDefault(),l(this,Ds,Wo).call(this),t(this,lt)[0]?.focus()):n.key==="Escape"&&t(this,dt)&&(l(this,kt,ys).call(this),t(this,q).focus())}),i(this,Ht,n=>{t(this,dt)&&!this.root.host.contains(n.target)&&l(this,kt,ys).call(this)}),document.addEventListener("click",t(this,Ht))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){i(this,bo,e);const r=s?.options,n=Array.isArray(r)&&r.length?r:t(this,Mt);i(this,Mt,n),t(this,ke)&&(t(this,ke).textContent=e);const h=n.join("|");if(h!==t(this,Ee)&&(i(this,Ee,h),t(this,Yt)==="dropdown"?l(this,xo,mi).call(this,n):l(this,yo,pi).call(this,n)),t(this,Yt)==="dropdown"){const d=this.root.querySelector(".shroom-select-label");d&&(d.textContent=e);for(const p of t(this,lt)){const m=p.dataset.option===e;p.setAttribute("data-active",String(m)),p.setAttribute("aria-selected",String(m))}}else for(const d of t(this,Gt))d.setAttribute("data-active",String(d.dataset.option===e));this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="select_option"&&s.option!==void 0?{state:String(s.option),attributes:{options:t(this,Mt)}}:null}destroy(){t(this,Ht)&&(document.removeEventListener("click",t(this,Ht)),i(this,Ht,null)),t(this,B)&&(window.removeEventListener("scroll",t(this,B),!0),window.removeEventListener("resize",t(this,B)),i(this,B,null));try{t(this,S)?.hidePopover?.()}catch{}}}Bs=new WeakMap,ke=new WeakMap,q=new WeakMap,S=new WeakMap,Wt=new WeakMap,Gt=new WeakMap,lt=new WeakMap,bo=new WeakMap,Mt=new WeakMap,Ee=new WeakMap,dt=new WeakMap,Yt=new WeakMap,Ht=new WeakMap,B=new WeakMap,yo=new WeakSet,pi=function(e){if(t(this,Wt)){t(this,Wt).innerHTML="",i(this,Gt,[]);for(const s of e){const r=document.createElement("button");r.type="button",r.className="shroom-select-pill",r.dataset.option=s,r.textContent=C(s),r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s})}),t(this,Wt).appendChild(r),t(this,Gt).push(r)}}},xo=new WeakSet,mi=function(e){if(t(this,S)){t(this,S).innerHTML="",i(this,lt,[]);for(const s of e){const r=document.createElement("button");r.type="button",r.className="shroom-select-option",r.role="option",r.dataset.option=s,r.textContent=C(s),r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s}),l(this,kt,ys).call(this),t(this,q)?.focus()}),r.addEventListener("keydown",n=>{const h=t(this,lt),d=h.indexOf(r);n.key==="ArrowDown"?(n.preventDefault(),h[Math.min(d+1,h.length-1)]?.focus()):n.key==="ArrowUp"?(n.preventDefault(),d===0?t(this,q)?.focus():h[d-1]?.focus()):n.key==="Escape"&&(l(this,kt,ys).call(this),t(this,q)?.focus())}),t(this,S).appendChild(r),t(this,lt).push(r)}}},Vs=new WeakSet,Ro=function(){if(!t(this,S)||!t(this,q))return;const e=t(this,q).getBoundingClientRect(),s=window.innerHeight-e.bottom,r=e.top,n=Math.min(t(this,S).scrollHeight||240,240);t(this,S).style.left=`${Math.round(e.left)}px`,t(this,S).style.width=`${Math.round(e.width)}px`,s<n+8&&r>s?t(this,S).style.top=`${Math.max(8,Math.round(e.top-n-6))}px`:t(this,S).style.top=`${Math.round(e.bottom+6)}px`},Ds=new WeakSet,Wo=function(){if(!(!t(this,S)||!t(this,Mt).length)){try{typeof t(this,S).showPopover=="function"&&t(this,S).showPopover()}catch{}t(this,q)?.setAttribute("aria-expanded","true"),l(this,Vs,Ro).call(this),i(this,B,()=>l(this,Vs,Ro).call(this)),window.addEventListener("scroll",t(this,B),!0),window.addEventListener("resize",t(this,B)),i(this,dt,!0)}},kt=new WeakSet,ys=function(){try{typeof t(this,S)?.hidePopover=="function"&&t(this,S).hidePopover()}catch{}t(this,q)?.setAttribute("aria-expanded","false"),t(this,B)&&(window.removeEventListener("scroll",t(this,B),!0),window.removeEventListener("resize",t(this,B)),i(this,B,null)),i(this,dt,!1)};const Wi=`
    ${E}
    ${xs}
    ${bt}
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
  `;class Gi extends b{constructor(e,s,r,n){super(e,s,r,n);o(this,_o);o(this,zs);o(this,wo);o(this,Os,null);o(this,Te,null);o(this,U,null);o(this,qe,null);o(this,Ie,null);o(this,Be,null);o(this,Ut,null);o(this,Kt,null);o(this,Xt,null);o(this,ct,0);o(this,ot,!1);o(this,Ps,"closed");o(this,Ns,{});o(this,Ve,void 0);i(this,Ve,nt(l(this,wo,fi).bind(this),300))}render(){k(this);const e=this.def.capabilities==="read-write",r=(this.config.displayHints??{}).show_position!==!1&&this.def.supported_features?.includes("set_position"),n=!this.def.supported_features||this.def.supported_features.includes("buttons"),h=e&&(r||n);this.root.innerHTML=`
        <style>${Wi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${h?`
            <div class="shroom-cover-bar">
              ${r?`
                <div class="shroom-cover-slider-view">
                  <div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-cover-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <div class="shroom-slider-edge" style="left:0%"></div>
                    <input type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${u(this.def.friendly_name)} position"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>
                </div>
              `:""}
              ${n?`
                <div class="shroom-cover-btn-view"${r?" hidden":""}>
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
              ${r&&n?`
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
      `,i(this,Os,this.root.querySelector(".shroom-icon-shape")),i(this,Te,this.root.querySelector(".shroom-secondary")),i(this,U,this.root.querySelector(".shroom-slider-input")),i(this,qe,this.root.querySelector(".shroom-slider-cover")),i(this,Ie,this.root.querySelector(".shroom-cover-slider-view")),i(this,Be,this.root.querySelector(".shroom-cover-btn-view")),i(this,Ut,this.root.querySelector("[data-action=open]")),i(this,Kt,this.root.querySelector("[data-action=stop]")),i(this,Xt,this.root.querySelector("[data-action=close]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:window-shutter"),"card-icon"),t(this,U)&&(t(this,U).addEventListener("input",()=>{i(this,ct,parseInt(t(this,U).value,10)),l(this,zs,Go).call(this),t(this,Ve).call(this)}),this.guardSlider(t(this,U),t(this,Ve))),[t(this,Ut),t(this,Kt),t(this,Xt)].forEach(p=>{if(!p)return;const m=p.getAttribute("data-action");p.addEventListener("click",()=>{this.config.card?.sendCommand(`${m}_cover`,{})})});const d=this.root.querySelector(".shroom-cover-toggle-btn");d?.addEventListener("click",()=>{i(this,ot,!t(this,ot)),d.setAttribute("aria-expanded",String(t(this,ot))),d.setAttribute("aria-label",t(this,ot)?"Show position slider":"Show cover buttons"),l(this,_o,ui).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){i(this,Ps,e),i(this,Ns,{...s});const r=e==="open"||e==="opening";if($(t(this,Os),"cover",r),t(this,Te)){const d=s.current_position,p=C(e);t(this,Te).textContent=d!==void 0?`${p} - ${d}%`:p}const n=e==="opening"||e==="closing",h=s.current_position;t(this,Ut)&&(t(this,Ut).disabled=!n&&h===100),t(this,Kt)&&(t(this,Kt).disabled=!n),t(this,Xt)&&(t(this,Xt).disabled=!n&&e==="closed"),s.current_position!==void 0&&(i(this,ct,s.current_position),t(this,U)&&!this.isSliderActive(t(this,U))&&(t(this,U).value=String(t(this,ct))),l(this,zs,Go).call(this)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){const r={...t(this,Ns)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,Ps),attributes:r}:e==="set_cover_position"&&s.position!==void 0?(r.current_position=s.position,{state:s.position>0?"open":"closed",attributes:r}):null}}Os=new WeakMap,Te=new WeakMap,U=new WeakMap,qe=new WeakMap,Ie=new WeakMap,Be=new WeakMap,Ut=new WeakMap,Kt=new WeakMap,Xt=new WeakMap,ct=new WeakMap,ot=new WeakMap,Ps=new WeakMap,Ns=new WeakMap,Ve=new WeakMap,_o=new WeakSet,ui=function(){t(this,Ie)&&(t(this,Ie).hidden=t(this,ot)),t(this,Be)&&(t(this,Be).hidden=!t(this,ot));const e=this.root.querySelector(".shroom-cover-toggle-btn");e&&(e.innerHTML=t(this,ot)?'<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>')},zs=new WeakSet,Go=function(){t(this,qe)&&(t(this,qe).style.left=`${t(this,ct)}%`);const e=this.root.querySelector(".shroom-slider-edge");e&&(e.style.left=`${t(this,ct)}%`)},wo=new WeakSet,fi=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,ct)})};const Yi=`
    ${E}
    ${T}
  `;class Ui extends b{constructor(){super(...arguments);o(this,De,null);o(this,Oe,null)}render(){k(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Yi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,De,this.root.querySelector(".shroom-icon-shape")),i(this,Oe,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:remote"),"card-icon"),$(t(this,De),"remote",!1);const s=this.root.querySelector(".shroom-state-item");e&&(me(s,`${this.def.friendly_name} - Send command`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}const n=this.config.tapAction?.data?.command??"power",h=this.config.tapAction?.data?.device??void 0,d=h?{command:n,device:h}:{command:n};this.config.card?.sendCommand("send_command",d)}})),this.renderCompanions(),H(this.root)}applyState(e,s){const r=e==="on";$(t(this,De),"remote",r),t(this,Oe)&&(t(this,Oe).textContent=C(e));const n=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(n,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}De=new WeakMap,Oe=new WeakMap;function po(a){a<0&&(a=0);const c=Math.floor(a/3600),e=Math.floor(a%3600/60),s=Math.floor(a%60),r=n=>String(n).padStart(2,"0");return c>0?`${c}:${r(e)}:${r(s)}`:`${r(e)}:${r(s)}`}function ri(a){if(typeof a=="number")return a;if(typeof a!="string")return 0;const c=a.split(":").map(Number);return c.length===3?c[0]*3600+c[1]*60+c[2]:c.length===2?c[0]*60+c[1]:c[0]||0}const Ki=`
    ${E}
    ${bt}
    ${T}

    .shroom-timer-display {
      font-size: 28px;
      font-weight: 300;
      color: var(--hrv-color-text, #212121);
      text-align: center;
      display: block;
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      font-variant-numeric: tabular-nums;
    }
    .shroom-timer-display[data-paused=true] {
      opacity: 0.6;
    }
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
  `;class Xi extends b{constructor(){super(...arguments);o(this,Co);o(this,Lo);o(this,So);o(this,ee);o(this,Pe,null);o(this,Ne,null);o(this,F,null);o(this,Et,null);o(this,Jt,null);o(this,Qt,null);o(this,te,null);o(this,ze,"idle");o(this,Ze,{});o(this,K,null);o(this,je,null)}render(){k(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Ki}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span class="shroom-timer-display" title="Time remaining">00:00</span>
          ${e?`
            <div class="shroom-timer-controls">
              <button class="shroom-timer-btn" data-action="playpause" type="button"
                title="Start" aria-label="${u(this.def.friendly_name)} - Start">
                <span part="playpause-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="cancel" type="button"
                title="Cancel" aria-label="${u(this.def.friendly_name)} - Cancel">
                <span part="cancel-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="finish" type="button"
                title="Finish" aria-label="${u(this.def.friendly_name)} - Finish">
                <span part="finish-icon" aria-hidden="true"></span>
              </button>
            </div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Pe,this.root.querySelector(".shroom-icon-shape")),i(this,Ne,this.root.querySelector(".shroom-secondary")),i(this,F,this.root.querySelector(".shroom-timer-display")),i(this,Et,this.root.querySelector("[data-action=playpause]")),i(this,Jt,this.root.querySelector("[data-action=cancel]")),i(this,Qt,this.root.querySelector("[data-action=finish]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:timer-outline"),"card-icon"),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),$(t(this,Pe),"timer",!1),e&&(t(this,Et)?.addEventListener("click",()=>{const s=t(this,ze)==="active"?"pause":"start";this.config.card?.sendCommand(s,{})}),t(this,Jt)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,Qt)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){i(this,ze,e),i(this,Ze,{...s}),i(this,K,s.finishes_at??null),i(this,je,s.remaining!=null?ri(s.remaining):null);const r=e==="active";$(t(this,Pe),"timer",r||e==="paused"),t(this,Ne)&&(t(this,Ne).textContent=C(e)),l(this,Co,vi).call(this,e),l(this,Lo,gi).call(this,e),r&&t(this,K)?l(this,So,bi).call(this):l(this,ee,ho).call(this),t(this,F)&&t(this,F).setAttribute("data-paused",String(e==="paused"))}predictState(e,s){const r={...t(this,Ze)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,K)&&(r.remaining=Math.max(0,(new Date(t(this,K)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}Pe=new WeakMap,Ne=new WeakMap,F=new WeakMap,Et=new WeakMap,Jt=new WeakMap,Qt=new WeakMap,te=new WeakMap,ze=new WeakMap,Ze=new WeakMap,K=new WeakMap,je=new WeakMap,Co=new WeakSet,vi=function(e){const s=e==="idle",r=e==="active";if(t(this,Et)){const n=r?"mdi:pause":"mdi:play",h=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(n,"playpause-icon"),t(this,Et).title=h,t(this,Et).setAttribute("aria-label",`${this.def.friendly_name} - ${h}`)}t(this,Jt)&&(t(this,Jt).disabled=s),t(this,Qt)&&(t(this,Qt).disabled=s),this.announceState(`${this.def.friendly_name}, ${e}`)},Lo=new WeakSet,gi=function(e){if(t(this,F)){if(e==="idle"){const s=t(this,Ze).duration;t(this,F).textContent=s?po(ri(s)):"00:00";return}if(e==="paused"&&t(this,je)!=null){t(this,F).textContent=po(t(this,je));return}if(e==="active"&&t(this,K)){const s=Math.max(0,(new Date(t(this,K)).getTime()-Date.now())/1e3);t(this,F).textContent=po(s)}}},So=new WeakSet,bi=function(){l(this,ee,ho).call(this),i(this,te,setInterval(()=>{if(!t(this,K)||t(this,ze)!=="active"){l(this,ee,ho).call(this);return}const e=Math.max(0,(new Date(t(this,K)).getTime()-Date.now())/1e3);t(this,F)&&(t(this,F).textContent=po(e)),e<=0&&l(this,ee,ho).call(this)},1e3))},ee=new WeakSet,ho=function(){t(this,te)&&(clearInterval(t(this,te)),i(this,te,null))};const Ji=`
    ${E}
    ${bt}
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
  `;class Qi extends b{constructor(e,s,r,n){super(e,s,r,n);o(this,$o);o(this,Ys);o(this,Us);o(this,Ao);o(this,Mo);o(this,Ks);o(this,ne);o(this,Ho);o(this,Zs,null);o(this,Fe,null);o(this,Re,null);o(this,We,null);o(this,Ge,null);o(this,Ye,null);o(this,Ue,null);o(this,Ke,null);o(this,Xe,null);o(this,Je,null);o(this,Qe,null);o(this,M,null);o(this,ts,null);o(this,es,null);o(this,pt,null);o(this,se,null);o(this,it,null);o(this,V,null);o(this,mt,!1);o(this,ut,20);o(this,ss,null);o(this,X,"off");o(this,os,null);o(this,is,null);o(this,rs,null);o(this,js,16);o(this,Fs,32);o(this,Rs,.5);o(this,ns,"°C");o(this,Tt,[]);o(this,oe,[]);o(this,ie,[]);o(this,re,[]);o(this,Ws,{});o(this,Gs,void 0);i(this,Gs,nt(l(this,Ao,xi).bind(this),500))}render(){k(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),n=s.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),h=s.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),d=s.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);i(this,js,this.def.feature_config?.min_temp??16),i(this,Fs,this.def.feature_config?.max_temp??32),i(this,Rs,this.def.feature_config?.temp_step??.5),i(this,ns,this.def.unit_of_measurement??"°C"),i(this,Tt,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),i(this,oe,this.def.feature_config?.fan_modes??[]),i(this,ie,this.def.feature_config?.preset_modes??[]),i(this,re,this.def.feature_config?.swing_modes??[]);const p=e&&(t(this,Tt).length||t(this,ie).length||t(this,oe).length||t(this,re).length),[m,y]=t(this,ut).toFixed(1).split(".");this.root.innerHTML=`
        <style>${Ji}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${r||p?`
            <div class="shroom-climate-bar">
              ${r?`
                <div class="shroom-climate-temp-view">
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="-" type="button"
                      aria-label="Decrease temperature" title="Decrease">&#8722;</button>
                  `:""}
                  <span class="shroom-climate-temp-display">
                    <span class="shroom-climate-temp-int">${u(m)}</span><span class="shroom-climate-temp-frac">.${u(y)}</span>
                    <span class="shroom-climate-temp-unit">${u(t(this,ns))}</span>
                  </span>
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  `:""}
                </div>
              `:""}
              ${p?`
                <div class="shroom-climate-feat-view" hidden>
                  ${s.show_hvac_modes!==!1&&t(this,Tt).length?`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${h&&t(this,ie).length?`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${n&&t(this,oe).length?`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${d&&t(this,re).length?`
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
      `,i(this,Zs,this.root.querySelector(".shroom-icon-shape")),i(this,Fe,this.root.querySelector(".shroom-secondary")),i(this,Re,this.root.querySelector(".shroom-climate-bar")),i(this,We,this.root.querySelector(".shroom-climate-temp-int")),i(this,Ge,this.root.querySelector(".shroom-climate-temp-frac")),i(this,Ye,this.root.querySelector("[data-dir='-']")),i(this,Ue,this.root.querySelector("[data-dir='+']")),i(this,Ke,this.root.querySelector("[data-feat=mode]")),i(this,Xe,this.root.querySelector("[data-feat=fan]")),i(this,Je,this.root.querySelector("[data-feat=preset]")),i(this,Qe,this.root.querySelector("[data-feat=swing]")),i(this,M,this.root.querySelector(".shroom-climate-dropdown")),i(this,ts,this.root.querySelector(".shroom-climate-temp-view")),i(this,es,this.root.querySelector(".shroom-climate-feat-view")),i(this,pt,this.root.querySelector(".shroom-climate-toggle-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:thermostat"),"card-icon");const g=this.root.querySelector(".shroom-state-item");e&&(me(g,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(g,{onTap:()=>{const f=this.config.gestureConfig?.tap;if(f){this._runAction(f);return}const I=t(this,X)==="off"?t(this,Tt).find(R=>R!=="off")??"heat":"off";this.config.card?.sendCommand("set_hvac_mode",{hvac_mode:I})}})),t(this,Ye)&&t(this,Ye).addEventListener("click",f=>{f.stopPropagation(),l(this,Ys,Yo).call(this,-1)}),t(this,Ue)&&t(this,Ue).addEventListener("click",f=>{f.stopPropagation(),l(this,Ys,Yo).call(this,1)}),t(this,pt)&&t(this,pt).addEventListener("click",f=>{f.stopPropagation(),i(this,mt,!t(this,mt)),t(this,pt).setAttribute("aria-expanded",String(t(this,mt))),l(this,$o,yi).call(this)}),e&&[t(this,Ke),t(this,Xe),t(this,Je),t(this,Qe)].forEach(f=>{if(!f)return;const I=f.getAttribute("data-feat");f.addEventListener("click",R=>{R.stopPropagation(),l(this,Mo,_i).call(this,I)})}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){i(this,Ws,{...s}),i(this,X,e),i(this,os,s.fan_mode??null),i(this,is,s.preset_mode??null),i(this,rs,s.swing_mode??null),i(this,ss,s.current_temperature??null);const r=e==="off";if(t(this,Re)&&(t(this,Re).hidden=r),$(t(this,Zs),"climate",!r),s.temperature!==void 0&&(i(this,ut,s.temperature),l(this,Us,Uo).call(this)),t(this,Fe)){const h=s.hvac_action??e,d=t(this,ss)!=null?` - ${t(this,ss)} ${t(this,ns)}`:"";t(this,Fe).textContent=C(h)+d}l(this,Ho,wi).call(this);const n=s.hvac_action??e;this.announceState(`${this.def.friendly_name}, ${C(n)}`)}predictState(e,s){const r={...t(this,Ws)};return e==="set_hvac_mode"&&s.hvac_mode?{state:s.hvac_mode,attributes:r}:e==="set_temperature"&&s.temperature!==void 0?{state:t(this,X),attributes:{...r,temperature:s.temperature}}:e==="set_fan_mode"&&s.fan_mode?{state:t(this,X),attributes:{...r,fan_mode:s.fan_mode}}:e==="set_preset_mode"&&s.preset_mode?{state:t(this,X),attributes:{...r,preset_mode:s.preset_mode}}:e==="set_swing_mode"&&s.swing_mode?{state:t(this,X),attributes:{...r,swing_mode:s.swing_mode}}:null}destroy(){t(this,it)&&(document.removeEventListener("pointerdown",t(this,it),!0),i(this,it,null)),t(this,V)&&(window.removeEventListener("scroll",t(this,V),!0),window.removeEventListener("resize",t(this,V)),i(this,V,null));try{t(this,M)?.hidePopover?.()}catch{}}}Zs=new WeakMap,Fe=new WeakMap,Re=new WeakMap,We=new WeakMap,Ge=new WeakMap,Ye=new WeakMap,Ue=new WeakMap,Ke=new WeakMap,Xe=new WeakMap,Je=new WeakMap,Qe=new WeakMap,M=new WeakMap,ts=new WeakMap,es=new WeakMap,pt=new WeakMap,se=new WeakMap,it=new WeakMap,V=new WeakMap,mt=new WeakMap,ut=new WeakMap,ss=new WeakMap,X=new WeakMap,os=new WeakMap,is=new WeakMap,rs=new WeakMap,js=new WeakMap,Fs=new WeakMap,Rs=new WeakMap,ns=new WeakMap,Tt=new WeakMap,oe=new WeakMap,ie=new WeakMap,re=new WeakMap,Ws=new WeakMap,Gs=new WeakMap,$o=new WeakSet,yi=function(){t(this,ts)&&(t(this,ts).hidden=t(this,mt)),t(this,es)&&(t(this,es).hidden=!t(this,mt)),t(this,pt)&&(t(this,pt).innerHTML=t(this,mt)?'<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>')},Ys=new WeakSet,Yo=function(e){const s=Math.round((t(this,ut)+e*t(this,Rs))*100)/100;i(this,ut,Math.max(t(this,js),Math.min(t(this,Fs),s))),l(this,Us,Uo).call(this),t(this,Gs).call(this)},Us=new WeakSet,Uo=function(){const[e,s]=t(this,ut).toFixed(1).split(".");t(this,We)&&(t(this,We).textContent=e),t(this,Ge)&&(t(this,Ge).textContent=`.${s}`)},Ao=new WeakSet,xi=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,ut)})},Mo=new WeakSet,_i=function(e){if(t(this,se)===e){l(this,ne,lo).call(this);return}t(this,se)&&l(this,ne,lo).call(this),i(this,se,e);let s=[],r=null,n="",h="";switch(e){case"mode":s=t(this,Tt),r=t(this,X),n="set_hvac_mode",h="hvac_mode";break;case"fan":s=t(this,oe),r=t(this,os),n="set_fan_mode",h="fan_mode";break;case"preset":s=t(this,ie),r=t(this,is),n="set_preset_mode",h="preset_mode";break;case"swing":s=t(this,re),r=t(this,rs),n="set_swing_mode",h="swing_mode";break}if(!s.length||!t(this,M))return;t(this,M).innerHTML=s.map(m=>`
        <button class="shroom-climate-dd-option" data-active="${m===r}" role="option"
          aria-selected="${m===r}" type="button">
          ${u(C(m))}
        </button>
      `).join(""),t(this,M).querySelectorAll(".shroom-climate-dd-option").forEach((m,y)=>{m.addEventListener("click",g=>{g.stopPropagation(),this.config.card?.sendCommand(n,{[h]:s[y]}),l(this,ne,lo).call(this)})});const d=this.root.querySelector(`[data-feat="${e}"]`);d&&d.setAttribute("aria-expanded","true");try{t(this,M).showPopover?.()}catch{}l(this,Ks,Ko).call(this,d),i(this,V,()=>l(this,Ks,Ko).call(this,d)),window.addEventListener("scroll",t(this,V),!0),window.addEventListener("resize",t(this,V));const p=m=>{m.composedPath().some(g=>g===this.root||g===this.root.host)||l(this,ne,lo).call(this)};i(this,it,p),document.addEventListener("pointerdown",p,!0)},Ks=new WeakSet,Ko=function(e){if(!t(this,M)||!e)return;const s=e.getBoundingClientRect(),r=window.innerHeight-s.bottom,n=s.top,h=Math.min(t(this,M).scrollHeight||240,240),d=Math.max(140,Math.round(s.width));t(this,M).style.left=`${Math.round(s.left)}px`,t(this,M).style.minWidth=`${d}px`,r<h+8&&n>r?t(this,M).style.top=`${Math.max(8,Math.round(s.top-h-6))}px`:t(this,M).style.top=`${Math.round(s.bottom+6)}px`},ne=new WeakSet,lo=function(){i(this,se,null);try{t(this,M)?.hidePopover?.()}catch{}this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(e=>{e.setAttribute("aria-expanded","false")}),t(this,it)&&(document.removeEventListener("pointerdown",t(this,it),!0),i(this,it,null)),t(this,V)&&(window.removeEventListener("scroll",t(this,V),!0),window.removeEventListener("resize",t(this,V)),i(this,V,null))},Ho=new WeakSet,wi=function(){const e=(s,r)=>{if(!s)return;const n=s.querySelector(".shroom-climate-feat-value");n&&(n.textContent=C(r??"None"))};e(t(this,Ke),t(this,X)),e(t(this,Xe),t(this,os)),e(t(this,Je),t(this,is)),e(t(this,Qe),t(this,rs))};const tr=`
    ${E}
    ${xs}
    ${bt}
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
  `;class er extends b{constructor(e,s,r,n){super(e,s,r,n);o(this,so);o(this,ko);o(this,Xs,null);o(this,as,null);o(this,ae,null);o(this,hs,null);o(this,ls,null);o(this,ds,null);o(this,qt,null);o(this,Js,null);o(this,Qs,null);o(this,to,null);o(this,cs,null);o(this,J,null);o(this,It,null);o(this,eo,!1);o(this,he,!1);o(this,Q,0);o(this,ft,"idle");o(this,vt,{});o(this,ps,void 0);i(this,ps,nt(l(this,ko,Ci).bind(this),200))}render(){k(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??{},n=s.includes("previous_track");this.root.innerHTML=`
        <style>${tr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
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
                      aria-label="${u(this.def.friendly_name)} volume"
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
      `,i(this,Xs,this.root.querySelector(".shroom-icon-shape")),i(this,as,this.root.querySelector(".shroom-primary")),i(this,ae,this.root.querySelector(".shroom-secondary")),i(this,ds,this.root.querySelector(".shroom-mp-bar")),i(this,hs,this.root.querySelector(".shroom-mp-transport-view")),i(this,ls,this.root.querySelector(".shroom-mp-volume-view")),i(this,qt,this.root.querySelector("[data-role=play]")),i(this,Js,this.root.querySelector("[data-role=prev]")),i(this,Qs,this.root.querySelector("[data-role=next]")),i(this,to,this.root.querySelector("[data-role=power]")),i(this,cs,this.root.querySelector("[data-role=volume]")),i(this,J,this.root.querySelector(".shroom-slider-input")),i(this,It,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:speaker"),"card-icon"),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:power","power-icon"),this.renderIcon("mdi:volume-high","vol-icon"),e&&(t(this,qt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,Js)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Qs)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),t(this,to)?.addEventListener("click",()=>{const m=t(this,ft)==="playing"||t(this,ft)==="paused";this.config.card?.sendCommand(m?"turn_off":"turn_on",{})}),t(this,cs)?.addEventListener("click",()=>{i(this,he,!0),l(this,so,Xo).call(this)}),this.root.querySelector(".shroom-mp-back-btn")?.addEventListener("click",()=>{i(this,he,!1),l(this,so,Xo).call(this)}),this.root.querySelector("[data-role=vol-down]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_down",{})}),this.root.querySelector("[data-role=vol-up]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_up",{})})),t(this,J)&&(t(this,J).addEventListener("input",()=>{i(this,Q,parseInt(t(this,J).value,10)),t(this,It)&&(t(this,It).style.left=`${t(this,Q)}%`),t(this,ps).call(this)}),this.guardSlider(t(this,J),t(this,ps))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){i(this,ft,e),i(this,vt,s);const r=e==="playing",n=r||e==="paused";$(t(this,Xs),"media_player",n),t(this,ds)&&(t(this,ds).hidden=!n);const h=s.media_title??"",d=s.media_artist??"";if(t(this,as)&&(t(this,as).textContent=n&&h?h:this.def.friendly_name),t(this,ae))if(n){const p=t(this,Q)>0?`${t(this,Q)}%`:"",m=[d,p].filter(Boolean);t(this,ae).textContent=m.join(" - ")||C(e)}else t(this,ae).textContent=C(e);if(t(this,qt)){const p=r?"mdi:pause":"mdi:play";this.renderIcon(p,"play-icon");const m=r?"Pause":"Play";t(this,qt).title=m,t(this,qt).setAttribute("aria-label",m)}if(s.volume_level!==void 0&&(i(this,Q,Math.round(s.volume_level*100)),t(this,J)&&!this.isSliderActive(t(this,J))&&(t(this,J).value=String(t(this,Q))),t(this,It)&&(t(this,It).style.left=`${t(this,Q)}%`)),i(this,eo,!!s.is_volume_muted),t(this,cs)){const p=t(this,eo)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(p,"vol-icon")}this.announceState(`${this.def.friendly_name}, ${e}${h?` - ${h}`:""}`)}predictState(e,s){return e==="media_play_pause"?{state:t(this,ft)==="playing"?"paused":"playing",attributes:t(this,vt)}:e==="volume_mute"?{state:t(this,ft),attributes:{...t(this,vt),is_volume_muted:!!s.is_volume_muted}}:e==="volume_set"?{state:t(this,ft),attributes:{...t(this,vt),volume_level:s.volume_level}}:e==="turn_off"?{state:"off",attributes:t(this,vt)}:e==="turn_on"?{state:"idle",attributes:t(this,vt)}:null}}Xs=new WeakMap,as=new WeakMap,ae=new WeakMap,hs=new WeakMap,ls=new WeakMap,ds=new WeakMap,qt=new WeakMap,Js=new WeakMap,Qs=new WeakMap,to=new WeakMap,cs=new WeakMap,J=new WeakMap,It=new WeakMap,eo=new WeakMap,he=new WeakMap,Q=new WeakMap,ft=new WeakMap,vt=new WeakMap,ps=new WeakMap,so=new WeakSet,Xo=function(){t(this,hs)&&(t(this,hs).hidden=t(this,he)),t(this,ls)&&(t(this,ls).hidden=!t(this,he))},ko=new WeakSet,Ci=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,Q)/100})};const ni={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},sr=ni.cloudy,or="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z",ir="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",rr="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",nr=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Bo(a,c){const e=ni[a]??sr;return`<svg viewBox="0 0 24 24" width="${c}" height="${c}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Vo(a){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${a}" fill="currentColor"/></svg>`}const ar=`
    ${E}
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
  `;class hr extends b{constructor(){super(...arguments);o(this,N);o(this,io);o(this,ro);o(this,oo,null);o(this,ms,null);o(this,us,null);o(this,le,null);o(this,fs,null);o(this,vs,null);o(this,gs,null);o(this,gt,null);o(this,rt,null);o(this,bs,null);o(this,de,null);o(this,ce,null)}render(){k(this),this.root.innerHTML=`
        <style>${ar}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <div class="shroom-weather-body">
            <div class="shroom-weather-main">
              <span class="shroom-weather-icon">${Bo("cloudy",36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${Vo(or)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${Vo(ir)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${Vo(rr)}
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
      `,i(this,oo,this.root.querySelector(".shroom-icon-shape")),i(this,ms,this.root.querySelector(".shroom-secondary")),i(this,us,this.root.querySelector(".shroom-weather-icon")),i(this,le,this.root.querySelector(".shroom-weather-temp")),i(this,fs,this.root.querySelector("[data-stat=humidity] [data-value]")),i(this,vs,this.root.querySelector("[data-stat=wind] [data-value]")),i(this,gs,this.root.querySelector("[data-stat=pressure] [data-value]")),i(this,gt,this.root.querySelector(".shroom-forecast-strip")),i(this,rt,this.root.querySelector(".shroom-forecast-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:weather-cloudy"),"card-icon"),$(t(this,oo),"weather",!0),i(this,bs,Si(t(this,gt))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}destroy(){var e;(e=t(this,bs))==null||e.call(this),i(this,bs,null)}applyState(e,s){const r=e||"cloudy";t(this,us)&&(t(this,us).innerHTML=Bo(r,36));const n=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,ms)&&(t(this,ms).textContent=C(n));const h=s.temperature??s.native_temperature;let d=String(s.temperature_unit||s.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(d&&!/^°/.test(d)&&d.length<=2&&(d=`°${d}`),t(this,le)){const m=t(this,le).querySelector(".shroom-weather-unit");t(this,le).firstChild.textContent=h!=null?Math.round(Number(h)):"--",m&&(m.textContent=d)}if(t(this,fs)){const m=s.humidity;t(this,fs).textContent=m!=null?`${m}%`:"--"}if(t(this,vs)){const m=s.wind_speed,y=s.wind_speed_unit??"";t(this,vs).textContent=m!=null?`${m} ${y}`.trim():"--"}if(t(this,gs)){const m=s.pressure,y=s.pressure_unit??"";t(this,gs).textContent=m!=null?`${m} ${y}`.trim():"--"}const p=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;i(this,de,p?s.forecast_daily??s.forecast??null:null),i(this,ce,p?s.forecast_hourly??null:null),l(this,io,Jo).call(this),l(this,ro,Qo).call(this),this.announceState(`${this.def.friendly_name}, ${n}, ${h??"--"} ${d}`)}}oo=new WeakMap,ms=new WeakMap,us=new WeakMap,le=new WeakMap,fs=new WeakMap,vs=new WeakMap,gs=new WeakMap,gt=new WeakMap,rt=new WeakMap,bs=new WeakMap,N=new WeakSet,pe=function(){return this.config._forecastMode??"daily"},qo=function(e){this.config._forecastMode=e},de=new WeakMap,ce=new WeakMap,io=new WeakSet,Jo=function(){if(!t(this,rt))return;const e=Array.isArray(t(this,de))&&t(this,de).length>0,s=Array.isArray(t(this,ce))&&t(this,ce).length>0;if(!e&&!s){t(this,rt).textContent="";return}e&&!s&&i(this,N,"daily",qo),!e&&s&&i(this,N,"hourly",qo),e&&s?(t(this,rt).textContent=t(this,N,pe)==="daily"?"Hourly":"5-Day",t(this,rt).onclick=()=>{i(this,N,t(this,N,pe)==="daily"?"hourly":"daily",qo),l(this,io,Jo).call(this),l(this,ro,Qo).call(this)}):(t(this,rt).textContent="",t(this,rt).onclick=null)},ro=new WeakSet,Qo=function(){if(!t(this,gt))return;const e=t(this,N,pe)==="hourly"?t(this,ce):t(this,de);if(t(this,gt).setAttribute("data-mode",t(this,N,pe)),!Array.isArray(e)||e.length===0){t(this,gt).innerHTML="";return}const s=t(this,N,pe)==="daily"?e.slice(0,5):e;t(this,gt).innerHTML=s.map(r=>{const n=new Date(r.datetime);let h;t(this,N,pe)==="hourly"?h=n.toLocaleTimeString([],{hour:"numeric"}):h=nr[n.getDay()]??"";const d=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",p=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${u(String(h))}</span>
            ${Bo(r.condition||"cloudy",18)}
            <span class="shroom-forecast-temps">
              ${u(String(d))}${p!=null?`/<span class="shroom-forecast-lo">${u(String(p))}</span>`:""}
            </span>
          </div>`}).join("")};const lr=window.__HARVEST_PACK_ID__||"shrooms";_._packs=_._packs||{},_._packs[lr]={light:Hi,switch:oi,input_boolean:oi,sensor:co,"sensor.temperature":co,"sensor.humidity":co,"sensor.battery":co,fan:Vi,binary_sensor:Oi,generic:Ni,harvest_action:Zi,input_number:Fi,input_select:ii,select:ii,cover:Gi,remote:Ui,timer:Xi,climate:Qi,media_player:er,weather:hr,_capabilities:{fan:{display_modes:["on-off","continuous","stepped","cycle"]},input_number:{display_modes:["slider","buttons"]},input_select:{display_modes:["pills","dropdown"]},select:{display_modes:["pills","dropdown"]},light:{features:["brightness","color_temp","rgb"]},climate:{features:["hvac_modes","presets","fan_mode","swing_mode"]},cover:{features:["position","tilt"]},media_player:{features:["transport","volume","source"]}}}})();})();
