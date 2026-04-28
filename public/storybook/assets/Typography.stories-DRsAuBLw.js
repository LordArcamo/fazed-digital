import{j as e}from"./iframe-DPjQQZx3.js";import"./preload-helper-4_59RN96.js";function t({className:a,label:r,text:m,meta:l,element:B="div"}){return e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"160px 1fr",gap:"1.5rem",alignItems:"start",padding:"1.75rem 0",borderBottom:"1px solid var(--border)"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.62rem",color:"var(--accent)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.25rem"},children:r}),e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.55rem",color:"var(--gray-600)",letterSpacing:"0.06em"},children:l})]}),e.jsx(B,{className:a,style:{color:"var(--white)",margin:0},children:m})]})}function c({family:a,label:r,weights:m}){return e.jsxs("div",{style:{marginBottom:"2.5rem"},children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"1rem"},children:r}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:m.map(l=>e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:"1rem"},children:[e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.55rem",color:"var(--gray-600)",minWidth:40},children:l}),e.jsx("span",{style:{fontFamily:a,fontWeight:l,fontSize:"1.5rem",color:"var(--white)"},children:"Fazed Digital — AaBbCcDdEe 0123"})]},l))})]})}function D(){return e.jsxs("div",{style:{padding:"2rem",maxWidth:960,fontFamily:"var(--font-body)"},children:[e.jsx("h1",{style:{fontFamily:"var(--font-display)",fontSize:"2rem",fontWeight:700,marginBottom:"0.5rem",color:"var(--white)"},children:"Typography System"}),e.jsxs("p",{style:{color:"var(--gray-500)",fontSize:"0.875rem",marginBottom:"3rem"},children:["All type scale classes — ",e.jsx("strong",{style:{color:"var(--white)"},children:"Clash Display"})," for headings, ",e.jsx("strong",{style:{color:"var(--white)"},children:"Plus Jakarta Sans"})," for body, ",e.jsx("strong",{style:{color:"var(--white)"},children:"Space Mono"})," for labels."]}),e.jsxs("div",{style:{marginBottom:"4rem"},children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"1.5rem",paddingBottom:"0.75rem",borderBottom:"1px solid var(--border)"},children:"Display Scale"}),e.jsx(t,{className:"display-xl",label:"display-xl",text:"Bold Digital",meta:"Clash Display · 700 · clamp(4.5rem→13rem) · lh 0.88",element:"h1"}),e.jsx(t,{className:"display-lg",label:"display-lg",text:"We Build Things",meta:"Clash Display · 700 · clamp(3rem→8.5rem) · lh 0.91",element:"h2"}),e.jsx(t,{className:"display-md",label:"display-md",text:"Services for Ambition",meta:"Clash Display · 700 · clamp(2.25rem→5rem) · lh 0.95",element:"h2"}),e.jsx(t,{className:"display-sm",label:"display-sm",text:"Creative Direction",meta:"Clash Display · 600 · clamp(1.75rem→3rem) · lh 1.05",element:"h3"}),e.jsx(t,{className:"heading",label:".heading",text:"Section Heading",meta:"Clash Display · 600 · clamp(1.25rem→1.75rem) · lh 1.15",element:"h4"})]}),e.jsxs("div",{style:{marginBottom:"4rem"},children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"1.5rem",paddingBottom:"0.75rem",borderBottom:"1px solid var(--border)"},children:"Body & Utility"}),e.jsx(t,{className:"label",label:".label",text:"SECTION 01 · OVERVIEW",meta:"Space Mono · 400 · 0.72rem · ls 0.18em · uppercase"}),e.jsx(t,{className:"body-lg",label:".body-lg",text:"A Brisbane-based creative agency combining design excellence, digital strategy, and technical expertise to build brands that matter.",meta:"Plus Jakarta Sans · clamp(1rem→1.2rem) · lh 1.75"}),e.jsx(t,{className:"body",label:".body",text:"Our team brings together seasoned designers, developers, and strategists to create cohesive digital experiences.",meta:"Plus Jakarta Sans · 0.975rem · lh 1.7"}),e.jsx(t,{className:"small",label:".small",text:"All rights reserved. Iligan City, Philippines · Mon–Fri 8:30am–5:00pm",meta:"Plus Jakarta Sans · 0.825rem · lh 1.6"})]}),e.jsxs("div",{style:{marginBottom:"3rem"},children:[e.jsx(c,{family:"var(--font-display)",label:"--font-display: Clash Display",weights:[300,400,500,600,700]}),e.jsx(c,{family:"var(--font-body)",label:"--font-body: Plus Jakarta Sans",weights:[400,500,600,700]}),e.jsx(c,{family:"var(--font-mono)",label:"--font-mono: Space Mono",weights:[400,700]})]})]})}const T={title:"Design System/Typography",parameters:{layout:"fullscreen",backgrounds:{default:"dark"},docs:{description:{component:"All type scale classes and font families used across Fazed Digital."}}}},s={name:"Type Scale",render:()=>e.jsx(D,{})},n={name:"Display Scale Only",render:()=>e.jsx("div",{style:{padding:"2rem 3rem",fontFamily:"var(--font-body)"},children:[{cls:"display-xl",text:"Bold"},{cls:"display-lg",text:"We Build"},{cls:"display-md",text:"Experiences"},{cls:"display-sm",text:"That Matter"},{cls:"heading",text:"Section Heading"}].map(({cls:a,text:r})=>e.jsx("div",{className:a,style:{color:"var(--white)",marginBottom:"1rem"},children:r},a))})},i={name:"Mono Labels",render:()=>e.jsx("div",{style:{padding:"2rem",display:"flex",flexDirection:"column",gap:"1.5rem"},children:[{text:"01 · Overview",color:"var(--gray-500)"},{text:"Section 02 · Services",color:"var(--accent)"},{text:"Made in Iligan City · PH",color:"var(--gray-600)"},{text:"Loading 100%",color:"var(--white)"}].map(({text:a,color:r})=>e.jsx("span",{className:"label",style:{color:r},children:a},a))})},o={name:"Accent Highlights",render:()=>e.jsx("div",{style:{padding:"2rem 3rem",maxWidth:700},children:e.jsxs("p",{className:"body-lg",style:{color:"var(--white)"},children:["We build"," ",e.jsx("span",{style:{color:"var(--accent)",fontWeight:700},children:"bold digital experiences"})," ","that connect brands with their audience in ways that are memorable, meaningful, and measurable."]})})};var d,p,y;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'Type Scale',
  render: () => <AllTypography />
}`,...(y=(p=s.parameters)==null?void 0:p.docs)==null?void 0:y.source}}};var g,x,h;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'Display Scale Only',
  render: () => <div style={{
    padding: '2rem 3rem',
    fontFamily: 'var(--font-body)'
  }}>
      {[{
      cls: 'display-xl',
      text: 'Bold'
    }, {
      cls: 'display-lg',
      text: 'We Build'
    }, {
      cls: 'display-md',
      text: 'Experiences'
    }, {
      cls: 'display-sm',
      text: 'That Matter'
    }, {
      cls: 'heading',
      text: 'Section Heading'
    }].map(({
      cls,
      text
    }) => <div key={cls} className={cls} style={{
      color: 'var(--white)',
      marginBottom: '1rem'
    }}>
          {text}
        </div>)}
    </div>
}`,...(h=(x=n.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var v,f,b;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'Mono Labels',
  render: () => <div style={{
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  }}>
      {[{
      text: '01 · Overview',
      color: 'var(--gray-500)'
    }, {
      text: 'Section 02 · Services',
      color: 'var(--accent)'
    }, {
      text: 'Made in Iligan City · PH',
      color: 'var(--gray-600)'
    }, {
      text: 'Loading 100%',
      color: 'var(--white)'
    }].map(({
      text,
      color
    }) => <span key={text} className="label" style={{
      color
    }}>{text}</span>)}
    </div>
}`,...(b=(f=i.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var u,j,S;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'Accent Highlights',
  render: () => <div style={{
    padding: '2rem 3rem',
    maxWidth: 700
  }}>
      <p className="body-lg" style={{
      color: 'var(--white)'
    }}>
        We build{' '}
        <span style={{
        color: 'var(--accent)',
        fontWeight: 700
      }}>bold digital experiences</span>{' '}
        that connect brands with their audience in ways that are memorable, meaningful, and measurable.
      </p>
    </div>
}`,...(S=(j=o.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};const N=["All","DisplayFonts","MonoLabels","AccentText"];export{o as AccentText,s as All,n as DisplayFonts,i as MonoLabels,N as __namedExportsOrder,T as default};
