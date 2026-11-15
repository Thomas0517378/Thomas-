(() => {
  'use strict';
  const D = window.FUYI_DATA;
  const $ = id => document.getElementById(id);
  const setHTML = (id, html) => { $(id).innerHTML = html; };
  const fmt = (v, digits = 1) => `${v < 0 ? '−' : ''}${Math.abs(v).toFixed(digits)}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sum = a => a.reduce((a, b) => a + b, 0);
  const metric = (label, value, unit, detail, formula) => `<article><span>${label}</span><strong>${value}<small>${unit}</small></strong><em>${detail}</em><p class="metric-formula">${formula}</p></article>`;
  setHTML('overview-metrics', [
    metric('第5年营业收入', fmt(D.revenue[4]), '万', '四类收入共同构成', '85 + 60 + 18 + 5 = 168'),
    metric('第5年净利润', fmt(D.netProfit[4]), '万', `净利率 ${fmt(D.netMargin[4])}%`, '51.5 − 2.6 = 48.9'),
    metric('第5年期末现金', fmt(D.cashEnd[4]), '万', '含融资与营运资金占用', '17.1 + 44.1 − 2.0 = 59.2'),
    metric('计划资金总额', fmt(sum(D.financingInflow), 0), '万', '首期与第2年分两次到位', '20 + 8 = 28')
  ].join(''));
  setHTML('finance-metrics', [
    metric('五年累计净利润', fmt(sum(D.netProfit)), '万', '第5年末累计', '−7.4 − 8.4 + 2.5 + 21.6 + 48.9'),
    metric('第5年保本收入', '≈ 79.8', '万', '文档毛利率近似口径', '期间费用 ÷ 毛利率 = 46.5 ÷ 58.3%'),
    metric('第5年毛利率', '58.3', '%', '毛利润 98.0 万元', '98.0 ÷ 168.0 × 100% ≈ 58.3%'),
    metric('五年投资现金流出', fmt(sum(D.investmentOutflow)), '万', '含首年开办支出 8.5 万元', '8.5 + 0.5 + 0.5 + 1.5 + 2.0')
  ].join(''));
  setHTML('cash-metrics', [
    metric('第3年期末现金低点', fmt(D.cashEnd[2]), '万', '前三年需重点跟踪现金', '1.0 − 0.1 − 0.5 = 0.4'),
    metric('第4年经营净现金流', fmt(D.operatingCash[3]), '万', '经营现金首次转正', '21.6 − 3.4 = 18.2'),
    metric('第5年期末现金', fmt(D.cashEnd[4]), '万', '按文档表3列示', '17.1 + 44.1 − 2.0 = 59.2'),
    metric('静态投资回收期', '≈ 4.9', '年', '第5年内回收', '累计项目净现金流覆盖投入的时点；文档结论')
  ].join(''));

  function row(label, values, formula = '', total = false, percent = false) {
    return `<tr${total ? ' class="total"' : ''}><th scope="row">${label}${formula ? `<small class="row-formula">${formula}</small>` : ''}</th>${values.map(v => `<td${v < 0 ? ' class="negative"' : ''}>${fmt(v)}${percent ? '%' : ''}</td>`).join('')}</tr>`;
  }
  setHTML('profit-table', [
    row('营业收入', D.revenue, '产品 + 订阅 + B端 + 其他', true),
    row('减：营业成本', D.cost, '营业收入 × 成本率'),
    row('毛利润', D.grossProfit, '营业收入 − 营业成本', true),
    row('减：期间费用', D.expenses, '人力 + 营销 + 研发 + 管理'),
    row('营业利润', D.operatingProfit, '毛利润 − 期间费用', true),
    row('减：所得税', D.tax, 'max(营业利润 − 可弥补亏损, 0) × 5%'),
    row('净利润', D.netProfit, '营业利润 − 所得税', true),
    row('净利率', D.netMargin, '净利润 ÷ 营业收入 × 100%', false, true)
  ].join(''));
  setHTML('revenue-table', D.revenueMix.map(s => row(s.label, s.values)).join('') + row('收入合计', [D.revenue[0], D.revenue[4]], '四类收入之和', true));
  setHTML('cost-table', [
    row('营业成本', D.cost, '营业收入 × 成本率', true),
    row('成本率', D.cost.map((v, i) => v / D.revenue[i] * 100), '营业成本 ÷ 营业收入 × 100%', false, true),
    row('团队人力', D.team, '人数 × 月薪 × 在岗月份 ÷ 10,000'),
    row('其他期间费用', D.expenses.map((v, i) => v - D.team[i]), '期间费用合计 − 团队人力'),
    row('期间费用合计', D.expenses, '团队人力 + 其他期间费用', true)
  ].join(''));
  setHTML('cash-table', [
    row('期初现金', D.cashStart, '上年期末现金；首年为 0'),
    row('净利润', D.netProfit, '对应利润表净利润'),
    row('减：营运资金增加', D.workingCapitalIncrease, '本年营运资金 − 上年营运资金'),
    row('经营活动净现金流', D.operatingCash, '净利润 − 营运资金增加', true),
    row('投资活动现金流出', D.investmentOutflow, '首年开办支出；后续系统迭代与设备'),
    row('筹资活动现金流入', D.financingInflow, '首期 20 万元，第2年追加 8 万元'),
    row('期末现金余额', D.cashEnd, '期初 + 经营净流 − 投资流出 + 筹资流入', true)
  ].join(''));
  const L = D.laborSensitivity;
  setHTML('labor-table', L.cost.map((v, i) => `<tr${i === 1 ? ' class="total"' : ''}><th scope="row">${fmt(v)}</th><td>${L.monthlySalary[i].toLocaleString('zh-CN')}</td><td class="${L.profit[i] < 0 ? 'negative' : ''}">${fmt(L.profit[i])}</td></tr>`).join(''));

  const colors = { green: '#4e9b72', purple: '#735b91', orange: '#d98c4a', red: '#bd5048' };
  const svgText = (x, y, value, options = '') => `<text x="${x}" y="${y}" ${options}>${esc(value)}</text>`;
  function frame(id, min, max, ticks, labels, title, description, unit = '万元', inset = false) {
    const w = Math.max(310, $(id).clientWidth || 620), h = 260, left = 49, right = 32, top = 28, bottom = 34;
    const pw = w-left-right, ph = h-top-bottom;
    const x = i => left + pw * (inset ? (i + .5) / labels.length : i / (labels.length-1));
    const y = v => top + ph * (max-v) / (max-min);
    let body = ticks.map(v => `<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="${v === 0 ? '#adbfb0' : '#e8ede8'}"${v === 0 ? ' stroke-width="1.4"' : ''}/>${svgText(left-9,y(v)+4,fmt(v,0),'text-anchor="end" class="axis-text"')}`).join('');
    body += labels.map((s,i) => svgText(x(i),h-8,s,'text-anchor="middle" class="axis-text"')).join('');
    body += svgText(left,13,unit,'class="axis-unit"');
    const wrap = content => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(description)}</desc>${body}${content}</svg>`;
    return { x, y, wrap, w, h, pw, left, right };
  }
  function lineChart(id, series, min, max, ticks, unit = '万元') {
    const describe = series.map(s => `${s.label}：${s.values.map((v,i) => `${D.years[i]} ${fmt(v)}${unit}`).join('，')}`).join('；');
    const f = frame(id,min,max,ticks,D.years,'五年'+series.map(s=>s.label).join('与')+'趋势',describe,unit);
    const content = series.map((s,k) => {
      const path = s.values.map((v,i)=>`${f.x(i)},${f.y(v)}`).join(' ');
      return `<polyline points="${path}" fill="none" stroke="${s.color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"${k ? ' stroke-dasharray="6 4"' : ''}/>` + s.values.map((v,i) => {
        const tip = `${D.years[i]} · ${s.label}：${fmt(v)} ${unit}`;
        const dy = k ? 19 : -12;
        return `<g tabindex="0" data-tip="${esc(tip)}" aria-label="${esc(tip)}"><circle cx="${f.x(i)}" cy="${f.y(v)}" r="13" fill="transparent"/><circle cx="${f.x(i)}" cy="${f.y(v)}" r="4" fill="white" stroke="${s.color}" stroke-width="2"/>${svgText(f.x(i),f.y(v)+dy,fmt(v),'text-anchor="middle" class="value-label" fill="'+s.color+'"')}</g>`;
      }).join('');
    }).join('');
    setHTML(id,f.wrap(content));
  }
  function costChart() {
    const ss = [{label:'收入',values:D.revenue,color:colors.green},{label:'营业成本',values:D.cost,color:colors.orange},{label:'期间费用',values:D.expenses,color:colors.purple}];
    const f = frame('cost-chart',0,180,[0,45,90,135,180],D.years,'五年收入、成本与费用对比',ss.map(s=>s.label+' '+s.values.join('、')).join('；'),'万元',true);
    const bw = Math.min(25,f.pw/26);
    let content = '';
    ss.forEach((s,k) => s.values.forEach((v,i) => {
      const tip = `${D.years[i]} · ${s.label}：${fmt(v)} 万元`;
      const x = f.x(i)+(k-1)*bw-bw*.39;
      content += `<rect tabindex="0" data-tip="${esc(tip)}" aria-label="${esc(tip)}" x="${x}" y="${f.y(v)}" width="${bw*.78}" height="${f.y(0)-f.y(v)}" rx="3" fill="${s.color}"/>`;
    }));
    setHTML('cost-chart',f.wrap(content));
  }
  function barChart(id, labels, values, selected = -1) {
    const min = Math.min(0,...values)<0 ? -5 : 0, max = id === 'labor-chart' ? 6 : 60;
    const ticks = id === 'labor-chart' ? [-4,-2,0,2,4,6] : [0,15,30,45,60];
    const description = labels.map((l,i)=>`${l}：净利润 ${fmt(values[i])} 万元`).join('；');
    const f = frame(id,min,max,ticks,labels,'净利润敏感性',description,'万元',true);
    const width = Math.min(68,f.pw/(labels.length*2.2));
    const content = values.map((v,i) => {
      const color = v < 0 ? colors.red : colors.green;
      const tip = `${labels[i]} · 净利润：${fmt(v)} 万元`;
      const top = Math.min(f.y(v),f.y(0)), height = Math.abs(f.y(v)-f.y(0));
      return `<g tabindex="0" data-tip="${esc(tip)}" aria-label="${esc(tip)}"><rect x="${f.x(i)-width/2}" y="${top}" width="${width}" height="${Math.max(1,height)}" rx="4" fill="${color}" opacity="${selected < 0 || i === selected ? 1 : .35}"/>${svgText(f.x(i),v>=0?f.y(v)-9:f.y(v)+18,fmt(v),'text-anchor="middle" class="value-label" fill="'+color+'"')}</g>`;
    }).join('');
    setHTML(id,f.wrap(content));
  }
  let mixIndex = 1, scenarioIndex = 2;
  function drawMix() {
    const total = D.revenue[mixIndex ? 4 : 0];
    let offset = 0;
    const r = 72, circumference = 2*Math.PI*r;
    const arcs = D.revenueMix.map(s => {
      const share = s.values[mixIndex]/total;
      const arc = `<circle cx="110" cy="110" r="${r}" fill="none" stroke="${s.color}" stroke-width="25" stroke-dasharray="${share*circumference} ${circumference}" stroke-dashoffset="${-offset*circumference}" transform="rotate(-90 110 110)"><title>${s.label}：${fmt(s.values[mixIndex])}万元，占比${fmt(share*100)}%</title></circle>`;
      offset += share; return arc;
    }).join('');
    setHTML('revenue-chart',`<svg viewBox="0 0 220 220" role="img" aria-label="${mixIndex?'第5年':'第1年'}收入构成，总额${fmt(total)}万元">${arcs}<text x="110" y="103" text-anchor="middle" class="donut-total">${fmt(total)}</text><text x="110" y="128" text-anchor="middle" class="donut-unit">万元 / ${mixIndex?'第5年':'第1年'}</text></svg><div class="mix-legend">${D.revenueMix.map(s => `<div><span class="mix-name"><i style="background:${s.color}"></i>${s.label}</span><b>${fmt(s.values[mixIndex])}<small> 万</small></b><em>${fmt(s.values[mixIndex]/total*100)}%</em></div>`).join('')}</div>`);
  }
  function drawScenario() {
    const s = D.userSensitivity, i = scenarioIndex;
    setHTML('scenario-summary',`<div><span>家庭用户</span><b>${s.households[i].toLocaleString('zh-CN')}<small> 户</small></b></div><div><span>营业收入</span><b>${fmt(s.revenue[i])}<small> 万</small></b></div><div><span>净利润</span><b>${fmt(s.profit[i])}<small> 万</small></b></div><div><span>静态回收</span><b>${s.payback[i]}</b></div>`);
    barChart('user-chart',s.achievement.map(v=>`${v}% 达成`),s.profit,i);
  }
  function redraw() {
    lineChart('overview-chart',[{label:'营业收入',values:D.revenue,color:colors.green},{label:'净利润',values:D.netProfit,color:colors.purple}],-20,180,[-20,30,80,130,180]);
    lineChart('margin-chart',[{label:'毛利率',values:D.grossProfit.map((v,i)=>v/D.revenue[i]*100),color:colors.green},{label:'净利率',values:D.netMargin,color:colors.purple}],-120,80,[-120,-70,-20,30,80],'%');
    lineChart('cash-chart',[{label:'期末现金',values:D.cashEnd,color:colors.green},{label:'经营净现金流',values:D.operatingCash,color:colors.purple}],-20,70,[-20,0,20,40,60]);
    costChart(); drawMix(); drawScenario();
    barChart('labor-chart',L.cost.map(v=>`人力 ${v}万`),L.profit);
  }
  $('mix-switch').addEventListener('click', e => {
    const button = e.target.closest('[data-mix]'); if (!button) return;
    mixIndex = Number(button.dataset.mix);
    $('mix-switch').querySelectorAll('button').forEach(b=>{const active = b === button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});drawMix();
  });
  $('scenario-switch').addEventListener('click', e => {
    const button = e.target.closest('[data-scenario]'); if (!button) return;
    scenarioIndex = Number(button.dataset.scenario);
    $('scenario-switch').querySelectorAll('button').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});drawScenario();
  });

  const tooltip = $('chart-tooltip');
  function showTip(target, event) {
    if (!target) return;
    tooltip.textContent = target.dataset.tip;tooltip.hidden = false;
    const rect = target.getBoundingClientRect();
    const x = event && event.clientX || rect.left + rect.width/2;
    const y = event && event.clientY || rect.top;
    tooltip.style.left = `${Math.max(8,Math.min(window.innerWidth-tooltip.offsetWidth-8,x+12))}px`;
    tooltip.style.top = `${Math.max(8,Math.min(window.innerHeight-tooltip.offsetHeight-8,y-tooltip.offsetHeight-12))}px`;
  }
  document.addEventListener('pointerover',e=>showTip(e.target.closest('[data-tip]'),e));
  document.addEventListener('pointermove',e=>{const t=e.target.closest('[data-tip]');if(t)showTip(t,e);});
  document.addEventListener('pointerout',e=>{if(e.target.closest('[data-tip]'))tooltip.hidden=true;});
  document.addEventListener('focusin',e=>showTip(e.target.closest('[data-tip]')));
  document.addEventListener('focusout',()=>{tooltip.hidden=true;});
  document.addEventListener('click',e=>{const t=e.target.closest('[data-tip]');if(t)showTip(t,e);else tooltip.hidden=true;});

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let page = 'overview', photoIndex = 0, photoPaused = reducedMotion.matches, photoHover = false, timer = null;
  const gallery = document.querySelector('.activity-gallery');
  const photoButton = $('photo-play');
  function syncTimer() {
    clearInterval(timer);timer=null;
    photoButton.textContent=photoPaused?'▶ 播放':'Ⅱ 暂停';
    photoButton.setAttribute('aria-label',photoPaused?'播放自动轮播':'暂停自动轮播');
    if(!photoPaused&&!photoHover&&!document.hidden&&page==='overview'&&!$('modal').open)timer=setInterval(()=>showPhoto(photoIndex+1,false),5000);
  }
  function showPhoto(index, manual = true) {
    photoIndex = (index+D.photos.length)%D.photos.length;
    const photo = D.photos[photoIndex];
    $('activity-photo').src = `assets/activities/${photo.file}`;
    $('activity-photo').alt = photo.alt;
    $('photo-number').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(D.photos.length).padStart(2,'0')}`;
    $('photo-caption').textContent=photo.caption;
    $('photo-dots').querySelectorAll('button').forEach((b,i)=>{const active=i===photoIndex;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    if(manual){photoPaused=true;$('photo-status').textContent=`第${photoIndex+1}张，共${D.photos.length}张。${photo.alt}`;}
    const next = new Image();next.src=`assets/activities/${D.photos[(photoIndex+1)%D.photos.length].file}`;
    syncTimer();
  }
  setHTML('photo-dots',D.photos.map((p,i)=>`<button class="photo-dot${i===0?' active':''}" data-photo="${i}" aria-label="显示第${i+1}张：${esc(p.alt)}" aria-pressed="${i===0}"><span></span></button>`).join(''));
  $('photo-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
  $('photo-next').addEventListener('click',()=>showPhoto(photoIndex+1));
  $('photo-dots').addEventListener('click',e=>{const b=e.target.closest('[data-photo]');if(b)showPhoto(Number(b.dataset.photo));});
  photoButton.addEventListener('click',()=>{photoPaused=!photoPaused;syncTimer();});
  gallery.addEventListener('pointerenter',()=>{photoHover=true;syncTimer();});
  gallery.addEventListener('pointerleave',()=>{photoHover=false;syncTimer();});
  gallery.addEventListener('focusin',e=>{if(e.target!==photoButton){photoPaused=true;syncTimer();}});
  $('gallery-stage').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+(e.key==='ArrowLeft'?-1:1));}});
  let touchStart=null;
  $('gallery-stage').addEventListener('touchstart',e=>{touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  $('gallery-stage').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))showPhoto(photoIndex+(dx>0?-1:1));touchStart=null;},{passive:true});
  document.addEventListener('visibilitychange',syncTimer);
  reducedMotion.addEventListener('change',e=>{if(e.matches){photoPaused=true;syncTimer();}});

  const titles = {overview:'项目介绍',finance:'财务总览',revenue:'收入结构',cost:'成本与费用',cash:'利润与现金',risk:'风险防范'};
  function selectPage(id, updateHash = true) {
    if(!Object.hasOwn(titles,id))id='overview';page=id;
    document.querySelectorAll('.section').forEach(s=>{const active=s.id===id;s.classList.toggle('active',active);s.hidden=!active;});
    document.querySelectorAll('.nav').forEach(n=>{const active=n.dataset.go===id;n.classList.toggle('active',active);if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});
    $('title').textContent=titles[id];document.title=`抚艺工坊｜${titles[id]}`;
    tooltip.hidden=true;
    if(updateHash&&location.hash!==`#${id}`)location.hash=id;
    syncTimer();requestAnimationFrame(redraw);
    window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});
  }
  document.querySelectorAll('[data-go], [data-jump]').forEach(b=>b.addEventListener('click',()=>selectPage(b.dataset.go||b.dataset.jump)));
  window.addEventListener('hashchange',()=>selectPage(location.hash.slice(1),false));
  const modal=$('modal');
  const openModal=()=>{modal.showModal();syncTimer();};
  $('method').addEventListener('click',openModal);$('source-details').addEventListener('click',openModal);
  $('close').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
  modal.addEventListener('close',syncTimer);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')tooltip.hidden=true;});
  let resizeTimer;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(redraw,120);});
  showPhoto(0,false);selectPage(location.hash.slice(1)||'overview',false);
})();
