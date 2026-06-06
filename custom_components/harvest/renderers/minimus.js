(()=>{var fs=(C,x,u)=>{if(!x.has(C))throw TypeError("Cannot "+u)};var t=(C,x,u)=>(fs(C,x,"read from private field"),u?u.call(C):x.get(C)),s=(C,x,u)=>{if(x.has(C))throw TypeError("Cannot add the same private member more than once");x instanceof WeakSet?x.add(C):x.set(C,u)},n=(C,x,u,Wt)=>(fs(C,x,"write to private field"),Wt?Wt.call(C,u):x.set(C,u),u);var h=(C,x,u)=>(fs(C,x,"access private method"),u);(function(){"use strict";var Zt,T,Wi,R,ut,S,Q,We,Ze,vt,qt,ft,mt,ce,Ye,tt,gt,pe,Zi,Ge,vs,so,$,Lr,Rs,Sr,js,$r,Os,kr,Vs,Ue,is,Xe,rs,Mr,Fs,ue,br,Er,Ns,Hr,Ws,Yi,ms,Gi,gs,Tr,Zs,dt,W,qr,j,Ke,Z,bt,yt,xt,O,k,Yt,Dt,V,M,ve,Je,Ui,Qe,ss,fe,yr,Xi,bs,ti,ns,Ki,ys,Ji,xs,Gt,Oi,Dr,Ys,Pr,Gs,Qi,ws,tr,Cs,Ir,Us,er,_s,zr,Xs,et,Pt,wt,ei,Ut,ii,ri,si,Y,G,ni,oi,ai,hi,I,me,Ct,U,X,_t,di,li,ci,At,Xt,ge,pi,ui,vi,fi,mi,ir,gi,rr,As,Br,Ks,Rr,Js,sr,Ls,be,xr,nr,Ss,bi,os,jr,Qs,Or,tn,or,$s,ar,ks,Vr,en,Fr,rn,ye,xe,Lt,E,we,Ce,_e,It,St,hr,dr,lr,yi,as,Nr,sn,Ae,zt,q,z,xi,Kt,Jt,Bt,D,it,lt,Rt,Qt,Wr,nn,Zr,on,te,Vi,wi,hs,Yr,an,ee,Fi,F,P,Le,Gr,ie,Ci,jt,Se,Ot,re,se,K,Ur,hn,Xr,dn,cr,Ms,pr,Es,ne,Ni,Vt,_i,Ai,$e,ke,$t,H,Me,Ee,He,kt,Ft,Te,qe,ur,Li,ds,Kr,ln,Si,$i,ki,Mt,Mi,De,nt,Nt,oe,ae,Pe,Ei,Hi,ct,Ti,Jr,cn,Qr,pn,ts,un,Ie,wr,qi,Et,ze,Be,Di,Re,Pi,Ii,zi,Bi,rt,Ht,ot,Ri,ji,J,de,ls,je,Oe,vr,Hs,fr,Ts,mr,qs,es,vn;const C=window.HArvest;if(!C||!C.renderers||!C.renderers.BaseCard){console.warn("[HArvest Minimus] HArvest not found - pack not loaded.");return}const x=C.renderers.BaseCard,u=window.HArvest.esc;function Wt(c,v){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,c.apply(this,i)},v)}}function Ve(c){return c?c.charAt(0).toUpperCase()+c.slice(1).replace(/_/g," "):""}const at=`
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
  `;function fn(c){if(!c)return()=>{};const v=80,e=1.6,i=.96,r=.04;let o=null,a=0,l=0,d=0,p=!1,f=0;const m=[],b=()=>{f&&(cancelAnimationFrame(f),f=0)},L=y=>{for(;m.length&&m[0].t<y-v;)m.shift();if(m.length<2)return 0;const B=m[0],Tt=m[m.length-1],gr=Tt.t-B.t;return gr<=0?0:(Tt.x-B.x)/gr},w=()=>{if(Math.abs(d)<r)return;let y=performance.now();const B=Tt=>{const gr=Tt-y;if(y=Tt,c.scrollLeft-=d*gr,d*=Math.pow(i,gr/16),Math.abs(d)<r){f=0,d=0;return}const ro=c.scrollWidth-c.clientWidth;if(c.scrollLeft<=0||c.scrollLeft>=ro){f=0,d=0;return}f=requestAnimationFrame(B)};f=requestAnimationFrame(B)},he=y=>{if(c.scrollWidth<=c.clientWidth||y.pointerType==="touch")return;const B=y.target;if(!(B&&B!==c&&B.closest?.("button, a"))){b(),o=y.pointerId,a=y.clientX,l=c.scrollLeft,d=0,p=!1,m.length=0,m.push({x:y.clientX,t:y.timeStamp});try{c.setPointerCapture(o)}catch{}}},g=y=>{if(y.pointerId!==o)return;const B=y.clientX-a;Math.abs(B)>4&&(p=!0,c.dataset.dragging="true"),c.scrollLeft=l-B,m.push({x:y.clientX,t:y.timeStamp});const Tt=y.timeStamp-v;for(;m.length>2&&m[0].t<Tt;)m.shift()},_=y=>{if(y.pointerId===o){try{c.releasePointerCapture(o)}catch{}if(o=null,p){const B=Tt=>{Tt.stopPropagation(),Tt.preventDefault()};window.addEventListener("click",B,{capture:!0,once:!0}),requestAnimationFrame(()=>c.removeAttribute("data-dragging")),d=L(y.timeStamp)*e,w()}m.length=0}};return c.addEventListener("pointerdown",he),c.addEventListener("pointermove",g),c.addEventListener("pointerup",_),c.addEventListener("pointercancel",_),c.addEventListener("wheel",b,{passive:!0}),c.addEventListener("touchstart",b,{passive:!0}),()=>{b(),c.removeEventListener("pointerdown",he),c.removeEventListener("pointermove",g),c.removeEventListener("pointerup",_),c.removeEventListener("pointercancel",_),c.removeEventListener("wheel",b),c.removeEventListener("touchstart",b)}}function st(c){c.querySelectorAll("[part=companion]").forEach(v=>{v.title=v.getAttribute("aria-label")??""})}const mn=60,gn=60,le=48,N=225,A=270,pt=2*Math.PI*le*(A/360);function bn(c){return c*Math.PI/180}function ht(c){const v=bn(c);return{x:mn+le*Math.cos(v),y:gn-le*Math.sin(v)}}function yn(){const c=ht(N),v=ht(N-A);return`M ${c.x} ${c.y} A ${le} ${le} 0 1 1 ${v.x} ${v.y}`}const Fe=yn(),Ne=["brightness","temp","color"],Cr=120;function Ds(c){const v=A/Cr;let e="";for(let i=0;i<Cr;i++){const r=N-i*v,o=N-(i+1)*v,a=ht(r),l=ht(o),d=`M ${a.x} ${a.y} A ${le} ${le} 0 0 1 ${l.x} ${l.y}`,p=i===0||i===Cr-1?"round":"butt";e+=`<path d="${d}" stroke="${c(i/Cr)}" fill="none" stroke-width="8" stroke-linecap="${p}" />`}return e}const xn=Ds(c=>`hsl(${Math.round(c*360)},100%,50%)`),wn=Ds(c=>{const e=Math.round(143+112*c),i=Math.round(255*c);return`rgb(255,${e},${i})`}),cs=`
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
  `,Cn=`
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
  `;class _n extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,vs);s(this,Lr);s(this,Sr);s(this,$r);s(this,kr);s(this,Ue);s(this,Xe);s(this,Mr);s(this,ue);s(this,Er);s(this,Hr);s(this,Yi);s(this,Gi);s(this,Tr);s(this,Zt,null);s(this,T,null);s(this,Wi,null);s(this,R,null);s(this,ut,null);s(this,S,null);s(this,Q,null);s(this,We,null);s(this,Ze,null);s(this,vt,0);s(this,qt,4e3);s(this,ft,0);s(this,mt,!1);s(this,ce,!1);s(this,Ye,null);s(this,tt,0);s(this,gt,2e3);s(this,pe,6500);s(this,Zi,void 0);s(this,Ge,new Map);s(this,$,[]);n(this,Zi,Wt(h(this,Tr,Zs).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_brightness!==!1&&i.includes("brightness"),a=r.show_color_temp!==!1&&i.includes("color_temp"),l=r.show_rgb!==!1&&i.includes("rgb_color"),d=e&&(o||a||l),p=[o,a,l].filter(Boolean).length,f=e&&p>1;n(this,gt,this.def.feature_config?.min_color_temp_kelvin??2e3),n(this,pe,this.def.feature_config?.max_color_temp_kelvin??6500);const m=ht(N);this.root.innerHTML=`
        <style>${cs}${Cn}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${d?"":"hrv-no-dial"}">
            ${d?`
              <div class="hrv-dial-column">
                <div class="hrv-dial-wrap" role="slider" aria-valuemin="0"
                  aria-valuemax="100" aria-valuenow="0"
                  aria-label="${u(this.def.friendly_name)} brightness"
                  title="Drag to adjust">
                  <svg viewBox="0 0 120 120">
                    <g class="hrv-dial-segs hrv-dial-segs-color">${xn}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${wn}</g>
                    <path class="hrv-dial-track" d="${Fe}" />
                    <path class="hrv-dial-fill" d="${Fe}"
                      stroke-dasharray="${pt}"
                      stroke-dashoffset="${pt}" />
                    <circle class="hrv-dial-thumb" r="7"
                      cx="${m.x}" cy="${m.y}" />
                    <circle class="hrv-dial-thumb-hit" r="16"
                      cx="${m.x}" cy="${m.y}" />
                  </svg>
                  <span class="hrv-dial-pct">0%</span>
                </div>
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-light-ro-center">
                <div class="hrv-light-ro-circle" data-on="false"
                  role="img" aria-label="${u(this.def.friendly_name)}"
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
                  <div class="hrv-mode-switch" data-pos="0" data-count="${p}"
                    role="radiogroup" aria-label="Dial mode" tabindex="0">
                    <div class="hrv-mode-switch-thumb"></div>
                    ${'<span class="hrv-mode-dot"></span>'.repeat(p)}
                  </div>
                `:""}
                <button part="toggle-button" type="button"
                  aria-label="${u(this.def.friendly_name)} - toggle"
                  title="Turn ${u(this.def.friendly_name)} on / off">
                  <div class="hrv-light-toggle-knob"></div>
                </button>
              </div>
            `:""}
          </div>
          ${d?"":this.renderCompanionZoneHTML()}
        </div>
      `,n(this,Zt,this.root.querySelector("[part=toggle-button]")),n(this,T,this.root.querySelector(".hrv-dial-fill")),n(this,Wi,this.root.querySelector(".hrv-dial-track")),n(this,R,this.root.querySelector(".hrv-dial-thumb")),n(this,ut,this.root.querySelector(".hrv-dial-pct")),n(this,S,this.root.querySelector(".hrv-dial-wrap")),n(this,Ye,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,We,this.root.querySelector(".hrv-dial-segs-color")),n(this,Ze,this.root.querySelector(".hrv-dial-segs-temp")),n(this,Q,this.root.querySelector(".hrv-mode-switch")),t(this,Zt)&&this._attachGestureHandlers(t(this,Zt),{onTap:()=>{const b=this.config.gestureConfig?.tap;if(b){this._runAction(b);return}this.config.card?.sendCommand("toggle",{})}}),t(this,S)&&(t(this,S).addEventListener("pointerdown",h(this,Er,Ns).bind(this)),t(this,S).addEventListener("pointermove",h(this,Hr,Ws).bind(this)),t(this,S).addEventListener("pointerup",h(this,Yi,ms).bind(this)),t(this,S).addEventListener("pointercancel",h(this,Yi,ms).bind(this))),d&&h(this,Lr,Rs).call(this),t(this,Q)&&(t(this,Q).addEventListener("click",h(this,Sr,js).bind(this)),t(this,Q).addEventListener("keydown",h(this,kr,Vs).bind(this)),t(this,Q).addEventListener("mousemove",h(this,$r,Os).bind(this))),h(this,Xe,rs).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(b=>{b.title=b.getAttribute("aria-label")??"Companion";const L=b.getAttribute("data-entity");if(L&&t(this,Ge).has(L)){const w=t(this,Ge).get(L);b.setAttribute("data-on",String(w==="on"))}})}applyState(e,i){if(n(this,mt,e==="on"),n(this,vt,i?.brightness??0),i?.color_temp_kelvin!==void 0?n(this,qt,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&n(this,qt,Math.round(1e6/i.color_temp)),i?.hs_color)n(this,ft,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[o,a,l]=i.rgb_color;n(this,ft,Sn(o,a,l))}t(this,Zt)&&t(this,Zt).setAttribute("aria-pressed",String(t(this,mt)));const r=this.root.querySelector(".hrv-light-ro-circle");if(r){r.setAttribute("data-on",String(t(this,mt)));const o=t(this,mt)?"mdi:lightbulb":"mdi:lightbulb-outline",a=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??o;this.renderIcon(this.resolveIcon(a,o),"ro-state-icon");const l=i?.color_mode,d=l==="color_temp",p=l&&l!=="color_temp",f=this.root.querySelector('[data-attr="brightness"]');if(f){const L=Math.round(t(this,vt)/255*100);f.title=t(this,mt)?`Brightness: ${L}%`:"Brightness: off"}const m=this.root.querySelector('[data-attr="temp"]');m&&(m.title=`Color temperature: ${t(this,qt)}K`,m.style.display=p?"none":"");const b=this.root.querySelector('[data-attr="color"]');if(b)if(b.style.display=d?"none":"",i?.rgb_color){const[L,w,he]=i.rgb_color;b.style.background=`rgb(${L},${w},${he})`,b.title=`Color: rgb(${L}, ${w}, ${he})`}else b.style.background=`hsl(${t(this,ft)}, 100%, 50%)`,b.title=`Color: hue ${t(this,ft)}°`}h(this,Ue,is).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,mt)?"off":"on",attributes:{brightness:t(this,vt)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,r){t(this,Ge).set(e,i),super.updateCompanionState(e,i,r)}}Zt=new WeakMap,T=new WeakMap,Wi=new WeakMap,R=new WeakMap,ut=new WeakMap,S=new WeakMap,Q=new WeakMap,We=new WeakMap,Ze=new WeakMap,vt=new WeakMap,qt=new WeakMap,ft=new WeakMap,mt=new WeakMap,ce=new WeakMap,Ye=new WeakMap,tt=new WeakMap,gt=new WeakMap,pe=new WeakMap,Zi=new WeakMap,Ge=new WeakMap,vs=new WeakSet,so=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},$=new WeakMap,Lr=new WeakSet,Rs=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];n(this,$,[]),i[0]&&t(this,$).push(0),i[1]&&t(this,$).push(1),i[2]&&t(this,$).push(2),t(this,$).length===0&&t(this,$).push(0),t(this,$).includes(t(this,tt))||n(this,tt,t(this,$)[0])},Sr=new WeakSet,js=function(e){const i=t(this,Q).getBoundingClientRect(),r=e.clientY-i.top,o=i.height/3;let a;r<o?a=0:r<o*2?a=1:a=2,a=Math.min(a,t(this,$).length-1),n(this,tt,t(this,$)[a]),t(this,Q).setAttribute("data-pos",String(a)),h(this,Xe,rs).call(this),h(this,Ue,is).call(this)},$r=new WeakSet,Os=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},r=t(this,Q).getBoundingClientRect(),o=Math.min(Math.floor((e.clientY-r.top)/(r.height/t(this,$).length)),t(this,$).length-1),a=Ne[t(this,$)[Math.max(0,o)]];t(this,Q).title=`Dial mode: ${i[a]??a}`},kr=new WeakSet,Vs=function(e){const i=t(this,$).indexOf(t(this,tt));let r=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")r=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")r=Math.min(t(this,$).length-1,i+1);else return;e.preventDefault(),n(this,tt,t(this,$)[r]),t(this,Q).setAttribute("data-pos",String(r)),h(this,Xe,rs).call(this),h(this,Ue,is).call(this)},Ue=new WeakSet,is=function(){t(this,R)&&(t(this,R).style.transition="none"),t(this,T)&&(t(this,T).style.transition="none"),h(this,Mr,Fs).call(this),t(this,R)?.getBoundingClientRect(),t(this,T)?.getBoundingClientRect(),t(this,R)&&(t(this,R).style.transition=""),t(this,T)&&(t(this,T).style.transition="")},Xe=new WeakSet,rs=function(){if(!t(this,T))return;const e=Ne[t(this,tt)],i=e==="color"||e==="temp";t(this,Wi).style.display=i?"none":"",t(this,T).style.display=i?"none":"",t(this,We)&&t(this,We).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,Ze)&&t(this,Ze).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,T).setAttribute("stroke-dasharray",String(pt));const r={brightness:"brightness",temp:"color temperature",color:"color"},o={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,S)?.setAttribute("aria-label",`${u(this.def.friendly_name)} ${r[e]}`),t(this,S)&&(t(this,S).title=o[e])},Mr=new WeakSet,Fs=function(){const e=Ne[t(this,tt)];if(e==="brightness"){const i=t(this,mt)?t(this,vt):0;h(this,ue,br).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,qt)-t(this,gt))/(t(this,pe)-t(this,gt))*100);h(this,ue,br).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,ft)/360*100);h(this,ue,br).call(this,i)}},ue=new WeakSet,br=function(e){const i=Ne[t(this,tt)],r=e/100*A,o=ht(N-r);if(t(this,R)?.setAttribute("cx",String(o.x)),t(this,R)?.setAttribute("cy",String(o.y)),t(this,Ye)?.setAttribute("cx",String(o.x)),t(this,Ye)?.setAttribute("cy",String(o.y)),i==="brightness"){const a=pt*(1-e/100);t(this,T)?.setAttribute("stroke-dashoffset",String(a)),t(this,ut)&&(t(this,ut).textContent=e+"%"),t(this,S)?.setAttribute("aria-valuenow",String(e))}else if(i==="temp"){const a=Math.round(t(this,gt)+e/100*(t(this,pe)-t(this,gt)));t(this,ut)&&(t(this,ut).textContent=a+"K"),t(this,S)?.setAttribute("aria-valuenow",String(a))}else t(this,ut)&&(t(this,ut).textContent=Math.round(e/100*360)+"°"),t(this,S)?.setAttribute("aria-valuenow",String(Math.round(e/100*360)))},Er=new WeakSet,Ns=function(e){n(this,ce,!0),t(this,S)?.setPointerCapture(e.pointerId),h(this,Gi,gs).call(this,e)},Hr=new WeakSet,Ws=function(e){t(this,ce)&&h(this,Gi,gs).call(this,e)},Yi=new WeakSet,ms=function(e){if(t(this,ce)){n(this,ce,!1);try{t(this,S)?.releasePointerCapture(e.pointerId)}catch{}t(this,Zi).call(this)}},Gi=new WeakSet,gs=function(e){if(!t(this,S))return;const i=t(this,S).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let p=N-d;p<0&&(p+=360),p>A&&(p=p>A+(360-A)/2?0:A);const f=Math.round(p/A*100),m=Ne[t(this,tt)];m==="brightness"?n(this,vt,Math.round(f/100*255)):m==="temp"?n(this,qt,Math.round(t(this,gt)+f/100*(t(this,pe)-t(this,gt)))):n(this,ft,Math.round(f/100*360)),t(this,T)&&(t(this,T).style.transition="none"),t(this,R)&&(t(this,R).style.transition="none"),h(this,ue,br).call(this,f)},Tr=new WeakSet,Zs=function(){t(this,T)&&(t(this,T).style.transition=""),t(this,R)&&(t(this,R).style.transition="");const e=Ne[t(this,tt)];e==="brightness"?t(this,vt)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,vt)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,qt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,ft),100]})};const An=cs+`
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
  `;class Ln extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,Qe);s(this,fe);s(this,Xi);s(this,ti);s(this,Ki);s(this,Ji);s(this,Gt);s(this,Dr);s(this,Pr);s(this,Qi);s(this,tr);s(this,Ir);s(this,er);s(this,zr);s(this,dt,null);s(this,W,null);s(this,qr,null);s(this,j,null);s(this,Ke,null);s(this,Z,null);s(this,bt,null);s(this,yt,null);s(this,xt,null);s(this,O,!1);s(this,k,0);s(this,Yt,!1);s(this,Dt,"forward");s(this,V,null);s(this,M,[]);s(this,ve,!1);s(this,Je,null);s(this,Ui,void 0);n(this,Ui,Wt(h(this,Ir,Us).bind(this),300)),n(this,M,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??this.def.display_hints??{},o=r.display_mode??null;let a=i.includes("set_speed");const l=r.show_oscillate!==!1&&i.includes("oscillate"),d=r.show_direction!==!1&&i.includes("direction"),p=r.show_presets!==!1&&i.includes("preset_mode");o==="on-off"&&(a=!1);let f=e&&a,m=f&&t(this,fe,yr),b=m&&!t(this,M).length,L=m&&!!t(this,M).length;o==="continuous"?(m=!1,b=!1,L=!1):o==="stepped"?(L=!1,b=m&&!t(this,M).length):o==="cycle"&&(m=!0,L=!0,b=!1);const w=ht(N);this.root.innerHTML=`
        <style>${An}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${f?b?"hrv-fan-horiz":"":"hrv-no-dial"}">
            ${f?`
              <div class="hrv-dial-column">
                ${b?`
                  <div class="hrv-fan-hspeed-wrap">
                    <div class="hrv-fan-hspeed-switch" role="group"
                      aria-label="${u(this.def.friendly_name)} speed"
                      data-on="false">
                      <div class="hrv-fan-hspeed-thumb"></div>
                      ${t(this,ti,ns).map((g,_)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${g}" data-idx="${_}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${_+1} (${g}%)"
                          title="Speed ${_+1} (${g}%)"></div>
                      `).join("")}
                    </div>
                  </div>
                `:L?`
                  <div class="hrv-fan-stepped-wrap">
                    <button class="hrv-fan-speed-circle" part="speed-circle" type="button"
                      aria-pressed="false"
                      title="Click to increase fan speed"
                      aria-label="Click to increase fan speed"><svg class="hrv-fan-speed-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13,19C13,17.59 13.5,16.3 14.3,15.28C14.17,14.97 14.03,14.65 13.86,14.34C14.26,14 14.57,13.59 14.77,13.11C15.26,13.21 15.78,13.39 16.25,13.67C17.07,13.25 18,13 19,13C20.05,13 21.03,13.27 21.89,13.74C21.95,13.37 22,12.96 22,12.5C22,8.92 18.03,8.13 14.33,10.13C14,9.73 13.59,9.42 13.11,9.22C13.3,8.29 13.74,7.24 14.73,6.75C17.09,5.57 17,2 12.5,2C8.93,2 8.14,5.96 10.13,9.65C9.72,9.97 9.4,10.39 9.21,10.87C8.28,10.68 7.23,10.25 6.73,9.26C5.56,6.89 2,7 2,11.5C2,15.07 5.95,15.85 9.64,13.87C9.96,14.27 10.39,14.59 10.88,14.79C10.68,15.71 10.24,16.75 9.26,17.24C6.9,18.42 7,22 11.5,22C12.31,22 13,21.78 13.5,21.41C13.19,20.67 13,19.86 13,19M20,15V18H23V20H20V23H18V20H15V18H18V15H20Z"/></svg></button>
                  </div>
                `:`
                  <div class="hrv-dial-wrap" role="slider"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                    aria-label="${u(this.def.friendly_name)} speed"
                    title="Drag to adjust fan speed">
                    <svg viewBox="0 0 120 120">
                      <path class="hrv-dial-track" d="${Fe}" />
                      <path class="hrv-dial-fill" d="${Fe}"
                        stroke-dasharray="${pt}"
                        stroke-dashoffset="${pt}" />
                      <circle class="hrv-dial-thumb" r="7"
                        cx="${w.x}" cy="${w.y}" />
                      <circle class="hrv-dial-thumb-hit" r="16"
                        cx="${w.x}" cy="${w.y}" />
                    </svg>
                    <span class="hrv-dial-pct">0%</span>
                  </div>
                `}
                <div part="companion-zone" role="group" aria-label="Companions"></div>
              </div>
            `:e?"":`
              <div class="hrv-fan-ro-center">
                <div class="hrv-fan-ro-circle" data-on="false"
                  role="img" aria-label="${u(this.def.friendly_name)}"
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
                ${p?`
                  <button class="hrv-fan-feat-btn" data-feat="preset" type="button"
                    aria-label="Preset: none" title="Preset: none"></button>
                `:""}
                <button part="toggle-button" type="button"
                  aria-label="${u(this.def.friendly_name)} - toggle"
                  title="Turn ${u(this.def.friendly_name)} on / off">${f?"":'<span part="fan-onoff-icon" aria-hidden="true"></span>'}</button>
              </div>
            `:""}
          </div>
          ${f?"":this.renderCompanionZoneHTML()}
        </div>
      `,n(this,dt,this.root.querySelector("[part=toggle-button]")),n(this,W,this.root.querySelector(".hrv-dial-fill")),n(this,qr,this.root.querySelector(".hrv-dial-track")),n(this,j,this.root.querySelector(".hrv-dial-thumb")),n(this,Ke,this.root.querySelector(".hrv-dial-pct")),n(this,Z,this.root.querySelector(".hrv-dial-wrap")),n(this,Je,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,bt,this.root.querySelector('[data-feat="oscillate"]')),n(this,yt,this.root.querySelector('[data-feat="direction"]')),n(this,xt,this.root.querySelector('[data-feat="preset"]')),t(this,dt)&&!f&&(this.renderIcon(this.def.icon??"mdi:fan","fan-onoff-icon"),t(this,dt).setAttribute("data-animate",String(!!this.config.animate))),this._attachGestureHandlers(t(this,dt),{onTap:()=>{const g=this.config.gestureConfig?.tap;if(g){this._runAction(g);return}this.config.card?.sendCommand("toggle",{})}}),t(this,Z)&&(t(this,Z).addEventListener("pointerdown",h(this,Dr,Ys).bind(this)),t(this,Z).addEventListener("pointermove",h(this,Pr,Gs).bind(this)),t(this,Z).addEventListener("pointerup",h(this,Qi,ws).bind(this)),t(this,Z).addEventListener("pointercancel",h(this,Qi,ws).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const g=t(this,ti,ns);if(!g.length)return;let _;if(!t(this,O)||t(this,k)===0)_=g[0],n(this,O,!0),t(this,dt)?.setAttribute("aria-pressed","true");else{const y=g.findIndex(B=>B>t(this,k));_=y===-1?g[0]:g[y]}n(this,k,_),h(this,Ki,ys).call(this),this.config.card?.sendCommand("set_percentage",{percentage:_})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(g=>{const _=()=>{const y=Number(g.getAttribute("data-pct"));t(this,O)||(n(this,O,!0),t(this,dt)?.setAttribute("aria-pressed","true")),n(this,k,y),h(this,Ji,xs).call(this),this.config.card?.sendCommand("set_percentage",{percentage:y})};g.addEventListener("click",_),g.addEventListener("keydown",y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),_())})}),t(this,bt)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,Yt)})}),t(this,yt)?.addEventListener("click",()=>{const g=t(this,Dt)==="forward"?"reverse":"forward";n(this,Dt,g),h(this,Gt,Oi).call(this),this.config.card?.sendCommand("set_direction",{direction:g})}),t(this,xt)?.addEventListener("click",()=>{if(t(this,M).length){if(t(this,Xi,bs)){const g=t(this,V)??t(this,M)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:g});return}if(t(this,V)){const g=t(this,M).indexOf(t(this,V));if(g===-1||g===t(this,M).length-1){n(this,V,null),h(this,Gt,Oi).call(this);const _=t(this,Qe,ss),y=Math.floor(t(this,k)/_)*_||_;this.config.card?.sendCommand("set_percentage",{percentage:y})}else{const _=t(this,M)[g+1];n(this,V,_),h(this,Gt,Oi).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:_})}}else{const g=t(this,M)[0];n(this,V,g),h(this,Gt,Oi).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:g})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.def.icon??"mdi:fan","ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(g=>{g.title=g.getAttribute("aria-label")??"Companion"})}applyState(e,i){n(this,O,e==="on"),n(this,k,i?.percentage??0),n(this,Yt,i?.oscillating??!1),n(this,Dt,i?.direction??"forward"),n(this,V,i?.preset_mode??null),i?.preset_modes?.length&&n(this,M,i.preset_modes),t(this,dt)&&t(this,dt).setAttribute("aria-pressed",String(t(this,O)));const r=this.root.querySelector(".hrv-fan-ro-circle");r&&r.setAttribute("data-on",String(t(this,O))),t(this,fe,yr)&&!t(this,M).length?h(this,Ji,xs).call(this):t(this,fe,yr)?h(this,Ki,ys).call(this):h(this,zr,Xs).call(this),h(this,Gt,Oi).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,k)>0?`, ${Math.round(t(this,k))}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,O)?"off":"on",attributes:{percentage:t(this,k)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,Yt),direction:t(this,Dt),preset_mode:t(this,V),preset_modes:t(this,M)}}:null}}dt=new WeakMap,W=new WeakMap,qr=new WeakMap,j=new WeakMap,Ke=new WeakMap,Z=new WeakMap,bt=new WeakMap,yt=new WeakMap,xt=new WeakMap,O=new WeakMap,k=new WeakMap,Yt=new WeakMap,Dt=new WeakMap,V=new WeakMap,M=new WeakMap,ve=new WeakMap,Je=new WeakMap,Ui=new WeakMap,Qe=new WeakSet,ss=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},fe=new WeakSet,yr=function(){return t(this,Qe,ss)>1},Xi=new WeakSet,bs=function(){return t(this,fe,yr)&&t(this,M).length>0},ti=new WeakSet,ns=function(){const e=t(this,Qe,ss),i=[];for(let r=1;r*e<=100.001;r++)i.push(r*e);return i},Ki=new WeakSet,ys=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,O)));const i=t(this,O)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},Ji=new WeakSet,xs=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),r=t(this,ti,ns);let o=-1;if(t(this,O)&&t(this,k)>0){let a=1/0;r.forEach((l,d)=>{const p=Math.abs(l-t(this,k));p<a&&(a=p,o=d)})}e.setAttribute("data-on",String(o>=0)),i&&o>=0&&(i.style.left=`${2+o*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((a,l)=>{a.setAttribute("data-active",String(l===o))})},Gt=new WeakSet,Oi=function(){const e=t(this,Xi,bs);if(t(this,bt)){const i=e||t(this,Yt),r=e?"Oscillate":`Oscillate: ${t(this,Yt)?"on":"off"}`;t(this,bt).setAttribute("data-on",String(i)),t(this,bt).setAttribute("aria-pressed",String(i)),t(this,bt).setAttribute("aria-label",r),t(this,bt).title=r}if(t(this,yt)){const i=t(this,Dt)!=="reverse",r=`Direction: ${t(this,Dt)}`;t(this,yt).setAttribute("data-on",String(i)),t(this,yt).setAttribute("aria-pressed",String(i)),t(this,yt).setAttribute("aria-label",r),t(this,yt).title=r}if(t(this,xt)){const i=e||!!t(this,V),r=e?t(this,V)??t(this,M)[0]??"Preset":t(this,V)?`Preset: ${t(this,V)}`:"Preset: none";t(this,xt).setAttribute("data-on",String(i)),t(this,xt).setAttribute("aria-pressed",String(i)),t(this,xt).setAttribute("aria-label",r),t(this,xt).title=r}},Dr=new WeakSet,Ys=function(e){n(this,ve,!0),t(this,Z)?.setPointerCapture(e.pointerId),h(this,tr,Cs).call(this,e)},Pr=new WeakSet,Gs=function(e){t(this,ve)&&h(this,tr,Cs).call(this,e)},Qi=new WeakSet,ws=function(e){if(t(this,ve)){n(this,ve,!1);try{t(this,Z)?.releasePointerCapture(e.pointerId)}catch{}t(this,Ui).call(this)}},tr=new WeakSet,Cs=function(e){if(!t(this,Z))return;const i=t(this,Z).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let p=N-d;p<0&&(p+=360),p>A&&(p=p>A+(360-A)/2?0:A),n(this,k,Math.round(p/A*100)),t(this,W)&&(t(this,W).style.transition="none"),t(this,j)&&(t(this,j).style.transition="none"),h(this,er,_s).call(this,t(this,k))},Ir=new WeakSet,Us=function(){t(this,W)&&(t(this,W).style.transition=""),t(this,j)&&(t(this,j).style.transition=""),t(this,k)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,k)})},er=new WeakSet,_s=function(e){const i=pt*(1-e/100),r=ht(N-e/100*A);t(this,W)?.setAttribute("stroke-dashoffset",String(i)),t(this,j)?.setAttribute("cx",String(r.x)),t(this,j)?.setAttribute("cy",String(r.y)),t(this,Je)?.setAttribute("cx",String(r.x)),t(this,Je)?.setAttribute("cy",String(r.y)),t(this,Ke)&&(t(this,Ke).textContent=`${e}%`),t(this,Z)?.setAttribute("aria-valuenow",String(e))},zr=new WeakSet,Xs=function(){t(this,j)&&(t(this,j).style.transition="none"),t(this,W)&&(t(this,W).style.transition="none"),h(this,er,_s).call(this,t(this,O)?t(this,k):0),t(this,j)?.getBoundingClientRect(),t(this,W)?.getBoundingClientRect(),t(this,j)&&(t(this,j).style.transition=""),t(this,W)&&(t(this,W).style.transition="")};function Sn(c,v,e){c/=255,v/=255,e/=255;const i=Math.max(c,v,e),r=Math.min(c,v,e),o=i-r;if(o===0)return 0;let a;return i===c?a=(v-e)/o%6:i===v?a=(e-c)/o+2:a=(c-v)/o+4,Math.round((a*60+360)%360)}const $n=cs+`
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
  `;class kn extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,rr);s(this,Br);s(this,Rr);s(this,sr);s(this,be);s(this,nr);s(this,bi);s(this,jr);s(this,Or);s(this,or);s(this,ar);s(this,Vr);s(this,Fr);s(this,et,null);s(this,Pt,null);s(this,wt,null);s(this,ei,null);s(this,Ut,!1);s(this,ii,null);s(this,ri,null);s(this,si,null);s(this,Y,null);s(this,G,null);s(this,ni,null);s(this,oi,null);s(this,ai,null);s(this,hi,null);s(this,I,null);s(this,me,null);s(this,Ct,null);s(this,U,null);s(this,X,20);s(this,_t,"off");s(this,di,null);s(this,li,null);s(this,ci,null);s(this,At,16);s(this,Xt,32);s(this,ge,.5);s(this,pi,"°C");s(this,ui,[]);s(this,vi,[]);s(this,fi,[]);s(this,mi,[]);s(this,ir,{});s(this,gi,void 0);n(this,gi,Wt(h(this,Vr,en).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints??{},r=this.def.supported_features?.includes("target_temperature"),o=i.show_fan_mode!==!1&&(this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0),a=i.show_presets!==!1&&(this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0),l=i.show_swing_mode!==!1&&(this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0);n(this,At,this.def.feature_config?.min_temp??16),n(this,Xt,this.def.feature_config?.max_temp??32),n(this,ge,this.def.feature_config?.temp_step??.5),n(this,pi,this.def.unit_of_measurement??"°C"),n(this,ui,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),n(this,vi,this.def.feature_config?.fan_modes??[]),n(this,fi,this.def.feature_config?.preset_modes??[]),n(this,mi,this.def.feature_config?.swing_modes??[]);const d=h(this,rr,As).call(this,t(this,X)),p=ht(N),f=ht(N-d/100*A),m=pt*(1-d/100),[b,L]=t(this,X).toFixed(1).split(".");this.root.innerHTML=`
        <style>${$n}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e&&r?`
              <div class="hrv-dial-wrap">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path class="hrv-dial-track" d="${Fe}"/>
                  <path class="hrv-dial-fill" d="${Fe}"
                    stroke-dasharray="${pt}" stroke-dashoffset="${m}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${f.x}" cy="${f.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${u(b)}</span><span class="hrv-climate-temp-frac">.${u(L)}</span><span class="hrv-climate-temp-unit">${u(t(this,pi))}</span>
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
                  <span class="hrv-climate-ro-temp-int">${u(b)}</span><span class="hrv-climate-ro-temp-frac">.${u(L)}</span><span class="hrv-climate-ro-temp-unit">${u(t(this,pi))}</span>
                </div>
              </div>
            `:""}
            <div class="hrv-climate-grid">
              ${i.show_hvac_modes!==!1&&t(this,ui).length?`
                <button class="hrv-cf-btn" data-feat="mode" type="button"
                  ${e?'title="Change HVAC mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${a&&t(this,fi).length?`
                <button class="hrv-cf-btn" data-feat="preset" type="button"
                  ${e?'title="Change preset mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Preset</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${o&&t(this,vi).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button"
                  ${e?'title="Change fan mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${l&&t(this,mi).length?`
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
      `,n(this,et,this.root.querySelector(".hrv-dial-wrap")),n(this,Pt,this.root.querySelector(".hrv-dial-fill")),n(this,wt,this.root.querySelector(".hrv-dial-thumb")),n(this,ei,this.root.querySelector(".hrv-dial-thumb-hit")),n(this,ii,this.root.querySelector(".hrv-climate-state-text")),n(this,ri,this.root.querySelector(".hrv-climate-temp-int")),n(this,si,this.root.querySelector(".hrv-climate-temp-frac")),n(this,Y,this.root.querySelector("[data-dir='-']")),n(this,G,this.root.querySelector("[data-dir='+']")),n(this,ni,this.root.querySelector("[data-feat=mode]")),n(this,oi,this.root.querySelector("[data-feat=fan]")),n(this,ai,this.root.querySelector("[data-feat=preset]")),n(this,hi,this.root.querySelector("[data-feat=swing]")),n(this,I,this.root.querySelector(".hrv-climate-dropdown")),t(this,et)&&(t(this,et).addEventListener("pointerdown",h(this,jr,Qs).bind(this)),t(this,et).addEventListener("pointermove",h(this,Or,tn).bind(this)),t(this,et).addEventListener("pointerup",h(this,or,$s).bind(this)),t(this,et).addEventListener("pointercancel",h(this,or,$s).bind(this))),t(this,Y)&&(t(this,Y).addEventListener("click",()=>h(this,nr,Ss).call(this,-1)),t(this,Y).addEventListener("pointerdown",()=>t(this,Y).setAttribute("data-pressing","true")),t(this,Y).addEventListener("pointerup",()=>t(this,Y).removeAttribute("data-pressing")),t(this,Y).addEventListener("pointerleave",()=>t(this,Y).removeAttribute("data-pressing")),t(this,Y).addEventListener("pointercancel",()=>t(this,Y).removeAttribute("data-pressing"))),t(this,G)&&(t(this,G).addEventListener("click",()=>h(this,nr,Ss).call(this,1)),t(this,G).addEventListener("pointerdown",()=>t(this,G).setAttribute("data-pressing","true")),t(this,G).addEventListener("pointerup",()=>t(this,G).removeAttribute("data-pressing")),t(this,G).addEventListener("pointerleave",()=>t(this,G).removeAttribute("data-pressing")),t(this,G).addEventListener("pointercancel",()=>t(this,G).removeAttribute("data-pressing"))),e&&[t(this,ni),t(this,oi),t(this,ai),t(this,hi)].forEach(w=>{if(!w)return;const he=w.getAttribute("data-feat");w.addEventListener("click",()=>h(this,Rr,Js).call(this,he)),w.addEventListener("pointerdown",()=>w.setAttribute("data-pressing","true")),w.addEventListener("pointerup",()=>w.removeAttribute("data-pressing")),w.addEventListener("pointerleave",()=>w.removeAttribute("data-pressing")),w.addEventListener("pointercancel",()=>w.removeAttribute("data-pressing"))}),this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,ir,{...i}),n(this,_t,e),n(this,di,i.fan_mode??null),n(this,li,i.preset_mode??null),n(this,ci,i.swing_mode??null),!t(this,Ut)&&i.temperature!==void 0&&(n(this,X,i.temperature),h(this,bi,os).call(this)),t(this,ii)&&(t(this,ii).textContent=Ve(i.hvac_action??e));const r=this.root.querySelector(".hrv-climate-ro-temp-int"),o=this.root.querySelector(".hrv-climate-ro-temp-frac");if(r&&i.temperature!==void 0){n(this,X,i.temperature);const[d,p]=t(this,X).toFixed(1).split(".");r.textContent=d,o.textContent=`.${p}`}h(this,Fr,rn).call(this);const a=i.hvac_action??e,l=Ve(a);this.announceState(`${this.def.friendly_name}, ${l}`)}predictState(e,i){const r={...t(this,ir)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:r}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,_t),attributes:{...r,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,_t),attributes:{...r,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,_t),attributes:{...r,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,_t),attributes:{...r,swing_mode:i.swing_mode}}:null}destroy(){t(this,Ct)&&(document.removeEventListener("pointerdown",t(this,Ct),!0),n(this,Ct,null)),t(this,U)&&(window.removeEventListener("scroll",t(this,U),!0),window.removeEventListener("resize",t(this,U)),n(this,U,null));try{t(this,I)?.hidePopover?.()}catch{}}}et=new WeakMap,Pt=new WeakMap,wt=new WeakMap,ei=new WeakMap,Ut=new WeakMap,ii=new WeakMap,ri=new WeakMap,si=new WeakMap,Y=new WeakMap,G=new WeakMap,ni=new WeakMap,oi=new WeakMap,ai=new WeakMap,hi=new WeakMap,I=new WeakMap,me=new WeakMap,Ct=new WeakMap,U=new WeakMap,X=new WeakMap,_t=new WeakMap,di=new WeakMap,li=new WeakMap,ci=new WeakMap,At=new WeakMap,Xt=new WeakMap,ge=new WeakMap,pi=new WeakMap,ui=new WeakMap,vi=new WeakMap,fi=new WeakMap,mi=new WeakMap,ir=new WeakMap,gi=new WeakMap,rr=new WeakSet,As=function(e){return Math.max(0,Math.min(100,(e-t(this,At))/(t(this,Xt)-t(this,At))*100))},Br=new WeakSet,Ks=function(e){const i=t(this,At)+e/100*(t(this,Xt)-t(this,At)),r=Math.round(i/t(this,ge))*t(this,ge);return Math.max(t(this,At),Math.min(t(this,Xt),+r.toFixed(10)))},Rr=new WeakSet,Js=function(e){if(t(this,me)===e){h(this,be,xr).call(this);return}t(this,me)&&h(this,be,xr).call(this),n(this,me,e);let i=[],r=null,o="",a="";switch(e){case"mode":i=t(this,ui),r=t(this,_t),o="set_hvac_mode",a="hvac_mode";break;case"fan":i=t(this,vi),r=t(this,di),o="set_fan_mode",a="fan_mode";break;case"preset":i=t(this,fi),r=t(this,li),o="set_preset_mode",a="preset_mode";break;case"swing":i=t(this,mi),r=t(this,ci),o="set_swing_mode",a="swing_mode";break}if(!i.length||!t(this,I))return;t(this,I).innerHTML=i.map(p=>`
        <button class="hrv-cf-option" data-active="${p===r}" role="option"
          aria-selected="${p===r}" type="button">
          ${u(Ve(p))}
        </button>
      `).join(""),t(this,I).querySelectorAll(".hrv-cf-option").forEach((p,f)=>{p.addEventListener("click",()=>{this.config.card?.sendCommand(o,{[a]:i[f]}),h(this,be,xr).call(this)})});const l=this.root.querySelector(`[data-feat="${e}"]`);try{t(this,I).showPopover?.()}catch{}h(this,sr,Ls).call(this,l),n(this,U,()=>h(this,sr,Ls).call(this,l)),window.addEventListener("scroll",t(this,U),!0),window.addEventListener("resize",t(this,U));const d=p=>{p.composedPath().some(m=>m===this.root||m===this.root.host)||h(this,be,xr).call(this)};n(this,Ct,d),document.addEventListener("pointerdown",d,!0)},sr=new WeakSet,Ls=function(e){if(!t(this,I)||!e)return;const i=e.getBoundingClientRect(),r=window.innerHeight-i.bottom,o=i.top,a=Math.min(t(this,I).scrollHeight||280,280),l=Math.max(140,Math.round(i.width));t(this,I).style.left=`${Math.round(i.left)}px`,t(this,I).style.minWidth=`${l}px`,o>=a+8||o>r?t(this,I).style.top=`${Math.max(8,Math.round(i.top-a-6))}px`:t(this,I).style.top=`${Math.round(i.bottom+6)}px`},be=new WeakSet,xr=function(){n(this,me,null);try{t(this,I)?.hidePopover?.()}catch{}t(this,Ct)&&(document.removeEventListener("pointerdown",t(this,Ct),!0),n(this,Ct,null)),t(this,U)&&(window.removeEventListener("scroll",t(this,U),!0),window.removeEventListener("resize",t(this,U)),n(this,U,null))},nr=new WeakSet,Ss=function(e){const i=Math.round((t(this,X)+e*t(this,ge))*100)/100;n(this,X,Math.max(t(this,At),Math.min(t(this,Xt),i))),h(this,bi,os).call(this),t(this,gi).call(this)},bi=new WeakSet,os=function(){const e=h(this,rr,As).call(this,t(this,X)),i=pt*(1-e/100),r=ht(N-e/100*A);t(this,Pt)?.setAttribute("stroke-dashoffset",String(i)),t(this,wt)?.setAttribute("cx",String(r.x)),t(this,wt)?.setAttribute("cy",String(r.y)),t(this,ei)?.setAttribute("cx",String(r.x)),t(this,ei)?.setAttribute("cy",String(r.y));const[o,a]=t(this,X).toFixed(1).split(".");t(this,ri)&&(t(this,ri).textContent=o),t(this,si)&&(t(this,si).textContent=`.${a}`)},jr=new WeakSet,Qs=function(e){n(this,Ut,!0),t(this,et)?.setPointerCapture(e.pointerId),h(this,ar,ks).call(this,e)},Or=new WeakSet,tn=function(e){t(this,Ut)&&h(this,ar,ks).call(this,e)},or=new WeakSet,$s=function(e){if(t(this,Ut)){n(this,Ut,!1);try{t(this,et)?.releasePointerCapture(e.pointerId)}catch{}t(this,Pt)&&(t(this,Pt).style.transition=""),t(this,wt)&&(t(this,wt).style.transition="")}},ar=new WeakSet,ks=function(e){if(!t(this,et))return;const i=t(this,et).getBoundingClientRect(),r=i.left+i.width/2,o=i.top+i.height/2,a=e.clientX-r,l=-(e.clientY-o);let d=Math.atan2(l,a)*180/Math.PI;d<0&&(d+=360);let p=N-d;p<0&&(p+=360),p>A&&(p=p>A+(360-A)/2?0:A),n(this,X,h(this,Br,Ks).call(this,p/A*100)),t(this,Pt)&&(t(this,Pt).style.transition="none"),t(this,wt)&&(t(this,wt).style.transition="none"),h(this,bi,os).call(this),t(this,gi).call(this)},Vr=new WeakSet,en=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,X)})},Fr=new WeakSet,rn=function(){const e=(i,r)=>{if(!i)return;const o=i.querySelector(".hrv-cf-value");o&&(o.textContent=Ve(r??"None"))};e(t(this,ni),t(this,_t)),e(t(this,oi),t(this,di)),e(t(this,ai),t(this,li)),e(t(this,hi),t(this,ci))};const Mn=`
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
  `;class En extends x{constructor(){super(...arguments);s(this,ye,null)}render(){this.root.innerHTML=`
        <style>${Mn}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-bs-circle" data-on="false"
              role="img" aria-label="${u(this.def.friendly_name)}">
              <span part="state-icon" aria-hidden="true"></span>
            </div>
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,ye,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.def.icon_state_map?.off??this.def.icon??"mdi:radiobox-blank","state-icon"),this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=e==="on",o=this.formatStateLabel(e);t(this,ye)&&(t(this,ye).setAttribute("data-on",String(r)),t(this,ye).setAttribute("aria-label",`${this.def.friendly_name}: ${o}`));const a=this.def.icon_state_map?.[e]??this.def.icon??(r?"mdi:radiobox-marked":"mdi:radiobox-blank");this.renderIcon(a,"state-icon"),this.announceState(`${this.def.friendly_name}, ${o}`)}}ye=new WeakMap;const Hn='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',Tn='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',qn='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',Dn=`
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
  `;class Pn extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,yi);s(this,Nr);s(this,xe,null);s(this,Lt,null);s(this,E,null);s(this,we,null);s(this,Ce,null);s(this,_e,null);s(this,It,!1);s(this,St,0);s(this,hr,"closed");s(this,dr,{});s(this,lr,void 0);n(this,lr,Wt(h(this,Nr,sn).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints??{}).show_position!==!1&&this.def.supported_features?.includes("set_position"),o=!this.def.supported_features||this.def.supported_features.includes("buttons");if(this.root.innerHTML=`
        <style>${Dn}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
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
                  title="Open cover" aria-label="Open cover">${Hn}</button>
                <button class="hrv-cover-btn" data-action="stop" type="button"
                  title="Stop cover" aria-label="Stop cover">${Tn}</button>
                <button class="hrv-cover-btn" data-action="close" type="button"
                  title="Close cover" aria-label="Close cover">${qn}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,xe,this.root.querySelector(".hrv-cover-slider-track")),n(this,Lt,this.root.querySelector(".hrv-cover-slider-fill")),n(this,E,this.root.querySelector(".hrv-cover-slider-thumb")),n(this,we,this.root.querySelector("[data-action=open]")),n(this,Ce,this.root.querySelector("[data-action=stop]")),n(this,_e,this.root.querySelector("[data-action=close]")),t(this,xe)&&t(this,E)&&e){const a=d=>{n(this,It,!0),t(this,E).style.transition="none",t(this,Lt).style.transition="none",h(this,yi,as).call(this,d),t(this,E).setPointerCapture(d.pointerId)};t(this,E).addEventListener("pointerdown",a),t(this,xe).addEventListener("pointerdown",d=>{d.target!==t(this,E)&&(n(this,It,!0),t(this,E).style.transition="none",t(this,Lt).style.transition="none",h(this,yi,as).call(this,d),t(this,E).setPointerCapture(d.pointerId))}),t(this,E).addEventListener("pointermove",d=>{t(this,It)&&h(this,yi,as).call(this,d)});const l=()=>{t(this,It)&&(n(this,It,!1),t(this,E).style.transition="",t(this,Lt).style.transition="",t(this,lr).call(this))};t(this,E).addEventListener("pointerup",l),t(this,E).addEventListener("pointercancel",l)}[t(this,we),t(this,Ce),t(this,_e)].forEach(a=>{if(!a)return;const l=a.getAttribute("data-action");a.addEventListener("click",()=>{this.config.card?.sendCommand(`${l}_cover`,{})}),a.addEventListener("pointerdown",()=>a.setAttribute("data-pressing","true")),a.addEventListener("pointerup",()=>a.removeAttribute("data-pressing")),a.addEventListener("pointerleave",()=>a.removeAttribute("data-pressing")),a.addEventListener("pointercancel",()=>a.removeAttribute("data-pressing"))}),this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,hr,e),n(this,dr,{...i});const r=e==="opening"||e==="closing",o=i.current_position;t(this,we)&&(t(this,we).disabled=!r&&o===100),t(this,Ce)&&(t(this,Ce).disabled=!r),t(this,_e)&&(t(this,_e).disabled=!r&&e==="closed"),i.current_position!==void 0&&!t(this,It)&&(n(this,St,i.current_position),t(this,Lt)&&(t(this,Lt).style.width=`${t(this,St)}%`),t(this,E)&&(t(this,E).style.left=`${t(this,St)}%`)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const r={...t(this,dr)};return e==="open_cover"?(r.current_position=100,{state:"open",attributes:r}):e==="close_cover"?(r.current_position=0,{state:"closed",attributes:r}):e==="stop_cover"?{state:t(this,hr),attributes:r}:e==="set_cover_position"&&i.position!==void 0?(r.current_position=i.position,{state:i.position>0?"open":"closed",attributes:r}):null}}xe=new WeakMap,Lt=new WeakMap,E=new WeakMap,we=new WeakMap,Ce=new WeakMap,_e=new WeakMap,It=new WeakMap,St=new WeakMap,hr=new WeakMap,dr=new WeakMap,lr=new WeakMap,yi=new WeakSet,as=function(e){const i=t(this,xe).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,St,Math.round(r)),t(this,Lt).style.width=`${t(this,St)}%`,t(this,E).style.left=`${t(this,St)}%`},Nr=new WeakSet,sn=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,St)})};const In=`
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
  `;class zn extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,Wr);s(this,Zr);s(this,te);s(this,wi);s(this,Yr);s(this,ee);s(this,Ae,null);s(this,zt,null);s(this,q,null);s(this,z,null);s(this,xi,null);s(this,Kt,null);s(this,Jt,null);s(this,Bt,!1);s(this,D,0);s(this,it,0);s(this,lt,100);s(this,Rt,1);s(this,Qt,void 0);n(this,Qt,Wt(h(this,Yr,an).bind(this),300))}render(){const e=this.def.capabilities==="read-write",r=(this.config.displayHints?.display_mode??null)!=="buttons";n(this,it,this.def.feature_config?.min??0),n(this,lt,this.def.feature_config?.max??100),n(this,Rt,this.def.feature_config?.step??1);const o=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${In}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
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
                  aria-label="Decrease ${u(this.def.friendly_name)}">-</button>
                <input class="hrv-num-input" type="number"
                  min="${t(this,it)}" max="${t(this,lt)}" step="${t(this,Rt)}"
                  title="Enter value" aria-label="${u(this.def.friendly_name)} value">
                <button class="hrv-num-btn" type="button" part="inc-btn"
                  aria-label="Increase ${u(this.def.friendly_name)}">+</button>
                ${o?`<span class="hrv-num-unit">${u(o)}</span>`:""}
              </div>
            `:`
              <div class="hrv-num-readonly">
                <span class="hrv-num-readonly-val">-</span>
                ${o?`<span class="hrv-num-readonly-unit">${u(o)}</span>`:""}
              </div>
            `}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Ae,this.root.querySelector(".hrv-num-slider-track")),n(this,zt,this.root.querySelector(".hrv-num-slider-fill")),n(this,q,this.root.querySelector(".hrv-num-slider-thumb")),n(this,z,this.root.querySelector(".hrv-num-input")),n(this,xi,this.root.querySelector(".hrv-num-readonly-val")),n(this,Kt,this.root.querySelector("[part=dec-btn]")),n(this,Jt,this.root.querySelector("[part=inc-btn]")),t(this,Ae)&&t(this,q)){const a=d=>{n(this,Bt,!0),t(this,q).style.transition="none",t(this,zt).style.transition="none",h(this,wi,hs).call(this,d),t(this,q).setPointerCapture(d.pointerId)};t(this,q).addEventListener("pointerdown",a),t(this,Ae).addEventListener("pointerdown",d=>{d.target!==t(this,q)&&(n(this,Bt,!0),t(this,q).style.transition="none",t(this,zt).style.transition="none",h(this,wi,hs).call(this,d),t(this,q).setPointerCapture(d.pointerId))}),t(this,q).addEventListener("pointermove",d=>{t(this,Bt)&&h(this,wi,hs).call(this,d)});const l=()=>{t(this,Bt)&&(n(this,Bt,!1),t(this,q).style.transition="",t(this,zt).style.transition="",t(this,Qt).call(this))};t(this,q).addEventListener("pointerup",l),t(this,q).addEventListener("pointercancel",l)}t(this,z)&&t(this,z).addEventListener("input",()=>{const a=parseFloat(t(this,z).value);isNaN(a)||(n(this,D,Math.max(t(this,it),Math.min(t(this,lt),a))),h(this,te,Vi).call(this),h(this,ee,Fi).call(this),t(this,Qt).call(this))}),t(this,Kt)&&t(this,Kt).addEventListener("click",()=>{n(this,D,+Math.max(t(this,it),t(this,D)-t(this,Rt)).toFixed(10)),h(this,te,Vi).call(this),t(this,z)&&(t(this,z).value=String(t(this,D))),h(this,ee,Fi).call(this),t(this,Qt).call(this)}),t(this,Jt)&&t(this,Jt).addEventListener("click",()=>{n(this,D,+Math.min(t(this,lt),t(this,D)+t(this,Rt)).toFixed(10)),h(this,te,Vi).call(this),t(this,z)&&(t(this,z).value=String(t(this,D))),h(this,ee,Fi).call(this),t(this,Qt).call(this)}),this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){const r=parseFloat(e);if(isNaN(r))return;n(this,D,r),t(this,Bt)||(h(this,te,Vi).call(this),t(this,z)&&!this.isFocused(t(this,z))&&(t(this,z).value=String(r))),h(this,ee,Fi).call(this),t(this,xi)&&(t(this,xi).textContent=String(r));const o=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${r}${o?` ${o}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}Ae=new WeakMap,zt=new WeakMap,q=new WeakMap,z=new WeakMap,xi=new WeakMap,Kt=new WeakMap,Jt=new WeakMap,Bt=new WeakMap,D=new WeakMap,it=new WeakMap,lt=new WeakMap,Rt=new WeakMap,Qt=new WeakMap,Wr=new WeakSet,nn=function(e){const i=t(this,lt)-t(this,it);return i===0?0:Math.max(0,Math.min(100,(e-t(this,it))/i*100))},Zr=new WeakSet,on=function(e){const i=t(this,it)+e/100*(t(this,lt)-t(this,it)),r=Math.round(i/t(this,Rt))*t(this,Rt);return Math.max(t(this,it),Math.min(t(this,lt),+r.toFixed(10)))},te=new WeakSet,Vi=function(){const e=h(this,Wr,nn).call(this,t(this,D));t(this,zt)&&(t(this,zt).style.width=`${e}%`),t(this,q)&&(t(this,q).style.left=`${e}%`)},wi=new WeakSet,hs=function(e){const i=t(this,Ae).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,D,h(this,Zr,on).call(this,r)),h(this,te,Vi).call(this),t(this,z)&&(t(this,z).value=String(t(this,D))),h(this,ee,Fi).call(this)},Yr=new WeakSet,an=function(){this.config.card?.sendCommand("set_value",{value:t(this,D)})},ee=new WeakSet,Fi=function(){t(this,Kt)&&(t(this,Kt).disabled=t(this,D)<=t(this,it)),t(this,Jt)&&(t(this,Jt).disabled=t(this,D)>=t(this,lt))};const Bn=`
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
  `;class Ps extends x{constructor(){super(...arguments);s(this,Ur);s(this,Xr);s(this,cr);s(this,pr);s(this,ne);s(this,F,null);s(this,P,null);s(this,Le,null);s(this,Gr,"");s(this,ie,[]);s(this,Ci,"");s(this,jt,!1);s(this,Se,[]);s(this,Ot,[]);s(this,re,"pills");s(this,se,null);s(this,K,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.displayHints?.display_mode??this.def.display_hints?.display_mode??"pills";n(this,re,i==="dropdown"?"dropdown":"pills"),n(this,ie,this.def.feature_config?.options??[]);const r=e?t(this,re)==="dropdown"?`
            <button class="hrv-is-selected" type="button"
              title="Select an option"
              aria-label="${u(this.def.friendly_name)}"
              aria-haspopup="listbox" aria-expanded="false">
              <span class="hrv-is-label">-</span>
              <span class="hrv-is-arrow" aria-hidden="true">&#9660;</span>
            </button>
            <div class="hrv-is-dropdown" role="listbox" popover="manual"></div>`:'<div class="hrv-is-grid"></div>':`
        <button class="hrv-is-selected" type="button" data-readonly="true" disabled
          aria-label="${u(this.def.friendly_name)}">
          <span class="hrv-is-label">-</span>
        </button>`;this.root.innerHTML=`
        <style>${Bn}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${r}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,F,this.root.querySelector(".hrv-is-selected")),n(this,P,this.root.querySelector(".hrv-is-dropdown")),n(this,Le,this.root.querySelector(".hrv-is-grid")),n(this,Se,[]),n(this,Ot,[]),n(this,Ci,""),t(this,F)&&e&&t(this,re)==="dropdown"&&(t(this,F).addEventListener("click",o=>{o.stopPropagation(),t(this,jt)?h(this,ne,Ni).call(this):h(this,pr,Es).call(this)}),t(this,F).addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" "||o.key==="ArrowDown")&&!t(this,jt)?(o.preventDefault(),h(this,pr,Es).call(this),t(this,Ot)[0]?.focus()):o.key==="Escape"&&t(this,jt)&&(h(this,ne,Ni).call(this),t(this,F).focus())}),n(this,se,o=>{t(this,jt)&&!this.root.host.contains(o.target)&&h(this,ne,Ni).call(this)}),document.addEventListener("click",t(this,se))),this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Gr,e);const r=i?.options,o=Array.isArray(r)&&r.length?r:t(this,ie);n(this,ie,o);const a=o.join("|");if(a!==t(this,Ci)&&(n(this,Ci,a),t(this,re)==="dropdown"?h(this,Xr,dn).call(this,o):h(this,Ur,hn).call(this,o)),t(this,re)==="dropdown"){const l=this.root.querySelector(".hrv-is-label");l&&(l.textContent=e);for(const d of t(this,Ot))d.setAttribute("data-active",String(d.dataset.option===e))}else{for(const d of t(this,Se))d.setAttribute("data-active",String(d.dataset.option===e));const l=this.root.querySelector(".hrv-is-label");l&&(l.textContent=e)}this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{options:t(this,ie)}}:null}destroy(){t(this,se)&&(document.removeEventListener("click",t(this,se)),n(this,se,null)),t(this,K)&&(window.removeEventListener("scroll",t(this,K),!0),window.removeEventListener("resize",t(this,K)),n(this,K,null));try{t(this,P)?.hidePopover?.()}catch{}}}F=new WeakMap,P=new WeakMap,Le=new WeakMap,Gr=new WeakMap,ie=new WeakMap,Ci=new WeakMap,jt=new WeakMap,Se=new WeakMap,Ot=new WeakMap,re=new WeakMap,se=new WeakMap,K=new WeakMap,Ur=new WeakSet,hn=function(e){if(t(this,Le)){t(this,Le).innerHTML="",n(this,Se,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-pill",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i})}),t(this,Le).appendChild(r),t(this,Se).push(r)}}},Xr=new WeakSet,dn=function(e){if(t(this,P)){t(this,P).innerHTML="",n(this,Ot,[]);for(const i of e){const r=document.createElement("button");r.type="button",r.className="hrv-is-option",r.role="option",r.dataset.option=i,r.textContent=i,r.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:i}),h(this,ne,Ni).call(this),t(this,F)?.focus()}),r.addEventListener("keydown",o=>{const a=t(this,Ot),l=a.indexOf(r);o.key==="ArrowDown"?(o.preventDefault(),a[Math.min(l+1,a.length-1)]?.focus()):o.key==="ArrowUp"?(o.preventDefault(),l===0?t(this,F)?.focus():a[l-1]?.focus()):o.key==="Escape"&&(h(this,ne,Ni).call(this),t(this,F)?.focus())}),t(this,P).appendChild(r),t(this,Ot).push(r)}}},cr=new WeakSet,Ms=function(){if(!t(this,P)||!t(this,F))return;const e=t(this,F).getBoundingClientRect(),i=window.innerHeight-e.bottom,r=e.top,o=Math.min(t(this,P).scrollHeight||280,280);t(this,P).style.left=`${Math.round(e.left)}px`,t(this,P).style.width=`${Math.round(e.width)}px`,i<o+8&&r>i?t(this,P).style.top=`${Math.max(8,Math.round(e.top-o-6))}px`:t(this,P).style.top=`${Math.round(e.bottom+6)}px`},pr=new WeakSet,Es=function(){if(!(!t(this,P)||!t(this,ie).length)){try{t(this,P).showPopover?.()}catch{}t(this,F)?.setAttribute("aria-expanded","true"),h(this,cr,Ms).call(this),n(this,K,()=>h(this,cr,Ms).call(this)),window.addEventListener("scroll",t(this,K),!0),window.addEventListener("resize",t(this,K)),n(this,jt,!0)}},ne=new WeakSet,Ni=function(){try{t(this,P)?.hidePopover?.()}catch{}t(this,F)?.setAttribute("aria-expanded","false"),t(this,K)&&(window.removeEventListener("scroll",t(this,K),!0),window.removeEventListener("resize",t(this,K)),n(this,K,null)),n(this,jt,!1)};const Rn=`
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
  `;class jn extends x{constructor(e,i,r,o){super(e,i,r,o);s(this,Li);s(this,Kr);s(this,Vt,null);s(this,_i,null);s(this,Ai,null);s(this,$e,null);s(this,ke,null);s(this,$t,null);s(this,H,null);s(this,Me,null);s(this,Ee,null);s(this,He,!1);s(this,kt,0);s(this,Ft,!1);s(this,Te,"idle");s(this,qe,{});s(this,ur,void 0);n(this,ur,this.debounce(h(this,Kr,ln).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],r=this.config.displayHints??{},o=r.show_transport!==!1,a=r.show_volume!==!1&&i.includes("volume_set"),l=i.includes("previous_track");if(this.root.innerHTML=`
        <style>${Rn}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
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
      `,n(this,Vt,this.root.querySelector("[data-role=play]")),n(this,_i,this.root.querySelector("[data-role=prev]")),n(this,Ai,this.root.querySelector("[data-role=next]")),n(this,$e,this.root.querySelector(".hrv-mp-mute")),n(this,ke,this.root.querySelector(".hrv-mp-slider-track")),n(this,$t,this.root.querySelector(".hrv-mp-slider-fill")),n(this,H,this.root.querySelector(".hrv-mp-slider-thumb")),n(this,Me,this.root.querySelector(".hrv-mp-artist")),n(this,Ee,this.root.querySelector(".hrv-mp-title")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,Vt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,_i)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,Ai)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,Vt),t(this,_i),t(this,Ai)].forEach(d=>{d&&(d.addEventListener("pointerdown",()=>d.setAttribute("data-pressing","true")),d.addEventListener("pointerup",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointerleave",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointercancel",()=>d.removeAttribute("data-pressing")))}),t(this,$e)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,He)})),t(this,ke)&&t(this,H))){const d=f=>{n(this,Ft,!0),t(this,H).style.transition="none",t(this,$t).style.transition="none",h(this,Li,ds).call(this,f),t(this,H).setPointerCapture(f.pointerId)};t(this,H).addEventListener("pointerdown",d),t(this,ke).addEventListener("pointerdown",f=>{f.target!==t(this,H)&&(n(this,Ft,!0),t(this,H).style.transition="none",t(this,$t).style.transition="none",h(this,Li,ds).call(this,f),t(this,H).setPointerCapture(f.pointerId))}),t(this,H).addEventListener("pointermove",f=>{t(this,Ft)&&h(this,Li,ds).call(this,f)});const p=()=>{t(this,Ft)&&(n(this,Ft,!1),t(this,H).style.transition="",t(this,$t).style.transition="",t(this,ur).call(this))};t(this,H).addEventListener("pointerup",p),t(this,H).addEventListener("pointercancel",p)}this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Te,e),n(this,qe,i);const r=e==="playing",o=e==="paused";if(t(this,Me)){const l=i.media_artist??"";t(this,Me).textContent=l,t(this,Me).title=l||"Artist"}if(t(this,Ee)){const l=i.media_title??"";t(this,Ee).textContent=l,t(this,Ee).title=l||"Title"}if(t(this,Vt)){t(this,Vt).setAttribute("data-playing",String(r));const l=r?"mdi:pause":"mdi:play";this.renderIcon(l,"play-icon"),this.def.capabilities==="read-write"&&(t(this,Vt).title=r?"Pause":"Play")}if(n(this,He,!!i.is_volume_muted),t(this,$e)){const l=t(this,He)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(l,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,$e).title=t(this,He)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,Ft)&&(n(this,kt,Math.round(i.volume_level*100)),t(this,$t)&&(t(this,$t).style.width=`${t(this,kt)}%`),t(this,H)&&(t(this,H).style.left=`${t(this,kt)}%`));const a=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${a?` - ${a}`:""}`)}predictState(e,i){return e==="media_play_pause"?{state:t(this,Te)==="playing"?"paused":"playing",attributes:t(this,qe)}:e==="volume_mute"?{state:t(this,Te),attributes:{...t(this,qe),is_volume_muted:!!i.is_volume_muted}}:e==="volume_set"?{state:t(this,Te),attributes:{...t(this,qe),volume_level:i.volume_level}}:null}}Vt=new WeakMap,_i=new WeakMap,Ai=new WeakMap,$e=new WeakMap,ke=new WeakMap,$t=new WeakMap,H=new WeakMap,Me=new WeakMap,Ee=new WeakMap,He=new WeakMap,kt=new WeakMap,Ft=new WeakMap,Te=new WeakMap,qe=new WeakMap,ur=new WeakMap,Li=new WeakSet,ds=function(e){const i=t(this,ke).getBoundingClientRect(),r=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));n(this,kt,Math.round(r)),t(this,$t).style.width=`${t(this,kt)}%`,t(this,H).style.left=`${t(this,kt)}%`},Kr=new WeakSet,ln=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,kt)/100})};const On=`
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
  `;class Vn extends x{constructor(){super(...arguments);s(this,Si,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.tapAction?.data?.command??"power";this.root.innerHTML=`
        <style>${On}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <button class="hrv-remote-circle" type="button"
              title="${e?u(i):"Read-only"}"
              aria-label="${u(this.def.friendly_name)} - ${u(i)}"
              ${e?"":"disabled"}>
              <span part="remote-icon" aria-hidden="true"></span>
            </button>
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,Si,this.root.querySelector(".hrv-remote-circle"));const r=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(r,"remote-icon"),t(this,Si)&&e&&this._attachGestureHandlers(t(this,Si),{onTap:()=>{const o=this.config.gestureConfig?.tap;if(o){this._runAction(o);return}const a=this.config.tapAction?.data?.command??"power",l=this.config.tapAction?.data?.device??void 0,d=l?{command:a,device:l}:{command:a};this.config.card?.sendCommand("send_command",d)}}),this.renderCompanions(),st(this.root)}applyState(e,i){const r=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(r,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}Si=new WeakMap;const Fn=`
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
  `;class _r extends x{constructor(){super(...arguments);s(this,$i,null);s(this,ki,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${Fn}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" title="${u(this.def.friendly_name)}">
            <span class="hrv-sensor-val" aria-live="polite">-</span>
            ${e?`<span class="hrv-sensor-unit" title="${u(e)}">${u(e)}</span>`:""}
          </div>
          ${this.renderHistoryZoneHTML()}
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,$i,this.root.querySelector(".hrv-sensor-val")),n(this,ki,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){t(this,$i)&&(t(this,$i).textContent=e),t(this,ki)&&i.unit_of_measurement!==void 0&&(t(this,ki).textContent=i.unit_of_measurement);const r=i.unit_of_measurement??this.def.unit_of_measurement??"",o=this.root.querySelector("[part=card-body]");o&&(o.title=`${e}${r?` ${r}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${r?` ${r}`:""}`)}}$i=new WeakMap,ki=new WeakMap;const Nn=`
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
  `;class Is extends x{constructor(){super(...arguments);s(this,Mt,null);s(this,Mi,null);s(this,De,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Nn}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            ${e?`
              <button class="hrv-switch-track" type="button" data-on="false"
                title="Toggle" aria-label="${u(this.def.friendly_name)} - Toggle">
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
      `,n(this,Mt,this.root.querySelector(".hrv-switch-track")),n(this,Mi,this.root.querySelector(".hrv-switch-ro")),t(this,Mt)&&e&&this._attachGestureHandlers(t(this,Mt),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),st(this.root)}applyState(e,i){n(this,De,e==="on");const r=e==="unavailable"||e==="unknown";t(this,Mt)&&(t(this,Mt).setAttribute("data-on",String(t(this,De))),t(this,Mt).title=t(this,De)?"On - click to turn off":"Off - click to turn on",t(this,Mt).disabled=r),t(this,Mi)&&(t(this,Mi).textContent=Ve(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,De)?"off":"on",attributes:{}}}}Mt=new WeakMap,Mi=new WeakMap,De=new WeakMap;const Wn=`
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
  `;function Ar(c){c<0&&(c=0);const v=Math.floor(c/3600),e=Math.floor(c%3600/60),i=Math.floor(c%60),r=o=>String(o).padStart(2,"0");return v>0?`${v}:${r(e)}:${r(i)}`:`${r(e)}:${r(i)}`}function zs(c){if(typeof c=="number")return c;if(typeof c!="string")return 0;const v=c.split(":").map(Number);return v.length===3?v[0]*3600+v[1]*60+v[2]:v.length===2?v[0]*60+v[1]:v[0]||0}class Zn extends x{constructor(){super(...arguments);s(this,Jr);s(this,Qr);s(this,ts);s(this,Ie);s(this,nt,null);s(this,Nt,null);s(this,oe,null);s(this,ae,null);s(this,Pe,null);s(this,Ei,"idle");s(this,Hi,{});s(this,ct,null);s(this,Ti,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${Wn}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-timer-display" title="Time remaining">00:00</span>
            ${e?`
              <div class="hrv-timer-controls">
                <button class="hrv-timer-btn" data-action="playpause" type="button"
                  title="Start" aria-label="${u(this.def.friendly_name)} - Start">
                  <span part="playpause-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="cancel" type="button"
                  title="Cancel" aria-label="${u(this.def.friendly_name)} - Cancel">
                  <span part="cancel-icon" aria-hidden="true"></span>
                </button>
                <button class="hrv-timer-btn" data-action="finish" type="button"
                  title="Finish" aria-label="${u(this.def.friendly_name)} - Finish">
                  <span part="finish-icon" aria-hidden="true"></span>
                </button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,nt,this.root.querySelector(".hrv-timer-display")),n(this,Nt,this.root.querySelector("[data-action=playpause]")),n(this,oe,this.root.querySelector("[data-action=cancel]")),n(this,ae,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,Nt)?.addEventListener("click",()=>{const i=t(this,Ei)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,oe)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,ae)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,Nt),t(this,oe),t(this,ae)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}applyState(e,i){n(this,Ei,e),n(this,Hi,{...i}),n(this,ct,i.finishes_at??null),n(this,Ti,i.remaining!=null?zs(i.remaining):null),h(this,Jr,cn).call(this,e),h(this,Qr,pn).call(this,e),e==="active"&&t(this,ct)?h(this,ts,un).call(this):h(this,Ie,wr).call(this),t(this,nt)&&t(this,nt).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const r={...t(this,Hi)};return e==="start"?{state:"active",attributes:r}:e==="pause"?(t(this,ct)&&(r.remaining=Math.max(0,(new Date(t(this,ct)).getTime()-Date.now())/1e3)),{state:"paused",attributes:r}):e==="cancel"||e==="finish"?{state:"idle",attributes:r}:null}}nt=new WeakMap,Nt=new WeakMap,oe=new WeakMap,ae=new WeakMap,Pe=new WeakMap,Ei=new WeakMap,Hi=new WeakMap,ct=new WeakMap,Ti=new WeakMap,Jr=new WeakSet,cn=function(e){const i=e==="idle",r=e==="active";if(t(this,Nt)){const o=r?"mdi:pause":"mdi:play",a=r?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(o,"playpause-icon"),t(this,Nt).title=a,t(this,Nt).setAttribute("aria-label",`${this.def.friendly_name} - ${a}`)}t(this,oe)&&(t(this,oe).disabled=i),t(this,ae)&&(t(this,ae).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},Qr=new WeakSet,pn=function(e){if(t(this,nt)){if(e==="idle"){const i=t(this,Hi).duration;t(this,nt).textContent=i?Ar(zs(i)):"00:00";return}if(e==="paused"&&t(this,Ti)!=null){t(this,nt).textContent=Ar(t(this,Ti));return}if(e==="active"&&t(this,ct)){const i=Math.max(0,(new Date(t(this,ct)).getTime()-Date.now())/1e3);t(this,nt).textContent=Ar(i)}}},ts=new WeakSet,un=function(){h(this,Ie,wr).call(this),n(this,Pe,setInterval(()=>{if(!t(this,ct)||t(this,Ei)!=="active"){h(this,Ie,wr).call(this);return}const e=Math.max(0,(new Date(t(this,ct)).getTime()-Date.now())/1e3);t(this,nt)&&(t(this,nt).textContent=Ar(e)),e<=0&&h(this,Ie,wr).call(this)},1e3))},Ie=new WeakSet,wr=function(){t(this,Pe)&&(clearInterval(t(this,Pe)),n(this,Pe,null))};const Yn=`
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
  `;class Gn extends x{constructor(){super(...arguments);s(this,qi,null);s(this,Et,null);s(this,ze,!1);s(this,Be,!1)}render(){const e=this.def.capabilities==="read-write";n(this,Be,!1),this.root.innerHTML=`
        <style>${Yn}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <span class="hrv-generic-state" title="${u(this.def.friendly_name)}">-</span>
            ${e?`
              <button class="hrv-generic-toggle" type="button" data-on="false"
                title="Toggle" aria-label="${u(this.def.friendly_name)} - Toggle"
                hidden>
                <div class="hrv-generic-knob"></div>
              </button>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,n(this,qi,this.root.querySelector(".hrv-generic-state")),n(this,Et,this.root.querySelector(".hrv-generic-toggle")),t(this,Et)&&e&&this._attachGestureHandlers(t(this,Et),{onTap:()=>{const i=this.config.gestureConfig?.tap;if(i){this._runAction(i);return}this.config.card?.sendCommand("toggle",{})}}),this.renderCompanions(),st(this.root)}applyState(e,i){const r=e==="on"||e==="off";n(this,ze,e==="on"),t(this,qi)&&(t(this,qi).textContent=Ve(e)),t(this,Et)&&(r&&!t(this,Be)&&(t(this,Et).removeAttribute("hidden"),n(this,Be,!0)),t(this,Be)&&(t(this,Et).setAttribute("data-on",String(t(this,ze))),t(this,Et).title=t(this,ze)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,ze)?"off":"on",attributes:{}}}}qi=new WeakMap,Et=new WeakMap,ze=new WeakMap,Be=new WeakMap;const Bs={sunny:"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z","clear-night":"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",partlycloudy:"M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",cloudy:"M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",fog:"M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",rainy:"M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",pouring:"M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",snowy:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z","snowy-rainy":"M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z",hail:"M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",lightning:"M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z","lightning-rainy":"M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",windy:"M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z","windy-variant":"M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",exceptional:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"},Un=Bs.cloudy,Xn="M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,1A1,1 0 0,1 13,2L13,2.01C13,2.01 14.35,3.56 15.72,5.55C17.09,7.54 18.5,9.93 18.5,12.5A6.5,6.5 0 0,1 12,19A6.5,6.5 0 0,1 5.5,12.5C5.5,9.93 6.91,7.54 8.28,5.55C9.65,3.56 11,2.01 11,2.01L11,2A1,1 0 0,1 12,1Z",Kn="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",Jn="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.58,10C10.6,10.18 9.81,10.79 9.4,11.6L6.27,11.29C5.82,11.25 5.4,11.54 5.29,11.97C5.18,12.41 5.4,12.86 5.82,13.04L8.88,14.31C9.16,15.29 9.93,16.08 10.92,16.35L11.28,19.39C11.33,19.83 11.7,20.16 12.14,20.16C12.18,20.16 12.22,20.16 12.27,20.15C12.75,20.09 13.1,19.66 13.04,19.18L12.68,16.19C13.55,15.8 14.15,14.96 14.21,14H17.58C18.05,14 18.44,13.62 18.44,13.14C18.44,12.67 18.05,12.29 17.58,12.29H14.21C14.15,11.74 13.93,11.24 13.59,10.84L15.07,7.42C15.27,6.97 15.07,6.44 14.63,6.24C14.43,6 14.21,5.88 14,5.89Z",Qn=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function ps(c,v){const e=Bs[c]??Un;return`<svg viewBox="0 0 24 24" width="${v}" height="${v}" aria-hidden="true" focusable="false"><path d="${e}" fill="currentColor"/></svg>`}function us(c){return`<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="${c}" fill="currentColor"/></svg>`}const to=`
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
  `;class eo extends x{constructor(){super(...arguments);s(this,J);s(this,vr);s(this,fr);s(this,mr);s(this,es);s(this,Di,null);s(this,Re,null);s(this,Pi,null);s(this,Ii,null);s(this,zi,null);s(this,Bi,null);s(this,rt,null);s(this,Ht,null);s(this,ot,null);s(this,Ri,null);s(this,ji,null);s(this,je,null);s(this,Oe,null)}render(){this.root.innerHTML=`
        <style>${to}${at}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${u(this.def.friendly_name)}</span>
          </div>
          <div part="card-body">
            <div class="hrv-weather-main">
              <span class="hrv-weather-icon">${ps("cloudy",44)}</span>
              <span class="hrv-weather-temp">--<span class="hrv-weather-unit"></span></span>
            </div>
            <span class="hrv-weather-cond" aria-live="polite">--</span>
            <div class="hrv-weather-stats">
              <span class="hrv-weather-stat" data-stat="humidity">
                ${us(Xn)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="wind">
                ${us(Kn)}
                <span data-value>--</span>
              </span>
              <span class="hrv-weather-stat" data-stat="pressure">
                ${us(Jn)}
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
      `,n(this,Di,this.root.querySelector(".hrv-weather-icon")),n(this,Re,this.root.querySelector(".hrv-weather-temp")),n(this,Pi,this.root.querySelector(".hrv-weather-cond")),n(this,Ii,this.root.querySelector("[data-stat=humidity] [data-value]")),n(this,zi,this.root.querySelector("[data-stat=wind] [data-value]")),n(this,Bi,this.root.querySelector("[data-stat=pressure] [data-value]")),n(this,rt,this.root.querySelector(".hrv-forecast-strip")),n(this,Ht,this.root.querySelector(".hrv-forecast-toggle")),n(this,ot,this.root.querySelector(".hrv-forecast-scroll-track")),n(this,Ri,this.root.querySelector(".hrv-forecast-scroll-thumb")),t(this,rt)&&(t(this,rt).addEventListener("scroll",()=>h(this,mr,qs).call(this),{passive:!0}),n(this,ji,fn(t(this,rt)))),t(this,ot)&&t(this,ot).addEventListener("pointerdown",e=>h(this,es,vn).call(this,e)),this.renderCompanions(),st(this.root),this._attachGestureHandlers(this.root.querySelector("[part=card]"))}destroy(){var e;(e=t(this,ji))==null||e.call(this),n(this,ji,null)}applyState(e,i){const r=e||"cloudy";t(this,Di)&&(t(this,Di).innerHTML=ps(r,44));const o=this.i18n.t(`weather.${r}`)!==`weather.${r}`?this.i18n.t(`weather.${r}`):r.replace(/-/g," ");t(this,Pi)&&(t(this,Pi).textContent=o);const a=i.temperature??i.native_temperature;let l=String(i.temperature_unit||i.native_temperature_unit||this.def.unit_of_measurement||"°C").trim();if(l&&!/^°/.test(l)&&l.length<=2&&(l=`°${l}`),t(this,Re)){const p=t(this,Re).querySelector(".hrv-weather-unit");t(this,Re).firstChild.textContent=a!=null?Math.round(Number(a)):"--",p&&(p.textContent=l)}if(t(this,Ii)){const p=i.humidity;t(this,Ii).textContent=p!=null?`${p}%`:"--"}if(t(this,zi)){const p=i.wind_speed,f=i.wind_speed_unit??"";t(this,zi).textContent=p!=null?`${p} ${f}`.trim():"--"}if(t(this,Bi)){const p=i.pressure,f=i.pressure_unit??"";t(this,Bi).textContent=p!=null?`${p} ${f}`.trim():"--"}const d=(this.config.displayHints??this.def.display_hints??{}).show_forecast===!0;n(this,je,d?i.forecast_daily??i.forecast??null:null),n(this,Oe,d?i.forecast_hourly??null:null),h(this,vr,Hs).call(this),h(this,fr,Ts).call(this),this.announceState(`${this.def.friendly_name}, ${o}, ${a??"--"} ${l}`)}}Di=new WeakMap,Re=new WeakMap,Pi=new WeakMap,Ii=new WeakMap,zi=new WeakMap,Bi=new WeakMap,rt=new WeakMap,Ht=new WeakMap,ot=new WeakMap,Ri=new WeakMap,ji=new WeakMap,J=new WeakSet,de=function(){return this.config._forecastMode??"daily"},ls=function(e){this.config._forecastMode=e},je=new WeakMap,Oe=new WeakMap,vr=new WeakSet,Hs=function(){if(!t(this,Ht))return;const e=Array.isArray(t(this,je))&&t(this,je).length>0,i=Array.isArray(t(this,Oe))&&t(this,Oe).length>0;if(!e&&!i){t(this,Ht).textContent="";return}e&&!i&&n(this,J,"daily",ls),!e&&i&&n(this,J,"hourly",ls),e&&i?(t(this,Ht).textContent=t(this,J,de)==="daily"?"Hourly":"5-Day",t(this,Ht).onclick=()=>{n(this,J,t(this,J,de)==="daily"?"hourly":"daily",ls),h(this,vr,Hs).call(this),h(this,fr,Ts).call(this)}):(t(this,Ht).textContent="",t(this,Ht).onclick=null)},fr=new WeakSet,Ts=function(){if(!t(this,rt))return;const e=t(this,J,de)==="hourly"?t(this,Oe):t(this,je);if(t(this,rt).setAttribute("data-mode",t(this,J,de)),!Array.isArray(e)||e.length===0){t(this,rt).innerHTML="",t(this,ot)&&(t(this,ot).hidden=!0);return}const i=t(this,J,de)==="daily"?e.slice(0,5):e;t(this,rt).innerHTML=i.map(r=>{const o=new Date(r.datetime);let a;t(this,J,de)==="hourly"?a=o.toLocaleTimeString([],{hour:"numeric"}):a=Qn[o.getDay()]??"";const l=(r.temperature??r.native_temperature)!=null?Math.round(r.temperature??r.native_temperature):"--",d=(r.templow??r.native_templow)!=null?Math.round(r.templow??r.native_templow):null;return`
          <div class="hrv-forecast-day" role="listitem">
            <span class="hrv-forecast-day-name">${u(String(a))}</span>
            ${ps(r.condition||"cloudy",18)}
            <span class="hrv-forecast-temps">
              ${u(String(l))}${d!=null?`/<span class="hrv-forecast-lo">${u(String(d))}</span>`:""}
            </span>
          </div>`}).join(""),t(this,J,de)==="hourly"?requestAnimationFrame(()=>h(this,mr,qs).call(this)):t(this,ot)&&(t(this,ot).hidden=!0)},mr=new WeakSet,qs=function(){const e=t(this,rt),i=t(this,ot),r=t(this,Ri);if(!e||!i||!r)return;const o=e.scrollWidth>e.clientWidth?e.clientWidth/e.scrollWidth:1;if(o>=1){i.hidden=!0;return}i.hidden=!1;const a=i.clientWidth,l=Math.max(20,o*a),d=a-l,p=e.scrollLeft/(e.scrollWidth-e.clientWidth);r.style.width=`${l}px`,r.style.left=`${p*d}px`},es=new WeakSet,vn=function(e){const i=t(this,rt),r=t(this,ot),o=t(this,Ri);if(!i||!r||!o)return;e.preventDefault();const a=r.getBoundingClientRect(),l=parseFloat(o.style.width)||20,d=m=>{const b=m-a.left-l/2,L=a.width-l,w=Math.max(0,Math.min(1,b/L));i.scrollLeft=w*(i.scrollWidth-i.clientWidth)};d(e.clientX);const p=m=>d(m.clientX),f=()=>{window.removeEventListener("pointermove",p),window.removeEventListener("pointerup",f)};window.addEventListener("pointermove",p),window.addEventListener("pointerup",f)},C._renderers=C._renderers||{};const io=window.__HARVEST_RENDERER_ID__||document.currentScript&&document.currentScript.dataset.rendererId||"minimus";C._renderers[io]={light:_n,fan:Ln,climate:kn,binary_sensor:En,cover:Pn,input_boolean:Is,input_number:zn,input_select:Ps,select:Ps,media_player:jn,remote:Vn,sensor:_r,"sensor.temperature":_r,"sensor.humidity":_r,"sensor.battery":_r,switch:Is,timer:Zn,weather:eo,generic:Gn,_capabilities:{fan:{display_modes:["on-off","continuous","stepped","cycle"]},input_number:{display_modes:["slider","buttons"]},input_select:{display_modes:["pills","dropdown"]},select:{display_modes:["pills","dropdown"]},light:{features:["brightness","color_temp","rgb"]},climate:{features:["hvac_modes","presets","fan_mode","swing_mode"]},cover:{features:["position","tilt"]},media_player:{features:["transport","volume","source"]}}}})();})();
