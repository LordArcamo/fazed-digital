import{j as e,r as c}from"./iframe-DPjQQZx3.js";import{g as a}from"./index-SFc2wnMY.js";import{S as f}from"./ScrollTrigger-CezCZ8EY.js";import{u}from"./index-BvcrDg6X.js";import"./preload-helper-4_59RN96.js";a.registerPlugin(f,u);const g=[{value:120,suffix:"+",label:"Projects Delivered",sub:"Across 14 industries"},{value:98,suffix:"%",label:"Client Satisfaction",sub:"Based on project reviews"},{value:6,suffix:" yrs",label:"In Business",sub:"Iligan City-based since 2018"},{value:4,suffix:"x",label:"Avg ROI Uplift",sub:"On SEO & web projects"}];function v({stat:t,index:s}){const i=c.useRef(null),r=c.useRef(null);return u(()=>{const l={val:0};a.from(r.current,{y:35,autoAlpha:0,duration:.7,delay:s*.08,ease:"power3.out",scrollTrigger:{trigger:r.current,start:"top 86%",toggleActions:"play none none none"}}),a.to(l,{val:t.value,duration:1.6,ease:"power2.out",delay:s*.08+.2,onUpdate(){i.current.textContent=String(Math.round(l.val))},scrollTrigger:{trigger:r.current,start:"top 82%",toggleActions:"play none none none"}})},{scope:r}),e.jsxs("div",{ref:r,style:{padding:"clamp(2rem, 4vw, 3rem) 2rem",borderLeft:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:"0.4rem"},children:[e.jsxs("div",{style:{lineHeight:1},children:[e.jsx("span",{ref:i,style:{fontFamily:"var(--font-display)",fontSize:"clamp(3rem, 5.5vw, 5.5rem)",fontWeight:600,letterSpacing:"-0.02em",color:"var(--white)"},children:"0"}),e.jsx("span",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(2rem, 3.5vw, 3.5rem)",fontWeight:300,letterSpacing:"-0.01em",color:"var(--gray-500)"},children:t.suffix})]}),e.jsx("div",{style:{fontFamily:"var(--font-body)",fontWeight:600,fontSize:"0.975rem",color:"var(--white)"},children:t.label}),e.jsx("div",{className:"label",style:{marginTop:"0.1rem"},children:t.sub})]})}function o(){return e.jsxs("section",{style:{background:"var(--gray-900)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"},children:[e.jsx("div",{className:"container",children:e.jsx("div",{className:"stats-inner",style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0},children:g.map((t,s)=>e.jsx(v,{stat:t,index:s},t.label))})}),e.jsx("style",{children:`
        @media(max-width:900px){.stats-inner{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:480px){.stats-inner{grid-template-columns:1fr!important}}
      `})]})}o.__docgenInfo={description:"",methods:[],displayName:"StatsSection"};const j={title:"Sections/StatsSection",component:o,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:"Animated counter stats: 120+ Projects, 98% Satisfaction, 6 yrs in business, 4x ROI. Numbers count up on scroll via GSAP. Uses 4-column grid, collapses to 2 cols at 900px, 1 col at 480px."}}}},n={name:"Default",render:()=>e.jsxs("div",{style:{background:"var(--black)"},children:[e.jsx("div",{style:{height:100}}),e.jsx(o,{}),e.jsx("div",{style:{height:100}})]})};var d,m,p;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'Default',
  render: () => <div style={{
    background: 'var(--black)'
  }}>
      {/* Spacer to trigger scroll animation */}
      <div style={{
      height: 100
    }} />
      <StatsSection />
      <div style={{
      height: 100
    }} />
    </div>
}`,...(p=(m=n.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const w=["Default"];export{n as Default,w as __namedExportsOrder,j as default};
