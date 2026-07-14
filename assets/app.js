"use strict";

const DEMO_PROFILE = Object.freeze({
  scenario: "cross_sell",
  age: 37,
  dependents: 1,
  occupation: "核电设计工程师",
  income: 360000,
  expense: 18000,
  liquid: 120000,
  liabilities: 800000,
  existingCoverage: 300000,
  riskAttitude: "conservative",
  holdings: "摩根国际债券（美元）（每月派息）5万元",
  goal: "protection",
  clientVoice: "债券基金已经每月派息了，为什么还要买保险？我更关心钱能不能灵活使用。",
});

const GOAL_LABELS = Object.freeze({
  protection: "家庭保障",
  medical: "医疗保障",
  income: "稳健现金流",
  growth: "长期增长",
  retirement: "养老现金流",
});

const SCENARIO_PLAYBOOKS = Object.freeze({
  referral: {
    label: "转介绍新客",
    resistance: "客户首先在判断是否值得信任，而不是判断哪款产品最好。",
    reason: "先说明信息用途与服务边界，再验证需求，不借转介绍关系制造压力。",
    entry: "从转介绍人未涉及的客户事实开始，建立独立判断。",
    opening: "感谢您愿意聊一聊。转介绍只解决认识问题，不代表您需要购买。我们先把家庭责任、现金流和已有保障核对清楚，再判断是否值得继续。",
    questions: [
      "您希望这次沟通解决哪个具体问题，而不是先听产品？",
      "哪些个人信息可以用于本次分析，哪些暂时不希望提供？",
      "过去哪类金融销售体验让您最不舒服？",
    ],
    doNot: [
      "不要借转介绍人的信任催促决策。",
      "不要默认客户需求与转介绍人相同。",
      "未获得授权前，不调取或复述敏感信息。",
    ],
    next: "确认授权范围与首要问题，再创建正式客户画像。",
  },
  cross_sell: {
    label: "老客户 cross-sale",
    resistance: "不是缺产品，而是客户尚未接受“保障与投资承担不同任务”。",
    reason: "先澄清资金用途与流动性底线，不要立刻追加第二个收益型产品。",
    entry: "从现有持仓不能覆盖的风险责任讲起，不否定过去决策。",
    opening: "您已经用现有产品解决了一部分现金流需求。今天我们不急着加产品，先确认三件事：这笔钱要多灵活、家庭责任缺口有多大、哪些风险不能由现有持仓承担。",
    questions: [
      "这笔现有资产未来三年是否有明确用途？",
      "如果停工一年，家庭现金流由什么承担？",
      "您更不能接受持续保费支出，还是重大风险发生后被迫变现资产？",
    ],
    doNot: [
      "不要把保险包装成更高收益的替代投资。",
      "不要否定现有持仓或催促赎回。",
      "健康告知和职业类别未确认前，不给出可投保结论。",
    ],
    next: "补齐医疗保障、职业类别和家庭负债期限，再生成正式报价。",
  },
  up_sell: {
    label: "老客户 up-sale",
    resistance: "客户担心再次销售，而不是不理解保障价值。",
    reason: "必须用人生变化或真实缺口解释复核原因，不能以额度升级本身作为卖点。",
    entry: "比较原方案建立时与现在的家庭责任变化。",
    opening: "这次不是默认增加保费，而是检查原方案的假设有没有变化。若收入、负债和家庭责任没有形成新缺口，我们就不调整。",
    questions: [
      "原方案建立后，收入、负债或家庭成员发生了哪些变化？",
      "现有保障中哪部分责任与当前生活阶段不再匹配？",
      "新增预算是否会挤压应急金或其他目标？",
    ],
    doNot: [
      "不要以会员等级或额度升级诱导购买。",
      "不要主动建议退保或替换现有保单。",
      "不要忽略原保单等待期、现金价值与退保损失。",
    ],
    next: "完成现有保单审阅和新旧责任差异表，再判断是否需要增加保障。",
  },
  professional: {
    label: "专业挑战型客户",
    resistance: "客户在测试顾问是否能解释假设、成本与反例。",
    reason: "少用结论，多展示口径、证据、敏感性和不推荐理由。",
    entry: "主动给出可证伪的方案假设与同口径对比。",
    opening: "我先把模型假设、缺失数据和不推荐方案摆出来。您可以直接挑战任何一项，我们只保留能被条款、费率和客户事实支持的结论。",
    questions: [
      "您希望用哪些指标检验方案，流动性、尾部风险还是总持有成本？",
      "哪些假设最值得做压力测试？",
      "您更倾向单产品最优，还是家庭目标下的组合稳健？",
    ],
    doNot: [
      "不要用品牌或模型复杂度代替证据。",
      "不要回避费用、佣金和利益冲突。",
      "不要把历史收益当作未来预期。",
    ],
    next: "准备同口径比较、压力测试与完整证据索引，安排第二次技术复核。",
  },
  price_sensitive: {
    label: "价格敏感型客户",
    resistance: "客户担心多付钱，却未必明确自己在比较什么责任。",
    reason: "先统一保额、保障期限、免责和续保口径，再比较费用。",
    entry: "把价格比较升级为客户可理解的决策差异。",
    opening: "我们可以比较价格，但先保证比较的是同一件事：同样的责任、期限、等待期和续保条件。否则便宜可能只是少保了一部分风险。",
    questions: [
      "您希望优先降低首年支出，还是长期总成本？",
      "哪些责任是必须保留，哪些可以缩减？",
      "如果更低价格对应更严格免责或不可续保，您能否接受？",
    ],
    doNot: [
      "不要只展示最低价。",
      "不要把不同责任、金额或期限直接横向比较。",
      "不要隐去渠道报酬和退出成本。",
    ],
    next: "生成同责任、同期限、同金额的三栏比较表，并标出差异来源。",
  },
  dormant: {
    label: "沉睡客户",
    resistance: "客户没有紧迫感，也不希望被突然销售。",
    reason: "先用年度复核或人生事件恢复服务关系，不直接推产品。",
    entry: "从旧资料是否过期和目标是否变化切入。",
    opening: "这次先做一次账户与保障体检，不预设购买。我们只确认旧资料是否仍准确，以及有没有值得您注意的新缺口。",
    questions: [
      "过去一年家庭、工作或现金流发生了什么变化？",
      "现有产品里哪一项您最不清楚？",
      "您希望多久做一次复核才不会造成打扰？",
    ],
    doNot: [
      "不要用停售、限时或稀缺名额唤醒客户。",
      "不要把长期未联系解释为客户默认同意营销。",
      "不要在资料过期时生成正式建议。",
    ],
    next: "更新授权与基础资料，仅对确认存在的变化创建后续任务。",
  },
  complaint: {
    label: "投诉风险客户",
    resistance: "客户首先需要被听见和获得事实澄清，不适合继续销售。",
    reason: "暂停推荐，分离事实、情绪、责任与补救路径，并转入服务复核。",
    entry: "先复述问题与期望结果，不争辩、不推新产品。",
    opening: "我先完整记录您认为不一致的地方和希望解决的结果。今天不讨论新增产品，我们先把事实、文件和处理责任核对清楚。",
    questions: [
      "哪一次沟通或哪份文件与您的理解不一致？",
      "目前最希望先解决的是解释、服务还是经济损失？",
      "哪些证据或记录可以帮助我们还原过程？",
    ],
    doNot: [
      "不要争辩客户是否理解错误。",
      "不要以优惠、赠品或新产品替代投诉处理。",
      "不要删除、修改或选择性记录历史沟通。",
    ],
    next: "冻结销售动作，创建投诉复核任务并保全全部证据。",
  },
});

const REDLINE_PATTERNS = Object.freeze([
  { code: "GUARANTEED_RETURN", pattern: /保证收益|承诺回报|稳赚/ },
  { code: "ABSOLUTE_SAFETY", pattern: /绝对安全|零风险|无风险/ },
  { code: "FORCED_REPLACEMENT", pattern: /退掉.*保单|取消.*保单|换掉.*保单/ },
  { code: "SCARCITY_PRESSURE", pattern: /最后一批|内部名额|马上停售|仅限今天/ },
  { code: "REBATE_OR_GIFT", pattern: /返佣|回扣|送礼|赠送.*权益/ },
]);

const RISK_META = Object.freeze([
  { key: "death", name: "身故责任", note: "家庭责任与负债" },
  { key: "medical", name: "医疗费用", note: "责任范围待核实" },
  { key: "critical", name: "重疾收入替代", note: "停工现金流" },
  { key: "accident", name: "意外伤残", note: "长期收入损失" },
  { key: "retirement", name: "养老现金流", note: "长期目标建模" },
]);

const CAPABILITY_CATALOG = Object.freeze([
  {
    id: "client_canvas",
    name: "客户画布",
    input: "客户档案",
    output: "事实 / 假设 / 资料缺口",
    status: "completed",
    coverage: [78, 15, 0, 0, 0, 0],
  },
  {
    id: "pre_meeting_brief",
    name: "会前作战卡",
    input: "客户档案 + 客户原话",
    output: "阻力 / 三问 / 禁用动作",
    status: "completed",
    coverage: [70, 72, 0, 0, 0, 35],
  },
  {
    id: "risk_gap",
    name: "家庭风险缺口",
    input: "家庭财务与保障资料",
    output: "五类风险缺口",
    status: "review_required",
    coverage: [70, 0, 82, 0, 45, 0],
  },
  {
    id: "wealth_canvas",
    name: "财富画布",
    input: "客户档案",
    output: "五支柱与再平衡提示",
    status: "review_required",
    coverage: [72, 0, 55, 0, 50, 25],
  },
  {
    id: "product_matching",
    name: "产品匹配",
    input: "客户档案 + 版本化产品库",
    output: "可售 / 复核 / 禁止候选",
    status: "review_required",
    coverage: [76, 0, 72, 82, 62, 72],
  },
  {
    id: "product_comparison",
    name: "产品对比",
    input: "至少两个产品",
    output: "同口径差异与 Why Not",
    status: "review_required",
    coverage: [0, 0, 0, 82, 55, 20],
  },
  {
    id: "evidence_judge",
    name: "证据裁判",
    input: "任意分析产物或证据集合",
    output: "覆盖 / 缺失 / 裁判结论",
    status: "review_required",
    coverage: [0, 0, 0, 0, 95, 0],
  },
  {
    id: "compliance_preflight",
    name: "合规预检",
    input: "目标产物或客户话术",
    output: "PASS / REVIEW / BLOCK",
    status: "review_required",
    coverage: [0, 0, 0, 0, 0, 90],
  },
  {
    id: "comparison_report",
    name: "可信对比报告",
    input: "对比 + 证据 + 合规",
    output: "不可直接交付的审计报告",
    status: "review_required",
    coverage: [0, 0, 0, 88, 90, 90],
  },
  {
    id: "advisor_work_card",
    name: "顾问行动卡",
    input: "任意现有客户产物",
    output: "下一步与沟通边界",
    status: "review_required",
    coverage: [55, 50, 0, 0, 0, 45],
  },
  {
    id: "insight",
    name: "Insight",
    input: "已验证的 7 日内权威来源",
    output: "创作 / 反驳 / 二次创作",
    status: "partial",
    coverage: [0, 0, 0, 0, 85, 55],
  },
  {
    id: "full_recommendation",
    name: "完整推荐",
    input: "正式推荐输入",
    output: "RecommendationReport",
    status: "review_required",
    coverage: [90, 45, 90, 90, 92, 95],
  },
]);

const COMPOSITION_EDGES = Object.freeze([
  ["client_canvas", "pre_meeting_brief"],
  ["pre_meeting_brief", "advisor_work_card"],
  ["risk_gap", "wealth_canvas"],
  ["risk_gap", "product_matching"],
  ["wealth_canvas", "product_matching"],
  ["product_matching", "product_comparison"],
  ["product_comparison", "evidence_judge"],
  ["evidence_judge", "compliance_preflight"],
  ["product_comparison", "comparison_report"],
  ["evidence_judge", "comparison_report"],
  ["compliance_preflight", "comparison_report"],
]);

const MODE_SELECTIONS = Object.freeze({
  meeting: ["client_canvas", "pre_meeting_brief", "advisor_work_card"],
  canvas: ["client_canvas"],
  risk: ["risk_gap"],
  comparison: ["product_comparison", "evidence_judge", "compliance_preflight", "comparison_report"],
  full: ["full_recommendation"],
});

const TASK_PRESENTATION = Object.freeze({
  meeting: { action: "生成会前作战卡", tab: "brief" },
  canvas: { action: "生成客户画布", tab: "brief" },
  risk: { action: "生成家庭风险缺口", tab: "solution" },
  comparison: { action: "生成可信产品对比", tab: "evidence" },
  full: { action: "生成完整受控方案", tab: "solution" },
  custom: { action: "生成自定义结果", tab: "brief" },
});

const COVERAGE_LABELS = Object.freeze(["客户画像", "关系信息", "风险缺口", "产品真实性", "证据", "合规"]);

let activeCapabilityMode = "meeting";
let selectedCapabilities = new Set(MODE_SELECTIONS.meeting);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function numberValue(selector) {
  const value = Number($(selector).value);
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function clamp(value, minimum = 0, maximum = 100) {
  return Math.min(Math.max(value, minimum), maximum);
}

function levelClass(value) {
  const rounded = Math.max(10, Math.min(100, Math.ceil(value / 10) * 10));
  return `level-${rounded}`;
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return "待核实";
  if (value >= 100000000) return `¥ ${(value / 100000000).toFixed(1)}亿`;
  if (value >= 10000) return `¥ ${Math.round(value / 10000)}万`;
  return `¥ ${Math.round(value).toLocaleString("zh-CN")}`;
}

function readProfile() {
  return {
    scenario: $("#scenario").value,
    age: numberValue("#age"),
    dependents: numberValue("#dependents"),
    occupation: $("#occupation").value.trim(),
    income: numberValue("#income"),
    expense: numberValue("#expense"),
    liquid: numberValue("#liquid"),
    liabilities: numberValue("#liabilities"),
    existingCoverage: numberValue("#existing-coverage"),
    riskAttitude: $("#risk-attitude").value,
    holdings: $("#holdings").value.trim(),
    goal: $("#goal").value,
    clientVoice: $("#client-voice").value.trim(),
  };
}

function assessProfile(profile) {
  const reserveTarget = profile.expense * 6;
  const reserveGap = Math.max(reserveTarget - profile.liquid, 0);
  const responsibilityYears = profile.dependents >= 2 ? 7 : profile.dependents === 1 ? 5 : 3;
  const deathTarget = profile.income * responsibilityYears + profile.liabilities;
  const deathGap = Math.max(deathTarget - profile.existingCoverage, 0);
  const criticalTarget = profile.income * (profile.dependents > 0 ? 2 : 1.5);
  const accidentTarget = profile.income * (profile.dependents > 0 ? 5 : 3);
  const retirementSignal = clamp((profile.age - 25) * 2.2 + (profile.goal === "retirement" ? 35 : 0), 20, 92);
  const cashPressure = reserveTarget > 0 ? clamp((reserveGap / reserveTarget) * 100) : 0;

  const risks = {
    death: {
      level: deathTarget > 0 ? clamp((deathGap / deathTarget) * 100, 15, 100) : 40,
      value: formatMoney(deathGap),
      qualifier: "初步缺口",
    },
    medical: {
      level: profile.goal === "medical" ? 92 : 76,
      value: "待核保",
      qualifier: "责任与续保",
    },
    critical: {
      level: clamp(58 + profile.dependents * 8 + cashPressure * 0.18, 40, 95),
      value: formatMoney(criticalTarget),
      qualifier: "初步目标",
    },
    accident: {
      level: /核电|工程|施工|制造|运输/.test(profile.occupation) ? 82 : 62,
      value: formatMoney(accidentTarget),
      qualifier: "初步目标",
    },
    retirement: {
      level: retirementSignal,
      value: "待建模",
      qualifier: "目标与现金流",
    },
  };

  const hardBlock = profile.age < 18 || profile.age > 75 || profile.income <= 0 || !profile.occupation;
  const dataWarnings = [];
  if (reserveGap > 0) dataWarnings.push("应急金不足");
  if (profile.expense * 12 >= profile.income) dataWarnings.push("年度现金流承压");
  if (!profile.holdings) dataWarnings.push("既有持仓缺失");
  if (profile.existingCoverage <= 0) dataWarnings.push("既有保额待核实");

  return {
    reserveTarget,
    reserveGap,
    deathGap,
    criticalTarget,
    accidentTarget,
    risks,
    state: hardBlock ? "block" : "review",
    dataWarnings,
  };
}

function renderList(selector, items) {
  const container = $(selector);
  container.replaceChildren(
    ...items.map((item) => {
      const node = document.createElement("li");
      node.textContent = item;
      return node;
    }),
  );
}

function renderPlaybook(profile, assessment) {
  const playbook = SCENARIO_PLAYBOOKS[profile.scenario] || SCENARIO_PLAYBOOKS.cross_sell;
  $("#resistance").textContent = playbook.resistance;
  $("#resistance-reason").textContent = playbook.reason;
  $("#entry-point").textContent = playbook.entry;
  $("#opening-script").textContent = `“${playbook.opening}”`;
  $("#next-action").textContent = playbook.next;
  renderList("#question-list", playbook.questions);
  renderList("#do-not-list", playbook.doNot);

  $("#primary-insight-label").textContent = "先判断这件事";
  $("#entry-point-label").textContent = "推荐切入点";
  $("#conversation-label").textContent = "建议开场";
  $("#questions-label").textContent = "只问这三个问题";
  $("#caution-label").textContent = "本次不要做";
  $("#next-action-label").textContent = "下一步只做一件事";
  $("#copy-brief").textContent = "复制会前提纲";

  if (activeCapabilityMode === "canvas") {
    const holding = profile.holdings || "既有产品待补充";
    $("#primary-insight-label").textContent = "客户画布 · 已知事实";
    $("#resistance").textContent = `${profile.age || "年龄待补"}岁，${profile.occupation || "职业待补"}，当前持有${holding}。`;
    $("#resistance-reason").textContent = "这些是客户已提供的事实，不等于购买意愿，也不能直接推导产品结论。";
    $("#entry-point-label").textContent = "当前资料缺口";
    $("#entry-point").textContent = "家庭共同决策人、已有保单责任、健康告知、资金用途与可接受预算仍需确认。";
    $("#conversation-label").textContent = "客户画布摘要";
    $("#opening-script").textContent = `客户当前目标是${GOAL_LABELS[profile.goal] || "方案复核"}；最明确的关注点是“${profile.clientVoice || "客户原话待补"}”。`;
    $("#questions-label").textContent = "待验证的三个假设";
    renderList("#question-list", [
      "客户更重视流动性，而不是单纯追求更高收益。",
      "现有持仓承担投资目标，但家庭保障责任可能仍有缺口。",
      "配偶或其他家庭成员可能参与最终决策。",
    ]);
    $("#caution-label").textContent = "禁止直接推断";
    renderList("#do-not-list", [
      "不要把客户原话自动解释为购买意愿。",
      "不要用职业或年龄标签替代真实需求访谈。",
      "不要在授权与资料未齐时形成可销售结论。",
    ]);
    $("#next-action-label").textContent = "建议补充资料";
    $("#next-action").textContent = "确认家庭决策人、既有保障责任和这笔资金未来三年的明确用途。";
    $("#copy-brief").textContent = "复制客户画布";
  }

  const goalLabel = GOAL_LABELS[profile.goal] || "方案复核";
  $("#case-title").textContent = `${profile.age || "?"}岁 ${profile.occupation || "职业待补"} · ${goalLabel}`;

  const guardrail = $("#guardrail-summary");
  guardrail.dataset.state = assessment.state;
  $("#guardrail-state").textContent = assessment.state.toUpperCase();
  $("#evidence-guardrail-title").textContent =
    assessment.state === "block"
      ? "输入未满足基本边界，禁止继续"
      : "允许进入人工复核，不允许直接交付";
  $("#evidence-guardrail-copy").textContent =
    assessment.state === "block"
      ? "请修复年龄、职业或收入输入后重新生成 · 当前 case 保持原状态"
      : "规则版本 sales-manual-2026-06 · 产品库版本 sample-catalog-v1";
}

function renderRisks(assessment) {
  const rows = RISK_META.map((meta) => {
    const risk = assessment.risks[meta.key];
    const row = document.createElement("article");
    row.className = "risk-row";

    const name = document.createElement("div");
    name.className = "risk-name";
    const title = document.createElement("strong");
    title.textContent = meta.name;
    const note = document.createElement("span");
    note.textContent = meta.note;
    name.append(title, note);

    const track = document.createElement("div");
    track.className = "risk-track";
    track.setAttribute("aria-label", `${meta.name}优先级 ${Math.round(risk.level)}%`);
    const fill = document.createElement("span");
    fill.className = levelClass(risk.level);
    track.append(fill);

    const value = document.createElement("div");
    value.className = "risk-value";
    const amount = document.createElement("strong");
    amount.textContent = risk.value;
    const qualifier = document.createElement("small");
    qualifier.textContent = risk.qualifier;
    value.append(amount, qualifier);

    row.append(name, track, value);
    return row;
  });
  $("#risk-list").replaceChildren(...rows);
}

function solutionCopy(profile, assessment) {
  if (assessment.reserveGap > 0) {
    return {
      mainTitle: "现金底线 + 基础保障",
      mainCopy: `先补足约 ${formatMoney(assessment.reserveGap)} 应急金缺口，再用可负担预算覆盖医疗和家庭责任。`,
      mainPoints: ["不动用短期应急资金缴纳长期保费", "医疗、定寿和意外责任分别核实", "正式保额与保费必须命中费率表"],
      alternativeTitle: "医疗 + 意外聚焦",
      alternativeCopy: "若预算有限，先保留高频医疗费用和高损失意外伤残责任。",
    };
  }
  if (profile.goal === "retirement") {
    return {
      mainTitle: "退休现金流底盘",
      mainCopy: "在保障与应急金稳定后，再比较年金、养老产品与基金资产桶的互补作用。",
      mainPoints: ["区分保证与非保证利益", "明确领取期和长期锁定", "不把保险保额计入投资组合权重"],
      alternativeTitle: "分阶段养老资产桶",
      alternativeCopy: "先用流动资产与低波动工具建立近端现金流，再评估长期锁定产品。",
    };
  }
  return {
    mainTitle: "基础保障组合",
    mainCopy: "优先覆盖医疗费用、家庭负债和收入中断，再讨论长期储蓄或增长产品。",
    mainPoints: ["定期寿险覆盖责任期而非追求储蓄", "医疗险重点核对等待期、免责和续保", "意外与重疾按职业和停工损失测算"],
    alternativeTitle: "预算聚焦组合",
    alternativeCopy: "降低首年预算，先保留最难由家庭资产自行承担的风险责任。",
  };
}

function renderSolutions(profile, assessment) {
  const copy = solutionCopy(profile, assessment);
  $("#main-solution-title").textContent = copy.mainTitle;
  $("#main-solution-copy").textContent = copy.mainCopy;
  renderList("#main-solution-points", copy.mainPoints);
  $("#alternative-title").textContent = copy.alternativeTitle;
  $("#alternative-copy").textContent = copy.alternativeCopy;

  if (profile.goal === "growth") {
    $("#explore-title").textContent = "先解释尾部风险缺口";
    $("#explore-copy").textContent = "探索不是追加新品，而是让客户理解增长资产无法替代医疗与收入保障。";
  } else if (profile.goal === "medical") {
    $("#explore-title").textContent = "重疾停工现金流";
    $("#explore-copy").textContent = "客户关注医疗费用时，也要核实治疗期间收入中断是否有承接。";
  } else {
    $("#explore-title").textContent = "重疾收入替代";
    $("#explore-copy").textContent = "客户未主动提出，但停工风险对应真实现金流缺口。";
  }

  const hasIncomeHolding = /债券|派息|基金|理财|存款/.test(profile.holdings);
  $("#blocked-title").textContent = hasIncomeHolding ? "把派息产品当作保障替代" : "以收益为卖点推动成交";
  $("#blocked-copy").textContent = hasIncomeHolding
    ? "现有持仓可以承担部分投资或现金流目标，但不能替代医疗、身故和失能责任。不得借保障复核推动赎回。"
    : "在应急金、KYC 与保障责任未核实前，不得用派息、预期回报或稀缺性推动成交。";
}

function updateCase() {
  const profile = readProfile();
  const assessment = assessProfile(profile);
  renderPlaybook(profile, assessment);
  renderRisks(assessment);
  renderSolutions(profile, assessment);
  $("#copy-status").textContent = "";
  return { profile, assessment };
}

function activateTab(tabName, focus = false) {
  $$("[data-tab]").forEach((tab) => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  $$("[data-panel]").forEach((panel) => {
    const active = panel.dataset.panel === tabName;
    panel.classList.toggle("is-active", active);
    panel.setAttribute("aria-hidden", String(!active));
    panel.hidden = !active;
  });
}

function resetDemo() {
  Object.entries(DEMO_PROFILE).forEach(([key, value]) => {
    const field = document.querySelector(`[name="${key}"]`);
    if (field) field.value = String(value);
  });
  updateCase();
  activateTab((TASK_PRESENTATION[activeCapabilityMode] || TASK_PRESENTATION.custom).tab);
}

function briefText() {
  const questions = $$("#question-list li").map((item, index) => `${index + 1}. ${item.textContent}`).join("\n");
  const doNot = $$("#do-not-list li").map((item) => `- ${item.textContent}`).join("\n");
  return [
    `【${$("#conversation-label").textContent}】`,
    $("#opening-script").textContent,
    "",
    `【${$("#questions-label").textContent}】`,
    questions,
    "",
    `【${$("#caution-label").textContent}】`,
    doNot,
    "",
    `【${$("#next-action-label").textContent}】`,
    $("#next-action").textContent,
  ].join("\n");
}

async function copyBrief() {
  const value = briefText();
  try {
    if (!navigator.clipboard) throw new Error("clipboard_unavailable");
    await navigator.clipboard.writeText(value);
    $("#copy-status").textContent = "已复制，发送前仍需话术预检";
  } catch (error) {
    const fallback = document.createElement("textarea");
    fallback.value = value;
    fallback.setAttribute("readonly", "");
    fallback.className = "sr-only";
    document.body.append(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();
    $("#copy-status").textContent = "已复制，发送前仍需话术预检";
  }
}

function checkMessage() {
  const text = $("#message-draft").value.trim();
  const result = $("#preflight-result");
  const matches = REDLINE_PATTERNS.filter((item) => item.pattern.test(text));
  const guardrail = $("#guardrail-summary");

  if (!text) {
    result.dataset.state = "block";
    result.textContent = "BLOCK · 话术不能为空";
    return;
  }
  if (matches.length > 0) {
    result.dataset.state = "block";
    result.textContent = `BLOCK · ${matches.map((item) => item.code).join(", ")}`;
    guardrail.dataset.state = "block";
    $("#guardrail-state").textContent = "BLOCK";
    return;
  }
  result.dataset.state = "pass";
  result.textContent = "REVIEW · 本地红线未命中，仍需后端与人工复核";
  const assessment = assessProfile(readProfile());
  guardrail.dataset.state = assessment.state;
  $("#guardrail-state").textContent = assessment.state.toUpperCase();
}

function selectedPlan() {
  const selected = Array.from(selectedCapabilities).sort();
  const edges = COMPOSITION_EDGES.filter(
    ([source, target]) => selectedCapabilities.has(source) && selectedCapabilities.has(target),
  );
  const incoming = Object.fromEntries(selected.map((id) => [id, 0]));
  const outgoing = Object.fromEntries(selected.map((id) => [id, []]));
  edges.forEach(([source, target]) => {
    incoming[target] += 1;
    outgoing[source].push(target);
  });
  const ready = selected.filter((id) => incoming[id] === 0).sort();
  const ordered = [];
  while (ready.length > 0) {
    const id = ready.shift();
    ordered.push(id);
    outgoing[id].sort().forEach((target) => {
      incoming[target] -= 1;
      if (incoming[target] === 0) {
        ready.push(target);
        ready.sort();
      }
    });
  }
  return { ordered, edges };
}

function capabilityById(id) {
  return CAPABILITY_CATALOG.find((item) => item.id === id);
}

function capabilityMissingInputs(id) {
  const missing = [];
  if (id === "product_comparison" && !selectedCapabilities.has("product_matching")) {
    missing.push("需要至少两个产品或产品匹配产物");
  }
  if (id === "evidence_judge") {
    const upstream = ["risk_gap", "wealth_canvas", "product_matching", "product_comparison", "full_recommendation"];
    if (!upstream.some((item) => selectedCapabilities.has(item))) missing.push("需要任意分析产物或证据集合");
  }
  if (id === "comparison_report") {
    ["product_comparison", "evidence_judge", "compliance_preflight"].forEach((dependency) => {
      if (!selectedCapabilities.has(dependency)) missing.push(`缺少 ${capabilityById(dependency).name}`);
    });
  }
  if (id === "advisor_work_card" && selectedCapabilities.size === 1) missing.push("需要至少一个已有客户产物");
  if (id === "insight") missing.push("缺少最近 7 日内已验证权威来源");
  return missing;
}

function planHash(plan) {
  const text = `${plan.ordered.join("|")}:${plan.edges.map((edge) => edge.join(">")).join("|")}`;
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0).toString(16).toUpperCase().slice(0, 8).padStart(8, "0");
}

function renderModuleCards() {
  const cards = CAPABILITY_CATALOG.map((capability) => {
    const label = document.createElement("label");
    label.className = "module-card";
    if (selectedCapabilities.has(capability.id)) label.classList.add("is-selected");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = capability.id;
    input.checked = selectedCapabilities.has(capability.id);
    input.setAttribute("aria-label", `选择${capability.name}`);
    input.addEventListener("change", () => {
      if (input.checked) selectedCapabilities.add(capability.id);
      else selectedCapabilities.delete(capability.id);
      if (selectedCapabilities.size === 0) selectedCapabilities.add("client_canvas");
      activeCapabilityMode = "custom";
      renderCapabilityStudio();
    });

    const check = document.createElement("span");
    check.className = "module-check";
    check.textContent = selectedCapabilities.has(capability.id) ? "✓" : "+";

    const content = document.createElement("span");
    content.className = "module-content";
    const title = document.createElement("strong");
    title.textContent = capability.name;
    const minimum = document.createElement("small");
    minimum.textContent = `最小输入 · ${capability.input}`;
    const output = document.createElement("em");
    output.textContent = capability.output;
    content.append(title, minimum, output);
    label.append(input, check, content);
    return label;
  });
  $("#module-cards").replaceChildren(...cards);
  $("#selected-count").textContent = `已选 ${selectedCapabilities.size} / ${CAPABILITY_CATALOG.length}`;
}

function renderDag() {
  const plan = selectedPlan();
  const nodes = [];
  plan.ordered.forEach((id, index) => {
    const capability = capabilityById(id);
    const node = document.createElement("article");
    node.className = "dag-node";
    const order = document.createElement("span");
    order.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = capability.name;
    const schema = document.createElement("small");
    schema.textContent = `${capability.id}.v1`;
    copy.append(title, schema);
    node.append(order, copy);
    nodes.push(node);
    if (index < plan.ordered.length - 1) {
      const arrow = document.createElement("i");
      arrow.className = "dag-arrow";
      arrow.textContent = "↓";
      nodes.push(arrow);
    }
  });
  $("#dag-preview").replaceChildren(...nodes);
  $("#plan-fingerprint").textContent = `PLAN · ${planHash(plan)}`;

  const missing = plan.ordered.flatMap((id) => capabilityMissingInputs(id));
  const box = $("#missing-inputs");
  box.classList.toggle("has-missing", missing.length > 0);
  box.querySelector("strong").textContent = missing.length > 0 ? `${missing.length} 项` : "无";
  box.querySelector("p").textContent =
    missing.length > 0 ? missing.join("；") : "系统不会暗中运行未选择的模块。";
  $("#run-composition").textContent = missing.length > 0 ? "保留组合并提示补资料" : "应用这个组合";
}

function renderCoverage() {
  const selected = Array.from(selectedCapabilities).map(capabilityById);
  const values = COVERAGE_LABELS.map((_, index) => Math.max(0, ...selected.map((item) => item.coverage[index])));
  const items = COVERAGE_LABELS.map((label, index) => {
    const item = document.createElement("article");
    const heading = document.createElement("div");
    const name = document.createElement("span");
    name.textContent = label;
    const value = document.createElement("strong");
    value.textContent = `${values[index]}%`;
    heading.append(name, value);
    const track = document.createElement("div");
    track.className = "coverage-track";
    const fill = document.createElement("i");
    fill.style.width = `${values[index]}%`;
    track.append(fill);
    item.append(heading, track);
    return item;
  });
  $("#coverage-grid").replaceChildren(...items);

  const priority = ["risk_gap", "client_canvas", "pre_meeting_brief", "product_matching", "evidence_judge", "compliance_preflight"];
  const next = priority.find((id) => !selectedCapabilities.has(id));
  $("#next-module strong").textContent = next ? capabilityById(next).name : "暂无自动建议";
  $("#next-module p").textContent = next
    ? "建议只做提示，不会自动启用。"
    : "当前覆盖已较完整，仍不代表可以绕过人工复核。";
}

function renderArtifactStack() {
  const plan = selectedPlan();
  const artifacts = plan.ordered.map((id, index) => {
    const capability = capabilityById(id);
    const missing = capabilityMissingInputs(id);
    const article = document.createElement("article");
    article.className = "artifact-card";
    const meta = document.createElement("div");
    meta.className = "artifact-meta";
    const schema = document.createElement("span");
    schema.textContent = `${capability.id}.v1`;
    const status = document.createElement("em");
    const resolvedStatus = missing.length > 0 ? "partial" : capability.status;
    status.dataset.state = resolvedStatus;
    status.textContent = resolvedStatus.toUpperCase();
    meta.append(schema, status);
    const title = document.createElement("strong");
    title.textContent = capability.name;
    const description = document.createElement("p");
    description.textContent = missing.length > 0 ? missing.join("；") : capability.output;
    const lineage = document.createElement("small");
    lineage.textContent = `ART-DEMO-${String(index + 1).padStart(3, "0")} · 输入指纹已脱敏 · 不可直接交付`;
    article.append(meta, title, description, lineage);
    return article;
  });
  $("#artifact-stack").replaceChildren(...artifacts);
  const hasMissing = plan.ordered.some((id) => capabilityMissingInputs(id).length > 0);
  $("#artifact-status").textContent = hasMissing ? "PARTIAL · 待补资料" : `${artifacts.length} 个版本化产物`;
}

function renderCapabilityStudio() {
  $$('[data-mode]').forEach((button) => {
    const active = button.dataset.mode === activeCapabilityMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  renderModuleCards();
  renderDag();
  renderCoverage();
  $("#action-button-label").textContent =
    (TASK_PRESENTATION[activeCapabilityMode] || TASK_PRESENTATION.custom).action;
}

function resetArtifactStack() {
  const placeholder = document.createElement("article");
  placeholder.className = "artifact-placeholder";
  const title = document.createElement("strong");
  title.textContent = "尚未生成演示产物";
  const copy = document.createElement("p");
  copy.textContent = "提交客户资料后，这里会显示模块产物与输入 lineage。任何产物都不能直接交付。";
  placeholder.append(title, copy);
  $("#artifact-stack").replaceChildren(placeholder);
  $("#artifact-status").textContent = "等待生成";
}

function bindCapabilityStudio() {
  $$('[data-mode]').forEach((button) => {
    button.addEventListener("click", () => {
      activeCapabilityMode = button.dataset.mode;
      selectedCapabilities = new Set(MODE_SELECTIONS[activeCapabilityMode]);
      renderCapabilityStudio();
      resetArtifactStack();
      updateCase();
      activateTab(TASK_PRESENTATION[activeCapabilityMode].tab);
    });
  });
  $("#run-composition").addEventListener("click", renderArtifactStack);
}

function bindEvents() {
  $("#client-form").addEventListener("submit", (event) => {
    event.preventDefault();
    updateCase();
    renderArtifactStack();
    activateTab((TASK_PRESENTATION[activeCapabilityMode] || TASK_PRESENTATION.custom).tab);
  });
  $("#reset-demo").addEventListener("click", resetDemo);
  $("#copy-brief").addEventListener("click", copyBrief);
  $("#check-message").addEventListener("click", checkMessage);

  $$("[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const tabs = $$("[data-tab]");
      const currentIndex = tabs.indexOf(event.currentTarget);
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(currentIndex + offset + tabs.length) % tabs.length];
      activateTab(next.dataset.tab, true);
    });
  });
}

bindEvents();
bindCapabilityStudio();
renderCapabilityStudio();
activateTab("brief");
updateCase();
