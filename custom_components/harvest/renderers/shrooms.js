(()=>{var ur=Object.defineProperty;var oi=y=>{throw TypeError(y)};var fr=(y,f,p)=>f in y?ur(y,f,{enumerable:!0,configurable:!0,writable:!0,value:p}):y[f]=p;var fo=(y,f,p)=>fr(y,typeof f!="symbol"?f+"":f,p),Ho=(y,f,p)=>f.has(y)||oi("Cannot "+p);var t=(y,f,p)=>(Ho(y,f,"read from private field"),p?p.call(y):f.get(y)),r=(y,f,p)=>f.has(y)?oi("Cannot add the same private member more than once"):f instanceof WeakSet?f.add(y):f.set(y,p),i=(y,f,p,rt)=>(Ho(y,f,"write to private field"),rt?rt.call(y,p):f.set(y,p),p),l=(y,f,p)=>(Ho(y,f,"access private method"),p);(function(){"use strict";var Rs,$e,Mt,kt,Yt,B,js,Ht,Gt,Ut,nt,Kt,Xt,W,Z,Et,Se,Jt,Le,at,Eo,To,ii,ht,Qt,Ae,ut,te,Y,Me,Tt,It,qt,R,L,ee,Bt,Ot,X,ke,Fs,se,S,wo,ri,Io,qo,Bo,Co,ni,Ws,He,Ys,Ee,G,lt,oe,Gs,Te,U,Ie,dt,ft,qe,Us,Be,vt,ai,Oo,hi,Ks,Oe,D,T,ie,re,gt,xo,Vt,Ve,bt,ne,Dt,P,q,li,di,Vo,Do,Ns,Xs,De,J,Pe,Ne,Q,ze,yt,Ze,ae,he,le,xt,ct,Re,Js,je,Fe,N,ci,Po,pi,No,mi,We,Ye,Qs,Ge,Pt,Nt,de,ce,pe,Ue,Ke,tt,Xe,j,ui,fi,vi,vo,to,Je,Qe,ts,es,ss,os,is,rs,ns,as,O,hs,ls,_t,me,pt,z,wt,Ct,ds,et,cs,ps,ms,eo,so,oo,us,zt,ue,fe,ve,io,ro,C,gi,zo,Zo,bi,yi,Ro,go,xi,no,fs,ge,vs,gs,bs,Zt,ao,ho,lo,ys,st,Rt,co,be,ot,jt,$t,xs,ye,jo,_i,po,_s,ws,xe,Cs,$s,Ss,St,mt,Ls,I,Ce,$o,_e,we,Fo,Wo,mo,As,Ft,_o,Ms,ks,Hs,Es,it,Ts,Is,Wt,qs,Bs,Os,Vs;const y=window.HArvest;if(!y||!y.renderers||!y.renderers.BaseCard){console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");return}const f=y.renderers.BaseCard,p=window.HArvest.esc;function rt(a,d){let e=null,s=null,o=null;function n(...h){s=this,o=h,e&&clearTimeout(e),e=setTimeout(()=>{e=null,a.apply(s,o),o=null},d)}return n.flush=function(){e!==null&&(clearTimeout(e),e=null,o&&(a.apply(s,o),o=null))},n}function $(a){return a?a.charAt(0).toUpperCase()+a.slice(1).replace(/_/g," "):""}function vr(a,d,e){return Math.min(e,Math.max(d,a))}function Yo(a,d){const e=a.querySelector(".shroom-controls-shell");e&&e.setAttribute("data-collapsed",String(d))}function Lt(a,d){a&&(a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-label",d),a.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),a.click())}))}function A(a){a.querySelectorAll("[part=companion]").forEach(d=>{d.title=d.getAttribute("aria-label")??"Companion"})}const wi={light:"var(--hrv-ex-shroom-light, #ff9800)",switch:"var(--hrv-ex-shroom-switch, #2196f3)",input_boolean:"var(--hrv-ex-shroom-switch, #2196f3)",lock:"var(--hrv-ex-shroom-lock, #2196f3)",fan:"var(--hrv-ex-shroom-fan, #4caf50)",climate:"var(--hrv-ex-shroom-climate, #ff5722)",cover:"var(--hrv-ex-shroom-cover, #9c27b0)",media_player:"var(--hrv-ex-shroom-media, #e91e63)",sensor:"var(--hrv-ex-shroom-sensor, #03a9f4)",binary_sensor:"var(--hrv-ex-shroom-binary, #8bc34a)",input_number:"var(--hrv-ex-shroom-input, #00bcd4)",input_select:"var(--hrv-ex-shroom-input, #00bcd4)",timer:"var(--hrv-ex-shroom-timer, #673ab7)",remote:"var(--hrv-ex-shroom-remote, #607d8b)",weather:"var(--hrv-ex-shroom-weather, #ff9800)"};function Go(a){return wi[a]??"var(--hrv-color-primary, #ff9800)"}function w(a,d,e){if(!a)return;const s=Go(d);e?(a.style.background=`color-mix(in srgb, ${s} 20%, transparent)`,a.style.color=s):(a.style.background="var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))",a.style.color="var(--hrv-color-icon, #757575)")}function M(a){const d=(a.config.displayHints??a.def.display_hints??{}).layout??null,e=a.root.host;e&&(d==="vertical"?e.setAttribute("data-layout","vertical"):e.removeAttribute("data-layout"))}function Ci(a){if(!a)return()=>{};const d=80,e=1.6,s=.96,o=.04;let n=null,h=0,c=0,m=0,u=!1,x=0;const g=[],v=()=>{x&&(cancelAnimationFrame(x),x=0)},V=b=>{for(;g.length&&g[0].t<b-d;)g.shift();if(g.length<2)return 0;const E=g[0],K=g[g.length-1],uo=K.t-E.t;return uo<=0?0:(K.x-E.x)/uo},F=()=>{if(Math.abs(m)<o)return;let b=performance.now();const E=K=>{const uo=K-b;if(b=K,a.scrollLeft-=m*uo,m*=Math.pow(s,uo/16),Math.abs(m)<o){x=0,m=0;return}const mr=a.scrollWidth-a.clientWidth;if(a.scrollLeft<=0||a.scrollLeft>=mr){x=0,m=0;return}x=requestAnimationFrame(E)};x=requestAnimationFrame(E)},Ds=b=>{if(a.scrollWidth<=a.clientWidth||b.pointerType==="touch")return;const E=b.target;if(!(E&&E!==a&&E.closest?.("button, a"))){v(),n=b.pointerId,h=b.clientX,c=a.scrollLeft,m=0,u=!1,g.length=0,g.push({x:b.clientX,t:b.timeStamp});try{a.setPointerCapture(n)}catch{}}},Ps=b=>{if(b.pointerId!==n)return;const E=b.clientX-h;Math.abs(E)>4&&(u=!0,a.dataset.dragging="true"),a.scrollLeft=c-E,g.push({x:b.clientX,t:b.timeStamp});const K=b.timeStamp-d;for(;g.length>2&&g[0].t<K;)g.shift()},_=b=>{if(b.pointerId===n){try{a.releasePointerCapture(n)}catch{}if(n=null,u){const E=K=>{K.stopPropagation(),K.preventDefault()};window.addEventListener("click",E,{capture:!0,once:!0}),requestAnimationFrame(()=>a.removeAttribute("data-dragging")),m=V(b.timeStamp)*e,F()}g.length=0}};return a.addEventListener("pointerdown",Ds),a.addEventListener("pointermove",Ps),a.addEventListener("pointerup",_),a.addEventListener("pointercancel",_),a.addEventListener("wheel",v,{passive:!0}),a.addEventListener("touchstart",v,{passive:!0}),()=>{v(),a.removeEventListener("pointerdown",Ds),a.removeEventListener("pointermove",Ps),a.removeEventListener("pointerup",_),a.removeEventListener("pointercancel",_),a.removeEventListener("wheel",v),a.removeEventListener("touchstart",v)}}function Uo(a,d){if(a!=="on")return null;if(d.rgb_color){const[s,o,n]=d.rgb_color;return(.299*s+.587*o+.114*n)/255>.85?`rgb(${Math.round(s*.8)}, ${Math.round(o*.8)}, ${Math.round(n*.75)})`:`rgb(${s}, ${o}, ${n})`}if(d.hs_color)return`hsl(${d.hs_color[0]}, ${Math.max(d.hs_color[1],50)}%, 55%)`;const e=d.color_temp_kelvin??(d.color_temp?Math.round(1e6/d.color_temp):null);return e?e>=5200?"#4ba3e0":e>=4500?"#e0c85a":e<=3e3?"#e6a040":"#ddb840":null}const k=`
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
  `,So=`
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
  `,zs=`
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
  `,At=`
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
  `,H=`
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
    ${k}
    ${H}
  `;class Ko extends f{constructor(){super(...arguments);r(this,Rs,null);r(this,$e,null);r(this,Mt,!1)}render(){M(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${$i}</style>
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
      `,i(this,Rs,this.root.querySelector(".shroom-icon-shape")),i(this,$e,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline"),"card-icon");const s=this.root.querySelector(".shroom-state-item");e&&(Lt(s,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(s,{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand("toggle",{})}})),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,Mt,e==="on");const o=this.def.domain??"switch";w(t(this,Rs),o,t(this,Mt)),t(this,$e)&&(t(this,$e).textContent=$(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,Mt)));const h=t(this,Mt)?this.resolveIcon(this.def.icon,"mdi:toggle-switch"):this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="toggle"||e==="turn_on"||e==="turn_off"?{state:e==="toggle"?t(this,Mt)?"off":"on":e==="turn_on"?"on":"off",attributes:{}}:null}}Rs=new WeakMap,$e=new WeakMap,Mt=new WeakMap;const Zs=["brightness","temp","color"],Si={brightness:"mdi:brightness-4",temp:"mdi:thermometer",color:"mdi:palette"},Li=`
    ${k}
    ${So}
    ${zs}
    ${At}
    ${H}

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
  `;class Ai extends f{constructor(e,s,o,n){super(e,s,o,n);r(this,at);r(this,kt,null);r(this,Yt,null);r(this,B,null);r(this,js,null);r(this,Ht,null);r(this,Gt,null);r(this,Ut,[]);r(this,nt,0);r(this,Kt,4e3);r(this,Xt,0);r(this,W,!1);r(this,Z,0);r(this,Et,2e3);r(this,Se,6500);r(this,Jt,{});r(this,Le);i(this,Le,rt(l(this,at,ii).bind(this),300))}render(){M(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??{},n=o.show_brightness!==!1&&s.includes("brightness"),h=o.show_color_temp!==!1&&s.includes("color_temp"),c=o.show_rgb!==!1&&s.includes("rgb_color"),m=e&&(n||h||c),u=[n,h,c].filter(Boolean).length;i(this,Et,this.def.feature_config?.min_color_temp_kelvin??2e3),i(this,Se,this.def.feature_config?.max_color_temp_kelvin??6500);const x=[n,h,c];x[t(this,Z)]||(i(this,Z,x.findIndex(Boolean)),t(this,Z)===-1&&i(this,Z,0)),this.root.innerHTML=`
        <style>${Li}</style>
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
                    ${c?'<button class="shroom-light-mode-btn" data-mode="color" type="button" aria-label="Color"><span part="light-mode-color"></span></button>':""}
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
      `,i(this,kt,this.root.querySelector(".shroom-icon-shape")),i(this,Yt,this.root.querySelector(".shroom-secondary")),i(this,B,this.root.querySelector(".shroom-slider-input")),i(this,js,this.root.querySelector(".shroom-slider-bg")),i(this,Ht,this.root.querySelector(".shroom-slider-cover")),i(this,Gt,this.root.querySelector(".shroom-slider-edge")),i(this,Ut,[...this.root.querySelectorAll(".shroom-light-mode-btn")]),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon");for(const v of t(this,Ut))this.renderIcon(Si[v.dataset.mode]??"mdi:help-circle",`light-mode-${v.dataset.mode}`);const g=this.root.querySelector(".shroom-state-item");e&&(Lt(g,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(g,{onTap:()=>{const v=this.config.gestureConfig?.tap;if(v){this._runAction(v);return}this.config.card?.sendCommand("toggle",{})}}));for(const v of t(this,Ut))v.addEventListener("click",()=>{const V=v.dataset.mode,F=Zs.indexOf(V);F===-1||F===t(this,Z)||(i(this,Z,F),l(this,at,Eo).call(this))});t(this,B)&&(t(this,B).addEventListener("input",()=>{const v=parseInt(t(this,B).value,10),V=Zs[t(this,Z)]??"brightness";V==="brightness"?i(this,nt,v):V==="temp"?i(this,Kt,Math.round(t(this,Et)+v/100*(t(this,Se)-t(this,Et)))):i(this,Xt,Math.round(v*3.6)),l(this,at,To).call(this),t(this,Le).call(this,V)}),this.guardSlider(t(this,B),t(this,Le))),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,W,e==="on"),i(this,Jt,s),Yo(this.root,!t(this,W));const o=Uo(e,s);t(this,W)&&o?t(this,kt)&&(t(this,kt).style.background=`color-mix(in srgb, ${o} 20%, transparent)`,t(this,kt).style.color=o):w(t(this,kt),"light",t(this,W)),i(this,nt,s.brightness!=null?Math.round(s.brightness/255*100):0),i(this,Kt,s.color_temp_kelvin??(s.color_temp?Math.round(1e6/s.color_temp):4e3)),i(this,Xt,s.hs_color?.[0]??42),t(this,Yt)&&(t(this,W)&&s.brightness!=null?t(this,Yt).textContent=`${t(this,nt)}%`:t(this,Yt).textContent=$(e));const n=this.root.querySelector(".shroom-slider-wrap");if(n){const m=Uo("on",s);n.style.setProperty("--shroom-light-accent",m??"var(--hrv-ex-shroom-light, #ff9800)")}l(this,at,Eo).call(this);const h=this.root.querySelector(".shroom-state-item");if(h?.hasAttribute("role")&&h.setAttribute("aria-pressed",String(t(this,W))),t(this,B)){const m=Zs[t(this,Z)]??"brightness",u=parseInt(t(this,B).value,10);m==="brightness"?t(this,B).setAttribute("aria-valuetext",`${u}%`):m==="temp"?t(this,B).setAttribute("aria-valuetext",`${u}K`):t(this,B).setAttribute("aria-valuetext",`${u}`)}const c=t(this,W)?this.resolveIcon(this.def.icon,"mdi:lightbulb"):this.resolveIcon(this.def.icon,"mdi:lightbulb-off");this.renderIcon(c,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}${t(this,W)?`, ${t(this,nt)}%`:""}`)}predictState(e,s){if(e==="toggle")return{state:t(this,W)?"off":"on",attributes:t(this,Jt)};if(e==="turn_on"){const o={...t(this,Jt)};return s.brightness!=null&&(o.brightness=s.brightness),s.color_temp_kelvin!=null&&(o.color_temp_kelvin=s.color_temp_kelvin),s.hs_color!=null&&(o.hs_color=s.hs_color),{state:"on",attributes:o}}return e==="turn_off"?{state:"off",attributes:t(this,Jt)}:null}}kt=new WeakMap,Yt=new WeakMap,B=new WeakMap,js=new WeakMap,Ht=new WeakMap,Gt=new WeakMap,Ut=new WeakMap,nt=new WeakMap,Kt=new WeakMap,Xt=new WeakMap,W=new WeakMap,Z=new WeakMap,Et=new WeakMap,Se=new WeakMap,Jt=new WeakMap,Le=new WeakMap,at=new WeakSet,Eo=function(){const e=Zs[t(this,Z)]??"brightness",s=t(this,js);s?.classList.remove("shroom-brightness-bg","shroom-ct-bg","shroom-hue-bg"),e==="brightness"?s?.classList.add("shroom-brightness-bg"):e==="temp"?s?.classList.add("shroom-ct-bg"):s?.classList.add("shroom-hue-bg");for(const o of t(this,Ut))o.hidden=o.dataset.mode===e;l(this,at,To).call(this)},To=function(){const e=Zs[t(this,Z)]??"brightness";let s=0;e==="brightness"?s=t(this,nt):e==="temp"?s=Math.round((t(this,Kt)-t(this,Et))/(t(this,Se)-t(this,Et))*100):s=Math.round(t(this,Xt)/3.6);const o=e==="brightness";t(this,Ht)&&(o?(t(this,Ht).style.display="",t(this,Ht).style.left=`${s}%`):t(this,Ht).style.display="none"),t(this,Gt)&&(t(this,Gt).style.display=o?"none":"",o||(t(this,Gt).style.left=`${s}%`)),t(this,B)&&!this.isSliderActive(t(this,B))&&(t(this,B).value=String(s))},ii=function(e){e==="brightness"?t(this,nt)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:Math.round(t(this,nt)*2.55)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,Kt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,Xt),100]})};const Mi={temperature:"var(--hrv-ex-shroom-climate, #ff5722)",humidity:"var(--hrv-ex-shroom-sensor, #03a9f4)",battery:"var(--hrv-ex-shroom-fan, #4caf50)"},ki={temperature:"mdi:thermometer",humidity:"mdi:water-percent",battery:"mdi:battery"};function Hi(a){return a==null||isNaN(a)||a>=90?"mdi:battery":a>=70?"mdi:battery-70":a>=50?"mdi:battery-50":a>=30?"mdi:battery-30":a>=10?"mdi:battery-10":"mdi:battery-alert"}function Ei(a){return a==null||isNaN(a)?"var(--hrv-ex-shroom-fan, #4caf50)":a<=10?"var(--hrv-color-error, #f44336)":a<=20?"var(--hrv-color-warning, #ff9800)":"var(--hrv-ex-shroom-fan, #4caf50)"}const Ti=`
    ${k}
    ${H}
  `;class bo extends f{constructor(){super(...arguments);r(this,ht,null);r(this,Qt,null);r(this,Ae,null)}render(){M(this),i(this,Ae,this.def.device_class??null);const e=ki[t(this,Ae)]??"mdi:gauge";this.root.innerHTML=`
        <style>${Ti}</style>
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
      `,i(this,ht,this.root.querySelector(".shroom-icon-shape")),i(this,Qt,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,e),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}applyState(e,s){const o=parseFloat(e),n=this.def.unit_of_measurement??"",h=!isNaN(o),c=t(this,Ae);if(t(this,Qt))if(h){const m=s.suggested_display_precision,u=m!=null?o.toFixed(m):String(Math.round(o*10)/10);t(this,Qt).textContent=n?`${u} ${n}`:u}else t(this,Qt).textContent=$(e);if(c==="battery"&&h){const m=Ei(o);t(this,ht)&&(t(this,ht).style.background=`color-mix(in srgb, ${m} 20%, transparent)`,t(this,ht).style.color=m),this.renderIcon(this.resolveIcon(this.def.icon,Hi(o)),"card-icon")}else{const m=Mi[c]??Go("sensor");t(this,ht)&&(t(this,ht).style.background=`color-mix(in srgb, ${m} 20%, transparent)`,t(this,ht).style.color=m)}this.announceState(`${this.def.friendly_name}, ${h?o:e} ${n}`)}}ht=new WeakMap,Qt=new WeakMap,Ae=new WeakMap;const Ii=`
    ${k}
    ${So}
    ${zs}
    ${At}
    ${H}

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
  `;class qi extends f{constructor(e,s,o,n){super(e,s,o,n);r(this,S);r(this,ut,null);r(this,te,null);r(this,Y,null);r(this,Me,null);r(this,Tt,null);r(this,It,null);r(this,qt,null);r(this,R,!1);r(this,L,0);r(this,ee,!1);r(this,Bt,"forward");r(this,Ot,null);r(this,X,[]);r(this,ke);r(this,Fs,!1);r(this,se,!1);i(this,ke,rt(l(this,S,ni).bind(this),300)),i(this,X,e.feature_config?.preset_modes??[])}render(){M(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??this.def.display_hints??{},n=o.display_mode??null;let h=s.includes("set_speed");const c=o.show_oscillate!==!1&&s.includes("oscillate"),m=o.show_direction!==!1&&s.includes("direction"),u=o.show_presets!==!1&&s.includes("preset_mode");n==="on-off"&&(h=!1);let x=e&&h,g=x&&t(this,S,ri),v=!1,V=!1;n==="continuous"?g=!1:n==="stepped"?V=g:n==="cycle"?(g=!0,v=!0):g&&t(this,X).length?v=!0:g&&(V=!0),i(this,Fs,v);const F=e&&(c||m||u);this.root.innerHTML=`
        <style>${Ii}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${x||F?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${x&&!g?`
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
                ${x&&V?`
                  <div class="shroom-fan-step-dots">
                    ${t(this,S,Io).map((_,b)=>`
                      <button class="shroom-fan-step-dot" data-pct="${_}" type="button"
                        data-active="false"
                        aria-label="Speed ${b+1} (${_}%)"
                        title="Speed ${b+1} (${_}%)">${b+1}</button>
                    `).join("")}
                  </div>
                `:""}
                ${x&&v?`
                  <div style="display:flex;justify-content:center;">
                    <button class="shroom-fan-cycle-btn" type="button"
                      title="Cycle speed"
                      aria-label="Cycle fan speed">
                      <svg viewBox="0 0 24 24"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg>
                    </button>
                  </div>
                `:""}
                ${F?`
                  <div class="shroom-fan-feat-row">
                    ${c?'<button class="shroom-btn shroom-fan-feat" data-feat="oscillate" type="button" aria-label="Oscillate" aria-pressed="false">Oscillate</button>':""}
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
      `,i(this,ut,this.root.querySelector(".shroom-icon-shape")),i(this,te,this.root.querySelector(".shroom-secondary")),i(this,Y,this.root.querySelector(".shroom-slider-input")),i(this,Me,this.root.querySelector(".shroom-slider-cover")),i(this,Tt,this.root.querySelector('[data-feat="oscillate"]')),i(this,It,this.root.querySelector('[data-feat="direction"]')),i(this,qt,this.root.querySelector('[data-feat="preset"]')),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"card-icon");const Ds=this.root.querySelector(".shroom-state-item");e&&(Lt(Ds,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(Ds,{onTap:()=>{const _=this.config.gestureConfig?.tap;if(_){this._runAction(_);return}this.config.card?.sendCommand("toggle",{})}})),t(this,Y)&&(t(this,Y).addEventListener("input",()=>{const _=Number(t(this,Y).value);i(this,L,_),t(this,Y).setAttribute("aria-valuetext",`${Math.round(_)}%`),l(this,S,qo).call(this),t(this,ke).call(this)}),this.guardSlider(t(this,Y),t(this,ke))),this.root.querySelectorAll(".shroom-fan-step-dot").forEach(_=>{_.addEventListener("click",()=>{const b=Number(_.getAttribute("data-pct"));i(this,L,b),i(this,R,!0),l(this,S,Bo).call(this),this.config.card?.sendCommand("set_percentage",{percentage:b})})}),this.root.querySelector(".shroom-fan-cycle-btn")?.addEventListener("click",()=>{const _=t(this,S,Io);if(!_.length)return;let b;if(!t(this,R)||t(this,L)===0)b=_[0];else{const E=_.findIndex(K=>K>t(this,L));b=E===-1?_[0]:_[E]}i(this,L,b),i(this,R,!0),this.config.card?.sendCommand("set_percentage",{percentage:b})}),t(this,Tt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,ee)})}),t(this,It)?.addEventListener("click",()=>{const _=t(this,Bt)==="forward"?"reverse":"forward";i(this,Bt,_),l(this,S,Co).call(this),this.config.card?.sendCommand("set_direction",{direction:_})}),t(this,qt)?.addEventListener("click",()=>{if(!t(this,X).length)return;const b=((t(this,Ot)?t(this,X).indexOf(t(this,Ot)):-1)+1)%t(this,X).length,E=t(this,X)[b];i(this,Ot,E),l(this,S,Co).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:E})}),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,R,e==="on"),i(this,L,s?.percentage??0),i(this,ee,s?.oscillating??!1),i(this,Bt,s?.direction??"forward"),i(this,Ot,s?.preset_mode??null),s?.preset_modes?.length&&i(this,X,s.preset_modes),i(this,se,t(this,Fs)||s?.assumed_state===!0),Yo(this.root,!t(this,R)),w(t(this,ut),"fan",t(this,R));const o=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??"mdi:fan";if(this.renderIcon(this.resolveIcon(o,"mdi:fan"),"card-icon"),t(this,ut))if(t(this,R)&&t(this,L)>0&&!t(this,se)&&this.config.animate!==!1){const h=1/(1.5*Math.pow(t(this,L)/100,.5));t(this,ut).setAttribute("data-spinning","true"),t(this,ut).style.setProperty("--shroom-fan-duration",`${h.toFixed(2)}s`)}else t(this,ut).setAttribute("data-spinning","false");t(this,te)&&(t(this,R)&&t(this,L)>0&&!t(this,se)?t(this,te).textContent=`${Math.round(t(this,L))}%`:t(this,te).textContent=$(e)),l(this,S,qo).call(this),l(this,S,Bo).call(this),l(this,S,Co).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,L)>0&&!t(this,se)?`, ${Math.round(t(this,L))}%`:""))}predictState(e,s){return e==="toggle"?{state:t(this,R)?"off":"on",attributes:{percentage:t(this,L)}}:e==="set_percentage"?{state:"on",attributes:{percentage:s.percentage,oscillating:t(this,ee),direction:t(this,Bt),preset_mode:t(this,Ot),preset_modes:t(this,X)}}:e==="oscillate"?{state:"on",attributes:{percentage:t(this,L),oscillating:s.oscillating,direction:t(this,Bt)}}:e==="set_direction"?{state:"on",attributes:{percentage:t(this,L),oscillating:t(this,ee),direction:s.direction}}:null}}ut=new WeakMap,te=new WeakMap,Y=new WeakMap,Me=new WeakMap,Tt=new WeakMap,It=new WeakMap,qt=new WeakMap,R=new WeakMap,L=new WeakMap,ee=new WeakMap,Bt=new WeakMap,Ot=new WeakMap,X=new WeakMap,ke=new WeakMap,Fs=new WeakMap,se=new WeakMap,S=new WeakSet,wo=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},ri=function(){return t(this,S,wo)>1},Io=function(){const e=t(this,S,wo),s=[];for(let o=1;o*e<=100.001;o++)s.push(o*e);return s},qo=function(){if(!t(this,Y))return;const e=t(this,L);this.isSliderActive(t(this,Y))||(t(this,Y).value=String(e)),t(this,Me)&&(t(this,Me).style.left=`${e}%`)},Bo=function(){const e=t(this,S,wo)/2;this.root.querySelectorAll(".shroom-fan-step-dot").forEach(s=>{const o=Number(s.getAttribute("data-pct"));s.setAttribute("data-active",String(t(this,R)&&t(this,L)>=o-e))})},Co=function(){t(this,Tt)&&(t(this,Tt).setAttribute("aria-pressed","false"),t(this,Tt).textContent="Oscillate"),t(this,It)&&(t(this,It).textContent="Direction",t(this,It).setAttribute("aria-label","Direction")),t(this,qt)&&(t(this,qt).textContent="Preset",t(this,qt).setAttribute("data-active","false"))},ni=function(){t(this,L)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,L)})};const Bi=`
    ${k}
    ${H}
  `;class Oi extends f{constructor(){super(...arguments);r(this,Ws,null);r(this,He,null)}render(){M(this),this.root.innerHTML=`
        <style>${Bi}</style>
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
      `,i(this,Ws,this.root.querySelector(".shroom-icon-shape")),i(this,He,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}applyState(e,s){const o=e==="on";w(t(this,Ws),"binary_sensor",o);const n=this.formatStateLabel(e);t(this,He)&&(t(this,He).textContent=n);const h=o?"mdi:radiobox-marked":"mdi:radiobox-blank",c=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(c,h),"card-icon"),this.announceState(`${this.def.friendly_name}, ${n}`)}}Ws=new WeakMap,He=new WeakMap;const Vi=`
    ${k}
    ${H}

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
  `;class Di extends f{constructor(){super(...arguments);r(this,Ys,null);r(this,Ee,null);r(this,G,null);r(this,lt,!1);r(this,oe,!1)}render(){M(this);const e=this.def.capabilities==="read-write";i(this,oe,!1),this.root.innerHTML=`
        <style>${Vi}</style>
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
      `,i(this,Ys,this.root.querySelector(".shroom-icon-shape")),i(this,Ee,this.root.querySelector(".shroom-secondary")),i(this,G,this.root.querySelector(".shroom-generic-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:help-circle"),"card-icon"),t(this,G)&&e&&this._attachGestureHandlers(t(this,G),{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),A(this.root)}applyState(e,s){const o=e==="on"||e==="off";i(this,lt,e==="on"),t(this,Ee)&&(t(this,Ee).textContent=$(e));const n=this.def.domain??"generic";w(t(this,Ys),n,t(this,lt)),t(this,G)&&(o&&!t(this,oe)&&(t(this,G).removeAttribute("hidden"),i(this,oe,!0)),t(this,oe)&&(t(this,G).setAttribute("data-on",String(t(this,lt))),t(this,G).setAttribute("aria-pressed",String(t(this,lt))),t(this,G).textContent=t(this,lt)?"On":"Off",t(this,G).title=t(this,lt)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e!=="toggle"?null:{state:t(this,lt)?"off":"on",attributes:{}}}}Ys=new WeakMap,Ee=new WeakMap,G=new WeakMap,lt=new WeakMap,oe=new WeakMap;const Pi=`
    ${k}
    ${So}
    ${zs}
    ${At}
    ${H}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }

    .shroom-controls-shell {
      margin-left: calc(var(--hrv-ex-shroom-icon-size, 42px) + var(--hrv-ex-shroom-spacing, 12px));
    }
  `;class Xo extends f{constructor(e,s,o,n){super(e,s,o,n);r(this,vt);r(this,Gs,null);r(this,Te,null);r(this,U,null);r(this,Ie,null);r(this,dt,0);r(this,ft,0);r(this,qe,100);r(this,Us,1);r(this,Be);i(this,Be,rt(l(this,vt,hi).bind(this),300))}render(){M(this);const e=this.def.capabilities==="read-write";if(i(this,ft,this.def.feature_config?.min??0),i(this,qe,this.def.feature_config?.max??100),i(this,Us,this.def.feature_config?.step??1),this.root.innerHTML=`
        <style>${Pi}</style>
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
                  min="${t(this,ft)}" max="${t(this,qe)}" step="${t(this,Us)}" value="${t(this,ft)}"
                  aria-label="${p(this.def.friendly_name)} value"
                  aria-valuetext="${t(this,ft)}${this.def.unit_of_measurement?` ${p(this.def.unit_of_measurement)}`:""}">
                <div class="shroom-slider-focus-ring"></div>
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Gs,this.root.querySelector(".shroom-icon-shape")),i(this,Te,this.root.querySelector(".shroom-secondary")),i(this,U,this.root.querySelector(".shroom-slider-input")),i(this,Ie,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:ray-vertex"),"card-icon"),w(t(this,Gs),"input_number",!0),t(this,U)){const s=this.def.unit_of_measurement??"";t(this,U).addEventListener("input",()=>{i(this,dt,parseFloat(t(this,U).value)),t(this,U).setAttribute("aria-valuetext",`${t(this,dt)}${s?` ${s}`:""}`),l(this,vt,Oo).call(this),t(this,Be).call(this)}),this.guardSlider(t(this,U),t(this,Be))}this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}applyState(e,s){const o=parseFloat(e);if(isNaN(o))return;i(this,dt,o),l(this,vt,Oo).call(this);const n=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${o}${n?` ${n}`:""}`)}predictState(e,s){return e==="set_value"&&s.value!==void 0?{state:String(s.value),attributes:{}}:null}}Gs=new WeakMap,Te=new WeakMap,U=new WeakMap,Ie=new WeakMap,dt=new WeakMap,ft=new WeakMap,qe=new WeakMap,Us=new WeakMap,Be=new WeakMap,vt=new WeakSet,ai=function(e){const s=t(this,qe)-t(this,ft);return s===0?0:Math.max(0,Math.min(100,(e-t(this,ft))/s*100))},Oo=function(){const e=l(this,vt,ai).call(this,t(this,dt));t(this,Ie)&&(t(this,Ie).style.left=`${e}%`),t(this,U)&&!this.isSliderActive(t(this,U))&&(t(this,U).value=String(t(this,dt)));const s=this.def.unit_of_measurement??"";t(this,Te)&&(t(this,Te).textContent=`${t(this,dt)}${s?` ${s}`:""}`)},hi=function(){this.config.card?.sendCommand("set_value",{value:t(this,dt)})};const Ni=`
    ${k}
    ${At}
    ${H}

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
  `;class Jo extends f{constructor(){super(...arguments);r(this,q);r(this,Ks,null);r(this,Oe,null);r(this,D,null);r(this,T,null);r(this,ie,null);r(this,re,[]);r(this,gt,[]);r(this,xo,"");r(this,Vt,[]);r(this,Ve,"");r(this,bt,!1);r(this,ne,"pills");r(this,Dt,null);r(this,P,null)}render(){M(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";i(this,ne,s==="dropdown"?"dropdown":"pills"),i(this,Vt,this.def.feature_config?.options??[]);const o=e?t(this,ne)==="dropdown"?`
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
        <style>${Ni}</style>
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
      `,i(this,Ks,this.root.querySelector(".shroom-icon-shape")),i(this,Oe,this.root.querySelector(".shroom-secondary")),i(this,D,this.root.querySelector(".shroom-select-current")),i(this,T,this.root.querySelector(".shroom-select-dropdown")),i(this,ie,this.root.querySelector(".shroom-select-grid")),i(this,re,[]),i(this,gt,[]),i(this,Ve,""),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:form-select"),"card-icon"),w(t(this,Ks),"input_select",!0),t(this,D)&&e&&(t(this,D).addEventListener("click",n=>{n.stopPropagation(),t(this,bt)?l(this,q,Ns).call(this):l(this,q,Do).call(this)}),t(this,D).addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" "||n.key==="ArrowDown")&&!t(this,bt)?(n.preventDefault(),l(this,q,Do).call(this),t(this,gt)[0]?.focus()):n.key==="Escape"&&t(this,bt)&&(l(this,q,Ns).call(this),t(this,D).focus())}),i(this,Dt,n=>{t(this,bt)&&!this.root.host.contains(n.target)&&l(this,q,Ns).call(this)}),document.addEventListener("click",t(this,Dt))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,xo,e);const o=s?.options,n=Array.isArray(o)&&o.length?o:t(this,Vt);i(this,Vt,n),t(this,Oe)&&(t(this,Oe).textContent=e);const h=n.join("|");if(h!==t(this,Ve)&&(i(this,Ve,h),t(this,ne)==="dropdown"?l(this,q,di).call(this,n):l(this,q,li).call(this,n)),t(this,ne)==="dropdown"){const c=this.root.querySelector(".shroom-select-label");c&&(c.textContent=e);for(const m of t(this,gt)){const u=m.dataset.option===e;m.setAttribute("data-active",String(u)),m.setAttribute("aria-selected",String(u))}}else for(const c of t(this,re))c.setAttribute("data-active",String(c.dataset.option===e));this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="select_option"&&s.option!==void 0?{state:String(s.option),attributes:{options:t(this,Vt)}}:null}destroy(){t(this,Dt)&&(document.removeEventListener("click",t(this,Dt)),i(this,Dt,null)),t(this,P)&&(window.removeEventListener("scroll",t(this,P),!0),window.removeEventListener("resize",t(this,P)),i(this,P,null));try{t(this,T)?.hidePopover?.()}catch{}}}Ks=new WeakMap,Oe=new WeakMap,D=new WeakMap,T=new WeakMap,ie=new WeakMap,re=new WeakMap,gt=new WeakMap,xo=new WeakMap,Vt=new WeakMap,Ve=new WeakMap,bt=new WeakMap,ne=new WeakMap,Dt=new WeakMap,P=new WeakMap,q=new WeakSet,li=function(e){if(t(this,ie)){t(this,ie).innerHTML="",i(this,re,[]);for(const s of e){const o=document.createElement("button");o.type="button",o.className="shroom-select-pill",o.dataset.option=s,o.textContent=$(s),o.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s})}),t(this,ie).appendChild(o),t(this,re).push(o)}}},di=function(e){if(t(this,T)){t(this,T).innerHTML="",i(this,gt,[]);for(const s of e){const o=document.createElement("button");o.type="button",o.className="shroom-select-option",o.role="option",o.dataset.option=s,o.textContent=$(s),o.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:s}),l(this,q,Ns).call(this),t(this,D)?.focus()}),o.addEventListener("keydown",n=>{const h=t(this,gt),c=h.indexOf(o);n.key==="ArrowDown"?(n.preventDefault(),h[Math.min(c+1,h.length-1)]?.focus()):n.key==="ArrowUp"?(n.preventDefault(),c===0?t(this,D)?.focus():h[c-1]?.focus()):n.key==="Escape"&&(l(this,q,Ns).call(this),t(this,D)?.focus())}),t(this,T).appendChild(o),t(this,gt).push(o)}}},Vo=function(){if(!t(this,T)||!t(this,D))return;const e=t(this,D).getBoundingClientRect(),s=window.innerHeight-e.bottom,o=e.top,n=Math.min(t(this,T).scrollHeight||240,240);t(this,T).style.left=`${Math.round(e.left)}px`,t(this,T).style.width=`${Math.round(e.width)}px`,s<n+8&&o>s?t(this,T).style.top=`${Math.max(8,Math.round(e.top-n-6))}px`:t(this,T).style.top=`${Math.round(e.bottom+6)}px`},Do=function(){if(!(!t(this,T)||!t(this,Vt).length)){try{typeof t(this,T).showPopover=="function"&&t(this,T).showPopover()}catch{}t(this,D)?.setAttribute("aria-expanded","true"),l(this,q,Vo).call(this),i(this,P,()=>l(this,q,Vo).call(this)),window.addEventListener("scroll",t(this,P),!0),window.addEventListener("resize",t(this,P)),i(this,bt,!0)}},Ns=function(){try{typeof t(this,T)?.hidePopover=="function"&&t(this,T).hidePopover()}catch{}t(this,D)?.setAttribute("aria-expanded","false"),t(this,P)&&(window.removeEventListener("scroll",t(this,P),!0),window.removeEventListener("resize",t(this,P)),i(this,P,null)),i(this,bt,!1)};const zi=`
    ${k}
    ${zs}
    ${At}
    ${H}

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
  `;class Zi extends f{constructor(e,s,o,n){super(e,s,o,n);r(this,N);r(this,Xs,null);r(this,De,null);r(this,J,null);r(this,Pe,null);r(this,Ne,null);r(this,Q,null);r(this,ze,null);r(this,yt,0);r(this,Ze,null);r(this,ae,null);r(this,he,null);r(this,le,null);r(this,xt,0);r(this,ct,!1);r(this,Re,"closed");r(this,Js,{});r(this,je);r(this,Fe);i(this,je,rt(l(this,N,pi).bind(this),300)),i(this,Fe,rt(l(this,N,mi).bind(this),300))}render(){M(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},o=s.show_position!==!1&&this.def.supported_features?.includes("set_position"),n=s.show_tilt!==!1&&this.def.supported_features?.includes("set_tilt_position"),h=!this.def.supported_features||this.def.supported_features.includes("buttons"),c=e&&(o||n||h);this.root.innerHTML=`
        <style>${zi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${c?`
            ${o||h?`
            <div class="shroom-cover-bar">
              ${o?`
                <div class="shroom-cover-slider-view">
                  <div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-cover-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <div class="shroom-slider-edge" style="left:0%"></div>
                    <input part="position-slider" type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${p(this.def.friendly_name)} position"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>
                </div>
              `:""}
              ${h?`
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
              ${o&&h?`
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
                      aria-label="${p(this.def.friendly_name)} tilt"
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
      `,i(this,Xs,this.root.querySelector(".shroom-icon-shape")),i(this,De,this.root.querySelector(".shroom-secondary")),i(this,J,this.root.querySelector("[part=position-slider]")),i(this,Pe,this.root.querySelector(".shroom-slider-cover")),i(this,Q,this.root.querySelector("[part=tilt-slider]")),i(this,ze,this.root.querySelector(".shroom-cover-tilt-cover")),i(this,Ne,this.root.querySelector(".shroom-cover-slider-view")),i(this,Ze,this.root.querySelector(".shroom-cover-btn-view")),i(this,ae,this.root.querySelector("[data-action=open]")),i(this,he,this.root.querySelector("[data-action=stop]")),i(this,le,this.root.querySelector("[data-action=close]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:window-shutter"),"card-icon"),t(this,J)&&(t(this,J).addEventListener("input",()=>{i(this,xt,parseInt(t(this,J).value,10)),l(this,N,Po).call(this),t(this,je).call(this)}),this.guardSlider(t(this,J),t(this,je))),t(this,Q)&&(t(this,Q).addEventListener("input",()=>{i(this,yt,parseInt(t(this,Q).value,10)),l(this,N,No).call(this),t(this,Fe).call(this)}),this.guardSlider(t(this,Q),t(this,Fe))),[t(this,ae),t(this,he),t(this,le)].forEach(u=>{if(!u)return;const x=u.getAttribute("data-action");u.addEventListener("click",()=>{this.config.card?.sendCommand(`${x}_cover`,{})})});const m=this.root.querySelector(".shroom-cover-toggle-btn");m?.addEventListener("click",()=>{i(this,ct,!t(this,ct)),m.setAttribute("aria-expanded",String(t(this,ct))),m.setAttribute("aria-label",t(this,ct)?"Show position slider":"Show cover buttons"),l(this,N,ci).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,Re,e),i(this,Js,{...s});const o=e==="open"||e==="opening";if(w(t(this,Xs),"cover",o),t(this,De)){const c=s.current_position,m=$(e);t(this,De).textContent=c!==void 0?`${m} - ${c}%`:m}const n=e==="opening"||e==="closing",h=s.current_position;t(this,ae)&&(t(this,ae).disabled=!n&&h===100),t(this,he)&&(t(this,he).disabled=!n),t(this,le)&&(t(this,le).disabled=!n&&e==="closed"),s.current_position!==void 0&&(i(this,xt,s.current_position),t(this,J)&&!this.isSliderActive(t(this,J))&&(t(this,J).value=String(t(this,xt))),l(this,N,Po).call(this)),s.current_tilt_position!==void 0&&(i(this,yt,s.current_tilt_position),t(this,Q)&&!this.isSliderActive(t(this,Q))&&(t(this,Q).value=String(t(this,yt))),l(this,N,No).call(this)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){const o={...t(this,Js)};return e==="open_cover"?(o.current_position=100,{state:"open",attributes:o}):e==="close_cover"?(o.current_position=0,{state:"closed",attributes:o}):e==="stop_cover"?{state:t(this,Re),attributes:o}:e==="set_cover_position"&&s.position!==void 0?(o.current_position=s.position,{state:s.position>0?"open":"closed",attributes:o}):e==="set_cover_tilt_position"&&s.tilt_position!==void 0?(o.current_tilt_position=s.tilt_position,{state:t(this,Re),attributes:o}):null}}Xs=new WeakMap,De=new WeakMap,J=new WeakMap,Pe=new WeakMap,Ne=new WeakMap,Q=new WeakMap,ze=new WeakMap,yt=new WeakMap,Ze=new WeakMap,ae=new WeakMap,he=new WeakMap,le=new WeakMap,xt=new WeakMap,ct=new WeakMap,Re=new WeakMap,Js=new WeakMap,je=new WeakMap,Fe=new WeakMap,N=new WeakSet,ci=function(){t(this,Ne)&&(t(this,Ne).hidden=t(this,ct)),t(this,Ze)&&(t(this,Ze).hidden=!t(this,ct));const e=this.root.querySelector(".shroom-cover-toggle-btn");e&&(e.innerHTML=t(this,ct)?'<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>')},Po=function(){t(this,Pe)&&(t(this,Pe).style.left=`${t(this,xt)}%`);const e=this.root.querySelector(".shroom-slider-edge");e&&(e.style.left=`${t(this,xt)}%`)},pi=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,xt)})},No=function(){t(this,ze)&&(t(this,ze).style.left=`${t(this,yt)}%`);const e=this.root.querySelector(".shroom-cover-tilt-edge");e&&(e.style.left=`${t(this,yt)}%`)},mi=function(){this.config.card?.sendCommand("set_cover_tilt_position",{tilt_position:t(this,yt)})};const Ri=`
    ${k}
    ${H}
  `;class ji extends f{constructor(){super(...arguments);r(this,We,null);r(this,Ye,null);r(this,Qs,!1)}render(){M(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Ri}</style>
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
      `,i(this,We,this.root.querySelector(".shroom-icon-shape")),i(this,Ye,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:remote"),"card-icon"),w(t(this,We),"remote",!1);const s=this.root.querySelector(".shroom-state-item");e&&(Lt(s,`${this.def.friendly_name} - Toggle power`),this._attachGestureHandlers(s,{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand(t(this,Qs)?"turn_off":"turn_on",{})}})),this.renderCompanions(),A(this.root)}applyState(e,s){const o=e==="on";i(this,Qs,o),w(t(this,We),"remote",o),t(this,Ye)&&(t(this,Ye).textContent=$(e));const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(n,"mdi:remote"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}We=new WeakMap,Ye=new WeakMap,Qs=new WeakMap;function yo(a){a<0&&(a=0);const d=Math.floor(a/3600),e=Math.floor(a%3600/60),s=Math.floor(a%60),o=n=>String(n).padStart(2,"0");return d>0?`${d}:${o(e)}:${o(s)}`:`${o(e)}:${o(s)}`}function Qo(a){if(typeof a=="number")return a;if(typeof a!="string")return 0;const d=a.split(":").map(Number);return d.length===3?d[0]*3600+d[1]*60+d[2]:d.length===2?d[0]*60+d[1]:d[0]||0}const Fi=`
    ${k}
    ${At}
    ${H}

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
  `;class Wi extends f{constructor(){super(...arguments);r(this,j);r(this,Ge,null);r(this,Pt,null);r(this,Nt,null);r(this,de,null);r(this,ce,null);r(this,pe,null);r(this,Ue,"idle");r(this,Ke,{});r(this,tt,null);r(this,Xe,null)}render(){M(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Fi}</style>
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
      `,i(this,Ge,this.root.querySelector(".shroom-icon-shape")),i(this,Pt,this.root.querySelector(".shroom-secondary")),i(this,Nt,this.root.querySelector("[data-action=playpause]")),i(this,de,this.root.querySelector("[data-action=cancel]")),i(this,ce,this.root.querySelector("[data-action=finish]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:timer-outline"),"card-icon"),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),w(t(this,Ge),"timer",!1),e&&(t(this,Nt)?.addEventListener("click",()=>{const s=t(this,Ue)==="active"?"pause":"start";this.config.card?.sendCommand(s,{})}),t(this,de)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,ce)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,Ue,e),i(this,Ke,{...s}),i(this,tt,s.finishes_at??null),i(this,Xe,s.remaining!=null?Qo(s.remaining):null);const o=e==="active";w(t(this,Ge),"timer",o||e==="paused"),l(this,j,ui).call(this,e),l(this,j,fi).call(this,e),o&&t(this,tt)?l(this,j,vi).call(this):l(this,j,vo).call(this)}predictState(e,s){const o={...t(this,Ke)};return e==="start"?{state:"active",attributes:o}:e==="pause"?(t(this,tt)&&(o.remaining=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3)),{state:"paused",attributes:o}):e==="cancel"||e==="finish"?{state:"idle",attributes:o}:null}}Ge=new WeakMap,Pt=new WeakMap,Nt=new WeakMap,de=new WeakMap,ce=new WeakMap,pe=new WeakMap,Ue=new WeakMap,Ke=new WeakMap,tt=new WeakMap,Xe=new WeakMap,j=new WeakSet,ui=function(e){const s=e==="idle",o=e==="active";if(t(this,Nt)){const n=o?"mdi:pause":"mdi:play",h=o?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(n,"playpause-icon"),t(this,Nt).title=h,t(this,Nt).setAttribute("aria-label",`${this.def.friendly_name} - ${h}`)}t(this,de)&&(t(this,de).disabled=s),t(this,ce)&&(t(this,ce).disabled=s),this.announceState(`${this.def.friendly_name}, ${e}`)},fi=function(e){if(!t(this,Pt))return;const s=$(e);let o=null;if(e==="idle"){const n=t(this,Ke).duration;o=n?yo(Qo(n)):"00:00"}else if(e==="paused"&&t(this,Xe)!=null)o=yo(t(this,Xe));else if(e==="active"&&t(this,tt)){const n=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3);o=yo(n)}t(this,Pt).textContent=o?`${s} - ${o}`:s},vi=function(){l(this,j,vo).call(this),i(this,pe,setInterval(()=>{if(!t(this,tt)||t(this,Ue)!=="active"){l(this,j,vo).call(this);return}const e=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3);t(this,Pt)&&(t(this,Pt).textContent=`Active - ${yo(e)}`),e<=0&&l(this,j,vo).call(this)},1e3))},vo=function(){t(this,pe)&&(clearInterval(t(this,pe)),i(this,pe,null))};const Yi=`
    ${k}
    ${At}
    ${H}

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
  `;class Gi extends f{constructor(e,s,o,n){super(e,s,o,n);r(this,C);r(this,to,null);r(this,Je,null);r(this,Qe,null);r(this,ts,null);r(this,es,null);r(this,ss,null);r(this,os,null);r(this,is,null);r(this,rs,null);r(this,ns,null);r(this,as,null);r(this,O,null);r(this,hs,null);r(this,ls,null);r(this,_t,null);r(this,me,null);r(this,pt,null);r(this,z,null);r(this,wt,!1);r(this,Ct,20);r(this,ds,null);r(this,et,"off");r(this,cs,null);r(this,ps,null);r(this,ms,null);r(this,eo,16);r(this,so,32);r(this,oo,.5);r(this,us,"°C");r(this,zt,[]);r(this,ue,[]);r(this,fe,[]);r(this,ve,[]);r(this,io,{});r(this,ro);i(this,ro,rt(l(this,C,bi).bind(this),500))}render(){M(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},o=this.def.supported_features?.includes("target_temperature"),n=s.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),h=s.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),c=s.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);i(this,eo,this.def.feature_config?.min_temp??16),i(this,so,this.def.feature_config?.max_temp??32),i(this,oo,this.def.feature_config?.temp_step??.5),i(this,us,this.def.unit_of_measurement??"°C"),i(this,zt,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),i(this,ue,this.def.feature_config?.fan_modes??[]),i(this,fe,this.def.feature_config?.preset_modes??[]),i(this,ve,this.def.feature_config?.swing_modes??[]);const m=e&&(t(this,zt).length||t(this,fe).length||t(this,ue).length||t(this,ve).length),[u,x]=t(this,Ct).toFixed(1).split(".");this.root.innerHTML=`
        <style>${Yi}</style>
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
                    <span class="shroom-climate-temp-int">${p(u)}</span><span class="shroom-climate-temp-frac">.${p(x)}</span>
                    <span class="shroom-climate-temp-unit">${p(t(this,us))}</span>
                  </span>
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  `:""}
                </div>
              `:""}
              ${m?`
                <div class="shroom-climate-feat-view" hidden>
                  ${s.show_hvac_modes!==!1&&t(this,zt).length?`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${h&&t(this,fe).length?`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${n&&t(this,ue).length?`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${c&&t(this,ve).length?`
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
      `,i(this,to,this.root.querySelector(".shroom-icon-shape")),i(this,Je,this.root.querySelector(".shroom-secondary")),i(this,Qe,this.root.querySelector(".shroom-climate-bar")),i(this,ts,this.root.querySelector(".shroom-climate-temp-int")),i(this,es,this.root.querySelector(".shroom-climate-temp-frac")),i(this,ss,this.root.querySelector("[data-dir='-']")),i(this,os,this.root.querySelector("[data-dir='+']")),i(this,is,this.root.querySelector("[data-feat=mode]")),i(this,rs,this.root.querySelector("[data-feat=fan]")),i(this,ns,this.root.querySelector("[data-feat=preset]")),i(this,as,this.root.querySelector("[data-feat=swing]")),i(this,O,this.root.querySelector(".shroom-climate-dropdown")),i(this,hs,this.root.querySelector(".shroom-climate-temp-view")),i(this,ls,this.root.querySelector(".shroom-climate-feat-view")),i(this,_t,this.root.querySelector(".shroom-climate-toggle-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:thermostat"),"card-icon");const g=this.root.querySelector(".shroom-state-item");e&&(Lt(g,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(g,{onTap:()=>{const v=this.config.gestureConfig?.tap;if(v){this._runAction(v);return}const V=t(this,et)==="off"?t(this,zt).find(F=>F!=="off")??"heat":"off";this.config.card?.sendCommand("set_hvac_mode",{hvac_mode:V})}})),t(this,ss)&&t(this,ss).addEventListener("click",v=>{v.stopPropagation(),l(this,C,zo).call(this,-1)}),t(this,os)&&t(this,os).addEventListener("click",v=>{v.stopPropagation(),l(this,C,zo).call(this,1)}),t(this,_t)&&t(this,_t).addEventListener("click",v=>{v.stopPropagation(),i(this,wt,!t(this,wt)),t(this,_t).setAttribute("aria-expanded",String(t(this,wt))),l(this,C,gi).call(this)}),e&&[t(this,is),t(this,rs),t(this,ns),t(this,as)].forEach(v=>{if(!v)return;const V=v.getAttribute("data-feat");v.addEventListener("click",F=>{F.stopPropagation(),l(this,C,yi).call(this,V)})}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,io,{...s}),i(this,et,e),i(this,cs,s.fan_mode??null),i(this,ps,s.preset_mode??null),i(this,ms,s.swing_mode??null),i(this,ds,s.current_temperature??null);const o=e==="off";if(t(this,Qe)&&(t(this,Qe).hidden=o),w(t(this,to),"climate",!o),s.temperature!==void 0&&(i(this,Ct,s.temperature),l(this,C,Zo).call(this)),t(this,Je)){const h=s.hvac_action??e,c=t(this,ds)!=null?` - ${t(this,ds)} ${t(this,us)}`:"";t(this,Je).textContent=$(h)+c}l(this,C,xi).call(this);const n=s.hvac_action??e;this.announceState(`${this.def.friendly_name}, ${$(n)}`)}predictState(e,s){const o={...t(this,io)};return e==="set_hvac_mode"&&s.hvac_mode?{state:s.hvac_mode,attributes:o}:e==="set_temperature"&&s.temperature!==void 0?{state:t(this,et),attributes:{...o,temperature:s.temperature}}:e==="set_fan_mode"&&s.fan_mode?{state:t(this,et),attributes:{...o,fan_mode:s.fan_mode}}:e==="set_preset_mode"&&s.preset_mode?{state:t(this,et),attributes:{...o,preset_mode:s.preset_mode}}:e==="set_swing_mode"&&s.swing_mode?{state:t(this,et),attributes:{...o,swing_mode:s.swing_mode}}:null}destroy(){t(this,pt)&&(document.removeEventListener("pointerdown",t(this,pt),!0),i(this,pt,null)),t(this,z)&&(window.removeEventListener("scroll",t(this,z),!0),window.removeEventListener("resize",t(this,z)),i(this,z,null));try{t(this,O)?.hidePopover?.()}catch{}}}to=new WeakMap,Je=new WeakMap,Qe=new WeakMap,ts=new WeakMap,es=new WeakMap,ss=new WeakMap,os=new WeakMap,is=new WeakMap,rs=new WeakMap,ns=new WeakMap,as=new WeakMap,O=new WeakMap,hs=new WeakMap,ls=new WeakMap,_t=new WeakMap,me=new WeakMap,pt=new WeakMap,z=new WeakMap,wt=new WeakMap,Ct=new WeakMap,ds=new WeakMap,et=new WeakMap,cs=new WeakMap,ps=new WeakMap,ms=new WeakMap,eo=new WeakMap,so=new WeakMap,oo=new WeakMap,us=new WeakMap,zt=new WeakMap,ue=new WeakMap,fe=new WeakMap,ve=new WeakMap,io=new WeakMap,ro=new WeakMap,C=new WeakSet,gi=function(){t(this,hs)&&(t(this,hs).hidden=t(this,wt)),t(this,ls)&&(t(this,ls).hidden=!t(this,wt)),t(this,_t)&&(t(this,_t).innerHTML=t(this,wt)?'<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>')},zo=function(e){const s=Math.round((t(this,Ct)+e*t(this,oo))*100)/100;i(this,Ct,Math.max(t(this,eo),Math.min(t(this,so),s))),l(this,C,Zo).call(this),t(this,ro).call(this)},Zo=function(){const[e,s]=t(this,Ct).toFixed(1).split(".");t(this,ts)&&(t(this,ts).textContent=e),t(this,es)&&(t(this,es).textContent=`.${s}`)},bi=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,Ct)})},yi=function(e){if(t(this,me)===e){l(this,C,go).call(this);return}t(this,me)&&l(this,C,go).call(this),i(this,me,e);let s=[],o=null,n="",h="";switch(e){case"mode":s=t(this,zt),o=t(this,et),n="set_hvac_mode",h="hvac_mode";break;case"fan":s=t(this,ue),o=t(this,cs),n="set_fan_mode",h="fan_mode";break;case"preset":s=t(this,fe),o=t(this,ps),n="set_preset_mode",h="preset_mode";break;case"swing":s=t(this,ve),o=t(this,ms),n="set_swing_mode",h="swing_mode";break}if(!s.length||!t(this,O))return;t(this,O).innerHTML=s.map(u=>`
        <button class="shroom-climate-dd-option" data-active="${u===o}" role="option"
          aria-selected="${u===o}" type="button">
          ${p($(u))}
        </button>
      `).join(""),t(this,O).querySelectorAll(".shroom-climate-dd-option").forEach((u,x)=>{u.addEventListener("click",g=>{g.stopPropagation(),this.config.card?.sendCommand(n,{[h]:s[x]}),l(this,C,go).call(this)})});const c=this.root.querySelector(`[data-feat="${e}"]`);c&&c.setAttribute("aria-expanded","true");try{t(this,O).showPopover?.()}catch{}l(this,C,Ro).call(this,c),i(this,z,()=>l(this,C,Ro).call(this,c)),window.addEventListener("scroll",t(this,z),!0),window.addEventListener("resize",t(this,z));const m=u=>{u.composedPath().some(g=>g===this.root||g===this.root.host)||l(this,C,go).call(this)};i(this,pt,m),document.addEventListener("pointerdown",m,!0)},Ro=function(e){if(!t(this,O)||!e)return;const s=e.getBoundingClientRect(),o=window.innerHeight-s.bottom,n=s.top,h=Math.min(t(this,O).scrollHeight||240,240),c=Math.max(140,Math.round(s.width));t(this,O).style.left=`${Math.round(s.left)}px`,t(this,O).style.minWidth=`${c}px`,o<h+8&&n>o?t(this,O).style.top=`${Math.max(8,Math.round(s.top-h-6))}px`:t(this,O).style.top=`${Math.round(s.bottom+6)}px`},go=function(){i(this,me,null);try{t(this,O)?.hidePopover?.()}catch{}this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(e=>{e.setAttribute("aria-expanded","false")}),t(this,pt)&&(document.removeEventListener("pointerdown",t(this,pt),!0),i(this,pt,null)),t(this,z)&&(window.removeEventListener("scroll",t(this,z),!0),window.removeEventListener("resize",t(this,z)),i(this,z,null))},xi=function(){const e=(s,o)=>{if(!s)return;const n=s.querySelector(".shroom-climate-feat-value");n&&(n.textContent=$(o??"None"))};e(t(this,is),t(this,et)),e(t(this,rs),t(this,cs)),e(t(this,ns),t(this,ps)),e(t(this,as),t(this,ms))};const Ui=`
    ${k}
    ${zs}
    ${At}
    ${H}

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
  `;class Ki extends f{constructor(e,s,o,n){super(e,s,o,n);r(this,ye);r(this,no,null);r(this,fs,null);r(this,ge,null);r(this,vs,null);r(this,gs,null);r(this,bs,null);r(this,Zt,null);r(this,ao,null);r(this,ho,null);r(this,lo,null);r(this,ys,null);r(this,st,null);r(this,Rt,null);r(this,co,!1);r(this,be,!1);r(this,ot,0);r(this,jt,"idle");r(this,$t,{});r(this,xs);i(this,xs,rt(l(this,ye,_i).bind(this),200))}render(){M(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],o=this.config.displayHints??{},n=s.includes("play_pause"),h=s.includes("previous_track"),c=s.includes("next_track"),m=s.includes("turn_on")||s.includes("turn_off"),u=o.show_volume!==!1&&s.includes("volume_set"),x=o.show_volume!==!1&&s.includes("volume_step"),g=u||x;this.root.innerHTML=`
        <style>${Ui}</style>
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
                ${m?`<button class="shroom-mp-btn" data-role="power" type="button" title="Power" aria-label="Power">
                  <span part="power-icon" aria-hidden="true"></span>
                </button>`:""}
                ${h?`
                  <button class="shroom-mp-btn" data-role="prev" type="button" title="Previous" aria-label="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                ${n?`<button class="shroom-mp-btn" data-role="play" type="button" title="Play" aria-label="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>`:""}
                ${c?`
                  <button class="shroom-mp-btn" data-role="next" type="button" title="Next" aria-label="Next track">
                    <span part="next-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                ${g?`<button class="shroom-mp-btn" data-role="volume" type="button" title="Volume" aria-label="Volume controls">
                  <span part="vol-icon" aria-hidden="true"></span>
                </button>`:""}
              </div>
              <div class="shroom-mp-volume-view" hidden>
                  ${x?`<button class="shroom-mp-btn" data-role="vol-down" type="button" title="Volume down" aria-label="Volume down">
                    <svg viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z"/></svg>
                  </button>`:""}
                  ${u?`<div class="shroom-slider-wrap">
                    <div class="shroom-slider-bg shroom-mp-slider-bg"></div>
                    <div class="shroom-slider-cover" style="left:0%"></div>
                    <input type="range" class="shroom-slider-input" min="0" max="100"
                      step="1" value="0"
                      aria-label="${p(this.def.friendly_name)} volume"
                      aria-valuetext="0%">
                    <div class="shroom-slider-focus-ring"></div>
                  </div>`:""}
                  ${x?`<button class="shroom-mp-btn" data-role="vol-up" type="button" title="Volume up" aria-label="Volume up">
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
      `,i(this,no,this.root.querySelector(".shroom-icon-shape")),i(this,fs,this.root.querySelector(".shroom-primary")),i(this,ge,this.root.querySelector(".shroom-secondary")),i(this,bs,this.root.querySelector(".shroom-mp-bar")),i(this,vs,this.root.querySelector(".shroom-mp-transport-view")),i(this,gs,this.root.querySelector(".shroom-mp-volume-view")),i(this,Zt,this.root.querySelector("[data-role=play]")),i(this,ao,this.root.querySelector("[data-role=prev]")),i(this,ho,this.root.querySelector("[data-role=next]")),i(this,lo,this.root.querySelector("[data-role=power]")),i(this,ys,this.root.querySelector("[data-role=volume]")),i(this,st,this.root.querySelector(".shroom-slider-input")),i(this,Rt,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:speaker"),"card-icon"),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:power","power-icon"),this.renderIcon("mdi:volume-high","vol-icon"),e&&(t(this,Zt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,ao)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,ho)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),t(this,lo)?.addEventListener("click",()=>{const Ps=["off","unavailable","unknown"].includes(t(this,jt))?"turn_on":"turn_off";s.includes(Ps)&&this.config.card?.sendCommand(Ps,{})}),t(this,ys)?.addEventListener("click",()=>{i(this,be,!0),l(this,ye,jo).call(this)}),this.root.querySelector(".shroom-mp-back-btn")?.addEventListener("click",()=>{i(this,be,!1),l(this,ye,jo).call(this)}),this.root.querySelector("[data-role=vol-down]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_down",{})}),this.root.querySelector("[data-role=vol-up]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_up",{})})),t(this,st)&&(t(this,st).addEventListener("input",()=>{i(this,ot,parseInt(t(this,st).value,10)),t(this,Rt)&&(t(this,Rt).style.left=`${t(this,ot)}%`),t(this,xs).call(this)}),this.guardSlider(t(this,st),t(this,xs))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,jt,e),i(this,$t,s);const o=e==="playing",n=o||e==="paused";w(t(this,no),"media_player",n),t(this,bs)&&(t(this,bs).hidden=!n&&!this.def.supported_features?.includes("turn_on"));const h=s.media_title??"",c=s.media_artist??"";if(t(this,fs)&&(t(this,fs).textContent=n&&h?h:this.def.friendly_name),t(this,ge))if(n){const m=t(this,ot)>0?`${t(this,ot)}%`:"",u=[c,m].filter(Boolean);t(this,ge).textContent=u.join(" - ")||$(e)}else t(this,ge).textContent=$(e);if(t(this,Zt)){const m=o?"mdi:pause":"mdi:play";this.renderIcon(m,"play-icon");const u=o?"Pause":"Play";t(this,Zt).title=u,t(this,Zt).setAttribute("aria-label",u)}if(s.volume_level!==void 0&&(i(this,ot,Math.round(s.volume_level*100)),t(this,st)&&!this.isSliderActive(t(this,st))&&(t(this,st).value=String(t(this,ot))),t(this,Rt)&&(t(this,Rt).style.left=`${t(this,ot)}%`)),i(this,co,!!s.is_volume_muted),t(this,ys)){const m=t(this,co)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(m,"vol-icon")}this.announceState(`${this.def.friendly_name}, ${e}${h?` - ${h}`:""}`)}predictState(e,s){return e==="media_play_pause"?{state:t(this,jt)==="playing"?"paused":"playing",attributes:t(this,$t)}:e==="volume_mute"?{state:t(this,jt),attributes:{...t(this,$t),is_volume_muted:!!s.is_volume_muted}}:e==="volume_set"?{state:t(this,jt),attributes:{...t(this,$t),volume_level:s.volume_level}}:e==="turn_off"?{state:"off",attributes:t(this,$t)}:e==="turn_on"?{state:"idle",attributes:t(this,$t)}:null}}no=new WeakMap,fs=new WeakMap,ge=new WeakMap,vs=new WeakMap,gs=new WeakMap,bs=new WeakMap,Zt=new WeakMap,ao=new WeakMap,ho=new WeakMap,lo=new WeakMap,ys=new WeakMap,st=new WeakMap,Rt=new WeakMap,co=new WeakMap,be=new WeakMap,ot=new WeakMap,jt=new WeakMap,$t=new WeakMap,xs=new WeakMap,ye=new WeakSet,jo=function(){t(this,vs)&&(t(this,vs).hidden=t(this,be)),t(this,gs)&&(t(this,gs).hidden=!t(this,be))},_i=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,ot)/100})};const ti={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},Xi=ti.cloudy,Ji="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z",Qi="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",tr="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",er=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Lo(a,d){const e=ti[a]??Xi;return`<svg viewBox="0 0 24 24" width="${d}" height="${d}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Ao(a){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${a}" fill="currentColor"/></svg>`}const sr=`
    ${k}
    ${H}

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
  `;class or extends f{constructor(){super(...arguments);r(this,I);r(this,po,null);r(this,_s,null);r(this,ws,null);r(this,xe,null);r(this,Cs,null);r(this,$s,null);r(this,Ss,null);r(this,St,null);r(this,mt,null);r(this,Ls,null);r(this,_e,null);r(this,we,null)}render(){M(this),this.root.innerHTML=`
        <style>${sr}</style>
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
              <span class="shroom-weather-icon">${Lo("cloudy",36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${Ao(Ji)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${Ao(Qi)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${Ao(tr)}
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
      `,i(this,po,this.root.querySelector(".shroom-icon-shape")),i(this,_s,this.root.querySelector(".shroom-secondary")),i(this,ws,this.root.querySelector(".shroom-weather-icon")),i(this,xe,this.root.querySelector(".shroom-weather-temp")),i(this,Cs,this.root.querySelector("[data-stat=humidity] [data-value]")),i(this,$s,this.root.querySelector("[data-stat=wind] [data-value]")),i(this,Ss,this.root.querySelector("[data-stat=pressure] [data-value]")),i(this,St,this.root.querySelector(".shroom-forecast-strip")),i(this,mt,this.root.querySelector(".shroom-forecast-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:weather-cloudy"),"card-icon"),w(t(this,po),"weather",!0),i(this,Ls,Ci(t(this,St))),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),A(this.root)}destroy(){var e;(e=t(this,Ls))==null||e.call(this),i(this,Ls,null)}applyState(e,s){const o=e||"cloudy";t(this,ws)&&(t(this,ws).innerHTML=Lo(o,36));const n=this.i18n.t(`weather.${o}`)!==`weather.${o}`?this.i18n.t(`weather.${o}`):o.replace(/-/g," ");t(this,_s)&&(t(this,_s).textContent=$(n));const h=s.temperature??s.native_temperature;let c=String(s.temperature_unit||s.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(c&&!/^°/.test(c)&&c.length<=2&&(c=`°${c}`),t(this,xe)){const u=t(this,xe).querySelector(".shroom-weather-unit");t(this,xe).firstChild.textContent=h!=null?Math.round(Number(h)):"--",u&&(u.textContent=c)}if(t(this,Cs)){const u=s.humidity;t(this,Cs).textContent=u!=null?`${u}%`:"--"}if(t(this,$s)){const u=s.wind_speed,x=s.wind_speed_unit??"";t(this,$s).textContent=u!=null?`${u} ${x}`.trim():"--"}if(t(this,Ss)){const u=s.pressure,x=s.pressure_unit??"";t(this,Ss).textContent=u!=null?`${u} ${x}`.trim():"--"}const m=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;i(this,_e,m?s.forecast_daily??s.forecast??null:null),i(this,we,m?s.forecast_hourly??null:null),l(this,I,Fo).call(this),l(this,I,Wo).call(this),this.announceState(`${this.def.friendly_name}, ${n}, ${h??"--"} ${c}`)}}po=new WeakMap,_s=new WeakMap,ws=new WeakMap,xe=new WeakMap,Cs=new WeakMap,$s=new WeakMap,Ss=new WeakMap,St=new WeakMap,mt=new WeakMap,Ls=new WeakMap,I=new WeakSet,Ce=function(){return this.config._forecastMode??"daily"},$o=function(e){this.config._forecastMode=e},_e=new WeakMap,we=new WeakMap,Fo=function(){if(!t(this,mt))return;const e=Array.isArray(t(this,_e))&&t(this,_e).length>0,s=Array.isArray(t(this,we))&&t(this,we).length>0;if(!e&&!s){t(this,mt).textContent="";return}e&&!s&&i(this,I,"daily",$o),!e&&s&&i(this,I,"hourly",$o),e&&s?(t(this,mt).textContent=t(this,I,Ce)==="daily"?"Hourly":"5-Day",t(this,mt).onclick=()=>{i(this,I,t(this,I,Ce)==="daily"?"hourly":"daily",$o),l(this,I,Fo).call(this),l(this,I,Wo).call(this)}):(t(this,mt).textContent="",t(this,mt).onclick=null)},Wo=function(){if(!t(this,St))return;const e=t(this,I,Ce)==="hourly"?t(this,we):t(this,_e);if(t(this,St).setAttribute("data-mode",t(this,I,Ce)),!Array.isArray(e)||e.length===0){t(this,St).innerHTML="";return}const s=t(this,I,Ce)==="daily"?e.slice(0,5):e;t(this,St).innerHTML=s.map(o=>{const n=new Date(o.datetime);let h;t(this,I,Ce)==="hourly"?h=n.toLocaleTimeString([],{hour:"numeric"}):h=er[n.getDay()]??"";const c=(o.temperature??o.native_temperature)!=null?Math.round(o.temperature??o.native_temperature):"--",m=(o.templow??o.native_templow)!=null?Math.round(o.templow??o.native_templow):null;return`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${p(String(h))}</span>
            ${Lo(o.condition||"cloudy",18)}
            <span class="shroom-forecast-temps">
              ${p(String(c))}${m!=null?`/<span class="shroom-forecast-lo">${p(String(m))}</span>`:""}
            </span>
          </div>`}).join("")};const ir=`
    ${k}
    ${H}
  `;class rr extends f{constructor(){super(...arguments);r(this,mo,null);r(this,As,null);r(this,Ft,!1);r(this,_o,"unknown")}render(){M(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${ir}</style>
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
      `,i(this,mo,this.root.querySelector(".shroom-icon-shape")),i(this,As,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"card-icon");const s=this.root.querySelector(".shroom-state-item");e&&(Lt(s,`${this.def.friendly_name} - Lock/Unlock`),this._attachGestureHandlers(s,{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand(t(this,Ft)?"unlock":"lock",{})}})),this.renderCompanions(),A(this.root)}applyState(e,s){i(this,_o,e),i(this,Ft,e==="locked");const o=e==="jammed";w(t(this,mo),"lock",t(this,Ft)),t(this,As)&&(t(this,As).textContent=$(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,Ft)));const h=o?"mdi:lock-alert":t(this,Ft)?"mdi:lock":"mdi:lock-open",c=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(c,h),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}mo=new WeakMap,As=new WeakMap,Ft=new WeakMap,_o=new WeakMap;const nr=`
    ${k}
    ${H}
  `;class ei extends f{constructor(){super(...arguments);r(this,Ms,null);r(this,ks,null)}render(){M(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.run")!=="action.run"?this.i18n.t("action.run"):"Run";this.root.innerHTML=`
        <style>${nr}</style>
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
      `,i(this,Ms,this.root.querySelector(".shroom-icon-shape")),i(this,ks,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),w(t(this,Ms),"script",!1);const o=this.root.querySelector(".shroom-state-item");e&&(Lt(o,`${this.def.friendly_name} - ${s}`),this._attachGestureHandlers(o,{onTap:()=>{const n=this.config.gestureConfig?.tap;if(n){this._runAction(n);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})}})),this.renderCompanions(),A(this.root)}applyState(e,s){const o=e==="on";w(t(this,Ms),"script",o),t(this,ks)&&(t(this,ks).textContent=o?this.i18n.t("state.running")!=="state.running"?this.i18n.t("state.running"):"Running":$(e));const n=o?"mdi:script-text":"mdi:script-text-play",h=this.def.icon_state_map?.[e]??this.def.icon??n;this.renderIcon(this.resolveIcon(h,n),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ms=new WeakMap,ks=new WeakMap,fo(ei,"staleOnMount",!1);const ar=`
    ${k}
    ${H}
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
  `;class si extends f{constructor(){super(...arguments);r(this,Hs,null);r(this,Es,null);r(this,it,null)}render(){M(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.trigger")!=="action.trigger"?this.i18n.t("action.trigger"):"Trigger";this.root.innerHTML=`
        <style>${ar}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?'<button part="enable-toggle" type="button"></button>':""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Hs,this.root.querySelector(".shroom-icon-shape")),i(this,Es,this.root.querySelector(".shroom-secondary")),i(this,it,this.root.querySelector("[part=enable-toggle]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),w(t(this,Hs),"automation",!1);const o=this.root.querySelector(".shroom-state-item");e&&(Lt(o,`${this.def.friendly_name} - ${s}`),this._attachGestureHandlers(o,{onTap:()=>{const n=this.config.gestureConfig?.tap;if(n){this._runAction(n);return}this.config.card?.sendCommand("trigger",{})}}),this._attachGestureHandlers(t(this,it),{onTap:()=>{const n=t(this,it)?.getAttribute("aria-pressed")==="true";this.config.card?.sendCommand(n?"turn_off":"turn_on",{})}})),this.renderCompanions(),A(this.root)}applyState(e,s){const o=e==="on";w(t(this,Hs),"automation",o),t(this,Es)&&(t(this,Es).textContent=o?this.i18n.t("state.on")!=="state.on"?this.i18n.t("state.on"):"Enabled":$(e)),t(this,it)&&(t(this,it).disabled=e==="unavailable"||e==="unknown",t(this,it).textContent=o?"Enabled":"Disabled",t(this,it).setAttribute("aria-pressed",String(o)),t(this,it).setAttribute("aria-label",`${this.def.friendly_name} - ${o?"Disable":"Enable"}`));const n=o?"mdi:robot":"mdi:robot-off",h=this.def.icon_state_map?.[e]??this.def.icon??n;this.renderIcon(this.resolveIcon(h,n),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}predictState(e,s){return e==="turn_on"?{state:"on",attributes:{}}:e==="turn_off"?{state:"off",attributes:{}}:null}}Hs=new WeakMap,Es=new WeakMap,it=new WeakMap,fo(si,"staleOnMount",!1);const hr=`
    ${k}
    ${H}

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
  `;class Mo extends f{constructor(){super(...arguments);r(this,Ts,null);r(this,Is,null);r(this,Wt,null)}render(){M(this);const e=this.def.capabilities==="read-write",s=this.i18n.t("action.press")!=="action.press"?this.i18n.t("action.press"):"Press";this.root.innerHTML=`
        <style>${hr}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${p(this.def.friendly_name)}</span>
              ${e?`<button class="shroom-press-btn" part="press-button" type="button" aria-label="${p(this.def.friendly_name)}">${p(s)}</button>`:'<span class="shroom-secondary">-</span>'}
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,Ts,this.root.querySelector(".shroom-icon-shape")),i(this,Is,this.root.querySelector(".shroom-secondary")),i(this,Wt,this.root.querySelector(".shroom-press-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),w(t(this,Ts),"button",!1),t(this,Wt)&&this._attachGestureHandlers(t(this,Wt),{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand("press",{})}}),this.renderCompanions(),A(this.root)}applyState(e,s){w(t(this,Ts),"button",!1);const o=e==="unavailable"||e==="unknown";t(this,Wt)&&(t(this,Wt).disabled=o),t(this,Is)&&(t(this,Is).textContent=o?$(e):this.formatStateLabel(e));const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(n,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ts=new WeakMap,Is=new WeakMap,Wt=new WeakMap,fo(Mo,"staleOnMount",!1);const lr=`
    ${k}
    ${H}
  `;class ko extends f{constructor(){super(...arguments);r(this,qs,null);r(this,Bs,null)}render(){M(this),this.root.innerHTML=`
        <style>${lr}</style>
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
      `,i(this,qs,this.root.querySelector(".shroom-icon-shape")),i(this,Bs,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"card-icon"),w(t(this,qs),"person",!1),this.renderCompanions(),A(this.root)}applyState(e,s){const o=e==="home";if(w(t(this,qs),"person",o),t(this,Bs)){const c=e==="not_home"?"Away":e==="home"?"Home":$(e);t(this,Bs).textContent=c}const n=e==="not_home"?"mdi:account-off":"mdi:account",h=this.def.icon_state_map?.[e]??this.def.icon??n;this.renderIcon(this.resolveIcon(h,n),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}qs=new WeakMap,Bs=new WeakMap,fo(ko,"staleOnMount",!0);const dr=`
    ${k}
    ${H}
  `;class cr extends f{constructor(){super(...arguments);r(this,Os,null);r(this,Vs,null)}render(){M(this),this.root.innerHTML=`
        <style>${dr}</style>
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
      `,i(this,Os,this.root.querySelector(".shroom-icon-shape")),i(this,Vs,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:eye"),"card-icon"),w(t(this,Os),"event",!1),this.renderCompanions(),A(this.root)}applyState(e,s){w(t(this,Os),"event",!1),t(this,Vs)&&(t(this,Vs).textContent=$(e));const o=this.def.icon_state_map?.[e]??this.def.icon??"mdi:eye";this.renderIcon(this.resolveIcon(o,"mdi:eye"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Os=new WeakMap,Vs=new WeakMap;const pr=document.currentScript&&document.currentScript.dataset.rendererId||"shrooms";y._renderers=y._renderers||{},y._renderers[pr]={light:Ai,switch:Ko,input_boolean:Ko,lock:rr,sensor:bo,"sensor.temperature":bo,"sensor.humidity":bo,"sensor.battery":bo,fan:qi,binary_sensor:Oi,generic:Di,input_number:Xo,input_select:Jo,select:Jo,cover:Zi,remote:ji,timer:Wi,climate:Gi,media_player:Ki,weather:or,script:ei,automation:si,button:Mo,input_button:Mo,person:ko,device_tracker:ko,event:cr,number:Xo,badge:null}})();})();
