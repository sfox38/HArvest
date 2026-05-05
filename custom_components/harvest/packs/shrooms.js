(()=>{var xo=L=>{throw TypeError(L)};var Js=(L,y,v)=>y.has(L)||xo("Cannot "+v);var t=(L,y,v)=>(Js(L,y,"read from private field"),v?v.call(L):y.get(L)),r=(L,y,v)=>y.has(L)?xo("Cannot add the same private member more than once"):y instanceof WeakSet?y.add(L):y.set(L,v),o=(L,y,v,u)=>(Js(L,y,"write to private field"),u?u.call(L,v):y.set(L,v),v),d=(L,y,v)=>(Js(L,y,"access private method"),v);(function(){"use strict";var ms,le,xt,_t,It,I,us,Ct,Bt,Vt,R,Ot,Dt,V,O,wt,de,Nt,fs,X,Qs,to,_o,J,zt,ce,at,Zt,F,pe,St,$t,Lt,D,x,Pt,At,Mt,G,vs,b,Fs,Co,eo,so,oo,Gs,wo,gs,me,bs,ue,P,Q,jt,fe,ve,ys,ge,Y,be,tt,ht,ye,xs,_s,lt,So,io,$o,Cs,xe,B,M,_e,dt,et,st,Lo,ds,ws,Ce,ot,we,Se,$e,Rt,Ft,Gt,ct,it,Ss,$s,Ls,pt,Ao,ro,Mo,Le,Ae,Me,ke,j,kt,Yt,Wt,Ut,He,Te,W,Ee,N,ko,Ho,To,Zs,As,qe,Ie,Be,Ve,Oe,De,Ne,ze,Ze,Pe,mt,je,Re,ut,Fe,Kt,ft,vt,Ge,U,Ye,We,Ue,Ms,ks,Hs,Ke,Ht,Xt,Jt,Qt,Ts,Es,C,Eo,no,ao,qo,Io,Ys,Bo,qs,Xe,te,Je,Qe,ts,Tt,Is,Bs,Vs,es,rt,Et,Os,ee,K,gt,bt,Ds,se,ho,Vo,Ns,ss,os,oe,is,rs,ns,qt,nt,$,ne,Ws,ie,re,lo,co,as,hs,ls;console.info("[HArvest Shrooms] Loading pack v"+"1.0.0");const y=window.HArvest;if(!y||!y.renderers||!y.renderers.BaseCard){console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");return}const v=y.renderers.BaseCard;function u(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ae(a,l){let e=null;return function(...s){e&&clearTimeout(e),e=setTimeout(()=>{e=null,a.apply(this,s)},l)}}function S(a){return a?a.charAt(0).toUpperCase()+a.slice(1).replace(/_/g," "):""}function Ai(a,l,e){return Math.min(e,Math.max(l,a))}function po(a,l){const e=a.querySelector(".shroom-controls-shell");e&&e.setAttribute("data-collapsed",String(l))}function he(a,l){a&&(a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-label",l),a.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),a.click())}))}function H(a){a.querySelectorAll("[part=companion]").forEach(l=>{l.title=l.getAttribute("aria-label")??"Companion"})}const Oo={light:"var(--hrv-ex-shroom-light, #ff9800)",switch:"var(--hrv-ex-shroom-switch, #2196f3)",input_boolean:"var(--hrv-ex-shroom-switch, #2196f3)",fan:"var(--hrv-ex-shroom-fan, #4caf50)",climate:"var(--hrv-ex-shroom-climate, #ff5722)",cover:"var(--hrv-ex-shroom-cover, #9c27b0)",media_player:"var(--hrv-ex-shroom-media, #e91e63)",sensor:"var(--hrv-ex-shroom-sensor, #03a9f4)",binary_sensor:"var(--hrv-ex-shroom-binary, #8bc34a)",input_number:"var(--hrv-ex-shroom-input, #00bcd4)",input_select:"var(--hrv-ex-shroom-input, #00bcd4)",timer:"var(--hrv-ex-shroom-timer, #673ab7)",remote:"var(--hrv-ex-shroom-remote, #607d8b)",weather:"var(--hrv-ex-shroom-weather, #ff9800)",harvest_action:"var(--hrv-ex-shroom-action, #9c27b0)"};function mo(a){return Oo[a]??"var(--hrv-color-primary, #ff9800)"}function A(a,l,e){if(!a)return;const s=mo(l);e?(a.style.background=`color-mix(in srgb, ${s} 20%, transparent)`,a.style.color=s):(a.style.background="var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))",a.style.color="var(--hrv-color-icon, #757575)")}function T(a){const l=(a.config.displayHints??a.def.display_hints??{}).layout??null,e=a.root.host;e&&(l==="vertical"?e.setAttribute("data-layout","vertical"):e.removeAttribute("data-layout"))}function uo(a,l){if(a!=="on")return null;if(l.rgb_color){const[s,i,n]=l.rgb_color;return(.299*s+.587*i+.114*n)/255>.85?`rgb(${Math.round(s*.8)}, ${Math.round(i*.8)}, ${Math.round(n*.75)})`:`rgb(${s}, ${i}, ${n})`}if(l.hs_color)return`hsl(${l.hs_color[0]}, ${Math.max(l.hs_color[1],50)}%, 55%)`;const e=l.color_temp_kelvin??(l.color_temp?Math.round(1e6/l.color_temp):null);return e?e>=5200?"#4ba3e0":e>=4500?"#e0c85a":e<=3e3?"#e6a040":"#ddb840":null}const E=`
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
  `,Us=`
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
  `,cs=`
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
  `,Do=`
    ${E}
    ${q}
  `;class fo extends v{constructor(){super(...arguments);r(this,ms,null);r(this,le,null);r(this,xt,!1)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Do}</style>
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
      `,o(this,ms,this.root.querySelector(".shroom-icon-shape")),o(this,le,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline"),"card-icon");const s=this.root.querySelector(".shroom-state-item");e&&(he(s,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(s,{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}})),this.renderCompanions(),H(this.root)}applyState(e,s){o(this,xt,e==="on");const i=this.def.domain??"switch";A(t(this,ms),i,t(this,xt)),t(this,le)&&(t(this,le).textContent=S(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,xt)));const h=t(this,xt)?this.resolveIcon(this.def.icon,"mdi:toggle-switch"):this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="toggle"||e==="turn_on"||e==="turn_off"?{state:e==="toggle"?t(this,xt)?"off":"on":e==="turn_on"?"on":"off",attributes:{}}:null}}ms=new WeakMap,le=new WeakMap,xt=new WeakMap;const ps=["brightness","temp","color"],No={brightness:"mdi:brightness-4",temp:"mdi:thermometer",color:"mdi:palette"},zo=`
    ${E}
    ${Us}
    ${cs}
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
  `;class Zo extends v{constructor(e,s,i,n){super(e,s,i,n);r(this,X);r(this,_t,null);r(this,It,null);r(this,I,null);r(this,us,null);r(this,Ct,null);r(this,Bt,null);r(this,Vt,[]);r(this,R,0);r(this,Ot,4e3);r(this,Dt,0);r(this,V,!1);r(this,O,0);r(this,wt,2e3);r(this,de,6500);r(this,Nt,{});r(this,fs);o(this,fs,ae(d(this,X,_o).bind(this),300))}render(){T(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],i=this.config.displayHints??{},n=i.show_brightness!==!1&&s.includes("brightness"),h=i.show_color_temp!==!1&&s.includes("color_temp"),c=i.show_rgb!==!1&&s.includes("rgb_color"),p=e&&(n||h||c),m=[n,h,c].filter(Boolean).length;o(this,wt,this.def.feature_config?.min_color_temp_kelvin??2e3),o(this,de,this.def.feature_config?.max_color_temp_kelvin??6500);const g=[n,h,c];g[t(this,O)]||(o(this,O,g.findIndex(Boolean)),t(this,O)===-1&&o(this,O,0)),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${zo}</style>
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
                    ${c?'<button class="shroom-light-mode-btn" data-mode="color" type="button" aria-label="Color"><span part="light-mode-color"></span></button>':""}
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
      `,o(this,_t,this.root.querySelector(".shroom-icon-shape")),o(this,It,this.root.querySelector(".shroom-secondary")),o(this,I,this.root.querySelector(".shroom-slider-input")),o(this,us,this.root.querySelector(".shroom-slider-bg")),o(this,Ct,this.root.querySelector(".shroom-slider-cover")),o(this,Bt,this.root.querySelector(".shroom-slider-edge")),o(this,Vt,[...this.root.querySelectorAll(".shroom-light-mode-btn")]),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon");for(const f of t(this,Vt))this.renderIcon(No[f.dataset.mode]??"mdi:help-circle",`light-mode-${f.dataset.mode}`);const w=this.root.querySelector(".shroom-state-item");e&&(he(w,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(w,{onTap:()=>{const f=this.config.gestureConfig?.tap;if(f){this._runAction(f);return}this.config.card?.sendCommand("toggle",{})}}));for(const f of t(this,Vt))f.addEventListener("click",()=>{const k=f.dataset.mode,z=ps.indexOf(k);z===-1||z===t(this,O)||(o(this,O,z),d(this,X,Qs).call(this))});t(this,I)&&t(this,I).addEventListener("input",()=>{const f=parseInt(t(this,I).value,10),k=ps[t(this,O)]??"brightness";k==="brightness"?o(this,R,f):k==="temp"?o(this,Ot,Math.round(t(this,wt)+f/100*(t(this,de)-t(this,wt)))):o(this,Dt,Math.round(f*3.6)),d(this,X,to).call(this),t(this,fs).call(this,k)}),this.renderCompanions(),H(this.root)}applyState(e,s){o(this,V,e==="on"),o(this,Nt,s),po(this.root,!t(this,V));const i=uo(e,s);t(this,V)&&i?t(this,_t)&&(t(this,_t).style.background=`color-mix(in srgb, ${i} 20%, transparent)`,t(this,_t).style.color=i):A(t(this,_t),"light",t(this,V)),o(this,R,s.brightness!=null?Math.round(s.brightness/255*100):0),o(this,Ot,s.color_temp_kelvin??(s.color_temp?Math.round(1e6/s.color_temp):4e3)),o(this,Dt,s.hs_color?.[0]??42),t(this,It)&&(t(this,V)&&s.brightness!=null?t(this,It).textContent=`${t(this,R)}%`:t(this,It).textContent=S(e));const n=this.root.querySelector(".shroom-light-ro");n&&(n.textContent=t(this,V)&&s.brightness!=null?`${t(this,R)}%`:S(e));const h=this.root.querySelector(".shroom-slider-wrap");if(h){const m=uo("on",s);h.style.setProperty("--shroom-light-accent",m??"var(--hrv-ex-shroom-light, #ff9800)")}d(this,X,Qs).call(this);const c=this.root.querySelector(".shroom-state-item");if(c?.hasAttribute("role")&&c.setAttribute("aria-pressed",String(t(this,V))),t(this,I)){const m=ps[t(this,O)]??"brightness",g=parseInt(t(this,I).value,10);m==="brightness"?t(this,I).setAttribute("aria-valuetext",`${g}%`):m==="temp"?t(this,I).setAttribute("aria-valuetext",`${g}K`):t(this,I).setAttribute("aria-valuetext",`${g}`)}const p=t(this,V)?this.resolveIcon(this.def.icon,"mdi:lightbulb"):this.resolveIcon(this.def.icon,"mdi:lightbulb-off");this.renderIcon(p,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}${t(this,V)?`, ${t(this,R)}%`:""}`)}predictState(e,s){if(e==="toggle")return{state:t(this,V)?"off":"on",attributes:t(this,Nt)};if(e==="turn_on"){const i={...t(this,Nt)};return s.brightness!=null&&(i.brightness=s.brightness),s.color_temp_kelvin!=null&&(i.color_temp_kelvin=s.color_temp_kelvin),s.hs_color!=null&&(i.hs_color=s.hs_color),{state:"on",attributes:i}}return e==="turn_off"?{state:"off",attributes:t(this,Nt)}:null}}_t=new WeakMap,It=new WeakMap,I=new WeakMap,us=new WeakMap,Ct=new WeakMap,Bt=new WeakMap,Vt=new WeakMap,R=new WeakMap,Ot=new WeakMap,Dt=new WeakMap,V=new WeakMap,O=new WeakMap,wt=new WeakMap,de=new WeakMap,Nt=new WeakMap,fs=new WeakMap,X=new WeakSet,Qs=function(){const e=ps[t(this,O)]??"brightness",s=t(this,us);s?.classList.remove("shroom-brightness-bg","shroom-ct-bg","shroom-hue-bg"),e==="brightness"?s?.classList.add("shroom-brightness-bg"):e==="temp"?s?.classList.add("shroom-ct-bg"):s?.classList.add("shroom-hue-bg");for(const i of t(this,Vt))i.hidden=i.dataset.mode===e;d(this,X,to).call(this)},to=function(){const e=ps[t(this,O)]??"brightness";let s=0;e==="brightness"?s=t(this,R):e==="temp"?s=Math.round((t(this,Ot)-t(this,wt))/(t(this,de)-t(this,wt))*100):s=Math.round(t(this,Dt)/3.6);const i=e==="brightness";t(this,Ct)&&(i?(t(this,Ct).style.display="",t(this,Ct).style.left=`${s}%`):t(this,Ct).style.display="none"),t(this,Bt)&&(t(this,Bt).style.display=i?"none":"",i||(t(this,Bt).style.left=`${s}%`)),t(this,I)&&!this.isFocused(t(this,I))&&(t(this,I).value=String(s))},_o=function(e){e==="brightness"?t(this,R)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:Math.round(t(this,R)*2.55)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,Ot)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,Dt),100]})};const Po={temperature:"var(--hrv-ex-shroom-climate, #ff5722)",humidity:"var(--hrv-ex-shroom-sensor, #03a9f4)",battery:"var(--hrv-ex-shroom-fan, #4caf50)"},jo={temperature:"mdi:thermometer",humidity:"mdi:water-percent",battery:"mdi:battery"};function Ro(a){return a==null||isNaN(a)||a>=90?"mdi:battery":a>=70?"mdi:battery-70":a>=50?"mdi:battery-50":a>=30?"mdi:battery-30":a>=10?"mdi:battery-10":"mdi:battery-alert"}function Fo(a){return a==null||isNaN(a)?"var(--hrv-ex-shroom-fan, #4caf50)":a<=10?"var(--hrv-color-error, #f44336)":a<=20?"var(--hrv-color-warning, #ff9800)":"var(--hrv-ex-shroom-fan, #4caf50)"}const Go=`
    ${E}
    ${q}
  `;class Ps extends v{constructor(){super(...arguments);r(this,J,null);r(this,zt,null);r(this,ce,null)}render(){T(this),o(this,ce,this.def.device_class??null);const e=jo[t(this,ce)]??"mdi:gauge";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Go}</style>
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
      `,o(this,J,this.root.querySelector(".shroom-icon-shape")),o(this,zt,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,e),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){const i=parseFloat(e),n=this.def.unit_of_measurement??"",h=!isNaN(i),c=t(this,ce);if(t(this,zt))if(h){const p=s.suggested_display_precision,m=p!=null?i.toFixed(p):String(Math.round(i*10)/10);t(this,zt).textContent=n?`${m} ${n}`:m}else t(this,zt).textContent=S(e);if(c==="battery"&&h){const p=Fo(i);t(this,J)&&(t(this,J).style.background=`color-mix(in srgb, ${p} 20%, transparent)`,t(this,J).style.color=p),this.renderIcon(this.resolveIcon(this.def.icon,Ro(i)),"card-icon")}else{const p=Po[c]??mo("sensor");t(this,J)&&(t(this,J).style.background=`color-mix(in srgb, ${p} 20%, transparent)`,t(this,J).style.color=p)}this.announceState(`${this.def.friendly_name}, ${h?i:e} ${n}`)}}J=new WeakMap,zt=new WeakMap,ce=new WeakMap;const Yo=`
    ${E}
    ${Us}
    ${cs}
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
  `;class Wo extends v{constructor(e,s,i,n){super(e,s,i,n);r(this,b);r(this,at,null);r(this,Zt,null);r(this,F,null);r(this,pe,null);r(this,St,null);r(this,$t,null);r(this,Lt,null);r(this,D,!1);r(this,x,0);r(this,Pt,!1);r(this,At,"forward");r(this,Mt,null);r(this,G,[]);r(this,vs);o(this,vs,ae(d(this,b,wo).bind(this),300)),o(this,G,e.feature_config?.preset_modes??[])}render(){T(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],i=this.config.displayHints??this.def.display_hints??{},n=i.display_mode??null;let h=s.includes("set_speed");const c=i.show_oscillate!==!1&&s.includes("oscillate"),p=i.show_direction!==!1&&s.includes("direction"),m=i.show_presets!==!1&&s.includes("preset_mode");n==="on-off"&&(h=!1);let g=e&&h,w=g&&t(this,b,Co),f=!1,k=!1;n==="continuous"?w=!1:n==="stepped"?k=w:n==="cycle"?(w=!0,f=!0):w&&t(this,G).length?f=!0:w&&(k=!0);const z=e&&(c||p||m);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Yo}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${g||z?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${g&&!w?`
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
                ${g&&k?`
                  <div class="shroom-fan-step-dots">
                    ${t(this,b,eo).map((_,Z)=>`
                      <button class="shroom-fan-step-dot" data-pct="${_}" type="button"
                        data-active="false"
                        aria-label="Speed ${Z+1} (${_}%)"
                        title="Speed ${Z+1} (${_}%)">${Z+1}</button>
                    `).join("")}
                  </div>
                `:""}
                ${g&&f?`
                  <div style="display:flex;justify-content:center;">
                    <button class="shroom-fan-cycle-btn" type="button"
                      title="Cycle speed"
                      aria-label="Cycle fan speed">
                      <svg viewBox="0 0 24 24"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg>
                    </button>
                  </div>
                `:""}
                ${z?`
                  <div class="shroom-fan-feat-row">
                    ${c?'<button class="shroom-btn shroom-fan-feat" data-feat="oscillate" type="button" aria-label="Oscillate" aria-pressed="false">Oscillate</button>':""}
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
      `,o(this,at,this.root.querySelector(".shroom-icon-shape")),o(this,Zt,this.root.querySelector(".shroom-secondary")),o(this,F,this.root.querySelector(".shroom-slider-input")),o(this,pe,this.root.querySelector(".shroom-slider-cover")),o(this,St,this.root.querySelector('[data-feat="oscillate"]')),o(this,$t,this.root.querySelector('[data-feat="direction"]')),o(this,Lt,this.root.querySelector('[data-feat="preset"]')),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"card-icon");const Rs=this.root.querySelector(".shroom-state-item");e&&(he(Rs,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(Rs,{onTap:()=>{const _=this.config.gestureConfig?.tap;if(_){this._runAction(_);return}this.config.card?.sendCommand("toggle",{})}})),t(this,F)&&t(this,F).addEventListener("input",()=>{const _=parseInt(t(this,F).value,10);o(this,x,_),t(this,F).setAttribute("aria-valuetext",`${_}%`),d(this,b,so).call(this),t(this,vs).call(this)}),this.root.querySelectorAll(".shroom-fan-step-dot").forEach(_=>{_.addEventListener("click",()=>{const Z=Number(_.getAttribute("data-pct"));o(this,x,Z),o(this,D,!0),d(this,b,oo).call(this),this.config.card?.sendCommand("set_percentage",{percentage:Z})})}),this.root.querySelector(".shroom-fan-cycle-btn")?.addEventListener("click",()=>{const _=t(this,b,eo);if(!_.length)return;let Z;if(!t(this,D)||t(this,x)===0)Z=_[0];else{const zs=_.findIndex(Li=>Li>t(this,x));Z=zs===-1?_[0]:_[zs]}o(this,x,Z),o(this,D,!0),this.config.card?.sendCommand("set_percentage",{percentage:Z})}),t(this,St)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,Pt)})}),t(this,$t)?.addEventListener("click",()=>{const _=t(this,At)==="forward"?"reverse":"forward";o(this,At,_),d(this,b,Gs).call(this),this.config.card?.sendCommand("set_direction",{direction:_})}),t(this,Lt)?.addEventListener("click",()=>{if(!t(this,G).length)return;const Z=((t(this,Mt)?t(this,G).indexOf(t(this,Mt)):-1)+1)%t(this,G).length,zs=t(this,G)[Z];o(this,Mt,zs),d(this,b,Gs).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:zs})}),this.renderCompanions(),H(this.root)}applyState(e,s){if(o(this,D,e==="on"),o(this,x,s?.percentage??0),o(this,Pt,s?.oscillating??!1),o(this,At,s?.direction??"forward"),o(this,Mt,s?.preset_mode??null),s?.preset_modes?.length&&o(this,G,s.preset_modes),po(this.root,!t(this,D)),A(t(this,at),"fan",t(this,D)),t(this,at))if(t(this,D)&&t(this,x)>0&&this.config.animate!==!1){const n=1/(1.5*Math.pow(t(this,x)/100,.5));t(this,at).setAttribute("data-spinning","true"),t(this,at).style.setProperty("--shroom-fan-duration",`${n.toFixed(2)}s`)}else t(this,at).setAttribute("data-spinning","false");t(this,Zt)&&(t(this,D)&&t(this,x)>0?t(this,Zt).textContent=`${t(this,x)}%`:t(this,Zt).textContent=S(e)),d(this,b,so).call(this),d(this,b,oo).call(this),d(this,b,Gs).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,x)>0?`, ${t(this,x)}%`:""))}predictState(e,s){return e==="toggle"?{state:t(this,D)?"off":"on",attributes:{percentage:t(this,x)}}:e==="set_percentage"?{state:"on",attributes:{percentage:s.percentage,oscillating:t(this,Pt),direction:t(this,At),preset_mode:t(this,Mt),preset_modes:t(this,G)}}:e==="oscillate"?{state:"on",attributes:{percentage:t(this,x),oscillating:s.oscillating,direction:t(this,At)}}:e==="set_direction"?{state:"on",attributes:{percentage:t(this,x),oscillating:t(this,Pt),direction:s.direction}}:null}}at=new WeakMap,Zt=new WeakMap,F=new WeakMap,pe=new WeakMap,St=new WeakMap,$t=new WeakMap,Lt=new WeakMap,D=new WeakMap,x=new WeakMap,Pt=new WeakMap,At=new WeakMap,Mt=new WeakMap,G=new WeakMap,vs=new WeakMap,b=new WeakSet,Fs=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},Co=function(){return t(this,b,Fs)>1},eo=function(){const e=t(this,b,Fs),s=[];for(let i=1;i*e<=100.001;i++)s.push(Math.floor(i*e*10)/10);return s},so=function(){if(!t(this,F))return;const e=t(this,x);this.isFocused(t(this,F))||(t(this,F).value=String(e)),t(this,pe)&&(t(this,pe).style.left=`${e}%`)},oo=function(){const e=t(this,b,Fs)/2;this.root.querySelectorAll(".shroom-fan-step-dot").forEach(s=>{const i=Number(s.getAttribute("data-pct"));s.setAttribute("data-active",String(t(this,D)&&t(this,x)>=i-e))})},Gs=function(){t(this,St)&&(t(this,St).setAttribute("aria-pressed","false"),t(this,St).textContent="Oscillate"),t(this,$t)&&(t(this,$t).textContent="Direction",t(this,$t).setAttribute("aria-label","Direction")),t(this,Lt)&&(t(this,Lt).textContent="Preset",t(this,Lt).setAttribute("data-active","false"))},wo=function(){t(this,x)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,x)})};const Uo=`
    ${E}
    ${q}
  `;class Ko extends v{constructor(){super(...arguments);r(this,gs,null);r(this,me,null)}render(){T(this),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Uo}</style>
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
      `,o(this,gs,this.root.querySelector(".shroom-icon-shape")),o(this,me,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.def.icon_state_map?.off??this.resolveIcon(this.def.icon,"mdi:radiobox-blank"),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){const i=e==="on";A(t(this,gs),"binary_sensor",i);const n=this.i18n.t(`state.${e}`)!==`state.${e}`?this.i18n.t(`state.${e}`):S(e);t(this,me)&&(t(this,me).textContent=n);const h=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,i?"mdi:radiobox-marked":"mdi:radiobox-blank");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${n}`)}}gs=new WeakMap,me=new WeakMap;const Xo=`
    ${E}
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
  `;class Jo extends v{constructor(){super(...arguments);r(this,bs,null);r(this,ue,null);r(this,P,null);r(this,Q,!1);r(this,jt,!1)}render(){T(this);const e=this.def.capabilities==="read-write";o(this,jt,!1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Xo}</style>
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
      `,o(this,bs,this.root.querySelector(".shroom-icon-shape")),o(this,ue,this.root.querySelector(".shroom-secondary")),o(this,P,this.root.querySelector(".shroom-generic-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:help-circle"),"card-icon"),t(this,P)&&e&&this._attachGestureHandlers(t(this,P),{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),H(this.root)}applyState(e,s){const i=e==="on"||e==="off";o(this,Q,e==="on"),t(this,ue)&&(t(this,ue).textContent=S(e));const n=this.def.domain??"generic";A(t(this,bs),n,t(this,Q)),t(this,P)&&(i&&!t(this,jt)&&(t(this,P).removeAttribute("hidden"),o(this,jt,!0)),t(this,jt)&&(t(this,P).setAttribute("data-on",String(t(this,Q))),t(this,P).setAttribute("aria-pressed",String(t(this,Q))),t(this,P).textContent=t(this,Q)?"On":"Off",t(this,P).title=t(this,Q)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e!=="toggle"?null:{state:t(this,Q)?"off":"on",attributes:{}}}}bs=new WeakMap,ue=new WeakMap,P=new WeakMap,Q=new WeakMap,jt=new WeakMap;const Qo=`
    ${E}
    ${q}
  `;class ti extends v{constructor(){super(...arguments);r(this,fe,null);r(this,ve,null)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Qo}</style>
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
      `,o(this,fe,this.root.querySelector(".shroom-icon-shape")),o(this,ve,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.def.icon_state_map?.idle??this.resolveIcon(this.def.icon,"mdi:play"),"card-icon"),A(t(this,fe),"harvest_action",!1);const s=this.root.querySelector(".shroom-state-item");e&&(he(s,`${this.def.friendly_name} - Trigger`),this._attachGestureHandlers(s,{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("trigger",{})}})),this.renderCompanions(),H(this.root)}applyState(e,s){const i=e==="triggered";t(this,ve)&&(t(this,ve).textContent=S(e)),A(t(this,fe),"harvest_action",i);const n=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,"mdi:play");this.renderIcon(n,"card-icon"),this.announceState(`${this.def.friendly_name}, ${S(e)}`)}predictState(e,s){return e!=="trigger"?null:{state:"triggered",attributes:{}}}}fe=new WeakMap,ve=new WeakMap;const ei=`
    ${E}
    ${Us}
    ${cs}
    ${yt}
    ${q}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }
  `;class si extends v{constructor(e,s,i,n){super(e,s,i,n);r(this,lt);r(this,ys,null);r(this,ge,null);r(this,Y,null);r(this,be,null);r(this,tt,0);r(this,ht,0);r(this,ye,100);r(this,xs,1);r(this,_s);o(this,_s,ae(d(this,lt,$o).bind(this),300))}render(){T(this);const e=this.def.capabilities==="read-write";if(o(this,ht,this.def.feature_config?.min??0),o(this,ye,this.def.feature_config?.max??100),o(this,xs,this.def.feature_config?.step??1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ei}</style>
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
                  min="${t(this,ht)}" max="${t(this,ye)}" step="${t(this,xs)}" value="${t(this,ht)}"
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
      `,o(this,ys,this.root.querySelector(".shroom-icon-shape")),o(this,ge,this.root.querySelector(".shroom-secondary")),o(this,Y,this.root.querySelector(".shroom-slider-input")),o(this,be,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:ray-vertex"),"card-icon"),A(t(this,ys),"input_number",!0),t(this,Y)){const s=this.def.unit_of_measurement??"";t(this,Y).addEventListener("input",()=>{o(this,tt,parseFloat(t(this,Y).value)),t(this,Y).setAttribute("aria-valuetext",`${t(this,tt)}${s?` ${s}`:""}`),d(this,lt,io).call(this),t(this,_s).call(this)})}this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){const i=parseFloat(e);if(isNaN(i))return;o(this,tt,i),d(this,lt,io).call(this);const n=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${i}${n?` ${n}`:""}`)}predictState(e,s){return e==="set_value"&&s.value!==void 0?{state:String(s.value),attributes:{}}:null}}ys=new WeakMap,ge=new WeakMap,Y=new WeakMap,be=new WeakMap,tt=new WeakMap,ht=new WeakMap,ye=new WeakMap,xs=new WeakMap,_s=new WeakMap,lt=new WeakSet,So=function(e){const s=t(this,ye)-t(this,ht);return s===0?0:Math.max(0,Math.min(100,(e-t(this,ht))/s*100))},io=function(){const e=d(this,lt,So).call(this,t(this,tt));t(this,be)&&(t(this,be).style.left=`${e}%`),t(this,Y)&&!this.isFocused(t(this,Y))&&(t(this,Y).value=String(t(this,tt)));const s=this.def.unit_of_measurement??"";t(this,ge)&&(t(this,ge).textContent=`${t(this,tt)}${s?` ${s}`:""}`)},$o=function(){this.config.card?.sendCommand("set_value",{value:t(this,tt)})};const oi=`
    ${E}
    ${yt}
    ${q}

    .shroom-select-shell {
      margin-top: var(--hrv-ex-shroom-spacing, 12px);
      position: relative;
    }
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
    .shroom-select-arrow { font-size: 10px; opacity: 0.5; }
    .shroom-select-dropdown {
      position: absolute;
      left: 0; right: 0;
      background: var(--hrv-card-background, #ffffff);
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      overflow: hidden;
      max-height: 240px;
      overflow-y: auto;
      scrollbar-width: none;
      z-index: 10;
    }
    .shroom-select-dropdown::-webkit-scrollbar { display: none; }
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
      transition: background 150ms;
    }
    .shroom-select-option + .shroom-select-option {
      border-top: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
    }
    .shroom-select-option:hover {
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
    }
    .shroom-select-option[data-active=true] {
      color: var(--hrv-color-primary, #ff9800);
      font-weight: 500;
    }
  `;class ii extends v{constructor(){super(...arguments);r(this,st);r(this,Cs,null);r(this,xe,null);r(this,B,null);r(this,M,null);r(this,_e,"");r(this,dt,[]);r(this,et,!1)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${oi}</style>
        <div part="card">
          <div class="shroom-state-item">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${e?`
            <div class="shroom-select-shell">
              <button class="shroom-select-current" type="button"
                aria-label="${u(this.def.friendly_name)}"
                aria-haspopup="listbox" aria-expanded="false">
                <span class="shroom-select-label">-</span>
                <span class="shroom-select-arrow" aria-hidden="true">&#9660;</span>
              </button>
              <div class="shroom-select-dropdown" role="listbox" hidden></div>
            </div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,o(this,Cs,this.root.querySelector(".shroom-icon-shape")),o(this,xe,this.root.querySelector(".shroom-secondary")),o(this,B,this.root.querySelector(".shroom-select-current")),o(this,M,this.root.querySelector(".shroom-select-dropdown")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:form-select"),"card-icon"),A(t(this,Cs),"input_select",!0),t(this,B)&&e&&(t(this,B).addEventListener("click",()=>{t(this,et)?d(this,st,ds).call(this):d(this,st,Lo).call(this)}),t(this,B).addEventListener("keydown",s=>{s.key==="Escape"&&t(this,et)&&(d(this,st,ds).call(this),t(this,B).focus())}),this.root.addEventListener("keydown",s=>{if(t(this,et)){if(s.key==="Escape")d(this,st,ds).call(this),t(this,B).focus();else if(s.key==="ArrowDown"||s.key==="ArrowUp"){s.preventDefault();const i=[...t(this,M).querySelectorAll("[role=option]")],n=this.root.activeElement;let h=i.indexOf(n);h=s.key==="ArrowDown"?Math.min(h+1,i.length-1):Math.max(h-1,0),i[h]?.focus()}}}),document.addEventListener("click",s=>{t(this,et)&&!this.root.host.contains(s.target)&&d(this,st,ds).call(this)})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){o(this,_e,e),o(this,dt,s?.options??t(this,dt)),t(this,xe)&&(t(this,xe).textContent=e);const i=this.root.querySelector(".shroom-select-label");i&&(i.textContent=e),t(this,et)&&t(this,M)?.querySelectorAll(".shroom-select-option").forEach((n,h)=>{const c=String(t(this,dt)[h]===e);n.setAttribute("data-active",c),n.setAttribute("aria-selected",c)}),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="select_option"&&s.option!==void 0?{state:String(s.option),attributes:{}}:null}}Cs=new WeakMap,xe=new WeakMap,B=new WeakMap,M=new WeakMap,_e=new WeakMap,dt=new WeakMap,et=new WeakMap,st=new WeakSet,Lo=function(){if(!t(this,M)||!t(this,dt).length)return;t(this,M).innerHTML=t(this,dt).map(c=>`
        <button class="shroom-select-option" type="button" role="option"
          aria-selected="${c===t(this,_e)}"
          data-active="${c===t(this,_e)}">
          ${u(c)}
        </button>
      `).join(""),t(this,M).querySelectorAll(".shroom-select-option").forEach((c,p)=>{c.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:t(this,dt)[p]}),d(this,st,ds).call(this)})});const e=this.root.querySelector(".shroom-select-shell");e&&(e.style.overflow="visible");const s=this.root.querySelector("[part=card]");s&&(s.style.overflow="visible"),t(this,M).removeAttribute("hidden"),t(this,B)&&t(this,B).setAttribute("aria-expanded","true");const i=t(this,B).getBoundingClientRect(),n=window.innerHeight-i.bottom,h=Math.min(t(this,M).scrollHeight,240);n<h+8?(t(this,M).style.bottom="calc(100% + 4px)",t(this,M).style.top="auto"):(t(this,M).style.top="calc(100% + 4px)",t(this,M).style.bottom="auto"),o(this,et,!0)},ds=function(){t(this,M)?.setAttribute("hidden",""),t(this,B)&&t(this,B).setAttribute("aria-expanded","false");const e=this.root.querySelector(".shroom-select-shell");e&&(e.style.overflow="");const s=this.root.querySelector("[part=card]");s&&(s.style.overflow=""),o(this,et,!1)};const ri=`
    ${E}
    ${cs}
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
  `;class ni extends v{constructor(e,s,i,n){super(e,s,i,n);r(this,pt);r(this,ws,null);r(this,Ce,null);r(this,ot,null);r(this,we,null);r(this,Se,null);r(this,$e,null);r(this,Rt,null);r(this,Ft,null);r(this,Gt,null);r(this,ct,0);r(this,it,!1);r(this,Ss,"closed");r(this,$s,{});r(this,Ls);o(this,Ls,ae(d(this,pt,Mo).bind(this),300))}render(){T(this);const e=this.def.capabilities==="read-write",i=(this.config.displayHints??{}).show_position!==!1&&this.def.supported_features?.includes("set_position"),n=!this.def.supported_features||this.def.supported_features.includes("buttons"),h=e&&(i||n);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ri}</style>
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
              ${i?`
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
                <div class="shroom-cover-btn-view"${i?" hidden":""}>
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
              ${i&&n?`
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
      `,o(this,ws,this.root.querySelector(".shroom-icon-shape")),o(this,Ce,this.root.querySelector(".shroom-secondary")),o(this,ot,this.root.querySelector(".shroom-slider-input")),o(this,we,this.root.querySelector(".shroom-slider-cover")),o(this,Se,this.root.querySelector(".shroom-cover-slider-view")),o(this,$e,this.root.querySelector(".shroom-cover-btn-view")),o(this,Rt,this.root.querySelector("[data-action=open]")),o(this,Ft,this.root.querySelector("[data-action=stop]")),o(this,Gt,this.root.querySelector("[data-action=close]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:window-shutter"),"card-icon"),t(this,ot)&&t(this,ot).addEventListener("input",()=>{o(this,ct,parseInt(t(this,ot).value,10)),d(this,pt,ro).call(this),t(this,Ls).call(this)}),[t(this,Rt),t(this,Ft),t(this,Gt)].forEach(p=>{if(!p)return;const m=p.getAttribute("data-action");p.addEventListener("click",()=>{this.config.card?.sendCommand(`${m}_cover`,{})})});const c=this.root.querySelector(".shroom-cover-toggle-btn");c?.addEventListener("click",()=>{o(this,it,!t(this,it)),c.setAttribute("aria-expanded",String(t(this,it))),c.setAttribute("aria-label",t(this,it)?"Show position slider":"Show cover buttons"),d(this,pt,Ao).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){o(this,Ss,e),o(this,$s,{...s});const i=e==="open"||e==="opening";if(A(t(this,ws),"cover",i),t(this,Ce)){const c=s.current_position,p=S(e);t(this,Ce).textContent=c!==void 0?`${p} - ${c}%`:p}const n=e==="opening"||e==="closing",h=s.current_position;t(this,Rt)&&(t(this,Rt).disabled=!n&&h===100),t(this,Ft)&&(t(this,Ft).disabled=!n),t(this,Gt)&&(t(this,Gt).disabled=!n&&e==="closed"),s.current_position!==void 0&&(o(this,ct,s.current_position),t(this,ot)&&!this.isFocused(t(this,ot))&&(t(this,ot).value=String(t(this,ct))),d(this,pt,ro).call(this)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){const i={...t(this,$s)};return e==="open_cover"?(i.current_position=100,{state:"open",attributes:i}):e==="close_cover"?(i.current_position=0,{state:"closed",attributes:i}):e==="stop_cover"?{state:t(this,Ss),attributes:i}:e==="set_cover_position"&&s.position!==void 0?(i.current_position=s.position,{state:s.position>0?"open":"closed",attributes:i}):null}}ws=new WeakMap,Ce=new WeakMap,ot=new WeakMap,we=new WeakMap,Se=new WeakMap,$e=new WeakMap,Rt=new WeakMap,Ft=new WeakMap,Gt=new WeakMap,ct=new WeakMap,it=new WeakMap,Ss=new WeakMap,$s=new WeakMap,Ls=new WeakMap,pt=new WeakSet,Ao=function(){t(this,Se)&&(t(this,Se).hidden=t(this,it)),t(this,$e)&&(t(this,$e).hidden=!t(this,it));const e=this.root.querySelector(".shroom-cover-toggle-btn");e&&(e.innerHTML=t(this,it)?'<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>')},ro=function(){t(this,we)&&(t(this,we).style.left=`${t(this,ct)}%`);const e=this.root.querySelector(".shroom-slider-edge");e&&(e.style.left=`${t(this,ct)}%`)},Mo=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,ct)})};const ai=`
    ${E}
    ${q}
  `;class hi extends v{constructor(){super(...arguments);r(this,Le,null);r(this,Ae,null)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ai}</style>
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
      `,o(this,Le,this.root.querySelector(".shroom-icon-shape")),o(this,Ae,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:remote"),"card-icon"),A(t(this,Le),"remote",!1);const s=this.root.querySelector(".shroom-state-item");e&&(he(s,`${this.def.friendly_name} - Send command`),this._attachGestureHandlers(s,{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}const n=this.config.tapAction?.data?.command??"power",h=this.config.tapAction?.data?.device??void 0,c=h?{command:n,device:h}:{command:n};this.config.card?.sendCommand("send_command",c)}})),this.renderCompanions(),H(this.root)}applyState(e,s){const i=e==="on";A(t(this,Le),"remote",i),t(this,Ae)&&(t(this,Ae).textContent=S(e));const n=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(n,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Le=new WeakMap,Ae=new WeakMap;function js(a){a<0&&(a=0);const l=Math.floor(a/3600),e=Math.floor(a%3600/60),s=Math.floor(a%60),i=n=>String(n).padStart(2,"0");return l>0?`${l}:${i(e)}:${i(s)}`:`${i(e)}:${i(s)}`}function vo(a){if(typeof a=="number")return a;if(typeof a!="string")return 0;const l=a.split(":").map(Number);return l.length===3?l[0]*3600+l[1]*60+l[2]:l.length===2?l[0]*60+l[1]:l[0]||0}const li=`
    ${E}
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
  `;class di extends v{constructor(){super(...arguments);r(this,N);r(this,Me,null);r(this,ke,null);r(this,j,null);r(this,kt,null);r(this,Yt,null);r(this,Wt,null);r(this,Ut,null);r(this,He,"idle");r(this,Te,{});r(this,W,null);r(this,Ee,null)}render(){T(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${li}</style>
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
      `,o(this,Me,this.root.querySelector(".shroom-icon-shape")),o(this,ke,this.root.querySelector(".shroom-secondary")),o(this,j,this.root.querySelector(".shroom-timer-display")),o(this,kt,this.root.querySelector("[data-action=playpause]")),o(this,Yt,this.root.querySelector("[data-action=cancel]")),o(this,Wt,this.root.querySelector("[data-action=finish]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:timer-outline"),"card-icon"),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),A(t(this,Me),"timer",!1),e&&(t(this,kt)?.addEventListener("click",()=>{const s=t(this,He)==="active"?"pause":"start";this.config.card?.sendCommand(s,{})}),t(this,Yt)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,Wt)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){o(this,He,e),o(this,Te,{...s}),o(this,W,s.finishes_at??null),o(this,Ee,s.remaining!=null?vo(s.remaining):null);const i=e==="active";A(t(this,Me),"timer",i||e==="paused"),t(this,ke)&&(t(this,ke).textContent=S(e)),d(this,N,ko).call(this,e),d(this,N,Ho).call(this,e),i&&t(this,W)?d(this,N,To).call(this):d(this,N,Zs).call(this),t(this,j)&&t(this,j).setAttribute("data-paused",String(e==="paused"))}predictState(e,s){const i={...t(this,Te)};return e==="start"?{state:"active",attributes:i}:e==="pause"?(t(this,W)&&(i.remaining=Math.max(0,(new Date(t(this,W)).getTime()-Date.now())/1e3)),{state:"paused",attributes:i}):e==="cancel"||e==="finish"?{state:"idle",attributes:i}:null}}Me=new WeakMap,ke=new WeakMap,j=new WeakMap,kt=new WeakMap,Yt=new WeakMap,Wt=new WeakMap,Ut=new WeakMap,He=new WeakMap,Te=new WeakMap,W=new WeakMap,Ee=new WeakMap,N=new WeakSet,ko=function(e){const s=e==="idle",i=e==="active";if(t(this,kt)){const n=i?"mdi:pause":"mdi:play",h=i?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(n,"playpause-icon"),t(this,kt).title=h,t(this,kt).setAttribute("aria-label",`${this.def.friendly_name} - ${h}`)}t(this,Yt)&&(t(this,Yt).disabled=s),t(this,Wt)&&(t(this,Wt).disabled=s),this.announceState(`${this.def.friendly_name}, ${e}`)},Ho=function(e){if(t(this,j)){if(e==="idle"){const s=t(this,Te).duration;t(this,j).textContent=s?js(vo(s)):"00:00";return}if(e==="paused"&&t(this,Ee)!=null){t(this,j).textContent=js(t(this,Ee));return}if(e==="active"&&t(this,W)){const s=Math.max(0,(new Date(t(this,W)).getTime()-Date.now())/1e3);t(this,j).textContent=js(s)}}},To=function(){d(this,N,Zs).call(this),o(this,Ut,setInterval(()=>{if(!t(this,W)||t(this,He)!=="active"){d(this,N,Zs).call(this);return}const e=Math.max(0,(new Date(t(this,W)).getTime()-Date.now())/1e3);t(this,j)&&(t(this,j).textContent=js(e)),e<=0&&d(this,N,Zs).call(this)},1e3))},Zs=function(){t(this,Ut)&&(clearInterval(t(this,Ut)),o(this,Ut,null))};const ci=`
    ${E}
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
    .shroom-climate-dropdown {
      background: var(--hrv-card-background, #ffffff);
      border-radius: var(--hrv-ex-shroom-slider-radius, 12px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      overflow: hidden;
      max-height: 200px;
      overflow-y: auto;
      scrollbar-width: none;
      margin-top: 4px;
    }
    .shroom-climate-dropdown::-webkit-scrollbar { display: none; }
    .shroom-climate-dropdown[hidden] { display: none; }
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
      transition: background 150ms;
    }
    .shroom-climate-dd-option + .shroom-climate-dd-option {
      border-top: 1px solid var(--hrv-color-border, rgba(0,0,0,0.06));
    }
    .shroom-climate-dd-option:hover {
      background: var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05));
    }
    .shroom-climate-dd-option[data-active=true] {
      color: var(--hrv-color-primary, #ff9800);
      font-weight: 500;
    }
    @media (prefers-reduced-motion: reduce) {
      .shroom-climate-step-btn,
      .shroom-climate-feat-btn,
      .shroom-climate-toggle-btn { transition: none; }
    }
  `;class pi extends v{constructor(e,s,i,n){super(e,s,i,n);r(this,C);r(this,As,null);r(this,qe,null);r(this,Ie,null);r(this,Be,null);r(this,Ve,null);r(this,Oe,null);r(this,De,null);r(this,Ne,null);r(this,ze,null);r(this,Ze,null);r(this,Pe,null);r(this,mt,null);r(this,je,null);r(this,Re,null);r(this,ut,null);r(this,Fe,null);r(this,Kt,null);r(this,ft,!1);r(this,vt,20);r(this,Ge,null);r(this,U,"off");r(this,Ye,null);r(this,We,null);r(this,Ue,null);r(this,Ms,16);r(this,ks,32);r(this,Hs,.5);r(this,Ke,"°C");r(this,Ht,[]);r(this,Xt,[]);r(this,Jt,[]);r(this,Qt,[]);r(this,Ts,{});r(this,Es);o(this,Es,ae(d(this,C,qo).bind(this),500))}render(){T(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},i=this.def.supported_features?.includes("target_temperature"),n=s.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),h=s.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),c=s.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);o(this,Ms,this.def.feature_config?.min_temp??16),o(this,ks,this.def.feature_config?.max_temp??32),o(this,Hs,this.def.feature_config?.temp_step??.5),o(this,Ke,this.def.unit_of_measurement??"°C"),o(this,Ht,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),o(this,Xt,this.def.feature_config?.fan_modes??[]),o(this,Jt,this.def.feature_config?.preset_modes??[]),o(this,Qt,this.def.feature_config?.swing_modes??[]);const p=e&&(t(this,Ht).length||t(this,Jt).length||t(this,Xt).length||t(this,Qt).length),[m,g]=t(this,vt).toFixed(1).split(".");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ci}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${i||p?`
            <div class="shroom-climate-bar">
              ${i?`
                <div class="shroom-climate-temp-view">
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="-" type="button"
                      aria-label="Decrease temperature" title="Decrease">&#8722;</button>
                  `:""}
                  <span class="shroom-climate-temp-display">
                    <span class="shroom-climate-temp-int">${u(m)}</span><span class="shroom-climate-temp-frac">.${u(g)}</span>
                    <span class="shroom-climate-temp-unit">${u(t(this,Ke))}</span>
                  </span>
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  `:""}
                </div>
              `:""}
              ${p?`
                <div class="shroom-climate-feat-view" hidden>
                  ${s.show_hvac_modes!==!1&&t(this,Ht).length?`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${h&&t(this,Jt).length?`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${n&&t(this,Xt).length?`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${c&&t(this,Qt).length?`
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
            <div class="shroom-climate-dropdown" role="listbox" hidden></div>
          `:""}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,o(this,As,this.root.querySelector(".shroom-icon-shape")),o(this,qe,this.root.querySelector(".shroom-secondary")),o(this,Ie,this.root.querySelector(".shroom-climate-bar")),o(this,Be,this.root.querySelector(".shroom-climate-temp-int")),o(this,Ve,this.root.querySelector(".shroom-climate-temp-frac")),o(this,Oe,this.root.querySelector("[data-dir='-']")),o(this,De,this.root.querySelector("[data-dir='+']")),o(this,Ne,this.root.querySelector("[data-feat=mode]")),o(this,ze,this.root.querySelector("[data-feat=fan]")),o(this,Ze,this.root.querySelector("[data-feat=preset]")),o(this,Pe,this.root.querySelector("[data-feat=swing]")),o(this,mt,this.root.querySelector(".shroom-climate-dropdown")),o(this,je,this.root.querySelector(".shroom-climate-temp-view")),o(this,Re,this.root.querySelector(".shroom-climate-feat-view")),o(this,ut,this.root.querySelector(".shroom-climate-toggle-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:thermostat"),"card-icon");const w=this.root.querySelector(".shroom-state-item");e&&(he(w,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(w,{onTap:()=>{const f=this.config.gestureConfig?.tap;if(f){this._runAction(f);return}const k=t(this,U)==="off"?t(this,Ht).find(z=>z!=="off")??"heat":"off";this.config.card?.sendCommand("set_hvac_mode",{hvac_mode:k})}})),t(this,Oe)&&t(this,Oe).addEventListener("click",f=>{f.stopPropagation(),d(this,C,no).call(this,-1)}),t(this,De)&&t(this,De).addEventListener("click",f=>{f.stopPropagation(),d(this,C,no).call(this,1)}),t(this,ut)&&t(this,ut).addEventListener("click",f=>{f.stopPropagation(),o(this,ft,!t(this,ft)),t(this,ut).setAttribute("aria-expanded",String(t(this,ft))),d(this,C,Eo).call(this)}),e&&[t(this,Ne),t(this,ze),t(this,Ze),t(this,Pe)].forEach(f=>{if(!f)return;const k=f.getAttribute("data-feat");f.addEventListener("click",z=>{z.stopPropagation(),d(this,C,Io).call(this,k)})}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){o(this,Ts,{...s}),o(this,U,e),o(this,Ye,s.fan_mode??null),o(this,We,s.preset_mode??null),o(this,Ue,s.swing_mode??null),o(this,Ge,s.current_temperature??null);const i=e==="off";if(t(this,Ie)&&(t(this,Ie).hidden=i),A(t(this,As),"climate",!i),s.temperature!==void 0&&(o(this,vt,s.temperature),d(this,C,ao).call(this)),t(this,qe)){const h=s.hvac_action??e,c=t(this,Ge)!=null?` - ${t(this,Ge)} ${t(this,Ke)}`:"";t(this,qe).textContent=S(h)+c}d(this,C,Bo).call(this);const n=s.hvac_action??e;this.announceState(`${this.def.friendly_name}, ${S(n)}`)}predictState(e,s){const i={...t(this,Ts)};return e==="set_hvac_mode"&&s.hvac_mode?{state:s.hvac_mode,attributes:i}:e==="set_temperature"&&s.temperature!==void 0?{state:t(this,U),attributes:{...i,temperature:s.temperature}}:e==="set_fan_mode"&&s.fan_mode?{state:t(this,U),attributes:{...i,fan_mode:s.fan_mode}}:e==="set_preset_mode"&&s.preset_mode?{state:t(this,U),attributes:{...i,preset_mode:s.preset_mode}}:e==="set_swing_mode"&&s.swing_mode?{state:t(this,U),attributes:{...i,swing_mode:s.swing_mode}}:null}}As=new WeakMap,qe=new WeakMap,Ie=new WeakMap,Be=new WeakMap,Ve=new WeakMap,Oe=new WeakMap,De=new WeakMap,Ne=new WeakMap,ze=new WeakMap,Ze=new WeakMap,Pe=new WeakMap,mt=new WeakMap,je=new WeakMap,Re=new WeakMap,ut=new WeakMap,Fe=new WeakMap,Kt=new WeakMap,ft=new WeakMap,vt=new WeakMap,Ge=new WeakMap,U=new WeakMap,Ye=new WeakMap,We=new WeakMap,Ue=new WeakMap,Ms=new WeakMap,ks=new WeakMap,Hs=new WeakMap,Ke=new WeakMap,Ht=new WeakMap,Xt=new WeakMap,Jt=new WeakMap,Qt=new WeakMap,Ts=new WeakMap,Es=new WeakMap,C=new WeakSet,Eo=function(){t(this,je)&&(t(this,je).hidden=t(this,ft)),t(this,Re)&&(t(this,Re).hidden=!t(this,ft)),t(this,ut)&&(t(this,ut).innerHTML=t(this,ft)?'<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>')},no=function(e){const s=Math.round((t(this,vt)+e*t(this,Hs))*100)/100;o(this,vt,Math.max(t(this,Ms),Math.min(t(this,ks),s))),d(this,C,ao).call(this),t(this,Es).call(this)},ao=function(){const[e,s]=t(this,vt).toFixed(1).split(".");t(this,Be)&&(t(this,Be).textContent=e),t(this,Ve)&&(t(this,Ve).textContent=`.${s}`)},qo=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,vt)})},Io=function(e){if(t(this,Fe)===e){d(this,C,Ys).call(this);return}o(this,Fe,e);let s=[],i=null,n="",h="";switch(e){case"mode":s=t(this,Ht),i=t(this,U),n="set_hvac_mode",h="hvac_mode";break;case"fan":s=t(this,Xt),i=t(this,Ye),n="set_fan_mode",h="fan_mode";break;case"preset":s=t(this,Jt),i=t(this,We),n="set_preset_mode",h="preset_mode";break;case"swing":s=t(this,Qt),i=t(this,Ue),n="set_swing_mode",h="swing_mode";break}if(!s.length||!t(this,mt))return;t(this,mt).innerHTML=s.map(m=>`
        <button class="shroom-climate-dd-option" data-active="${m===i}" role="option"
          aria-selected="${m===i}" type="button">
          ${u(S(m))}
        </button>
      `).join(""),t(this,mt).querySelectorAll(".shroom-climate-dd-option").forEach((m,g)=>{m.addEventListener("click",w=>{w.stopPropagation(),this.config.card?.sendCommand(n,{[h]:s[g]}),d(this,C,Ys).call(this)})});const c=this.root.querySelector(`[data-feat="${e}"]`);c&&c.setAttribute("aria-expanded","true"),t(this,mt).removeAttribute("hidden");const p=m=>{m.composedPath().some(w=>w===this.root||w===this.root.host)||d(this,C,Ys).call(this)};o(this,Kt,p),document.addEventListener("pointerdown",p,!0)},Ys=function(){o(this,Fe,null),t(this,mt)?.setAttribute("hidden",""),this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(e=>{e.setAttribute("aria-expanded","false")}),t(this,Kt)&&(document.removeEventListener("pointerdown",t(this,Kt),!0),o(this,Kt,null))},Bo=function(){const e=(s,i)=>{if(!s)return;const n=s.querySelector(".shroom-climate-feat-value");n&&(n.textContent=S(i??"None"))};e(t(this,Ne),t(this,U)),e(t(this,ze),t(this,Ye)),e(t(this,Ze),t(this,We)),e(t(this,Pe),t(this,Ue))};const mi=`
    ${E}
    ${cs}
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
  `;class ui extends v{constructor(e,s,i,n){super(e,s,i,n);r(this,se);r(this,qs,null);r(this,Xe,null);r(this,te,null);r(this,Je,null);r(this,Qe,null);r(this,ts,null);r(this,Tt,null);r(this,Is,null);r(this,Bs,null);r(this,Vs,null);r(this,es,null);r(this,rt,null);r(this,Et,null);r(this,Os,!1);r(this,ee,!1);r(this,K,0);r(this,gt,"idle");r(this,bt,{});r(this,Ds);o(this,Ds,ae(d(this,se,Vo).bind(this),200))}render(){T(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],i=this.config.displayHints??{},n=s.includes("previous_track");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${mi}</style>
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
      `,o(this,qs,this.root.querySelector(".shroom-icon-shape")),o(this,Xe,this.root.querySelector(".shroom-primary")),o(this,te,this.root.querySelector(".shroom-secondary")),o(this,ts,this.root.querySelector(".shroom-mp-bar")),o(this,Je,this.root.querySelector(".shroom-mp-transport-view")),o(this,Qe,this.root.querySelector(".shroom-mp-volume-view")),o(this,Tt,this.root.querySelector("[data-role=play]")),o(this,Is,this.root.querySelector("[data-role=prev]")),o(this,Bs,this.root.querySelector("[data-role=next]")),o(this,Vs,this.root.querySelector("[data-role=power]")),o(this,es,this.root.querySelector("[data-role=volume]")),o(this,rt,this.root.querySelector(".shroom-slider-input")),o(this,Et,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:speaker"),"card-icon"),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:power","power-icon"),this.renderIcon("mdi:volume-high","vol-icon"),e&&(t(this,Tt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,Is)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Bs)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),t(this,Vs)?.addEventListener("click",()=>{const m=t(this,gt)==="playing"||t(this,gt)==="paused";this.config.card?.sendCommand(m?"turn_off":"turn_on",{})}),t(this,es)?.addEventListener("click",()=>{o(this,ee,!0),d(this,se,ho).call(this)}),this.root.querySelector(".shroom-mp-back-btn")?.addEventListener("click",()=>{o(this,ee,!1),d(this,se,ho).call(this)}),this.root.querySelector("[data-role=vol-down]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_down",{})}),this.root.querySelector("[data-role=vol-up]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_up",{})})),t(this,rt)&&t(this,rt).addEventListener("input",()=>{o(this,K,parseInt(t(this,rt).value,10)),t(this,Et)&&(t(this,Et).style.left=`${t(this,K)}%`),t(this,Ds).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){o(this,gt,e),o(this,bt,s);const i=e==="playing",n=i||e==="paused";A(t(this,qs),"media_player",n),t(this,ts)&&(t(this,ts).hidden=!n);const h=s.media_title??"",c=s.media_artist??"";if(t(this,Xe)&&(t(this,Xe).textContent=n&&h?h:this.def.friendly_name),t(this,te))if(n){const p=t(this,K)>0?`${t(this,K)}%`:"",m=[c,p].filter(Boolean);t(this,te).textContent=m.join(" - ")||S(e)}else t(this,te).textContent=S(e);if(t(this,Tt)){const p=i?"mdi:pause":"mdi:play";this.renderIcon(p,"play-icon");const m=i?"Pause":"Play";t(this,Tt).title=m,t(this,Tt).setAttribute("aria-label",m)}if(s.volume_level!==void 0&&(o(this,K,Math.round(s.volume_level*100)),t(this,rt)&&!this.isFocused(t(this,rt))&&(t(this,rt).value=String(t(this,K))),t(this,Et)&&(t(this,Et).style.left=`${t(this,K)}%`)),o(this,Os,!!s.is_volume_muted),t(this,es)){const p=t(this,Os)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(p,"vol-icon")}this.announceState(`${this.def.friendly_name}, ${e}${h?` - ${h}`:""}`)}predictState(e,s){return e==="media_play_pause"?{state:t(this,gt)==="playing"?"paused":"playing",attributes:t(this,bt)}:e==="volume_mute"?{state:t(this,gt),attributes:{...t(this,bt),is_volume_muted:!!s.is_volume_muted}}:e==="volume_set"?{state:t(this,gt),attributes:{...t(this,bt),volume_level:s.volume_level}}:e==="turn_off"?{state:"off",attributes:t(this,bt)}:e==="turn_on"?{state:"idle",attributes:t(this,bt)}:null}}qs=new WeakMap,Xe=new WeakMap,te=new WeakMap,Je=new WeakMap,Qe=new WeakMap,ts=new WeakMap,Tt=new WeakMap,Is=new WeakMap,Bs=new WeakMap,Vs=new WeakMap,es=new WeakMap,rt=new WeakMap,Et=new WeakMap,Os=new WeakMap,ee=new WeakMap,K=new WeakMap,gt=new WeakMap,bt=new WeakMap,Ds=new WeakMap,se=new WeakSet,ho=function(){t(this,Je)&&(t(this,Je).hidden=t(this,ee)),t(this,Qe)&&(t(this,Qe).hidden=!t(this,ee))},Vo=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,K)/100})};const go={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},fi=go.cloudy,vi="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z",gi="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",bi="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",yi=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Ks(a,l){const e=go[a]??fi;return`<svg viewBox="0 0 24 24" width="${l}" height="${l}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Xs(a){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${a}" fill="currentColor"/></svg>`}const xi=`
    ${E}
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
  `;class _i extends v{constructor(){super(...arguments);r(this,$);r(this,Ns,null);r(this,ss,null);r(this,os,null);r(this,oe,null);r(this,is,null);r(this,rs,null);r(this,ns,null);r(this,qt,null);r(this,nt,null);r(this,ie,null);r(this,re,null)}render(){T(this),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${xi}</style>
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
              <span class="shroom-weather-icon">${Ks("cloudy",36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${Xs(vi)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${Xs(gi)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${Xs(bi)}
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
      `,o(this,Ns,this.root.querySelector(".shroom-icon-shape")),o(this,ss,this.root.querySelector(".shroom-secondary")),o(this,os,this.root.querySelector(".shroom-weather-icon")),o(this,oe,this.root.querySelector(".shroom-weather-temp")),o(this,is,this.root.querySelector("[data-stat=humidity] [data-value]")),o(this,rs,this.root.querySelector("[data-stat=wind] [data-value]")),o(this,ns,this.root.querySelector("[data-stat=pressure] [data-value]")),o(this,qt,this.root.querySelector(".shroom-forecast-strip")),o(this,nt,this.root.querySelector(".shroom-forecast-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:weather-cloudy"),"card-icon"),A(t(this,Ns),"weather",!0),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),H(this.root)}applyState(e,s){const i=e||"cloudy";t(this,os)&&(t(this,os).innerHTML=Ks(i,36));const n=this.i18n.t(`weather.${i}`)!==`weather.${i}`?this.i18n.t(`weather.${i}`):i.replace(/-/g," ");t(this,ss)&&(t(this,ss).textContent=S(n));const h=s.temperature??s.native_temperature,c=s.temperature_unit??"";if(t(this,oe)){const m=t(this,oe).querySelector(".shroom-weather-unit");t(this,oe).firstChild.textContent=h!=null?Math.round(Number(h)):"--",m&&(m.textContent=c?` ${c}`:"")}if(t(this,is)){const m=s.humidity;t(this,is).textContent=m!=null?`${m}%`:"--"}if(t(this,rs)){const m=s.wind_speed,g=s.wind_speed_unit??"";t(this,rs).textContent=m!=null?`${m} ${g}`.trim():"--"}if(t(this,ns)){const m=s.pressure,g=s.pressure_unit??"";t(this,ns).textContent=m!=null?`${m} ${g}`.trim():"--"}const p=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;o(this,ie,p?s.forecast_daily??s.forecast??null:null),o(this,re,p?s.forecast_hourly??null:null),d(this,$,lo).call(this),d(this,$,co).call(this),this.announceState(`${this.def.friendly_name}, ${n}, ${h??"--"} ${c}`)}}Ns=new WeakMap,ss=new WeakMap,os=new WeakMap,oe=new WeakMap,is=new WeakMap,rs=new WeakMap,ns=new WeakMap,qt=new WeakMap,nt=new WeakMap,$=new WeakSet,ne=function(){return this.config._forecastMode??"daily"},Ws=function(e){this.config._forecastMode=e},ie=new WeakMap,re=new WeakMap,lo=function(){if(!t(this,nt))return;const e=Array.isArray(t(this,ie))&&t(this,ie).length>0,s=Array.isArray(t(this,re))&&t(this,re).length>0;if(!e&&!s){t(this,nt).textContent="";return}e&&!s&&o(this,$,"daily",Ws),!e&&s&&o(this,$,"hourly",Ws),e&&s?(t(this,nt).textContent=t(this,$,ne)==="daily"?"Hourly":"5-Day",t(this,nt).onclick=()=>{o(this,$,t(this,$,ne)==="daily"?"hourly":"daily",Ws),d(this,$,lo).call(this),d(this,$,co).call(this)}):(t(this,nt).textContent="",t(this,nt).onclick=null)},co=function(){if(!t(this,qt))return;const e=t(this,$,ne)==="hourly"?t(this,re):t(this,ie);if(t(this,qt).setAttribute("data-mode",t(this,$,ne)),!Array.isArray(e)||e.length===0){t(this,qt).innerHTML="";return}const s=t(this,$,ne)==="daily"?e.slice(0,5):e;t(this,qt).innerHTML=s.map(i=>{const n=new Date(i.datetime);let h;t(this,$,ne)==="hourly"?h=n.toLocaleTimeString([],{hour:"numeric"}):h=yi[n.getDay()]??"";const c=(i.temperature??i.native_temperature)!=null?Math.round(i.temperature??i.native_temperature):"--",p=(i.templow??i.native_templow)!=null?Math.round(i.templow??i.native_templow):null;return`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${u(String(h))}</span>
            ${Ks(i.condition||"cloudy",18)}
            <span class="shroom-forecast-temps">
              ${u(String(c))}${p!=null?`/<span class="shroom-forecast-lo">${u(String(p))}</span>`:""}
            </span>
          </div>`}).join("")};const bo={auto:"var(--hrv-color-primary)",red:"#ef4444",orange:"#f97316",amber:"#f59e0b",yellow:"#eab308",green:"#22c55e",teal:"#14b8a6",cyan:"#06b6d4",blue:"#3b82f6",indigo:"#6366f1",purple:"#a855f7",pink:"#ec4899",grey:"#9ca3af"},Ci=new Set(["off","unavailable","unknown","idle","closed","standby","not_home","locked","jammed","locking","unlocking"]),yo={light:"mdi:lightbulb",switch:"mdi:toggle-switch",input_boolean:"mdi:toggle-switch",fan:"mdi:fan",sensor:"mdi:gauge",binary_sensor:"mdi:radiobox-blank",climate:"mdi:thermostat",media_player:"mdi:cast",cover:"mdi:window-shutter",timer:"mdi:timer",remote:"mdi:remote",input_number:"mdi:numeric",input_select:"mdi:format-list-bulleted",harvest_action:"mdi:play-circle-outline"},wi=`
    :host {
      min-width: unset !important;
      display: inline-block !important;
      contain: none !important;
    }
    [part=badge] {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px 4px 10px;
      border-radius: 999px;
      background: var(--hrv-card-background, var(--hrv-color-surface, #fff));
      box-shadow: var(--hrv-card-shadow, 0 1px 3px rgba(0,0,0,0.1));
      border: none;
      font-family: var(--hrv-font-family, system-ui, -apple-system, sans-serif);
      font-size: var(--hrv-font-size-s, 13px);
      color: var(--hrv-color-text, #111827);
      height: 36px;
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
    [part=badge-name] {
      font-weight: var(--hrv-font-weight-medium, 500);
      overflow: hidden; text-overflow: ellipsis; max-width: 120px;
    }
    [part=badge-state] {
      color: var(--hrv-color-text-secondary, #6b7280);
      font-size: var(--hrv-font-size-xs, 11px);
    }
    [part=badge-dot] { color: var(--hrv-color-border, #e5e7eb); font-size: 8px; line-height: 1; }
    .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
    @media (prefers-reduced-motion: reduce) {
      [part=badge], [part=badge-icon] { transition: none; }
    }
  `;class Si extends v{constructor(){super(...arguments);r(this,as,null);r(this,hs,null);r(this,ls,null)}render(){const e=this.def.display_hints??{},s=e.badge_show_icon!==!1,i=e.badge_show_name!==!1,n=e.badge_show_state!==!1,h=i?"":" sr-only",c=n?"":" sr-only";if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${wi}</style>
        <div part="badge" aria-label="${u(this.def.friendly_name)}" title="${u(this.def.friendly_name)}">
          ${s?'<span part="badge-icon" aria-hidden="true"></span>':""}
          <span part="badge-name" class="${h}">${u(this.def.friendly_name)}</span>
          ${i&&n?'<span part="badge-dot" aria-hidden="true">&middot;</span>':""}
          <span part="badge-state" class="${c}" aria-live="polite"></span>
        </div>
        ${this.renderAriaLiveHTML()}
      `,o(this,as,this.root.querySelector("[part=badge-icon]")),o(this,hs,this.root.querySelector("[part=badge-state]")),o(this,ls,this.root.querySelector("[part=badge]")),s){const p=yo[this.def.domain]??"mdi:help-circle";this.renderIcon(this.resolveIcon(this.def.icon,p),"badge-icon")}}applyState(e,s){const n=(this.def.display_hints??{}).badge_icon_color??"auto",h=!Ci.has(e);if(t(this,as)){t(this,as).style.color=h?bo[n]??bo.auto:"#9ca3af";const z=yo[this.def.domain]??"mdi:help-circle",Rs=this.def.icon_state_map?.[e]??this.def.icon??z;this.renderIcon(this.resolveIcon(Rs,z),"badge-icon")}const c=s?.unit_of_measurement??this.def.unit_of_measurement??"",p=`${this.def.domain}.${e}`,m=this.i18n.t(p),g=`state.${e}`,w=this.i18n.t(g),k=c?`${e} ${c}`:m!==p?m:w!==g?w:e;t(this,hs)&&(t(this,hs).textContent=k),t(this,ls)&&(t(this,ls).title=`${this.def.friendly_name}: ${k}`),this.announceState(`${this.def.friendly_name}, ${e}`)}}as=new WeakMap,hs=new WeakMap,ls=new WeakMap;const $i=window.__HARVEST_PACK_ID__||"shrooms";y._packs=y._packs||{},y._packs[$i]={light:Zo,switch:fo,input_boolean:fo,sensor:Ps,"sensor.temperature":Ps,"sensor.humidity":Ps,"sensor.battery":Ps,fan:Wo,binary_sensor:Ko,generic:Jo,harvest_action:ti,input_number:si,input_select:ii,cover:ni,remote:hi,timer:di,climate:pi,media_player:ui,weather:_i,badge:Si,_capabilities:{fan:{display_modes:["on-off","continuous","stepped","cycle"]},input_number:{display_modes:["slider","buttons"]},light:{features:["brightness","color_temp","rgb"]},climate:{features:["hvac_modes","presets","fan_mode","swing_mode"]},cover:{features:["position","tilt"]},media_player:{features:["transport","volume","source"]}}}})();})();
