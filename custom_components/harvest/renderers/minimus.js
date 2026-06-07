(()=>{var Ao=Object.defineProperty;var $o=(w,m,p)=>m in w?Ao(w,m,{enumerable:!0,configurable:!0,writable:!0,value:p}):w[m]=p;var $r=(w,m,p)=>($o(w,typeof m!="symbol"?m+"":m,p),p),Mn=(w,m,p)=>{if(!m.has(w))throw TypeError("Cannot "+p)};var t=(w,m,p)=>(Mn(w,m,"read from private field"),p?p.call(w):m.get(w)),n=(w,m,p)=>{if(m.has(w))throw TypeError("Cannot add the same private member more than once");m instanceof WeakSet?m.add(w):m.set(w,p)},s=(w,m,p,Yt)=>(Mn(w,m,"write to private field"),Yt?Yt.call(w,p):m.set(w,p),p);var d=(w,m,p)=>(Mn(w,m,"access private method"),p);(function(){"use strict";var Gt,I,Ji,O,vt,L,et,Xe,Ke,ft,It,mt,ht,me,Je,it,gt,ge,Qi,Qe,kn,Lo,S,Ir,ss,qr,os,Dr,as,Pr,ds,ti,vn,ei,fn,zr,hs,be,Lr,Br,ls,Rr,cs,tr,En,er,Hn,jr,ps,lt,Y,Or,V,ii,G,bt,yt,xt,F,k,Ut,qt,W,M,ye,ri,ir,ni,mn,xe,Sr,rr,Tn,si,gn,nr,In,sr,qn,Xt,Gi,Vr,us,Fr,vs,or,Dn,ar,Pn,Wr,fs,dr,zn,Nr,ms,rt,Dt,wt,oi,Kt,ai,di,hi,U,X,li,ci,pi,ui,B,we,_t,K,J,Ct,vi,fi,mi,At,Jt,_e,gi,bi,yi,xi,wi,hr,_i,lr,Bn,Zr,gs,Yr,bs,cr,Rn,Ce,kr,pr,jn,Ci,bn,Gr,ys,Ur,xs,ur,On,vr,Vn,Xr,ws,Kr,_s,Ae,$e,$t,E,Le,Se,ke,Pt,Lt,fr,mr,gr,Ai,yn,Jr,Cs,Me,zt,q,R,$i,Qt,te,Bt,D,nt,ct,Rt,ee,Qr,As,tn,$s,ie,Ui,Li,xn,en,Ls,re,Xi,N,P,Ee,rn,ne,Si,jt,He,Ot,se,oe,Q,nn,Ss,sn,ks,br,Fn,yr,Wn,ae,Ki,Vt,ki,Mi,Te,Ie,St,H,qe,De,Pe,kt,Ft,ze,Be,xr,Ei,wn,on,Ms,Hi,Ti,Ii,Mt,qi,Re,ot,Wt,de,he,je,Di,Pi,pt,zi,an,Es,dn,Hs,hn,Ts,Oe,Mr,Bi,Et,Ve,Fe,Ri,We,ji,Oi,Vi,Fi,st,Ht,at,Wi,Ni,tt,ve,_n,Ne,Ze,wr,Nn,_r,Zn,Cr,Yn,ln,Is,Nt,Zi,le,cn,Zt,pn,ce,un,pe,Yi;const w=window.HArvest;if(!w||!w.renderers||!w.renderers.BaseCard){console.warn("[HArvest Minimus] HArvest not found - pack not loaded.");return}const m=w.renderers.BaseCard,p=window.HArvest.esc;function Yt(c,v){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,c.apply(this,i)},v)}}function Ye(c){return c?c.charAt(0).toUpperCase()+c.slice(1).replace(/_/g," "):""}const z=`
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
  `;function qs(c){if(!c)return()=>{};const v=80,e=1.6,i=.96,r=.04;let o=null,a=0,h=0,l=0,u=!1,f=0;const g=[],y=()=>{f&&(cancelAnimationFrame(f),f=0)},$=x=>{for(;g.length&&g[0].t<x-v;)g.shift();if(g.length<2)return 0;const j=g[0],Tt=g[g.length-1],Ar=Tt.t-j.t;return Ar<=0?0:(Tt.x-j.x)/Ar},_=()=>{if(Math.abs(l)<r)return;let x=performance.now();const j=Tt=>{const Ar=Tt-x;if(x=Tt,c.scrollLeft-=l*Ar,l*=Math.pow(i,Ar/16),Math.abs(l)<r){f=0,l=0;return}const Co=c.scrollWidth-c.clientWidth;if(c.scrollLeft<=0||c.scrollLeft>=Co){f=0,l=0;return}f=requestAnimationFrame(j)};f=requestAnimationFrame(j)},ue=x=>{if(c.scrollWidth<=c.clientWidth||x.pointerType==="touch")return;const j=x.target;if(!(j&&j!==c&&j.closest?.("button, a"))){y(),o=x.pointerId,a=x.clientX,h=c.scrollLeft,l=0,u=!1,g.length=0,g.push({x:x.clientX,t:x.timeStamp});try{c.setPointerCapture(o)}catch{}}},b=x=>{if(x.pointerId!==o)return;const j=x.clientX-a;Math.abs(j)>4&&(u=!0,c.dataset.dragging="true"),c.scrollLeft=h-j,g.push({x:x.clientX,t:x.timeStamp});const Tt=x.timeStamp-v;for(;g.length>2&&g[0].t<Tt;)g.shift()},C=x=>{if(x.pointerId===o){try{c.releasePointerCapture(o)}catch{}if(o=null,u){const j=Tt=>{Tt.stopPropagation(),Tt.preventDefault()};window.addEventListener("click",j,{capture:!0,once:!0}),requestAnimationFrame(()=>c.removeAttribute("data-dragging")),l=$(x.timeStamp)*e,_()}g.length=0}};return c.addEventListener("pointerdown",ue),c.addEventListener("pointermove",b),c.addEventListener("pointerup",C),c.addEventListener("pointercancel",C),c.addEventListener("wheel",y,{passive:!0}),c.addEventListener("touchstart",y,{passive:!0}),()=>{y(),c.removeEventListener("pointerdown",ue),c.removeEventListener("pointermove",b),c.removeEventListener("pointerup",C),c.removeEventListener("pointercancel",C),c.removeEventListener("wheel",y),c.removeEventListener("touchstart",y)}}function T(c){c.querySelectorAll("[part=companion]").forEach(v=>{v.title=v.getAttribute("aria-label")??""})}const Ds=60,Ps=60,fe=48,Z=225,A=270,ut=2*Math.PI*fe*(A/360);function zs(c){return c*Math.PI/180}function dt(c){const v=zs(c);return{x:Ds+fe*Math.cos(v),y:Ps-fe*Math.sin(v)}}function Bs(){const c=dt(Z),v=dt(Z-A);return`M ${c.x} ${c.y} A ${fe} ${fe} 0 1 1 ${v.x} ${v.y}`}const Ge=Bs(),Ue=["brightness","temp","color"],Er=120;function Gn(c){const v=A/Er;let e="";for(let i=0;i<Er;i++){const r=Z-i*v,o=Z-(i+1)*v,a=dt(r),h=dt(o),l=`M ${a.x} ${a.y} A ${fe} ${fe} 0 0 1 ${h.x} ${h.y}`,u=i===0||i===Er-1?"round":"butt";e+=`<path d="${l}" stroke="${c(i/Er)}" fill="none" stroke-width="8" stroke-linecap="${u}" />`}return e}const Rs=Gn(c=>`hsl(${Math.round(c*360)},100%,50%)`),js=Gn(c=>{const e=Math.round(143+112*c),i=Math.round(255*c);return`rgb(255,${e},${i})`}),Cn=`
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
  `,Os=`
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
  `;class Vs extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,kn);n(this,Ir);n(this,qr);n(this,Dr);n(this,Pr);n(this,ti);n(this,ei);n(this,zr);n(this,be);n(this,Br);n(this,Rr);n(this,tr);n(this,er);n(this,jr);n(this,Gt,null);n(this,I,null);n(this,Ji,null);n(this,O,null);n(this,vt,null);n(this,L,null);n(this,et,null);n(this,Xe,null);n(this,Ke,null);n(this,ft,0);n(this,It,4e3);n(this,mt,0);n(this,ht,!1);n(this,me,!1);n(this,Je,null);n(this,it,0);n(this,gt,2e3);n(this,ge,6500);n(this,Qi,void 0);n(this,Qe,new Map);n(this,S,[]);s(this,Qi,Yt(d(this,jr,ps).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_brightness!==!1&&i.includes("brightness"),a=r.show_color_temp!==!1&&i.includes("color_temp"),h=r.show_rgb!==!1&&i.includes("rgb_color"),l=e&&(o||a||h),u=[o,a,h].filter(Boolean).length,f=e&&u>1;s(this,gt,this.def.feature_config?.min_color_temp_kelvin??2e3),s(this,ge,this.def.feature_config?.max_color_temp_kelvin??6500);const g=dt(Z);this.root.innerHTML=`
        <style>${Cn}${Os}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${l?"":"hrv-no-dial"}">
            ${l?`
              <div class="hrv-dial-column">
                <div class="hrv-dial-wrap" role="slider" aria-valuemin="0"
                  aria-valuemax="100" aria-valuenow="0"
                  aria-label="${p(this.def.friendly_name)} brightness"
                  title="Drag to adjust">
                  <svg viewBox="0 0 120 120">
                    <g class="hrv-dial-segs hrv-dial-segs-color">${Rs}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${js}</g>
                    <path class="hrv-dial-track" d="${Ge}" />
                    <path class="hrv-dial-fill" d="${Ge}"
                      stroke-dasharray="${ut}"
                      stroke-dashoffset="${ut}" />
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
      `,s(this,Gt,this.root.querySelector("[part=toggle-button]")),s(this,I,this.root.querySelector(".hrv-dial-fill")),s(this,Ji,this.root.querySelector(".hrv-dial-track")),s(this,O,this.root.querySelector(".hrv-dial-thumb")),s(this,vt,this.root.querySelector(".hrv-dial-pct")),s(this,L,this.root.querySelector(".hrv-dial-wrap")),s(this,Je,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,Xe,this.root.querySelector(".hrv-dial-segs-color")),s(this,Ke,this.root.querySelector(".hrv-dial-segs-temp")),s(this,et,this.root.querySelector(".hrv-mode-switch")),t(this,Gt)&&(l||this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"card-icon"),this._attachGestureHandlers(t(this,Gt),{onTap:()=>{const y=this.config.gestureConfig?.tap;if(y){this._runAction(y);return}this.config.card?.sendCommand("toggle",{})}})),t(this,L)&&(t(this,L).addEventListener("pointerdown",d(this,Br,ls).bind(this)),t(this,L).addEventListener("pointermove",d(this,Rr,cs).bind(this)),t(this,L).addEventListener("pointerup",d(this,tr,En).bind(this)),t(this,L).addEventListener("pointercancel",d(this,tr,En).bind(this))),l&&d(this,Ir,ss).call(this),t(this,et)&&(t(this,et).addEventListener("click",d(this,qr,os).bind(this)),t(this,et).addEventListener("keydown",d(this,Pr,ds).bind(this)),t(this,et).addEventListener("mousemove",d(this,Dr,as).bind(this))),d(this,ei,fn).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(y=>{y.title=y.getAttribute("aria-label")??"Companion";const $=y.getAttribute("data-entity");if($&&t(this,Qe).has($)){const _=t(this,Qe).get($);y.setAttribute("data-on",String(_==="on"))}})}applyState(e,i){if(s(this,ht,e==="on"),s(this,ft,i?.brightness??0),i?.color_temp_kelvin!==void 0?s(this,It,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&s(this,It,Math.round(1e6/i.color_temp)),i?.hs_color)s(this,mt,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[o,a,h]=i.rgb_color;s(this,mt,Ns(o,a,h))}if(t(this,Gt)&&(t(this,Gt).setAttribute("aria-pressed",String(t(this,ht))),this.root.querySelector("[part=card-icon]"))){const a=t(this,ht)?"mdi:lightbulb":"mdi:lightbulb-outline",h=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(h,a),"card-icon")}const r=this.root.querySelector(".hrv-light-ro-circle");if(r){r.setAttribute("data-on",String(t(this,ht)));const o=t(this,ht)?"mdi:lightbulb":"mdi:lightbulb-outline",a=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??o;this.renderIcon(this.resolveIcon(a,o),"ro-state-icon");const h=i?.color_mode,l=h==="color_temp",u=h&&h!=="color_temp",f=this.root.querySelector('[data-attr="brightness"]');if(f){const $=Math.round(t(this,ft)/255*100);f.title=t(this,ht)?`Brightness: ${$}%`:"Brightness: off"}const g=this.root.querySelector('[data-attr="temp"]');g&&(g.title=`Color temperature: ${t(this,It)}K`,g.style.display=u?"none":"");const y=this.root.querySelector('[data-attr="color"]');if(y)if(y.style.display=l?"none":"",i?.rgb_color){const[$,_,ue]=i.rgb_color;y.style.background=`rgb(${$},${_},${ue})`,y.title=`Color: rgb(${$}, ${_}, ${ue})`}else y.style.background=`hsl(${t(this,mt)}, 100%, 50%)`,y.title=`Color: hue ${t(this,mt)}°`}d(this,ti,vn).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,ht)?"off":"on",attributes:{brightness:t(this,ft)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,r){t(this,Qe).set(e,i),super.updateCompanionState(e,i,r)}}Gt=new WeakMap,I=new WeakMap,Ji=new WeakMap,O=new WeakMap,vt=new WeakMap,L=new WeakMap,et=new WeakMap,Xe=new WeakMap,Ke=new WeakMap,ft=new WeakMap,It=new WeakMap,mt=new WeakMap,ht=new WeakMap,me=new WeakMap,Je=new WeakMap,it=new WeakMap,gt=new WeakMap,ge=new WeakMap,Qi=new WeakMap,Qe=new WeakMap,kn=new WeakSet,Lo=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},S=new WeakMap,Ir=new WeakSet,ss=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];s(this,S,[]),i[0]&&t(this,S).push(0),i[1]&&t(this,S).push(1),i[2]&&t(this,S).push(2),t(this,S).length===0&&t(this,S).push(0),t(this,S).includes(t(this,it))||s(this,it,t(this,S)[0])},qr=new WeakSet,os=function(e){const i=t(this,et).getBoundingClientRect(),r=e.clientY-i.top,o=i.height/3;let a;r<o?a=0:r<o*2?a=1:a=2,a=Math.min(a,t(this,S).length-1),s(this,it,t(this,S)[a]),t(this,et).setAttribute("data-pos",String(a)),d(this,ei,fn).call(this),d(this,ti,vn).call(this)},Dr=new WeakSet,as=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},r=t(this,et).getBoundingClientRect(),o=Math.min(Math.floor((e.clientY-r.top)/(r.height/t(this,S).length)),t(this,S).length-1),a=Ue[t(this,S)[Math.max(0,o)]];t(this,et).title=`Dial mode: ${i[a]??a}`},Pr=new WeakSet,ds=function(e){const i=t(this,S).indexOf(t(this,it));let r=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")r=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")r=Math.min(t(this,S).length-1,i+1);else return;e.preventDefault(),s(this,it,t(this,S)[r]),t(this,et).setAttribute("data-pos",String(r)),d(this,ei,fn).call(this),d(this,ti,vn).call(this)},ti=new WeakSet,vn=function(){t(this,O)&&(t(this,O).style.transition="none"),t(this,I)&&(t(this,I).style.transition="none"),d(this,zr,hs).call(this),t(this,O)?.getBoundingClientRect(),t(this,I)?.getBoundingClientRect(),t(this,O)&&(t(this,O).style.transition=""),t(this,I)&&(t(this,I).style.transition="")},ei=new WeakSet,fn=function(){if(!t(this,I))return;const e=Ue[t(this,it)],i=e==="color"||e==="temp";t(this,Ji).style.display=i?"none":"",t(this,I).style.display=i?"none":"",t(this,Xe)&&t(this,Xe).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,Ke)&&t(this,Ke).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,I).setAttribute("stroke-dasharray",String(ut));const r={brightness:"brightness",temp:"color temperature",color:"color"},o={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,L)?.setAttribute("aria-label",`${p(this.def.friendly_name)} ${r[e]}`),t(this,L)&&(t(this,L).title=o[e])},zr=new WeakSet,hs=function(){const e=Ue[t(this,it)];if(e==="brightness"){const i=t(this,ht)?t(this,ft):0;d(this,be,Lr).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,It)-t(this,gt))/(t(this,ge)-t(this,gt))*100);d(this,be,Lr).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,mt)/360*100);d(this,be,Lr).call(this,i)}},be=new WeakSet,Lr=function(e){const i=Ue[t(this,it)],r=e/100*A,o=dt(Z-r);if(t(this,O)?.setAttribute("cx",String(o.x)),t(this,O)?.setAttribute("cy",String(o.y)),t(this,Je)?.setAttribute("cx",String(o.x)),t(this,Je)?.setAttribute("cy",String(o.y)),i==="brightness"){const a=ut*(1-e/100);t(this,I)?.setAttribute("stroke-dashoffset",String(a)),t(this,vt)&&(t(this,vt).textContent=e+"%"),t(this,L)?.setAttribute("aria-valuenow",String(e))}else if(i==="temp"){const a=Math.round(t(this,gt)+e/100*(t(this,ge)-t(this,gt)));t(this,vt)&&(t(this,vt).textContent=a+"K"),t(this,L)?.setAttribute("aria-valuenow",String(a))}else t(this,vt)&&(t(this,vt).textContent=Math.round(e/100*360)+"°"),t(this,L)?.setAttribute("aria-valuenow",String(Math.round(e/100*360)))},Br=new WeakSet,ls=function(e){s(this,me,!0),t(this,L)?.setPointerCapture(e.pointerId),d(this,er,Hn).call(this,e)},Rr=new WeakSet,cs=function(e){t(this,me)&&d(this,er,Hn).call(this,e)},tr=new WeakSet,En=function(e){if(t(this,me)){s(this,me,!1);try{t(this,L)?.releasePointerCapture(e.pointerId)}catch{}t(this,Qi).call(this)}},er=new WeakSet,Hn=function(e){if(!t(this,L))return;const i=t(this,L).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,h=-(e.clientY-o);let l=Math.atan2(h,a)*180/Math.PI;l<0&&(l+=360);let u=Z-l;u<0&&(u+=360),u>A&&(u=u>A+(360-A)/2?0:A);const f=Math.round(u/A*100),g=Ue[t(this,it)];g==="brightness"?s(this,ft,Math.round(f/100*255)):g==="temp"?s(this,It,Math.round(t(this,gt)+f/100*(t(this,ge)-t(this,gt)))):s(this,mt,Math.round(f/100*360)),t(this,I)&&(t(this,I).style.transition="none"),t(this,O)&&(t(this,O).style.transition="none"),d(this,be,Lr).call(this,f)},jr=new WeakSet,ps=function(){t(this,I)&&(t(this,I).style.transition=""),t(this,O)&&(t(this,O).style.transition="");const e=Ue[t(this,it)];e==="brightness"?t(this,ft)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,ft)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,It)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,mt),100]})};const Fs=Cn+`
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
  `;class Ws extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,ni);n(this,xe);n(this,rr);n(this,si);n(this,nr);n(this,sr);n(this,Xt);n(this,Vr);n(this,Fr);n(this,or);n(this,ar);n(this,Wr);n(this,dr);n(this,Nr);n(this,lt,null);n(this,Y,null);n(this,Or,null);n(this,V,null);n(this,ii,null);n(this,G,null);n(this,bt,null);n(this,yt,null);n(this,xt,null);n(this,F,!1);n(this,k,0);n(this,Ut,!1);n(this,qt,"forward");n(this,W,null);n(this,M,[]);n(this,ye,!1);n(this,ri,null);n(this,ir,void 0);s(this,ir,Yt(d(this,Wr,fs).bind(this),300)),s(this,M,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},o=r.display_mode??null;let a=i.includes("set_speed");const h=r.show_oscillate!==!1&&i.includes("oscillate"),l=r.show_direction!==!1&&i.includes("direction"),u=r.show_presets!==!1&&i.includes("preset_mode");o==="on-off"&&(a=!1);let f=e&&a,g=f&&t(this,xe,Sr),y=g&&!t(this,M).length,$=g&&!!t(this,M).length;o==="continuous"?(g=!1,y=!1,$=!1):o==="stepped"?($=!1,y=g&&!t(this,M).length):o==="cycle"&&(g=!0,$=!0,y=!1);const _=dt(Z);this.root.innerHTML=`
        <style>${Fs}</style>
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
                      ${t(this,si,gn).map((b,C)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${b}" data-idx="${C}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${C+1} (${b}%)"
                          title="Speed ${C+1} (${b}%)"></div>
                      `).join("")}
                    </div>
                  </div>
                `:$?`
                  <div class="hrv-fan-stepped-wrap">
                    <button class="hrv-fan-speed-circle" part="speed-circle" type="button"
                      aria-pressed="false"
                      title="Click to increase fan speed"
                      aria-label="Click to increase fan speed"><svg class="hrv-fan-speed-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg></button>
                  </div>
                `:`
                  <div class="hrv-dial-wrap" role="slider"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                    aria-label="${p(this.def.friendly_name)} speed"
                    title="Drag to adjust fan speed">
                    <svg viewBox="0 0 120 120">
                      <path class="hrv-dial-track" d="${Ge}" />
                      <path class="hrv-dial-fill" d="${Ge}"
                        stroke-dasharray="${ut}"
                        stroke-dashoffset="${ut}" />
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
      `,s(this,lt,this.root.querySelector("[part=toggle-button]")),s(this,Y,this.root.querySelector(".hrv-dial-fill")),s(this,Or,this.root.querySelector(".hrv-dial-track")),s(this,V,this.root.querySelector(".hrv-dial-thumb")),s(this,ii,this.root.querySelector(".hrv-dial-pct")),s(this,G,this.root.querySelector(".hrv-dial-wrap")),s(this,ri,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,bt,this.root.querySelector('[data-feat="oscillate"]')),s(this,yt,this.root.querySelector('[data-feat="direction"]')),s(this,xt,this.root.querySelector('[data-feat="preset"]')),t(this,lt)&&!f&&(this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"fan-onoff-icon"),t(this,lt).setAttribute("data-animate",String(!!this.config.animate))),this._attachGestureHandlers(t(this,lt),{onTap:()=>{const b=this.config.gestureConfig?.tap;if(b){this._runAction(b);return}this.config.card?.sendCommand("toggle",{})}}),t(this,G)&&(t(this,G).addEventListener("pointerdown",d(this,Vr,us).bind(this)),t(this,G).addEventListener("pointermove",d(this,Fr,vs).bind(this)),t(this,G).addEventListener("pointerup",d(this,or,Dn).bind(this)),t(this,G).addEventListener("pointercancel",d(this,or,Dn).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const b=t(this,si,gn);if(!b.length)return;let C;if(!t(this,F)||t(this,k)===0)C=b[0],s(this,F,!0),t(this,lt)?.setAttribute("aria-pressed","true");else{const x=b.findIndex(j=>j>t(this,k));C=x===-1?b[0]:b[x]}s(this,k,C),d(this,nr,In).call(this),this.config.card?.sendCommand("set_percentage",{percentage:C})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(b=>{const C=()=>{const x=Number(b.getAttribute("data-pct"));t(this,F)||(s(this,F,!0),t(this,lt)?.setAttribute("aria-pressed","true")),s(this,k,x),d(this,sr,qn).call(this),this.config.card?.sendCommand("set_percentage",{percentage:x})};b.addEventListener("click",C),b.addEventListener("keydown",x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),C())})}),t(this,bt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,Ut)})}),t(this,yt)?.addEventListener("click",()=>{const b=t(this,qt)==="forward"?"reverse":"forward";s(this,qt,b),d(this,Xt,Gi).call(this),this.config.card?.sendCommand("set_direction",{direction:b})}),t(this,xt)?.addEventListener("click",()=>{if(t(this,M).length){if(t(this,rr,Tn)){const b=t(this,W)??t(this,M)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:b});return}if(t(this,W)){const b=t(this,M).indexOf(t(this,W));if(b===-1||b===t(this,M).length-1){s(this,W,null),d(this,Xt,Gi).call(this);const C=t(this,ni,mn),x=Math.floor(t(this,k)/C)*C||C;this.config.card?.sendCommand("set_percentage",{percentage:x})}else{const C=t(this,M)[b+1];s(this,W,C),d(this,Xt,Gi).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:C})}}else{const b=t(this,M)[0];s(this,W,b),d(this,Xt,Gi).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:b})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:fan"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(b=>{b.title=b.getAttribute("aria-label")??"Companion"})}applyState(e,i){s(this,F,e==="on"),s(this,k,i?.percentage??0),s(this,Ut,i?.oscillating??!1),s(this,qt,i?.direction??"forward"),s(this,W,i?.preset_mode??null),i?.preset_modes?.length&&s(this,M,i.preset_modes),t(this,lt)&&t(this,lt).setAttribute("aria-pressed",String(t(this,F)));const r=this.root.querySelector(".hrv-fan-ro-circle");r&&r.setAttribute("data-on",String(t(this,F))),t(this,xe,Sr)&&!t(this,M).length?d(this,sr,qn).call(this):t(this,xe,Sr)?d(this,nr,In).call(this):d(this,Nr,ms).call(this),d(this,Xt,Gi).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,k)>0?`, ${Math.round(t(this,k))}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,F)?"off":"on",attributes:{percentage:t(this,k)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,Ut),direction:t(this,qt),preset_mode:t(this,W),preset_modes:t(this,M)}}:null}}lt=new WeakMap,Y=new WeakMap,Or=new WeakMap,V=new WeakMap,ii=new WeakMap,G=new WeakMap,bt=new WeakMap,yt=new WeakMap,xt=new WeakMap,F=new WeakMap,k=new WeakMap,Ut=new WeakMap,qt=new WeakMap,W=new WeakMap,M=new WeakMap,ye=new WeakMap,ri=new WeakMap,ir=new WeakMap,ni=new WeakSet,mn=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},xe=new WeakSet,Sr=function(){return t(this,ni,mn)>1},rr=new WeakSet,Tn=function(){return t(this,xe,Sr)&&t(this,M).length>0},si=new WeakSet,gn=function(){const e=t(this,ni,mn),i=[];for(let r=1;r*e<=100.001;r++)i.push(r*e);return i},nr=new WeakSet,In=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,F)));const i=t(this,F)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},sr=new WeakSet,qn=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),r=t(this,si,gn);let o=-1;if(t(this,F)&&t(this,k)>0){let a=1/0;r.forEach((h,l)=>{const u=Math.abs(h-t(this,k));u<a&&(a=u,o=l)})}e.setAttribute("data-on",String(o>=0)),i&&o>=0&&(i.style.left=`${2+o*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((a,h)=>{a.setAttribute("data-active",String(h===o))})},Xt=new WeakSet,Gi=function(){const e=t(this,rr,Tn);if(t(this,bt)){const i=e||t(this,Ut),r=e?"Oscillate":`Oscillate: ${t(this,Ut)?"on":"off"}`;t(this,bt).setAttribute("data-on",String(i)),t(this,bt).setAttribute("aria-pressed",String(i)),t(this,bt).setAttribute("aria-label",r),t(this,bt).title=r}if(t(this,yt)){const i=t(this,qt)!=="reverse",r=`Direction: ${t(this,qt)}`;t(this,yt).setAttribute("data-on",String(i)),t(this,yt).setAttribute("aria-pressed",String(i)),t(this,yt).setAttribute("aria-label",r),t(this,yt).title=r}if(t(this,xt)){const i=e||!!t(this,W),r=e?t(this,W)??t(this,M)[0]??"Preset":t(this,W)?`Preset: ${t(this,W)}`:"Preset: none";t(this,xt).setAttribute("data-on",String(i)),t(this,xt).setAttribute("aria-pressed",String(i)),t(this,xt).setAttribute("aria-label",r),t(this,xt).title=r}},Vr=new WeakSet,us=function(e){s(this,ye,!0),t(this,G)?.setPointerCapture(e.pointerId),d(this,ar,Pn).call(this,e)},Fr=new WeakSet,vs=function(e){t(this,ye)&&d(this,ar,Pn).call(this,e)},or=new WeakSet,Dn=function(e){if(t(this,ye)){s(this,ye,!1);try{t(this,G)?.releasePointerCapture(e.pointerId)}catch{}t(this,ir).call(this)}},ar=new WeakSet,Pn=function(e){if(!t(this,G))return;const i=t(this,G).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,h=-(e.clientY-o);let l=Math.atan2(h,a)*180/Math.PI;l<0&&(l+=360);let u=Z-l;u<0&&(u+=360),u>A&&(u=u>A+(360-A)/2?0:A),s(this,k,Math.round(u/A*100)),t(this,Y)&&(t(this,Y).style.transition="none"),t(this,V)&&(t(this,V).style.transition="none"),d(this,dr,zn).call(this,t(this,k))},Wr=new WeakSet,fs=function(){t(this,Y)&&(t(this,Y).style.transition=""),t(this,V)&&(t(this,V).style.transition=""),t(this,k)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,k)})},dr=new WeakSet,zn=function(e){const i=ut*(1-e/100),r=dt(Z-e/100*A);t(this,Y)?.setAttribute("stroke-dashoffset",String(i)),t(this,V)?.setAttribute("cx",String(r.x)),t(this,V)?.setAttribute("cy",String(r.y)),t(this,ri)?.setAttribute("cx",String(r.x)),t(this,ri)?.setAttribute("cy",String(r.y)),t(this,ii)&&(t(this,ii).textContent=`${e}%`),t(this,G)?.setAttribute("aria-valuenow",String(e))},Nr=new WeakSet,ms=function(){t(this,V)&&(t(this,V).style.transition="none"),t(this,Y)&&(t(this,Y).style.transition="none"),d(this,dr,zn).call(this,t(this,F)?t(this,k):0),t(this,V)?.getBoundingClientRect(),t(this,Y)?.getBoundingClientRect(),t(this,V)&&(t(this,V).style.transition=""),t(this,Y)&&(t(this,Y).style.transition="")};function Ns(c,v,e){c/=255,v/=255,e/=255;const i=Math.max(c,v,e),r=Math.min(c,v,e),o=i-r;if(o===0)return 0;let a;return i===c?a=(v-e)/o%6:i===v?a=(e-c)/o+2:a=(c-v)/o+4,Math.round((a*60+360)%360)}const Zs=Cn+`
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
  `;class Ys extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,lr);n(this,Zr);n(this,Yr);n(this,cr);n(this,Ce);n(this,pr);n(this,Ci);n(this,Gr);n(this,Ur);n(this,ur);n(this,vr);n(this,Xr);n(this,Kr);n(this,rt,null);n(this,Dt,null);n(this,wt,null);n(this,oi,null);n(this,Kt,!1);n(this,ai,null);n(this,di,null);n(this,hi,null);n(this,U,null);n(this,X,null);n(this,li,null);n(this,ci,null);n(this,pi,null);n(this,ui,null);n(this,B,null);n(this,we,null);n(this,_t,null);n(this,K,null);n(this,J,20);n(this,Ct,"off");n(this,vi,null);n(this,fi,null);n(this,mi,null);n(this,At,16);n(this,Jt,32);n(this,_e,.5);n(this,gi,"°C");n(this,bi,[]);n(this,yi,[]);n(this,xi,[]);n(this,wi,[]);n(this,hr,{});n(this,_i,void 0);s(this,_i,Yt(d(this,Xr,ws).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),o=i.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),a=i.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),h=i.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);s(this,At,this.def.feature_config?.min_temp??16),s(this,Jt,this.def.feature_config?.max_temp??32),s(this,_e,this.def.feature_config?.temp_step??.5),s(this,gi,this.def.unit_of_measurement??"°C"),s(this,bi,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),s(this,yi,this.def.feature_config?.fan_modes??[]),s(this,xi,this.def.feature_config?.preset_modes??[]),s(this,wi,this.def.feature_config?.swing_modes??[]);const l=d(this,lr,Bn).call(this,t(this,J)),u=dt(Z),f=dt(Z-l/100*A),g=ut*(1-l/100),[y,$]=t(this,J).toFixed(1).split(".");this.root.innerHTML=`
        <style>${Zs}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e&&r?`
              <div class="hrv-dial-wrap">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path class="hrv-dial-track" d="${Ge}"/>
                  <path class="hrv-dial-fill" d="${Ge}"
                    stroke-dasharray="${ut}" stroke-dashoffset="${g}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${p(y)}</span><span class="hrv-climate-temp-frac">.${p($)}</span><span class="hrv-climate-temp-unit">${p(t(this,gi))}</span>
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
                  <span class="hrv-climate-ro-temp-int">${p(y)}</span><span class="hrv-climate-ro-temp-frac">.${p($)}</span><span class="hrv-climate-ro-temp-unit">${p(t(this,gi))}</span>
                </div>
              </div>
            `:""}
            <div class="hrv-climate-grid">
              ${i.show_hvac_modes!==!1&&t(this,bi).length?`
                <button class="hrv-cf-btn" data-feat="mode" type="button"
                  ${e?'title="Change HVAC mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${a&&t(this,xi).length?`
                <button class="hrv-cf-btn" data-feat="preset" type="button"
                  ${e?'title="Change preset mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Preset</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${o&&t(this,yi).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button"
                  ${e?'title="Change fan mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${h&&t(this,wi).length?`
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
      `,s(this,rt,this.root.querySelector(".hrv-dial-wrap")),s(this,Dt,this.root.querySelector(".hrv-dial-fill")),s(this,wt,this.root.querySelector(".hrv-dial-thumb")),s(this,oi,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,ai,this.root.querySelector(".hrv-climate-state-text")),s(this,di,this.root.querySelector(".hrv-climate-temp-int")),s(this,hi,this.root.querySelector(".hrv-climate-temp-frac")),s(this,U,this.root.querySelector("[data-dir='-']")),s(this,X,this.root.querySelector("[data-dir='+']")),s(this,li,this.root.querySelector("[data-feat=mode]")),s(this,ci,this.root.querySelector("[data-feat=fan]")),s(this,pi,this.root.querySelector("[data-feat=preset]")),s(this,ui,this.root.querySelector("[data-feat=swing]")),s(this,B,this.root.querySelector(".hrv-climate-dropdown")),t(this,rt)&&(t(this,rt).addEventListener("pointerdown",d(this,Gr,ys).bind(this)),t(this,rt).addEventListener("pointermove",d(this,Ur,xs).bind(this)),t(this,rt).addEventListener("pointerup",d(this,ur,On).bind(this)),t(this,rt).addEventListener("pointercancel",d(this,ur,On).bind(this))),t(this,U)&&(t(this,U).addEventListener("click",()=>d(this,pr,jn).call(this,-1)),t(this,U).addEventListener("pointerdown",()=>t(this,U).setAttribute("data-pressing","true")),t(this,U).addEventListener("pointerup",()=>t(this,U).removeAttribute("data-pressing")),t(this,U).addEventListener("pointerleave",()=>t(this,U).removeAttribute("data-pressing")),t(this,U).addEventListener("pointercancel",()=>t(this,U).removeAttribute("data-pressing"))),t(this,X)&&(t(this,X).addEventListener("click",()=>d(this,pr,jn).call(this,1)),t(this,X).addEventListener("pointerdown",()=>t(this,X).setAttribute("data-pressing","true")),t(this,X).addEventListener("pointerup",()=>t(this,X).removeAttribute("data-pressing")),t(this,X).addEventListener("pointerleave",()=>t(this,X).removeAttribute("data-pressing")),t(this,X).addEventListener("pointercancel",()=>t(this,X).removeAttribute("data-pressing"))),e&&[t(this,li),t(this,ci),t(this,pi),t(this,ui)].forEach(_=>{if(!_)return;const ue=_.getAttribute("data-feat");_.addEventListener("click",()=>d(this,Yr,bs).call(this,ue)),_.addEventListener("pointerdown",()=>_.setAttribute("data-pressing","true")),_.addEventListener("pointerup",()=>_.removeAttribute("data-pressing")),_.addEventListener("pointerleave",()=>_.removeAttribute("data-pressing")),_.addEventListener("pointercancel",()=>_.removeAttribute("data-pressing"))}),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,hr,{...i}),s(this,Ct,e),s(this,vi,i.fan_mode??null),s(this,fi,i.preset_mode??null),s(this,mi,i.swing_mode??null),!t(this,Kt)&&i.temperature!==void 0&&(s(this,J,i.temperature),d(this,Ci,bn).call(this)),t(this,ai)&&(t(this,ai).textContent=Ye(i.hvac_action??e));const r=this.root.querySelector(".hrv-climate-ro-temp-int"),o=this.root.querySelector(".hrv-climate-ro-temp-frac");if(r&&i.temperature!==void 0){s(this,J,i.temperature);const[l,u]=t(this,J).toFixed(1).split(".");r.textContent=l,o.textContent=`.${u}`}d(this,Kr,_s).call(this);const a=i.hvac_action??e,h=Ye(a);this.announceState(`${this.def.friendly_name}, ${h}`)}predictState(e,i){const r={...t(this,hr)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:r}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,Ct),attributes:{...r,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,Ct),attributes:{...r,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,Ct),attributes:{...r,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,Ct),attributes:{...r,swing_mode:i.swing_mode}}:null}destroy(){t(this,_t)&&(document.removeEventListener("pointerdown",t(this,_t),!0),s(this,_t,null)),t(this,K)&&(window.removeEventListener("scroll",t(this,K),!0),window.removeEventListener("resize",t(this,K)),s(this,K,null));try{t(this,B)?.hidePopover?.()}catch{}}}rt=new WeakMap,Dt=new WeakMap,wt=new WeakMap,oi=new WeakMap,Kt=new WeakMap,ai=new WeakMap,di=new WeakMap,hi=new WeakMap,U=new WeakMap,X=new WeakMap,li=new WeakMap,ci=new WeakMap,pi=new WeakMap,ui=new WeakMap,B=new WeakMap,we=new WeakMap,_t=new WeakMap,K=new WeakMap,J=new WeakMap,Ct=new WeakMap,vi=new WeakMap,fi=new WeakMap,mi=new WeakMap,At=new WeakMap,Jt=new WeakMap,_e=new WeakMap,gi=new WeakMap,bi=new WeakMap,yi=new WeakMap,xi=new WeakMap,wi=new WeakMap,hr=new WeakMap,_i=new WeakMap,lr=new WeakSet,Bn=function(e){return Math.max(0,Math.min(100,(e-t(this,At))/(t(this,Jt)-t(this,At))*100))},Zr=new WeakSet,gs=function(e){const i=t(this,At)+e/100*(t(this,Jt)-t(this,At)),r=Math.round(i/t(this,_e))*t(this,_e);return Math.max(t(this,At),Math.min(t(this,Jt),+r.toFixed(10)))},Yr=new WeakSet,bs=function(e){if(t(this,we)===e){d(this,Ce,kr).call(this);return}t(this,we)&&d(this,Ce,kr).call(this),s(this,we,e);let i=[],r=null,o="",a="";switch(e){case"mode":i=t(this,bi),r=t(this,Ct),o="set_hvac_mode",a="hvac_mode";break;case"fan":i=t(this,yi),r=t(this,vi),o="set_fan_mode",a="fan_mode";break;case"preset":i=t(this,xi),r=t(this,fi),o="set_preset_mode",a="preset_mode";break;case"swing":i=t(this,wi),r=t(this,mi),o="set_swing_mode",a="swing_mode";break}if(!i.length||!t(this,B))return;t(this,B).innerHTML=i.map(u=>`
        <button class="hrv-cf-option" data-active="${u===r}" role="option"
          aria-selected="${u===r}" type="button">
          ${p(Ye(u))}
        </button>
      `).join(""),t(this,B).querySelectorAll(".hrv-cf-option").forEach((u,f)=>{u.addEventListener("click",()=>{this.config.card?.sendCommand(o,{[a]:i[f]}),d(this,Ce,kr).call(this)})});const h=this.root.querySelector(`[data-feat="${e}"]`);try{t(this,B).showPopover?.()}catch{}d(this,cr,Rn).call(this,h),s(this,K,()=>d(this,cr,Rn).call(this,h)),window.addEventListener("scroll",t(this,K),!0),window.addEventListener("resize",t(this,K));const l=u=>{u.composedPath().some(g=>g===this.root||g===this.root.host)||d(this,Ce,kr).call(this)};s(this,_t,l),document.addEventListener("pointerdown",l,!0)},cr=new WeakSet,Rn=function(e){if(!t(this,B)||!e)return;const i=e.getBoundingClientRect(),r=window.innerHeight-i.bottom,o=i.top,a=Math.min(t(this,B).scrollHeight||280,280),h=Math.max(140,Math.round(i.width));t(this,B).style.left=`${Math.round(i.left)}px`,t(this,B).style.minWidth=`${h}px`,o>=a+8||o>r?t(this,B).style.top=`${Math.max(8,Math.round(i.top-a-6))}px`:t(this,B).style.top=`${Math.round(i.bottom+6)}px`},Ce=new WeakSet,kr=function(){s(this,we,null);try{t(this,B)?.hidePopover?.()}catch{}t(this,_t)&&(document.removeEventListener("pointerdown",t(this,_t),!0),s(this,_t,null)),t(this,K)&&(window.removeEventListener("scroll",t(this,K),!0),window.removeEventListener("resize",t(this,K)),s(this,K,null))},pr=new WeakSet,jn=function(e){const i=Math.round((t(this,J)+e*t(this,_e))*100)/100;s(this,J,Math.max(t(this,At),Math.min(t(this,Jt),i))),d(this,Ci,bn).call(this),t(this,_i).call(this)},Ci=new WeakSet,bn=function(){const e=d(this,lr,Bn).call(this,t(this,J)),i=ut*(1-e/100),r=dt(Z-e/100*A);t(this,Dt)?.setAttribute("stroke-dashoffset",String(i)),t(this,wt)?.setAttribute("cx",String(r.x)),t(this,wt)?.setAttribute("cy",String(r.y)),t(this,oi)?.setAttribute("cx",String(r.x)),t(this,oi)?.setAttribute("cy",String(r.y));const[o,a]=t(this,J).toFixed(1).split(".");t(this,di)&&(t(this,di).textContent=o),t(this,hi)&&(t(this,hi).textContent=`.${a}`)},Gr=new WeakSet,ys=function(e){s(this,Kt,!0),t(this,rt)?.setPointerCapture(e.pointerId),d(this,vr,Vn).call(this,e)},Ur=new WeakSet,xs=function(e){t(this,Kt)&&d(this,vr,Vn).call(this,e)},ur=new WeakSet,On=function(e){if(t(this,Kt)){s(this,Kt,!1);try{t(this,rt)?.releasePointerCapture(e.pointerId)}catch{}t(this,Dt)&&(t(this,Dt).style.transition=""),t(this,wt)&&(t(this,wt).style.transition="")}},vr=new WeakSet,Vn=function(e){if(!t(this,rt))return;const i=t(this,rt).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,h=-(e.clientY-o);let l=Math.atan2(h,a)*180/Math.PI;l<0&&(l+=360);let u=Z-l;u<0&&(u+=360),u>A&&(u=u>A+(360-A)/2?0:A),s(this,J,d(this,Zr,gs).call(this,u/A*100)),t(this,Dt)&&(t(this,Dt).style.transition="none"),t(this,wt)&&(t(this,wt).style.transition="none"),d(this,Ci,bn).call(this),t(this,_i).call(this)},Xr=new WeakSet,ws=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,J)})},Kr=new WeakSet,_s=function(){const e=(i,r)=>{if(!i)return;const o=i.querySelector(".hrv-cf-value");o&&(o.textContent=Ye(r??"None"))};e(t(this,li),t(this,Ct)),e(t(this,ci),t(this,vi)),e(t(this,pi),t(this,fi)),e(t(this,ui),t(this,mi))};const Gs=`
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
  `;class Us extends m{constructor(){super(...arguments);n(this,Ae,null)}render(){this.root.innerHTML=`
        <style>${Gs}${z}</style>
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
      `,s(this,Ae,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.resolveIcon(this.def.icon_state_map?.off??this.def.icon,"mdi:radiobox-blank"),"state-icon"),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=e==="on",o=this.formatStateLabel(e);t(this,Ae)&&(t(this,Ae).setAttribute("data-on",String(r)),t(this,Ae).setAttribute("aria-label",`${this.def.friendly_name}: ${o}`));const a=r?"mdi:radiobox-marked":"mdi:radiobox-blank",h=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(h,a),"state-icon"),this.announceState(`${this.def.friendly_name}, ${o}`)}}Ae=new WeakMap;const Un='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',Xn='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',An='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',Xs=`
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
  `;class Ks extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,Ai);n(this,Jr);n(this,$e,null);n(this,$t,null);n(this,E,null);n(this,Le,null);n(this,Se,null);n(this,ke,null);n(this,Pt,!1);n(this,Lt,0);n(this,fr,"closed");n(this,mr,{});n(this,gr,void 0);s(this,gr,Yt(d(this,Jr,Cs).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints??{}).show_position!==!1&&this.def.supported_features?.includes("set_position"),o=!this.def.supported_features||this.def.supported_features.includes("buttons");this.root.innerHTML=`
        <style>${Xs}${z}</style>
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
                  title="Open cover" aria-label="Open cover">${Un}</button>
                <button class="hrv-cover-btn" data-action="stop" type="button"
                  title="Stop cover" aria-label="Stop cover">${Xn}</button>
                <button class="hrv-cover-btn" data-action="close" type="button"
                  title="Close cover" aria-label="Close cover">${An}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,$e,this.root.querySelector(".hrv-cover-slider-track")),s(this,$t,this.root.querySelector(".hrv-cover-slider-fill")),s(this,E,this.root.querySelector(".hrv-cover-slider-thumb")),s(this,Le,this.root.querySelector("[data-action=open]")),s(this,Se,this.root.querySelector("[data-action=stop]")),s(this,ke,this.root.querySelector("[data-action=close]"));const a=this.root.querySelector("[part=cover-ro-icon]");if(a&&(a.innerHTML=An),t(this,$e)&&t(this,E)&&e){const h=u=>{s(this,Pt,!0),t(this,E).style.transition="none",t(this,$t).style.transition="none",d(this,Ai,yn).call(this,u),t(this,E).setPointerCapture(u.pointerId)};t(this,E).addEventListener("pointerdown",h),t(this,$e).addEventListener("pointerdown",u=>{u.target!==t(this,E)&&(s(this,Pt,!0),t(this,E).style.transition="none",t(this,$t).style.transition="none",d(this,Ai,yn).call(this,u),t(this,E).setPointerCapture(u.pointerId))}),t(this,E).addEventListener("pointermove",u=>{t(this,Pt)&&d(this,Ai,yn).call(this,u)});const l=()=>{t(this,Pt)&&(s(this,Pt,!1),t(this,E).style.transition="",t(this,$t).style.transition="",t(this,gr).call(this))};t(this,E).addEventListener("pointerup",l),t(this,E).addEventListener("pointercancel",l)}[t(this,Le),t(this,Se),t(this,ke)].forEach(h=>{if(!h)return;const l=h.getAttribute("data-action");h.addEventListener("click",()=>{this.config.card?.sendCommand(`${l}_cover`,{})}),h.addEventListener("pointerdown",()=>h.setAttribute("data-pressing","true")),h.addEventListener("pointerup",()=>h.removeAttribute("data-pressing")),h.addEventListener("pointerleave",()=>h.removeAttribute("data-pressing")),h.addEventListener("pointercancel",()=>h.removeAttribute("data-pressing"))}),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,fr,e),s(this,mr,{...i});const r=e==="opening"||e==="closing",o=i.current_position;t(this,Le)&&(t(this,Le).disabled=!r&&o===100),t(this,Se)&&(t(this,Se).disabled=!r),t(this,ke)&&(t(this,ke).disabled=!r&&e==="closed"),i.current_position!==void 0&&!t(this,Pt)&&(s(this,Lt,i.current_position),t(this,$t)&&(t(this,$t).style.width=`${t(this,Lt)}%`),t(this,E)&&(t(this,E).style.left=`${t(this,Lt)}%`));const a=this.root.querySelector("[part=cover-ro-icon]");if(a){const h=e==="open"||e==="opening",l=e==="opening"||e==="closing";a.innerHTML=l?Xn:h?Un:An}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const r={...t(this,mr)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,fr),attributes:r}:e==="set_cover_position"&&i.position!==void 0?(r.current_position=i.position,{state:i.position>0?"open":"closed",attributes:r}):null}}$e=new WeakMap,$t=new WeakMap,E=new WeakMap,Le=new WeakMap,Se=new WeakMap,ke=new WeakMap,Pt=new WeakMap,Lt=new WeakMap,fr=new WeakMap,mr=new WeakMap,gr=new WeakMap,Ai=new WeakSet,yn=function(e){const i=t(this,$e).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,Lt,Math.round(r)),t(this,$t).style.width=`${t(this,Lt)}%`,t(this,E).style.left=`${t(this,Lt)}%`},Jr=new WeakSet,Cs=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,Lt)})};const Js=`
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
  `;class Qs extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,Qr);n(this,tn);n(this,ie);n(this,Li);n(this,en);n(this,re);n(this,Me,null);n(this,zt,null);n(this,q,null);n(this,R,null);n(this,$i,null);n(this,Qt,null);n(this,te,null);n(this,Bt,!1);n(this,D,0);n(this,nt,0);n(this,ct,100);n(this,Rt,1);n(this,ee,void 0);s(this,ee,Yt(d(this,en,Ls).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints?.display_mode??null)!=="buttons";s(this,nt,this.def.feature_config?.min??0),s(this,ct,this.def.feature_config?.max??100),s(this,Rt,this.def.feature_config?.step??1);const o=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${Js}${z}</style>
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
                  min="${t(this,nt)}" max="${t(this,ct)}" step="${t(this,Rt)}"
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
      `,s(this,Me,this.root.querySelector(".hrv-num-slider-track")),s(this,zt,this.root.querySelector(".hrv-num-slider-fill")),s(this,q,this.root.querySelector(".hrv-num-slider-thumb")),s(this,R,this.root.querySelector(".hrv-num-input")),s(this,$i,this.root.querySelector(".hrv-num-readonly-val")),s(this,Qt,this.root.querySelector("[part=dec-btn]")),s(this,te,this.root.querySelector("[part=inc-btn]")),t(this,Me)&&t(this,q)){const a=l=>{s(this,Bt,!0),t(this,q).style.transition="none",t(this,zt).style.transition="none",d(this,Li,xn).call(this,l),t(this,q).setPointerCapture(l.pointerId)};t(this,q).addEventListener("pointerdown",a),t(this,Me).addEventListener("pointerdown",l=>{l.target!==t(this,q)&&(s(this,Bt,!0),t(this,q).style.transition="none",t(this,zt).style.transition="none",d(this,Li,xn).call(this,l),t(this,q).setPointerCapture(l.pointerId))}),t(this,q).addEventListener("pointermove",l=>{t(this,Bt)&&d(this,Li,xn).call(this,l)});const h=()=>{t(this,Bt)&&(s(this,Bt,!1),t(this,q).style.transition="",t(this,zt).style.transition="",t(this,ee).call(this))};t(this,q).addEventListener("pointerup",h),t(this,q).addEventListener("pointercancel",h)}t(this,R)&&t(this,R).addEventListener("input",()=>{const a=parseFloat(t(this,R).value);isNaN(a)||(s(this,D,Math.max(t(this,nt),Math.min(t(this,ct),a))),d(this,ie,Ui).call(this),d(this,re,Xi).call(this),t(this,ee).call(this))}),t(this,Qt)&&t(this,Qt).addEventListener("click",()=>{s(this,D,+Math.max(t(this,nt),t(this,D)-t(this,Rt)).toFixed(10)),d(this,ie,Ui).call(this),t(this,R)&&(t(this,R).value=String(t(this,D))),d(this,re,Xi).call(this),t(this,ee).call(this)}),t(this,te)&&t(this,te).addEventListener("click",()=>{s(this,D,+Math.min(t(this,ct),t(this,D)+t(this,Rt)).toFixed(10)),d(this,ie,Ui).call(this),t(this,R)&&(t(this,R).value=String(t(this,D))),d(this,re,Xi).call(this),t(this,ee).call(this)}),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=parseFloat(e);if(isNaN(r))return;s(this,D,r),t(this,Bt)||(d(this,ie,Ui).call(this),t(this,R)&&!this.isFocused(t(this,R))&&(t(this,R).value=String(r))),d(this,re,Xi).call(this),t(this,$i)&&(t(this,$i).textContent=String(r));const o=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${o?` ${o}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}Me=new WeakMap,zt=new WeakMap,q=new WeakMap,R=new WeakMap,$i=new WeakMap,Qt=new WeakMap,te=new WeakMap,Bt=new WeakMap,D=new WeakMap,nt=new WeakMap,ct=new WeakMap,Rt=new WeakMap,ee=new WeakMap,Qr=new WeakSet,As=function(e){const i=t(this,ct)-t(this,nt);return i===0?0:Math.max(0,Math.min(100,(e-t(this,nt))/i*100))},tn=new WeakSet,$s=function(e){const i=t(this,nt)+e/100*(t(this,ct)-t(this,nt)),r=Math.round(i/t(this,Rt))*t(this,Rt);return Math.max(t(this,nt),Math.min(t(this,ct),+r.toFixed(10)))},ie=new WeakSet,Ui=function(){const e=d(this,Qr,As).call(this,t(this,D));t(this,zt)&&(t(this,zt).style.width=`${e}%`),t(this,q)&&(t(this,q).style.left=`${e}%`)},Li=new WeakSet,xn=function(e){const i=t(this,Me).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,D,d(this,tn,$s).call(this,r)),d(this,ie,Ui).call(this),t(this,R)&&(t(this,R).value=String(t(this,D))),d(this,re,Xi).call(this)},en=new WeakSet,Ls=function(){this.config.card?.sendCommand("set_value",{value:t(this,D)})},re=new WeakSet,Xi=function(){t(this,Qt)&&(t(this,Qt).disabled=t(this,D)<=t(this,nt)),t(this,te)&&(t(this,te).disabled=t(this,D)>=t(this,ct))};const to=`
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
  `;class Kn extends m{constructor(){super(...arguments);n(this,nn);n(this,sn);n(this,br);n(this,yr);n(this,ae);n(this,N,null);n(this,P,null);n(this,Ee,null);n(this,rn,"");n(this,ne,[]);n(this,Si,"");n(this,jt,!1);n(this,He,[]);n(this,Ot,[]);n(this,se,"pills");n(this,oe,null);n(this,Q,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";s(this,se,i==="dropdown"?"dropdown":"pills"),s(this,ne,this.def.feature_config?.options??[]);const r=e?t(this,se)==="dropdown"?`
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
        <style>${to}${z}</style>
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
      `,s(this,N,this.root.querySelector(".hrv-is-selected")),s(this,P,this.root.querySelector(".hrv-is-dropdown")),s(this,Ee,this.root.querySelector(".hrv-is-grid")),s(this,He,[]),s(this,Ot,[]),s(this,Si,""),t(this,N)&&e&&t(this,se)==="dropdown"&&(t(this,N).addEventListener("click",o=>{o.stopPropagation(),t(this,jt)?d(this,ae,Ki).call(this):d(this,yr,Wn).call(this)}),t(this,N).addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" "||o.key==="ArrowDown")&&!t(this,jt)?(o.preventDefault(),d(this,yr,Wn).call(this),t(this,Ot)[0]?.focus()):o.key==="Escape"&&t(this,jt)&&(d(this,ae,Ki).call(this),t(this,N).focus())}),s(this,oe,o=>{t(this,jt)&&!this.root.host.contains(o.target)&&d(this,ae,Ki).call(this)}),document.addEventListener("click",t(this,oe))),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,rn,e);const r=i?.options,o=Array.isArray(r)&&r.length?r:t(this,ne);s(this,ne,o);const a=o.join("|");if(a!==t(this,Si)&&(s(this,Si,a),t(this,se)==="dropdown"?d(this,sn,ks).call(this,o):d(this,nn,Ss).call(this,o)),t(this,se)==="dropdown"){const h=this.root.querySelector(".hrv-is-label");h&&(h.textContent=e);for(const l of t(this,Ot))l.setAttribute("data-active",String(l.dataset.option===e))}else{for(const l of t(this,He))l.setAttribute("data-active",String(l.dataset.option===e));const h=this.root.querySelector(".hrv-is-label");h&&(h.textContent=e)}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{options:t(this,ne)}}:null}destroy(){t(this,oe)&&(document.removeEventListener("click",t(this,oe)),s(this,oe,null)),t(this,Q)&&(window.removeEventListener("scroll",t(this,Q),!0),window.removeEventListener("resize",t(this,Q)),s(this,Q,null));try{t(this,P)?.hidePopover?.()}catch{}}}N=new WeakMap,P=new WeakMap,Ee=new WeakMap,rn=new WeakMap,ne=new WeakMap,Si=new WeakMap,jt=new WeakMap,He=new WeakMap,Ot=new WeakMap,se=new WeakMap,oe=new WeakMap,Q=new WeakMap,nn=new WeakSet,Ss=function(e){if(t(this,Ee)){t(this,Ee).innerHTML="",s(this,He,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-pill",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i})}),t(this,Ee).appendChild(r),t(this,He).push(r)}}},sn=new WeakSet,ks=function(e){if(t(this,P)){t(this,P).innerHTML="",s(this,Ot,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-option",r.role="option",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i}),d(this,ae,Ki).call(this),t(this,N)?.focus()}),r.addEventListener("keydown",o=>{const a=t(this,Ot),h=a.indexOf(r);o.key==="ArrowDown"?(o.preventDefault(),a[Math.min(h+1,a.length-1)]?.focus()):o.key==="ArrowUp"?(o.preventDefault(),h===0?t(this,N)?.focus():a[h-1]?.focus()):o.key==="Escape"&&(d(this,ae,Ki).call(this),t(this,N)?.focus())}),t(this,P).appendChild(r),t(this,Ot).push(r)}}},br=new WeakSet,Fn=function(){if(!t(this,P)||!t(this,N))return;const e=t(this,N).getBoundingClientRect(),i=window.innerHeight-e.bottom,r=e.top,o=Math.min(t(this,P).scrollHeight||280,280);t(this,P).style.left=`${Math.round(e.left)}px`,t(this,P).style.width=`${Math.round(e.width)}px`,i<o+8&&r>i?t(this,P).style.top=`${Math.max(8,Math.round(e.top-o-6))}px`:t(this,P).style.top=`${Math.round(e.bottom+6)}px`},yr=new WeakSet,Wn=function(){if(!(!t(this,P)||!t(this,ne).length)){try{t(this,P).showPopover?.()}catch{}t(this,N)?.setAttribute("aria-expanded","true"),d(this,br,Fn).call(this),s(this,Q,()=>d(this,br,Fn).call(this)),window.addEventListener("scroll",t(this,Q),!0),window.addEventListener("resize",t(this,Q)),s(this,jt,!0)}},ae=new WeakSet,Ki=function(){try{t(this,P)?.hidePopover?.()}catch{}t(this,N)?.setAttribute("aria-expanded","false"),t(this,Q)&&(window.removeEventListener("scroll",t(this,Q),!0),window.removeEventListener("resize",t(this,Q)),s(this,Q,null)),s(this,jt,!1)};const eo=`
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
  `;class io extends m{constructor(e,i,r,o){super(e,i,r,o);n(this,Ei);n(this,on);n(this,Vt,null);n(this,ki,null);n(this,Mi,null);n(this,Te,null);n(this,Ie,null);n(this,St,null);n(this,H,null);n(this,qe,null);n(this,De,null);n(this,Pe,!1);n(this,kt,0);n(this,Ft,!1);n(this,ze,"idle");n(this,Be,{});n(this,xr,void 0);s(this,xr,this.debounce(d(this,on,Ms).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_transport!==!1,a=r.show_volume!==!1&&i.includes("volume_set"),h=i.includes("previous_track");if(this.root.innerHTML=`
        <style>${eo}${z}</style>
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
      `,s(this,Vt,this.root.querySelector("[data-role=play]")),s(this,ki,this.root.querySelector("[data-role=prev]")),s(this,Mi,this.root.querySelector("[data-role=next]")),s(this,Te,this.root.querySelector(".hrv-mp-mute")),s(this,Ie,this.root.querySelector(".hrv-mp-slider-track")),s(this,St,this.root.querySelector(".hrv-mp-slider-fill")),s(this,H,this.root.querySelector(".hrv-mp-slider-thumb")),s(this,qe,this.root.querySelector(".hrv-mp-artist")),s(this,De,this.root.querySelector(".hrv-mp-title")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,Vt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,ki)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Mi)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,Vt),t(this,ki),t(this,Mi)].forEach(l=>{l&&(l.addEventListener("pointerdown",()=>l.setAttribute("data-pressing","true")),l.addEventListener("pointerup",()=>l.removeAttribute("data-pressing")),l.addEventListener("pointerleave",()=>l.removeAttribute("data-pressing")),l.addEventListener("pointercancel",()=>l.removeAttribute("data-pressing")))}),t(this,Te)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,Pe)})),t(this,Ie)&&t(this,H))){const l=f=>{s(this,Ft,!0),t(this,H).style.transition="none",t(this,St).style.transition="none",d(this,Ei,wn).call(this,f),t(this,H).setPointerCapture(f.pointerId)};t(this,H).addEventListener("pointerdown",l),t(this,Ie).addEventListener("pointerdown",f=>{f.target!==t(this,H)&&(s(this,Ft,!0),t(this,H).style.transition="none",t(this,St).style.transition="none",d(this,Ei,wn).call(this,f),t(this,H).setPointerCapture(f.pointerId))}),t(this,H).addEventListener("pointermove",f=>{t(this,Ft)&&d(this,Ei,wn).call(this,f)});const u=()=>{t(this,Ft)&&(s(this,Ft,!1),t(this,H).style.transition="",t(this,St).style.transition="",t(this,xr).call(this))};t(this,H).addEventListener("pointerup",u),t(this,H).addEventListener("pointercancel",u)}this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,ze,e),s(this,Be,i);const r=e==="playing",o=e==="paused";if(t(this,qe)){const h=i.media_artist??"";t(this,qe).textContent=h,t(this,qe).title=h||"Artist"}if(t(this,De)){const h=i.media_title??"";t(this,De).textContent=h,t(this,De).title=h||"Title"}if(t(this,Vt)){t(this,Vt).setAttribute("data-playing",String(r));const h=r?"mdi:pause":"mdi:play";this.renderIcon(h,"play-icon"),this.def.capabilities==="read-write"&&(t(this,Vt).title=r?"Pause":"Play")}if(s(this,Pe,!!i.is_volume_muted),t(this,Te)){const h=t(this,Pe)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(h,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,Te).title=t(this,Pe)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,Ft)&&(s(this,kt,Math.round(i.volume_level*100)),t(this,St)&&(t(this,St).style.width=`${t(this,kt)}%`),t(this,H)&&(t(this,H).style.left=`${t(this,kt)}%`));const a=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${a?` - ${a}`:""}`)}predictState(e,i){return e==="media_play_pause"?{state:t(this,ze)==="playing"?"paused":"playing",attributes:t(this,Be)}:e==="volume_mute"?{state:t(this,ze),attributes:{...t(this,Be),is_volume_muted:!!i.is_volume_muted}}:e==="volume_set"?{state:t(this,ze),attributes:{...t(this,Be),volume_level:i.volume_level}}:null}}Vt=new WeakMap,ki=new WeakMap,Mi=new WeakMap,Te=new WeakMap,Ie=new WeakMap,St=new WeakMap,H=new WeakMap,qe=new WeakMap,De=new WeakMap,Pe=new WeakMap,kt=new WeakMap,Ft=new WeakMap,ze=new WeakMap,Be=new WeakMap,xr=new WeakMap,Ei=new WeakSet,wn=function(e){const i=t(this,Ie).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,kt,Math.round(r)),t(this,St).style.width=`${t(this,kt)}%`,t(this,H).style.left=`${t(this,kt)}%`},on=new WeakSet,Ms=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,kt)/100})};const ro=`
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
  `;class no extends m{constructor(){super(...arguments);n(this,Hi,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.tapAction?.data?.command??"power";this.root.innerHTML=`
        <style>${ro}${z}</style>
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
      `,s(this,Hi,this.root.querySelector(".hrv-remote-circle"));const r=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(r,"remote-icon"),t(this,Hi)&&e&&this._attachGestureHandlers(t(this,Hi),{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}const a=this.config.tapAction?.data?.command??"power",h=this.config.tapAction?.data?.device??void 0,l=h?{command:a,device:h}:{command:a};this.config.card?.sendCommand("send_command",l)}}),this.renderCompanions(),T(this.root)}applyState(e,i){const r=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(r,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Hi=new WeakMap;const so=`
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
  `;class Hr extends m{constructor(){super(...arguments);n(this,Ti,null);n(this,Ii,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${so}${z}</style>
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
      `,s(this,Ti,this.root.querySelector(".hrv-sensor-val")),s(this,Ii,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){t(this,Ti)&&(t(this,Ti).textContent=e),t(this,Ii)&&i.unit_of_measurement!==void 0&&(t(this,Ii).textContent=i.unit_of_measurement);const r=i.unit_of_measurement??this.def.unit_of_measurement??"",o=this.root.querySelector("[part=card-body]");o&&(o.title=`${e}${r?` ${r}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${r?` ${r}`:""}`)}}Ti=new WeakMap,Ii=new WeakMap;const oo=`
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
  `;class Jn extends m{constructor(){super(...arguments);n(this,Mt,null);n(this,qi,null);n(this,Re,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${oo}${z}</style>
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
      `,s(this,Mt,this.root.querySelector(".hrv-switch-track")),s(this,qi,this.root.querySelector(".hrv-switch-ro")),t(this,Mt)&&e&&this._attachGestureHandlers(t(this,Mt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){s(this,Re,e==="on");const r=e==="unavailable"||e==="unknown";t(this,Mt)&&(t(this,Mt).setAttribute("data-on",String(t(this,Re))),t(this,Mt).title=t(this,Re)?"On - click to turn off":"Off - click to turn on",t(this,Mt).disabled=r),t(this,qi)&&(t(this,qi).textContent=Ye(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,Re)?"off":"on",attributes:{}}}}Mt=new WeakMap,qi=new WeakMap,Re=new WeakMap;const ao=`
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
  `;function Tr(c){c<0&&(c=0);const v=Math.floor(c/3600),e=Math.floor(c%3600/60),i=Math.floor(c%60),r=o=>String(o).padStart(2,"0");return v>0?`${v}:${r(e)}:${r(i)}`:`${r(e)}:${r(i)}`}function Qn(c){if(typeof c=="number")return c;if(typeof c!="string")return 0;const v=c.split(":").map(Number);return v.length===3?v[0]*3600+v[1]*60+v[2]:v.length===2?v[0]*60+v[1]:v[0]||0}class ho extends m{constructor(){super(...arguments);n(this,an);n(this,dn);n(this,hn);n(this,Oe);n(this,ot,null);n(this,Wt,null);n(this,de,null);n(this,he,null);n(this,je,null);n(this,Di,"idle");n(this,Pi,{});n(this,pt,null);n(this,zi,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${ao}${z}</style>
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
      `,s(this,ot,this.root.querySelector(".hrv-timer-display")),s(this,Wt,this.root.querySelector("[data-action=playpause]")),s(this,de,this.root.querySelector("[data-action=cancel]")),s(this,he,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,Wt)?.addEventListener("click",()=>{const i=t(this,Di)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,de)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,he)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,Wt),t(this,de),t(this,he)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){s(this,Di,e),s(this,Pi,{...i}),s(this,pt,i.finishes_at??null),s(this,zi,i.remaining!=null?Qn(i.remaining):null),d(this,an,Es).call(this,e),d(this,dn,Hs).call(this,e),e==="active"&&t(this,pt)?d(this,hn,Ts).call(this):d(this,Oe,Mr).call(this),t(this,ot)&&t(this,ot).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const r={...t(this,Pi)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,pt)&&(r.remaining=Math.max(0,(new Date(t(this,pt)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}ot=new WeakMap,Wt=new WeakMap,de=new WeakMap,he=new WeakMap,je=new WeakMap,Di=new WeakMap,Pi=new WeakMap,pt=new WeakMap,zi=new WeakMap,an=new WeakSet,Es=function(e){const i=e==="idle",r=e==="active";if(t(this,Wt)){const o=r?"mdi:pause":"mdi:play",a=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(o,"playpause-icon"),t(this,Wt).title=a,t(this,Wt).setAttribute("aria-label",`${this.def.friendly_name} - ${a}`)}t(this,de)&&(t(this,de).disabled=i),t(this,he)&&(t(this,he).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},dn=new WeakSet,Hs=function(e){if(t(this,ot)){if(e==="idle"){const i=t(this,Pi).duration;t(this,ot).textContent=i?Tr(Qn(i)):"00:00";return}if(e==="paused"&&t(this,zi)!=null){t(this,ot).textContent=Tr(t(this,zi));return}if(e==="active"&&t(this,pt)){const i=Math.max(0,(new Date(t(this,pt)).getTime()-Date.now())/1e3);t(this,ot).textContent=Tr(i)}}},hn=new WeakSet,Ts=function(){d(this,Oe,Mr).call(this),s(this,je,setInterval(()=>{if(!t(this,pt)||t(this,Di)!=="active"){d(this,Oe,Mr).call(this);return}const e=Math.max(0,(new Date(t(this,pt)).getTime()-Date.now())/1e3);t(this,ot)&&(t(this,ot).textContent=Tr(e)),e<=0&&d(this,Oe,Mr).call(this)},1e3))},Oe=new WeakSet,Mr=function(){t(this,je)&&(clearInterval(t(this,je)),s(this,je,null))};const lo=`
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
  `;class co extends m{constructor(){super(...arguments);n(this,Bi,null);n(this,Et,null);n(this,Ve,!1);n(this,Fe,!1)}render(){const e=this.def.capabilities==="read-write";s(this,Fe,!1),this.root.innerHTML=`
        <style>${lo}${z}</style>
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
      `,s(this,Bi,this.root.querySelector(".hrv-generic-state")),s(this,Et,this.root.querySelector(".hrv-generic-toggle")),t(this,Et)&&e&&this._attachGestureHandlers(t(this,Et),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){const r=e==="on"||e==="off";s(this,Ve,e==="on"),t(this,Bi)&&(t(this,Bi).textContent=Ye(e)),t(this,Et)&&(r&&!t(this,Fe)&&(t(this,Et).removeAttribute("hidden"),s(this,Fe,!0)),t(this,Fe)&&(t(this,Et).setAttribute("data-on",String(t(this,Ve))),t(this,Et).title=t(this,Ve)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,Ve)?"off":"on",attributes:{}}}}Bi=new WeakMap,Et=new WeakMap,Ve=new WeakMap,Fe=new WeakMap;const ts={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",pouring:"M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z","snowy-rainy":"M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z",hail:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z","lightning-rainy":"M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z","windy-variant":"M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},po=ts.cloudy,uo="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,1A1,1 0 0,1 13,2L13,2.01C13,2.01 14.35,3.56 15.72,5.55C17.09,7.54 18.5,9.93 18.5,12.5A6.5,6.5 0 0,1 12,19A6.5,6.5 0 0,1 5.5,12.5C5.5,9.93 6.91,7.54 8.28,5.55C9.65,3.56 11,2.01 11,2.01L11,2A1,1 0 0,1 12,1Z",vo="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",fo="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",mo=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function $n(c,v){const e=ts[c]??po;return`<svg viewBox="0 0 24 24" width="${v}" height="${v}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function Ln(c){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${c}" fill="currentColor"/></svg>`}const go=`
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
  `;class bo extends m{constructor(){super(...arguments);n(this,tt);n(this,wr);n(this,_r);n(this,Cr);n(this,ln);n(this,Ri,null);n(this,We,null);n(this,ji,null);n(this,Oi,null);n(this,Vi,null);n(this,Fi,null);n(this,st,null);n(this,Ht,null);n(this,at,null);n(this,Wi,null);n(this,Ni,null);n(this,Ne,null);n(this,Ze,null)}render(){this.root.innerHTML=`
        <style>${go}${z}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${p(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-weather-main">
              <span class="hrv-weather-icon">${$n("cloudy",44)}</span>
              <span class="hrv-weather-temp">--<span class="hrv-weather-unit"></span></span>
            </div>
            <span class="hrv-weather-cond" aria-live="polite">--</span>
            <div class="hrv-weather-stats">
              <span class="hrv-weather-stat" data-stat="humidity">
                ${Ln(uo)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="wind">
                ${Ln(vo)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="pressure">
                ${Ln(fo)}
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
      `,s(this,Ri,this.root.querySelector(".hrv-weather-icon")),s(this,We,this.root.querySelector(".hrv-weather-temp")),s(this,ji,this.root.querySelector(".hrv-weather-cond")),s(this,Oi,this.root.querySelector("[data-stat=humidity] [data-value]")),s(this,Vi,this.root.querySelector("[data-stat=wind] [data-value]")),s(this,Fi,this.root.querySelector("[data-stat=pressure] [data-value]")),s(this,st,this.root.querySelector(".hrv-forecast-strip")),s(this,Ht,this.root.querySelector(".hrv-forecast-toggle")),s(this,at,this.root.querySelector(".hrv-forecast-scroll-track")),s(this,Wi,this.root.querySelector(".hrv-forecast-scroll-thumb")),t(this,st)&&(t(this,st).addEventListener("scroll",()=>d(this,Cr,Yn).call(this),{passive:!0}),s(this,Ni,qs(t(this,st)))),t(this,at)&&t(this,at).addEventListener("pointerdown",e=>d(this,ln,Is).call(this,e)),this.renderCompanions(),T(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}destroy(){var e;(e=t(this,Ni))==null||e.call(this),s(this,Ni,null)}applyState(e,i){const r=e||"cloudy";t(this,Ri)&&(t(this,Ri).innerHTML=$n(r,44));const o=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,ji)&&(t(this,ji).textContent=o);const a=i.temperature??i.native_temperature;let h=String(i.temperature_unit||i.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(h&&!/^°/.test(h)&&h.length<=2&&(h=`°${h}`),t(this,We)){const u=t(this,We).querySelector(".hrv-weather-unit");t(this,We).firstChild.textContent=a!=null?Math.round(Number(a)):"--",u&&(u.textContent=h)}if(t(this,Oi)){const u=i.humidity;t(this,Oi).textContent=u!=null?`${u}%`:"--"}if(t(this,Vi)){const u=i.wind_speed,f=i.wind_speed_unit??"";t(this,Vi).textContent=u!=null?`${u} ${f}`.trim():"--"}if(t(this,Fi)){const u=i.pressure,f=i.pressure_unit??"";t(this,Fi).textContent=u!=null?`${u} ${f}`.trim():"--"}const l=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;s(this,Ne,l?i.forecast_daily??i.forecast??null:null),s(this,Ze,l?i.forecast_hourly??null:null),d(this,wr,Nn).call(this),d(this,_r,Zn).call(this),this.announceState(`${this.def.friendly_name}, ${o}, ${a??"--"} ${h}`)}}Ri=new WeakMap,We=new WeakMap,ji=new WeakMap,Oi=new WeakMap,Vi=new WeakMap,Fi=new WeakMap,st=new WeakMap,Ht=new WeakMap,at=new WeakMap,Wi=new WeakMap,Ni=new WeakMap,tt=new WeakSet,ve=function(){return this.config._forecastMode??"daily"},_n=function(e){this.config._forecastMode=e},Ne=new WeakMap,Ze=new WeakMap,wr=new WeakSet,Nn=function(){if(!t(this,Ht))return;const e=Array.isArray(t(this,Ne))&&t(this,Ne).length>0,i=Array.isArray(t(this,Ze))&&t(this,Ze).length>0;if(!e&&!i){t(this,Ht).textContent="";return}e&&!i&&s(this,tt,"daily",_n),!e&&i&&s(this,tt,"hourly",_n),e&&i?(t(this,Ht).textContent=t(this,tt,ve)==="daily"?"Hourly":"5-Day",t(this,Ht).onclick=()=>{s(this,tt,t(this,tt,ve)==="daily"?"hourly":"daily",_n),d(this,wr,Nn).call(this),d(this,_r,Zn).call(this)}):(t(this,Ht).textContent="",t(this,Ht).onclick=null)},_r=new WeakSet,Zn=function(){if(!t(this,st))return;const e=t(this,tt,ve)==="hourly"?t(this,Ze):t(this,Ne);if(t(this,st).setAttribute("data-mode",t(this,tt,ve)),!Array.isArray(e)||e.length===0){t(this,st).innerHTML="",t(this,at)&&(t(this,at).hidden=!0);return}const i=t(this,tt,ve)==="daily"?e.slice(0,5):e;t(this,st).innerHTML=i.map(r=>{const o=new Date(r.datetime);let a;t(this,tt,ve)==="hourly"?a=o.toLocaleTimeString([],{hour:"numeric"}):a=mo[o.getDay()]??"";const h=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",l=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="hrv-forecast-day" role="listitem">
            <span class="hrv-forecast-day-name">${p(String(a))}</span>
            ${$n(r.condition||"cloudy",18)}
            <span class="hrv-forecast-temps">
              ${p(String(h))}${l!=null?`/<span class="hrv-forecast-lo">${p(String(l))}</span>`:""}
            </span>
          </div>`}).join(""),t(this,tt,ve)==="hourly"?requestAnimationFrame(()=>d(this,Cr,Yn).call(this)):t(this,at)&&(t(this,at).hidden=!0)},Cr=new WeakSet,Yn=function(){const e=t(this,st),i=t(this,at),r=t(this,Wi);if(!e||!i||!r)return;const o=e.scrollWidth>e.clientWidth?e.clientWidth/e.scrollWidth:1;if(o>=1){i.hidden=!0;return}i.hidden=!1;const a=i.clientWidth,h=Math.max(20,o*a),l=a-h,u=e.scrollLeft/(e.scrollWidth-e.clientWidth);r.style.width=`${h}px`,r.style.left=`${u*l}px`},ln=new WeakSet,Is=function(e){const i=t(this,st),r=t(this,at),o=t(this,Wi);if(!i||!r||!o)return;e.preventDefault();const a=r.getBoundingClientRect(),h=parseFloat(o.style.width)||20,l=g=>{const y=g-a.left-h/2,$=a.width-h,_=Math.max(0,Math.min(1,y/$));i.scrollLeft=_*(i.scrollWidth-i.clientWidth)};l(e.clientX);const u=g=>l(g.clientX),f=()=>{window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",f)};window.addEventListener("pointermove",u),window.addEventListener("pointerup",f)};const yo=`
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
  `;class xo extends m{constructor(){super(...arguments);n(this,Nt,null);n(this,Zi,null);n(this,le,!1);n(this,cn,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${yo}${z}</style>
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
      `,s(this,Nt,this.root.querySelector(".hrv-lock-icon-btn")),s(this,Zi,this.root.querySelector(".hrv-lock-ro-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lock"),"lock-icon"),t(this,Nt)&&e&&this._attachGestureHandlers(t(this,Nt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand(t(this,le)?"unlock":"lock",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){s(this,cn,e),s(this,le,e==="locked");const r=e==="jammed",a=r||(e==="locking"||e==="unlocking")||e==="unavailable"||e==="unknown";t(this,Nt)&&(t(this,Nt).setAttribute("aria-pressed",String(t(this,le))),t(this,Nt).disabled=a),t(this,Zi)&&t(this,Zi).setAttribute("data-locked",String(t(this,le)));const h=r?"mdi:lock-alert":t(this,le)?"mdi:lock":"mdi:lock-open",l=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(l,h),"lock-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="lock"?{state:"locking",attributes:{}}:e==="unlock"?{state:"unlocking",attributes:{}}:null}}Nt=new WeakMap,Zi=new WeakMap,le=new WeakMap,cn=new WeakMap;const Sn=`
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
  `;class es extends m{constructor(){super(...arguments);n(this,Zt,null);n(this,pn,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Sn}${z}</style>
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
      `,s(this,Zt,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:script-text-play"),"card-icon"),e&&t(this,Zt)&&this._attachGestureHandlers(t(this,Zt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("turn_on",this.def.service_data??{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){s(this,pn,e);const r=this.def.capabilities==="read-write",o=e==="on",a=!r||o||e==="unavailable"||e==="unknown";t(this,Zt)&&(t(this,Zt).disabled=a,t(this,Zt).dataset.running=String(o));const h=o?"mdi:script-text":"mdi:script-text-play",l=this.def.icon_state_map?.[e]??this.def.icon??h;this.renderIcon(this.resolveIcon(l,h),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="turn_on"?{state:"on",attributes:{}}:null}}Zt=new WeakMap,pn=new WeakMap,$r(es,"staleOnMount",!1);class is extends m{constructor(){super(...arguments);n(this,ce,null);n(this,un,"unknown")}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Sn}${z}</style>
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
      `,s(this,ce,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:robot"),"card-icon"),e&&t(this,ce)&&this._attachGestureHandlers(t(this,ce),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("trigger",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){s(this,un,e);const o=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,ce)&&(t(this,ce).disabled=o);const a=e==="on"?"mdi:robot":"mdi:robot-off",h=this.def.icon_state_map?.[e]??this.def.icon??a;this.renderIcon(this.resolveIcon(h,a),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e==="on"?"enabled":"disabled"}`)}}ce=new WeakMap,un=new WeakMap,$r(is,"staleOnMount",!1);class rs extends m{constructor(){super(...arguments);n(this,pe,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Sn}${z}</style>
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
      `,s(this,pe,this.root.querySelector(".hrv-action-icon-btn")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:gesture-tap-button"),"card-icon"),e&&t(this,pe)&&this._attachGestureHandlers(t(this,pe),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("press",{})}}),this.renderCompanions(),T(this.root)}applyState(e,i){const o=!(this.def.capabilities==="read-write")||e==="unavailable"||e==="unknown";t(this,pe)&&(t(this,pe).disabled=o);const a=this.def.icon_state_map?.[e]??this.def.icon??"mdi:gesture-tap-button";this.renderIcon(this.resolveIcon(a,"mdi:gesture-tap-button"),"card-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}pe=new WeakMap,$r(rs,"staleOnMount",!1);const wo=`
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
  `;class ns extends m{constructor(){super(...arguments);n(this,Yi,null)}render(){this.root.innerHTML=`
        <style>${wo}${z}</style>
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
      `,s(this,Yi,this.root.querySelector(".hrv-person-circle")),this.renderIcon(this.resolveIcon(this.def.icon,"mdi:account"),"person-icon"),this.renderCompanions(),T(this.root)}applyState(e,i){const r=e==="home";t(this,Yi)&&t(this,Yi).setAttribute("data-home",String(r));const o=e==="not_home"?"mdi:account-off":"mdi:home-account",a=this.def.icon_state_map?.[e]??this.def.icon??o;this.renderIcon(this.resolveIcon(a,o),"person-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Yi=new WeakMap,$r(ns,"staleOnMount",!0),w._renderers=w._renderers||{};const _o=window.__HARVEST_RENDERER_ID__||document.currentScript&&document.currentScript.dataset.rendererId||"minimus";w._renderers[_o]={light:Vs,fan:Ws,lock:xo,script:es,automation:is,button:rs,climate:Ys,binary_sensor:Us,cover:Ks,input_boolean:Jn,input_number:Qs,input_select:Kn,select:Kn,media_player:io,remote:no,sensor:Hr,"sensor.temperature":Hr,"sensor.humidity":Hr,"sensor.battery":Hr,switch:Jn,person:ns,timer:ho,weather:bo,generic:co,_capabilities:{fan:{display_modes:["on-off","continuous","stepped","cycle"]},input_number:{display_modes:["slider","buttons"]},input_select:{display_modes:["pills","dropdown"]},select:{display_modes:["pills","dropdown"]},light:{features:["brightness","color_temp","rgb"]},climate:{features:["hvac_modes","presets","fan_mode","swing_mode"]},cover:{features:["position","tilt"]},media_player:{features:["transport","volume","source"]}}}})();})();
