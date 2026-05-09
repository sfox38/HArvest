(()=>{var Zo=(M,_,y)=>{if(!_.has(M))throw TypeError("Cannot "+y)};var t=(M,_,y)=>(Zo(M,_,"read from private field"),y?y.call(M):_.get(M)),o=(M,_,y)=>{if(_.has(M))throw TypeError("Cannot add the same private member more than once");_ instanceof WeakSet?_.add(M):_.set(M,y)},i=(M,_,y,f)=>(Zo(M,_,"write to private field"),f?f.call(M,y):_.set(M,y),y);var d=(M,_,y)=>(Zo(M,_,"access private method"),y);(function(){"use strict";var Ls,ve,xt,_t,Ot,k,As,wt,Vt,Dt,Y,Nt,Pt,D,N,Ct,ge,zt,be,Ms,Ro,ks,jo,go,mi,et,Zt,ye,at,Rt,Z,xe,St,$t,Lt,P,w,jt,At,Mt,U,_e,Hs,Ft,we,Bo,bo,ui,Es,Fo,Ts,Go,Is,Wo,Ce,Oo,yo,fi,qs,Se,Bs,$e,R,st,Gt,Le,Ae,Os,Me,j,ke,ot,ht,He,Vs,Ee,xo,vi,Ds,Yo,_o,gi,Ns,Te,B,$,Wt,Yt,lt,wo,kt,Ie,dt,Ut,Ht,O,Co,bi,So,yi,Ps,Uo,zs,Ko,Et,Cs,Zs,qe,K,Be,Oe,Ve,Kt,Xt,Jt,ct,it,Rs,js,De,$o,xi,Fs,Xo,Lo,_i,Ne,Pe,ze,Ze,F,Tt,Qt,te,ee,Re,je,X,Fe,Ao,wi,Mo,Ci,ko,Si,se,mo,Gs,Ge,We,Ye,Ue,Ke,Xe,Je,Qe,ts,es,H,ss,os,pt,oe,rt,V,mt,ut,is,J,rs,ns,as,Ws,Ys,Us,hs,It,ie,re,ne,Ks,Xs,Ho,$i,Js,Jo,Qs,Qo,Eo,Li,To,Ai,to,ti,ae,uo,Io,Mi,eo,ls,he,ds,cs,ps,qt,so,oo,io,ms,Q,Bt,ro,le,tt,ft,vt,us,no,ei,qo,ki,ao,fs,vs,de,gs,bs,ys,gt,nt,xs,z,me,Vo,ce,pe,ho,si,lo,oi,bt,_s,ws;console.info("[HArvest Shrooms] Loading pack v"+"1.0.0");const _=window.HArvest;if(!_||!_.renderers||!_.renderers.BaseCard){console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");return}const y=_.renderers.BaseCard;function f(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ue(a,p){let e=null,s=null,r=null;function n(...h){s=this,r=h,e&&clearTimeout(e),e=setTimeout(()=>{e=null,a.apply(s,r),r=null},p)}return n.flush=function(){e!==null&&(clearTimeout(e),e=null,r&&(a.apply(s,r),r=null))},n}function C(a){return a?a.charAt(0).toUpperCase()+a.slice(1).replace(/_/g," "):""}function wr(a,p,e){return Math.min(e,Math.max(p,a))}function ii(a,p){const e=a.querySelector(".shroom-controls-shell");e&&e.setAttribute("data-collapsed",String(p))}function fe(a,p){a&&(a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-label",p),a.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),a.click())}))}function E(a){a.querySelectorAll("[part=companion]").forEach(p=>{p.title=p.getAttribute("aria-label")??"Companion"})}const Hi={light:"var(--hrv-ex-shroom-light, #ff9800)",switch:"var(--hrv-ex-shroom-switch, #2196f3)",input_boolean:"var(--hrv-ex-shroom-switch, #2196f3)",fan:"var(--hrv-ex-shroom-fan, #4caf50)",climate:"var(--hrv-ex-shroom-climate, #ff5722)",cover:"var(--hrv-ex-shroom-cover, #9c27b0)",media_player:"var(--hrv-ex-shroom-media, #e91e63)",sensor:"var(--hrv-ex-shroom-sensor, #03a9f4)",binary_sensor:"var(--hrv-ex-shroom-binary, #8bc34a)",input_number:"var(--hrv-ex-shroom-input, #00bcd4)",input_select:"var(--hrv-ex-shroom-input, #00bcd4)",timer:"var(--hrv-ex-shroom-timer, #673ab7)",remote:"var(--hrv-ex-shroom-remote, #607d8b)",weather:"var(--hrv-ex-shroom-weather, #ff9800)",harvest_action:"var(--hrv-ex-shroom-action, #9c27b0)"};function ri(a){return Hi[a]??"var(--hrv-color-primary, #ff9800)"}function L(a,p,e){if(!a)return;const s=ri(p);e?(a.style.background=`color-mix(in srgb, ${s} 20%, transparent)`,a.style.color=s):(a.style.background="var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))",a.style.color="var(--hrv-color-icon, #757575)")}function T(a){const p=(a.config.displayHints??a.def.display_hints??{}).layout??null,e=a.root.host;e&&(p==="vertical"?e.setAttribute("data-layout","vertical"):e.removeAttribute("data-layout"))}function Ei(a){if(!a)return()=>{};const p=80,e=1.6,s=.96,r=.04;let n=null,h=0,l=0,c=0,m=!1,g=0;const v=[],u=()=>{g&&(cancelAnimationFrame(g),g=0)},A=b=>{for(;v.length&&v[0].t<b-p;)v.shift();if(v.length<2)return 0;const S=v[0],W=v[v.length-1],po=W.t-S.t;return po<=0?0:(W.x-S.x)/po},G=()=>{if(Math.abs(c)<r)return;let b=performance.now();const S=W=>{const po=W-b;if(b=W,a.scrollLeft-=c*po,c*=Math.pow(s,po/16),Math.abs(c)<r){g=0,c=0;return}const _r=a.scrollWidth-a.clientWidth;if(a.scrollLeft<=0||a.scrollLeft>=_r){g=0,c=0;return}g=requestAnimationFrame(S)};g=requestAnimationFrame(S)},co=b=>{if(a.scrollWidth<=a.clientWidth||b.pointerType==="touch")return;const S=b.target;if(!(S&&S!==a&&S.closest?.("button, a"))){u(),n=b.pointerId,h=b.clientX,l=a.scrollLeft,c=0,m=!1,v.length=0,v.push({x:b.clientX,t:b.timeStamp});try{a.setPointerCapture(n)}catch{}}},zo=b=>{if(b.pointerId!==n)return;const S=b.clientX-h;Math.abs(S)>4&&(m=!0,a.dataset.dragging="true"),a.scrollLeft=l-S,v.push({x:b.clientX,t:b.timeStamp});const W=b.timeStamp-p;for(;v.length>2&&v[0].t<W;)v.shift()},x=b=>{if(b.pointerId===n){try{a.releasePointerCapture(n)}catch{}if(n=null,m){const S=W=>{W.stopPropagation(),W.preventDefault()};window.addEventListener("click",S,{capture:!0,once:!0}),requestAnimationFrame(()=>a.removeAttribute("data-dragging")),c=A(b.timeStamp)*e,G()}v.length=0}};return a.addEventListener("pointerdown",co),a.addEventListener("pointermove",zo),a.addEventListener("pointerup",x),a.addEventListener("pointercancel",x),a.addEventListener("wheel",u,{passive:!0}),a.addEventListener("touchstart",u,{passive:!0}),()=>{u(),a.removeEventListener("pointerdown",co),a.removeEventListener("pointermove",zo),a.removeEventListener("pointerup",x),a.removeEventListener("pointercancel",x),a.removeEventListener("wheel",u),a.removeEventListener("touchstart",u)}}function ni(a,p){if(a!=="on")return null;if(p.rgb_color){const[s,r,n]=p.rgb_color;return(.299*s+.587*r+.114*n)/255>.85?`rgb(${Math.round(s*.8)}, ${Math.round(r*.8)}, ${Math.round(n*.75)})`:`rgb(${s}, ${r}, ${n})`}if(p.hs_color)return`hsl(${p.hs_color[0]}, ${Math.max(p.hs_color[1],50)}%, 55%)`;const e=p.color_temp_kelvin??(p.color_temp?Math.round(1e6/p.color_temp):null);return e?e>=5200?"#4ba3e0":e>=4500?"#e0c85a":e<=3e3?"#e6a040":"#ddb840":null}const I=`
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
  `,Do=`
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
  `,Ss=`
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
  `,yt=`
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
  `,q=`
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
  `,Ti=`
    ${I}
    ${q}
  `;class ai extends y{constructor(){super(...arguments);o(this,Ls,null);o(this,ve,null);o(this,xt,!1)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ti}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Ls,this.root.querySelector(".shroom-icon-shape")),i(this,ve,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline"),"card-icon");const s=this.root.querySelector(".shroom-state-item");e&&(fe(s,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand("toggle",{})}})),this.renderCompanions(),E(this.root)}applyState(e,s){i(this,xt,e==="on");const r=this.def.domain??"switch";L(t(this,Ls),r,t(this,xt)),t(this,ve)&&(t(this,ve).textContent=C(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,xt)));const h=t(this,xt)?this.resolveIcon(this.def.icon,"mdi:toggle-switch"):this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="toggle"||e==="turn_on"||e==="turn_off"?{state:e==="toggle"?t(this,xt)?"off":"on":e==="turn_on"?"on":"off",attributes:{}}:null}}Ls=new WeakMap,ve=new WeakMap,xt=new WeakMap;const $s=["brightness","temp","color"],Ii={brightness:"mdi:brightness-4",temp:"mdi:thermometer",color:"mdi:palette"},qi=`
    ${I}
    ${Do}
    ${Ss}
    ${yt}
    ${q}

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
  `;class Bi extends y{constructor(e,s,r,n){super(e,s,r,n);o(this,Ms);o(this,ks);o(this,go);o(this,_t,null);o(this,Ot,null);o(this,k,null);o(this,As,null);o(this,wt,null);o(this,Vt,null);o(this,Dt,[]);o(this,Y,0);o(this,Nt,4e3);o(this,Pt,0);o(this,D,!1);o(this,N,0);o(this,Ct,2e3);o(this,ge,6500);o(this,zt,{});o(this,be,void 0);i(this,be,ue(d(this,go,mi).bind(this),300))}render(){T(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??{},n=r.show_brightness!==!1&&s.includes("brightness"),h=r.show_color_temp!==!1&&s.includes("color_temp"),l=r.show_rgb!==!1&&s.includes("rgb_color"),c=e&&(n||h||l),m=[n,h,l].filter(Boolean).length;i(this,Ct,this.def.feature_config?.min_color_temp_kelvin??2e3),i(this,ge,this.def.feature_config?.max_color_temp_kelvin??6500);const g=[n,h,l];g[t(this,N)]||(i(this,N,g.findIndex(Boolean)),t(this,N)===-1&&i(this,N,0)),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${qi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${c?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-light-controls-row">
                <div class="shroom-slider-wrap shroom-light-slider-wrap">
                  <div class="shroom-slider-bg shroom-brightness-bg"></div>
                  <div class="shroom-slider-cover" style="left:0%"></div>
                  <div class="shroom-slider-edge" style="left:0%;display:none"></div>
                  <input type="range" class="shroom-slider-input" min="0" max="100"
                    step="1" value="0"
                    aria-label="${f(this.def.friendly_name)} level"
                    aria-valuetext="0%">
                  <div class="shroom-slider-focus-ring"></div>
                </div>
                ${m>1?`
                  <div class="shroom-light-mode-btns">
                    ${n?'<button class="shroom-light-mode-btn" data-mode="brightness" type="button" aria-label="Brightness"><span part="light-mode-brightness"></span></button>':""}
                    ${h?'<button class="shroom-light-mode-btn" data-mode="temp" type="button" aria-label="Color temperature"><span part="light-mode-temp"></span></button>':""}
                    ${l?'<button class="shroom-light-mode-btn" data-mode="color" type="button" aria-label="Color"><span part="light-mode-color"></span></button>':""}
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
      `,i(this,_t,this.root.querySelector(".shroom-icon-shape")),i(this,Ot,this.root.querySelector(".shroom-secondary")),i(this,k,this.root.querySelector(".shroom-slider-input")),i(this,As,this.root.querySelector(".shroom-slider-bg")),i(this,wt,this.root.querySelector(".shroom-slider-cover")),i(this,Vt,this.root.querySelector(".shroom-slider-edge")),i(this,Dt,[...this.root.querySelectorAll(".shroom-light-mode-btn")]),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon");for(const u of t(this,Dt))this.renderIcon(Ii[u.dataset.mode]??"mdi:help-circle",`light-mode-${u.dataset.mode}`);const v=this.root.querySelector(".shroom-state-item");e&&(fe(v,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(v,{onTap:()=>{const u=this.config.gestureConfig?.tap;if(u){this._runAction(u);return}this.config.card?.sendCommand("toggle",{})}}));for(const u of t(this,Dt))u.addEventListener("click",()=>{const A=u.dataset.mode,G=$s.indexOf(A);G===-1||G===t(this,N)||(i(this,N,G),d(this,Ms,Ro).call(this))});t(this,k)&&(t(this,k).addEventListener("input",()=>{const u=parseInt(t(this,k).value,10),A=$s[t(this,N)]??"brightness";A==="brightness"?i(this,Y,u):A==="temp"?i(this,Nt,Math.round(t(this,Ct)+u/100*(t(this,ge)-t(this,Ct)))):i(this,Pt,Math.round(u*3.6)),d(this,ks,jo).call(this),t(this,be).call(this,A)}),this.guardSlider(t(this,k),t(this,be))),this.renderCompanions(),E(this.root)}applyState(e,s){i(this,D,e==="on"),i(this,zt,s),ii(this.root,!t(this,D));const r=ni(e,s);t(this,D)&&r?t(this,_t)&&(t(this,_t).style.background=`color-mix(in srgb, ${r} 20%, transparent)`,t(this,_t).style.color=r):L(t(this,_t),"light",t(this,D)),i(this,Y,s.brightness!=null?Math.round(s.brightness/255*100):0),i(this,Nt,s.color_temp_kelvin??(s.color_temp?Math.round(1e6/s.color_temp):4e3)),i(this,Pt,s.hs_color?.[0]??42),t(this,Ot)&&(t(this,D)&&s.brightness!=null?t(this,Ot).textContent=`${t(this,Y)}%`:t(this,Ot).textContent=C(e));const n=this.root.querySelector(".shroom-light-ro");n&&(n.textContent=t(this,D)&&s.brightness!=null?`${t(this,Y)}%`:C(e));const h=this.root.querySelector(".shroom-slider-wrap");if(h){const m=ni("on",s);h.style.setProperty("--shroom-light-accent",m??"var(--hrv-ex-shroom-light, #ff9800)")}d(this,Ms,Ro).call(this);const l=this.root.querySelector(".shroom-state-item");if(l?.hasAttribute("role")&&l.setAttribute("aria-pressed",String(t(this,D))),t(this,k)){const m=$s[t(this,N)]??"brightness",g=parseInt(t(this,k).value,10);m==="brightness"?t(this,k).setAttribute("aria-valuetext",`${g}%`):m==="temp"?t(this,k).setAttribute("aria-valuetext",`${g}K`):t(this,k).setAttribute("aria-valuetext",`${g}`)}const c=t(this,D)?this.resolveIcon(this.def.icon,"mdi:lightbulb"):this.resolveIcon(this.def.icon,"mdi:lightbulb-off");this.renderIcon(c,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}${t(this,D)?`, ${t(this,Y)}%`:""}`)}predictState(e,s){if(e==="toggle")return{state:t(this,D)?"off":"on",attributes:t(this,zt)};if(e==="turn_on"){const r={...t(this,zt)};return s.brightness!=null&&(r.brightness=s.brightness),s.color_temp_kelvin!=null&&(r.color_temp_kelvin=s.color_temp_kelvin),s.hs_color!=null&&(r.hs_color=s.hs_color),{state:"on",attributes:r}}return e==="turn_off"?{state:"off",attributes:t(this,zt)}:null}}_t=new WeakMap,Ot=new WeakMap,k=new WeakMap,As=new WeakMap,wt=new WeakMap,Vt=new WeakMap,Dt=new WeakMap,Y=new WeakMap,Nt=new WeakMap,Pt=new WeakMap,D=new WeakMap,N=new WeakMap,Ct=new WeakMap,ge=new WeakMap,zt=new WeakMap,be=new WeakMap,Ms=new WeakSet,Ro=function(){const e=$s[t(this,N)]??"brightness",s=t(this,As);s?.classList.remove("shroom-brightness-bg","shroom-ct-bg","shroom-hue-bg"),e==="brightness"?s?.classList.add("shroom-brightness-bg"):e==="temp"?s?.classList.add("shroom-ct-bg"):s?.classList.add("shroom-hue-bg");for(const r of t(this,Dt))r.hidden=r.dataset.mode===e;d(this,ks,jo).call(this)},ks=new WeakSet,jo=function(){const e=$s[t(this,N)]??"brightness";let s=0;e==="brightness"?s=t(this,Y):e==="temp"?s=Math.round((t(this,Nt)-t(this,Ct))/(t(this,ge)-t(this,Ct))*100):s=Math.round(t(this,Pt)/3.6);const r=e==="brightness";t(this,wt)&&(r?(t(this,wt).style.display="",t(this,wt).style.left=`${s}%`):t(this,wt).style.display="none"),t(this,Vt)&&(t(this,Vt).style.display=r?"none":"",r||(t(this,Vt).style.left=`${s}%`)),t(this,k)&&!this.isSliderActive(t(this,k))&&(t(this,k).value=String(s))},go=new WeakSet,mi=function(e){e==="brightness"?t(this,Y)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:Math.round(t(this,Y)*2.55)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,Nt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,Pt),100]})};const Oi={temperature:"var(--hrv-ex-shroom-climate, #ff5722)",humidity:"var(--hrv-ex-shroom-sensor, #03a9f4)",battery:"var(--hrv-ex-shroom-fan, #4caf50)"},Vi={temperature:"mdi:thermometer",humidity:"mdi:water-percent",battery:"mdi:battery"};function Di(a){return a==null||isNaN(a)||a>=90?"mdi:battery":a>=70?"mdi:battery-70":a>=50?"mdi:battery-50":a>=30?"mdi:battery-30":a>=10?"mdi:battery-10":"mdi:battery-alert"}function Ni(a){return a==null||isNaN(a)?"var(--hrv-ex-shroom-fan, #4caf50)":a<=10?"var(--hrv-color-error, #f44336)":a<=20?"var(--hrv-color-warning, #ff9800)":"var(--hrv-ex-shroom-fan, #4caf50)"}const Pi=`
    ${I}
    ${q}
  `;class fo extends y{constructor(){super(...arguments);o(this,et,null);o(this,Zt,null);o(this,ye,null)}render(){T(this),i(this,ye,this.def.device_class??null);const e=Vi[t(this,ye)]??"mdi:gauge";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Pi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,et,this.root.querySelector(".shroom-icon-shape")),i(this,Zt,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,e),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}applyState(e,s){const r=parseFloat(e),n=this.def.unit_of_measurement??"",h=!isNaN(r),l=t(this,ye);if(t(this,Zt))if(h){const c=s.suggested_display_precision,m=c!=null?r.toFixed(c):String(Math.round(r*10)/10);t(this,Zt).textContent=n?`${m} ${n}`:m}else t(this,Zt).textContent=C(e);if(l==="battery"&&h){const c=Ni(r);t(this,et)&&(t(this,et).style.background=`color-mix(in srgb, ${c} 20%, transparent)`,t(this,et).style.color=c),this.renderIcon(this.resolveIcon(this.def.icon,Di(r)),"card-icon")}else{const c=Oi[l]??ri("sensor");t(this,et)&&(t(this,et).style.background=`color-mix(in srgb, ${c} 20%, transparent)`,t(this,et).style.color=c)}this.announceState(`${this.def.friendly_name}, ${h?r:e} ${n}`)}}et=new WeakMap,Zt=new WeakMap,ye=new WeakMap;const zi=`
    ${I}
    ${Do}
    ${Ss}
    ${yt}
    ${q}

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
  `;class Zi extends y{constructor(e,s,r,n){super(e,s,r,n);o(this,we);o(this,bo);o(this,Es);o(this,Ts);o(this,Is);o(this,Ce);o(this,yo);o(this,at,null);o(this,Rt,null);o(this,Z,null);o(this,xe,null);o(this,St,null);o(this,$t,null);o(this,Lt,null);o(this,P,!1);o(this,w,0);o(this,jt,!1);o(this,At,"forward");o(this,Mt,null);o(this,U,[]);o(this,_e,void 0);o(this,Hs,!1);o(this,Ft,!1);i(this,_e,ue(d(this,yo,fi).bind(this),300)),i(this,U,e.feature_config?.preset_modes??[])}render(){T(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},n=r.display_mode??null;let h=s.includes("set_speed");const l=r.show_oscillate!==!1&&s.includes("oscillate"),c=r.show_direction!==!1&&s.includes("direction"),m=r.show_presets!==!1&&s.includes("preset_mode");n==="on-off"&&(h=!1);let g=e&&h,v=g&&t(this,bo,ui),u=!1,A=!1;n==="continuous"?v=!1:n==="stepped"?A=v:n==="cycle"?(v=!0,u=!0):v&&t(this,U).length?u=!0:v&&(A=!0),i(this,Hs,u);const G=e&&(l||c||m);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${zi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${g||G?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${g&&!v?`
                  <div class="shroom-fan-speed-row">
                    <div class="shroom-slider-wrap">
                      <div class="shroom-slider-bg shroom-fan-slider-bg"></div>
                      <div class="shroom-slider-cover" style="left:0%"></div>
                      <input type="range" class="shroom-slider-input" min="0" max="100"
                        step="1" value="0"
                        aria-label="${f(this.def.friendly_name)} speed"
                        aria-valuetext="0%">
                      <div class="shroom-slider-focus-ring"></div>
                    </div>
                  </div>
                `:""}
                ${g&&A?`
                  <div class="shroom-fan-step-dots">
                    ${t(this,Es,Fo).map((x,b)=>`
                      <button class="shroom-fan-step-dot" data-pct="${x}" type="button"
                        data-active="false"
                        aria-label="Speed ${b+1} (${x}%)"
                        title="Speed ${b+1} (${x}%)">${b+1}</button>
                    `).join("")}
                  </div>
                `:""}
                ${g&&u?`
                  <div style="display:flex;justify-content:center;">
                    <button class="shroom-fan-cycle-btn" type="button"
                      title="Cycle speed"
                      aria-label="Cycle fan speed">
                      <svg viewBox="0 0 24 24"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg>
                    </button>
                  </div>
                `:""}
                ${G?`
                  <div class="shroom-fan-feat-row">
                    ${l?'<button class="shroom-btn shroom-fan-feat" data-feat="oscillate" type="button" aria-label="Oscillate" aria-pressed="false">Oscillate</button>':""}
                    ${c?'<button class="shroom-btn shroom-fan-feat" data-feat="direction" type="button" aria-label="Direction: forward">Forward</button>':""}
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
      `,i(this,at,this.root.querySelector(".shroom-icon-shape")),i(this,Rt,this.root.querySelector(".shroom-secondary")),i(this,Z,this.root.querySelector(".shroom-slider-input")),i(this,xe,this.root.querySelector(".shroom-slider-cover")),i(this,St,this.root.querySelector('[data-feat="oscillate"]')),i(this,$t,this.root.querySelector('[data-feat="direction"]')),i(this,Lt,this.root.querySelector('[data-feat="preset"]')),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"card-icon");const co=this.root.querySelector(".shroom-state-item");e&&(fe(co,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(co,{onTap:()=>{const x=this.config.gestureConfig?.tap;if(x){this._runAction(x);return}this.config.card?.sendCommand("toggle",{})}})),t(this,Z)&&(t(this,Z).addEventListener("input",()=>{const x=Number(t(this,Z).value);i(this,w,x),t(this,Z).setAttribute("aria-valuetext",`${Math.round(x)}%`),d(this,Ts,Go).call(this),t(this,_e).call(this)}),this.guardSlider(t(this,Z),t(this,_e))),this.root.querySelectorAll(".shroom-fan-step-dot").forEach(x=>{x.addEventListener("click",()=>{const b=Number(x.getAttribute("data-pct"));i(this,w,b),i(this,P,!0),d(this,Is,Wo).call(this),this.config.card?.sendCommand("set_percentage",{percentage:b})})}),this.root.querySelector(".shroom-fan-cycle-btn")?.addEventListener("click",()=>{const x=t(this,Es,Fo);if(!x.length)return;let b;if(!t(this,P)||t(this,w)===0)b=x[0];else{const S=x.findIndex(W=>W>t(this,w));b=S===-1?x[0]:x[S]}i(this,w,b),i(this,P,!0),this.config.card?.sendCommand("set_percentage",{percentage:b})}),t(this,St)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,jt)})}),t(this,$t)?.addEventListener("click",()=>{const x=t(this,At)==="forward"?"reverse":"forward";i(this,At,x),d(this,Ce,Oo).call(this),this.config.card?.sendCommand("set_direction",{direction:x})}),t(this,Lt)?.addEventListener("click",()=>{if(!t(this,U).length)return;const b=((t(this,Mt)?t(this,U).indexOf(t(this,Mt)):-1)+1)%t(this,U).length,S=t(this,U)[b];i(this,Mt,S),d(this,Ce,Oo).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:S})}),this.renderCompanions(),E(this.root)}applyState(e,s){i(this,P,e==="on"),i(this,w,s?.percentage??0),i(this,jt,s?.oscillating??!1),i(this,At,s?.direction??"forward"),i(this,Mt,s?.preset_mode??null),s?.preset_modes?.length&&i(this,U,s.preset_modes),i(this,Ft,t(this,Hs)||s?.assumed_state===!0),ii(this.root,!t(this,P)),L(t(this,at),"fan",t(this,P));const r=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??"mdi:fan";if(this.renderIcon(this.resolveIcon(r,"mdi:fan"),"card-icon"),t(this,at))if(t(this,P)&&t(this,w)>0&&!t(this,Ft)&&this.config.animate!==!1){const h=1/(1.5*Math.pow(t(this,w)/100,.5));t(this,at).setAttribute("data-spinning","true"),t(this,at).style.setProperty("--shroom-fan-duration",`${h.toFixed(2)}s`)}else t(this,at).setAttribute("data-spinning","false");t(this,Rt)&&(t(this,P)&&t(this,w)>0&&!t(this,Ft)?t(this,Rt).textContent=`${Math.round(t(this,w))}%`:t(this,Rt).textContent=C(e)),d(this,Ts,Go).call(this),d(this,Is,Wo).call(this),d(this,Ce,Oo).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,w)>0&&!t(this,Ft)?`, ${Math.round(t(this,w))}%`:""))}predictState(e,s){return e==="toggle"?{state:t(this,P)?"off":"on",attributes:{percentage:t(this,w)}}:e==="set_percentage"?{state:"on",attributes:{percentage:s.percentage,oscillating:t(this,jt),direction:t(this,At),preset_mode:t(this,Mt),preset_modes:t(this,U)}}:e==="oscillate"?{state:"on",attributes:{percentage:t(this,w),oscillating:s.oscillating,direction:t(this,At)}}:e==="set_direction"?{state:"on",attributes:{percentage:t(this,w),oscillating:t(this,jt),direction:s.direction}}:null}}at=new WeakMap,Rt=new WeakMap,Z=new WeakMap,xe=new WeakMap,St=new WeakMap,$t=new WeakMap,Lt=new WeakMap,P=new WeakMap,w=new WeakMap,jt=new WeakMap,At=new WeakMap,Mt=new WeakMap,U=new WeakMap,_e=new WeakMap,Hs=new WeakMap,Ft=new WeakMap,we=new WeakSet,Bo=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},bo=new WeakSet,ui=function(){return t(this,we,Bo)>1},Es=new WeakSet,Fo=function(){const e=t(this,we,Bo),s=[];for(let r=1;r*e<=100.001;r++)s.push(r*e);return s},Ts=new WeakSet,Go=function(){if(!t(this,Z))return;const e=t(this,w);this.isSliderActive(t(this,Z))||(t(this,Z).value=String(e)),t(this,xe)&&(t(this,xe).style.left=`${e}%`)},Is=new WeakSet,Wo=function(){const e=t(this,we,Bo)/2;this.root.querySelectorAll(".shroom-fan-step-dot").forEach(s=>{const r=Number(s.getAttribute("data-pct"));s.setAttribute("data-active",String(t(this,P)&&t(this,w)>=r-e))})},Ce=new WeakSet,Oo=function(){t(this,St)&&(t(this,St).setAttribute("aria-pressed","false"),t(this,St).textContent="Oscillate"),t(this,$t)&&(t(this,$t).textContent="Direction",t(this,$t).setAttribute("aria-label","Direction")),t(this,Lt)&&(t(this,Lt).textContent="Preset",t(this,Lt).setAttribute("data-active","false"))},yo=new WeakSet,fi=function(){t(this,w)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,w)})};const Ri=`
    ${I}
    ${q}
  `;class ji extends y{constructor(){super(...arguments);o(this,qs,null);o(this,Se,null)}render(){T(this),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ri}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,qs,this.root.querySelector(".shroom-icon-shape")),i(this,Se,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.def.icon_state_map?.off??this.resolveIcon(this.def.icon,"mdi:radiobox-blank"),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}applyState(e,s){const r=e==="on";L(t(this,qs),"binary_sensor",r);const n=this.formatStateLabel(e);t(this,Se)&&(t(this,Se).textContent=n);const h=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,r?"mdi:radiobox-marked":"mdi:radiobox-blank");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${n}`)}}qs=new WeakMap,Se=new WeakMap;const Fi=`
    ${I}
    ${q}

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
  `;class Gi extends y{constructor(){super(...arguments);o(this,Bs,null);o(this,$e,null);o(this,R,null);o(this,st,!1);o(this,Gt,!1)}render(){T(this);const e=this.def.capabilities==="read-write";i(this,Gt,!1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Fi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <button class="shroom-generic-toggle" type="button" data-on="false"
              title="Toggle" aria-label="${f(this.def.friendly_name)} - Toggle"
              hidden>Toggle</button>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Bs,this.root.querySelector(".shroom-icon-shape")),i(this,$e,this.root.querySelector(".shroom-secondary")),i(this,R,this.root.querySelector(".shroom-generic-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:help-circle"),"card-icon"),t(this,R)&&e&&this._attachGestureHandlers(t(this,R),{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),E(this.root)}applyState(e,s){const r=e==="on"||e==="off";i(this,st,e==="on"),t(this,$e)&&(t(this,$e).textContent=C(e));const n=this.def.domain??"generic";L(t(this,Bs),n,t(this,st)),t(this,R)&&(r&&!t(this,Gt)&&(t(this,R).removeAttribute("hidden"),i(this,Gt,!0)),t(this,Gt)&&(t(this,R).setAttribute("data-on",String(t(this,st))),t(this,R).setAttribute("aria-pressed",String(t(this,st))),t(this,R).textContent=t(this,st)?"On":"Off",t(this,R).title=t(this,st)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e!=="toggle"?null:{state:t(this,st)?"off":"on",attributes:{}}}}Bs=new WeakMap,$e=new WeakMap,R=new WeakMap,st=new WeakMap,Gt=new WeakMap;const Wi=`
    ${I}
    ${q}
  `;class Yi extends y{constructor(){super(...arguments);o(this,Le,null);o(this,Ae,null)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Wi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Le,this.root.querySelector(".shroom-icon-shape")),i(this,Ae,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.def.icon_state_map?.idle??this.resolveIcon(this.def.icon,"mdi:play"),"card-icon"),L(t(this,Le),"harvest_action",!1);const s=this.root.querySelector(".shroom-state-item");e&&(fe(s,`${this.def.friendly_name} - Trigger`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand("trigger",{})}})),this.renderCompanions(),E(this.root)}applyState(e,s){const r=e==="triggered";t(this,Ae)&&(t(this,Ae).textContent=C(e)),L(t(this,Le),"harvest_action",r);const n=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,"mdi:play");this.renderIcon(n,"card-icon"),this.announceState(`${this.def.friendly_name}, ${C(e)}`)}predictState(e,s){return e!=="trigger"?null:{state:"triggered",attributes:{}}}}Le=new WeakMap,Ae=new WeakMap;const Ui=`
    ${I}
    ${Do}
    ${Ss}
    ${yt}
    ${q}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }
  `;class Ki extends y{constructor(e,s,r,n){super(e,s,r,n);o(this,xo);o(this,Ds);o(this,_o);o(this,Os,null);o(this,Me,null);o(this,j,null);o(this,ke,null);o(this,ot,0);o(this,ht,0);o(this,He,100);o(this,Vs,1);o(this,Ee,void 0);i(this,Ee,ue(d(this,_o,gi).bind(this),300))}render(){T(this);const e=this.def.capabilities==="read-write";if(i(this,ht,this.def.feature_config?.min??0),i(this,He,this.def.feature_config?.max??100),i(this,Vs,this.def.feature_config?.step??1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ui}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-controls-shell" data-collapsed="false">
              <div class="shroom-slider-wrap">
                <div class="shroom-slider-bg shroom-num-slider-bg"></div>
                <div class="shroom-slider-cover" style="left:0%"></div>
                <input type="range" class="shroom-slider-input"
                  min="${t(this,ht)}" max="${t(this,He)}" step="${t(this,Vs)}" value="${t(this,ht)}"
                  aria-label="${f(this.def.friendly_name)} value"
                  aria-valuetext="${t(this,ht)}${this.def.unit_of_measurement?` ${f(this.def.unit_of_measurement)}`:""}">
                <div class="shroom-slider-focus-ring"></div>
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Os,this.root.querySelector(".shroom-icon-shape")),i(this,Me,this.root.querySelector(".shroom-secondary")),i(this,j,this.root.querySelector(".shroom-slider-input")),i(this,ke,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:ray-vertex"),"card-icon"),L(t(this,Os),"input_number",!0),t(this,j)){const s=this.def.unit_of_measurement??"";t(this,j).addEventListener("input",()=>{i(this,ot,parseFloat(t(this,j).value)),t(this,j).setAttribute("aria-valuetext",`${t(this,ot)}${s?` ${s}`:""}`),d(this,Ds,Yo).call(this),t(this,Ee).call(this)}),this.guardSlider(t(this,j),t(this,Ee))}this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}applyState(e,s){const r=parseFloat(e);if(isNaN(r))return;i(this,ot,r),d(this,Ds,Yo).call(this);const n=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${n?` ${n}`:""}`)}predictState(e,s){return e==="set_value"&&s.value!==void 0?{state:String(s.value),attributes:{}}:null}}Os=new WeakMap,Me=new WeakMap,j=new WeakMap,ke=new WeakMap,ot=new WeakMap,ht=new WeakMap,He=new WeakMap,Vs=new WeakMap,Ee=new WeakMap,xo=new WeakSet,vi=function(e){const s=t(this,He)-t(this,ht);return s===0?0:Math.max(0,Math.min(100,(e-t(this,ht))/s*100))},Ds=new WeakSet,Yo=function(){const e=d(this,xo,vi).call(this,t(this,ot));t(this,ke)&&(t(this,ke).style.left=`${e}%`),t(this,j)&&!this.isSliderActive(t(this,j))&&(t(this,j).value=String(t(this,ot)));const s=this.def.unit_of_measurement??"";t(this,Me)&&(t(this,Me).textContent=`${t(this,ot)}${s?` ${s}`:""}`)},_o=new WeakSet,gi=function(){this.config.card?.sendCommand("set_value",{value:t(this,ot)})};const Xi=`
    ${I}
    ${yt}
    ${q}

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
  `;class hi extends y{constructor(){super(...arguments);o(this,Co);o(this,So);o(this,Ps);o(this,zs);o(this,Et);o(this,Ns,null);o(this,Te,null);o(this,B,null);o(this,$,null);o(this,Wt,null);o(this,Yt,[]);o(this,lt,[]);o(this,wo,"");o(this,kt,[]);o(this,Ie,"");o(this,dt,!1);o(this,Ut,"pills");o(this,Ht,null);o(this,O,null)}render(){T(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";i(this,Ut,s==="dropdown"?"dropdown":"pills"),i(this,kt,this.def.feature_config?.options??[]);const r=e?t(this,Ut)==="dropdown"?`
            <div class="shroom-select-shell">
              <button class="shroom-select-current" type="button"
                aria-label="${f(this.def.friendly_name)}"
                aria-haspopup="listbox" aria-expanded="false">
                <span class="shroom-select-label">-</span>
                <span class="shroom-select-arrow" aria-hidden="true">&#9660;</span>
              </button>
              <div class="shroom-select-dropdown" role="listbox" popover="manual"></div>
            </div>`:`
            <div class="shroom-select-shell">
              <div class="shroom-select-grid"></div>
            </div>`:"";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Xi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${r}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Ns,this.root.querySelector(".shroom-icon-shape")),i(this,Te,this.root.querySelector(".shroom-secondary")),i(this,B,this.root.querySelector(".shroom-select-current")),i(this,$,this.root.querySelector(".shroom-select-dropdown")),i(this,Wt,this.root.querySelector(".shroom-select-grid")),i(this,Yt,[]),i(this,lt,[]),i(this,Ie,""),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:form-select"),"card-icon"),L(t(this,Ns),"input_select",!0),t(this,B)&&e&&(t(this,B).addEventListener("click",n=>{n.stopPropagation(),t(this,dt)?d(this,Et,Cs).call(this):d(this,zs,Ko).call(this)}),t(this,B).addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" "||n.key==="ArrowDown")&&!t(this,dt)?(n.preventDefault(),d(this,zs,Ko).call(this),t(this,lt)[0]?.focus()):n.key==="Escape"&&t(this,dt)&&(d(this,Et,Cs).call(this),t(this,B).focus())}),i(this,Ht,n=>{t(this,dt)&&!this.root.host.contains(n.target)&&d(this,Et,Cs).call(this)}),document.addEventListener("click",t(this,Ht))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}applyState(e,s){i(this,wo,e);const r=s?.options,n=Array.isArray(r)&&r.length?r:t(this,kt);i(this,kt,n),t(this,Te)&&(t(this,Te).textContent=e);const h=n.join("|");if(h!==t(this,Ie)&&(i(this,Ie,h),t(this,Ut)==="dropdown"?d(this,So,yi).call(this,n):d(this,Co,bi).call(this,n)),t(this,Ut)==="dropdown"){const l=this.root.querySelector(".shroom-select-label");l&&(l.textContent=e);for(const c of t(this,lt)){const m=c.dataset.option===e;c.setAttribute("data-active",String(m)),c.setAttribute("aria-selected",String(m))}}else for(const l of t(this,Yt))l.setAttribute("data-active",String(l.dataset.option===e));this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="select_option"&&s.option!==void 0?{state:String(s.option),attributes:{options:t(this,kt)}}:null}destroy(){t(this,Ht)&&(document.removeEventListener("click",t(this,Ht)),i(this,Ht,null)),t(this,O)&&(window.removeEventListener("scroll",t(this,O),!0),window.removeEventListener("resize",t(this,O)),i(this,O,null));try{t(this,$)?.hidePopover?.()}catch{}}}Ns=new WeakMap,Te=new WeakMap,B=new WeakMap,$=new WeakMap,Wt=new WeakMap,Yt=new WeakMap,lt=new WeakMap,wo=new WeakMap,kt=new WeakMap,Ie=new WeakMap,dt=new WeakMap,Ut=new WeakMap,Ht=new WeakMap,O=new WeakMap,Co=new WeakSet,bi=function(e){if(t(this,Wt)){t(this,Wt).innerHTML="",i(this,Yt,[]);for(const s of e){const r=document.createElement("button");r.type="button",r.className="shroom-select-pill",r.dataset.option=s,r.textContent=C(s),r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s})}),t(this,Wt).appendChild(r),t(this,Yt).push(r)}}},So=new WeakSet,yi=function(e){if(t(this,$)){t(this,$).innerHTML="",i(this,lt,[]);for(const s of e){const r=document.createElement("button");r.type="button",r.className="shroom-select-option",r.role="option",r.dataset.option=s,r.textContent=C(s),r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s}),d(this,Et,Cs).call(this),t(this,B)?.focus()}),r.addEventListener("keydown",n=>{const h=t(this,lt),l=h.indexOf(r);n.key==="ArrowDown"?(n.preventDefault(),h[Math.min(l+1,h.length-1)]?.focus()):n.key==="ArrowUp"?(n.preventDefault(),l===0?t(this,B)?.focus():h[l-1]?.focus()):n.key==="Escape"&&(d(this,Et,Cs).call(this),t(this,B)?.focus())}),t(this,$).appendChild(r),t(this,lt).push(r)}}},Ps=new WeakSet,Uo=function(){if(!t(this,$)||!t(this,B))return;const e=t(this,B).getBoundingClientRect(),s=window.innerHeight-e.bottom,r=e.top,n=Math.min(t(this,$).scrollHeight||240,240);t(this,$).style.left=`${Math.round(e.left)}px`,t(this,$).style.width=`${Math.round(e.width)}px`,s<n+8&&r>s?t(this,$).style.top=`${Math.max(8,Math.round(e.top-n-6))}px`:t(this,$).style.top=`${Math.round(e.bottom+6)}px`},zs=new WeakSet,Ko=function(){if(!(!t(this,$)||!t(this,kt).length)){try{typeof t(this,$).showPopover=="function"&&t(this,$).showPopover()}catch{}t(this,B)?.setAttribute("aria-expanded","true"),d(this,Ps,Uo).call(this),i(this,O,()=>d(this,Ps,Uo).call(this)),window.addEventListener("scroll",t(this,O),!0),window.addEventListener("resize",t(this,O)),i(this,dt,!0)}},Et=new WeakSet,Cs=function(){try{typeof t(this,$)?.hidePopover=="function"&&t(this,$).hidePopover()}catch{}t(this,B)?.setAttribute("aria-expanded","false"),t(this,O)&&(window.removeEventListener("scroll",t(this,O),!0),window.removeEventListener("resize",t(this,O)),i(this,O,null)),i(this,dt,!1)};const Ji=`
    ${I}
    ${Ss}
    ${yt}
    ${q}

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
  `;class Qi extends y{constructor(e,s,r,n){super(e,s,r,n);o(this,$o);o(this,Fs);o(this,Lo);o(this,Zs,null);o(this,qe,null);o(this,K,null);o(this,Be,null);o(this,Oe,null);o(this,Ve,null);o(this,Kt,null);o(this,Xt,null);o(this,Jt,null);o(this,ct,0);o(this,it,!1);o(this,Rs,"closed");o(this,js,{});o(this,De,void 0);i(this,De,ue(d(this,Lo,_i).bind(this),300))}render(){T(this);const e=this.def.capabilities==="read-write",r=(this.config.displayHints??{}).show_position!==!1&&this.def.supported_features?.includes("set_position"),n=!this.def.supported_features||this.def.supported_features.includes("buttons"),h=e&&(r||n);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ji}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
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
                      aria-label="${f(this.def.friendly_name)} position"
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
      `,i(this,Zs,this.root.querySelector(".shroom-icon-shape")),i(this,qe,this.root.querySelector(".shroom-secondary")),i(this,K,this.root.querySelector(".shroom-slider-input")),i(this,Be,this.root.querySelector(".shroom-slider-cover")),i(this,Oe,this.root.querySelector(".shroom-cover-slider-view")),i(this,Ve,this.root.querySelector(".shroom-cover-btn-view")),i(this,Kt,this.root.querySelector("[data-action=open]")),i(this,Xt,this.root.querySelector("[data-action=stop]")),i(this,Jt,this.root.querySelector("[data-action=close]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:window-shutter"),"card-icon"),t(this,K)&&(t(this,K).addEventListener("input",()=>{i(this,ct,parseInt(t(this,K).value,10)),d(this,Fs,Xo).call(this),t(this,De).call(this)}),this.guardSlider(t(this,K),t(this,De))),[t(this,Kt),t(this,Xt),t(this,Jt)].forEach(c=>{if(!c)return;const m=c.getAttribute("data-action");c.addEventListener("click",()=>{this.config.card?.sendCommand(`${m}_cover`,{})})});const l=this.root.querySelector(".shroom-cover-toggle-btn");l?.addEventListener("click",()=>{i(this,it,!t(this,it)),l.setAttribute("aria-expanded",String(t(this,it))),l.setAttribute("aria-label",t(this,it)?"Show position slider":"Show cover buttons"),d(this,$o,xi).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}applyState(e,s){i(this,Rs,e),i(this,js,{...s});const r=e==="open"||e==="opening";if(L(t(this,Zs),"cover",r),t(this,qe)){const l=s.current_position,c=C(e);t(this,qe).textContent=l!==void 0?`${c} - ${l}%`:c}const n=e==="opening"||e==="closing",h=s.current_position;t(this,Kt)&&(t(this,Kt).disabled=!n&&h===100),t(this,Xt)&&(t(this,Xt).disabled=!n),t(this,Jt)&&(t(this,Jt).disabled=!n&&e==="closed"),s.current_position!==void 0&&(i(this,ct,s.current_position),t(this,K)&&!this.isSliderActive(t(this,K))&&(t(this,K).value=String(t(this,ct))),d(this,Fs,Xo).call(this)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){const r={...t(this,js)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,Rs),attributes:r}:e==="set_cover_position"&&s.position!==void 0?(r.current_position=s.position,{state:s.position>0?"open":"closed",attributes:r}):null}}Zs=new WeakMap,qe=new WeakMap,K=new WeakMap,Be=new WeakMap,Oe=new WeakMap,Ve=new WeakMap,Kt=new WeakMap,Xt=new WeakMap,Jt=new WeakMap,ct=new WeakMap,it=new WeakMap,Rs=new WeakMap,js=new WeakMap,De=new WeakMap,$o=new WeakSet,xi=function(){t(this,Oe)&&(t(this,Oe).hidden=t(this,it)),t(this,Ve)&&(t(this,Ve).hidden=!t(this,it));const e=this.root.querySelector(".shroom-cover-toggle-btn");e&&(e.innerHTML=t(this,it)?'<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>')},Fs=new WeakSet,Xo=function(){t(this,Be)&&(t(this,Be).style.left=`${t(this,ct)}%`);const e=this.root.querySelector(".shroom-slider-edge");e&&(e.style.left=`${t(this,ct)}%`)},Lo=new WeakSet,_i=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,ct)})};const tr=`
    ${I}
    ${q}
  `;class er extends y{constructor(){super(...arguments);o(this,Ne,null);o(this,Pe,null)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${tr}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Ne,this.root.querySelector(".shroom-icon-shape")),i(this,Pe,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:remote"),"card-icon"),L(t(this,Ne),"remote",!1);const s=this.root.querySelector(".shroom-state-item");e&&(fe(s,`${this.def.friendly_name} - Send command`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}const n=this.config.tapAction?.data?.command??"power",h=this.config.tapAction?.data?.device??void 0,l=h?{command:n,device:h}:{command:n};this.config.card?.sendCommand("send_command",l)}})),this.renderCompanions(),E(this.root)}applyState(e,s){const r=e==="on";L(t(this,Ne),"remote",r),t(this,Pe)&&(t(this,Pe).textContent=C(e));const n=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(n,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ne=new WeakMap,Pe=new WeakMap;function vo(a){a<0&&(a=0);const p=Math.floor(a/3600),e=Math.floor(a%3600/60),s=Math.floor(a%60),r=n=>String(n).padStart(2,"0");return p>0?`${p}:${r(e)}:${r(s)}`:`${r(e)}:${r(s)}`}function li(a){if(typeof a=="number")return a;if(typeof a!="string")return 0;const p=a.split(":").map(Number);return p.length===3?p[0]*3600+p[1]*60+p[2]:p.length===2?p[0]*60+p[1]:p[0]||0}const sr=`
    ${I}
    ${yt}
    ${q}

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
  `;class or extends y{constructor(){super(...arguments);o(this,Ao);o(this,Mo);o(this,ko);o(this,se);o(this,ze,null);o(this,Ze,null);o(this,F,null);o(this,Tt,null);o(this,Qt,null);o(this,te,null);o(this,ee,null);o(this,Re,"idle");o(this,je,{});o(this,X,null);o(this,Fe,null)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${sr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <span class="shroom-timer-display" title="Time remaining">00:00</span>
          ${e?`
            <div class="shroom-timer-controls">
              <button class="shroom-timer-btn" data-action="playpause" type="button"
                title="Start" aria-label="${f(this.def.friendly_name)} - Start">
                <span part="playpause-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="cancel" type="button"
                title="Cancel" aria-label="${f(this.def.friendly_name)} - Cancel">
                <span part="cancel-icon" aria-hidden="true"></span>
              </button>
              <button class="shroom-timer-btn" data-action="finish" type="button"
                title="Finish" aria-label="${f(this.def.friendly_name)} - Finish">
                <span part="finish-icon" aria-hidden="true"></span>
              </button>
            </div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,ze,this.root.querySelector(".shroom-icon-shape")),i(this,Ze,this.root.querySelector(".shroom-secondary")),i(this,F,this.root.querySelector(".shroom-timer-display")),i(this,Tt,this.root.querySelector("[data-action=playpause]")),i(this,Qt,this.root.querySelector("[data-action=cancel]")),i(this,te,this.root.querySelector("[data-action=finish]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:timer-outline"),"card-icon"),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),L(t(this,ze),"timer",!1),e&&(t(this,Tt)?.addEventListener("click",()=>{const s=t(this,Re)==="active"?"pause":"start";this.config.card?.sendCommand(s,{})}),t(this,Qt)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,te)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}applyState(e,s){i(this,Re,e),i(this,je,{...s}),i(this,X,s.finishes_at??null),i(this,Fe,s.remaining!=null?li(s.remaining):null);const r=e==="active";L(t(this,ze),"timer",r||e==="paused"),t(this,Ze)&&(t(this,Ze).textContent=C(e)),d(this,Ao,wi).call(this,e),d(this,Mo,Ci).call(this,e),r&&t(this,X)?d(this,ko,Si).call(this):d(this,se,mo).call(this),t(this,F)&&t(this,F).setAttribute("data-paused",String(e==="paused"))}predictState(e,s){const r={...t(this,je)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,X)&&(r.remaining=Math.max(0,(new Date(t(this,X)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}ze=new WeakMap,Ze=new WeakMap,F=new WeakMap,Tt=new WeakMap,Qt=new WeakMap,te=new WeakMap,ee=new WeakMap,Re=new WeakMap,je=new WeakMap,X=new WeakMap,Fe=new WeakMap,Ao=new WeakSet,wi=function(e){const s=e==="idle",r=e==="active";if(t(this,Tt)){const n=r?"mdi:pause":"mdi:play",h=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(n,"playpause-icon"),t(this,Tt).title=h,t(this,Tt).setAttribute("aria-label",`${this.def.friendly_name} - ${h}`)}t(this,Qt)&&(t(this,Qt).disabled=s),t(this,te)&&(t(this,te).disabled=s),this.announceState(`${this.def.friendly_name}, ${e}`)},Mo=new WeakSet,Ci=function(e){if(t(this,F)){if(e==="idle"){const s=t(this,je).duration;t(this,F).textContent=s?vo(li(s)):"00:00";return}if(e==="paused"&&t(this,Fe)!=null){t(this,F).textContent=vo(t(this,Fe));return}if(e==="active"&&t(this,X)){const s=Math.max(0,(new Date(t(this,X)).getTime()-Date.now())/1e3);t(this,F).textContent=vo(s)}}},ko=new WeakSet,Si=function(){d(this,se,mo).call(this),i(this,ee,setInterval(()=>{if(!t(this,X)||t(this,Re)!=="active"){d(this,se,mo).call(this);return}const e=Math.max(0,(new Date(t(this,X)).getTime()-Date.now())/1e3);t(this,F)&&(t(this,F).textContent=vo(e)),e<=0&&d(this,se,mo).call(this)},1e3))},se=new WeakSet,mo=function(){t(this,ee)&&(clearInterval(t(this,ee)),i(this,ee,null))};const ir=`
    ${I}
    ${yt}
    ${q}

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
  `;class rr extends y{constructor(e,s,r,n){super(e,s,r,n);o(this,Ho);o(this,Js);o(this,Qs);o(this,Eo);o(this,To);o(this,to);o(this,ae);o(this,Io);o(this,Gs,null);o(this,Ge,null);o(this,We,null);o(this,Ye,null);o(this,Ue,null);o(this,Ke,null);o(this,Xe,null);o(this,Je,null);o(this,Qe,null);o(this,ts,null);o(this,es,null);o(this,H,null);o(this,ss,null);o(this,os,null);o(this,pt,null);o(this,oe,null);o(this,rt,null);o(this,V,null);o(this,mt,!1);o(this,ut,20);o(this,is,null);o(this,J,"off");o(this,rs,null);o(this,ns,null);o(this,as,null);o(this,Ws,16);o(this,Ys,32);o(this,Us,.5);o(this,hs,"°C");o(this,It,[]);o(this,ie,[]);o(this,re,[]);o(this,ne,[]);o(this,Ks,{});o(this,Xs,void 0);i(this,Xs,ue(d(this,Eo,Li).bind(this),500))}render(){T(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),n=s.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),h=s.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),l=s.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);i(this,Ws,this.def.feature_config?.min_temp??16),i(this,Ys,this.def.feature_config?.max_temp??32),i(this,Us,this.def.feature_config?.temp_step??.5),i(this,hs,this.def.unit_of_measurement??"°C"),i(this,It,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),i(this,ie,this.def.feature_config?.fan_modes??[]),i(this,re,this.def.feature_config?.preset_modes??[]),i(this,ne,this.def.feature_config?.swing_modes??[]);const c=e&&(t(this,It).length||t(this,re).length||t(this,ie).length||t(this,ne).length),[m,g]=t(this,ut).toFixed(1).split(".");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ir}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${r||c?`
            <div class="shroom-climate-bar">
              ${r?`
                <div class="shroom-climate-temp-view">
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="-" type="button"
                      aria-label="Decrease temperature" title="Decrease">&#8722;</button>
                  `:""}
                  <span class="shroom-climate-temp-display">
                    <span class="shroom-climate-temp-int">${f(m)}</span><span class="shroom-climate-temp-frac">.${f(g)}</span>
                    <span class="shroom-climate-temp-unit">${f(t(this,hs))}</span>
                  </span>
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  `:""}
                </div>
              `:""}
              ${c?`
                <div class="shroom-climate-feat-view" hidden>
                  ${s.show_hvac_modes!==!1&&t(this,It).length?`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${h&&t(this,re).length?`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${n&&t(this,ie).length?`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${l&&t(this,ne).length?`
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
      `,i(this,Gs,this.root.querySelector(".shroom-icon-shape")),i(this,Ge,this.root.querySelector(".shroom-secondary")),i(this,We,this.root.querySelector(".shroom-climate-bar")),i(this,Ye,this.root.querySelector(".shroom-climate-temp-int")),i(this,Ue,this.root.querySelector(".shroom-climate-temp-frac")),i(this,Ke,this.root.querySelector("[data-dir='-']")),i(this,Xe,this.root.querySelector("[data-dir='+']")),i(this,Je,this.root.querySelector("[data-feat=mode]")),i(this,Qe,this.root.querySelector("[data-feat=fan]")),i(this,ts,this.root.querySelector("[data-feat=preset]")),i(this,es,this.root.querySelector("[data-feat=swing]")),i(this,H,this.root.querySelector(".shroom-climate-dropdown")),i(this,ss,this.root.querySelector(".shroom-climate-temp-view")),i(this,os,this.root.querySelector(".shroom-climate-feat-view")),i(this,pt,this.root.querySelector(".shroom-climate-toggle-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:thermostat"),"card-icon");const v=this.root.querySelector(".shroom-state-item");e&&(fe(v,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(v,{onTap:()=>{const u=this.config.gestureConfig?.tap;if(u){this._runAction(u);return}const A=t(this,J)==="off"?t(this,It).find(G=>G!=="off")??"heat":"off";this.config.card?.sendCommand("set_hvac_mode",{hvac_mode:A})}})),t(this,Ke)&&t(this,Ke).addEventListener("click",u=>{u.stopPropagation(),d(this,Js,Jo).call(this,-1)}),t(this,Xe)&&t(this,Xe).addEventListener("click",u=>{u.stopPropagation(),d(this,Js,Jo).call(this,1)}),t(this,pt)&&t(this,pt).addEventListener("click",u=>{u.stopPropagation(),i(this,mt,!t(this,mt)),t(this,pt).setAttribute("aria-expanded",String(t(this,mt))),d(this,Ho,$i).call(this)}),e&&[t(this,Je),t(this,Qe),t(this,ts),t(this,es)].forEach(u=>{if(!u)return;const A=u.getAttribute("data-feat");u.addEventListener("click",G=>{G.stopPropagation(),d(this,To,Ai).call(this,A)})}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}applyState(e,s){i(this,Ks,{...s}),i(this,J,e),i(this,rs,s.fan_mode??null),i(this,ns,s.preset_mode??null),i(this,as,s.swing_mode??null),i(this,is,s.current_temperature??null);const r=e==="off";if(t(this,We)&&(t(this,We).hidden=r),L(t(this,Gs),"climate",!r),s.temperature!==void 0&&(i(this,ut,s.temperature),d(this,Qs,Qo).call(this)),t(this,Ge)){const h=s.hvac_action??e,l=t(this,is)!=null?` - ${t(this,is)} ${t(this,hs)}`:"";t(this,Ge).textContent=C(h)+l}d(this,Io,Mi).call(this);const n=s.hvac_action??e;this.announceState(`${this.def.friendly_name}, ${C(n)}`)}predictState(e,s){const r={...t(this,Ks)};return e==="set_hvac_mode"&&s.hvac_mode?{state:s.hvac_mode,attributes:r}:e==="set_temperature"&&s.temperature!==void 0?{state:t(this,J),attributes:{...r,temperature:s.temperature}}:e==="set_fan_mode"&&s.fan_mode?{state:t(this,J),attributes:{...r,fan_mode:s.fan_mode}}:e==="set_preset_mode"&&s.preset_mode?{state:t(this,J),attributes:{...r,preset_mode:s.preset_mode}}:e==="set_swing_mode"&&s.swing_mode?{state:t(this,J),attributes:{...r,swing_mode:s.swing_mode}}:null}destroy(){t(this,rt)&&(document.removeEventListener("pointerdown",t(this,rt),!0),i(this,rt,null)),t(this,V)&&(window.removeEventListener("scroll",t(this,V),!0),window.removeEventListener("resize",t(this,V)),i(this,V,null));try{t(this,H)?.hidePopover?.()}catch{}}}Gs=new WeakMap,Ge=new WeakMap,We=new WeakMap,Ye=new WeakMap,Ue=new WeakMap,Ke=new WeakMap,Xe=new WeakMap,Je=new WeakMap,Qe=new WeakMap,ts=new WeakMap,es=new WeakMap,H=new WeakMap,ss=new WeakMap,os=new WeakMap,pt=new WeakMap,oe=new WeakMap,rt=new WeakMap,V=new WeakMap,mt=new WeakMap,ut=new WeakMap,is=new WeakMap,J=new WeakMap,rs=new WeakMap,ns=new WeakMap,as=new WeakMap,Ws=new WeakMap,Ys=new WeakMap,Us=new WeakMap,hs=new WeakMap,It=new WeakMap,ie=new WeakMap,re=new WeakMap,ne=new WeakMap,Ks=new WeakMap,Xs=new WeakMap,Ho=new WeakSet,$i=function(){t(this,ss)&&(t(this,ss).hidden=t(this,mt)),t(this,os)&&(t(this,os).hidden=!t(this,mt)),t(this,pt)&&(t(this,pt).innerHTML=t(this,mt)?'<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>')},Js=new WeakSet,Jo=function(e){const s=Math.round((t(this,ut)+e*t(this,Us))*100)/100;i(this,ut,Math.max(t(this,Ws),Math.min(t(this,Ys),s))),d(this,Qs,Qo).call(this),t(this,Xs).call(this)},Qs=new WeakSet,Qo=function(){const[e,s]=t(this,ut).toFixed(1).split(".");t(this,Ye)&&(t(this,Ye).textContent=e),t(this,Ue)&&(t(this,Ue).textContent=`.${s}`)},Eo=new WeakSet,Li=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,ut)})},To=new WeakSet,Ai=function(e){if(t(this,oe)===e){d(this,ae,uo).call(this);return}t(this,oe)&&d(this,ae,uo).call(this),i(this,oe,e);let s=[],r=null,n="",h="";switch(e){case"mode":s=t(this,It),r=t(this,J),n="set_hvac_mode",h="hvac_mode";break;case"fan":s=t(this,ie),r=t(this,rs),n="set_fan_mode",h="fan_mode";break;case"preset":s=t(this,re),r=t(this,ns),n="set_preset_mode",h="preset_mode";break;case"swing":s=t(this,ne),r=t(this,as),n="set_swing_mode",h="swing_mode";break}if(!s.length||!t(this,H))return;t(this,H).innerHTML=s.map(m=>`
        <button class="shroom-climate-dd-option" data-active="${m===r}" role="option"
          aria-selected="${m===r}" type="button">
          ${f(C(m))}
        </button>
      `).join(""),t(this,H).querySelectorAll(".shroom-climate-dd-option").forEach((m,g)=>{m.addEventListener("click",v=>{v.stopPropagation(),this.config.card?.sendCommand(n,{[h]:s[g]}),d(this,ae,uo).call(this)})});const l=this.root.querySelector(`[data-feat="${e}"]`);l&&l.setAttribute("aria-expanded","true");try{t(this,H).showPopover?.()}catch{}d(this,to,ti).call(this,l),i(this,V,()=>d(this,to,ti).call(this,l)),window.addEventListener("scroll",t(this,V),!0),window.addEventListener("resize",t(this,V));const c=m=>{m.composedPath().some(v=>v===this.root||v===this.root.host)||d(this,ae,uo).call(this)};i(this,rt,c),document.addEventListener("pointerdown",c,!0)},to=new WeakSet,ti=function(e){if(!t(this,H)||!e)return;const s=e.getBoundingClientRect(),r=window.innerHeight-s.bottom,n=s.top,h=Math.min(t(this,H).scrollHeight||240,240),l=Math.max(140,Math.round(s.width));t(this,H).style.left=`${Math.round(s.left)}px`,t(this,H).style.minWidth=`${l}px`,r<h+8&&n>r?t(this,H).style.top=`${Math.max(8,Math.round(s.top-h-6))}px`:t(this,H).style.top=`${Math.round(s.bottom+6)}px`},ae=new WeakSet,uo=function(){i(this,oe,null);try{t(this,H)?.hidePopover?.()}catch{}this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(e=>{e.setAttribute("aria-expanded","false")}),t(this,rt)&&(document.removeEventListener("pointerdown",t(this,rt),!0),i(this,rt,null)),t(this,V)&&(window.removeEventListener("scroll",t(this,V),!0),window.removeEventListener("resize",t(this,V)),i(this,V,null))},Io=new WeakSet,Mi=function(){const e=(s,r)=>{if(!s)return;const n=s.querySelector(".shroom-climate-feat-value");n&&(n.textContent=C(r??"None"))};e(t(this,Je),t(this,J)),e(t(this,Qe),t(this,rs)),e(t(this,ts),t(this,ns)),e(t(this,es),t(this,as))};const nr=`
    ${I}
    ${Ss}
    ${yt}
    ${q}

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
  `;class ar extends y{constructor(e,s,r,n){super(e,s,r,n);o(this,no);o(this,qo);o(this,eo,null);o(this,ls,null);o(this,he,null);o(this,ds,null);o(this,cs,null);o(this,ps,null);o(this,qt,null);o(this,so,null);o(this,oo,null);o(this,io,null);o(this,ms,null);o(this,Q,null);o(this,Bt,null);o(this,ro,!1);o(this,le,!1);o(this,tt,0);o(this,ft,"idle");o(this,vt,{});o(this,us,void 0);i(this,us,ue(d(this,qo,ki).bind(this),200))}render(){T(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??{},n=s.includes("previous_track");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${nr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
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
                      aria-label="${f(this.def.friendly_name)} volume"
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
      `,i(this,eo,this.root.querySelector(".shroom-icon-shape")),i(this,ls,this.root.querySelector(".shroom-primary")),i(this,he,this.root.querySelector(".shroom-secondary")),i(this,ps,this.root.querySelector(".shroom-mp-bar")),i(this,ds,this.root.querySelector(".shroom-mp-transport-view")),i(this,cs,this.root.querySelector(".shroom-mp-volume-view")),i(this,qt,this.root.querySelector("[data-role=play]")),i(this,so,this.root.querySelector("[data-role=prev]")),i(this,oo,this.root.querySelector("[data-role=next]")),i(this,io,this.root.querySelector("[data-role=power]")),i(this,ms,this.root.querySelector("[data-role=volume]")),i(this,Q,this.root.querySelector(".shroom-slider-input")),i(this,Bt,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:speaker"),"card-icon"),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:power","power-icon"),this.renderIcon("mdi:volume-high","vol-icon"),e&&(t(this,qt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,so)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,oo)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),t(this,io)?.addEventListener("click",()=>{const m=t(this,ft)==="playing"||t(this,ft)==="paused";this.config.card?.sendCommand(m?"turn_off":"turn_on",{})}),t(this,ms)?.addEventListener("click",()=>{i(this,le,!0),d(this,no,ei).call(this)}),this.root.querySelector(".shroom-mp-back-btn")?.addEventListener("click",()=>{i(this,le,!1),d(this,no,ei).call(this)}),this.root.querySelector("[data-role=vol-down]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_down",{})}),this.root.querySelector("[data-role=vol-up]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_up",{})})),t(this,Q)&&(t(this,Q).addEventListener("input",()=>{i(this,tt,parseInt(t(this,Q).value,10)),t(this,Bt)&&(t(this,Bt).style.left=`${t(this,tt)}%`),t(this,us).call(this)}),this.guardSlider(t(this,Q),t(this,us))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}applyState(e,s){i(this,ft,e),i(this,vt,s);const r=e==="playing",n=r||e==="paused";L(t(this,eo),"media_player",n),t(this,ps)&&(t(this,ps).hidden=!n);const h=s.media_title??"",l=s.media_artist??"";if(t(this,ls)&&(t(this,ls).textContent=n&&h?h:this.def.friendly_name),t(this,he))if(n){const c=t(this,tt)>0?`${t(this,tt)}%`:"",m=[l,c].filter(Boolean);t(this,he).textContent=m.join(" - ")||C(e)}else t(this,he).textContent=C(e);if(t(this,qt)){const c=r?"mdi:pause":"mdi:play";this.renderIcon(c,"play-icon");const m=r?"Pause":"Play";t(this,qt).title=m,t(this,qt).setAttribute("aria-label",m)}if(s.volume_level!==void 0&&(i(this,tt,Math.round(s.volume_level*100)),t(this,Q)&&!this.isSliderActive(t(this,Q))&&(t(this,Q).value=String(t(this,tt))),t(this,Bt)&&(t(this,Bt).style.left=`${t(this,tt)}%`)),i(this,ro,!!s.is_volume_muted),t(this,ms)){const c=t(this,ro)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(c,"vol-icon")}this.announceState(`${this.def.friendly_name}, ${e}${h?` - ${h}`:""}`)}predictState(e,s){return e==="media_play_pause"?{state:t(this,ft)==="playing"?"paused":"playing",attributes:t(this,vt)}:e==="volume_mute"?{state:t(this,ft),attributes:{...t(this,vt),is_volume_muted:!!s.is_volume_muted}}:e==="volume_set"?{state:t(this,ft),attributes:{...t(this,vt),volume_level:s.volume_level}}:e==="turn_off"?{state:"off",attributes:t(this,vt)}:e==="turn_on"?{state:"idle",attributes:t(this,vt)}:null}}eo=new WeakMap,ls=new WeakMap,he=new WeakMap,ds=new WeakMap,cs=new WeakMap,ps=new WeakMap,qt=new WeakMap,so=new WeakMap,oo=new WeakMap,io=new WeakMap,ms=new WeakMap,Q=new WeakMap,Bt=new WeakMap,ro=new WeakMap,le=new WeakMap,tt=new WeakMap,ft=new WeakMap,vt=new WeakMap,us=new WeakMap,no=new WeakSet,ei=function(){t(this,ds)&&(t(this,ds).hidden=t(this,le)),t(this,cs)&&(t(this,cs).hidden=!t(this,le))},qo=new WeakSet,ki=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,tt)/100})};const di={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},hr=di.cloudy,lr="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z",dr="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",cr="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",pr=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function No(a,p){const e=di[a]??hr;return`<svg viewBox="0 0 24 24" width="${p}" height="${p}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Po(a){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${a}" fill="currentColor"/></svg>`}const mr=`
    ${I}
    ${q}

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
  `;class ur extends y{constructor(){super(...arguments);o(this,z);o(this,ho);o(this,lo);o(this,ao,null);o(this,fs,null);o(this,vs,null);o(this,de,null);o(this,gs,null);o(this,bs,null);o(this,ys,null);o(this,gt,null);o(this,nt,null);o(this,xs,null);o(this,ce,null);o(this,pe,null)}render(){T(this),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${mr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${f(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          <div class="shroom-weather-body">
            <div class="shroom-weather-main">
              <span class="shroom-weather-icon">${No("cloudy",36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${Po(lr)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${Po(dr)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${Po(cr)}
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
      `,i(this,ao,this.root.querySelector(".shroom-icon-shape")),i(this,fs,this.root.querySelector(".shroom-secondary")),i(this,vs,this.root.querySelector(".shroom-weather-icon")),i(this,de,this.root.querySelector(".shroom-weather-temp")),i(this,gs,this.root.querySelector("[data-stat=humidity] [data-value]")),i(this,bs,this.root.querySelector("[data-stat=wind] [data-value]")),i(this,ys,this.root.querySelector("[data-stat=pressure] [data-value]")),i(this,gt,this.root.querySelector(".shroom-forecast-strip")),i(this,nt,this.root.querySelector(".shroom-forecast-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:weather-cloudy"),"card-icon"),L(t(this,ao),"weather",!0),i(this,xs,Ei(t(this,gt))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),E(this.root)}destroy(){var e;(e=t(this,xs))==null||e.call(this),i(this,xs,null)}applyState(e,s){const r=e||"cloudy";t(this,vs)&&(t(this,vs).innerHTML=No(r,36));const n=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,fs)&&(t(this,fs).textContent=C(n));const h=s.temperature??s.native_temperature;let l=String(s.temperature_unit||s.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(l&&!/^°/.test(l)&&l.length<=2&&(l=`°${l}`),t(this,de)){const m=t(this,de).querySelector(".shroom-weather-unit");t(this,de).firstChild.textContent=h!=null?Math.round(Number(h)):"--",m&&(m.textContent=l)}if(t(this,gs)){const m=s.humidity;t(this,gs).textContent=m!=null?`${m}%`:"--"}if(t(this,bs)){const m=s.wind_speed,g=s.wind_speed_unit??"";t(this,bs).textContent=m!=null?`${m} ${g}`.trim():"--"}if(t(this,ys)){const m=s.pressure,g=s.pressure_unit??"";t(this,ys).textContent=m!=null?`${m} ${g}`.trim():"--"}const c=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;i(this,ce,c?s.forecast_daily??s.forecast??null:null),i(this,pe,c?s.forecast_hourly??null:null),d(this,ho,si).call(this),d(this,lo,oi).call(this),this.announceState(`${this.def.friendly_name}, ${n}, ${h??"--"} ${l}`)}}ao=new WeakMap,fs=new WeakMap,vs=new WeakMap,de=new WeakMap,gs=new WeakMap,bs=new WeakMap,ys=new WeakMap,gt=new WeakMap,nt=new WeakMap,xs=new WeakMap,z=new WeakSet,me=function(){return this.config._forecastMode??"daily"},Vo=function(e){this.config._forecastMode=e},ce=new WeakMap,pe=new WeakMap,ho=new WeakSet,si=function(){if(!t(this,nt))return;const e=Array.isArray(t(this,ce))&&t(this,ce).length>0,s=Array.isArray(t(this,pe))&&t(this,pe).length>0;if(!e&&!s){t(this,nt).textContent="";return}e&&!s&&i(this,z,"daily",Vo),!e&&s&&i(this,z,"hourly",Vo),e&&s?(t(this,nt).textContent=t(this,z,me)==="daily"?"Hourly":"5-Day",t(this,nt).onclick=()=>{i(this,z,t(this,z,me)==="daily"?"hourly":"daily",Vo),d(this,ho,si).call(this),d(this,lo,oi).call(this)}):(t(this,nt).textContent="",t(this,nt).onclick=null)},lo=new WeakSet,oi=function(){if(!t(this,gt))return;const e=t(this,z,me)==="hourly"?t(this,pe):t(this,ce);if(t(this,gt).setAttribute("data-mode",t(this,z,me)),!Array.isArray(e)||e.length===0){t(this,gt).innerHTML="";return}const s=t(this,z,me)==="daily"?e.slice(0,5):e;t(this,gt).innerHTML=s.map(r=>{const n=new Date(r.datetime);let h;t(this,z,me)==="hourly"?h=n.toLocaleTimeString([],{hour:"numeric"}):h=pr[n.getDay()]??"";const l=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",c=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${f(String(h))}</span>
            ${No(r.condition||"cloudy",18)}
            <span class="shroom-forecast-temps">
              ${f(String(l))}${c!=null?`/<span class="shroom-forecast-lo">${f(String(c))}</span>`:""}
            </span>
          </div>`}).join("")};const ci={auto:"var(--hrv-color-primary)",red:"#ef4444",orange:"#f97316",amber:"#f59e0b",yellow:"#eab308",green:"#22c55e",teal:"#14b8a6",cyan:"#06b6d4",blue:"#3b82f6",indigo:"#6366f1",purple:"#a855f7",pink:"#ec4899",grey:"#9ca3af"},fr=new Set(["off","idle","closed","standby","not_home","locked","jammed","locking","unlocking"]),vr=new Set(["unavailable","unknown"]),gr=new Set(["light","switch","input_boolean","fan","climate","cover","media_player","timer","person","device_tracker","lock","binary_sensor"]),pi={light:"mdi:lightbulb",switch:"mdi:toggle-switch",input_boolean:"mdi:toggle-switch",fan:"mdi:fan",sensor:"mdi:gauge",binary_sensor:"mdi:radiobox-blank",climate:"mdi:thermostat",media_player:"mdi:cast",cover:"mdi:window-shutter",timer:"mdi:timer",remote:"mdi:remote",input_number:"mdi:numeric",input_select:"mdi:format-list-bulleted",harvest_action:"mdi:play-circle-outline"},br=`
    :host {
      width: auto !important;
      min-width: unset !important;
      display: inline-flex !important;
      contain: none !important;
      vertical-align: top !important;
      overflow: visible !important;
      line-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    [part=badge] {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px 6px 8px;
      border-radius: 14px;
      background: var(--hrv-card-background, var(--hrv-color-surface, #fff));
      box-shadow: var(--hrv-card-shadow, 0 1px 3px rgba(0,0,0,0.1));
      border: none;
      font-family: var(--hrv-font-family, system-ui, -apple-system, sans-serif);
      color: var(--hrv-color-text, #111827);
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      cursor: default;
      transition: box-shadow var(--hrv-transition-speed, 150ms);
      -webkit-backdrop-filter: var(--hrv-card-backdrop-filter, none);
      backdrop-filter: var(--hrv-card-backdrop-filter, none);
    }
    [part=badge-icon] {
      width: 20px; height: 20px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: color var(--hrv-transition-speed, 150ms);
    }
    [part=badge-icon] svg { width: 100%; height: 100%; }
    [part=badge-text] {
      display: flex; flex-direction: column; gap: 1px; min-width: 0;
    }
    [part=badge-name] {
      font-size: 11px;
      font-weight: var(--hrv-font-weight-medium, 500);
      line-height: 1.3;
      overflow: hidden; text-overflow: ellipsis; max-width: 140px;
    }
    [part=badge-state] {
      font-size: 10px;
      line-height: 1.3;
      color: var(--hrv-color-text-secondary, #6b7280);
      overflow: hidden; text-overflow: ellipsis; max-width: 140px;
    }
    [part=badge-text].single [part=badge-name],
    [part=badge-text].single [part=badge-state] {
      font-size: 12px;
    }
    .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
    @media (prefers-reduced-motion: reduce) {
      [part=badge], [part=badge-icon] { transition: none; }
    }
  `;class yr extends y{constructor(){super(...arguments);o(this,bt,null);o(this,_s,null);o(this,ws,null)}render(){const e=this.def.display_hints??{},s=e.badge_show_icon!==!1,r=e.badge_show_name!==!1,n=e.badge_show_state!==!1,h=r?"":" sr-only",l=n?"":" sr-only",m=r&&!n||!r&&n?" single":"";if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${br}</style>
        <div part="badge" aria-label="${f(this.def.friendly_name)}" title="${f(this.def.friendly_name)}">
          ${s?'<span part="badge-icon" aria-hidden="true"></span>':""}
          <span part="badge-text" class="${m}">
            <span part="badge-name" class="${h}">${f(this.def.friendly_name)}</span>
            <span part="badge-state" class="${l}" aria-live="polite"></span>
          </span>
        </div>
        ${this.renderAriaLiveHTML()}
      `,i(this,bt,this.root.querySelector("[part=badge-icon]")),i(this,_s,this.root.querySelector("[part=badge-state]")),i(this,ws,this.root.querySelector("[part=badge]")),s){const g=pi[this.def.domain]??"mdi:help-circle";this.renderIcon(this.resolveIcon(this.def.icon,g),"badge-icon")}}applyState(e,s){const n=(this.def.display_hints??{}).badge_icon_color??"auto",h=vr.has(e),l=gr.has(this.def.domain),c=!h&&(!l||!fr.has(e));if(t(this,bt)){n!=="auto"?(t(this,bt).style.color=ci[n],t(this,bt).style.opacity=c?"1":"0.65"):(t(this,bt).style.color=c?ci.auto:"#9ca3af",t(this,bt).style.opacity="1");const u=pi[this.def.domain]??"mdi:help-circle",A=this.def.icon_state_map?.[e]??this.def.icon??u;this.renderIcon(this.resolveIcon(A,u),"badge-icon")}const m=s?.unit_of_measurement??this.def.unit_of_measurement??"",g=this.formatStateLabel(e),v=m?`${g} ${m}`:g;t(this,_s)&&(t(this,_s).textContent=v),t(this,ws)&&(t(this,ws).title=`${this.def.friendly_name}: ${v}`),this.announceState(`${this.def.friendly_name}, ${e}`)}}bt=new WeakMap,_s=new WeakMap,ws=new WeakMap;const xr=window.__HARVEST_PACK_ID__||"shrooms";_._packs=_._packs||{},_._packs[xr]={light:Bi,switch:ai,input_boolean:ai,sensor:fo,"sensor.temperature":fo,"sensor.humidity":fo,"sensor.battery":fo,fan:Zi,binary_sensor:ji,generic:Gi,harvest_action:Yi,input_number:Ki,input_select:hi,select:hi,cover:Qi,remote:er,timer:or,climate:rr,media_player:ar,weather:ur,badge:yr,_capabilities:{fan:{display_modes:["on-off","continuous","stepped","cycle"]},input_number:{display_modes:["slider","buttons"]},input_select:{display_modes:["pills","dropdown"]},select:{display_modes:["pills","dropdown"]},light:{features:["brightness","color_temp","rgb"]},climate:{features:["hvac_modes","presets","fan_mode","swing_mode"]},cover:{features:["position","tilt"]},media_player:{features:["transport","volume","source"]}}}})();})();
