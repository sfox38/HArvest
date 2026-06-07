(()=>{var ko=Object.defineProperty;var Mo=(w,m,p)=>m in w?ko(w,m,{enumerable:!0,configurable:!0,writable:!0,value:p}):w[m]=p;var Lr=(w,m,p)=>(Mo(w,typeof m!="symbol"?m+"":m,p),p),Tn=(w,m,p)=>{if(!m.has(w))throw TypeError("Cannot "+p)};var t=(w,m,p)=>(Tn(w,m,"read from private field"),p?p.call(w):m.get(w)),n=(w,m,p)=>{if(m.has(w))throw TypeError("Cannot add the same private member more than once");m instanceof WeakSet?m.add(w):m.set(w,p)},s=(w,m,p,Gt)=>(Tn(w,m,"write to private field"),Gt?Gt.call(w,p):m.set(w,p),p);var d=(w,m,p)=>(Tn(w,m,"access private method"),p);(function(){"use strict";var Ut,I,ir,V,bt,C,rt,Xe,Ke,at,pt,dt,ut,ye,Je,U,F,yt,Qe,ti,Hn,Eo,k,Ir,as,qr,ds,Dr,hs,Pr,ls,ei,mn,ii,gn,zr,cs,Xt,Ki,Br,ps,Rr,us,rr,In,jr,vs,nr,qn,Or,fs,vt,X,Vr,W,ri,B,xt,wt,Ct,N,L,Kt,Dt,Z,M,xe,ni,si,oi,bn,we,Sr,sr,Dn,ai,yn,or,Pn,ar,zn,Jt,Ji,Fr,ms,Wr,gs,dr,Bn,Nr,bs,hr,Rn,Zr,ys,di,xn,Yr,xs,nt,Pt,_t,hi,Qt,li,ci,pi,K,J,ui,vi,fi,mi,R,Ce,At,Q,tt,$t,gi,bi,yi,Lt,te,_e,xi,wi,Ci,_i,Ai,lr,$i,cr,jn,Gr,ws,Ur,Cs,pr,On,Ae,kr,ur,Vn,Li,wn,Xr,_s,Kr,As,vr,Fn,fr,Wn,Jr,$s,Qr,Ls,$e,Le,St,E,Se,ke,Me,zt,kt,mr,gr,br,Si,Cn,tn,Ss,Ee,Bt,q,j,ki,ee,ie,Rt,D,st,ft,jt,re,en,ks,rn,Ms,ne,Qi,Mi,_n,nn,Es,se,tr,Y,P,He,sn,oe,Ei,Ot,Te,Vt,ae,de,et,on,Hs,an,Ts,yr,Nn,xr,Zn,he,er,Ft,Hi,Ti,Ie,qe,Mt,H,De,Pe,ze,Et,Wt,Be,Re,wr,Ii,An,dn,Is,qi,Di,Pi,Ht,zi,je,ht,Nt,le,ce,Oe,Bi,Ri,mt,ji,hn,qs,ln,Ds,cn,Ps,Ve,Mr,Oi,Tt,Fe,We,Vi,Ne,Fi,Wi,Ni,Zi,ot,It,lt,Yi,Gi,it,me,$n,Ze,Ye,Cr,Yn,_r,Gn,Ar,Un,pn,zs,Zt,Ui,pe,un,Yt,vn,ue,fn,ve,Xi;const w=window.HArvest;if(!w||!w.renderers||!w.renderers.BaseCard){console.warn("[HArvest Minimus] HArvest not found - pack not loaded.");return}const m=w.renderers.BaseCard,p=window.HArvest.esc;function Gt(c,v){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,c.apply(this,i)},v)}}function Ge(c){return c?c.charAt(0).toUpperCase()+c.slice(1).replace(/_/g," "):""}const z=`
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
  `;function Bs(c){if(!c)return()=>{};const v=80,e=1.6,i=.96,r=.04;let o=null,a=0,h=0,l=0,u=!1,f=0;const g=[],y=()=>{f&&(cancelAnimationFrame(f),f=0)},S=x=>{for(;g.length&&g[0].t<x-v;)g.shift();if(g.length<2)return 0;const O=g[0],qt=g[g.length-1],$r=qt.t-O.t;return $r<=0?0:(qt.x-O.x)/$r},_=()=>{if(Math.abs(l)<r)return;let x=performance.now();const O=qt=>{const $r=qt-x;if(x=qt,c.scrollLeft-=l*$r,l*=Math.pow(i,$r/16),Math.abs(l)<r){f=0,l=0;return}const So=c.scrollWidth-c.clientWidth;if(c.scrollLeft<=0||c.scrollLeft>=So){f=0,l=0;return}f=requestAnimationFrame(O)};f=requestAnimationFrame(O)},fe=x=>{if(c.scrollWidth<=c.clientWidth||x.pointerType==="touch")return;const O=x.target;if(!(O&&O!==c&&O.closest?.("button, a"))){y(),o=x.pointerId,a=x.clientX,h=c.scrollLeft,l=0,u=!1,g.length=0,g.push({x:x.clientX,t:x.timeStamp});try{c.setPointerCapture(o)}catch{}}},b=x=>{if(x.pointerId!==o)return;const O=x.clientX-a;Math.abs(O)>4&&(u=!0,c.dataset.dragging="true"),c.scrollLeft=h-O,g.push({x:x.clientX,t:x.timeStamp});const qt=x.timeStamp-v;for(;g.length>2&&g[0].t<qt;)g.shift()},A=x=>{if(x.pointerId===o){try{c.releasePointerCapture(o)}catch{}if(o=null,u){const O=qt=>{qt.stopPropagation(),qt.preventDefault()};window.addEventListener("click",O,{capture:!0,once:!0}),requestAnimationFrame(()=>c.removeAttribute("data-dragging")),l=S(x.timeStamp)*e,_()}g.length=0}};return c.addEventListener("pointerdown",fe),c.addEventListener("pointermove",b),c.addEventListener("pointerup",A),c.addEventListener("pointercancel",A),c.addEventListener("wheel",y,{passive:!0}),c.addEventListener("touchstart",y,{passive:!0}),()=>{y(),c.removeEventListener("pointerdown",fe),c.removeEventListener("pointermove",b),c.removeEventListener("pointerup",A),c.removeEventListener("pointercancel",A),c.removeEventListener("wheel",y),c.removeEventListener("touchstart",y)}}function T(c){c.querySelectorAll("[part=companion]").forEach(v=>{v.title=v.getAttribute("aria-label")??""})}const Rs=60,js=60,ge=48,G=225,$=270,gt=2*Math.PI*ge*($/360);function Os(c){return c*Math.PI/180}function ct(c){const v=Os(c);return{x:Rs+ge*Math.cos(v),y:js-ge*Math.sin(v)}}function Vs(){const c=ct(G),v=ct(G-$);return`M ${c.x} ${c.y} A ${ge} ${ge} 0 1 1 ${v.x} ${v.y}`}const Ue=Vs(),be=["brightness","temp","color"],Er=120;function Xn(c){const v=$/Er;let e="";for(let i=0;i<Er;i++){const r=G-i*v,o=G-(i+1)*v,a=ct(r),h=ct(o),l=`M ${a.x} ${a.y} A ${ge} ${ge} 0 0 1 ${h.x} ${h.y}`,u=i===0||i===Er-1?"round":"butt";e+=`<path d="${l}" stroke="${c(i/Er)}" fill="none" stroke-width="8" stroke-linecap="${u}" />`}return e}const Fs=Xn(c=>`hsl(${Math.round(c*360)},100%,50%)`),Ws=Xn(c=>{const e=Math.round(143+112*c),i=Math.round(255*c);return`rgb(255,${e},${i})`}),Ln=`
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
  `,Ns=`
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
  `;class Zs extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,Hn);n(this,Ir);n(this,qr);n(this,Dr);n(this,Pr);n(this,ei);n(this,ii);n(this,zr);n(this,Xt);n(this,Br);n(this,Rr);n(this,rr);n(this,jr);n(this,nr);n(this,Or);n(this,Ut,null);n(this,I,null);n(this,ir,null);n(this,V,null);n(this,bt,null);n(this,C,null);n(this,rt,null);n(this,Xe,null);n(this,Ke,null);n(this,at,0);n(this,pt,4e3);n(this,dt,0);n(this,ut,!1);n(this,ye,!1);n(this,Je,null);n(this,U,0);n(this,F,2e3);n(this,yt,6500);n(this,Qe,void 0);n(this,ti,new Map);n(this,k,[]);s(this,Qe,Gt(d(this,Or,fs).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_brightness!==!1&&i.includes("brightness"),a=r.show_color_temp!==!1&&i.includes("color_temp"),h=r.show_rgb!==!1&&i.includes("rgb_color"),l=e&&(o||a||h),u=[o,a,h].filter(Boolean).length,f=e&&u>1;s(this,F,this.def.feature_config?.min_color_temp_kelvin??2e3),s(this,yt,this.def.feature_config?.max_color_temp_kelvin??6500);const g=ct(G);this.root.innerHTML=`
        <style>${Ln}${Ns}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${l?"":"hrv-no-dial"}">
            ${l?`
              <div class="hrv-dial-column">
                <div class="hrv-dial-wrap" role="slider" tabindex="0" aria-valuemin="0"
                  aria-valuemax="100" aria-valuenow="0"
                  aria-label="${p(this.def.friendly_name)} brightness"
                  title="Drag to adjust">
                  <svg viewBox="0 0 120 120">
                    <g class="hrv-dial-segs hrv-dial-segs-color">${Fs}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${Ws}</g>
                    <path class="hrv-dial-track" d="${Ue}" />
                    <path class="hrv-dial-fill" d="${Ue}"
                      stroke-dasharray="${gt}"
                      stroke-dashoffset="${gt}" />
                    <circle class="hrv-dial-thumb" r="7"
                      cx="${g.x}" cy="${g.y}" />
                    <circle class="hrv-dial-thumb-hit" r="16"
                      cx="${g.x}" cy="${g.y}" />
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
                  ${h?'<span class="hrv-light-ro-dot" data-attr="color" title="Color"></span>':""}
                </div>
              </div>
            `}
            ${e?`
              <div class="hrv-dial-controls">
                ${f?`
                  <div class="hrv-mode-switch" data-pos="0" data-count="${u}"
                    role="radiogroup" aria-label="Dial mode" tabindex="0">
                    <div class="hrv-mode-switch-thumb"></div>
                    ${'<span class="hrv-mode-dot"></span>'.repeat(u)}
                  </div>
                `:""}
                ${l?`
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
          ${l?"":this.renderCompanionZoneHTML()}
        </div>
      `,s(this,Ut,this.root.querySelector("[part=toggle-button]")),s(this,I,this.root.querySelector(".hrv-dial-fill")),s(this,ir,this.root.querySelector(".hrv-dial-track")),s(this,V,this.root.querySelector(".hrv-dial-thumb")),s(this,bt,this.root.querySelector(".hrv-dial-pct")),s(this,C,this.root.querySelector(".hrv-dial-wrap")),s(this,Je,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,Xe,this.root.querySelector(".hrv-dial-segs-color")),s(this,Ke,this.root.querySelector(".hrv-dial-segs-temp")),s(this,rt,this.root.querySelector(".hrv-mode-switch")),t(this,Ut)&&(l||this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon"),this._attachGestureHandlers(t(this,Ut),{onTap:()=>{const y=this.config.gestureConfig?.tap;if(y){this._runAction(y);return}this.config.card?.sendCommand("toggle",{})}})),t(this,C)&&(t(this,C).addEventListener("pointerdown",d(this,Br,ps).bind(this)),t(this,C).addEventListener("pointermove",d(this,Rr,us).bind(this)),t(this,C).addEventListener("pointerup",d(this,rr,In).bind(this)),t(this,C).addEventListener("pointercancel",d(this,rr,In).bind(this)),t(this,C).addEventListener("keydown",d(this,jr,vs).bind(this))),l&&d(this,Ir,as).call(this),t(this,rt)&&(t(this,rt).addEventListener("click",d(this,qr,ds).bind(this)),t(this,rt).addEventListener("keydown",d(this,Pr,ls).bind(this)),t(this,rt).addEventListener("mousemove",d(this,Dr,hs).bind(this))),d(this,ii,gn).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(y=>{y.title=y.getAttribute("aria-label")??"Companion";const S=y.getAttribute("data-entity");if(S&&t(this,ti).has(S)){const _=t(this,ti).get(S);y.setAttribute("data-on",String(_==="on"))}})}applyState(e,i){if(s(this,ut,e==="on"),s(this,at,i?.brightness??0),i?.color_temp_kelvin!==void 0?s(this,pt,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&s(this,pt,Math.round(1e6/i.color_temp)),i?.hs_color)s(this,dt,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[o,a,h]=i.rgb_color;s(this,dt,Us(o,a,h))}if(t(this,Ut)&&(t(this,Ut).setAttribute("aria-pressed",String(t(this,ut))),this.root.querySelector("[part=card-icon]"))){const a=t(this,ut)?"mdi:lightbulb":"mdi:lightbulb-outline",h=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(h,a),"card-icon")}const r=this.root.querySelector(".hrv-light-ro-circle");if(r){r.setAttribute("data-on",String(t(this,ut)));const o=t(this,ut)?"mdi:lightbulb":"mdi:lightbulb-outline",a=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??o;this.renderIcon(this.resolveIcon(a,o),"ro-state-icon");const h=i?.color_mode,l=h==="color_temp",u=h&&h!=="color_temp",f=this.root.querySelector('[data-attr="brightness"]');if(f){const S=Math.round(t(this,at)/255*100);f.title=t(this,ut)?`Brightness: ${S}%`:"Brightness: off"}const g=this.root.querySelector('[data-attr="temp"]');g&&(g.title=`Color temperature: ${t(this,pt)}K`,g.style.display=u?"none":"");const y=this.root.querySelector('[data-attr="color"]');if(y)if(y.style.display=l?"none":"",i?.rgb_color){const[S,_,fe]=i.rgb_color;y.style.background=`rgb(${S},${_},${fe})`,y.title=`Color: rgb(${S}, ${_}, ${fe})`}else y.style.background=`hsl(${t(this,dt)}, 100%, 50%)`,y.title=`Color: hue ${t(this,dt)}°`}d(this,ei,mn).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,ut)?"off":"on",attributes:{brightness:t(this,at)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,r){t(this,ti).set(e,i),super.updateCompanionState(e,i,r)}}Ut=new WeakMap,I=new WeakMap,ir=new WeakMap,V=new WeakMap,bt=new WeakMap,C=new WeakMap,rt=new WeakMap,Xe=new WeakMap,Ke=new WeakMap,at=new WeakMap,pt=new WeakMap,dt=new WeakMap,ut=new WeakMap,ye=new WeakMap,Je=new WeakMap,U=new WeakMap,F=new WeakMap,yt=new WeakMap,Qe=new WeakMap,ti=new WeakMap,Hn=new WeakSet,Eo=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},k=new WeakMap,Ir=new WeakSet,as=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];s(this,k,[]),i[0]&&t(this,k).push(0),i[1]&&t(this,k).push(1),i[2]&&t(this,k).push(2),t(this,k).length===0&&t(this,k).push(0),t(this,k).includes(t(this,U))||s(this,U,t(this,k)[0])},qr=new WeakSet,ds=function(e){const i=t(this,rt).getBoundingClientRect(),r=e.clientY-i.top,o=i.height/3;let a;r<o?a=0:r<o*2?a=1:a=2,a=Math.min(a,t(this,k).length-1),s(this,U,t(this,k)[a]),t(this,rt).setAttribute("data-pos",String(a)),d(this,ii,gn).call(this),d(this,ei,mn).call(this)},Dr=new WeakSet,hs=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},r=t(this,rt).getBoundingClientRect(),o=Math.min(Math.floor((e.clientY-r.top)/(r.height/t(this,k).length)),t(this,k).length-1),a=be[t(this,k)[Math.max(0,o)]];t(this,rt).title=`Dial mode: ${i[a]??a}`},Pr=new WeakSet,ls=function(e){const i=t(this,k).indexOf(t(this,U));let r=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")r=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")r=Math.min(t(this,k).length-1,i+1);else return;e.preventDefault(),s(this,U,t(this,k)[r]),t(this,rt).setAttribute("data-pos",String(r)),d(this,ii,gn).call(this),d(this,ei,mn).call(this)},ei=new WeakSet,mn=function(){t(this,V)&&(t(this,V).style.transition="none"),t(this,I)&&(t(this,I).style.transition="none"),d(this,zr,cs).call(this),t(this,V)?.getBoundingClientRect(),t(this,I)?.getBoundingClientRect(),t(this,V)&&(t(this,V).style.transition=""),t(this,I)&&(t(this,I).style.transition="")},ii=new WeakSet,gn=function(){if(!t(this,I))return;const e=be[t(this,U)],i=e==="color"||e==="temp";t(this,ir).style.display=i?"none":"",t(this,I).style.display=i?"none":"",t(this,Xe)&&t(this,Xe).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,Ke)&&t(this,Ke).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,I).setAttribute("stroke-dasharray",String(gt));const r={brightness:"brightness",temp:"color temperature",color:"color"},o={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,C)?.setAttribute("aria-label",`${p(this.def.friendly_name)} ${r[e]}`),t(this,C)&&(t(this,C).title=o[e]),t(this,C)&&(t(this,C).setAttribute("aria-valuemin",e==="temp"?String(t(this,F)):"0"),t(this,C).setAttribute("aria-valuemax",e==="temp"?String(t(this,yt)):e==="color"?"360":"100"))},zr=new WeakSet,cs=function(){const e=be[t(this,U)];if(e==="brightness"){const i=t(this,ut)?t(this,at):0;d(this,Xt,Ki).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,pt)-t(this,F))/(t(this,yt)-t(this,F))*100);d(this,Xt,Ki).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,dt)/360*100);d(this,Xt,Ki).call(this,i)}},Xt=new WeakSet,Ki=function(e){const i=be[t(this,U)],r=e/100*$,o=ct(G-r);if(t(this,V)?.setAttribute("cx",String(o.x)),t(this,V)?.setAttribute("cy",String(o.y)),t(this,Je)?.setAttribute("cx",String(o.x)),t(this,Je)?.setAttribute("cy",String(o.y)),i==="brightness"){const a=gt*(1-e/100);t(this,I)?.setAttribute("stroke-dashoffset",String(a)),t(this,bt)&&(t(this,bt).textContent=e+"%"),t(this,C)?.setAttribute("aria-valuenow",String(e)),t(this,C)?.setAttribute("aria-valuetext",`${e}%`)}else if(i==="temp"){const a=Math.round(t(this,F)+e/100*(t(this,yt)-t(this,F)));t(this,bt)&&(t(this,bt).textContent=a+"K"),t(this,C)?.setAttribute("aria-valuenow",String(a)),t(this,C)?.setAttribute("aria-valuetext",`${a} kelvin`)}else{const a=Math.round(e/100*360);t(this,bt)&&(t(this,bt).textContent=a+"°"),t(this,C)?.setAttribute("aria-valuenow",String(a)),t(this,C)?.setAttribute("aria-valuetext",`${a} degrees`)}},Br=new WeakSet,ps=function(e){s(this,ye,!0),t(this,C)?.setPointerCapture(e.pointerId),d(this,nr,qn).call(this,e)},Rr=new WeakSet,us=function(e){t(this,ye)&&d(this,nr,qn).call(this,e)},rr=new WeakSet,In=function(e){if(t(this,ye)){s(this,ye,!1);try{t(this,C)?.releasePointerCapture(e.pointerId)}catch{}t(this,Qe).call(this)}},jr=new WeakSet,vs=function(e){const i=be[t(this,U)];let r=Math.round(i==="brightness"?t(this,at)/255*100:i==="temp"?(t(this,pt)-t(this,F))/(t(this,yt)-t(this,F))*100:t(this,dt)/360*100);if(e.key==="ArrowDown"||e.key==="ArrowLeft")r-=1;else if(e.key==="ArrowUp"||e.key==="ArrowRight")r+=1;else if(e.key==="PageDown")r-=10;else if(e.key==="PageUp")r+=10;else if(e.key==="Home")r=0;else if(e.key==="End")r=100;else return;e.preventDefault(),r=Math.max(0,Math.min(100,r)),i==="brightness"?s(this,at,Math.round(r/100*255)):i==="temp"?s(this,pt,Math.round(t(this,F)+r/100*(t(this,yt)-t(this,F)))):s(this,dt,Math.round(r/100*360)),d(this,Xt,Ki).call(this,r),t(this,Qe).call(this)},nr=new WeakSet,qn=function(e){if(!t(this,C))return;const i=t(this,C).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,h=-(e.clientY-o);let l=Math.atan2(h,a)*180/Math.PI;l<0&&(l+=360);let u=G-l;u<0&&(u+=360),u>$&&(u=u>$+(360-$)/2?0:$);const f=Math.round(u/$*100),g=be[t(this,U)];g==="brightness"?s(this,at,Math.round(f/100*255)):g==="temp"?s(this,pt,Math.round(t(this,F)+f/100*(t(this,yt)-t(this,F)))):s(this,dt,Math.round(f/100*360)),t(this,I)&&(t(this,I).style.transition="none"),t(this,V)&&(t(this,V).style.transition="none"),d(this,Xt,Ki).call(this,f)},Or=new WeakSet,fs=function(){t(this,I)&&(t(this,I).style.transition=""),t(this,V)&&(t(this,V).style.transition="");const e=be[t(this,U)];e==="brightness"?t(this,at)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,at)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,pt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,dt),100]})};const Ys=Ln+`
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
  `;class Gs extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,oi);n(this,we);n(this,sr);n(this,ai);n(this,or);n(this,ar);n(this,Jt);n(this,Fr);n(this,Wr);n(this,dr);n(this,Nr);n(this,hr);n(this,Zr);n(this,di);n(this,Yr);n(this,vt,null);n(this,X,null);n(this,Vr,null);n(this,W,null);n(this,ri,null);n(this,B,null);n(this,xt,null);n(this,wt,null);n(this,Ct,null);n(this,N,!1);n(this,L,0);n(this,Kt,!1);n(this,Dt,"forward");n(this,Z,null);n(this,M,[]);n(this,xe,!1);n(this,ni,null);n(this,si,void 0);s(this,si,Gt(d(this,Zr,ys).bind(this),300)),s(this,M,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},o=r.display_mode??null;let a=i.includes("set_speed");const h=r.show_oscillate!==!1&&i.includes("oscillate"),l=r.show_direction!==!1&&i.includes("direction"),u=r.show_presets!==!1&&i.includes("preset_mode");o==="on-off"&&(a=!1);let f=e&&a,g=f&&t(this,we,Sr),y=g&&!t(this,M).length,S=g&&!!t(this,M).length;o==="continuous"?(g=!1,y=!1,S=!1):o==="stepped"?(S=!1,y=g&&!t(this,M).length):o==="cycle"&&(g=!0,S=!0,y=!1);const _=ct(G);this.root.innerHTML=`
        <style>${Ys}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${f?y?"hrv-fan-horiz":"":"hrv-no-dial"}">
            ${f?`
              <div class="hrv-dial-column">
                ${y?`
                  <div class="hrv-fan-hspeed-wrap">
                    <div class="hrv-fan-hspeed-switch" role="group"
                      aria-label="${p(this.def.friendly_name)} speed"
                      data-on="false">
                      <div class="hrv-fan-hspeed-thumb"></div>
                      ${t(this,ai,yn).map((b,A)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${b}" data-idx="${A}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${A+1} (${b}%)"
                          title="Speed ${A+1} (${b}%)"></div>
                      `).join("")}
                    </div>
                  </div>
                `:S?`
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
                      <path class="hrv-dial-track" d="${Ue}" />
                      <path class="hrv-dial-fill" d="${Ue}"
                        stroke-dasharray="${gt}"
                        stroke-dashoffset="${gt}" />
                      <circle class="hrv-dial-thumb" r="7"
                        cx="${_.x}" cy="${_.y}" />
                      <circle class="hrv-dial-thumb-hit" r="16"
                        cx="${_.x}" cy="${_.y}" />
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
                ${h?`
                  <button class="hrv-fan-feat-btn" data-feat="oscillate" type="button"
                    aria-label="Oscillate: off" title="Oscillate: off"></button>
                `:""}
                ${l?`
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
      `,s(this,vt,this.root.querySelector("[part=toggle-button]")),s(this,X,this.root.querySelector(".hrv-dial-fill")),s(this,Vr,this.root.querySelector(".hrv-dial-track")),s(this,W,this.root.querySelector(".hrv-dial-thumb")),s(this,ri,this.root.querySelector(".hrv-dial-pct")),s(this,B,this.root.querySelector(".hrv-dial-wrap")),s(this,ni,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,xt,this.root.querySelector('[data-feat="oscillate"]')),s(this,wt,this.root.querySelector('[data-feat="direction"]')),s(this,Ct,this.root.querySelector('[data-feat="preset"]')),t(this,vt)&&!f&&(this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"fan-onoff-icon"),t(this,vt).setAttribute("data-animate",String(!!this.config.animate))),this._attachGestureHandlers(t(this,vt),{onTap:()=>{const b=this.config.gestureConfig?.tap;if(b){this._runAction(b);return}this.config.card?.sendCommand("toggle",{})}}),t(this,B)&&(t(this,B).addEventListener("pointerdown",d(this,Fr,ms).bind(this)),t(this,B).addEventListener("pointermove",d(this,Wr,gs).bind(this)),t(this,B).addEventListener("pointerup",d(this,dr,Bn).bind(this)),t(this,B).addEventListener("pointercancel",d(this,dr,Bn).bind(this)),t(this,B).addEventListener("keydown",d(this,Nr,bs).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const b=t(this,ai,yn);if(!b.length)return;let A;if(!t(this,N)||t(this,L)===0)A=b[0],s(this,N,!0),t(this,vt)?.setAttribute("aria-pressed","true");else{const x=b.findIndex(O=>O>t(this,L));A=x===-1?b[0]:b[x]}s(this,L,A),d(this,or,Pn).call(this),this.config.card?.sendCommand("set_percentage",{percentage:A})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(b=>{const A=()=>{const x=Number(b.getAttribute("data-pct"));t(this,N)||(s(this,N,!0),t(this,vt)?.setAttribute("aria-pressed","true")),s(this,L,x),d(this,ar,zn).call(this),this.config.card?.sendCommand("set_percentage",{percentage:x})};b.addEventListener("click",A),b.addEventListener("keydown",x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),A())})}),t(this,xt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,Kt)})}),t(this,wt)?.addEventListener("click",()=>{const b=t(this,Dt)==="forward"?"reverse":"forward";s(this,Dt,b),d(this,Jt,Ji).call(this),this.config.card?.sendCommand("set_direction",{direction:b})}),t(this,Ct)?.addEventListener("click",()=>{if(t(this,M).length){if(t(this,sr,Dn)){const b=t(this,Z)??t(this,M)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:b});return}if(t(this,Z)){const b=t(this,M).indexOf(t(this,Z));if(b===-1||b===t(this,M).length-1){s(this,Z,null),d(this,Jt,Ji).call(this);const A=t(this,oi,bn),x=Math.floor(t(this,L)/A)*A||A;this.config.card?.sendCommand("set_percentage",{percentage:x})}else{const A=t(this,M)[b+1];s(this,Z,A),d(this,Jt,Ji).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:A})}}else{const b=t(this,M)[0];s(this,Z,b),d(this,Jt,Ji).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:b})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(b=>{b.title=b.getAttribute("aria-label")??"Companion"})}applyState(e,i){s(this,N,e==="on"),s(this,L,i?.percentage??0),s(this,Kt,i?.oscillating??!1),s(this,Dt,i?.direction??"forward"),s(this,Z,i?.preset_mode??null),i?.preset_modes?.length&&s(this,M,i.preset_modes),t(this,vt)&&t(this,vt).setAttribute("aria-pressed",String(t(this,N)));const r=this.root.querySelector(".hrv-fan-ro-circle");r&&r.setAttribute("data-on",String(t(this,N))),t(this,we,Sr)&&!t(this,M).length?d(this,ar,zn).call(this):t(this,we,Sr)?d(this,or,Pn).call(this):d(this,Yr,xs).call(this),d(this,Jt,Ji).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,L)>0?`, ${Math.round(t(this,L))}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,N)?"off":"on",attributes:{percentage:t(this,L)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,Kt),direction:t(this,Dt),preset_mode:t(this,Z),preset_modes:t(this,M)}}:null}}vt=new WeakMap,X=new WeakMap,Vr=new WeakMap,W=new WeakMap,ri=new WeakMap,B=new WeakMap,xt=new WeakMap,wt=new WeakMap,Ct=new WeakMap,N=new WeakMap,L=new WeakMap,Kt=new WeakMap,Dt=new WeakMap,Z=new WeakMap,M=new WeakMap,xe=new WeakMap,ni=new WeakMap,si=new WeakMap,oi=new WeakSet,bn=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},we=new WeakSet,Sr=function(){return t(this,oi,bn)>1},sr=new WeakSet,Dn=function(){return t(this,we,Sr)&&t(this,M).length>0},ai=new WeakSet,yn=function(){const e=t(this,oi,bn),i=[];for(let r=1;r*e<=100.001;r++)i.push(r*e);return i},or=new WeakSet,Pn=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,N)));const i=t(this,N)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},ar=new WeakSet,zn=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),r=t(this,ai,yn);let o=-1;if(t(this,N)&&t(this,L)>0){let a=1/0;r.forEach((h,l)=>{const u=Math.abs(h-t(this,L));u<a&&(a=u,o=l)})}e.setAttribute("data-on",String(o>=0)),i&&o>=0&&(i.style.left=`${2+o*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((a,h)=>{a.setAttribute("data-active",String(h===o))})},Jt=new WeakSet,Ji=function(){const e=t(this,sr,Dn);if(t(this,xt)){const i=e||t(this,Kt),r=e?"Oscillate":`Oscillate: ${t(this,Kt)?"on":"off"}`;t(this,xt).setAttribute("data-on",String(i)),t(this,xt).setAttribute("aria-pressed",String(i)),t(this,xt).setAttribute("aria-label",r),t(this,xt).title=r}if(t(this,wt)){const i=t(this,Dt)!=="reverse",r=`Direction: ${t(this,Dt)}`;t(this,wt).setAttribute("data-on",String(i)),t(this,wt).setAttribute("aria-pressed",String(i)),t(this,wt).setAttribute("aria-label",r),t(this,wt).title=r}if(t(this,Ct)){const i=e||!!t(this,Z),r=e?t(this,Z)??t(this,M)[0]??"Preset":t(this,Z)?`Preset: ${t(this,Z)}`:"Preset: none";t(this,Ct).setAttribute("data-on",String(i)),t(this,Ct).setAttribute("aria-pressed",String(i)),t(this,Ct).setAttribute("aria-label",r),t(this,Ct).title=r}},Fr=new WeakSet,ms=function(e){s(this,xe,!0),t(this,B)?.setPointerCapture(e.pointerId),d(this,hr,Rn).call(this,e)},Wr=new WeakSet,gs=function(e){t(this,xe)&&d(this,hr,Rn).call(this,e)},dr=new WeakSet,Bn=function(e){if(t(this,xe)){s(this,xe,!1);try{t(this,B)?.releasePointerCapture(e.pointerId)}catch{}t(this,si).call(this)}},Nr=new WeakSet,bs=function(e){let i=t(this,L);if(e.key==="ArrowDown"||e.key==="ArrowLeft")i-=1;else if(e.key==="ArrowUp"||e.key==="ArrowRight")i+=1;else if(e.key==="PageDown")i-=10;else if(e.key==="PageUp")i+=10;else if(e.key==="Home")i=0;else if(e.key==="End")i=100;else return;e.preventDefault(),s(this,L,Math.max(0,Math.min(100,i))),d(this,di,xn).call(this,t(this,L)),t(this,si).call(this)},hr=new WeakSet,Rn=function(e){if(!t(this,B))return;const i=t(this,B).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,h=-(e.clientY-o);let l=Math.atan2(h,a)*180/Math.PI;l<0&&(l+=360);let u=G-l;u<0&&(u+=360),u>$&&(u=u>$+(360-$)/2?0:$),s(this,L,Math.round(u/$*100)),t(this,X)&&(t(this,X).style.transition="none"),t(this,W)&&(t(this,W).style.transition="none"),d(this,di,xn).call(this,t(this,L))},Zr=new WeakSet,ys=function(){t(this,X)&&(t(this,X).style.transition=""),t(this,W)&&(t(this,W).style.transition=""),t(this,L)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,L)})},di=new WeakSet,xn=function(e){const i=gt*(1-e/100),r=ct(G-e/100*$);t(this,X)?.setAttribute("stroke-dashoffset",String(i)),t(this,W)?.setAttribute("cx",String(r.x)),t(this,W)?.setAttribute("cy",String(r.y)),t(this,ni)?.setAttribute("cx",String(r.x)),t(this,ni)?.setAttribute("cy",String(r.y)),t(this,ri)&&(t(this,ri).textContent=`${e}%`),t(this,B)?.setAttribute("aria-valuenow",String(e)),t(this,B)?.setAttribute("aria-valuetext",`${e}%`)},Yr=new WeakSet,xs=function(){t(this,W)&&(t(this,W).style.transition="none"),t(this,X)&&(t(this,X).style.transition="none"),d(this,di,xn).call(this,t(this,N)?t(this,L):0),t(this,W)?.getBoundingClientRect(),t(this,X)?.getBoundingClientRect(),t(this,W)&&(t(this,W).style.transition=""),t(this,X)&&(t(this,X).style.transition="")};function Us(c,v,e){c/=255,v/=255,e/=255;const i=Math.max(c,v,e),r=Math.min(c,v,e),o=i-r;if(o===0)return 0;let a;return i===c?a=(v-e)/o%6:i===v?a=(e-c)/o+2:a=(c-v)/o+4,Math.round((a*60+360)%360)}const Xs=Ln+`
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
  `;class Ks extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,cr);n(this,Gr);n(this,Ur);n(this,pr);n(this,Ae);n(this,ur);n(this,Li);n(this,Xr);n(this,Kr);n(this,vr);n(this,fr);n(this,Jr);n(this,Qr);n(this,nt,null);n(this,Pt,null);n(this,_t,null);n(this,hi,null);n(this,Qt,!1);n(this,li,null);n(this,ci,null);n(this,pi,null);n(this,K,null);n(this,J,null);n(this,ui,null);n(this,vi,null);n(this,fi,null);n(this,mi,null);n(this,R,null);n(this,Ce,null);n(this,At,null);n(this,Q,null);n(this,tt,20);n(this,$t,"off");n(this,gi,null);n(this,bi,null);n(this,yi,null);n(this,Lt,16);n(this,te,32);n(this,_e,.5);n(this,xi,"°C");n(this,wi,[]);n(this,Ci,[]);n(this,_i,[]);n(this,Ai,[]);n(this,lr,{});n(this,$i,void 0);s(this,$i,Gt(d(this,Jr,$s).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),o=i.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),a=i.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),h=i.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);s(this,Lt,this.def.feature_config?.min_temp??16),s(this,te,this.def.feature_config?.max_temp??32),s(this,_e,this.def.feature_config?.temp_step??.5),s(this,xi,this.def.unit_of_measurement??"°C"),s(this,wi,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),s(this,Ci,this.def.feature_config?.fan_modes??[]),s(this,_i,this.def.feature_config?.preset_modes??[]),s(this,Ai,this.def.feature_config?.swing_modes??[]);const l=d(this,cr,jn).call(this,t(this,tt)),u=ct(G),f=ct(G-l/100*$),g=gt*(1-l/100),[y,S]=t(this,tt).toFixed(1).split(".");this.root.innerHTML=`
        <style>${Xs}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e&&r?`
              <div class="hrv-dial-wrap">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path class="hrv-dial-track" d="${Ue}"/>
                  <path class="hrv-dial-fill" d="${Ue}"
                    stroke-dasharray="${gt}" stroke-dashoffset="${g}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${p(y)}</span><span class="hrv-climate-temp-frac">.${p(S)}</span><span class="hrv-climate-temp-unit">${p(t(this,xi))}</span>
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
                  <span class="hrv-climate-ro-temp-int">${p(y)}</span><span class="hrv-climate-ro-temp-frac">.${p(S)}</span><span class="hrv-climate-ro-temp-unit">${p(t(this,xi))}</span>
                </div>
              </div>
            `:""}
            <div class="hrv-climate-grid">
              ${i.show_hvac_modes!==!1&&t(this,wi).length?`
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
              ${o&&t(this,Ci).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button"
                  ${e?'title="Change fan mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${h&&t(this,Ai).length?`
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
      `,s(this,nt,this.root.querySelector(".hrv-dial-wrap")),s(this,Pt,this.root.querySelector(".hrv-dial-fill")),s(this,_t,this.root.querySelector(".hrv-dial-thumb")),s(this,hi,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,li,this.root.querySelector(".hrv-climate-state-text")),s(this,ci,this.root.querySelector(".hrv-climate-temp-int")),s(this,pi,this.root.querySelector(".hrv-climate-temp-frac")),s(this,K,this.root.querySelector("[data-dir='-']")),s(this,J,this.root.querySelector("[data-dir='+']")),s(this,ui,this.root.querySelector("[data-feat=mode]")),s(this,vi,this.root.querySelector("[data-feat=fan]")),s(this,fi,this.root.querySelector("[data-feat=preset]")),s(this,mi,this.root.querySelector("[data-feat=swing]")),s(this,R,this.root.querySelector(".hrv-climate-dropdown")),t(this,nt)&&(t(this,nt).addEventListener("pointerdown",d(this,Xr,_s).bind(this)),t(this,nt).addEventListener("pointermove",d(this,Kr,As).bind(this)),t(this,nt).addEventListener("pointerup",d(this,vr,Fn).bind(this)),t(this,nt).addEventListener("pointercancel",d(this,vr,Fn).bind(this))),t(this,K)&&(t(this,K).addEventListener("click",()=>d(this,ur,Vn).call(this,-1)),t(this,K).addEventListener("pointerdown",()=>t(this,K).setAttribute("data-pressing","true")),t(this,K).addEventListener("pointerup",()=>t(this,K).removeAttribute("data-pressing")),t(this,K).addEventListener("pointerleave",()=>t(this,K).removeAttribute("data-pressing")),t(this,K).addEventListener("pointercancel",()=>t(this,K).removeAttribute("data-pressing"))),t(this,J)&&(t(this,J).addEventListener("click",()=>d(this,ur,Vn).call(this,1)),t(this,J).addEventListener("pointerdown",()=>t(this,J).setAttribute("data-pressing","true")),t(this,J).addEventListener("pointerup",()=>t(this,J).removeAttribute("data-pressing")),t(this,J).addEventListener("pointerleave",()=>t(this,J).removeAttribute("data-pressing")),t(this,J).addEventListener("pointercancel",()=>t(this,J).removeAttribute("data-pressing"))),e&&[t(this,ui),t(this,vi),t(this,fi),t(this,mi)].forEach(_=>{if(!_)return;const fe=_.getAttribute("data-feat");_.addEventListener("click",()=>d(this,Ur,Cs).call(this,fe)),_.addEventListener("pointerdown",()=>_.setAttribute("data-pressing","true")),_.addEventListener("pointerup",()=>_.removeAttribute("data-pressing")),_.addEventListener("pointerleave",()=>_.removeAttribute("data-pressing")),_.addEventListener("pointercancel",()=>_.removeAttribute("data-pressing"))}),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,lr,{...i}),s(this,$t,e),s(this,gi,i.fan_mode??null),s(this,bi,i.preset_mode??null),s(this,yi,i.swing_mode??null),!t(this,Qt)&&i.temperature!==void 0&&(s(this,tt,i.temperature),d(this,Li,wn).call(this)),t(this,li)&&(t(this,li).textContent=Ge(i.hvac_action??e));const r=this.root.querySelector(".hrv-climate-ro-temp-int"),o=this.root.querySelector(".hrv-climate-ro-temp-frac");if(r&&i.temperature!==void 0){s(this,tt,i.temperature);const[l,u]=t(this,tt).toFixed(1).split(".");r.textContent=l,o.textContent=`.${u}`}d(this,Qr,Ls).call(this);const a=i.hvac_action??e,h=Ge(a);this.announceState(`${this.def.friendly_name}, ${h}`)}predictState(e,i){const r={...t(this,lr)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:r}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,$t),attributes:{...r,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,$t),attributes:{...r,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,$t),attributes:{...r,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,$t),attributes:{...r,swing_mode:i.swing_mode}}:null}destroy(){t(this,At)&&(document.removeEventListener("pointerdown",t(this,At),!0),s(this,At,null)),t(this,Q)&&(window.removeEventListener("scroll",t(this,Q),!0),window.removeEventListener("resize",t(this,Q)),s(this,Q,null));try{t(this,R)?.hidePopover?.()}catch{}}}nt=new WeakMap,Pt=new WeakMap,_t=new WeakMap,hi=new WeakMap,Qt=new WeakMap,li=new WeakMap,ci=new WeakMap,pi=new WeakMap,K=new WeakMap,J=new WeakMap,ui=new WeakMap,vi=new WeakMap,fi=new WeakMap,mi=new WeakMap,R=new WeakMap,Ce=new WeakMap,At=new WeakMap,Q=new WeakMap,tt=new WeakMap,$t=new WeakMap,gi=new WeakMap,bi=new WeakMap,yi=new WeakMap,Lt=new WeakMap,te=new WeakMap,_e=new WeakMap,xi=new WeakMap,wi=new WeakMap,Ci=new WeakMap,_i=new WeakMap,Ai=new WeakMap,lr=new WeakMap,$i=new WeakMap,cr=new WeakSet,jn=function(e){return Math.max(0,Math.min(100,(e-t(this,Lt))/(t(this,te)-t(this,Lt))*100))},Gr=new WeakSet,ws=function(e){const i=t(this,Lt)+e/100*(t(this,te)-t(this,Lt)),r=Math.round(i/t(this,_e))*t(this,_e);return Math.max(t(this,Lt),Math.min(t(this,te),+r.toFixed(10)))},Ur=new WeakSet,Cs=function(e){if(t(this,Ce)===e){d(this,Ae,kr).call(this);return}t(this,Ce)&&d(this,Ae,kr).call(this),s(this,Ce,e);let i=[],r=null,o="",a="";switch(e){case"mode":i=t(this,wi),r=t(this,$t),o="set_hvac_mode",a="hvac_mode";break;case"fan":i=t(this,Ci),r=t(this,gi),o="set_fan_mode",a="fan_mode";break;case"preset":i=t(this,_i),r=t(this,bi),o="set_preset_mode",a="preset_mode";break;case"swing":i=t(this,Ai),r=t(this,yi),o="set_swing_mode",a="swing_mode";break}if(!i.length||!t(this,R))return;t(this,R).innerHTML=i.map(u=>`
        <button class="hrv-cf-option" data-active="${u===r}" role="option"
          aria-selected="${u===r}" type="button">
          ${p(Ge(u))}
        </button>
      `).join(""),t(this,R).querySelectorAll(".hrv-cf-option").forEach((u,f)=>{u.addEventListener("click",()=>{this.config.card?.sendCommand(o,{[a]:i[f]}),d(this,Ae,kr).call(this)})});const h=this.root.querySelector(`[data-feat="${e}"]`);try{t(this,R).showPopover?.()}catch{}d(this,pr,On).call(this,h),s(this,Q,()=>d(this,pr,On).call(this,h)),window.addEventListener("scroll",t(this,Q),!0),window.addEventListener("resize",t(this,Q));const l=u=>{u.composedPath().some(g=>g===this.root||g===this.root.host)||d(this,Ae,kr).call(this)};s(this,At,l),document.addEventListener("pointerdown",l,!0)},pr=new WeakSet,On=function(e){if(!t(this,R)||!e)return;const i=e.getBoundingClientRect(),r=window.innerHeight-i.bottom,o=i.top,a=Math.min(t(this,R).scrollHeight||280,280),h=Math.max(140,Math.round(i.width));t(this,R).style.left=`${Math.round(i.left)}px`,t(this,R).style.minWidth=`${h}px`,o>=a+8||o>r?t(this,R).style.top=`${Math.max(8,Math.round(i.top-a-6))}px`:t(this,R).style.top=`${Math.round(i.bottom+6)}px`},Ae=new WeakSet,kr=function(){s(this,Ce,null);try{t(this,R)?.hidePopover?.()}catch{}t(this,At)&&(document.removeEventListener("pointerdown",t(this,At),!0),s(this,At,null)),t(this,Q)&&(window.removeEventListener("scroll",t(this,Q),!0),window.removeEventListener("resize",t(this,Q)),s(this,Q,null))},ur=new WeakSet,Vn=function(e){const i=Math.round((t(this,tt)+e*t(this,_e))*100)/100;s(this,tt,Math.max(t(this,Lt),Math.min(t(this,te),i))),d(this,Li,wn).call(this),t(this,$i).call(this)},Li=new WeakSet,wn=function(){const e=d(this,cr,jn).call(this,t(this,tt)),i=gt*(1-e/100),r=ct(G-e/100*$);t(this,Pt)?.setAttribute("stroke-dashoffset",String(i)),t(this,_t)?.setAttribute("cx",String(r.x)),t(this,_t)?.setAttribute("cy",String(r.y)),t(this,hi)?.setAttribute("cx",String(r.x)),t(this,hi)?.setAttribute("cy",String(r.y));const[o,a]=t(this,tt).toFixed(1).split(".");t(this,ci)&&(t(this,ci).textContent=o),t(this,pi)&&(t(this,pi).textContent=`.${a}`)},Xr=new WeakSet,_s=function(e){s(this,Qt,!0),t(this,nt)?.setPointerCapture(e.pointerId),d(this,fr,Wn).call(this,e)},Kr=new WeakSet,As=function(e){t(this,Qt)&&d(this,fr,Wn).call(this,e)},vr=new WeakSet,Fn=function(e){if(t(this,Qt)){s(this,Qt,!1);try{t(this,nt)?.releasePointerCapture(e.pointerId)}catch{}t(this,Pt)&&(t(this,Pt).style.transition=""),t(this,_t)&&(t(this,_t).style.transition="")}},fr=new WeakSet,Wn=function(e){if(!t(this,nt))return;const i=t(this,nt).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,h=-(e.clientY-o);let l=Math.atan2(h,a)*180/Math.PI;l<0&&(l+=360);let u=G-l;u<0&&(u+=360),u>$&&(u=u>$+(360-$)/2?0:$),s(this,tt,d(this,Gr,ws).call(this,u/$*100)),t(this,Pt)&&(t(this,Pt).style.transition="none"),t(this,_t)&&(t(this,_t).style.transition="none"),d(this,Li,wn).call(this),t(this,$i).call(this)},Jr=new WeakSet,$s=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,tt)})},Qr=new WeakSet,Ls=function(){const e=(i,r)=>{if(!i)return;const o=i.querySelector(".hrv-cf-value");o&&(o.textContent=Ge(r??"None"))};e(t(this,ui),t(this,$t)),e(t(this,vi),t(this,gi)),e(t(this,fi),t(this,bi)),e(t(this,mi),t(this,yi))};const Js=`
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
  `;class Qs extends m{constructor(){super(...arguments);n(this,$e,null)}render(){this.root.innerHTML=`
        <style>${Js}${z}</style>
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
      `,s(this,$e,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"state-icon"),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=e==="on",o=this.formatStateLabel(e);t(this,$e)&&(t(this,$e).setAttribute("data-on",String(r)),t(this,$e).setAttribute("aria-label",`${this.def.friendly_name}: ${o}`));const a=r?"mdi:radiobox-marked":"mdi:radiobox-blank",h=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(h,a),"state-icon"),this.announceState(`${this.def.friendly_name}, ${o}`)}}$e=new WeakMap;const Kn='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',Jn='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',Sn='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',to=`
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
  `;class eo extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,Si);n(this,tn);n(this,Le,null);n(this,St,null);n(this,E,null);n(this,Se,null);n(this,ke,null);n(this,Me,null);n(this,zt,!1);n(this,kt,0);n(this,mr,"closed");n(this,gr,{});n(this,br,void 0);s(this,br,Gt(d(this,tn,Ss).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints??{}).show_position!==!1&&this.def.supported_features?.includes("set_position"),o=!this.def.supported_features||this.def.supported_features.includes("buttons");this.root.innerHTML=`
        <style>${to}${z}</style>
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
            ${e&&o?`
              <div class="hrv-cover-btns">
                <button class="hrv-cover-btn" data-action="open" type="button"
                  title="Open cover" aria-label="Open cover">${Kn}</button>
                <button class="hrv-cover-btn" data-action="stop" type="button"
                  title="Stop cover" aria-label="Stop cover">${Jn}</button>
                <button class="hrv-cover-btn" data-action="close" type="button"
                  title="Close cover" aria-label="Close cover">${Sn}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,Le,this.root.querySelector(".hrv-cover-slider-track")),s(this,St,this.root.querySelector(".hrv-cover-slider-fill")),s(this,E,this.root.querySelector(".hrv-cover-slider-thumb")),s(this,Se,this.root.querySelector("[data-action=open]")),s(this,ke,this.root.querySelector("[data-action=stop]")),s(this,Me,this.root.querySelector("[data-action=close]"));const a=this.root.querySelector("[part=cover-ro-icon]");if(a&&(a.innerHTML=Sn),t(this,Le)&&t(this,E)&&e){const h=u=>{s(this,zt,!0),t(this,E).style.transition="none",t(this,St).style.transition="none",d(this,Si,Cn).call(this,u),t(this,E).setPointerCapture(u.pointerId)};t(this,E).addEventListener("pointerdown",h),t(this,Le).addEventListener("pointerdown",u=>{u.target!==t(this,E)&&(s(this,zt,!0),t(this,E).style.transition="none",t(this,St).style.transition="none",d(this,Si,Cn).call(this,u),t(this,E).setPointerCapture(u.pointerId))}),t(this,E).addEventListener("pointermove",u=>{t(this,zt)&&d(this,Si,Cn).call(this,u)});const l=()=>{t(this,zt)&&(s(this,zt,!1),t(this,E).style.transition="",t(this,St).style.transition="",t(this,br).call(this))};t(this,E).addEventListener("pointerup",l),t(this,E).addEventListener("pointercancel",l)}[t(this,Se),t(this,ke),t(this,Me)].forEach(h=>{if(!h)return;const l=h.getAttribute("data-action");h.addEventListener("click",()=>{this.config.card?.sendCommand(`${l}_cover`,{})}),h.addEventListener("pointerdown",()=>h.setAttribute("data-pressing","true")),h.addEventListener("pointerup",()=>h.removeAttribute("data-pressing")),h.addEventListener("pointerleave",()=>h.removeAttribute("data-pressing")),h.addEventListener("pointercancel",()=>h.removeAttribute("data-pressing"))}),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,mr,e),s(this,gr,{...i});const r=e==="opening"||e==="closing",o=i.current_position;t(this,Se)&&(t(this,Se).disabled=!r&&o===100),t(this,ke)&&(t(this,ke).disabled=!r),t(this,Me)&&(t(this,Me).disabled=!r&&e==="closed"),i.current_position!==void 0&&!t(this,zt)&&(s(this,kt,i.current_position),t(this,St)&&(t(this,St).style.width=`${t(this,kt)}%`),t(this,E)&&(t(this,E).style.left=`${t(this,kt)}%`));const a=this.root.querySelector("[part=cover-ro-icon]");if(a){const h=e==="open"||e==="opening",l=e==="opening"||e==="closing";a.innerHTML=l?Jn:h?Kn:Sn}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const r={...t(this,gr)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,mr),attributes:r}:e==="set_cover_position"&&i.position!==void 0?(r.current_position=i.position,{state:i.position>0?"open":"closed",attributes:r}):null}}Le=new WeakMap,St=new WeakMap,E=new WeakMap,Se=new WeakMap,ke=new WeakMap,Me=new WeakMap,zt=new WeakMap,kt=new WeakMap,mr=new WeakMap,gr=new WeakMap,br=new WeakMap,Si=new WeakSet,Cn=function(e){const i=t(this,Le).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,kt,Math.round(r)),t(this,St).style.width=`${t(this,kt)}%`,t(this,E).style.left=`${t(this,kt)}%`},tn=new WeakSet,Ss=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,kt)})};const io=`
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
  `;class ro extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,en);n(this,rn);n(this,ne);n(this,Mi);n(this,nn);n(this,se);n(this,Ee,null);n(this,Bt,null);n(this,q,null);n(this,j,null);n(this,ki,null);n(this,ee,null);n(this,ie,null);n(this,Rt,!1);n(this,D,0);n(this,st,0);n(this,ft,100);n(this,jt,1);n(this,re,void 0);s(this,re,Gt(d(this,nn,Es).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints?.display_mode??null)!=="buttons";s(this,st,this.def.feature_config?.min??0),s(this,ft,this.def.feature_config?.max??100),s(this,jt,this.def.feature_config?.step??1);const o=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${io}${z}</style>
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
                  min="${t(this,st)}" max="${t(this,ft)}" step="${t(this,jt)}"
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
      `,s(this,Ee,this.root.querySelector(".hrv-num-slider-track")),s(this,Bt,this.root.querySelector(".hrv-num-slider-fill")),s(this,q,this.root.querySelector(".hrv-num-slider-thumb")),s(this,j,this.root.querySelector(".hrv-num-input")),s(this,ki,this.root.querySelector(".hrv-num-readonly-val")),s(this,ee,this.root.querySelector("[part=dec-btn]")),s(this,ie,this.root.querySelector("[part=inc-btn]")),t(this,Ee)&&t(this,q)){const a=l=>{s(this,Rt,!0),t(this,q).style.transition="none",t(this,Bt).style.transition="none",d(this,Mi,_n).call(this,l),t(this,q).setPointerCapture(l.pointerId)};t(this,q).addEventListener("pointerdown",a),t(this,Ee).addEventListener("pointerdown",l=>{l.target!==t(this,q)&&(s(this,Rt,!0),t(this,q).style.transition="none",t(this,Bt).style.transition="none",d(this,Mi,_n).call(this,l),t(this,q).setPointerCapture(l.pointerId))}),t(this,q).addEventListener("pointermove",l=>{t(this,Rt)&&d(this,Mi,_n).call(this,l)});const h=()=>{t(this,Rt)&&(s(this,Rt,!1),t(this,q).style.transition="",t(this,Bt).style.transition="",t(this,re).call(this))};t(this,q).addEventListener("pointerup",h),t(this,q).addEventListener("pointercancel",h)}t(this,j)&&t(this,j).addEventListener("input",()=>{const a=parseFloat(t(this,j).value);isNaN(a)||(s(this,D,Math.max(t(this,st),Math.min(t(this,ft),a))),d(this,ne,Qi).call(this),d(this,se,tr).call(this),t(this,re).call(this))}),t(this,ee)&&t(this,ee).addEventListener("click",()=>{s(this,D,+Math.max(t(this,st),t(this,D)-t(this,jt)).toFixed(10)),d(this,ne,Qi).call(this),t(this,j)&&(t(this,j).value=String(t(this,D))),d(this,se,tr).call(this),t(this,re).call(this)}),t(this,ie)&&t(this,ie).addEventListener("click",()=>{s(this,D,+Math.min(t(this,ft),t(this,D)+t(this,jt)).toFixed(10)),d(this,ne,Qi).call(this),t(this,j)&&(t(this,j).value=String(t(this,D))),d(this,se,tr).call(this),t(this,re).call(this)}),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=parseFloat(e);if(isNaN(r))return;s(this,D,r),t(this,Rt)||(d(this,ne,Qi).call(this),t(this,j)&&!this.isFocused(t(this,j))&&(t(this,j).value=String(r))),d(this,se,tr).call(this),t(this,ki)&&(t(this,ki).textContent=String(r));const o=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${o?` ${o}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}Ee=new WeakMap,Bt=new WeakMap,q=new WeakMap,j=new WeakMap,ki=new WeakMap,ee=new WeakMap,ie=new WeakMap,Rt=new WeakMap,D=new WeakMap,st=new WeakMap,ft=new WeakMap,jt=new WeakMap,re=new WeakMap,en=new WeakSet,ks=function(e){const i=t(this,ft)-t(this,st);return i===0?0:Math.max(0,Math.min(100,(e-t(this,st))/i*100))},rn=new WeakSet,Ms=function(e){const i=t(this,st)+e/100*(t(this,ft)-t(this,st)),r=Math.round(i/t(this,jt))*t(this,jt);return Math.max(t(this,st),Math.min(t(this,ft),+r.toFixed(10)))},ne=new WeakSet,Qi=function(){const e=d(this,en,ks).call(this,t(this,D));t(this,Bt)&&(t(this,Bt).style.width=`${e}%`),t(this,q)&&(t(this,q).style.left=`${e}%`)},Mi=new WeakSet,_n=function(e){const i=t(this,Ee).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,D,d(this,rn,Ms).call(this,r)),d(this,ne,Qi).call(this),t(this,j)&&(t(this,j).value=String(t(this,D))),d(this,se,tr).call(this)},nn=new WeakSet,Es=function(){this.config.card?.sendCommand("set_value",{value:t(this,D)})},se=new WeakSet,tr=function(){t(this,ee)&&(t(this,ee).disabled=t(this,D)<=t(this,st)),t(this,ie)&&(t(this,ie).disabled=t(this,D)>=t(this,ft))};const no=`
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
  `;class Qn extends m{constructor(){super(...arguments);n(this,on);n(this,an);n(this,yr);n(this,xr);n(this,he);n(this,Y,null);n(this,P,null);n(this,He,null);n(this,sn,"");n(this,oe,[]);n(this,Ei,"");n(this,Ot,!1);n(this,Te,[]);n(this,Vt,[]);n(this,ae,"pills");n(this,de,null);n(this,et,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";s(this,ae,i==="dropdown"?"dropdown":"pills"),s(this,oe,this.def.feature_config?.options??[]);const r=e?t(this,ae)==="dropdown"?`
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
        <style>${no}${z}</style>
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
      `,s(this,Y,this.root.querySelector(".hrv-is-selected")),s(this,P,this.root.querySelector(".hrv-is-dropdown")),s(this,He,this.root.querySelector(".hrv-is-grid")),s(this,Te,[]),s(this,Vt,[]),s(this,Ei,""),t(this,Y)&&e&&t(this,ae)==="dropdown"&&(t(this,Y).addEventListener("click",o=>{o.stopPropagation(),t(this,Ot)?d(this,he,er).call(this):d(this,xr,Zn).call(this)}),t(this,Y).addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" "||o.key==="ArrowDown")&&!t(this,Ot)?(o.preventDefault(),d(this,xr,Zn).call(this),t(this,Vt)[0]?.focus()):o.key==="Escape"&&t(this,Ot)&&(d(this,he,er).call(this),t(this,Y).focus())}),s(this,de,o=>{t(this,Ot)&&!this.root.host.contains(o.target)&&d(this,he,er).call(this)}),document.addEventListener("click",t(this,de))),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,sn,e);const r=i?.options,o=Array.isArray(r)&&r.length?r:t(this,oe);s(this,oe,o);const a=o.join("|");if(a!==t(this,Ei)&&(s(this,Ei,a),t(this,ae)==="dropdown"?d(this,an,Ts).call(this,o):d(this,on,Hs).call(this,o)),t(this,ae)==="dropdown"){const h=this.root.querySelector(".hrv-is-label");h&&(h.textContent=e);for(const l of t(this,Vt))l.setAttribute("data-active",String(l.dataset.option===e))}else{for(const l of t(this,Te))l.setAttribute("data-active",String(l.dataset.option===e));const h=this.root.querySelector(".hrv-is-label");h&&(h.textContent=e)}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{options:t(this,oe)}}:null}destroy(){t(this,de)&&(document.removeEventListener("click",t(this,de)),s(this,de,null)),t(this,et)&&(window.removeEventListener("scroll",t(this,et),!0),window.removeEventListener("resize",t(this,et)),s(this,et,null));try{t(this,P)?.hidePopover?.()}catch{}}}Y=new WeakMap,P=new WeakMap,He=new WeakMap,sn=new WeakMap,oe=new WeakMap,Ei=new WeakMap,Ot=new WeakMap,Te=new WeakMap,Vt=new WeakMap,ae=new WeakMap,de=new WeakMap,et=new WeakMap,on=new WeakSet,Hs=function(e){if(t(this,He)){t(this,He).innerHTML="",s(this,Te,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-pill",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i})}),t(this,He).appendChild(r),t(this,Te).push(r)}}},an=new WeakSet,Ts=function(e){if(t(this,P)){t(this,P).innerHTML="",s(this,Vt,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-option",r.role="option",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i}),d(this,he,er).call(this),t(this,Y)?.focus()}),r.addEventListener("keydown",o=>{const a=t(this,Vt),h=a.indexOf(r);o.key==="ArrowDown"?(o.preventDefault(),a[Math.min(h+1,a.length-1)]?.focus()):o.key==="ArrowUp"?(o.preventDefault(),h===0?t(this,Y)?.focus():a[h-1]?.focus()):o.key==="Escape"&&(d(this,he,er).call(this),t(this,Y)?.focus())}),t(this,P).appendChild(r),t(this,Vt).push(r)}}},yr=new WeakSet,Nn=function(){if(!t(this,P)||!t(this,Y))return;const e=t(this,Y).getBoundingClientRect(),i=window.innerHeight-e.bottom,r=e.top,o=Math.min(t(this,P).scrollHeight||280,280);t(this,P).style.left=`${Math.round(e.left)}px`,t(this,P).style.width=`${Math.round(e.width)}px`,i<o+8&&r>i?t(this,P).style.top=`${Math.max(8,Math.round(e.top-o-6))}px`:t(this,P).style.top=`${Math.round(e.bottom+6)}px`},xr=new WeakSet,Zn=function(){if(!(!t(this,P)||!t(this,oe).length)){try{t(this,P).showPopover?.()}catch{}t(this,Y)?.setAttribute("aria-expanded","true"),d(this,yr,Nn).call(this),s(this,et,()=>d(this,yr,Nn).call(this)),window.addEventListener("scroll",t(this,et),!0),window.addEventListener("resize",t(this,et)),s(this,Ot,!0)}},he=new WeakSet,er=function(){try{t(this,P)?.hidePopover?.()}catch{}t(this,Y)?.setAttribute("aria-expanded","false"),t(this,et)&&(window.removeEventListener("scroll",t(this,et),!0),window.removeEventListener("resize",t(this,et)),s(this,et,null)),s(this,Ot,!1)};const so=`
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
  `;class oo extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,Ii);n(this,dn);n(this,Ft,null);n(this,Hi,null);n(this,Ti,null);n(this,Ie,null);n(this,qe,null);n(this,Mt,null);n(this,H,null);n(this,De,null);n(this,Pe,null);n(this,ze,!1);n(this,Et,0);n(this,Wt,!1);n(this,Be,"idle");n(this,Re,{});n(this,wr,void 0);s(this,wr,this.debounce(d(this,dn,Is).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_transport!==!1,a=r.show_volume!==!1&&i.includes("volume_set"),h=i.includes("previous_track");if(this.root.innerHTML=`
        <style>${so}${z}</style>
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
                ${h?`
                  <button class="hrv-mp-btn" data-role="prev" type="button"
                    title="Previous track">
                    <span part="prev-icon" aria-hidden="true"></span>
                  </button>
                `:""}
                <button class="hrv-mp-btn" data-role="play" type="button"
                  title="Play">
                  <span part="play-icon" aria-hidden="true"></span>
                </button>
                ${h?`
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
      `,s(this,Ft,this.root.querySelector("[data-role=play]")),s(this,Hi,this.root.querySelector("[data-role=prev]")),s(this,Ti,this.root.querySelector("[data-role=next]")),s(this,Ie,this.root.querySelector(".hrv-mp-mute")),s(this,qe,this.root.querySelector(".hrv-mp-slider-track")),s(this,Mt,this.root.querySelector(".hrv-mp-slider-fill")),s(this,H,this.root.querySelector(".hrv-mp-slider-thumb")),s(this,De,this.root.querySelector(".hrv-mp-artist")),s(this,Pe,this.root.querySelector(".hrv-mp-title")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,Ft)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,Hi)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Ti)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,Ft),t(this,Hi),t(this,Ti)].forEach(l=>{l&&(l.addEventListener("pointerdown",()=>l.setAttribute("data-pressing","true")),l.addEventListener("pointerup",()=>l.removeAttribute("data-pressing")),l.addEventListener("pointerleave",()=>l.removeAttribute("data-pressing")),l.addEventListener("pointercancel",()=>l.removeAttribute("data-pressing")))}),t(this,Ie)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,ze)})),t(this,qe)&&t(this,H))){const l=f=>{s(this,Wt,!0),t(this,H).style.transition="none",t(this,Mt).style.transition="none",d(this,Ii,An).call(this,f),t(this,H).setPointerCapture(f.pointerId)};t(this,H).addEventListener("pointerdown",l),t(this,qe).addEventListener("pointerdown",f=>{f.target!==t(this,H)&&(s(this,Wt,!0),t(this,H).style.transition="none",t(this,Mt).style.transition="none",d(this,Ii,An).call(this,f),t(this,H).setPointerCapture(f.pointerId))}),t(this,H).addEventListener("pointermove",f=>{t(this,Wt)&&d(this,Ii,An).call(this,f)});const u=()=>{t(this,Wt)&&(s(this,Wt,!1),t(this,H).style.transition="",t(this,Mt).style.transition="",t(this,wr).call(this))};t(this,H).addEventListener("pointerup",u),t(this,H).addEventListener("pointercancel",u)}this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,Be,e),s(this,Re,i);const r=e==="playing",o=e==="paused";if(t(this,De)){const h=i.media_artist??"";t(this,De).textContent=h,t(this,De).title=h||"Artist"}if(t(this,Pe)){const h=i.media_title??"";t(this,Pe).textContent=h,t(this,Pe).title=h||"Title"}if(t(this,Ft)){t(this,Ft).setAttribute("data-playing",String(r));const h=r?"mdi:pause":"mdi:play";this.renderIcon(h,"play-icon"),this.def.capabilities==="read-write"&&(t(this,Ft).title=r?"Pause":"Play")}if(s(this,ze,!!i.is_volume_muted),t(this,Ie)){const h=t(this,ze)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(h,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,Ie).title=t(this,ze)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,Wt)&&(s(this,Et,Math.round(i.volume_level*100)),t(this,Mt)&&(t(this,Mt).style.width=`${t(this,Et)}%`),t(this,H)&&(t(this,H).style.left=`${t(this,Et)}%`));const a=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${a?` - ${a}`:""}`)}predictState(e,i){return e==="media_play_pause"?{state:t(this,Be)==="playing"?"paused":"playing",attributes:t(this,Re)}:e==="volume_mute"?{state:t(this,Be),attributes:{...t(this,Re),is_volume_muted:!!i.is_volume_muted}}:e==="volume_set"?{state:t(this,Be),attributes:{...t(this,Re),volume_level:i.volume_level}}:null}}Ft=new WeakMap,Hi=new WeakMap,Ti=new WeakMap,Ie=new WeakMap,qe=new WeakMap,Mt=new WeakMap,H=new WeakMap,De=new WeakMap,Pe=new WeakMap,ze=new WeakMap,Et=new WeakMap,Wt=new WeakMap,Be=new WeakMap,Re=new WeakMap,wr=new WeakMap,Ii=new WeakSet,An=function(e){const i=t(this,qe).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,Et,Math.round(r)),t(this,Mt).style.width=`${t(this,Et)}%`,t(this,H).style.left=`${t(this,Et)}%`},dn=new WeakSet,Is=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,Et)/100})};const ao=`
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
  `;class ho extends m{constructor(){super(...arguments);n(this,qi,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.tapAction?.data?.command??"power";this.root.innerHTML=`
        <style>${ao}${z}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-remote-circle" type="button"
              title="${e?p(i):"Read-only"}"
              aria-label="${p(this.def.friendly_name)} - ${p(i)}"
              ${e?"":"disabled"}>
              <span part="remote-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,qi,this.root.querySelector(".hrv-remote-circle"));const r=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(r,"remote-icon"),t(this,qi)&&e&&this._attachGestureHandlers(t(this,qi),{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}const a=this.config.tapAction?.data?.command??"power",h=this.config.tapAction?.data?.device??void 0,l=h?{command:a,device:h}:{command:a};this.config.card?.sendCommand("send_command",l)}}),this.renderCompanions(),T(this.root)}applyState(e,i){const r=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(r,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}qi=new WeakMap;const lo=`
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
  `;class Hr extends m{constructor(){super(...arguments);n(this,Di,null);n(this,Pi,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${lo}${z}</style>
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
      `,s(this,Di,this.root.querySelector(".hrv-sensor-val")),s(this,Pi,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){t(this,Di)&&(t(this,Di).textContent=e),t(this,Pi)&&i.unit_of_measurement!==void 0&&(t(this,Pi).textContent=i.unit_of_measurement);const r=i.unit_of_measurement??this.def.unit_of_measurement??"",o=this.root.querySelector("[part=card-body]");o&&(o.title=`${e}${r?` ${r}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${r?` ${r}`:""}`)}}Di=new WeakMap,Pi=new WeakMap;const co=`
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
  `;class ts extends m{constructor(){super(...arguments);n(this,Ht,null);n(this,zi,null);n(this,je,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${co}${z}</style>
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
      `,s(this,Ht,this.root.querySelector(".hrv-switch-track")),s(this,zi,this.root.querySelector(".hrv-switch-ro")),t(this,Ht)&&e&&this._attachGestureHandlers(t(this,Ht),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){s(this,je,e==="on");const r=e==="unavailable"||e==="unknown";t(this,Ht)&&(t(this,Ht).setAttribute("data-on",String(t(this,je))),t(this,Ht).title=t(this,je)?"On - click to turn off":"Off - click to turn on",t(this,Ht).disabled=r),t(this,zi)&&(t(this,zi).textContent=Ge(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,je)?"off":"on",attributes:{}}}}Ht=new WeakMap,zi=new WeakMap,je=new WeakMap;const po=`
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
  `;function Tr(c){c<0&&(c=0);const v=Math.floor(c/3600),e=Math.floor(c%3600/60),i=Math.floor(c%60),r=o=>String(o).padStart(2,"0");return v>0?`${v}:${r(e)}:${r(i)}`:`${r(e)}:${r(i)}`}function es(c){if(typeof c=="number")return c;if(typeof c!="string")return 0;const v=c.split(":").map(Number);return v.length===3?v[0]*3600+v[1]*60+v[2]:v.length===2?v[0]*60+v[1]:v[0]||0}class uo extends m{constructor(){super(...arguments);n(this,hn);n(this,ln);n(this,cn);n(this,Ve);n(this,ht,null);n(this,Nt,null);n(this,le,null);n(this,ce,null);n(this,Oe,null);n(this,Bi,"idle");n(this,Ri,{});n(this,mt,null);n(this,ji,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${po}${z}</style>
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
      `,s(this,ht,this.root.querySelector(".hrv-timer-display")),s(this,Nt,this.root.querySelector("[data-action=playpause]")),s(this,le,this.root.querySelector("[data-action=cancel]")),s(this,ce,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,Nt)?.addEventListener("click",()=>{const i=t(this,Bi)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,le)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,ce)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,Nt),t(this,le),t(this,ce)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,Bi,e),s(this,Ri,{...i}),s(this,mt,i.finishes_at??null),s(this,ji,i.remaining!=null?es(i.remaining):null),d(this,hn,qs).call(this,e),d(this,ln,Ds).call(this,e),e==="active"&&t(this,mt)?d(this,cn,Ps).call(this):d(this,Ve,Mr).call(this),t(this,ht)&&t(this,ht).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const r={...t(this,Ri)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,mt)&&(r.remaining=Math.max(0,(new Date(t(this,mt)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}ht=new WeakMap,Nt=new WeakMap,le=new WeakMap,ce=new WeakMap,Oe=new WeakMap,Bi=new WeakMap,Ri=new WeakMap,mt=new WeakMap,ji=new WeakMap,hn=new WeakSet,qs=function(e){const i=e==="idle",r=e==="active";if(t(this,Nt)){const o=r?"mdi:pause":"mdi:play",a=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(o,"playpause-icon"),t(this,Nt).title=a,t(this,Nt).setAttribute("aria-label",`${this.def.friendly_name} - ${a}`)}t(this,le)&&(t(this,le).disabled=i),t(this,ce)&&(t(this,ce).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},ln=new WeakSet,Ds=function(e){if(t(this,ht)){if(e==="idle"){const i=t(this,Ri).duration;t(this,ht).textContent=i?Tr(es(i)):"00:00";return}if(e==="paused"&&t(this,ji)!=null){t(this,ht).textContent=Tr(t(this,ji));return}if(e==="active"&&t(this,mt)){const i=Math.max(0,(new Date(t(this,mt)).getTime()-Date.now())/1e3);t(this,ht).textContent=Tr(i)}}},cn=new WeakSet,Ps=function(){d(this,Ve,Mr).call(this),s(this,Oe,setInterval(()=>{if(!t(this,mt)||t(this,Bi)!=="active"){d(this,Ve,Mr).call(this);return}const e=Math.max(0,(new Date(t(this,mt)).getTime()-Date.now())/1e3);t(this,ht)&&(t(this,ht).textContent=Tr(e)),e<=0&&d(this,Ve,Mr).call(this)},1e3))},Ve=new WeakSet,Mr=function(){t(this,Oe)&&(clearInterval(t(this,Oe)),s(this,Oe,null))};const vo=`
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
  `;class fo extends m{constructor(){super(...arguments);n(this,Oi,null);n(this,Tt,null);n(this,Fe,!1);n(this,We,!1)}render(){const e=this.def.capabilities==="read-write";s(this,We,!1),this.root.innerHTML=`
        <style>${vo}${z}</style>
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
      `,s(this,Oi,this.root.querySelector(".hrv-generic-state")),s(this,Tt,this.root.querySelector(".hrv-generic-toggle")),t(this,Tt)&&e&&this._attachGestureHandlers(t(this,Tt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){const r=e==="on"||e==="off";s(this,Fe,e==="on"),t(this,Oi)&&(t(this,Oi).textContent=Ge(e)),t(this,Tt)&&(r&&!t(this,We)&&(t(this,Tt).removeAttribute("hidden"),s(this,We,!0)),t(this,We)&&(t(this,Tt).setAttribute("data-on",String(t(this,Fe))),t(this,Tt).title=t(this,Fe)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,Fe)?"off":"on",attributes:{}}}}Oi=new WeakMap,Tt=new WeakMap,Fe=new WeakMap,We=new WeakMap;const is={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",pouring:"M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z","snowy-rainy":"M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z",hail:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z","lightning-rainy":"M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z","windy-variant":"M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},mo=is.cloudy,go="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,1A1,1 0 0,1 13,2L13,2.01C13,2.01 14.35,3.56 15.72,5.55C17.09,7.54 18.5,9.93 18.5,12.5A6.5,6.5 0 0,1 12,19A6.5,6.5 0 0,1 5.5,12.5C5.5,9.93 6.91,7.54 8.28,5.55C9.65,3.56 11,2.01 11,2.01L11,2A1,1 0 0,1 12,1Z",bo="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",yo="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",xo=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function kn(c,v){const e=is[c]??mo;return`<svg viewBox="0 0 24 24" width="${v}" height="${v}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Mn(c){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${c}" fill="currentColor"/></svg>`}const wo=`
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
  `;class Co extends m{constructor(){super(...arguments);n(this,it);n(this,Cr);n(this,_r);n(this,Ar);n(this,pn);n(this,Vi,null);n(this,Ne,null);n(this,Fi,null);n(this,Wi,null);n(this,Ni,null);n(this,Zi,null);n(this,ot,null);n(this,It,null);n(this,lt,null);n(this,Yi,null);n(this,Gi,null);n(this,Ze,null);n(this,Ye,null)}render(){this.root.innerHTML=`
        <style>${wo}${z}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-weather-main">
              <span class="hrv-weather-icon">${kn("cloudy",44)}</span>
              <span class="hrv-weather-temp">--<span class="hrv-weather-unit"></span></span>
            </div>
            <span class="hrv-weather-cond" aria-live="polite">--</span>
            <div class="hrv-weather-stats">
              <span class="hrv-weather-stat" data-stat="humidity">
                ${Mn(go)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="wind">
                ${Mn(bo)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="pressure">
                ${Mn(yo)}
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
      `,s(this,Vi,this.root.querySelector(".hrv-weather-icon")),s(this,Ne,this.root.querySelector(".hrv-weather-temp")),s(this,Fi,this.root.querySelector(".hrv-weather-cond")),s(this,Wi,this.root.querySelector("[data-stat=humidity] [data-value]")),s(this,Ni,this.root.querySelector("[data-stat=wind] [data-value]")),s(this,Zi,this.root.querySelector("[data-stat=pressure] [data-value]")),s(this,ot,this.root.querySelector(".hrv-forecast-strip")),s(this,It,this.root.querySelector(".hrv-forecast-toggle")),s(this,lt,this.root.querySelector(".hrv-forecast-scroll-track")),s(this,Yi,this.root.querySelector(".hrv-forecast-scroll-thumb")),t(this,ot)&&(t(this,ot).addEventListener("scroll",()=>d(this,Ar,Un).call(this),{passive:!0}),s(this,Gi,Bs(t(this,ot)))),t(this,lt)&&t(this,lt).addEventListener("pointerdown",e=>d(this,pn,zs).call(this,e)),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}destroy(){var e;(e=t(this,Gi))==null||e.call(this),s(this,Gi,null)}applyState(e,i){const r=e||"cloudy";t(this,Vi)&&(t(this,Vi).innerHTML=kn(r,44));const o=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,Fi)&&(t(this,Fi).textContent=o);const a=i.temperature??i.native_temperature;let h=String(i.temperature_unit||i.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(h&&!/^°/.test(h)&&h.length<=2&&(h=`°${h}`),t(this,Ne)){const u=t(this,Ne).querySelector(".hrv-weather-unit");t(this,Ne).firstChild.textContent=a!=null?Math.round(Number(a)):"--",u&&(u.textContent=h)}if(t(this,Wi)){const u=i.humidity;t(this,Wi).textContent=u!=null?`${u}%`:"--"}if(t(this,Ni)){const u=i.wind_speed,f=i.wind_speed_unit??"";t(this,Ni).textContent=u!=null?`${u} ${f}`.trim():"--"}if(t(this,Zi)){const u=i.pressure,f=i.pressure_unit??"";t(this,Zi).textContent=u!=null?`${u} ${f}`.trim():"--"}const l=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;s(this,Ze,l?i.forecast_daily??i.forecast??null:null),s(this,Ye,l?i.forecast_hourly??null:null),d(this,Cr,Yn).call(this),d(this,_r,Gn).call(this),this.announceState(`${this.def.friendly_name}, ${o}, ${a??"--"} ${h}`)}}Vi=new WeakMap,Ne=new WeakMap,Fi=new WeakMap,Wi=new WeakMap,Ni=new WeakMap,Zi=new WeakMap,ot=new WeakMap,It=new WeakMap,lt=new WeakMap,Yi=new WeakMap,Gi=new WeakMap,it=new WeakSet,me=function(){return this.config._forecastMode??"daily"},$n=function(e){this.config._forecastMode=e},Ze=new WeakMap,Ye=new WeakMap,Cr=new WeakSet,Yn=function(){if(!t(this,It))return;const e=Array.isArray(t(this,Ze))&&t(this,Ze).length>0,i=Array.isArray(t(this,Ye))&&t(this,Ye).length>0;if(!e&&!i){t(this,It).textContent="";return}e&&!i&&s(this,it,"daily",$n),!e&&i&&s(this,it,"hourly",$n),e&&i?(t(this,It).textContent=t(this,it,me)==="daily"?"Hourly":"5-Day",t(this,It).onclick=()=>{s(this,it,t(this,it,me)==="daily"?"hourly":"daily",$n),d(this,Cr,Yn).call(this),d(this,_r,Gn).call(this)}):(t(this,It).textContent="",t(this,It).onclick=null)},_r=new WeakSet,Gn=function(){if(!t(this,ot))return;const e=t(this,it,me)==="hourly"?t(this,Ye):t(this,Ze);if(t(this,ot).setAttribute("data-mode",t(this,it,me)),!Array.isArray(e)||e.length===0){t(this,ot).innerHTML="",t(this,lt)&&(t(this,lt).hidden=!0);return}const i=t(this,it,me)==="daily"?e.slice(0,5):e;t(this,ot).innerHTML=i.map(r=>{const o=new Date(r.datetime);let a;t(this,it,me)==="hourly"?a=o.toLocaleTimeString([],{hour:"numeric"}):a=xo[o.getDay()]??"";const h=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",l=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="hrv-forecast-day" role="listitem">
            <span class="hrv-forecast-day-name">${p(String(a))}</span>
            ${kn(r.condition||"cloudy",18)}
            <span class="hrv-forecast-temps">
              ${p(String(h))}${l!=null?`/<span class="hrv-forecast-lo">${p(String(l))}</span>`:""}
            </span>
          </div>`}).join(""),t(this,it,me)==="hourly"?requestAnimationFrame(()=>d(this,Ar,Un).call(this)):t(this,lt)&&(t(this,lt).hidden=!0)},Ar=new WeakSet,Un=function(){const e=t(this,ot),i=t(this,lt),r=t(this,Yi);if(!e||!i||!r)return;const o=e.scrollWidth>e.clientWidth?e.clientWidth/e.scrollWidth:1;if(o>=1){i.hidden=!0;return}i.hidden=!1;const a=i.clientWidth,h=Math.max(20,o*a),l=a-h,u=e.scrollLeft/(e.scrollWidth-e.clientWidth);r.style.width=`${h}px`,r.style.left=`${u*l}px`},pn=new WeakSet,zs=function(e){const i=t(this,ot),r=t(this,lt),o=t(this,Yi);if(!i||!r||!o)return;e.preventDefault();const a=r.getBoundingClientRect(),h=parseFloat(o.style.width)||20,l=g=>{const y=g-a.left-h/2,S=a.width-h,_=Math.max(0,Math.min(1,y/S));i.scrollLeft=_*(i.scrollWidth-i.clientWidth)};l(e.clientX);const u=g=>l(g.clientX),f=()=>{window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",f)};window.addEventListener("pointermove",u),window.addEventListener("pointerup",f)};const _o=`
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
  `;class Ao extends m{constructor(){super(...arguments);n(this,Zt,null);n(this,Ui,null);n(this,pe,!1);n(this,un,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${_o}${z}</style>
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
      `,s(this,Zt,this.root.querySelector(".hrv-lock-icon-btn")),s(this,Ui,this.root.querySelector(".hrv-lock-ro-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"lock-icon"),t(this,Zt)&&e&&this._attachGestureHandlers(t(this,Zt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand(t(this,pe)?"unlock":"lock",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){s(this,un,e),s(this,pe,e==="locked");const r=e==="jammed",a=r||(e==="locking"||e==="unlocking")||e==="unavailable"||e==="unknown";t(this,Zt)&&(t(this,Zt).setAttribute("aria-pressed",String(t(this,pe))),t(this,Zt).disabled=a),t(this,Ui)&&t(this,Ui).setAttribute("data-locked",String(t(this,pe)));const h=r?"mdi:lock-alert":t(this,pe)?"mdi:lock":"mdi:lock-open",l=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(l,h),"lock-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}Zt=new WeakMap,Ui=new WeakMap,pe=new WeakMap,un=new WeakMap;const En=`
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

    @media (prefers-reduced-motion: reduce) {
      .hrv-action-icon-btn { transition: none; }
    }
  `;class rs extends m{constructor(){super(...arguments);n(this,Yt,null);n(this,vn,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${En}${z}</style>
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
      `,s(this,Yt,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),e&&t(this,Yt)&&this._attachGestureHandlers(t(this,Yt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){s(this,vn,e);const r=this.def.capabilities==="read-write",o=e==="on",a=!r||o||e==="unavailable"||e==="unknown";t(this,Yt)&&(t(this,Yt).disabled=a,t(this,Yt).dataset.running=String(o));const h=o?"mdi:script-text":"mdi:script-text-play",l=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(l,h),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="turn_on"?{state:"on",attributes:{}}:null}}Yt=new WeakMap,vn=new WeakMap,Lr(rs,"staleOnMount",!1);class ns extends m{constructor(){super(...arguments);n(this,ue,null);n(this,fn,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${En}${z}</style>
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
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,ue,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),e&&t(this,ue)&&this._attachGestureHandlers(t(this,ue),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("trigger",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){s(this,fn,e);const o=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,ue)&&(t(this,ue).disabled=o);const a=e==="on"?"mdi:robot":"mdi:robot-off",h=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(h,a),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}}ue=new WeakMap,fn=new WeakMap,Lr(ns,"staleOnMount",!1);class ss extends m{constructor(){super(...arguments);n(this,ve,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${En}${z}</style>
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
      `,s(this,ve,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),e&&t(this,ve)&&this._attachGestureHandlers(t(this,ve),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("press",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){const o=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,ve)&&(t(this,ve).disabled=o);const a=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(a,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}ve=new WeakMap,Lr(ss,"staleOnMount",!1);const $o=`
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
  `;class os extends m{constructor(){super(...arguments);n(this,Xi,null)}render(){this.root.innerHTML=`
        <style>${$o}${z}</style>
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
      `,s(this,Xi,this.root.querySelector(".hrv-person-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"person-icon"),this.renderCompanions(),T(this.root)}applyState(e,i){const r=e==="home";t(this,Xi)&&t(this,Xi).setAttribute("data-home",String(r));const o=e==="not_home"?"mdi:account-off":"mdi:home-account",a=this.def.icon_state_map?.[e]??this.def.icon??o;this.renderIcon(this.resolveIcon(a,o),"person-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Xi=new WeakMap,Lr(os,"staleOnMount",!0),w._renderers=w._renderers||{};const Lo=document.currentScript&&document.currentScript.dataset.rendererId||"minimus";w._renderers[Lo]={light:Zs,fan:Gs,lock:Ao,script:rs,automation:ns,button:ss,climate:Ks,binary_sensor:Qs,cover:eo,input_boolean:ts,input_number:ro,input_select:Qn,select:Qn,media_player:oo,remote:ho,sensor:Hr,"sensor.temperature":Hr,"sensor.humidity":Hr,"sensor.battery":Hr,switch:ts,person:os,timer:uo,weather:Co,generic:fo,_capabilities:{fan:{display_modes:["on-off","continuous","stepped","cycle"]},input_number:{display_modes:["slider","buttons"]},input_select:{display_modes:["pills","dropdown"]},select:{display_modes:["pills","dropdown"]},light:{features:["brightness","color_temp","rgb"]},climate:{features:["hvac_modes","presets","fan_mode","swing_mode"]},cover:{features:["position","tilt"]},media_player:{features:["transport","volume","source"]}}}})();})();
