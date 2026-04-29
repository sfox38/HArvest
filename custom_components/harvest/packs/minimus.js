(()=>{var Lr=(g,m,h)=>{if(!m.has(g))throw TypeError("Cannot "+h)};var t=(g,m,h)=>(Lr(g,m,"read from private field"),h?h.call(g):m.get(g)),r=(g,m,h)=>{if(m.has(g))throw TypeError("Cannot add the same private member more than once");m instanceof WeakSet?m.add(g):m.set(g,h)},s=(g,m,h,Pt)=>(Lr(g,m,"write to private field"),Pt?Pt.call(g,h):m.set(g,h),h);var o=(g,m,h)=>(Lr(g,m,"access private method"),h);(function(){"use strict";var Dt,E,fi,P,nt,w,Z,_e,Se,at,St,ot,dt,Gt,$e,W,ht,Xt,mi,ke,Cr,rn,_,Fi,Vr,Ni,Yr,Vi,Zr,Yi,Wr,Ce,mr,Le,gr,Zi,Ur,Kt,zi,Wi,Gr,Ui,Xr,gi,Ar,bi,Er,Gi,Kr,tt,j,Xi,D,Ae,O,lt,ct,pt,z,S,zt,$t,B,M,Jt,Ee,yi,Me,br,Qt,Bi,xi,Mr,Te,yr,wi,Tr,_i,qr,Bt,pi,Ki,Jr,Ji,Qr,Si,Hr,$i,Ir,Qi,ts,ki,Pr,tr,es,U,kt,ut,qe,Rt,He,Ie,Pe,F,N,De,ze,Be,Re,Ct,je,te,V,vt,Oe,Fe,Ne,ft,jt,ee,Ve,Ye,Ze,We,Ue,Ci,Ge,Li,Dr,er,is,ir,rs,Xe,xr,Ai,zr,Ke,wr,rr,ss,sr,ns,Ei,Br,Mi,Rr,nr,as,ar,os,k,ie,re,mt,C,se,ne,ae,Lt,gt,Ti,qi,Hi,Je,_r,or,ds,oe,At,T,H,Qe,Ot,Ft,Et,q,G,et,Mt,Nt,dr,hs,hr,ls,Vt,ui,ti,Sr,lr,cs,Yt,vi,ei,bt,Ii,Tt,de,cr,ps,Pi,jr,qt,ii,ri,he,le,yt,L,ce,pe,ue,xt,Ht,Di,si,$r,pr,us,Y,ni,ai,wt,oi,ve,K,It,Zt,Wt,fe,di,hi,it,li,ur,vs,vr,fs,fr,ms,me,Ri,ci,_t,ge,be;const g=window.HArvest;if(!g||!g.renderers||!g.renderers.BaseCard){console.warn("[HArvest Minimus] HArvest not found - pack not loaded.");return}const m=g.renderers.BaseCard;function h(c){return String(c??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Pt(c,p){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,c.apply(this,i)},p)}}function ye(c){return c?c.charAt(0).toUpperCase()+c.slice(1).replace(/_/g," "):""}const J=`
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
  `;function X(c){c.querySelectorAll("[part=companion]").forEach(p=>{p.title=p.getAttribute("aria-label")??""})}const gs=60,bs=60,Ut=48,R=225,b=270,st=2*Math.PI*Ut*(b/360);function ys(c){return c*Math.PI/180}function Q(c){const p=ys(c);return{x:gs+Ut*Math.cos(p),y:bs-Ut*Math.sin(p)}}function xs(){const c=Q(R),p=Q(R-b);return`M ${c.x} ${c.y} A ${Ut} ${Ut} 0 1 1 ${p.x} ${p.y}`}const xe=xs(),we=["brightness","temp","color"],ji=120;function Or(c){const p=b/ji;let e="";for(let i=0;i<ji;i++){const n=R-i*p,a=R-(i+1)*p,d=Q(n),l=Q(a),u=`M ${d.x} ${d.y} A ${Ut} ${Ut} 0 0 1 ${l.x} ${l.y}`,v=i===0||i===ji-1?"round":"butt";e+=`<path d="${u}" stroke="${c(i/ji)}" fill="none" stroke-width="8" stroke-linecap="${v}" />`}return e}const ws=Or(c=>`hsl(${Math.round(c*360)},100%,50%)`),_s=Or(c=>{const e=Math.round(143+112*c),i=Math.round(255*c);return`rgb(255,${e},${i})`}),kr=`
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
      padding: var(--hrv-spacing-m, 16px) 0;
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
      gap: 16px;
      padding: var(--hrv-spacing-m, 16px) 0;
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
      box-shadow: 0 0 0 0 transparent;
      transition: box-shadow 200ms ease, opacity 200ms ease;
    }
    .hrv-light-ro-circle[data-on=true] {
      opacity: 1;
      box-shadow: 0 0 0 5px var(--hrv-ex-ring, #fff);
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
  `,Ss=`
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
  `;class $s extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,Cr);r(this,Fi);r(this,Ni);r(this,Vi);r(this,Yi);r(this,Ce);r(this,Le);r(this,Zi);r(this,Kt);r(this,Wi);r(this,Ui);r(this,gi);r(this,bi);r(this,Gi);r(this,Dt,null);r(this,E,null);r(this,fi,null);r(this,P,null);r(this,nt,null);r(this,w,null);r(this,Z,null);r(this,_e,null);r(this,Se,null);r(this,at,0);r(this,St,4e3);r(this,ot,0);r(this,dt,!1);r(this,Gt,!1);r(this,$e,null);r(this,W,0);r(this,ht,2e3);r(this,Xt,6500);r(this,mi,void 0);r(this,ke,new Map);r(this,_,[]);s(this,mi,Pt(o(this,Gi,Kr).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],n=i.includes("brightness"),a=i.includes("color_temp"),d=i.includes("rgb_color"),l=e&&(n||a||d),u=[n,a,d].filter(Boolean).length,v=e&&u>1;s(this,ht,this.def.feature_config?.min_color_temp_kelvin??2e3),s(this,Xt,this.def.feature_config?.max_color_temp_kelvin??6500);const x=Q(R);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${kr}${Ss}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${l?"":"hrv-no-dial"}">
            ${l?`
              <div class="hrv-dial-column">
                <div class="hrv-dial-wrap" role="slider" aria-valuemin="0"
                  aria-valuemax="100" aria-valuenow="0"
                  aria-label="${h(this.def.friendly_name)} brightness"
                  title="Drag to adjust">
                  <svg viewBox="0 0 120 120">
                    <g class="hrv-dial-segs hrv-dial-segs-color">${ws}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${_s}</g>
                    <path class="hrv-dial-track" d="${xe}" />
                    <path class="hrv-dial-fill" d="${xe}"
                      stroke-dasharray="${st}"
                      stroke-dashoffset="${st}" />
                    <circle class="hrv-dial-thumb" r="7"
                      cx="${x.x}" cy="${x.y}" />
                    <circle class="hrv-dial-thumb-hit" r="16"
                      cx="${x.x}" cy="${x.y}" />
                  </svg>
                  <span class="hrv-dial-pct">0%</span>
                </div>
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-light-ro-center">
                <div class="hrv-light-ro-circle" data-on="false"
                  role="img" aria-label="${h(this.def.friendly_name)}"
                  title="Read-only">
                  <span part="ro-state-icon" aria-hidden="true"></span>
                </div>
                <div class="hrv-light-ro-dots">
                  ${n?'<span class="hrv-light-ro-dot" data-attr="brightness" title="Brightness"></span>':""}
                  ${a?'<span class="hrv-light-ro-dot" data-attr="temp" title="Color temperature"></span>':""}
                  ${d?'<span class="hrv-light-ro-dot" data-attr="color" title="Color"></span>':""}
                </div>
              </div>
            `}
            ${e?`
              <div class="hrv-dial-controls">
                ${v?`
                  <div class="hrv-mode-switch" data-pos="0" data-count="${u}"
                    role="radiogroup" aria-label="Dial mode" tabindex="0">
                    <div class="hrv-mode-switch-thumb"></div>
                    ${'<span class="hrv-mode-dot"></span>'.repeat(u)}
                  </div>
                `:""}
                <button part="toggle-button" type="button"
                  aria-label="${h(this.def.friendly_name)} - toggle"
                  title="Turn ${h(this.def.friendly_name)} on / off">
                  <div class="hrv-light-toggle-knob"></div>
                </button>
              </div>
            `:""}
          </div>
          ${l?"":this.renderCompanionZoneHTML()}
        </div>
      `,s(this,Dt,this.root.querySelector("[part=toggle-button]")),s(this,E,this.root.querySelector(".hrv-dial-fill")),s(this,fi,this.root.querySelector(".hrv-dial-track")),s(this,P,this.root.querySelector(".hrv-dial-thumb")),s(this,nt,this.root.querySelector(".hrv-dial-pct")),s(this,w,this.root.querySelector(".hrv-dial-wrap")),s(this,$e,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,_e,this.root.querySelector(".hrv-dial-segs-color")),s(this,Se,this.root.querySelector(".hrv-dial-segs-temp")),s(this,Z,this.root.querySelector(".hrv-mode-switch")),t(this,Dt)&&t(this,Dt).addEventListener("click",()=>{this.config.card?.sendCommand("toggle",{})}),t(this,w)&&(t(this,w).addEventListener("pointerdown",o(this,Wi,Gr).bind(this)),t(this,w).addEventListener("pointermove",o(this,Ui,Xr).bind(this)),t(this,w).addEventListener("pointerup",o(this,gi,Ar).bind(this)),t(this,w).addEventListener("pointercancel",o(this,gi,Ar).bind(this))),l&&o(this,Fi,Vr).call(this),t(this,Z)&&(t(this,Z).addEventListener("click",o(this,Ni,Yr).bind(this)),t(this,Z).addEventListener("keydown",o(this,Yi,Wr).bind(this)),t(this,Z).addEventListener("mousemove",o(this,Vi,Zr).bind(this))),o(this,Le,gr).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(I=>{I.title=I.getAttribute("aria-label")??"Companion";const A=I.getAttribute("data-entity");if(A&&t(this,ke).has(A)){const $=t(this,ke).get(A);I.setAttribute("data-on",String($==="on"))}})}applyState(e,i){if(s(this,dt,e==="on"),s(this,at,i?.brightness??0),i?.color_temp_kelvin!==void 0?s(this,St,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&s(this,St,Math.round(1e6/i.color_temp)),i?.hs_color)s(this,ot,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[a,d,l]=i.rgb_color;s(this,ot,Ls(a,d,l))}t(this,Dt)&&t(this,Dt).setAttribute("aria-pressed",String(t(this,dt)));const n=this.root.querySelector(".hrv-light-ro-circle");if(n){n.setAttribute("data-on",String(t(this,dt)));const a=t(this,dt)?"mdi:lightbulb":"mdi:lightbulb-outline",d=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??a;this.renderIcon(this.resolveIcon(d,a),"ro-state-icon");const l=i?.color_mode,u=l==="color_temp",v=l&&l!=="color_temp",x=this.root.querySelector('[data-attr="brightness"]');if(x){const $=Math.round(t(this,at)/255*100);x.title=t(this,dt)?`Brightness: ${$}%`:"Brightness: off"}const I=this.root.querySelector('[data-attr="temp"]');I&&(I.title=`Color temperature: ${t(this,St)}K`,I.style.display=v?"none":"");const A=this.root.querySelector('[data-attr="color"]');if(A)if(A.style.display=u?"none":"",i?.rgb_color){const[$,f,y]=i.rgb_color;A.style.background=`rgb(${$},${f},${y})`,A.title=`Color: rgb(${$}, ${f}, ${y})`}else A.style.background=`hsl(${t(this,ot)}, 100%, 50%)`,A.title=`Color: hue ${t(this,ot)}°`}o(this,Ce,mr).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,dt)?"off":"on",attributes:{brightness:t(this,at)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,n){t(this,ke).set(e,i),super.updateCompanionState(e,i,n)}}Dt=new WeakMap,E=new WeakMap,fi=new WeakMap,P=new WeakMap,nt=new WeakMap,w=new WeakMap,Z=new WeakMap,_e=new WeakMap,Se=new WeakMap,at=new WeakMap,St=new WeakMap,ot=new WeakMap,dt=new WeakMap,Gt=new WeakMap,$e=new WeakMap,W=new WeakMap,ht=new WeakMap,Xt=new WeakMap,mi=new WeakMap,ke=new WeakMap,Cr=new WeakSet,rn=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},_=new WeakMap,Fi=new WeakSet,Vr=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];s(this,_,[]),i[0]&&t(this,_).push(0),i[1]&&t(this,_).push(1),i[2]&&t(this,_).push(2),t(this,_).length===0&&t(this,_).push(0),t(this,_).includes(t(this,W))||s(this,W,t(this,_)[0])},Ni=new WeakSet,Yr=function(e){const i=t(this,Z).getBoundingClientRect(),n=e.clientY-i.top,a=i.height/3;let d;n<a?d=0:n<a*2?d=1:d=2,d=Math.min(d,t(this,_).length-1),s(this,W,t(this,_)[d]),t(this,Z).setAttribute("data-pos",String(d)),o(this,Le,gr).call(this),o(this,Ce,mr).call(this)},Vi=new WeakSet,Zr=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},n=t(this,Z).getBoundingClientRect(),a=Math.min(Math.floor((e.clientY-n.top)/(n.height/t(this,_).length)),t(this,_).length-1),d=we[t(this,_)[Math.max(0,a)]];t(this,Z).title=`Dial mode: ${i[d]??d}`},Yi=new WeakSet,Wr=function(e){const i=t(this,_).indexOf(t(this,W));let n=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")n=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")n=Math.min(t(this,_).length-1,i+1);else return;e.preventDefault(),s(this,W,t(this,_)[n]),t(this,Z).setAttribute("data-pos",String(n)),o(this,Le,gr).call(this),o(this,Ce,mr).call(this)},Ce=new WeakSet,mr=function(){t(this,P)&&(t(this,P).style.transition="none"),t(this,E)&&(t(this,E).style.transition="none"),o(this,Zi,Ur).call(this),t(this,P)?.getBoundingClientRect(),t(this,E)?.getBoundingClientRect(),t(this,P)&&(t(this,P).style.transition=""),t(this,E)&&(t(this,E).style.transition="")},Le=new WeakSet,gr=function(){if(!t(this,E))return;const e=we[t(this,W)],i=e==="color"||e==="temp";t(this,fi).style.display=i?"none":"",t(this,E).style.display=i?"none":"",t(this,_e)&&t(this,_e).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,Se)&&t(this,Se).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,E).setAttribute("stroke-dasharray",String(st));const n={brightness:"brightness",temp:"color temperature",color:"color"},a={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,w)?.setAttribute("aria-label",`${h(this.def.friendly_name)} ${n[e]}`),t(this,w)&&(t(this,w).title=a[e])},Zi=new WeakSet,Ur=function(){const e=we[t(this,W)];if(e==="brightness"){const i=t(this,dt)?t(this,at):0;o(this,Kt,zi).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,St)-t(this,ht))/(t(this,Xt)-t(this,ht))*100);o(this,Kt,zi).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,ot)/360*100);o(this,Kt,zi).call(this,i)}},Kt=new WeakSet,zi=function(e){const i=we[t(this,W)],n=e/100*b,a=Q(R-n);if(t(this,P)?.setAttribute("cx",String(a.x)),t(this,P)?.setAttribute("cy",String(a.y)),t(this,$e)?.setAttribute("cx",String(a.x)),t(this,$e)?.setAttribute("cy",String(a.y)),i==="brightness"){const d=st*(1-e/100);t(this,E)?.setAttribute("stroke-dashoffset",String(d)),t(this,nt)&&(t(this,nt).textContent=e+"%"),t(this,w)?.setAttribute("aria-valuenow",String(e))}else if(i==="temp"){const d=Math.round(t(this,ht)+e/100*(t(this,Xt)-t(this,ht)));t(this,nt)&&(t(this,nt).textContent=d+"K"),t(this,w)?.setAttribute("aria-valuenow",String(d))}else t(this,nt)&&(t(this,nt).textContent=Math.round(e/100*360)+"°"),t(this,w)?.setAttribute("aria-valuenow",String(Math.round(e/100*360)))},Wi=new WeakSet,Gr=function(e){s(this,Gt,!0),t(this,w)?.setPointerCapture(e.pointerId),o(this,bi,Er).call(this,e)},Ui=new WeakSet,Xr=function(e){t(this,Gt)&&o(this,bi,Er).call(this,e)},gi=new WeakSet,Ar=function(e){if(t(this,Gt)){s(this,Gt,!1);try{t(this,w)?.releasePointerCapture(e.pointerId)}catch{}t(this,mi).call(this)}},bi=new WeakSet,Er=function(e){if(!t(this,w))return;const i=t(this,w).getBoundingClientRect(),n=i.left+i.width/2,a=i.top+i.height/2,d=e.clientX-n,l=-(e.clientY-a);let u=Math.atan2(l,d)*180/Math.PI;u<0&&(u+=360);let v=R-u;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b);const x=Math.round(v/b*100),I=we[t(this,W)];I==="brightness"?s(this,at,Math.round(x/100*255)):I==="temp"?s(this,St,Math.round(t(this,ht)+x/100*(t(this,Xt)-t(this,ht)))):s(this,ot,Math.round(x/100*360)),t(this,E)&&(t(this,E).style.transition="none"),t(this,P)&&(t(this,P).style.transition="none"),o(this,Kt,zi).call(this,x)},Gi=new WeakSet,Kr=function(){t(this,E)&&(t(this,E).style.transition=""),t(this,P)&&(t(this,P).style.transition="");const e=we[t(this,W)];e==="brightness"?t(this,at)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,at)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,St)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,ot),100]})};const ks=kr+`
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
      box-shadow: 0 0 0 0 transparent;
      transition: box-shadow 200ms ease, opacity 200ms ease;
    }
    .hrv-fan-ro-circle[data-on=true] {
      opacity: 1;
      box-shadow: 0 0 0 5px var(--hrv-ex-ring, #fff);
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
  `;class Cs extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,Me);r(this,Qt);r(this,xi);r(this,Te);r(this,wi);r(this,_i);r(this,Bt);r(this,Ki);r(this,Ji);r(this,Si);r(this,$i);r(this,Qi);r(this,ki);r(this,tr);r(this,tt,null);r(this,j,null);r(this,Xi,null);r(this,D,null);r(this,Ae,null);r(this,O,null);r(this,lt,null);r(this,ct,null);r(this,pt,null);r(this,z,!1);r(this,S,0);r(this,zt,!1);r(this,$t,"forward");r(this,B,null);r(this,M,[]);r(this,Jt,!1);r(this,Ee,null);r(this,yi,void 0);s(this,yi,Pt(o(this,Qi,ts).bind(this),300)),s(this,M,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],n=i.includes("set_speed"),a=i.includes("oscillate"),d=i.includes("direction"),l=i.includes("preset_mode"),u=e&&n,v=u&&t(this,Qt,Bi),x=v&&!t(this,M).length,I=v&&!!t(this,M).length,A=Q(R);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ks}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${u?x?"hrv-fan-horiz":"":"hrv-no-dial"}">
            ${u?`
              <div class="hrv-dial-column">
                ${x?`
                  <div class="hrv-fan-hspeed-wrap">
                    <div class="hrv-fan-hspeed-switch" role="group"
                      aria-label="${h(this.def.friendly_name)} speed"
                      data-on="false">
                      <div class="hrv-fan-hspeed-thumb"></div>
                      ${t(this,Te,yr).map((f,y)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${f}" data-idx="${y}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${y+1} (${f}%)"
                          title="Speed ${y+1} (${f}%)"></div>
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
                  <div class="hrv-dial-wrap" role="slider"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                    aria-label="${h(this.def.friendly_name)} speed"
                    title="Drag to adjust fan speed">
                    <svg viewBox="0 0 120 120">
                      <path class="hrv-dial-track" d="${xe}" />
                      <path class="hrv-dial-fill" d="${xe}"
                        stroke-dasharray="${st}"
                        stroke-dashoffset="${st}" />
                      <circle class="hrv-dial-thumb" r="7"
                        cx="${A.x}" cy="${A.y}" />
                      <circle class="hrv-dial-thumb-hit" r="16"
                        cx="${A.x}" cy="${A.y}" />
                    </svg>
                    <span class="hrv-dial-pct">0%</span>
                  </div>
                `}
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-fan-ro-center">
                <div class="hrv-fan-ro-circle" data-on="false"
                  role="img" aria-label="${h(this.def.friendly_name)}"
                  title="Read-only">
                  <span part="ro-state-icon" aria-hidden="true"></span>
                </div>
              </div>
            `}
            ${e?`
              <div class="hrv-dial-controls">
                ${a?`
                  <button class="hrv-fan-feat-btn" data-feat="oscillate" type="button"
                    aria-label="Oscillate: off" title="Oscillate: off"></button>
                `:""}
                ${d?`
                  <button class="hrv-fan-feat-btn" data-feat="direction" type="button"
                    aria-label="Direction: forward" title="Direction: forward"></button>
                `:""}
                ${l?`
                  <button class="hrv-fan-feat-btn" data-feat="preset" type="button"
                    aria-label="Preset: none" title="Preset: none"></button>
                `:""}
                <button part="toggle-button" type="button"
                  aria-label="${h(this.def.friendly_name)} - toggle"
                  title="Turn ${h(this.def.friendly_name)} on / off">${u?"":'<span part="fan-onoff-icon" aria-hidden="true"></span>'}</button>
              </div>
            `:""}
          </div>
          ${u?"":this.renderCompanionZoneHTML()}
        </div>
      `,s(this,tt,this.root.querySelector("[part=toggle-button]")),s(this,j,this.root.querySelector(".hrv-dial-fill")),s(this,Xi,this.root.querySelector(".hrv-dial-track")),s(this,D,this.root.querySelector(".hrv-dial-thumb")),s(this,Ae,this.root.querySelector(".hrv-dial-pct")),s(this,O,this.root.querySelector(".hrv-dial-wrap")),s(this,Ee,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,lt,this.root.querySelector('[data-feat="oscillate"]')),s(this,ct,this.root.querySelector('[data-feat="direction"]')),s(this,pt,this.root.querySelector('[data-feat="preset"]')),t(this,tt)&&!u&&(this.renderIcon(this.def.icon??"mdi:fan","fan-onoff-icon"),t(this,tt).setAttribute("data-animate",String(!!this.config.animate))),t(this,tt)?.addEventListener("click",()=>{this.config.card?.sendCommand("toggle",{})}),t(this,O)&&(t(this,O).addEventListener("pointerdown",o(this,Ki,Jr).bind(this)),t(this,O).addEventListener("pointermove",o(this,Ji,Qr).bind(this)),t(this,O).addEventListener("pointerup",o(this,Si,Hr).bind(this)),t(this,O).addEventListener("pointercancel",o(this,Si,Hr).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const f=t(this,Te,yr);if(!f.length)return;let y;if(!t(this,z)||t(this,S)===0)y=f[0],s(this,z,!0),t(this,tt)?.setAttribute("aria-pressed","true");else{const rt=f.findIndex(en=>en>t(this,S));y=rt===-1?f[0]:f[rt]}s(this,S,y),o(this,wi,Tr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:y})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(f=>{const y=()=>{const rt=Number(f.getAttribute("data-pct"));t(this,z)||(s(this,z,!0),t(this,tt)?.setAttribute("aria-pressed","true")),s(this,S,rt),o(this,_i,qr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:rt})};f.addEventListener("click",y),f.addEventListener("keydown",rt=>{(rt.key==="Enter"||rt.key===" ")&&(rt.preventDefault(),y())})}),t(this,lt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,zt)})}),t(this,ct)?.addEventListener("click",()=>{const f=t(this,$t)==="forward"?"reverse":"forward";s(this,$t,f),o(this,Bt,pi).call(this),this.config.card?.sendCommand("set_direction",{direction:f})}),t(this,pt)?.addEventListener("click",()=>{if(t(this,M).length){if(t(this,xi,Mr)){const f=t(this,B)??t(this,M)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:f});return}if(t(this,B)){const f=t(this,M).indexOf(t(this,B));if(f===-1||f===t(this,M).length-1){s(this,B,null),o(this,Bt,pi).call(this);const y=t(this,Me,br),rt=Math.floor(t(this,S)/y)*y||y;this.config.card?.sendCommand("set_percentage",{percentage:rt})}else{const y=t(this,M)[f+1];s(this,B,y),o(this,Bt,pi).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:y})}}else{const f=t(this,M)[0];s(this,B,f),o(this,Bt,pi).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:f})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.def.icon??"mdi:fan","ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(f=>{f.title=f.getAttribute("aria-label")??"Companion"})}applyState(e,i){s(this,z,e==="on"),s(this,S,i?.percentage??0),s(this,zt,i?.oscillating??!1),s(this,$t,i?.direction??"forward"),s(this,B,i?.preset_mode??null),i?.preset_modes?.length&&s(this,M,i.preset_modes),t(this,tt)&&t(this,tt).setAttribute("aria-pressed",String(t(this,z)));const n=this.root.querySelector(".hrv-fan-ro-circle");n&&n.setAttribute("data-on",String(t(this,z))),t(this,Qt,Bi)&&!t(this,M).length?o(this,_i,qr).call(this):t(this,Qt,Bi)?o(this,wi,Tr).call(this):o(this,tr,es).call(this),o(this,Bt,pi).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,S)>0?`, ${t(this,S)}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,z)?"off":"on",attributes:{percentage:t(this,S)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,zt),direction:t(this,$t),preset_mode:t(this,B),preset_modes:t(this,M)}}:null}}tt=new WeakMap,j=new WeakMap,Xi=new WeakMap,D=new WeakMap,Ae=new WeakMap,O=new WeakMap,lt=new WeakMap,ct=new WeakMap,pt=new WeakMap,z=new WeakMap,S=new WeakMap,zt=new WeakMap,$t=new WeakMap,B=new WeakMap,M=new WeakMap,Jt=new WeakMap,Ee=new WeakMap,yi=new WeakMap,Me=new WeakSet,br=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},Qt=new WeakSet,Bi=function(){return t(this,Me,br)>1},xi=new WeakSet,Mr=function(){return t(this,Qt,Bi)&&t(this,M).length>0},Te=new WeakSet,yr=function(){const e=t(this,Me,br),i=[];for(let n=1;n*e<=100.001;n++)i.push(Math.floor(n*e*10)/10);return i},wi=new WeakSet,Tr=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,z)));const i=t(this,z)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},_i=new WeakSet,qr=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),n=t(this,Te,yr);let a=-1;if(t(this,z)&&t(this,S)>0){let d=1/0;n.forEach((l,u)=>{const v=Math.abs(l-t(this,S));v<d&&(d=v,a=u)})}e.setAttribute("data-on",String(a>=0)),i&&a>=0&&(i.style.left=`${2+a*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((d,l)=>{d.setAttribute("data-active",String(l===a))})},Bt=new WeakSet,pi=function(){const e=t(this,xi,Mr);if(t(this,lt)){const i=e||t(this,zt),n=e?"Oscillate":`Oscillate: ${t(this,zt)?"on":"off"}`;t(this,lt).setAttribute("data-on",String(i)),t(this,lt).setAttribute("aria-pressed",String(i)),t(this,lt).setAttribute("aria-label",n),t(this,lt).title=n}if(t(this,ct)){const i=t(this,$t)!=="reverse",n=`Direction: ${t(this,$t)}`;t(this,ct).setAttribute("data-on",String(i)),t(this,ct).setAttribute("aria-pressed",String(i)),t(this,ct).setAttribute("aria-label",n),t(this,ct).title=n}if(t(this,pt)){const i=e||!!t(this,B),n=e?t(this,B)??t(this,M)[0]??"Preset":t(this,B)?`Preset: ${t(this,B)}`:"Preset: none";t(this,pt).setAttribute("data-on",String(i)),t(this,pt).setAttribute("aria-pressed",String(i)),t(this,pt).setAttribute("aria-label",n),t(this,pt).title=n}},Ki=new WeakSet,Jr=function(e){s(this,Jt,!0),t(this,O)?.setPointerCapture(e.pointerId),o(this,$i,Ir).call(this,e)},Ji=new WeakSet,Qr=function(e){t(this,Jt)&&o(this,$i,Ir).call(this,e)},Si=new WeakSet,Hr=function(e){if(t(this,Jt)){s(this,Jt,!1);try{t(this,O)?.releasePointerCapture(e.pointerId)}catch{}t(this,yi).call(this)}},$i=new WeakSet,Ir=function(e){if(!t(this,O))return;const i=t(this,O).getBoundingClientRect(),n=i.left+i.width/2,a=i.top+i.height/2,d=e.clientX-n,l=-(e.clientY-a);let u=Math.atan2(l,d)*180/Math.PI;u<0&&(u+=360);let v=R-u;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b),s(this,S,Math.round(v/b*100)),t(this,j)&&(t(this,j).style.transition="none"),t(this,D)&&(t(this,D).style.transition="none"),o(this,ki,Pr).call(this,t(this,S))},Qi=new WeakSet,ts=function(){t(this,j)&&(t(this,j).style.transition=""),t(this,D)&&(t(this,D).style.transition=""),t(this,S)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,S)})},ki=new WeakSet,Pr=function(e){const i=st*(1-e/100),n=Q(R-e/100*b);t(this,j)?.setAttribute("stroke-dashoffset",String(i)),t(this,D)?.setAttribute("cx",String(n.x)),t(this,D)?.setAttribute("cy",String(n.y)),t(this,Ee)?.setAttribute("cx",String(n.x)),t(this,Ee)?.setAttribute("cy",String(n.y)),t(this,Ae)&&(t(this,Ae).textContent=`${e}%`),t(this,O)?.setAttribute("aria-valuenow",String(e))},tr=new WeakSet,es=function(){t(this,D)&&(t(this,D).style.transition="none"),t(this,j)&&(t(this,j).style.transition="none"),o(this,ki,Pr).call(this,t(this,z)?t(this,S):0),t(this,D)?.getBoundingClientRect(),t(this,j)?.getBoundingClientRect(),t(this,D)&&(t(this,D).style.transition=""),t(this,j)&&(t(this,j).style.transition="")};function Ls(c,p,e){c/=255,p/=255,e/=255;const i=Math.max(c,p,e),n=Math.min(c,p,e),a=i-n;if(a===0)return 0;let d;return i===c?d=(p-e)/a%6:i===p?d=(e-c)/a+2:d=(c-p)/a+4,Math.round((d*60+360)%360)}const As=kr+`
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

    .hrv-climate-dropdown {
      position: absolute;
      bottom: calc(100% - 8px);
      left: 0;
      right: 0;
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.15));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: var(--hrv-radius-s, 8px);
      box-shadow: 0 -4px 16px rgba(0,0,0,0.25), 0 0 0 1px var(--hrv-ex-glass-border, rgba(255,255,255,0.12));
      overflow: hidden;
      max-height: 280px;
      overflow-y: auto;
      scrollbar-width: none;
      z-index: 10;
    }
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
  `;class Es extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,Li);r(this,er);r(this,ir);r(this,Xe);r(this,Ai);r(this,Ke);r(this,rr);r(this,sr);r(this,Ei);r(this,Mi);r(this,nr);r(this,ar);r(this,U,null);r(this,kt,null);r(this,ut,null);r(this,qe,null);r(this,Rt,!1);r(this,He,null);r(this,Ie,null);r(this,Pe,null);r(this,F,null);r(this,N,null);r(this,De,null);r(this,ze,null);r(this,Be,null);r(this,Re,null);r(this,Ct,null);r(this,je,null);r(this,te,null);r(this,V,20);r(this,vt,"off");r(this,Oe,null);r(this,Fe,null);r(this,Ne,null);r(this,ft,16);r(this,jt,32);r(this,ee,.5);r(this,Ve,"°C");r(this,Ye,[]);r(this,Ze,[]);r(this,We,[]);r(this,Ue,[]);r(this,Ci,{});r(this,Ge,void 0);s(this,Ge,Pt(o(this,nr,as).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features?.includes("target_temperature"),n=this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0,a=this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0,d=this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0;s(this,ft,this.def.feature_config?.min_temp??16),s(this,jt,this.def.feature_config?.max_temp??32),s(this,ee,this.def.feature_config?.temp_step??.5),s(this,Ve,this.def.unit_of_measurement??"°C"),s(this,Ye,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),s(this,Ze,this.def.feature_config?.fan_modes??[]),s(this,We,this.def.feature_config?.preset_modes??[]),s(this,Ue,this.def.feature_config?.swing_modes??[]);const l=o(this,Li,Dr).call(this,t(this,V)),u=Q(R),v=Q(R-l/100*b),x=st*(1-l/100),[I,A]=t(this,V).toFixed(1).split(".");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${As}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e&&i?`
              <div class="hrv-dial-wrap">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path class="hrv-dial-track" d="${xe}"/>
                  <path class="hrv-dial-fill" d="${xe}"
                    stroke-dasharray="${st}" stroke-dashoffset="${x}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${v.x}" cy="${v.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${v.x}" cy="${v.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${h(I)}</span><span class="hrv-climate-temp-frac">.${h(A)}</span><span class="hrv-climate-temp-unit">${h(t(this,Ve))}</span>
                  </div>
                </div>
              </div>
              <div class="hrv-climate-stepper">
                <button class="hrv-climate-step" type="button" aria-label="Decrease temperature" title="Decrease temperature" data-dir="-">&#8722;</button>
                <button class="hrv-climate-step" type="button" aria-label="Increase temperature" title="Increase temperature" data-dir="+">+</button>
              </div>
            `:!e&&i?`
              <div class="hrv-climate-ro-temp">
                <div class="hrv-climate-ro-temp-row">
                  <span class="hrv-climate-ro-temp-int">${h(I)}</span><span class="hrv-climate-ro-temp-frac">.${h(A)}</span><span class="hrv-climate-ro-temp-unit">${h(t(this,Ve))}</span>
                </div>
              </div>
            `:""}
            <div class="hrv-climate-grid">
              ${t(this,Ye).length?`
                <button class="hrv-cf-btn" data-feat="mode" type="button"
                  ${e?'title="Change HVAC mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${a&&t(this,We).length?`
                <button class="hrv-cf-btn" data-feat="preset" type="button"
                  ${e?'title="Change preset mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Preset</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${n&&t(this,Ze).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button"
                  ${e?'title="Change fan mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${d&&t(this,Ue).length?`
                <button class="hrv-cf-btn" data-feat="swing" type="button"
                  ${e?'title="Change swing mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Swing mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${e?'<div class="hrv-climate-dropdown" hidden></div>':""}
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,U,this.root.querySelector(".hrv-dial-wrap")),s(this,kt,this.root.querySelector(".hrv-dial-fill")),s(this,ut,this.root.querySelector(".hrv-dial-thumb")),s(this,qe,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,He,this.root.querySelector(".hrv-climate-state-text")),s(this,Ie,this.root.querySelector(".hrv-climate-temp-int")),s(this,Pe,this.root.querySelector(".hrv-climate-temp-frac")),s(this,F,this.root.querySelector("[data-dir='-']")),s(this,N,this.root.querySelector("[data-dir='+']")),s(this,De,this.root.querySelector("[data-feat=mode]")),s(this,ze,this.root.querySelector("[data-feat=fan]")),s(this,Be,this.root.querySelector("[data-feat=preset]")),s(this,Re,this.root.querySelector("[data-feat=swing]")),s(this,Ct,this.root.querySelector(".hrv-climate-dropdown")),t(this,U)&&(t(this,U).addEventListener("pointerdown",o(this,rr,ss).bind(this)),t(this,U).addEventListener("pointermove",o(this,sr,ns).bind(this)),t(this,U).addEventListener("pointerup",o(this,Ei,Br).bind(this)),t(this,U).addEventListener("pointercancel",o(this,Ei,Br).bind(this))),t(this,F)&&(t(this,F).addEventListener("click",()=>o(this,Ai,zr).call(this,-1)),t(this,F).addEventListener("pointerdown",()=>t(this,F).setAttribute("data-pressing","true")),t(this,F).addEventListener("pointerup",()=>t(this,F).removeAttribute("data-pressing")),t(this,F).addEventListener("pointerleave",()=>t(this,F).removeAttribute("data-pressing")),t(this,F).addEventListener("pointercancel",()=>t(this,F).removeAttribute("data-pressing"))),t(this,N)&&(t(this,N).addEventListener("click",()=>o(this,Ai,zr).call(this,1)),t(this,N).addEventListener("pointerdown",()=>t(this,N).setAttribute("data-pressing","true")),t(this,N).addEventListener("pointerup",()=>t(this,N).removeAttribute("data-pressing")),t(this,N).addEventListener("pointerleave",()=>t(this,N).removeAttribute("data-pressing")),t(this,N).addEventListener("pointercancel",()=>t(this,N).removeAttribute("data-pressing"))),e&&[t(this,De),t(this,ze),t(this,Be),t(this,Re)].forEach($=>{if(!$)return;const f=$.getAttribute("data-feat");$.addEventListener("click",()=>o(this,ir,rs).call(this,f)),$.addEventListener("pointerdown",()=>$.setAttribute("data-pressing","true")),$.addEventListener("pointerup",()=>$.removeAttribute("data-pressing")),$.addEventListener("pointerleave",()=>$.removeAttribute("data-pressing")),$.addEventListener("pointercancel",()=>$.removeAttribute("data-pressing"))}),this.renderCompanions(),X(this.root)}applyState(e,i){s(this,Ci,{...i}),s(this,vt,e),s(this,Oe,i.fan_mode??null),s(this,Fe,i.preset_mode??null),s(this,Ne,i.swing_mode??null),!t(this,Rt)&&i.temperature!==void 0&&(s(this,V,i.temperature),o(this,Ke,wr).call(this)),t(this,He)&&(t(this,He).textContent=ye(i.hvac_action??e));const n=this.root.querySelector(".hrv-climate-ro-temp-int"),a=this.root.querySelector(".hrv-climate-ro-temp-frac");if(n&&i.temperature!==void 0){s(this,V,i.temperature);const[u,v]=t(this,V).toFixed(1).split(".");n.textContent=u,a.textContent=`.${v}`}o(this,ar,os).call(this);const d=i.hvac_action??e,l=ye(d);this.announceState(`${this.def.friendly_name}, ${l}`)}predictState(e,i){const n={...t(this,Ci)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:n}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,vt),attributes:{...n,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,vt),attributes:{...n,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,vt),attributes:{...n,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,vt),attributes:{...n,swing_mode:i.swing_mode}}:null}}U=new WeakMap,kt=new WeakMap,ut=new WeakMap,qe=new WeakMap,Rt=new WeakMap,He=new WeakMap,Ie=new WeakMap,Pe=new WeakMap,F=new WeakMap,N=new WeakMap,De=new WeakMap,ze=new WeakMap,Be=new WeakMap,Re=new WeakMap,Ct=new WeakMap,je=new WeakMap,te=new WeakMap,V=new WeakMap,vt=new WeakMap,Oe=new WeakMap,Fe=new WeakMap,Ne=new WeakMap,ft=new WeakMap,jt=new WeakMap,ee=new WeakMap,Ve=new WeakMap,Ye=new WeakMap,Ze=new WeakMap,We=new WeakMap,Ue=new WeakMap,Ci=new WeakMap,Ge=new WeakMap,Li=new WeakSet,Dr=function(e){return Math.max(0,Math.min(100,(e-t(this,ft))/(t(this,jt)-t(this,ft))*100))},er=new WeakSet,is=function(e){const i=t(this,ft)+e/100*(t(this,jt)-t(this,ft)),n=Math.round(i/t(this,ee))*t(this,ee);return Math.max(t(this,ft),Math.min(t(this,jt),+n.toFixed(10)))},ir=new WeakSet,rs=function(e){if(t(this,je)===e){o(this,Xe,xr).call(this);return}s(this,je,e);let i=[],n=null,a="",d="";switch(e){case"mode":i=t(this,Ye),n=t(this,vt),a="set_hvac_mode",d="hvac_mode";break;case"fan":i=t(this,Ze),n=t(this,Oe),a="set_fan_mode",d="fan_mode";break;case"preset":i=t(this,We),n=t(this,Fe),a="set_preset_mode",d="preset_mode";break;case"swing":i=t(this,Ue),n=t(this,Ne),a="set_swing_mode",d="swing_mode";break}if(!i.length||!t(this,Ct))return;t(this,Ct).innerHTML=i.map(u=>`
        <button class="hrv-cf-option" data-active="${u===n}" type="button">
          ${h(ye(u))}
        </button>
      `).join(""),t(this,Ct).querySelectorAll(".hrv-cf-option").forEach((u,v)=>{u.addEventListener("click",()=>{this.config.card?.sendCommand(a,{[d]:i[v]}),o(this,Xe,xr).call(this)})}),t(this,Ct).removeAttribute("hidden");const l=u=>{u.composedPath().some(x=>x===this.root||x===this.root.host)||o(this,Xe,xr).call(this)};s(this,te,l),document.addEventListener("pointerdown",l,!0)},Xe=new WeakSet,xr=function(){s(this,je,null),t(this,Ct)?.setAttribute("hidden",""),t(this,te)&&(document.removeEventListener("pointerdown",t(this,te),!0),s(this,te,null))},Ai=new WeakSet,zr=function(e){const i=Math.round((t(this,V)+e*t(this,ee))*100)/100;s(this,V,Math.max(t(this,ft),Math.min(t(this,jt),i))),o(this,Ke,wr).call(this),t(this,Ge).call(this)},Ke=new WeakSet,wr=function(){const e=o(this,Li,Dr).call(this,t(this,V)),i=st*(1-e/100),n=Q(R-e/100*b);t(this,kt)?.setAttribute("stroke-dashoffset",String(i)),t(this,ut)?.setAttribute("cx",String(n.x)),t(this,ut)?.setAttribute("cy",String(n.y)),t(this,qe)?.setAttribute("cx",String(n.x)),t(this,qe)?.setAttribute("cy",String(n.y));const[a,d]=t(this,V).toFixed(1).split(".");t(this,Ie)&&(t(this,Ie).textContent=a),t(this,Pe)&&(t(this,Pe).textContent=`.${d}`)},rr=new WeakSet,ss=function(e){s(this,Rt,!0),t(this,U)?.setPointerCapture(e.pointerId),o(this,Mi,Rr).call(this,e)},sr=new WeakSet,ns=function(e){t(this,Rt)&&o(this,Mi,Rr).call(this,e)},Ei=new WeakSet,Br=function(e){if(t(this,Rt)){s(this,Rt,!1);try{t(this,U)?.releasePointerCapture(e.pointerId)}catch{}t(this,kt)&&(t(this,kt).style.transition=""),t(this,ut)&&(t(this,ut).style.transition="")}},Mi=new WeakSet,Rr=function(e){if(!t(this,U))return;const i=t(this,U).getBoundingClientRect(),n=i.left+i.width/2,a=i.top+i.height/2,d=e.clientX-n,l=-(e.clientY-a);let u=Math.atan2(l,d)*180/Math.PI;u<0&&(u+=360);let v=R-u;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b),s(this,V,o(this,er,is).call(this,v/b*100)),t(this,kt)&&(t(this,kt).style.transition="none"),t(this,ut)&&(t(this,ut).style.transition="none"),o(this,Ke,wr).call(this),t(this,Ge).call(this)},nr=new WeakSet,as=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,V)})},ar=new WeakSet,os=function(){const e=(i,n)=>{if(!i)return;const a=i.querySelector(".hrv-cf-value");a&&(a.textContent=ye(n??"None"))};e(t(this,De),t(this,vt)),e(t(this,ze),t(this,Oe)),e(t(this,Be),t(this,Fe)),e(t(this,Re),t(this,Ne))};const Ms=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--hrv-spacing-s);
      padding: var(--hrv-spacing-s) 0 var(--hrv-spacing-m);
    }

    [part=btn-icon] {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-on-primary, #fff);
      pointer-events: none;
    }
    [part=btn-icon] svg { width: 40px; height: 40px; }

    [part=trigger-button] {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      border: none;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--hrv-color-primary);
      cursor: pointer;
      box-shadow: 0 0 0 0 transparent;
      transition:
        box-shadow 200ms ease,
        background var(--hrv-transition-speed),
        opacity 80ms;
    }

    [part=trigger-button]:hover { opacity: 0.88; }

    [part=trigger-button][data-pressing=true] {
      box-shadow: 0 0 0 5px var(--hrv-ex-ring, #fff);
      transition: box-shadow 0ms, background var(--hrv-transition-speed), opacity 80ms;
    }

    [part=trigger-button][data-state=triggered] {
      background: var(--hrv-color-primary, #1976d2);
      opacity: 0.5;
    }

    [part=trigger-button]:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `;class Ts extends m{constructor(){super(...arguments);r(this,k,null)}render(){const e=this.def.capabilities==="read-write",i=this.def.friendly_name;this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ms}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(i)}</span>
          </div>
          <div part="card-body">
            <button part="trigger-button" type="button"
              aria-label="${h(i)}"
              title="${e?h(i):"Read-only"}"
              ${e?"":"disabled"}>
              <span part="btn-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,k,this.root.querySelector("[part=trigger-button]")),this.renderIcon(this.def.icon_state_map?.idle??this.def.icon??"mdi:play","btn-icon"),t(this,k)&&e&&(t(this,k).addEventListener("click",()=>{t(this,k).disabled=!0,this.config.card?.sendCommand("trigger",{})}),t(this,k).addEventListener("pointerdown",()=>t(this,k).setAttribute("data-pressing","true")),t(this,k).addEventListener("pointerup",()=>t(this,k).removeAttribute("data-pressing")),t(this,k).addEventListener("pointerleave",()=>t(this,k).removeAttribute("data-pressing")),t(this,k).addEventListener("pointercancel",()=>t(this,k).removeAttribute("data-pressing"))),this.renderCompanions(),X(this.root)}applyState(e,i){const n=e==="triggered";t(this,k)&&(t(this,k).setAttribute("data-state",e),this.def.capabilities==="read-write"&&(t(this,k).disabled=n));const a=this.def.icon_state_map?.[e]??this.def.icon??"mdi:play";this.renderIcon(a,"btn-icon"),n&&this.announceState(`${this.def.friendly_name}, ${this.i18n.t("state.triggered")}`)}predictState(e,i){return e!=="trigger"?null:{state:"triggered",attributes:{}}}}k=new WeakMap;const qs=`
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
  `;class Hs extends m{constructor(){super(...arguments);r(this,ie,null)}render(){this.root.innerHTML=`
        <style>${this.getSharedStyles()}${qs}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-bs-circle" data-on="false"
              role="img" aria-label="${h(this.def.friendly_name)}">
              <span part="state-icon" aria-hidden="true"></span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,ie,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.def.icon_state_map?.off??this.def.icon??"mdi:radiobox-blank","state-icon"),this.renderCompanions(),X(this.root)}applyState(e,i){const n=e==="on",a=this.i18n.t(`state.${e}`)!==`state.${e}`?this.i18n.t(`state.${e}`):e;t(this,ie)&&(t(this,ie).setAttribute("data-on",String(n)),t(this,ie).setAttribute("aria-label",`${this.def.friendly_name}: ${a}`));const d=this.def.icon_state_map?.[e]??this.def.icon??(n?"mdi:radiobox-marked":"mdi:radiobox-blank");this.renderIcon(d,"state-icon"),this.announceState(`${this.def.friendly_name}, ${a}`)}}ie=new WeakMap;const Is='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',Ps='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',Ds='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',zs=`
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
  `;class Bs extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,Je);r(this,or);r(this,re,null);r(this,mt,null);r(this,C,null);r(this,se,null);r(this,ne,null);r(this,ae,null);r(this,Lt,!1);r(this,gt,0);r(this,Ti,"closed");r(this,qi,{});r(this,Hi,void 0);s(this,Hi,Pt(o(this,or,ds).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features?.includes("set_position"),n=!this.def.supported_features||this.def.supported_features.includes("buttons");if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${zs}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${i?`
              <div class="hrv-cover-slider-wrap" title="${e?"Drag to set position":"Read-only"}">
                <div class="hrv-cover-slider-track" ${e?"":'style="cursor:not-allowed"'}>
                  <div class="hrv-cover-slider-fill" style="width:0%"></div>
                  <div class="hrv-cover-slider-thumb" style="left:0%;${e?"":"cursor:not-allowed;pointer-events:none"}"></div>
                </div>
              </div>
            `:""}
            ${e&&n?`
              <div class="hrv-cover-btns">
                <button class="hrv-cover-btn" data-action="open" type="button"
                  title="Open cover" aria-label="Open cover">${Is}</button>
                <button class="hrv-cover-btn" data-action="stop" type="button"
                  title="Stop cover" aria-label="Stop cover">${Ps}</button>
                <button class="hrv-cover-btn" data-action="close" type="button"
                  title="Close cover" aria-label="Close cover">${Ds}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,re,this.root.querySelector(".hrv-cover-slider-track")),s(this,mt,this.root.querySelector(".hrv-cover-slider-fill")),s(this,C,this.root.querySelector(".hrv-cover-slider-thumb")),s(this,se,this.root.querySelector("[data-action=open]")),s(this,ne,this.root.querySelector("[data-action=stop]")),s(this,ae,this.root.querySelector("[data-action=close]")),t(this,re)&&t(this,C)&&e){const a=l=>{s(this,Lt,!0),t(this,C).style.transition="none",t(this,mt).style.transition="none",o(this,Je,_r).call(this,l),t(this,C).setPointerCapture(l.pointerId)};t(this,C).addEventListener("pointerdown",a),t(this,re).addEventListener("pointerdown",l=>{l.target!==t(this,C)&&(s(this,Lt,!0),t(this,C).style.transition="none",t(this,mt).style.transition="none",o(this,Je,_r).call(this,l),t(this,C).setPointerCapture(l.pointerId))}),t(this,C).addEventListener("pointermove",l=>{t(this,Lt)&&o(this,Je,_r).call(this,l)});const d=()=>{t(this,Lt)&&(s(this,Lt,!1),t(this,C).style.transition="",t(this,mt).style.transition="",t(this,Hi).call(this))};t(this,C).addEventListener("pointerup",d),t(this,C).addEventListener("pointercancel",d)}[t(this,se),t(this,ne),t(this,ae)].forEach(a=>{if(!a)return;const d=a.getAttribute("data-action");a.addEventListener("click",()=>{this.config.card?.sendCommand(`${d}_cover`,{})}),a.addEventListener("pointerdown",()=>a.setAttribute("data-pressing","true")),a.addEventListener("pointerup",()=>a.removeAttribute("data-pressing")),a.addEventListener("pointerleave",()=>a.removeAttribute("data-pressing")),a.addEventListener("pointercancel",()=>a.removeAttribute("data-pressing"))}),this.renderCompanions(),X(this.root)}applyState(e,i){s(this,Ti,e),s(this,qi,{...i});const n=e==="opening"||e==="closing",a=i.current_position;t(this,se)&&(t(this,se).disabled=!n&&a===100),t(this,ne)&&(t(this,ne).disabled=!n),t(this,ae)&&(t(this,ae).disabled=!n&&e==="closed"),i.current_position!==void 0&&!t(this,Lt)&&(s(this,gt,i.current_position),t(this,mt)&&(t(this,mt).style.width=`${t(this,gt)}%`),t(this,C)&&(t(this,C).style.left=`${t(this,gt)}%`)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const n={...t(this,qi)};return e==="open_cover"?(n.current_position=100,{state:"open",attributes:n}):e==="close_cover"?(n.current_position=0,{state:"closed",attributes:n}):e==="stop_cover"?{state:t(this,Ti),attributes:n}:e==="set_cover_position"&&i.position!==void 0?(n.current_position=i.position,{state:i.position>0?"open":"closed",attributes:n}):null}}re=new WeakMap,mt=new WeakMap,C=new WeakMap,se=new WeakMap,ne=new WeakMap,ae=new WeakMap,Lt=new WeakMap,gt=new WeakMap,Ti=new WeakMap,qi=new WeakMap,Hi=new WeakMap,Je=new WeakSet,_r=function(e){const i=t(this,re).getBoundingClientRect(),n=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,gt,Math.round(n)),t(this,mt).style.width=`${t(this,gt)}%`,t(this,C).style.left=`${t(this,gt)}%`},or=new WeakSet,ds=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,gt)})};const Rs=`
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
  `;class js extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,dr);r(this,hr);r(this,Vt);r(this,ti);r(this,lr);r(this,Yt);r(this,oe,null);r(this,At,null);r(this,T,null);r(this,H,null);r(this,Qe,null);r(this,Ot,null);r(this,Ft,null);r(this,Et,!1);r(this,q,0);r(this,G,0);r(this,et,100);r(this,Mt,1);r(this,Nt,void 0);s(this,Nt,Pt(o(this,lr,cs).bind(this),300))}render(){const e=this.def.capabilities==="read-write";s(this,G,this.def.feature_config?.min??0),s(this,et,this.def.feature_config?.max??100),s(this,Mt,this.def.feature_config?.step??1);const i=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Rs}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e?`
              <div class="hrv-num-slider-wrap" title="Drag to set value">
                <div class="hrv-num-slider-track">
                  <div class="hrv-num-slider-fill" style="width:0%"></div>
                  <div class="hrv-num-slider-thumb" style="left:0%"></div>
                </div>
              </div>
              <div class="hrv-num-input-row">
                <button class="hrv-num-btn" type="button" part="dec-btn"
                  aria-label="Decrease ${h(this.def.friendly_name)}">-</button>
                <input class="hrv-num-input" type="number"
                  min="${t(this,G)}" max="${t(this,et)}" step="${t(this,Mt)}"
                  title="Enter value" aria-label="${h(this.def.friendly_name)} value">
                <button class="hrv-num-btn" type="button" part="inc-btn"
                  aria-label="Increase ${h(this.def.friendly_name)}">+</button>
                ${i?`<span class="hrv-num-unit">${h(i)}</span>`:""}
              </div>
            `:`
              <div class="hrv-num-readonly">
                <span class="hrv-num-readonly-val">-</span>
                ${i?`<span class="hrv-num-readonly-unit">${h(i)}</span>`:""}
              </div>
            `}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,oe,this.root.querySelector(".hrv-num-slider-track")),s(this,At,this.root.querySelector(".hrv-num-slider-fill")),s(this,T,this.root.querySelector(".hrv-num-slider-thumb")),s(this,H,this.root.querySelector(".hrv-num-input")),s(this,Qe,this.root.querySelector(".hrv-num-readonly-val")),s(this,Ot,this.root.querySelector("[part=dec-btn]")),s(this,Ft,this.root.querySelector("[part=inc-btn]")),t(this,oe)&&t(this,T)){const n=d=>{s(this,Et,!0),t(this,T).style.transition="none",t(this,At).style.transition="none",o(this,ti,Sr).call(this,d),t(this,T).setPointerCapture(d.pointerId)};t(this,T).addEventListener("pointerdown",n),t(this,oe).addEventListener("pointerdown",d=>{d.target!==t(this,T)&&(s(this,Et,!0),t(this,T).style.transition="none",t(this,At).style.transition="none",o(this,ti,Sr).call(this,d),t(this,T).setPointerCapture(d.pointerId))}),t(this,T).addEventListener("pointermove",d=>{t(this,Et)&&o(this,ti,Sr).call(this,d)});const a=()=>{t(this,Et)&&(s(this,Et,!1),t(this,T).style.transition="",t(this,At).style.transition="",t(this,Nt).call(this))};t(this,T).addEventListener("pointerup",a),t(this,T).addEventListener("pointercancel",a)}t(this,H)&&t(this,H).addEventListener("input",()=>{const n=parseFloat(t(this,H).value);isNaN(n)||(s(this,q,Math.max(t(this,G),Math.min(t(this,et),n))),o(this,Vt,ui).call(this),o(this,Yt,vi).call(this),t(this,Nt).call(this))}),t(this,Ot)&&t(this,Ot).addEventListener("click",()=>{s(this,q,+Math.max(t(this,G),t(this,q)-t(this,Mt)).toFixed(10)),o(this,Vt,ui).call(this),t(this,H)&&(t(this,H).value=String(t(this,q))),o(this,Yt,vi).call(this),t(this,Nt).call(this)}),t(this,Ft)&&t(this,Ft).addEventListener("click",()=>{s(this,q,+Math.min(t(this,et),t(this,q)+t(this,Mt)).toFixed(10)),o(this,Vt,ui).call(this),t(this,H)&&(t(this,H).value=String(t(this,q))),o(this,Yt,vi).call(this),t(this,Nt).call(this)}),this.renderCompanions(),X(this.root)}applyState(e,i){const n=parseFloat(e);if(isNaN(n))return;s(this,q,n),t(this,Et)||(o(this,Vt,ui).call(this),t(this,H)&&!this.isFocused(t(this,H))&&(t(this,H).value=String(n))),o(this,Yt,vi).call(this),t(this,Qe)&&(t(this,Qe).textContent=String(n));const a=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${n}${a?` ${a}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}oe=new WeakMap,At=new WeakMap,T=new WeakMap,H=new WeakMap,Qe=new WeakMap,Ot=new WeakMap,Ft=new WeakMap,Et=new WeakMap,q=new WeakMap,G=new WeakMap,et=new WeakMap,Mt=new WeakMap,Nt=new WeakMap,dr=new WeakSet,hs=function(e){const i=t(this,et)-t(this,G);return i===0?0:Math.max(0,Math.min(100,(e-t(this,G))/i*100))},hr=new WeakSet,ls=function(e){const i=t(this,G)+e/100*(t(this,et)-t(this,G)),n=Math.round(i/t(this,Mt))*t(this,Mt);return Math.max(t(this,G),Math.min(t(this,et),+n.toFixed(10)))},Vt=new WeakSet,ui=function(){const e=o(this,dr,hs).call(this,t(this,q));t(this,At)&&(t(this,At).style.width=`${e}%`),t(this,T)&&(t(this,T).style.left=`${e}%`)},ti=new WeakSet,Sr=function(e){const i=t(this,oe).getBoundingClientRect(),n=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,q,o(this,hr,ls).call(this,n)),o(this,Vt,ui).call(this),t(this,H)&&(t(this,H).value=String(t(this,q))),o(this,Yt,vi).call(this)},lr=new WeakSet,cs=function(){this.config.card?.sendCommand("set_value",{value:t(this,q)})},Yt=new WeakSet,vi=function(){t(this,Ot)&&(t(this,Ot).disabled=t(this,q)<=t(this,G)),t(this,Ft)&&(t(this,Ft).disabled=t(this,q)>=t(this,et))};const Os=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--hrv-spacing-s, 8px) var(--hrv-spacing-m, 16px) var(--hrv-spacing-m, 16px);
      position: relative;
    }

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
    .hrv-is-arrow { font-size: 10px; opacity: 0.5; }

    .hrv-is-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.15));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: var(--hrv-radius-s, 8px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px var(--hrv-ex-glass-border, rgba(255,255,255,0.12));
      overflow: hidden;
      max-height: 280px;
      overflow-y: auto;
      scrollbar-width: none;
      z-index: 10;
    }
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
      transition: background 0.1s;
    }
    .hrv-is-option + .hrv-is-option {
      border-top: 1px solid var(--hrv-ex-glass-border, rgba(255,255,255,0.06));
    }
    .hrv-is-option:hover { background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.08)); }
    .hrv-is-option[data-active=true] { color: var(--hrv-color-primary, #1976d2); }
  `;class Fs extends m{constructor(){super(...arguments);r(this,cr);r(this,Pi);r(this,ei,null);r(this,bt,null);r(this,Ii,"");r(this,Tt,[]);r(this,de,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Os}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-is-selected" type="button"
              ${e?'title="Select an option"':'data-readonly="true" title="Read-only" disabled'}
              aria-label="${h(this.def.friendly_name)}">
              <span class="hrv-is-label">-</span>
              ${e?'<span class="hrv-is-arrow" aria-hidden="true">&#9660;</span>':""}
            </button>
            ${e?'<div class="hrv-is-dropdown" hidden></div>':""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,ei,this.root.querySelector(".hrv-is-selected")),s(this,bt,this.root.querySelector(".hrv-is-dropdown")),t(this,ei)&&e&&t(this,ei).addEventListener("click",()=>{t(this,de)?o(this,Pi,jr).call(this):o(this,cr,ps).call(this)}),this.renderCompanions(),X(this.root)}applyState(e,i){s(this,Ii,e),s(this,Tt,i?.options??t(this,Tt));const n=this.root.querySelector(".hrv-is-label");n&&(n.textContent=e),t(this,de)&&t(this,bt)?.querySelectorAll(".hrv-is-option").forEach((a,d)=>{a.setAttribute("data-active",String(t(this,Tt)[d]===e))}),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{}}:null}}ei=new WeakMap,bt=new WeakMap,Ii=new WeakMap,Tt=new WeakMap,de=new WeakMap,cr=new WeakSet,ps=function(){if(!t(this,bt)||!t(this,Tt).length)return;t(this,bt).innerHTML=t(this,Tt).map(i=>`
        <button class="hrv-is-option" type="button"
          data-active="${i===t(this,Ii)}"
          title="${h(i)}">
          ${h(i)}
        </button>
      `).join(""),t(this,bt).querySelectorAll(".hrv-is-option").forEach((i,n)=>{i.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:t(this,Tt)[n]}),o(this,Pi,jr).call(this)})});const e=this.root.querySelector("[part=card]");e&&(e.style.overflow="visible"),t(this,bt).removeAttribute("hidden"),s(this,de,!0)},Pi=new WeakSet,jr=function(){t(this,bt)?.setAttribute("hidden","");const e=this.root.querySelector("[part=card]");e&&(e.style.overflow=""),s(this,de,!1)};const Ns=`
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
  `;class Vs extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,si);r(this,pr);r(this,qt,null);r(this,ii,null);r(this,ri,null);r(this,he,null);r(this,le,null);r(this,yt,null);r(this,L,null);r(this,ce,null);r(this,pe,null);r(this,ue,!1);r(this,xt,0);r(this,Ht,!1);r(this,Di,void 0);s(this,Di,this.debounce(o(this,pr,us).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],n=i.includes("volume_set"),a=i.includes("previous_track");if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ns}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-mp-info">
              <div class="hrv-mp-artist" title="Artist"></div>
              <div class="hrv-mp-title" title="Title"></div>
            </div>
            ${e?`
              <div class="hrv-mp-controls">
                ${a?`
                  <button class="hrv-mp-btn" data-role="prev" type="button"
                    title="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                <button class="hrv-mp-btn" data-role="play" type="button"
                  title="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>
                ${a?`
                  <button class="hrv-mp-btn" data-role="next" type="button"
                    title="Next track">
                    <span part="next-icon" aria-hidden="true"></span>
                  </button>
                `:""}
              </div>
            `:""}
            ${n?`
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
      `,s(this,qt,this.root.querySelector("[data-role=play]")),s(this,ii,this.root.querySelector("[data-role=prev]")),s(this,ri,this.root.querySelector("[data-role=next]")),s(this,he,this.root.querySelector(".hrv-mp-mute")),s(this,le,this.root.querySelector(".hrv-mp-slider-track")),s(this,yt,this.root.querySelector(".hrv-mp-slider-fill")),s(this,L,this.root.querySelector(".hrv-mp-slider-thumb")),s(this,ce,this.root.querySelector(".hrv-mp-artist")),s(this,pe,this.root.querySelector(".hrv-mp-title")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,qt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,ii)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,ri)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,qt),t(this,ii),t(this,ri)].forEach(d=>{d&&(d.addEventListener("pointerdown",()=>d.setAttribute("data-pressing","true")),d.addEventListener("pointerup",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointerleave",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointercancel",()=>d.removeAttribute("data-pressing")))}),t(this,he)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,ue)})),t(this,le)&&t(this,L))){const d=u=>{s(this,Ht,!0),t(this,L).style.transition="none",t(this,yt).style.transition="none",o(this,si,$r).call(this,u),t(this,L).setPointerCapture(u.pointerId)};t(this,L).addEventListener("pointerdown",d),t(this,le).addEventListener("pointerdown",u=>{u.target!==t(this,L)&&(s(this,Ht,!0),t(this,L).style.transition="none",t(this,yt).style.transition="none",o(this,si,$r).call(this,u),t(this,L).setPointerCapture(u.pointerId))}),t(this,L).addEventListener("pointermove",u=>{t(this,Ht)&&o(this,si,$r).call(this,u)});const l=()=>{t(this,Ht)&&(s(this,Ht,!1),t(this,L).style.transition="",t(this,yt).style.transition="",t(this,Di).call(this))};t(this,L).addEventListener("pointerup",l),t(this,L).addEventListener("pointercancel",l)}this.renderCompanions(),X(this.root)}applyState(e,i){const n=e==="playing",a=e==="paused";if(t(this,ce)){const l=i.media_artist??"";t(this,ce).textContent=l,t(this,ce).title=l||"Artist"}if(t(this,pe)){const l=i.media_title??"";t(this,pe).textContent=l,t(this,pe).title=l||"Title"}if(t(this,qt)){t(this,qt).setAttribute("data-playing",String(n));const l=n?"mdi:pause":"mdi:play";this.renderIcon(l,"play-icon"),this.def.capabilities==="read-write"&&(t(this,qt).title=n?"Pause":"Play")}if(s(this,ue,!!i.is_volume_muted),t(this,he)){const l=t(this,ue)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(l,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,he).title=t(this,ue)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,Ht)&&(s(this,xt,Math.round(i.volume_level*100)),t(this,yt)&&(t(this,yt).style.width=`${t(this,xt)}%`),t(this,L)&&(t(this,L).style.left=`${t(this,xt)}%`));const d=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${d?` - ${d}`:""}`)}}qt=new WeakMap,ii=new WeakMap,ri=new WeakMap,he=new WeakMap,le=new WeakMap,yt=new WeakMap,L=new WeakMap,ce=new WeakMap,pe=new WeakMap,ue=new WeakMap,xt=new WeakMap,Ht=new WeakMap,Di=new WeakMap,si=new WeakSet,$r=function(e){const i=t(this,le).getBoundingClientRect(),n=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,xt,Math.round(n)),t(this,yt).style.width=`${t(this,xt)}%`,t(this,L).style.left=`${t(this,xt)}%`},pr=new WeakSet,us=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,xt)/100})};const Ys=`
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
  `;class Zs extends m{constructor(){super(...arguments);r(this,Y,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.tapAction?.data?.command??"power";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ys}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-remote-circle" type="button"
              title="${e?h(i):"Read-only"}"
              aria-label="${h(this.def.friendly_name)} - ${h(i)}"
              ${e?"":"disabled"}>
              <span part="remote-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,Y,this.root.querySelector(".hrv-remote-circle"));const n=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(n,"remote-icon"),t(this,Y)&&e&&(t(this,Y).addEventListener("click",()=>{const a=this.config.tapAction?.data?.command??"power",d=this.config.tapAction?.data?.device??void 0,l=d?{command:a,device:d}:{command:a};this.config.card?.sendCommand("send_command",l)}),t(this,Y).addEventListener("pointerdown",()=>t(this,Y).setAttribute("data-pressing","true")),t(this,Y).addEventListener("pointerup",()=>t(this,Y).removeAttribute("data-pressing")),t(this,Y).addEventListener("pointerleave",()=>t(this,Y).removeAttribute("data-pressing")),t(this,Y).addEventListener("pointercancel",()=>t(this,Y).removeAttribute("data-pressing"))),this.renderCompanions(),X(this.root)}applyState(e,i){const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(n,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Y=new WeakMap;const Ws=`
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
  `;class Us extends m{constructor(){super(...arguments);r(this,ni,null);r(this,ai,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ws}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" title="${h(this.def.friendly_name)}">
            <span class="hrv-sensor-val" aria-live="polite">-</span>
            ${e?`<span class="hrv-sensor-unit" title="${h(e)}">${h(e)}</span>`:""}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,ni,this.root.querySelector(".hrv-sensor-val")),s(this,ai,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions(),X(this.root)}applyState(e,i){t(this,ni)&&(t(this,ni).textContent=e),t(this,ai)&&i.unit_of_measurement!==void 0&&(t(this,ai).textContent=i.unit_of_measurement);const n=i.unit_of_measurement??this.def.unit_of_measurement??"",a=this.root.querySelector("[part=card-body]");a&&(a.title=`${e}${n?` ${n}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${n?` ${n}`:""}`)}}ni=new WeakMap,ai=new WeakMap;const Gs=`
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
      padding: 28px 0 32px;
    }

    @media (prefers-reduced-motion: reduce) {
      .hrv-switch-knob,
      .hrv-switch-track { transition: none; }
    }
  `;class Fr extends m{constructor(){super(...arguments);r(this,wt,null);r(this,oi,null);r(this,ve,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Gs}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e?`
              <button class="hrv-switch-track" type="button" data-on="false"
                title="Toggle" aria-label="${h(this.def.friendly_name)} - Toggle">
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
      `,s(this,wt,this.root.querySelector(".hrv-switch-track")),s(this,oi,this.root.querySelector(".hrv-switch-ro")),t(this,wt)&&e&&t(this,wt).addEventListener("click",()=>{this.config.card?.sendCommand("toggle",{})}),this.renderCompanions(),X(this.root)}applyState(e,i){s(this,ve,e==="on");const n=e==="unavailable"||e==="unknown";t(this,wt)&&(t(this,wt).setAttribute("data-on",String(t(this,ve))),t(this,wt).title=t(this,ve)?"On - click to turn off":"Off - click to turn on",t(this,wt).disabled=n),t(this,oi)&&(t(this,oi).textContent=ye(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,ve)?"off":"on",attributes:{}}}}wt=new WeakMap,oi=new WeakMap,ve=new WeakMap;const Xs=`
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
  `;function Oi(c){c<0&&(c=0);const p=Math.floor(c/3600),e=Math.floor(c%3600/60),i=Math.floor(c%60),n=a=>String(a).padStart(2,"0");return p>0?`${p}:${n(e)}:${n(i)}`:`${n(e)}:${n(i)}`}function Nr(c){if(typeof c=="number")return c;if(typeof c!="string")return 0;const p=c.split(":").map(Number);return p.length===3?p[0]*3600+p[1]*60+p[2]:p.length===2?p[0]*60+p[1]:p[0]||0}class Ks extends m{constructor(){super(...arguments);r(this,ur);r(this,vr);r(this,fr);r(this,me);r(this,K,null);r(this,It,null);r(this,Zt,null);r(this,Wt,null);r(this,fe,null);r(this,di,"idle");r(this,hi,{});r(this,it,null);r(this,li,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Xs}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-timer-display" title="Time remaining">00:00</span>
            ${e?`
              <div class="hrv-timer-controls">
                <button class="hrv-timer-btn" data-action="playpause" type="button"
                  title="Start" aria-label="${h(this.def.friendly_name)} - Start">
                  <span part="playpause-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="cancel" type="button"
                  title="Cancel" aria-label="${h(this.def.friendly_name)} - Cancel">
                  <span part="cancel-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="finish" type="button"
                  title="Finish" aria-label="${h(this.def.friendly_name)} - Finish">
                  <span part="finish-icon" aria-hidden="true"></span>
                </button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,K,this.root.querySelector(".hrv-timer-display")),s(this,It,this.root.querySelector("[data-action=playpause]")),s(this,Zt,this.root.querySelector("[data-action=cancel]")),s(this,Wt,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,It)?.addEventListener("click",()=>{const i=t(this,di)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,Zt)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,Wt)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,It),t(this,Zt),t(this,Wt)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions(),X(this.root)}applyState(e,i){s(this,di,e),s(this,hi,{...i}),s(this,it,i.finishes_at??null),s(this,li,i.remaining!=null?Nr(i.remaining):null),o(this,ur,vs).call(this,e),o(this,vr,fs).call(this,e),e==="active"&&t(this,it)?o(this,fr,ms).call(this):o(this,me,Ri).call(this),t(this,K)&&t(this,K).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const n={...t(this,hi)};return e==="start"?{state:"active",attributes:n}:e==="pause"?(t(this,it)&&(n.remaining=Math.max(0,(new Date(t(this,it)).getTime()-Date.now())/1e3)),{state:"paused",attributes:n}):e==="cancel"||e==="finish"?{state:"idle",attributes:n}:null}}K=new WeakMap,It=new WeakMap,Zt=new WeakMap,Wt=new WeakMap,fe=new WeakMap,di=new WeakMap,hi=new WeakMap,it=new WeakMap,li=new WeakMap,ur=new WeakSet,vs=function(e){const i=e==="idle",n=e==="active";if(t(this,It)){const a=n?"mdi:pause":"mdi:play",d=n?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(a,"playpause-icon"),t(this,It).title=d,t(this,It).setAttribute("aria-label",`${this.def.friendly_name} - ${d}`)}t(this,Zt)&&(t(this,Zt).disabled=i),t(this,Wt)&&(t(this,Wt).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},vr=new WeakSet,fs=function(e){if(t(this,K)){if(e==="idle"){const i=t(this,hi).duration;t(this,K).textContent=i?Oi(Nr(i)):"00:00";return}if(e==="paused"&&t(this,li)!=null){t(this,K).textContent=Oi(t(this,li));return}if(e==="active"&&t(this,it)){const i=Math.max(0,(new Date(t(this,it)).getTime()-Date.now())/1e3);t(this,K).textContent=Oi(i)}}},fr=new WeakSet,ms=function(){o(this,me,Ri).call(this),s(this,fe,setInterval(()=>{if(!t(this,it)||t(this,di)!=="active"){o(this,me,Ri).call(this);return}const e=Math.max(0,(new Date(t(this,it)).getTime()-Date.now())/1e3);t(this,K)&&(t(this,K).textContent=Oi(e)),e<=0&&o(this,me,Ri).call(this)},1e3))},me=new WeakSet,Ri=function(){t(this,fe)&&(clearInterval(t(this,fe)),s(this,fe,null))};const Js=`
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
  `;class Qs extends m{constructor(){super(...arguments);r(this,ci,null);r(this,_t,null);r(this,ge,!1);r(this,be,!1)}render(){const e=this.def.capabilities==="read-write";s(this,be,!1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Js}${J}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-generic-state" title="${h(this.def.friendly_name)}">-</span>
            ${e?`
              <button class="hrv-generic-toggle" type="button" data-on="false"
                title="Toggle" aria-label="${h(this.def.friendly_name)} - Toggle"
                hidden>
                <div class="hrv-generic-knob"></div>
              </button>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,ci,this.root.querySelector(".hrv-generic-state")),s(this,_t,this.root.querySelector(".hrv-generic-toggle")),t(this,_t)&&e&&t(this,_t).addEventListener("click",()=>{this.config.card?.sendCommand("toggle",{})}),this.renderCompanions(),X(this.root)}applyState(e,i){const n=e==="on"||e==="off";s(this,ge,e==="on"),t(this,ci)&&(t(this,ci).textContent=ye(e)),t(this,_t)&&(n&&!t(this,be)&&(t(this,_t).removeAttribute("hidden"),s(this,be,!0)),t(this,be)&&(t(this,_t).setAttribute("data-on",String(t(this,ge))),t(this,_t).title=t(this,ge)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,ge)?"off":"on",attributes:{}}}}ci=new WeakMap,_t=new WeakMap,ge=new WeakMap,be=new WeakMap,g._packs=g._packs||{};const tn=window.__HARVEST_PACK_ID__||"minimus";g._packs[tn]={light:$s,fan:Cs,climate:Es,harvest_action:Ts,binary_sensor:Hs,cover:Bs,input_boolean:Fr,input_number:js,input_select:Fs,media_player:Vs,remote:Zs,sensor:Us,switch:Fr,timer:Ks,generic:Qs}})();})();
