// Minimal inline-SVG chart generators for IELTS Task 1 prompts.
// No external libraries — keeps the site fully static/offline-capable.

const CHART_COLORS = ['#2563eb', '#f97316', '#10b981', '#a855f7', '#ef4444', '#eab308'];

function svgWrap(width, height, inner) {
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="chart-svg">${inner}</svg>`;
}

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[c]));
}

// categories: string[]; series: {name, values:number[]}[]; unit label for y-axis
function groupedBarChart({ categories, series, unit = '%', max = 100 }) {
  const width = 640, height = 380;
  const padL = 50, padR = 20, padT = 30, padB = 60;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const groupW = chartW / categories.length;
  const barGap = 6;
  const barW = (groupW - barGap * (series.length + 1)) / series.length;

  let bars = '';
  let gridLines = '';
  let yLabels = '';
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const val = (max / steps) * i;
    const y = padT + chartH - (val / max) * chartH;
    gridLines += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`;
    yLabels += `<text x="${padL - 8}" y="${y + 4}" font-size="11" text-anchor="end" fill="#64748b">${val}</text>`;
  }

  categories.forEach((cat, ci) => {
    const groupX = padL + ci * groupW;
    series.forEach((s, si) => {
      const val = s.values[ci];
      const barH = (val / max) * chartH;
      const x = groupX + barGap + si * (barW + barGap);
      const y = padT + chartH - barH;
      bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" fill="${CHART_COLORS[si % CHART_COLORS.length]}"/>`;
    });
    const labelX = groupX + groupW / 2;
    bars += `<text x="${labelX}" y="${height - padB + 20}" font-size="12" text-anchor="middle" fill="#334155">${escapeXml(cat)}</text>`;
  });

  let legend = '';
  series.forEach((s, si) => {
    const lx = padL + si * 140;
    legend += `<rect x="${lx}" y="${height - 18}" width="12" height="12" fill="${CHART_COLORS[si % CHART_COLORS.length]}"/>`;
    legend += `<text x="${lx + 18}" y="${height - 8}" font-size="12" fill="#334155">${escapeXml(s.name)}</text>`;
  });

  const axisLabel = `<text x="${padL}" y="16" font-size="11" fill="#64748b">${escapeXml(unit)}</text>`;

  return svgWrap(width, height, gridLines + yLabels + bars + legend + axisLabel);
}

// categories: x-axis labels (years); series: {name, values:number[]}
function multiLineChart({ categories, series, unit = '', max }) {
  const width = 640, height = 380;
  const padL = 55, padR = 20, padT = 30, padB = 60;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const allVals = series.flatMap((s) => s.values);
  const dataMax = max || Math.ceil(Math.max(...allVals) * 1.15);
  const stepX = chartW / (categories.length - 1);

  let gridLines = '';
  let yLabels = '';
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const val = Math.round((dataMax / steps) * i);
    const y = padT + chartH - (val / dataMax) * chartH;
    gridLines += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`;
    yLabels += `<text x="${padL - 8}" y="${y + 4}" font-size="11" text-anchor="end" fill="#64748b">${val}</text>`;
  }

  let xLabels = '';
  categories.forEach((cat, i) => {
    const x = padL + i * stepX;
    xLabels += `<text x="${x}" y="${height - padB + 20}" font-size="12" text-anchor="middle" fill="#334155">${escapeXml(cat)}</text>`;
  });

  let lines = '';
  series.forEach((s, si) => {
    const color = CHART_COLORS[si % CHART_COLORS.length];
    const points = s.values.map((v, i) => {
      const x = padL + i * stepX;
      const y = padT + chartH - (v / dataMax) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    lines += `<polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
    points.forEach((p) => {
      const [x, y] = p.split(',');
      lines += `<circle cx="${x}" cy="${y}" r="3.5" fill="${color}"/>`;
    });
  });

  let legend = '';
  series.forEach((s, si) => {
    const lx = padL + si * 150;
    legend += `<rect x="${lx}" y="${height - 18}" width="12" height="12" fill="${CHART_COLORS[si % CHART_COLORS.length]}"/>`;
    legend += `<text x="${lx + 18}" y="${height - 8}" font-size="12" fill="#334155">${escapeXml(s.name)}</text>`;
  });

  const axisLabel = unit ? `<text x="${padL}" y="16" font-size="11" fill="#64748b">${escapeXml(unit)}</text>` : '';

  return svgWrap(width, height, gridLines + yLabels + xLabels + lines + legend + axisLabel);
}

// data: {label, value}[] (values should sum to ~100); title shown above
function pieChart({ data, title }) {
  const size = 260, cx = 130, cy = 120, r = 90;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let angle = -Math.PI / 2;
  let slices = '';
  data.forEach((d, i) => {
    const slice = (d.value / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += slice;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const largeArc = slice > Math.PI ? 1 : 0;
    slices += `<path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${largeArc} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="${CHART_COLORS[i % CHART_COLORS.length]}" stroke="#fff" stroke-width="1.5"/>`;
  });
  const titleEl = title ? `<text x="${cx}" y="18" font-size="13" text-anchor="middle" fill="#334155" font-weight="600">${escapeXml(title)}</text>` : '';
  return { size, cx, cy, svgInner: titleEl + slices };
}

function pieChartPair({ left, right }) {
  const l = pieChart(left);
  const r = pieChart(right);
  const width = 560, height = 300;
  let legend = '';
  left.data.forEach((d, i) => {
    legend += `<rect x="20" y="${250 + i * 16}" width="10" height="10" fill="${CHART_COLORS[i % CHART_COLORS.length]}"/>`;
    legend += `<text x="34" y="${259 + i * 16}" font-size="11" fill="#334155">${escapeXml(d.label)} (${d.value}%)</text>`;
  });
  const inner = `
    <g transform="translate(20,20)">${l.svgInner}</g>
    <g transform="translate(300,20)">${r.svgInner}</g>
  `;
  return svgWrap(width, 240, inner) + `<div class="pie-legend-grid">
    ${left.data.map((d, i) => `<span><i style="background:${CHART_COLORS[i % CHART_COLORS.length]}"></i>${escapeXml(d.label)}</span>`).join('')}
  </div>`;
}

// steps: string[] rendered as a left-to-right process flow with arrows
// Renders a left-to-right process flow. When there are more than 4 steps,
// it wraps into 2 rows (boustrophedon/snake layout — row 2 runs right-to-left
// so the connecting arrow between rows is a short straight drop) so each step
// stays legible instead of being squeezed into one long, shrinking row.
function processFlow(steps) {
  const boxW = 160, boxH = 76, gapX = 46, gapY = 56, padding = 16;
  const perRow = steps.length > 4 ? Math.ceil(steps.length / 2) : steps.length;
  const rowCount = Math.ceil(steps.length / perRow);

  const positions = steps.map((_, i) => {
    const rowIdx = Math.floor(i / perRow);
    const colIdx = i % perRow;
    const reversed = rowIdx % 2 === 1;
    const visualCol = reversed ? (perRow - 1 - colIdx) : colIdx;
    return {
      x: padding + visualCol * (boxW + gapX),
      y: padding + rowIdx * (boxH + gapY),
    };
  });

  const width = perRow * boxW + (perRow - 1) * gapX + padding * 2;
  const height = rowCount * boxH + (rowCount - 1) * gapY + padding * 2;

  let boxesSvg = '';
  steps.forEach((step, i) => {
    const { x, y } = positions[i];
    boxesSvg += `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>`;
    boxesSvg += `<foreignObject x="${x + 6}" y="${y + 6}" width="${boxW - 12}" height="${boxH - 12}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;font-weight:600;color:#1e3a8a;text-align:center;display:flex;align-items:center;justify-content:center;height:100%;line-height:1.25;font-family:inherit;">${escapeXml(step)}</div>
    </foreignObject>`;
  });

  let arrowsSvg = '';
  for (let i = 0; i < steps.length - 1; i += 1) {
    const a = positions[i];
    const b = positions[i + 1];
    if (a.y === b.y) {
      const goingRight = b.x > a.x;
      const x1 = goingRight ? a.x + boxW : a.x;
      const x2 = goingRight ? b.x : b.x + boxW;
      const y = a.y + boxH / 2;
      arrowsSvg += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)"/>`;
    } else {
      const x = a.x + boxW / 2;
      arrowsSvg += `<line x1="${x}" y1="${a.y + boxH}" x2="${x}" y2="${b.y}" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)"/>`;
    }
  }

  const defs = `<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#334155"/></marker></defs>`;
  return svgWrap(width, height, defs + boxesSvg + arrowsSvg);
}

function dataTable({ headers, rows }) {
  const head = `<tr>${headers.map((h) => `<th>${escapeXml(h)}</th>`).join('')}</tr>`;
  const body = rows.map((r) => `<tr>${r.map((c) => `<td>${escapeXml(c)}</td>`).join('')}</tr>`).join('');
  return `<table class="prompt-table">${head}${body}</table>`;
}
