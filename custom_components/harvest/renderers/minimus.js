(()=>{var Ns=Object.defineProperty;var Sn=A=>{throw TypeError(A)};var Zs=(A,x,p)=>x in A?Ns(A,x,{enumerable:!0,configurable:!0,writable:!0,value:p}):A[x]=p;var gr=(A,x,p)=>Zs(A,typeof x!="symbol"?x+"":x,p),Zr=(A,x,p)=>x.has(A)||Sn("Cannot "+p);var t=(A,x,p)=>(Zr(A,x,"read from private field"),p?p.call(A):x.get(A)),s=(A,x,p)=>x.has(A)?Sn("Cannot add the same private member more than once"):x instanceof WeakSet?x.add(A):x.set(A,p),n=(A,x,p,Yt)=>(Zr(A,x,"write to private field"),Yt?Yt.call(A,p):x.set(A,p),p),h=(A,x,p)=>(Zr(A,x,"access private method"),p);(function(){"use strict";var ce,R,cr,Q,Et,k,j,hi,li,ft,Ct,mt,gt,qe,di,N,tt,Tt,ci,pi,w,Gs,q,An,kn,$n,Ln,Mr,Er,Mn,or,En,Tn,Gr,Hn,Yr,qn,St,ot,Sr,et,ui,Z,Ht,qt,It,G,T,pe,Ut,it,I,Ie,vi,fi,b,Tr,br,Ur,Hr,Xr,Kr,ar,In,Dn,Jr,Pn,Qr,zn,qr,Bn,ct,Xt,Dt,mi,ue,gi,bi,yi,at,ht,xi,wi,_i,Ci,Y,De,Pt,lt,bt,zt,Si,Ai,ki,Bt,ve,Pe,$i,Li,Mi,Ei,Ti,pr,Hi,_,tn,Rn,jn,en,yr,rn,Ir,On,Vn,nn,sn,Fn,Wn,ze,Be,Rt,D,Re,je,Oe,yt,fe,Kt,jt,qi,ur,vr,Ii,Ot,Dr,Nn,Zn,Ve,Jt,O,U,Di,me,ge,Qt,V,pt,At,te,be,L,Gn,Yn,hr,Pr,Un,lr,rt,F,Fe,Ar,ye,Pi,ee,We,ie,xe,we,dt,P,Xn,Kn,on,an,dr,re,zi,Bi,Ne,Ze,Vt,z,Ge,Ye,ne,Ri,ji,Ue,se,X,_e,Oi,Xe,Vi,Ke,Je,Qe,Ft,oe,Ce,Se,fr,K,zr,hn,ln,Jn,Qn,Fi,mr,Wi,Ni,Wt,Zi,Ae,xt,ae,ke,$e,ti,Gi,Yi,kt,Ui,ut,ts,es,is,xr,Xi,Nt,ei,ii,Ki,ri,Ji,Qi,tr,er,vt,Zt,wt,ir,rr,$,Te,Br,ni,si,dn,cn,pn,rs,he,nr,le,kr,de,$r,Le,$t,Lr,Me,sr;const A=window.HArvest;if(!A||!A.renderers||!A.renderers.BaseCard){console.warn("[HArvest minimus] HArvest not found - pack not loaded.");return}const x=A.renderers.BaseCard,p=window.HArvest.esc;function Yt(c,v){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,c.apply(this,i)},v)}}function nt(c){return c?c.charAt(0).toUpperCase()+c.slice(1).replace(/_/g," "):""}const W=`
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
  `;function ns(c){if(!c)return()=>{};const v=80,e=1.6,i=.96,r=.04;let o=null,a=0,l=0,d=0,u=!1,f=0;const y=[],C=()=>{f&&(cancelAnimationFrame(f),f=0)},M=g=>{for(;y.length&&y[0].t<g-v;)y.shift();if(y.length<2)return 0;const S=y[0],H=y[y.length-1],oi=H.t-S.t;return oi<=0?0:(H.x-S.x)/oi},m=()=>{if(Math.abs(d)<r)return;let g=performance.now();const S=H=>{const oi=H-g;if(g=H,c.scrollLeft-=d*oi,d*=Math.pow(i,oi/16),Math.abs(d)<r){f=0,d=0;return}const Ws=c.scrollWidth-c.clientWidth;if(c.scrollLeft<=0||c.scrollLeft>=Ws){f=0,d=0;return}f=requestAnimationFrame(S)};f=requestAnimationFrame(S)},J=g=>{if(c.scrollWidth<=c.clientWidth||g.pointerType==="touch")return;const S=g.target;if(!(S&&S!==c&&S.closest?.("button, a"))){C(),o=g.pointerId,a=g.clientX,l=c.scrollLeft,d=0,u=!1,y.length=0,y.push({x:g.clientX,t:g.timeStamp});try{c.setPointerCapture(o)}catch{}}},Gt=g=>{if(g.pointerId!==o)return;const S=g.clientX-a;Math.abs(S)>4&&(u=!0,c.dataset.dragging="true"),c.scrollLeft=l-S,y.push({x:g.clientX,t:g.timeStamp});const H=g.timeStamp-v;for(;y.length>2&&y[0].t<H;)y.shift()},Ee=g=>{if(g.pointerId===o){try{c.releasePointerCapture(o)}catch{}if(o=null,u){const S=H=>{H.stopPropagation(),H.preventDefault()};window.addEventListener("click",S,{capture:!0,once:!0}),requestAnimationFrame(()=>c.removeAttribute("data-dragging")),d=M(g.timeStamp)*e,m()}y.length=0}};return c.addEventListener("pointerdown",J),c.addEventListener("pointermove",Gt),c.addEventListener("pointerup",Ee),c.addEventListener("pointercancel",Ee),c.addEventListener("wheel",C,{passive:!0}),c.addEventListener("touchstart",C,{passive:!0}),()=>{C(),c.removeEventListener("pointerdown",J),c.removeEventListener("pointermove",Gt),c.removeEventListener("pointerup",Ee),c.removeEventListener("pointercancel",Ee),c.removeEventListener("wheel",C),c.removeEventListener("touchstart",C)}}function B(c){c.querySelectorAll("[part=companion]").forEach(v=>{v.title=v.getAttribute("aria-label")??""})}const ss=60,os=60,He=48,st=225,E=270,Lt=2*Math.PI*He*(E/360);function as(c){return c*Math.PI/180}function _t(c){const v=as(c);return{x:ss+He*Math.cos(v),y:os-He*Math.sin(v)}}function hs(){const c=_t(st),v=_t(st-E);return`M ${c.x} ${c.y} A ${He} ${He} 0 1 1 ${v.x} ${v.y}`}const ai=hs(),Mt=["brightness","temp","color"],wr=120;function un(c){const v=E/wr;let e="";for(let i=0;i<wr;i++){const r=st-i*v,o=st-(i+1)*v,a=_t(r),l=_t(o),d=`M ${a.x} ${a.y} A ${He} ${He} 0 0 1 ${l.x} ${l.y}`,u=i===0||i===wr-1?"round":"butt";e+=`<path d="${d}" stroke="${c(i/wr)}" fill="none" stroke-width="8" stroke-linecap="${u}" />`}return e}const ls=un(c=>`hsl(${Math.round(c*360)},100%,50%)`),ds=un(c=>{const e=Math.round(143+112*c),i=Math.round(255*c);return`rgb(255,${e},${i})`}),Rr=`
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
  `,cs=`
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
  `;class ps extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,w);s(this,ce,null);s(this,R,null);s(this,cr,null);s(this,Q,null);s(this,Et,null);s(this,k,null);s(this,j,null);s(this,hi,null);s(this,li,null);s(this,ft,0);s(this,Ct,4e3);s(this,mt,0);s(this,gt,!1);s(this,qe,!1);s(this,di,null);s(this,N,0);s(this,tt,2e3);s(this,Tt,6500);s(this,ci);s(this,pi,new Map);s(this,q,[]);n(this,ci,Yt(h(this,w,qn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_brightness!==!1&&i.includes("brightness"),a=r.show_color_temp!==!1&&i.includes("color_temp"),l=r.show_rgb!==!1&&i.includes("rgb_color"),d=e&&(o||a||l),u=[o,a,l].filter(Boolean).length,f=e&&u>1;n(this,tt,this.def.feature_config?.min_color_temp_kelvin??2e3),n(this,Tt,this.def.feature_config?.max_color_temp_kelvin??6500);const y=_t(st);this.root.innerHTML=`
        <style>${Rr}${cs}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${p(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          </div>
          <div part="card-body" class="${d?"":"hrv-no-dial"}">
            ${d?`
              <div class="hrv-dial-column">
                <div class="hrv-dial-wrap" role="slider" tabindex="0" aria-valuemin="0"
                  aria-valuemax="100" aria-valuenow="0"
                  aria-label="${p(this.def.friendly_name)} brightness"
                  title="Drag to adjust">
                  <svg viewBox="0 0 120 120">
                    <g class="hrv-dial-segs hrv-dial-segs-color">${ls}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${ds}</g>
                    <path class="hrv-dial-track" d="${ai}" />
                    <path class="hrv-dial-fill" d="${ai}"
                      stroke-dasharray="${Lt}"
                      stroke-dashoffset="${Lt}" />
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
                    aria-valuetext="${Mt[t(this,q)[0]]}">
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
      `,n(this,ce,this.root.querySelector("[part=toggle-button]")),n(this,R,this.root.querySelector(".hrv-dial-fill")),n(this,cr,this.root.querySelector(".hrv-dial-track")),n(this,Q,this.root.querySelector(".hrv-dial-thumb")),n(this,Et,this.root.querySelector(".hrv-dial-pct")),n(this,k,this.root.querySelector(".hrv-dial-wrap")),n(this,di,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,hi,this.root.querySelector(".hrv-dial-segs-color")),n(this,li,this.root.querySelector(".hrv-dial-segs-temp")),n(this,j,this.root.querySelector(".hrv-mode-switch"));const C=()=>{const m=this.config.gestureConfig?.tap;if(m){this._runAction(m);return}this.config.card?.sendCommand("toggle",{})};t(this,ce)&&(d||this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon"),this._attachGestureHandlers(t(this,ce),{onTap:C}));const M=this.root.querySelector("[part=row-toggle]");M&&this._attachGestureHandlers(M,{onTap:C}),t(this,k)&&(t(this,k).addEventListener("pointerdown",h(this,w,En).bind(this)),t(this,k).addEventListener("pointermove",h(this,w,Tn).bind(this)),t(this,k).addEventListener("pointerup",h(this,w,Gr).bind(this)),t(this,k).addEventListener("pointercancel",h(this,w,Gr).bind(this)),t(this,k).addEventListener("keydown",h(this,w,Hn).bind(this))),d&&h(this,w,An).call(this),t(this,j)&&(t(this,j).addEventListener("click",h(this,w,kn).bind(this)),t(this,j).addEventListener("keydown",h(this,w,Ln).bind(this)),t(this,j).addEventListener("mousemove",h(this,w,$n).bind(this))),h(this,w,Er).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(m=>{m.title=m.getAttribute("aria-label")??"Companion";const J=m.getAttribute("data-entity");if(J&&t(this,pi).has(J)){const Gt=t(this,pi).get(J);m.setAttribute("data-on",String(Gt==="on"))}})}applyState(e,i){if(n(this,gt,e==="on"),n(this,ft,i?.brightness??0),i?.color_temp_kelvin!==void 0?n(this,Ct,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&n(this,Ct,Math.round(1e6/i.color_temp)),i?.hs_color)n(this,mt,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[l,d,u]=i.rgb_color;n(this,mt,fs(l,d,u))}if(t(this,ce)&&(t(this,ce).setAttribute("aria-pressed",String(t(this,gt))),this.root.querySelector("[part=card-icon]"))){const d=t(this,gt)?"mdi:lightbulb":"mdi:lightbulb-outline",u=this.def.icon_state_map?.[e]??this.def.icon??d;this.renderIcon(this.resolveIcon(u,d),"card-icon")}const r=this.root.querySelector(".hrv-light-ro-circle");if(r){r.setAttribute("data-on",String(t(this,gt)));const l=t(this,gt)?"mdi:lightbulb":"mdi:lightbulb-outline",d=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??l;this.renderIcon(this.resolveIcon(d,l),"ro-state-icon");const u=i?.color_mode,f=u==="color_temp",y=u&&u!=="color_temp",C=this.root.querySelector('[data-attr="brightness"]');if(C){const J=Math.round(t(this,ft)/255*100);C.title=t(this,gt)?`Brightness: ${J}%`:"Brightness: off"}const M=this.root.querySelector('[data-attr="temp"]');M&&(M.title=`Color temperature: ${t(this,Ct)}K`,M.style.display=y?"none":"");const m=this.root.querySelector('[data-attr="color"]');if(m)if(m.style.display=f?"none":"",i?.rgb_color){const[J,Gt,Ee]=i.rgb_color;m.style.background=`rgb(${J},${Gt},${Ee})`,m.title=`Color: rgb(${J}, ${Gt}, ${Ee})`}else m.style.background=`hsl(${t(this,mt)}, 100%, 50%)`,m.title=`Color: hue ${t(this,mt)}°`}const o=this.root.querySelector("[part=row-toggle]");o&&(o.setAttribute("aria-pressed",String(t(this,gt))),o.disabled=e==="unavailable"||e==="unknown");const a=this.root.querySelector("[part=row-state]");a&&(a.textContent=nt(e)),h(this,w,Mr).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,gt)?"off":"on",attributes:{brightness:t(this,ft)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,r){t(this,pi).set(e,i),super.updateCompanionState(e,i,r)}}ce=new WeakMap,R=new WeakMap,cr=new WeakMap,Q=new WeakMap,Et=new WeakMap,k=new WeakMap,j=new WeakMap,hi=new WeakMap,li=new WeakMap,ft=new WeakMap,Ct=new WeakMap,mt=new WeakMap,gt=new WeakMap,qe=new WeakMap,di=new WeakMap,N=new WeakMap,tt=new WeakMap,Tt=new WeakMap,ci=new WeakMap,pi=new WeakMap,w=new WeakSet,Gs=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},q=new WeakMap,An=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];n(this,q,[]),i[0]&&t(this,q).push(0),i[1]&&t(this,q).push(1),i[2]&&t(this,q).push(2),t(this,q).length===0&&t(this,q).push(0),t(this,q).includes(t(this,N))||n(this,N,t(this,q)[0])},kn=function(e){const i=t(this,j).getBoundingClientRect(),r=e.clientY-i.top,o=i.height/3;let a;r<o?a=0:r<o*2?a=1:a=2,a=Math.min(a,t(this,q).length-1),n(this,N,t(this,q)[a]),t(this,j).setAttribute("data-pos",String(a)),t(this,j).setAttribute("aria-valuenow",String(a+1)),t(this,j).setAttribute("aria-valuetext",Mt[t(this,N)]),h(this,w,Er).call(this),h(this,w,Mr).call(this)},$n=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},r=t(this,j).getBoundingClientRect(),o=Math.min(Math.floor((e.clientY-r.top)/(r.height/t(this,q).length)),t(this,q).length-1),a=Mt[t(this,q)[Math.max(0,o)]];t(this,j).title=`Dial mode: ${i[a]??a}`},Ln=function(e){const i=t(this,q).indexOf(t(this,N));let r=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")r=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")r=Math.min(t(this,q).length-1,i+1);else return;e.preventDefault(),n(this,N,t(this,q)[r]),t(this,j).setAttribute("data-pos",String(r)),t(this,j).setAttribute("aria-valuenow",String(r+1)),t(this,j).setAttribute("aria-valuetext",Mt[t(this,N)]),h(this,w,Er).call(this),h(this,w,Mr).call(this)},Mr=function(){t(this,Q)&&(t(this,Q).style.transition="none"),t(this,R)&&(t(this,R).style.transition="none"),h(this,w,Mn).call(this),t(this,Q)?.getBoundingClientRect(),t(this,R)?.getBoundingClientRect(),t(this,Q)&&(t(this,Q).style.transition=""),t(this,R)&&(t(this,R).style.transition="")},Er=function(){if(!t(this,R))return;const e=Mt[t(this,N)],i=e==="color"||e==="temp";t(this,cr).style.display=i?"none":"",t(this,R).style.display=i?"none":"",t(this,hi)&&t(this,hi).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,li)&&t(this,li).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,R).setAttribute("stroke-dasharray",String(Lt));const r={brightness:"brightness",temp:"color temperature",color:"color"},o={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,k)?.setAttribute("aria-label",`${p(this.def.friendly_name)} ${r[e]}`),t(this,k)&&(t(this,k).title=o[e]),t(this,k)&&(t(this,k).setAttribute("aria-valuemin",e==="temp"?String(t(this,tt)):"0"),t(this,k).setAttribute("aria-valuemax",e==="temp"?String(t(this,Tt)):e==="color"?"360":"100"))},Mn=function(){const e=Mt[t(this,N)];if(e==="brightness"){const i=t(this,gt)?t(this,ft):0;h(this,w,or).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,Ct)-t(this,tt))/(t(this,Tt)-t(this,tt))*100);h(this,w,or).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,mt)/360*100);h(this,w,or).call(this,i)}},or=function(e){const i=Mt[t(this,N)],r=e/100*E,o=_t(st-r);if(t(this,Q)?.setAttribute("cx",String(o.x)),t(this,Q)?.setAttribute("cy",String(o.y)),t(this,di)?.setAttribute("cx",String(o.x)),t(this,di)?.setAttribute("cy",String(o.y)),i==="brightness"){const a=Lt*(1-e/100);t(this,R)?.setAttribute("stroke-dashoffset",String(a)),t(this,Et)&&(t(this,Et).textContent=e+"%"),t(this,k)?.setAttribute("aria-valuenow",String(e)),t(this,k)?.setAttribute("aria-valuetext",`${e}%`)}else if(i==="temp"){const a=Math.round(t(this,tt)+e/100*(t(this,Tt)-t(this,tt)));t(this,Et)&&(t(this,Et).textContent=a+"K"),t(this,k)?.setAttribute("aria-valuenow",String(a)),t(this,k)?.setAttribute("aria-valuetext",`${a} kelvin`)}else{const a=Math.round(e/100*360);t(this,Et)&&(t(this,Et).textContent=a+"°"),t(this,k)?.setAttribute("aria-valuenow",String(a)),t(this,k)?.setAttribute("aria-valuetext",`${a} degrees`)}},En=function(e){n(this,qe,!0),t(this,k)?.setPointerCapture(e.pointerId),h(this,w,Yr).call(this,e)},Tn=function(e){t(this,qe)&&h(this,w,Yr).call(this,e)},Gr=function(e){if(t(this,qe)){n(this,qe,!1);try{t(this,k)?.releasePointerCapture(e.pointerId)}catch{}t(this,ci).call(this)}},Hn=function(e){const i=Mt[t(this,N)];let r=Math.round(i==="brightness"?t(this,ft)/255*100:i==="temp"?(t(this,Ct)-t(this,tt))/(t(this,Tt)-t(this,tt))*100:t(this,mt)/360*100);if(e.key==="ArrowDown"||e.key==="ArrowLeft")r-=1;else if(e.key==="ArrowUp"||e.key==="ArrowRight")r+=1;else if(e.key==="PageDown")r-=10;else if(e.key==="PageUp")r+=10;else if(e.key==="Home")r=0;else if(e.key==="End")r=100;else return;e.preventDefault(),r=Math.max(0,Math.min(100,r)),i==="brightness"?n(this,ft,Math.round(r/100*255)):i==="temp"?n(this,Ct,Math.round(t(this,tt)+r/100*(t(this,Tt)-t(this,tt)))):n(this,mt,Math.round(r/100*360)),h(this,w,or).call(this,r),t(this,ci).call(this)},Yr=function(e){if(!t(this,k))return;const i=t(this,k).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let u=st-d;u<0&&(u+=360),u>E&&(u=u>E+(360-E)/2?0:E);const f=Math.round(u/E*100),y=Mt[t(this,N)];y==="brightness"?n(this,ft,Math.round(f/100*255)):y==="temp"?n(this,Ct,Math.round(t(this,tt)+f/100*(t(this,Tt)-t(this,tt)))):n(this,mt,Math.round(f/100*360)),t(this,R)&&(t(this,R).style.transition="none"),t(this,Q)&&(t(this,Q).style.transition="none"),h(this,w,or).call(this,f)},qn=function(){t(this,R)&&(t(this,R).style.transition=""),t(this,Q)&&(t(this,Q).style.transition="");const e=Mt[t(this,N)];e==="brightness"?t(this,ft)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,ft)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,Ct)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,mt),100]})};const us=Rr+`
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
  `;class vs extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,b);s(this,St,null);s(this,ot,null);s(this,Sr,null);s(this,et,null);s(this,ui,null);s(this,Z,null);s(this,Ht,null);s(this,qt,null);s(this,It,null);s(this,G,!1);s(this,T,0);s(this,pe,!1);s(this,Ut,"forward");s(this,it,null);s(this,I,[]);s(this,Ie,!1);s(this,vi,null);s(this,fi);n(this,fi,Yt(h(this,b,zn).bind(this),300)),n(this,I,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},o=r.display_mode??null;let a=i.includes("set_speed");const l=r.show_oscillate!==!1&&i.includes("oscillate"),d=r.show_direction!==!1&&i.includes("direction"),u=r.show_presets!==!1&&i.includes("preset_mode");o==="on-off"&&(a=!1);let f=e&&a,y=f&&t(this,b,br),C=y&&!t(this,I).length,M=y&&!!t(this,I).length;o==="continuous"?(y=!1,C=!1,M=!1):o==="stepped"?(M=!1,C=y&&!t(this,I).length):o==="cycle"&&(y=!0,M=!0,C=!1);const m=_t(st);this.root.innerHTML=`
        <style>${us}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${p(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          </div>
          <div part="card-body" class="${f?C?"hrv-fan-horiz":"":"hrv-no-dial"}">
            ${f?`
              <div class="hrv-dial-column">
                ${C?`
                  <div class="hrv-fan-hspeed-wrap">
                    <div class="hrv-fan-hspeed-switch" role="group"
                      aria-label="${p(this.def.friendly_name)} speed"
                      data-on="false">
                      <div class="hrv-fan-hspeed-thumb"></div>
                      ${t(this,b,Hr).map((g,S)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${g}" data-idx="${S}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${S+1} (${g}%)"
                          title="Speed ${S+1} (${g}%)"></div>
                      `).join("")}
                    </div>
                  </div>
                `:M?`
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
                      <path class="hrv-dial-track" d="${ai}" />
                      <path class="hrv-dial-fill" d="${ai}"
                        stroke-dasharray="${Lt}"
                        stroke-dashoffset="${Lt}" />
                      <circle class="hrv-dial-thumb" r="7"
                        cx="${m.x}" cy="${m.y}" />
                      <circle class="hrv-dial-thumb-hit" r="16"
                        cx="${m.x}" cy="${m.y}" />
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
      `,n(this,St,this.root.querySelector("[part=toggle-button]")),n(this,ot,this.root.querySelector(".hrv-dial-fill")),n(this,Sr,this.root.querySelector(".hrv-dial-track")),n(this,et,this.root.querySelector(".hrv-dial-thumb")),n(this,ui,this.root.querySelector(".hrv-dial-pct")),n(this,Z,this.root.querySelector(".hrv-dial-wrap")),n(this,vi,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,Ht,this.root.querySelector('[data-feat="oscillate"]')),n(this,qt,this.root.querySelector('[data-feat="direction"]')),n(this,It,this.root.querySelector('[data-feat="preset"]')),t(this,St)&&!f&&(this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"fan-onoff-icon"),t(this,St).setAttribute("data-animate",String(!!this.config.animate)));const J=()=>{const g=this.config.gestureConfig?.tap;if(g){this._runAction(g);return}this.config.card?.sendCommand("toggle",{})};this._attachGestureHandlers(t(this,St),{onTap:J});const Gt=this.root.querySelector("[part=row-toggle]");Gt&&this._attachGestureHandlers(Gt,{onTap:J}),t(this,Z)&&(t(this,Z).addEventListener("pointerdown",h(this,b,In).bind(this)),t(this,Z).addEventListener("pointermove",h(this,b,Dn).bind(this)),t(this,Z).addEventListener("pointerup",h(this,b,Jr).bind(this)),t(this,Z).addEventListener("pointercancel",h(this,b,Jr).bind(this)),t(this,Z).addEventListener("keydown",h(this,b,Pn).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const g=t(this,b,Hr);if(!g.length)return;let S;if(!t(this,G)||t(this,T)===0)S=g[0],n(this,G,!0),t(this,St)?.setAttribute("aria-pressed","true");else{const H=g.findIndex(oi=>oi>t(this,T));S=H===-1?g[0]:g[H]}n(this,T,S),h(this,b,Xr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:S})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(g=>{const S=()=>{const H=Number(g.getAttribute("data-pct"));t(this,G)||(n(this,G,!0),t(this,St)?.setAttribute("aria-pressed","true")),n(this,T,H),h(this,b,Kr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:H})};g.addEventListener("click",S),g.addEventListener("keydown",H=>{(H.key==="Enter"||H.key===" ")&&(H.preventDefault(),S())})}),t(this,Ht)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,pe)})}),t(this,qt)?.addEventListener("click",()=>{const g=t(this,Ut)==="forward"?"reverse":"forward";n(this,Ut,g),h(this,b,ar).call(this),this.config.card?.sendCommand("set_direction",{direction:g})}),t(this,It)?.addEventListener("click",()=>{if(t(this,I).length){if(t(this,b,Ur)){const g=t(this,it)??t(this,I)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:g});return}if(t(this,it)){const g=t(this,I).indexOf(t(this,it));if(g===-1||g===t(this,I).length-1){n(this,it,null),h(this,b,ar).call(this);const S=t(this,b,Tr),H=Math.floor(t(this,T)/S)*S||S;this.config.card?.sendCommand("set_percentage",{percentage:H})}else{const S=t(this,I)[g+1];n(this,it,S),h(this,b,ar).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:S})}}else{const g=t(this,I)[0];n(this,it,g),h(this,b,ar).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:g})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(g=>{g.title=g.getAttribute("aria-label")??"Companion"})}applyState(e,i){n(this,G,e==="on"),n(this,T,i?.percentage??0),n(this,pe,i?.oscillating??!1),n(this,Ut,i?.direction??"forward"),n(this,it,i?.preset_mode??null),i?.preset_modes?.length&&n(this,I,i.preset_modes),t(this,St)&&t(this,St).setAttribute("aria-pressed",String(t(this,G)));const r=this.root.querySelector(".hrv-fan-ro-circle");r&&r.setAttribute("data-on",String(t(this,G)));const o=this.root.querySelector("[part=row-toggle]");o&&(o.setAttribute("aria-pressed",String(t(this,G))),o.disabled=e==="unavailable"||e==="unknown");const a=this.root.querySelector("[part=row-state]");a&&(a.textContent=nt(e)),t(this,b,br)&&!t(this,I).length?h(this,b,Kr).call(this):t(this,b,br)?h(this,b,Xr).call(this):h(this,b,Bn).call(this),h(this,b,ar).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,T)>0?`, ${Math.round(t(this,T))}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,G)?"off":"on",attributes:{percentage:t(this,T)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,pe),direction:t(this,Ut),preset_mode:t(this,it),preset_modes:t(this,I)}}:null}}St=new WeakMap,ot=new WeakMap,Sr=new WeakMap,et=new WeakMap,ui=new WeakMap,Z=new WeakMap,Ht=new WeakMap,qt=new WeakMap,It=new WeakMap,G=new WeakMap,T=new WeakMap,pe=new WeakMap,Ut=new WeakMap,it=new WeakMap,I=new WeakMap,Ie=new WeakMap,vi=new WeakMap,fi=new WeakMap,b=new WeakSet,Tr=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},br=function(){return t(this,b,Tr)>1},Ur=function(){return t(this,b,br)&&t(this,I).length>0},Hr=function(){const e=t(this,b,Tr),i=[];for(let r=1;r*e<=100.001;r++)i.push(r*e);return i},Xr=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,G)));const i=t(this,G)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},Kr=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),r=t(this,b,Hr);let o=-1;if(t(this,G)&&t(this,T)>0){let a=1/0;r.forEach((l,d)=>{const u=Math.abs(l-t(this,T));u<a&&(a=u,o=d)})}e.setAttribute("data-on",String(o>=0)),i&&o>=0&&(i.style.left=`${2+o*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((a,l)=>{a.setAttribute("data-active",String(l===o))})},ar=function(){const e=t(this,b,Ur);if(t(this,Ht)){const i=e||t(this,pe),r=e?"Oscillate":`Oscillate: ${t(this,pe)?"on":"off"}`;t(this,Ht).setAttribute("data-on",String(i)),t(this,Ht).setAttribute("aria-pressed",String(i)),t(this,Ht).setAttribute("aria-label",r),t(this,Ht).title=r}if(t(this,qt)){const i=t(this,Ut)!=="reverse",r=`Direction: ${t(this,Ut)}`;t(this,qt).setAttribute("data-on",String(i)),t(this,qt).setAttribute("aria-pressed",String(i)),t(this,qt).setAttribute("aria-label",r),t(this,qt).title=r}if(t(this,It)){const i=e||!!t(this,it),r=e?t(this,it)??t(this,I)[0]??"Preset":t(this,it)?`Preset: ${t(this,it)}`:"Preset: none";t(this,It).setAttribute("data-on",String(i)),t(this,It).setAttribute("aria-pressed",String(i)),t(this,It).setAttribute("aria-label",r),t(this,It).title=r}},In=function(e){n(this,Ie,!0),t(this,Z)?.setPointerCapture(e.pointerId),h(this,b,Qr).call(this,e)},Dn=function(e){t(this,Ie)&&h(this,b,Qr).call(this,e)},Jr=function(e){if(t(this,Ie)){n(this,Ie,!1);try{t(this,Z)?.releasePointerCapture(e.pointerId)}catch{}t(this,fi).call(this)}},Pn=function(e){let i=t(this,T);if(e.key==="ArrowDown"||e.key==="ArrowLeft")i-=1;else if(e.key==="ArrowUp"||e.key==="ArrowRight")i+=1;else if(e.key==="PageDown")i-=10;else if(e.key==="PageUp")i+=10;else if(e.key==="Home")i=0;else if(e.key==="End")i=100;else return;e.preventDefault(),n(this,T,Math.max(0,Math.min(100,i))),h(this,b,qr).call(this,t(this,T)),t(this,fi).call(this)},Qr=function(e){if(!t(this,Z))return;const i=t(this,Z).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let u=st-d;u<0&&(u+=360),u>E&&(u=u>E+(360-E)/2?0:E),n(this,T,Math.round(u/E*100)),t(this,ot)&&(t(this,ot).style.transition="none"),t(this,et)&&(t(this,et).style.transition="none"),h(this,b,qr).call(this,t(this,T))},zn=function(){t(this,ot)&&(t(this,ot).style.transition=""),t(this,et)&&(t(this,et).style.transition=""),t(this,T)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,T)})},qr=function(e){const i=Lt*(1-e/100),r=_t(st-e/100*E);t(this,ot)?.setAttribute("stroke-dashoffset",String(i)),t(this,et)?.setAttribute("cx",String(r.x)),t(this,et)?.setAttribute("cy",String(r.y)),t(this,vi)?.setAttribute("cx",String(r.x)),t(this,vi)?.setAttribute("cy",String(r.y)),t(this,ui)&&(t(this,ui).textContent=`${e}%`),t(this,Z)?.setAttribute("aria-valuenow",String(e)),t(this,Z)?.setAttribute("aria-valuetext",`${e}%`)},Bn=function(){t(this,et)&&(t(this,et).style.transition="none"),t(this,ot)&&(t(this,ot).style.transition="none"),h(this,b,qr).call(this,t(this,G)?t(this,T):0),t(this,et)?.getBoundingClientRect(),t(this,ot)?.getBoundingClientRect(),t(this,et)&&(t(this,et).style.transition=""),t(this,ot)&&(t(this,ot).style.transition="")};function fs(c,v,e){c/=255,v/=255,e/=255;const i=Math.max(c,v,e),r=Math.min(c,v,e),o=i-r;if(o===0)return 0;let a;return i===c?a=(v-e)/o%6:i===v?a=(e-c)/o+2:a=(c-v)/o+4,Math.round((a*60+360)%360)}const ms=Rr+`
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
    .hrv-climate-ro-mode {
      display: block;
      text-align: center;
      font-size: 15px;
      color: var(--hrv-color-text, #fff);
      padding-top: 8px;
    }
  `;class gs extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,_);s(this,ct,null);s(this,Xt,null);s(this,Dt,null);s(this,mi,null);s(this,ue,!1);s(this,gi,null);s(this,bi,null);s(this,yi,null);s(this,at,null);s(this,ht,null);s(this,xi,null);s(this,wi,null);s(this,_i,null);s(this,Ci,null);s(this,Y,null);s(this,De,null);s(this,Pt,null);s(this,lt,null);s(this,bt,20);s(this,zt,"off");s(this,Si,null);s(this,Ai,null);s(this,ki,null);s(this,Bt,16);s(this,ve,32);s(this,Pe,.5);s(this,$i,"°C");s(this,Li,[]);s(this,Mi,[]);s(this,Ei,[]);s(this,Ti,[]);s(this,pr,{});s(this,Hi);n(this,Hi,Yt(h(this,_,Fn).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),o=i.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),a=i.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),l=i.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);n(this,Bt,this.def.feature_config?.min_temp??16),n(this,ve,this.def.feature_config?.max_temp??32),n(this,Pe,this.def.feature_config?.temp_step??.5),n(this,$i,this.def.unit_of_measurement??"°C"),n(this,Li,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),n(this,Mi,this.def.feature_config?.fan_modes??[]),n(this,Ei,this.def.feature_config?.preset_modes??[]),n(this,Ti,this.def.feature_config?.swing_modes??[]);const d=h(this,_,tn).call(this,t(this,bt)),u=_t(st),f=_t(st-d/100*E),y=Lt*(1-d/100),[C,M]=t(this,bt).toFixed(1).split(".");this.root.innerHTML=`
        <style>${ms}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e&&r?`
              <div class="hrv-dial-wrap">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path class="hrv-dial-track" d="${ai}"/>
                  <path class="hrv-dial-fill" d="${ai}"
                    stroke-dasharray="${Lt}" stroke-dashoffset="${y}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${p(C)}</span><span class="hrv-climate-temp-frac">.${p(M)}</span><span class="hrv-climate-temp-unit">${p(t(this,$i))}</span>
                  </div>
                </div>
              </div>
              <div class="hrv-climate-stepper">
                <button class="hrv-climate-step" type="button" aria-label="Decrease temperature" title="Decrease temperature" data-dir="-">&#8722;</button>
                <button class="hrv-climate-step" type="button" aria-label="Increase temperature" title="Increase temperature" data-dir="+">+</button>
              </div>
            `:e?"":`
              <div class="hrv-climate-ro-temp">
                <div class="hrv-climate-ro-temp-row">
                  <span class="hrv-climate-ro-temp-int">-</span><span class="hrv-climate-ro-temp-frac"></span><span class="hrv-climate-ro-temp-unit">${p(t(this,$i))}</span>
                </div>
                <span class="hrv-climate-ro-mode"></span>
              </div>
            `}
            ${e?`
            <div class="hrv-climate-grid">
              ${i.show_hvac_modes!==!1&&t(this,Li).length?`
                <button class="hrv-cf-btn" data-feat="mode" type="button" title="Change HVAC mode">
                  <span class="hrv-cf-label">Mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${a&&t(this,Ei).length?`
                <button class="hrv-cf-btn" data-feat="preset" type="button" title="Change preset mode">
                  <span class="hrv-cf-label">Preset</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${o&&t(this,Mi).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button" title="Change fan mode">
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${l&&t(this,Ti).length?`
                <button class="hrv-cf-btn" data-feat="swing" type="button" title="Change swing mode">
                  <span class="hrv-cf-label">Swing mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              <div class="hrv-climate-dropdown" role="listbox" popover="manual"></div>
            </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,ct,this.root.querySelector(".hrv-dial-wrap")),n(this,Xt,this.root.querySelector(".hrv-dial-fill")),n(this,Dt,this.root.querySelector(".hrv-dial-thumb")),n(this,mi,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,gi,this.root.querySelector(".hrv-climate-state-text")),n(this,bi,this.root.querySelector(".hrv-climate-temp-int")),n(this,yi,this.root.querySelector(".hrv-climate-temp-frac")),n(this,at,this.root.querySelector("[data-dir='-']")),n(this,ht,this.root.querySelector("[data-dir='+']")),n(this,xi,this.root.querySelector("[data-feat=mode]")),n(this,wi,this.root.querySelector("[data-feat=fan]")),n(this,_i,this.root.querySelector("[data-feat=preset]")),n(this,Ci,this.root.querySelector("[data-feat=swing]")),n(this,Y,this.root.querySelector(".hrv-climate-dropdown")),t(this,ct)&&(t(this,ct).addEventListener("pointerdown",h(this,_,On).bind(this)),t(this,ct).addEventListener("pointermove",h(this,_,Vn).bind(this)),t(this,ct).addEventListener("pointerup",h(this,_,nn).bind(this)),t(this,ct).addEventListener("pointercancel",h(this,_,nn).bind(this))),t(this,at)&&(t(this,at).addEventListener("click",()=>h(this,_,rn).call(this,-1)),t(this,at).addEventListener("pointerdown",()=>t(this,at).setAttribute("data-pressing","true")),t(this,at).addEventListener("pointerup",()=>t(this,at).removeAttribute("data-pressing")),t(this,at).addEventListener("pointerleave",()=>t(this,at).removeAttribute("data-pressing")),t(this,at).addEventListener("pointercancel",()=>t(this,at).removeAttribute("data-pressing"))),t(this,ht)&&(t(this,ht).addEventListener("click",()=>h(this,_,rn).call(this,1)),t(this,ht).addEventListener("pointerdown",()=>t(this,ht).setAttribute("data-pressing","true")),t(this,ht).addEventListener("pointerup",()=>t(this,ht).removeAttribute("data-pressing")),t(this,ht).addEventListener("pointerleave",()=>t(this,ht).removeAttribute("data-pressing")),t(this,ht).addEventListener("pointercancel",()=>t(this,ht).removeAttribute("data-pressing"))),e&&[t(this,xi),t(this,wi),t(this,_i),t(this,Ci)].forEach(m=>{if(!m)return;const J=m.getAttribute("data-feat");m.addEventListener("click",()=>h(this,_,jn).call(this,J)),m.addEventListener("pointerdown",()=>m.setAttribute("data-pressing","true")),m.addEventListener("pointerup",()=>m.removeAttribute("data-pressing")),m.addEventListener("pointerleave",()=>m.removeAttribute("data-pressing")),m.addEventListener("pointercancel",()=>m.removeAttribute("data-pressing"))}),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,pr,{...i}),n(this,zt,e),n(this,Si,i.fan_mode??null),n(this,Ai,i.preset_mode??null),n(this,ki,i.swing_mode??null),!t(this,ue)&&i.temperature!==void 0&&(n(this,bt,i.temperature),h(this,_,Ir).call(this)),t(this,gi)&&(t(this,gi).textContent=nt(i.hvac_action??e));const r=this.root.querySelector(".hrv-climate-ro-temp-int"),o=this.root.querySelector(".hrv-climate-ro-temp-frac");if(r){const u=i.current_temperature??i.temperature;if(u!=null){const[f,y]=Number(u).toFixed(1).split(".");r.textContent=f,o&&(o.textContent=`.${y}`)}}const a=this.root.querySelector(".hrv-climate-ro-mode");a&&(a.textContent=nt(i.hvac_action??e)),h(this,_,Wn).call(this);const l=i.hvac_action??e,d=nt(l);this.announceState(`${this.def.friendly_name}, ${d}`)}predictState(e,i){const r={...t(this,pr)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:r}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,zt),attributes:{...r,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,zt),attributes:{...r,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,zt),attributes:{...r,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,zt),attributes:{...r,swing_mode:i.swing_mode}}:null}destroy(){t(this,Pt)&&(document.removeEventListener("pointerdown",t(this,Pt),!0),n(this,Pt,null)),t(this,lt)&&(window.removeEventListener("scroll",t(this,lt),!0),window.removeEventListener("resize",t(this,lt)),n(this,lt,null));try{t(this,Y)?.hidePopover?.()}catch{}}}ct=new WeakMap,Xt=new WeakMap,Dt=new WeakMap,mi=new WeakMap,ue=new WeakMap,gi=new WeakMap,bi=new WeakMap,yi=new WeakMap,at=new WeakMap,ht=new WeakMap,xi=new WeakMap,wi=new WeakMap,_i=new WeakMap,Ci=new WeakMap,Y=new WeakMap,De=new WeakMap,Pt=new WeakMap,lt=new WeakMap,bt=new WeakMap,zt=new WeakMap,Si=new WeakMap,Ai=new WeakMap,ki=new WeakMap,Bt=new WeakMap,ve=new WeakMap,Pe=new WeakMap,$i=new WeakMap,Li=new WeakMap,Mi=new WeakMap,Ei=new WeakMap,Ti=new WeakMap,pr=new WeakMap,Hi=new WeakMap,_=new WeakSet,tn=function(e){return Math.max(0,Math.min(100,(e-t(this,Bt))/(t(this,ve)-t(this,Bt))*100))},Rn=function(e){const i=t(this,Bt)+e/100*(t(this,ve)-t(this,Bt)),r=Math.round(i/t(this,Pe))*t(this,Pe);return Math.max(t(this,Bt),Math.min(t(this,ve),+r.toFixed(10)))},jn=function(e){if(t(this,De)===e){h(this,_,yr).call(this);return}t(this,De)&&h(this,_,yr).call(this),n(this,De,e);let i=[],r=null,o="",a="";switch(e){case"mode":i=t(this,Li),r=t(this,zt),o="set_hvac_mode",a="hvac_mode";break;case"fan":i=t(this,Mi),r=t(this,Si),o="set_fan_mode",a="fan_mode";break;case"preset":i=t(this,Ei),r=t(this,Ai),o="set_preset_mode",a="preset_mode";break;case"swing":i=t(this,Ti),r=t(this,ki),o="set_swing_mode",a="swing_mode";break}if(!i.length||!t(this,Y))return;t(this,Y).innerHTML=i.map(u=>`
        <button class="hrv-cf-option" data-active="${u===r}" role="option"
          aria-selected="${u===r}" type="button">
          ${p(nt(u))}
        </button>
      `).join(""),t(this,Y).querySelectorAll(".hrv-cf-option").forEach((u,f)=>{u.addEventListener("click",()=>{this.config.card?.sendCommand(o,{[a]:i[f]}),h(this,_,yr).call(this)})});const l=this.root.querySelector(`[data-feat="${e}"]`);try{t(this,Y).showPopover?.()}catch{}h(this,_,en).call(this,l),n(this,lt,()=>h(this,_,en).call(this,l)),window.addEventListener("scroll",t(this,lt),!0),window.addEventListener("resize",t(this,lt));const d=u=>{u.composedPath().some(y=>y===this.root||y===this.root.host)||h(this,_,yr).call(this)};n(this,Pt,d),document.addEventListener("pointerdown",d,!0)},en=function(e){if(!t(this,Y)||!e)return;const i=e.getBoundingClientRect(),r=window.innerHeight-i.bottom,o=i.top,a=Math.min(t(this,Y).scrollHeight||280,280),l=Math.max(140,Math.round(i.width));t(this,Y).style.left=`${Math.round(i.left)}px`,t(this,Y).style.minWidth=`${l}px`,o>=a+8||o>r?t(this,Y).style.top=`${Math.max(8,Math.round(i.top-a-6))}px`:t(this,Y).style.top=`${Math.round(i.bottom+6)}px`},yr=function(){n(this,De,null);try{t(this,Y)?.hidePopover?.()}catch{}t(this,Pt)&&(document.removeEventListener("pointerdown",t(this,Pt),!0),n(this,Pt,null)),t(this,lt)&&(window.removeEventListener("scroll",t(this,lt),!0),window.removeEventListener("resize",t(this,lt)),n(this,lt,null))},rn=function(e){const i=Math.round((t(this,bt)+e*t(this,Pe))*100)/100;n(this,bt,Math.max(t(this,Bt),Math.min(t(this,ve),i))),h(this,_,Ir).call(this),t(this,Hi).call(this)},Ir=function(){const e=h(this,_,tn).call(this,t(this,bt)),i=Lt*(1-e/100),r=_t(st-e/100*E);t(this,Xt)?.setAttribute("stroke-dashoffset",String(i)),t(this,Dt)?.setAttribute("cx",String(r.x)),t(this,Dt)?.setAttribute("cy",String(r.y)),t(this,mi)?.setAttribute("cx",String(r.x)),t(this,mi)?.setAttribute("cy",String(r.y));const[o,a]=t(this,bt).toFixed(1).split(".");t(this,bi)&&(t(this,bi).textContent=o),t(this,yi)&&(t(this,yi).textContent=`.${a}`)},On=function(e){n(this,ue,!0),t(this,ct)?.setPointerCapture(e.pointerId),h(this,_,sn).call(this,e)},Vn=function(e){t(this,ue)&&h(this,_,sn).call(this,e)},nn=function(e){if(t(this,ue)){n(this,ue,!1);try{t(this,ct)?.releasePointerCapture(e.pointerId)}catch{}t(this,Xt)&&(t(this,Xt).style.transition=""),t(this,Dt)&&(t(this,Dt).style.transition="")}},sn=function(e){if(!t(this,ct))return;const i=t(this,ct).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let u=st-d;u<0&&(u+=360),u>E&&(u=u>E+(360-E)/2?0:E),n(this,bt,h(this,_,Rn).call(this,u/E*100)),t(this,Xt)&&(t(this,Xt).style.transition="none"),t(this,Dt)&&(t(this,Dt).style.transition="none"),h(this,_,Ir).call(this),t(this,Hi).call(this)},Fn=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,bt)})},Wn=function(){const e=(i,r)=>{if(!i)return;const o=i.querySelector(".hrv-cf-value");o&&(o.textContent=nt(r??"None"))};e(t(this,xi),t(this,zt)),e(t(this,wi),t(this,Si)),e(t(this,_i),t(this,Ai)),e(t(this,Ci),t(this,ki))};const bs=`
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
  `;class ys extends x{constructor(){super(...arguments);s(this,ze,null)}render(){this.root.innerHTML=`
        <style>${bs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
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
      `,n(this,ze,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"state-icon"),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=e==="on",o=this.formatStateLabel(e);t(this,ze)&&(t(this,ze).setAttribute("data-on",String(r)),t(this,ze).setAttribute("aria-label",`${this.def.friendly_name}: ${o}`));const a=this.root.querySelector("[part=row-value]");a&&(a.textContent=o);const l=r?"mdi:radiobox-marked":"mdi:radiobox-blank",d=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(d,l),"state-icon"),this.announceState(`${this.def.friendly_name}, ${o}`)}}ze=new WeakMap;const vn='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',fn='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',jr='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',xs=`
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
  `;class ws extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,Ot);s(this,Be,null);s(this,Rt,null);s(this,D,null);s(this,Re,null);s(this,je,null);s(this,Oe,null);s(this,yt,null);s(this,fe,null);s(this,Kt,!1);s(this,jt,0);s(this,qi,"closed");s(this,ur,{});s(this,vr);s(this,Ii);n(this,vr,Yt(h(this,Ot,Nn).bind(this),300)),n(this,Ii,Yt(h(this,Ot,Zn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=i.show_position!==!1&&this.def.supported_features?.includes("set_position"),o=i.show_tilt!==!1&&this.def.supported_features?.includes("set_tilt_position"),a=!this.def.supported_features||this.def.supported_features.includes("buttons");this.root.innerHTML=`
        <style>${xs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-state"></span></span>
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
                  title="Open cover" aria-label="Open cover">${vn}</button>
                <button class="hrv-cover-btn" data-action="stop" type="button"
                  title="Stop cover" aria-label="Stop cover">${fn}</button>
                <button class="hrv-cover-btn" data-action="close" type="button"
                  title="Close cover" aria-label="Close cover">${jr}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Be,this.root.querySelector(".hrv-cover-slider-track")),n(this,Rt,this.root.querySelector(".hrv-cover-slider-fill")),n(this,D,this.root.querySelector(".hrv-cover-slider-thumb")),n(this,Re,this.root.querySelector("[data-action=open]")),n(this,je,this.root.querySelector("[data-action=stop]")),n(this,Oe,this.root.querySelector("[data-action=close]")),n(this,yt,this.root.querySelector("[part=tilt-slider]")),n(this,fe,this.root.querySelector("[part=tilt-value]"));const l=this.root.querySelector("[part=cover-ro-icon]");if(l&&(l.innerHTML=jr),t(this,Be)&&t(this,D)&&e){const d=f=>{n(this,Kt,!0),t(this,D).style.transition="none",t(this,Rt).style.transition="none",h(this,Ot,Dr).call(this,f),t(this,D).setPointerCapture(f.pointerId)};t(this,D).addEventListener("pointerdown",d),t(this,Be).addEventListener("pointerdown",f=>{f.target!==t(this,D)&&(n(this,Kt,!0),t(this,D).style.transition="none",t(this,Rt).style.transition="none",h(this,Ot,Dr).call(this,f),t(this,D).setPointerCapture(f.pointerId))}),t(this,D).addEventListener("pointermove",f=>{t(this,Kt)&&h(this,Ot,Dr).call(this,f)});const u=()=>{t(this,Kt)&&(n(this,Kt,!1),t(this,D).style.transition="",t(this,Rt).style.transition="",t(this,vr).call(this))};t(this,D).addEventListener("pointerup",u),t(this,D).addEventListener("pointercancel",u)}t(this,yt)&&e&&(t(this,yt).addEventListener("input",()=>{t(this,fe)&&(t(this,fe).textContent=`${t(this,yt).value}%`),t(this,Ii).call(this)}),this.guardSlider(t(this,yt),t(this,Ii))),[t(this,Re),t(this,je),t(this,Oe)].forEach(d=>{if(!d)return;const u=d.getAttribute("data-action");d.addEventListener("click",()=>{this.config.card?.sendCommand(`${u}_cover`,{})}),d.addEventListener("pointerdown",()=>d.setAttribute("data-pressing","true")),d.addEventListener("pointerup",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointerleave",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointercancel",()=>d.removeAttribute("data-pressing"))}),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,qi,e),n(this,ur,{...i});const r=e==="opening"||e==="closing",o=i.current_position;t(this,Re)&&(t(this,Re).disabled=!r&&o===100),t(this,je)&&(t(this,je).disabled=!r),t(this,Oe)&&(t(this,Oe).disabled=!r&&e==="closed"),i.current_position!==void 0&&!t(this,Kt)&&(n(this,jt,i.current_position),t(this,Rt)&&(t(this,Rt).style.width=`${t(this,jt)}%`),t(this,D)&&(t(this,D).style.left=`${t(this,jt)}%`)),i.current_tilt_position!==void 0&&t(this,yt)&&!this.isSliderActive(t(this,yt))&&(t(this,yt).value=String(i.current_tilt_position),t(this,fe)&&(t(this,fe).textContent=`${i.current_tilt_position}%`));const a=this.root.querySelector("[part=cover-ro-icon]");if(a){const d=e==="open"||e==="opening",u=e==="opening"||e==="closing";a.innerHTML=u?fn:d?vn:jr}const l=this.root.querySelector("[part=row-state]");l&&(l.textContent=nt(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const r={...t(this,ur)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,qi),attributes:r}:e==="set_cover_position"&&i.position!==void 0?(r.current_position=i.position,{state:i.position>0?"open":"closed",attributes:r}):e==="set_cover_tilt_position"&&i.tilt_position!==void 0?(r.current_tilt_position=i.tilt_position,{state:t(this,qi),attributes:r}):null}}Be=new WeakMap,Rt=new WeakMap,D=new WeakMap,Re=new WeakMap,je=new WeakMap,Oe=new WeakMap,yt=new WeakMap,fe=new WeakMap,Kt=new WeakMap,jt=new WeakMap,qi=new WeakMap,ur=new WeakMap,vr=new WeakMap,Ii=new WeakMap,Ot=new WeakSet,Dr=function(e){const i=t(this,Be).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,jt,Math.round(r)),t(this,Rt).style.width=`${t(this,jt)}%`,t(this,D).style.left=`${t(this,jt)}%`},Nn=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,jt)})},Zn=function(){const e=parseInt(t(this,yt)?.value??0,10);this.config.card?.sendCommand("set_cover_tilt_position",{tilt_position:e})};const _s=`
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
  `;class mn extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,L);s(this,Ve,null);s(this,Jt,null);s(this,O,null);s(this,U,null);s(this,Di,null);s(this,me,null);s(this,ge,null);s(this,Qt,!1);s(this,V,0);s(this,pt,0);s(this,At,100);s(this,te,1);s(this,be);n(this,be,Yt(h(this,L,Un).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints?.display_mode??null)!=="buttons";n(this,pt,this.def.feature_config?.min??0),n(this,At,this.def.feature_config?.max??100),n(this,te,this.def.feature_config?.step??1);const o=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${_s}${W}</style>
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
                  min="${t(this,pt)}" max="${t(this,At)}" step="${t(this,te)}"
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
      `,n(this,Ve,this.root.querySelector(".hrv-num-slider-track")),n(this,Jt,this.root.querySelector(".hrv-num-slider-fill")),n(this,O,this.root.querySelector(".hrv-num-slider-thumb")),n(this,U,this.root.querySelector(".hrv-num-input")),n(this,Di,this.root.querySelector(".hrv-num-readonly-val")),n(this,me,this.root.querySelector("[part=dec-btn]")),n(this,ge,this.root.querySelector("[part=inc-btn]")),t(this,Ve)&&t(this,O)){const a=d=>{n(this,Qt,!0),t(this,O).style.transition="none",t(this,Jt).style.transition="none",h(this,L,Pr).call(this,d),t(this,O).setPointerCapture(d.pointerId)};t(this,O).addEventListener("pointerdown",a),t(this,Ve).addEventListener("pointerdown",d=>{d.target!==t(this,O)&&(n(this,Qt,!0),t(this,O).style.transition="none",t(this,Jt).style.transition="none",h(this,L,Pr).call(this,d),t(this,O).setPointerCapture(d.pointerId))}),t(this,O).addEventListener("pointermove",d=>{t(this,Qt)&&h(this,L,Pr).call(this,d)});const l=()=>{t(this,Qt)&&(n(this,Qt,!1),t(this,O).style.transition="",t(this,Jt).style.transition="",t(this,be).call(this))};t(this,O).addEventListener("pointerup",l),t(this,O).addEventListener("pointercancel",l)}t(this,U)&&t(this,U).addEventListener("input",()=>{const a=parseFloat(t(this,U).value);isNaN(a)||(n(this,V,Math.max(t(this,pt),Math.min(t(this,At),a))),h(this,L,hr).call(this),h(this,L,lr).call(this),t(this,be).call(this))}),t(this,me)&&t(this,me).addEventListener("click",()=>{n(this,V,+Math.max(t(this,pt),t(this,V)-t(this,te)).toFixed(10)),h(this,L,hr).call(this),t(this,U)&&(t(this,U).value=String(t(this,V))),h(this,L,lr).call(this),t(this,be).call(this)}),t(this,ge)&&t(this,ge).addEventListener("click",()=>{n(this,V,+Math.min(t(this,At),t(this,V)+t(this,te)).toFixed(10)),h(this,L,hr).call(this),t(this,U)&&(t(this,U).value=String(t(this,V))),h(this,L,lr).call(this),t(this,be).call(this)}),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=parseFloat(e);if(isNaN(r))return;n(this,V,r),t(this,Qt)||(h(this,L,hr).call(this),t(this,U)&&!this.isFocused(t(this,U))&&(t(this,U).value=String(r))),h(this,L,lr).call(this),t(this,Di)&&(t(this,Di).textContent=String(r));const o=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${o?` ${o}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}Ve=new WeakMap,Jt=new WeakMap,O=new WeakMap,U=new WeakMap,Di=new WeakMap,me=new WeakMap,ge=new WeakMap,Qt=new WeakMap,V=new WeakMap,pt=new WeakMap,At=new WeakMap,te=new WeakMap,be=new WeakMap,L=new WeakSet,Gn=function(e){const i=t(this,At)-t(this,pt);return i===0?0:Math.max(0,Math.min(100,(e-t(this,pt))/i*100))},Yn=function(e){const i=t(this,pt)+e/100*(t(this,At)-t(this,pt)),r=Math.round(i/t(this,te))*t(this,te);return Math.max(t(this,pt),Math.min(t(this,At),+r.toFixed(10)))},hr=function(){const e=h(this,L,Gn).call(this,t(this,V));t(this,Jt)&&(t(this,Jt).style.width=`${e}%`),t(this,O)&&(t(this,O).style.left=`${e}%`)},Pr=function(e){const i=t(this,Ve).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,V,h(this,L,Yn).call(this,r)),h(this,L,hr).call(this),t(this,U)&&(t(this,U).value=String(t(this,V))),h(this,L,lr).call(this)},Un=function(){this.config.card?.sendCommand("set_value",{value:t(this,V)})},lr=function(){t(this,me)&&(t(this,me).disabled=t(this,V)<=t(this,pt)),t(this,ge)&&(t(this,ge).disabled=t(this,V)>=t(this,At))};const Cs=`
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
  `;class gn extends x{constructor(){super(...arguments);s(this,P);s(this,rt,null);s(this,F,null);s(this,Fe,null);s(this,Ar,"");s(this,ye,[]);s(this,Pi,"");s(this,ee,!1);s(this,We,[]);s(this,ie,[]);s(this,xe,"pills");s(this,we,null);s(this,dt,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";n(this,xe,i==="dropdown"?"dropdown":"pills"),n(this,ye,this.def.feature_config?.options??[]);const r=e?t(this,xe)==="dropdown"?`
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
        <style>${Cs}${W}</style>
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
      `,n(this,rt,this.root.querySelector(".hrv-is-selected")),n(this,F,this.root.querySelector(".hrv-is-dropdown")),n(this,Fe,this.root.querySelector(".hrv-is-grid")),n(this,We,[]),n(this,ie,[]),n(this,Pi,""),t(this,rt)&&e&&t(this,xe)==="dropdown"&&(t(this,rt).addEventListener("click",o=>{o.stopPropagation(),t(this,ee)?h(this,P,dr).call(this):h(this,P,an).call(this)}),t(this,rt).addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" "||o.key==="ArrowDown")&&!t(this,ee)?(o.preventDefault(),h(this,P,an).call(this),t(this,ie)[0]?.focus()):o.key==="Escape"&&t(this,ee)&&(h(this,P,dr).call(this),t(this,rt).focus())}),n(this,we,o=>{t(this,ee)&&!this.root.host.contains(o.target)&&h(this,P,dr).call(this)}),document.addEventListener("click",t(this,we))),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Ar,e);const r=i?.options,o=Array.isArray(r)&&r.length?r:t(this,ye);n(this,ye,o);const a=o.join("|");if(a!==t(this,Pi)&&(n(this,Pi,a),t(this,xe)==="dropdown"?h(this,P,Kn).call(this,o):h(this,P,Xn).call(this,o)),t(this,xe)==="dropdown"){const l=this.root.querySelector(".hrv-is-label");l&&(l.textContent=e);for(const d of t(this,ie))d.setAttribute("data-active",String(d.dataset.option===e))}else{for(const d of t(this,We))d.setAttribute("data-active",String(d.dataset.option===e));const l=this.root.querySelector(".hrv-is-label");l&&(l.textContent=e)}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{options:t(this,ye)}}:null}destroy(){t(this,we)&&(document.removeEventListener("click",t(this,we)),n(this,we,null)),t(this,dt)&&(window.removeEventListener("scroll",t(this,dt),!0),window.removeEventListener("resize",t(this,dt)),n(this,dt,null));try{t(this,F)?.hidePopover?.()}catch{}}}rt=new WeakMap,F=new WeakMap,Fe=new WeakMap,Ar=new WeakMap,ye=new WeakMap,Pi=new WeakMap,ee=new WeakMap,We=new WeakMap,ie=new WeakMap,xe=new WeakMap,we=new WeakMap,dt=new WeakMap,P=new WeakSet,Xn=function(e){if(t(this,Fe)){t(this,Fe).innerHTML="",n(this,We,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-pill",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i})}),t(this,Fe).appendChild(r),t(this,We).push(r)}}},Kn=function(e){if(t(this,F)){t(this,F).innerHTML="",n(this,ie,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-option",r.role="option",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i}),h(this,P,dr).call(this),t(this,rt)?.focus()}),r.addEventListener("keydown",o=>{const a=t(this,ie),l=a.indexOf(r);o.key==="ArrowDown"?(o.preventDefault(),a[Math.min(l+1,a.length-1)]?.focus()):o.key==="ArrowUp"?(o.preventDefault(),l===0?t(this,rt)?.focus():a[l-1]?.focus()):o.key==="Escape"&&(h(this,P,dr).call(this),t(this,rt)?.focus())}),t(this,F).appendChild(r),t(this,ie).push(r)}}},on=function(){if(!t(this,F)||!t(this,rt))return;const e=t(this,rt).getBoundingClientRect(),i=window.innerHeight-e.bottom,r=e.top,o=Math.min(t(this,F).scrollHeight||280,280);t(this,F).style.left=`${Math.round(e.left)}px`,t(this,F).style.width=`${Math.round(e.width)}px`,i<o+8&&r>i?t(this,F).style.top=`${Math.max(8,Math.round(e.top-o-6))}px`:t(this,F).style.top=`${Math.round(e.bottom+6)}px`},an=function(){if(!(!t(this,F)||!t(this,ye).length)){try{t(this,F).showPopover?.()}catch{}t(this,rt)?.setAttribute("aria-expanded","true"),h(this,P,on).call(this),n(this,dt,()=>h(this,P,on).call(this)),window.addEventListener("scroll",t(this,dt),!0),window.addEventListener("resize",t(this,dt)),n(this,ee,!0)}},dr=function(){try{t(this,F)?.hidePopover?.()}catch{}t(this,rt)?.setAttribute("aria-expanded","false"),t(this,dt)&&(window.removeEventListener("scroll",t(this,dt),!0),window.removeEventListener("resize",t(this,dt)),n(this,dt,null)),n(this,ee,!1)};const Ss=`
    [part=card-body] {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: var(--hrv-spacing-s, 8px) var(--hrv-spacing-m, 16px) var(--hrv-spacing-m, 16px);
    }

    .hrv-mp-hero {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .hrv-mp-art {
      position: relative;
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;
      background: var(--hrv-ex-glass-bg, rgba(255,255,255,0.15));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.6));
    }
    .hrv-mp-art-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .hrv-mp-art[data-has-art=true] .hrv-mp-art-icon { display: none; }
    .hrv-mp-art[data-has-art=false] .hrv-mp-art-img { display: none; }
    .hrv-mp-art-icon svg { width: 24px; height: 24px; display: block; }

    .hrv-mp-info {
      flex: 1;
      min-width: 0;
      text-align: left;
      min-height: 32px;
    }
    .hrv-mp-artist {
      font-size: 11px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.6));
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hrv-mp-source {
      font-size: 11px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.6));
      opacity: 0.75;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hrv-mp-source:empty { display: none; }
    .hrv-mp-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--hrv-color-text, #fff);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .hrv-mp-seek {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hrv-mp-seek[hidden] { display: none; }
    .hrv-mp-seek .hrv-mp-slider-wrap { flex: 1; }
    .hrv-mp-time {
      font-size: 11px;
      color: var(--hrv-color-text-secondary, rgba(255,255,255,0.6));
      min-width: 32px;
      text-align: center;
      font-variant-numeric: tabular-nums;
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
  `;class As extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,K);s(this,re,null);s(this,zi,null);s(this,Bi,null);s(this,Ne,null);s(this,Ze,null);s(this,Vt,null);s(this,z,null);s(this,Ge,null);s(this,Ye,null);s(this,ne,null);s(this,Ri,"");s(this,ji,null);s(this,Ue,null);s(this,se,null);s(this,X,null);s(this,_e,null);s(this,Oi,null);s(this,Xe,null);s(this,Vi,0);s(this,Ke,!1);s(this,Je,0);s(this,Qe,!1);s(this,Ft,0);s(this,oe,!1);s(this,Ce,"idle");s(this,Se,{});s(this,fr);n(this,fr,this.debounce(h(this,K,Jn).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_transport!==!1,a=i.includes("play_pause"),l=i.includes("previous_track"),d=i.includes("next_track"),u=r.show_volume!==!1&&i.includes("volume_set"),f=r.show_volume!==!1&&i.includes("volume_mute"),y=u||f;if(this.root.innerHTML=`
        <style>${Ss}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-mp-hero">
              <div class="hrv-mp-art" part="media-art" data-has-art="false">
                <img class="hrv-mp-art-img" part="media-art-img" alt="">
                <span class="hrv-mp-art-icon" part="media-art-icon" aria-hidden="true"></span>
              </div>
              <div class="hrv-mp-info">
                <div class="hrv-mp-title" title="Title"></div>
                <div class="hrv-mp-artist" title="Artist"></div>
                <div class="hrv-mp-source" title="Source"></div>
              </div>
            </div>
            <div class="hrv-mp-seek" part="progress-row" hidden>
              <span class="hrv-mp-time" part="progress-elapsed">0:00</span>
              <div class="hrv-mp-slider-wrap">
                <div class="hrv-mp-slider-track" ${e?"":'data-readonly="true"'}>
                  <div class="hrv-mp-slider-fill hrv-mp-seek-fill" style="width:0%"></div>
                  <div class="hrv-mp-slider-thumb hrv-mp-seek-thumb" style="left:0%"></div>
                </div>
              </div>
              <span class="hrv-mp-time" part="progress-duration">0:00</span>
            </div>
            ${e&&o&&(a||l||d)?`
              <div class="hrv-mp-controls">
                ${l?`
                  <button class="hrv-mp-btn" data-role="prev" type="button"
                    title="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                ${a?`<button class="hrv-mp-btn" data-role="play" type="button"
                  title="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>`:""}
                ${d?`
                  <button class="hrv-mp-btn" data-role="next" type="button"
                    title="Next track">
                    <span part="next-icon" aria-hidden="true"></span>
                  </button>
                `:""}
              </div>
            `:""}
            ${e&&y?`
              <div class="hrv-mp-volume" title="Volume">
                ${f?`<button class="hrv-mp-mute" type="button" title="Mute">
                  <span part="mute-icon" aria-hidden="true"></span>
                </button>`:""}
                ${u?`<div class="hrv-mp-slider-wrap">
                  <div class="hrv-mp-slider-track">
                    <div class="hrv-mp-slider-fill" style="width:0%"></div>
                    <div class="hrv-mp-slider-thumb" style="left:0%"></div>
                  </div>
                </div>`:""}
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,re,this.root.querySelector("[data-role=play]")),n(this,zi,this.root.querySelector("[data-role=prev]")),n(this,Bi,this.root.querySelector("[data-role=next]")),n(this,Ne,this.root.querySelector(".hrv-mp-mute")),n(this,Ze,this.root.querySelector(".hrv-mp-volume .hrv-mp-slider-track")),n(this,Vt,this.root.querySelector(".hrv-mp-volume .hrv-mp-slider-fill")),n(this,z,this.root.querySelector(".hrv-mp-volume .hrv-mp-slider-thumb")),n(this,Ge,this.root.querySelector(".hrv-mp-artist")),n(this,Ye,this.root.querySelector(".hrv-mp-title")),n(this,Xe,this.root.querySelector(".hrv-mp-source")),n(this,ne,this.root.querySelector(".hrv-mp-art")),n(this,ji,this.root.querySelector("[part=progress-row]")),n(this,Ue,this.root.querySelector(".hrv-mp-seek .hrv-mp-slider-track")),n(this,se,this.root.querySelector(".hrv-mp-seek-fill")),n(this,X,this.root.querySelector(".hrv-mp-seek-thumb")),n(this,_e,this.root.querySelector("[part=progress-elapsed]")),n(this,Oi,this.root.querySelector("[part=progress-duration]")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),this.renderIcon("mdi:cast","media-art-icon"),e){if(t(this,re)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,zi)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Bi)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,re),t(this,zi),t(this,Bi)].forEach(C=>{C&&(C.addEventListener("pointerdown",()=>C.setAttribute("data-pressing","true")),C.addEventListener("pointerup",()=>C.removeAttribute("data-pressing")),C.addEventListener("pointerleave",()=>C.removeAttribute("data-pressing")),C.addEventListener("pointercancel",()=>C.removeAttribute("data-pressing")))}),t(this,Ne)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,Qe)})),t(this,Ze)&&t(this,z)){const C=m=>{n(this,oe,!0),t(this,z).style.transition="none",t(this,Vt).style.transition="none",h(this,K,zr).call(this,m),t(this,z).setPointerCapture(m.pointerId)};t(this,z).addEventListener("pointerdown",C),t(this,Ze).addEventListener("pointerdown",m=>{m.target!==t(this,z)&&(n(this,oe,!0),t(this,z).style.transition="none",t(this,Vt).style.transition="none",h(this,K,zr).call(this,m),t(this,z).setPointerCapture(m.pointerId))}),t(this,z).addEventListener("pointermove",m=>{t(this,oe)&&h(this,K,zr).call(this,m)});const M=()=>{t(this,oe)&&(n(this,oe,!1),t(this,z).style.transition="",t(this,Vt).style.transition="",t(this,fr).call(this))};t(this,z).addEventListener("pointerup",M),t(this,z).addEventListener("pointercancel",M)}if(t(this,Ue)&&t(this,X)){const C=m=>{n(this,Ke,!0),this.beginMediaSeek(),t(this,X).style.transition="none",t(this,se).style.transition="none",h(this,K,hn).call(this,m),t(this,X).setPointerCapture(m.pointerId)};t(this,X).addEventListener("pointerdown",C),t(this,Ue).addEventListener("pointerdown",m=>{m.target!==t(this,X)&&C(m)}),t(this,X).addEventListener("pointermove",m=>{t(this,Ke)&&h(this,K,hn).call(this,m)});const M=()=>{t(this,Ke)&&(n(this,Ke,!1),this.endMediaSeek(),t(this,X).style.transition="",t(this,se).style.transition="",this.config.card?.sendCommand("media_seek",{seek_position:t(this,Je)*t(this,Vi)}))};t(this,X).addEventListener("pointerup",M),t(this,X).addEventListener("pointercancel",M)}}this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}destroy(){this.stopMediaTicker()}applyState(e,i){n(this,Ce,e),n(this,Se,i);const r=e==="playing",o=e==="paused";if(t(this,Ge)){const l=i.media_artist??"";t(this,Ge).textContent=l,t(this,Ge).title=l||"Artist"}if(t(this,Ye)){const l=i.media_title??"";t(this,Ye).textContent=l,t(this,Ye).title=l||"Title"}if(t(this,Xe)){const l=this.mediaSourceText(i);t(this,Xe).textContent=l,t(this,Xe).title=l||"Source"}if(h(this,K,Qn).call(this,i.entity_picture),h(this,K,ln).call(this),r&&this.mediaProgress(i,!0)?this.startMediaTicker(()=>h(this,K,ln).call(this)):this.stopMediaTicker(),t(this,re)){t(this,re).setAttribute("data-playing",String(r));const l=r?"mdi:pause":"mdi:play";this.renderIcon(l,"play-icon"),this.def.capabilities==="read-write"&&(t(this,re).title=r?"Pause":"Play")}if(n(this,Qe,!!i.is_volume_muted),t(this,Ne)){const l=t(this,Qe)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(l,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,Ne).title=t(this,Qe)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,oe)&&(n(this,Ft,Math.round(i.volume_level*100)),t(this,Vt)&&(t(this,Vt).style.width=`${t(this,Ft)}%`),t(this,z)&&(t(this,z).style.left=`${t(this,Ft)}%`));const a=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${a?` - ${a}`:""}`)}predictState(e,i){return e==="media_play_pause"?{state:t(this,Ce)==="playing"?"paused":"playing",attributes:t(this,Se)}:e==="volume_mute"?{state:t(this,Ce),attributes:{...t(this,Se),is_volume_muted:!!i.is_volume_muted}}:e==="volume_set"?{state:t(this,Ce),attributes:{...t(this,Se),volume_level:i.volume_level}}:null}}re=new WeakMap,zi=new WeakMap,Bi=new WeakMap,Ne=new WeakMap,Ze=new WeakMap,Vt=new WeakMap,z=new WeakMap,Ge=new WeakMap,Ye=new WeakMap,ne=new WeakMap,Ri=new WeakMap,ji=new WeakMap,Ue=new WeakMap,se=new WeakMap,X=new WeakMap,_e=new WeakMap,Oi=new WeakMap,Xe=new WeakMap,Vi=new WeakMap,Ke=new WeakMap,Je=new WeakMap,Qe=new WeakMap,Ft=new WeakMap,oe=new WeakMap,Ce=new WeakMap,Se=new WeakMap,fr=new WeakMap,K=new WeakSet,zr=function(e){const i=t(this,Ze).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,Ft,Math.round(r)),t(this,Vt).style.width=`${t(this,Ft)}%`,t(this,z).style.left=`${t(this,Ft)}%`},hn=function(e){const i=t(this,Ue).getBoundingClientRect();n(this,Je,Math.max(0,Math.min(1,(e.clientX-i.left)/i.width)));const r=t(this,Je)*100;t(this,se).style.width=`${r}%`,t(this,X).style.left=`${r}%`,t(this,_e)&&(t(this,_e).textContent=this.formatMediaTime(t(this,Je)*t(this,Vi)))},ln=function(){const e=this.mediaProgress(t(this,Se),t(this,Ce)==="playing");if(t(this,ji)&&(t(this,ji).hidden=!e),!e||(n(this,Vi,e.duration),t(this,Oi)&&(t(this,Oi).textContent=this.formatMediaTime(e.duration)),this.isMediaSeekActive()))return;const i=e.fraction*100;t(this,se)&&(t(this,se).style.width=`${i}%`),t(this,X)&&(t(this,X).style.left=`${i}%`),t(this,_e)&&(t(this,_e).textContent=this.formatMediaTime(e.elapsed))},Jn=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,Ft)/100})},Qn=function(e){if(!t(this,ne))return;const i=this.resolveAssetUrl(e);if(i===t(this,Ri))return;n(this,Ri,i);const r=t(this,ne).querySelector(".hrv-mp-art-img");i&&r?(r.onerror=()=>{n(this,Ri,""),t(this,ne).setAttribute("data-has-art","false")},r.src=i,t(this,ne).setAttribute("data-has-art","true")):(r&&r.removeAttribute("src"),t(this,ne).setAttribute("data-has-art","false"))};const ks=`
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
  `;class $s extends x{constructor(){super(...arguments);s(this,Fi,null);s(this,mr,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${ks}${W}</style>
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
      `,n(this,Fi,this.root.querySelector(".hrv-remote-circle"));const i=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(i,"remote-icon"),t(this,Fi)&&e&&this._attachGestureHandlers(t(this,Fi),{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand(t(this,mr)?"turn_off":"turn_on",{})}}),this.renderCompanions(),B(this.root)}applyState(e,i){n(this,mr,e==="on");const r=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(r,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Fi=new WeakMap,mr=new WeakMap;const Ls=`
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
  `;class _r extends x{constructor(){super(...arguments);s(this,Wi,null);s(this,Ni,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${Ls}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
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
      `,n(this,Wi,this.root.querySelector(".hrv-sensor-val")),n(this,Ni,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){t(this,Wi)&&(t(this,Wi).textContent=e),t(this,Ni)&&i.unit_of_measurement!==void 0&&(t(this,Ni).textContent=i.unit_of_measurement);const r=i.unit_of_measurement??this.def.unit_of_measurement??"",o=this.root.querySelector("[part=card-body]");o&&(o.title=`${e}${r?` ${r}`:""}`);const a=this.root.querySelector("[part=row-value]");a&&(a.textContent=`${e}${r?` ${r}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${r?` ${r}`:""}`)}}Wi=new WeakMap,Ni=new WeakMap;const Ms=`
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
  `;class bn extends x{constructor(){super(...arguments);s(this,Wt,null);s(this,Zi,null);s(this,Ae,!1)}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${Ms}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${p(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
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
      `,n(this,Wt,this.root.querySelector(".hrv-switch-track")),n(this,Zi,this.root.querySelector(".hrv-switch-ro")),e){const i=()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand("toggle",{})};t(this,Wt)&&this._attachGestureHandlers(t(this,Wt),{onTap:i});const r=this.root.querySelector("[part=row-toggle]");r&&this._attachGestureHandlers(r,{onTap:i})}this.renderCompanions(),B(this.root)}applyState(e,i){n(this,Ae,e==="on");const r=e==="unavailable"||e==="unknown";t(this,Wt)&&(t(this,Wt).setAttribute("data-on",String(t(this,Ae))),t(this,Wt).title=t(this,Ae)?"On - click to turn off":"Off - click to turn on",t(this,Wt).disabled=r),t(this,Zi)&&(t(this,Zi).textContent=nt(e));const o=this.root.querySelector("[part=row-toggle]");o&&(o.setAttribute("aria-pressed",String(t(this,Ae))),o.disabled=r);const a=this.root.querySelector("[part=row-state]");a&&(a.textContent=nt(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,Ae)?"off":"on",attributes:{}}}}Wt=new WeakMap,Zi=new WeakMap,Ae=new WeakMap;const Es=`
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
  `;function Cr(c){c<0&&(c=0);const v=Math.floor(c/3600),e=Math.floor(c%3600/60),i=Math.floor(c%60),r=o=>String(o).padStart(2,"0");return v>0?`${v}:${r(e)}:${r(i)}`:`${r(e)}:${r(i)}`}function yn(c){if(typeof c=="number")return c;if(typeof c!="string")return 0;const v=c.split(":").map(Number);return v.length===3?v[0]*3600+v[1]*60+v[2]:v.length===2?v[0]*60+v[1]:v[0]||0}class Ts extends x{constructor(){super(...arguments);s(this,ut);s(this,xt,null);s(this,ae,null);s(this,ke,null);s(this,$e,null);s(this,ti,null);s(this,Gi,"idle");s(this,Yi,{});s(this,kt,null);s(this,Ui,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Es}${W}</style>
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
      `,n(this,xt,this.root.querySelector(".hrv-timer-display")),n(this,ae,this.root.querySelector("[data-action=playpause]")),n(this,ke,this.root.querySelector("[data-action=cancel]")),n(this,$e,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,ae)?.addEventListener("click",()=>{const i=t(this,Gi)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,ke)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,$e)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,ae),t(this,ke),t(this,$e)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Gi,e),n(this,Yi,{...i}),n(this,kt,i.finishes_at??null),n(this,Ui,i.remaining!=null?yn(i.remaining):null),h(this,ut,ts).call(this,e),h(this,ut,es).call(this,e),e==="active"&&t(this,kt)?h(this,ut,is).call(this):h(this,ut,xr).call(this),t(this,xt)&&t(this,xt).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const r={...t(this,Yi)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,kt)&&(r.remaining=Math.max(0,(new Date(t(this,kt)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}xt=new WeakMap,ae=new WeakMap,ke=new WeakMap,$e=new WeakMap,ti=new WeakMap,Gi=new WeakMap,Yi=new WeakMap,kt=new WeakMap,Ui=new WeakMap,ut=new WeakSet,ts=function(e){const i=e==="idle",r=e==="active";if(t(this,ae)){const o=r?"mdi:pause":"mdi:play",a=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(o,"playpause-icon"),t(this,ae).title=a,t(this,ae).setAttribute("aria-label",`${this.def.friendly_name} - ${a}`)}t(this,ke)&&(t(this,ke).disabled=i),t(this,$e)&&(t(this,$e).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},es=function(e){if(t(this,xt)){if(e==="idle"){const i=t(this,Yi).duration;t(this,xt).textContent=i?Cr(yn(i)):"00:00";return}if(e==="paused"&&t(this,Ui)!=null){t(this,xt).textContent=Cr(t(this,Ui));return}if(e==="active"&&t(this,kt)){const i=Math.max(0,(new Date(t(this,kt)).getTime()-Date.now())/1e3);t(this,xt).textContent=Cr(i)}}},is=function(){h(this,ut,xr).call(this),n(this,ti,setInterval(()=>{if(!t(this,kt)||t(this,Gi)!=="active"){h(this,ut,xr).call(this);return}const e=Math.max(0,(new Date(t(this,kt)).getTime()-Date.now())/1e3);t(this,xt)&&(t(this,xt).textContent=Cr(e)),e<=0&&h(this,ut,xr).call(this)},1e3))},xr=function(){t(this,ti)&&(clearInterval(t(this,ti)),n(this,ti,null))};const Hs=`
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
  `;class xn extends x{constructor(){super(...arguments);s(this,Xi,null);s(this,Nt,null);s(this,ei,!1);s(this,ii,!1)}render(){const e=this.def.capabilities==="read-write";n(this,ii,!1),this.root.innerHTML=`
        <style>${Hs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
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
      `,n(this,Xi,this.root.querySelector(".hrv-generic-state")),n(this,Nt,this.root.querySelector(".hrv-generic-toggle")),t(this,Nt)&&e&&this._attachGestureHandlers(t(this,Nt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),B(this.root)}applyState(e,i){const r=e==="on"||e==="off";n(this,ei,e==="on"),t(this,Xi)&&(t(this,Xi).textContent=nt(e)),t(this,Nt)&&(r&&!t(this,ii)&&(t(this,Nt).removeAttribute("hidden"),n(this,ii,!0)),t(this,ii)&&(t(this,Nt).setAttribute("data-on",String(t(this,ei))),t(this,Nt).title=t(this,ei)?"On - click to turn off":"Off - click to turn on"));const o=this.root.querySelector("[part=row-value]");o&&(o.textContent=nt(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,ei)?"off":"on",attributes:{}}}}Xi=new WeakMap,Nt=new WeakMap,ei=new WeakMap,ii=new WeakMap;const wn={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",pouring:"M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z","snowy-rainy":"M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z",hail:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z","lightning-rainy":"M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z","windy-variant":"M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},qs=wn.cloudy,Is="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,1A1,1 0 0,1 13,2L13,2.01C13,2.01 14.35,3.56 15.72,5.55C17.09,7.54 18.5,9.93 18.5,12.5A6.5,6.5 0 0,1 12,19A6.5,6.5 0 0,1 5.5,12.5C5.5,9.93 6.91,7.54 8.28,5.55C9.65,3.56 11,2.01 11,2.01L11,2A1,1 0 0,1 12,1Z",Ds="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",Ps="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",zs=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Or(c,v){const e=wn[c]??qs;return`<svg viewBox="0 0 24 24" width="${v}" height="${v}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Vr(c){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${c}" fill="currentColor"/></svg>`}const Bs=`
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
  `;class Rs extends x{constructor(){super(...arguments);s(this,$);s(this,Ki,null);s(this,ri,null);s(this,Ji,null);s(this,Qi,null);s(this,tr,null);s(this,er,null);s(this,vt,null);s(this,Zt,null);s(this,wt,null);s(this,ir,null);s(this,rr,null);s(this,ni,null);s(this,si,null)}render(){this.root.innerHTML=`
        <style>${Bs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-weather-main">
              <span class="hrv-weather-icon">${Or("cloudy",44)}</span>
              <span class="hrv-weather-temp">--<span class="hrv-weather-unit"></span></span>
            </div>
            <span class="hrv-weather-cond" aria-live="polite">--</span>
            <div class="hrv-weather-stats">
              <span class="hrv-weather-stat" data-stat="humidity">
                ${Vr(Is)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="wind">
                ${Vr(Ds)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="pressure">
                ${Vr(Ps)}
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
      `,n(this,Ki,this.root.querySelector(".hrv-weather-icon")),n(this,ri,this.root.querySelector(".hrv-weather-temp")),n(this,Ji,this.root.querySelector(".hrv-weather-cond")),n(this,Qi,this.root.querySelector("[data-stat=humidity] [data-value]")),n(this,tr,this.root.querySelector("[data-stat=wind] [data-value]")),n(this,er,this.root.querySelector("[data-stat=pressure] [data-value]")),n(this,vt,this.root.querySelector(".hrv-forecast-strip")),n(this,Zt,this.root.querySelector(".hrv-forecast-toggle")),n(this,wt,this.root.querySelector(".hrv-forecast-scroll-track")),n(this,ir,this.root.querySelector(".hrv-forecast-scroll-thumb")),t(this,vt)&&(t(this,vt).addEventListener("scroll",()=>h(this,$,pn).call(this),{passive:!0}),n(this,rr,ns(t(this,vt)))),t(this,wt)&&t(this,wt).addEventListener("pointerdown",e=>h(this,$,rs).call(this,e)),this.renderCompanions(),B(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}destroy(){var e;(e=t(this,rr))==null||e.call(this),n(this,rr,null)}applyState(e,i){const r=e||"cloudy";t(this,Ki)&&(t(this,Ki).innerHTML=Or(r,44));const o=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,Ji)&&(t(this,Ji).textContent=o);const a=i.temperature??i.native_temperature;let l=String(i.temperature_unit||i.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(l&&!/^°/.test(l)&&l.length<=2&&(l=`°${l}`),t(this,ri)){const u=t(this,ri).querySelector(".hrv-weather-unit");t(this,ri).firstChild.textContent=a!=null?Math.round(Number(a)):"--",u&&(u.textContent=l)}if(t(this,Qi)){const u=i.humidity;t(this,Qi).textContent=u!=null?`${u}%`:"--"}if(t(this,tr)){const u=i.wind_speed,f=i.wind_speed_unit??"";t(this,tr).textContent=u!=null?`${u} ${f}`.trim():"--"}if(t(this,er)){const u=i.pressure,f=i.pressure_unit??"";t(this,er).textContent=u!=null?`${u} ${f}`.trim():"--"}const d=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;n(this,ni,d?i.forecast_daily??i.forecast??null:null),n(this,si,d?i.forecast_hourly??null:null),h(this,$,dn).call(this),h(this,$,cn).call(this),this.announceState(`${this.def.friendly_name}, ${o}, ${a??"--"} ${l}`)}}Ki=new WeakMap,ri=new WeakMap,Ji=new WeakMap,Qi=new WeakMap,tr=new WeakMap,er=new WeakMap,vt=new WeakMap,Zt=new WeakMap,wt=new WeakMap,ir=new WeakMap,rr=new WeakMap,$=new WeakSet,Te=function(){return this.config._forecastMode??"daily"},Br=function(e){this.config._forecastMode=e},ni=new WeakMap,si=new WeakMap,dn=function(){if(!t(this,Zt))return;const e=Array.isArray(t(this,ni))&&t(this,ni).length>0,i=Array.isArray(t(this,si))&&t(this,si).length>0;if(!e&&!i){t(this,Zt).textContent="";return}e&&!i&&n(this,$,"daily",Br),!e&&i&&n(this,$,"hourly",Br),e&&i?(t(this,Zt).textContent=t(this,$,Te)==="daily"?"Hourly":"5-Day",t(this,Zt).onclick=()=>{n(this,$,t(this,$,Te)==="daily"?"hourly":"daily",Br),h(this,$,dn).call(this),h(this,$,cn).call(this)}):(t(this,Zt).textContent="",t(this,Zt).onclick=null)},cn=function(){if(!t(this,vt))return;const e=t(this,$,Te)==="hourly"?t(this,si):t(this,ni);if(t(this,vt).setAttribute("data-mode",t(this,$,Te)),!Array.isArray(e)||e.length===0){t(this,vt).innerHTML="",t(this,wt)&&(t(this,wt).hidden=!0);return}const i=t(this,$,Te)==="daily"?e.slice(0,5):e;t(this,vt).innerHTML=i.map(r=>{const o=new Date(r.datetime);let a;t(this,$,Te)==="hourly"?a=o.toLocaleTimeString([],{hour:"numeric"}):a=zs[o.getDay()]??"";const l=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",d=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="hrv-forecast-day" role="listitem">
            <span class="hrv-forecast-day-name">${p(String(a))}</span>
            ${Or(r.condition||"cloudy",18)}
            <span class="hrv-forecast-temps">
              ${p(String(l))}${d!=null?`/<span class="hrv-forecast-lo">${p(String(d))}</span>`:""}
            </span>
          </div>`}).join(""),t(this,$,Te)==="hourly"?requestAnimationFrame(()=>h(this,$,pn).call(this)):t(this,wt)&&(t(this,wt).hidden=!0)},pn=function(){const e=t(this,vt),i=t(this,wt),r=t(this,ir);if(!e||!i||!r)return;const o=e.scrollWidth>e.clientWidth?e.clientWidth/e.scrollWidth:1;if(o>=1){i.hidden=!0;return}i.hidden=!1;const a=i.clientWidth,l=Math.max(20,o*a),d=a-l,u=e.scrollLeft/(e.scrollWidth-e.clientWidth);r.style.width=`${l}px`,r.style.left=`${u*d}px`},rs=function(e){const i=t(this,vt),r=t(this,wt),o=t(this,ir);if(!i||!r||!o)return;e.preventDefault();const a=r.getBoundingClientRect(),l=parseFloat(o.style.width)||20,d=y=>{const C=y-a.left-l/2,M=a.width-l,m=Math.max(0,Math.min(1,C/M));i.scrollLeft=m*(i.scrollWidth-i.clientWidth)};d(e.clientX);const u=y=>d(y.clientX),f=()=>{window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",f)};window.addEventListener("pointermove",u),window.addEventListener("pointerup",f)};const js=`
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
  `;class Os extends x{constructor(){super(...arguments);s(this,he,null);s(this,nr,null);s(this,le,!1);s(this,kr,"unknown")}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${js}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${p(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
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
      `,n(this,he,this.root.querySelector(".hrv-lock-icon-btn")),n(this,nr,this.root.querySelector(".hrv-lock-ro-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"lock-icon"),e){const i=()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand(t(this,le)?"unlock":"lock",{})};t(this,he)&&this._attachGestureHandlers(t(this,he),{onTap:i});const r=this.root.querySelector("[part=row-toggle]");r&&this._attachGestureHandlers(r,{onTap:i})}this.renderCompanions(),B(this.root)}applyState(e,i){n(this,kr,e),n(this,le,e==="locked");const r=e==="jammed",a=r||(e==="locking"||e==="unlocking")||e==="unavailable"||e==="unknown";t(this,he)&&(t(this,he).setAttribute("aria-pressed",String(t(this,le))),t(this,he).disabled=a),t(this,nr)&&t(this,nr).setAttribute("data-locked",String(t(this,le)));const l=this.root.querySelector("[part=row-toggle]");l&&(l.setAttribute("aria-pressed",String(t(this,le))),l.disabled=a);const d=this.root.querySelector("[part=row-state]");d&&(d.textContent=nt(e));const u=r?"mdi:lock-alert":t(this,le)?"mdi:lock":"mdi:lock-open",f=this.def.icon_state_map?.[e]??this.def.icon??u;this.renderIcon(this.resolveIcon(f,u),"lock-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}he=new WeakMap,nr=new WeakMap,le=new WeakMap,kr=new WeakMap;const Fr=`
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

    [part=row-run-btn],
    [part=row-press-btn],
    [part=row-trigger-btn] {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--hrv-color-primary, #1976d2);
      border: none;
      cursor: pointer;
      padding: 0;
      font-size: 0;
      color: transparent;
      transition: opacity var(--hrv-transition-speed, 0.2s);
    }
    [part=row-run-btn]:hover,
    [part=row-press-btn]:hover,
    [part=row-trigger-btn]:hover { opacity: 0.88; }
    [part=row-run-btn]:active,
    [part=row-press-btn]:active,
    [part=row-trigger-btn]:active { opacity: 0.75; }
    [part=row-run-btn]:disabled,
    [part=row-press-btn]:disabled,
    [part=row-trigger-btn]:disabled { opacity: 0.3; cursor: not-allowed; }

    @media (prefers-reduced-motion: reduce) {
      .hrv-action-icon-btn,
      [part=row-run-btn],
      [part=row-press-btn],
      [part=row-trigger-btn] { transition: none; }
    }
  `;class _n extends x{constructor(){super(...arguments);s(this,de,null);s(this,$r,"unknown")}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${Fr}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-run-btn" type="button" aria-label="${p(this.def.friendly_name)} - Run">Run</button></span>`:""}
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
      `,n(this,de,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),e){const i=()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})};t(this,de)&&this._attachGestureHandlers(t(this,de),{onTap:i});const r=this.root.querySelector("[part=row-run-btn]");r&&this._attachGestureHandlers(r,{onTap:i})}this.renderCompanions(),B(this.root)}applyState(e,i){n(this,$r,e);const r=this.def.capabilities==="read-write",o=e==="on",a=!r||o||e==="unavailable"||e==="unknown";t(this,de)&&(t(this,de).disabled=a,t(this,de).dataset.running=String(o));const l=this.root.querySelector("[part=row-run-btn]");l&&(l.disabled=a);const d=o?"mdi:script-text":"mdi:script-text-play",u=this.def.icon_state_map?.[e]??this.def.icon??d;this.renderIcon(this.resolveIcon(u,d),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="turn_on"?{state:"on",attributes:{}}:null}}de=new WeakMap,$r=new WeakMap,gr(_n,"staleOnMount",!1);class Cn extends x{constructor(){super(...arguments);s(this,Le,null);s(this,$t,null);s(this,Lr,"unknown")}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${Fr}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-trigger-btn" type="button" aria-label="${p(this.def.friendly_name)} - Trigger">Trigger</button></span>`:""}
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
      `,n(this,Le,this.root.querySelector(".hrv-action-icon-btn")),n(this,$t,this.root.querySelector("[part=enable-toggle]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),e){const i=()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand("trigger",{})};t(this,Le)&&this._attachGestureHandlers(t(this,Le),{onTap:i});const r=this.root.querySelector("[part=row-trigger-btn]");r&&this._attachGestureHandlers(r,{onTap:i}),this._attachGestureHandlers(t(this,$t),{onTap:()=>{const o=t(this,$t)?.getAttribute("aria-pressed")==="true";this.config.card?.sendCommand(o?"turn_off":"turn_on",{})}})}this.renderCompanions(),B(this.root)}applyState(e,i){n(this,Lr,e);const o=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,Le)&&(t(this,Le).disabled=o),t(this,$t)&&(t(this,$t).disabled=o,t(this,$t).textContent=e==="on"?"Enabled":"Disabled",t(this,$t).setAttribute("aria-pressed",String(e==="on")),t(this,$t).setAttribute("aria-label",`${this.def.friendly_name} - ${e==="on"?"Disable":"Enable"}`));const a=this.root.querySelector("[part=row-trigger-btn]");a&&(a.disabled=o);const l=e==="on"?"mdi:robot":"mdi:robot-off",d=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(d,l),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}predictState(e,i){return e==="turn_on"?{state:"on",attributes:{}}:e==="turn_off"?{state:"off",attributes:{}}:null}}Le=new WeakMap,$t=new WeakMap,Lr=new WeakMap,gr(Cn,"staleOnMount",!1);class Wr extends x{constructor(){super(...arguments);s(this,Me,null)}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${Fr}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-press-btn" type="button" aria-label="${p(this.def.friendly_name)} - Press">Press</button></span>`:""}
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
      `,n(this,Me,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),e){const i=()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}this.config.card?.sendCommand("press",{})};t(this,Me)&&this._attachGestureHandlers(t(this,Me),{onTap:i});const r=this.root.querySelector("[part=row-press-btn]");r&&this._attachGestureHandlers(r,{onTap:i})}this.renderCompanions(),B(this.root)}applyState(e,i){const o=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,Me)&&(t(this,Me).disabled=o);const a=this.root.querySelector("[part=row-press-btn]");a&&(a.disabled=o);const l=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(l,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Me=new WeakMap,gr(Wr,"staleOnMount",!1);const Vs=`
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
  `;class Nr extends x{constructor(){super(...arguments);s(this,sr,null)}render(){this.root.innerHTML=`
        <style>${Vs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
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
      `,n(this,sr,this.root.querySelector(".hrv-person-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"person-icon"),this.renderCompanions(),B(this.root)}applyState(e,i){const r=e==="home";t(this,sr)&&t(this,sr).setAttribute("data-home",String(r));const o=e==="not_home"?"Away":e==="home"?"Home":nt(e),a=this.root.querySelector("[part=row-value]");a&&(a.textContent=o);const l=e==="not_home"?"mdi:account-off":"mdi:home-account",d=this.def.icon_state_map?.[e]??this.def.icon??l;this.renderIcon(this.resolveIcon(d,l),"person-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}sr=new WeakMap,gr(Nr,"staleOnMount",!0),A._renderers=A._renderers||{};const Fs=document.currentScript&&document.currentScript.dataset.rendererId||"minimus";A._renderers[Fs]={light:ps,fan:vs,lock:Os,script:_n,automation:Cn,button:Wr,input_button:Wr,climate:gs,binary_sensor:ys,cover:ws,input_boolean:bn,input_number:mn,number:mn,input_select:gn,select:gn,media_player:As,remote:$s,sensor:_r,"sensor.temperature":_r,"sensor.humidity":_r,"sensor.battery":_r,switch:bn,person:Nr,device_tracker:Nr,event:xn,timer:Ts,weather:Rs,generic:xn,badge:null}})();})();
