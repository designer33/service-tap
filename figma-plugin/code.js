// Service Knock Homepage Builder Plugin
(async () => {
  await figma.loadFontAsync({family:"Inter",style:"Regular"});
  await figma.loadFontAsync({family:"Inter",style:"Medium"});
  await figma.loadFontAsync({family:"Inter",style:"Semi Bold"});
  await figma.loadFontAsync({family:"Inter",style:"Bold"});
  await figma.loadFontAsync({family:"Inter",style:"Extra Bold"});

  const page = figma.currentPage;
  page.name = "Homepage";
  for(const n of [...page.children]) n.remove();

  const W={r:1,g:1,b:1},BG={r:0.965,g:0.969,b:0.976},BLUE={r:0.067,g:0.424,b:0.906},
        BLT={r:0.878,g:0.918,b:0.992},BLD={r:0.031,g:0.220,b:0.620},
        DARK={r:0.067,g:0.090,b:0.133},MED={r:0.373,g:0.404,b:0.451},
        BDR={r:0.878,g:0.894,b:0.914},STAR={r:1,g:0.737,b:0.020},
        GRN={r:0.090,g:0.678,b:0.376};

  const S=(c,o=1)=>[{type:'SOLID',color:c,opacity:o}];
  const F=(nm,x,y,w,h,fills,cr=0,stk=null,sw=1)=>{
    const f=figma.createFrame();f.name=nm;f.x=x;f.y=y;f.resize(w,h);
    f.fills=fills||[];if(cr)f.cornerRadius=cr;
    if(stk){f.strokes=stk;f.strokeWeight=sw;}return f;
  };
  const R=(x,y,w,h,fills,cr=0)=>{
    const r=figma.createRectangle();r.x=x;r.y=y;r.resize(w,h);
    r.fills=fills||[];if(cr)r.cornerRadius=cr;return r;
  };
  const E=(x,y,w,h,fills)=>{
    const e=figma.createEllipse();e.x=x;e.y=y;e.resize(w,h);e.fills=fills;return e;
  };
  const T=async(p,str,x,y,sz,style,color,opts={})=>{
    const t=figma.createText();
    t.fontName={family:"Inter",style:style};t.fontSize=sz;
    if(opts.w){t.textAutoResize="HEIGHT";t.resize(opts.w,sz*3);}
    if(opts.lh)t.lineHeight={unit:"PIXELS",value:opts.lh};
    if(opts.ls)t.letterSpacing={unit:"PIXELS",value:opts.ls};
    if(opts.al)t.textAlignHorizontal=opts.al;
    t.characters=str;t.fills=S(color);t.x=x;t.y=y;
    if(p)p.appendChild(t);return t;
  };
  const IMG=(p,x,y,w,h,c,nm,cr=8)=>{
    const f=F(nm,x,y,w,h,S(c),cr);p.appendChild(f);
    f.appendChild(R(0,0,w,h,[{type:'GRADIENT_LINEAR',gradientStops:[{color:{r:0,g:0,b:0,a:0},position:0.4},{color:{r:0,g:0,b:0,a:0.28},position:1}],gradientTransform:[[0,1,0],[-1,0,1]]}]));
    return f;
  };

  // ROOT
  const root=F("Service Knock — Homepage",0,0,1440,4320,S(W));
  root.clipsContent=false;
  page.appendChild(root);

  // ── 1. NAVBAR
  const nav=F("Navbar",0,0,1440,72,S(W),0,S(BDR),1);root.appendChild(nav);
  const logo=F("Logo",40,14,168,44,S(BLUE),6);nav.appendChild(logo);
  await T(logo,"Service Knock",14,12,15,"Bold",W);
  for(let i=0;i<["Services","How It Works","Reviews","About Us"].length;i++)
    await T(nav,["Services","How It Works","Reviews","About Us"][i],290+i*130,26,14,"Medium",DARK);
  const locF=F("Location",908,16,118,40,S(BG),6,S(BDR),1);nav.appendChild(locF);
  await T(locF,"Location",16,11,13,"Regular",MED);
  const lgF=F("Login",1040,16,80,40,[],6,S(BDR),1);nav.appendChild(lgF);
  await T(lgF,"Login",16,11,14,"Medium",DARK);
  const sgF=F("Sign Up",1132,16,112,40,S(BLUE),6);nav.appendChild(sgF);
  await T(sgF,"Sign Up",22,11,14,"Semi Bold",W);

  // ── 2. HERO
  const hero=F("Hero",0,72,1440,480,[]);root.appendChild(hero);
  hero.appendChild(R(0,0,860,480,S(W)));
  hero.appendChild(R(820,0,620,480,S(BLUE)));
  await T(hero,"Expert Home Services",56,80,46,"Extra Bold",DARK,{w:640,lh:56});
  await T(hero,"at Your Doorstep.",56,144,46,"Extra Bold",BLUE,{w:640,lh:56});
  await T(hero,"Professional, reliable and affordable services.\nBook a verified expert in minutes.",56,218,16,"Regular",MED,{w:560,lh:25});
  const sb=F("SearchBar",56,294,620,52,S(W),10,S(BDR),1.5);hero.appendChild(sb);
  await T(sb,"Search for services...",16,16,14,"Regular",{r:0.7,g:0.75,b:0.8});
  const sbBtn=F("BookBtn",496,6,110,40,S(BLUE),8);sb.appendChild(sbBtn);
  await T(sbBtn,"Book Now",16,11,13,"Semi Bold",W);
  const stBar=F("Stats",56,374,620,58,S(BLD),10);hero.appendChild(stBar);
  const stD=[{n:"10k+",l:"Customers"},{n:"4.8/5",l:"Rating"},{n:"25k+",l:"Jobs Completed"}];
  for(let i=0;i<3;i++){
    await T(stBar,stD[i].n,28+i*200,8,20,"Bold",W);
    await T(stBar,stD[i].l,28+i*200,32,11,"Regular",BLT);
    if(i<2)stBar.appendChild(R(196+i*200,8,1,40,S(W,0.2)));
  }
  const heroImg=IMG(hero,850,0,590,480,{r:0.22,g:0.44,b:0.82},"Hero Worker",0);
  heroImg.appendChild(E(120,30,280,280,S(W,0.07)));
  heroImg.appendChild(E(200,80,200,200,S(W,0.06)));
  await T(heroImg,"Professional\nService Worker",60,160,22,"Bold",W,{w:280,al:"CENTER",lh:30});

  // ── 3. VALUE PROPS
  const vp=F("Value Props",0,552,1440,220,S(W));root.appendChild(vp);
  await T(vp,"Value Proposition Section",0,28,22,"Bold",DARK,{w:1440,al:"CENTER"});
  const vpD=[
    {ic:"✓",t:"Verified Professionals",d:"We use uncompromising verified professionals\nwith professional backgrounds"},
    {ic:"$",t:"Transparent Pricing",d:"Premium top-quality professionals with\ntransparent outcomes and transparent pricing"},
    {ic:"★",t:"Satisfaction Guaranteed",d:"We are absolutely uncompromising expectations\nwith satisfaction guaranteed"},
  ];
  for(let i=0;i<3;i++){
    const vx=200+i*380;
    const ic=F("Icon",vx+90,70,60,60,S(BLT),30);vp.appendChild(ic);
    await T(ic,vpD[i].ic,18,14,22,"Bold",BLUE);
    await T(vp,vpD[i].t,vx+20,142,15,"Semi Bold",DARK,{w:240,al:"CENTER"});
    await T(vp,vpD[i].d,vx+10,166,12,"Regular",MED,{w:260,al:"CENTER",lh:18});
  }

  // ── 4. OUR SERVICES
  const sv=F("Our Services",0,772,1440,640,S(BG));root.appendChild(sv);
  await T(sv,"Our Services",0,36,26,"Bold",DARK,{w:1440,al:"CENTER"});
  const svD=[
    {n:"Electrician",d:"Electrical work",c:{r:0.96,g:0.92,b:0.72}},
    {n:"Plumber",d:"Plumber services",c:{r:0.72,g:0.88,b:0.96}},
    {n:"AC Repair",d:"AC Repair / Fridge",c:{r:0.72,g:0.94,b:0.88}},
    {n:"Cleaning",d:"Cleaning services",c:{r:0.92,g:0.78,b:0.96}},
    {n:"Painting",d:"Painting services",c:{r:0.96,g:0.88,b:0.72}},
    {n:"Carpentry",d:"Carpentry effects",c:{r:0.84,g:0.94,b:0.72}},
    {n:"Pest Control",d:"Pest control",c:{r:0.96,g:0.76,b:0.76}},
    {n:"Appliance Repair",d:"Appliance repair",c:{r:0.72,g:0.84,b:0.96}},
  ];
  for(let i=0;i<8;i++){
    const col=i%4,row=Math.floor(i/4),cx=56+col*336,cy=96+row*262;
    const card=F(svD[i].n,cx,cy,308,238,S(W),12,S(BDR),1);sv.appendChild(card);
    IMG(card,0,0,308,126,svD[i].c,svD[i].n+" img",0);
    card.appendChild(R(0,114,308,12,S(W)));
    await T(card,svD[i].n,14,136,14,"Semi Bold",DARK);
    await T(card,svD[i].d,14,156,12,"Regular",MED);
    await T(card,"Starting from $XX",14,172,11,"Regular",MED);
    const bk=F("Book",14,196,280,30,S(BLUE),6);card.appendChild(bk);
    await T(bk,"Book Now",106,8,12,"Semi Bold",W);
  }

  // ── 5. HOW IT WORKS
  const hw=F("How It Works",0,1412,1440,400,S(W));root.appendChild(hw);
  await T(hw,"How It Works",0,36,26,"Bold",DARK,{w:1440,al:"CENTER"});
  const hwD=[
    {t:"Search",d:"Search high-quality services\nand contractors"},
    {t:"Book",d:"Build and choose in your\nbook and then book"},
    {t:"Service",d:"See quantity, high quality\nmore area services"},
    {t:"Pay",d:"Pay and access the easy\nand in photographs"},
  ];
  for(let i=0;i<4;i++){
    const hx=56+i*336;
    IMG(hw,hx,88,308,210,{r:0.78+i*0.04,g:0.85,b:0.88+i*0.02},"Step "+(i+1),10);
    const nb=F("Num"+(i+1),hx+136,82,36,36,S(BLUE),18);hw.appendChild(nb);
    await T(nb,""+(i+1),13,8,14,"Bold",W);
    await T(hw,hwD[i].t,hx,312,15,"Semi Bold",DARK,{w:308,al:"CENTER"});
    await T(hw,hwD[i].d,hx,332,12,"Regular",MED,{w:308,al:"CENTER",lh:18});
  }

  // ── 6. WHY CHOOSE
  const wch=F("Why Choose",0,1812,1440,340,S(BG));root.appendChild(wch);
  const imgC=[{r:0.72,g:0.82,b:0.96},{r:0.96,g:0.84,b:0.72},{r:0.72,g:0.96,b:0.84}];
  for(let i=0;i<3;i++) IMG(wch,40+i*180,40,162,260,imgC[i],"Worker "+(i+1),10);
  await T(wch,"Why Choose Service Knock",580,40,24,"Bold",DARK,{w:700});
  const rD=[
    {h:"24/7 Support",d:"Professional seamless or 24/7 support available"},
    {h:"Background-Checked Pros",d:"Seamless professional and customizable professionals"},
    {h:"Easy Rescheduling",d:"Associate professional our real work and rearrangeable needs"},
  ];
  for(let i=0;i<3;i++){
    const ry=100+i*72;
    const dot=F("Dot",576,ry+6,14,14,S(BLUE),7);wch.appendChild(dot);
    await T(wch,rD[i].h,604,ry,15,"Semi Bold",DARK);
    await T(wch,rD[i].d,604,ry+22,13,"Regular",MED,{w:520,lh:18});
  }

  // ── 7. APP BANNER
  const ab=F("App Banner",0,2152,1440,200,S(BLUE));root.appendChild(ab);
  ab.appendChild(E(-60,-60,320,320,S(W,0.05)));
  ab.appendChild(E(1180,-40,280,280,S(W,0.05)));
  await T(ab,"Get your own mobile app",56,28,28,"Bold",W);
  await T(ab,"Book & discover our app",56,70,15,"Regular",BLT);
  const iosA=F("AppStore",56,114,156,44,S(W),8);ab.appendChild(iosA);
  await T(iosA,"App Store",28,13,14,"Semi Bold",BLUE);
  const gpA=F("GooglePlay",224,114,156,44,[],8,S(W,0.6),1.5);ab.appendChild(gpA);
  await T(gpA,"Google Play",22,13,14,"Semi Bold",W);
  const pm=F("PhoneMock",820,6,140,188,S(BLD),18,S(W,0.3),1);ab.appendChild(pm);
  pm.appendChild(R(8,8,124,172,S({r:0.04,g:0.18,b:0.44}),12));
  await T(pm,"Service Knock",14,24,11,"Bold",W);
  const qr=F("QR",990,30,120,120,S(W),8);ab.appendChild(qr);
  for(let i=0;i<4;i++) for(let j=0;j<4;j++) qr.appendChild(R(8+i*26,8+j*26,20,20,S(i===j||(i===0&&j===3)||(i===3&&j===0)?BLUE:BLT),2));
  await T(ab,"Scan to download",985,162,11,"Regular",BLT,{w:130});

  // ── 8. RECENTLY COMPLETED
  const rc=F("Recently Completed",0,2352,1440,340,S(W));root.appendChild(rc);
  await T(rc,"Recently Completed",0,28,24,"Bold",DARK,{w:1440,al:"CENTER"});
  await T(rc,"Real job photos by customer rating and location",0,60,14,"Regular",MED,{w:1440,al:"CENTER"});
  const rcC=[{r:0.72,g:0.82,b:0.96},{r:0.80,g:0.96,b:0.80},{r:0.96,g:0.92,b:0.72},{r:0.92,g:0.76,b:0.96},{r:0.72,g:0.92,b:0.96},{r:0.96,g:0.82,b:0.72}];
  const rcL=["Painting","Plumbing","AC Repair","Cleaning","Electrician","Carpentry"];
  for(let i=0;i<6;i++){
    const rx=56+i*228;
    IMG(rc,rx,94,210,180,rcC[i],rcL[i],10);
    await T(rc,"★★★★★",rx+4,284,12,"Regular",STAR);
    await T(rc,"Location",rx+4,300,11,"Regular",MED);
    await T(rc,rcL[i],rx+4,316,12,"Semi Bold",DARK);
  }

  // ── 9. WORKER GRID
  const wg=F("Worker Grid",0,2692,1440,300,S(BG));root.appendChild(wg);
  await T(wg,"Recently Completed",0,24,24,"Bold",DARK,{w:1440,al:"CENTER"});
  const wgC=[{r:0.76,g:0.84,b:0.96},{r:0.96,g:0.88,b:0.76},{r:0.76,g:0.96,b:0.86},{r:0.94,g:0.76,b:0.76},{r:0.76,g:0.88,b:0.96},{r:0.88,g:0.96,b:0.76},{r:0.96,g:0.82,b:0.94}];
  const wgL=["Electrician","Plumbing","Plastering","Cleaning","Painting","Carpentry","Tiling"];
  for(let i=0;i<7;i++){
    const wx=14+i*204;
    IMG(wg,wx,60,194,172,wgC[i],wgL[i],10);
    await T(wg,"★★★★★",wx+4,244,11,"Regular",STAR);
    await T(wg,"Location",wx+4,260,10,"Regular",MED);
    await T(wg,wgL[i],wx+4,276,11,"Semi Bold",DARK);
  }

  // ── 10. DOWNLOAD BANNER
  const db=F("Download Banner",0,2992,1440,180,S(BLUE));root.appendChild(db);
  db.appendChild(E(1100,-20,240,240,S(W,0.05)));
  await T(db,"Download the Service Knock for your mobile.",56,30,26,"Bold",W,{w:520,lh:34});
  await T(db,"Get the app maybe the favorite the app",56,90,15,"Regular",BLT);
  const qr2=F("QR2",660,20,120,120,S(W),8);db.appendChild(qr2);
  for(let i=0;i<4;i++) for(let j=0;j<4;j++) qr2.appendChild(R(8+i*26,8+j*26,20,20,S(i===j||(i===0&&j===3)||(i===3&&j===0)?BLUE:BLT),2));
  const iosB=F("AppStoreB",808,30,160,46,S(W),8);db.appendChild(iosB);
  await T(iosB,"App Store",34,14,14,"Semi Bold",BLUE);
  const gpB=F("GPB",808,88,160,46,[],8,S(W,0.6),1.5);db.appendChild(gpB);
  await T(gpB,"Google Play",30,14,14,"Semi Bold",W);

  // ── 11. TESTIMONIALS
  const te=F("Testimonials",0,3172,1440,380,S(W));root.appendChild(te);
  await T(te,"Testimonials",0,30,26,"Bold",DARK,{w:1440,al:"CENTER"});
  const teD=[
    {n:"Daphne D.",c:"Faisalabad",t:"I hired the assistance and basement area before and also premises passed on all the tasks mainly terminated and successfully."},
    {n:"Ashton",c:"Faisalabad",t:"Verified professional to clearly and big-story premises. Background-checked referees for users to their quality and skills."},
    {n:"Susan S.",c:"Faisalabad",t:"I received confirmation linked to my control. We access portions that vary that we access portions that really vary."},
  ];
  for(let i=0;i<3;i++){
    const tx=56+i*452;
    const tc=F(teD[i].n,tx,80,420,264,S(W),12,S(BDR),1);te.appendChild(tc);
    await T(tc,"★★★★★",16,18,18,"Regular",STAR);
    const vb=F("Verified",298,14,110,28,S({r:0.84,g:0.95,b:0.88}),14);tc.appendChild(vb);
    await T(vb,"✓ Verified Review",8,6,10,"Semi Bold",GRN);
    const rv=figma.createText();rv.fontName={family:"Inter",style:"Regular"};rv.fontSize=13;rv.fills=S(MED);rv.lineHeight={unit:"PIXELS",value:20};rv.textAutoResize="HEIGHT";rv.resize(388,70);rv.characters=teD[i].t;rv.x=16;rv.y=56;tc.appendChild(rv);
    tc.appendChild(E(16,172,44,44,S(BLT)));
    await T(tc,teD[i].n.charAt(0),30,184,16,"Bold",BLUE);
    await T(tc,teD[i].n,72,176,14,"Semi Bold",DARK);
    await T(tc,teD[i].c,72,196,12,"Regular",MED);
  }

  // ── 12. FAQ
  const fq=F("FAQ",0,3552,1440,380,S(BG));root.appendChild(fq);
  await T(fq,"FAQ Section",0,34,24,"Bold",DARK,{w:1440,al:"CENTER"});
  const faqs=["What are the common service services?","How do common tops are common?","What are the common questions?","Common custom common question?","How are appliance common questions?","Common common in a sections?"];
  for(let i=0;i<6;i++){
    const fRow=F("FAQ"+i,120,88+i*46,1200,40,S(W),6,S(BDR),1);fq.appendChild(fRow);
    await T(fRow,faqs[i],20,11,14,"Medium",DARK);
    await T(fRow,"v",1168,10,18,"Regular",MED);
  }

  // ── 13. FOOTER
  const ft=F("Footer",0,3932,1440,340,S(DARK));root.appendChild(ft);
  ft.appendChild(R(0,0,1440,1,S(BDR,0.15)));
  const ftC=[
    {h:"Top Services",it:["Top Services","Plumber","Electrician","Carpenter","Painters","Pest Control"]},
    {h:"Company",it:["About","How it Works","Reviews","Blog","Resources"]},
    {h:"Support",it:["Contact Us","FAQs","Trust & Safety","Terms","Cancellation"]},
    {h:"Legal",it:["Help","Privacy","Terms","License","Accessibility"]},
  ];
  for(let i=0;i<4;i++){
    const fx=56+i*260;
    await T(ft,ftC[i].h,fx,36,14,"Semi Bold",W);
    for(let j=0;j<ftC[i].it.length;j++)
      await T(ft,ftC[i].it[j],fx,66+j*28,13,"Regular",{r:0.60,g:0.65,b:0.72});
  }
  const nl=F("Newsletter",1100,36,300,180,[]);ft.appendChild(nl);
  await T(nl,"Newsletter Signup",0,0,14,"Semi Bold",W);
  await T(nl,"Sign up to stay updated",0,24,12,"Regular",{r:0.60,g:0.65,b:0.72});
  const nli=F("EmailInput",0,64,300,40,[],6,S({r:0.35,g:0.40,b:0.48}),1);nl.appendChild(nli);
  await T(nli,"Email address",10,11,12,"Regular",{r:0.5,g:0.55,b:0.62});
  const nlb=F("SubscribeBtn",0,116,300,38,S(BLUE),6);nl.appendChild(nlb);
  await T(nlb,"Subscribe",108,10,13,"Semi Bold",W);
  ft.appendChild(R(0,318,1440,1,S(BDR,0.15)));
  await T(ft,"Copyright Service Knock. All rights reserved",0,326,12,"Regular",{r:0.45,g:0.50,b:0.58},{w:1440,al:"CENTER"});

  root.resize(1440,4272);
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify("Service Knock homepage built successfully!", {timeout:5000});
  figma.closePlugin();
})();
