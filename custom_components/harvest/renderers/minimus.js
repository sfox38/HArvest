(()=>{var Es=Object.defineProperty;var ln=A=>{throw TypeError(A)};var Hs=(A,g,p)=>g in A?Es(A,g,{enumerable:!0,configurable:!0,writable:!0,value:p}):A[g]=p;var sr=(A,g,p)=>Hs(A,typeof g!="symbol"?g+"":g,p),qr=(A,g,p)=>g.has(A)||ln("Cannot "+p);var t=(A,g,p)=>(qr(A,g,"read from private field"),p?p.call(A):g.get(A)),s=(A,g,p)=>g.has(A)?ln("Cannot add the same private member more than once"):g instanceof WeakSet?g.add(A):g.set(A,p),n=(A,g,p,Nt)=>(qr(A,g,"write to private field"),Nt?Nt.call(A,p):g.set(A,p),p),h=(A,g,p)=>(qr(A,g,"access private method"),p);(function(){"use strict";var se,R,Ji,X,Lt,$,j,Qe,ti,ut,yt,vt,xt,$e,ei,N,K,kt,ii,ri,b,Ts,T,cn,pn,un,vn,gr,br,fn,Yi,mn,gn,Dr,bn,Pr,yn,wt,rt,pr,J,ni,Z,Mt,Et,Ht,Q,H,oe,Zt,tt,q,Se,si,oi,m,yr,or,zr,xr,Br,Rr,Gi,xn,wn,jr,_n,Or,Cn,wr,An,dt,Yt,Tt,ai,ae,hi,di,li,nt,st,ci,pi,ui,vi,Y,Le,It,ot,at,qt,fi,mi,gi,Dt,he,ke,bi,yi,xi,wi,_i,Qi,Ci,x,Vr,$n,Sn,Fr,ar,Wr,_r,Ln,kn,Nr,Zr,Mn,En,Me,Ee,Pt,D,He,Te,Ie,ft,de,Gt,zt,Ai,tr,er,$i,Bt,Cr,Hn,Tn,qe,Ut,O,G,Si,le,ce,Xt,V,lt,_t,Kt,pe,k,In,qn,Ui,Ar,Dn,Xi,et,F,De,ur,ue,Li,Jt,Pe,Qt,ve,fe,ht,P,Pn,zn,Yr,Gr,Ki,te,ki,Mi,ze,Be,Rt,z,Re,je,Oe,jt,ee,Ve,Fe,ir,me,$r,Bn,Ei,rr,Hi,Ti,Ot,Ii,We,mt,ie,ge,be,Ne,qi,Di,Ct,Pi,ct,Rn,jn,On,hr,zi,Vt,Ze,Ye,Bi,Ge,Ri,ji,Oi,Vi,pt,Ft,gt,Fi,Wi,S,Ce,Sr,Ue,Xe,Ur,Xr,Kr,Vn,re,Ni,ye,vr,ne,fr,xe,At,mr,we,Zi;const A=window.HArvest;if(!A||!A.renderers||!A.renderers.BaseCard){console.warn("[HArvest minimus] HArvest not found - pack not loaded.");return}const g=A.renderers.BaseCard,p=window.HArvest.esc;function Nt(c,v){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,c.apply(this,i)},v)}}function Ke(c){return c?c.charAt(0).toUpperCase()+c.slice(1).replace(/_/g," "):""}const W=`
    [part=companion-zone] {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      padding: 8px var(--hrv-card-padding, 16px) var(--hrv-card-padding, 16px);
      border-top: none;
      margin-top: 0;
    }
    [part=companion-zone]:empty { display: none; }
    [part=companion] {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      border: none;
      padding: 0;
      cursor: default;
      flex-shrink: 0;
      box-shadow: none;
      transition: box-shadow var(--hrv-transition-speed, 0.2s);
    }
    [part=companion][data-on=true] { box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff); }
    [part=companion][data-interactive=true] { cursor: pointer; }
    [part=companion][data-interactive=true]:hover { opacity: 0.88; }
    [part=companion-icon]  { display: none; }
    [part=companion-state] { display: none; }
  `;function Fn(c){if(!c)return()=>{};const v=80,e=1.6,i=.96,r=.04;let o=null,a=0,l=0,d=0,u=!1,f=0;const y=[],_=()=>{f&&(cancelAnimationFrame(f),f=0)},I=C=>{for(;y.length&&y[0].t<C-v;)y.shift();if(y.length<2)return 0;const U=y[0],Wt=y[y.length-1],nr=Wt.t-U.t;return nr<=0?0:(Wt.x-U.x)/nr},L=()=>{if(Math.abs(d)<r)return;let C=performance.now();const U=Wt=>{const nr=Wt-C;if(C=Wt,c.scrollLeft-=d*nr,d*=Math.pow(i,nr/16),Math.abs(d)<r){f=0,d=0;return}const Ms=c.scrollWidth-c.clientWidth;if(c.scrollLeft<=0||c.scrollLeft>=Ms){f=0,d=0;return}f=requestAnimationFrame(U)};f=requestAnimationFrame(U)},_e=C=>{if(c.scrollWidth<=c.clientWidth||C.pointerType==="touch")return;const U=C.target;if(!(U&&U!==c&&U.closest?.("button, a"))){_(),o=C.pointerId,a=C.clientX,l=c.scrollLeft,d=0,u=!1,y.length=0,y.push({x:C.clientX,t:C.timeStamp});try{c.setPointerCapture(o)}catch{}}},w=C=>{if(C.pointerId!==o)return;const U=C.clientX-a;Math.abs(U)>4&&(u=!0,c.dataset.dragging="true"),c.scrollLeft=l-U,y.push({x:C.clientX,t:C.timeStamp});const Wt=C.timeStamp-v;for(;y.length>2&&y[0].t<Wt;)y.shift()},M=C=>{if(C.pointerId===o){try{c.releasePointerCapture(o)}catch{}if(o=null,u){const U=Wt=>{Wt.stopPropagation(),Wt.preventDefault()};window.addEventListener("click",U,{capture:!0,once:!0}),requestAnimationFrame(()=>c.removeAttribute("data-dragging")),d=I(C.timeStamp)*e,L()}y.length=0}};return c.addEventListener("pointerdown",_e),c.addEventListener("pointermove",w),c.addEventListener("pointerup",M),c.addEventListener("pointercancel",M),c.addEventListener("wheel",_,{passive:!0}),c.addEventListener("touchstart",_,{passive:!0}),()=>{_(),c.removeEventListener("pointerdown",_e),c.removeEventListener("pointermove",w),c.removeEventListener("pointerup",M),c.removeEventListener("pointercancel",M),c.removeEventListener("wheel",_),c.removeEventListener("touchstart",_)}}function B(c){c.querySelectorAll("[part=companion]").forEach(v=>{v.title=v.getAttribute("aria-label")??""})}const Wn=60,Nn=60,Ae=48,it=225,E=270,$t=2*Math.PI*Ae*(E/360);function Zn(c){return c*Math.PI/180}function bt(c){const v=Zn(c);return{x:Wn+Ae*Math.cos(v),y:Nn-Ae*Math.sin(v)}}function Yn(){const c=bt(it),v=bt(it-E);return`M ${c.x} ${c.y} A ${Ae} ${Ae} 0 1 1 ${v.x} ${v.y}`}const Je=Yn(),St=["brightness","temp","color"],dr=120;function Jr(c){const v=E/dr;let e="";for(let i=0;i<dr;i++){const r=it-i*v,o=it-(i+1)*v,a=bt(r),l=bt(o),d=`M ${a.x} ${a.y} A ${Ae} ${Ae} 0 0 1 ${l.x} ${l.y}`,u=i===0||i===dr-1?"round":"butt";e+=`<path d="${d}" stroke="${c(i/dr)}" fill="none" stroke-width="8" stroke-linecap="${u}" />`}return e}const Gn=Jr(c=>`hsl(${Math.round(c*360)},100%,50%)`),Un=Jr(c=>{const e=Math.round(143+112*c),i=Math.round(255*c);return`rgb(255,${e},${i})`}),Lr=`
    [part=card] {
      padding-bottom: 0 !important;
    }

    [part=card-body] {
      display: flex;
      align-items: stretch;
      gap: 10px;
    }

    [part=card-body].hrv-no-dial {
      align-items: center;
      justify-content: center;
      padding: 8px 0;
    }

    .hrv-dial-column {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    [part=companion-zone] {
      margin-top: 6px;
      border-top: none;
      padding-top: 0;
      padding-bottom: var(--hrv-card-padding, 16px);
      justify-content: center;
      gap: 12px;
    }

    [part=companion-zone]:empty { display: none; }

    [part=companion] {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      border: none;
      padding: 0;
      cursor: default;
      flex-shrink: 0;
      box-shadow: none;
      transition: box-shadow var(--hrv-transition-speed, 0.2s);
    }

    [part=companion][data-on=true] { box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff); }
    [part=companion][data-interactive=true] { cursor: pointer; }
    [part=companion][data-interactive=true]:hover { opacity: 0.88; }

    [part=companion-icon] { display: none; }
    [part=companion-state] { display: none; }

    .hrv-dial-wrap {
      position: relative;
      flex: none;
      width: 100%;
      aspect-ratio: 1 / 1;
      touch-action: none;
      cursor: grab;
    }
    .hrv-dial-wrap:active { cursor: grabbing; }
    .hrv-dial-thumb-hit {
      touch-action: none;
      cursor: grab;
      fill: transparent;
    }
    .hrv-dial-thumb-hit:active { cursor: grabbing; }

    .hrv-dial-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .hrv-dial-wrap svg {
      width: 100%;
      height: 100%;
    }

    .hrv-dial-track {
      fill: none;
      stroke: var(--hrv-color-surface-alt, #e0e0e0);
      stroke-width: 8;
      stroke-linecap: round;
    }

    .hrv-dial-fill {
      fill: none;
      stroke: var(--hrv-color-state-on, #ffc107);
      stroke-width: 8;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.15s ease;
    }

    .hrv-dial-segs { display: none; }
    .hrv-dial-segs-visible { display: block; }

    .hrv-dial-thumb {
      fill: none;
      stroke: var(--hrv-ex-ring, #fff);
      stroke-width: 1.5;
      filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4));
      transition: cx 0.15s ease, cy 0.15s ease;
    }

    .hrv-dial-pct {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: var(--hrv-font-size-l, 18px);
      font-weight: var(--hrv-font-weight-bold, 700);
      color: var(--hrv-color-text, #1a1a1a);
      pointer-events: none;
      user-select: none;
    }

    .hrv-mode-switch {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 36px;
      height: 84px;
      background: var(--hrv-color-surface-alt, #e0e0e0);
      border-radius: 18px;
      position: relative;
      cursor: pointer;
      user-select: none;
      flex-shrink: 0;
    }

    .hrv-mode-switch[data-count="2"] { height: 56px; }

    .hrv-mode-switch-thumb {
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      left: 6px;
      top: 2px;
      transition: top 0.15s ease;
      pointer-events: none;
    }

    .hrv-mode-switch[data-pos="1"] .hrv-mode-switch-thumb { top: 30px; }
    .hrv-mode-switch[data-pos="2"] .hrv-mode-switch-thumb { top: 58px; }

    .hrv-mode-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--hrv-color-text-secondary, #888);
      left: 15px;
      opacity: 0.4;
    }

    .hrv-mode-dot:nth-child(2) { top: 11px; }
    .hrv-mode-dot:nth-child(3) { top: 39px; }
    .hrv-mode-dot:nth-child(4) { top: 67px; }

    .hrv-mode-switch[data-pos="0"] .hrv-mode-dot:nth-child(2),
    .hrv-mode-switch[data-pos="1"] .hrv-mode-dot:nth-child(3),
    .hrv-mode-switch[data-pos="2"] .hrv-mode-dot:nth-child(4) { opacity: 0; }

    [part=toggle-button] {
      width: 44px;
      height: 44px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      cursor: pointer;
      box-shadow: none;
      transition: box-shadow var(--hrv-transition-speed, 0.2s);
    }

    [part=toggle-button]:hover { opacity: 0.88; }
    [part=toggle-button]:active { opacity: 0.75; }

    [part=toggle-button][aria-pressed=true] {
      box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff);
    }

    [part=toggle-button][aria-pressed=false] {
      box-shadow: none;
    }

    .hrv-light-ro-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .hrv-light-ro-circle {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: var(--hrv-color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.35;
    }
    .hrv-light-ro-circle [part=ro-state-icon] {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      pointer-events: none;
    }
    .hrv-light-ro-circle [part=ro-state-icon] svg { width: 40px; height: 40px; }
    .hrv-light-ro-dots {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .hrv-light-ro-dots:empty { display: none; }
    .hrv-light-ro-dot {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--hrv-ex-dot-bg, rgba(255,255,255,0.45));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      color: var(--hrv-ex-dot-text, #000);
      line-height: 1;
    }

    @media (prefers-reduced-motion: reduce) {
      .hrv-dial-fill { transition: none; }
      .hrv-dial-thumb { transition: none; }
      .hrv-mode-switch-thumb { transition: none; }
    }
  `,Xn=`
    [part=toggle-button] {
      -webkit-appearance: none;
      appearance: none;
      display: block;
      position: relative;
      width: 36px;
      height: 72px;
      border-radius: 18px;
      background: var(--hrv-ex-toggle-idle, rgba(255,255,255,0.25));
      border: 2px solid var(--hrv-ex-outline, rgba(255,255,255,0.3));
      cursor: pointer;
      padding: 0;
      margin: 0;
      outline: none;
      font: inherit;
      color: inherit;
      transition: background 250ms ease, border-color 250ms ease;
    }
    [part=toggle-button]:focus-visible {
      box-shadow: 0 0 0 3px var(--hrv-color-primary, #1976d2);
    }
    [part=toggle-button][aria-pressed=true] {
      background: var(--hrv-color-primary, #1976d2);
      border-color: var(--hrv-color-primary, #1976d2);
      box-shadow: none;
    }
    .hrv-light-icon-btn {
      -webkit-appearance: none;
      appearance: none;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      transition: box-shadow var(--hrv-transition-speed, 0.2s), opacity var(--hrv-transition-speed, 0.2s);
    }
    .hrv-light-icon-btn[aria-pressed=false] { opacity: 0.45; }
    .hrv-light-icon-btn:hover { opacity: 0.88; }
    .hrv-light-icon-btn:active { transition: none; opacity: 0.75; }
    .hrv-light-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .hrv-light-icon-btn svg {
      width: 52px;
      height: 52px;
      display: block;
      fill: currentColor;
      pointer-events: none;
    }

    .hrv-light-icon-btn [part=card-icon] {
      width: 52px;
      height: 52px;
      color: var(--hrv-color-on-primary, #fff);
    }

    .hrv-dial-wrap {
      max-width: 200px;
      margin: 0 auto;
    }
    [part=toggle-button]:hover { opacity: 0.85; }
    [part=toggle-button]:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .hrv-light-toggle-knob {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--hrv-ex-thumb, #fff);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: top 200ms ease;
      pointer-events: none;
      top: 40px;
    }
    [part=toggle-button][aria-pressed=true] .hrv-light-toggle-knob { top: 4px; }
    @media (prefers-reduced-motion: reduce) {
      [part=toggle-button],
      .hrv-light-toggle-knob { transition: none; }
    }
  `;class Kn extends g{constructor(e,i,r,o){super(e,i,r,o);s(this,b);s(this,se,null);s(this,R,null);s(this,Ji,null);s(this,X,null);s(this,Lt,null);s(this,$,null);s(this,j,null);s(this,Qe,null);s(this,ti,null);s(this,ut,0);s(this,yt,4e3);s(this,vt,0);s(this,xt,!1);s(this,$e,!1);s(this,ei,null);s(this,N,0);s(this,K,2e3);s(this,kt,6500);s(this,ii);s(this,ri,new Map);s(this,T,[]);n(this,ii,Nt(h(this,b,yn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_brightness!==!1&&i.includes("brightness"),a=r.show_color_temp!==!1&&i.includes("color_temp"),l=r.show_rgb!==!1&&i.includes("rgb_color"),d=e&&(o||a||l),u=[o,a,l].filter(Boolean).length,f=e&&u>1;n(this,K,this.def.feature_config?.min_color_temp_kelvin??2e3),n(this,kt,this.def.feature_config?.max_color_temp_kelvin??6500);const y=bt(it);this.root.innerHTML=`
        <style>${Lr}${Xn}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${d?"":"hrv-no-dial"}">
            ${d?`
              <div class="hrv-dial-column">
                <div class="hrv-dial-wrap" role="slider" tabindex="0" aria-valuemin="0"
                  aria-valuemax="100" aria-valuenow="0"
                  aria-label="${p(this.def.friendly_name)} brightness"
                  title="Drag to adjust">
                  <svg viewBox="0 0 120 120">
                    <g class="hrv-dial-segs hrv-dial-segs-color">${Gn}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${Un}</g>
                    <path class="hrv-dial-track" d="${Je}" />
                    <path class="hrv-dial-fill" d="${Je}"
                      stroke-dasharray="${$t}"
                      stroke-dashoffset="${$t}" />
                    <circle class="hrv-dial-thumb" r="7"
                      cx="${y.x}" cy="${y.y}" />
                    <circle class="hrv-dial-thumb-hit" r="16"
                      cx="${y.x}" cy="${y.y}" />
                  </svg>
                  <span class="hrv-dial-pct">0%</span>
                </div>
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-light-ro-center">
                <div class="hrv-light-ro-circle" data-on="false"
                  role="img" aria-label="${p(this.def.friendly_name)}"
                  title="Read-only">
                  <span part="ro-state-icon" aria-hidden="true"></span>
                </div>
                <div class="hrv-light-ro-dots">
                  ${o?'<span class="hrv-light-ro-dot" data-attr="brightness" title="Brightness"></span>':""}
                  ${a?'<span class="hrv-light-ro-dot" data-attr="temp" title="Color temperature"></span>':""}
                  ${l?'<span class="hrv-light-ro-dot" data-attr="color" title="Color"></span>':""}
                </div>
              </div>
            `}
            ${e?`
              <div class="hrv-dial-controls">
                ${f?`
                  <div class="hrv-mode-switch" part="dial-mode" data-pos="0" data-count="${u}"
                    role="slider" aria-label="Dial mode" tabindex="0"
                    aria-valuemin="1" aria-valuemax="${u}" aria-valuenow="1"
                    aria-valuetext="${St[t(this,T)[0]]}">
                    <div class="hrv-mode-switch-thumb"></div>
                    ${'<span class="hrv-mode-dot"></span>'.repeat(u)}
                  </div>
                `:""}
                ${d?`
                  <button part="toggle-button" type="button"
                    aria-label="${p(this.def.friendly_name)} - toggle"
                    title="Turn ${p(this.def.friendly_name)} on / off">
                    <div class="hrv-light-toggle-knob"></div>
                  </button>
                `:`
                  <button class="hrv-light-icon-btn" part="toggle-button" type="button"
                    aria-pressed="false"
                    aria-label="${p(this.def.friendly_name)} - Toggle">
                    <span part="card-icon" aria-hidden="true"></span>
                  </button>
                `}
              </div>
            `:""}
          </div>
          ${d?"":this.renderCompanionZoneHTML()}
        </div>
      `,n(this,se,this.root.querySelector("[part=toggle-button]")),n(this,R,this.root.querySelector(".hrv-dial-fill")),n(this,Ji,this.root.querySelector(".hrv-dial-track")),n(this,X,this.root.querySelector(".hrv-dial-thumb")),n(this,Lt,this.root.querySelector(".hrv-dial-pct")),n(this,$,this.root.querySelector(".hrv-dial-wrap")),n(this,ei,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,Qe,this.root.querySelector(".hrv-dial-segs-color")),n(this,ti,this.root.querySelector(".hrv-dial-segs-temp")),n(this,j,this.root.querySelector(".hrv-mode-switch")),t(this,se)&&(d||this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon"),this._attachGestureHandlers(t(this,se),{onTap:()=>{const _=this.config.gestureConfig?.tap;if(_){this._runAction(_);return}this.config.card?.sendCommand("toggle",{})}})),t(this,$)&&(t(this,$).addEventListener("pointerdown",h(this,b,mn).bind(this)),t(this,$).addEventListener("pointermove",h(this,b,gn).bind(this)),t(this,$).addEventListener("pointerup",h(this,b,Dr).bind(this)),t(this,$).addEventListener("pointercancel",h(this,b,Dr).bind(this)),t(this,$).addEventListener("keydown",h(this,b,bn).bind(this))),d&&h(this,b,cn).call(this),t(this,j)&&(t(this,j).addEventListener("click",h(this,b,pn).bind(this)),t(this,j).addEventListener("keydown",h(this,b,vn).bind(this)),t(this,j).addEventListener("mousemove",h(this,b,un).bind(this))),h(this,b,br).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(_=>{_.title=_.getAttribute("aria-label")??"Companion";const I=_.getAttribute("data-entity");if(I&&t(this,ri).has(I)){const L=t(this,ri).get(I);_.setAttribute("data-on",String(L==="on"))}})}applyState(e,i){if(n(this,xt,e==="on"),n(this,ut,i?.brightness??0),i?.color_temp_kelvin!==void 0?n(this,yt,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&n(this,yt,Math.round(1e6/i.color_temp)),i?.hs_color)n(this,vt,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[o,a,l]=i.rgb_color;n(this,vt,ts(o,a,l))}if(t(this,se)&&(t(this,se).setAttribute("aria-pressed",String(t(this,xt))),this.root.querySelector("[part=card-icon]"))){const a=t(this,xt)?"mdi:lightbulb":"mdi:lightbulb-outline",l=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(l,a),"card-icon")}const r=this.root.querySelector(".hrv-light-ro-circle");if(r){r.setAttribute("data-on",String(t(this,xt)));const o=t(this,xt)?"mdi:lightbulb":"mdi:lightbulb-outline",a=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??o;this.renderIcon(this.resolveIcon(a,o),"ro-state-icon");const l=i?.color_mode,d=l==="color_temp",u=l&&l!=="color_temp",f=this.root.querySelector('[data-attr="brightness"]');if(f){const I=Math.round(t(this,ut)/255*100);f.title=t(this,xt)?`Brightness: ${I}%`:"Brightness: off"}const y=this.root.querySelector('[data-attr="temp"]');y&&(y.title=`Color temperature: ${t(this,yt)}K`,y.style.display=u?"none":"");const _=this.root.querySelector('[data-attr="color"]');if(_)if(_.style.display=d?"none":"",i?.rgb_color){const[I,L,_e]=i.rgb_color;_.style.background=`rgb(${I},${L},${_e})`,_.title=`Color: rgb(${I}, ${L}, ${_e})`}else _.style.background=`hsl(${t(this,vt)}, 100%, 50%)`,_.title=`Color: hue ${t(this,vt)}°`}h(this,b,gr).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,xt)?"off":"on",attributes:{brightness:t(this,ut)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,r){t(this,ri).set(e,i),super.updateCompanionState(e,i,r)}}se=new WeakMap,R=new WeakMap,Ji=new WeakMap,X=new WeakMap,Lt=new WeakMap,$=new WeakMap,j=new WeakMap,Qe=new WeakMap,ti=new WeakMap,ut=new WeakMap,yt=new WeakMap,vt=new WeakMap,xt=new WeakMap,$e=new WeakMap,ei=new WeakMap,N=new WeakMap,K=new WeakMap,kt=new WeakMap,ii=new WeakMap,ri=new WeakMap,b=new WeakSet,Ts=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},T=new WeakMap,cn=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];n(this,T,[]),i[0]&&t(this,T).push(0),i[1]&&t(this,T).push(1),i[2]&&t(this,T).push(2),t(this,T).length===0&&t(this,T).push(0),t(this,T).includes(t(this,N))||n(this,N,t(this,T)[0])},pn=function(e){const i=t(this,j).getBoundingClientRect(),r=e.clientY-i.top,o=i.height/3;let a;r<o?a=0:r<o*2?a=1:a=2,a=Math.min(a,t(this,T).length-1),n(this,N,t(this,T)[a]),t(this,j).setAttribute("data-pos",String(a)),t(this,j).setAttribute("aria-valuenow",String(a+1)),t(this,j).setAttribute("aria-valuetext",St[t(this,N)]),h(this,b,br).call(this),h(this,b,gr).call(this)},un=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},r=t(this,j).getBoundingClientRect(),o=Math.min(Math.floor((e.clientY-r.top)/(r.height/t(this,T).length)),t(this,T).length-1),a=St[t(this,T)[Math.max(0,o)]];t(this,j).title=`Dial mode: ${i[a]??a}`},vn=function(e){const i=t(this,T).indexOf(t(this,N));let r=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")r=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")r=Math.min(t(this,T).length-1,i+1);else return;e.preventDefault(),n(this,N,t(this,T)[r]),t(this,j).setAttribute("data-pos",String(r)),t(this,j).setAttribute("aria-valuenow",String(r+1)),t(this,j).setAttribute("aria-valuetext",St[t(this,N)]),h(this,b,br).call(this),h(this,b,gr).call(this)},gr=function(){t(this,X)&&(t(this,X).style.transition="none"),t(this,R)&&(t(this,R).style.transition="none"),h(this,b,fn).call(this),t(this,X)?.getBoundingClientRect(),t(this,R)?.getBoundingClientRect(),t(this,X)&&(t(this,X).style.transition=""),t(this,R)&&(t(this,R).style.transition="")},br=function(){if(!t(this,R))return;const e=St[t(this,N)],i=e==="color"||e==="temp";t(this,Ji).style.display=i?"none":"",t(this,R).style.display=i?"none":"",t(this,Qe)&&t(this,Qe).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,ti)&&t(this,ti).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,R).setAttribute("stroke-dasharray",String($t));const r={brightness:"brightness",temp:"color temperature",color:"color"},o={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,$)?.setAttribute("aria-label",`${p(this.def.friendly_name)} ${r[e]}`),t(this,$)&&(t(this,$).title=o[e]),t(this,$)&&(t(this,$).setAttribute("aria-valuemin",e==="temp"?String(t(this,K)):"0"),t(this,$).setAttribute("aria-valuemax",e==="temp"?String(t(this,kt)):e==="color"?"360":"100"))},fn=function(){const e=St[t(this,N)];if(e==="brightness"){const i=t(this,xt)?t(this,ut):0;h(this,b,Yi).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,yt)-t(this,K))/(t(this,kt)-t(this,K))*100);h(this,b,Yi).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,vt)/360*100);h(this,b,Yi).call(this,i)}},Yi=function(e){const i=St[t(this,N)],r=e/100*E,o=bt(it-r);if(t(this,X)?.setAttribute("cx",String(o.x)),t(this,X)?.setAttribute("cy",String(o.y)),t(this,ei)?.setAttribute("cx",String(o.x)),t(this,ei)?.setAttribute("cy",String(o.y)),i==="brightness"){const a=$t*(1-e/100);t(this,R)?.setAttribute("stroke-dashoffset",String(a)),t(this,Lt)&&(t(this,Lt).textContent=e+"%"),t(this,$)?.setAttribute("aria-valuenow",String(e)),t(this,$)?.setAttribute("aria-valuetext",`${e}%`)}else if(i==="temp"){const a=Math.round(t(this,K)+e/100*(t(this,kt)-t(this,K)));t(this,Lt)&&(t(this,Lt).textContent=a+"K"),t(this,$)?.setAttribute("aria-valuenow",String(a)),t(this,$)?.setAttribute("aria-valuetext",`${a} kelvin`)}else{const a=Math.round(e/100*360);t(this,Lt)&&(t(this,Lt).textContent=a+"°"),t(this,$)?.setAttribute("aria-valuenow",String(a)),t(this,$)?.setAttribute("aria-valuetext",`${a} degrees`)}},mn=function(e){n(this,$e,!0),t(this,$)?.setPointerCapture(e.pointerId),h(this,b,Pr).call(this,e)},gn=function(e){t(this,$e)&&h(this,b,Pr).call(this,e)},Dr=function(e){if(t(this,$e)){n(this,$e,!1);try{t(this,$)?.releasePointerCapture(e.pointerId)}catch{}t(this,ii).call(this)}},bn=function(e){const i=St[t(this,N)];let r=Math.round(i==="brightness"?t(this,ut)/255*100:i==="temp"?(t(this,yt)-t(this,K))/(t(this,kt)-t(this,K))*100:t(this,vt)/360*100);if(e.key==="ArrowDown"||e.key==="ArrowLeft")r-=1;else if(e.key==="ArrowUp"||e.key==="ArrowRight")r+=1;else if(e.key==="PageDown")r-=10;else if(e.key==="PageUp")r+=10;else if(e.key==="Home")r=0;else if(e.key==="End")r=100;else return;e.preventDefault(),r=Math.max(0,Math.min(100,r)),i==="brightness"?n(this,ut,Math.round(r/100*255)):i==="temp"?n(this,yt,Math.round(t(this,K)+r/100*(t(this,kt)-t(this,K)))):n(this,vt,Math.round(r/100*360)),h(this,b,Yi).call(this,r),t(this,ii).call(this)},Pr=function(e){if(!t(this,$))return;const i=t(this,$).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let u=it-d;u<0&&(u+=360),u>E&&(u=u>E+(360-E)/2?0:E);const f=Math.round(u/E*100),y=St[t(this,N)];y==="brightness"?n(this,ut,Math.round(f/100*255)):y==="temp"?n(this,yt,Math.round(t(this,K)+f/100*(t(this,kt)-t(this,K)))):n(this,vt,Math.round(f/100*360)),t(this,R)&&(t(this,R).style.transition="none"),t(this,X)&&(t(this,X).style.transition="none"),h(this,b,Yi).call(this,f)},yn=function(){t(this,R)&&(t(this,R).style.transition=""),t(this,X)&&(t(this,X).style.transition="");const e=St[t(this,N)];e==="brightness"?t(this,ut)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,ut)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,yt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,vt),100]})};const Jn=Lr+`
    .hrv-fan-feat-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: var(--hrv-color-primary, #1976d2);
      cursor: pointer;
      flex-shrink: 0;
      padding: 0;
      transition: box-shadow var(--hrv-transition-speed, 0.2s), opacity var(--hrv-transition-speed, 0.2s);
    }
    .hrv-fan-feat-btn[data-on=true]  { box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff); opacity: 1; }
    .hrv-fan-feat-btn[data-on=false] { opacity: 0.45; box-shadow: none; }
    .hrv-fan-feat-btn:hover { opacity: 0.88; }
    .hrv-dial-controls [part=toggle-button] { margin-top: 8px; }
    .hrv-fan-horiz .hrv-dial-controls [part=toggle-button] { margin-top: 0; }
    .hrv-dial-controls { padding-bottom: var(--hrv-card-padding, 16px); }
    .hrv-dial-wrap { max-width: 200px; margin: 0 auto; }
    .hrv-fan-stepped-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--hrv-card-padding, 16px) 0;
    }
    .hrv-fan-speed-circle {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: none;
      background: var(--hrv-color-primary, #1976d2);
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      box-shadow: none;
      user-select: none;
      transition: box-shadow var(--hrv-transition-speed, 0.2s), opacity var(--hrv-transition-speed, 0.2s);
    }
    .hrv-fan-speed-svg {
      width: 56px;
      height: 56px;
      display: block;
      pointer-events: none;
      fill: currentColor;
    }
    .hrv-fan-speed-circle[aria-pressed=false] { opacity: 0.45; }
    .hrv-fan-speed-circle[aria-pressed=true]  { box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff); }
    .hrv-fan-speed-circle:active { transition: none; opacity: 0.75; }
    .hrv-fan-hspeed-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: var(--hrv-card-padding, 16px);
    }
    .hrv-fan-hspeed-switch {
      position: relative;
      display: inline-flex;
      flex-direction: row;
      height: 32px;
      background: var(--hrv-color-surface-alt, rgba(255,255,255,0.15));
      border-radius: 16px;
      cursor: pointer;
      user-select: none;
    }
    .hrv-fan-hspeed-thumb {
      position: absolute;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      top: 2px;
      left: 2px;
      transition: left var(--hrv-transition-speed, 0.15s) ease, opacity var(--hrv-transition-speed, 0.2s);
      pointer-events: none;
      opacity: 0;
    }
    .hrv-fan-hspeed-switch[data-on=true] .hrv-fan-hspeed-thumb { opacity: 1; }
    .hrv-fan-hspeed-dot {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .hrv-fan-hspeed-dot::after {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--hrv-color-text, rgba(255,255,255,0.6));
      opacity: 0.4;
      pointer-events: none;
      display: block;
    }
    .hrv-fan-hspeed-dot[data-active=true]::after { opacity: 0; }

    .hrv-fan-ro-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--hrv-spacing-m, 16px) 0;
    }
    .hrv-fan-ro-circle {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: var(--hrv-color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.35;
    }
    .hrv-fan-ro-circle [part=ro-state-icon] {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      pointer-events: none;
    }
    .hrv-fan-ro-circle [part=ro-state-icon] svg { width: 40px; height: 40px; }
    .hrv-fan-ro-circle[data-on=true] [part=ro-state-icon] svg {
      animation: hrv-fan-spin 2s linear infinite;
      transform-origin: center;
    }
    @keyframes hrv-fan-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    [part=card-body].hrv-no-dial [part=toggle-button] {
      width: 96px;
      height: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    [part=card-body].hrv-no-dial [part=toggle-button][aria-pressed=false] { opacity: 0.45; }
    [part=fan-onoff-icon] { color: var(--hrv-color-on-primary, #fff); }
    [part=fan-onoff-icon] svg { width: 56px; height: 56px; display: block; pointer-events: none; }
    [part=toggle-button][aria-pressed=true][data-animate=true] [part=fan-onoff-icon] svg {
      animation: hrv-fan-spin 2s linear infinite;
      transform-origin: center;
    }

    @media (prefers-reduced-motion: reduce) {
      .hrv-fan-hspeed-thumb { transition: none; }
      .hrv-fan-ro-circle[data-on=true] [part=ro-state-icon] svg { animation: none; }
      [part=toggle-button][aria-pressed=true][data-animate=true] [part=fan-onoff-icon] svg { animation: none; }
    }
  `;class Qn extends g{constructor(e,i,r,o){super(e,i,r,o);s(this,m);s(this,wt,null);s(this,rt,null);s(this,pr,null);s(this,J,null);s(this,ni,null);s(this,Z,null);s(this,Mt,null);s(this,Et,null);s(this,Ht,null);s(this,Q,!1);s(this,H,0);s(this,oe,!1);s(this,Zt,"forward");s(this,tt,null);s(this,q,[]);s(this,Se,!1);s(this,si,null);s(this,oi);n(this,oi,Nt(h(this,m,Cn).bind(this),300)),n(this,q,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},o=r.display_mode??null;let a=i.includes("set_speed");const l=r.show_oscillate!==!1&&i.includes("oscillate"),d=r.show_direction!==!1&&i.includes("direction"),u=r.show_presets!==!1&&i.includes("preset_mode");o==="on-off"&&(a=!1);let f=e&&a,y=f&&t(this,m,or),_=y&&!t(this,q).length,I=y&&!!t(this,q).length;o==="continuous"?(y=!1,_=!1,I=!1):o==="stepped"?(I=!1,_=y&&!t(this,q).length):o==="cycle"&&(y=!0,I=!0,_=!1);const L=bt(it);this.root.innerHTML=`
        <style>${Jn}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${f?_?"hrv-fan-horiz":"":"hrv-no-dial"}">
            ${f?`
              <div class="hrv-dial-column">
                ${_?`
                  <div class="hrv-fan-hspeed-wrap">
                    <div class="hrv-fan-hspeed-switch" role="group"
                      aria-label="${p(this.def.friendly_name)} speed"
                      data-on="false">
                      <div class="hrv-fan-hspeed-thumb"></div>
                      ${t(this,m,xr).map((w,M)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${w}" data-idx="${M}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${M+1} (${w}%)"
                          title="Speed ${M+1} (${w}%)"></div>
                      `).join("")}
                    </div>
                  </div>
                `:I?`
                  <div class="hrv-fan-stepped-wrap">
                    <button class="hrv-fan-speed-circle" part="speed-circle" type="button"
                      aria-pressed="false"
                      title="Click to increase fan speed"
                      aria-label="Click to increase fan speed"><svg class="hrv-fan-speed-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg></button>
                  </div>
                `:`
                  <div class="hrv-dial-wrap" role="slider" tabindex="0"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                    aria-label="${p(this.def.friendly_name)} speed"
                    title="Drag to adjust fan speed">
                    <svg viewBox="0 0 120 120">
                      <path class="hrv-dial-track" d="${Je}" />
                      <path class="hrv-dial-fill" d="${Je}"
                        stroke-dasharray="${$t}"
                        stroke-dashoffset="${$t}" />
                      <circle class="hrv-dial-thumb" r="7"
                        cx="${L.x}" cy="${L.y}" />
                      <circle class="hrv-dial-thumb-hit" r="16"
                        cx="${L.x}" cy="${L.y}" />
                    </svg>
                    <span class="hrv-dial-pct">0%</span>
                  </div>
                `}
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-fan-ro-center">
                <div class="hrv-fan-ro-circle" data-on="false"
                  role="img" aria-label="${p(this.def.friendly_name)}"
                  title="Read-only">
                  <span part="ro-state-icon" aria-hidden="true"></span>
                </div>
              </div>
            `}
            ${e?`
              <div class="hrv-dial-controls">
                ${l?`
                  <button class="hrv-fan-feat-btn" data-feat="oscillate" type="button"
                    aria-label="Oscillate: off" title="Oscillate: off"></button>
                `:""}
                ${d?`
                  <button class="hrv-fan-feat-btn" data-feat="direction" type="button"
                    aria-label="Direction: forward" title="Direction: forward"></button>
                `:""}
                ${u?`
                  <button class="hrv-fan-feat-btn" data-feat="preset" type="button"
                    aria-label="Preset: none" title="Preset: none"></button>
                `:""}
                <button part="toggle-button" type="button"
                  aria-label="${p(this.def.friendly_name)} - toggle"
                  title="Turn ${p(this.def.friendly_name)} on / off">${f?"":'<span part="fan-onoff-icon" aria-hidden="true"></span>'}</button>
              </div>
            `:""}
          </div>
          ${f?"":this.renderCompanionZoneHTML()}
        </div>
      `,n(this,wt,this.root.querySelector("[part=toggle-button]")),n(this,rt,this.root.querySelector(".hrv-dial-fill")),n(this,pr,this.root.querySelector(".hrv-dial-track")),n(this,J,this.root.querySelector(".hrv-dial-thumb")),n(this,ni,this.root.querySelector(".hrv-dial-pct")),n(this,Z,this.root.querySelector(".hrv-dial-wrap")),n(this,si,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,Mt,this.root.querySelector('[data-feat="oscillate"]')),n(this,Et,this.root.querySelector('[data-feat="direction"]')),n(this,Ht,this.root.querySelector('[data-feat="preset"]')),t(this,wt)&&!f&&(this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"fan-onoff-icon"),t(this,wt).setAttribute("data-animate",String(!!this.config.animate))),this._attachGestureHandlers(t(this,wt),{onTap:()=>{const w=this.config.gestureConfig?.tap;if(w){this._runAction(w);return}this.config.card?.sendCommand("toggle",{})}}),t(this,Z)&&(t(this,Z).addEventListener("pointerdown",h(this,m,xn).bind(this)),t(this,Z).addEventListener("pointermove",h(this,m,wn).bind(this)),t(this,Z).addEventListener("pointerup",h(this,m,jr).bind(this)),t(this,Z).addEventListener("pointercancel",h(this,m,jr).bind(this)),t(this,Z).addEventListener("keydown",h(this,m,_n).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const w=t(this,m,xr);if(!w.length)return;let M;if(!t(this,Q)||t(this,H)===0)M=w[0],n(this,Q,!0),t(this,wt)?.setAttribute("aria-pressed","true");else{const C=w.findIndex(U=>U>t(this,H));M=C===-1?w[0]:w[C]}n(this,H,M),h(this,m,Br).call(this),this.config.card?.sendCommand("set_percentage",{percentage:M})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(w=>{const M=()=>{const C=Number(w.getAttribute("data-pct"));t(this,Q)||(n(this,Q,!0),t(this,wt)?.setAttribute("aria-pressed","true")),n(this,H,C),h(this,m,Rr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:C})};w.addEventListener("click",M),w.addEventListener("keydown",C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),M())})}),t(this,Mt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,oe)})}),t(this,Et)?.addEventListener("click",()=>{const w=t(this,Zt)==="forward"?"reverse":"forward";n(this,Zt,w),h(this,m,Gi).call(this),this.config.card?.sendCommand("set_direction",{direction:w})}),t(this,Ht)?.addEventListener("click",()=>{if(t(this,q).length){if(t(this,m,zr)){const w=t(this,tt)??t(this,q)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:w});return}if(t(this,tt)){const w=t(this,q).indexOf(t(this,tt));if(w===-1||w===t(this,q).length-1){n(this,tt,null),h(this,m,Gi).call(this);const M=t(this,m,yr),C=Math.floor(t(this,H)/M)*M||M;this.config.card?.sendCommand("set_percentage",{percentage:C})}else{const M=t(this,q)[w+1];n(this,tt,M),h(this,m,Gi).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:M})}}else{const w=t(this,q)[0];n(this,tt,w),h(this,m,Gi).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:w})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(w=>{w.title=w.getAttribute("aria-label")??"Companion"})}applyState(e,i){n(this,Q,e==="on"),n(this,H,i?.percentage??0),n(this,oe,i?.oscillating??!1),n(this,Zt,i?.direction??"forward"),n(this,tt,i?.preset_mode??null),i?.preset_modes?.length&&n(this,q,i.preset_modes),t(this,wt)&&t(this,wt).setAttribute("aria-pressed",String(t(this,Q)));const r=this.root.querySelector(".hrv-fan-ro-circle");r&&r.setAttribute("data-on",String(t(this,Q))),t(this,m,or)&&!t(this,q).length?h(this,m,Rr).call(this):t(this,m,or)?h(this,m,Br).call(this):h(this,m,An).call(this),h(this,m,Gi).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,H)>0?`, ${Math.round(t(this,H))}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,Q)?"off":"on",attributes:{percentage:t(this,H)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,oe),direction:t(this,Zt),preset_mode:t(this,tt),preset_modes:t(this,q)}}:null}}wt=new WeakMap,rt=new WeakMap,pr=new WeakMap,J=new WeakMap,ni=new WeakMap,Z=new WeakMap,Mt=new WeakMap,Et=new WeakMap,Ht=new WeakMap,Q=new WeakMap,H=new WeakMap,oe=new WeakMap,Zt=new WeakMap,tt=new WeakMap,q=new WeakMap,Se=new WeakMap,si=new WeakMap,oi=new WeakMap,m=new WeakSet,yr=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},or=function(){return t(this,m,yr)>1},zr=function(){return t(this,m,or)&&t(this,q).length>0},xr=function(){const e=t(this,m,yr),i=[];for(let r=1;r*e<=100.001;r++)i.push(r*e);return i},Br=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,Q)));const i=t(this,Q)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},Rr=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),r=t(this,m,xr);let o=-1;if(t(this,Q)&&t(this,H)>0){let a=1/0;r.forEach((l,d)=>{const u=Math.abs(l-t(this,H));u<a&&(a=u,o=d)})}e.setAttribute("data-on",String(o>=0)),i&&o>=0&&(i.style.left=`${2+o*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((a,l)=>{a.setAttribute("data-active",String(l===o))})},Gi=function(){const e=t(this,m,zr);if(t(this,Mt)){const i=e||t(this,oe),r=e?"Oscillate":`Oscillate: ${t(this,oe)?"on":"off"}`;t(this,Mt).setAttribute("data-on",String(i)),t(this,Mt).setAttribute("aria-pressed",String(i)),t(this,Mt).setAttribute("aria-label",r),t(this,Mt).title=r}if(t(this,Et)){const i=t(this,Zt)!=="reverse",r=`Direction: ${t(this,Zt)}`;t(this,Et).setAttribute("data-on",String(i)),t(this,Et).setAttribute("aria-pressed",String(i)),t(this,Et).setAttribute("aria-label",r),t(this,Et).title=r}if(t(this,Ht)){const i=e||!!t(this,tt),r=e?t(this,tt)??t(this,q)[0]??"Preset":t(this,tt)?`Preset: ${t(this,tt)}`:"Preset: none";t(this,Ht).setAttribute("data-on",String(i)),t(this,Ht).setAttribute("aria-pressed",String(i)),t(this,Ht).setAttribute("aria-label",r),t(this,Ht).title=r}},xn=function(e){n(this,Se,!0),t(this,Z)?.setPointerCapture(e.pointerId),h(this,m,Or).call(this,e)},wn=function(e){t(this,Se)&&h(this,m,Or).call(this,e)},jr=function(e){if(t(this,Se)){n(this,Se,!1);try{t(this,Z)?.releasePointerCapture(e.pointerId)}catch{}t(this,oi).call(this)}},_n=function(e){let i=t(this,H);if(e.key==="ArrowDown"||e.key==="ArrowLeft")i-=1;else if(e.key==="ArrowUp"||e.key==="ArrowRight")i+=1;else if(e.key==="PageDown")i-=10;else if(e.key==="PageUp")i+=10;else if(e.key==="Home")i=0;else if(e.key==="End")i=100;else return;e.preventDefault(),n(this,H,Math.max(0,Math.min(100,i))),h(this,m,wr).call(this,t(this,H)),t(this,oi).call(this)},Or=function(e){if(!t(this,Z))return;const i=t(this,Z).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let u=it-d;u<0&&(u+=360),u>E&&(u=u>E+(360-E)/2?0:E),n(this,H,Math.round(u/E*100)),t(this,rt)&&(t(this,rt).style.transition="none"),t(this,J)&&(t(this,J).style.transition="none"),h(this,m,wr).call(this,t(this,H))},Cn=function(){t(this,rt)&&(t(this,rt).style.transition=""),t(this,J)&&(t(this,J).style.transition=""),t(this,H)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,H)})},wr=function(e){const i=$t*(1-e/100),r=bt(it-e/100*E);t(this,rt)?.setAttribute("stroke-dashoffset",String(i)),t(this,J)?.setAttribute("cx",String(r.x)),t(this,J)?.setAttribute("cy",String(r.y)),t(this,si)?.setAttribute("cx",String(r.x)),t(this,si)?.setAttribute("cy",String(r.y)),t(this,ni)&&(t(this,ni).textContent=`${e}%`),t(this,Z)?.setAttribute("aria-valuenow",String(e)),t(this,Z)?.setAttribute("aria-valuetext",`${e}%`)},An=function(){t(this,J)&&(t(this,J).style.transition="none"),t(this,rt)&&(t(this,rt).style.transition="none"),h(this,m,wr).call(this,t(this,Q)?t(this,H):0),t(this,J)?.getBoundingClientRect(),t(this,rt)?.getBoundingClientRect(),t(this,J)&&(t(this,J).style.transition=""),t(this,rt)&&(t(this,rt).style.transition="")};function ts(c,v,e){c/=255,v/=255,e/=255;const i=Math.max(c,v,e),r=Math.min(c,v,e),o=i-r;if(o===0)return 0;let a;return i===c?a=(v-e)/o%6:i===v?a=(e-c)/o+2:a=(c-v)/o+4,Math.round((a*60+360)%360)}const es=Lr+`
    [part=card-body] {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      padding: 0 var(--hrv-card-padding, 16px) 0;
    }

    .hrv-dial-wrap {
      flex: none;
      width: 100%;
      max-width: 260px;
      margin: 0 auto;
    }

    .hrv-climate-current {
      text-align: center;
      padding: 6px 0 0;
    }
    .hrv-climate-current-label {
      display: block;
      font-size: 12px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.6));
    }
    .hrv-climate-current-val {
      display: block;
      font-size: 26px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      line-height: 1.2;
    }

    .hrv-climate-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
      user-select: none;
      width: 65%;
    }
    .hrv-climate-state-text {
      display: block;
      font-size: 13px;
      color: var(--hrv-color-text, #fff);
      margin-bottom: 2px;
    }
    .hrv-climate-temp-row {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      line-height: 1;
    }
    .hrv-climate-temp-int {
      font-size: 52px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
    }
    .hrv-climate-temp-frac {
      font-size: 20px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      align-self: flex-end;
      padding-bottom: 6px;
    }
    .hrv-climate-temp-unit {
      font-size: 13px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
      align-self: flex-start;
      padding-top: 5px;
      padding-left: 2px;
    }

    .hrv-climate-stepper {
      display: flex;
      justify-content: center;
      gap: 36px;
      padding: 6px 0 14px;
    }
    .hrv-climate-step {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 2px solid var(--hrv-ex-outline, rgba(255,255,255,0.35));
      background: transparent;
      color: var(--hrv-color-text, #fff);
      font-size: 1.6rem;
      font-weight: 300;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      transition: border-color 0.15s, background 0.15s;
    }
    .hrv-climate-step:active,
    .hrv-climate-step[data-pressing=true] {
      border-color: var(--hrv-ex-ring, #fff);
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.1));
      transition: none;
    }

    .hrv-climate-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding-bottom: 16px;
      position: relative;
    }
    .hrv-cf-btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 11px 13px;
      border: none;
      border-radius: var(--hrv-radius-m, 12px);
      background: var(--hrv-color-surface-alt, rgba(255,255,255,0.1));
      color: var(--hrv-color-text, #fff);
      cursor: pointer;
      text-align: left;
      gap: 3px;
      font-family: inherit;
      min-width: 0;
      transition: opacity 0.15s;
    }
    .hrv-cf-btn:active,
    .hrv-cf-btn[data-pressing=true] { opacity: 0.65; transition: none; }
    .hrv-cf-label {
      font-size: 11px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.55));
    }
    .hrv-cf-value {
      font-size: var(--hrv-font-size-s, 14px);
      font-weight: var(--hrv-font-weight-medium, 500);
      color: var(--hrv-color-text, #fff);
    }

    /* Climate dropdown - rendered as a popover in the top layer so it
       escapes any ancestor stacking context or overflow:hidden. */
    .hrv-climate-dropdown {
      position: fixed;
      margin: 0;
      inset: unset;
      background: var(--hrv-card-background, var(--hrv-ex-glass-bg, rgba(40,40,40,0.95)));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--hrv-ex-glass-border, rgba(255,255,255,0.12));
      border-radius: var(--hrv-radius-s, 8px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.30);
      max-height: 280px;
      overflow-y: auto;
      scrollbar-width: thin;
      padding: 4px;
      color: var(--hrv-color-text, #fff);
      font-family: inherit;
    }
    .hrv-climate-dropdown:not(:popover-open) { display: none; }
    .hrv-cf-option {
      display: block;
      width: 100%;
      padding: 12px 14px;
      border: none;
      background: transparent;
      color: var(--hrv-color-text, #fff);
      text-align: left;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      border-radius: 6px;
      transition: background 0.1s;
    }
    .hrv-cf-option + .hrv-cf-option {
      border-top: 1px solid var(--hrv-ex-glass-border, rgba(255,255,255,0.06));
    }
    .hrv-cf-option:hover { background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.08)); }
    .hrv-cf-option[data-active=true] { color: var(--hrv-color-primary, #1976d2); }

    .hrv-cf-btn[data-readonly=true] {
      cursor: not-allowed;
    }
    .hrv-climate-ro-temp {
      text-align: center;
      padding: 24px 0 16px;
    }
    .hrv-climate-ro-temp-row {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      line-height: 1;
    }
    .hrv-climate-ro-temp-int {
      font-size: 52px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
    }
    .hrv-climate-ro-temp-frac {
      font-size: 20px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      align-self: flex-end;
      padding-bottom: 6px;
    }
    .hrv-climate-ro-temp-unit {
      font-size: 13px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
      align-self: flex-start;
      padding-top: 5px;
      padding-left: 2px;
    }
  `;class is extends g{constructor(e,i,r,o){super(e,i,r,o);s(this,x);s(this,dt,null);s(this,Yt,null);s(this,Tt,null);s(this,ai,null);s(this,ae,!1);s(this,hi,null);s(this,di,null);s(this,li,null);s(this,nt,null);s(this,st,null);s(this,ci,null);s(this,pi,null);s(this,ui,null);s(this,vi,null);s(this,Y,null);s(this,Le,null);s(this,It,null);s(this,ot,null);s(this,at,20);s(this,qt,"off");s(this,fi,null);s(this,mi,null);s(this,gi,null);s(this,Dt,16);s(this,he,32);s(this,ke,.5);s(this,bi,"°C");s(this,yi,[]);s(this,xi,[]);s(this,wi,[]);s(this,_i,[]);s(this,Qi,{});s(this,Ci);n(this,Ci,Nt(h(this,x,Mn).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),o=i.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),a=i.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),l=i.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);n(this,Dt,this.def.feature_config?.min_temp??16),n(this,he,this.def.feature_config?.max_temp??32),n(this,ke,this.def.feature_config?.temp_step??.5),n(this,bi,this.def.unit_of_measurement??"°C"),n(this,yi,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),n(this,xi,this.def.feature_config?.fan_modes??[]),n(this,wi,this.def.feature_config?.preset_modes??[]),n(this,_i,this.def.feature_config?.swing_modes??[]);const d=h(this,x,Vr).call(this,t(this,at)),u=bt(it),f=bt(it-d/100*E),y=$t*(1-d/100),[_,I]=t(this,at).toFixed(1).split(".");this.root.innerHTML=`
        <style>${es}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e&&r?`
              <div class="hrv-dial-wrap">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path class="hrv-dial-track" d="${Je}"/>
                  <path class="hrv-dial-fill" d="${Je}"
                    stroke-dasharray="${$t}" stroke-dashoffset="${y}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${p(_)}</span><span class="hrv-climate-temp-frac">.${p(I)}</span><span class="hrv-climate-temp-unit">${p(t(this,bi))}</span>
                  </div>
                </div>
              </div>
              <div class="hrv-climate-stepper">
                <button class="hrv-climate-step" type="button" aria-label="Decrease temperature" title="Decrease temperature" data-dir="-">&#8722;</button>
                <button class="hrv-climate-step" type="button" aria-label="Increase temperature" title="Increase temperature" data-dir="+">+</button>
              </div>
            `:!e&&r?`
              <div class="hrv-climate-ro-temp">
                <div class="hrv-climate-ro-temp-row">
                  <span class="hrv-climate-ro-temp-int">${p(_)}</span><span class="hrv-climate-ro-temp-frac">.${p(I)}</span><span class="hrv-climate-ro-temp-unit">${p(t(this,bi))}</span>
                </div>
              </div>
            `:""}
            <div class="hrv-climate-grid">
              ${i.show_hvac_modes!==!1&&t(this,yi).length?`
                <button class="hrv-cf-btn" data-feat="mode" type="button"
                  ${e?'title="Change HVAC mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${a&&t(this,wi).length?`
                <button class="hrv-cf-btn" data-feat="preset" type="button"
                  ${e?'title="Change preset mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Preset</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${o&&t(this,xi).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button"
                  ${e?'title="Change fan mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${l&&t(this,_i).length?`
                <button class="hrv-cf-btn" data-feat="swing" type="button"
                  ${e?'title="Change swing mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Swing mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${e?'<div class="hrv-climate-dropdown" role="listbox" popover="manual"></div>':""}
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,dt,this.root.querySelector(".hrv-dial-wrap")),n(this,Yt,this.root.querySelector(".hrv-dial-fill")),n(this,Tt,this.root.querySelector(".hrv-dial-thumb")),n(this,ai,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,hi,this.root.querySelector(".hrv-climate-state-text")),n(this,di,this.root.querySelector(".hrv-climate-temp-int")),n(this,li,this.root.querySelector(".hrv-climate-temp-frac")),n(this,nt,this.root.querySelector("[data-dir='-']")),n(this,st,this.root.querySelector("[data-dir='+']")),n(this,ci,this.root.querySelector("[data-feat=mode]")),n(this,pi,this.root.querySelector("[data-feat=fan]")),n(this,ui,this.root.querySelector("[data-feat=preset]")),n(this,vi,this.root.querySelector("[data-feat=swing]")),n(this,Y,this.root.querySelector(".hrv-climate-dropdown")),t(this,dt)&&(t(this,dt).addEventListener("pointerdown",h(this,x,Ln).bind(this)),t(this,dt).addEventListener("pointermove",h(this,x,kn).bind(this)),t(this,dt).addEventListener("pointerup",h(this,x,Nr).bind(this)),t(this,dt).addEventListener("pointercancel",h(this,x,Nr).bind(this))),t(this,nt)&&(t(this,nt).addEventListener("click",()=>h(this,x,Wr).call(this,-1)),t(this,nt).addEventListener("pointerdown",()=>t(this,nt).setAttribute("data-pressing","true")),t(this,nt).addEventListener("pointerup",()=>t(this,nt).removeAttribute("data-pressing")),t(this,nt).addEventListener("pointerleave",()=>t(this,nt).removeAttribute("data-pressing")),t(this,nt).addEventListener("pointercancel",()=>t(this,nt).removeAttribute("data-pressing"))),t(this,st)&&(t(this,st).addEventListener("click",()=>h(this,x,Wr).call(this,1)),t(this,st).addEventListener("pointerdown",()=>t(this,st).setAttribute("data-pressing","true")),t(this,st).addEventListener("pointerup",()=>t(this,st).removeAttribute("data-pressing")),t(this,st).addEventListener("pointerleave",()=>t(this,st).removeAttribute("data-pressing")),t(this,st).addEventListener("pointercancel",()=>t(this,st).removeAttribute("data-pressing"))),e&&[t(this,ci),t(this,pi),t(this,ui),t(this,vi)].forEach(L=>{if(!L)return;const _e=L.getAttribute("data-feat");L.addEventListener("click",()=>h(this,x,Sn).call(this,_e)),L.addEventListener("pointerdown",()=>L.setAttribute("data-pressing","true")),L.addEventListener("pointerup",()=>L.removeAttribute("data-pressing")),L.addEventListener("pointerleave",()=>L.removeAttribute("data-pressing")),L.addEventListener("pointercancel",()=>L.removeAttribute("data-pressing"))}),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Qi,{...i}),n(this,qt,e),n(this,fi,i.fan_mode??null),n(this,mi,i.preset_mode??null),n(this,gi,i.swing_mode??null),!t(this,ae)&&i.temperature!==void 0&&(n(this,at,i.temperature),h(this,x,_r).call(this)),t(this,hi)&&(t(this,hi).textContent=Ke(i.hvac_action??e));const r=this.root.querySelector(".hrv-climate-ro-temp-int"),o=this.root.querySelector(".hrv-climate-ro-temp-frac");if(r&&i.temperature!==void 0){n(this,at,i.temperature);const[d,u]=t(this,at).toFixed(1).split(".");r.textContent=d,o.textContent=`.${u}`}h(this,x,En).call(this);const a=i.hvac_action??e,l=Ke(a);this.announceState(`${this.def.friendly_name}, ${l}`)}predictState(e,i){const r={...t(this,Qi)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:r}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,qt),attributes:{...r,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,qt),attributes:{...r,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,qt),attributes:{...r,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,qt),attributes:{...r,swing_mode:i.swing_mode}}:null}destroy(){t(this,It)&&(document.removeEventListener("pointerdown",t(this,It),!0),n(this,It,null)),t(this,ot)&&(window.removeEventListener("scroll",t(this,ot),!0),window.removeEventListener("resize",t(this,ot)),n(this,ot,null));try{t(this,Y)?.hidePopover?.()}catch{}}}dt=new WeakMap,Yt=new WeakMap,Tt=new WeakMap,ai=new WeakMap,ae=new WeakMap,hi=new WeakMap,di=new WeakMap,li=new WeakMap,nt=new WeakMap,st=new WeakMap,ci=new WeakMap,pi=new WeakMap,ui=new WeakMap,vi=new WeakMap,Y=new WeakMap,Le=new WeakMap,It=new WeakMap,ot=new WeakMap,at=new WeakMap,qt=new WeakMap,fi=new WeakMap,mi=new WeakMap,gi=new WeakMap,Dt=new WeakMap,he=new WeakMap,ke=new WeakMap,bi=new WeakMap,yi=new WeakMap,xi=new WeakMap,wi=new WeakMap,_i=new WeakMap,Qi=new WeakMap,Ci=new WeakMap,x=new WeakSet,Vr=function(e){return Math.max(0,Math.min(100,(e-t(this,Dt))/(t(this,he)-t(this,Dt))*100))},$n=function(e){const i=t(this,Dt)+e/100*(t(this,he)-t(this,Dt)),r=Math.round(i/t(this,ke))*t(this,ke);return Math.max(t(this,Dt),Math.min(t(this,he),+r.toFixed(10)))},Sn=function(e){if(t(this,Le)===e){h(this,x,ar).call(this);return}t(this,Le)&&h(this,x,ar).call(this),n(this,Le,e);let i=[],r=null,o="",a="";switch(e){case"mode":i=t(this,yi),r=t(this,qt),o="set_hvac_mode",a="hvac_mode";break;case"fan":i=t(this,xi),r=t(this,fi),o="set_fan_mode",a="fan_mode";break;case"preset":i=t(this,wi),r=t(this,mi),o="set_preset_mode",a="preset_mode";break;case"swing":i=t(this,_i),r=t(this,gi),o="set_swing_mode",a="swing_mode";break}if(!i.length||!t(this,Y))return;t(this,Y).innerHTML=i.map(u=>`
        <button class="hrv-cf-option" data-active="${u===r}" role="option"
          aria-selected="${u===r}" type="button">
          ${p(Ke(u))}
        </button>
      `).join(""),t(this,Y).querySelectorAll(".hrv-cf-option").forEach((u,f)=>{u.addEventListener("click",()=>{this.config.card?.sendCommand(o,{[a]:i[f]}),h(this,x,ar).call(this)})});const l=this.root.querySelector(`[data-feat="${e}"]`);try{t(this,Y).showPopover?.()}catch{}h(this,x,Fr).call(this,l),n(this,ot,()=>h(this,x,Fr).call(this,l)),window.addEventListener("scroll",t(this,ot),!0),window.addEventListener("resize",t(this,ot));const d=u=>{u.composedPath().some(y=>y===this.root||y===this.root.host)||h(this,x,ar).call(this)};n(this,It,d),document.addEventListener("pointerdown",d,!0)},Fr=function(e){if(!t(this,Y)||!e)return;const i=e.getBoundingClientRect(),r=window.innerHeight-i.bottom,o=i.top,a=Math.min(t(this,Y).scrollHeight||280,280),l=Math.max(140,Math.round(i.width));t(this,Y).style.left=`${Math.round(i.left)}px`,t(this,Y).style.minWidth=`${l}px`,o>=a+8||o>r?t(this,Y).style.top=`${Math.max(8,Math.round(i.top-a-6))}px`:t(this,Y).style.top=`${Math.round(i.bottom+6)}px`},ar=function(){n(this,Le,null);try{t(this,Y)?.hidePopover?.()}catch{}t(this,It)&&(document.removeEventListener("pointerdown",t(this,It),!0),n(this,It,null)),t(this,ot)&&(window.removeEventListener("scroll",t(this,ot),!0),window.removeEventListener("resize",t(this,ot)),n(this,ot,null))},Wr=function(e){const i=Math.round((t(this,at)+e*t(this,ke))*100)/100;n(this,at,Math.max(t(this,Dt),Math.min(t(this,he),i))),h(this,x,_r).call(this),t(this,Ci).call(this)},_r=function(){const e=h(this,x,Vr).call(this,t(this,at)),i=$t*(1-e/100),r=bt(it-e/100*E);t(this,Yt)?.setAttribute("stroke-dashoffset",String(i)),t(this,Tt)?.setAttribute("cx",String(r.x)),t(this,Tt)?.setAttribute("cy",String(r.y)),t(this,ai)?.setAttribute("cx",String(r.x)),t(this,ai)?.setAttribute("cy",String(r.y));const[o,a]=t(this,at).toFixed(1).split(".");t(this,di)&&(t(this,di).textContent=o),t(this,li)&&(t(this,li).textContent=`.${a}`)},Ln=function(e){n(this,ae,!0),t(this,dt)?.setPointerCapture(e.pointerId),h(this,x,Zr).call(this,e)},kn=function(e){t(this,ae)&&h(this,x,Zr).call(this,e)},Nr=function(e){if(t(this,ae)){n(this,ae,!1);try{t(this,dt)?.releasePointerCapture(e.pointerId)}catch{}t(this,Yt)&&(t(this,Yt).style.transition=""),t(this,Tt)&&(t(this,Tt).style.transition="")}},Zr=function(e){if(!t(this,dt))return;const i=t(this,dt).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let u=it-d;u<0&&(u+=360),u>E&&(u=u>E+(360-E)/2?0:E),n(this,at,h(this,x,$n).call(this,u/E*100)),t(this,Yt)&&(t(this,Yt).style.transition="none"),t(this,Tt)&&(t(this,Tt).style.transition="none"),h(this,x,_r).call(this),t(this,Ci).call(this)},Mn=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,at)})},En=function(){const e=(i,r)=>{if(!i)return;const o=i.querySelector(".hrv-cf-value");o&&(o.textContent=Ke(r??"None"))};e(t(this,ci),t(this,qt)),e(t(this,pi),t(this,fi)),e(t(this,ui),t(this,mi)),e(t(this,vi),t(this,gi))};const rs=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--hrv-spacing-s) 0 var(--hrv-spacing-m);
    }

    .hrv-bs-circle {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: var(--hrv-color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.35;
      box-shadow: 0 0 0 0 transparent;
      transition:
        box-shadow 200ms ease,
        opacity 200ms ease;
    }

    .hrv-bs-circle[data-on=true] {
      opacity: 1;
      box-shadow: 0 0 0 5px var(--hrv-ex-ring, #fff);
    }

    [part=state-icon] {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      pointer-events: none;
    }
    [part=state-icon] svg { width: 40px; height: 40px; }
  `;class ns extends g{constructor(){super(...arguments);s(this,Me,null)}render(){this.root.innerHTML=`
        <style>${rs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-bs-circle" data-on="false"
              role="img" aria-label="${p(this.def.friendly_name)}">
              <span part="state-icon" aria-hidden="true"></span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Me,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"state-icon"),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=e==="on",o=this.formatStateLabel(e);t(this,Me)&&(t(this,Me).setAttribute("data-on",String(r)),t(this,Me).setAttribute("aria-label",`${this.def.friendly_name}: ${o}`));const a=r?"mdi:radiobox-marked":"mdi:radiobox-blank",l=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(l,a),"state-icon"),this.announceState(`${this.def.friendly_name}, ${o}`)}}Me=new WeakMap;const Qr='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',tn='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',kr='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',ss=`
    [part=card] {
      padding-bottom: 0 !important;
    }

    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      padding: 0 var(--hrv-card-padding, 16px) 0;
    }

    [part=companion-zone] {
      margin-top: 6px;
      border-top: none;
      padding-top: 0;
      padding-bottom: var(--hrv-card-padding, 16px);
      justify-content: center;
      gap: 12px;
    }
    [part=companion-zone]:empty { display: none; }

    .hrv-cover-slider-wrap {
      padding: 16px 8px 20px;
    }
    .hrv-cover-tilt-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 8px 20px;
      color: var(--hrv-color-text, #fff);
      font-size: var(--hrv-font-size-xs, 12px);
    }
    [part=tilt-slider] {
      flex: 1;
      accent-color: var(--hrv-color-primary, #1976d2);
      cursor: pointer;
    }
    [part=tilt-slider]:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
    .hrv-cover-slider-track {
      position: relative;
      height: 6px;
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.15));
      border-radius: 3px;
      cursor: pointer;
    }
    .hrv-cover-slider-fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: var(--hrv-color-primary, #1976d2);
      border-radius: 3px;
      transition: width 0.15s;
      pointer-events: none;
    }
    .hrv-cover-slider-thumb {
      position: absolute;
      top: 50%;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: transparent;
      border: 3px solid var(--hrv-ex-thumb, #fff);
      transform: translate(-50%, -50%);
      cursor: grab;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      transition: left 0.15s;
      box-sizing: border-box;
    }
    .hrv-cover-slider-thumb:active { cursor: grabbing; }
    @media (prefers-reduced-motion: reduce) {
      .hrv-cover-slider-fill,
      .hrv-cover-slider-thumb { transition: none; }
    }

    .hrv-cover-btns {
      display: flex;
      justify-content: center;
      gap: 24px;
      padding: 0 0 16px;
    }
    .hrv-cover-btn {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 2px solid var(--hrv-ex-outline, rgba(255,255,255,0.35));
      background: transparent;
      color: var(--hrv-color-text, #fff);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: border-color 0.15s, background 0.15s;
    }
    .hrv-cover-btn svg { width: 22px; height: 22px; }
    .hrv-cover-btn:active,
    .hrv-cover-btn[data-pressing=true] {
      border-color: var(--hrv-ex-ring, #fff);
      transition: none;
    }
    .hrv-cover-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .hrv-cover-btn:disabled:active { background: transparent; border-color: var(--hrv-ex-outline, rgba(255,255,255,0.35)); }

    .hrv-cover-ro-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--hrv-spacing-m, 16px) 0;
    }
    .hrv-cover-ro-circle {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.35;
    }
    .hrv-cover-ro-circle [part=cover-ro-icon] {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      pointer-events: none;
    }
    .hrv-cover-ro-circle [part=cover-ro-icon] svg {
      width: 40px;
      height: 40px;
      fill: currentColor;
      display: block;
    }
  `;class os extends g{constructor(e,i,r,o){super(e,i,r,o);s(this,Bt);s(this,Ee,null);s(this,Pt,null);s(this,D,null);s(this,He,null);s(this,Te,null);s(this,Ie,null);s(this,ft,null);s(this,de,null);s(this,Gt,!1);s(this,zt,0);s(this,Ai,"closed");s(this,tr,{});s(this,er);s(this,$i);n(this,er,Nt(h(this,Bt,Hn).bind(this),300)),n(this,$i,Nt(h(this,Bt,Tn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=i.show_position!==!1&&this.def.supported_features?.includes("set_position"),o=i.show_tilt!==!1&&this.def.supported_features?.includes("set_tilt_position"),a=!this.def.supported_features||this.def.supported_features.includes("buttons");this.root.innerHTML=`
        <style>${ss}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e?"":`
              <div class="hrv-cover-ro-center">
                <div class="hrv-cover-ro-circle" role="img"
                  aria-label="${p(this.def.friendly_name)}" title="Read-only">
                  <span part="cover-ro-icon" aria-hidden="true"></span>
                </div>
              </div>
            `}
            ${r?`
              <div class="hrv-cover-slider-wrap" title="${e?"Drag to set position":"Read-only"}">
                <div class="hrv-cover-slider-track" ${e?"":'style="cursor:not-allowed"'}>
                  <div class="hrv-cover-slider-fill" style="width:0%"></div>
                  <div class="hrv-cover-slider-thumb" style="left:0%;${e?"":"cursor:not-allowed;pointer-events:none"}"></div>
                </div>
              </div>
            `:""}
            ${o?`
              <label class="hrv-cover-tilt-wrap">
                <span>Tilt</span>
                <input part="tilt-slider" type="range" min="0" max="100" step="1" value="0"
                  ${e?"":"disabled"}
                  aria-label="${p(this.def.friendly_name)} tilt">
                <span part="tilt-value">0%</span>
              </label>
            `:""}
            ${e&&a?`
              <div class="hrv-cover-btns">
                <button class="hrv-cover-btn" data-action="open" type="button"
                  title="Open cover" aria-label="Open cover">${Qr}</button>
                <button class="hrv-cover-btn" data-action="stop" type="button"
                  title="Stop cover" aria-label="Stop cover">${tn}</button>
                <button class="hrv-cover-btn" data-action="close" type="button"
                  title="Close cover" aria-label="Close cover">${kr}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Ee,this.root.querySelector(".hrv-cover-slider-track")),n(this,Pt,this.root.querySelector(".hrv-cover-slider-fill")),n(this,D,this.root.querySelector(".hrv-cover-slider-thumb")),n(this,He,this.root.querySelector("[data-action=open]")),n(this,Te,this.root.querySelector("[data-action=stop]")),n(this,Ie,this.root.querySelector("[data-action=close]")),n(this,ft,this.root.querySelector("[part=tilt-slider]")),n(this,de,this.root.querySelector("[part=tilt-value]"));const l=this.root.querySelector("[part=cover-ro-icon]");if(l&&(l.innerHTML=kr),t(this,Ee)&&t(this,D)&&e){const d=f=>{n(this,Gt,!0),t(this,D).style.transition="none",t(this,Pt).style.transition="none",h(this,Bt,Cr).call(this,f),t(this,D).setPointerCapture(f.pointerId)};t(this,D).addEventListener("pointerdown",d),t(this,Ee).addEventListener("pointerdown",f=>{f.target!==t(this,D)&&(n(this,Gt,!0),t(this,D).style.transition="none",t(this,Pt).style.transition="none",h(this,Bt,Cr).call(this,f),t(this,D).setPointerCapture(f.pointerId))}),t(this,D).addEventListener("pointermove",f=>{t(this,Gt)&&h(this,Bt,Cr).call(this,f)});const u=()=>{t(this,Gt)&&(n(this,Gt,!1),t(this,D).style.transition="",t(this,Pt).style.transition="",t(this,er).call(this))};t(this,D).addEventListener("pointerup",u),t(this,D).addEventListener("pointercancel",u)}t(this,ft)&&e&&(t(this,ft).addEventListener("input",()=>{t(this,de)&&(t(this,de).textContent=`${t(this,ft).value}%`),t(this,$i).call(this)}),this.guardSlider(t(this,ft),t(this,$i))),[t(this,He),t(this,Te),t(this,Ie)].forEach(d=>{if(!d)return;const u=d.getAttribute("data-action");d.addEventListener("click",()=>{this.config.card?.sendCommand(`${u}_cover`,{})}),d.addEventListener("pointerdown",()=>d.setAttribute("data-pressing","true")),d.addEventListener("pointerup",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointerleave",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointercancel",()=>d.removeAttribute("data-pressing"))}),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Ai,e),n(this,tr,{...i});const r=e==="opening"||e==="closing",o=i.current_position;t(this,He)&&(t(this,He).disabled=!r&&o===100),t(this,Te)&&(t(this,Te).disabled=!r),t(this,Ie)&&(t(this,Ie).disabled=!r&&e==="closed"),i.current_position!==void 0&&!t(this,Gt)&&(n(this,zt,i.current_position),t(this,Pt)&&(t(this,Pt).style.width=`${t(this,zt)}%`),t(this,D)&&(t(this,D).style.left=`${t(this,zt)}%`)),i.current_tilt_position!==void 0&&t(this,ft)&&!this.isSliderActive(t(this,ft))&&(t(this,ft).value=String(i.current_tilt_position),t(this,de)&&(t(this,de).textContent=`${i.current_tilt_position}%`));const a=this.root.querySelector("[part=cover-ro-icon]");if(a){const l=e==="open"||e==="opening",d=e==="opening"||e==="closing";a.innerHTML=d?tn:l?Qr:kr}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const r={...t(this,tr)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,Ai),attributes:r}:e==="set_cover_position"&&i.position!==void 0?(r.current_position=i.position,{state:i.position>0?"open":"closed",attributes:r}):e==="set_cover_tilt_position"&&i.tilt_position!==void 0?(r.current_tilt_position=i.tilt_position,{state:t(this,Ai),attributes:r}):null}}Ee=new WeakMap,Pt=new WeakMap,D=new WeakMap,He=new WeakMap,Te=new WeakMap,Ie=new WeakMap,ft=new WeakMap,de=new WeakMap,Gt=new WeakMap,zt=new WeakMap,Ai=new WeakMap,tr=new WeakMap,er=new WeakMap,$i=new WeakMap,Bt=new WeakSet,Cr=function(e){const i=t(this,Ee).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,zt,Math.round(r)),t(this,Pt).style.width=`${t(this,zt)}%`,t(this,D).style.left=`${t(this,zt)}%`},Hn=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,zt)})},Tn=function(){const e=parseInt(t(this,ft)?.value??0,10);this.config.card?.sendCommand("set_cover_tilt_position",{tilt_position:e})};const as=`
    [part=card] {
      padding-bottom: 0 !important;
    }

    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      padding: var(--hrv-card-padding, 16px) var(--hrv-card-padding, 16px) 0;
    }

    .hrv-num-slider-wrap {
      padding: 20px 8px 20px;
    }
    .hrv-num-slider-track {
      position: relative;
      height: 6px;
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.15));
      border-radius: 3px;
      cursor: pointer;
    }
    .hrv-num-slider-fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: var(--hrv-color-primary, #1976d2);
      border-radius: 3px;
      transition: width 0.15s;
      pointer-events: none;
    }
    .hrv-num-slider-thumb {
      position: absolute;
      top: 50%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: transparent;
      border: 3px solid var(--hrv-ex-thumb, #fff);
      box-sizing: border-box;
      transform: translate(-50%, -50%);
      cursor: grab;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      transition: left 0.15s;
    }
    .hrv-num-slider-thumb:active { cursor: grabbing; }
    @media (prefers-reduced-motion: reduce) {
      .hrv-num-slider-fill,
      .hrv-num-slider-thumb { transition: none; }
    }

    .hrv-num-input-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      padding: 0 0 16px;
    }
    .hrv-num-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      color: var(--hrv-color-on-primary, #fff);
      cursor: pointer;
      padding: 0;
      font-size: 22px;
      font-weight: 300;
      line-height: 1;
      transition: opacity 150ms ease, box-shadow 150ms ease;
    }
    .hrv-num-btn:hover { opacity: 0.85; }
    .hrv-num-btn:focus-visible { box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff); }
    .hrv-num-btn:active { box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff); }
    .hrv-num-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      box-shadow: none;
    }
    .hrv-num-btn:disabled:hover { opacity: 0.35; }
    @media (prefers-reduced-motion: reduce) {
      .hrv-num-btn { transition: none; }
    }

    .hrv-num-input {
      width: 58px;
      padding: 4px 6px;
      border: 1.5px solid var(--hrv-ex-glass-border, rgba(255,255,255,0.18));
      border-radius: var(--hrv-radius-s, 8px);
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.10));
      color: var(--hrv-color-text, #fff);
      font-size: 18px;
      font-weight: 500;
      font-family: inherit;
      text-align: center;
      outline: none;
      -webkit-appearance: textfield;
      -moz-appearance: textfield;
      appearance: textfield;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .hrv-num-input::-webkit-outer-spin-button,
    .hrv-num-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .hrv-num-input:focus {
      border-color: var(--hrv-color-primary, #1976d2);
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.35);
    }
    .hrv-num-unit {
      font-size: 13px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.6));
    }

    .hrv-num-readonly {
      display: flex;
      align-items: baseline;
      justify-content: center;
      padding: 28px 0 32px;
      gap: 4px;
    }
    .hrv-num-readonly-val {
      font-size: 52px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      line-height: 1;
    }
    .hrv-num-readonly-unit {
      font-size: 18px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
    }

    [part=history-graph] {
      margin-top: 0;
      padding: 0;
      border-radius: 0 0 var(--hrv-radius-l, 16px) var(--hrv-radius-l, 16px);
      overflow: hidden;
    }
    [part=history-svg] {
      height: 56px;
      display: block;
    }
    [part=history-empty] { display: none; }
  `;class en extends g{constructor(e,i,r,o){super(e,i,r,o);s(this,k);s(this,qe,null);s(this,Ut,null);s(this,O,null);s(this,G,null);s(this,Si,null);s(this,le,null);s(this,ce,null);s(this,Xt,!1);s(this,V,0);s(this,lt,0);s(this,_t,100);s(this,Kt,1);s(this,pe);n(this,pe,Nt(h(this,k,Dn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints?.display_mode??null)!=="buttons";n(this,lt,this.def.feature_config?.min??0),n(this,_t,this.def.feature_config?.max??100),n(this,Kt,this.def.feature_config?.step??1);const o=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${as}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e?`
              ${r?`
                <div class="hrv-num-slider-wrap" title="Drag to set value">
                  <div class="hrv-num-slider-track">
                    <div class="hrv-num-slider-fill" style="width:0%"></div>
                    <div class="hrv-num-slider-thumb" style="left:0%"></div>
                  </div>
                </div>
              `:""}
              <div class="hrv-num-input-row">
                <button class="hrv-num-btn" type="button" part="dec-btn"
                  aria-label="Decrease ${p(this.def.friendly_name)}">-</button>
                <input class="hrv-num-input" type="number"
                  min="${t(this,lt)}" max="${t(this,_t)}" step="${t(this,Kt)}"
                  title="Enter value" aria-label="${p(this.def.friendly_name)} value">
                <button class="hrv-num-btn" type="button" part="inc-btn"
                  aria-label="Increase ${p(this.def.friendly_name)}">+</button>
                ${o?`<span class="hrv-num-unit">${p(o)}</span>`:""}
              </div>
            `:`
              <div class="hrv-num-readonly">
                <span class="hrv-num-readonly-val">-</span>
                ${o?`<span class="hrv-num-readonly-unit">${p(o)}</span>`:""}
              </div>
            `}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,qe,this.root.querySelector(".hrv-num-slider-track")),n(this,Ut,this.root.querySelector(".hrv-num-slider-fill")),n(this,O,this.root.querySelector(".hrv-num-slider-thumb")),n(this,G,this.root.querySelector(".hrv-num-input")),n(this,Si,this.root.querySelector(".hrv-num-readonly-val")),n(this,le,this.root.querySelector("[part=dec-btn]")),n(this,ce,this.root.querySelector("[part=inc-btn]")),t(this,qe)&&t(this,O)){const a=d=>{n(this,Xt,!0),t(this,O).style.transition="none",t(this,Ut).style.transition="none",h(this,k,Ar).call(this,d),t(this,O).setPointerCapture(d.pointerId)};t(this,O).addEventListener("pointerdown",a),t(this,qe).addEventListener("pointerdown",d=>{d.target!==t(this,O)&&(n(this,Xt,!0),t(this,O).style.transition="none",t(this,Ut).style.transition="none",h(this,k,Ar).call(this,d),t(this,O).setPointerCapture(d.pointerId))}),t(this,O).addEventListener("pointermove",d=>{t(this,Xt)&&h(this,k,Ar).call(this,d)});const l=()=>{t(this,Xt)&&(n(this,Xt,!1),t(this,O).style.transition="",t(this,Ut).style.transition="",t(this,pe).call(this))};t(this,O).addEventListener("pointerup",l),t(this,O).addEventListener("pointercancel",l)}t(this,G)&&t(this,G).addEventListener("input",()=>{const a=parseFloat(t(this,G).value);isNaN(a)||(n(this,V,Math.max(t(this,lt),Math.min(t(this,_t),a))),h(this,k,Ui).call(this),h(this,k,Xi).call(this),t(this,pe).call(this))}),t(this,le)&&t(this,le).addEventListener("click",()=>{n(this,V,+Math.max(t(this,lt),t(this,V)-t(this,Kt)).toFixed(10)),h(this,k,Ui).call(this),t(this,G)&&(t(this,G).value=String(t(this,V))),h(this,k,Xi).call(this),t(this,pe).call(this)}),t(this,ce)&&t(this,ce).addEventListener("click",()=>{n(this,V,+Math.min(t(this,_t),t(this,V)+t(this,Kt)).toFixed(10)),h(this,k,Ui).call(this),t(this,G)&&(t(this,G).value=String(t(this,V))),h(this,k,Xi).call(this),t(this,pe).call(this)}),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=parseFloat(e);if(isNaN(r))return;n(this,V,r),t(this,Xt)||(h(this,k,Ui).call(this),t(this,G)&&!this.isFocused(t(this,G))&&(t(this,G).value=String(r))),h(this,k,Xi).call(this),t(this,Si)&&(t(this,Si).textContent=String(r));const o=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${o?` ${o}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}qe=new WeakMap,Ut=new WeakMap,O=new WeakMap,G=new WeakMap,Si=new WeakMap,le=new WeakMap,ce=new WeakMap,Xt=new WeakMap,V=new WeakMap,lt=new WeakMap,_t=new WeakMap,Kt=new WeakMap,pe=new WeakMap,k=new WeakSet,In=function(e){const i=t(this,_t)-t(this,lt);return i===0?0:Math.max(0,Math.min(100,(e-t(this,lt))/i*100))},qn=function(e){const i=t(this,lt)+e/100*(t(this,_t)-t(this,lt)),r=Math.round(i/t(this,Kt))*t(this,Kt);return Math.max(t(this,lt),Math.min(t(this,_t),+r.toFixed(10)))},Ui=function(){const e=h(this,k,In).call(this,t(this,V));t(this,Ut)&&(t(this,Ut).style.width=`${e}%`),t(this,O)&&(t(this,O).style.left=`${e}%`)},Ar=function(e){const i=t(this,qe).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,V,h(this,k,qn).call(this,r)),h(this,k,Ui).call(this),t(this,G)&&(t(this,G).value=String(t(this,V))),h(this,k,Xi).call(this)},Dn=function(){this.config.card?.sendCommand("set_value",{value:t(this,V)})},Xi=function(){t(this,le)&&(t(this,le).disabled=t(this,V)<=t(this,lt)),t(this,ce)&&(t(this,ce).disabled=t(this,V)>=t(this,_t))};const hs=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: var(--hrv-spacing-s, 8px) var(--hrv-spacing-m, 16px) var(--hrv-spacing-m, 16px);
    }

    /* Pills mode */
    .hrv-is-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }
    .hrv-is-pill {
      padding: 6px 14px;
      border-radius: 999px;
      border: 1px solid var(--hrv-ex-glass-border, rgba(255,255,255,0.12));
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.08));
      color: var(--hrv-color-text, #fff);
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .hrv-is-pill:hover { background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.16)); }
    .hrv-is-pill[data-active=true] {
      background: color-mix(in srgb, var(--hrv-color-primary, #1976d2) 32%, transparent);
      border-color: color-mix(in srgb, var(--hrv-color-primary, #1976d2) 60%, transparent);
    }

    /* Dropdown trigger */
    .hrv-is-selected {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--hrv-radius-s, 8px);
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.10));
      color: var(--hrv-color-text, #fff);
      font-size: 14px;
      font-family: inherit;
      text-align: left;
      border: 1px solid var(--hrv-ex-glass-border, rgba(255,255,255,0.12));
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 0.15s;
    }
    .hrv-is-selected:hover { background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.15)); }
    .hrv-is-selected[data-readonly=true] {
      cursor: not-allowed;
      border-color: transparent;
      background: transparent;
      justify-content: center;
    }
    .hrv-is-selected[data-readonly=true]:hover { background: transparent; }
    .hrv-is-arrow {
      font-size: 10px;
      opacity: 0.5;
      transition: transform 200ms ease;
    }
    .hrv-is-selected[aria-expanded=true] .hrv-is-arrow {
      transform: rotate(180deg);
    }

    /* Popover dropdown - escapes stacking via the top layer. */
    .hrv-is-dropdown {
      position: fixed;
      margin: 0;
      inset: unset;
      background: var(--hrv-card-background, var(--hrv-ex-glass-bg, rgba(40,40,40,0.95)));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--hrv-ex-glass-border, rgba(255,255,255,0.12));
      border-radius: var(--hrv-radius-s, 8px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.30);
      max-height: 280px;
      overflow-y: auto;
      scrollbar-width: thin;
      padding: 4px;
      color: var(--hrv-color-text, #fff);
      font-family: inherit;
    }
    .hrv-is-dropdown:not(:popover-open) { display: none; }
    .hrv-is-option {
      display: block;
      width: 100%;
      padding: 8px 14px;
      border: none;
      background: transparent;
      color: var(--hrv-color-text, #fff);
      text-align: left;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      border-radius: 6px;
      transition: background 0.1s;
    }
    .hrv-is-option:hover,
    .hrv-is-option:focus-visible {
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.08));
      outline: none;
    }
    .hrv-is-option[data-active=true] {
      color: var(--hrv-color-primary, #1976d2);
      font-weight: 600;
      background: color-mix(in srgb, var(--hrv-color-primary, #1976d2) 18%, transparent);
    }
  `;class rn extends g{constructor(){super(...arguments);s(this,P);s(this,et,null);s(this,F,null);s(this,De,null);s(this,ur,"");s(this,ue,[]);s(this,Li,"");s(this,Jt,!1);s(this,Pe,[]);s(this,Qt,[]);s(this,ve,"pills");s(this,fe,null);s(this,ht,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";n(this,ve,i==="dropdown"?"dropdown":"pills"),n(this,ue,this.def.feature_config?.options??[]);const r=e?t(this,ve)==="dropdown"?`
            <button class="hrv-is-selected" type="button"
              title="Select an option"
              aria-label="${p(this.def.friendly_name)}"
              aria-haspopup="listbox" aria-expanded="false">
              <span class="hrv-is-label">-</span>
              <span class="hrv-is-arrow" aria-hidden="true">&#9660;</span>
            </button>
            <div class="hrv-is-dropdown" role="listbox" popover="manual"></div>`:'<div class="hrv-is-grid"></div>':`
        <button class="hrv-is-selected" type="button" data-readonly="true" disabled
          aria-label="${p(this.def.friendly_name)}">
          <span class="hrv-is-label">-</span>
        </button>`;this.root.innerHTML=`
        <style>${hs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${r}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,et,this.root.querySelector(".hrv-is-selected")),n(this,F,this.root.querySelector(".hrv-is-dropdown")),n(this,De,this.root.querySelector(".hrv-is-grid")),n(this,Pe,[]),n(this,Qt,[]),n(this,Li,""),t(this,et)&&e&&t(this,ve)==="dropdown"&&(t(this,et).addEventListener("click",o=>{o.stopPropagation(),t(this,Jt)?h(this,P,Ki).call(this):h(this,P,Gr).call(this)}),t(this,et).addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" "||o.key==="ArrowDown")&&!t(this,Jt)?(o.preventDefault(),h(this,P,Gr).call(this),t(this,Qt)[0]?.focus()):o.key==="Escape"&&t(this,Jt)&&(h(this,P,Ki).call(this),t(this,et).focus())}),n(this,fe,o=>{t(this,Jt)&&!this.root.host.contains(o.target)&&h(this,P,Ki).call(this)}),document.addEventListener("click",t(this,fe))),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,ur,e);const r=i?.options,o=Array.isArray(r)&&r.length?r:t(this,ue);n(this,ue,o);const a=o.join("|");if(a!==t(this,Li)&&(n(this,Li,a),t(this,ve)==="dropdown"?h(this,P,zn).call(this,o):h(this,P,Pn).call(this,o)),t(this,ve)==="dropdown"){const l=this.root.querySelector(".hrv-is-label");l&&(l.textContent=e);for(const d of t(this,Qt))d.setAttribute("data-active",String(d.dataset.option===e))}else{for(const d of t(this,Pe))d.setAttribute("data-active",String(d.dataset.option===e));const l=this.root.querySelector(".hrv-is-label");l&&(l.textContent=e)}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{options:t(this,ue)}}:null}destroy(){t(this,fe)&&(document.removeEventListener("click",t(this,fe)),n(this,fe,null)),t(this,ht)&&(window.removeEventListener("scroll",t(this,ht),!0),window.removeEventListener("resize",t(this,ht)),n(this,ht,null));try{t(this,F)?.hidePopover?.()}catch{}}}et=new WeakMap,F=new WeakMap,De=new WeakMap,ur=new WeakMap,ue=new WeakMap,Li=new WeakMap,Jt=new WeakMap,Pe=new WeakMap,Qt=new WeakMap,ve=new WeakMap,fe=new WeakMap,ht=new WeakMap,P=new WeakSet,Pn=function(e){if(t(this,De)){t(this,De).innerHTML="",n(this,Pe,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-pill",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i})}),t(this,De).appendChild(r),t(this,Pe).push(r)}}},zn=function(e){if(t(this,F)){t(this,F).innerHTML="",n(this,Qt,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-option",r.role="option",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i}),h(this,P,Ki).call(this),t(this,et)?.focus()}),r.addEventListener("keydown",o=>{const a=t(this,Qt),l=a.indexOf(r);o.key==="ArrowDown"?(o.preventDefault(),a[Math.min(l+1,a.length-1)]?.focus()):o.key==="ArrowUp"?(o.preventDefault(),l===0?t(this,et)?.focus():a[l-1]?.focus()):o.key==="Escape"&&(h(this,P,Ki).call(this),t(this,et)?.focus())}),t(this,F).appendChild(r),t(this,Qt).push(r)}}},Yr=function(){if(!t(this,F)||!t(this,et))return;const e=t(this,et).getBoundingClientRect(),i=window.innerHeight-e.bottom,r=e.top,o=Math.min(t(this,F).scrollHeight||280,280);t(this,F).style.left=`${Math.round(e.left)}px`,t(this,F).style.width=`${Math.round(e.width)}px`,i<o+8&&r>i?t(this,F).style.top=`${Math.max(8,Math.round(e.top-o-6))}px`:t(this,F).style.top=`${Math.round(e.bottom+6)}px`},Gr=function(){if(!(!t(this,F)||!t(this,ue).length)){try{t(this,F).showPopover?.()}catch{}t(this,et)?.setAttribute("aria-expanded","true"),h(this,P,Yr).call(this),n(this,ht,()=>h(this,P,Yr).call(this)),window.addEventListener("scroll",t(this,ht),!0),window.addEventListener("resize",t(this,ht)),n(this,Jt,!0)}},Ki=function(){try{t(this,F)?.hidePopover?.()}catch{}t(this,et)?.setAttribute("aria-expanded","false"),t(this,ht)&&(window.removeEventListener("scroll",t(this,ht),!0),window.removeEventListener("resize",t(this,ht)),n(this,ht,null)),n(this,Jt,!1)};const ds=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: var(--hrv-spacing-s, 8px) var(--hrv-spacing-m, 16px) var(--hrv-spacing-m, 16px);
    }

    .hrv-mp-info {
      text-align: center;
      min-height: 32px;
    }
    .hrv-mp-artist {
      font-size: 11px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.6));
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hrv-mp-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--hrv-color-text, #fff);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .hrv-mp-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }
    .hrv-mp-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      color: var(--hrv-color-on-primary, #fff);
      cursor: pointer;
      padding: 0;
      box-shadow: none;
      transition: box-shadow 150ms ease, opacity 150ms ease;
    }
    .hrv-mp-btn:hover { opacity: 0.85; }
    .hrv-mp-btn:active,
    .hrv-mp-btn[data-pressing=true] {
      box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff);
    }
    .hrv-mp-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      box-shadow: none;
    }
    .hrv-mp-btn svg { width: 20px; height: 20px; display: block; }
    .hrv-mp-btn[data-role=play] { width: 48px; height: 48px; }
    .hrv-mp-btn[data-role=play] svg { width: 24px; height: 24px; display: block; }

    .hrv-mp-volume {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hrv-mp-mute {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--hrv-color-text, #fff);
      cursor: pointer;
      padding: 0;
      transition: opacity 150ms;
    }
    .hrv-mp-mute:hover { opacity: 0.7; }
    .hrv-mp-mute:disabled { opacity: 0.35; cursor: not-allowed; }
    .hrv-mp-mute svg { width: 20px; height: 20px; display: block; }

    .hrv-mp-slider-wrap { flex: 1; padding: 4px 0; }
    .hrv-mp-slider-track {
      position: relative;
      height: 6px;
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.15));
      border-radius: 3px;
      cursor: pointer;
    }
    .hrv-mp-slider-fill {
      position: absolute;
      left: 0; top: 0;
      height: 100%;
      background: var(--hrv-color-primary, #1976d2);
      border-radius: 3px;
      transition: width 0.15s;
      pointer-events: none;
    }
    .hrv-mp-slider-thumb {
      position: absolute;
      top: 50%;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--hrv-ex-thumb, #fff);
      transform: translate(-50%, -50%);
      cursor: grab;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      transition: left 0.15s;
      box-sizing: border-box;
    }
    .hrv-mp-slider-thumb:active { cursor: grabbing; }
    .hrv-mp-slider-track[data-readonly=true] { cursor: not-allowed; }
    .hrv-mp-slider-track[data-readonly=true] .hrv-mp-slider-thumb {
      cursor: not-allowed;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .hrv-mp-slider-fill,
      .hrv-mp-slider-thumb { transition: none; }
      .hrv-mp-btn { transition: none; }
    }
  `;class ls extends g{constructor(e,i,r,o){super(e,i,r,o);s(this,me);s(this,te,null);s(this,ki,null);s(this,Mi,null);s(this,ze,null);s(this,Be,null);s(this,Rt,null);s(this,z,null);s(this,Re,null);s(this,je,null);s(this,Oe,!1);s(this,jt,0);s(this,ee,!1);s(this,Ve,"idle");s(this,Fe,{});s(this,ir);n(this,ir,this.debounce(h(this,me,Bn).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_transport!==!1,a=r.show_volume!==!1&&i.includes("volume_set"),l=i.includes("previous_track");if(this.root.innerHTML=`
        <style>${ds}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-mp-info">
              <div class="hrv-mp-artist" title="Artist"></div>
              <div class="hrv-mp-title" title="Title"></div>
            </div>
            ${e&&o?`
              <div class="hrv-mp-controls">
                ${l?`
                  <button class="hrv-mp-btn" data-role="prev" type="button"
                    title="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                <button class="hrv-mp-btn" data-role="play" type="button"
                  title="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>
                ${l?`
                  <button class="hrv-mp-btn" data-role="next" type="button"
                    title="Next track">
                    <span part="next-icon" aria-hidden="true"></span>
                  </button>
                `:""}
              </div>
            `:""}
            ${a?`
              <div class="hrv-mp-volume" title="${e?"Volume":"Read-only"}">
                <button class="hrv-mp-mute" type="button"
                  title="${e?"Mute":"Read-only"}"
                  ${e?"":"disabled"}>
                  <span part="mute-icon" aria-hidden="true"></span>
                </button>
                <div class="hrv-mp-slider-wrap">
                  <div class="hrv-mp-slider-track" ${e?"":'data-readonly="true"'}>
                    <div class="hrv-mp-slider-fill" style="width:0%"></div>
                    <div class="hrv-mp-slider-thumb" style="left:0%"></div>
                  </div>
                </div>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,te,this.root.querySelector("[data-role=play]")),n(this,ki,this.root.querySelector("[data-role=prev]")),n(this,Mi,this.root.querySelector("[data-role=next]")),n(this,ze,this.root.querySelector(".hrv-mp-mute")),n(this,Be,this.root.querySelector(".hrv-mp-slider-track")),n(this,Rt,this.root.querySelector(".hrv-mp-slider-fill")),n(this,z,this.root.querySelector(".hrv-mp-slider-thumb")),n(this,Re,this.root.querySelector(".hrv-mp-artist")),n(this,je,this.root.querySelector(".hrv-mp-title")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,te)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,ki)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Mi)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,te),t(this,ki),t(this,Mi)].forEach(d=>{d&&(d.addEventListener("pointerdown",()=>d.setAttribute("data-pressing","true")),d.addEventListener("pointerup",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointerleave",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointercancel",()=>d.removeAttribute("data-pressing")))}),t(this,ze)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,Oe)})),t(this,Be)&&t(this,z))){const d=f=>{n(this,ee,!0),t(this,z).style.transition="none",t(this,Rt).style.transition="none",h(this,me,$r).call(this,f),t(this,z).setPointerCapture(f.pointerId)};t(this,z).addEventListener("pointerdown",d),t(this,Be).addEventListener("pointerdown",f=>{f.target!==t(this,z)&&(n(this,ee,!0),t(this,z).style.transition="none",t(this,Rt).style.transition="none",h(this,me,$r).call(this,f),t(this,z).setPointerCapture(f.pointerId))}),t(this,z).addEventListener("pointermove",f=>{t(this,ee)&&h(this,me,$r).call(this,f)});const u=()=>{t(this,ee)&&(n(this,ee,!1),t(this,z).style.transition="",t(this,Rt).style.transition="",t(this,ir).call(this))};t(this,z).addEventListener("pointerup",u),t(this,z).addEventListener("pointercancel",u)}this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Ve,e),n(this,Fe,i);const r=e==="playing",o=e==="paused";if(t(this,Re)){const l=i.media_artist??"";t(this,Re).textContent=l,t(this,Re).title=l||"Artist"}if(t(this,je)){const l=i.media_title??"";t(this,je).textContent=l,t(this,je).title=l||"Title"}if(t(this,te)){t(this,te).setAttribute("data-playing",String(r));const l=r?"mdi:pause":"mdi:play";this.renderIcon(l,"play-icon"),this.def.capabilities==="read-write"&&(t(this,te).title=r?"Pause":"Play")}if(n(this,Oe,!!i.is_volume_muted),t(this,ze)){const l=t(this,Oe)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(l,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,ze).title=t(this,Oe)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,ee)&&(n(this,jt,Math.round(i.volume_level*100)),t(this,Rt)&&(t(this,Rt).style.width=`${t(this,jt)}%`),t(this,z)&&(t(this,z).style.left=`${t(this,jt)}%`));const a=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${a?` - ${a}`:""}`)}predictState(e,i){return e==="media_play_pause"?{state:t(this,Ve)==="playing"?"paused":"playing",attributes:t(this,Fe)}:e==="volume_mute"?{state:t(this,Ve),attributes:{...t(this,Fe),is_volume_muted:!!i.is_volume_muted}}:e==="volume_set"?{state:t(this,Ve),attributes:{...t(this,Fe),volume_level:i.volume_level}}:null}}te=new WeakMap,ki=new WeakMap,Mi=new WeakMap,ze=new WeakMap,Be=new WeakMap,Rt=new WeakMap,z=new WeakMap,Re=new WeakMap,je=new WeakMap,Oe=new WeakMap,jt=new WeakMap,ee=new WeakMap,Ve=new WeakMap,Fe=new WeakMap,ir=new WeakMap,me=new WeakSet,$r=function(e){const i=t(this,Be).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,jt,Math.round(r)),t(this,Rt).style.width=`${t(this,jt)}%`,t(this,z).style.left=`${t(this,jt)}%`},Bn=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,jt)/100})};const cs=`
    [part=card-body] {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--hrv-spacing-m, 16px) 0;
    }

    .hrv-remote-circle {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      padding: 0;
      color: var(--hrv-color-on-primary, #fff);
      box-shadow: none;
      transition: box-shadow 150ms ease, opacity 150ms ease;
    }
    .hrv-remote-circle:hover { opacity: 0.85; }
    .hrv-remote-circle:active,
    .hrv-remote-circle[data-pressing=true] {
      box-shadow: 0 0 0 5px var(--hrv-ex-ring, #fff);
    }
    .hrv-remote-circle:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      box-shadow: none;
    }
    .hrv-remote-circle:disabled:hover { opacity: 0.35; }
    [part=remote-icon] {
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    [part=remote-icon] svg { width: 40px; height: 40px; }
    @media (prefers-reduced-motion: reduce) {
      .hrv-remote-circle { transition: none; }
    }
  `;class ps extends g{constructor(){super(...arguments);s(this,Ei,null);s(this,rr,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${cs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-remote-circle" type="button"
              title="${e?"Toggle power":"Read-only"}"
              aria-label="${p(this.def.friendly_name)} - Toggle power"
              ${e?"":"disabled"}>
              <span part="remote-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Ei,this.root.querySelector(".hrv-remote-circle"));const i=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(i,"remote-icon"),t(this,Ei)&&e&&this._attachGestureHandlers(t(this,Ei),{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand(t(this,rr)?"turn_off":"turn_on",{})}}),this.renderCompanions(),B(this.root)}applyState(e,i){n(this,rr,e==="on");const r=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(r,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ei=new WeakMap,rr=new WeakMap;const us=`
    [part=card] {
      padding-bottom: 0 !important;
    }

    [part=card-body] {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 4px;
      padding: 28px 0 32px;
    }

    .hrv-sensor-val {
      font-size: 52px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      line-height: 1;
    }
    .hrv-sensor-unit {
      font-size: 18px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
    }

    [part=history-graph] {
      margin-top: 0;
      padding: 0;
      border-radius: 0 0 var(--hrv-radius-l, 16px) var(--hrv-radius-l, 16px);
      overflow: hidden;
    }
    [part=history-svg] {
      height: 56px;
      display: block;
    }
  `;class lr extends g{constructor(){super(...arguments);s(this,Hi,null);s(this,Ti,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${us}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" title="${p(this.def.friendly_name)}">
            <span class="hrv-sensor-val" aria-live="polite">-</span>
            ${e?`<span class="hrv-sensor-unit" title="${p(e)}">${p(e)}</span>`:""}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Hi,this.root.querySelector(".hrv-sensor-val")),n(this,Ti,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){t(this,Hi)&&(t(this,Hi).textContent=e),t(this,Ti)&&i.unit_of_measurement!==void 0&&(t(this,Ti).textContent=i.unit_of_measurement);const r=i.unit_of_measurement??this.def.unit_of_measurement??"",o=this.root.querySelector("[part=card-body]");o&&(o.title=`${e}${r?` ${r}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${r?` ${r}`:""}`)}}Hi=new WeakMap,Ti=new WeakMap;const vs=`
    [part=card-body] {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0 24px;
    }

    button.hrv-switch-track {
      -webkit-appearance: none;
      appearance: none;
      display: block;
      position: relative;
      width: 48px;
      height: 96px;
      border-radius: 24px;
      background: var(--hrv-ex-toggle-idle, rgba(255,255,255,0.25));
      border: 2px solid var(--hrv-ex-outline, rgba(255,255,255,0.3));
      cursor: pointer;
      padding: 0;
      margin: 0;
      outline: none;
      font: inherit;
      color: inherit;
      line-height: 1;
      text-align: center;
      text-decoration: none;
      transition: background 250ms ease, border-color 250ms ease;
      user-select: none;
      box-sizing: border-box;
    }
    .hrv-switch-track:focus-visible {
      box-shadow: 0 0 0 3px var(--hrv-color-primary, #1976d2);
    }
    .hrv-switch-track[data-on=true] {
      background: var(--hrv-color-primary, #1976d2);
      border-color: var(--hrv-color-primary, #1976d2);
    }
    .hrv-switch-track:hover { opacity: 0.85; }
    .hrv-switch-track:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .hrv-switch-track:disabled:hover { opacity: 0.4; }

    .hrv-switch-knob {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--hrv-ex-thumb, #fff);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: top 200ms ease;
      pointer-events: none;
      top: 52px;
    }
    .hrv-switch-track[data-on=true] .hrv-switch-knob {
      top: 4px;
    }

    .hrv-switch-ro {
      font-size: 28px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      text-align: center;
      padding: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .hrv-switch-knob,
      .hrv-switch-track { transition: none; }
    }
  `;class nn extends g{constructor(){super(...arguments);s(this,Ot,null);s(this,Ii,null);s(this,We,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${vs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e?`
              <button class="hrv-switch-track" type="button" data-on="false"
                title="Toggle" aria-label="${p(this.def.friendly_name)} - Toggle">
                <div class="hrv-switch-knob"></div>
              </button>
            `:`
              <div class="hrv-switch-ro" title="Read-only">-</div>
            `}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Ot,this.root.querySelector(".hrv-switch-track")),n(this,Ii,this.root.querySelector(".hrv-switch-ro")),t(this,Ot)&&e&&this._attachGestureHandlers(t(this,Ot),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),B(this.root)}applyState(e,i){n(this,We,e==="on");const r=e==="unavailable"||e==="unknown";t(this,Ot)&&(t(this,Ot).setAttribute("data-on",String(t(this,We))),t(this,Ot).title=t(this,We)?"On - click to turn off":"Off - click to turn on",t(this,Ot).disabled=r),t(this,Ii)&&(t(this,Ii).textContent=Ke(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,We)?"off":"on",attributes:{}}}}Ot=new WeakMap,Ii=new WeakMap,We=new WeakMap;const fs=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: var(--hrv-spacing-m, 16px) 0;
    }

    .hrv-timer-display {
      font-size: 48px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    .hrv-timer-display[data-paused=true] {
      opacity: 0.6;
    }

    .hrv-timer-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }
    .hrv-timer-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      color: var(--hrv-color-on-primary, #fff);
      cursor: pointer;
      padding: 0;
      box-shadow: none;
      transition: box-shadow 150ms ease, opacity 150ms ease;
    }
    .hrv-timer-btn:hover { opacity: 0.85; }
    .hrv-timer-btn:active,
    .hrv-timer-btn[data-pressing=true] {
      box-shadow: 0 0 0 3px var(--hrv-ex-ring, #fff);
    }
    .hrv-timer-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      box-shadow: none;
    }
    .hrv-timer-btn:disabled:hover { opacity: 0.35; }
    .hrv-timer-btn svg { width: 20px; height: 20px; }
    .hrv-timer-btn [part] {
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .hrv-timer-btn { transition: none; }
    }
  `;function cr(c){c<0&&(c=0);const v=Math.floor(c/3600),e=Math.floor(c%3600/60),i=Math.floor(c%60),r=o=>String(o).padStart(2,"0");return v>0?`${v}:${r(e)}:${r(i)}`:`${r(e)}:${r(i)}`}function sn(c){if(typeof c=="number")return c;if(typeof c!="string")return 0;const v=c.split(":").map(Number);return v.length===3?v[0]*3600+v[1]*60+v[2]:v.length===2?v[0]*60+v[1]:v[0]||0}class ms extends g{constructor(){super(...arguments);s(this,ct);s(this,mt,null);s(this,ie,null);s(this,ge,null);s(this,be,null);s(this,Ne,null);s(this,qi,"idle");s(this,Di,{});s(this,Ct,null);s(this,Pi,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${fs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-timer-display" title="Time remaining">00:00</span>
            ${e?`
              <div class="hrv-timer-controls">
                <button class="hrv-timer-btn" data-action="playpause" type="button"
                  title="Start" aria-label="${p(this.def.friendly_name)} - Start">
                  <span part="playpause-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="cancel" type="button"
                  title="Cancel" aria-label="${p(this.def.friendly_name)} - Cancel">
                  <span part="cancel-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="finish" type="button"
                  title="Finish" aria-label="${p(this.def.friendly_name)} - Finish">
                  <span part="finish-icon" aria-hidden="true"></span>
                </button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,mt,this.root.querySelector(".hrv-timer-display")),n(this,ie,this.root.querySelector("[data-action=playpause]")),n(this,ge,this.root.querySelector("[data-action=cancel]")),n(this,be,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,ie)?.addEventListener("click",()=>{const i=t(this,qi)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,ge)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,be)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,ie),t(this,ge),t(this,be)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,qi,e),n(this,Di,{...i}),n(this,Ct,i.finishes_at??null),n(this,Pi,i.remaining!=null?sn(i.remaining):null),h(this,ct,Rn).call(this,e),h(this,ct,jn).call(this,e),e==="active"&&t(this,Ct)?h(this,ct,On).call(this):h(this,ct,hr).call(this),t(this,mt)&&t(this,mt).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const r={...t(this,Di)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,Ct)&&(r.remaining=Math.max(0,(new Date(t(this,Ct)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}mt=new WeakMap,ie=new WeakMap,ge=new WeakMap,be=new WeakMap,Ne=new WeakMap,qi=new WeakMap,Di=new WeakMap,Ct=new WeakMap,Pi=new WeakMap,ct=new WeakSet,Rn=function(e){const i=e==="idle",r=e==="active";if(t(this,ie)){const o=r?"mdi:pause":"mdi:play",a=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(o,"playpause-icon"),t(this,ie).title=a,t(this,ie).setAttribute("aria-label",`${this.def.friendly_name} - ${a}`)}t(this,ge)&&(t(this,ge).disabled=i),t(this,be)&&(t(this,be).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},jn=function(e){if(t(this,mt)){if(e==="idle"){const i=t(this,Di).duration;t(this,mt).textContent=i?cr(sn(i)):"00:00";return}if(e==="paused"&&t(this,Pi)!=null){t(this,mt).textContent=cr(t(this,Pi));return}if(e==="active"&&t(this,Ct)){const i=Math.max(0,(new Date(t(this,Ct)).getTime()-Date.now())/1e3);t(this,mt).textContent=cr(i)}}},On=function(){h(this,ct,hr).call(this),n(this,Ne,setInterval(()=>{if(!t(this,Ct)||t(this,qi)!=="active"){h(this,ct,hr).call(this);return}const e=Math.max(0,(new Date(t(this,Ct)).getTime()-Date.now())/1e3);t(this,mt)&&(t(this,mt).textContent=cr(e)),e<=0&&h(this,ct,hr).call(this)},1e3))},hr=function(){t(this,Ne)&&(clearInterval(t(this,Ne)),n(this,Ne,null))};const gs=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: var(--hrv-spacing-m, 16px) 0;
    }

    .hrv-generic-state {
      font-size: 28px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      text-align: center;
    }

    button.hrv-generic-toggle {
      -webkit-appearance: none;
      appearance: none;
      display: block;
      position: relative;
      width: 44px;
      height: 88px;
      border-radius: 22px;
      background: var(--hrv-color-surface-alt, rgba(255,255,255,0.15));
      cursor: pointer;
      border: 2px solid var(--hrv-ex-outline, rgba(255,255,255,0.3));
      padding: 0;
      margin: 0;
      outline: none;
      font: inherit;
      color: inherit;
      transition: background 250ms ease, border-color 250ms ease;
      user-select: none;
      box-sizing: border-box;
    }
    .hrv-generic-toggle:focus-visible {
      box-shadow: 0 0 0 3px var(--hrv-color-primary, #1976d2);
    }
    .hrv-generic-toggle[data-on=true] {
      background: var(--hrv-color-primary, #1976d2);
      border-color: var(--hrv-color-primary, #1976d2);
    }
    .hrv-generic-toggle:hover { opacity: 0.85; }
    .hrv-generic-toggle:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .hrv-generic-toggle:disabled:hover { opacity: 0.4; }

    .hrv-generic-knob {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--hrv-ex-thumb, #fff);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: top 200ms ease;
      pointer-events: none;
      top: 48px;
    }
    .hrv-generic-toggle[data-on=true] .hrv-generic-knob {
      top: 4px;
    }

    @media (prefers-reduced-motion: reduce) {
      .hrv-generic-knob,
      .hrv-generic-toggle { transition: none; }
    }
  `;class on extends g{constructor(){super(...arguments);s(this,zi,null);s(this,Vt,null);s(this,Ze,!1);s(this,Ye,!1)}render(){const e=this.def.capabilities==="read-write";n(this,Ye,!1),this.root.innerHTML=`
        <style>${gs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-generic-state" title="${p(this.def.friendly_name)}">-</span>
            ${e?`
              <button class="hrv-generic-toggle" type="button" data-on="false"
                title="Toggle" aria-label="${p(this.def.friendly_name)} - Toggle"
                hidden>
                <div class="hrv-generic-knob"></div>
              </button>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,zi,this.root.querySelector(".hrv-generic-state")),n(this,Vt,this.root.querySelector(".hrv-generic-toggle")),t(this,Vt)&&e&&this._attachGestureHandlers(t(this,Vt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),B(this.root)}applyState(e,i){const r=e==="on"||e==="off";n(this,Ze,e==="on"),t(this,zi)&&(t(this,zi).textContent=Ke(e)),t(this,Vt)&&(r&&!t(this,Ye)&&(t(this,Vt).removeAttribute("hidden"),n(this,Ye,!0)),t(this,Ye)&&(t(this,Vt).setAttribute("data-on",String(t(this,Ze))),t(this,Vt).title=t(this,Ze)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,Ze)?"off":"on",attributes:{}}}}zi=new WeakMap,Vt=new WeakMap,Ze=new WeakMap,Ye=new WeakMap;const an={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",pouring:"M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z","snowy-rainy":"M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z",hail:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z","lightning-rainy":"M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z","windy-variant":"M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},bs=an.cloudy,ys="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,1A1,1 0 0,1 13,2L13,2.01C13,2.01 14.35,3.56 15.72,5.55C17.09,7.54 18.5,9.93 18.5,12.5A6.5,6.5 0 0,1 12,19A6.5,6.5 0 0,1 5.5,12.5C5.5,9.93 6.91,7.54 8.28,5.55C9.65,3.56 11,2.01 11,2.01L11,2A1,1 0 0,1 12,1Z",xs="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",ws="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",_s=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Mr(c,v){const e=an[c]??bs;return`<svg viewBox="0 0 24 24" width="${v}" height="${v}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Er(c){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${c}" fill="currentColor"/></svg>`}const Cs=`
    [part=card] {
      padding-bottom: 0 !important;
    }

    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 0 16px;
      min-width: 0;
      overflow: hidden;
    }

    .hrv-weather-main {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .hrv-weather-icon {
      color: var(--hrv-color-state-on, #1976d2);
      flex-shrink: 0;
      line-height: 0;
    }

    .hrv-weather-temp {
      font-size: 48px;
      font-weight: 300;
      color: var(--hrv-color-text, #fff);
      line-height: 1;
    }

    .hrv-weather-unit {
      font-size: 18px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
    }

    .hrv-weather-cond {
      font-size: 13px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
      text-transform: capitalize;
    }

    .hrv-weather-stats {
      display: flex;
      justify-content: center;
      gap: 16px;
      width: 100%;
      padding-top: 8px;
      margin-top: 4px;
      border-top: 1px solid var(--hrv-ex-outline, rgba(255,255,255,0.15));
    }

    .hrv-weather-stat {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
    }

    .hrv-weather-stat svg {
      color: var(--hrv-color-icon, rgba(255,255,255,0.6));
      flex-shrink: 0;
    }

    .hrv-forecast-toggle {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border: 1px solid var(--hrv-ex-outline, rgba(255,255,255,0.15));
      border-radius: 12px;
      background: none;
      font-size: 10px;
      font-weight: 500;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
      cursor: pointer;
      font-family: inherit;
      margin-top: 4px;
    }
    .hrv-forecast-toggle:hover {
      background: rgba(255,255,255,0.08);
    }
    .hrv-forecast-toggle:empty { display: none; }

    .hrv-forecast-strip {
      width: 100%;
      padding-top: 8px;
      margin-top: 4px;
      border-top: 1px solid var(--hrv-ex-outline, rgba(255,255,255,0.15));
    }

    .hrv-forecast-strip:empty { display: none; }

    .hrv-forecast-strip[data-mode=daily] {
      display: flex;
      justify-content: space-between;
      gap: 4px;
    }

    .hrv-forecast-strip[data-mode=hourly] {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      width: 0;
      min-width: 100%;
    }
    .hrv-forecast-strip[data-mode=hourly]::-webkit-scrollbar { display: none; }

    .hrv-forecast-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      flex: 0 0 auto;
      min-width: 42px;
    }
    .hrv-forecast-strip[data-mode=daily] .hrv-forecast-day {
      flex: 1;
      min-width: 0;
    }

    .hrv-forecast-day-name {
      font-size: 10px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
      font-weight: 500;
    }

    .hrv-forecast-day svg {
      color: var(--hrv-color-icon, rgba(255,255,255,0.6));
    }

    .hrv-forecast-temps {
      font-size: 10px;
      color: var(--hrv-color-text, #fff);
      white-space: nowrap;
    }

    .hrv-forecast-lo {
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.7));
    }

    .hrv-forecast-scroll-track {
      width: 100%;
      align-self: stretch;
      height: 3px;
      border-radius: 2px;
      background: var(--hrv-color-surface-alt, rgba(255,255,255,0.10));
      position: relative;
      margin-top: 4px;
      cursor: pointer;
    }
    .hrv-forecast-scroll-track[hidden] { display: none; }
    .hrv-forecast-scroll-thumb {
      position: absolute;
      top: 0;
      height: 100%;
      border-radius: 2px;
      background: var(--hrv-color-text-secondary, rgba(255,255,255,0.30));
      transition: left 80ms linear;
    }

    [part=history-graph] {
      margin-top: 0;
      padding: 0;
      border-radius: 0 0 var(--hrv-radius-l, 16px) var(--hrv-radius-l, 16px);
      overflow: hidden;
    }
    [part=history-svg] {
      height: 56px;
      display: block;
    }

    @media (prefers-reduced-motion: reduce) {
      [part=card] * { transition: none !important; }
    }
  `;class As extends g{constructor(){super(...arguments);s(this,S);s(this,Bi,null);s(this,Ge,null);s(this,Ri,null);s(this,ji,null);s(this,Oi,null);s(this,Vi,null);s(this,pt,null);s(this,Ft,null);s(this,gt,null);s(this,Fi,null);s(this,Wi,null);s(this,Ue,null);s(this,Xe,null)}render(){this.root.innerHTML=`
        <style>${Cs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-weather-main">
              <span class="hrv-weather-icon">${Mr("cloudy",44)}</span>
              <span class="hrv-weather-temp">--<span class="hrv-weather-unit"></span></span>
            </div>
            <span class="hrv-weather-cond" aria-live="polite">--</span>
            <div class="hrv-weather-stats">
              <span class="hrv-weather-stat" data-stat="humidity">
                ${Er(ys)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="wind">
                ${Er(xs)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="pressure">
                ${Er(ws)}
                <span data-value>--</span>
              </span>
            </div>
            <button class="hrv-forecast-toggle" type="button"></button>
            <div class="hrv-forecast-strip" data-mode="daily" role="list"></div>
            <div class="hrv-forecast-scroll-track" hidden><div class="hrv-forecast-scroll-thumb"></div></div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Bi,this.root.querySelector(".hrv-weather-icon")),n(this,Ge,this.root.querySelector(".hrv-weather-temp")),n(this,Ri,this.root.querySelector(".hrv-weather-cond")),n(this,ji,this.root.querySelector("[data-stat=humidity] [data-value]")),n(this,Oi,this.root.querySelector("[data-stat=wind] [data-value]")),n(this,Vi,this.root.querySelector("[data-stat=pressure] [data-value]")),n(this,pt,this.root.querySelector(".hrv-forecast-strip")),n(this,Ft,this.root.querySelector(".hrv-forecast-toggle")),n(this,gt,this.root.querySelector(".hrv-forecast-scroll-track")),n(this,Fi,this.root.querySelector(".hrv-forecast-scroll-thumb")),t(this,pt)&&(t(this,pt).addEventListener("scroll",()=>h(this,S,Kr).call(this),{passive:!0}),n(this,Wi,Fn(t(this,pt)))),t(this,gt)&&t(this,gt).addEventListener("pointerdown",e=>h(this,S,Vn).call(this,e)),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}destroy(){var e;(e=t(this,Wi))==null||e.call(this),n(this,Wi,null)}applyState(e,i){const r=e||"cloudy";t(this,Bi)&&(t(this,Bi).innerHTML=Mr(r,44));const o=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,Ri)&&(t(this,Ri).textContent=o);const a=i.temperature??i.native_temperature;let l=String(i.temperature_unit||i.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(l&&!/^°/.test(l)&&l.length<=2&&(l=`°${l}`),t(this,Ge)){const u=t(this,Ge).querySelector(".hrv-weather-unit");t(this,Ge).firstChild.textContent=a!=null?Math.round(Number(a)):"--",u&&(u.textContent=l)}if(t(this,ji)){const u=i.humidity;t(this,ji).textContent=u!=null?`${u}%`:"--"}if(t(this,Oi)){const u=i.wind_speed,f=i.wind_speed_unit??"";t(this,Oi).textContent=u!=null?`${u} ${f}`.trim():"--"}if(t(this,Vi)){const u=i.pressure,f=i.pressure_unit??"";t(this,Vi).textContent=u!=null?`${u} ${f}`.trim():"--"}const d=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;n(this,Ue,d?i.forecast_daily??i.forecast??null:null),n(this,Xe,d?i.forecast_hourly??null:null),h(this,S,Ur).call(this),h(this,S,Xr).call(this),this.announceState(`${this.def.friendly_name}, ${o}, ${a??"--"} ${l}`)}}Bi=new WeakMap,Ge=new WeakMap,Ri=new WeakMap,ji=new WeakMap,Oi=new WeakMap,Vi=new WeakMap,pt=new WeakMap,Ft=new WeakMap,gt=new WeakMap,Fi=new WeakMap,Wi=new WeakMap,S=new WeakSet,Ce=function(){return this.config._forecastMode??"daily"},Sr=function(e){this.config._forecastMode=e},Ue=new WeakMap,Xe=new WeakMap,Ur=function(){if(!t(this,Ft))return;const e=Array.isArray(t(this,Ue))&&t(this,Ue).length>0,i=Array.isArray(t(this,Xe))&&t(this,Xe).length>0;if(!e&&!i){t(this,Ft).textContent="";return}e&&!i&&n(this,S,"daily",Sr),!e&&i&&n(this,S,"hourly",Sr),e&&i?(t(this,Ft).textContent=t(this,S,Ce)==="daily"?"Hourly":"5-Day",t(this,Ft).onclick=()=>{n(this,S,t(this,S,Ce)==="daily"?"hourly":"daily",Sr),h(this,S,Ur).call(this),h(this,S,Xr).call(this)}):(t(this,Ft).textContent="",t(this,Ft).onclick=null)},Xr=function(){if(!t(this,pt))return;const e=t(this,S,Ce)==="hourly"?t(this,Xe):t(this,Ue);if(t(this,pt).setAttribute("data-mode",t(this,S,Ce)),!Array.isArray(e)||e.length===0){t(this,pt).innerHTML="",t(this,gt)&&(t(this,gt).hidden=!0);return}const i=t(this,S,Ce)==="daily"?e.slice(0,5):e;t(this,pt).innerHTML=i.map(r=>{const o=new Date(r.datetime);let a;t(this,S,Ce)==="hourly"?a=o.toLocaleTimeString([],{hour:"numeric"}):a=_s[o.getDay()]??"";const l=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",d=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="hrv-forecast-day" role="listitem">
            <span class="hrv-forecast-day-name">${p(String(a))}</span>
            ${Mr(r.condition||"cloudy",18)}
            <span class="hrv-forecast-temps">
              ${p(String(l))}${d!=null?`/<span class="hrv-forecast-lo">${p(String(d))}</span>`:""}
            </span>
          </div>`}).join(""),t(this,S,Ce)==="hourly"?requestAnimationFrame(()=>h(this,S,Kr).call(this)):t(this,gt)&&(t(this,gt).hidden=!0)},Kr=function(){const e=t(this,pt),i=t(this,gt),r=t(this,Fi);if(!e||!i||!r)return;const o=e.scrollWidth>e.clientWidth?e.clientWidth/e.scrollWidth:1;if(o>=1){i.hidden=!0;return}i.hidden=!1;const a=i.clientWidth,l=Math.max(20,o*a),d=a-l,u=e.scrollLeft/(e.scrollWidth-e.clientWidth);r.style.width=`${l}px`,r.style.left=`${u*d}px`},Vn=function(e){const i=t(this,pt),r=t(this,gt),o=t(this,Fi);if(!i||!r||!o)return;e.preventDefault();const a=r.getBoundingClientRect(),l=parseFloat(o.style.width)||20,d=y=>{const _=y-a.left-l/2,I=a.width-l,L=Math.max(0,Math.min(1,_/I));i.scrollLeft=L*(i.scrollWidth-i.clientWidth)};d(e.clientX);const u=y=>d(y.clientX),f=()=>{window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",f)};window.addEventListener("pointermove",u),window.addEventListener("pointerup",f)};const $s=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 20px 0 24px;
    }

    .hrv-lock-icon-btn {
      -webkit-appearance: none;
      appearance: none;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      box-shadow: none;
      transition: box-shadow var(--hrv-transition-speed, 0.2s), opacity var(--hrv-transition-speed, 0.2s);
    }
    .hrv-lock-icon-btn[aria-pressed=true] {
      box-shadow: 0 0 0 4px var(--hrv-ex-ring, #fff);
    }
    .hrv-lock-icon-btn[aria-pressed=false] { opacity: 0.45; }
    .hrv-lock-icon-btn:hover { opacity: 0.88; }
    .hrv-lock-icon-btn:active { transition: none; opacity: 0.75; }
    .hrv-lock-icon-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .hrv-lock-icon-btn svg {
      width: 52px;
      height: 52px;
      display: block;
      fill: currentColor;
      pointer-events: none;
    }

    .hrv-lock-ro-circle {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.35;
    }
    .hrv-lock-ro-circle [part=lock-icon] {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      pointer-events: none;
    }
    .hrv-lock-ro-circle [part=lock-icon] svg {
      width: 40px;
      height: 40px;
      fill: currentColor;
      display: block;
    }

    @media (prefers-reduced-motion: reduce) {
      .hrv-lock-icon-btn,
      .hrv-lock-ro-circle { transition: none; }
    }
  `;class Ss extends g{constructor(){super(...arguments);s(this,re,null);s(this,Ni,null);s(this,ye,!1);s(this,vr,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${$s}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e?`
              <button class="hrv-lock-icon-btn" type="button"
                aria-pressed="false"
                aria-label="${p(this.def.friendly_name)} - Lock/Unlock">
                <span part="lock-icon" aria-hidden="true"></span>
              </button>
            `:`
              <div class="hrv-lock-ro-circle" data-locked="false"
                role="img" aria-label="${p(this.def.friendly_name)}" title="Read-only">
                <span part="lock-icon" aria-hidden="true"></span>
              </div>
            `}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,re,this.root.querySelector(".hrv-lock-icon-btn")),n(this,Ni,this.root.querySelector(".hrv-lock-ro-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"lock-icon"),t(this,re)&&e&&this._attachGestureHandlers(t(this,re),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand(t(this,ye)?"unlock":"lock",{})}}),this.renderCompanions(),B(this.root)}applyState(e,i){n(this,vr,e),n(this,ye,e==="locked");const r=e==="jammed",a=r||(e==="locking"||e==="unlocking")||e==="unavailable"||e==="unknown";t(this,re)&&(t(this,re).setAttribute("aria-pressed",String(t(this,ye))),t(this,re).disabled=a),t(this,Ni)&&t(this,Ni).setAttribute("data-locked",String(t(this,ye)));const l=r?"mdi:lock-alert":t(this,ye)?"mdi:lock":"mdi:lock-open",d=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(d,l),"lock-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}re=new WeakMap,Ni=new WeakMap,ye=new WeakMap,vr=new WeakMap;const Hr=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 20px 0 24px;
    }

    .hrv-action-icon-btn {
      -webkit-appearance: none;
      appearance: none;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      transition: box-shadow var(--hrv-transition-speed, 0.2s), opacity var(--hrv-transition-speed, 0.2s);
    }
    .hrv-action-icon-btn:hover { opacity: 0.88; }
    .hrv-action-icon-btn:active { transition: none; opacity: 0.75; }
    .hrv-action-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .hrv-action-icon-btn[data-running=true] { box-shadow: 0 0 0 4px var(--hrv-ex-ring, #fff); }
    .hrv-action-icon-btn svg {
      width: 52px;
      height: 52px;
      display: block;
      fill: currentColor;
      pointer-events: none;
    }

    /* Override base-card's [part=card-icon]{color:var(--hrv-color-icon)} so the icon
       is always visible against the button background, not the card background. */
    .hrv-action-icon-btn [part=card-icon] {
      width: 52px;
      height: 52px;
      color: var(--hrv-color-on-primary, #fff);
    }
    [part=enable-toggle] {
      width: 100%;
      margin-top: 10px;
      padding: 6px 12px;
      border: 1px solid var(--hrv-color-border, rgba(0,0,0,0.12));
      border-radius: var(--hrv-radius-m, 10px);
      background: var(--hrv-color-surface-alt, rgba(0,0,0,0.04));
      color: var(--hrv-color-text, #212121);
      font: inherit;
      cursor: pointer;
    }
    [part=enable-toggle][aria-pressed=true] {
      background: var(--hrv-color-primary, #1976d2);
      color: var(--hrv-color-on-primary, #fff);
    }
    [part=enable-toggle]:disabled { opacity: 0.3; cursor: not-allowed; }

    @media (prefers-reduced-motion: reduce) {
      .hrv-action-icon-btn { transition: none; }
    }
  `;class hn extends g{constructor(){super(...arguments);s(this,ne,null);s(this,fr,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Hr}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-action-icon-btn" type="button"
              aria-label="${p(this.def.friendly_name)} - Run"
              ${e?"":"disabled"}>
              <span part="card-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,ne,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),e&&t(this,ne)&&this._attachGestureHandlers(t(this,ne),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})}}),this.renderCompanions(),B(this.root)}applyState(e,i){n(this,fr,e);const r=this.def.capabilities==="read-write",o=e==="on",a=!r||o||e==="unavailable"||e==="unknown";t(this,ne)&&(t(this,ne).disabled=a,t(this,ne).dataset.running=String(o));const l=o?"mdi:script-text":"mdi:script-text-play",d=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(d,l),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="turn_on"?{state:"on",attributes:{}}:null}}ne=new WeakMap,fr=new WeakMap,sr(hn,"staleOnMount",!1);class dn extends g{constructor(){super(...arguments);s(this,xe,null);s(this,At,null);s(this,mr,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Hr}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-action-icon-btn" type="button"
              aria-label="${p(this.def.friendly_name)} - Trigger"
              ${e?"":"disabled"}>
              <span part="card-icon" aria-hidden="true"></span>
            </button>
            ${e?'<button part="enable-toggle" type="button"></button>':""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,xe,this.root.querySelector(".hrv-action-icon-btn")),n(this,At,this.root.querySelector("[part=enable-toggle]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),e&&t(this,xe)&&(this._attachGestureHandlers(t(this,xe),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("trigger",{})}}),this._attachGestureHandlers(t(this,At),{onTap:()=>{const i=t(this,At)?.getAttribute("aria-pressed")==="true";this.config.card?.sendCommand(i?"turn_off":"turn_on",{})}})),this.renderCompanions(),B(this.root)}applyState(e,i){n(this,mr,e);const o=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,xe)&&(t(this,xe).disabled=o),t(this,At)&&(t(this,At).disabled=o,t(this,At).textContent=e==="on"?"Enabled":"Disabled",t(this,At).setAttribute("aria-pressed",String(e==="on")),t(this,At).setAttribute("aria-label",`${this.def.friendly_name} - ${e==="on"?"Disable":"Enable"}`));const a=e==="on"?"mdi:robot":"mdi:robot-off",l=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(l,a),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}predictState(e,i){return e==="turn_on"?{state:"on",attributes:{}}:e==="turn_off"?{state:"off",attributes:{}}:null}}xe=new WeakMap,At=new WeakMap,mr=new WeakMap,sr(dn,"staleOnMount",!1);class Tr extends g{constructor(){super(...arguments);s(this,we,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Hr}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-action-icon-btn" type="button"
              aria-label="${p(this.def.friendly_name)} - Press"
              ${e?"":"disabled"}>
              <span part="card-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,we,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),e&&t(this,we)&&this._attachGestureHandlers(t(this,we),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("press",{})}}),this.renderCompanions(),B(this.root)}applyState(e,i){const o=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,we)&&(t(this,we).disabled=o);const a=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(a,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}we=new WeakMap,sr(Tr,"staleOnMount",!1);const Ls=`
    [part=card-body] {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 0;
    }

    .hrv-person-circle {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.35;
    }
    .hrv-person-circle[data-home=true] { opacity: 1; }
    .hrv-person-circle [part=person-icon] {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      pointer-events: none;
    }
    .hrv-person-circle [part=person-icon] svg {
      width: 40px;
      height: 40px;
      fill: currentColor;
      display: block;
    }
    @media (prefers-reduced-motion: reduce) {
      .hrv-person-circle { transition: none; }
    }
  `;class Ir extends g{constructor(){super(...arguments);s(this,Zi,null)}render(){this.root.innerHTML=`
        <style>${Ls}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-person-circle" data-home="false"
              role="img" aria-label="${p(this.def.friendly_name)}">
              <span part="person-icon" aria-hidden="true"></span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Zi,this.root.querySelector(".hrv-person-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"person-icon"),this.renderCompanions(),B(this.root)}applyState(e,i){const r=e==="home";t(this,Zi)&&t(this,Zi).setAttribute("data-home",String(r));const o=e==="not_home"?"mdi:account-off":"mdi:home-account",a=this.def.icon_state_map?.[e]??this.def.icon??o;this.renderIcon(this.resolveIcon(a,o),"person-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Zi=new WeakMap,sr(Ir,"staleOnMount",!0),A._renderers=A._renderers||{};const ks=document.currentScript&&document.currentScript.dataset.rendererId||"minimus";A._renderers[ks]={light:Kn,fan:Qn,lock:Ss,script:hn,automation:dn,button:Tr,input_button:Tr,climate:is,binary_sensor:ns,cover:os,input_boolean:nn,input_number:en,number:en,input_select:rn,select:rn,media_player:ls,remote:ps,sensor:lr,"sensor.temperature":lr,"sensor.humidity":lr,"sensor.battery":lr,switch:nn,person:Ir,device_tracker:Ir,event:on,timer:ms,weather:As,generic:on,badge:null}})();})();
