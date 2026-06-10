(()=>{var Hs=Object.defineProperty;var dn=S=>{throw TypeError(S)};var Es=(S,y,c)=>y in S?Hs(S,y,{enumerable:!0,configurable:!0,writable:!0,value:c}):S[y]=c;var sr=(S,y,c)=>Es(S,typeof y!="symbol"?y+"":y,c),Ir=(S,y,c)=>y.has(S)||dn("Cannot "+c);var t=(S,y,c)=>(Ir(S,y,"read from private field"),c?c.call(S):y.get(S)),o=(S,y,c)=>y.has(S)?dn("Cannot add the same private member more than once"):y instanceof WeakSet?y.add(S):y.set(S,c),n=(S,y,c,Zt)=>(Ir(S,y,"write to private field"),Zt?Zt.call(S,c):y.set(S,c),c),l=(S,y,c)=>(Ir(S,y,"access private method"),c);(function(){"use strict";var ae,R,Qi,K,Lt,$,j,ti,ei,vt,wt,ft,mt,ke,ii,N,J,Mt,ri,ni,x,Ts,q,cn,pn,un,vn,gr,br,fn,Yi,mn,gn,Dr,bn,Pr,yn,_t,rt,pr,Q,si,Z,Ht,Et,Tt,G,H,le,Gt,tt,I,Le,oi,ai,g,yr,or,Br,xr,zr,Rr,Ui,xn,wn,jr,_n,Or,Cn,wr,An,dt,Yt,qt,li,he,hi,di,ci,nt,st,pi,ui,vi,fi,Y,Me,It,ot,at,Dt,mi,gi,bi,Pt,de,He,yi,xi,wi,_i,Ci,tr,Ai,_,Vr,Sn,$n,Fr,ar,Wr,_r,kn,Ln,Nr,Zr,Mn,Hn,Ee,Te,Bt,D,qe,Ie,De,gt,ce,Ut,zt,Si,er,ir,$i,Rt,Cr,En,Tn,Pe,Xt,O,U,ki,pe,ue,Kt,V,ct,Ct,Jt,ve,L,qn,In,Xi,Ar,Dn,Ki,et,F,Be,ur,fe,Li,Qt,ze,te,me,ge,lt,P,Pn,Bn,Gr,Yr,Ji,ee,Mi,Hi,Re,je,jt,B,Oe,Ve,Fe,Ot,ie,We,Ne,rr,be,Sr,zn,Ei,nr,Ti,qi,Vt,Ii,ye,bt,re,xe,we,Ze,Di,Pi,At,Bi,pt,Rn,jn,On,lr,zi,Ft,Ge,Ye,Ri,Ue,ji,Oi,Vi,Fi,ut,Wt,yt,Wi,Ni,k,Se,$r,Xe,Ke,Ur,Xr,Kr,Vn,ne,Zi,se,vr,oe,fr,_e,St,mr,Ce,Gi;const S=window.HArvest;if(!S||!S.renderers||!S.renderers.BaseCard){console.warn("[HArvest minimus] HArvest not found - pack not loaded.");return}const y=S.renderers.BaseCard,c=window.HArvest.esc;function Zt(p,v){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,p.apply(this,i)},v)}}function ht(p){return p?p.charAt(0).toUpperCase()+p.slice(1).replace(/_/g," "):""}const W=`
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
  `;function Fn(p){if(!p)return()=>{};const v=80,e=1.6,i=.96,r=.04;let s=null,a=0,d=0,h=0,u=!1,f=0;const w=[],C=()=>{f&&(cancelAnimationFrame(f),f=0)},T=m=>{for(;w.length&&w[0].t<m-v;)w.shift();if(w.length<2)return 0;const A=w[0],E=w[w.length-1],Je=E.t-A.t;return Je<=0?0:(E.x-A.x)/Je},b=()=>{if(Math.abs(h)<r)return;let m=performance.now();const A=E=>{const Je=E-m;if(m=E,p.scrollLeft-=h*Je,h*=Math.pow(i,Je/16),Math.abs(h)<r){f=0,h=0;return}const Ms=p.scrollWidth-p.clientWidth;if(p.scrollLeft<=0||p.scrollLeft>=Ms){f=0,h=0;return}f=requestAnimationFrame(A)};f=requestAnimationFrame(A)},X=m=>{if(p.scrollWidth<=p.clientWidth||m.pointerType==="touch")return;const A=m.target;if(!(A&&A!==p&&A.closest?.("button, a"))){C(),s=m.pointerId,a=m.clientX,d=p.scrollLeft,h=0,u=!1,w.length=0,w.push({x:m.clientX,t:m.timeStamp});try{p.setPointerCapture(s)}catch{}}},Nt=m=>{if(m.pointerId!==s)return;const A=m.clientX-a;Math.abs(A)>4&&(u=!0,p.dataset.dragging="true"),p.scrollLeft=d-A,w.push({x:m.clientX,t:m.timeStamp});const E=m.timeStamp-v;for(;w.length>2&&w[0].t<E;)w.shift()},Ae=m=>{if(m.pointerId===s){try{p.releasePointerCapture(s)}catch{}if(s=null,u){const A=E=>{E.stopPropagation(),E.preventDefault()};window.addEventListener("click",A,{capture:!0,once:!0}),requestAnimationFrame(()=>p.removeAttribute("data-dragging")),h=T(m.timeStamp)*e,b()}w.length=0}};return p.addEventListener("pointerdown",X),p.addEventListener("pointermove",Nt),p.addEventListener("pointerup",Ae),p.addEventListener("pointercancel",Ae),p.addEventListener("wheel",C,{passive:!0}),p.addEventListener("touchstart",C,{passive:!0}),()=>{C(),p.removeEventListener("pointerdown",X),p.removeEventListener("pointermove",Nt),p.removeEventListener("pointerup",Ae),p.removeEventListener("pointercancel",Ae),p.removeEventListener("wheel",C),p.removeEventListener("touchstart",C)}}function z(p){p.querySelectorAll("[part=companion]").forEach(v=>{v.title=v.getAttribute("aria-label")??""})}const Wn=60,Nn=60,$e=48,it=225,M=270,$t=2*Math.PI*$e*(M/360);function Zn(p){return p*Math.PI/180}function xt(p){const v=Zn(p);return{x:Wn+$e*Math.cos(v),y:Nn-$e*Math.sin(v)}}function Gn(){const p=xt(it),v=xt(it-M);return`M ${p.x} ${p.y} A ${$e} ${$e} 0 1 1 ${v.x} ${v.y}`}const Qe=Gn(),kt=["brightness","temp","color"],hr=120;function Jr(p){const v=M/hr;let e="";for(let i=0;i<hr;i++){const r=it-i*v,s=it-(i+1)*v,a=xt(r),d=xt(s),h=`M ${a.x} ${a.y} A ${$e} ${$e} 0 0 1 ${d.x} ${d.y}`,u=i===0||i===hr-1?"round":"butt";e+=`<path d="${h}" stroke="${p(i/hr)}" fill="none" stroke-width="8" stroke-linecap="${u}" />`}return e}const Yn=Jr(p=>`hsl(${Math.round(p*360)},100%,50%)`),Un=Jr(p=>{const e=Math.round(143+112*p),i=Math.round(255*p);return`rgb(255,${e},${i})`}),kr=`
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
  `;class Kn extends y{constructor(e,i,r,s){super(e,i,r,s);o(this,x);o(this,ae,null);o(this,R,null);o(this,Qi,null);o(this,K,null);o(this,Lt,null);o(this,$,null);o(this,j,null);o(this,ti,null);o(this,ei,null);o(this,vt,0);o(this,wt,4e3);o(this,ft,0);o(this,mt,!1);o(this,ke,!1);o(this,ii,null);o(this,N,0);o(this,J,2e3);o(this,Mt,6500);o(this,ri);o(this,ni,new Map);o(this,q,[]);n(this,ri,Zt(l(this,x,yn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},s=r.show_brightness!==!1&&i.includes("brightness"),a=r.show_color_temp!==!1&&i.includes("color_temp"),d=r.show_rgb!==!1&&i.includes("rgb_color"),h=e&&(s||a||d),u=[s,a,d].filter(Boolean).length,f=e&&u>1;n(this,J,this.def.feature_config?.min_color_temp_kelvin??2e3),n(this,Mt,this.def.feature_config?.max_color_temp_kelvin??6500);const w=xt(it);this.root.innerHTML=`
        <style>${kr}${Xn}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${c(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          </div>
          <div part="card-body" class="${h?"":"hrv-no-dial"}">
            ${h?`
              <div class="hrv-dial-column">
                <div class="hrv-dial-wrap" role="slider" tabindex="0" aria-valuemin="0"
                  aria-valuemax="100" aria-valuenow="0"
                  aria-label="${c(this.def.friendly_name)} brightness"
                  title="Drag to adjust">
                  <svg viewBox="0 0 120 120">
                    <g class="hrv-dial-segs hrv-dial-segs-color">${Yn}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${Un}</g>
                    <path class="hrv-dial-track" d="${Qe}" />
                    <path class="hrv-dial-fill" d="${Qe}"
                      stroke-dasharray="${$t}"
                      stroke-dashoffset="${$t}" />
                    <circle class="hrv-dial-thumb" r="7"
                      cx="${w.x}" cy="${w.y}" />
                    <circle class="hrv-dial-thumb-hit" r="16"
                      cx="${w.x}" cy="${w.y}" />
                  </svg>
                  <span class="hrv-dial-pct">0%</span>
                </div>
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-light-ro-center">
                <div class="hrv-light-ro-circle" data-on="false"
                  role="img" aria-label="${c(this.def.friendly_name)}"
                  title="Read-only">
                  <span part="ro-state-icon" aria-hidden="true"></span>
                </div>
                <div class="hrv-light-ro-dots">
                  ${s?'<span class="hrv-light-ro-dot" data-attr="brightness" title="Brightness"></span>':""}
                  ${a?'<span class="hrv-light-ro-dot" data-attr="temp" title="Color temperature"></span>':""}
                  ${d?'<span class="hrv-light-ro-dot" data-attr="color" title="Color"></span>':""}
                </div>
              </div>
            `}
            ${e?`
              <div class="hrv-dial-controls">
                ${f?`
                  <div class="hrv-mode-switch" part="dial-mode" data-pos="0" data-count="${u}"
                    role="slider" aria-label="Dial mode" tabindex="0"
                    aria-valuemin="1" aria-valuemax="${u}" aria-valuenow="1"
                    aria-valuetext="${kt[t(this,q)[0]]}">
                    <div class="hrv-mode-switch-thumb"></div>
                    ${'<span class="hrv-mode-dot"></span>'.repeat(u)}
                  </div>
                `:""}
                ${h?`
                  <button part="toggle-button" type="button"
                    aria-label="${c(this.def.friendly_name)} - toggle"
                    title="Turn ${c(this.def.friendly_name)} on / off">
                    <div class="hrv-light-toggle-knob"></div>
                  </button>
                `:`
                  <button class="hrv-light-icon-btn" part="toggle-button" type="button"
                    aria-pressed="false"
                    aria-label="${c(this.def.friendly_name)} - Toggle">
                    <span part="card-icon" aria-hidden="true"></span>
                  </button>
                `}
              </div>
            `:""}
          </div>
          ${h?"":this.renderCompanionZoneHTML()}
        </div>
      `,n(this,ae,this.root.querySelector("[part=toggle-button]")),n(this,R,this.root.querySelector(".hrv-dial-fill")),n(this,Qi,this.root.querySelector(".hrv-dial-track")),n(this,K,this.root.querySelector(".hrv-dial-thumb")),n(this,Lt,this.root.querySelector(".hrv-dial-pct")),n(this,$,this.root.querySelector(".hrv-dial-wrap")),n(this,ii,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,ti,this.root.querySelector(".hrv-dial-segs-color")),n(this,ei,this.root.querySelector(".hrv-dial-segs-temp")),n(this,j,this.root.querySelector(".hrv-mode-switch"));const C=()=>{const b=this.config.gestureConfig?.tap;if(b){this._runAction(b);return}this.config.card?.sendCommand("toggle",{})};t(this,ae)&&(h||this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon"),this._attachGestureHandlers(t(this,ae),{onTap:C}));const T=this.root.querySelector("[part=row-toggle]");T&&this._attachGestureHandlers(T,{onTap:C}),t(this,$)&&(t(this,$).addEventListener("pointerdown",l(this,x,mn).bind(this)),t(this,$).addEventListener("pointermove",l(this,x,gn).bind(this)),t(this,$).addEventListener("pointerup",l(this,x,Dr).bind(this)),t(this,$).addEventListener("pointercancel",l(this,x,Dr).bind(this)),t(this,$).addEventListener("keydown",l(this,x,bn).bind(this))),h&&l(this,x,cn).call(this),t(this,j)&&(t(this,j).addEventListener("click",l(this,x,pn).bind(this)),t(this,j).addEventListener("keydown",l(this,x,vn).bind(this)),t(this,j).addEventListener("mousemove",l(this,x,un).bind(this))),l(this,x,br).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(b=>{b.title=b.getAttribute("aria-label")??"Companion";const X=b.getAttribute("data-entity");if(X&&t(this,ni).has(X)){const Nt=t(this,ni).get(X);b.setAttribute("data-on",String(Nt==="on"))}})}applyState(e,i){if(n(this,mt,e==="on"),n(this,vt,i?.brightness??0),i?.color_temp_kelvin!==void 0?n(this,wt,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&n(this,wt,Math.round(1e6/i.color_temp)),i?.hs_color)n(this,ft,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[d,h,u]=i.rgb_color;n(this,ft,ts(d,h,u))}if(t(this,ae)&&(t(this,ae).setAttribute("aria-pressed",String(t(this,mt))),this.root.querySelector("[part=card-icon]"))){const h=t(this,mt)?"mdi:lightbulb":"mdi:lightbulb-outline",u=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(u,h),"card-icon")}const r=this.root.querySelector(".hrv-light-ro-circle");if(r){r.setAttribute("data-on",String(t(this,mt)));const d=t(this,mt)?"mdi:lightbulb":"mdi:lightbulb-outline",h=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??d;this.renderIcon(this.resolveIcon(h,d),"ro-state-icon");const u=i?.color_mode,f=u==="color_temp",w=u&&u!=="color_temp",C=this.root.querySelector('[data-attr="brightness"]');if(C){const X=Math.round(t(this,vt)/255*100);C.title=t(this,mt)?`Brightness: ${X}%`:"Brightness: off"}const T=this.root.querySelector('[data-attr="temp"]');T&&(T.title=`Color temperature: ${t(this,wt)}K`,T.style.display=w?"none":"");const b=this.root.querySelector('[data-attr="color"]');if(b)if(b.style.display=f?"none":"",i?.rgb_color){const[X,Nt,Ae]=i.rgb_color;b.style.background=`rgb(${X},${Nt},${Ae})`,b.title=`Color: rgb(${X}, ${Nt}, ${Ae})`}else b.style.background=`hsl(${t(this,ft)}, 100%, 50%)`,b.title=`Color: hue ${t(this,ft)}°`}const s=this.root.querySelector("[part=row-toggle]");s&&(s.setAttribute("aria-pressed",String(t(this,mt))),s.disabled=e==="unavailable"||e==="unknown");const a=this.root.querySelector("[part=row-state]");a&&(a.textContent=ht(e)),l(this,x,gr).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,mt)?"off":"on",attributes:{brightness:t(this,vt)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,r){t(this,ni).set(e,i),super.updateCompanionState(e,i,r)}}ae=new WeakMap,R=new WeakMap,Qi=new WeakMap,K=new WeakMap,Lt=new WeakMap,$=new WeakMap,j=new WeakMap,ti=new WeakMap,ei=new WeakMap,vt=new WeakMap,wt=new WeakMap,ft=new WeakMap,mt=new WeakMap,ke=new WeakMap,ii=new WeakMap,N=new WeakMap,J=new WeakMap,Mt=new WeakMap,ri=new WeakMap,ni=new WeakMap,x=new WeakSet,Ts=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},q=new WeakMap,cn=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];n(this,q,[]),i[0]&&t(this,q).push(0),i[1]&&t(this,q).push(1),i[2]&&t(this,q).push(2),t(this,q).length===0&&t(this,q).push(0),t(this,q).includes(t(this,N))||n(this,N,t(this,q)[0])},pn=function(e){const i=t(this,j).getBoundingClientRect(),r=e.clientY-i.top,s=i.height/3;let a;r<s?a=0:r<s*2?a=1:a=2,a=Math.min(a,t(this,q).length-1),n(this,N,t(this,q)[a]),t(this,j).setAttribute("data-pos",String(a)),t(this,j).setAttribute("aria-valuenow",String(a+1)),t(this,j).setAttribute("aria-valuetext",kt[t(this,N)]),l(this,x,br).call(this),l(this,x,gr).call(this)},un=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},r=t(this,j).getBoundingClientRect(),s=Math.min(Math.floor((e.clientY-r.top)/(r.height/t(this,q).length)),t(this,q).length-1),a=kt[t(this,q)[Math.max(0,s)]];t(this,j).title=`Dial mode: ${i[a]??a}`},vn=function(e){const i=t(this,q).indexOf(t(this,N));let r=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")r=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")r=Math.min(t(this,q).length-1,i+1);else return;e.preventDefault(),n(this,N,t(this,q)[r]),t(this,j).setAttribute("data-pos",String(r)),t(this,j).setAttribute("aria-valuenow",String(r+1)),t(this,j).setAttribute("aria-valuetext",kt[t(this,N)]),l(this,x,br).call(this),l(this,x,gr).call(this)},gr=function(){t(this,K)&&(t(this,K).style.transition="none"),t(this,R)&&(t(this,R).style.transition="none"),l(this,x,fn).call(this),t(this,K)?.getBoundingClientRect(),t(this,R)?.getBoundingClientRect(),t(this,K)&&(t(this,K).style.transition=""),t(this,R)&&(t(this,R).style.transition="")},br=function(){if(!t(this,R))return;const e=kt[t(this,N)],i=e==="color"||e==="temp";t(this,Qi).style.display=i?"none":"",t(this,R).style.display=i?"none":"",t(this,ti)&&t(this,ti).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,ei)&&t(this,ei).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,R).setAttribute("stroke-dasharray",String($t));const r={brightness:"brightness",temp:"color temperature",color:"color"},s={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,$)?.setAttribute("aria-label",`${c(this.def.friendly_name)} ${r[e]}`),t(this,$)&&(t(this,$).title=s[e]),t(this,$)&&(t(this,$).setAttribute("aria-valuemin",e==="temp"?String(t(this,J)):"0"),t(this,$).setAttribute("aria-valuemax",e==="temp"?String(t(this,Mt)):e==="color"?"360":"100"))},fn=function(){const e=kt[t(this,N)];if(e==="brightness"){const i=t(this,mt)?t(this,vt):0;l(this,x,Yi).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,wt)-t(this,J))/(t(this,Mt)-t(this,J))*100);l(this,x,Yi).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,ft)/360*100);l(this,x,Yi).call(this,i)}},Yi=function(e){const i=kt[t(this,N)],r=e/100*M,s=xt(it-r);if(t(this,K)?.setAttribute("cx",String(s.x)),t(this,K)?.setAttribute("cy",String(s.y)),t(this,ii)?.setAttribute("cx",String(s.x)),t(this,ii)?.setAttribute("cy",String(s.y)),i==="brightness"){const a=$t*(1-e/100);t(this,R)?.setAttribute("stroke-dashoffset",String(a)),t(this,Lt)&&(t(this,Lt).textContent=e+"%"),t(this,$)?.setAttribute("aria-valuenow",String(e)),t(this,$)?.setAttribute("aria-valuetext",`${e}%`)}else if(i==="temp"){const a=Math.round(t(this,J)+e/100*(t(this,Mt)-t(this,J)));t(this,Lt)&&(t(this,Lt).textContent=a+"K"),t(this,$)?.setAttribute("aria-valuenow",String(a)),t(this,$)?.setAttribute("aria-valuetext",`${a} kelvin`)}else{const a=Math.round(e/100*360);t(this,Lt)&&(t(this,Lt).textContent=a+"°"),t(this,$)?.setAttribute("aria-valuenow",String(a)),t(this,$)?.setAttribute("aria-valuetext",`${a} degrees`)}},mn=function(e){n(this,ke,!0),t(this,$)?.setPointerCapture(e.pointerId),l(this,x,Pr).call(this,e)},gn=function(e){t(this,ke)&&l(this,x,Pr).call(this,e)},Dr=function(e){if(t(this,ke)){n(this,ke,!1);try{t(this,$)?.releasePointerCapture(e.pointerId)}catch{}t(this,ri).call(this)}},bn=function(e){const i=kt[t(this,N)];let r=Math.round(i==="brightness"?t(this,vt)/255*100:i==="temp"?(t(this,wt)-t(this,J))/(t(this,Mt)-t(this,J))*100:t(this,ft)/360*100);if(e.key==="ArrowDown"||e.key==="ArrowLeft")r-=1;else if(e.key==="ArrowUp"||e.key==="ArrowRight")r+=1;else if(e.key==="PageDown")r-=10;else if(e.key==="PageUp")r+=10;else if(e.key==="Home")r=0;else if(e.key==="End")r=100;else return;e.preventDefault(),r=Math.max(0,Math.min(100,r)),i==="brightness"?n(this,vt,Math.round(r/100*255)):i==="temp"?n(this,wt,Math.round(t(this,J)+r/100*(t(this,Mt)-t(this,J)))):n(this,ft,Math.round(r/100*360)),l(this,x,Yi).call(this,r),t(this,ri).call(this)},Pr=function(e){if(!t(this,$))return;const i=t(this,$).getBoundingClientRect(),r=i.left+i.width/2,s=i.top+i.height/2,a=e.clientX-r,d=-(e.clientY-s);let h=Math.atan2(d,a)*180/Math.PI;h<0&&(h+=360);let u=it-h;u<0&&(u+=360),u>M&&(u=u>M+(360-M)/2?0:M);const f=Math.round(u/M*100),w=kt[t(this,N)];w==="brightness"?n(this,vt,Math.round(f/100*255)):w==="temp"?n(this,wt,Math.round(t(this,J)+f/100*(t(this,Mt)-t(this,J)))):n(this,ft,Math.round(f/100*360)),t(this,R)&&(t(this,R).style.transition="none"),t(this,K)&&(t(this,K).style.transition="none"),l(this,x,Yi).call(this,f)},yn=function(){t(this,R)&&(t(this,R).style.transition=""),t(this,K)&&(t(this,K).style.transition="");const e=kt[t(this,N)];e==="brightness"?t(this,vt)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,vt)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,wt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,ft),100]})};const Jn=kr+`
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
  `;class Qn extends y{constructor(e,i,r,s){super(e,i,r,s);o(this,g);o(this,_t,null);o(this,rt,null);o(this,pr,null);o(this,Q,null);o(this,si,null);o(this,Z,null);o(this,Ht,null);o(this,Et,null);o(this,Tt,null);o(this,G,!1);o(this,H,0);o(this,le,!1);o(this,Gt,"forward");o(this,tt,null);o(this,I,[]);o(this,Le,!1);o(this,oi,null);o(this,ai);n(this,ai,Zt(l(this,g,Cn).bind(this),300)),n(this,I,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},s=r.display_mode??null;let a=i.includes("set_speed");const d=r.show_oscillate!==!1&&i.includes("oscillate"),h=r.show_direction!==!1&&i.includes("direction"),u=r.show_presets!==!1&&i.includes("preset_mode");s==="on-off"&&(a=!1);let f=e&&a,w=f&&t(this,g,or),C=w&&!t(this,I).length,T=w&&!!t(this,I).length;s==="continuous"?(w=!1,C=!1,T=!1):s==="stepped"?(T=!1,C=w&&!t(this,I).length):s==="cycle"&&(w=!0,T=!0,C=!1);const b=xt(it);this.root.innerHTML=`
        <style>${Jn}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${c(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          </div>
          <div part="card-body" class="${f?C?"hrv-fan-horiz":"":"hrv-no-dial"}">
            ${f?`
              <div class="hrv-dial-column">
                ${C?`
                  <div class="hrv-fan-hspeed-wrap">
                    <div class="hrv-fan-hspeed-switch" role="group"
                      aria-label="${c(this.def.friendly_name)} speed"
                      data-on="false">
                      <div class="hrv-fan-hspeed-thumb"></div>
                      ${t(this,g,xr).map((m,A)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${m}" data-idx="${A}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${A+1} (${m}%)"
                          title="Speed ${A+1} (${m}%)"></div>
                      `).join("")}
                    </div>
                  </div>
                `:T?`
                  <div class="hrv-fan-stepped-wrap">
                    <button class="hrv-fan-speed-circle" part="speed-circle" type="button"
                      aria-pressed="false"
                      title="Click to increase fan speed"
                      aria-label="Click to increase fan speed"><svg class="hrv-fan-speed-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg></button>
                  </div>
                `:`
                  <div class="hrv-dial-wrap" role="slider" tabindex="0"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                    aria-label="${c(this.def.friendly_name)} speed"
                    title="Drag to adjust fan speed">
                    <svg viewBox="0 0 120 120">
                      <path class="hrv-dial-track" d="${Qe}" />
                      <path class="hrv-dial-fill" d="${Qe}"
                        stroke-dasharray="${$t}"
                        stroke-dashoffset="${$t}" />
                      <circle class="hrv-dial-thumb" r="7"
                        cx="${b.x}" cy="${b.y}" />
                      <circle class="hrv-dial-thumb-hit" r="16"
                        cx="${b.x}" cy="${b.y}" />
                    </svg>
                    <span class="hrv-dial-pct">0%</span>
                  </div>
                `}
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-fan-ro-center">
                <div class="hrv-fan-ro-circle" data-on="false"
                  role="img" aria-label="${c(this.def.friendly_name)}"
                  title="Read-only">
                  <span part="ro-state-icon" aria-hidden="true"></span>
                </div>
              </div>
            `}
            ${e?`
              <div class="hrv-dial-controls">
                ${d?`
                  <button class="hrv-fan-feat-btn" data-feat="oscillate" type="button"
                    aria-label="Oscillate: off" title="Oscillate: off"></button>
                `:""}
                ${h?`
                  <button class="hrv-fan-feat-btn" data-feat="direction" type="button"
                    aria-label="Direction: forward" title="Direction: forward"></button>
                `:""}
                ${u?`
                  <button class="hrv-fan-feat-btn" data-feat="preset" type="button"
                    aria-label="Preset: none" title="Preset: none"></button>
                `:""}
                <button part="toggle-button" type="button"
                  aria-label="${c(this.def.friendly_name)} - toggle"
                  title="Turn ${c(this.def.friendly_name)} on / off">${f?"":'<span part="fan-onoff-icon" aria-hidden="true"></span>'}</button>
              </div>
            `:""}
          </div>
          ${f?"":this.renderCompanionZoneHTML()}
        </div>
      `,n(this,_t,this.root.querySelector("[part=toggle-button]")),n(this,rt,this.root.querySelector(".hrv-dial-fill")),n(this,pr,this.root.querySelector(".hrv-dial-track")),n(this,Q,this.root.querySelector(".hrv-dial-thumb")),n(this,si,this.root.querySelector(".hrv-dial-pct")),n(this,Z,this.root.querySelector(".hrv-dial-wrap")),n(this,oi,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,Ht,this.root.querySelector('[data-feat="oscillate"]')),n(this,Et,this.root.querySelector('[data-feat="direction"]')),n(this,Tt,this.root.querySelector('[data-feat="preset"]')),t(this,_t)&&!f&&(this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"fan-onoff-icon"),t(this,_t).setAttribute("data-animate",String(!!this.config.animate)));const X=()=>{const m=this.config.gestureConfig?.tap;if(m){this._runAction(m);return}this.config.card?.sendCommand("toggle",{})};this._attachGestureHandlers(t(this,_t),{onTap:X});const Nt=this.root.querySelector("[part=row-toggle]");Nt&&this._attachGestureHandlers(Nt,{onTap:X}),t(this,Z)&&(t(this,Z).addEventListener("pointerdown",l(this,g,xn).bind(this)),t(this,Z).addEventListener("pointermove",l(this,g,wn).bind(this)),t(this,Z).addEventListener("pointerup",l(this,g,jr).bind(this)),t(this,Z).addEventListener("pointercancel",l(this,g,jr).bind(this)),t(this,Z).addEventListener("keydown",l(this,g,_n).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const m=t(this,g,xr);if(!m.length)return;let A;if(!t(this,G)||t(this,H)===0)A=m[0],n(this,G,!0),t(this,_t)?.setAttribute("aria-pressed","true");else{const E=m.findIndex(Je=>Je>t(this,H));A=E===-1?m[0]:m[E]}n(this,H,A),l(this,g,zr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:A})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(m=>{const A=()=>{const E=Number(m.getAttribute("data-pct"));t(this,G)||(n(this,G,!0),t(this,_t)?.setAttribute("aria-pressed","true")),n(this,H,E),l(this,g,Rr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:E})};m.addEventListener("click",A),m.addEventListener("keydown",E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),A())})}),t(this,Ht)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,le)})}),t(this,Et)?.addEventListener("click",()=>{const m=t(this,Gt)==="forward"?"reverse":"forward";n(this,Gt,m),l(this,g,Ui).call(this),this.config.card?.sendCommand("set_direction",{direction:m})}),t(this,Tt)?.addEventListener("click",()=>{if(t(this,I).length){if(t(this,g,Br)){const m=t(this,tt)??t(this,I)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:m});return}if(t(this,tt)){const m=t(this,I).indexOf(t(this,tt));if(m===-1||m===t(this,I).length-1){n(this,tt,null),l(this,g,Ui).call(this);const A=t(this,g,yr),E=Math.floor(t(this,H)/A)*A||A;this.config.card?.sendCommand("set_percentage",{percentage:E})}else{const A=t(this,I)[m+1];n(this,tt,A),l(this,g,Ui).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:A})}}else{const m=t(this,I)[0];n(this,tt,m),l(this,g,Ui).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:m})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(m=>{m.title=m.getAttribute("aria-label")??"Companion"})}applyState(e,i){n(this,G,e==="on"),n(this,H,i?.percentage??0),n(this,le,i?.oscillating??!1),n(this,Gt,i?.direction??"forward"),n(this,tt,i?.preset_mode??null),i?.preset_modes?.length&&n(this,I,i.preset_modes),t(this,_t)&&t(this,_t).setAttribute("aria-pressed",String(t(this,G)));const r=this.root.querySelector(".hrv-fan-ro-circle");r&&r.setAttribute("data-on",String(t(this,G)));const s=this.root.querySelector("[part=row-toggle]");s&&(s.setAttribute("aria-pressed",String(t(this,G))),s.disabled=e==="unavailable"||e==="unknown");const a=this.root.querySelector("[part=row-state]");a&&(a.textContent=ht(e)),t(this,g,or)&&!t(this,I).length?l(this,g,Rr).call(this):t(this,g,or)?l(this,g,zr).call(this):l(this,g,An).call(this),l(this,g,Ui).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,H)>0?`, ${Math.round(t(this,H))}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,G)?"off":"on",attributes:{percentage:t(this,H)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,le),direction:t(this,Gt),preset_mode:t(this,tt),preset_modes:t(this,I)}}:null}}_t=new WeakMap,rt=new WeakMap,pr=new WeakMap,Q=new WeakMap,si=new WeakMap,Z=new WeakMap,Ht=new WeakMap,Et=new WeakMap,Tt=new WeakMap,G=new WeakMap,H=new WeakMap,le=new WeakMap,Gt=new WeakMap,tt=new WeakMap,I=new WeakMap,Le=new WeakMap,oi=new WeakMap,ai=new WeakMap,g=new WeakSet,yr=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},or=function(){return t(this,g,yr)>1},Br=function(){return t(this,g,or)&&t(this,I).length>0},xr=function(){const e=t(this,g,yr),i=[];for(let r=1;r*e<=100.001;r++)i.push(r*e);return i},zr=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,G)));const i=t(this,G)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},Rr=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),r=t(this,g,xr);let s=-1;if(t(this,G)&&t(this,H)>0){let a=1/0;r.forEach((d,h)=>{const u=Math.abs(d-t(this,H));u<a&&(a=u,s=h)})}e.setAttribute("data-on",String(s>=0)),i&&s>=0&&(i.style.left=`${2+s*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((a,d)=>{a.setAttribute("data-active",String(d===s))})},Ui=function(){const e=t(this,g,Br);if(t(this,Ht)){const i=e||t(this,le),r=e?"Oscillate":`Oscillate: ${t(this,le)?"on":"off"}`;t(this,Ht).setAttribute("data-on",String(i)),t(this,Ht).setAttribute("aria-pressed",String(i)),t(this,Ht).setAttribute("aria-label",r),t(this,Ht).title=r}if(t(this,Et)){const i=t(this,Gt)!=="reverse",r=`Direction: ${t(this,Gt)}`;t(this,Et).setAttribute("data-on",String(i)),t(this,Et).setAttribute("aria-pressed",String(i)),t(this,Et).setAttribute("aria-label",r),t(this,Et).title=r}if(t(this,Tt)){const i=e||!!t(this,tt),r=e?t(this,tt)??t(this,I)[0]??"Preset":t(this,tt)?`Preset: ${t(this,tt)}`:"Preset: none";t(this,Tt).setAttribute("data-on",String(i)),t(this,Tt).setAttribute("aria-pressed",String(i)),t(this,Tt).setAttribute("aria-label",r),t(this,Tt).title=r}},xn=function(e){n(this,Le,!0),t(this,Z)?.setPointerCapture(e.pointerId),l(this,g,Or).call(this,e)},wn=function(e){t(this,Le)&&l(this,g,Or).call(this,e)},jr=function(e){if(t(this,Le)){n(this,Le,!1);try{t(this,Z)?.releasePointerCapture(e.pointerId)}catch{}t(this,ai).call(this)}},_n=function(e){let i=t(this,H);if(e.key==="ArrowDown"||e.key==="ArrowLeft")i-=1;else if(e.key==="ArrowUp"||e.key==="ArrowRight")i+=1;else if(e.key==="PageDown")i-=10;else if(e.key==="PageUp")i+=10;else if(e.key==="Home")i=0;else if(e.key==="End")i=100;else return;e.preventDefault(),n(this,H,Math.max(0,Math.min(100,i))),l(this,g,wr).call(this,t(this,H)),t(this,ai).call(this)},Or=function(e){if(!t(this,Z))return;const i=t(this,Z).getBoundingClientRect(),r=i.left+i.width/2,s=i.top+i.height/2,a=e.clientX-r,d=-(e.clientY-s);let h=Math.atan2(d,a)*180/Math.PI;h<0&&(h+=360);let u=it-h;u<0&&(u+=360),u>M&&(u=u>M+(360-M)/2?0:M),n(this,H,Math.round(u/M*100)),t(this,rt)&&(t(this,rt).style.transition="none"),t(this,Q)&&(t(this,Q).style.transition="none"),l(this,g,wr).call(this,t(this,H))},Cn=function(){t(this,rt)&&(t(this,rt).style.transition=""),t(this,Q)&&(t(this,Q).style.transition=""),t(this,H)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,H)})},wr=function(e){const i=$t*(1-e/100),r=xt(it-e/100*M);t(this,rt)?.setAttribute("stroke-dashoffset",String(i)),t(this,Q)?.setAttribute("cx",String(r.x)),t(this,Q)?.setAttribute("cy",String(r.y)),t(this,oi)?.setAttribute("cx",String(r.x)),t(this,oi)?.setAttribute("cy",String(r.y)),t(this,si)&&(t(this,si).textContent=`${e}%`),t(this,Z)?.setAttribute("aria-valuenow",String(e)),t(this,Z)?.setAttribute("aria-valuetext",`${e}%`)},An=function(){t(this,Q)&&(t(this,Q).style.transition="none"),t(this,rt)&&(t(this,rt).style.transition="none"),l(this,g,wr).call(this,t(this,G)?t(this,H):0),t(this,Q)?.getBoundingClientRect(),t(this,rt)?.getBoundingClientRect(),t(this,Q)&&(t(this,Q).style.transition=""),t(this,rt)&&(t(this,rt).style.transition="")};function ts(p,v,e){p/=255,v/=255,e/=255;const i=Math.max(p,v,e),r=Math.min(p,v,e),s=i-r;if(s===0)return 0;let a;return i===p?a=(v-e)/s%6:i===v?a=(e-p)/s+2:a=(p-v)/s+4,Math.round((a*60+360)%360)}const es=kr+`
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
  `;class is extends y{constructor(e,i,r,s){super(e,i,r,s);o(this,_);o(this,dt,null);o(this,Yt,null);o(this,qt,null);o(this,li,null);o(this,he,!1);o(this,hi,null);o(this,di,null);o(this,ci,null);o(this,nt,null);o(this,st,null);o(this,pi,null);o(this,ui,null);o(this,vi,null);o(this,fi,null);o(this,Y,null);o(this,Me,null);o(this,It,null);o(this,ot,null);o(this,at,20);o(this,Dt,"off");o(this,mi,null);o(this,gi,null);o(this,bi,null);o(this,Pt,16);o(this,de,32);o(this,He,.5);o(this,yi,"°C");o(this,xi,[]);o(this,wi,[]);o(this,_i,[]);o(this,Ci,[]);o(this,tr,{});o(this,Ai);n(this,Ai,Zt(l(this,_,Mn).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),s=i.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),a=i.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),d=i.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);n(this,Pt,this.def.feature_config?.min_temp??16),n(this,de,this.def.feature_config?.max_temp??32),n(this,He,this.def.feature_config?.temp_step??.5),n(this,yi,this.def.unit_of_measurement??"°C"),n(this,xi,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),n(this,wi,this.def.feature_config?.fan_modes??[]),n(this,_i,this.def.feature_config?.preset_modes??[]),n(this,Ci,this.def.feature_config?.swing_modes??[]);const h=l(this,_,Vr).call(this,t(this,at)),u=xt(it),f=xt(it-h/100*M),w=$t*(1-h/100),[C,T]=t(this,at).toFixed(1).split(".");this.root.innerHTML=`
        <style>${es}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e&&r?`
              <div class="hrv-dial-wrap">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path class="hrv-dial-track" d="${Qe}"/>
                  <path class="hrv-dial-fill" d="${Qe}"
                    stroke-dasharray="${$t}" stroke-dashoffset="${w}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${c(C)}</span><span class="hrv-climate-temp-frac">.${c(T)}</span><span class="hrv-climate-temp-unit">${c(t(this,yi))}</span>
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
                  <span class="hrv-climate-ro-temp-int">${c(C)}</span><span class="hrv-climate-ro-temp-frac">.${c(T)}</span><span class="hrv-climate-ro-temp-unit">${c(t(this,yi))}</span>
                </div>
              </div>
            `:""}
            <div class="hrv-climate-grid">
              ${i.show_hvac_modes!==!1&&t(this,xi).length?`
                <button class="hrv-cf-btn" data-feat="mode" type="button"
                  ${e?'title="Change HVAC mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${a&&t(this,_i).length?`
                <button class="hrv-cf-btn" data-feat="preset" type="button"
                  ${e?'title="Change preset mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Preset</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${s&&t(this,wi).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button"
                  ${e?'title="Change fan mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${d&&t(this,Ci).length?`
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
      `,n(this,dt,this.root.querySelector(".hrv-dial-wrap")),n(this,Yt,this.root.querySelector(".hrv-dial-fill")),n(this,qt,this.root.querySelector(".hrv-dial-thumb")),n(this,li,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,hi,this.root.querySelector(".hrv-climate-state-text")),n(this,di,this.root.querySelector(".hrv-climate-temp-int")),n(this,ci,this.root.querySelector(".hrv-climate-temp-frac")),n(this,nt,this.root.querySelector("[data-dir='-']")),n(this,st,this.root.querySelector("[data-dir='+']")),n(this,pi,this.root.querySelector("[data-feat=mode]")),n(this,ui,this.root.querySelector("[data-feat=fan]")),n(this,vi,this.root.querySelector("[data-feat=preset]")),n(this,fi,this.root.querySelector("[data-feat=swing]")),n(this,Y,this.root.querySelector(".hrv-climate-dropdown")),t(this,dt)&&(t(this,dt).addEventListener("pointerdown",l(this,_,kn).bind(this)),t(this,dt).addEventListener("pointermove",l(this,_,Ln).bind(this)),t(this,dt).addEventListener("pointerup",l(this,_,Nr).bind(this)),t(this,dt).addEventListener("pointercancel",l(this,_,Nr).bind(this))),t(this,nt)&&(t(this,nt).addEventListener("click",()=>l(this,_,Wr).call(this,-1)),t(this,nt).addEventListener("pointerdown",()=>t(this,nt).setAttribute("data-pressing","true")),t(this,nt).addEventListener("pointerup",()=>t(this,nt).removeAttribute("data-pressing")),t(this,nt).addEventListener("pointerleave",()=>t(this,nt).removeAttribute("data-pressing")),t(this,nt).addEventListener("pointercancel",()=>t(this,nt).removeAttribute("data-pressing"))),t(this,st)&&(t(this,st).addEventListener("click",()=>l(this,_,Wr).call(this,1)),t(this,st).addEventListener("pointerdown",()=>t(this,st).setAttribute("data-pressing","true")),t(this,st).addEventListener("pointerup",()=>t(this,st).removeAttribute("data-pressing")),t(this,st).addEventListener("pointerleave",()=>t(this,st).removeAttribute("data-pressing")),t(this,st).addEventListener("pointercancel",()=>t(this,st).removeAttribute("data-pressing"))),e&&[t(this,pi),t(this,ui),t(this,vi),t(this,fi)].forEach(b=>{if(!b)return;const X=b.getAttribute("data-feat");b.addEventListener("click",()=>l(this,_,$n).call(this,X)),b.addEventListener("pointerdown",()=>b.setAttribute("data-pressing","true")),b.addEventListener("pointerup",()=>b.removeAttribute("data-pressing")),b.addEventListener("pointerleave",()=>b.removeAttribute("data-pressing")),b.addEventListener("pointercancel",()=>b.removeAttribute("data-pressing"))}),this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,tr,{...i}),n(this,Dt,e),n(this,mi,i.fan_mode??null),n(this,gi,i.preset_mode??null),n(this,bi,i.swing_mode??null),!t(this,he)&&i.temperature!==void 0&&(n(this,at,i.temperature),l(this,_,_r).call(this)),t(this,hi)&&(t(this,hi).textContent=ht(i.hvac_action??e));const r=this.root.querySelector(".hrv-climate-ro-temp-int"),s=this.root.querySelector(".hrv-climate-ro-temp-frac");if(r&&i.temperature!==void 0){n(this,at,i.temperature);const[h,u]=t(this,at).toFixed(1).split(".");r.textContent=h,s.textContent=`.${u}`}l(this,_,Hn).call(this);const a=i.hvac_action??e,d=ht(a);this.announceState(`${this.def.friendly_name}, ${d}`)}predictState(e,i){const r={...t(this,tr)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:r}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,Dt),attributes:{...r,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,Dt),attributes:{...r,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,Dt),attributes:{...r,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,Dt),attributes:{...r,swing_mode:i.swing_mode}}:null}destroy(){t(this,It)&&(document.removeEventListener("pointerdown",t(this,It),!0),n(this,It,null)),t(this,ot)&&(window.removeEventListener("scroll",t(this,ot),!0),window.removeEventListener("resize",t(this,ot)),n(this,ot,null));try{t(this,Y)?.hidePopover?.()}catch{}}}dt=new WeakMap,Yt=new WeakMap,qt=new WeakMap,li=new WeakMap,he=new WeakMap,hi=new WeakMap,di=new WeakMap,ci=new WeakMap,nt=new WeakMap,st=new WeakMap,pi=new WeakMap,ui=new WeakMap,vi=new WeakMap,fi=new WeakMap,Y=new WeakMap,Me=new WeakMap,It=new WeakMap,ot=new WeakMap,at=new WeakMap,Dt=new WeakMap,mi=new WeakMap,gi=new WeakMap,bi=new WeakMap,Pt=new WeakMap,de=new WeakMap,He=new WeakMap,yi=new WeakMap,xi=new WeakMap,wi=new WeakMap,_i=new WeakMap,Ci=new WeakMap,tr=new WeakMap,Ai=new WeakMap,_=new WeakSet,Vr=function(e){return Math.max(0,Math.min(100,(e-t(this,Pt))/(t(this,de)-t(this,Pt))*100))},Sn=function(e){const i=t(this,Pt)+e/100*(t(this,de)-t(this,Pt)),r=Math.round(i/t(this,He))*t(this,He);return Math.max(t(this,Pt),Math.min(t(this,de),+r.toFixed(10)))},$n=function(e){if(t(this,Me)===e){l(this,_,ar).call(this);return}t(this,Me)&&l(this,_,ar).call(this),n(this,Me,e);let i=[],r=null,s="",a="";switch(e){case"mode":i=t(this,xi),r=t(this,Dt),s="set_hvac_mode",a="hvac_mode";break;case"fan":i=t(this,wi),r=t(this,mi),s="set_fan_mode",a="fan_mode";break;case"preset":i=t(this,_i),r=t(this,gi),s="set_preset_mode",a="preset_mode";break;case"swing":i=t(this,Ci),r=t(this,bi),s="set_swing_mode",a="swing_mode";break}if(!i.length||!t(this,Y))return;t(this,Y).innerHTML=i.map(u=>`
        <button class="hrv-cf-option" data-active="${u===r}" role="option"
          aria-selected="${u===r}" type="button">
          ${c(ht(u))}
        </button>
      `).join(""),t(this,Y).querySelectorAll(".hrv-cf-option").forEach((u,f)=>{u.addEventListener("click",()=>{this.config.card?.sendCommand(s,{[a]:i[f]}),l(this,_,ar).call(this)})});const d=this.root.querySelector(`[data-feat="${e}"]`);try{t(this,Y).showPopover?.()}catch{}l(this,_,Fr).call(this,d),n(this,ot,()=>l(this,_,Fr).call(this,d)),window.addEventListener("scroll",t(this,ot),!0),window.addEventListener("resize",t(this,ot));const h=u=>{u.composedPath().some(w=>w===this.root||w===this.root.host)||l(this,_,ar).call(this)};n(this,It,h),document.addEventListener("pointerdown",h,!0)},Fr=function(e){if(!t(this,Y)||!e)return;const i=e.getBoundingClientRect(),r=window.innerHeight-i.bottom,s=i.top,a=Math.min(t(this,Y).scrollHeight||280,280),d=Math.max(140,Math.round(i.width));t(this,Y).style.left=`${Math.round(i.left)}px`,t(this,Y).style.minWidth=`${d}px`,s>=a+8||s>r?t(this,Y).style.top=`${Math.max(8,Math.round(i.top-a-6))}px`:t(this,Y).style.top=`${Math.round(i.bottom+6)}px`},ar=function(){n(this,Me,null);try{t(this,Y)?.hidePopover?.()}catch{}t(this,It)&&(document.removeEventListener("pointerdown",t(this,It),!0),n(this,It,null)),t(this,ot)&&(window.removeEventListener("scroll",t(this,ot),!0),window.removeEventListener("resize",t(this,ot)),n(this,ot,null))},Wr=function(e){const i=Math.round((t(this,at)+e*t(this,He))*100)/100;n(this,at,Math.max(t(this,Pt),Math.min(t(this,de),i))),l(this,_,_r).call(this),t(this,Ai).call(this)},_r=function(){const e=l(this,_,Vr).call(this,t(this,at)),i=$t*(1-e/100),r=xt(it-e/100*M);t(this,Yt)?.setAttribute("stroke-dashoffset",String(i)),t(this,qt)?.setAttribute("cx",String(r.x)),t(this,qt)?.setAttribute("cy",String(r.y)),t(this,li)?.setAttribute("cx",String(r.x)),t(this,li)?.setAttribute("cy",String(r.y));const[s,a]=t(this,at).toFixed(1).split(".");t(this,di)&&(t(this,di).textContent=s),t(this,ci)&&(t(this,ci).textContent=`.${a}`)},kn=function(e){n(this,he,!0),t(this,dt)?.setPointerCapture(e.pointerId),l(this,_,Zr).call(this,e)},Ln=function(e){t(this,he)&&l(this,_,Zr).call(this,e)},Nr=function(e){if(t(this,he)){n(this,he,!1);try{t(this,dt)?.releasePointerCapture(e.pointerId)}catch{}t(this,Yt)&&(t(this,Yt).style.transition=""),t(this,qt)&&(t(this,qt).style.transition="")}},Zr=function(e){if(!t(this,dt))return;const i=t(this,dt).getBoundingClientRect(),r=i.left+i.width/2,s=i.top+i.height/2,a=e.clientX-r,d=-(e.clientY-s);let h=Math.atan2(d,a)*180/Math.PI;h<0&&(h+=360);let u=it-h;u<0&&(u+=360),u>M&&(u=u>M+(360-M)/2?0:M),n(this,at,l(this,_,Sn).call(this,u/M*100)),t(this,Yt)&&(t(this,Yt).style.transition="none"),t(this,qt)&&(t(this,qt).style.transition="none"),l(this,_,_r).call(this),t(this,Ai).call(this)},Mn=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,at)})},Hn=function(){const e=(i,r)=>{if(!i)return;const s=i.querySelector(".hrv-cf-value");s&&(s.textContent=ht(r??"None"))};e(t(this,pi),t(this,Dt)),e(t(this,ui),t(this,mi)),e(t(this,vi),t(this,gi)),e(t(this,fi),t(this,bi))};const rs=`
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
  `;class ns extends y{constructor(){super(...arguments);o(this,Ee,null)}render(){this.root.innerHTML=`
        <style>${rs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            <div class="hrv-bs-circle" data-on="false"
              role="img" aria-label="${c(this.def.friendly_name)}">
              <span part="state-icon" aria-hidden="true"></span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Ee,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"state-icon"),this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=e==="on",s=this.formatStateLabel(e);t(this,Ee)&&(t(this,Ee).setAttribute("data-on",String(r)),t(this,Ee).setAttribute("aria-label",`${this.def.friendly_name}: ${s}`));const a=this.root.querySelector("[part=row-value]");a&&(a.textContent=s);const d=r?"mdi:radiobox-marked":"mdi:radiobox-blank",h=this.def.icon_state_map?.[e]??this.def.icon??d;this.renderIcon(this.resolveIcon(h,d),"state-icon"),this.announceState(`${this.def.friendly_name}, ${s}`)}}Ee=new WeakMap;const Qr='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',tn='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',Lr='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',ss=`
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
  `;class os extends y{constructor(e,i,r,s){super(e,i,r,s);o(this,Rt);o(this,Te,null);o(this,Bt,null);o(this,D,null);o(this,qe,null);o(this,Ie,null);o(this,De,null);o(this,gt,null);o(this,ce,null);o(this,Ut,!1);o(this,zt,0);o(this,Si,"closed");o(this,er,{});o(this,ir);o(this,$i);n(this,ir,Zt(l(this,Rt,En).bind(this),300)),n(this,$i,Zt(l(this,Rt,Tn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=i.show_position!==!1&&this.def.supported_features?.includes("set_position"),s=i.show_tilt!==!1&&this.def.supported_features?.includes("set_tilt_position"),a=!this.def.supported_features||this.def.supported_features.includes("buttons");this.root.innerHTML=`
        <style>${ss}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-state"></span></span>
          </div>
          <div part="card-body">
            ${e?"":`
              <div class="hrv-cover-ro-center">
                <div class="hrv-cover-ro-circle" role="img"
                  aria-label="${c(this.def.friendly_name)}" title="Read-only">
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
            ${s?`
              <label class="hrv-cover-tilt-wrap">
                <span>Tilt</span>
                <input part="tilt-slider" type="range" min="0" max="100" step="1" value="0"
                  ${e?"":"disabled"}
                  aria-label="${c(this.def.friendly_name)} tilt">
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
                  title="Close cover" aria-label="Close cover">${Lr}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Te,this.root.querySelector(".hrv-cover-slider-track")),n(this,Bt,this.root.querySelector(".hrv-cover-slider-fill")),n(this,D,this.root.querySelector(".hrv-cover-slider-thumb")),n(this,qe,this.root.querySelector("[data-action=open]")),n(this,Ie,this.root.querySelector("[data-action=stop]")),n(this,De,this.root.querySelector("[data-action=close]")),n(this,gt,this.root.querySelector("[part=tilt-slider]")),n(this,ce,this.root.querySelector("[part=tilt-value]"));const d=this.root.querySelector("[part=cover-ro-icon]");if(d&&(d.innerHTML=Lr),t(this,Te)&&t(this,D)&&e){const h=f=>{n(this,Ut,!0),t(this,D).style.transition="none",t(this,Bt).style.transition="none",l(this,Rt,Cr).call(this,f),t(this,D).setPointerCapture(f.pointerId)};t(this,D).addEventListener("pointerdown",h),t(this,Te).addEventListener("pointerdown",f=>{f.target!==t(this,D)&&(n(this,Ut,!0),t(this,D).style.transition="none",t(this,Bt).style.transition="none",l(this,Rt,Cr).call(this,f),t(this,D).setPointerCapture(f.pointerId))}),t(this,D).addEventListener("pointermove",f=>{t(this,Ut)&&l(this,Rt,Cr).call(this,f)});const u=()=>{t(this,Ut)&&(n(this,Ut,!1),t(this,D).style.transition="",t(this,Bt).style.transition="",t(this,ir).call(this))};t(this,D).addEventListener("pointerup",u),t(this,D).addEventListener("pointercancel",u)}t(this,gt)&&e&&(t(this,gt).addEventListener("input",()=>{t(this,ce)&&(t(this,ce).textContent=`${t(this,gt).value}%`),t(this,$i).call(this)}),this.guardSlider(t(this,gt),t(this,$i))),[t(this,qe),t(this,Ie),t(this,De)].forEach(h=>{if(!h)return;const u=h.getAttribute("data-action");h.addEventListener("click",()=>{this.config.card?.sendCommand(`${u}_cover`,{})}),h.addEventListener("pointerdown",()=>h.setAttribute("data-pressing","true")),h.addEventListener("pointerup",()=>h.removeAttribute("data-pressing")),h.addEventListener("pointerleave",()=>h.removeAttribute("data-pressing")),h.addEventListener("pointercancel",()=>h.removeAttribute("data-pressing"))}),this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Si,e),n(this,er,{...i});const r=e==="opening"||e==="closing",s=i.current_position;t(this,qe)&&(t(this,qe).disabled=!r&&s===100),t(this,Ie)&&(t(this,Ie).disabled=!r),t(this,De)&&(t(this,De).disabled=!r&&e==="closed"),i.current_position!==void 0&&!t(this,Ut)&&(n(this,zt,i.current_position),t(this,Bt)&&(t(this,Bt).style.width=`${t(this,zt)}%`),t(this,D)&&(t(this,D).style.left=`${t(this,zt)}%`)),i.current_tilt_position!==void 0&&t(this,gt)&&!this.isSliderActive(t(this,gt))&&(t(this,gt).value=String(i.current_tilt_position),t(this,ce)&&(t(this,ce).textContent=`${i.current_tilt_position}%`));const a=this.root.querySelector("[part=cover-ro-icon]");if(a){const h=e==="open"||e==="opening",u=e==="opening"||e==="closing";a.innerHTML=u?tn:h?Qr:Lr}const d=this.root.querySelector("[part=row-state]");d&&(d.textContent=ht(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const r={...t(this,er)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,Si),attributes:r}:e==="set_cover_position"&&i.position!==void 0?(r.current_position=i.position,{state:i.position>0?"open":"closed",attributes:r}):e==="set_cover_tilt_position"&&i.tilt_position!==void 0?(r.current_tilt_position=i.tilt_position,{state:t(this,Si),attributes:r}):null}}Te=new WeakMap,Bt=new WeakMap,D=new WeakMap,qe=new WeakMap,Ie=new WeakMap,De=new WeakMap,gt=new WeakMap,ce=new WeakMap,Ut=new WeakMap,zt=new WeakMap,Si=new WeakMap,er=new WeakMap,ir=new WeakMap,$i=new WeakMap,Rt=new WeakSet,Cr=function(e){const i=t(this,Te).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,zt,Math.round(r)),t(this,Bt).style.width=`${t(this,zt)}%`,t(this,D).style.left=`${t(this,zt)}%`},En=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,zt)})},Tn=function(){const e=parseInt(t(this,gt)?.value??0,10);this.config.card?.sendCommand("set_cover_tilt_position",{tilt_position:e})};const as=`
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
  `;class en extends y{constructor(e,i,r,s){super(e,i,r,s);o(this,L);o(this,Pe,null);o(this,Xt,null);o(this,O,null);o(this,U,null);o(this,ki,null);o(this,pe,null);o(this,ue,null);o(this,Kt,!1);o(this,V,0);o(this,ct,0);o(this,Ct,100);o(this,Jt,1);o(this,ve);n(this,ve,Zt(l(this,L,Dn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints?.display_mode??null)!=="buttons";n(this,ct,this.def.feature_config?.min??0),n(this,Ct,this.def.feature_config?.max??100),n(this,Jt,this.def.feature_config?.step??1);const s=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${as}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
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
                  aria-label="Decrease ${c(this.def.friendly_name)}">-</button>
                <input class="hrv-num-input" type="number"
                  min="${t(this,ct)}" max="${t(this,Ct)}" step="${t(this,Jt)}"
                  title="Enter value" aria-label="${c(this.def.friendly_name)} value">
                <button class="hrv-num-btn" type="button" part="inc-btn"
                  aria-label="Increase ${c(this.def.friendly_name)}">+</button>
                ${s?`<span class="hrv-num-unit">${c(s)}</span>`:""}
              </div>
            `:`
              <div class="hrv-num-readonly">
                <span class="hrv-num-readonly-val">-</span>
                ${s?`<span class="hrv-num-readonly-unit">${c(s)}</span>`:""}
              </div>
            `}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Pe,this.root.querySelector(".hrv-num-slider-track")),n(this,Xt,this.root.querySelector(".hrv-num-slider-fill")),n(this,O,this.root.querySelector(".hrv-num-slider-thumb")),n(this,U,this.root.querySelector(".hrv-num-input")),n(this,ki,this.root.querySelector(".hrv-num-readonly-val")),n(this,pe,this.root.querySelector("[part=dec-btn]")),n(this,ue,this.root.querySelector("[part=inc-btn]")),t(this,Pe)&&t(this,O)){const a=h=>{n(this,Kt,!0),t(this,O).style.transition="none",t(this,Xt).style.transition="none",l(this,L,Ar).call(this,h),t(this,O).setPointerCapture(h.pointerId)};t(this,O).addEventListener("pointerdown",a),t(this,Pe).addEventListener("pointerdown",h=>{h.target!==t(this,O)&&(n(this,Kt,!0),t(this,O).style.transition="none",t(this,Xt).style.transition="none",l(this,L,Ar).call(this,h),t(this,O).setPointerCapture(h.pointerId))}),t(this,O).addEventListener("pointermove",h=>{t(this,Kt)&&l(this,L,Ar).call(this,h)});const d=()=>{t(this,Kt)&&(n(this,Kt,!1),t(this,O).style.transition="",t(this,Xt).style.transition="",t(this,ve).call(this))};t(this,O).addEventListener("pointerup",d),t(this,O).addEventListener("pointercancel",d)}t(this,U)&&t(this,U).addEventListener("input",()=>{const a=parseFloat(t(this,U).value);isNaN(a)||(n(this,V,Math.max(t(this,ct),Math.min(t(this,Ct),a))),l(this,L,Xi).call(this),l(this,L,Ki).call(this),t(this,ve).call(this))}),t(this,pe)&&t(this,pe).addEventListener("click",()=>{n(this,V,+Math.max(t(this,ct),t(this,V)-t(this,Jt)).toFixed(10)),l(this,L,Xi).call(this),t(this,U)&&(t(this,U).value=String(t(this,V))),l(this,L,Ki).call(this),t(this,ve).call(this)}),t(this,ue)&&t(this,ue).addEventListener("click",()=>{n(this,V,+Math.min(t(this,Ct),t(this,V)+t(this,Jt)).toFixed(10)),l(this,L,Xi).call(this),t(this,U)&&(t(this,U).value=String(t(this,V))),l(this,L,Ki).call(this),t(this,ve).call(this)}),this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=parseFloat(e);if(isNaN(r))return;n(this,V,r),t(this,Kt)||(l(this,L,Xi).call(this),t(this,U)&&!this.isFocused(t(this,U))&&(t(this,U).value=String(r))),l(this,L,Ki).call(this),t(this,ki)&&(t(this,ki).textContent=String(r));const s=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${s?` ${s}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}Pe=new WeakMap,Xt=new WeakMap,O=new WeakMap,U=new WeakMap,ki=new WeakMap,pe=new WeakMap,ue=new WeakMap,Kt=new WeakMap,V=new WeakMap,ct=new WeakMap,Ct=new WeakMap,Jt=new WeakMap,ve=new WeakMap,L=new WeakSet,qn=function(e){const i=t(this,Ct)-t(this,ct);return i===0?0:Math.max(0,Math.min(100,(e-t(this,ct))/i*100))},In=function(e){const i=t(this,ct)+e/100*(t(this,Ct)-t(this,ct)),r=Math.round(i/t(this,Jt))*t(this,Jt);return Math.max(t(this,ct),Math.min(t(this,Ct),+r.toFixed(10)))},Xi=function(){const e=l(this,L,qn).call(this,t(this,V));t(this,Xt)&&(t(this,Xt).style.width=`${e}%`),t(this,O)&&(t(this,O).style.left=`${e}%`)},Ar=function(e){const i=t(this,Pe).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,V,l(this,L,In).call(this,r)),l(this,L,Xi).call(this),t(this,U)&&(t(this,U).value=String(t(this,V))),l(this,L,Ki).call(this)},Dn=function(){this.config.card?.sendCommand("set_value",{value:t(this,V)})},Ki=function(){t(this,pe)&&(t(this,pe).disabled=t(this,V)<=t(this,ct)),t(this,ue)&&(t(this,ue).disabled=t(this,V)>=t(this,Ct))};const ls=`
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
  `;class rn extends y{constructor(){super(...arguments);o(this,P);o(this,et,null);o(this,F,null);o(this,Be,null);o(this,ur,"");o(this,fe,[]);o(this,Li,"");o(this,Qt,!1);o(this,ze,[]);o(this,te,[]);o(this,me,"pills");o(this,ge,null);o(this,lt,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";n(this,me,i==="dropdown"?"dropdown":"pills"),n(this,fe,this.def.feature_config?.options??[]);const r=e?t(this,me)==="dropdown"?`
            <button class="hrv-is-selected" type="button"
              title="Select an option"
              aria-label="${c(this.def.friendly_name)}"
              aria-haspopup="listbox" aria-expanded="false">
              <span class="hrv-is-label">-</span>
              <span class="hrv-is-arrow" aria-hidden="true">&#9660;</span>
            </button>
            <div class="hrv-is-dropdown" role="listbox" popover="manual"></div>`:'<div class="hrv-is-grid"></div>':`
        <button class="hrv-is-selected" type="button" data-readonly="true" disabled
          aria-label="${c(this.def.friendly_name)}">
          <span class="hrv-is-label">-</span>
        </button>`;this.root.innerHTML=`
        <style>${ls}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${r}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,et,this.root.querySelector(".hrv-is-selected")),n(this,F,this.root.querySelector(".hrv-is-dropdown")),n(this,Be,this.root.querySelector(".hrv-is-grid")),n(this,ze,[]),n(this,te,[]),n(this,Li,""),t(this,et)&&e&&t(this,me)==="dropdown"&&(t(this,et).addEventListener("click",s=>{s.stopPropagation(),t(this,Qt)?l(this,P,Ji).call(this):l(this,P,Yr).call(this)}),t(this,et).addEventListener("keydown",s=>{(s.key==="Enter"||s.key===" "||s.key==="ArrowDown")&&!t(this,Qt)?(s.preventDefault(),l(this,P,Yr).call(this),t(this,te)[0]?.focus()):s.key==="Escape"&&t(this,Qt)&&(l(this,P,Ji).call(this),t(this,et).focus())}),n(this,ge,s=>{t(this,Qt)&&!this.root.host.contains(s.target)&&l(this,P,Ji).call(this)}),document.addEventListener("click",t(this,ge))),this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,ur,e);const r=i?.options,s=Array.isArray(r)&&r.length?r:t(this,fe);n(this,fe,s);const a=s.join("|");if(a!==t(this,Li)&&(n(this,Li,a),t(this,me)==="dropdown"?l(this,P,Bn).call(this,s):l(this,P,Pn).call(this,s)),t(this,me)==="dropdown"){const d=this.root.querySelector(".hrv-is-label");d&&(d.textContent=e);for(const h of t(this,te))h.setAttribute("data-active",String(h.dataset.option===e))}else{for(const h of t(this,ze))h.setAttribute("data-active",String(h.dataset.option===e));const d=this.root.querySelector(".hrv-is-label");d&&(d.textContent=e)}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{options:t(this,fe)}}:null}destroy(){t(this,ge)&&(document.removeEventListener("click",t(this,ge)),n(this,ge,null)),t(this,lt)&&(window.removeEventListener("scroll",t(this,lt),!0),window.removeEventListener("resize",t(this,lt)),n(this,lt,null));try{t(this,F)?.hidePopover?.()}catch{}}}et=new WeakMap,F=new WeakMap,Be=new WeakMap,ur=new WeakMap,fe=new WeakMap,Li=new WeakMap,Qt=new WeakMap,ze=new WeakMap,te=new WeakMap,me=new WeakMap,ge=new WeakMap,lt=new WeakMap,P=new WeakSet,Pn=function(e){if(t(this,Be)){t(this,Be).innerHTML="",n(this,ze,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-pill",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i})}),t(this,Be).appendChild(r),t(this,ze).push(r)}}},Bn=function(e){if(t(this,F)){t(this,F).innerHTML="",n(this,te,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-option",r.role="option",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i}),l(this,P,Ji).call(this),t(this,et)?.focus()}),r.addEventListener("keydown",s=>{const a=t(this,te),d=a.indexOf(r);s.key==="ArrowDown"?(s.preventDefault(),a[Math.min(d+1,a.length-1)]?.focus()):s.key==="ArrowUp"?(s.preventDefault(),d===0?t(this,et)?.focus():a[d-1]?.focus()):s.key==="Escape"&&(l(this,P,Ji).call(this),t(this,et)?.focus())}),t(this,F).appendChild(r),t(this,te).push(r)}}},Gr=function(){if(!t(this,F)||!t(this,et))return;const e=t(this,et).getBoundingClientRect(),i=window.innerHeight-e.bottom,r=e.top,s=Math.min(t(this,F).scrollHeight||280,280);t(this,F).style.left=`${Math.round(e.left)}px`,t(this,F).style.width=`${Math.round(e.width)}px`,i<s+8&&r>i?t(this,F).style.top=`${Math.max(8,Math.round(e.top-s-6))}px`:t(this,F).style.top=`${Math.round(e.bottom+6)}px`},Yr=function(){if(!(!t(this,F)||!t(this,fe).length)){try{t(this,F).showPopover?.()}catch{}t(this,et)?.setAttribute("aria-expanded","true"),l(this,P,Gr).call(this),n(this,lt,()=>l(this,P,Gr).call(this)),window.addEventListener("scroll",t(this,lt),!0),window.addEventListener("resize",t(this,lt)),n(this,Qt,!0)}},Ji=function(){try{t(this,F)?.hidePopover?.()}catch{}t(this,et)?.setAttribute("aria-expanded","false"),t(this,lt)&&(window.removeEventListener("scroll",t(this,lt),!0),window.removeEventListener("resize",t(this,lt)),n(this,lt,null)),n(this,Qt,!1)};const hs=`
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
  `;class ds extends y{constructor(e,i,r,s){super(e,i,r,s);o(this,be);o(this,ee,null);o(this,Mi,null);o(this,Hi,null);o(this,Re,null);o(this,je,null);o(this,jt,null);o(this,B,null);o(this,Oe,null);o(this,Ve,null);o(this,Fe,!1);o(this,Ot,0);o(this,ie,!1);o(this,We,"idle");o(this,Ne,{});o(this,rr);n(this,rr,this.debounce(l(this,be,zn).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},s=r.show_transport!==!1,a=i.includes("play_pause"),d=i.includes("previous_track"),h=i.includes("next_track"),u=r.show_volume!==!1&&i.includes("volume_set"),f=r.show_volume!==!1&&i.includes("volume_mute"),w=u||f;if(this.root.innerHTML=`
        <style>${hs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-mp-info">
              <div class="hrv-mp-artist" title="Artist"></div>
              <div class="hrv-mp-title" title="Title"></div>
            </div>
            ${e&&s&&(a||d||h)?`
              <div class="hrv-mp-controls">
                ${d?`
                  <button class="hrv-mp-btn" data-role="prev" type="button"
                    title="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                ${a?`<button class="hrv-mp-btn" data-role="play" type="button"
                  title="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>`:""}
                ${h?`
                  <button class="hrv-mp-btn" data-role="next" type="button"
                    title="Next track">
                    <span part="next-icon" aria-hidden="true"></span>
                  </button>
                `:""}
              </div>
            `:""}
            ${w?`
              <div class="hrv-mp-volume" title="${e?"Volume":"Read-only"}">
                ${f?`<button class="hrv-mp-mute" type="button"
                  title="${e?"Mute":"Read-only"}"
                  ${e?"":"disabled"}>
                  <span part="mute-icon" aria-hidden="true"></span>
                </button>`:""}
                ${u?`<div class="hrv-mp-slider-wrap">
                  <div class="hrv-mp-slider-track" ${e?"":'data-readonly="true"'}>
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
      `,n(this,ee,this.root.querySelector("[data-role=play]")),n(this,Mi,this.root.querySelector("[data-role=prev]")),n(this,Hi,this.root.querySelector("[data-role=next]")),n(this,Re,this.root.querySelector(".hrv-mp-mute")),n(this,je,this.root.querySelector(".hrv-mp-slider-track")),n(this,jt,this.root.querySelector(".hrv-mp-slider-fill")),n(this,B,this.root.querySelector(".hrv-mp-slider-thumb")),n(this,Oe,this.root.querySelector(".hrv-mp-artist")),n(this,Ve,this.root.querySelector(".hrv-mp-title")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,ee)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,Mi)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Hi)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,ee),t(this,Mi),t(this,Hi)].forEach(C=>{C&&(C.addEventListener("pointerdown",()=>C.setAttribute("data-pressing","true")),C.addEventListener("pointerup",()=>C.removeAttribute("data-pressing")),C.addEventListener("pointerleave",()=>C.removeAttribute("data-pressing")),C.addEventListener("pointercancel",()=>C.removeAttribute("data-pressing")))}),t(this,Re)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,Fe)})),t(this,je)&&t(this,B))){const C=b=>{n(this,ie,!0),t(this,B).style.transition="none",t(this,jt).style.transition="none",l(this,be,Sr).call(this,b),t(this,B).setPointerCapture(b.pointerId)};t(this,B).addEventListener("pointerdown",C),t(this,je).addEventListener("pointerdown",b=>{b.target!==t(this,B)&&(n(this,ie,!0),t(this,B).style.transition="none",t(this,jt).style.transition="none",l(this,be,Sr).call(this,b),t(this,B).setPointerCapture(b.pointerId))}),t(this,B).addEventListener("pointermove",b=>{t(this,ie)&&l(this,be,Sr).call(this,b)});const T=()=>{t(this,ie)&&(n(this,ie,!1),t(this,B).style.transition="",t(this,jt).style.transition="",t(this,rr).call(this))};t(this,B).addEventListener("pointerup",T),t(this,B).addEventListener("pointercancel",T)}this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,We,e),n(this,Ne,i);const r=e==="playing",s=e==="paused";if(t(this,Oe)){const d=i.media_artist??"";t(this,Oe).textContent=d,t(this,Oe).title=d||"Artist"}if(t(this,Ve)){const d=i.media_title??"";t(this,Ve).textContent=d,t(this,Ve).title=d||"Title"}if(t(this,ee)){t(this,ee).setAttribute("data-playing",String(r));const d=r?"mdi:pause":"mdi:play";this.renderIcon(d,"play-icon"),this.def.capabilities==="read-write"&&(t(this,ee).title=r?"Pause":"Play")}if(n(this,Fe,!!i.is_volume_muted),t(this,Re)){const d=t(this,Fe)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(d,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,Re).title=t(this,Fe)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,ie)&&(n(this,Ot,Math.round(i.volume_level*100)),t(this,jt)&&(t(this,jt).style.width=`${t(this,Ot)}%`),t(this,B)&&(t(this,B).style.left=`${t(this,Ot)}%`));const a=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${a?` - ${a}`:""}`)}predictState(e,i){return e==="media_play_pause"?{state:t(this,We)==="playing"?"paused":"playing",attributes:t(this,Ne)}:e==="volume_mute"?{state:t(this,We),attributes:{...t(this,Ne),is_volume_muted:!!i.is_volume_muted}}:e==="volume_set"?{state:t(this,We),attributes:{...t(this,Ne),volume_level:i.volume_level}}:null}}ee=new WeakMap,Mi=new WeakMap,Hi=new WeakMap,Re=new WeakMap,je=new WeakMap,jt=new WeakMap,B=new WeakMap,Oe=new WeakMap,Ve=new WeakMap,Fe=new WeakMap,Ot=new WeakMap,ie=new WeakMap,We=new WeakMap,Ne=new WeakMap,rr=new WeakMap,be=new WeakSet,Sr=function(e){const i=t(this,je).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,Ot,Math.round(r)),t(this,jt).style.width=`${t(this,Ot)}%`,t(this,B).style.left=`${t(this,Ot)}%`},zn=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,Ot)/100})};const cs=`
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
  `;class ps extends y{constructor(){super(...arguments);o(this,Ei,null);o(this,nr,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${cs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-remote-circle" type="button"
              title="${e?"Toggle power":"Read-only"}"
              aria-label="${c(this.def.friendly_name)} - Toggle power"
              ${e?"":"disabled"}>
              <span part="remote-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Ei,this.root.querySelector(".hrv-remote-circle"));const i=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(i,"remote-icon"),t(this,Ei)&&e&&this._attachGestureHandlers(t(this,Ei),{onTap:()=>{const r=this.config.gestureConfig?.tap;if(r){this._runAction(r);return}this.config.card?.sendCommand(t(this,nr)?"turn_off":"turn_on",{})}}),this.renderCompanions(),z(this.root)}applyState(e,i){n(this,nr,e==="on");const r=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(r,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ei=new WeakMap,nr=new WeakMap;const us=`
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
  `;class dr extends y{constructor(){super(...arguments);o(this,Ti,null);o(this,qi,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${us}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body" title="${c(this.def.friendly_name)}">
            <span class="hrv-sensor-val" aria-live="polite">-</span>
            ${e?`<span class="hrv-sensor-unit" title="${c(e)}">${c(e)}</span>`:""}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Ti,this.root.querySelector(".hrv-sensor-val")),n(this,qi,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){t(this,Ti)&&(t(this,Ti).textContent=e),t(this,qi)&&i.unit_of_measurement!==void 0&&(t(this,qi).textContent=i.unit_of_measurement);const r=i.unit_of_measurement??this.def.unit_of_measurement??"",s=this.root.querySelector("[part=card-body]");s&&(s.title=`${e}${r?` ${r}`:""}`);const a=this.root.querySelector("[part=row-value]");a&&(a.textContent=`${e}${r?` ${r}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${r?` ${r}`:""}`)}}Ti=new WeakMap,qi=new WeakMap;const vs=`
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
  `;class nn extends y{constructor(){super(...arguments);o(this,Vt,null);o(this,Ii,null);o(this,ye,!1)}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${vs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${c(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          </div>
          <div part="card-body">
            ${e?`
              <button class="hrv-switch-track" type="button" data-on="false"
                title="Toggle" aria-label="${c(this.def.friendly_name)} - Toggle">
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
      `,n(this,Vt,this.root.querySelector(".hrv-switch-track")),n(this,Ii,this.root.querySelector(".hrv-switch-ro")),e){const i=()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("toggle",{})};t(this,Vt)&&this._attachGestureHandlers(t(this,Vt),{onTap:i});const r=this.root.querySelector("[part=row-toggle]");r&&this._attachGestureHandlers(r,{onTap:i})}this.renderCompanions(),z(this.root)}applyState(e,i){n(this,ye,e==="on");const r=e==="unavailable"||e==="unknown";t(this,Vt)&&(t(this,Vt).setAttribute("data-on",String(t(this,ye))),t(this,Vt).title=t(this,ye)?"On - click to turn off":"Off - click to turn on",t(this,Vt).disabled=r),t(this,Ii)&&(t(this,Ii).textContent=ht(e));const s=this.root.querySelector("[part=row-toggle]");s&&(s.setAttribute("aria-pressed",String(t(this,ye))),s.disabled=r);const a=this.root.querySelector("[part=row-state]");a&&(a.textContent=ht(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,ye)?"off":"on",attributes:{}}}}Vt=new WeakMap,Ii=new WeakMap,ye=new WeakMap;const fs=`
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
  `;function cr(p){p<0&&(p=0);const v=Math.floor(p/3600),e=Math.floor(p%3600/60),i=Math.floor(p%60),r=s=>String(s).padStart(2,"0");return v>0?`${v}:${r(e)}:${r(i)}`:`${r(e)}:${r(i)}`}function sn(p){if(typeof p=="number")return p;if(typeof p!="string")return 0;const v=p.split(":").map(Number);return v.length===3?v[0]*3600+v[1]*60+v[2]:v.length===2?v[0]*60+v[1]:v[0]||0}class ms extends y{constructor(){super(...arguments);o(this,pt);o(this,bt,null);o(this,re,null);o(this,xe,null);o(this,we,null);o(this,Ze,null);o(this,Di,"idle");o(this,Pi,{});o(this,At,null);o(this,Bi,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${fs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-timer-display" title="Time remaining">00:00</span>
            ${e?`
              <div class="hrv-timer-controls">
                <button class="hrv-timer-btn" data-action="playpause" type="button"
                  title="Start" aria-label="${c(this.def.friendly_name)} - Start">
                  <span part="playpause-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="cancel" type="button"
                  title="Cancel" aria-label="${c(this.def.friendly_name)} - Cancel">
                  <span part="cancel-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="finish" type="button"
                  title="Finish" aria-label="${c(this.def.friendly_name)} - Finish">
                  <span part="finish-icon" aria-hidden="true"></span>
                </button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,bt,this.root.querySelector(".hrv-timer-display")),n(this,re,this.root.querySelector("[data-action=playpause]")),n(this,xe,this.root.querySelector("[data-action=cancel]")),n(this,we,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,re)?.addEventListener("click",()=>{const i=t(this,Di)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,xe)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,we)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,re),t(this,xe),t(this,we)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Di,e),n(this,Pi,{...i}),n(this,At,i.finishes_at??null),n(this,Bi,i.remaining!=null?sn(i.remaining):null),l(this,pt,Rn).call(this,e),l(this,pt,jn).call(this,e),e==="active"&&t(this,At)?l(this,pt,On).call(this):l(this,pt,lr).call(this),t(this,bt)&&t(this,bt).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const r={...t(this,Pi)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,At)&&(r.remaining=Math.max(0,(new Date(t(this,At)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}bt=new WeakMap,re=new WeakMap,xe=new WeakMap,we=new WeakMap,Ze=new WeakMap,Di=new WeakMap,Pi=new WeakMap,At=new WeakMap,Bi=new WeakMap,pt=new WeakSet,Rn=function(e){const i=e==="idle",r=e==="active";if(t(this,re)){const s=r?"mdi:pause":"mdi:play",a=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(s,"playpause-icon"),t(this,re).title=a,t(this,re).setAttribute("aria-label",`${this.def.friendly_name} - ${a}`)}t(this,xe)&&(t(this,xe).disabled=i),t(this,we)&&(t(this,we).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},jn=function(e){if(t(this,bt)){if(e==="idle"){const i=t(this,Pi).duration;t(this,bt).textContent=i?cr(sn(i)):"00:00";return}if(e==="paused"&&t(this,Bi)!=null){t(this,bt).textContent=cr(t(this,Bi));return}if(e==="active"&&t(this,At)){const i=Math.max(0,(new Date(t(this,At)).getTime()-Date.now())/1e3);t(this,bt).textContent=cr(i)}}},On=function(){l(this,pt,lr).call(this),n(this,Ze,setInterval(()=>{if(!t(this,At)||t(this,Di)!=="active"){l(this,pt,lr).call(this);return}const e=Math.max(0,(new Date(t(this,At)).getTime()-Date.now())/1e3);t(this,bt)&&(t(this,bt).textContent=cr(e)),e<=0&&l(this,pt,lr).call(this)},1e3))},lr=function(){t(this,Ze)&&(clearInterval(t(this,Ze)),n(this,Ze,null))};const gs=`
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
  `;class on extends y{constructor(){super(...arguments);o(this,zi,null);o(this,Ft,null);o(this,Ge,!1);o(this,Ye,!1)}render(){const e=this.def.capabilities==="read-write";n(this,Ye,!1),this.root.innerHTML=`
        <style>${gs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            <span class="hrv-generic-state" title="${c(this.def.friendly_name)}">-</span>
            ${e?`
              <button class="hrv-generic-toggle" type="button" data-on="false"
                title="Toggle" aria-label="${c(this.def.friendly_name)} - Toggle"
                hidden>
                <div class="hrv-generic-knob"></div>
              </button>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,zi,this.root.querySelector(".hrv-generic-state")),n(this,Ft,this.root.querySelector(".hrv-generic-toggle")),t(this,Ft)&&e&&this._attachGestureHandlers(t(this,Ft),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),z(this.root)}applyState(e,i){const r=e==="on"||e==="off";n(this,Ge,e==="on"),t(this,zi)&&(t(this,zi).textContent=ht(e)),t(this,Ft)&&(r&&!t(this,Ye)&&(t(this,Ft).removeAttribute("hidden"),n(this,Ye,!0)),t(this,Ye)&&(t(this,Ft).setAttribute("data-on",String(t(this,Ge))),t(this,Ft).title=t(this,Ge)?"On - click to turn off":"Off - click to turn on"));const s=this.root.querySelector("[part=row-value]");s&&(s.textContent=ht(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,Ge)?"off":"on",attributes:{}}}}zi=new WeakMap,Ft=new WeakMap,Ge=new WeakMap,Ye=new WeakMap;const an={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",pouring:"M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z","snowy-rainy":"M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z",hail:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z","lightning-rainy":"M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z","windy-variant":"M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},bs=an.cloudy,ys="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,1A1,1 0 0,1 13,2L13,2.01C13,2.01 14.35,3.56 15.72,5.55C17.09,7.54 18.5,9.93 18.5,12.5A6.5,6.5 0 0,1 12,19A6.5,6.5 0 0,1 5.5,12.5C5.5,9.93 6.91,7.54 8.28,5.55C9.65,3.56 11,2.01 11,2.01L11,2A1,1 0 0,1 12,1Z",xs="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",ws="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",_s=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Mr(p,v){const e=an[p]??bs;return`<svg viewBox="0 0 24 24" width="${v}" height="${v}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Hr(p){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${p}" fill="currentColor"/></svg>`}const Cs=`
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
  `;class As extends y{constructor(){super(...arguments);o(this,k);o(this,Ri,null);o(this,Ue,null);o(this,ji,null);o(this,Oi,null);o(this,Vi,null);o(this,Fi,null);o(this,ut,null);o(this,Wt,null);o(this,yt,null);o(this,Wi,null);o(this,Ni,null);o(this,Xe,null);o(this,Ke,null)}render(){this.root.innerHTML=`
        <style>${Cs}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-weather-main">
              <span class="hrv-weather-icon">${Mr("cloudy",44)}</span>
              <span class="hrv-weather-temp">--<span class="hrv-weather-unit"></span></span>
            </div>
            <span class="hrv-weather-cond" aria-live="polite">--</span>
            <div class="hrv-weather-stats">
              <span class="hrv-weather-stat" data-stat="humidity">
                ${Hr(ys)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="wind">
                ${Hr(xs)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="pressure">
                ${Hr(ws)}
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
      `,n(this,Ri,this.root.querySelector(".hrv-weather-icon")),n(this,Ue,this.root.querySelector(".hrv-weather-temp")),n(this,ji,this.root.querySelector(".hrv-weather-cond")),n(this,Oi,this.root.querySelector("[data-stat=humidity] [data-value]")),n(this,Vi,this.root.querySelector("[data-stat=wind] [data-value]")),n(this,Fi,this.root.querySelector("[data-stat=pressure] [data-value]")),n(this,ut,this.root.querySelector(".hrv-forecast-strip")),n(this,Wt,this.root.querySelector(".hrv-forecast-toggle")),n(this,yt,this.root.querySelector(".hrv-forecast-scroll-track")),n(this,Wi,this.root.querySelector(".hrv-forecast-scroll-thumb")),t(this,ut)&&(t(this,ut).addEventListener("scroll",()=>l(this,k,Kr).call(this),{passive:!0}),n(this,Ni,Fn(t(this,ut)))),t(this,yt)&&t(this,yt).addEventListener("pointerdown",e=>l(this,k,Vn).call(this,e)),this.renderCompanions(),z(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}destroy(){var e;(e=t(this,Ni))==null||e.call(this),n(this,Ni,null)}applyState(e,i){const r=e||"cloudy";t(this,Ri)&&(t(this,Ri).innerHTML=Mr(r,44));const s=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,ji)&&(t(this,ji).textContent=s);const a=i.temperature??i.native_temperature;let d=String(i.temperature_unit||i.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(d&&!/^°/.test(d)&&d.length<=2&&(d=`°${d}`),t(this,Ue)){const u=t(this,Ue).querySelector(".hrv-weather-unit");t(this,Ue).firstChild.textContent=a!=null?Math.round(Number(a)):"--",u&&(u.textContent=d)}if(t(this,Oi)){const u=i.humidity;t(this,Oi).textContent=u!=null?`${u}%`:"--"}if(t(this,Vi)){const u=i.wind_speed,f=i.wind_speed_unit??"";t(this,Vi).textContent=u!=null?`${u} ${f}`.trim():"--"}if(t(this,Fi)){const u=i.pressure,f=i.pressure_unit??"";t(this,Fi).textContent=u!=null?`${u} ${f}`.trim():"--"}const h=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;n(this,Xe,h?i.forecast_daily??i.forecast??null:null),n(this,Ke,h?i.forecast_hourly??null:null),l(this,k,Ur).call(this),l(this,k,Xr).call(this),this.announceState(`${this.def.friendly_name}, ${s}, ${a??"--"} ${d}`)}}Ri=new WeakMap,Ue=new WeakMap,ji=new WeakMap,Oi=new WeakMap,Vi=new WeakMap,Fi=new WeakMap,ut=new WeakMap,Wt=new WeakMap,yt=new WeakMap,Wi=new WeakMap,Ni=new WeakMap,k=new WeakSet,Se=function(){return this.config._forecastMode??"daily"},$r=function(e){this.config._forecastMode=e},Xe=new WeakMap,Ke=new WeakMap,Ur=function(){if(!t(this,Wt))return;const e=Array.isArray(t(this,Xe))&&t(this,Xe).length>0,i=Array.isArray(t(this,Ke))&&t(this,Ke).length>0;if(!e&&!i){t(this,Wt).textContent="";return}e&&!i&&n(this,k,"daily",$r),!e&&i&&n(this,k,"hourly",$r),e&&i?(t(this,Wt).textContent=t(this,k,Se)==="daily"?"Hourly":"5-Day",t(this,Wt).onclick=()=>{n(this,k,t(this,k,Se)==="daily"?"hourly":"daily",$r),l(this,k,Ur).call(this),l(this,k,Xr).call(this)}):(t(this,Wt).textContent="",t(this,Wt).onclick=null)},Xr=function(){if(!t(this,ut))return;const e=t(this,k,Se)==="hourly"?t(this,Ke):t(this,Xe);if(t(this,ut).setAttribute("data-mode",t(this,k,Se)),!Array.isArray(e)||e.length===0){t(this,ut).innerHTML="",t(this,yt)&&(t(this,yt).hidden=!0);return}const i=t(this,k,Se)==="daily"?e.slice(0,5):e;t(this,ut).innerHTML=i.map(r=>{const s=new Date(r.datetime);let a;t(this,k,Se)==="hourly"?a=s.toLocaleTimeString([],{hour:"numeric"}):a=_s[s.getDay()]??"";const d=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",h=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="hrv-forecast-day" role="listitem">
            <span class="hrv-forecast-day-name">${c(String(a))}</span>
            ${Mr(r.condition||"cloudy",18)}
            <span class="hrv-forecast-temps">
              ${c(String(d))}${h!=null?`/<span class="hrv-forecast-lo">${c(String(h))}</span>`:""}
            </span>
          </div>`}).join(""),t(this,k,Se)==="hourly"?requestAnimationFrame(()=>l(this,k,Kr).call(this)):t(this,yt)&&(t(this,yt).hidden=!0)},Kr=function(){const e=t(this,ut),i=t(this,yt),r=t(this,Wi);if(!e||!i||!r)return;const s=e.scrollWidth>e.clientWidth?e.clientWidth/e.scrollWidth:1;if(s>=1){i.hidden=!0;return}i.hidden=!1;const a=i.clientWidth,d=Math.max(20,s*a),h=a-d,u=e.scrollLeft/(e.scrollWidth-e.clientWidth);r.style.width=`${d}px`,r.style.left=`${u*h}px`},Vn=function(e){const i=t(this,ut),r=t(this,yt),s=t(this,Wi);if(!i||!r||!s)return;e.preventDefault();const a=r.getBoundingClientRect(),d=parseFloat(s.style.width)||20,h=w=>{const C=w-a.left-d/2,T=a.width-d,b=Math.max(0,Math.min(1,C/T));i.scrollLeft=b*(i.scrollWidth-i.clientWidth)};h(e.clientX);const u=w=>h(w.clientX),f=()=>{window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",f)};window.addEventListener("pointermove",u),window.addEventListener("pointerup",f)};const Ss=`
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
  `;class $s extends y{constructor(){super(...arguments);o(this,ne,null);o(this,Zi,null);o(this,se,!1);o(this,vr,"unknown")}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${Ss}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-toggle" type="button" aria-label="${c(this.def.friendly_name)}"></button></span>`:'<span part="row-control"><span part="row-state"></span></span>'}
          </div>
          <div part="card-body">
            ${e?`
              <button class="hrv-lock-icon-btn" type="button"
                aria-pressed="false"
                aria-label="${c(this.def.friendly_name)} - Lock/Unlock">
                <span part="lock-icon" aria-hidden="true"></span>
              </button>
            `:`
              <div class="hrv-lock-ro-circle" data-locked="false"
                role="img" aria-label="${c(this.def.friendly_name)}" title="Read-only">
                <span part="lock-icon" aria-hidden="true"></span>
              </div>
            `}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,ne,this.root.querySelector(".hrv-lock-icon-btn")),n(this,Zi,this.root.querySelector(".hrv-lock-ro-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"lock-icon"),e){const i=()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand(t(this,se)?"unlock":"lock",{})};t(this,ne)&&this._attachGestureHandlers(t(this,ne),{onTap:i});const r=this.root.querySelector("[part=row-toggle]");r&&this._attachGestureHandlers(r,{onTap:i})}this.renderCompanions(),z(this.root)}applyState(e,i){n(this,vr,e),n(this,se,e==="locked");const r=e==="jammed",a=r||(e==="locking"||e==="unlocking")||e==="unavailable"||e==="unknown";t(this,ne)&&(t(this,ne).setAttribute("aria-pressed",String(t(this,se))),t(this,ne).disabled=a),t(this,Zi)&&t(this,Zi).setAttribute("data-locked",String(t(this,se)));const d=this.root.querySelector("[part=row-toggle]");d&&(d.setAttribute("aria-pressed",String(t(this,se))),d.disabled=a);const h=this.root.querySelector("[part=row-state]");h&&(h.textContent=ht(e));const u=r?"mdi:lock-alert":t(this,se)?"mdi:lock":"mdi:lock-open",f=this.def.icon_state_map?.[e]??this.def.icon??u;this.renderIcon(this.resolveIcon(f,u),"lock-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}ne=new WeakMap,Zi=new WeakMap,se=new WeakMap,vr=new WeakMap;const Er=`
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
  `;class ln extends y{constructor(){super(...arguments);o(this,oe,null);o(this,fr,"unknown")}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${Er}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-run-btn" type="button" aria-label="${c(this.def.friendly_name)} - Run">Run</button></span>`:""}
          </div>
          <div part="card-body">
            <button class="hrv-action-icon-btn" type="button"
              aria-label="${c(this.def.friendly_name)} - Run"
              ${e?"":"disabled"}>
              <span part="card-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,oe,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),e){const i=()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})};t(this,oe)&&this._attachGestureHandlers(t(this,oe),{onTap:i});const r=this.root.querySelector("[part=row-run-btn]");r&&this._attachGestureHandlers(r,{onTap:i})}this.renderCompanions(),z(this.root)}applyState(e,i){n(this,fr,e);const r=this.def.capabilities==="read-write",s=e==="on",a=!r||s||e==="unavailable"||e==="unknown";t(this,oe)&&(t(this,oe).disabled=a,t(this,oe).dataset.running=String(s));const d=this.root.querySelector("[part=row-run-btn]");d&&(d.disabled=a);const h=s?"mdi:script-text":"mdi:script-text-play",u=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(u,h),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="turn_on"?{state:"on",attributes:{}}:null}}oe=new WeakMap,fr=new WeakMap,sr(ln,"staleOnMount",!1);class hn extends y{constructor(){super(...arguments);o(this,_e,null);o(this,St,null);o(this,mr,"unknown")}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${Er}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-trigger-btn" type="button" aria-label="${c(this.def.friendly_name)} - Trigger">Trigger</button></span>`:""}
          </div>
          <div part="card-body">
            <button class="hrv-action-icon-btn" type="button"
              aria-label="${c(this.def.friendly_name)} - Trigger"
              ${e?"":"disabled"}>
              <span part="card-icon" aria-hidden="true"></span>
            </button>
            ${e?'<button part="enable-toggle" type="button"></button>':""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,_e,this.root.querySelector(".hrv-action-icon-btn")),n(this,St,this.root.querySelector("[part=enable-toggle]")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),e){const i=()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("trigger",{})};t(this,_e)&&this._attachGestureHandlers(t(this,_e),{onTap:i});const r=this.root.querySelector("[part=row-trigger-btn]");r&&this._attachGestureHandlers(r,{onTap:i}),this._attachGestureHandlers(t(this,St),{onTap:()=>{const s=t(this,St)?.getAttribute("aria-pressed")==="true";this.config.card?.sendCommand(s?"turn_off":"turn_on",{})}})}this.renderCompanions(),z(this.root)}applyState(e,i){n(this,mr,e);const s=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,_e)&&(t(this,_e).disabled=s),t(this,St)&&(t(this,St).disabled=s,t(this,St).textContent=e==="on"?"Enabled":"Disabled",t(this,St).setAttribute("aria-pressed",String(e==="on")),t(this,St).setAttribute("aria-label",`${this.def.friendly_name} - ${e==="on"?"Disable":"Enable"}`));const a=this.root.querySelector("[part=row-trigger-btn]");a&&(a.disabled=s);const d=e==="on"?"mdi:robot":"mdi:robot-off",h=this.def.icon_state_map?.[e]??this.def.icon??d;this.renderIcon(this.resolveIcon(h,d),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}predictState(e,i){return e==="turn_on"?{state:"on",attributes:{}}:e==="turn_off"?{state:"off",attributes:{}}:null}}_e=new WeakMap,St=new WeakMap,mr=new WeakMap,sr(hn,"staleOnMount",!1);class Tr extends y{constructor(){super(...arguments);o(this,Ce,null)}render(){const e=this.def.capabilities==="read-write";if(this.root.innerHTML=`
        <style>${Er}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            ${e?`<span part="row-control"><button part="row-press-btn" type="button" aria-label="${c(this.def.friendly_name)} - Press">Press</button></span>`:""}
          </div>
          <div part="card-body">
            <button class="hrv-action-icon-btn" type="button"
              aria-label="${c(this.def.friendly_name)} - Press"
              ${e?"":"disabled"}>
              <span part="card-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Ce,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),e){const i=()=>{const s=this.config.gestureConfig?.tap;if(s){this._runAction(s);return}this.config.card?.sendCommand("press",{})};t(this,Ce)&&this._attachGestureHandlers(t(this,Ce),{onTap:i});const r=this.root.querySelector("[part=row-press-btn]");r&&this._attachGestureHandlers(r,{onTap:i})}this.renderCompanions(),z(this.root)}applyState(e,i){const s=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,Ce)&&(t(this,Ce).disabled=s);const a=this.root.querySelector("[part=row-press-btn]");a&&(a.disabled=s);const d=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(d,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Ce=new WeakMap,sr(Tr,"staleOnMount",!1);const ks=`
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
  `;class qr extends y{constructor(){super(...arguments);o(this,Gi,null)}render(){this.root.innerHTML=`
        <style>${ks}${W}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${c(this.def.friendly_name)}</span>
            <span part="row-control"><span part="row-value"></span></span>
          </div>
          <div part="card-body">
            <div class="hrv-person-circle" data-home="false"
              role="img" aria-label="${c(this.def.friendly_name)}">
              <span part="person-icon" aria-hidden="true"></span>
            </div>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Gi,this.root.querySelector(".hrv-person-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"person-icon"),this.renderCompanions(),z(this.root)}applyState(e,i){const r=e==="home";t(this,Gi)&&t(this,Gi).setAttribute("data-home",String(r));const s=e==="not_home"?"Away":e==="home"?"Home":ht(e),a=this.root.querySelector("[part=row-value]");a&&(a.textContent=s);const d=e==="not_home"?"mdi:account-off":"mdi:home-account",h=this.def.icon_state_map?.[e]??this.def.icon??d;this.renderIcon(this.resolveIcon(h,d),"person-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Gi=new WeakMap,sr(qr,"staleOnMount",!0),S._renderers=S._renderers||{};const Ls=document.currentScript&&document.currentScript.dataset.rendererId||"minimus";S._renderers[Ls]={light:Kn,fan:Qn,lock:$s,script:ln,automation:hn,button:Tr,input_button:Tr,climate:is,binary_sensor:ns,cover:os,input_boolean:nn,input_number:en,number:en,input_select:rn,select:rn,media_player:ds,remote:ps,sensor:dr,"sensor.temperature":dr,"sensor.humidity":dr,"sensor.battery":dr,switch:nn,person:qr,device_tracker:qr,event:on,timer:ms,weather:As,generic:on,badge:null}})();})();
