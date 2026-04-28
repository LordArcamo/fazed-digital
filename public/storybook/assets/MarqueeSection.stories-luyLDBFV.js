import{r as x,j as e}from"./iframe-DUbiUOlY.js";import{g as v}from"./index-SFc2wnMY.js";import{u}from"./index-CTx7o6_M.js";import"./preload-helper-4_59RN96.js";v.registerPlugin(u);const o=["Web Design","Brand Identity","SEO Marketing","Product Design","Custom Systems","UI/UX Design","Digital Strategy","Creative Direction"];function n(){const a=x.useRef(null);u(()=>{const s=a.current.scrollWidth/2;v.to(a.current,{x:-s,duration:32,ease:"none",repeat:-1})},{scope:a});const g=[...o,...o];return e.jsx("section",{style:{borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"1.25rem 0",overflow:"hidden",background:"var(--gray-900)"},children:e.jsx("div",{ref:a,style:{display:"flex",alignItems:"center",whiteSpace:"nowrap",width:"max-content"},children:g.map((s,y)=>e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"1.75rem"},children:[e.jsx("span",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(0.85rem, 1.2vw, 1rem)",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--gray-400)",padding:"0 0.25rem"},children:s}),e.jsx("span",{style:{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"var(--accent)",flexShrink:0}})]},y))})})}n.__docgenInfo={description:"",methods:[],displayName:"MarqueeSection"};const w={title:"UI/MarqueeSection",component:n,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:"Infinitely scrolling ticker strip. Used as a visual separator between sections on all pages. Driven by GSAP — the track animates at –x for exactly half its width, then repeats seamlessly."}}}},r={name:"Default",render:()=>e.jsx("div",{style:{background:"var(--black)",padding:"6rem 0"},children:e.jsx(n,{})})},t={name:"Between Sections",render:()=>e.jsxs("div",{style:{background:"var(--black)",fontFamily:"var(--font-body)"},children:[e.jsxs("div",{style:{padding:"4rem var(--gutter)",display:"flex",flexDirection:"column",gap:"1rem",borderBottom:"1px solid var(--border)",maxWidth:"var(--container)",margin:"0 auto"},children:[e.jsx("span",{className:"label",style:{color:"var(--accent)"},children:"01 · Hero"}),e.jsx("div",{className:"display-md",style:{color:"var(--white)"},children:"Above Section"})]}),e.jsx(n,{}),e.jsxs("div",{style:{padding:"4rem var(--gutter)",display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"var(--container)",margin:"0 auto"},children:[e.jsx("span",{className:"label",style:{color:"var(--accent)"},children:"02 · Content"}),e.jsx("div",{className:"display-md",style:{color:"var(--white)"},children:"Below Section"})]})]})};var i,l,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: 'Default',
  render: () => <div style={{
    background: 'var(--black)',
    padding: '6rem 0'
  }}>
      <MarqueeSection />
    </div>
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var d,m,p;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'Between Sections',
  render: () => <div style={{
    background: 'var(--black)',
    fontFamily: 'var(--font-body)'
  }}>
      {/* Simulated section above */}
      <div style={{
      padding: '4rem var(--gutter)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      borderBottom: '1px solid var(--border)',
      maxWidth: 'var(--container)',
      margin: '0 auto'
    }}>
        <span className="label" style={{
        color: 'var(--accent)'
      }}>01 · Hero</span>
        <div className="display-md" style={{
        color: 'var(--white)'
      }}>Above Section</div>
      </div>
      <MarqueeSection />
      {/* Simulated section below */}
      <div style={{
      padding: '4rem var(--gutter)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: 'var(--container)',
      margin: '0 auto'
    }}>
        <span className="label" style={{
        color: 'var(--accent)'
      }}>02 · Content</span>
        <div className="display-md" style={{
        color: 'var(--white)'
      }}>Below Section</div>
      </div>
    </div>
}`,...(p=(m=t.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const j=["Default","BetweenSections"];export{t as BetweenSections,r as Default,j as __namedExportsOrder,w as default};
