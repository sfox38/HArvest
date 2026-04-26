(()=>{var kr=(g,m,h)=>{if(!m.has(g))throw TypeError("Cannot "+h)};var t=(g,m,h)=>(kr(g,m,"read from private field"),h?h.call(g):m.get(g)),r=(g,m,h)=>{if(m.has(g))throw TypeError("Cannot add the same private member more than once");m instanceof WeakSet?m.add(g):m.set(g,h)},s=(g,m,h,Pt)=>(kr(g,m,"write to private field"),Pt?Pt.call(g,h):m.set(g,h),h);var o=(g,m,h)=>(kr(g,m,"access private method"),h);(function(){"use strict";var Ht,$,ui,P,rt,X,Y,_e,Se,st,xt,wt,nt,Ut,V,J,at,Xt,vi,$e,$r,Js,k,ji,Fr,Oi,Nr,Fi,Yr,Ni,Vr,ke,vr,Ce,fr,Yi,Wr,Gt,Hi,Vi,Zr,Wi,Ur,fi,Cr,mi,Lr,Zi,Xr,_t,R,Ui,H,Le,Kt,ot,dt,ht,D,x,Dt,St,z,C,Jt,W,gi,Ee,mr,Qt,Di,bi,Er,Ae,gr,yi,Ar,xi,Mr,zt,li,Xi,Gr,Gi,Kr,wi,Tr,_i,qr,Ki,Jr,Si,Ir,Ji,Qr,Me,$t,lt,Z,Bt,Te,qe,Ie,j,O,Pe,He,De,ze,kt,Be,te,F,ct,Re,je,Oe,pt,Rt,ee,Fe,Ne,Ye,Ve,We,$i,Ze,ki,Pr,Qi,ts,tr,es,Ue,br,Ci,Hr,Xe,yr,er,is,ir,rs,Li,Dr,Ei,zr,rr,ss,sr,ns,L,ie,re,ut,_,se,ne,ae,Ct,vt,Ai,Mi,Ti,Ge,xr,nr,as,oe,Lt,E,M,Ke,jt,Ot,Et,A,U,Q,At,Ft,ar,os,or,ds,Nt,ci,Je,wr,dr,hs,Yt,pi,Qe,ft,qi,Mt,de,hr,ls,Ii,Br,Tt,ti,ei,he,le,mt,S,ce,pe,ue,gt,qt,Pi,ii,_r,lr,cs,N,ri,si,bt,ni,ve,G,It,Vt,Wt,fe,ai,oi,tt,di,cr,ps,pr,us,ur,vs,me,zi,hi,yt,ge,be;const g=window.HArvest;if(!g||!g.renderers||!g.renderers.BaseCard){console.warn("[HArvest Examples] HArvest not found - pack not loaded.");return}const m=g.renderers.BaseCard;function h(c){return String(c??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Pt(c,p){let e=null;return function(...i){e&&clearTimeout(e),e=setTimeout(()=>{e=null,c.apply(this,i)},p)}}function ye(c){return c?c.charAt(0).toUpperCase()+c.slice(1).replace(/_/g," "):""}const fs=60,ms=60,Zt=48,B=225,b=270,it=2*Math.PI*Zt*(b/360);function gs(c){return c*Math.PI/180}function K(c){const p=gs(c);return{x:fs+Zt*Math.cos(p),y:ms-Zt*Math.sin(p)}}function bs(){const c=K(B),p=K(B-b);return`M ${c.x} ${c.y} A ${Zt} ${Zt} 0 1 1 ${p.x} ${p.y}`}const xe=bs(),we=["brightness","temp","color"],Bi=120;function Rr(c){const p=b/Bi;let e="";for(let i=0;i<Bi;i++){const n=B-i*p,a=B-(i+1)*p,d=K(n),l=K(a),u=`M ${d.x} ${d.y} A ${Zt} ${Zt} 0 0 1 ${l.x} ${l.y}`,v=i===0||i===Bi-1?"round":"butt";e+=`<path d="${u}" stroke="${c(i/Bi)}" fill="none" stroke-width="8" stroke-linecap="${v}" />`}return e}const ys=Rr(c=>`hsl(${Math.round(c*360)},100%,50%)`),xs=Rr(c=>{const e=Math.round(143+112*c),i=Math.round(255*c);return`rgb(255,${e},${i})`}),Sr=`
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
      flex: 1;
      touch-action: auto;
      cursor: default;
    }
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
      width: 28px;
      height: 84px;
      background: var(--hrv-color-surface-alt, #e0e0e0);
      border-radius: 14px;
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
      left: 2px;
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
      left: 11px;
      opacity: 0.4;
    }

    .hrv-mode-dot:nth-child(2) { top: 11px; }
    .hrv-mode-dot:nth-child(3) { top: 39px; }
    .hrv-mode-dot:nth-child(4) { top: 67px; }

    .hrv-mode-switch[data-pos="0"] .hrv-mode-dot:nth-child(2),
    .hrv-mode-switch[data-pos="1"] .hrv-mode-dot:nth-child(3),
    .hrv-mode-switch[data-pos="2"] .hrv-mode-dot:nth-child(4) { opacity: 0; }

    [part=toggle-button] {
      width: 32px;
      height: 32px;
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
  `;class ws extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,$r);r(this,ji);r(this,Oi);r(this,Fi);r(this,Ni);r(this,ke);r(this,Ce);r(this,Yi);r(this,Gt);r(this,Vi);r(this,Wi);r(this,fi);r(this,mi);r(this,Zi);r(this,Ht,null);r(this,$,null);r(this,ui,null);r(this,P,null);r(this,rt,null);r(this,X,null);r(this,Y,null);r(this,_e,null);r(this,Se,null);r(this,st,0);r(this,xt,4e3);r(this,wt,0);r(this,nt,!1);r(this,Ut,!1);r(this,V,null);r(this,J,0);r(this,at,2e3);r(this,Xt,6500);r(this,vi,void 0);r(this,$e,new Map);r(this,k,[]);s(this,vi,Pt(o(this,Zi,Xr).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],n=i.includes("brightness"),a=i.includes("color_temp"),d=i.includes("rgb_color"),l=e&&(n||a||d),u=[n,a,d].filter(Boolean).length,v=e&&u>1;s(this,at,this.def.feature_config?.min_color_temp_kelvin??2e3),s(this,Xt,this.def.feature_config?.max_color_temp_kelvin??6500);const w=K(B);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Sr}</style>
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
                    <g class="hrv-dial-segs hrv-dial-segs-color">${ys}</g>
                    <g class="hrv-dial-segs hrv-dial-segs-temp">${xs}</g>
                    <path class="hrv-dial-track" d="${xe}" />
                    <path class="hrv-dial-fill" d="${xe}"
                      stroke-dasharray="${it}"
                      stroke-dashoffset="${it}" />
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
                  role="img" aria-label="${h(this.def.friendly_name)}"
                  title="Read-only">
                  <span part="ro-state-icon" aria-hidden="true"></span>
                </div>
                <div class="hrv-light-ro-dots">
                  ${n?'<span class="hrv-light-ro-dot" data-attr="brightness" title="Brightness">-</span>':""}
                  ${a?'<span class="hrv-light-ro-dot" data-attr="temp" title="Color temperature">-</span>':""}
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
                  title="Turn ${h(this.def.friendly_name)} on / off"></button>
              </div>
            `:""}
          </div>
        </div>
      `,s(this,Ht,this.root.querySelector("[part=toggle-button]")),s(this,$,this.root.querySelector(".hrv-dial-fill")),s(this,ui,this.root.querySelector(".hrv-dial-track")),s(this,P,this.root.querySelector(".hrv-dial-thumb")),s(this,rt,this.root.querySelector(".hrv-dial-pct")),s(this,X,this.root.querySelector(".hrv-dial-wrap")),s(this,V,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,_e,this.root.querySelector(".hrv-dial-segs-color")),s(this,Se,this.root.querySelector(".hrv-dial-segs-temp")),s(this,Y,this.root.querySelector(".hrv-mode-switch")),t(this,Ht)&&t(this,Ht).addEventListener("click",()=>{this.config.card?.sendCommand("toggle",{})}),t(this,V)&&(t(this,V).addEventListener("pointerdown",o(this,Vi,Zr).bind(this)),t(this,V).addEventListener("pointermove",o(this,Wi,Ur).bind(this)),t(this,V).addEventListener("pointerup",o(this,fi,Cr).bind(this)),t(this,V).addEventListener("pointercancel",o(this,fi,Cr).bind(this))),t(this,Y)&&(t(this,Y).addEventListener("click",o(this,Oi,Nr).bind(this)),t(this,Y).addEventListener("keydown",o(this,Ni,Vr).bind(this)),t(this,Y).addEventListener("mousemove",o(this,Fi,Yr).bind(this)),o(this,ji,Fr).call(this)),o(this,Ce,fr).call(this),this.root.querySelector("[part=ro-state-icon]")&&this.renderIcon(this.resolveIcon(this.def.icon,"mdi:lightbulb"),"ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(T=>{T.title=T.getAttribute("aria-label")??"Companion";const q=T.getAttribute("data-entity");if(q&&t(this,$e).has(q)){const I=t(this,$e).get(q);T.setAttribute("data-on",String(I==="on"))}})}applyState(e,i){if(s(this,nt,e==="on"),s(this,st,i?.brightness??0),i?.color_temp_kelvin!==void 0?s(this,xt,i.color_temp_kelvin):i?.color_temp!==void 0&&i.color_temp>0&&s(this,xt,Math.round(1e6/i.color_temp)),i?.hs_color)s(this,wt,Math.round(i.hs_color[0]));else if(i?.rgb_color){const[a,d,l]=i.rgb_color;s(this,wt,$s(a,d,l))}t(this,Ht)&&t(this,Ht).setAttribute("aria-pressed",String(t(this,nt)));const n=this.root.querySelector(".hrv-light-ro-circle");if(n){n.setAttribute("data-on",String(t(this,nt)));const a=t(this,nt)?"mdi:lightbulb":"mdi:lightbulb-outline",d=this.def.icon_state_map?.[e]??this.def.icon_state_map?.["*"]??this.def.icon??a;this.renderIcon(this.resolveIcon(d,a),"ro-state-icon");const l=i?.color_mode,u=l==="color_temp",v=l&&l!=="color_temp",w=this.root.querySelector('[data-attr="brightness"]');w&&(w.textContent=t(this,nt)?`${Math.round(t(this,st)/255*100)}%`:"-");const T=this.root.querySelector('[data-attr="temp"]');T&&(T.textContent=`${t(this,xt)}K`,T.style.display=v?"none":"");const q=this.root.querySelector('[data-attr="color"]');if(q)if(q.style.display=u?"none":"",i?.rgb_color){const[I,f,y]=i.rgb_color;q.style.background=`rgb(${I},${f},${y})`}else q.style.background=`hsl(${t(this,wt)}, 100%, 50%)`}o(this,ke,vr).call(this)}predictState(e,i){return e==="toggle"?{state:t(this,nt)?"off":"on",attributes:{brightness:t(this,st)}}:e==="turn_on"&&i.brightness!==void 0?{state:"on",attributes:{brightness:i.brightness}}:null}updateCompanionState(e,i,n){t(this,$e).set(e,i),super.updateCompanionState(e,i,n)}}Ht=new WeakMap,$=new WeakMap,ui=new WeakMap,P=new WeakMap,rt=new WeakMap,X=new WeakMap,Y=new WeakMap,_e=new WeakMap,Se=new WeakMap,st=new WeakMap,xt=new WeakMap,wt=new WeakMap,nt=new WeakMap,Ut=new WeakMap,V=new WeakMap,J=new WeakMap,at=new WeakMap,Xt=new WeakMap,vi=new WeakMap,$e=new WeakMap,$r=new WeakSet,Js=function(){const e=this.def.supported_features??[],i=[];return e.includes("brightness")&&i.push("brightness"),e.includes("color_temp")&&i.push("temp"),e.includes("rgb_color")&&i.push("color"),i.length>0?i:["brightness"]},k=new WeakMap,ji=new WeakSet,Fr=function(){const e=this.def.supported_features??[],i=[e.includes("brightness"),e.includes("color_temp"),e.includes("rgb_color")];s(this,k,[]),i[0]&&t(this,k).push(0),i[1]&&t(this,k).push(1),i[2]&&t(this,k).push(2),t(this,k).length===0&&t(this,k).push(0)},Oi=new WeakSet,Nr=function(e){const i=t(this,Y).getBoundingClientRect(),n=e.clientY-i.top,a=i.height/3;let d;n<a?d=0:n<a*2?d=1:d=2,d=Math.min(d,t(this,k).length-1),s(this,J,t(this,k)[d]),t(this,Y).setAttribute("data-pos",String(d)),o(this,Ce,fr).call(this),o(this,ke,vr).call(this)},Fi=new WeakSet,Yr=function(e){const i={brightness:"Brightness",temp:"Color Temperature",color:"Color"},n=t(this,Y).getBoundingClientRect(),a=Math.min(Math.floor((e.clientY-n.top)/(n.height/t(this,k).length)),t(this,k).length-1),d=we[t(this,k)[Math.max(0,a)]];t(this,Y).title=`Dial mode: ${i[d]??d}`},Ni=new WeakSet,Vr=function(e){const i=t(this,k).indexOf(t(this,J));let n=i;if(e.key==="ArrowUp"||e.key==="ArrowLeft")n=Math.max(0,i-1);else if(e.key==="ArrowDown"||e.key==="ArrowRight")n=Math.min(t(this,k).length-1,i+1);else return;e.preventDefault(),s(this,J,t(this,k)[n]),t(this,Y).setAttribute("data-pos",String(n)),o(this,Ce,fr).call(this),o(this,ke,vr).call(this)},ke=new WeakSet,vr=function(){t(this,P)&&(t(this,P).style.transition="none"),t(this,$)&&(t(this,$).style.transition="none"),o(this,Yi,Wr).call(this),t(this,P)?.getBoundingClientRect(),t(this,$)?.getBoundingClientRect(),t(this,P)&&(t(this,P).style.transition=""),t(this,$)&&(t(this,$).style.transition="")},Ce=new WeakSet,fr=function(){if(!t(this,$))return;const e=we[t(this,J)],i=e==="color"||e==="temp";t(this,ui).style.display=i?"none":"",t(this,$).style.display=i?"none":"",t(this,_e)&&t(this,_e).classList.toggle("hrv-dial-segs-visible",e==="color"),t(this,Se)&&t(this,Se).classList.toggle("hrv-dial-segs-visible",e==="temp"),e==="brightness"&&t(this,$).setAttribute("stroke-dasharray",String(it));const n={brightness:"brightness",temp:"color temperature",color:"color"},a={brightness:"Drag to adjust brightness",temp:"Drag to adjust color temperature",color:"Drag to adjust color"};t(this,X)?.setAttribute("aria-label",`${h(this.def.friendly_name)} ${n[e]}`),t(this,X)&&(t(this,X).title=a[e])},Yi=new WeakSet,Wr=function(){const e=we[t(this,J)];if(e==="brightness"){const i=t(this,nt)?t(this,st):0;o(this,Gt,Hi).call(this,Math.round(i/255*100))}else if(e==="temp"){const i=Math.round((t(this,xt)-t(this,at))/(t(this,Xt)-t(this,at))*100);o(this,Gt,Hi).call(this,Math.max(0,Math.min(100,i)))}else{const i=Math.round(t(this,wt)/360*100);o(this,Gt,Hi).call(this,i)}},Gt=new WeakSet,Hi=function(e){const i=we[t(this,J)],n=e/100*b,a=K(B-n);if(t(this,P)?.setAttribute("cx",String(a.x)),t(this,P)?.setAttribute("cy",String(a.y)),t(this,V)?.setAttribute("cx",String(a.x)),t(this,V)?.setAttribute("cy",String(a.y)),i==="brightness"){const d=it*(1-e/100);t(this,$)?.setAttribute("stroke-dashoffset",String(d)),t(this,rt)&&(t(this,rt).textContent=e+"%"),t(this,X)?.setAttribute("aria-valuenow",String(e))}else if(i==="temp"){const d=Math.round(t(this,at)+e/100*(t(this,Xt)-t(this,at)));t(this,rt)&&(t(this,rt).textContent=d+"K"),t(this,X)?.setAttribute("aria-valuenow",String(d))}else t(this,rt)&&(t(this,rt).textContent=Math.round(e/100*360)+"°"),t(this,X)?.setAttribute("aria-valuenow",String(Math.round(e/100*360)))},Vi=new WeakSet,Zr=function(e){s(this,Ut,!0),t(this,V)?.setPointerCapture(e.pointerId),o(this,mi,Lr).call(this,e)},Wi=new WeakSet,Ur=function(e){t(this,Ut)&&o(this,mi,Lr).call(this,e)},fi=new WeakSet,Cr=function(e){if(t(this,Ut)){s(this,Ut,!1);try{t(this,V)?.releasePointerCapture(e.pointerId)}catch{}t(this,vi).call(this)}},mi=new WeakSet,Lr=function(e){if(!t(this,X))return;const i=t(this,X).getBoundingClientRect(),n=i.left+i.width/2,a=i.top+i.height/2,d=e.clientX-n,l=-(e.clientY-a);let u=Math.atan2(l,d)*180/Math.PI;u<0&&(u+=360);let v=B-u;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b);const w=Math.round(v/b*100),T=we[t(this,J)];T==="brightness"?s(this,st,Math.round(w/100*255)):T==="temp"?s(this,xt,Math.round(t(this,at)+w/100*(t(this,Xt)-t(this,at)))):s(this,wt,Math.round(w/100*360)),t(this,$)&&(t(this,$).style.transition="none"),t(this,P)&&(t(this,P).style.transition="none"),o(this,Gt,Hi).call(this,w)},Zi=new WeakSet,Xr=function(){t(this,$)&&(t(this,$).style.transition=""),t(this,P)&&(t(this,P).style.transition="");const e=we[t(this,J)];e==="brightness"?t(this,st)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("turn_on",{brightness:t(this,st)}):e==="temp"?this.config.card?.sendCommand("turn_on",{color_temp_kelvin:t(this,xt)}):this.config.card?.sendCommand("turn_on",{hs_color:[t(this,wt),100]})};const _s=Sr+`
    .hrv-fan-feat-btn {
      width: 24px;
      height: 24px;
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
    .hrv-dial-controls { padding-bottom: var(--hrv-card-padding, 16px); }
    .hrv-fan-stepped-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hrv-fan-speed-circle {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: 4px solid var(--hrv-ex-ring, #fff);
      background: transparent;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--hrv-ex-ring, #fff);
      font-size: 2.2rem;
      font-weight: 300;
      line-height: 1;
      user-select: none;
      transition: border-color var(--hrv-transition-speed, 0.2s), opacity var(--hrv-transition-speed, 0.2s), color var(--hrv-transition-speed, 0.2s);
    }
    .hrv-fan-speed-circle[aria-pressed=false] {
      opacity: 0.35;
    }
    .hrv-fan-speed-circle:active {
      transition: none;
      border-color: var(--hrv-color-primary, #1976d2);
      color: var(--hrv-color-primary, #1976d2);
    }
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

    @media (prefers-reduced-motion: reduce) {
      .hrv-fan-hspeed-thumb { transition: none; }
      .hrv-fan-ro-circle[data-on=true] [part=ro-state-icon] svg { animation: none; }
    }
  `;class Ss extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,Ee);r(this,Qt);r(this,bi);r(this,Ae);r(this,yi);r(this,xi);r(this,zt);r(this,Xi);r(this,Gi);r(this,wi);r(this,_i);r(this,Ki);r(this,Si);r(this,Ji);r(this,_t,null);r(this,R,null);r(this,Ui,null);r(this,H,null);r(this,Le,null);r(this,Kt,null);r(this,ot,null);r(this,dt,null);r(this,ht,null);r(this,D,!1);r(this,x,0);r(this,Dt,!1);r(this,St,"forward");r(this,z,null);r(this,C,[]);r(this,Jt,!1);r(this,W,null);r(this,gi,void 0);s(this,gi,Pt(o(this,Ki,Jr).bind(this),300)),s(this,C,e.feature_config?.preset_modes??[])}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],n=i.includes("set_speed"),a=i.includes("oscillate"),d=i.includes("direction"),l=i.includes("preset_mode"),u=e&&n,v=u&&t(this,Qt,Di),w=v&&!t(this,C).length,T=v&&!!t(this,C).length,q=K(B);this.root.innerHTML=`
        <style>${this.getSharedStyles()}${_s}</style>
        <div part="card">
          <div part="card-header">
            <span part="card-name">${h(this.def.friendly_name)}</span>
          </div>
          <div part="card-body" class="${u?"":"hrv-no-dial"}">
            ${u?`
              <div class="hrv-dial-column">
                ${w?`
                  <div class="hrv-fan-hspeed-wrap">
                    <div class="hrv-fan-hspeed-switch" role="group"
                      aria-label="${h(this.def.friendly_name)} speed"
                      data-on="false">
                      <div class="hrv-fan-hspeed-thumb"></div>
                      ${t(this,Ae,gr).map((f,y)=>`
                        <div class="hrv-fan-hspeed-dot" data-pct="${f}" data-idx="${y}"
                          data-active="false"
                          role="button" tabindex="0"
                          aria-label="Speed ${y+1} (${f}%)"
                          title="Speed ${y+1} (${f}%)"></div>
                      `).join("")}
                    </div>
                  </div>
                `:T?`
                  <div class="hrv-fan-stepped-wrap">
                    <button class="hrv-fan-speed-circle" part="speed-circle" type="button"
                      aria-pressed="false"
                      title="Click to increase fan speed"
                      aria-label="Click to increase fan speed">+</button>
                  </div>
                `:`
                  <div class="hrv-dial-wrap" role="slider"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                    aria-label="${h(this.def.friendly_name)} speed"
                    title="Drag to adjust fan speed">
                    <svg viewBox="0 0 120 120">
                      <path class="hrv-dial-track" d="${xe}" />
                      <path class="hrv-dial-fill" d="${xe}"
                        stroke-dasharray="${it}"
                        stroke-dashoffset="${it}" />
                      <circle class="hrv-dial-thumb" r="7"
                        cx="${q.x}" cy="${q.y}" />
                      <circle class="hrv-dial-thumb-hit" r="16"
                        cx="${q.x}" cy="${q.y}" />
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
                  title="Turn ${h(this.def.friendly_name)} on / off"></button>
              </div>
            `:""}
          </div>
        </div>
      `,s(this,_t,this.root.querySelector("[part=toggle-button]")),s(this,R,this.root.querySelector(".hrv-dial-fill")),s(this,Ui,this.root.querySelector(".hrv-dial-track")),s(this,H,this.root.querySelector(".hrv-dial-thumb")),s(this,Le,this.root.querySelector(".hrv-dial-pct")),s(this,Kt,this.root.querySelector(".hrv-dial-wrap")),s(this,W,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,ot,this.root.querySelector('[data-feat="oscillate"]')),s(this,dt,this.root.querySelector('[data-feat="direction"]')),s(this,ht,this.root.querySelector('[data-feat="preset"]')),t(this,_t)?.addEventListener("click",()=>{this.config.card?.sendCommand("toggle",{})}),t(this,W)&&(t(this,W).addEventListener("pointerdown",o(this,Xi,Gr).bind(this)),t(this,W).addEventListener("pointermove",o(this,Gi,Kr).bind(this)),t(this,W).addEventListener("pointerup",o(this,wi,Tr).bind(this)),t(this,W).addEventListener("pointercancel",o(this,wi,Tr).bind(this))),this.root.querySelector(".hrv-fan-speed-circle")?.addEventListener("click",()=>{const f=t(this,Ae,gr);if(!f.length)return;let y;if(!t(this,D)||t(this,x)===0)y=f[0],s(this,D,!0),t(this,_t)?.setAttribute("aria-pressed","true");else{const et=f.findIndex(Ks=>Ks>t(this,x));y=et===-1?f[0]:f[et]}s(this,x,y),o(this,yi,Ar).call(this),this.config.card?.sendCommand("set_percentage",{percentage:y})}),this.root.querySelectorAll(".hrv-fan-hspeed-dot").forEach(f=>{const y=()=>{const et=Number(f.getAttribute("data-pct"));t(this,D)||(s(this,D,!0),t(this,_t)?.setAttribute("aria-pressed","true")),s(this,x,et),o(this,xi,Mr).call(this),this.config.card?.sendCommand("set_percentage",{percentage:et})};f.addEventListener("click",y),f.addEventListener("keydown",et=>{(et.key==="Enter"||et.key===" ")&&(et.preventDefault(),y())})}),t(this,ot)?.addEventListener("click",()=>{this.config.card?.sendCommand("oscillate",{oscillating:!t(this,Dt)})}),t(this,dt)?.addEventListener("click",()=>{const f=t(this,St)==="forward"?"reverse":"forward";s(this,St,f),o(this,zt,li).call(this),this.config.card?.sendCommand("set_direction",{direction:f})}),t(this,ht)?.addEventListener("click",()=>{if(t(this,C).length){if(t(this,bi,Er)){const f=t(this,z)??t(this,C)[0];this.config.card?.sendCommand("set_preset_mode",{preset_mode:f});return}if(t(this,z)){const f=t(this,C).indexOf(t(this,z));if(f===-1||f===t(this,C).length-1){s(this,z,null),o(this,zt,li).call(this);const y=t(this,Ee,mr),et=Math.floor(t(this,x)/y)*y||y;this.config.card?.sendCommand("set_percentage",{percentage:et})}else{const y=t(this,C)[f+1];s(this,z,y),o(this,zt,li).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:y})}}else{const f=t(this,C)[0];s(this,z,f),o(this,zt,li).call(this),this.config.card?.sendCommand("set_preset_mode",{preset_mode:f})}}}),this.root.querySelector(".hrv-fan-ro-circle")&&this.renderIcon(this.def.icon??"mdi:fan","ro-state-icon"),this.renderCompanions(),this.root.querySelectorAll("[part=companion]").forEach(f=>{f.title=f.getAttribute("aria-label")??"Companion"})}applyState(e,i){s(this,D,e==="on"),s(this,x,i?.percentage??0),s(this,Dt,i?.oscillating??!1),s(this,St,i?.direction??"forward"),s(this,z,i?.preset_mode??null),i?.preset_modes?.length&&s(this,C,i.preset_modes),t(this,_t)&&t(this,_t).setAttribute("aria-pressed",String(t(this,D)));const n=this.root.querySelector(".hrv-fan-ro-circle");n&&n.setAttribute("data-on",String(t(this,D))),t(this,Qt,Di)&&!t(this,C).length?o(this,xi,Mr).call(this):t(this,Qt,Di)?o(this,yi,Ar).call(this):o(this,Ji,Qr).call(this),o(this,zt,li).call(this),this.announceState(`${this.def.friendly_name}, ${e}`+(t(this,x)>0?`, ${t(this,x)}%`:""))}predictState(e,i){return e==="toggle"?{state:t(this,D)?"off":"on",attributes:{percentage:t(this,x)}}:e==="set_percentage"?{state:"on",attributes:{percentage:i.percentage,oscillating:t(this,Dt),direction:t(this,St),preset_mode:t(this,z),preset_modes:t(this,C)}}:null}}_t=new WeakMap,R=new WeakMap,Ui=new WeakMap,H=new WeakMap,Le=new WeakMap,Kt=new WeakMap,ot=new WeakMap,dt=new WeakMap,ht=new WeakMap,D=new WeakMap,x=new WeakMap,Dt=new WeakMap,St=new WeakMap,z=new WeakMap,C=new WeakMap,Jt=new WeakMap,W=new WeakMap,gi=new WeakMap,Ee=new WeakSet,mr=function(){const e=this.def?.feature_config;return e?.percentage_step>1?e.percentage_step:e?.speed_count>1?100/e.speed_count:1},Qt=new WeakSet,Di=function(){return t(this,Ee,mr)>1},bi=new WeakSet,Er=function(){return t(this,Qt,Di)&&t(this,C).length>0},Ae=new WeakSet,gr=function(){const e=t(this,Ee,mr),i=[];for(let n=1;n*e<=100.001;n++)i.push(Math.floor(n*e*10)/10);return i},yi=new WeakSet,Ar=function(){const e=this.root.querySelector(".hrv-fan-speed-circle");if(!e)return;e.setAttribute("aria-pressed",String(t(this,D)));const i=t(this,D)?"Click to increase fan speed":"Fan off - click to turn on";e.setAttribute("aria-label",i),e.title=i},xi=new WeakSet,Mr=function(){const e=this.root.querySelector(".hrv-fan-hspeed-switch");if(!e)return;const i=e.querySelector(".hrv-fan-hspeed-thumb"),n=t(this,Ae,gr);let a=-1;if(t(this,D)&&t(this,x)>0){let d=1/0;n.forEach((l,u)=>{const v=Math.abs(l-t(this,x));v<d&&(d=v,a=u)})}e.setAttribute("data-on",String(a>=0)),i&&a>=0&&(i.style.left=`${2+a*32}px`),e.querySelectorAll(".hrv-fan-hspeed-dot").forEach((d,l)=>{d.setAttribute("data-active",String(l===a))})},zt=new WeakSet,li=function(){const e=t(this,bi,Er);if(t(this,ot)){const i=e||t(this,Dt),n=e?"Oscillate":`Oscillate: ${t(this,Dt)?"on":"off"}`;t(this,ot).setAttribute("data-on",String(i)),t(this,ot).setAttribute("aria-pressed",String(i)),t(this,ot).setAttribute("aria-label",n),t(this,ot).title=n}if(t(this,dt)){const i=t(this,St)!=="reverse",n=`Direction: ${t(this,St)}`;t(this,dt).setAttribute("data-on",String(i)),t(this,dt).setAttribute("aria-pressed",String(i)),t(this,dt).setAttribute("aria-label",n),t(this,dt).title=n}if(t(this,ht)){const i=e||!!t(this,z),n=e?t(this,z)??t(this,C)[0]??"Preset":t(this,z)?`Preset: ${t(this,z)}`:"Preset: none";t(this,ht).setAttribute("data-on",String(i)),t(this,ht).setAttribute("aria-pressed",String(i)),t(this,ht).setAttribute("aria-label",n),t(this,ht).title=n}},Xi=new WeakSet,Gr=function(e){s(this,Jt,!0),t(this,W)?.setPointerCapture(e.pointerId),o(this,_i,qr).call(this,e)},Gi=new WeakSet,Kr=function(e){t(this,Jt)&&o(this,_i,qr).call(this,e)},wi=new WeakSet,Tr=function(e){if(t(this,Jt)){s(this,Jt,!1);try{t(this,W)?.releasePointerCapture(e.pointerId)}catch{}t(this,gi).call(this)}},_i=new WeakSet,qr=function(e){if(!t(this,Kt))return;const i=t(this,Kt).getBoundingClientRect(),n=i.left+i.width/2,a=i.top+i.height/2,d=e.clientX-n,l=-(e.clientY-a);let u=Math.atan2(l,d)*180/Math.PI;u<0&&(u+=360);let v=B-u;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b),s(this,x,Math.round(v/b*100)),t(this,R)&&(t(this,R).style.transition="none"),t(this,H)&&(t(this,H).style.transition="none"),o(this,Si,Ir).call(this,t(this,x))},Ki=new WeakSet,Jr=function(){t(this,R)&&(t(this,R).style.transition=""),t(this,H)&&(t(this,H).style.transition=""),t(this,x)===0?this.config.card?.sendCommand("turn_off",{}):this.config.card?.sendCommand("set_percentage",{percentage:t(this,x)})},Si=new WeakSet,Ir=function(e){const i=it*(1-e/100),n=K(B-e/100*b);t(this,R)?.setAttribute("stroke-dashoffset",String(i)),t(this,H)?.setAttribute("cx",String(n.x)),t(this,H)?.setAttribute("cy",String(n.y)),t(this,W)?.setAttribute("cx",String(n.x)),t(this,W)?.setAttribute("cy",String(n.y)),t(this,Le)&&(t(this,Le).textContent=`${e}%`),t(this,Kt)?.setAttribute("aria-valuenow",String(e))},Ji=new WeakSet,Qr=function(){t(this,H)&&(t(this,H).style.transition="none"),t(this,R)&&(t(this,R).style.transition="none"),o(this,Si,Ir).call(this,t(this,D)?t(this,x):0),t(this,H)?.getBoundingClientRect(),t(this,R)?.getBoundingClientRect(),t(this,H)&&(t(this,H).style.transition=""),t(this,R)&&(t(this,R).style.transition="")};function $s(c,p,e){c/=255,p/=255,e/=255;const i=Math.max(c,p,e),n=Math.min(c,p,e),a=i-n;if(a===0)return 0;let d;return i===c?d=(p-e)/a%6:i===p?d=(e-c)/a+2:d=(c-p)/a+4,Math.round((d*60+360)%360)}const ks=Sr+`
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
  `;class Cs extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,ki);r(this,Qi);r(this,tr);r(this,Ue);r(this,Ci);r(this,Xe);r(this,er);r(this,ir);r(this,Li);r(this,Ei);r(this,rr);r(this,sr);r(this,Me,null);r(this,$t,null);r(this,lt,null);r(this,Z,null);r(this,Bt,!1);r(this,Te,null);r(this,qe,null);r(this,Ie,null);r(this,j,null);r(this,O,null);r(this,Pe,null);r(this,He,null);r(this,De,null);r(this,ze,null);r(this,kt,null);r(this,Be,null);r(this,te,null);r(this,F,20);r(this,ct,"off");r(this,Re,null);r(this,je,null);r(this,Oe,null);r(this,pt,16);r(this,Rt,32);r(this,ee,.5);r(this,Fe,"°C");r(this,Ne,[]);r(this,Ye,[]);r(this,Ve,[]);r(this,We,[]);r(this,$i,{});r(this,Ze,void 0);s(this,Ze,Pt(o(this,rr,ss).bind(this),500))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features?.includes("target_temperature"),n=this.def.supported_features?.includes("fan_mode")||this.def.feature_config?.fan_modes?.length>0,a=this.def.supported_features?.includes("preset_mode")||this.def.feature_config?.preset_modes?.length>0,d=this.def.supported_features?.includes("swing_mode")||this.def.feature_config?.swing_modes?.length>0;s(this,pt,this.def.feature_config?.min_temp??16),s(this,Rt,this.def.feature_config?.max_temp??32),s(this,ee,this.def.feature_config?.temp_step??.5),s(this,Fe,this.def.unit_of_measurement??"°C"),s(this,Ne,this.def.feature_config?.hvac_modes??["off","heat","cool","heat_cool","auto","dry","fan_only"]),s(this,Ye,this.def.feature_config?.fan_modes??[]),s(this,Ve,this.def.feature_config?.preset_modes??[]),s(this,We,this.def.feature_config?.swing_modes??[]);const l=o(this,ki,Pr).call(this,t(this,F)),u=K(B),v=K(B-l/100*b),w=it*(1-l/100),[T,q]=t(this,F).toFixed(1).split(".");this.root.innerHTML=`
        <style>${this.getSharedStyles()}${ks}</style>
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
                    stroke-dasharray="${it}" stroke-dashoffset="${w}"/>
                  <circle class="hrv-dial-thumb" r="7" cx="${v.x}" cy="${v.y}"><title>Drag to set temperature</title></circle>
                  <circle class="hrv-dial-thumb-hit" r="16" cx="${v.x}" cy="${v.y}"><title>Drag to set temperature</title></circle>
                </svg>
                <div class="hrv-climate-center">
                  <span class="hrv-climate-state-text"></span>
                  <div class="hrv-climate-temp-row">
                    <span class="hrv-climate-temp-int">${h(T)}</span><span class="hrv-climate-temp-frac">.${h(q)}</span><span class="hrv-climate-temp-unit">${h(t(this,Fe))}</span>
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
                  <span class="hrv-climate-ro-temp-int">${h(T)}</span><span class="hrv-climate-ro-temp-frac">.${h(q)}</span><span class="hrv-climate-ro-temp-unit">${h(t(this,Fe))}</span>
                </div>
              </div>
            `:""}
            <div class="hrv-climate-grid">
              ${t(this,Ne).length?`
                <button class="hrv-cf-btn" data-feat="mode" type="button"
                  ${e?'title="Change HVAC mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${a&&t(this,Ve).length?`
                <button class="hrv-cf-btn" data-feat="preset" type="button"
                  ${e?'title="Change preset mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Preset</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${n&&t(this,Ye).length?`
                <button class="hrv-cf-btn" data-feat="fan" type="button"
                  ${e?'title="Change fan mode"':'data-readonly="true" title="Read-only"'}>
                  <span class="hrv-cf-label">Fan mode</span>
                  <span class="hrv-cf-value">-</span>
                </button>
              `:""}
              ${d&&t(this,We).length?`
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
      `,s(this,Me,this.root.querySelector(".hrv-dial-wrap")),s(this,$t,this.root.querySelector(".hrv-dial-fill")),s(this,lt,this.root.querySelector(".hrv-dial-thumb")),s(this,Z,this.root.querySelector(".hrv-dial-thumb-hit")),s(this,Te,this.root.querySelector(".hrv-climate-state-text")),s(this,qe,this.root.querySelector(".hrv-climate-temp-int")),s(this,Ie,this.root.querySelector(".hrv-climate-temp-frac")),s(this,j,this.root.querySelector("[data-dir='-']")),s(this,O,this.root.querySelector("[data-dir='+']")),s(this,Pe,this.root.querySelector("[data-feat=mode]")),s(this,He,this.root.querySelector("[data-feat=fan]")),s(this,De,this.root.querySelector("[data-feat=preset]")),s(this,ze,this.root.querySelector("[data-feat=swing]")),s(this,kt,this.root.querySelector(".hrv-climate-dropdown")),t(this,Z)&&(t(this,Z).addEventListener("pointerdown",o(this,er,is).bind(this)),t(this,Z).addEventListener("pointermove",o(this,ir,rs).bind(this)),t(this,Z).addEventListener("pointerup",o(this,Li,Dr).bind(this)),t(this,Z).addEventListener("pointercancel",o(this,Li,Dr).bind(this))),t(this,j)&&(t(this,j).addEventListener("click",()=>o(this,Ci,Hr).call(this,-1)),t(this,j).addEventListener("pointerdown",()=>t(this,j).setAttribute("data-pressing","true")),t(this,j).addEventListener("pointerup",()=>t(this,j).removeAttribute("data-pressing")),t(this,j).addEventListener("pointerleave",()=>t(this,j).removeAttribute("data-pressing")),t(this,j).addEventListener("pointercancel",()=>t(this,j).removeAttribute("data-pressing"))),t(this,O)&&(t(this,O).addEventListener("click",()=>o(this,Ci,Hr).call(this,1)),t(this,O).addEventListener("pointerdown",()=>t(this,O).setAttribute("data-pressing","true")),t(this,O).addEventListener("pointerup",()=>t(this,O).removeAttribute("data-pressing")),t(this,O).addEventListener("pointerleave",()=>t(this,O).removeAttribute("data-pressing")),t(this,O).addEventListener("pointercancel",()=>t(this,O).removeAttribute("data-pressing"))),e&&[t(this,Pe),t(this,He),t(this,De),t(this,ze)].forEach(I=>{if(!I)return;const f=I.getAttribute("data-feat");I.addEventListener("click",()=>o(this,tr,es).call(this,f)),I.addEventListener("pointerdown",()=>I.setAttribute("data-pressing","true")),I.addEventListener("pointerup",()=>I.removeAttribute("data-pressing")),I.addEventListener("pointerleave",()=>I.removeAttribute("data-pressing")),I.addEventListener("pointercancel",()=>I.removeAttribute("data-pressing"))}),this.renderCompanions()}applyState(e,i){s(this,$i,{...i}),s(this,ct,e),s(this,Re,i.fan_mode??null),s(this,je,i.preset_mode??null),s(this,Oe,i.swing_mode??null),!t(this,Bt)&&i.temperature!==void 0&&(s(this,F,i.temperature),o(this,Xe,yr).call(this)),t(this,Te)&&(t(this,Te).textContent=ye(i.hvac_action??e));const n=this.root.querySelector(".hrv-climate-ro-temp-int"),a=this.root.querySelector(".hrv-climate-ro-temp-frac");if(n&&i.temperature!==void 0){s(this,F,i.temperature);const[u,v]=t(this,F).toFixed(1).split(".");n.textContent=u,a.textContent=`.${v}`}o(this,sr,ns).call(this);const d=i.hvac_action??e,l=ye(d);this.announceState(`${this.def.friendly_name}, ${l}`)}predictState(e,i){const n={...t(this,$i)};return e==="set_hvac_mode"&&i.hvac_mode?{state:i.hvac_mode,attributes:n}:e==="set_temperature"&&i.temperature!==void 0?{state:t(this,ct),attributes:{...n,temperature:i.temperature}}:e==="set_fan_mode"&&i.fan_mode?{state:t(this,ct),attributes:{...n,fan_mode:i.fan_mode}}:e==="set_preset_mode"&&i.preset_mode?{state:t(this,ct),attributes:{...n,preset_mode:i.preset_mode}}:e==="set_swing_mode"&&i.swing_mode?{state:t(this,ct),attributes:{...n,swing_mode:i.swing_mode}}:null}}Me=new WeakMap,$t=new WeakMap,lt=new WeakMap,Z=new WeakMap,Bt=new WeakMap,Te=new WeakMap,qe=new WeakMap,Ie=new WeakMap,j=new WeakMap,O=new WeakMap,Pe=new WeakMap,He=new WeakMap,De=new WeakMap,ze=new WeakMap,kt=new WeakMap,Be=new WeakMap,te=new WeakMap,F=new WeakMap,ct=new WeakMap,Re=new WeakMap,je=new WeakMap,Oe=new WeakMap,pt=new WeakMap,Rt=new WeakMap,ee=new WeakMap,Fe=new WeakMap,Ne=new WeakMap,Ye=new WeakMap,Ve=new WeakMap,We=new WeakMap,$i=new WeakMap,Ze=new WeakMap,ki=new WeakSet,Pr=function(e){return Math.max(0,Math.min(100,(e-t(this,pt))/(t(this,Rt)-t(this,pt))*100))},Qi=new WeakSet,ts=function(e){const i=t(this,pt)+e/100*(t(this,Rt)-t(this,pt)),n=Math.round(i/t(this,ee))*t(this,ee);return Math.max(t(this,pt),Math.min(t(this,Rt),+n.toFixed(10)))},tr=new WeakSet,es=function(e){if(t(this,Be)===e){o(this,Ue,br).call(this);return}s(this,Be,e);let i=[],n=null,a="",d="";switch(e){case"mode":i=t(this,Ne),n=t(this,ct),a="set_hvac_mode",d="hvac_mode";break;case"fan":i=t(this,Ye),n=t(this,Re),a="set_fan_mode",d="fan_mode";break;case"preset":i=t(this,Ve),n=t(this,je),a="set_preset_mode",d="preset_mode";break;case"swing":i=t(this,We),n=t(this,Oe),a="set_swing_mode",d="swing_mode";break}if(!i.length||!t(this,kt))return;t(this,kt).innerHTML=i.map(u=>`
        <button class="hrv-cf-option" data-active="${u===n}" type="button">
          ${h(ye(u))}
        </button>
      `).join(""),t(this,kt).querySelectorAll(".hrv-cf-option").forEach((u,v)=>{u.addEventListener("click",()=>{this.config.card?.sendCommand(a,{[d]:i[v]}),o(this,Ue,br).call(this)})}),t(this,kt).removeAttribute("hidden");const l=u=>{u.composedPath().some(w=>w===this.root||w===this.root.host)||o(this,Ue,br).call(this)};s(this,te,l),document.addEventListener("pointerdown",l,!0)},Ue=new WeakSet,br=function(){s(this,Be,null),t(this,kt)?.setAttribute("hidden",""),t(this,te)&&(document.removeEventListener("pointerdown",t(this,te),!0),s(this,te,null))},Ci=new WeakSet,Hr=function(e){const i=Math.round((t(this,F)+e*t(this,ee))*100)/100;s(this,F,Math.max(t(this,pt),Math.min(t(this,Rt),i))),o(this,Xe,yr).call(this),t(this,Ze).call(this)},Xe=new WeakSet,yr=function(){const e=o(this,ki,Pr).call(this,t(this,F)),i=it*(1-e/100),n=K(B-e/100*b);t(this,$t)?.setAttribute("stroke-dashoffset",String(i)),t(this,lt)?.setAttribute("cx",String(n.x)),t(this,lt)?.setAttribute("cy",String(n.y)),t(this,Z)?.setAttribute("cx",String(n.x)),t(this,Z)?.setAttribute("cy",String(n.y));const[a,d]=t(this,F).toFixed(1).split(".");t(this,qe)&&(t(this,qe).textContent=a),t(this,Ie)&&(t(this,Ie).textContent=`.${d}`)},er=new WeakSet,is=function(e){s(this,Bt,!0),t(this,Z)?.setPointerCapture(e.pointerId),o(this,Ei,zr).call(this,e)},ir=new WeakSet,rs=function(e){t(this,Bt)&&o(this,Ei,zr).call(this,e)},Li=new WeakSet,Dr=function(e){if(t(this,Bt)){s(this,Bt,!1);try{t(this,Z)?.releasePointerCapture(e.pointerId)}catch{}t(this,$t)&&(t(this,$t).style.transition=""),t(this,lt)&&(t(this,lt).style.transition="")}},Ei=new WeakSet,zr=function(e){if(!t(this,Me))return;const i=t(this,Me).getBoundingClientRect(),n=i.left+i.width/2,a=i.top+i.height/2,d=e.clientX-n,l=-(e.clientY-a);let u=Math.atan2(l,d)*180/Math.PI;u<0&&(u+=360);let v=B-u;v<0&&(v+=360),v>b&&(v=v>b+(360-b)/2?0:b),s(this,F,o(this,Qi,ts).call(this,v/b*100)),t(this,$t)&&(t(this,$t).style.transition="none"),t(this,lt)&&(t(this,lt).style.transition="none"),o(this,Xe,yr).call(this),t(this,Ze).call(this)},rr=new WeakSet,ss=function(){this.config.card?.sendCommand("set_temperature",{temperature:t(this,F)})},sr=new WeakSet,ns=function(){const e=(i,n)=>{if(!i)return;const a=i.querySelector(".hrv-cf-value");a&&(a.textContent=ye(n??"None"))};e(t(this,Pe),t(this,ct)),e(t(this,He),t(this,Re)),e(t(this,De),t(this,je)),e(t(this,ze),t(this,Oe))};const Ls=`
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
      background: var(--hrv-color-success, #43a047);
    }

    [part=trigger-button]:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `;class Es extends m{constructor(){super(...arguments);r(this,L,null)}render(){const e=this.def.capabilities==="read-write",i=this.def.friendly_name;this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ls}</style>
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
      `,s(this,L,this.root.querySelector("[part=trigger-button]")),this.renderIcon(this.def.icon_state_map?.idle??this.def.icon??"mdi:play","btn-icon"),t(this,L)&&e&&(t(this,L).addEventListener("click",()=>{this.config.card?.sendCommand("trigger",{})}),t(this,L).addEventListener("pointerdown",()=>t(this,L).setAttribute("data-pressing","true")),t(this,L).addEventListener("pointerup",()=>t(this,L).removeAttribute("data-pressing")),t(this,L).addEventListener("pointerleave",()=>t(this,L).removeAttribute("data-pressing")),t(this,L).addEventListener("pointercancel",()=>t(this,L).removeAttribute("data-pressing"))),this.renderCompanions()}applyState(e,i){const n=e==="triggered";t(this,L)&&(t(this,L).setAttribute("data-state",e),this.def.capabilities==="read-write"&&(t(this,L).disabled=n));const a=this.def.icon_state_map?.[e]??this.def.icon??"mdi:play";this.renderIcon(a,"btn-icon"),n&&this.announceState(`${this.def.friendly_name}, ${this.i18n.t("state.triggered")}`)}predictState(e,i){return e!=="trigger"?null:{state:"triggered",attributes:{}}}}L=new WeakMap;const As=`
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
  `;class Ms extends m{constructor(){super(...arguments);r(this,ie,null)}render(){this.root.innerHTML=`
        <style>${this.getSharedStyles()}${As}</style>
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
      `,s(this,ie,this.root.querySelector(".hrv-bs-circle")),this.renderIcon(this.def.icon_state_map?.off??this.def.icon??"mdi:radiobox-blank","state-icon"),this.renderCompanions()}applyState(e,i){const n=e==="on",a=this.i18n.t(`state.${e}`)!==`state.${e}`?this.i18n.t(`state.${e}`):e;t(this,ie)&&(t(this,ie).setAttribute("data-on",String(n)),t(this,ie).setAttribute("aria-label",`${this.def.friendly_name}: ${a}`));const d=this.def.icon_state_map?.[e]??this.def.icon??(n?"mdi:radiobox-marked":"mdi:radiobox-blank");this.renderIcon(d,"state-icon"),this.announceState(`${this.def.friendly_name}, ${a}`)}}ie=new WeakMap;const Ts='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V10z" opacity="0.3"/><path d="M3 4h18v2H3V4zm0 16h18v2H3v-2z"/></svg>',qs='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',Is='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>',Ps=`
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
      width: 20px;
      height: 20px;
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
  `;class Hs extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,Ge);r(this,nr);r(this,re,null);r(this,ut,null);r(this,_,null);r(this,se,null);r(this,ne,null);r(this,ae,null);r(this,Ct,!1);r(this,vt,0);r(this,Ai,"closed");r(this,Mi,{});r(this,Ti,void 0);s(this,Ti,Pt(o(this,nr,as).bind(this),300))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features?.includes("set_position"),n=!this.def.supported_features||this.def.supported_features.includes("buttons");if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ps}</style>
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
                  title="Open cover" aria-label="Open cover">${Ts}</button>
                <button class="hrv-cover-btn" data-action="stop" type="button"
                  title="Stop cover" aria-label="Stop cover">${qs}</button>
                <button class="hrv-cover-btn" data-action="close" type="button"
                  title="Close cover" aria-label="Close cover">${Is}</button>
              </div>
            `:""}
          </div>
          ${this.renderAriaLiveHTML()}
          ${this.renderCompanionZoneHTML()}
          <div part="stale-indicator" aria-hidden="true"></div>
        </div>
      `,s(this,re,this.root.querySelector(".hrv-cover-slider-track")),s(this,ut,this.root.querySelector(".hrv-cover-slider-fill")),s(this,_,this.root.querySelector(".hrv-cover-slider-thumb")),s(this,se,this.root.querySelector("[data-action=open]")),s(this,ne,this.root.querySelector("[data-action=stop]")),s(this,ae,this.root.querySelector("[data-action=close]")),t(this,re)&&t(this,_)&&e){const a=l=>{s(this,Ct,!0),t(this,_).style.transition="none",t(this,ut).style.transition="none",o(this,Ge,xr).call(this,l),t(this,_).setPointerCapture(l.pointerId)};t(this,_).addEventListener("pointerdown",a),t(this,re).addEventListener("pointerdown",l=>{l.target!==t(this,_)&&(s(this,Ct,!0),t(this,_).style.transition="none",t(this,ut).style.transition="none",o(this,Ge,xr).call(this,l),t(this,_).setPointerCapture(l.pointerId))}),t(this,_).addEventListener("pointermove",l=>{t(this,Ct)&&o(this,Ge,xr).call(this,l)});const d=()=>{t(this,Ct)&&(s(this,Ct,!1),t(this,_).style.transition="",t(this,ut).style.transition="",t(this,Ti).call(this))};t(this,_).addEventListener("pointerup",d),t(this,_).addEventListener("pointercancel",d)}[t(this,se),t(this,ne),t(this,ae)].forEach(a=>{if(!a)return;const d=a.getAttribute("data-action");a.addEventListener("click",()=>{this.config.card?.sendCommand(`${d}_cover`,{})}),a.addEventListener("pointerdown",()=>a.setAttribute("data-pressing","true")),a.addEventListener("pointerup",()=>a.removeAttribute("data-pressing")),a.addEventListener("pointerleave",()=>a.removeAttribute("data-pressing")),a.addEventListener("pointercancel",()=>a.removeAttribute("data-pressing"))}),this.renderCompanions()}applyState(e,i){s(this,Ai,e),s(this,Mi,{...i});const n=e==="opening"||e==="closing",a=i.current_position;t(this,se)&&(t(this,se).disabled=!n&&a===100),t(this,ne)&&(t(this,ne).disabled=!n),t(this,ae)&&(t(this,ae).disabled=!n&&e==="closed"),i.current_position!==void 0&&!t(this,Ct)&&(s(this,vt,i.current_position),t(this,ut)&&(t(this,ut).style.width=`${t(this,vt)}%`),t(this,_)&&(t(this,_).style.left=`${t(this,vt)}%`)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){const n={...t(this,Mi)};return e==="open_cover"?(n.current_position=100,{state:"open",attributes:n}):e==="close_cover"?(n.current_position=0,{state:"closed",attributes:n}):e==="stop_cover"?{state:t(this,Ai),attributes:n}:e==="set_cover_position"&&i.position!==void 0?(n.current_position=i.position,{state:i.position>0?"open":"closed",attributes:n}):null}}re=new WeakMap,ut=new WeakMap,_=new WeakMap,se=new WeakMap,ne=new WeakMap,ae=new WeakMap,Ct=new WeakMap,vt=new WeakMap,Ai=new WeakMap,Mi=new WeakMap,Ti=new WeakMap,Ge=new WeakSet,xr=function(e){const i=t(this,re).getBoundingClientRect(),n=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,vt,Math.round(n)),t(this,ut).style.width=`${t(this,vt)}%`,t(this,_).style.left=`${t(this,vt)}%`},nr=new WeakSet,as=function(){this.config.card?.sendCommand("set_cover_position",{position:t(this,vt)})};const Ds=`
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

    .hrv-num-slider-wrap {
      padding: 20px 8px 12px;
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
      width: 72px;
      padding: 6px 8px;
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
  `;class zs extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,ar);r(this,or);r(this,Nt);r(this,Je);r(this,dr);r(this,Yt);r(this,oe,null);r(this,Lt,null);r(this,E,null);r(this,M,null);r(this,Ke,null);r(this,jt,null);r(this,Ot,null);r(this,Et,!1);r(this,A,0);r(this,U,0);r(this,Q,100);r(this,At,1);r(this,Ft,void 0);s(this,Ft,Pt(o(this,dr,hs).bind(this),300))}render(){const e=this.def.capabilities==="read-write";s(this,U,this.def.feature_config?.min??0),s(this,Q,this.def.feature_config?.max??100),s(this,At,this.def.feature_config?.step??1);const i=this.def.unit_of_measurement??"";if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ds}</style>
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
                  min="${t(this,U)}" max="${t(this,Q)}" step="${t(this,At)}"
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
      `,s(this,oe,this.root.querySelector(".hrv-num-slider-track")),s(this,Lt,this.root.querySelector(".hrv-num-slider-fill")),s(this,E,this.root.querySelector(".hrv-num-slider-thumb")),s(this,M,this.root.querySelector(".hrv-num-input")),s(this,Ke,this.root.querySelector(".hrv-num-readonly-val")),s(this,jt,this.root.querySelector("[part=dec-btn]")),s(this,Ot,this.root.querySelector("[part=inc-btn]")),t(this,oe)&&t(this,E)){const n=d=>{s(this,Et,!0),t(this,E).style.transition="none",t(this,Lt).style.transition="none",o(this,Je,wr).call(this,d),t(this,E).setPointerCapture(d.pointerId)};t(this,E).addEventListener("pointerdown",n),t(this,oe).addEventListener("pointerdown",d=>{d.target!==t(this,E)&&(s(this,Et,!0),t(this,E).style.transition="none",t(this,Lt).style.transition="none",o(this,Je,wr).call(this,d),t(this,E).setPointerCapture(d.pointerId))}),t(this,E).addEventListener("pointermove",d=>{t(this,Et)&&o(this,Je,wr).call(this,d)});const a=()=>{t(this,Et)&&(s(this,Et,!1),t(this,E).style.transition="",t(this,Lt).style.transition="",t(this,Ft).call(this))};t(this,E).addEventListener("pointerup",a),t(this,E).addEventListener("pointercancel",a)}t(this,M)&&t(this,M).addEventListener("input",()=>{const n=parseFloat(t(this,M).value);isNaN(n)||(s(this,A,Math.max(t(this,U),Math.min(t(this,Q),n))),o(this,Nt,ci).call(this),o(this,Yt,pi).call(this),t(this,Ft).call(this))}),t(this,jt)&&t(this,jt).addEventListener("click",()=>{s(this,A,+Math.max(t(this,U),t(this,A)-t(this,At)).toFixed(10)),o(this,Nt,ci).call(this),t(this,M)&&(t(this,M).value=String(t(this,A))),o(this,Yt,pi).call(this),t(this,Ft).call(this)}),t(this,Ot)&&t(this,Ot).addEventListener("click",()=>{s(this,A,+Math.min(t(this,Q),t(this,A)+t(this,At)).toFixed(10)),o(this,Nt,ci).call(this),t(this,M)&&(t(this,M).value=String(t(this,A))),o(this,Yt,pi).call(this),t(this,Ft).call(this)}),this.renderCompanions()}applyState(e,i){const n=parseFloat(e);if(isNaN(n))return;s(this,A,n),t(this,Et)||(o(this,Nt,ci).call(this),t(this,M)&&!this.isFocused(t(this,M))&&(t(this,M).value=String(n))),o(this,Yt,pi).call(this),t(this,Ke)&&(t(this,Ke).textContent=String(n));const a=this.def.unit_of_measurement??"";this.announceState(`${this.def.friendly_name}, ${n}${a?` ${a}`:""}`)}predictState(e,i){return e==="set_value"&&i.value!==void 0?{state:String(i.value),attributes:{}}:null}}oe=new WeakMap,Lt=new WeakMap,E=new WeakMap,M=new WeakMap,Ke=new WeakMap,jt=new WeakMap,Ot=new WeakMap,Et=new WeakMap,A=new WeakMap,U=new WeakMap,Q=new WeakMap,At=new WeakMap,Ft=new WeakMap,ar=new WeakSet,os=function(e){const i=t(this,Q)-t(this,U);return i===0?0:Math.max(0,Math.min(100,(e-t(this,U))/i*100))},or=new WeakSet,ds=function(e){const i=t(this,U)+e/100*(t(this,Q)-t(this,U)),n=Math.round(i/t(this,At))*t(this,At);return Math.max(t(this,U),Math.min(t(this,Q),+n.toFixed(10)))},Nt=new WeakSet,ci=function(){const e=o(this,ar,os).call(this,t(this,A));t(this,Lt)&&(t(this,Lt).style.width=`${e}%`),t(this,E)&&(t(this,E).style.left=`${e}%`)},Je=new WeakSet,wr=function(e){const i=t(this,oe).getBoundingClientRect(),n=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,A,o(this,or,ds).call(this,n)),o(this,Nt,ci).call(this),t(this,M)&&(t(this,M).value=String(t(this,A))),o(this,Yt,pi).call(this)},dr=new WeakSet,hs=function(){this.config.card?.sendCommand("set_value",{value:t(this,A)})},Yt=new WeakSet,pi=function(){t(this,jt)&&(t(this,jt).disabled=t(this,A)<=t(this,U)),t(this,Ot)&&(t(this,Ot).disabled=t(this,A)>=t(this,Q))};const Bs=`
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
  `;class Rs extends m{constructor(){super(...arguments);r(this,hr);r(this,Ii);r(this,Qe,null);r(this,ft,null);r(this,qi,"");r(this,Mt,[]);r(this,de,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Bs}</style>
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
      `,s(this,Qe,this.root.querySelector(".hrv-is-selected")),s(this,ft,this.root.querySelector(".hrv-is-dropdown")),t(this,Qe)&&e&&t(this,Qe).addEventListener("click",()=>{t(this,de)?o(this,Ii,Br).call(this):o(this,hr,ls).call(this)}),this.renderCompanions()}applyState(e,i){s(this,qi,e),s(this,Mt,i?.options??t(this,Mt));const n=this.root.querySelector(".hrv-is-label");n&&(n.textContent=e),t(this,de)&&t(this,ft)?.querySelectorAll(".hrv-is-option").forEach((a,d)=>{a.setAttribute("data-active",String(t(this,Mt)[d]===e))}),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e==="select_option"&&i.option!==void 0?{state:String(i.option),attributes:{}}:null}}Qe=new WeakMap,ft=new WeakMap,qi=new WeakMap,Mt=new WeakMap,de=new WeakMap,hr=new WeakSet,ls=function(){if(!t(this,ft)||!t(this,Mt).length)return;t(this,ft).innerHTML=t(this,Mt).map(i=>`
        <button class="hrv-is-option" type="button"
          data-active="${i===t(this,qi)}"
          title="${h(i)}">
          ${h(i)}
        </button>
      `).join(""),t(this,ft).querySelectorAll(".hrv-is-option").forEach((i,n)=>{i.addEventListener("click",()=>{this.config.card?.sendCommand("select_option",{option:t(this,Mt)[n]}),o(this,Ii,Br).call(this)})});const e=this.root.querySelector("[part=card]");e&&(e.style.overflow="visible"),t(this,ft).removeAttribute("hidden"),s(this,de,!0)},Ii=new WeakSet,Br=function(){t(this,ft)?.setAttribute("hidden","");const e=this.root.querySelector("[part=card]");e&&(e.style.overflow=""),s(this,de,!1)};const js=`
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
    .hrv-mp-btn svg { width: 20px; height: 20px; }
    .hrv-mp-btn[data-role=play] { width: 48px; height: 48px; }
    .hrv-mp-btn[data-role=play] svg { width: 24px; height: 24px; }

    .hrv-mp-volume {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hrv-mp-mute {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
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
    .hrv-mp-mute svg { width: 20px; height: 20px; }

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
      width: 18px;
      height: 18px;
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
  `;class Os extends m{constructor(e,i,n,a){super(e,i,n,a);r(this,ii);r(this,lr);r(this,Tt,null);r(this,ti,null);r(this,ei,null);r(this,he,null);r(this,le,null);r(this,mt,null);r(this,S,null);r(this,ce,null);r(this,pe,null);r(this,ue,!1);r(this,gt,0);r(this,qt,!1);r(this,Pi,void 0);s(this,Pi,this.debounce(o(this,lr,cs).bind(this),200))}render(){const e=this.def.capabilities==="read-write",i=this.def.supported_features??[],n=i.includes("volume_set"),a=i.includes("previous_track");if(this.root.innerHTML=`
        <style>${this.getSharedStyles()}${js}</style>
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
      `,s(this,Tt,this.root.querySelector("[data-role=play]")),s(this,ti,this.root.querySelector("[data-role=prev]")),s(this,ei,this.root.querySelector("[data-role=next]")),s(this,he,this.root.querySelector(".hrv-mp-mute")),s(this,le,this.root.querySelector(".hrv-mp-slider-track")),s(this,mt,this.root.querySelector(".hrv-mp-slider-fill")),s(this,S,this.root.querySelector(".hrv-mp-slider-thumb")),s(this,ce,this.root.querySelector(".hrv-mp-artist")),s(this,pe,this.root.querySelector(".hrv-mp-title")),this.renderIcon("mdi:play","play-icon"),this.renderIcon("mdi:skip-previous","prev-icon"),this.renderIcon("mdi:skip-next","next-icon"),this.renderIcon("mdi:volume-high","mute-icon"),e&&(t(this,Tt)?.addEventListener("click",()=>{this.config.card?.sendCommand("media_play_pause",{})}),t(this,ti)?.addEventListener("click",()=>this.config.card?.sendCommand("media_previous_track",{})),t(this,ei)?.addEventListener("click",()=>this.config.card?.sendCommand("media_next_track",{})),[t(this,Tt),t(this,ti),t(this,ei)].forEach(d=>{d&&(d.addEventListener("pointerdown",()=>d.setAttribute("data-pressing","true")),d.addEventListener("pointerup",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointerleave",()=>d.removeAttribute("data-pressing")),d.addEventListener("pointercancel",()=>d.removeAttribute("data-pressing")))}),t(this,he)?.addEventListener("click",()=>this.config.card?.sendCommand("volume_mute",{is_volume_muted:!t(this,ue)})),t(this,le)&&t(this,S))){const d=u=>{s(this,qt,!0),t(this,S).style.transition="none",t(this,mt).style.transition="none",o(this,ii,_r).call(this,u),t(this,S).setPointerCapture(u.pointerId)};t(this,S).addEventListener("pointerdown",d),t(this,le).addEventListener("pointerdown",u=>{u.target!==t(this,S)&&(s(this,qt,!0),t(this,S).style.transition="none",t(this,mt).style.transition="none",o(this,ii,_r).call(this,u),t(this,S).setPointerCapture(u.pointerId))}),t(this,S).addEventListener("pointermove",u=>{t(this,qt)&&o(this,ii,_r).call(this,u)});const l=()=>{t(this,qt)&&(s(this,qt,!1),t(this,S).style.transition="",t(this,mt).style.transition="",t(this,Pi).call(this))};t(this,S).addEventListener("pointerup",l),t(this,S).addEventListener("pointercancel",l)}this.renderCompanions()}applyState(e,i){const n=e==="playing",a=e==="paused";if(t(this,ce)){const l=i.media_artist??"";t(this,ce).textContent=l,t(this,ce).title=l||"Artist"}if(t(this,pe)){const l=i.media_title??"";t(this,pe).textContent=l,t(this,pe).title=l||"Title"}if(t(this,Tt)){t(this,Tt).setAttribute("data-playing",String(n));const l=n?"mdi:pause":"mdi:play";this.renderIcon(l,"play-icon"),this.def.capabilities==="read-write"&&(t(this,Tt).title=n?"Pause":"Play")}if(s(this,ue,!!i.is_volume_muted),t(this,he)){const l=t(this,ue)?"mdi:volume-off":"mdi:volume-high";this.renderIcon(l,"mute-icon"),this.def.capabilities==="read-write"&&(t(this,he).title=t(this,ue)?"Unmute":"Mute")}i.volume_level!==void 0&&!t(this,qt)&&(s(this,gt,Math.round(i.volume_level*100)),t(this,mt)&&(t(this,mt).style.width=`${t(this,gt)}%`),t(this,S)&&(t(this,S).style.left=`${t(this,gt)}%`));const d=i.media_title??"";this.announceState(`${this.def.friendly_name}, ${e}${d?` - ${d}`:""}`)}}Tt=new WeakMap,ti=new WeakMap,ei=new WeakMap,he=new WeakMap,le=new WeakMap,mt=new WeakMap,S=new WeakMap,ce=new WeakMap,pe=new WeakMap,ue=new WeakMap,gt=new WeakMap,qt=new WeakMap,Pi=new WeakMap,ii=new WeakSet,_r=function(e){const i=t(this,le).getBoundingClientRect(),n=Math.max(0,Math.min(100,(e.clientX-i.left)/i.width*100));s(this,gt,Math.round(n)),t(this,mt).style.width=`${t(this,gt)}%`,t(this,S).style.left=`${t(this,gt)}%`},lr=new WeakSet,cs=function(){this.config.card?.sendCommand("volume_set",{volume_level:t(this,gt)/100})};const Fs=`
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
  `;class Ns extends m{constructor(){super(...arguments);r(this,N,null)}render(){const e=this.def.capabilities==="read-write",i=this.config.tapAction?.data?.command??"power";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Fs}</style>
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
      `,s(this,N,this.root.querySelector(".hrv-remote-circle"));const n=this.resolveIcon(this.def.icon,"mdi:remote");this.renderIcon(n,"remote-icon"),t(this,N)&&e&&(t(this,N).addEventListener("click",()=>{const a=this.config.tapAction?.data?.command??"power",d=this.config.tapAction?.data?.device??void 0,l=d?{command:a,device:d}:{command:a};this.config.card?.sendCommand("send_command",l)}),t(this,N).addEventListener("pointerdown",()=>t(this,N).setAttribute("data-pressing","true")),t(this,N).addEventListener("pointerup",()=>t(this,N).removeAttribute("data-pressing")),t(this,N).addEventListener("pointerleave",()=>t(this,N).removeAttribute("data-pressing")),t(this,N).addEventListener("pointercancel",()=>t(this,N).removeAttribute("data-pressing"))),this.renderCompanions()}applyState(e,i){const n=this.def.icon_state_map?.[e]??this.def.icon??"mdi:remote";this.renderIcon(this.resolveIcon(n,"mdi:remote"),"remote-icon"),this.announceState(`${this.def.friendly_name}, ${e}`)}}N=new WeakMap;const Ys=`
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
  `;class Vs extends m{constructor(){super(...arguments);r(this,ri,null);r(this,si,null)}render(){const e=this.def.unit_of_measurement??"";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ys}</style>
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
      `,s(this,ri,this.root.querySelector(".hrv-sensor-val")),s(this,si,this.root.querySelector(".hrv-sensor-unit")),this.renderCompanions()}applyState(e,i){t(this,ri)&&(t(this,ri).textContent=e),t(this,si)&&i.unit_of_measurement!==void 0&&(t(this,si).textContent=i.unit_of_measurement);const n=i.unit_of_measurement??this.def.unit_of_measurement??"",a=this.root.querySelector("[part=card-body]");a&&(a.title=`${e}${n?` ${n}`:""}`),this.announceState(`${this.def.friendly_name}, ${e}${n?` ${n}`:""}`)}}ri=new WeakMap,si=new WeakMap;const Ws=`
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
  `;class jr extends m{constructor(){super(...arguments);r(this,bt,null);r(this,ni,null);r(this,ve,!1)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Ws}</style>
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
      `,s(this,bt,this.root.querySelector(".hrv-switch-track")),s(this,ni,this.root.querySelector(".hrv-switch-ro")),t(this,bt)&&e&&t(this,bt).addEventListener("click",()=>{this.config.card?.sendCommand("toggle",{})}),this.renderCompanions()}applyState(e,i){s(this,ve,e==="on");const n=e==="unavailable"||e==="unknown";t(this,bt)&&(t(this,bt).setAttribute("data-on",String(t(this,ve))),t(this,bt).title=t(this,ve)?"On - click to turn off":"Off - click to turn on",t(this,bt).disabled=n),t(this,ni)&&(t(this,ni).textContent=ye(e)),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,ve)?"off":"on",attributes:{}}}}bt=new WeakMap,ni=new WeakMap,ve=new WeakMap;const Zs=`
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
  `;function Ri(c){c<0&&(c=0);const p=Math.floor(c/3600),e=Math.floor(c%3600/60),i=Math.floor(c%60),n=a=>String(a).padStart(2,"0");return p>0?`${p}:${n(e)}:${n(i)}`:`${n(e)}:${n(i)}`}function Or(c){if(typeof c=="number")return c;if(typeof c!="string")return 0;const p=c.split(":").map(Number);return p.length===3?p[0]*3600+p[1]*60+p[2]:p.length===2?p[0]*60+p[1]:p[0]||0}class Us extends m{constructor(){super(...arguments);r(this,cr);r(this,pr);r(this,ur);r(this,me);r(this,G,null);r(this,It,null);r(this,Vt,null);r(this,Wt,null);r(this,fe,null);r(this,ai,"idle");r(this,oi,{});r(this,tt,null);r(this,di,null)}render(){const e=this.def.capabilities==="read-write";this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Zs}</style>
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
      `,s(this,G,this.root.querySelector(".hrv-timer-display")),s(this,It,this.root.querySelector("[data-action=playpause]")),s(this,Vt,this.root.querySelector("[data-action=cancel]")),s(this,Wt,this.root.querySelector("[data-action=finish]")),this.renderIcon("mdi:play","playpause-icon"),this.renderIcon("mdi:stop","cancel-icon"),this.renderIcon("mdi:check-circle","finish-icon"),e&&(t(this,It)?.addEventListener("click",()=>{const i=t(this,ai)==="active"?"pause":"start";this.config.card?.sendCommand(i,{})}),t(this,Vt)?.addEventListener("click",()=>{this.config.card?.sendCommand("cancel",{})}),t(this,Wt)?.addEventListener("click",()=>{this.config.card?.sendCommand("finish",{})}),[t(this,It),t(this,Vt),t(this,Wt)].forEach(i=>{i&&(i.addEventListener("pointerdown",()=>i.setAttribute("data-pressing","true")),i.addEventListener("pointerup",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointerleave",()=>i.removeAttribute("data-pressing")),i.addEventListener("pointercancel",()=>i.removeAttribute("data-pressing")))})),this.renderCompanions()}applyState(e,i){s(this,ai,e),s(this,oi,{...i}),s(this,tt,i.finishes_at??null),s(this,di,i.remaining!=null?Or(i.remaining):null),o(this,cr,ps).call(this,e),o(this,pr,us).call(this,e),e==="active"&&t(this,tt)?o(this,ur,vs).call(this):o(this,me,zi).call(this),t(this,G)&&t(this,G).setAttribute("data-paused",String(e==="paused"))}predictState(e,i){const n={...t(this,oi)};return e==="start"?{state:"active",attributes:n}:e==="pause"?(t(this,tt)&&(n.remaining=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3)),{state:"paused",attributes:n}):e==="cancel"||e==="finish"?{state:"idle",attributes:n}:null}}G=new WeakMap,It=new WeakMap,Vt=new WeakMap,Wt=new WeakMap,fe=new WeakMap,ai=new WeakMap,oi=new WeakMap,tt=new WeakMap,di=new WeakMap,cr=new WeakSet,ps=function(e){const i=e==="idle",n=e==="active";if(t(this,It)){const a=n?"mdi:pause":"mdi:play",d=n?"Pause":e==="paused"?"Resume":"Start";this.renderIcon(a,"playpause-icon"),t(this,It).title=d,t(this,It).setAttribute("aria-label",`${this.def.friendly_name} - ${d}`)}t(this,Vt)&&(t(this,Vt).disabled=i),t(this,Wt)&&(t(this,Wt).disabled=i),this.announceState(`${this.def.friendly_name}, ${e}`)},pr=new WeakSet,us=function(e){if(t(this,G)){if(e==="idle"){const i=t(this,oi).duration;t(this,G).textContent=i?Ri(Or(i)):"00:00";return}if(e==="paused"&&t(this,di)!=null){t(this,G).textContent=Ri(t(this,di));return}if(e==="active"&&t(this,tt)){const i=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3);t(this,G).textContent=Ri(i)}}},ur=new WeakSet,vs=function(){o(this,me,zi).call(this),s(this,fe,setInterval(()=>{if(!t(this,tt)||t(this,ai)!=="active"){o(this,me,zi).call(this);return}const e=Math.max(0,(new Date(t(this,tt)).getTime()-Date.now())/1e3);t(this,G)&&(t(this,G).textContent=Ri(e)),e<=0&&o(this,me,zi).call(this)},1e3))},me=new WeakSet,zi=function(){t(this,fe)&&(clearInterval(t(this,fe)),s(this,fe,null))};const Xs=`
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
  `;class Gs extends m{constructor(){super(...arguments);r(this,hi,null);r(this,yt,null);r(this,ge,!1);r(this,be,!1)}render(){const e=this.def.capabilities==="read-write";s(this,be,!1),this.root.innerHTML=`
        <style>${this.getSharedStyles()}${Xs}</style>
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
      `,s(this,hi,this.root.querySelector(".hrv-generic-state")),s(this,yt,this.root.querySelector(".hrv-generic-toggle")),t(this,yt)&&e&&t(this,yt).addEventListener("click",()=>{this.config.card?.sendCommand("toggle",{})}),this.renderCompanions()}applyState(e,i){const n=e==="on"||e==="off";s(this,ge,e==="on"),t(this,hi)&&(t(this,hi).textContent=ye(e)),t(this,yt)&&(n&&!t(this,be)&&(t(this,yt).removeAttribute("hidden"),s(this,be,!0)),t(this,be)&&(t(this,yt).setAttribute("data-on",String(t(this,ge))),t(this,yt).title=t(this,ge)?"On - click to turn off":"Off - click to turn on")),this.announceState(`${this.def.friendly_name}, ${e}`)}predictState(e,i){return e!=="toggle"?null:{state:t(this,ge)?"off":"on",attributes:{}}}}hi=new WeakMap,yt=new WeakMap,ge=new WeakMap,be=new WeakMap,g._packs=g._packs||{},g._packs.examples={light:ws,fan:Ss,climate:Cs,harvest_action:Es,binary_sensor:Ms,cover:Hs,input_boolean:jr,input_number:zs,input_select:Rs,media_player:Os,remote:Ns,sensor:Vs,switch:jr,timer:Us,generic:Gs}})();})();
