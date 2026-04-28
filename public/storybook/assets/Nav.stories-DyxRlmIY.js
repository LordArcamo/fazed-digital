import{r as c,j as e}from"./iframe-DUbiUOlY.js";import{g as o}from"./index-SFc2wnMY.js";import{u as B}from"./index-CTx7o6_M.js";import"./preload-helper-4_59RN96.js";o.registerPlugin(B);const q=[{href:"/",label:"Home",num:"01"},{href:"/about",label:"About",num:"02"},{href:"/services",label:"Services",num:"03"},{href:"/work",label:"Work",num:"04"},{href:"/blog",label:"Blog",num:"05"},{href:"/contact",label:"Contact",num:"06"}],O=[{label:"Email",value:"info@fazeddigital.com",href:"mailto:info@fazeddigital.com"},{label:"Phone",value:"+63 922 123 4567",href:"tel:+639221234567"},{label:"Location",value:"Iligan City, PH",href:void 0},{label:"Hours",value:"Mon–Fri 8:30–5:00",href:void 0}];function i({currentPath:t="/"}){const[l,L]=c.useState(!1),x=c.useRef(null),h=c.useRef(null),b=c.useRef(null);B(()=>{const r=h.current,a=r.querySelectorAll(".nav-link"),s=r.querySelectorAll(".nav-meta"),n=r.querySelector(".nav-right-panel");o.set(a,{y:32,autoAlpha:0}),o.set(n,{x:20,autoAlpha:0}),o.set(s,{y:10,autoAlpha:0}),b.current=o.timeline({paused:!0,onReverseComplete:()=>{o.set(r,{visibility:"hidden",pointerEvents:"none"})}}).to(r,{clipPath:"inset(0 0 0% 0)",duration:.7,ease:"expo.inOut"}).to(a,{y:0,autoAlpha:1,stagger:.05,duration:.55,ease:"power3.out"},"-=0.35").to(n,{x:0,autoAlpha:1,duration:.5,ease:"power2.out"},"<0.05").to(s,{y:0,autoAlpha:1,stagger:.04,duration:.4,ease:"power2.out"},"<0.1")},{scope:x}),c.useEffect(()=>{const r=a=>{a.key==="Escape"&&l&&f()};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[l]);const f=()=>{const r=b.current;r&&(l?(r.reverse(),document.body.style.overflow=""):(o.set(h.current,{visibility:"visible",pointerEvents:"auto"}),r.play(),document.body.style.overflow="hidden"),L(a=>!a))};return e.jsxs("div",{ref:x,children:[e.jsxs("header",{style:{position:"fixed",top:0,left:0,right:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.4rem clamp(1.5rem, 4vw, 3rem)",mixBlendMode:"difference"},children:[e.jsxs("a",{href:"/","aria-label":"Fazed Digital home",style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"372 205 755 1089",style:{width:"1.4rem",height:"auto",color:"var(--accent)",flexShrink:0},"aria-hidden":"true",children:e.jsxs("g",{transform:"translate(0 1500) scale(0.1 -0.1)",fill:"currentColor",children:[e.jsx("path",{d:"M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z"}),e.jsx("path",{d:"M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z"}),e.jsx("path",{d:"M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z"})]})}),e.jsx("span",{style:{fontFamily:"var(--font-display)",fontSize:"1.45rem",fontWeight:700,letterSpacing:"-0.01em",color:"var(--white)"},children:"Fazed"}),e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.6rem",letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--gray-500)",alignSelf:"flex-end",paddingBottom:"0.2rem"},children:"Digital"})]}),e.jsx("button",{onClick:f,"aria-label":l?"Close menu":"Open menu","aria-expanded":l,style:{display:"flex",flexDirection:"column",gap:"5px",padding:"8px",margin:"-8px"},children:[0,1].map(r=>e.jsx("span",{style:{display:"block",width:26,height:"1.5px",background:"var(--white)",borderRadius:2,transition:"transform 0.4s var(--ease-expo)",transform:l?r===0?"translateY(3.25px) rotate(45deg)":"translateY(-3.25px) rotate(-45deg)":"none"}},r))})]}),e.jsxs("div",{ref:h,className:"nav-overlay",style:{display:"flex",visibility:"hidden",pointerEvents:"none",position:"fixed",inset:0,background:"var(--gray-900)",zIndex:999,flexDirection:"row",clipPath:"inset(0 0 100% 0)",willChange:"clip-path",overflowY:"auto"},children:[e.jsxs("div",{className:"nav-left",style:{flex:"1 1 55%",display:"flex",flexDirection:"column",justifyContent:"center",padding:"clamp(2rem, 6vw, 6rem)",borderRight:"1px solid var(--border)"},children:[e.jsx("div",{className:"label",style:{marginBottom:"2rem",color:"var(--accent)"},children:"Navigation"}),e.jsx("nav",{"aria-label":"Main navigation",children:e.jsx("ul",{style:{display:"flex",flexDirection:"column",gap:"0.2rem"},children:q.map(({href:r,label:a,num:s})=>{const n=r===t;return e.jsx("li",{style:{overflow:"hidden"},children:e.jsxs("a",{href:r,className:"nav-link",onClick:f,style:{display:"flex",alignItems:"center",gap:"1.25rem",fontFamily:"var(--font-display)",fontSize:"clamp(2rem, 4.5vw, 5rem)",fontWeight:700,letterSpacing:"-0.025em",lineHeight:1.05,color:n?"var(--white)":"var(--gray-600)",padding:"0.25rem 0",transition:"color 0.2s",textDecoration:"none"},onMouseEnter:y=>{n||o.to(y.currentTarget,{color:"var(--white)",x:8,duration:.25,ease:"power2.out"})},onMouseLeave:y=>{n||o.to(y.currentTarget,{color:"var(--gray-600)",x:0,duration:.3,ease:"power2.out"})},children:[e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.62rem",color:n?"var(--accent)":"var(--gray-700)",letterSpacing:"0.1em",lineHeight:1,flexShrink:0,paddingTop:"0.2em"},children:s}),a,n&&e.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"var(--accent)",flexShrink:0,marginLeft:"auto"}})]})},r)})})})]}),e.jsxs("div",{className:"nav-right-panel",style:{flex:"1 1 45%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"clamp(2rem, 6vw, 6rem)",borderLeft:"1px solid var(--border)"},children:[e.jsx("div",{children:e.jsx("div",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(3.5rem, 8vw, 9rem)",fontWeight:700,letterSpacing:"-0.03em",lineHeight:.88,color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.08)",userSelect:"none"},children:"Fazed"})}),e.jsxs("div",{children:[e.jsx("div",{className:"label",style:{marginBottom:"1.5rem",color:"var(--accent)"},children:"Get In Touch"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1.1rem"},children:O.map(({label:r,value:a,href:s})=>e.jsxs("div",{className:"nav-meta",style:{display:"flex",flexDirection:"column",gap:"0.2rem"},children:[e.jsx("span",{className:"label",style:{color:"var(--gray-600)"},children:r}),s?e.jsx("a",{href:s,style:{fontSize:"0.9rem",fontWeight:500,color:"var(--gray-300)",transition:"color 0.2s"},onMouseEnter:n=>n.currentTarget.style.color="var(--white)",onMouseLeave:n=>n.currentTarget.style.color="var(--gray-300)",children:a}):e.jsx("span",{style:{fontSize:"0.9rem",color:"var(--gray-500)"},children:a})]},r))})]})]})]}),e.jsx("style",{children:`
        @media (max-width: 700px) {
          .nav-overlay { flex-direction: column !important; }
          .nav-left {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
            flex: none !important;
            padding-top: 6rem !important;
            padding-bottom: 2rem !important;
            justify-content: flex-end !important;
          }
          .nav-right-panel { flex: none !important; border-left: none !important; }
        }
      `})]})}i.__docgenInfo={description:"",methods:[],displayName:"Nav",props:{currentPath:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'/'",computed:!1}}}};const K={title:"UI/Nav",component:i,tags:["autodocs"],argTypes:{currentPath:{control:"select",options:["/","/about","/services","/work","/blog","/contact"],description:"Active route — highlights the matching nav link with accent dot"}},parameters:{layout:"fullscreen",docs:{description:{component:"Full-screen overlay navigation with GSAP clip-path wipe animation. Fixed header with logo + hamburger toggle. Uses `mixBlendMode: difference` so the bar is visible over any background."}}}},d={name:"Closed (Default)",args:{currentPath:"/"},render:t=>e.jsxs("div",{style:{minHeight:"100vh",background:"var(--black)"},children:[e.jsx(i,{...t}),e.jsx("div",{style:{padding:"8rem 3rem",fontFamily:"var(--font-body)",color:"var(--gray-600)",fontSize:"0.875rem"},children:"Click the hamburger icon (top right) to open the menu overlay."})]})},m={name:"Active: Home",args:{currentPath:"/"},render:t=>e.jsx("div",{style:{minHeight:"100vh",background:"var(--black)"},children:e.jsx(i,{...t})})},v={name:"Active: About",args:{currentPath:"/about"},render:t=>e.jsx("div",{style:{minHeight:"100vh",background:"var(--black)"},children:e.jsx(i,{...t})})},p={name:"Active: Services",args:{currentPath:"/services"},render:t=>e.jsx("div",{style:{minHeight:"100vh",background:"var(--black)"},children:e.jsx(i,{...t})})},u={name:"Active: Work",args:{currentPath:"/work"},render:t=>e.jsx("div",{style:{minHeight:"100vh",background:"var(--black)"},children:e.jsx(i,{...t})})},g={name:"Active: Contact",args:{currentPath:"/contact"},render:t=>e.jsx("div",{style:{minHeight:"100vh",background:"var(--black)"},children:e.jsx(i,{...t})})};var k,j,w;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'Closed (Default)',
  args: {
    currentPath: '/'
  },
  render: args => <div style={{
    minHeight: '100vh',
    background: 'var(--black)'
  }}>
      <Nav {...args} />
      <div style={{
      padding: '8rem 3rem',
      fontFamily: 'var(--font-body)',
      color: 'var(--gray-600)',
      fontSize: '0.875rem'
    }}>
        Click the hamburger icon (top right) to open the menu overlay.
      </div>
    </div>
}`,...(w=(j=d.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};var S,A,H;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'Active: Home',
  args: {
    currentPath: '/'
  },
  render: args => <div style={{
    minHeight: '100vh',
    background: 'var(--black)'
  }}>
      <Nav {...args} />
    </div>
}`,...(H=(A=m.parameters)==null?void 0:A.docs)==null?void 0:H.source}}};var P,C,z;v.parameters={...v.parameters,docs:{...(P=v.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Active: About',
  args: {
    currentPath: '/about'
  },
  render: args => <div style={{
    minHeight: '100vh',
    background: 'var(--black)'
  }}>
      <Nav {...args} />
    </div>
}`,...(z=(C=v.parameters)==null?void 0:C.docs)==null?void 0:z.source}}};var N,D,E;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'Active: Services',
  args: {
    currentPath: '/services'
  },
  render: args => <div style={{
    minHeight: '100vh',
    background: 'var(--black)'
  }}>
      <Nav {...args} />
    </div>
}`,...(E=(D=p.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var F,M,R;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'Active: Work',
  args: {
    currentPath: '/work'
  },
  render: args => <div style={{
    minHeight: '100vh',
    background: 'var(--black)'
  }}>
      <Nav {...args} />
    </div>
}`,...(R=(M=u.parameters)==null?void 0:M.docs)==null?void 0:R.source}}};var W,T,I;g.parameters={...g.parameters,docs:{...(W=g.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Active: Contact',
  args: {
    currentPath: '/contact'
  },
  render: args => <div style={{
    minHeight: '100vh',
    background: 'var(--black)'
  }}>
      <Nav {...args} />
    </div>
}`,...(I=(T=g.parameters)==null?void 0:T.docs)==null?void 0:I.source}}};const V=["Default","HomeActive","AboutActive","ServicesActive","WorkActive","ContactActive"];export{v as AboutActive,g as ContactActive,d as Default,m as HomeActive,p as ServicesActive,u as WorkActive,V as __namedExportsOrder,K as default};
