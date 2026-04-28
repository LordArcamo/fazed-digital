import{r as t,j as l}from"./iframe-DPjQQZx3.js";import{g as r}from"./index-SFc2wnMY.js";import"./preload-helper-4_59RN96.js";const re={primary:{background:"var(--accent)",color:"var(--black)",border:"1px solid var(--accent)"},outline:{background:"transparent",color:"var(--white)",border:"1px solid var(--gray-600)"},ghost:{background:"transparent",color:"var(--white)",border:"1px solid var(--white)"}},te={sm:{padding:"0.55rem 1.3rem",fontSize:"0.78rem",gap:"0.4rem"},md:{padding:"0.8rem 1.9rem",fontSize:"0.875rem",gap:"0.5rem"},lg:{padding:"1.05rem 2.6rem",fontSize:"0.95rem",gap:"0.5rem"}};function X({children:h,href:y,onClick:Y,variant:a="primary",size:H="md",type:J="button"}){const e=t.useRef(null),n=t.useRef(null),o=t.useRef(null),s=t.useRef(null),i=t.useRef(null),c=t.useRef(null);t.useEffect(()=>{!e.current||!n.current||(o.current=r.quickTo(e.current,"x",{duration:.38,ease:"power2.out"}),s.current=r.quickTo(e.current,"y",{duration:.38,ease:"power2.out"}),i.current=r.quickTo(n.current,"x",{duration:.38,ease:"power2.out"}),c.current=r.quickTo(n.current,"y",{duration:.38,ease:"power2.out"}))},[]);const K=k=>{var z,T,R,M;const u=e.current.getBoundingClientRect(),w=(k.clientX-u.left-u.width/2)*.38,S=(k.clientY-u.top-u.height/2)*.38;(z=o.current)==null||z.call(o,w),(T=s.current)==null||T.call(s,S),(R=i.current)==null||R.call(i,w*.18),(M=c.current)==null||M.call(c,S*.18)},Q=()=>{r.to(e.current,{x:0,y:0,duration:.65,ease:"elastic.out(1, 0.4)"}),r.to(n.current,{x:0,y:0,duration:.55,ease:"elastic.out(1, 0.4)"}),a==="outline"&&r.to(e.current,{borderColor:"var(--gray-600)",duration:.25})},Z=()=>{r.to(e.current,{scale:1.04,duration:.28,ease:"power2.out"}),a==="outline"&&r.to(e.current,{borderColor:"var(--white)",duration:.25}),a==="primary"&&r.to(e.current,{background:"var(--accent-dark)",borderColor:"var(--accent-dark)",duration:.25})},$=()=>r.to(e.current,{scale:.965,duration:.1}),ee=()=>r.to(e.current,{scale:1.04,duration:.2,ease:"back.out(2)"}),b={display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"100px",fontFamily:"var(--font-body)",fontWeight:600,letterSpacing:"0.01em",textDecoration:"none",transition:"background 0.2s",willChange:"transform",...re[a],...te[H]},x={onMouseMove:K,onMouseLeave:Q,onMouseEnter:Z,onMouseDown:$,onMouseUp:ee};return y?l.jsx("a",{ref:e,href:y,style:b,...x,"data-cursor":"button",children:l.jsx("span",{ref:n,style:{pointerEvents:"none",display:"flex",alignItems:"center",gap:"inherit"},children:h})}):l.jsx("button",{ref:e,type:J,onClick:Y,style:b,...x,"data-cursor":"button",children:l.jsx("span",{ref:n,style:{pointerEvents:"none",display:"flex",alignItems:"center",gap:"inherit"},children:h})})}X.__docgenInfo={description:"",methods:[],displayName:"MagneticButton",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},href:{required:!1,tsType:{name:"string"},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},variant:{required:!1,tsType:{name:"union",raw:"'primary' | 'outline' | 'ghost'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'outline'"},{name:"literal",value:"'ghost'"}]},description:"",defaultValue:{value:"'primary'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},type:{required:!1,tsType:{name:"union",raw:"'button' | 'submit'",elements:[{name:"literal",value:"'button'"},{name:"literal",value:"'submit'"}]},description:"",defaultValue:{value:"'button'",computed:!1}}}};const ie={title:"UI/MagneticButton",component:X,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","outline","ghost"],description:"Visual style variant"},size:{control:"select",options:["sm","md","lg"],description:"Button size"},children:{control:"text"},href:{control:"text"}}},d={args:{children:"View Our Work",variant:"primary",size:"md"}},m={args:{children:"Let's Talk",variant:"outline",size:"md"}},p={args:{children:"Learn More →",variant:"ghost",size:"md"}},g={args:{children:"Start a Project →",variant:"primary",size:"lg"}},f={args:{children:"View Details",variant:"outline",size:"sm"}},v={args:{children:"Go to Services →",variant:"ghost",size:"md",href:"/services"}};var q,j,L;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    children: 'View Our Work',
    variant: 'primary',
    size: 'md'
  }
}`,...(L=(j=d.parameters)==null?void 0:j.docs)==null?void 0:L.source}}};var C,V,E;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    children: "Let's Talk",
    variant: 'outline',
    size: 'md'
  }
}`,...(E=(V=m.parameters)==null?void 0:V.docs)==null?void 0:E.source}}};var O,D,G;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    children: 'Learn More →',
    variant: 'ghost',
    size: 'md'
  }
}`,...(G=(D=p.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};var P,W,_;g.parameters={...g.parameters,docs:{...(P=g.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    children: 'Start a Project →',
    variant: 'primary',
    size: 'lg'
  }
}`,...(_=(W=g.parameters)==null?void 0:W.docs)==null?void 0:_.source}}};var B,I,A;f.parameters={...f.parameters,docs:{...(B=f.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: 'View Details',
    variant: 'outline',
    size: 'sm'
  }
}`,...(A=(I=f.parameters)==null?void 0:I.docs)==null?void 0:A.source}}};var N,U,F;v.parameters={...v.parameters,docs:{...(N=v.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    children: 'Go to Services →',
    variant: 'ghost',
    size: 'md',
    href: '/services'
  }
}`,...(F=(U=v.parameters)==null?void 0:U.docs)==null?void 0:F.source}}};const ce=["Primary","Outline","Ghost","Large","Small","AsLink"];export{v as AsLink,p as Ghost,g as Large,m as Outline,d as Primary,f as Small,ce as __namedExportsOrder,ie as default};
