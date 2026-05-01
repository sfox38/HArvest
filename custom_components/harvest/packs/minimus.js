(()=>{var Rr=(g,m,d)=>{if(!m.has(g))throw TypeError("Cannot "+d)};var t=(g,m,d)=>(Rr(g,m,"read from private field"),d?d.call(g):m.get(g)),r=(g,m,d)=>{if(m.has(g))throw TypeError("Cannot add the same private member more than once");m instanceof WeakSet?m.add(g):m.set(g,d)},n=(g,m,d,It)=>(Rr(g,m,"write to private field"),It?It.call(g,d):m.set(g,d),d);var h=(g,m,d)=>(Rr(g,m,"access private method"),d);(function(){"use strict";var Pt,M,Ai,I,rt,C,Z,Se,$e,st,wt,nt,at,Wt,Le,Y,ot,Ut,Si,ke,Br,An,w,Ki,rs,Ji,ss,Qi,ns,tr,as,Me,$r,He,Lr,er,os,Xt,Yi,ir,hs,rr,ds,$i,jr,Li,Vr,sr,ls,J,R,nr,P,Ee,j,ht,dt,lt,D,_,Dt,_t,z,H,Kt,Te,ki,qe,kr,Jt,Gi,Mi,Or,Ie,Mr,Hi,Fr,Ei,Nr,zt,Ci,ar,cs,or,ps,Ti,Zr,qi,Yr,hr,us,Ii,Gr,dr,vs,G,At,ct,Pe,Bt,De,ze,Be,V,O,Re,je,Ve,Oe,St,Fe,Qt,F,pt,Ne,Ze,Ye,ut,Rt,te,Ge,We,Ue,Xe,Ke,Pi,Je,Di,Wr,lr,fs,cr,ms,Qe,Hr,zi,Ur,ti,Er,pr,gs,ur,bs,Bi,Xr,Ri,Kr,vr,ys,fr,xs,vt,ee,ie,ft,$,re,se,ne,$t,mt,ji,Vi,Oi,ei,Tr,mr,Cs,ae,Lt,E,q,ii,jt,Vt,kt,T,W,Q,Mt,Ot,gr,ws,br,_s,Ft,wi,ri,qr,yr,As,Nt,_i,si,gt,Fi,Ht,oe,xr,Ss,Ni,Jr,Et,ni,ai,he,de,bt,L,le,ce,pe,yt,Tt,ue,ve,Zi,oi,Ir,Cr,$s,hi,di,li,xt,ci,fe,X,qt,Zt,Yt,me,pi,ui,tt,vi,wr,Ls,_r,ks,Ar,Ms,ge,Wi,fi,Ct,be,ye,mi,xe,gi,bi,yi,xi,Ce,Sr,Hs;const g=window.HArvest;if(!g||!g.renderers||!g.renderers.BaseCard){console.warn("[HArvest Minimus] HArvest not found - pack not loaded.");return}const m=g.renderers.BaseCard;function d(p){return String(p??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function It(p,u){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,p.apply(this,i)},u)}}function we(p){return p?p.charAt(0).toUpperCase()+p.slice(1).replace(/_/g," "):""}const U=`
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
  `;function N(p){p.querySelectorAll("[part=companion]").forEach(u=>{u.title=u.getAttribute("aria-label")??""})}const Es=60,Ts=60,Gt=48,B=225,b=270,it=2*Math.PI*Gt*(b/360);function qs(p){return p*Math.PI/180}function K(p){const u=qs(p);return{x:Es+Gt*Math.cos(u),y:Ts-Gt*Math.sin(u)}}function Is(){const p=K(B),u=K(B-b);return`M ${p.x} ${p.y} A ${Gt} ${Gt} 0 1 1 ${u.x} ${u.y}`}const _e=Is(),Ae=["brightness","temp","color"],Ui=120;function Qr(p){const u=b/Ui;let e="";for(let i=0;i<Ui;i++){const s=B-i*u,a=B-(i+1)*u,o=K(s),l=K(a),c=`M ${o.x} ${o.y} A ${Gt} ${Gt} 0 0 1 ${l.x} ${l.y}`,v=i===0||i===Ui-1?"round":"butt";e+=`<path d="${c}" stroke="${p(i/Ui)}" fill="none" stroke-width="8" stroke-linecap="${v}" />`}return e}const Ps=Qr(p=>`hsl(${Math.round(p*360)},100%,50%)`),Ds=Qr(p=>{const e=Math.round(143+112*p),i=Math.round(255*p);return`rgb(255,${e},${i})`}),Pr=`
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
  `,zs=`
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
  `;class Bs extends m{constructor(e,i,s,a){super(e,i,s,a);r(this,Br);r(this,Ki);r(this,Ji);r(this,Qi);r(this,tr);r(this,Me);r(this,He);r(this,er);r(this,Xt);r(this,ir);r(this,rr);r(this,$i);r(this,Li);r(this,sr);r(this,Pt,null);r(this,M,null);r(this,Ai,null);r(this,I,null);r(this,rt,null);r(this,C,null);r(this,Z,null);r(this,Se,null);r(this,$e,null);r(this,st,0);r(this,wt,4e3);r(this,nt,0);r(this,at,!1);r(this,Wt,!1);r(this,Le,null);r(this,Y,0);r(this,ot,2e3);r(this,Ut,6500);r(this,Si,void 0);r(this,ke,new Map);r(this,w,[]);n(this,Si,It(h(this,sr,ls).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],s=i.includes("brightness"),a=i.includes("color_temp"),o=i.includes("rgb_color"),l=e&&(s||a||o),c=[s,a,o].filter(Boolean).length,v=e&&c>1;n(this,ot,this.def.feature_config?.min_color_temp_kelvin??2e3),n(this,Ut,this.def.feature_config?.max_color_temp_kelvin??6500);const x=K(B);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Pr}${zs}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${l?"":"hrv-no-dial"}">
            ${l?`
              <div class="hrv-dial-column">
                <div class="hrv-dial-wrap" role="slider" aria-valuemin="0"
                  aria-valuemax="100" aria-valuenow="0"
                  aria-label="${d(this.def.friendly_name)} brightness"
                  title="Drag to adjust">
                  <svg viewBox="0 0 120 120">
                    <g class="hrv-dial-segs hrv-dial-segs-color">${Ps}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${Ds}</g>
                    <path class="hrv-dial-track" d="${_e}" />
                    <path class="hrv-dial-fill" d="${_e}"
                      stroke-dasharray="${it}"
                      stroke-dashoffset="${it}" />
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
                  role="img" aria-label="${d(this.def.friendly_name)}"
                  title="Read-only">
                  <span part="ro-state-icon" aria-hidden="true"></span>
                </div>
                <div class="hrv-light-ro-dots">
                  ${s?'<span class="hrv-light-ro-dot" data-attr="brightness" title="Brightness"></span>':""}
                  ${a?'<span class="hrv-light-ro-dot" data-attr="temp" title="Color temperature"></span>':""}
                  ${o?'<span class="hrv-light-ro-dot" data-attr="color" title="Color"></span>':""}
                </div>
              </div>
            `}
            ${e?`
              <div class="hrv-dial-controls">
                ${v?`
                  <div class="hrv-mode-switch" data-pos="0" data-count="${c}"
                    role="radiogroup" aria-label="Dial mode" tabindex="0">
                    <div class="hrv-mode-switch-thumb"></div>
                    ${'<span class="hrv-mode-dot"></span>'.repeat(c)}
                  </div>
                `:""}
                <button part="toggle-button" type="button"
                  aria-label="${d(this.def.friendly_name)} - toggle"
                  title="Turn ${d(this.def.friendly_name)} on / off">
                  <div class="hrv-light-toggle-knob"></div>
                </button>
              </div>
            `:""}
          </div>
          ${l?"":this.renderCompanionZoneHTML()}
        </div>
      `,n(this,Pt,this.root.querySelector("[part=toggle-button]")),n(this,M,this.root.querySelector(".hrv-dial-fill")),n(this,Ai,this.root.querySelector(".hrv-dial-track")),n(this,I,this.root.querySelector(".hrv-dial-thumb")),n(this,rt,this.root.querySelector(".hrv-dial-pct")),n(this,C,this.root.querySelector(".hrv-dial-wrap")),n(this,Le,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,Se,this.root.querySelector(".hrv-dial-segs-color")),n(this,$e,this.root.querySelector(".hrv-dial-segs-temp")),n(this,Z,this.root.querySelector(".hrv-mode-switch")),t(this,Pt)&&this._attachGestureHandlers(t(this,Pt),{onTap:()=>{const A=this.config.gestureConfig?.tap;if(A){this._runAction(A);return}this.config.card?.sendCommand("toggle",{})}}),t(this,C)&&(t(this,C).addEventListener("pointerdown",h(this,ir,hs).bind(this)),t(this,C).addEventListener("pointermove",h(this,rr,ds).bind(this)),t(this,C).addEventListener("pointerup",h(this,$i,jr).bind(this)),t(this,C).addEventListener("pointercancel",h(this,$i,jr).bind(this))),l&&h(this,Ki,rs).call(this),t(this,Z)&&(t(this,Z).addEventListener("click",h(this,Ji,ss).bind(this)),t(this,Z).addEventListener("keydown",h(this,tr,as).bind(this)),t(this,Z).addEventListener("mousemove",h(this,Qi,ns).bind(this))),h(this,He,Lr).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(A=>{A.title=A.getAttribute("aria-label")??"Companion";const k=A.getAttribute("data-entity");if(k&&t(this,ke).has(k)){const S=t(this,ke).get(k);A.setAttribute("data-on",String(S==="on"))}})}applyState(e,i){if(n(this,at,e==="on"),n(this,st,i?.brightness??0),i?.color_temp_kelvin!==void 0?n(this,wt,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&n(this,wt,Math.round(1e6/i.color_temp)),i?.hs_color)n(this,nt,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[a,o,l]=i.rgb_color;n(this,nt,Vs(a,o,l))}t(this,Pt)&&t(this,Pt).setAttribute("aria-pressed",String(t(this,at)));const s=this.root.querySelector(".hrv-light-ro-circle");if(s){s.setAttribute("data-on",String(t(this,at)));const a=t(this,at)?"mdi:lightbulb":"mdi:lightbulb-outline",o=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??a;this.renderIcon(this.resolveIcon(o,a),"ro-state-icon");const l=i?.color_mode,c=l==="color_temp",v=l&&l!=="color_temp",x=this.root.querySelector('[data-attr="brightness"]');if(x){const S=Math.round(t(this,st)/255*100);x.title=t(this,at)?`Brightness: ${S}%`:"Brightness: off"}const A=this.root.querySelector('[data-attr="temp"]');A&&(A.title=`Color temperature: ${t(this,wt)}K`,A.style.display=v?"none":"");const k=this.root.querySelector('[data-attr="color"]');if(k)if(k.style.display=c?"none":"",i?.rgb_color){const[S,f,y]=i.rgb_color;k.style.background=`rgb(${S},${f},${y})`,k.title=`Color: rgb(${S}, ${f}, ${y})`}else k.style.background=`hsl(${t(this,nt)}, 100%, 50%)`,k.title=`Color: hue ${t(this,nt)}°`}h(this,Me,$r).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,at)?"off":"on",attributes:{brightness:t(this,st)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,s){t(this,ke).set(e,i),super.updateCompanionState(e,i,s)}}Pt=new WeakMap,M=new WeakMap,Ai=new WeakMap,I=new WeakMap,rt=new WeakMap,C=new WeakMap,Z=new WeakMap,Se=new WeakMap,$e=new WeakMap,st=new WeakMap,wt=new WeakMap,nt=new WeakMap,at=new WeakMap,Wt=new WeakMap,Le=new WeakMap,Y=new WeakMap,ot=new WeakMap,Ut=new WeakMap,Si=new WeakMap,ke=new WeakMap,Br=new WeakSet,An=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},w=new WeakMap,Ki=new WeakSet,rs=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];n(this,w,[]),i[0]&&t(this,w).push(0),i[1]&&t(this,w).push(1),i[2]&&t(this,w).push(2),t(this,w).length===0&&t(this,w).push(0),t(this,w).includes(t(this,Y))||n(this,Y,t(this,w)[0])},Ji=new WeakSet,ss=function(e){const i=t(this,Z).getBoundingClientRect(),s=e.clientY-i.top,a=i.height/3;let o;s<a?o=0:s<a*2?o=1:o=2,o=Math.min(o,t(this,w).length-1),n(this,Y,t(this,w)[o]),t(this,Z).setAttribute("data-pos",String(o)),h(this,He,Lr).call(this),h(this,Me,$r).call(this)},Qi=new WeakSet,ns=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},s=t(this,Z).getBoundingClientRect(),a=Math.min(Math.floor((e.clientY-s.top)/(s.height/t(this,w).length)),t(this,w).length-1),o=Ae[t(this,w)[Math.max(0,a)]];t(this,Z).title=`Dial mode: ${i[o]??o}`},tr=new WeakSet,as=function(e){const i=t(this,w).indexOf(t(this,Y));let s=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")s=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")s=Math.min(t(this,w).length-1,i+1);else return;e.preventDefault(),n(this,Y,t(this,w)[s]),t(this,Z).setAttribute("data-pos",String(s)),h(this,He,Lr).call(this),h(this,Me,$r).call(this)},Me=new WeakSet,$r=function(){t(this,I)&&(t(this,I).style.transition="none"),t(this,M)&&(t(this,M).style.transition="none"),h(this,er,os).call(this),t(this,I)?.getBoundingClientRect(),t(this,M)?.getBoundingClientRect(),t(this,I)&&(t(this,I).style.transition=""),t(this,M)&&(t(this,M).style.transition="")},He=new WeakSet,Lr=function(){if(!t(this,M))return;const e=Ae[t(this,Y)],i=e==="color"||e==="temp";t(this,Ai).style.display=i?"none":"",t(this,M).style.display=i?"none":"",t(this,Se)&&t(this,Se).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,$e)&&t(this,$e).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,M).setAttribute("stroke-dasharray",String(it));const s={brightness:"brightness",temp:"color temperature",color:"color"},a={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,C)?.setAttribute("aria-label",`${d(this.def.friendly_name)} ${s[e]}`),t(this,C)&&(t(this,C).title=a[e])},er=new WeakSet,os=function(){const e=Ae[t(this,Y)];if(e==="brightness"){const i=t(this,at)?t(this,st):0;h(this,Xt,Yi).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,wt)-t(this,ot))/(t(this,Ut)-t(this,ot))*100);h(this,Xt,Yi).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,nt)/360*100);h(this,Xt,Yi).call(this,i)}},Xt=new WeakSet,Yi=function(e){const i=Ae[t(this,Y)],s=e/100*b,a=K(B-s);if(t(this,I)?.setAttribute("cx",String(a.x)),t(this,I)?.setAttribute("cy",String(a.y)),t(this,Le)?.setAttribute("cx",String(a.x)),t(this,Le)?.setAttribute("cy",String(a.y)),i==="brightness"){const o=it*(1-e/100);t(this,M)?.setAttribute("stroke-dashoffset",String(o)),t(this,rt)&&(t(this,rt).textContent=e+"%"),t(this,C)?.setAttribute("aria-valuenow",String(e))}else if(i==="temp"){const o=Math.round(t(this,ot)+e/100*(t(this,Ut)-t(this,ot)));t(this,rt)&&(t(this,rt).textContent=o+"K"),t(this,C)?.setAttribute("aria-valuenow",String(o))}else t(this,rt)&&(t(this,rt).textContent=Math.round(e/100*360)+"°"),t(this,C)?.setAttribute("aria-valuenow",String(Math.round(e/100*360)))},ir=new WeakSet,hs=function(e){n(this,Wt,!0),t(this,C)?.setPointerCapture(e.pointerId),h(this,Li,Vr).call(this,e)},rr=new WeakSet,ds=function(e){t(this,Wt)&&h(this,Li,Vr).call(this,e)},$i=new WeakSet,jr=function(e){if(t(this,Wt)){n(this,Wt,!1);try{t(this,C)?.releasePointerCapture(e.pointerId)}catch{}t(this,Si).call(this)}},Li=new WeakSet,Vr=function(e){if(!t(this,C))return;const i=t(this,C).getBoundingClientRect(),s=i.left+i.width/2,a=i.top+i.height/2,o=e.clientX-s,l=-(e.clientY-a);let c=Math.atan2(l,o)*180/Math.PI;c<0&&(c+=360);let v=B-c;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b);const x=Math.round(v/b*100),A=Ae[t(this,Y)];A==="brightness"?n(this,st,Math.round(x/100*255)):A==="temp"?n(this,wt,Math.round(t(this,ot)+x/100*(t(this,Ut)-t(this,ot)))):n(this,nt,Math.round(x/100*360)),t(this,M)&&(t(this,M).style.transition="none"),t(this,I)&&(t(this,I).style.transition="none"),h(this,Xt,Yi).call(this,x)},sr=new WeakSet,ls=function(){t(this,M)&&(t(this,M).style.transition=""),t(this,I)&&(t(this,I).style.transition="");const e=Ae[t(this,Y)];e==="brightness"?t(this,st)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,st)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,wt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,nt),100]})};const Rs=Pr+`
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
  `;class js extends m{constructor(e,i,s,a){super(e,i,s,a);r(this,qe);r(this,Jt);r(this,Mi);r(this,Ie);r(this,Hi);r(this,Ei);r(this,zt);r(this,ar);r(this,or);r(this,Ti);r(this,qi);r(this,hr);r(this,Ii);r(this,dr);r(this,J,null);r(this,R,null);r(this,nr,null);r(this,P,null);r(this,Ee,null);r(this,j,null);r(this,ht,null);r(this,dt,null);r(this,lt,null);r(this,D,!1);r(this,_,0);r(this,Dt,!1);r(this,_t,"forward");r(this,z,null);r(this,H,[]);r(this,Kt,!1);r(this,Te,null);r(this,ki,void 0);n(this,ki,It(h(this,hr,us).bind(this),300)),n(this,H,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],s=i.includes("set_speed"),a=i.includes("oscillate"),o=i.includes("direction"),l=i.includes("preset_mode"),c=e&&s,v=c&&t(this,Jt,Gi),x=v&&!t(this,H).length,A=v&&!!t(this,H).length,k=K(B);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Rs}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${c?x?"hrv-fan-horiz":"":"hrv-no-dial"}">
            ${c?`
              <div class="hrv-dial-column">
                ${x?`
                  <div class="hrv-fan-hspeed-wrap">
                    <div class="hrv-fan-hspeed-switch" role="group"
                      aria-label="${d(this.def.friendly_name)} speed"
                      data-on="false">
                      <div class="hrv-fan-hspeed-thumb"></div>
                      ${t(this,Ie,Mr).map((f,y)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${f}" data-idx="${y}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${y+1} (${f}%)"
                          title="Speed ${y+1} (${f}%)"></div>
                      `).join("")}
                    </div>
                  </div>
                `:A?`
                  <div class="hrv-fan-stepped-wrap">
                    <button class="hrv-fan-speed-circle" part="speed-circle" type="button"
                      aria-pressed="false"
                      title="Click to increase fan speed"
                      aria-label="Click to increase fan speed"><svg class="hrv-fan-speed-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg></button>
                  </div>
                `:`
                  <div class="hrv-dial-wrap" role="slider"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                    aria-label="${d(this.def.friendly_name)} speed"
                    title="Drag to adjust fan speed">
                    <svg viewBox="0 0 120 120">
                      <path class="hrv-dial-track" d="${_e}" />
                      <path class="hrv-dial-fill" d="${_e}"
                        stroke-dasharray="${it}"
                        stroke-dashoffset="${it}" />
                      <circle class="hrv-dial-thumb" r="7"
                        cx="${k.x}" cy="${k.y}" />
                      <circle class="hrv-dial-thumb-hit" r="16"
                        cx="${k.x}" cy="${k.y}" />
                    </svg>
                    <span class="hrv-dial-pct">0%</span>
                  </div>
                `}
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-fan-ro-center">
                <div class="hrv-fan-ro-circle" data-on="false"
                  role="img" aria-label="${d(this.def.friendly_name)}"
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
                ${o?`
                  <button class="hrv-fan-feat-btn" data-feat="direction" type="button"
                    aria-label="Direction: forward" title="Direction: forward"></button>
                `:""}
                ${l?`
                  <button class="hrv-fan-feat-btn" data-feat="preset" type="button"
                    aria-label="Preset: none" title="Preset: none"></button>
                `:""}
                <button part="toggle-button" type="button"
                  aria-label="${d(this.def.friendly_name)} - toggle"
                  title="Turn ${d(this.def.friendly_name)} on / off">${c?"":'<span part="fan-onoff-icon" aria-hidden="true"></span>'}</button>
              </div>
            `:""}
          </div>
          ${c?"":this.renderCompanionZoneHTML()}
        </div>
      `,n(this,J,this.root.querySelector("[part=toggle-button]")),n(this,R,this.root.querySelector(".hrv-dial-fill")),n(this,nr,this.root.querySelector(".hrv-dial-track")),n(this,P,this.root.querySelector(".hrv-dial-thumb")),n(this,Ee,this.root.querySelector(".hrv-dial-pct")),n(this,j,this.root.querySelector(".hrv-dial-wrap")),n(this,Te,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,ht,this.root.querySelector('[data-feat="oscillate"]')),n(this,dt,this.root.querySelector('[data-feat="direction"]')),n(this,lt,this.root.querySelector('[data-feat="preset"]')),t(this,J)&&!c&&(this.renderIcon(this.def.icon??"mdi:fan","fan-onoff-icon"),t(this,J).setAttribute("data-animate",String(!!this.config.animate))),this._attachGestureHandlers(t(this,J),{onTap:()=>{const f=this.config.gestureConfig?.tap;if(f){this._runAction(f);return}this.config.card?.sendCommand("toggle",{})}}),t(this,j)&&(t(this,j).addEventListener("pointerdown",h(this,ar,cs).bind(this)),t(this,j).addEventListener("pointermove",h(this,or,ps).bind(this)),t(this,j).addEventListener("pointerup",h(this,Ti,Zr).bind(this)),t(this,j).addEventListener("pointercancel",h(this,Ti,Zr).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const f=t(this,Ie,Mr);if(!f.length)return;let y;if(!t(this,D)||t(this,_)===0)y=f[0],n(this,D,!0),t(this,J)?.setAttribute("aria-pressed","true");else{const et=f.findIndex(_n=>_n>t(this,_));y=et===-1?f[0]:f[et]}n(this,_,y),h(this,Hi,Fr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:y})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(f=>{const y=()=>{const et=Number(f.getAttribute("data-pct"));t(this,D)||(n(this,D,!0),t(this,J)?.setAttribute("aria-pressed","true")),n(this,_,et),h(this,Ei,Nr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:et})};f.addEventListener("click",y),f.addEventListener("keydown",et=>{(et.key==="Enter"||et.key===" ")&&(et.preventDefault(),y())})}),t(this,ht)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,Dt)})}),t(this,dt)?.addEventListener("click",()=>{const f=t(this,_t)==="forward"?"reverse":"forward";n(this,_t,f),h(this,zt,Ci).call(this),this.config.card?.sendCommand("set_direction",{direction:f})}),t(this,lt)?.addEventListener("click",()=>{if(t(this,H).length){if(t(this,Mi,Or)){const f=t(this,z)??t(this,H)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:f});return}if(t(this,z)){const f=t(this,H).indexOf(t(this,z));if(f===-1||f===t(this,H).length-1){n(this,z,null),h(this,zt,Ci).call(this);const y=t(this,qe,kr),et=Math.floor(t(this,_)/y)*y||y;this.config.card?.sendCommand("set_percentage",{percentage:et})}else{const y=t(this,H)[f+1];n(this,z,y),h(this,zt,Ci).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:y})}}else{const f=t(this,H)[0];n(this,z,f),h(this,zt,Ci).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:f})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.def.icon??"mdi:fan","ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(f=>{f.title=f.getAttribute("aria-label")??"Companion"})}applyState(e,i){n(this,D,e==="on"),n(this,_,i?.percentage??0),n(this,Dt,i?.oscillating??!1),n(this,_t,i?.direction??"forward"),n(this,z,i?.preset_mode??null),i?.preset_modes?.length&&n(this,H,i.preset_modes),t(this,J)&&t(this,J).setAttribute("aria-pressed",String(t(this,D)));const s=this.root.querySelector(".hrv-fan-ro-circle");s&&s.setAttribute("data-on",String(t(this,D))),t(this,Jt,Gi)&&!t(this,H).length?h(this,Ei,Nr).call(this):t(this,Jt,Gi)?h(this,Hi,Fr).call(this):h(this,dr,vs).call(this),h(this,zt,Ci).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,_)>0?`, ${t(this,_)}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,D)?"off":"on",attributes:{percentage:t(this,_)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,Dt),direction:t(this,_t),preset_mode:t(this,z),preset_modes:t(this,H)}}:null}}J=new WeakMap,R=new WeakMap,nr=new WeakMap,P=new WeakMap,Ee=new WeakMap,j=new WeakMap,ht=new WeakMap,dt=new WeakMap,lt=new WeakMap,D=new WeakMap,_=new WeakMap,Dt=new WeakMap,_t=new WeakMap,z=new WeakMap,H=new WeakMap,Kt=new WeakMap,Te=new WeakMap,ki=new WeakMap,qe=new WeakSet,kr=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},Jt=new WeakSet,Gi=function(){return t(this,qe,kr)>1},Mi=new WeakSet,Or=function(){return t(this,Jt,Gi)&&t(this,H).length>0},Ie=new WeakSet,Mr=function(){const e=t(this,qe,kr),i=[];for(let s=1;s*e<=100.001;s++)i.push(Math.floor(s*e*10)/10);return i},Hi=new WeakSet,Fr=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,D)));const i=t(this,D)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},Ei=new WeakSet,Nr=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),s=t(this,Ie,Mr);let a=-1;if(t(this,D)&&t(this,_)>0){let o=1/0;s.forEach((l,c)=>{const v=Math.abs(l-t(this,_));v<o&&(o=v,a=c)})}e.setAttribute("data-on",String(a>=0)),i&&a>=0&&(i.style.left=`${2+a*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((o,l)=>{o.setAttribute("data-active",String(l===a))})},zt=new WeakSet,Ci=function(){const e=t(this,Mi,Or);if(t(this,ht)){const i=e||t(this,Dt),s=e?"Oscillate":`Oscillate: ${t(this,Dt)?"on":"off"}`;t(this,ht).setAttribute("data-on",String(i)),t(this,ht).setAttribute("aria-pressed",String(i)),t(this,ht).setAttribute("aria-label",s),t(this,ht).title=s}if(t(this,dt)){const i=t(this,_t)!=="reverse",s=`Direction: ${t(this,_t)}`;t(this,dt).setAttribute("data-on",String(i)),t(this,dt).setAttribute("aria-pressed",String(i)),t(this,dt).setAttribute("aria-label",s),t(this,dt).title=s}if(t(this,lt)){const i=e||!!t(this,z),s=e?t(this,z)??t(this,H)[0]??"Preset":t(this,z)?`Preset: ${t(this,z)}`:"Preset: none";t(this,lt).setAttribute("data-on",String(i)),t(this,lt).setAttribute("aria-pressed",String(i)),t(this,lt).setAttribute("aria-label",s),t(this,lt).title=s}},ar=new WeakSet,cs=function(e){n(this,Kt,!0),t(this,j)?.setPointerCapture(e.pointerId),h(this,qi,Yr).call(this,e)},or=new WeakSet,ps=function(e){t(this,Kt)&&h(this,qi,Yr).call(this,e)},Ti=new WeakSet,Zr=function(e){if(t(this,Kt)){n(this,Kt,!1);try{t(this,j)?.releasePointerCapture(e.pointerId)}catch{}t(this,ki).call(this)}},qi=new WeakSet,Yr=function(e){if(!t(this,j))return;const i=t(this,j).getBoundingClientRect(),s=i.left+i.width/2,a=i.top+i.height/2,o=e.clientX-s,l=-(e.clientY-a);let c=Math.atan2(l,o)*180/Math.PI;c<0&&(c+=360);let v=B-c;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b),n(this,_,Math.round(v/b*100)),t(this,R)&&(t(this,R).style.transition="none"),t(this,P)&&(t(this,P).style.transition="none"),h(this,Ii,Gr).call(this,t(this,_))},hr=new WeakSet,us=function(){t(this,R)&&(t(this,R).style.transition=""),t(this,P)&&(t(this,P).style.transition=""),t(this,_)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,_)})},Ii=new WeakSet,Gr=function(e){const i=it*(1-e/100),s=K(B-e/100*b);t(this,R)?.setAttribute("stroke-dashoffset",String(i)),t(this,P)?.setAttribute("cx",String(s.x)),t(this,P)?.setAttribute("cy",String(s.y)),t(this,Te)?.setAttribute("cx",String(s.x)),t(this,Te)?.setAttribute("cy",String(s.y)),t(this,Ee)&&(t(this,Ee).textContent=`${e}%`),t(this,j)?.setAttribute("aria-valuenow",String(e))},dr=new WeakSet,vs=function(){t(this,P)&&(t(this,P).style.transition="none"),t(this,R)&&(t(this,R).style.transition="none"),h(this,Ii,Gr).call(this,t(this,D)?t(this,_):0),t(this,P)?.getBoundingClientRect(),t(this,R)?.getBoundingClientRect(),t(this,P)&&(t(this,P).style.transition=""),t(this,R)&&(t(this,R).style.transition="")};function Vs(p,u,e){p/=255,u/=255,e/=255;const i=Math.max(p,u,e),s=Math.min(p,u,e),a=i-s;if(a===0)return 0;let o;return i===p?o=(u-e)/a%6:i===u?o=(e-p)/a+2:o=(p-u)/a+4,Math.round((o*60+360)%360)}const Os=Pr+`
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
  `;class Fs extends m{constructor(e,i,s,a){super(e,i,s,a);r(this,Di);r(this,lr);r(this,cr);r(this,Qe);r(this,zi);r(this,ti);r(this,pr);r(this,ur);r(this,Bi);r(this,Ri);r(this,vr);r(this,fr);r(this,G,null);r(this,At,null);r(this,ct,null);r(this,Pe,null);r(this,Bt,!1);r(this,De,null);r(this,ze,null);r(this,Be,null);r(this,V,null);r(this,O,null);r(this,Re,null);r(this,je,null);r(this,Ve,null);r(this,Oe,null);r(this,St,null);r(this,Fe,null);r(this,Qt,null);r(this,F,20);r(this,pt,"off");r(this,Ne,null);r(this,Ze,null);r(this,Ye,null);r(this,ut,16);r(this,Rt,32);r(this,te,.5);r(this,Ge,"°C");r(this,We,[]);r(this,Ue,[]);r(this,Xe,[]);r(this,Ke,[]);r(this,Pi,{});r(this,Je,void 0);n(this,Je,It(h(this,vr,ys).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features?.includes("target_temperature"),s=this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0,a=this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0,o=this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0;n(this,ut,this.def.feature_config?.min_temp??16),n(this,Rt,this.def.feature_config?.max_temp??32),n(this,te,this.def.feature_config?.temp_step??.5),n(this,Ge,this.def.unit_of_measurement??"°C"),n(this,We,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),n(this,Ue,this.def.feature_config?.fan_modes??[]),n(this,Xe,this.def.feature_config?.preset_modes??[]),n(this,Ke,this.def.feature_config?.swing_modes??[]);const l=h(this,Di,Wr).call(this,t(this,F)),c=K(B),v=K(B-l/100*b),x=it*(1-l/100),[A,k]=t(this,F).toFixed(1).split(".");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Os}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e&&i?`
              <div class="hrv-dial-wrap">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path class="hrv-dial-track" d="${_e}"/>
                  <path class="hrv-dial-fill" d="${_e}"
                    stroke-dasharray="${it}" stroke-dashoffset="${x}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${v.x}" cy="${v.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${v.x}" cy="${v.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${d(A)}</span><span class="hrv-climate-temp-frac">.${d(k)}</span><span class="hrv-climate-temp-unit">${d(t(this,Ge))}</span>
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
                  <span class="hrv-climate-ro-temp-int">${d(A)}</span><span class="hrv-climate-ro-temp-frac">.${d(k)}</span><span class="hrv-climate-ro-temp-unit">${d(t(this,Ge))}</span>
                </div>
              </div>
            `:""}
            <div class="hrv-climate-grid">
              ${t(this,We).length?`
                <button class="hrv-cf-btn" data-feat="mode" type="button"
                  ${e?'title="Change HVAC mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${a&&t(this,Xe).length?`
                <button class="hrv-cf-btn" data-feat="preset" type="button"
                  ${e?'title="Change preset mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Preset</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${s&&t(this,Ue).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button"
                  ${e?'title="Change fan mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${o&&t(this,Ke).length?`
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
      `,n(this,G,this.root.querySelector(".hrv-dial-wrap")),n(this,At,this.root.querySelector(".hrv-dial-fill")),n(this,ct,this.root.querySelector(".hrv-dial-thumb")),n(this,Pe,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,De,this.root.querySelector(".hrv-climate-state-text")),n(this,ze,this.root.querySelector(".hrv-climate-temp-int")),n(this,Be,this.root.querySelector(".hrv-climate-temp-frac")),n(this,V,this.root.querySelector("[data-dir='-']")),n(this,O,this.root.querySelector("[data-dir='+']")),n(this,Re,this.root.querySelector("[data-feat=mode]")),n(this,je,this.root.querySelector("[data-feat=fan]")),n(this,Ve,this.root.querySelector("[data-feat=preset]")),n(this,Oe,this.root.querySelector("[data-feat=swing]")),n(this,St,this.root.querySelector(".hrv-climate-dropdown")),t(this,G)&&(t(this,G).addEventListener("pointerdown",h(this,pr,gs).bind(this)),t(this,G).addEventListener("pointermove",h(this,ur,bs).bind(this)),t(this,G).addEventListener("pointerup",h(this,Bi,Xr).bind(this)),t(this,G).addEventListener("pointercancel",h(this,Bi,Xr).bind(this))),t(this,V)&&(t(this,V).addEventListener("click",()=>h(this,zi,Ur).call(this,-1)),t(this,V).addEventListener("pointerdown",()=>t(this,V).setAttribute("data-pressing","true")),t(this,V).addEventListener("pointerup",()=>t(this,V).removeAttribute("data-pressing")),t(this,V).addEventListener("pointerleave",()=>t(this,V).removeAttribute("data-pressing")),t(this,V).addEventListener("pointercancel",()=>t(this,V).removeAttribute("data-pressing"))),t(this,O)&&(t(this,O).addEventListener("click",()=>h(this,zi,Ur).call(this,1)),t(this,O).addEventListener("pointerdown",()=>t(this,O).setAttribute("data-pressing","true")),t(this,O).addEventListener("pointerup",()=>t(this,O).removeAttribute("data-pressing")),t(this,O).addEventListener("pointerleave",()=>t(this,O).removeAttribute("data-pressing")),t(this,O).addEventListener("pointercancel",()=>t(this,O).removeAttribute("data-pressing"))),e&&[t(this,Re),t(this,je),t(this,Ve),t(this,Oe)].forEach(S=>{if(!S)return;const f=S.getAttribute("data-feat");S.addEventListener("click",()=>h(this,cr,ms).call(this,f)),S.addEventListener("pointerdown",()=>S.setAttribute("data-pressing","true")),S.addEventListener("pointerup",()=>S.removeAttribute("data-pressing")),S.addEventListener("pointerleave",()=>S.removeAttribute("data-pressing")),S.addEventListener("pointercancel",()=>S.removeAttribute("data-pressing"))}),this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Pi,{...i}),n(this,pt,e),n(this,Ne,i.fan_mode??null),n(this,Ze,i.preset_mode??null),n(this,Ye,i.swing_mode??null),!t(this,Bt)&&i.temperature!==void 0&&(n(this,F,i.temperature),h(this,ti,Er).call(this)),t(this,De)&&(t(this,De).textContent=we(i.hvac_action??e));const s=this.root.querySelector(".hrv-climate-ro-temp-int"),a=this.root.querySelector(".hrv-climate-ro-temp-frac");if(s&&i.temperature!==void 0){n(this,F,i.temperature);const[c,v]=t(this,F).toFixed(1).split(".");s.textContent=c,a.textContent=`.${v}`}h(this,fr,xs).call(this);const o=i.hvac_action??e,l=we(o);this.announceState(`${this.def.friendly_name}, ${l}`)}predictState(e,i){const s={...t(this,Pi)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:s}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,pt),attributes:{...s,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,pt),attributes:{...s,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,pt),attributes:{...s,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,pt),attributes:{...s,swing_mode:i.swing_mode}}:null}}G=new WeakMap,At=new WeakMap,ct=new WeakMap,Pe=new WeakMap,Bt=new WeakMap,De=new WeakMap,ze=new WeakMap,Be=new WeakMap,V=new WeakMap,O=new WeakMap,Re=new WeakMap,je=new WeakMap,Ve=new WeakMap,Oe=new WeakMap,St=new WeakMap,Fe=new WeakMap,Qt=new WeakMap,F=new WeakMap,pt=new WeakMap,Ne=new WeakMap,Ze=new WeakMap,Ye=new WeakMap,ut=new WeakMap,Rt=new WeakMap,te=new WeakMap,Ge=new WeakMap,We=new WeakMap,Ue=new WeakMap,Xe=new WeakMap,Ke=new WeakMap,Pi=new WeakMap,Je=new WeakMap,Di=new WeakSet,Wr=function(e){return Math.max(0,Math.min(100,(e-t(this,ut))/(t(this,Rt)-t(this,ut))*100))},lr=new WeakSet,fs=function(e){const i=t(this,ut)+e/100*(t(this,Rt)-t(this,ut)),s=Math.round(i/t(this,te))*t(this,te);return Math.max(t(this,ut),Math.min(t(this,Rt),+s.toFixed(10)))},cr=new WeakSet,ms=function(e){if(t(this,Fe)===e){h(this,Qe,Hr).call(this);return}n(this,Fe,e);let i=[],s=null,a="",o="";switch(e){case"mode":i=t(this,We),s=t(this,pt),a="set_hvac_mode",o="hvac_mode";break;case"fan":i=t(this,Ue),s=t(this,Ne),a="set_fan_mode",o="fan_mode";break;case"preset":i=t(this,Xe),s=t(this,Ze),a="set_preset_mode",o="preset_mode";break;case"swing":i=t(this,Ke),s=t(this,Ye),a="set_swing_mode",o="swing_mode";break}if(!i.length||!t(this,St))return;t(this,St).innerHTML=i.map(c=>`
        <button class="hrv-cf-option" data-active="${c===s}" type="button">
          ${d(we(c))}
        </button>
      `).join(""),t(this,St).querySelectorAll(".hrv-cf-option").forEach((c,v)=>{c.addEventListener("click",()=>{this.config.card?.sendCommand(a,{[o]:i[v]}),h(this,Qe,Hr).call(this)})}),t(this,St).removeAttribute("hidden");const l=c=>{c.composedPath().some(x=>x===this.root||x===this.root.host)||h(this,Qe,Hr).call(this)};n(this,Qt,l),document.addEventListener("pointerdown",l,!0)},Qe=new WeakSet,Hr=function(){n(this,Fe,null),t(this,St)?.setAttribute("hidden",""),t(this,Qt)&&(document.removeEventListener("pointerdown",t(this,Qt),!0),n(this,Qt,null))},zi=new WeakSet,Ur=function(e){const i=Math.round((t(this,F)+e*t(this,te))*100)/100;n(this,F,Math.max(t(this,ut),Math.min(t(this,Rt),i))),h(this,ti,Er).call(this),t(this,Je).call(this)},ti=new WeakSet,Er=function(){const e=h(this,Di,Wr).call(this,t(this,F)),i=it*(1-e/100),s=K(B-e/100*b);t(this,At)?.setAttribute("stroke-dashoffset",String(i)),t(this,ct)?.setAttribute("cx",String(s.x)),t(this,ct)?.setAttribute("cy",String(s.y)),t(this,Pe)?.setAttribute("cx",String(s.x)),t(this,Pe)?.setAttribute("cy",String(s.y));const[a,o]=t(this,F).toFixed(1).split(".");t(this,ze)&&(t(this,ze).textContent=a),t(this,Be)&&(t(this,Be).textContent=`.${o}`)},pr=new WeakSet,gs=function(e){n(this,Bt,!0),t(this,G)?.setPointerCapture(e.pointerId),h(this,Ri,Kr).call(this,e)},ur=new WeakSet,bs=function(e){t(this,Bt)&&h(this,Ri,Kr).call(this,e)},Bi=new WeakSet,Xr=function(e){if(t(this,Bt)){n(this,Bt,!1);try{t(this,G)?.releasePointerCapture(e.pointerId)}catch{}t(this,At)&&(t(this,At).style.transition=""),t(this,ct)&&(t(this,ct).style.transition="")}},Ri=new WeakSet,Kr=function(e){if(!t(this,G))return;const i=t(this,G).getBoundingClientRect(),s=i.left+i.width/2,a=i.top+i.height/2,o=e.clientX-s,l=-(e.clientY-a);let c=Math.atan2(l,o)*180/Math.PI;c<0&&(c+=360);let v=B-c;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b),n(this,F,h(this,lr,fs).call(this,v/b*100)),t(this,At)&&(t(this,At).style.transition="none"),t(this,ct)&&(t(this,ct).style.transition="none"),h(this,ti,Er).call(this),t(this,Je).call(this)},vr=new WeakSet,ys=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,F)})},fr=new WeakSet,xs=function(){const e=(i,s)=>{if(!i)return;const a=i.querySelector(".hrv-cf-value");a&&(a.textContent=we(s??"None"))};e(t(this,Re),t(this,pt)),e(t(this,je),t(this,Ne)),e(t(this,Ve),t(this,Ze)),e(t(this,Oe),t(this,Ye))};const Ns=`
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
  `;class Zs extends m{constructor(){super(...arguments);r(this,vt,null)}render(){const e=this.def.capabilities==="read-write",i=this.def.friendly_name;this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ns}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(i)}</span>
          </div>
          <div part="card-body">
            <button part="trigger-button" type="button"
              aria-label="${d(i)}"
              title="${e?d(i):"Read-only"}"
              ${e?"":"disabled"}>
              <span part="btn-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,vt,this.root.querySelector("[part=trigger-button]")),this.renderIcon(this.def.icon_state_map?.idle??this.def.icon??"mdi:play","btn-icon"),t(this,vt)&&e&&this._attachGestureHandlers(t(this,vt),{onTap:()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}t(this,vt).disabled=!0,this.config.card?.sendCommand("trigger",{})}}),this.renderCompanions(),N(this.root)}applyState(e,i){const s=e==="triggered";t(this,vt)&&(t(this,vt).setAttribute("data-state",e),this.def.capabilities==="read-write"&&(t(this,vt).disabled=s));const a=this.def.icon_state_map?.[e]??this.def.icon??"mdi:play";this.renderIcon(a,"btn-icon"),s&&this.announceState(`${this.def.friendly_name}, ${this.i18n.t("state.triggered")}`)}predictState(e,i){return e!=="trigger"?null:{state:"triggered",attributes:{}}}}vt=new WeakMap;const Ys=`
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
  `;class Gs extends m{constructor(){super(...arguments);r(this,ee,null)}render(){this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ys}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-bs-circle" data-on="false"
              role="img" aria-label="${d(this.def.friendly_name)}">
              <span part="state-icon" aria-hidden="true"></span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,ee,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.def.icon_state_map?.off??this.def.icon??"mdi:radiobox-blank","state-icon"),this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const s=e==="on",a=this.i18n.t(`state.${e}`)!==`state.${e}`?this.i18n.t(`state.${e}`):e;t(this,ee)&&(t(this,ee).setAttribute("data-on",String(s)),t(this,ee).setAttribute("aria-label",`${this.def.friendly_name}: ${a}`));const o=this.def.icon_state_map?.[e]??this.def.icon??(s?"mdi:radiobox-marked":"mdi:radiobox-blank");this.renderIcon(o,"state-icon"),this.announceState(`${this.def.friendly_name}, ${a}`)}}ee=new WeakMap;const Ws='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',Us='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',Xs='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',Ks=`
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
  `;class Js extends m{constructor(e,i,s,a){super(e,i,s,a);r(this,ei);r(this,mr);r(this,ie,null);r(this,ft,null);r(this,$,null);r(this,re,null);r(this,se,null);r(this,ne,null);r(this,$t,!1);r(this,mt,0);r(this,ji,"closed");r(this,Vi,{});r(this,Oi,void 0);n(this,Oi,It(h(this,mr,Cs).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features?.includes("set_position"),s=!this.def.supported_features||this.def.supported_features.includes("buttons");if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ks}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
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
            ${e&&s?`
              <div class="hrv-cover-btns">
                <button class="hrv-cover-btn" data-action="open" type="button"
                  title="Open cover" aria-label="Open cover">${Ws}</button>
                <button class="hrv-cover-btn" data-action="stop" type="button"
                  title="Stop cover" aria-label="Stop cover">${Us}</button>
                <button class="hrv-cover-btn" data-action="close" type="button"
                  title="Close cover" aria-label="Close cover">${Xs}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,ie,this.root.querySelector(".hrv-cover-slider-track")),n(this,ft,this.root.querySelector(".hrv-cover-slider-fill")),n(this,$,this.root.querySelector(".hrv-cover-slider-thumb")),n(this,re,this.root.querySelector("[data-action=open]")),n(this,se,this.root.querySelector("[data-action=stop]")),n(this,ne,this.root.querySelector("[data-action=close]")),t(this,ie)&&t(this,$)&&e){const a=l=>{n(this,$t,!0),t(this,$).style.transition="none",t(this,ft).style.transition="none",h(this,ei,Tr).call(this,l),t(this,$).setPointerCapture(l.pointerId)};t(this,$).addEventListener("pointerdown",a),t(this,ie).addEventListener("pointerdown",l=>{l.target!==t(this,$)&&(n(this,$t,!0),t(this,$).style.transition="none",t(this,ft).style.transition="none",h(this,ei,Tr).call(this,l),t(this,$).setPointerCapture(l.pointerId))}),t(this,$).addEventListener("pointermove",l=>{t(this,$t)&&h(this,ei,Tr).call(this,l)});const o=()=>{t(this,$t)&&(n(this,$t,!1),t(this,$).style.transition="",t(this,ft).style.transition="",t(this,Oi).call(this))};t(this,$).addEventListener("pointerup",o),t(this,$).addEventListener("pointercancel",o)}[t(this,re),t(this,se),t(this,ne)].forEach(a=>{if(!a)return;const o=a.getAttribute("data-action");a.addEventListener("click",()=>{this.config.card?.sendCommand(`${o}_cover`,{})}),a.addEventListener("pointerdown",()=>a.setAttribute("data-pressing","true")),a.addEventListener("pointerup",()=>a.removeAttribute("data-pressing")),a.addEventListener("pointerleave",()=>a.removeAttribute("data-pressing")),a.addEventListener("pointercancel",()=>a.removeAttribute("data-pressing"))}),this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,ji,e),n(this,Vi,{...i});const s=e==="opening"||e==="closing",a=i.current_position;t(this,re)&&(t(this,re).disabled=!s&&a===100),t(this,se)&&(t(this,se).disabled=!s),t(this,ne)&&(t(this,ne).disabled=!s&&e==="closed"),i.current_position!==void 0&&!t(this,$t)&&(n(this,mt,i.current_position),t(this,ft)&&(t(this,ft).style.width=`${t(this,mt)}%`),t(this,$)&&(t(this,$).style.left=`${t(this,mt)}%`)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const s={...t(this,Vi)};return e==="open_cover"?(s.current_position=100,{state:"open",attributes:s}):e==="close_cover"?(s.current_position=0,{state:"closed",attributes:s}):e==="stop_cover"?{state:t(this,ji),attributes:s}:e==="set_cover_position"&&i.position!==void 0?(s.current_position=i.position,{state:i.position>0?"open":"closed",attributes:s}):null}}ie=new WeakMap,ft=new WeakMap,$=new WeakMap,re=new WeakMap,se=new WeakMap,ne=new WeakMap,$t=new WeakMap,mt=new WeakMap,ji=new WeakMap,Vi=new WeakMap,Oi=new WeakMap,ei=new WeakSet,Tr=function(e){const i=t(this,ie).getBoundingClientRect(),s=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,mt,Math.round(s)),t(this,ft).style.width=`${t(this,mt)}%`,t(this,$).style.left=`${t(this,mt)}%`},mr=new WeakSet,Cs=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,mt)})};const Qs=`
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
  `;class tn extends m{constructor(e,i,s,a){super(e,i,s,a);r(this,gr);r(this,br);r(this,Ft);r(this,ri);r(this,yr);r(this,Nt);r(this,ae,null);r(this,Lt,null);r(this,E,null);r(this,q,null);r(this,ii,null);r(this,jt,null);r(this,Vt,null);r(this,kt,!1);r(this,T,0);r(this,W,0);r(this,Q,100);r(this,Mt,1);r(this,Ot,void 0);n(this,Ot,It(h(this,yr,As).bind(this),300))}render(){const e=this.def.capabilities==="read-write";n(this,W,this.def.feature_config?.min??0),n(this,Q,this.def.feature_config?.max??100),n(this,Mt,this.def.feature_config?.step??1);const i=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Qs}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
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
                  aria-label="Decrease ${d(this.def.friendly_name)}">-</button>
                <input class="hrv-num-input" type="number"
                  min="${t(this,W)}" max="${t(this,Q)}" step="${t(this,Mt)}"
                  title="Enter value" aria-label="${d(this.def.friendly_name)} value">
                <button class="hrv-num-btn" type="button" part="inc-btn"
                  aria-label="Increase ${d(this.def.friendly_name)}">+</button>
                ${i?`<span class="hrv-num-unit">${d(i)}</span>`:""}
              </div>
            `:`
              <div class="hrv-num-readonly">
                <span class="hrv-num-readonly-val">-</span>
                ${i?`<span class="hrv-num-readonly-unit">${d(i)}</span>`:""}
              </div>
            `}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,ae,this.root.querySelector(".hrv-num-slider-track")),n(this,Lt,this.root.querySelector(".hrv-num-slider-fill")),n(this,E,this.root.querySelector(".hrv-num-slider-thumb")),n(this,q,this.root.querySelector(".hrv-num-input")),n(this,ii,this.root.querySelector(".hrv-num-readonly-val")),n(this,jt,this.root.querySelector("[part=dec-btn]")),n(this,Vt,this.root.querySelector("[part=inc-btn]")),t(this,ae)&&t(this,E)){const s=o=>{n(this,kt,!0),t(this,E).style.transition="none",t(this,Lt).style.transition="none",h(this,ri,qr).call(this,o),t(this,E).setPointerCapture(o.pointerId)};t(this,E).addEventListener("pointerdown",s),t(this,ae).addEventListener("pointerdown",o=>{o.target!==t(this,E)&&(n(this,kt,!0),t(this,E).style.transition="none",t(this,Lt).style.transition="none",h(this,ri,qr).call(this,o),t(this,E).setPointerCapture(o.pointerId))}),t(this,E).addEventListener("pointermove",o=>{t(this,kt)&&h(this,ri,qr).call(this,o)});const a=()=>{t(this,kt)&&(n(this,kt,!1),t(this,E).style.transition="",t(this,Lt).style.transition="",t(this,Ot).call(this))};t(this,E).addEventListener("pointerup",a),t(this,E).addEventListener("pointercancel",a)}t(this,q)&&t(this,q).addEventListener("input",()=>{const s=parseFloat(t(this,q).value);isNaN(s)||(n(this,T,Math.max(t(this,W),Math.min(t(this,Q),s))),h(this,Ft,wi).call(this),h(this,Nt,_i).call(this),t(this,Ot).call(this))}),t(this,jt)&&t(this,jt).addEventListener("click",()=>{n(this,T,+Math.max(t(this,W),t(this,T)-t(this,Mt)).toFixed(10)),h(this,Ft,wi).call(this),t(this,q)&&(t(this,q).value=String(t(this,T))),h(this,Nt,_i).call(this),t(this,Ot).call(this)}),t(this,Vt)&&t(this,Vt).addEventListener("click",()=>{n(this,T,+Math.min(t(this,Q),t(this,T)+t(this,Mt)).toFixed(10)),h(this,Ft,wi).call(this),t(this,q)&&(t(this,q).value=String(t(this,T))),h(this,Nt,_i).call(this),t(this,Ot).call(this)}),this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const s=parseFloat(e);if(isNaN(s))return;n(this,T,s),t(this,kt)||(h(this,Ft,wi).call(this),t(this,q)&&!this.isFocused(t(this,q))&&(t(this,q).value=String(s))),h(this,Nt,_i).call(this),t(this,ii)&&(t(this,ii).textContent=String(s));const a=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${s}${a?` ${a}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}ae=new WeakMap,Lt=new WeakMap,E=new WeakMap,q=new WeakMap,ii=new WeakMap,jt=new WeakMap,Vt=new WeakMap,kt=new WeakMap,T=new WeakMap,W=new WeakMap,Q=new WeakMap,Mt=new WeakMap,Ot=new WeakMap,gr=new WeakSet,ws=function(e){const i=t(this,Q)-t(this,W);return i===0?0:Math.max(0,Math.min(100,(e-t(this,W))/i*100))},br=new WeakSet,_s=function(e){const i=t(this,W)+e/100*(t(this,Q)-t(this,W)),s=Math.round(i/t(this,Mt))*t(this,Mt);return Math.max(t(this,W),Math.min(t(this,Q),+s.toFixed(10)))},Ft=new WeakSet,wi=function(){const e=h(this,gr,ws).call(this,t(this,T));t(this,Lt)&&(t(this,Lt).style.width=`${e}%`),t(this,E)&&(t(this,E).style.left=`${e}%`)},ri=new WeakSet,qr=function(e){const i=t(this,ae).getBoundingClientRect(),s=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,T,h(this,br,_s).call(this,s)),h(this,Ft,wi).call(this),t(this,q)&&(t(this,q).value=String(t(this,T))),h(this,Nt,_i).call(this)},yr=new WeakSet,As=function(){this.config.card?.sendCommand("set_value",{value:t(this,T)})},Nt=new WeakSet,_i=function(){t(this,jt)&&(t(this,jt).disabled=t(this,T)<=t(this,W)),t(this,Vt)&&(t(this,Vt).disabled=t(this,T)>=t(this,Q))};const en=`
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
  `;class rn extends m{constructor(){super(...arguments);r(this,xr);r(this,Ni);r(this,si,null);r(this,gt,null);r(this,Fi,"");r(this,Ht,[]);r(this,oe,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${en}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-is-selected" type="button"
              ${e?'title="Select an option"':'data-readonly="true" title="Read-only" disabled'}
              aria-label="${d(this.def.friendly_name)}">
              <span class="hrv-is-label">-</span>
              ${e?'<span class="hrv-is-arrow" aria-hidden="true">&#9660;</span>':""}
            </button>
            ${e?'<div class="hrv-is-dropdown" hidden></div>':""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,si,this.root.querySelector(".hrv-is-selected")),n(this,gt,this.root.querySelector(".hrv-is-dropdown")),t(this,si)&&e&&t(this,si).addEventListener("click",()=>{t(this,oe)?h(this,Ni,Jr).call(this):h(this,xr,Ss).call(this)}),this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Fi,e),n(this,Ht,i?.options??t(this,Ht));const s=this.root.querySelector(".hrv-is-label");s&&(s.textContent=e),t(this,oe)&&t(this,gt)?.querySelectorAll(".hrv-is-option").forEach((a,o)=>{a.setAttribute("data-active",String(t(this,Ht)[o]===e))}),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{}}:null}}si=new WeakMap,gt=new WeakMap,Fi=new WeakMap,Ht=new WeakMap,oe=new WeakMap,xr=new WeakSet,Ss=function(){if(!t(this,gt)||!t(this,Ht).length)return;t(this,gt).innerHTML=t(this,Ht).map(i=>`
        <button class="hrv-is-option" type="button"
          data-active="${i===t(this,Fi)}"
          title="${d(i)}">
          ${d(i)}
        </button>
      `).join(""),t(this,gt).querySelectorAll(".hrv-is-option").forEach((i,s)=>{i.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:t(this,Ht)[s]}),h(this,Ni,Jr).call(this)})});const e=this.root.querySelector("[part=card]");e&&(e.style.overflow="visible"),t(this,gt).removeAttribute("hidden"),n(this,oe,!0)},Ni=new WeakSet,Jr=function(){t(this,gt)?.setAttribute("hidden","");const e=this.root.querySelector("[part=card]");e&&(e.style.overflow=""),n(this,oe,!1)};const sn=`
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
  `;class nn extends m{constructor(e,i,s,a){super(e,i,s,a);r(this,oi);r(this,Cr);r(this,Et,null);r(this,ni,null);r(this,ai,null);r(this,he,null);r(this,de,null);r(this,bt,null);r(this,L,null);r(this,le,null);r(this,ce,null);r(this,pe,!1);r(this,yt,0);r(this,Tt,!1);r(this,ue,"idle");r(this,ve,{});r(this,Zi,void 0);n(this,Zi,this.debounce(h(this,Cr,$s).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],s=i.includes("volume_set"),a=i.includes("previous_track");if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${sn}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
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
            ${s?`
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
      `,n(this,Et,this.root.querySelector("[data-role=play]")),n(this,ni,this.root.querySelector("[data-role=prev]")),n(this,ai,this.root.querySelector("[data-role=next]")),n(this,he,this.root.querySelector(".hrv-mp-mute")),n(this,de,this.root.querySelector(".hrv-mp-slider-track")),n(this,bt,this.root.querySelector(".hrv-mp-slider-fill")),n(this,L,this.root.querySelector(".hrv-mp-slider-thumb")),n(this,le,this.root.querySelector(".hrv-mp-artist")),n(this,ce,this.root.querySelector(".hrv-mp-title")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,Et)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,ni)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,ai)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,Et),t(this,ni),t(this,ai)].forEach(o=>{o&&(o.addEventListener("pointerdown",()=>o.setAttribute("data-pressing","true")),o.addEventListener("pointerup",()=>o.removeAttribute("data-pressing")),o.addEventListener("pointerleave",()=>o.removeAttribute("data-pressing")),o.addEventListener("pointercancel",()=>o.removeAttribute("data-pressing")))}),t(this,he)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,pe)})),t(this,de)&&t(this,L))){const o=c=>{n(this,Tt,!0),t(this,L).style.transition="none",t(this,bt).style.transition="none",h(this,oi,Ir).call(this,c),t(this,L).setPointerCapture(c.pointerId)};t(this,L).addEventListener("pointerdown",o),t(this,de).addEventListener("pointerdown",c=>{c.target!==t(this,L)&&(n(this,Tt,!0),t(this,L).style.transition="none",t(this,bt).style.transition="none",h(this,oi,Ir).call(this,c),t(this,L).setPointerCapture(c.pointerId))}),t(this,L).addEventListener("pointermove",c=>{t(this,Tt)&&h(this,oi,Ir).call(this,c)});const l=()=>{t(this,Tt)&&(n(this,Tt,!1),t(this,L).style.transition="",t(this,bt).style.transition="",t(this,Zi).call(this))};t(this,L).addEventListener("pointerup",l),t(this,L).addEventListener("pointercancel",l)}this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,ue,e),n(this,ve,i);const s=e==="playing",a=e==="paused";if(t(this,le)){const l=i.media_artist??"";t(this,le).textContent=l,t(this,le).title=l||"Artist"}if(t(this,ce)){const l=i.media_title??"";t(this,ce).textContent=l,t(this,ce).title=l||"Title"}if(t(this,Et)){t(this,Et).setAttribute("data-playing",String(s));const l=s?"mdi:pause":"mdi:play";this.renderIcon(l,"play-icon"),this.def.capabilities==="read-write"&&(t(this,Et).title=s?"Pause":"Play")}if(n(this,pe,!!i.is_volume_muted),t(this,he)){const l=t(this,pe)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(l,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,he).title=t(this,pe)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,Tt)&&(n(this,yt,Math.round(i.volume_level*100)),t(this,bt)&&(t(this,bt).style.width=`${t(this,yt)}%`),t(this,L)&&(t(this,L).style.left=`${t(this,yt)}%`));const o=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${o?` - ${o}`:""}`)}predictState(e,i){return e==="media_play_pause"?{state:t(this,ue)==="playing"?"paused":"playing",attributes:t(this,ve)}:e==="volume_mute"?{state:t(this,ue),attributes:{...t(this,ve),is_volume_muted:!!i.is_volume_muted}}:e==="volume_set"?{state:t(this,ue),attributes:{...t(this,ve),volume_level:i.volume_level}}:null}}Et=new WeakMap,ni=new WeakMap,ai=new WeakMap,he=new WeakMap,de=new WeakMap,bt=new WeakMap,L=new WeakMap,le=new WeakMap,ce=new WeakMap,pe=new WeakMap,yt=new WeakMap,Tt=new WeakMap,ue=new WeakMap,ve=new WeakMap,Zi=new WeakMap,oi=new WeakSet,Ir=function(e){const i=t(this,de).getBoundingClientRect(),s=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,yt,Math.round(s)),t(this,bt).style.width=`${t(this,yt)}%`,t(this,L).style.left=`${t(this,yt)}%`},Cr=new WeakSet,$s=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,yt)/100})};const an=`
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
  `;class on extends m{constructor(){super(...arguments);r(this,hi,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.tapAction?.data?.command??"power";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${an}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-remote-circle" type="button"
              title="${e?d(i):"Read-only"}"
              aria-label="${d(this.def.friendly_name)} - ${d(i)}"
              ${e?"":"disabled"}>
              <span part="remote-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,hi,this.root.querySelector(".hrv-remote-circle"));const s=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(s,"remote-icon"),t(this,hi)&&e&&this._attachGestureHandlers(t(this,hi),{onTap:()=>{const a=this.config.gestureConfig?.tap;if(a){this._runAction(a);return}const o=this.config.tapAction?.data?.command??"power",l=this.config.tapAction?.data?.device??void 0,c=l?{command:o,device:l}:{command:o};this.config.card?.sendCommand("send_command",c)}}),this.renderCompanions(),N(this.root)}applyState(e,i){const s=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(s,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}hi=new WeakMap;const hn=`
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
  `;class dn extends m{constructor(){super(...arguments);r(this,di,null);r(this,li,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${hn}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" title="${d(this.def.friendly_name)}">
            <span class="hrv-sensor-val" aria-live="polite">-</span>
            ${e?`<span class="hrv-sensor-unit" title="${d(e)}">${d(e)}</span>`:""}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,di,this.root.querySelector(".hrv-sensor-val")),n(this,li,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){t(this,di)&&(t(this,di).textContent=e),t(this,li)&&i.unit_of_measurement!==void 0&&(t(this,li).textContent=i.unit_of_measurement);const s=i.unit_of_measurement??this.def.unit_of_measurement??"",a=this.root.querySelector("[part=card-body]");a&&(a.title=`${e}${s?` ${s}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${s?` ${s}`:""}`)}}di=new WeakMap,li=new WeakMap;const ln=`
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
  `;class ts extends m{constructor(){super(...arguments);r(this,xt,null);r(this,ci,null);r(this,fe,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ln}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e?`
              <button class="hrv-switch-track" type="button" data-on="false"
                title="Toggle" aria-label="${d(this.def.friendly_name)} - Toggle">
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
      `,n(this,xt,this.root.querySelector(".hrv-switch-track")),n(this,ci,this.root.querySelector(".hrv-switch-ro")),t(this,xt)&&e&&this._attachGestureHandlers(t(this,xt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),N(this.root)}applyState(e,i){n(this,fe,e==="on");const s=e==="unavailable"||e==="unknown";t(this,xt)&&(t(this,xt).setAttribute("data-on",String(t(this,fe))),t(this,xt).title=t(this,fe)?"On - click to turn off":"Off - click to turn on",t(this,xt).disabled=s),t(this,ci)&&(t(this,ci).textContent=we(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,fe)?"off":"on",attributes:{}}}}xt=new WeakMap,ci=new WeakMap,fe=new WeakMap;const cn=`
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
  `;function Xi(p){p<0&&(p=0);const u=Math.floor(p/3600),e=Math.floor(p%3600/60),i=Math.floor(p%60),s=a=>String(a).padStart(2,"0");return u>0?`${u}:${s(e)}:${s(i)}`:`${s(e)}:${s(i)}`}function es(p){if(typeof p=="number")return p;if(typeof p!="string")return 0;const u=p.split(":").map(Number);return u.length===3?u[0]*3600+u[1]*60+u[2]:u.length===2?u[0]*60+u[1]:u[0]||0}class pn extends m{constructor(){super(...arguments);r(this,wr);r(this,_r);r(this,Ar);r(this,ge);r(this,X,null);r(this,qt,null);r(this,Zt,null);r(this,Yt,null);r(this,me,null);r(this,pi,"idle");r(this,ui,{});r(this,tt,null);r(this,vi,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${cn}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-timer-display" title="Time remaining">00:00</span>
            ${e?`
              <div class="hrv-timer-controls">
                <button class="hrv-timer-btn" data-action="playpause" type="button"
                  title="Start" aria-label="${d(this.def.friendly_name)} - Start">
                  <span part="playpause-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="cancel" type="button"
                  title="Cancel" aria-label="${d(this.def.friendly_name)} - Cancel">
                  <span part="cancel-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="finish" type="button"
                  title="Finish" aria-label="${d(this.def.friendly_name)} - Finish">
                  <span part="finish-icon" aria-hidden="true"></span>
                </button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,X,this.root.querySelector(".hrv-timer-display")),n(this,qt,this.root.querySelector("[data-action=playpause]")),n(this,Zt,this.root.querySelector("[data-action=cancel]")),n(this,Yt,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,qt)?.addEventListener("click",()=>{const i=t(this,pi)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,Zt)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,Yt)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,qt),t(this,Zt),t(this,Yt)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,pi,e),n(this,ui,{...i}),n(this,tt,i.finishes_at??null),n(this,vi,i.remaining!=null?es(i.remaining):null),h(this,wr,Ls).call(this,e),h(this,_r,ks).call(this,e),e==="active"&&t(this,tt)?h(this,Ar,Ms).call(this):h(this,ge,Wi).call(this),t(this,X)&&t(this,X).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const s={...t(this,ui)};return e==="start"?{state:"active",attributes:s}:e==="pause"?(t(this,tt)&&(s.remaining=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3)),{state:"paused",attributes:s}):e==="cancel"||e==="finish"?{state:"idle",attributes:s}:null}}X=new WeakMap,qt=new WeakMap,Zt=new WeakMap,Yt=new WeakMap,me=new WeakMap,pi=new WeakMap,ui=new WeakMap,tt=new WeakMap,vi=new WeakMap,wr=new WeakSet,Ls=function(e){const i=e==="idle",s=e==="active";if(t(this,qt)){const a=s?"mdi:pause":"mdi:play",o=s?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(a,"playpause-icon"),t(this,qt).title=o,t(this,qt).setAttribute("aria-label",`${this.def.friendly_name} - ${o}`)}t(this,Zt)&&(t(this,Zt).disabled=i),t(this,Yt)&&(t(this,Yt).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},_r=new WeakSet,ks=function(e){if(t(this,X)){if(e==="idle"){const i=t(this,ui).duration;t(this,X).textContent=i?Xi(es(i)):"00:00";return}if(e==="paused"&&t(this,vi)!=null){t(this,X).textContent=Xi(t(this,vi));return}if(e==="active"&&t(this,tt)){const i=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3);t(this,X).textContent=Xi(i)}}},Ar=new WeakSet,Ms=function(){h(this,ge,Wi).call(this),n(this,me,setInterval(()=>{if(!t(this,tt)||t(this,pi)!=="active"){h(this,ge,Wi).call(this);return}const e=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3);t(this,X)&&(t(this,X).textContent=Xi(e)),e<=0&&h(this,ge,Wi).call(this)},1e3))},ge=new WeakSet,Wi=function(){t(this,me)&&(clearInterval(t(this,me)),n(this,me,null))};const un=`
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
  `;class vn extends m{constructor(){super(...arguments);r(this,fi,null);r(this,Ct,null);r(this,be,!1);r(this,ye,!1)}render(){const e=this.def.capabilities==="read-write";n(this,ye,!1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${un}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-generic-state" title="${d(this.def.friendly_name)}">-</span>
            ${e?`
              <button class="hrv-generic-toggle" type="button" data-on="false"
                title="Toggle" aria-label="${d(this.def.friendly_name)} - Toggle"
                hidden>
                <div class="hrv-generic-knob"></div>
              </button>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,fi,this.root.querySelector(".hrv-generic-state")),n(this,Ct,this.root.querySelector(".hrv-generic-toggle")),t(this,Ct)&&e&&this._attachGestureHandlers(t(this,Ct),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),N(this.root)}applyState(e,i){const s=e==="on"||e==="off";n(this,be,e==="on"),t(this,fi)&&(t(this,fi).textContent=we(e)),t(this,Ct)&&(s&&!t(this,ye)&&(t(this,Ct).removeAttribute("hidden"),n(this,ye,!0)),t(this,ye)&&(t(this,Ct).setAttribute("data-on",String(t(this,be))),t(this,Ct).title=t(this,be)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,be)?"off":"on",attributes:{}}}}fi=new WeakMap,Ct=new WeakMap,be=new WeakMap,ye=new WeakMap;const is={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",pouring:"M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z","snowy-rainy":"M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z",hail:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z","lightning-rainy":"M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z","windy-variant":"M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},fn=is.cloudy,mn="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,1A1,1 0 0,1 13,2L13,2.01C13,2.01 14.35,3.56 15.72,5.55C17.09,7.54 18.5,9.93 18.5,12.5A6.5,6.5 0 0,1 12,19A6.5,6.5 0 0,1 5.5,12.5C5.5,9.93 6.91,7.54 8.28,5.55C9.65,3.56 11,2.01 11,2.01L11,2A1,1 0 0,1 12,1Z",gn="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",bn="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",yn=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Dr(p,u){const e=is[p]??fn;return`<svg viewBox="0 0 24 24" width="${u}" height="${u}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function zr(p){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${p}" fill="currentColor"/></svg>`}const xn=`
    [part=card] {
      padding-bottom: 0 !important;
    }

    [part=card-body] {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 0 16px;
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

    .hrv-forecast-strip {
      display: flex;
      justify-content: space-between;
      gap: 4px;
      width: 100%;
      padding-top: 8px;
      margin-top: 4px;
      border-top: 1px solid var(--hrv-ex-outline, rgba(255,255,255,0.15));
    }

    .hrv-forecast-strip:empty { display: none; }

    .hrv-forecast-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
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
  `;class Cn extends m{constructor(){super(...arguments);r(this,Sr);r(this,mi,null);r(this,xe,null);r(this,gi,null);r(this,bi,null);r(this,yi,null);r(this,xi,null);r(this,Ce,null)}render(){this.root.innerHTML=`
        <style>${this.getSharedStyles()}${xn}${U}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${d(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-weather-main">
              <span class="hrv-weather-icon">${Dr("cloudy",44)}</span>
              <span class="hrv-weather-temp">--<span class="hrv-weather-unit"></span></span>
            </div>
            <span class="hrv-weather-cond" aria-live="polite">--</span>
            <div class="hrv-weather-stats">
              <span class="hrv-weather-stat" data-stat="humidity">
                ${zr(mn)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="wind">
                ${zr(gn)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="pressure">
                ${zr(bn)}
                <span data-value>--</span>
              </span>
            </div>
            <div class="hrv-forecast-strip" role="list"></div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,mi,this.root.querySelector(".hrv-weather-icon")),n(this,xe,this.root.querySelector(".hrv-weather-temp")),n(this,gi,this.root.querySelector(".hrv-weather-cond")),n(this,bi,this.root.querySelector("[data-stat=humidity] [data-value]")),n(this,yi,this.root.querySelector("[data-stat=wind] [data-value]")),n(this,xi,this.root.querySelector("[data-stat=pressure] [data-value]")),n(this,Ce,this.root.querySelector(".hrv-forecast-strip")),this.renderCompanions(),N(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const s=e||"cloudy";t(this,mi)&&(t(this,mi).innerHTML=Dr(s,44));const a=this.i18n.t(`weather.${s}`)!==`weather.${s}`?this.i18n.t(`weather.${s}`):s.replace(/-/g," ");t(this,gi)&&(t(this,gi).textContent=a);const o=i.temperature,l=i.temperature_unit??"";if(t(this,xe)){const c=t(this,xe).querySelector(".hrv-weather-unit");t(this,xe).firstChild.textContent=o!=null?Math.round(Number(o)):"--",c&&(c.textContent=l?` ${l}`:"")}if(t(this,bi)){const c=i.humidity;t(this,bi).textContent=c!=null?`${c}%`:"--"}if(t(this,yi)){const c=i.wind_speed,v=i.wind_speed_unit??"";t(this,yi).textContent=c!=null?`${c} ${v}`.trim():"--"}if(t(this,xi)){const c=i.pressure,v=i.pressure_unit??"";t(this,xi).textContent=c!=null?`${c} ${v}`.trim():"--"}h(this,Sr,Hs).call(this,i.forecast),this.announceState(`${this.def.friendly_name}, ${a}, ${o??"--"} ${l}`)}}mi=new WeakMap,xe=new WeakMap,gi=new WeakMap,bi=new WeakMap,yi=new WeakMap,xi=new WeakMap,Ce=new WeakMap,Sr=new WeakSet,Hs=function(e){if(!t(this,Ce))return;if(!Array.isArray(e)||e.length===0){t(this,Ce).innerHTML="";return}const i=e.slice(0,5);t(this,Ce).innerHTML=i.map(s=>{const a=new Date(s.datetime),o=yn[a.getDay()]??"",l=s.temperature!=null?Math.round(s.temperature):"--",c=s.templow!=null?Math.round(s.templow):null;return`
          <div class="hrv-forecast-day" role="listitem">
            <span class="hrv-forecast-day-name">${d(o)}</span>
            ${Dr(s.condition||"cloudy",18)}
            <span class="hrv-forecast-temps">
              ${d(String(l))}${c!=null?`/<span class="hrv-forecast-lo">${d(String(c))}</span>`:""}
            </span>
          </div>`}).join("")},g._packs=g._packs||{};const wn=document.currentScript&&document.currentScript.dataset.packId||"minimus";g._packs[wn]={light:Bs,fan:js,climate:Fs,harvest_action:Zs,binary_sensor:Gs,cover:Js,input_boolean:ts,input_number:tn,input_select:rn,media_player:nn,remote:on,sensor:dn,switch:ts,timer:pn,weather:Cn,generic:vn}})();})();
