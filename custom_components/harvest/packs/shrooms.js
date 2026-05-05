(()=>{var wo=(S,b,f)=>{if(!b.has(S))throw TypeError("Cannot "+f)};var t=(S,b,f)=>(wo(S,b,"read from private field"),f?f.call(S):b.get(S)),o=(S,b,f)=>{if(b.has(S))throw TypeError("Cannot add the same private member more than once");b instanceof WeakSet?b.add(S):b.set(S,f)},i=(S,b,f,u)=>(wo(S,b,"write to private field"),u?u.call(S,f):b.set(S,f),f);var d=(S,b,f)=>(wo(S,b,"access private method"),f);(function(){"use strict";var ds,oe,mt,ut,Mt,H,cs,ft,kt,Ht,z,Tt,Et,E,q,vt,ie,qt,ps,ms,So,us,$o,Qs,Fo,Y,It,re,st,Bt,Z,ne,gt,bt,yt,I,y,Vt,xt,_t,P,fs,ae,vo,to,Go,vs,Lo,gs,Ao,bs,Mo,he,go,eo,Yo,ys,le,xs,de,D,W,Ot,ce,pe,_s,me,j,ue,U,ot,fe,Cs,ws,so,Wo,Ss,ko,oo,Uo,$s,ve,T,$,ge,it,K,io,Ko,Ct,as,Ls,be,X,ye,xe,_e,Dt,Nt,zt,rt,J,As,Ms,ks,ro,Xo,Hs,Ho,no,Jo,Ce,we,Se,$e,N,wt,Zt,Pt,jt,Le,Ae,R,Me,ao,Qo,ho,ti,lo,ei,Rt,Ks,Ts,ke,He,Te,Ee,qe,Ie,Be,Ve,Oe,De,nt,Ne,ze,at,Ze,Ft,ht,lt,Pe,F,je,Re,Fe,Es,qs,Is,Ge,St,Gt,Yt,Wt,Bs,Vs,co,si,Os,To,Ds,Eo,po,oi,mo,ii,Ye,bo,uo,ri,Ns,We,Ut,Ue,Ke,Xe,$t,zs,Zs,Ps,Je,Q,Lt,js,Kt,G,dt,ct,Rs,Fs,qo,fo,ni,Gs,Qe,ts,Xt,es,ss,os,At,tt,B,te,yo,Jt,Qt,Ys,Io,Ws,Bo,is,rs,ns;console.info("[HArvest Shrooms] Loading pack v"+"1.0.0");const b=window.HArvest;if(!b||!b.renderers||!b.renderers.BaseCard){console.warn("[HArvest Shrooms] HArvest not found - pack not loaded.");return}const f=b.renderers.BaseCard;function u(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ee(a,l){let e=null;return function(...s){e&&clearTimeout(e),e=setTimeout(()=>{e=null,a.apply(this,s)},l)}}function C(a){return a?a.charAt(0).toUpperCase()+a.slice(1).replace(/_/g," "):""}function Xi(a,l,e){return Math.min(e,Math.max(l,a))}function Vo(a,l){const e=a.querySelector(".shroom-controls-shell");e&&e.setAttribute("data-collapsed",String(l))}function se(a,l){a&&(a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-label",l),a.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),a.click())}))}function L(a){a.querySelectorAll("[part=companion]").forEach(l=>{l.title=l.getAttribute("aria-label")??"Companion"})}const ai={light:"var(--hrv-ex-shroom-light, #ff9800)",switch:"var(--hrv-ex-shroom-switch, #2196f3)",input_boolean:"var(--hrv-ex-shroom-switch, #2196f3)",fan:"var(--hrv-ex-shroom-fan, #4caf50)",climate:"var(--hrv-ex-shroom-climate, #ff5722)",cover:"var(--hrv-ex-shroom-cover, #9c27b0)",media_player:"var(--hrv-ex-shroom-media, #e91e63)",sensor:"var(--hrv-ex-shroom-sensor, #03a9f4)",binary_sensor:"var(--hrv-ex-shroom-binary, #8bc34a)",input_number:"var(--hrv-ex-shroom-input, #00bcd4)",input_select:"var(--hrv-ex-shroom-input, #00bcd4)",timer:"var(--hrv-ex-shroom-timer, #673ab7)",remote:"var(--hrv-ex-shroom-remote, #607d8b)",weather:"var(--hrv-ex-shroom-weather, #ff9800)",harvest_action:"var(--hrv-ex-shroom-action, #9c27b0)"};function Oo(a){return ai[a]??"var(--hrv-color-primary, #ff9800)"}function w(a,l,e){if(!a)return;const s=Oo(l);e?(a.style.background=`color-mix(in srgb, ${s} 20%, transparent)`,a.style.color=s):(a.style.background="var(--hrv-ex-shroom-btn-bg, rgba(0,0,0,0.05))",a.style.color="var(--hrv-color-icon, #757575)")}function A(a){const l=(a.config.displayHints??a.def.display_hints??{}).layout??null,e=a.root.host;e&&(l==="vertical"?e.setAttribute("data-layout","vertical"):e.removeAttribute("data-layout"))}function Do(a,l){if(a!=="on")return null;if(l.rgb_color){const[s,r,n]=l.rgb_color;return(.299*s+.587*r+.114*n)/255>.85?`rgb(${Math.round(s*.8)}, ${Math.round(r*.8)}, ${Math.round(n*.75)})`:`rgb(${s}, ${r}, ${n})`}if(l.hs_color)return`hsl(${l.hs_color[0]}, ${Math.max(l.hs_color[1],50)}%, 55%)`;const e=l.color_temp_kelvin??(l.color_temp?Math.round(1e6/l.color_temp):null);return e?e>=5200?"#4ba3e0":e>=4500?"#e0c85a":e<=3e3?"#e6a040":"#ddb840":null}const M=`
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
  `,xo=`
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
  `,hs=`
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
  `,pt=`
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
  `,k=`
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
  `,hi=`
    ${M}
    ${k}
  `;class No extends f{constructor(){super(...arguments);o(this,ds,null);o(this,oe,null);o(this,mt,!1)}render(){A(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${hi}</style>
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
      `,i(this,ds,this.root.querySelector(".shroom-icon-shape")),i(this,oe,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline"),"card-icon");const s=this.root.querySelector(".shroom-state-item");e&&(se(s,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand("toggle",{})}})),this.renderCompanions(),L(this.root)}applyState(e,s){i(this,mt,e==="on");const r=this.def.domain??"switch";w(t(this,ds),r,t(this,mt)),t(this,oe)&&(t(this,oe).textContent=C(e));const n=this.root.querySelector(".shroom-state-item");n?.hasAttribute("role")&&n.setAttribute("aria-pressed",String(t(this,mt)));const h=t(this,mt)?this.resolveIcon(this.def.icon,"mdi:toggle-switch"):this.resolveIcon(this.def.icon,"mdi:toggle-switch-off-outline");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="toggle"||e==="turn_on"||e==="turn_off"?{state:e==="toggle"?t(this,mt)?"off":"on":e==="turn_on"?"on":"off",attributes:{}}:null}}ds=new WeakMap,oe=new WeakMap,mt=new WeakMap;const ls=["brightness","temp","color"],li={brightness:"mdi:brightness-4",temp:"mdi:thermometer",color:"mdi:palette"},di=`
    ${M}
    ${xo}
    ${hs}
    ${pt}
    ${k}

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
  `;class ci extends f{constructor(e,s,r,n){super(e,s,r,n);o(this,ms);o(this,us);o(this,Qs);o(this,ut,null);o(this,Mt,null);o(this,H,null);o(this,cs,null);o(this,ft,null);o(this,kt,null);o(this,Ht,[]);o(this,z,0);o(this,Tt,4e3);o(this,Et,0);o(this,E,!1);o(this,q,0);o(this,vt,2e3);o(this,ie,6500);o(this,qt,{});o(this,ps,void 0);i(this,ps,ee(d(this,Qs,Fo).bind(this),300))}render(){A(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??{},n=r.show_brightness!==!1&&s.includes("brightness"),h=r.show_color_temp!==!1&&s.includes("color_temp"),c=r.show_rgb!==!1&&s.includes("rgb_color"),m=e&&(n||h||c),p=[n,h,c].filter(Boolean).length;i(this,vt,this.def.feature_config?.min_color_temp_kelvin??2e3),i(this,ie,this.def.feature_config?.max_color_temp_kelvin??6500);const g=[n,h,c];g[t(this,q)]||(i(this,q,g.findIndex(Boolean)),t(this,q)===-1&&i(this,q,0)),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${di}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
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
                    aria-label="${u(this.def.friendly_name)} level"
                    aria-valuetext="0%">
                  <div class="shroom-slider-focus-ring"></div>
                </div>
                ${p>1?`
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
      `,i(this,ut,this.root.querySelector(".shroom-icon-shape")),i(this,Mt,this.root.querySelector(".shroom-secondary")),i(this,H,this.root.querySelector(".shroom-slider-input")),i(this,cs,this.root.querySelector(".shroom-slider-bg")),i(this,ft,this.root.querySelector(".shroom-slider-cover")),i(this,kt,this.root.querySelector(".shroom-slider-edge")),i(this,Ht,[...this.root.querySelectorAll(".shroom-light-mode-btn")]),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon");for(const v of t(this,Ht))this.renderIcon(li[v.dataset.mode]??"mdi:help-circle",`light-mode-${v.dataset.mode}`);const _=this.root.querySelector(".shroom-state-item");e&&(se(_,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(_,{onTap:()=>{const v=this.config.gestureConfig?.tap;if(v){this._runAction(v);return}this.config.card?.sendCommand("toggle",{})}}));for(const v of t(this,Ht))v.addEventListener("click",()=>{const V=v.dataset.mode,et=ls.indexOf(V);et===-1||et===t(this,q)||(i(this,q,et),d(this,ms,So).call(this))});t(this,H)&&t(this,H).addEventListener("input",()=>{const v=parseInt(t(this,H).value,10),V=ls[t(this,q)]??"brightness";V==="brightness"?i(this,z,v):V==="temp"?i(this,Tt,Math.round(t(this,vt)+v/100*(t(this,ie)-t(this,vt)))):i(this,Et,Math.round(v*3.6)),d(this,us,$o).call(this),t(this,ps).call(this,V)}),this.renderCompanions(),L(this.root)}applyState(e,s){i(this,E,e==="on"),i(this,qt,s),Vo(this.root,!t(this,E));const r=Do(e,s);t(this,E)&&r?t(this,ut)&&(t(this,ut).style.background=`color-mix(in srgb, ${r} 20%, transparent)`,t(this,ut).style.color=r):w(t(this,ut),"light",t(this,E)),i(this,z,s.brightness!=null?Math.round(s.brightness/255*100):0),i(this,Tt,s.color_temp_kelvin??(s.color_temp?Math.round(1e6/s.color_temp):4e3)),i(this,Et,s.hs_color?.[0]??42),t(this,Mt)&&(t(this,E)&&s.brightness!=null?t(this,Mt).textContent=`${t(this,z)}%`:t(this,Mt).textContent=C(e));const n=this.root.querySelector(".shroom-light-ro");n&&(n.textContent=t(this,E)&&s.brightness!=null?`${t(this,z)}%`:C(e));const h=this.root.querySelector(".shroom-slider-wrap");if(h){const p=Do("on",s);h.style.setProperty("--shroom-light-accent",p??"var(--hrv-ex-shroom-light, #ff9800)")}d(this,ms,So).call(this);const c=this.root.querySelector(".shroom-state-item");if(c?.hasAttribute("role")&&c.setAttribute("aria-pressed",String(t(this,E))),t(this,H)){const p=ls[t(this,q)]??"brightness",g=parseInt(t(this,H).value,10);p==="brightness"?t(this,H).setAttribute("aria-valuetext",`${g}%`):p==="temp"?t(this,H).setAttribute("aria-valuetext",`${g}K`):t(this,H).setAttribute("aria-valuetext",`${g}`)}const m=t(this,E)?this.resolveIcon(this.def.icon,"mdi:lightbulb"):this.resolveIcon(this.def.icon,"mdi:lightbulb-off");this.renderIcon(m,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}${t(this,E)?`, ${t(this,z)}%`:""}`)}predictState(e,s){if(e==="toggle")return{state:t(this,E)?"off":"on",attributes:t(this,qt)};if(e==="turn_on"){const r={...t(this,qt)};return s.brightness!=null&&(r.brightness=s.brightness),s.color_temp_kelvin!=null&&(r.color_temp_kelvin=s.color_temp_kelvin),s.hs_color!=null&&(r.hs_color=s.hs_color),{state:"on",attributes:r}}return e==="turn_off"?{state:"off",attributes:t(this,qt)}:null}}ut=new WeakMap,Mt=new WeakMap,H=new WeakMap,cs=new WeakMap,ft=new WeakMap,kt=new WeakMap,Ht=new WeakMap,z=new WeakMap,Tt=new WeakMap,Et=new WeakMap,E=new WeakMap,q=new WeakMap,vt=new WeakMap,ie=new WeakMap,qt=new WeakMap,ps=new WeakMap,ms=new WeakSet,So=function(){const e=ls[t(this,q)]??"brightness",s=t(this,cs);s?.classList.remove("shroom-brightness-bg","shroom-ct-bg","shroom-hue-bg"),e==="brightness"?s?.classList.add("shroom-brightness-bg"):e==="temp"?s?.classList.add("shroom-ct-bg"):s?.classList.add("shroom-hue-bg");for(const r of t(this,Ht))r.hidden=r.dataset.mode===e;d(this,us,$o).call(this)},us=new WeakSet,$o=function(){const e=ls[t(this,q)]??"brightness";let s=0;e==="brightness"?s=t(this,z):e==="temp"?s=Math.round((t(this,Tt)-t(this,vt))/(t(this,ie)-t(this,vt))*100):s=Math.round(t(this,Et)/3.6);const r=e==="brightness";t(this,ft)&&(r?(t(this,ft).style.display="",t(this,ft).style.left=`${s}%`):t(this,ft).style.display="none"),t(this,kt)&&(t(this,kt).style.display=r?"none":"",r||(t(this,kt).style.left=`${s}%`)),t(this,H)&&!this.isFocused(t(this,H))&&(t(this,H).value=String(s))},Qs=new WeakSet,Fo=function(e){e==="brightness"?t(this,z)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:Math.round(t(this,z)*2.55)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,Tt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,Et),100]})};const pi={temperature:"var(--hrv-ex-shroom-climate, #ff5722)",humidity:"var(--hrv-ex-shroom-sensor, #03a9f4)",battery:"var(--hrv-ex-shroom-fan, #4caf50)"},mi={temperature:"mdi:thermometer",humidity:"mdi:water-percent",battery:"mdi:battery"};function ui(a){return a==null||isNaN(a)||a>=90?"mdi:battery":a>=70?"mdi:battery-70":a>=50?"mdi:battery-50":a>=30?"mdi:battery-30":a>=10?"mdi:battery-10":"mdi:battery-alert"}function fi(a){return a==null||isNaN(a)?"var(--hrv-ex-shroom-fan, #4caf50)":a<=10?"var(--hrv-color-error, #f44336)":a<=20?"var(--hrv-color-warning, #ff9800)":"var(--hrv-ex-shroom-fan, #4caf50)"}const vi=`
    ${M}
    ${k}
  `;class Xs extends f{constructor(){super(...arguments);o(this,Y,null);o(this,It,null);o(this,re,null)}render(){A(this),i(this,re,this.def.device_class??null);const e=mi[t(this,re)]??"mdi:gauge";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${vi}</style>
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
      `,i(this,Y,this.root.querySelector(".shroom-icon-shape")),i(this,It,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,e),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){const r=parseFloat(e),n=this.def.unit_of_measurement??"",h=!isNaN(r),c=t(this,re);if(t(this,It))if(h){const m=s.suggested_display_precision,p=m!=null?r.toFixed(m):String(Math.round(r*10)/10);t(this,It).textContent=n?`${p} ${n}`:p}else t(this,It).textContent=C(e);if(c==="battery"&&h){const m=fi(r);t(this,Y)&&(t(this,Y).style.background=`color-mix(in srgb, ${m} 20%, transparent)`,t(this,Y).style.color=m),this.renderIcon(this.resolveIcon(this.def.icon,ui(r)),"card-icon")}else{const m=pi[c]??Oo("sensor");t(this,Y)&&(t(this,Y).style.background=`color-mix(in srgb, ${m} 20%, transparent)`,t(this,Y).style.color=m)}this.announceState(`${this.def.friendly_name}, ${h?r:e} ${n}`)}}Y=new WeakMap,It=new WeakMap,re=new WeakMap;const gi=`
    ${M}
    ${xo}
    ${hs}
    ${pt}
    ${k}

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
  `;class bi extends f{constructor(e,s,r,n){super(e,s,r,n);o(this,ae);o(this,to);o(this,vs);o(this,gs);o(this,bs);o(this,he);o(this,eo);o(this,st,null);o(this,Bt,null);o(this,Z,null);o(this,ne,null);o(this,gt,null);o(this,bt,null);o(this,yt,null);o(this,I,!1);o(this,y,0);o(this,Vt,!1);o(this,xt,"forward");o(this,_t,null);o(this,P,[]);o(this,fs,void 0);i(this,fs,ee(d(this,eo,Yo).bind(this),300)),i(this,P,e.feature_config?.preset_modes??[])}render(){A(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},n=r.display_mode??null;let h=s.includes("set_speed");const c=r.show_oscillate!==!1&&s.includes("oscillate"),m=r.show_direction!==!1&&s.includes("direction"),p=r.show_presets!==!1&&s.includes("preset_mode");n==="on-off"&&(h=!1);let g=e&&h,_=g&&t(this,to,Go),v=!1,V=!1;n==="continuous"?_=!1:n==="stepped"?V=_:n==="cycle"?(_=!0,v=!0):_&&t(this,P).length?v=!0:_&&(V=!0);const et=e&&(c||m||p);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${gi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${g||et?`
            <div class="shroom-controls-shell" data-collapsed="true">
              <div class="shroom-fan-controls">
                ${g&&!_?`
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
                ${g&&V?`
                  <div class="shroom-fan-step-dots">
                    ${t(this,vs,Lo).map((x,O)=>`
                      <button class="shroom-fan-step-dot" data-pct="${x}" type="button"
                        data-active="false"
                        aria-label="Speed ${O+1} (${x}%)"
                        title="Speed ${O+1} (${x}%)">${O+1}</button>
                    `).join("")}
                  </div>
                `:""}
                ${g&&v?`
                  <div style="display:flex;justify-content:center;">
                    <button class="shroom-fan-cycle-btn" type="button"
                      title="Cycle speed"
                      aria-label="Cycle fan speed">
                      <svg viewBox="0 0 24 24"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg>
                    </button>
                  </div>
                `:""}
                ${et?`
                  <div class="shroom-fan-feat-row">
                    ${c?'<button class="shroom-btn shroom-fan-feat" data-feat="oscillate" type="button" aria-label="Oscillate" aria-pressed="false">Oscillate</button>':""}
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
      `,i(this,st,this.root.querySelector(".shroom-icon-shape")),i(this,Bt,this.root.querySelector(".shroom-secondary")),i(this,Z,this.root.querySelector(".shroom-slider-input")),i(this,ne,this.root.querySelector(".shroom-slider-cover")),i(this,gt,this.root.querySelector('[data-feat="oscillate"]')),i(this,bt,this.root.querySelector('[data-feat="direction"]')),i(this,yt,this.root.querySelector('[data-feat="preset"]')),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"card-icon");const Ro=this.root.querySelector(".shroom-state-item");e&&(se(Ro,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(Ro,{onTap:()=>{const x=this.config.gestureConfig?.tap;if(x){this._runAction(x);return}this.config.card?.sendCommand("toggle",{})}})),t(this,Z)&&t(this,Z).addEventListener("input",()=>{const x=parseInt(t(this,Z).value,10);i(this,y,x),t(this,Z).setAttribute("aria-valuetext",`${x}%`),d(this,gs,Ao).call(this),t(this,fs).call(this)}),this.root.querySelectorAll(".shroom-fan-step-dot").forEach(x=>{x.addEventListener("click",()=>{const O=Number(x.getAttribute("data-pct"));i(this,y,O),i(this,I,!0),d(this,bs,Mo).call(this),this.config.card?.sendCommand("set_percentage",{percentage:O})})}),this.root.querySelector(".shroom-fan-cycle-btn")?.addEventListener("click",()=>{const x=t(this,vs,Lo);if(!x.length)return;let O;if(!t(this,I)||t(this,y)===0)O=x[0];else{const Us=x.findIndex(Ki=>Ki>t(this,y));O=Us===-1?x[0]:x[Us]}i(this,y,O),i(this,I,!0),this.config.card?.sendCommand("set_percentage",{percentage:O})}),t(this,gt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,Vt)})}),t(this,bt)?.addEventListener("click",()=>{const x=t(this,xt)==="forward"?"reverse":"forward";i(this,xt,x),d(this,he,go).call(this),this.config.card?.sendCommand("set_direction",{direction:x})}),t(this,yt)?.addEventListener("click",()=>{if(!t(this,P).length)return;const O=((t(this,_t)?t(this,P).indexOf(t(this,_t)):-1)+1)%t(this,P).length,Us=t(this,P)[O];i(this,_t,Us),d(this,he,go).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:Us})}),this.renderCompanions(),L(this.root)}applyState(e,s){if(i(this,I,e==="on"),i(this,y,s?.percentage??0),i(this,Vt,s?.oscillating??!1),i(this,xt,s?.direction??"forward"),i(this,_t,s?.preset_mode??null),s?.preset_modes?.length&&i(this,P,s.preset_modes),Vo(this.root,!t(this,I)),w(t(this,st),"fan",t(this,I)),t(this,st))if(t(this,I)&&t(this,y)>0&&this.config.animate!==!1){const n=1/(1.5*Math.pow(t(this,y)/100,.5));t(this,st).setAttribute("data-spinning","true"),t(this,st).style.setProperty("--shroom-fan-duration",`${n.toFixed(2)}s`)}else t(this,st).setAttribute("data-spinning","false");t(this,Bt)&&(t(this,I)&&t(this,y)>0?t(this,Bt).textContent=`${t(this,y)}%`:t(this,Bt).textContent=C(e)),d(this,gs,Ao).call(this),d(this,bs,Mo).call(this),d(this,he,go).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,y)>0?`, ${t(this,y)}%`:""))}predictState(e,s){return e==="toggle"?{state:t(this,I)?"off":"on",attributes:{percentage:t(this,y)}}:e==="set_percentage"?{state:"on",attributes:{percentage:s.percentage,oscillating:t(this,Vt),direction:t(this,xt),preset_mode:t(this,_t),preset_modes:t(this,P)}}:e==="oscillate"?{state:"on",attributes:{percentage:t(this,y),oscillating:s.oscillating,direction:t(this,xt)}}:e==="set_direction"?{state:"on",attributes:{percentage:t(this,y),oscillating:t(this,Vt),direction:s.direction}}:null}}st=new WeakMap,Bt=new WeakMap,Z=new WeakMap,ne=new WeakMap,gt=new WeakMap,bt=new WeakMap,yt=new WeakMap,I=new WeakMap,y=new WeakMap,Vt=new WeakMap,xt=new WeakMap,_t=new WeakMap,P=new WeakMap,fs=new WeakMap,ae=new WeakSet,vo=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},to=new WeakSet,Go=function(){return t(this,ae,vo)>1},vs=new WeakSet,Lo=function(){const e=t(this,ae,vo),s=[];for(let r=1;r*e<=100.001;r++)s.push(Math.floor(r*e*10)/10);return s},gs=new WeakSet,Ao=function(){if(!t(this,Z))return;const e=t(this,y);this.isFocused(t(this,Z))||(t(this,Z).value=String(e)),t(this,ne)&&(t(this,ne).style.left=`${e}%`)},bs=new WeakSet,Mo=function(){const e=t(this,ae,vo)/2;this.root.querySelectorAll(".shroom-fan-step-dot").forEach(s=>{const r=Number(s.getAttribute("data-pct"));s.setAttribute("data-active",String(t(this,I)&&t(this,y)>=r-e))})},he=new WeakSet,go=function(){t(this,gt)&&(t(this,gt).setAttribute("aria-pressed","false"),t(this,gt).textContent="Oscillate"),t(this,bt)&&(t(this,bt).textContent="Direction",t(this,bt).setAttribute("aria-label","Direction")),t(this,yt)&&(t(this,yt).textContent="Preset",t(this,yt).setAttribute("data-active","false"))},eo=new WeakSet,Yo=function(){t(this,y)<=0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,y)})};const yi=`
    ${M}
    ${k}
  `;class xi extends f{constructor(){super(...arguments);o(this,ys,null);o(this,le,null)}render(){A(this),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${yi}</style>
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
      `,i(this,ys,this.root.querySelector(".shroom-icon-shape")),i(this,le,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.def.icon_state_map?.off??this.resolveIcon(this.def.icon,"mdi:radiobox-blank"),"card-icon"),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){const r=e==="on";w(t(this,ys),"binary_sensor",r);const n=this.formatStateLabel(e);t(this,le)&&(t(this,le).textContent=n);const h=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,r?"mdi:radiobox-marked":"mdi:radiobox-blank");this.renderIcon(h,"card-icon"),this.announceState(`${this.def.friendly_name}, ${n}`)}}ys=new WeakMap,le=new WeakMap;const _i=`
    ${M}
    ${k}

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
  `;class Ci extends f{constructor(){super(...arguments);o(this,xs,null);o(this,de,null);o(this,D,null);o(this,W,!1);o(this,Ot,!1)}render(){A(this);const e=this.def.capabilities==="read-write";i(this,Ot,!1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${_i}</style>
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
      `,i(this,xs,this.root.querySelector(".shroom-icon-shape")),i(this,de,this.root.querySelector(".shroom-secondary")),i(this,D,this.root.querySelector(".shroom-generic-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:help-circle"),"card-icon"),t(this,D)&&e&&this._attachGestureHandlers(t(this,D),{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),L(this.root)}applyState(e,s){const r=e==="on"||e==="off";i(this,W,e==="on"),t(this,de)&&(t(this,de).textContent=C(e));const n=this.def.domain??"generic";w(t(this,xs),n,t(this,W)),t(this,D)&&(r&&!t(this,Ot)&&(t(this,D).removeAttribute("hidden"),i(this,Ot,!0)),t(this,Ot)&&(t(this,D).setAttribute("data-on",String(t(this,W))),t(this,D).setAttribute("aria-pressed",String(t(this,W))),t(this,D).textContent=t(this,W)?"On":"Off",t(this,D).title=t(this,W)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e!=="toggle"?null:{state:t(this,W)?"off":"on",attributes:{}}}}xs=new WeakMap,de=new WeakMap,D=new WeakMap,W=new WeakMap,Ot=new WeakMap;const wi=`
    ${M}
    ${k}
  `;class Si extends f{constructor(){super(...arguments);o(this,ce,null);o(this,pe,null)}render(){A(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${wi}</style>
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
      `,i(this,ce,this.root.querySelector(".shroom-icon-shape")),i(this,pe,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.def.icon_state_map?.idle??this.resolveIcon(this.def.icon,"mdi:play"),"card-icon"),w(t(this,ce),"harvest_action",!1);const s=this.root.querySelector(".shroom-state-item");e&&(se(s,`${this.def.friendly_name} - Trigger`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand("trigger",{})}})),this.renderCompanions(),L(this.root)}applyState(e,s){const r=e==="triggered";t(this,pe)&&(t(this,pe).textContent=C(e)),w(t(this,ce),"harvest_action",r);const n=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,"mdi:play");this.renderIcon(n,"card-icon"),this.announceState(`${this.def.friendly_name}, ${C(e)}`)}predictState(e,s){return e!=="trigger"?null:{state:"triggered",attributes:{}}}}ce=new WeakMap,pe=new WeakMap;const $i=`
    ${M}
    ${xo}
    ${hs}
    ${pt}
    ${k}

    .shroom-num-slider-bg {
      background: var(--hrv-ex-shroom-input, #00bcd4);
    }
  `;class Li extends f{constructor(e,s,r,n){super(e,s,r,n);o(this,so);o(this,Ss);o(this,oo);o(this,_s,null);o(this,me,null);o(this,j,null);o(this,ue,null);o(this,U,0);o(this,ot,0);o(this,fe,100);o(this,Cs,1);o(this,ws,void 0);i(this,ws,ee(d(this,oo,Uo).bind(this),300))}render(){A(this);const e=this.def.capabilities==="read-write";if(i(this,ot,this.def.feature_config?.min??0),i(this,fe,this.def.feature_config?.max??100),i(this,Cs,this.def.feature_config?.step??1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${$i}</style>
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
                  min="${t(this,ot)}" max="${t(this,fe)}" step="${t(this,Cs)}" value="${t(this,ot)}"
                  aria-label="${u(this.def.friendly_name)} value"
                  aria-valuetext="${t(this,ot)}${this.def.unit_of_measurement?` ${u(this.def.unit_of_measurement)}`:""}">
                <div class="shroom-slider-focus-ring"></div>
              </div>
            </div>
          `:""}
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,i(this,_s,this.root.querySelector(".shroom-icon-shape")),i(this,me,this.root.querySelector(".shroom-secondary")),i(this,j,this.root.querySelector(".shroom-slider-input")),i(this,ue,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:ray-vertex"),"card-icon"),w(t(this,_s),"input_number",!0),t(this,j)){const s=this.def.unit_of_measurement??"";t(this,j).addEventListener("input",()=>{i(this,U,parseFloat(t(this,j).value)),t(this,j).setAttribute("aria-valuetext",`${t(this,U)}${s?` ${s}`:""}`),d(this,Ss,ko).call(this),t(this,ws).call(this)})}this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){const r=parseFloat(e);if(isNaN(r))return;i(this,U,r),d(this,Ss,ko).call(this);const n=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${n?` ${n}`:""}`)}predictState(e,s){return e==="set_value"&&s.value!==void 0?{state:String(s.value),attributes:{}}:null}}_s=new WeakMap,me=new WeakMap,j=new WeakMap,ue=new WeakMap,U=new WeakMap,ot=new WeakMap,fe=new WeakMap,Cs=new WeakMap,ws=new WeakMap,so=new WeakSet,Wo=function(e){const s=t(this,fe)-t(this,ot);return s===0?0:Math.max(0,Math.min(100,(e-t(this,ot))/s*100))},Ss=new WeakSet,ko=function(){const e=d(this,so,Wo).call(this,t(this,U));t(this,ue)&&(t(this,ue).style.left=`${e}%`),t(this,j)&&!this.isFocused(t(this,j))&&(t(this,j).value=String(t(this,U)));const s=this.def.unit_of_measurement??"";t(this,me)&&(t(this,me).textContent=`${t(this,U)}${s?` ${s}`:""}`)},oo=new WeakSet,Uo=function(){this.config.card?.sendCommand("set_value",{value:t(this,U)})};const Ai=`
    ${M}
    ${pt}
    ${k}

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
  `;class Mi extends f{constructor(){super(...arguments);o(this,io);o(this,Ct);o(this,$s,null);o(this,ve,null);o(this,T,null);o(this,$,null);o(this,ge,"");o(this,it,[]);o(this,K,!1)}render(){A(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ai}</style>
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
      `,i(this,$s,this.root.querySelector(".shroom-icon-shape")),i(this,ve,this.root.querySelector(".shroom-secondary")),i(this,T,this.root.querySelector(".shroom-select-current")),i(this,$,this.root.querySelector(".shroom-select-dropdown")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:form-select"),"card-icon"),w(t(this,$s),"input_select",!0),t(this,T)&&e&&(t(this,T).addEventListener("click",()=>{t(this,K)?d(this,Ct,as).call(this):d(this,io,Ko).call(this)}),t(this,T).addEventListener("keydown",s=>{s.key==="Escape"&&t(this,K)&&(d(this,Ct,as).call(this),t(this,T).focus())}),this.root.addEventListener("keydown",s=>{if(t(this,K)){if(s.key==="Escape")d(this,Ct,as).call(this),t(this,T).focus();else if(s.key==="ArrowDown"||s.key==="ArrowUp"){s.preventDefault();const r=[...t(this,$).querySelectorAll("[role=option]")],n=this.root.activeElement;let h=r.indexOf(n);h=s.key==="ArrowDown"?Math.min(h+1,r.length-1):Math.max(h-1,0),r[h]?.focus()}}}),document.addEventListener("click",s=>{t(this,K)&&!this.root.host.contains(s.target)&&d(this,Ct,as).call(this)})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){i(this,ge,e),i(this,it,s?.options??t(this,it)),t(this,ve)&&(t(this,ve).textContent=e);const r=this.root.querySelector(".shroom-select-label");r&&(r.textContent=e),t(this,K)&&t(this,$)?.querySelectorAll(".shroom-select-option").forEach((n,h)=>{const c=String(t(this,it)[h]===e);n.setAttribute("data-active",c),n.setAttribute("aria-selected",c)}),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){return e==="select_option"&&s.option!==void 0?{state:String(s.option),attributes:{}}:null}}$s=new WeakMap,ve=new WeakMap,T=new WeakMap,$=new WeakMap,ge=new WeakMap,it=new WeakMap,K=new WeakMap,io=new WeakSet,Ko=function(){if(!t(this,$)||!t(this,it).length)return;t(this,$).innerHTML=t(this,it).map(c=>`
        <button class="shroom-select-option" type="button" role="option"
          aria-selected="${c===t(this,ge)}"
          data-active="${c===t(this,ge)}">
          ${u(c)}
        </button>
      `).join(""),t(this,$).querySelectorAll(".shroom-select-option").forEach((c,m)=>{c.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:t(this,it)[m]}),d(this,Ct,as).call(this)})});const e=this.root.querySelector(".shroom-select-shell");e&&(e.style.overflow="visible");const s=this.root.querySelector("[part=card]");s&&(s.style.overflow="visible"),t(this,$).removeAttribute("hidden"),t(this,T)&&t(this,T).setAttribute("aria-expanded","true");const r=t(this,T).getBoundingClientRect(),n=window.innerHeight-r.bottom,h=Math.min(t(this,$).scrollHeight,240);n<h+8?(t(this,$).style.bottom="calc(100% + 4px)",t(this,$).style.top="auto"):(t(this,$).style.top="calc(100% + 4px)",t(this,$).style.bottom="auto"),i(this,K,!0)},Ct=new WeakSet,as=function(){t(this,$)?.setAttribute("hidden",""),t(this,T)&&t(this,T).setAttribute("aria-expanded","false");const e=this.root.querySelector(".shroom-select-shell");e&&(e.style.overflow="");const s=this.root.querySelector("[part=card]");s&&(s.style.overflow=""),i(this,K,!1)};const ki=`
    ${M}
    ${hs}
    ${pt}
    ${k}

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
  `;class Hi extends f{constructor(e,s,r,n){super(e,s,r,n);o(this,ro);o(this,Hs);o(this,no);o(this,Ls,null);o(this,be,null);o(this,X,null);o(this,ye,null);o(this,xe,null);o(this,_e,null);o(this,Dt,null);o(this,Nt,null);o(this,zt,null);o(this,rt,0);o(this,J,!1);o(this,As,"closed");o(this,Ms,{});o(this,ks,void 0);i(this,ks,ee(d(this,no,Jo).bind(this),300))}render(){A(this);const e=this.def.capabilities==="read-write",r=(this.config.displayHints??{}).show_position!==!1&&this.def.supported_features?.includes("set_position"),n=!this.def.supported_features||this.def.supported_features.includes("buttons"),h=e&&(r||n);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ki}</style>
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
      `,i(this,Ls,this.root.querySelector(".shroom-icon-shape")),i(this,be,this.root.querySelector(".shroom-secondary")),i(this,X,this.root.querySelector(".shroom-slider-input")),i(this,ye,this.root.querySelector(".shroom-slider-cover")),i(this,xe,this.root.querySelector(".shroom-cover-slider-view")),i(this,_e,this.root.querySelector(".shroom-cover-btn-view")),i(this,Dt,this.root.querySelector("[data-action=open]")),i(this,Nt,this.root.querySelector("[data-action=stop]")),i(this,zt,this.root.querySelector("[data-action=close]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:window-shutter"),"card-icon"),t(this,X)&&t(this,X).addEventListener("input",()=>{i(this,rt,parseInt(t(this,X).value,10)),d(this,Hs,Ho).call(this),t(this,ks).call(this)}),[t(this,Dt),t(this,Nt),t(this,zt)].forEach(m=>{if(!m)return;const p=m.getAttribute("data-action");m.addEventListener("click",()=>{this.config.card?.sendCommand(`${p}_cover`,{})})});const c=this.root.querySelector(".shroom-cover-toggle-btn");c?.addEventListener("click",()=>{i(this,J,!t(this,J)),c.setAttribute("aria-expanded",String(t(this,J))),c.setAttribute("aria-label",t(this,J)?"Show position slider":"Show cover buttons"),d(this,ro,Xo).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){i(this,As,e),i(this,Ms,{...s});const r=e==="open"||e==="opening";if(w(t(this,Ls),"cover",r),t(this,be)){const c=s.current_position,m=C(e);t(this,be).textContent=c!==void 0?`${m} - ${c}%`:m}const n=e==="opening"||e==="closing",h=s.current_position;t(this,Dt)&&(t(this,Dt).disabled=!n&&h===100),t(this,Nt)&&(t(this,Nt).disabled=!n),t(this,zt)&&(t(this,zt).disabled=!n&&e==="closed"),s.current_position!==void 0&&(i(this,rt,s.current_position),t(this,X)&&!this.isFocused(t(this,X))&&(t(this,X).value=String(t(this,rt))),d(this,Hs,Ho).call(this)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,s){const r={...t(this,Ms)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,As),attributes:r}:e==="set_cover_position"&&s.position!==void 0?(r.current_position=s.position,{state:s.position>0?"open":"closed",attributes:r}):null}}Ls=new WeakMap,be=new WeakMap,X=new WeakMap,ye=new WeakMap,xe=new WeakMap,_e=new WeakMap,Dt=new WeakMap,Nt=new WeakMap,zt=new WeakMap,rt=new WeakMap,J=new WeakMap,As=new WeakMap,Ms=new WeakMap,ks=new WeakMap,ro=new WeakSet,Xo=function(){t(this,xe)&&(t(this,xe).hidden=t(this,J)),t(this,_e)&&(t(this,_e).hidden=!t(this,J));const e=this.root.querySelector(".shroom-cover-toggle-btn");e&&(e.innerHTML=t(this,J)?'<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/></svg>')},Hs=new WeakSet,Ho=function(){t(this,ye)&&(t(this,ye).style.left=`${t(this,rt)}%`);const e=this.root.querySelector(".shroom-slider-edge");e&&(e.style.left=`${t(this,rt)}%`)},no=new WeakSet,Jo=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,rt)})};const Ti=`
    ${M}
    ${k}
  `;class Ei extends f{constructor(){super(...arguments);o(this,Ce,null);o(this,we,null)}render(){A(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ti}</style>
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
      `,i(this,Ce,this.root.querySelector(".shroom-icon-shape")),i(this,we,this.root.querySelector(".shroom-secondary")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:remote"),"card-icon"),w(t(this,Ce),"remote",!1);const s=this.root.querySelector(".shroom-state-item");e&&(se(s,`${this.def.friendly_name} - Send command`),this._attachGestureHandlers(s,{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}const n=this.config.tapAction?.data?.command??"power",h=this.config.tapAction?.data?.device??void 0,c=h?{command:n,device:h}:{command:n};this.config.card?.sendCommand("send_command",c)}})),this.renderCompanions(),L(this.root)}applyState(e,s){const r=e==="on";w(t(this,Ce),"remote",r),t(this,we)&&(t(this,we).textContent=C(e));const n=this.def.icon_state_map?.[e]??this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(n,"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ce=new WeakMap,we=new WeakMap;function Js(a){a<0&&(a=0);const l=Math.floor(a/3600),e=Math.floor(a%3600/60),s=Math.floor(a%60),r=n=>String(n).padStart(2,"0");return l>0?`${l}:${r(e)}:${r(s)}`:`${r(e)}:${r(s)}`}function zo(a){if(typeof a=="number")return a;if(typeof a!="string")return 0;const l=a.split(":").map(Number);return l.length===3?l[0]*3600+l[1]*60+l[2]:l.length===2?l[0]*60+l[1]:l[0]||0}const qi=`
    ${M}
    ${pt}
    ${k}

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
  `;class Ii extends f{constructor(){super(...arguments);o(this,ao);o(this,ho);o(this,lo);o(this,Rt);o(this,Se,null);o(this,$e,null);o(this,N,null);o(this,wt,null);o(this,Zt,null);o(this,Pt,null);o(this,jt,null);o(this,Le,"idle");o(this,Ae,{});o(this,R,null);o(this,Me,null)}render(){A(this);const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${qi}</style>
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
      `,i(this,Se,this.root.querySelector(".shroom-icon-shape")),i(this,$e,this.root.querySelector(".shroom-secondary")),i(this,N,this.root.querySelector(".shroom-timer-display")),i(this,wt,this.root.querySelector("[data-action=playpause]")),i(this,Zt,this.root.querySelector("[data-action=cancel]")),i(this,Pt,this.root.querySelector("[data-action=finish]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:timer-outline"),"card-icon"),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),w(t(this,Se),"timer",!1),e&&(t(this,wt)?.addEventListener("click",()=>{const s=t(this,Le)==="active"?"pause":"start";this.config.card?.sendCommand(s,{})}),t(this,Zt)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,Pt)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})})),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){i(this,Le,e),i(this,Ae,{...s}),i(this,R,s.finishes_at??null),i(this,Me,s.remaining!=null?zo(s.remaining):null);const r=e==="active";w(t(this,Se),"timer",r||e==="paused"),t(this,$e)&&(t(this,$e).textContent=C(e)),d(this,ao,Qo).call(this,e),d(this,ho,ti).call(this,e),r&&t(this,R)?d(this,lo,ei).call(this):d(this,Rt,Ks).call(this),t(this,N)&&t(this,N).setAttribute("data-paused",String(e==="paused"))}predictState(e,s){const r={...t(this,Ae)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,R)&&(r.remaining=Math.max(0,(new Date(t(this,R)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}Se=new WeakMap,$e=new WeakMap,N=new WeakMap,wt=new WeakMap,Zt=new WeakMap,Pt=new WeakMap,jt=new WeakMap,Le=new WeakMap,Ae=new WeakMap,R=new WeakMap,Me=new WeakMap,ao=new WeakSet,Qo=function(e){const s=e==="idle",r=e==="active";if(t(this,wt)){const n=r?"mdi:pause":"mdi:play",h=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(n,"playpause-icon"),t(this,wt).title=h,t(this,wt).setAttribute("aria-label",`${this.def.friendly_name} - ${h}`)}t(this,Zt)&&(t(this,Zt).disabled=s),t(this,Pt)&&(t(this,Pt).disabled=s),this.announceState(`${this.def.friendly_name}, ${e}`)},ho=new WeakSet,ti=function(e){if(t(this,N)){if(e==="idle"){const s=t(this,Ae).duration;t(this,N).textContent=s?Js(zo(s)):"00:00";return}if(e==="paused"&&t(this,Me)!=null){t(this,N).textContent=Js(t(this,Me));return}if(e==="active"&&t(this,R)){const s=Math.max(0,(new Date(t(this,R)).getTime()-Date.now())/1e3);t(this,N).textContent=Js(s)}}},lo=new WeakSet,ei=function(){d(this,Rt,Ks).call(this),i(this,jt,setInterval(()=>{if(!t(this,R)||t(this,Le)!=="active"){d(this,Rt,Ks).call(this);return}const e=Math.max(0,(new Date(t(this,R)).getTime()-Date.now())/1e3);t(this,N)&&(t(this,N).textContent=Js(e)),e<=0&&d(this,Rt,Ks).call(this)},1e3))},Rt=new WeakSet,Ks=function(){t(this,jt)&&(clearInterval(t(this,jt)),i(this,jt,null))};const Bi=`
    ${M}
    ${pt}
    ${k}

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
  `;class Vi extends f{constructor(e,s,r,n){super(e,s,r,n);o(this,co);o(this,Os);o(this,Ds);o(this,po);o(this,mo);o(this,Ye);o(this,uo);o(this,Ts,null);o(this,ke,null);o(this,He,null);o(this,Te,null);o(this,Ee,null);o(this,qe,null);o(this,Ie,null);o(this,Be,null);o(this,Ve,null);o(this,Oe,null);o(this,De,null);o(this,nt,null);o(this,Ne,null);o(this,ze,null);o(this,at,null);o(this,Ze,null);o(this,Ft,null);o(this,ht,!1);o(this,lt,20);o(this,Pe,null);o(this,F,"off");o(this,je,null);o(this,Re,null);o(this,Fe,null);o(this,Es,16);o(this,qs,32);o(this,Is,.5);o(this,Ge,"°C");o(this,St,[]);o(this,Gt,[]);o(this,Yt,[]);o(this,Wt,[]);o(this,Bs,{});o(this,Vs,void 0);i(this,Vs,ee(d(this,po,oi).bind(this),500))}render(){A(this);const e=this.def.capabilities==="read-write",s=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),n=s.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),h=s.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),c=s.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);i(this,Es,this.def.feature_config?.min_temp??16),i(this,qs,this.def.feature_config?.max_temp??32),i(this,Is,this.def.feature_config?.temp_step??.5),i(this,Ge,this.def.unit_of_measurement??"°C"),i(this,St,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),i(this,Gt,this.def.feature_config?.fan_modes??[]),i(this,Yt,this.def.feature_config?.preset_modes??[]),i(this,Wt,this.def.feature_config?.swing_modes??[]);const m=e&&(t(this,St).length||t(this,Yt).length||t(this,Gt).length||t(this,Wt).length),[p,g]=t(this,lt).toFixed(1).split(".");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Bi}</style>
        <div part="card">
          <div class="shroom-state-item" data-tappable="${e}">
            <span class="shroom-icon-shape" part="card-icon" aria-hidden="true"></span>
            <div class="shroom-info">
              <span class="shroom-primary">${u(this.def.friendly_name)}</span>
              <span class="shroom-secondary">-</span>
            </div>
          </div>
          ${r||m?`
            <div class="shroom-climate-bar">
              ${r?`
                <div class="shroom-climate-temp-view">
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="-" type="button"
                      aria-label="Decrease temperature" title="Decrease">&#8722;</button>
                  `:""}
                  <span class="shroom-climate-temp-display">
                    <span class="shroom-climate-temp-int">${u(p)}</span><span class="shroom-climate-temp-frac">.${u(g)}</span>
                    <span class="shroom-climate-temp-unit">${u(t(this,Ge))}</span>
                  </span>
                  ${e?`
                    <button class="shroom-climate-step-btn" data-dir="+" type="button"
                      aria-label="Increase temperature" title="Increase">+</button>
                  `:""}
                </div>
              `:""}
              ${m?`
                <div class="shroom-climate-feat-view" hidden>
                  ${s.show_hvac_modes!==!1&&t(this,St).length?`
                    <button class="shroom-climate-feat-btn" data-feat="mode" type="button" title="Change HVAC mode" aria-label="Change HVAC mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Mode</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${h&&t(this,Yt).length?`
                    <button class="shroom-climate-feat-btn" data-feat="preset" type="button" title="Change preset" aria-label="Change preset" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Preset</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${n&&t(this,Gt).length?`
                    <button class="shroom-climate-feat-btn" data-feat="fan" type="button" title="Change fan mode" aria-label="Change fan mode" aria-haspopup="listbox" aria-expanded="false">
                      <span class="shroom-climate-feat-label">Fan</span>
                      <span class="shroom-climate-feat-value">-</span>
                    </button>
                  `:""}
                  ${c&&t(this,Wt).length?`
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
      `,i(this,Ts,this.root.querySelector(".shroom-icon-shape")),i(this,ke,this.root.querySelector(".shroom-secondary")),i(this,He,this.root.querySelector(".shroom-climate-bar")),i(this,Te,this.root.querySelector(".shroom-climate-temp-int")),i(this,Ee,this.root.querySelector(".shroom-climate-temp-frac")),i(this,qe,this.root.querySelector("[data-dir='-']")),i(this,Ie,this.root.querySelector("[data-dir='+']")),i(this,Be,this.root.querySelector("[data-feat=mode]")),i(this,Ve,this.root.querySelector("[data-feat=fan]")),i(this,Oe,this.root.querySelector("[data-feat=preset]")),i(this,De,this.root.querySelector("[data-feat=swing]")),i(this,nt,this.root.querySelector(".shroom-climate-dropdown")),i(this,Ne,this.root.querySelector(".shroom-climate-temp-view")),i(this,ze,this.root.querySelector(".shroom-climate-feat-view")),i(this,at,this.root.querySelector(".shroom-climate-toggle-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:thermostat"),"card-icon");const _=this.root.querySelector(".shroom-state-item");e&&(se(_,`${this.def.friendly_name} - Toggle`),this._attachGestureHandlers(_,{onTap:()=>{const v=this.config.gestureConfig?.tap;if(v){this._runAction(v);return}const V=t(this,F)==="off"?t(this,St).find(et=>et!=="off")??"heat":"off";this.config.card?.sendCommand("set_hvac_mode",{hvac_mode:V})}})),t(this,qe)&&t(this,qe).addEventListener("click",v=>{v.stopPropagation(),d(this,Os,To).call(this,-1)}),t(this,Ie)&&t(this,Ie).addEventListener("click",v=>{v.stopPropagation(),d(this,Os,To).call(this,1)}),t(this,at)&&t(this,at).addEventListener("click",v=>{v.stopPropagation(),i(this,ht,!t(this,ht)),t(this,at).setAttribute("aria-expanded",String(t(this,ht))),d(this,co,si).call(this)}),e&&[t(this,Be),t(this,Ve),t(this,Oe),t(this,De)].forEach(v=>{if(!v)return;const V=v.getAttribute("data-feat");v.addEventListener("click",et=>{et.stopPropagation(),d(this,mo,ii).call(this,V)})}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){i(this,Bs,{...s}),i(this,F,e),i(this,je,s.fan_mode??null),i(this,Re,s.preset_mode??null),i(this,Fe,s.swing_mode??null),i(this,Pe,s.current_temperature??null);const r=e==="off";if(t(this,He)&&(t(this,He).hidden=r),w(t(this,Ts),"climate",!r),s.temperature!==void 0&&(i(this,lt,s.temperature),d(this,Ds,Eo).call(this)),t(this,ke)){const h=s.hvac_action??e,c=t(this,Pe)!=null?` - ${t(this,Pe)} ${t(this,Ge)}`:"";t(this,ke).textContent=C(h)+c}d(this,uo,ri).call(this);const n=s.hvac_action??e;this.announceState(`${this.def.friendly_name}, ${C(n)}`)}predictState(e,s){const r={...t(this,Bs)};return e==="set_hvac_mode"&&s.hvac_mode?{state:s.hvac_mode,attributes:r}:e==="set_temperature"&&s.temperature!==void 0?{state:t(this,F),attributes:{...r,temperature:s.temperature}}:e==="set_fan_mode"&&s.fan_mode?{state:t(this,F),attributes:{...r,fan_mode:s.fan_mode}}:e==="set_preset_mode"&&s.preset_mode?{state:t(this,F),attributes:{...r,preset_mode:s.preset_mode}}:e==="set_swing_mode"&&s.swing_mode?{state:t(this,F),attributes:{...r,swing_mode:s.swing_mode}}:null}}Ts=new WeakMap,ke=new WeakMap,He=new WeakMap,Te=new WeakMap,Ee=new WeakMap,qe=new WeakMap,Ie=new WeakMap,Be=new WeakMap,Ve=new WeakMap,Oe=new WeakMap,De=new WeakMap,nt=new WeakMap,Ne=new WeakMap,ze=new WeakMap,at=new WeakMap,Ze=new WeakMap,Ft=new WeakMap,ht=new WeakMap,lt=new WeakMap,Pe=new WeakMap,F=new WeakMap,je=new WeakMap,Re=new WeakMap,Fe=new WeakMap,Es=new WeakMap,qs=new WeakMap,Is=new WeakMap,Ge=new WeakMap,St=new WeakMap,Gt=new WeakMap,Yt=new WeakMap,Wt=new WeakMap,Bs=new WeakMap,Vs=new WeakMap,co=new WeakSet,si=function(){t(this,Ne)&&(t(this,Ne).hidden=t(this,ht)),t(this,ze)&&(t(this,ze).hidden=!t(this,ht)),t(this,at)&&(t(this,at).innerHTML=t(this,ht)?'<svg viewBox="0 0 24 24"><path d="M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V14.17C14.17,14.58 15,15.71 15,17A3,3 0 0,1 9,17C9,15.71 9.83,14.58 11,14.17V5A1,1 0 0,1 12,4Z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>')},Os=new WeakSet,To=function(e){const s=Math.round((t(this,lt)+e*t(this,Is))*100)/100;i(this,lt,Math.max(t(this,Es),Math.min(t(this,qs),s))),d(this,Ds,Eo).call(this),t(this,Vs).call(this)},Ds=new WeakSet,Eo=function(){const[e,s]=t(this,lt).toFixed(1).split(".");t(this,Te)&&(t(this,Te).textContent=e),t(this,Ee)&&(t(this,Ee).textContent=`.${s}`)},po=new WeakSet,oi=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,lt)})},mo=new WeakSet,ii=function(e){if(t(this,Ze)===e){d(this,Ye,bo).call(this);return}i(this,Ze,e);let s=[],r=null,n="",h="";switch(e){case"mode":s=t(this,St),r=t(this,F),n="set_hvac_mode",h="hvac_mode";break;case"fan":s=t(this,Gt),r=t(this,je),n="set_fan_mode",h="fan_mode";break;case"preset":s=t(this,Yt),r=t(this,Re),n="set_preset_mode",h="preset_mode";break;case"swing":s=t(this,Wt),r=t(this,Fe),n="set_swing_mode",h="swing_mode";break}if(!s.length||!t(this,nt))return;t(this,nt).innerHTML=s.map(p=>`
        <button class="shroom-climate-dd-option" data-active="${p===r}" role="option"
          aria-selected="${p===r}" type="button">
          ${u(C(p))}
        </button>
      `).join(""),t(this,nt).querySelectorAll(".shroom-climate-dd-option").forEach((p,g)=>{p.addEventListener("click",_=>{_.stopPropagation(),this.config.card?.sendCommand(n,{[h]:s[g]}),d(this,Ye,bo).call(this)})});const c=this.root.querySelector(`[data-feat="${e}"]`);c&&c.setAttribute("aria-expanded","true"),t(this,nt).removeAttribute("hidden");const m=p=>{p.composedPath().some(_=>_===this.root||_===this.root.host)||d(this,Ye,bo).call(this)};i(this,Ft,m),document.addEventListener("pointerdown",m,!0)},Ye=new WeakSet,bo=function(){i(this,Ze,null),t(this,nt)?.setAttribute("hidden",""),this.root.querySelectorAll(".shroom-climate-feat-btn").forEach(e=>{e.setAttribute("aria-expanded","false")}),t(this,Ft)&&(document.removeEventListener("pointerdown",t(this,Ft),!0),i(this,Ft,null))},uo=new WeakSet,ri=function(){const e=(s,r)=>{if(!s)return;const n=s.querySelector(".shroom-climate-feat-value");n&&(n.textContent=C(r??"None"))};e(t(this,Be),t(this,F)),e(t(this,Ve),t(this,je)),e(t(this,Oe),t(this,Re)),e(t(this,De),t(this,Fe))};const Oi=`
    ${M}
    ${hs}
    ${pt}
    ${k}

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
  `;class Di extends f{constructor(e,s,r,n){super(e,s,r,n);o(this,Fs);o(this,fo);o(this,Ns,null);o(this,We,null);o(this,Ut,null);o(this,Ue,null);o(this,Ke,null);o(this,Xe,null);o(this,$t,null);o(this,zs,null);o(this,Zs,null);o(this,Ps,null);o(this,Je,null);o(this,Q,null);o(this,Lt,null);o(this,js,!1);o(this,Kt,!1);o(this,G,0);o(this,dt,"idle");o(this,ct,{});o(this,Rs,void 0);i(this,Rs,ee(d(this,fo,ni).bind(this),200))}render(){A(this);const e=this.def.capabilities==="read-write",s=this.def.supported_features??[],r=this.config.displayHints??{},n=s.includes("previous_track");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Oi}</style>
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
      `,i(this,Ns,this.root.querySelector(".shroom-icon-shape")),i(this,We,this.root.querySelector(".shroom-primary")),i(this,Ut,this.root.querySelector(".shroom-secondary")),i(this,Xe,this.root.querySelector(".shroom-mp-bar")),i(this,Ue,this.root.querySelector(".shroom-mp-transport-view")),i(this,Ke,this.root.querySelector(".shroom-mp-volume-view")),i(this,$t,this.root.querySelector("[data-role=play]")),i(this,zs,this.root.querySelector("[data-role=prev]")),i(this,Zs,this.root.querySelector("[data-role=next]")),i(this,Ps,this.root.querySelector("[data-role=power]")),i(this,Je,this.root.querySelector("[data-role=volume]")),i(this,Q,this.root.querySelector(".shroom-slider-input")),i(this,Lt,this.root.querySelector(".shroom-slider-cover")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:speaker"),"card-icon"),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:power","power-icon"),this.renderIcon("mdi:volume-high","vol-icon"),e&&(t(this,$t)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,zs)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Zs)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),t(this,Ps)?.addEventListener("click",()=>{const p=t(this,dt)==="playing"||t(this,dt)==="paused";this.config.card?.sendCommand(p?"turn_off":"turn_on",{})}),t(this,Je)?.addEventListener("click",()=>{i(this,Kt,!0),d(this,Fs,qo).call(this)}),this.root.querySelector(".shroom-mp-back-btn")?.addEventListener("click",()=>{i(this,Kt,!1),d(this,Fs,qo).call(this)}),this.root.querySelector("[data-role=vol-down]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_down",{})}),this.root.querySelector("[data-role=vol-up]")?.addEventListener("click",()=>{this.config.card?.sendCommand("volume_up",{})})),t(this,Q)&&t(this,Q).addEventListener("input",()=>{i(this,G,parseInt(t(this,Q).value,10)),t(this,Lt)&&(t(this,Lt).style.left=`${t(this,G)}%`),t(this,Rs).call(this)}),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){i(this,dt,e),i(this,ct,s);const r=e==="playing",n=r||e==="paused";w(t(this,Ns),"media_player",n),t(this,Xe)&&(t(this,Xe).hidden=!n);const h=s.media_title??"",c=s.media_artist??"";if(t(this,We)&&(t(this,We).textContent=n&&h?h:this.def.friendly_name),t(this,Ut))if(n){const m=t(this,G)>0?`${t(this,G)}%`:"",p=[c,m].filter(Boolean);t(this,Ut).textContent=p.join(" - ")||C(e)}else t(this,Ut).textContent=C(e);if(t(this,$t)){const m=r?"mdi:pause":"mdi:play";this.renderIcon(m,"play-icon");const p=r?"Pause":"Play";t(this,$t).title=p,t(this,$t).setAttribute("aria-label",p)}if(s.volume_level!==void 0&&(i(this,G,Math.round(s.volume_level*100)),t(this,Q)&&!this.isFocused(t(this,Q))&&(t(this,Q).value=String(t(this,G))),t(this,Lt)&&(t(this,Lt).style.left=`${t(this,G)}%`)),i(this,js,!!s.is_volume_muted),t(this,Je)){const m=t(this,js)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(m,"vol-icon")}this.announceState(`${this.def.friendly_name}, ${e}${h?` - ${h}`:""}`)}predictState(e,s){return e==="media_play_pause"?{state:t(this,dt)==="playing"?"paused":"playing",attributes:t(this,ct)}:e==="volume_mute"?{state:t(this,dt),attributes:{...t(this,ct),is_volume_muted:!!s.is_volume_muted}}:e==="volume_set"?{state:t(this,dt),attributes:{...t(this,ct),volume_level:s.volume_level}}:e==="turn_off"?{state:"off",attributes:t(this,ct)}:e==="turn_on"?{state:"idle",attributes:t(this,ct)}:null}}Ns=new WeakMap,We=new WeakMap,Ut=new WeakMap,Ue=new WeakMap,Ke=new WeakMap,Xe=new WeakMap,$t=new WeakMap,zs=new WeakMap,Zs=new WeakMap,Ps=new WeakMap,Je=new WeakMap,Q=new WeakMap,Lt=new WeakMap,js=new WeakMap,Kt=new WeakMap,G=new WeakMap,dt=new WeakMap,ct=new WeakMap,Rs=new WeakMap,Fs=new WeakSet,qo=function(){t(this,Ue)&&(t(this,Ue).hidden=t(this,Kt)),t(this,Ke)&&(t(this,Ke).hidden=!t(this,Kt))},fo=new WeakSet,ni=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,G)/100})};const Zo={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},Ni=Zo.cloudy,zi="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77Z",Zi="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",Pi="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",ji=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function _o(a,l){const e=Zo[a]??Ni;return`<svg viewBox="0 0 24 24" width="${l}" height="${l}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Co(a){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${a}" fill="currentColor"/></svg>`}const Ri=`
    ${M}
    ${k}

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
  `;class Fi extends f{constructor(){super(...arguments);o(this,B);o(this,Ys);o(this,Ws);o(this,Gs,null);o(this,Qe,null);o(this,ts,null);o(this,Xt,null);o(this,es,null);o(this,ss,null);o(this,os,null);o(this,At,null);o(this,tt,null);o(this,Jt,null);o(this,Qt,null)}render(){A(this),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ri}</style>
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
              <span class="shroom-weather-icon">${_o("cloudy",36)}</span>
              <span class="shroom-weather-temp">--<span class="shroom-weather-unit"></span></span>
            </div>
            <div class="shroom-weather-stats">
              <span class="shroom-weather-stat" data-stat="humidity" aria-label="Humidity">
                ${Co(zi)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="wind" aria-label="Wind speed">
                ${Co(Zi)}
                <span data-value>--</span>
              </span>
              <span class="shroom-weather-stat" data-stat="pressure" aria-label="Pressure">
                ${Co(Pi)}
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
      `,i(this,Gs,this.root.querySelector(".shroom-icon-shape")),i(this,Qe,this.root.querySelector(".shroom-secondary")),i(this,ts,this.root.querySelector(".shroom-weather-icon")),i(this,Xt,this.root.querySelector(".shroom-weather-temp")),i(this,es,this.root.querySelector("[data-stat=humidity] [data-value]")),i(this,ss,this.root.querySelector("[data-stat=wind] [data-value]")),i(this,os,this.root.querySelector("[data-stat=pressure] [data-value]")),i(this,At,this.root.querySelector(".shroom-forecast-strip")),i(this,tt,this.root.querySelector(".shroom-forecast-toggle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:weather-cloudy"),"card-icon"),w(t(this,Gs),"weather",!0),this._attachGestureHandlers(this.root.querySelector("[part=card]")),this.renderCompanions(),L(this.root)}applyState(e,s){const r=e||"cloudy";t(this,ts)&&(t(this,ts).innerHTML=_o(r,36));const n=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,Qe)&&(t(this,Qe).textContent=C(n));const h=s.temperature??s.native_temperature,c=s.temperature_unit??"";if(t(this,Xt)){const p=t(this,Xt).querySelector(".shroom-weather-unit");t(this,Xt).firstChild.textContent=h!=null?Math.round(Number(h)):"--",p&&(p.textContent=c?` ${c}`:"")}if(t(this,es)){const p=s.humidity;t(this,es).textContent=p!=null?`${p}%`:"--"}if(t(this,ss)){const p=s.wind_speed,g=s.wind_speed_unit??"";t(this,ss).textContent=p!=null?`${p} ${g}`.trim():"--"}if(t(this,os)){const p=s.pressure,g=s.pressure_unit??"";t(this,os).textContent=p!=null?`${p} ${g}`.trim():"--"}const m=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;i(this,Jt,m?s.forecast_daily??s.forecast??null:null),i(this,Qt,m?s.forecast_hourly??null:null),d(this,Ys,Io).call(this),d(this,Ws,Bo).call(this),this.announceState(`${this.def.friendly_name}, ${n}, ${h??"--"} ${c}`)}}Gs=new WeakMap,Qe=new WeakMap,ts=new WeakMap,Xt=new WeakMap,es=new WeakMap,ss=new WeakMap,os=new WeakMap,At=new WeakMap,tt=new WeakMap,B=new WeakSet,te=function(){return this.config._forecastMode??"daily"},yo=function(e){this.config._forecastMode=e},Jt=new WeakMap,Qt=new WeakMap,Ys=new WeakSet,Io=function(){if(!t(this,tt))return;const e=Array.isArray(t(this,Jt))&&t(this,Jt).length>0,s=Array.isArray(t(this,Qt))&&t(this,Qt).length>0;if(!e&&!s){t(this,tt).textContent="";return}e&&!s&&i(this,B,"daily",yo),!e&&s&&i(this,B,"hourly",yo),e&&s?(t(this,tt).textContent=t(this,B,te)==="daily"?"Hourly":"5-Day",t(this,tt).onclick=()=>{i(this,B,t(this,B,te)==="daily"?"hourly":"daily",yo),d(this,Ys,Io).call(this),d(this,Ws,Bo).call(this)}):(t(this,tt).textContent="",t(this,tt).onclick=null)},Ws=new WeakSet,Bo=function(){if(!t(this,At))return;const e=t(this,B,te)==="hourly"?t(this,Qt):t(this,Jt);if(t(this,At).setAttribute("data-mode",t(this,B,te)),!Array.isArray(e)||e.length===0){t(this,At).innerHTML="";return}const s=t(this,B,te)==="daily"?e.slice(0,5):e;t(this,At).innerHTML=s.map(r=>{const n=new Date(r.datetime);let h;t(this,B,te)==="hourly"?h=n.toLocaleTimeString([],{hour:"numeric"}):h=ji[n.getDay()]??"";const c=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",m=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="shroom-forecast-day" role="listitem">
            <span class="shroom-forecast-day-name">${u(String(h))}</span>
            ${_o(r.condition||"cloudy",18)}
            <span class="shroom-forecast-temps">
              ${u(String(c))}${m!=null?`/<span class="shroom-forecast-lo">${u(String(m))}</span>`:""}
            </span>
          </div>`}).join("")};const Po={auto:"var(--hrv-color-primary)",red:"#ef4444",orange:"#f97316",amber:"#f59e0b",yellow:"#eab308",green:"#22c55e",teal:"#14b8a6",cyan:"#06b6d4",blue:"#3b82f6",indigo:"#6366f1",purple:"#a855f7",pink:"#ec4899",grey:"#9ca3af"},Gi=new Set(["off","unavailable","unknown","idle","closed","standby","not_home","locked","jammed","locking","unlocking"]),jo={light:"mdi:lightbulb",switch:"mdi:toggle-switch",input_boolean:"mdi:toggle-switch",fan:"mdi:fan",sensor:"mdi:gauge",binary_sensor:"mdi:radiobox-blank",climate:"mdi:thermostat",media_player:"mdi:cast",cover:"mdi:window-shutter",timer:"mdi:timer",remote:"mdi:remote",input_number:"mdi:numeric",input_select:"mdi:format-list-bulleted",harvest_action:"mdi:play-circle-outline"},Yi=`
    :host {
      width: auto !important;
      min-width: unset !important;
      display: inline-block !important;
      contain: none !important;
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
  `;class Wi extends f{constructor(){super(...arguments);o(this,is,null);o(this,rs,null);o(this,ns,null)}render(){const e=this.def.display_hints??{},s=e.badge_show_icon!==!1,r=e.badge_show_name!==!1,n=e.badge_show_state!==!1,h=r?"":" sr-only",c=n?"":" sr-only",p=r&&!n||!r&&n?" single":"";if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Yi}</style>
        <div part="badge" aria-label="${u(this.def.friendly_name)}" title="${u(this.def.friendly_name)}">
          ${s?'<span part="badge-icon" aria-hidden="true"></span>':""}
          <span part="badge-text" class="${p}">
            <span part="badge-name" class="${h}">${u(this.def.friendly_name)}</span>
            <span part="badge-state" class="${c}" aria-live="polite"></span>
          </span>
        </div>
        ${this.renderAriaLiveHTML()}
      `,i(this,is,this.root.querySelector("[part=badge-icon]")),i(this,rs,this.root.querySelector("[part=badge-state]")),i(this,ns,this.root.querySelector("[part=badge]")),s){const g=jo[this.def.domain]??"mdi:help-circle";this.renderIcon(this.resolveIcon(this.def.icon,g),"badge-icon")}}applyState(e,s){const n=(this.def.display_hints??{}).badge_icon_color??"auto",h=!Gi.has(e);if(t(this,is)){t(this,is).style.color=h?Po[n]??Po.auto:"#9ca3af";const g=jo[this.def.domain]??"mdi:help-circle",_=this.def.icon_state_map?.[e]??this.def.icon??g;this.renderIcon(this.resolveIcon(_,g),"badge-icon")}const c=s?.unit_of_measurement??this.def.unit_of_measurement??"",m=this.formatStateLabel(e),p=c?`${m} ${c}`:m;t(this,rs)&&(t(this,rs).textContent=p),t(this,ns)&&(t(this,ns).title=`${this.def.friendly_name}: ${p}`),this.announceState(`${this.def.friendly_name}, ${e}`)}}is=new WeakMap,rs=new WeakMap,ns=new WeakMap;const Ui=window.__HARVEST_PACK_ID__||"shrooms";b._packs=b._packs||{},b._packs[Ui]={light:ci,switch:No,input_boolean:No,sensor:Xs,"sensor.temperature":Xs,"sensor.humidity":Xs,"sensor.battery":Xs,fan:bi,binary_sensor:xi,generic:Ci,harvest_action:Si,input_number:Li,input_select:Mi,cover:Hi,remote:Ei,timer:Ii,climate:Vi,media_player:Di,weather:Fi,badge:Wi,_capabilities:{fan:{display_modes:["on-off","continuous","stepped","cycle"]},input_number:{display_modes:["slider","buttons"]},light:{features:["brightness","color_temp","rgb"]},climate:{features:["hvac_modes","presets","fan_mode","swing_mode"]},cover:{features:["position","tilt"]},media_player:{features:["transport","volume","source"]}}}})();})();
